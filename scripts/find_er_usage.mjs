import fs from 'fs';

const appJs = fs.readFileSync('c:/Users/Hp/Downloads/Forge/.temp_apd/app-BAn9QVgC.js', 'utf8');

// Find all occurrences of er outside of function names
// In previous snippet: er=[...tw,...sw,...rw,...
const idx = appJs.indexOf('er=[');
console.log('er=[ is at index:', idx);
// Let's see what comes immediately after er=[...]
// Find where er is used next
let nextPos = idx + 10;
while ((nextPos = appJs.indexOf('er', nextPos)) !== -1) {
  const before = appJs[nextPos - 1];
  const after = appJs[nextPos + 2];
  if (!/[a-zA-Z0-9_$]/.test(before) && !/[a-zA-Z0-9_$]/.test(after)) {
    console.log(`Standalone 'er' at ${nextPos}:`, appJs.substring(nextPos - 30, nextPos + 60));
  }
  nextPos += 2;
  if (nextPos > idx + 40000) break;
}
