import fs from "fs";
import path from "path";

const jsPath = path.resolve("../.temp_apd/app-BAn9QVgC.js");
const js = fs.readFileSync(jsPath, "utf-8");

const idRegex = /\{id:"([a-zA-Z0-9_\-]+)",name:(?:"([^"]+)"|'([^']+)')/g;
let match;
const templates = [];
const seen = new Set();

while ((match = idRegex.exec(js)) !== null) {
  const id = match[1];
  const name = match[2] || match[3] || "";
  if (!seen.has(id)) {
    seen.add(id);
    templates.push({ id, name, index: match.index });
  }
}

console.log("Templates 25 to 100:");
for (let i = 25; i < Math.min(templates.length, 120); i++) {
  console.log(`${i + 1}. [${templates[i].id}] ${templates[i].name}`);
}
