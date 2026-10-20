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
