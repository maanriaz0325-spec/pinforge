import fs from 'fs';

const appJs = fs.readFileSync('c:/Users/Hp/Downloads/Forge/.temp_apd/app-BAn9QVgC.js', 'utf8');

// Find all function calls inside layers:
const layersRegex = /layers:\s*(?:\([^)]*\)|[a-zA-Z0-9_$]+)\s*=>/g;
let m;
const callSet = new Set();

while ((m = layersRegex.exec(appJs)) !== null) {
  const snippet = appJs.substring(m.index, m.index + 800);
  // Find identifiers followed by (
  const funcRegex = /([a-zA-Z0-9_$]+)\s*\(/g;
  let fm;
  while ((fm = funcRegex.exec(snippet)) !== null) {
    callSet.add(fm[1]);
  }
}

console.log('Functions called in layers:');
console.log(Array.from(callSet).sort());
