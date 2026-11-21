import fs from 'fs';

const appJs = fs.readFileSync('c:/Users/Hp/Downloads/Forge/.temp_apd/app-BAn9QVgC.js', 'utf8');

const snippet = appJs.substring(352400, 361280);
fs.writeFileSync('c:/Users/Hp/Downloads/Forge/.temp_apd/canvas_layer_helpers.js', snippet);
console.log('Saved canvas_layer_helpers.js length:', snippet.length);
