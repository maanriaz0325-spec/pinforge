import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 100);

    const [pins, totalCount] = await Promise.all([
      prisma.pin.findMany({
        where: { isDeleted: false },
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.pin.count({
        where: { isDeleted: false },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        pins,
        total: totalCount,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load pins";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      imageUrl,
      rawImageUrl,
      title = "Custom Designed Pin",
      description = "Created with PinForge Custom Preset Studio",
      altText = "Pinterest Pin",
      targetKeyword = "pin inspiration",
      hashtags = ["#pininspiration", "#custompin"],
      pinType = "Custom Design",
      textMode = "canvas",
      overlayText,
      overlayJson,
      modelUsed = "Custom Upload / Editor",
      cost = 0.0,
      width = 1000,
      height = 1500,
    } = body;

    if (!imageUrl) {
      return NextResponse.json({ success: false, error: "Image URL is required" }, { status: 400 });
    }

    const pin = await prisma.pin.create({
      data: {
        imageUrl,
        rawImageUrl: rawImageUrl || imageUrl,
        title,
        description,
        altText,
        targetKeyword,
        hashtags: JSON.stringify(hashtags),
        pinType,
        textMode,
        overlayText: overlayText || null,
        overlayJson: overlayJson ? (typeof overlayJson === "string" ? overlayJson : JSON.stringify(overlayJson)) : null,
        modelUsed,
        cost,
        width,
        height,
      },
    });

    return NextResponse.json({
      success: true,
      data: pin,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to save pin";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
