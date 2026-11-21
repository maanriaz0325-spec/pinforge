import fs from "fs";

const txt = fs.readFileSync("c:/Users/Hp/Downloads/Forge/.temp_apd/app-BAn9QVgC.js", "utf-8");

// Search where Fw is used (excluding its declaration Fw=[...)
let pos = 0;
while ((pos = txt.indexOf("Fw", pos)) !== -1) {
  console.log("Fw at:", pos, txt.slice(pos - 30, pos + 50));
  pos += 2;
}
