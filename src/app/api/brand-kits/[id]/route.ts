import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const kit = await prisma.brandKit.findUnique({
      where: { id },
      include: {
        _count: {
          select: { pins: true },
        },
      },
    });

    if (!kit) {
      return NextResponse.json(
        { success: false, error: "Brand kit not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, kit });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load brand kit" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const {
      kitName,
      brandName,
      websiteUrl,
      styleVibe,
      customAdjectives,
      referenceImage,
      logoPng,
      logoPosition,
      logoOpacity,
      googleFontUrl,
      fontFamily,
      overlayPreset,
      palette,
      negativePrompt,
      brandVoice,
      ctaPresets,
      defaultAspect,
      defaultModel,
      utmTemplate,
    } = body;

    const updated = await prisma.brandKit.update({
      where: { id },
      data: {
        ...(kitName && { kitName: kitName.trim() }),
        ...(brandName && { brandName: brandName.trim() }),
        websiteUrl: websiteUrl ? websiteUrl.trim() : null,
        styleVibe: styleVibe ? styleVibe.trim() : null,
        customAdjectives: Array.isArray(customAdjectives)
          ? JSON.stringify(customAdjectives)
          : customAdjectives || null,
        referenceImage: referenceImage || null,
        logoPng: logoPng || null,
        ...(logoPosition && { logoPosition }),
        ...(typeof logoOpacity === "number" && { logoOpacity }),
        googleFontUrl: googleFontUrl || null,
        ...(fontFamily && { fontFamily }),
        ...(overlayPreset && { overlayPreset }),
        palette: Array.isArray(palette) ? JSON.stringify(palette) : palette || null,
        negativePrompt: negativePrompt || null,
        brandVoice: brandVoice || null,
        ctaPresets: Array.isArray(ctaPresets)
          ? JSON.stringify(ctaPresets)
          : ctaPresets || null,
        ...(defaultAspect && { defaultAspect }),
        ...(defaultModel && { defaultModel }),
        utmTemplate: utmTemplate || "?utm_source=pinterest&utm_campaign={niche}",
      },
    });

    return NextResponse.json({ success: true, kit: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update brand kit" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if kit has associated pins
    const kitWithPins = await prisma.brandKit.findUnique({
      where: { id },
      include: {
        _count: {
          select: { pins: true },
        },
      },
    });

    if (!kitWithPins) {
      return NextResponse.json(
        { success: false, error: "Brand kit not found" },
        { status: 404 }
      );
    }

    if (kitWithPins._count.pins > 0) {
      // Remove relation from pins before deleting kit
      await prisma.pin.updateMany({
        where: { brandKitId: id },
        data: { brandKitId: null },
      });
    }

    await prisma.brandKit.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete brand kit" },
      { status: 500 }
    );
  }
}
