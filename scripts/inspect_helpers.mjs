import fs from 'fs';

const appJs = fs.readFileSync('c:/Users/Hp/Downloads/Forge/.temp_apd/app-BAn9QVgC.js', 'utf8');

// Let's find definition of j = ... or function j( or whatever helper creates templates
// In previous snippet: Gb=[j({id:"hb-bronde-blocks" ...
// Let's search before Gb=[
const gbIdx = appJs.indexOf('Gb=[');
console.log('gbIdx:', gbIdx);
if (gbIdx !== -1) {
  console.log('Code before Gb=[');
  console.log(appJs.substring(gbIdx - 800, gbIdx + 100));
}
