import fs from "fs";

const txt = fs.readFileSync("c:/Users/Hp/Downloads/Forge/.temp_apd/app-BAn9QVgC.js", "utf-8");

// Search where Fw (Viral) or Luxe or other arrays are used:
const matches = [...txt.matchAll(/(\w+)\s*=\s*\[\s*j\(/g)];
console.log("Arrays starting with [ j(:", matches.map(m => m[1]));

// Let's search where Fw is referenced:
const fwPos = txt.indexOf("Fw=");
if (fwPos !== -1) {
  console.log("Fw declaration snippet:", txt.slice(fwPos, fwPos + 500));
}

// Search where all templates are exported / put together:
const allArrayMatch = txt.match(/const\s+(\w+)\s*=\s*\[\.\.\.(\w+),\s*\.\.\.(\w+)/);
if (allArrayMatch) {
  console.log("Spread array match:", allArrayMatch[0]);
}

// Search where routes or Pin templates store is initialized:
const templatesVarMatches = [...txt.matchAll(/templates:\s*(\w+)/g)];
console.log("templates: var:", templatesVarMatches.map(m => m[1]));
