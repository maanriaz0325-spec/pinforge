import fs from 'fs';

const appJs = fs.readFileSync('c:/Users/Hp/Downloads/Forge/.temp_apd/app-BAn9QVgC.js', 'utf8');

// Let's find the occurrences of category arrays like '["Hair","Beauty","Listicle"]' or similar
const target = '["Hair","Beauty","Listicle"]';
let idx = 0;
while ((idx = appJs.indexOf(target, idx)) !== -1) {
  console.log(`Found target at index ${idx}`);
  const snippet = appJs.substring(Math.max(0, idx - 400), Math.min(appJs.length, idx + 800));
  console.log('--- Snippet ---');
  console.log(snippet);
  console.log('---------------\n');
  idx += target.length;
  if (idx > 5000000) break;
}
