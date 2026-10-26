import { describe, it, expect } from "vitest";
import {
  NICHE_STRATEGIES,
  detectNicheStrategy,
  applyNicheStrategyToPrompt,
  getNicheOverlayContent,
} from "../../src/server/engine/nicheStrategies";

describe("Standalone Niche Strategy Engine", () => {
  it("provides comprehensive strategy directives for all major niches", () => {
    expect(NICHE_STRATEGIES.hairstyles).toBeDefined();
    expect(NICHE_STRATEGIES.nails).toBeDefined();
    expect(NICHE_STRATEGIES.homedecor).toBeDefined();
    expect(NICHE_STRATEGIES.crafts).toBeDefined();
    expect(NICHE_STRATEGIES.fashion).toBeDefined();
    expect(NICHE_STRATEGIES.food).toBeDefined();
    expect(NICHE_STRATEGIES.beauty).toBeDefined();
  });

  it("detects hairstyle niche and enforces human realism, facial expression, and hair texture", () => {
    const hair = detectNicheStrategy("honey blonde balayage with curtain bangs on wavy hair");
    expect(hair.id).toBe("hairstyles");
    expect(hair.coreFocus.toLowerCase()).toContain("camera angle");
    expect(hair.coreFocus.toLowerCase()).toMatch(/three-quarter|cascade/);
    expect(hair.realismDirectives.toLowerCase()).toContain("natural skin");
    expect(hair.realismDirectives.toLowerCase()).toContain("micro-pores");
    expect(hair.realismDirectives.toLowerCase()).toContain("facial expression");
    expect(hair.negativePromptAnchors.toLowerCase()).toContain("plastic hair");
    expect(hair.negativePromptAnchors.toLowerCase()).toContain("synthetic wig");

    const enhanced = applyNicheStrategyToPrompt("honey blonde balayage with curtain bangs", { niche: "hairstyles" });
    expect(enhanced.enhancedPrompt.toLowerCase()).toMatch(/balayage|curtain bangs/);
    expect(enhanced.enhancedPrompt.toLowerCase()).toContain("staged in");
    expect(enhanced.negativePrompt.toLowerCase()).toContain("plastic hair");
  });

  it("detects nail niche and enforces real hand skin and cuticle precision", () => {
    const nails = detectNicheStrategy("glazed donut almond gel nails with chrome finish");
    expect(nails.id).toBe("nails");
    expect(nails.coreFocus.toLowerCase()).toContain("nail art precision");
    expect(nails.realismDirectives.toLowerCase()).toContain("knuckle creases");
    expect(nails.negativePromptAnchors.toLowerCase()).toContain("deformed fingers");
  });

  it("detects home decor niche and rotates unique background environments", () => {
    const decor1 = applyNicheStrategyToPrompt("minimalist living room with oak table", { variationIndex: 0 });
    const decor2 = applyNicheStrategyToPrompt("minimalist living room with oak table", { variationIndex: 1 });
    const decor3 = applyNicheStrategyToPrompt("minimalist living room with oak table", { variationIndex: 2 });

    // Verifies environment diversity across pins
    expect(decor1.environmentUsed).not.toBe(decor2.environmentUsed);
    expect(decor2.environmentUsed).not.toBe(decor3.environmentUsed);
  });

  it("detects crafting and DIY niche and emphasizes tangible artisan materials", () => {
    const craft = detectNicheStrategy("handmade air dry clay plant pot craft tutorial");
    expect(craft.id).toBe("crafts");
    expect(craft.coreFocus.toLowerCase()).toMatch(/clay|tactile|handcrafted/);
    expect(craft.realismDirectives.toLowerCase()).toContain("artisan workbench");
  });

  it("generates prompt-aware and niche-aware catchy overlay content", () => {
    const hairOverlay = getNicheOverlayContent("caramel balayage curls", { niche: "hairstyles" });
    expect(hairOverlay.kicker).toBe("HAIR INSPIRATION");
    expect(hairOverlay.mainTitle).toContain("Caramel Balayage");
    expect(hairOverlay.subtitle).toContain("dimension");
    expect(hairOverlay.iconsList?.length).toBeGreaterThanOrEqual(3);

    const decorOverlay = getNicheOverlayContent("scandi living room makeover", { niche: "homedecor" });
    expect(decorOverlay.kicker).toBe("SMALL SPACE");
    expect(decorOverlay.mainTitle).toContain("Scandi Living");
    expect(decorOverlay.footerBullets?.length).toBe(3);
  });

  it("dynamically adapts preset text and numbers to customized user niches", () => {
    // 1. Preset 17 (bold_center_badge) with Christmas prompt
    const xmasPreset = getNicheOverlayContent("35 Christmas Decor Ideas 2026", {
      preset: "bold_center_badge",
    });
    expect(xmasPreset.mainTitle.toLowerCase()).toContain("christmas decor ideas");
    expect(xmasPreset.kicker).toMatch(/2026|CHRISTMAS/);
    expect(xmasPreset.footerBullets).toContain("MORE IDEAS");

    // 2. Preset 18 (editorial_tall_script) with Nails prompt
    const nailsPreset = getNicheOverlayContent("20 Dark Purple Almond Nails That Take Minutes", {
      preset: "editorial_tall_script",
    });
    expect(nailsPreset.mainTitle.toLowerCase()).toContain("dark purple almond nails");
    expect(nailsPreset.footerBullets).toContain("THAT TAKE MINUTES");

    // 3. Preset 1 (classic_clean_travel) with Home Decor prompt (replaces "in Canada")
    const homePreset1 = getNicheOverlayContent("Scandinavian Living Room Inspo", {
      preset: "classic_clean_travel",
    });
    expect(homePreset1.accentScript).not.toBe("in Canada");
  });
});

