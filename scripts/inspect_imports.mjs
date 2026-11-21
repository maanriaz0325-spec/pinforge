import fs from 'fs';

const appJs = fs.readFileSync('c:/Users/Hp/Downloads/Forge/.temp_apd/app-BAn9QVgC.js', 'utf8');
console.log('Beginning of appJs:');
console.log(appJs.substring(0, 1000));
