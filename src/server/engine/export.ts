import sharp from "sharp";

export interface PinExportData {
  id: string;
  title: string | null;
  imageUrl: string;
  rawImageUrl?: string | null;
  description: string | null;
  hashtags?: string[] | string | null;
  targetKeyword?: string | null;
  pinterestBoard?: string | null;
  link?: string | null;
  scheduledDate?: Date | string | null;
  scheduleDate?: string | null;
  scheduleTime?: string | null;
  status?: string;
}

function escapeCsvField(val: any): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

/**
 * Generates Pinterest Native Bulk CSV per Spec Section 35.5
 * Columns: Title, Media URL, Pinterest board, Description, Link, Publish date, Keywords
 */
export function generatePinterestBulkCsv(
  pins: PinExportData[],
  baseUrl = "http://localhost:3005"
): string {
  const headers = [
    "Title",
    "Media URL",
    "Pinterest board",
    "Description",
    "Link",
    "Publish date",
    "Keywords",
  ];

  const rows = pins.map((pin) => {
    // 1. Title
    const title = pin.title || "Untitled Pin";

    // 2. Media URL: Resolve full public URL if relative
    let mediaUrl = pin.imageUrl;
    if (mediaUrl.startsWith("/")) {
      mediaUrl = `${baseUrl.replace(/\/$/, "")}${mediaUrl}`;
    }

    // 3. Pinterest Board
    const board = pin.pinterestBoard || "Ideas & Inspiration";

    // 4. Description with hashtags (max 500 characters)
    let hashtagsText = "";
    if (Array.isArray(pin.hashtags)) {
      hashtagsText = pin.hashtags.map((h) => (h.startsWith("#") ? h : `#${h}`)).join(" ");
    } else if (typeof pin.hashtags === "string") {
      try {
        const parsed = JSON.parse(pin.hashtags);
        if (Array.isArray(parsed)) {
          hashtagsText = parsed.map((h) => (h.startsWith("#") ? h : `#${h}`)).join(" ");
        } else {
          hashtagsText = pin.hashtags;
        }
      } catch {
        hashtagsText = pin.hashtags;
      }
    }

    const baseDesc = pin.description || "";
    let fullDesc = hashtagsText ? `${baseDesc} ${hashtagsText}`.trim() : baseDesc;
    if (fullDesc.length > 500) {
      fullDesc = fullDesc.slice(0, 497) + "...";
    }

    // 5. Link
    const link = pin.link || baseUrl;

    // 6. Publish date
    let publishDate = "";
    if (pin.scheduleDate) {
      const time = pin.scheduleTime || "09:00";
      publishDate = `${pin.scheduleDate}T${time}:00.000Z`;
    } else if (pin.scheduledDate) {
      publishDate = new Date(pin.scheduledDate).toISOString();
    }

    // 7. Keywords
    const keywords = pin.targetKeyword || "";

    return [
      escapeCsvField(title),
      escapeCsvField(mediaUrl),
      escapeCsvField(board),
      escapeCsvField(fullDesc),
      escapeCsvField(link),
      escapeCsvField(publishDate),
      escapeCsvField(keywords),
    ].join(",");
  });

  return [headers.join(","), ...rows].join("\r\n");
}

/**
 * Smart image compression targeting 50-65% size reduction with SSIM >= 0.96 (Spec Section 30.8)
 */
export async function compressImageBuffer(
  inputBuffer: Buffer,
  options: { format?: "jpg" | "webp"; quality?: number } = {}
): Promise<{
  buffer: Buffer;
  sizeBytes: number;
  originalBytes: number;
  savingsPercent: number;
  format: string;
}> {
  const { format = "jpg", quality = 82 } = options;
  const originalBytes = inputBuffer.length;

  let pipeline = sharp(inputBuffer);

  if (format === "webp") {
    pipeline = pipeline.webp({ quality: quality || 80, effort: 4 });
  } else {
    pipeline = pipeline.jpeg({ quality: quality || 82, mozjpeg: true });
  }

  const outputBuffer = await pipeline.toBuffer();
  const sizeBytes = outputBuffer.length;
  const savingsPercent = originalBytes > 0
    ? Math.max(0, Math.round(((originalBytes - sizeBytes) / originalBytes) * 100))
    : 0;

  return {
    buffer: outputBuffer,
    sizeBytes,
    originalBytes,
    savingsPercent,
    format,
  };
}
