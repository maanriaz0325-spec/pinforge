import { describe, it, expect } from "vitest";
import {
  resolveSetting,
  hexToColorName,
  formatPaletteForPrompt,
} from "../../src/server/engine/brandKit";
import { renderOverlaySvg, OverlayConfig } from "../../src/server/engine/overlay";

describe("Phase 5: Brand Kit & Settings Precedence Engine", () => {
  describe("1. Settings Precedence Resolver (Spec Section 33.1)", () => {
    it("respects job manual overrides above all other sources", () => {
      const res = resolveSetting("aspect", {
        jobManual: { aspect: "9:16" },
        kit: { enabled: true, values: { aspect: "2:3" } },
        templateDefaults: { aspect: "1:1" },
        globalSettings: { aspect: "2:3" },
      });

      expect(res.value).toBe("9:16");
      expect(res.source).toBe("manual");
    });

    it("uses brand kit settings when kit is enabled and manual is undefined", () => {
      const res = resolveSetting("overlayPreset", {
        jobManual: {},
        kit: { enabled: true, values: { overlayPreset: "split_card" } },
        templateDefaults: { overlayPreset: "scrim_editorial" },
        globalSettings: { overlayPreset: "editorial" },
      });

      expect(res.value).toBe("split_card");
      expect(res.source).toBe("kit");
    });

    it("bypasses brand kit when kit is disabled, falling back to template defaults", () => {
      const res = resolveSetting("fontFamily", {
        jobManual: {},
        kit: { enabled: false, values: { fontFamily: "Montserrat" } },
        templateDefaults: { fontFamily: "Cormorant Garamond" },
        globalSettings: { fontFamily: "Playfair Display" },
      });

      expect(res.value).toBe("Cormorant Garamond");
      expect(res.source).toBe("template");
    });

    it("falls back to global defaults when higher layers are absent", () => {
      const res = resolveSetting("maxConcurrency", {
        jobManual: {},
        kit: null,
        templateDefaults: null,
        globalSettings: { maxConcurrency: 3 },
      });

      expect(res.value).toBe(3);
      expect(res.source).toBe("global");
    });
  });

  describe("2. Palette Color Translation & Prompt Phrasing (Spec Section 33.4)", () => {
    it("maps hex codes to natural descriptive color names", () => {
      expect(hexToColorName("#C8553D")).toBe("terracotta");
      expect(hexToColorName("#9AAC93")).toBe("sage green");
      expect(hexToColorName("#14233C")).toBe("navy blue");
      expect(hexToColorName("#F8F5EB")).toBe("cream");
    });

    it("formats 5-color palette into natural prompt phrase omitting pure blacks/whites", () => {
      const palette = ["#FFFFFF", "#2D2D30", "#C8553D", "#9AAC93", "#E1D7C3"];
      const promptPhrase = formatPaletteForPrompt(palette);

      expect(promptPhrase).toContain("cohesive color palette");
      expect(promptPhrase).toContain("terracotta");
      expect(promptPhrase).toContain("sage green");
      expect(promptPhrase).not.toContain("#");
      expect(promptPhrase).not.toContain("pure white");
    });

    it("handles empty or invalid palettes gracefully without crashing", () => {
      expect(formatPaletteForPrompt([])).toBe("");
      expect(formatPaletteForPrompt("")).toBe("");
    });
  });

  describe("3. Logo Placement & Text Collision Avoidance in Overlay (Spec Section 30.6)", () => {
    it("renders logo <image> tag with specified position and opacity", () => {
      const config: OverlayConfig = {
        canvas: { w: 768, h: 1152 },
        text: {
          content: "Minimalist Scandinavian Living",
          preset: "editorial",
          fontFamily: "Playfair Display",
          weight: 700,
          color: "#ffffff",
          align: "center",
          maxLines: 2,
          box: { x: 0.1, y: 0.1, w: 0.8, h: 0.2 },
        },
        background: { type: "none" },
        logo: {
          url: "/uploads/brand/logo_test.png",
          position: "bottom_right",
          scale: 0.14,
          opacity: 0.85,
        },
      };

      const svg = renderOverlaySvg(config);
      expect(svg).toContain('<image href="/uploads/brand/logo_test.png"');
      expect(svg).toContain('opacity="0.85"');
    });

    it("shifts logo to opposite vertical position if collision with text box occurs", () => {
      // Place text box directly over the bottom right corner
      const config: OverlayConfig = {
        canvas: { w: 768, h: 1152 },
        text: {
          content: "Colliding Headline",
          preset: "editorial",
          fontFamily: "Playfair Display",
          weight: 700,
          color: "#ffffff",
          align: "center",
          maxLines: 2,
          box: { x: 0.5, y: 0.8, w: 0.48, h: 0.18 }, // directly on bottom right
        },
        background: { type: "none" },
        logo: {
          url: "/uploads/brand/logo_test.png",
          position: "bottom_right",
          scale: 0.14,
          opacity: 0.9,
        },
      };

      const svg = renderOverlaySvg(config);
      expect(svg).toContain('<image href="/uploads/brand/logo_test.png"');
      // When colliding with bottom, logo shifts to top margin (y < 200)
      const yMatch = svg.match(/<image[^>]*y="([^"]+)"/);
      expect(yMatch).not.toBeNull();
      const yValue = parseFloat(yMatch![1]);
      expect(yValue).toBeLessThan(300); // Shifted to top!
    });
  });
});
