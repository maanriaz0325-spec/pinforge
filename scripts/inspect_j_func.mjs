import fs from 'fs';

const appJs = fs.readFileSync('c:/Users/Hp/Downloads/Forge/.temp_apd/app-BAn9QVgC.js', 'utf8');

// Find j= or function j( or const j= before index 361279
const gbIdx = 361279;
const snippet = appJs.substring(gbIdx - 2000, gbIdx);
console.log('Snippet before gbIdx:');
console.log(snippet);
