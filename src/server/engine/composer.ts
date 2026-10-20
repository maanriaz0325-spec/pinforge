import fs from "fs";
import path from "path";
import crypto from "crypto";
import sharp from "sharp";
import { OverlayConfig, renderOverlaySvg } from "./overlay";

export interface CompositeResult {
  filename: string;
  storagePath: string;
  publicUrl: string;
  width: number;
  height: number;
}

/**
 * Composites a vector overlay onto a raw base image using Sharp.
 */
export async function compositeOverlayOnImage(
  rawImagePath: string,
  overlayConfig: OverlayConfig,
  outPrefix = "composite"
): Promise<CompositeResult> {
  // If rawImagePath is a public URL (e.g. /uploads/pins/raw_123.jpg), resolve to local disk
  let fullPath = rawImagePath;
  if (rawImagePath.startsWith("/uploads/pins/")) {
    const filename = path.basename(rawImagePath);
    fullPath = path.join(process.cwd(), "public", "uploads", "pins", filename);
  }

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Raw base image not found at ${fullPath}`);
  }

  const baseImage = sharp(fullPath);
  const metadata = await baseImage.metadata();
  const width = metadata.width || 768;
  const height = metadata.height || 1152;

  // Sync canvas dimensions in overlay config
  overlayConfig.canvas = { w: width, h: height };

  const overlaySvg = renderOverlaySvg(overlayConfig);
  const overlayBuffer = Buffer.from(overlaySvg, "utf-8");

  // Output directory
  const baseDir = path.join(process.cwd(), "public", "uploads", "pins");
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }

  const hash = crypto.randomBytes(6).toString("hex");
  const filename = `${outPrefix}_${Date.now()}_${hash}.jpg`;
  const storagePath = path.join(baseDir, filename);

  await baseImage
    .composite([
      {
        input: overlayBuffer,
        top: 0,
        left: 0,
      },
    ])
    .jpeg({ quality: 92 })
    .toFile(storagePath);

  return {
    filename,
    storagePath,
    publicUrl: `/uploads/pins/${filename}`,
    width,
    height,
  };
}
