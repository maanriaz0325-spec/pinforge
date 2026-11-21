import fs from "fs";

const txt = fs.readFileSync("c:/Users/Hp/Downloads/Forge/.temp_apd/app-BAn9QVgC.js", "utf-8");

for (const name of ["od", "th", "Ni"]) {
  const declRegex = new RegExp(`const\\s+${name}\\s*=\\s*([^;]+);`);
  const m = txt.match(declRegex);
  if (m) {
    console.log(`=== ${name} ===`);
    console.log(m[1].slice(0, 300));
  } else {
    // try var or let
    const regex2 = new RegExp(`(?:var|let|const)\\s+${name}\\s*=\\s*([^;]+);`);
    const m2 = txt.match(regex2);
    if (m2) {
      console.log(`=== ${name} (var/let) ===`);
      console.log(m2[1].slice(0, 300));
    }
  }
}
