import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { prisma } from "@/server/db/prisma";
import { decrypt } from "@/server/crypto/encryption";
import { generateRunwareImage } from "@/server/providers/runware";
import { storage } from "@/server/storage/storage";
import { OVERLAY_PRESETS, OverlayConfig, PresetName, distributePinModes, EIGHTEEN_PRESETS_CYCLE } from "@/server/engine/overlay";
import { compositeOverlayOnImage } from "@/server/engine/composer";
import { generatePinterestSeo, generateOverlayHook, generateFullNicheOverlayContent } from "@/server/engine/seo";
import { formatPaletteForPrompt } from "@/server/engine/brandKit";
import { getDimensionsForAspect } from "@/server/engine/aspectRatio";
import { enhancePrompt } from "@/server/engine/promptEnhancer";
import { applyNicheStrategyToPrompt } from "@/server/engine/nicheStrategies";

const BulkGenerateRequestSchema = z.object({
  prompts: z.array(z.string().trim().min(1)).min(1, "At least one prompt is required"),
  modelId: z.string().nullish().transform((v) => v || "flux-schnell"),
  aspectRatio: z.enum(["2:3", "9:16", "1:1", "4:5", "16:9"]).nullish().transform((v) => v || "2:3"),
  pinTypeId: z.string().nullish().transform((v) => v || "inspiration"),
  style: z.string().nullish().transform((v) => v || "Editorial"),
  textMode: z.enum(["canvas", "in_image", "none"]).nullish().transform((v) => v || "canvas"),
  overlayPreset: z.string().nullish().transform((v) => v || "elegant_serif"),
  brandKitId: z.string().nullish().transform((v) => v || undefined),
  brandKitEnabled: z.boolean().nullish().transform((v) => v ?? true),
  autoEnhance: z.boolean().nullish().transform((v) => v ?? false),
  cyclePresets: z.boolean().nullish().transform((v) => v ?? true),
  ratios: z
    .object({
      overlay: z.number().optional(),
      in_image: z.number().optional(),
      none: z.number().optional(),
    })
    .optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = BulkGenerateRequestSchema.safeParse(body);

    if (!parsed.success) {
      const reason = parsed.error.issues.map((i) => `${i.path.join(".") || "request"}: ${i.message}`).join("; ");
      return NextResponse.json({ success: false, error: `Invalid input - ${reason}` }, { status: 400 });
    }

    const {
      prompts,
      modelId,
      aspectRatio,
      pinTypeId,
      style,
      textMode,
      overlayPreset,
      brandKitId,
      brandKitEnabled,
      autoEnhance,
      cyclePresets,
      ratios,
    } = parsed.data;

    const { width: targetWidth, height: targetHeight, aspect: selectedAspect } = getDimensionsForAspect(aspectRatio);

    // 0. Resolve Brand Kit
    let brandKit: any = null;
    if (brandKitId && brandKitEnabled) {
      brandKit = await prisma.brandKit.findUnique({ where: { id: brandKitId } });
    }

    // 1. Resolve registered model from DB
    let model = await prisma.modelRegistry.findUnique({ where: { id: modelId } });
    if (!model) {
      model = await prisma.modelRegistry.findFirst();
    }
    if (!model) {
      return NextResponse.json(
        { success: false, error: `No active models found in the Model Registry.` },
        { status: 400 }
      );
    }

    // 2. Resolve PinType
    let pinTypeName = "Inspiration / Aesthetic";
    if (pinTypeId) {
      const pt = await prisma.pinType.findUnique({ where: { id: pinTypeId } });
      if (pt) pinTypeName = pt.name;
    }

    // 3. Resolve Keys from Settings
    const settings = await prisma.settings.findUnique({ where: { id: "default" } });
    let runwareApiKey = "";
    let openrouterApiKey = "";

    if (settings?.runwareKeyEnc) {
      try {
        runwareApiKey = decrypt(settings.runwareKeyEnc);
      } catch {}
    } else if (process.env.RUNWARE_API_KEY) {
      runwareApiKey = process.env.RUNWARE_API_KEY;
    }

    if (settings?.openrouterKeyEnc) {
      try {
        openrouterApiKey = decrypt(settings.openrouterKeyEnc);
      } catch {}
    } else if (process.env.OPENROUTER_API_KEY) {
      openrouterApiKey = process.env.OPENROUTER_API_KEY;
    }

    if (!runwareApiKey && process.env.PROVIDER_MODE !== "mock") {
      return NextResponse.json(
        { success: false, error: "No Runware API key configured. Please configure your API key in Settings." },
        { status: 400 }
      );
    }

    if (!runwareApiKey && process.env.PROVIDER_MODE === "mock") {
      runwareApiKey = "mock_runware_auto_test_key";
    }

    // 4. Create parent Job
    const estimatedCost = model.pricePerImage * prompts.length;
    const job = await prisma.job.create({
      data: {
        mode: "bulk",
        inputLines: JSON.stringify(prompts),
        settingsSnapshot: JSON.stringify({
          modelId: model.id,
          modelLabel: model.label,
          runwareModelId: model.runwareModelId,
          tier: model.tier,
          style,
          pinTypeName,
          textMode,
          overlayPreset,
          aspect: selectedAspect,
          brandKit: brandKit ? { id: brandKit.id, kitName: brandKit.kitName } : null,
        }),
        status: "RUNNING",
        totalItems: prompts.length,
        estimatedCost,
      },
    });

    const generatedPins: any[] = [];
    let totalActualCost = 0;

    // Distribute pin modes across prompts according to user ratios
    const distributedModes = distributePinModes(prompts.length, ratios);
    let overlayPresetCycleIdx = 0;

    // Process prompts sequentially for clean concurrency
    for (let i = 0; i < prompts.length; i++) {
      const rawLine = prompts[i].trim();
      let currentPrompt = rawLine;
      let lineCustomOverlay: string | undefined = undefined;

      if (rawLine.includes("|")) {
        const parts = rawLine.split("|");
        currentPrompt = parts[0].trim();
        lineCustomOverlay = parts.slice(1).join("|").trim();
      }

      // Palette and vibe prompt injection
      if (brandKit) {
        const paletteAddon = brandKit.palette ? formatPaletteForPrompt(brandKit.palette) : "";
        const vibeAddon = brandKit.styleVibe ? `styled in ${brandKit.styleVibe} aesthetic` : "";
        const promptAddons = [paletteAddon, vibeAddon].filter(Boolean).join(", ");
        if (promptAddons) currentPrompt = `${currentPrompt}, ${promptAddons}`;
      }

      // Standalone Niche Strategy Engine application with per-pin background rotation
      const nicheResult = applyNicheStrategyToPrompt(currentPrompt, {
        niche: pinTypeName,
        style,
        variationIndex: i, // Guarantees distinct environment & background for every line in bulk
      });

      // Auto-enhance if enabled
      let finalPromptForImage = nicheResult.enhancedPrompt;
      if (autoEnhance) {
        try {
          const enhanced = await enhancePrompt({ prompt: currentPrompt, style, pinType: pinTypeName });
          if (enhanced.enhancedPrompt) finalPromptForImage = enhanced.enhancedPrompt;
        } catch {}
      }

      // Determine text mode for this specific pin from distribution or direct textMode
      const itemTextMode = ratios ? distributedModes[i] : (textMode || distributedModes[i] || "canvas");

      // Determine preset for this line (rotating across the 18 distinct presets or using user-selected preset)
      let presetKey: PresetName;
      if (cyclePresets) {
        presetKey = EIGHTEEN_PRESETS_CYCLE[overlayPresetCycleIdx % EIGHTEEN_PRESETS_CYCLE.length];
        if (itemTextMode === "canvas") {
          overlayPresetCycleIdx++;
        }
      } else {
        presetKey = (overlayPreset in OVERLAY_PRESETS ? overlayPreset : "classic_clean_travel") as PresetName;
      }

      // Pre-compute 5-6 word CTR-optimized overlay hook
      const nicheOverlayData = generateFullNicheOverlayContent(
        currentPrompt,
        pinTypeName,
        presetKey,
        pinTypeName,
        lineCustomOverlay
      );
      const hookText = lineCustomOverlay?.trim() || nicheOverlayData.fullHook;

      // Inject typography or clean photography directive
      if (itemTextMode === "in_image") {
        finalPromptForImage = `${finalPromptForImage}, commercial Pinterest photo with clean legible typography text reading "${hookText}" seamlessly integrated, bold graphic lettering, centered aesthetic layout`;
      } else if (itemTextMode === "none") {
        finalPromptForImage = `${finalPromptForImage}, pure clean photography, authentic lifestyle, no text, no words, no letters, no typography, clean negative space`;
      }

      const itemKey = crypto.createHash("sha256").update(`${job.id}:${i}:${Date.now()}`).digest("hex");
      const jobItem = await prisma.jobItem.create({
        data: {
          jobId: job.id,
          lineIndex: i,
          variationIndex: 0,
          pinType: pinTypeName,
          finalPrompt: finalPromptForImage,
          itemKey,
          status: "IMAGING",
        },
      });

      try {
        const inferenceResult = await generateRunwareImage({
          apiKey: runwareApiKey,
          model: model.runwareModelId,
          positivePrompt: finalPromptForImage,
          negativePrompt: model.supportsNegativePrompt ? nicheResult.negativePrompt : undefined,
          width: targetWidth,
          height: targetHeight,
          outputFormat: "WEBP",
        });

        if (!inferenceResult.success || !inferenceResult.imageURL) {
          await prisma.jobItem.update({
            where: { id: jobItem.id },
            data: { status: "FAILED", error: inferenceResult.error || "Image inference failed" },
          });
          continue;
        }

        const savedRawImage = await storage.saveImageFromUrl(inferenceResult.imageURL, "raw_pin");
        const itemCost = inferenceResult.cost ?? model.pricePerImage;
        totalActualCost += itemCost;

        let finalImageUrl = savedRawImage.publicUrl;
        let overlayTextToStore: string | null = null;
        let overlayJsonToStore: string | null = null;

        if (itemTextMode === "canvas") {
          overlayTextToStore = hookText;
          const basePreset = OVERLAY_PRESETS[presetKey];

          const overlayConfig: OverlayConfig = {
            canvas: { w: targetWidth, h: targetHeight },
            text: {
              content: hookText,
              preset: presetKey,
              fontFamily: brandKit?.fontFamily ? `${brandKit.fontFamily}, sans-serif` : basePreset.text?.fontFamily || "Playfair Display, Georgia, serif",
              weight: basePreset.text?.weight || 700,
              color: basePreset.text?.color || "#ffffff",
              align: basePreset.text?.align || "center",
              maxLines: basePreset.text?.maxLines || 3,
              box: basePreset.text?.box || { x: 0.08, y: 0.65, w: 0.84, h: 0.28 },
            },
            background: basePreset.background || { type: "scrim", from: "rgba(0,0,0,0)", to: "rgba(0,0,0,0.85)" },
            accent: basePreset.accent,
            logo: brandKit?.logoPng
              ? {
                  url: brandKit.logoPng,
                  position: (brandKit.logoPosition as any) || "bottom_right",
                  scale: 0.14,
                  opacity: brandKit.logoOpacity ?? 0.9,
                }
              : undefined,
            url: brandKit?.websiteUrl
              ? {
                  text: brandKit.websiteUrl.replace(/^https?:\/\//, "").replace(/\/$/, ""),
                  size: 12,
                  position: "bottom_center",
                }
              : undefined,
            nicheData: nicheOverlayData,
            palette: (body.palette as any) || (brandKit?.colorPalette as any) || undefined,
            luminanceMode: (body.luminanceMode as any) || undefined,
          };

          try {
            const composite = await compositeOverlayOnImage(savedRawImage.storagePath, overlayConfig, "final_pin");
            finalImageUrl = composite.publicUrl;
            overlayJsonToStore = JSON.stringify(overlayConfig);
          } catch {}
        } else if (itemTextMode === "in_image") {
          overlayTextToStore = hookText;
        }

        // Deep SEO Generation for each image prompt
        const seoResult = await generatePinterestSeo({
          prompt: currentPrompt,
          pinType: pinTypeName,
          overlayText: overlayTextToStore || undefined,
          openrouterApiKey,
          primaryModel: settings?.defaultTextModel,
        });

        // Persist Pin
        const pin = await prisma.$transaction(async (tx) => {
          const created = await tx.pin.create({
            data: {
              jobItemId: jobItem.id,
              brandKitId: brandKit?.id || null,
              imageUrl: finalImageUrl,
              rawImageUrl: savedRawImage.publicUrl,
              width: targetWidth,
              height: targetHeight,
              modelUsed: model.label,
              cost: itemCost,
              title: seoResult.title,
              description: seoResult.description,
              altText: seoResult.altText,
              hashtags: JSON.stringify(seoResult.hashtags),
              targetKeyword: seoResult.targetKeyword,
              secondaryKeywords: JSON.stringify(seoResult.secondaryKeywords),
              pinType: pinTypeName,
              textMode: itemTextMode,
              overlayText: overlayTextToStore,
              overlayJson: overlayJsonToStore,
              status: "DRAFT",
            },
          });

          await tx.costEvent.create({
            data: {
              jobId: job.id,
              pinId: created.id,
              kind: "image",
              model: model.runwareModelId,
              amount: itemCost,
            },
          });

          await tx.jobItem.update({
            where: { id: jobItem.id },
            data: {
              status: "DONE",
              rawImagePath: savedRawImage.storagePath,
              overlayJson: overlayJsonToStore,
              seoJson: JSON.stringify(seoResult),
            },
          });

          return created;
        });

        generatedPins.push({
          pin,
          seo: seoResult,
          prompt: currentPrompt,
          cost: itemCost,
        });
      } catch (itemErr: unknown) {
        console.error(`Error processing bulk prompt #${i}:`, itemErr);
        await prisma.jobItem.update({
          where: { id: jobItem.id },
          data: { status: "FAILED", error: itemErr instanceof Error ? itemErr.message : "Item generation failed" },
        });
      }
    }

    await prisma.job.update({
      where: { id: job.id },
      data: {
        status: generatedPins.length === prompts.length ? "COMPLETED" : generatedPins.length > 0 ? "PARTIAL" : "FAILED",
        actualCost: totalActualCost,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Bulk generation completed: ${generatedPins.length} of ${prompts.length} pins created.`,
      jobId: job.id,
      totalCost: totalActualCost,
      count: generatedPins.length,
      data: generatedPins,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error during bulk generation";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
