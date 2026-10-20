import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";

export async function GET() {
  try {
    const models = await prisma.modelRegistry.findMany({
      orderBy: { pricePerImage: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: models,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load models";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
