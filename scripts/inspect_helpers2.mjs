import fs from 'fs';
import vm from 'vm';

const appJs = fs.readFileSync('c:/Users/Hp/Downloads/Forge/.temp_apd/app-BAn9QVgC.js', 'utf8');

// Let's create an environment with all the helper functions and evaluate a template's layers!
// First let's inspect the definitions of me, V, le, pr, H, G, Y, ke, V0, dt, rs, etc.
const helperPos = appJs.indexOf('Gb=[');
const preGb = appJs.substring(helperPos - 8000, helperPos + 1000);

fs.writeFileSync('c:/Users/Hp/Downloads/Forge/.temp_apd/helpers_snippet.js', preGb);
console.log('Wrote helpers_snippet.js');
