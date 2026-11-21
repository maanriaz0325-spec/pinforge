import fs from 'fs';

const appJs = fs.readFileSync('c:/Users/Hp/Downloads/Forge/.temp_apd/app-BAn9QVgC.js', 'utf8');

const regex = /\b([a-zA-Z0-9_$]+)\s*=\s*(?:function|\([^)]*\)\s*=>|[a-zA-Z0-9_$]+\s*=>)/g;
let m;
while ((m = regex.exec(appJs)) !== null) {
  if (m[1] === 'j' && m.index < 361279) {
    console.log(`Found j= at ${m.index}:`, appJs.substring(m.index - 50, m.index + 200));
  }
}
