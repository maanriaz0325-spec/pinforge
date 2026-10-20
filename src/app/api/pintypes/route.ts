import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";

export async function GET() {
  try {
    const pinTypes = await prisma.pinType.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: pinTypes,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load pin types";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
