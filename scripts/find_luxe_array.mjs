import fs from "fs";

const txt = fs.readFileSync("c:/Users/Hp/Downloads/Forge/.temp_apd/app-BAn9QVgC.js", "utf-8");

const luxePos = txt.indexOf("luxe-medium-two-line");
console.log("luxe-medium-two-line at:", luxePos);
console.log("Snippet before luxe-medium-two-line (500 chars):");
console.log(txt.slice(luxePos - 500, luxePos));

console.log("Snippet after luxe-medium-two-line (1000 chars):");
console.log(txt.slice(luxePos, luxePos + 1000));
