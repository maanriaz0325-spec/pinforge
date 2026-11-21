import fs from "fs";
import path from "path";

const jsPath = path.resolve("../.temp_apd/app-BAn9QVgC.js");
const js = fs.readFileSync(jsPath, "utf-8");
console.log("JS file size:", (js.length / 1024 / 1024).toFixed(2), "MB");

// Look for master template array or collections
// In AutoPinDesign, templates are defined in arrays:
// Let's search for arrays assigned to variable like: tw=..., sw=..., rw=..., fw=..., yw=..., ww=..., xw=..., Fw=..., Sw=..., kw=...
// or er=[...tw,...sw,...rw,...fw,...yw,...ww,...xw,...Fw,...Sw,...]
const erMatch = js.match(/er=\[([^\]]+)\]/);
if (erMatch) {
  console.log("Found er array definition! It merges:", erMatch[1]);
}

// Let's find all objects with id and name in the JS
const regex = /\{id:"([^"]+)",name:"([^"]+)",(?:description:"([^"]*)",)?primaryCategory:"([^"]+)"/g;
let m;
let count = 0;
const templates = [];
while ((m = regex.exec(js)) !== null) {
  count++;
  templates.push({ id: m[1], name: m[2], desc: m[3] || "", cat: m[4] });
}
console.log("Direct regex matches for {id, name, primaryCategory}:", count);
if (count > 0) {
  console.log("First 5:", templates.slice(0, 5));
  console.log("Last 5:", templates.slice(-5));
}
