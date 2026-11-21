import fs from "fs";
import path from "path";

const jsPath = path.resolve("../.temp_apd/app-BAn9QVgC.js");
const js = fs.readFileSync(jsPath, "utf-8");

// Let's find all template definitions in app-BAn9QVgC.js
// Template layout mapping for imageCount
function getImageCountForLayout(layoutId) {
  if (!layoutId) return 1;
  const l = layoutId.toLowerCase();
  if (l === "single" || l.includes("single") || l === "pin-standard" || l === "pin-square") return 1;
  if (l === "two-side" || l === "two-stack" || l === "two-hero" || l === "band-1-1") return 2;
  if (l === "three-hero-top" || l === "three-hero-left" || l === "three-rows" || l === "three-cols" || l === "band-1-2" || l === "band-2-1") return 3;
  if (l === "grid-2x2" || l === "band-2-2" || l === "hero-4" || l === "four-cols" || l === "four-rows") return 4;
  if (l === "band-2-3" || l === "two-top-three-bottom" || l === "three-top-two-bottom" || l === "center-hero") return 5;
  if (l === "band-2-4" || l === "grid-2x3" || l === "hero-top-grid-6" || l === "top2-gap-grid4" || l === "top2-band-grid4" || l === "grid4-band-2" || l === "band-3-3") return 6;
  return 4;
}

// Let's extract all template objects
const existingTemplates = JSON.parse(fs.readFileSync("./src/server/data/apd_templates.json", "utf-8"));
console.log("Current existing templates:", existingTemplates.length);

// Let's enrich every template so that NONE of them has clean-overlay / plain white text
let fixedCount = 0;
for (const t of existingTemplates) {
  const layout = t.layoutId || "single";
  t.imageCount = getImageCountForLayout(layout);

  if (!t.visualConfig) {
    t.visualConfig = {};
  }

  // If blockStyle is clean-overlay or missing, assign a rich, stylish designing archetype!
  if (!t.visualConfig.blockStyle || t.visualConfig.blockStyle === "clean-overlay") {
    fixedCount++;
    const id = t.id.toLowerCase();
    const name = t.name.toLowerCase();

    if (id.includes("luxe") || id.includes("hair") || name.includes("luxe") || name.includes("hair")) {
      t.visualConfig.blockStyle = "luxe-stepped-boxes";
      t.visualConfig.bandColor = t.visualConfig.bandColor || "#EFE6DB";
      t.visualConfig.badge = t.visualConfig.badge || { text: "50", shape: "white-box", bg: "#FFFFFF", color: "#111111" };
    } else if (id.includes("viral") || name.includes("viral") || id.includes("script") || name.includes("script")) {
      t.visualConfig.blockStyle = "viral-badge-script";
      t.visualConfig.bandColor = t.visualConfig.bandColor || "#FFFFFF";
      t.visualConfig.accentColor = t.visualConfig.accentColor || "#C92A2A";
      t.visualConfig.scriptWord = t.visualConfig.scriptWord || "Chic";
      t.visualConfig.badge = t.visualConfig.badge || { text: "32", shape: "circle", bg: "#C92A2A", color: "#FFFFFF" };
    } else if (id.includes("card") || id.includes("framed") || name.includes("card") || name.includes("framed")) {
      t.visualConfig.blockStyle = "framed-card";
      t.visualConfig.bandColor = t.visualConfig.bandColor || "#FFFFFF";
      t.visualConfig.accentColor = t.visualConfig.accentColor || "#F58220";
    } else if (id.includes("black") || name.includes("black")) {
      t.visualConfig.blockStyle = "black-boxes";
      t.visualConfig.bandColor = t.visualConfig.bandColor || "#111111";
      t.visualConfig.badge = t.visualConfig.badge || { text: "30+", shape: "square", bg: "#111111", color: "#FFFFFF" };
    } else if (id.includes("band") || name.includes("band") || layout.startsWith("band-")) {
      t.visualConfig.blockStyle = "color-band-card";
      t.visualConfig.bandColor = t.visualConfig.bandColor || "#FFFFFF";
      t.visualConfig.accentColor = t.visualConfig.accentColor || "#EE1A5B";
      t.visualConfig.badge = t.visualConfig.badge || { text: "25", shape: "circle", bg: "#EE1A5B", color: "#FFFFFF" };
    } else {
      t.visualConfig.blockStyle = "magazine-editorial";
      t.visualConfig.bandColor = t.visualConfig.bandColor || "#FFFFFF";
      t.visualConfig.accentColor = t.visualConfig.accentColor || "#111111";
      t.visualConfig.badge = t.visualConfig.badge || { text: "10+", shape: "pill", bg: "#111111", color: "#FFFFFF" };
    }
  }
}

console.log(`Enriched ${fixedCount} templates that previously had generic clean-overlay!`);
fs.writeFileSync("./src/server/data/apd_templates.json", JSON.stringify(existingTemplates, null, 2), "utf-8");
console.log("Updated apd_templates.json successfully!");
