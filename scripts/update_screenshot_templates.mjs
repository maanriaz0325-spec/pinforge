import fs from "fs";
import path from "path";

const filePath = path.resolve("./src/server/data/apd_templates.json");
const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

// Screenshot 1 & 2 exact template definitions
const exactTemplates = [
  // Screenshot 1 - Template 1
  {
    id: "luxe-medium-two-line",
    name: "Luxe Hair — Two-Line Caps & Italic Pills",
    description: "Luxe Hair Collection: Recreated from top-performing viral Pinterest pin with high-CTR typography boxes.",
    primaryCategory: "Hair & Beauty",
    categories: ["Hair", "Beauty", "Listicle", "Viral"],
    designTypes: ["two-side", "number-badge", "listicle", "luxe-hair"],
    width: 736,
    height: 1472,
    aspectRatio: "1:2",
    layoutId: "two-side",
    collageGap: 4,
    fonts: ["Didot", "Playfair Display", "Montserrat"],
    colors: ["#FFFFFF", "#111111", "#EFE6DB", "#8F9A7E"],
    layerTexts: [
      "50",
      "MEDIUM LENGTH",
      "HAIRSTYLE IDEAS",
      "That Work for",
      "Every Hair Type"
    ],
    headlinePreview: "50 MEDIUM LENGTH HAIRSTYLE IDEAS That Work for Every Hair Type",
    visualConfig: {
      badge: {
        text: "50",
        shape: "white-box",
        bg: "#FFFFFF",
        color: "#111111"
      },
      blockStyle: "luxe-stepped-boxes",
      bandColor: "#EFE6DB",
      accentColor: "#111111",
      scriptWord: "That Work for",
      photoTheme: "hair",
      abstractCollage: true
    }
  },
  // Screenshot 1 - Template 2
  {
    id: "luxe-short-over-50",
    name: "Luxe Hair — Stacked Caps, Italic Accent & Modern Box",
    description: "Luxe Hair Collection: Recreated from top-performing viral Pinterest pin with high-CTR typography boxes.",
    primaryCategory: "Hair & Beauty",
    categories: ["Hair", "Beauty", "Listicle", "Viral"],
    designTypes: ["two-side", "number-badge", "listicle", "luxe-hair"],
    width: 736,
    height: 1472,
    aspectRatio: "1:2",
    layoutId: "two-side",
    collageGap: 4,
    fonts: ["Didot", "Playfair Display", "Montserrat"],
    colors: ["#FFFFFF", "#111111", "#EFE6DB", "#8F9A7E"],
    layerTexts: [
      "50",
      "SHORT",
      "HAIRSTYLES",
      "for Women",
      "OVER 50",
      "That Look",
      "ABSOLUTELY MODERN"
    ],
    headlinePreview: "50 SHORT HAIRSTYLES for Women OVER 50 That Look ABSOLUTELY MODERN",
    visualConfig: {
      badge: {
        text: "50",
        shape: "white-box",
        bg: "#FFFFFF",
        color: "#111111"
      },
      blockStyle: "luxe-stacked-over-50",
      bandColor: "#EFE6DB",
      accentColor: "#111111",
      scriptWord: "for Women",
      photoTheme: "hair",
      abstractCollage: true
    }
  },
  // Screenshot 1 - Template 3
  {
    id: "luxe-trendy-black-boxes",
    name: "Luxe Hair — Black Number Box, Trendy Tag & Short Hairstyle Ideas",
    description: "Luxe Hair Collection: Recreated from top-performing viral Pinterest pin with black number box and trendy tags.",
    primaryCategory: "Hair & Beauty",
    categories: ["Hair", "Beauty", "Listicle", "Viral"],
    designTypes: ["two-side", "number-badge", "listicle", "luxe-hair"],
    width: 736,
    height: 1472,
    aspectRatio: "1:2",
    layoutId: "two-side",
    collageGap: 4,
    fonts: ["Didot", "Anton", "Montserrat"],
    colors: ["#FFFFFF", "#000000", "#EFE6DB", "#8F9A7E"],
    layerTexts: [
      "50",
      "- TRENDY -",
      "SHORT",
      "— HAIRSTYLES —",
      "IDEAS",
      "FOR EVERY WOMAN"
    ],
    headlinePreview: "50 - TRENDY - SHORT — HAIRSTYLES — IDEAS FOR EVERY WOMAN",
    visualConfig: {
      badge: {
        text: "50",
        shape: "black-box",
        bg: "#000000",
        color: "#FFFFFF"
      },
      blockStyle: "luxe-black-boxes",
      bandColor: "#000000",
      accentColor: "#000000",
      scriptWord: "- TRENDY -",
      photoTheme: "hair",
      abstractCollage: true
    }
  },
  // Screenshot 2 - Template 1
  {
    id: "viral-red-circle-mushroom",
    name: "Viral — Red Circle Number, Script & Red Outlined Keyword",
    description: "Viral Pin Collection: 4 images, 1:2 ratio, red circle badge with flowing script and bold red keyword.",
    primaryCategory: "Hair & Beauty",
    categories: ["Hair", "Beauty", "Listicle", "Viral"],
    designTypes: ["two-side", "script-bold", "number-badge", "viral-pin"],
    width: 736,
    height: 1472,
    aspectRatio: "1:2",
    layoutId: "two-side",
    collageGap: 4,
    fonts: ["Anton", "Great Vibes", "Montserrat"],
    colors: ["#C92A2A", "#111111", "#FFFFFF"],
    layerTexts: [
      "32",
      "Chic",
      "MUSHROOM",
      "BROWN HAIR IDEAS YOU'LL LOVE",
      "EASY LOOKS TO SHOW YOUR STYLIST"
    ],
    headlinePreview: "32 Chic MUSHROOM BROWN HAIR IDEAS YOU'LL LOVE EASY LOOKS TO SHOW YOUR STYLIST",
    visualConfig: {
      badge: {
        text: "32",
        shape: "circle",
        bg: "#C92A2A",
        color: "#FFFFFF"
      },
      blockStyle: "viral-badge-script",
      bandColor: "#FFFFFF",
      accentColor: "#C92A2A",
      scriptWord: "Chic",
      photoTheme: "hair",
      abstractCollage: true
    }
  },
  // Screenshot 2 - Template 2
  {
    id: "viral-big-red-number-grid",
    name: "Viral — Huge Red Number, Script & 2x2 Grid with CTA",
    description: "Viral Pin Collection: 6 images / 2x2 grid, 1:2 ratio, huge red number with script, subtitle card and CTA pill.",
    primaryCategory: "Hair & Beauty",
    categories: ["Hair", "Beauty", "Listicle", "Viral"],
    designTypes: ["grid-2x2", "script-bold", "number-badge", "viral-pin"],
    width: 736,
    height: 1472,
    aspectRatio: "1:2",
    layoutId: "grid-2x2",
    collageGap: 4,
    fonts: ["Anton", "Great Vibes", "Montserrat"],
    colors: ["#C92A2A", "#111111", "#FFFFFF"],
    layerTexts: [
      "58",
      "Gorgeous",
      "SHORT HOLIDAY",
      "HAIRSTYLES FOR WOMEN WITH BOBS AND PIXIES",
      "GET THE IDEAS"
    ],
    headlinePreview: "58 Gorgeous SHORT HOLIDAY HAIRSTYLES FOR WOMEN WITH BOBS AND PIXIES",
    visualConfig: {
      badge: {
        text: "58",
        shape: "giant-number",
        bg: "#C92A2A",
        color: "#FFFFFF"
      },
      blockStyle: "viral-grid-cta",
      bandColor: "#FFFFFF",
      accentColor: "#C92A2A",
      scriptWord: "Gorgeous",
      photoTheme: "hair",
      ctaText: "GET THE IDEAS",
      abstractCollage: true
    }
  },
  // Screenshot 2 - Template 3
  {
    id: "viral-orange-circle-modern",
    name: "Viral — Orange Circle Number, Script & Orange Outlined Keyword",
    description: "Viral Pin Collection: 4 images, 1:2 ratio, amber-orange circle badge with flowing script and orange keyword.",
    primaryCategory: "Hair & Beauty",
    categories: ["Hair", "Beauty", "Listicle", "Viral"],
    designTypes: ["two-side", "script-bold", "number-badge", "viral-pin"],
    width: 736,
    height: 1472,
    aspectRatio: "1:2",
    layoutId: "two-side",
    collageGap: 4,
    fonts: ["Anton", "Great Vibes", "Montserrat"],
    colors: ["#F58220", "#111111", "#FFFFFF"],
    layerTexts: [
      "61",
      "Modern",
      "Hairstyles",
      "for Women Over 50 That",
      "Look Absolutely Stunning"
    ],
    headlinePreview: "61 Modern Hairstyles for Women Over 50 That Look Absolutely Stunning",
    visualConfig: {
      badge: {
        text: "61",
        shape: "circle",
        bg: "#F58220",
        color: "#111111"
      },
      blockStyle: "viral-badge-script",
      bandColor: "#FFFFFF",
      accentColor: "#F58220",
      scriptWord: "Modern",
      photoTheme: "hair",
      abstractCollage: true
    }
  }
];

// Merge into data: replace if ID exists, or prepend to front
const existingMap = new Map();
for (const item of data) {
  existingMap.set(item.id, item);
}

for (const exact of exactTemplates) {
  existingMap.set(exact.id, exact);
}

// Ensure the 6 exact screenshot templates appear right at the front of the list
const result = [...exactTemplates];
for (const [id, item] of existingMap) {
  if (!exactTemplates.some((t) => t.id === id)) {
    result.push(item);
  }
}

fs.writeFileSync(filePath, JSON.stringify(result, null, 2), "utf-8");
console.log(`Updated apd_templates.json! Total templates: ${result.length}`);
