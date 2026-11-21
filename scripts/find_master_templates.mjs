import fs from 'fs';

const appJs = fs.readFileSync('c:/Users/Hp/Downloads/Forge/.temp_apd/app-BAn9QVgC.js', 'utf8');

const pattern = '[...tw,...sw';
const idx = appJs.indexOf(pattern);
console.log('pattern idx:', idx);
if (idx !== -1) {
  console.log('Snippet before and after:');
  console.log(appJs.substring(idx - 60, idx + 400));
}
