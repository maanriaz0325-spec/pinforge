import { describe, it, expect } from "vitest";
import sharp from "sharp";
import { calculateAutoSpreadDates } from "../../src/server/engine/scheduler";
import { generatePinterestBulkCsv, compressImageBuffer } from "../../src/server/engine/export";
import { createZipArchive } from "../../src/server/engine/zip";

describe("Phase 6: Scheduler, Smart Compression, ZIP/CSV Export & Stats Engine", () => {
  describe("1. Auto-Spread Scheduler (Spec Section 36 & Acceptance M9)", () => {
    it("spreads 60 pins across 20 days at 3 pins/day correctly", () => {
      const startDate = new Date("2026-11-01T08:00:00Z");
      const slots = calculateAutoSpreadDates({
        pinCount: 60,
        startDate,
        pinsPerDay: 3,
        postingHours: [9, 14, 20],
        jitterMinutes: 15,
      });

      expect(slots).toHaveLength(60);

      // Check span of days: 60 pins / 3 pins/day = 20 distinct days
      const days = new Set(slots.map((s) => s.date.toISOString().split("T")[0]));
      expect(days.size).toBe(20);

      // Check that all hours align with posting windows (with ±15 min jitter)
      for (const slot of slots) {
        const hour = slot.date.getHours();
        expect([8, 9, 13, 14, 19, 20, 21]).toContain(hour);
      }
    });

    it("injects jitter so slot minutes are not all identically zero", () => {
      const slots = calculateAutoSpreadDates({
        pinCount: 15,
        startDate: new Date("2026-11-01T08:00:00Z"),
        pinsPerDay: 3,
        postingHours: [9, 14, 20],
        jitterMinutes: 15,
      });

      const minutes = slots.map((s) => s.date.getMinutes());
      const hasNonZeroMinutes = minutes.some((m) => m !== 0);
      expect(hasNonZeroMinutes).toBe(true);
    });
  });

  describe("2. Pinterest Native Bulk CSV Generation (Spec Section 35.5)", () => {
    it("generates CSV with exact 7 headers and valid escaped row format", () => {
      const testPins = [
        {
          id: "pin-1",
          title: "10 Cozy Scandi Bedroom Ideas",
          imageUrl: "/uploads/pins/test1.jpg",
          pinterestBoard: "Scandinavian Decor",
          description: "Discover functional minimalist bedroom design.",
          hashtags: ["scandi", "homedecor", "minimalist"],
          link: "https://example.com/scandi-bedroom",
          scheduledDate: new Date("2026-11-05T14:30:00Z"),
          targetKeyword: "scandi bedroom",
        },
        {
          id: "pin-2",
          title: 'Artisan "Sourdough" Baking Guide',
          imageUrl: "https://example.com/cdn/bread.jpg",
          pinterestBoard: "Baking",
          description: 'A complete step-by-step with "starter" tips.',
          hashtags: "#bread, #baking",
          link: "https://example.com/sourdough",
          scheduledDate: null,
          targetKeyword: "sourdough bread",
        },
      ];

      const csv = generatePinterestBulkCsv(testPins, "https://pinforge.example.com");
      const lines = csv.split("\r\n");

      // Verify headers
      expect(lines[0]).toBe("Title,Media URL,Pinterest board,Description,Link,Publish date,Keywords");

      // Verify row 1
      expect(lines[1]).toContain('"10 Cozy Scandi Bedroom Ideas"');
      expect(lines[1]).toContain('"https://pinforge.example.com/uploads/pins/test1.jpg"');
      expect(lines[1]).toContain('"Scandinavian Decor"');
      expect(lines[1]).toContain("#scandi");
      expect(lines[1]).toContain("2026-11-05T14:30:00.000Z");

      // Verify escaping of quotes in row 2
      expect(lines[2]).toContain('""Sourdough""');
    });

    it("caps description with hashtags to 500 characters", () => {
      const longDesc = "A".repeat(450);
      const hashtags = ["hugehashtag1", "hugehashtag2", "hugehashtag3", "hugehashtag4", "hugehashtag5"];

      const csv = generatePinterestBulkCsv([
        {
          id: "pin-long",
          title: "Long Desc Pin",
          imageUrl: "/uploads/pins/test.jpg",
          description: longDesc,
          hashtags,
        },
      ]);

      const row = csv.split("\r\n")[1];
      // Field 4 is description
      const descField = row.split('","')[3];
      expect(descField.length).toBeLessThanOrEqual(500);
      expect(descField.endsWith("...")).toBe(true);
    });
  });

  describe("3. Smart Image Compression (Spec Section 30.8)", () => {
    it("compresses raw image buffer using Sharp mozjpeg with file size reduction", async () => {
      // Create a test raw image with Sharp
      const sampleBuffer = await sharp({
        create: {
          width: 768,
          height: 1152,
          channels: 3,
          background: { r: 180, g: 120, b: 90 },
        },
      })
        .png()
        .toBuffer();

      const result = await compressImageBuffer(sampleBuffer, { format: "jpg", quality: 80 });

      expect(result.sizeBytes).toBeGreaterThan(0);
      expect(result.sizeBytes).toBeLessThan(sampleBuffer.length);
      expect(result.savingsPercent).toBeGreaterThan(30);
    });
  });

  describe("4. ZIP Archive Generator", () => {
    it("creates a valid ZIP buffer containing files with correct headers", () => {
      const files = [
        { filename: "test1.txt", data: Buffer.from("Hello Pinterest 1", "utf-8") },
        { filename: "test2.txt", data: Buffer.from("Hello Pinterest 2", "utf-8") },
      ];

      const zip = createZipArchive(files);

      expect(zip.length).toBeGreaterThan(0);
      // First 4 bytes must be local file header signature 0x04034b50 (PK\x03\x04)
      expect(zip.readUInt32LE(0)).toBe(0x04034b50);
      // Contains filenames in binary
      expect(zip.toString("utf-8")).toContain("test1.txt");
      expect(zip.toString("utf-8")).toContain("test2.txt");
    });
  });
});
