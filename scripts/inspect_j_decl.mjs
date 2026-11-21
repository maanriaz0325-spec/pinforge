import fs from 'fs';

const appJs = fs.readFileSync('c:/Users/Hp/Downloads/Forge/.temp_apd/app-BAn9QVgC.js', 'utf8');

// Find where j is declared
const candidates = [',j=', ';j=', 'var j=', 'let j=', 'const j='];
candidates.forEach(cand => {
  let idx = 0;
  while ((idx = appJs.indexOf(cand, idx)) !== -1) {
    if (idx < 361279 && idx > 300000) {
      console.log(`Found ${cand} at ${idx}:`, appJs.substring(idx - 20, idx + 100));
    }
    idx += cand.length;
  }
});
