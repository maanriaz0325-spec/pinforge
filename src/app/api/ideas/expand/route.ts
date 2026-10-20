import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/server/db/prisma";
import { expandSingleLineIdea } from "@/server/engine/diversity";

const ExpandIdeasSchema = z.object({
  templateId: z.string().min(1, "Template is required"),
  lines: z.array(z.string().min(3)).min(1, "At least one idea line is required"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ExpandIdeasSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { templateId, lines } = parsed.data;

    const template = await prisma.template.findUnique({
      where: { id: templateId },
      include: { niche: true },
    });

    if (!template || template.isDeleted) {
      return NextResponse.json({ success: false, error: "Template not found" }, { status: 404 });
    }

    const expanded = lines.map((line) => ({
      original: line,
      expandedPrompt: expandSingleLineIdea(line, {
        name: template.name,
        systemPrompt: template.systemPrompt,
        styleNotes: template.styleNotes,
      }),
    }));

    return NextResponse.json({
      success: true,
      data: expanded,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to expand ideas";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
