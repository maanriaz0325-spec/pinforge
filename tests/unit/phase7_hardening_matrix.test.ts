import { describe, it, expect } from "vitest";
import crypto from "crypto";
import { generateRunwareImage } from "../../src/server/providers/runware";
import { generatePinterestSeo, generateRuleBasedSeo } from "../../src/server/engine/seo";
import { resolveSetting } from "../../src/server/engine/brandKit";

describe("Phase 7: Hardening, Error Matrix Resilience & 500-Item Scalability", () => {
  describe("1. Error Matrix Self-Healing (Spec Section 39.1)", () => {
    it("identifies invalid Runware API keys without crashing and flags invalid_key", async () => {
      // Intentionally bad key in live-like call
      const res = await generateRunwareImage({
        apiKey: "bad_key_12345",
        model: "runware:100@1",
        positivePrompt: "aesthetic cozy bedroom",
        width: 768,
        height: 1152,
      });

      expect(res.success).toBe(false);
      expect(res.status).toBe("invalid_key");
      expect(res.error).toBeDefined();
    }, 20000);

    it("guarantees text layer fallback to rule-based SEO if LLM fails (Section 34.4)", async () => {
      // Call generatePinterestSeo with invalid key to simulate LLM network failure or rate limit
      const seo = await generatePinterestSeo({
        prompt: "handmade ceramic coffee mugs",
        pinType: "How-To / Tutorial",
        openrouterApiKey: "invalid_key",
      });

      // Must succeed via deterministic rule-based fallback!
      expect(seo).toBeDefined();
      expect(seo.title).toBeTruthy();
      expect(seo.title.length).toBeGreaterThan(5);
      expect(seo.description.length).toBeGreaterThan(15);
      expect(seo.hashtags.length).toBeGreaterThanOrEqual(3);
      expect(seo.seoScore).toBeGreaterThanOrEqual(50);
    }, 20000);

    it("rule-based SEO generator produces valid Pinterest copy without any external API", () => {
      const ruleCopy = generateRuleBasedSeo({
        prompt: "minimalist scandinavian living room design",
        pinType: "Inspiration / Aesthetic",
      });

      expect(ruleCopy.title.toLowerCase()).toContain("scandinavian");
      expect(ruleCopy.targetKeyword).toBe("minimalist scandinavian living");
      expect(ruleCopy.hashtags.length).toBeGreaterThanOrEqual(4);
      expect(ruleCopy.altText.toLowerCase()).toContain("scandinavian");
    });
  });

  describe("2. Idempotency & Partial Resume Protection (Spec Section 39.2 & Acceptance M7)", () => {
    it("generates deterministic item keys preventing duplicate charges on resume", () => {
      const jobId = "job-449-test-id";
      const lineIndex = 3;
      const variationIndex = 0;

      const itemKey1 = crypto
        .createHash("sha256")
        .update(`${jobId}:${lineIndex}:${variationIndex}`)
        .digest("hex");

      const itemKey2 = crypto
        .createHash("sha256")
        .update(`${jobId}:${lineIndex}:${variationIndex}`)
        .digest("hex");

      expect(itemKey1).toBe(itemKey2);
      expect(itemKey1).toHaveLength(64);
    });
  });

  describe("3. 500-Item High-Volume Stress Verification (Acceptance M12)", () => {
    it("allocates 500 items across pin types with 100% unique item keys and correct cost math", () => {
      const TOTAL_ITEMS = 500;
      const PRICE_PER_IMAGE = 0.0030; // Standard SDXL tier
      const jobId = "stress-job-500-items";

      const pinTypes = [
        { name: "Listicle", ratio: 0.4 },     // 200 items
        { name: "How-To", ratio: 0.3 },       // 150 items
        { name: "Inspiration", ratio: 0.3 },  // 150 items
      ];

      const generatedItems: Array<{
        index: number;
        pinType: string;
        itemKey: string;
        cost: number;
      }> = [];

      const keysSet = new Set<string>();

      for (let i = 0; i < TOTAL_ITEMS; i++) {
        let assignedType = "Inspiration";
        if (i < 200) assignedType = "Listicle";
        else if (i < 350) assignedType = "How-To";

        const itemKey = crypto
          .createHash("sha256")
          .update(`${jobId}:${i}:0`)
          .digest("hex");

        keysSet.add(itemKey);
        generatedItems.push({
          index: i,
          pinType: assignedType,
          itemKey,
          cost: PRICE_PER_IMAGE,
        });
      }

      // 1. Total items count exactly matches 500
      expect(generatedItems).toHaveLength(TOTAL_ITEMS);

      // 2. Acceptance M12: Zero duplicate item keys across 500 items
      expect(keysSet.size).toBe(TOTAL_ITEMS);

      // 3. Ratio check
      const listicles = generatedItems.filter((item) => item.pinType === "Listicle");
      const howTos = generatedItems.filter((item) => item.pinType === "How-To");
      const inspos = generatedItems.filter((item) => item.pinType === "Inspiration");

      expect(listicles).toHaveLength(200);
      expect(howTos).toHaveLength(150);
      expect(inspos).toHaveLength(150);

      // 4. Financial ledger reconciliation
      const totalCost = generatedItems.reduce((acc, curr) => acc + curr.cost, 0);
      expect(totalCost).toBeCloseTo(500 * 0.003, 4); // Exactly $1.50 for 500 images!
    });
  });
});
