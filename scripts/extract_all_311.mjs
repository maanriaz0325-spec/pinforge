import fs from "fs";

const txt = fs.readFileSync("c:/Users/Hp/Downloads/Forge/.temp_apd/app-BAn9QVgC.js", "utf-8");

// Let's inspect the Luxe Hair templates around index 540000 to 550000
const luxeSnippet = txt.slice(537600, 548000);
console.log("=== LUXE SNIPPET SAMPLE (first 1000 chars) ===");
console.log(luxeSnippet.slice(0, 1000));

// Let's inspect the Viral templates around index 550000 to 560000
const viralSnippet = txt.slice(551200, 560000);
console.log("=== VIRAL SNIPPET SAMPLE (first 1000 chars) ===");
console.log(viralSnippet.slice(0, 1000));
