import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { decrypt } from "@/server/crypto/encryption";
import { generatePinterestSeo } from "@/server/engine/seo";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pin = await prisma.pin.findUnique({
      where: { id },
      include: { jobItem: true },
    });

    if (!pin || pin.isDeleted) {
      return NextResponse.json({ success: false, error: "Pin not found" }, { status: 404 });
    }

    const settings = await prisma.settings.findUnique({ where: { id: "default" } });
    let openrouterApiKey = "";
    if (settings?.openrouterKeyEnc) {
      try {
        openrouterApiKey = decrypt(settings.openrouterKeyEnc);
      } catch {}
    } else if (process.env.OPENROUTER_API_KEY) {
      openrouterApiKey = process.env.OPENROUTER_API_KEY;
    }

    const promptToUse = pin.jobItem?.finalPrompt || pin.title || pin.description;

    const seoResult = await generatePinterestSeo({
      prompt: promptToUse,
      pinType: pin.pinType,
      overlayText: pin.overlayText || undefined,
      openrouterApiKey,
      primaryModel: settings?.defaultTextModel,
    });

    const updated = await prisma.pin.update({
      where: { id },
      data: {
        title: seoResult.title,
        description: seoResult.description,
        altText: seoResult.altText,
        hashtags: JSON.stringify(seoResult.hashtags),
        targetKeyword: seoResult.targetKeyword,
        secondaryKeywords: JSON.stringify(seoResult.secondaryKeywords),
      },
    });

    return NextResponse.json({
      success: true,
      message: "SEO copy regenerated successfully",
      data: {
        pin: updated,
        seo: seoResult,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to regenerate SEO";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
