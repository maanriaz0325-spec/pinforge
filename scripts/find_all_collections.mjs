import fs from "fs";

const txt = fs.readFileSync("c:/Users/Hp/Downloads/Forge/.temp_apd/app-BAn9QVgC.js", "utf-8");

// Search for all template definitions: id: "..." or Wi({id: "..." or j({id: "..."
const regex = /(?:id:\s*["']([a-zA-Z0-9_\-]+)["'],\s*name:\s*["']([^"']+)["'])/g;
let match;
const found = [];
while ((match = regex.exec(txt)) !== null) {
  found.push({ id: match[1], name: match[2], index: match.index });
}

console.log("Total matched template definitions:", found.length);
const ids = new Set(found.map(f => f.id));
console.log("Unique ids:", ids.size);

// Print samples from different parts of the file
console.log("First 5:", found.slice(0, 5));
console.log("Middle samples:", found.slice(150, 155));
console.log("Luxe samples:", found.filter(f => f.name.includes("Luxe")));
console.log("Viral samples:", found.filter(f => f.name.includes("Viral")));
console.log("Last 10:", found.slice(-10));
