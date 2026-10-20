import { describe, it, expect } from "vitest";
import { enhancePromptRules } from "@/server/engine/promptEnhancer";
import fs from "fs";
import path from "path";

describe("Prompt Enhancement & Upload Serving", () => {
  it("enhances a short idea with rich Pinterest sensory details, lighting, and composition", () => {
    const result = enhancePromptRules({
      prompt: "aesthetic ceramic coffee cup",
      style: "Editorial",
    });

    expect(result.enhancedPrompt).toContain("aesthetic ceramic coffee cup");
    expect(result.enhancedPrompt).toContain("Editorial Pinterest aesthetic");
    expect(result.enhancedPrompt).toContain("vertical 2:3 Pinterest");
    expect(result.enhancedPrompt).toContain("photorealistic editorial photography");
    expect(result.addedDetails.length).toBeGreaterThan(0);
    expect(result.enhancementTechnique).toBe("smart_rules");
  });

  it("tailors domain specifics for interior decor and recipes", () => {
    const food = enhancePromptRules({ prompt: "vegan berry smoothie bowl recipe" });
    expect(food.enhancedPrompt.toLowerCase()).toMatch(/fresh|garnish|ceramic|linen/);

    const interior = enhancePromptRules({ prompt: "scandi minimalist living room decor" });
    expect(interior.enhancedPrompt.toLowerCase()).toMatch(/architectural|space|textile|greenery|aesthetic/);
  });

  it("verifies saved uploaded pins directory exists and contains valid image assets", () => {
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "pins");
    expect(fs.existsSync(uploadsDir)).toBe(true);

    const files = fs.readdirSync(uploadsDir);
    expect(files.length).toBeGreaterThan(0);

    const imageFiles = files.filter((f) => f.endsWith(".jpg") || f.endsWith(".webp"));
    expect(imageFiles.length).toBeGreaterThan(0);
  });

  it("calculates correct dimensions for all 5 aspect ratios", async () => {
    const { getDimensionsForAspect } = await import("@/server/engine/aspectRatio");

    expect(getDimensionsForAspect("2:3")).toEqual({ width: 768, height: 1152, aspect: "2:3" });
    expect(getDimensionsForAspect("9:16")).toEqual({ width: 704, height: 1280, aspect: "9:16" });
    expect(getDimensionsForAspect("1:1")).toEqual({ width: 1024, height: 1024, aspect: "1:1" });
    expect(getDimensionsForAspect("4:5")).toEqual({ width: 768, height: 960, aspect: "4:5" });
    expect(getDimensionsForAspect("16:9")).toEqual({ width: 1024, height: 576, aspect: "16:9" });
    // Default fallback
    expect(getDimensionsForAspect(null as any)).toEqual({ width: 768, height: 1152, aspect: "2:3" });
  });

  it("extracts core keywords and generates front-loaded SEO title, 2-3 line description, hashtags, and alt text", async () => {
    const { generateRuleBasedSeo, extractCoreKeywords } = await import("@/server/engine/seo");

    const kw = extractCoreKeywords("scandinavian minimalist living room with oak wall");
    expect(kw.targetKeyword).toBe("scandinavian minimalist living");
    expect(kw.secondaryKeywords.length).toBeGreaterThanOrEqual(2);

    const seo = generateRuleBasedSeo({
      prompt: "scandinavian minimalist living room with oak wall",
      pinType: "Inspiration / Aesthetic",
    });

    // Title front-loaded with keyword
    expect(seo.title.toLowerCase()).toContain("scandinavian");
    // Description with secondary keywords and soft CTA
    expect(seo.description.length).toBeGreaterThanOrEqual(180);
    expect(seo.description.toLowerCase()).toContain("save this pin");
    // Alt text
    expect(seo.altText.toLowerCase()).toContain("scandinavian");
    // Hashtags
    expect(seo.hashtags.length).toBeGreaterThanOrEqual(3);
  });
});
