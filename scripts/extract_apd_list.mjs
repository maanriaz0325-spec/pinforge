import fs from 'fs';

const appJs = fs.readFileSync('c:/Users/Hp/Downloads/Forge/.temp_apd/app-BAn9QVgC.js', 'utf8');

// Regex to find j({id:"...",name:"...",...})
// Or find all occurrences of id:"...",name:"..."
const regex = /id:"([^"]+)",name:"([^"]+)"(?:,description:"([^"]*)")?(?:,family:(\d+))?,categories:(\[[^\]]*\])/g;

let match;
const templates = [];
const categoriesSet = new Set();

while ((match = regex.exec(appJs)) !== null) {
  const [full, id, name, description, family, rawCats] = match;
  let categories = [];
  try {
    categories = JSON.parse(rawCats);
  } catch (e) {
    // fallback eval or split
    categories = rawCats.replace(/[\[\]"]/g, '').split(',');
  }

  categories.forEach(c => categoriesSet.add(c.trim()));

  templates.push({
    id,
    name,
    description: description || '',
    family: family ? parseInt(family, 10) : undefined,
    categories,
    fullMatchIndex: match.index
  });
}

console.log(`Found ${templates.length} templates matching pattern!`);
console.log('Categories found:', Array.from(categoriesSet));

// Sample first 5 and last 5
console.log('\nFirst 5:', JSON.stringify(templates.slice(0, 5), null, 2));
console.log('\nLast 5:', JSON.stringify(templates.slice(-5), null, 2));
