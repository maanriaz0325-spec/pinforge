import fs from 'fs';

const appJs = fs.readFileSync('c:/Users/Hp/Downloads/Forge/.temp_apd/app-BAn9QVgC.js', 'utf8');

const idx = 583852;
// Find the end of er array
let depth = 0;
let inString = null;
let endIdx = -1;

for (let i = idx + 4; i < appJs.length; i++) {
  const c = appJs[i];
  if (inString) {
    if (c === inString && appJs[i-1] !== '\\') inString = null;
  } else {
    if (c === '"' || c === "'") inString = c;
    else if (c === '[') depth++;
    else if (c === ']') {
      depth--;
      if (depth === 0) {
        endIdx = i;
        break;
      }
    }
  }
}

console.log('er ends at:', endIdx);
if (endIdx !== -1) {
  console.log('Snippet around end of er:');
  console.log(appJs.substring(endIdx - 150, endIdx + 200));
}
