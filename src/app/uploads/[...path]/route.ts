import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const pathSegments = resolvedParams.path || [];

    // Prevent directory traversal
    const safePath = pathSegments.join("/").replace(/\.\./g, "");
    const filePath = path.join(process.cwd(), "public", "uploads", safePath);

    if (!fs.existsSync(filePath)) {
      return new NextResponse("Image not found", { status: 404 });
    }

    const ext = path.extname(filePath).toLowerCase();
    let contentType = "image/jpeg";
    if (ext === ".png") contentType = "image/png";
    else if (ext === ".webp") contentType = "image/webp";
    else if (ext === ".svg") contentType = "image/svg+xml";
    else if (ext === ".gif") contentType = "image/gif";

    const fileBuffer = await fs.promises.readFile(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error serving uploaded asset:", error);
    return new NextResponse("Error reading asset", { status: 500 });
  }
}
