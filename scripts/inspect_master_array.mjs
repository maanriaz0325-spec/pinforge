import fs from "fs";

const txt = fs.readFileSync("c:/Users/Hp/Downloads/Forge/.temp_apd/app-BAn9QVgC.js", "utf-8");

console.log("Master array snippet around 583800:");
console.log(txt.slice(583600, 584300));
