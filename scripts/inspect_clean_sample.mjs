import fs from 'fs';

const templates = JSON.parse(fs.readFileSync('c:/Users/Hp/Downloads/Forge/pinforge/src/server/data/apd_templates.json', 'utf8'));
console.log('Sample 1:', templates[0]);
console.log('Sample 2:', templates[5]);
console.log('Sample 3:', templates[20]);
