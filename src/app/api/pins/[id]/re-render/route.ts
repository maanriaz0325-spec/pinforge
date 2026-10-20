import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/server/db/prisma";
import { OVERLAY_PRESETS, OverlayConfig, PresetName } from "@/server/engine/overlay";
import { compositeOverlayOnImage } from "@/server/engine/composer";

const ReRenderSchema = z.object({
  overlayText: z.string().min(1, "Overlay text cannot be empty"),
  preset: z.string().optional().default("elegant_serif"),
  fontFamily: z.string().optional(),
  color: z.string().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = ReRenderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const pin = await prisma.pin.findUnique({ where: { id } });
    if (!pin || pin.isDeleted) {
      return NextResponse.json({ success: false, error: "Pin not found" }, { status: 404 });
    }

    // Must have a clean underlying rawImageUrl to re-render
    const rawImage = pin.rawImageUrl || pin.imageUrl;
    if (!rawImage) {
      return NextResponse.json(
        { success: false, error: "No raw base image found for this pin" },
        { status: 400 }
      );
    }

    const { overlayText, preset, fontFamily, color } = parsed.data;
    const presetKey = (preset in OVERLAY_PRESETS ? preset : "classic_clean_travel") as PresetName;
    const basePreset = OVERLAY_PRESETS[presetKey];

    const overlayConfig: OverlayConfig = {
      canvas: { w: pin.width || 768, h: pin.height || 1152 },
      text: {
        content: overlayText.trim(),
        preset: presetKey,
        fontFamily: fontFamily || basePreset.text?.fontFamily || "Playfair Display, Georgia, serif",
        weight: basePreset.text?.weight || 700,
        color: color || basePreset.text?.color || "#ffffff",
        align: basePreset.text?.align || "center",
        maxLines: basePreset.text?.maxLines || 4,
        box: basePreset.text?.box || { x: 0.08, y: 0.65, w: 0.84, h: 0.28 },
      },
      background: basePreset.background || { type: "scrim", from: "rgba(0,0,0,0)", to: "rgba(0,0,0,0.85)" },
      accent: basePreset.accent,
    };

    const composite = await compositeOverlayOnImage(rawImage, overlayConfig, "re_render");

    const updatedPin = await prisma.pin.update({
      where: { id },
      data: {
        imageUrl: composite.publicUrl,
        overlayText: overlayText.trim(),
        overlayJson: JSON.stringify(overlayConfig),
        textMode: "canvas",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Overlay re-rendered for free from raw base image",
      data: updatedPin,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to re-render overlay";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
