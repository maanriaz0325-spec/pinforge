import fs from 'fs';

const appJs = fs.readFileSync('c:/Users/Hp/Downloads/Forge/.temp_apd/app-BAn9QVgC.js', 'utf8');

// Search for j=( or function j( or const j=
const idx = appJs.indexOf('Gb=[');
const snippet = appJs.substring(idx - 6000, idx);
const match = snippet.match(/([a-zA-Z0-9_$]+)=([a-zA-Z0-9_$]*\(?[^=]*?\)?=>[\s\S]*?{name:"Ornament")/);
console.log('Match before Gb:');
console.log(snippet.slice(-1500));
