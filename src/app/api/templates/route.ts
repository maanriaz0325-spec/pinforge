import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/server/db/prisma";
import { calculateTemplateQualityScore } from "@/server/engine/templates";

const CreateTemplateSchema = z.object({
  name: z.string().min(2, "Template name must be at least 2 characters").max(100),
  nicheId: z.string().min(1, "Niche is required"),
  systemPrompt: z.string().min(20, "System prompt must be at least 20 characters"),
  styleNotes: z.string().optional(),
  forbiddenElements: z.array(z.string()).optional(),
  keywordSeeds: z.array(z.string()).optional(),
  defaultPinTypes: z.record(z.any()).optional(),
});

export async function GET() {
  try {
    const templates = await prisma.template.findMany({
      where: { isDeleted: false },
      include: { niche: true },
      orderBy: { updatedAt: "desc" },
    });

    const enriched = templates.map((t) => {
      const quality = calculateTemplateQualityScore({
        systemPrompt: t.systemPrompt,
        forbiddenElements: t.forbiddenElements || "[]",
        keywordSeeds: t.keywordSeeds || "[]",
      });

      return {
        ...t,
        qualityScore: quality.score,
        qualityDetails: quality,
      };
    });

    return NextResponse.json({ success: true, data: enriched });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load templates";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CreateTemplateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const {
      name,
      nicheId,
      systemPrompt,
      styleNotes,
      forbiddenElements,
      keywordSeeds,
      defaultPinTypes,
    } = parsed.data;

    const template = await prisma.template.create({
      data: {
        name: name.trim(),
        nicheId,
        systemPrompt: systemPrompt.trim(),
        styleNotes: styleNotes?.trim(),
        forbiddenElements: JSON.stringify(forbiddenElements || []),
        keywordSeeds: JSON.stringify(keywordSeeds || []),
        defaultPinTypes: defaultPinTypes ? JSON.stringify(defaultPinTypes) : null,
        version: 1,
      },
      include: { niche: true },
    });

    return NextResponse.json({
      success: true,
      message: "Template created successfully",
      data: template,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create template";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
