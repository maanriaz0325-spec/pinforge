import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";

export async function GET() {
  try {
    const kits = await prisma.brandKit.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        _count: {
          select: { pins: true },
        },
      },
    });

    return NextResponse.json({ success: true, kits });
  } catch (error: any) {
    console.error("Failed to fetch brand kits:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load brand kits" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
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

    if (!kitName || !brandName) {
      return NextResponse.json(
        { success: false, error: "Kit name and Brand name are required" },
        { status: 400 }
      );
    }

    const newKit = await prisma.brandKit.create({
      data: {
        kitName: kitName.trim(),
        brandName: brandName.trim(),
        websiteUrl: websiteUrl ? websiteUrl.trim() : null,
        styleVibe: styleVibe ? styleVibe.trim() : null,
        customAdjectives: Array.isArray(customAdjectives)
          ? JSON.stringify(customAdjectives)
          : customAdjectives || null,
        referenceImage: referenceImage || null,
        logoPng: logoPng || null,
        logoPosition: logoPosition || "bottom_right",
        logoOpacity: typeof logoOpacity === "number" ? logoOpacity : 0.9,
        googleFontUrl: googleFontUrl || null,
        fontFamily: fontFamily || "Playfair Display",
        overlayPreset: overlayPreset || "scrim_editorial",
        palette: Array.isArray(palette) ? JSON.stringify(palette) : palette || null,
        negativePrompt: negativePrompt || null,
        brandVoice: brandVoice || null,
        ctaPresets: Array.isArray(ctaPresets)
          ? JSON.stringify(ctaPresets)
          : ctaPresets || null,
        defaultAspect: defaultAspect || "2:3",
        defaultModel: defaultModel || "Standard",
        utmTemplate: utmTemplate || "?utm_source=pinterest&utm_campaign={niche}",
      },
    });

    return NextResponse.json({ success: true, kit: newKit });
  } catch (error: any) {
    console.error("Failed to create brand kit:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create brand kit" },
      { status: 500 }
    );
  }
}
