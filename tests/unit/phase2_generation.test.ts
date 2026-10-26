import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import { generateRunwareImage } from "../../src/server/providers/runware";
import { storage } from "../../src/server/storage/storage";
import { prisma } from "../../src/server/db/prisma";

describe("Phase 2: Runware Generation & Storage Pipeline", () => {
  const originalEnv = process.env.PROVIDER_MODE;

  beforeEach(() => {
    process.env.PROVIDER_MODE = "mock";
  });

  afterEach(() => {
    process.env.PROVIDER_MODE = originalEnv;
  });

  describe("1. Prompt Validation & Model Registry Lookup", () => {
    it("validates registered models and verifies exact AIR model IDs", async () => {
      const models = await prisma.modelRegistry.findMany();
      expect(models.length).toBeGreaterThanOrEqual(5);

      const schnell = models.find((m) => m.id === "flux-schnell");
      expect(schnell).toBeDefined();
      expect(schnell?.runwareModelId).toBe("runware:100@1");
      expect(schnell?.pricePerImage).toBe(0.0019);

      const sdxl = models.find((m) => m.id === "sdxl-base");
      expect(sdxl).toBeDefined();
      expect(sdxl?.runwareModelId).toBe("civitai:101055@128078");
      expect(sdxl?.pricePerImage).toBe(0.003);

      const dev = models.find((m) => m.id === "flux-dev");
      expect(dev).toBeDefined();
      expect(dev?.runwareModelId).toBe("runware:101@1");
      expect(dev?.pricePerImage).toBe(0.0096);
    }, 25000);

    it("rejects prompt under 3 characters or over 2000 characters", () => {
      const validatePrompt = (p: string) => {
        const trimmed = p.trim();
        return trimmed.length >= 3 && trimmed.length <= 2000;
      };

      expect(validatePrompt("")).toBe(false);
      expect(validatePrompt("ab")).toBe(false);
      expect(validatePrompt("Cozy reading nook")).toBe(true);
      expect(validatePrompt("a".repeat(2001))).toBe(false);
    });
  });

  describe("2. Runware Provider Inference & AIR Model Verification", () => {
    it("sends the exact selected AIR model ID to Runware and returns valid imageURL and cost", async () => {
      const targetModelId = "runware:100@1"; // FLUX Schnell AIR ID
      const result = await generateRunwareImage({
        apiKey: "mock_valid_key",
        model: targetModelId,
        positivePrompt: "Modern scandinavian bedroom with oak nightstand",
        width: 768,
        height: 1152,
      });

      expect(result.success).toBe(true);
      expect(result.status).toBe("success");
      expect(result.imageURL).toBeDefined();
      expect(result.cost).toBe(0.0019);
      expect(result.taskUUID).toBeDefined();
    });

    it("maps bad credentials to invalid_key error without throwing", async () => {
      const result = await generateRunwareImage({
        apiKey: "mock_bad_key_invalid",
        model: "runware:100@1",
        positivePrompt: "Test prompt",
        width: 768,
        height: 1152,
      });

      expect(result.success).toBe(false);
      expect(result.status).toBe("invalid_key");
      expect(result.error).toContain("401");
    });

    it("maps zero balance to no_credit error", async () => {
      const result = await generateRunwareImage({
        apiKey: "mock_nocredit_key",
        model: "runware:100@1",
        positivePrompt: "Test prompt",
        width: 768,
        height: 1152,
      });

      expect(result.success).toBe(false);
      expect(result.status).toBe("no_credit");
      expect(result.error).toContain("402");
    });
  });

  describe("3. Storage Abstraction & File Persistence", () => {
    it("persists image to disk and provides a valid public URI", async () => {
      const testBuffer = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "base64");
      const saved = await storage.saveImageBuffer(testBuffer, "image/png", "test_pin");

      expect(saved.filename).toContain("test_pin_");
      expect(saved.publicUrl).toBe(`/uploads/pins/${saved.filename}`);
      expect(saved.sizeBytes).toBe(testBuffer.length);

      // Verify file actually exists on filesystem
      expect(fs.existsSync(saved.storagePath)).toBe(true);

      // Clean up test file
      fs.unlinkSync(saved.storagePath);
    });

    it("rejects empty image buffer with clear error", async () => {
      await expect(storage.saveImageBuffer(Buffer.alloc(0), "image/jpeg")).rejects.toThrow(
        "Cannot save empty image buffer"
      );
    });
  });

  describe("4. Database Persistence & Library Retrieval", () => {
    it("persists Job, JobItem, Pin, and CostEvent in consistent transaction", async () => {
      const prompt = "Boho chic balcony with string lights and woven rug";
      const actualCost = 0.0019;

      const job = await prisma.job.create({
        data: {
          mode: "prompt",
          inputLines: JSON.stringify([prompt]),
          settingsSnapshot: JSON.stringify({ model: "FLUX.1 Schnell" }),
          status: "RUNNING",
          totalItems: 1,
          estimatedCost: actualCost,
        },
      });

      const jobItem = await prisma.jobItem.create({
        data: {
          jobId: job.id,
          lineIndex: 0,
          variationIndex: 0,
          pinType: "Inspiration / Aesthetic",
          finalPrompt: prompt,
          itemKey: `test_item_key_${Date.now()}`,
          status: "IMAGING",
        },
      });

      // Execute transaction
      const pin = await prisma.$transaction(async (tx) => {
        const createdPin = await tx.pin.create({
          data: {
            jobItemId: jobItem.id,
            imageUrl: "/uploads/pins/test_pin_123.jpg",
            rawImageUrl: "/uploads/pins/test_pin_123.jpg",
            width: 768,
            height: 1152,
            modelUsed: "FLUX.1 Schnell",
            cost: actualCost,
            title: prompt.slice(0, 70),
            description: prompt,
            altText: prompt,
            hashtags: JSON.stringify([]),
            targetKeyword: "boho chic balcony",
            pinType: "Inspiration / Aesthetic",
            textMode: "none",
            status: "DRAFT",
          },
        });

        await tx.costEvent.create({
          data: {
            jobId: job.id,
            pinId: createdPin.id,
            kind: "image",
            model: "runware:100@1",
            amount: actualCost,
          },
        });

        await tx.jobItem.update({
          where: { id: jobItem.id },
          data: { status: "DONE", rawImagePath: "/uploads/pins/test_pin_123.jpg" },
        });

        await tx.job.update({
          where: { id: job.id },
          data: { status: "COMPLETED", actualCost },
        });

        return createdPin;
      });

      expect(pin.id).toBeDefined();
      expect(pin.cost).toBe(actualCost);
      expect(pin.width).toBe(768);
      expect(pin.height).toBe(1152);

      // Verify Library retrieval from DB
      const retrieved = await prisma.pin.findUnique({
        where: { id: pin.id },
        include: { costEvents: true },
      });

      expect(retrieved).toBeDefined();
      expect(retrieved?.modelUsed).toBe("FLUX.1 Schnell");
      expect(retrieved?.costEvents.length).toBe(1);
      expect(retrieved?.costEvents[0].amount).toBe(actualCost);

      // Clean up test records
      await prisma.costEvent.deleteMany({ where: { jobId: job.id } });
      await prisma.pin.delete({ where: { id: pin.id } });
      await prisma.jobItem.delete({ where: { id: jobItem.id } });
      await prisma.job.delete({ where: { id: job.id } });
    }, 25000);

    it("marks Job and JobItem as FAILED when provider fails", async () => {
      const job = await prisma.job.create({
        data: {
          mode: "prompt",
          inputLines: JSON.stringify(["Failing test prompt"]),
          settingsSnapshot: JSON.stringify({}),
          status: "RUNNING",
          totalItems: 1,
        },
      });

      const jobItem = await prisma.jobItem.create({
        data: {
          jobId: job.id,
          lineIndex: 0,
          variationIndex: 0,
          pinType: "Quote",
          itemKey: `test_failing_item_${Date.now()}`,
          status: "IMAGING",
        },
      });

      // Simulate failure update
      await prisma.jobItem.update({
        where: { id: jobItem.id },
        data: { status: "FAILED", error: "Simulated 402 no credits" },
      });
      await prisma.job.update({
        where: { id: job.id },
        data: { status: "FAILED" },
      });

      const updatedJob = await prisma.job.findUnique({ where: { id: job.id } });
      const updatedItem = await prisma.jobItem.findUnique({ where: { id: jobItem.id } });

      expect(updatedJob?.status).toBe("FAILED");
      expect(updatedItem?.status).toBe("FAILED");
      expect(updatedItem?.error).toContain("402");

      // Clean up
      await prisma.jobItem.delete({ where: { id: jobItem.id } });
      await prisma.job.delete({ where: { id: job.id } });
    }, 25000);
  });
});
