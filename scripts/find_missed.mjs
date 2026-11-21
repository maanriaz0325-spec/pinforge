import fs from 'fs';

const appJs = fs.readFileSync('c:/Users/Hp/Downloads/Forge/.temp_apd/app-BAn9QVgC.js', 'utf8');
const parsed = JSON.parse(fs.readFileSync('c:/Users/Hp/Downloads/Forge/.temp_apd/extracted_apd_templates.json', 'utf8'));
const parsedIds = new Set(parsed.map(t => t.id));

// Find all id:"..." in appJs where categories are present
const regex = /id:"([^"]+)",name:"([^"]+)"(?:,description:"([^"]*)")?(?:,family:(\d+))?,categories:(\[[^\]]*\])/g;
let m;
while ((m = regex.exec(appJs)) !== null) {
  if (!parsedIds.has(m[1])) {
    console.log('Missed ID:', m[1], 'Name:', m[2]);
    console.log('Snippet:', appJs.substring(m.index - 50, m.index + 200));
  }
}
