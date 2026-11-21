import fs from 'fs';

const appJs = fs.readFileSync('c:/Users/Hp/Downloads/Forge/.temp_apd/app-BAn9QVgC.js', 'utf8');
const pos = appJs.indexOf('Qb=');
console.log('Qb= at index:', pos);
if (pos !== -1) {
  console.log(appJs.substring(pos - 100, pos + 200));
}
