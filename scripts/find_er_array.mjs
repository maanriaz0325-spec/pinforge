import fs from 'fs';

const appJs = fs.readFileSync('c:/Users/Hp/Downloads/Forge/.temp_apd/app-BAn9QVgC.js', 'utf8');

const erIdx = appJs.indexOf('er=[');
console.log('erIdx:', erIdx);
if (erIdx !== -1) {
  // Let's see how long er goes until ];
  const erSnippet = appJs.substring(erIdx, erIdx + 4000);
  console.log('erSnippet start:');
  console.log(erSnippet.substring(0, 1500));
}

// Let's also check where the first array (e.g. tw= or kw= or whatever) is defined before Gb
const twIdx = appJs.indexOf('tw=[');
console.log('twIdx:', twIdx);
if (twIdx !== -1) {
  console.log('Code around tw=');
  console.log(appJs.substring(twIdx - 300, twIdx + 300));
}
