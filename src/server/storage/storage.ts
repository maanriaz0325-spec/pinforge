import fs from "fs";
import path from "path";
import crypto from "crypto";

export interface SaveImageResult {
  filename: string;
  storagePath: string;
  publicUrl: string;
  sizeBytes: number;
  mimeType: string;
}

export interface IStorageProvider {
  saveImageFromUrl(imageUrl: string, prefix?: string): Promise<SaveImageResult>;
  saveImageBuffer(buffer: Buffer, mimeType: string, prefix?: string): Promise<SaveImageResult>;
  fileExists(storagePath: string): boolean;
}

export class LocalStorageProvider implements IStorageProvider {
  private baseDir: string;

  constructor() {
    // Save to public/uploads/pins so Next.js static asset server serves them seamlessly
    this.baseDir = path.join(process.cwd(), "public", "uploads", "pins");
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  fileExists(storagePath: string): boolean {
    return fs.existsSync(storagePath);
  }

  async saveImageBuffer(buffer: Buffer, mimeType: string, prefix = "pin"): Promise<SaveImageResult> {
    if (!buffer || buffer.length === 0) {
      throw new Error("Cannot save empty image buffer");
    }

    let ext = "jpg";
    if (mimeType.includes("png")) ext = "png";
    else if (mimeType.includes("webp")) ext = "webp";
    else if (mimeType.includes("svg")) ext = "svg";

    const hash = crypto.randomBytes(6).toString("hex");
    const filename = `${prefix}_${Date.now()}_${hash}.${ext}`;
    const storagePath = path.join(this.baseDir, filename);

    await fs.promises.writeFile(storagePath, buffer);

    return {
      filename,
      storagePath,
      publicUrl: `/uploads/pins/${filename}`,
      sizeBytes: buffer.length,
      mimeType,
    };
  }

  async saveImageFromUrl(imageUrl: string, prefix = "pin"): Promise<SaveImageResult> {
    if (!imageUrl) {
      throw new Error("No image URL provided for download");
    }

    // Handle data: URLs (e.g. from mock provider or base64)
    if (imageUrl.startsWith("data:")) {
      const matches = imageUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        throw new Error("Invalid base64 data URL");
      }
      const mimeType = matches[1];
      const buffer = Buffer.from(matches[2], "base64");
      return this.saveImageBuffer(buffer, mimeType, prefix);
    }

    // Download from remote provider HTTP URL
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000); // 30s download timeout

    let res: Response;
    try {
      res = await fetch(imageUrl, { signal: controller.signal });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`Failed to download image from provider URL: ${msg}`);
    } finally {
      clearTimeout(timeout);
    }

    if (!res.ok) {
      throw new Error(`Failed to download image: HTTP ${res.status} ${res.statusText}`);
    }

    const mimeType = res.headers.get("content-type") || "image/jpeg";
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length < 500) {
      throw new Error(`Downloaded image is suspiciously small (${buffer.length} bytes), likely corrupted.`);
    }

    return this.saveImageBuffer(buffer, mimeType, prefix);
  }
}

export const storage = new LocalStorageProvider();
