import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/server/db/prisma";
import { calculateTemplateQualityScore } from "@/server/engine/templates";

const UpdateTemplateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  systemPrompt: z.string().min(20).optional(),
  styleNotes: z.string().optional(),
  forbiddenElements: z.array(z.string()).optional(),
  keywordSeeds: z.array(z.string()).optional(),
  defaultPinTypes: z.record(z.any()).optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const template = await prisma.template.findUnique({
      where: { id },
      include: { niche: true },
    });

    if (!template || template.isDeleted) {
      return NextResponse.json({ success: false, error: "Template not found" }, { status: 404 });
    }

    const quality = calculateTemplateQualityScore({
      systemPrompt: template.systemPrompt,
      forbiddenElements: template.forbiddenElements || "[]",
      keywordSeeds: template.keywordSeeds || "[]",
    });

    return NextResponse.json({
      success: true,
      data: {
        ...template,
        qualityScore: quality.score,
        qualityDetails: quality,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load template";
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
    const parsed = UpdateTemplateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const template = await prisma.template.findUnique({ where: { id } });
    if (!template || template.isDeleted) {
      return NextResponse.json({ success: false, error: "Template not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {
      version: template.version + 1, // Automatic version increment (Spec Section 32.5)
    };

    if (parsed.data.name !== undefined) updateData.name = parsed.data.name.trim();
    if (parsed.data.systemPrompt !== undefined) updateData.systemPrompt = parsed.data.systemPrompt.trim();
    if (parsed.data.styleNotes !== undefined) updateData.styleNotes = parsed.data.styleNotes.trim();
    if (parsed.data.forbiddenElements !== undefined) {
      updateData.forbiddenElements = JSON.stringify(parsed.data.forbiddenElements);
    }
    if (parsed.data.keywordSeeds !== undefined) {
      updateData.keywordSeeds = JSON.stringify(parsed.data.keywordSeeds);
    }
    if (parsed.data.defaultPinTypes !== undefined) {
      updateData.defaultPinTypes = JSON.stringify(parsed.data.defaultPinTypes);
    }

    const updated = await prisma.template.update({
      where: { id },
      data: updateData,
      include: { niche: true },
    });

    return NextResponse.json({
      success: true,
      message: "Template updated successfully (version incremented)",
      data: updated,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update template";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.template.update({
      where: { id },
      data: { isDeleted: true }, // Soft delete (Spec Section 32.5)
    });

    return NextResponse.json({ success: true, message: "Template safely deleted" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete template";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
