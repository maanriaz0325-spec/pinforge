import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/server/db/prisma";
import { calculateSeoScore, validateAndFixSeo } from "@/server/engine/seo";

const UpdatePinSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().min(1).max(500).optional(),
  altText: z.string().min(1).max(300).optional(),
  hashtags: z.array(z.string()).optional(),
  targetKeyword: z.string().min(1).optional(),
  destinationUrl: z.string().url().optional().or(z.literal("")),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pin = await prisma.pin.findUnique({
      where: { id },
      include: { costEvents: true },
    });

    if (!pin || pin.isDeleted) {
      return NextResponse.json({ success: false, error: "Pin not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: pin });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load pin";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = UpdatePinSchema.safeParse(body);

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

    const data = parsed.data;
    const updateData: Record<string, unknown> = {};

    if (data.title !== undefined) updateData.title = data.title.trim();
    if (data.description !== undefined) updateData.description = data.description.trim();
    if (data.altText !== undefined) updateData.altText = data.altText.trim();
    if (data.targetKeyword !== undefined) updateData.targetKeyword = data.targetKeyword.trim();
    if (data.destinationUrl !== undefined) updateData.destinationUrl = data.destinationUrl;
    if (data.hashtags !== undefined) {
      updateData.hashtags = JSON.stringify(
        data.hashtags.map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, "")).filter(Boolean)
      );
    }

    const updated = await prisma.pin.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "Pin metadata updated successfully",
      data: updated,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update pin";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.pin.update({
      where: { id },
      data: { isDeleted: true },
    });
    return NextResponse.json({ success: true, message: "Pin moved to trash" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete pin";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
