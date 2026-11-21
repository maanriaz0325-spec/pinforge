import fs from "fs";
import path from "path";

const dir = path.resolve("./.temp_apd");
const appJs = fs.readFileSync(path.join(dir, "app-BAn9QVgC.js"), "utf8");
const canvasJs = fs.readFileSync(path.join(dir, "canvas-CI2Rt12i.js"), "utf8");

// Search for template array definitions:
// In AutoPinDesign, built-in templates usually have id like "t_", "tpl_", etc., or name, description, categories, doc, etc.
console.log("Searching for built-in templates in app.js and canvas.js...");

// Look for occurrences of categories or template families
const catRegex = /categories\s*:\s*\[([^\]]+)\]/g;
let m;
const foundCategories = new Set();
while ((m = catRegex.exec(appJs)) !== null) {
  foundCategories.add(m[1]);
}
while ((m = catRegex.exec(canvasJs)) !== null) {
  foundCategories.add(m[1]);
}
console.log("Found category lists:", Array.from(foundCategories));

// Look for template objects with id, name, doc, etc.
// Let's search for patterns like {id:"...",name:"...",
const tplRegex = /\{id:["']([a-zA-Z0-9_\-]+)["'],\s*name:["']([^"']+)["'],\s*description:["']([^"']*)["'],\s*categories:\[([^\]]+)\]/g;
let count = 0;
while ((m = tplRegex.exec(appJs)) !== null) {
  count++;
  console.log(`Template in app.js [${count}]:`, m[1], "|", m[2], "|", m[4]);
}

let countCanvas = 0;
while ((m = tplRegex.exec(canvasJs)) !== null) {
  countCanvas++;
  console.log(`Template in canvas.js [${countCanvas}]:`, m[1], "|", m[2], "|", m[4]);
}

// What if the structure has properties in different order?
// e.g. name: "...", id: "..." or id: "..."
const idNameRegex = /\{id:\s*["']([tT]_[^"']+|tpl_[^"']+|[a-z0-9_-]+)["'],\s*name:\s*["']([^"']+)["']/g;
let count2 = 0;
while ((m = idNameRegex.exec(appJs)) !== null) {
  count2++;
  if (count2 <= 20) console.log(`idName in app.js [${count2}]:`, m[1], m[2]);
}

while ((m = idNameRegex.exec(canvasJs)) !== null) {
  count2++;
  if (count2 <= 20) console.log(`idName in canvas.js [${count2}]:`, m[1], m[2]);
}

console.log("Finished initial regex inspection.");
