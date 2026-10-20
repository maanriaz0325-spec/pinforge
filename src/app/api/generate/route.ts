import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { prisma } from "@/server/db/prisma";
import { decrypt } from "@/server/crypto/encryption";
import { generateRunwareImage } from "@/server/providers/runware";
import { storage } from "@/server/storage/storage";
import { OVERLAY_PRESETS, OverlayConfig, PresetName } from "@/server/engine/overlay";
import { compositeOverlayOnImage } from "@/server/engine/composer";
import { generatePinterestSeo, generateOverlayHook, generateFullNicheOverlayContent } from "@/server/engine/seo";
import { formatPaletteForPrompt } from "@/server/engine/brandKit";
import { getDimensionsForAspect } from "@/server/engine/aspectRatio";
import { applyNicheStrategyToPrompt } from "@/server/engine/nicheStrategies";

const GenerateRequestSchema = z.object({
  prompt: z.string().trim().min(1, "Prompt cannot be empty"),
  modelId: z.string().min(1, "Model selection is required"),
  aspectRatio: z.enum(["2:3", "9:16", "1:1", "4:5", "16:9"]).nullish().transform((v) => v || "2:3"),
  pinTypeId: z.string().nullish().transform((v) => v || "inspiration"),
  style: z.string().nullish().transform((v) => v || "Editorial"),
  textMode: z.enum(["canvas", "in_image", "none"]).nullish().transform((v) => v || "canvas"),
  overlayPreset: z.string().nullish().transform((v) => v || "scrim_editorial"),
  overlayText: z.string().nullish().transform((v) => v || undefined),
  palette: z.string().nullish().transform((v) => v || undefined),
  luminanceMode: z.enum(["auto", "light", "dark"]).nullish().transform((v) => v || undefined),
  brandKitId: z.string().nullish().transform((v) => v || undefined),
  brandKitEnabled: z.boolean().nullish().transform((v) => v ?? true),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = GenerateRequestSchema.safeParse(body);

    if (!parsed.success) {
      const reason = parsed.error.issues
        .map((i) => `${i.path.join(".") || "request"}: ${i.message}`)
        .join("; ");
      return NextResponse.json(
        {
          success: false,
          error: `Invalid input - ${reason}`,
          details: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const {
      prompt,
      modelId,
      aspectRatio,
      pinTypeId,
      style,
      textMode,
      overlayPreset,
      overlayText: customOverlayText,
      palette,
      luminanceMode,
      brandKitId,
      brandKitEnabled,
    } = parsed.data;

    const { width: targetWidth, height: targetHeight, aspect: selectedAspect } = getDimensionsForAspect(aspectRatio);

    let cleanPrompt = prompt.trim();

    // 0. Resolve Brand Kit (Spec Section 33)
    let brandKit: any = null;
    if (brandKitId && brandKitEnabled) {
      brandKit = await prisma.brandKit.findUnique({
        where: { id: brandKitId },
      });
    }

    // Palette and vibe prompt injection (Spec Section 33.4)
    if (brandKit) {
      const paletteAddon = brandKit.palette ? formatPaletteForPrompt(brandKit.palette) : "";
      const vibeAddon = brandKit.styleVibe ? `styled in ${brandKit.styleVibe} aesthetic` : "";
      const promptAddons = [paletteAddon, vibeAddon].filter(Boolean).join(", ");
      if (promptAddons) {
        cleanPrompt = `${cleanPrompt}, ${promptAddons}`;
      }
    }

    // 1. Resolve registered model from DB
    const model = await prisma.modelRegistry.findUnique({
      where: { id: modelId },
    });

    if (!model) {
      return NextResponse.json(
        {
          success: false,
          error: `Selected model '${modelId}' is not found in the Model Registry.`,
        },
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
    const settings = await prisma.settings.findUnique({
      where: { id: "default" },
    });

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
        {
          success: false,
          error: "No Runware API key configured. Please configure your API key in Settings.",
        },
        { status: 400 }
      );
    }

    if (!runwareApiKey && process.env.PROVIDER_MODE === "mock") {
      runwareApiKey = "mock_runware_auto_test_key";
    }

    // 4. Create Job & JobItem in DB
    const estimatedCost = model.pricePerImage;
    const job = await prisma.job.create({
      data: {
        mode: "prompt",
        inputLines: JSON.stringify([cleanPrompt]),
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
          brandKit: brandKit
            ? {
                id: brandKit.id,
                kitName: brandKit.kitName,
                brandName: brandKit.brandName,
                websiteUrl: brandKit.websiteUrl,
                fontFamily: brandKit.fontFamily,
                overlayPreset: brandKit.overlayPreset,
                palette: brandKit.palette,
                logoPng: brandKit.logoPng,
              }
            : null,
        }),
        status: "RUNNING",
        totalItems: 1,
        estimatedCost,
      },
    });

    // Standalone Niche Strategy Engine application
    const nicheResult = applyNicheStrategyToPrompt(cleanPrompt, {
      niche: pinTypeName,
      style,
    });

    // Pre-compute 5-6 word CTR-optimized overlay hook
    const nicheOverlayData = generateFullNicheOverlayContent(
      cleanPrompt,
      undefined,
      overlayPreset,
      pinTypeName,
      customOverlayText
    );
    const hookText = customOverlayText?.trim() || nicheOverlayData.fullHook;

    let positivePromptForModel = nicheResult.enhancedPrompt;
    if (textMode === "in_image") {
      positivePromptForModel = `${nicheResult.enhancedPrompt}, commercial Pinterest photo with clean legible typography text reading "${hookText}" seamlessly integrated, bold graphic lettering, centered aesthetic layout`;
    } else if (textMode === "none") {
      positivePromptForModel = `${nicheResult.enhancedPrompt}, pure clean photography, authentic lifestyle, no text, no words, no letters, no typography, clean negative space`;
    }

    const itemKey = crypto
      .createHash("sha256")
      .update(`${job.id}:0:0:${Date.now()}`)
      .digest("hex");

    const jobItem = await prisma.jobItem.create({
      data: {
        jobId: job.id,
        lineIndex: 0,
        variationIndex: 0,
        pinType: pinTypeName,
        finalPrompt: positivePromptForModel,
        itemKey,
        status: "IMAGING",
      },
    });

    // 5. Call Runware Provider with EXACT AIR model ID and Niche Realism anchors
    const inferenceResult = await generateRunwareImage({
      apiKey: runwareApiKey,
      model: model.runwareModelId,
      positivePrompt: positivePromptForModel,
      negativePrompt: model.supportsNegativePrompt ? nicheResult.negativePrompt : undefined,
      width: targetWidth,
      height: targetHeight,
      outputFormat: "WEBP",
    });

    if (!inferenceResult.success || !inferenceResult.imageURL) {
      await prisma.jobItem.update({
        where: { id: jobItem.id },
        data: {
          status: "FAILED",
          error: inferenceResult.error || "Image inference failed",
        },
      });

      await prisma.job.update({
        where: { id: job.id },
        data: { status: "FAILED" },
      });

      return NextResponse.json(
        {
          success: false,
          error: inferenceResult.error || "Generation failed with provider error.",
          status: inferenceResult.status,
        },
        { status: 502 }
      );
    }

    // 6. Download and store RAW image in persistent application storage
    let savedRawImage;
    try {
      savedRawImage = await storage.saveImageFromUrl(inferenceResult.imageURL, "raw_pin");
    } catch (storageErr: unknown) {
      const storageErrMsg = storageErr instanceof Error ? storageErr.message : String(storageErr);

      await prisma.jobItem.update({
        where: { id: jobItem.id },
        data: {
          status: "FAILED",
          error: `Storage failure: ${storageErrMsg}`,
        },
      });

      await prisma.job.update({
        where: { id: job.id },
        data: { status: "FAILED" },
      });

      return NextResponse.json(
        {
          success: false,
          error: `Failed to save generated image: ${storageErrMsg}`,
        },
        { status: 500 }
      );
    }

    const actualCost = inferenceResult.cost ?? model.pricePerImage;

    // 7. Text & Overlay Engine (Spec Section 10)
    let finalImageUrl = savedRawImage.publicUrl;
    let overlayTextToStore: string | null = null;
    let overlayJsonToStore: string | null = null;

    if (textMode === "canvas") {
      overlayTextToStore = hookText;
      const presetKey = (overlayPreset in OVERLAY_PRESETS ? overlayPreset : "classic_clean_travel") as PresetName;
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
        palette: palette || (brandKit?.colorPalette as any) || undefined,
        luminanceMode: luminanceMode || undefined,
      };

      try {
        const composite = await compositeOverlayOnImage(savedRawImage.storagePath, overlayConfig, "final_pin");
        finalImageUrl = composite.publicUrl;
        overlayJsonToStore = JSON.stringify(overlayConfig);
      } catch (compErr) {
        console.warn("Overlay composition failed, falling back to raw image:", compErr);
      }
    } else if (textMode === "in_image") {
      overlayTextToStore = hookText;
    }

    // 8. SEO Engine (Spec Section 11 & 31)
    const seoResult = await generatePinterestSeo({
      prompt: cleanPrompt,
      pinType: pinTypeName,
      overlayText: overlayTextToStore || undefined,
      openrouterApiKey,
      primaryModel: settings?.defaultTextModel,
    });

    // 9. Atomic DB Transaction: Create Pin, CostEvent, and finalize Job/JobItem
    const createdPin = await prisma.$transaction(async (tx) => {
      const pin = await tx.pin.create({
        data: {
          jobItemId: jobItem.id,
          brandKitId: brandKit?.id || null,
          imageUrl: finalImageUrl,
          rawImageUrl: savedRawImage.publicUrl,
          width: targetWidth,
          height: targetHeight,
          modelUsed: model.label,
          cost: actualCost,
          title: seoResult.title,
          description: seoResult.description,
          altText: seoResult.altText,
          hashtags: JSON.stringify(seoResult.hashtags),
          targetKeyword: seoResult.targetKeyword,
          secondaryKeywords: JSON.stringify(seoResult.secondaryKeywords),
          pinType: pinTypeName,
          textMode,
          overlayText: overlayTextToStore,
          overlayJson: overlayJsonToStore,
          status: "DRAFT",
        },
      });

      await tx.costEvent.create({
        data: {
          jobId: job.id,
          pinId: pin.id,
          kind: "image",
          model: model.runwareModelId,
          amount: actualCost,
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

      await tx.job.update({
        where: { id: job.id },
        data: {
          status: "COMPLETED",
          actualCost,
        },
      });

      return pin;
    });

    return NextResponse.json({
      success: true,
      message: "Pin generated, overlay rendered, and SEO copy saved",
      data: {
        pin: createdPin,
        seo: seoResult,
        jobId: job.id,
        cost: actualCost,
        model: model.label,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error during generation";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
