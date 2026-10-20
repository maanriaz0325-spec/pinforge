import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/server/db/prisma";

export async function GET() {
  try {
    const niches = await prisma.niche.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { templates: { where: { isDeleted: false } } },
        },
      },
    });

    return NextResponse.json({ success: true, data: niches });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load niches";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = body?.name?.trim();

    if (!name || name.length < 2) {
      return NextResponse.json(
        { success: false, error: "Niche name must be at least 2 characters." },
        { status: 400 }
      );
    }

    const niche = await prisma.niche.upsert({
      where: { name },
      update: {},
      create: { name, isCustom: true },
    });

    return NextResponse.json({ success: true, data: niche });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create niche";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
