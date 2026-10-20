import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const original = await prisma.brandKit.findUnique({
      where: { id },
    });

    if (!original) {
      return NextResponse.json(
        { success: false, error: "Brand kit not found" },
        { status: 404 }
      );
    }

    const duplicate = await prisma.brandKit.create({
      data: {
        kitName: `${original.kitName} (Copy)`,
        brandName: original.brandName,
        websiteUrl: original.websiteUrl,
        styleVibe: original.styleVibe,
        customAdjectives: original.customAdjectives,
        referenceImage: original.referenceImage,
        logoPng: original.logoPng,
        logoPosition: original.logoPosition,
        logoOpacity: original.logoOpacity,
        googleFontUrl: original.googleFontUrl,
        fontFamily: original.fontFamily,
        overlayPreset: original.overlayPreset,
        palette: original.palette,
        negativePrompt: original.negativePrompt,
        brandVoice: original.brandVoice,
        ctaPresets: original.ctaPresets,
        defaultAspect: original.defaultAspect,
        defaultModel: original.defaultModel,
        defaultTextModel: original.defaultTextModel,
        utmTemplate: original.utmTemplate,
      },
    });

    return NextResponse.json({ success: true, kit: duplicate });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to duplicate brand kit" },
      { status: 500 }
    );
  }
}
