import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/server/db/prisma";
import { generateDiverseIdeas, hashIdea } from "@/server/engine/diversity";

const GenerateIdeasSchema = z.object({
  templateId: z.string().min(1, "Template is required"),
  count: z.number().int().min(1).max(50).default(10),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = GenerateIdeasSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { templateId, count } = parsed.data;

    const template = await prisma.template.findUnique({
      where: { id: templateId },
      include: { niche: true },
    });

    if (!template || template.isDeleted) {
      return NextResponse.json({ success: false, error: "Template not found" }, { status: 404 });
    }

    // Retrieve recent idea history memory (Spec Section 28.3)
    const recentHistory = await prisma.ideaHistory.findMany({
      where: { templateId },
      orderBy: { createdAt: "desc" },
      take: 40,
    });
    const recentUsedIdeas = recentHistory.map((h) => h.ideaText);

    let seeds: string[] = [];
    try {
      seeds = JSON.parse(template.keywordSeeds || "[]");
    } catch {
      seeds = [template.name];
    }

    // Run Diversity Engine
    const ideas = generateDiverseIdeas({
      templateName: template.name,
      systemPrompt: template.systemPrompt,
      keywordSeeds: seeds,
      count,
      recentUsedIdeas,
    });

    // Save to IdeaHistory memory
    await Promise.all(
      ideas.map((item) =>
        prisma.ideaHistory.create({
          data: {
            templateId,
            ideaText: item.idea,
            ideaHash: hashIdea(item.idea),
          },
        })
      )
    );

    return NextResponse.json({
      success: true,
      data: ideas,
      templateName: template.name,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to generate diverse ideas";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
