import fs from "fs";
import path from "path";

const dir = path.resolve("./.temp_apd");
const appJs = fs.readFileSync(path.join(dir, "app-BAn9QVgC.js"), "utf8");

// Search for route definitions or dynamic imports like () => import(...)
const importRegex = /import\s*\(\s*["']([^"']+)["']\s*\)/g;
let m;
const imports = new Set();
while ((m = importRegex.exec(appJs)) !== null) {
  imports.add(m[1]);
}
console.log("Dynamic imports in app.js:", Array.from(imports));

// Search for references to "templates" or "Templates"
const templateMatches = [];
const lines = appJs.split(";");
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("/templates") || lines[i].includes("TemplatesPage") || lines[i].includes("template")) {
    // print a snippet
    if (lines[i].length < 300) {
      templateMatches.push(lines[i]);
    } else {
      const idx = lines[i].indexOf("templates");
      templateMatches.push(lines[i].substring(Math.max(0, idx - 100), Math.min(lines[i].length, idx + 200)));
    }
  }
}
console.log("Template snippets found:", templateMatches.slice(0, 10));

// Also find all asset filenames in appJs matching [a-zA-Z0-9]+-[a-zA-Z0-9]+\.js
const assetRegex = /([a-zA-Z0-9_-]+-[a-zA-Z0-9_-]{8}\.js)/g;
const allAssets = new Set();
while ((m = assetRegex.exec(appJs)) !== null) {
  allAssets.add(m[1]);
}
console.log("All chunk assets found in app.js:", Array.from(allAssets));
