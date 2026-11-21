import fs from 'fs';

const appJs = fs.readFileSync('c:/Users/Hp/Downloads/Forge/.temp_apd/app-BAn9QVgC.js', 'utf8');

// Let's find how AutoPinDesign executes `layers` or what elements are in layers!
// Let's inspect helper functions: me, he, V, le, pr, Ai, Ct, Za, Di, et, Ie, H, G, Y, ke
const helpersIdx = appJs.indexOf('Gb=[');
const helperCode = appJs.substring(helpersIdx - 3500, helpersIdx + 100);
console.log('--- Helper Code ---');
console.log(helperCode);
