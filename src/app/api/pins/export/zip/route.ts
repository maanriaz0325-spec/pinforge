import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { prisma } from "@/server/db/prisma";
import { compressImageBuffer } from "@/server/engine/export";
import { createZipArchive } from "@/server/engine/zip";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { pinIds, compressed = true } = body as {
      pinIds?: string[];
      compressed?: boolean;
    };

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

    const zipEntries: Array<{ filename: string; data: Buffer }> = [];

    for (let i = 0; i < pins.length; i++) {
      const pin = pins[i];
      // Resolve path
      const imgUrl = pin.imageUrl;
      let filePath = "";

      if (imgUrl.startsWith("/uploads/pins/")) {
        const basename = path.basename(imgUrl);
        filePath = path.join(process.cwd(), "public", "uploads", "pins", basename);
      } else {
        filePath = path.join(process.cwd(), "public", imgUrl.replace(/^\//, ""));
      }

      if (!fs.existsSync(filePath)) {
        continue;
      }

      let fileBuffer = await fs.promises.readFile(filePath);

      if (compressed) {
        try {
          const comp = await compressImageBuffer(fileBuffer, { format: "jpg", quality: 82 });
          fileBuffer = Buffer.from(comp.buffer);
        } catch {
          // Keep uncompressed fallback if compression encounters issue
        }
      }

      // Clean filename
      const cleanTitle = (pin.title || `pin_${pin.id.slice(0, 8)}`)
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, "_")
        .slice(0, 40);
      const filename = `${String(i + 1).padStart(2, "0")}_${cleanTitle}.jpg`;

      zipEntries.push({
        filename,
        data: fileBuffer,
      });
    }

    if (zipEntries.length === 0) {
      return NextResponse.json(
        { success: false, error: "Could not read pin image files from disk" },
        { status: 500 }
      );
    }

    const zipBuffer = createZipArchive(zipEntries);

    return new NextResponse(new Uint8Array(zipBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="pinforge_pins_${Date.now()}.zip"`,
        "Content-Length": String(zipBuffer.length),
      },
    });
  } catch (error: any) {
    console.error("ZIP Export failed:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create ZIP export" },
      { status: 500 }
    );
  }
}
