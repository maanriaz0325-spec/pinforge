import fs from 'fs';

const appJs = fs.readFileSync('c:/Users/Hp/Downloads/Forge/.temp_apd/app-BAn9QVgC.js', 'utf8');

const idx = appJs.indexOf('[...br]');
console.log('idx of [...br]:', idx);
if (idx !== -1) {
  console.log(appJs.substring(idx - 300, idx + 200));
}

// Find br=
const brMatch = appJs.match(/([a-zA-Z0-9_$]+)=([\[][^\]]+[\]])/g);
// Let's search for br=
let pos = 0;
while ((pos = appJs.indexOf('br=[', pos)) !== -1) {
  console.log('Found br=[ at', pos, ':', appJs.substring(pos, pos + 100));
  pos += 4;
}
