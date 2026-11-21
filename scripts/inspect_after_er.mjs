import fs from 'fs';

const appJs = fs.readFileSync('c:/Users/Hp/Downloads/Forge/.temp_apd/app-BAn9QVgC.js', 'utf8');
const endIdx = 607513;
console.log('Snippet after 607513:');
console.log(appJs.substring(endIdx - 100, endIdx + 800));
