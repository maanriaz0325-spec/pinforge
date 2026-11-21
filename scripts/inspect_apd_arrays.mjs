import fs from "fs";
import path from "path";

const jsPath = path.resolve("../.temp_apd/app-BAn9QVgC.js");
const js = fs.readFileSync(jsPath, "utf-8");

// Let's find where er is defined
const erIdx = js.indexOf("er=[");
console.log("er=[ substring:", js.slice(erIdx, erIdx + 200));

// Let's inspect definitions of tw, sw, rw, fw, yw, ww, xw, Fw, Sw, kw, Gb, Hb
const vars = ["tw", "sw", "rw", "fw", "yw", "ww", "xw", "Fw", "Sw", "kw", "Gb", "Hb", "Wi"];
for (const v of vars) {
  const vRegex = new RegExp(`(?:const|let|var)?\\s*${v}\\s*=\\s*(\\[|\\()`);
  const match = js.match(vRegex);
  if (match) {
    const idx = match.index;
    console.log(`\n=== Variable ${v} ===`);
    console.log(js.slice(idx, idx + 250));
  } else {
    console.log(`Variable ${v} not found with simple pattern`);
  }
}
