import fs from "fs";
import path from "path";

const jsPath = path.resolve("../.temp_apd/app-BAn9QVgC.js");
const js = fs.readFileSync(jsPath, "utf-8");

console.log("Analyzing all collections in AutoPinDesign client bundle...");

// Search for all template definitions where id is declared
const idRegex = /\{id:"([a-zA-Z0-9_\-]+)",name:(?:"([^"]+)"|'([^']+)')/g;
let match;
const allFound = [];
const seenIds = new Set();

while ((match = idRegex.exec(js)) !== null) {
  const id = match[1];
  const name = match[2] || match[3] || "";
  if (!seenIds.has(id)) {
    seenIds.add(id);
    allFound.push({ id, name, index: match.index });
  }
}

console.log("Total unique template id declarations found:", allFound.length);
console.log("\nSample 25 templates found across all collections:");
console.log(allFound.slice(0, 25).map((t, i) => `${i + 1}. [${t.id}] ${t.name}`));
