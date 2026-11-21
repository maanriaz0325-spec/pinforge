import fs from 'fs';

const appJs = fs.readFileSync('c:/Users/Hp/Downloads/Forge/.temp_apd/app-BAn9QVgC.js', 'utf8');

const target = '],er=[...tw,...sw';
const startIdx = appJs.indexOf(target) + 5; // points to '[' of er=[
console.log('Target found at:', appJs.indexOf(target), 'char at startIdx:', appJs[startIdx]);

let depth = 0;
let inString = null;
let endIdx = -1;

for (let i = startIdx; i < appJs.length; i++) {
  const c = appJs[i];
  if (inString) {
    if (c === inString && appJs[i-1] !== '\\') inString = null;
  } else {
    if (c === '"' || c === "'" || c === '`') inString = c;
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

console.log('startIdx:', startIdx, 'endIdx:', endIdx, 'length:', endIdx - startIdx);
if (endIdx !== -1) {
  console.log('End snippet:');
  console.log(appJs.substring(endIdx - 150, endIdx + 150));
}
