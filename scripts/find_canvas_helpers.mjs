import fs from 'fs';

const appJs = fs.readFileSync('c:/Users/Hp/Downloads/Forge/.temp_apd/app-BAn9QVgC.js', 'utf8');

const funcs = ['me=', 'V=', 'le=', 'pr=', 'Y=', 'ke=', 'H=', 'G='];
funcs.forEach(f => {
  let idx = 0;
  while ((idx = appJs.indexOf(f, idx)) !== -1) {
    console.log(`Found ${f} at ${idx}:`, appJs.substring(idx - 20, idx + 100));
    idx += f.length;
    break; // first occurrence
  }
});
