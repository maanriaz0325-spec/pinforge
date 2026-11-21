import fs from 'fs';

const appJs = fs.readFileSync('c:/Users/Hp/Downloads/Forge/.temp_apd/app-BAn9QVgC.js', 'utf8');

const funcs = ['function le(', 'function ee(', 'const le=', 'const ee=', 'le=(', 'ee=('];
funcs.forEach(f => {
  let idx = 0;
  while ((idx = appJs.indexOf(f, idx)) !== -1) {
    console.log(`Found ${f} at ${idx}:`, appJs.substring(idx - 20, idx + 200));
    idx += f.length;
    break;
  }
});
