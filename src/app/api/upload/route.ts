import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";

    const uploadDir = path.join(process.cwd(), "public", "uploads", "user_pins");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json({ success: false, error: "No image file provided" }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const filename = `user_pin_${Date.now()}_${crypto.randomBytes(4).toString("hex")}.${ext}`;
      const filePath = path.join(uploadDir, filename);

      await fs.promises.writeFile(filePath, buffer);

      return NextResponse.json({
        success: true,
        url: `/uploads/user_pins/${filename}`,
        filename,
      });
    } else {
      // JSON base64 data url
      const { dataUrl, filename: customFilename } = await req.json();
      if (!dataUrl || !dataUrl.includes(",")) {
        return NextResponse.json({ success: false, error: "Invalid image data" }, { status: 400 });
      }

      const [header, base64Data] = dataUrl.split(",");
      const mimeMatch = header.match(/:(.*?);/);
      const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";

      let ext = "jpg";
      if (mimeType.includes("png")) ext = "png";
      else if (mimeType.includes("webp")) ext = "webp";

      const filename = customFilename || `user_pin_${Date.now()}_${crypto.randomBytes(4).toString("hex")}.${ext}`;
      const filePath = path.join(uploadDir, filename);
      const buffer = Buffer.from(base64Data, "base64");

      await fs.promises.writeFile(filePath, buffer);

      return NextResponse.json({
        success: true,
        url: `/uploads/user_pins/${filename}`,
        filename,
      });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Image upload failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
