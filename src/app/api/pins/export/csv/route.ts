import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { generatePinterestBulkCsv } from "@/server/engine/export";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { pinIds } = body as { pinIds?: string[] };

    let whereClause: any = {};
    if (Array.isArray(pinIds) && pinIds.length > 0) {
      whereClause.id = { in: pinIds };
    }

    const pins = await prisma.pin.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    if (pins.length === 0) {
      return NextResponse.json(
        { success: false, error: "No pins found to export" },
        { status: 404 }
      );
    }

    const host = req.headers.get("host") || "localhost:3005";
    const protocol = host.startsWith("localhost") ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;

    const csvContent = generatePinterestBulkCsv(pins, baseUrl);

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="pinforge_bulk_${Date.now()}.csv"`,
      },
    });
  } catch (error: any) {
    console.error("CSV Export failed:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to export CSV" },
      { status: 500 }
    );
  }
}
