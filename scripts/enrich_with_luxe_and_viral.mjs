import fs from "fs";

const js = fs.readFileSync("c:/Users/Hp/Downloads/Forge/.temp_apd/app-BAn9QVgC.js", "utf-8");
const existing = JSON.parse(fs.readFileSync("pinforge/src/server/data/apd_templates.json", "utf-8"));

console.log("Existing templates:", existing.length);

// 1. Extract Luxe Hair templates
const luxeRegex = /Wi\(\{id:\s*["']([^"']+)["'],\s*name:\s*["']([^"']+)["'],\s*boxes:\s*\[([\s\S]*?)\],\s*lines:\s*\[([\s\S]*?)\]\s*\}\)/g;
let m;
const luxeTemplates = [];
while ((m = luxeRegex.exec(js)) !== null) {
  const id = m[1];
  const name = m[2];
  const rawBoxes = m[3];
  const rawLines = m[4];

  // Extract texts from lines
  const textMatches = [...rawLines.matchAll(/text:\s*["']([^"']+)["']/g)].map(t => t[1]);
  // Check if number exists like es([315,541,257,172],185) or 50
  let num = "50";
  if (id.includes("short-over-50")) num = "50";
  else if (id.includes("trendy")) num = "50";
  else if (id.includes("spring-crimson")) num = "45";
  else if (id.includes("bixie")) num = "30";

  let layerTexts = [num, ...textMatches];
  if (layerTexts.length === 1) {
    layerTexts = [num, "TRENDY HAIRSTYLES", "IDEAS FOR 2026"];
  }

  // Determine blockStyle
  let blockStyle = "luxe-stepped-boxes";
  if (name.toLowerCase().includes("black")) {
    blockStyle = "luxe-black-boxes";
  }

  luxeTemplates.push({
    id,
    name,
    description: `Luxe Hair Collection: Recreated from top-performing viral Pinterest pin with high-CTR typography boxes.`,
    primaryCategory: "Hair & Beauty",
    categories: ["Hair", "Beauty", "Listicle", "Viral"],
    designTypes: ["collage-4", "number-badge", "listicle", "luxe-hair"],
    width: 736,
    height: 1472,
    aspectRatio: "1:2",
    layoutId: "grid-2x2",
    collageGap: 8,
    fonts: ["Didot", "Playfair Display", "Montserrat"],
    colors: ["#FFFFFF", "#111111", "#EFE6DB", "#C9A45C"],
    layerTexts,
    headlinePreview: layerTexts.join(" "),
    visualConfig: {
      badge: {
        text: num,
        shape: blockStyle === "luxe-black-boxes" ? "square" : "white-box",
        bg: blockStyle === "luxe-black-boxes" ? "#111111" : "#FFFFFF",
        color: blockStyle === "luxe-black-boxes" ? "#FFFFFF" : "#111111",
      },
      blockStyle,
      bandColor: "#EFE6DB",
      accentColor: "#C9A45C",
      scriptWord: "for Women",
      photoTheme: "hair",
      abstractCollage: true,
    },
  });
}

console.log("Extracted Luxe templates:", luxeTemplates.length);

// 2. Extract and enrich Viral Pin Collection templates
const viralConfigs = {
  "viral-red-circle-mushroom": {
    badge: { text: "32", shape: "circle", bg: "#C92A2A", color: "#FFFFFF" },
    scriptWord: "Chic",
    keyword: "MUSHROOM",
    keywordColor: "#C92A2A",
    blockStyle: "viral-badge-script",
    accentColor: "#C92A2A",
    bandColor: "#FFFFFF",
    layerTexts: ["32", "Chic", "MUSHROOM", "BROWN HAIR IDEAS YOU'LL LOVE", "EASY LOOKS TO SHOW YOUR STYLIST"],
  },
  "viral-big-red-number-grid": {
    badge: { text: "58", shape: "number-drop", bg: "#C92A2A", color: "#FFFFFF" },
    scriptWord: "Gorgeous",
    keyword: "SHORT HOLIDAY",
    keywordColor: "#C92A2A",
    cta: "GET THE IDEAS",
    blockStyle: "viral-badge-script",
    accentColor: "#C92A2A",
    bandColor: "#FFFFFF",
    layerTexts: ["58", "Gorgeous", "SHORT HOLIDAY", "HAIRSTYLES FOR WOMEN WITH BOBS AND PIXIES", "GET THE IDEAS"],
  },
  "viral-orange-circle-modern": {
    badge: { text: "61", shape: "circle", bg: "#F58220", color: "#111111" },
    scriptWord: "Modern",
    keyword: "Hairstyles",
    keywordColor: "#F58220",
    blockStyle: "viral-badge-script",
    accentColor: "#F58220",
    bandColor: "#FFFFFF",
    layerTexts: ["61", "Modern", "Hairstyles", "for Women Over 50 That Look", "ABSOLUTELY STUNNING"],
  },
  "viral-crimson-wall-decor": {
    badge: { text: "45", shape: "square", bg: "#8B0000", color: "#FFFFFF" },
    scriptWord: "Creative",
    keyword: "WALL DECOR",
    keywordColor: "#8B0000",
    blockStyle: "viral-badge-script",
    accentColor: "#8B0000",
    bandColor: "#FFFFFF",
    layerTexts: ["45", "Creative", "WALL DECOR", "IDEAS FOR EMPTY SPACES", "SEE ALL DESIGNS"],
  },
  "viral-maroon-bar-dreamy": {
    badge: { text: "25", shape: "pill", bg: "#800020", color: "#FFFFFF" },
    scriptWord: "Dreamy",
    keyword: "BEDROOM",
    keywordColor: "#800020",
    blockStyle: "viral-badge-script",
    accentColor: "#800020",
    bandColor: "#FFFFFF",
    layerTexts: ["25", "Dreamy", "BEDROOM", "AESTHETIC INSPIRATION", "EXPLORE MORE"],
  },
  "viral-pink-bar-romantic": {
    badge: { text: "18", shape: "circle", bg: "#E91E63", color: "#FFFFFF" },
    scriptWord: "Romantic",
    keyword: "OUTFITS",
    keywordColor: "#E91E63",
    blockStyle: "viral-badge-script",
    accentColor: "#E91E63",
    bandColor: "#FFFFFF",
    layerTexts: ["18", "Romantic", "OUTFITS", "CHIC CASUAL STYLE GUIDE", "SHOP THE LOOK"],
  },
};

// Update existing templates with viral configs
for (const t of existing) {
  if (viralConfigs[t.id]) {
    const vc = viralConfigs[t.id];
    t.layerTexts = vc.layerTexts;
    t.headlinePreview = vc.layerTexts.join(" ");
    t.visualConfig = {
      ...t.visualConfig,
      badge: vc.badge,
      scriptWord: vc.scriptWord,
      blockStyle: vc.blockStyle,
      accentColor: vc.accentColor,
      bandColor: vc.bandColor,
      ctaText: vc.cta,
      abstractCollage: true,
    };
  }
}

// Add Luxe templates that are not already in existing
const existingIds = new Set(existing.map(t => t.id));
let added = 0;
for (const lt of luxeTemplates) {
  if (!existingIds.has(lt.id)) {
    existing.unshift(lt);
    existingIds.add(lt.id);
    added++;
  }
}

console.log(`Added ${added} Luxe templates. Total templates now: ${existing.length}`);

fs.writeFileSync("pinforge/src/server/data/apd_templates.json", JSON.stringify(existing, null, 2), "utf-8");
console.log("Successfully updated apd_templates.json");
