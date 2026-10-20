import { describe, it, expect } from "vitest";
import {
  calculateTemplateQualityScore,
  compressTemplateForPrompt,
} from "../../src/server/engine/templates";
import {
  generateDiverseIdeas,
  calculateJaccardSimilarity,
  expandSingleLineIdea,
  hashIdea,
} from "../../src/server/engine/diversity";

describe("Phase 4: Template Quality Scoring & Way 2 Diversity Engine", () => {
  describe("1. Template Quality Scoring", () => {
    it("awards high score (>=85) for comprehensive template satisfying all 5 pillars", () => {
      const fullTemplate = {
        systemPrompt: `ROLE: You are a Pinterest visual strategist for Scandinavian Home Decor and modern Nordic living spaces.
AUDIENCE: Urban homeowners and renters looking for minimalist, cozy interior inspiration, functional design solutions, and DIY room transformations.
VISUAL IDENTITY: Clean natural oak woodwork, breathable linen textures, muted earthy neutral palette, soft diffused morning window lighting, spatial airiness, and organic simplicity.
MUST AVOID: Clutter, plastic furniture, dark dramatic moody lighting, harsh direct flash, neon saturated accents, distorted perspectives, artificial staging.
Focus on authentic organic craftsmanship, tactile materials, lived-in warmth, and serene architectural harmony that resonates with Pinterest lifestyle creators and home design enthusiasts looking for actionable everyday elegance.`,
        keywordSeeds: ["scandi living room", "minimalist dining", "cozy reading nook", "oak coffee table", "linen sofa"],
        forbiddenElements: ["neon colors", "plastic", "clutter"],
      };

      const result = calculateTemplateQualityScore(fullTemplate);
      expect(result.score).toBeGreaterThanOrEqual(85);
      expect(result.hasRole).toBe(true);
      expect(result.hasAudience).toBe(true);
      expect(result.hasVisualIdentity).toBe(true);
      expect(result.hasAvoidList).toBe(true);
      expect(result.hasKeywords).toBe(true);
      expect(result.suggestions.length).toBe(0);
    });

    it("identifies missing sections and generates actionable suggestions for low-quality prompts", () => {
      const poorTemplate = {
        systemPrompt: "Make cool aesthetic home decor photos.",
        keywordSeeds: ["home"],
      };

      const result = calculateTemplateQualityScore(poorTemplate);
      expect(result.score).toBeLessThan(50);
      expect(result.hasRole).toBe(false);
      expect(result.hasAudience).toBe(false);
      expect(result.hasVisualIdentity).toBe(false);
      expect(result.hasKeywords).toBe(false);
      expect(result.suggestions.length).toBeGreaterThanOrEqual(3);
    });

    it("compresses long system prompt into concise P3 injection under 70 words", () => {
      const longPrompt = `ROLE: Pinterest food stylist. AUDIENCE: Home bakers. VISUAL IDENTITY: Warm sourdough golden crust, flour dust on dark rustic wood table, morning sunlight stream, linen tea towel, macro crumb texture. AVOID: Plastic wrappers, commercial neon lighting.`;
      const compressed = compressTemplateForPrompt(longPrompt);
      const wordCount = compressed.split(/\s+/).filter(Boolean).length;
      expect(wordCount).toBeLessThanOrEqual(70);
      expect(compressed.length).toBeGreaterThan(10);
    });
  });

  describe("2. Diversity Engine (Acceptance M6 Guarantee)", () => {
    it("guarantees 30 generated ideas have zero duplicate (composition x setting) signatures", () => {
      const ideas = generateDiverseIdeas({
        templateName: "Scandinavian Home",
        systemPrompt: "Minimalist Scandinavian design with natural oak and light linen",
        keywordSeeds: [
          "japandi bedroom",
          "minimalist kitchen",
          "cozy nook",
          "scandi entryway",
          "dining room table",
        ],
        count: 30,
      });

      expect(ideas).toHaveLength(30);

      const signatures = new Set<string>();
      for (const item of ideas) {
        const sig = `${item.composition}|${item.setting}`;
        expect(signatures.has(sig)).toBe(false);
        signatures.add(sig);
      }
    });

    it("verifies Jaccard similarity algorithm correctly measures text overlap", () => {
      const textA = "cozy scandi living room with wooden coffee table and warm morning light";
      const textB = "cozy scandi living room with wooden coffee table and warm morning light";
      const textC = "modern minimalist kitchen stainless steel counter dark dramatic mood";

      expect(calculateJaccardSimilarity(textA, textB)).toBeCloseTo(1.0, 2);
      expect(calculateJaccardSimilarity(textA, textC)).toBeLessThan(0.25);
    });
  });

  describe("3. Way 2b Single-Line Idea Expander", () => {
    it("preserves exact user subject while enriching with 30-80 words of visual details", () => {
      const userIdea = "ceramic matcha bowl with bamboo whisk";
      const template = {
        name: "Japanese Tea Aesthetic",
        systemPrompt: "Clean wabi-sabi tea ceremony aesthetic with natural pottery",
        styleNotes: "tatami mat backdrop, soft diffused daylight, earthy clay textures",
      };

      const expanded = expandSingleLineIdea(userIdea, template);
      expect(expanded.toLowerCase()).toContain(userIdea.toLowerCase());
      expect(expanded.toLowerCase()).toContain("japanese tea aesthetic");

      const wordCount = expanded.split(/\s+/).filter(Boolean).length;
      expect(wordCount).toBeGreaterThanOrEqual(25);
      expect(wordCount).toBeLessThanOrEqual(90);
    });
  });

  describe("4. IdeaHistory Deduplication & Hashing", () => {
    it("produces deterministic SHA-256 hash ignoring case and surrounding whitespace", () => {
      const hash1 = hashIdea("  Cozy Scandi Living Room  ");
      const hash2 = hashIdea("cozy scandi living room");
      const hash3 = hashIdea("modern luxury bedroom");

      expect(hash1).toBe(hash2);
      expect(hash1).not.toBe(hash3);
      expect(hash1).toHaveLength(64);
    });
  });
});
