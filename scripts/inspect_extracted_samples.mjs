import fs from 'fs';

const templates = JSON.parse(fs.readFileSync('c:/Users/Hp/Downloads/Forge/.temp_apd/extracted_apd_templates.json', 'utf8'));
console.log('Total templates:', templates.length);
console.log('Sample 1:', JSON.stringify(templates[0], null, 2));
console.log('Sample 2:', JSON.stringify(templates[10], null, 2));
console.log('Sample 3:', JSON.stringify(templates[50], null, 2));
