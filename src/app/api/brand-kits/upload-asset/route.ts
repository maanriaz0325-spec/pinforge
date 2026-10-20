import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";

    const uploadDir = path.join(process.cwd(), "public", "uploads", "brand");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      const assetType = (formData.get("type") as string) || "asset";

      if (!file) {
        return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = file.name.split(".").pop() || "png";
      const filename = `${assetType}_${Date.now()}_${crypto.randomBytes(4).toString("hex")}.${ext}`;
      const filePath = path.join(uploadDir, filename);

      await fs.promises.writeFile(filePath, buffer);

      return NextResponse.json({
        success: true,
        url: `/uploads/brand/${filename}`,
        filename,
      });
    } else {
      // JSON base64 data url
      const { dataUrl, type = "asset" } = await req.json();
      if (!dataUrl || !dataUrl.includes(",")) {
        return NextResponse.json({ success: false, error: "Invalid data URL" }, { status: 400 });
      }

      const [header, base64Data] = dataUrl.split(",");
      const mimeMatch = header.match(/:(.*?);/);
      const mimeType = mimeMatch ? mimeMatch[1] : "image/png";

      let ext = "png";
      if (mimeType.includes("jpeg") || mimeType.includes("jpg")) ext = "jpg";
      if (mimeType.includes("webp")) ext = "webp";
      if (mimeType.includes("svg")) ext = "svg";

      const buffer = Buffer.from(base64Data, "base64");
      const filename = `${type}_${Date.now()}_${crypto.randomBytes(4).toString("hex")}.${ext}`;
      const filePath = path.join(uploadDir, filename);

      await fs.promises.writeFile(filePath, buffer);

      return NextResponse.json({
        success: true,
        url: `/uploads/brand/${filename}`,
        filename,
      });
    }
  } catch (error: any) {
    console.error("Asset upload failed:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to upload asset" },
      { status: 500 }
    );
  }
}
