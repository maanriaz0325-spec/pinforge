import fs from 'fs';

const appJs = fs.readFileSync('c:/Users/Hp/Downloads/Forge/.temp_apd/app-BAn9QVgC.js', 'utf8');

// Find all occurrences of the arrays
const names = ['tw=', 'sw=', 'rw=', 'fw=', 'yw=', 'ww=', 'xw=', 'Fw=', 'Sw=', 'kw=', 'Gb=', 'Hb=', 'er='];
names.forEach(n => {
  const idx = appJs.indexOf(n);
  console.log(`${n} at index ${idx}`);
});
