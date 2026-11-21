import fs from 'fs';

const templates = JSON.parse(fs.readFileSync('c:/Users/Hp/Downloads/Forge/pinforge/src/server/data/apd_templates.json', 'utf8'));

const layouts = {};
const designTypeCounts = {};
templates.forEach(t => {
  layouts[t.layoutId] = (layouts[t.layoutId] || 0) + 1;
  t.designTypes.forEach(d => {
    designTypeCounts[d] = (designTypeCounts[d] || 0) + 1;
  });
});

console.log('Layout counts:', layouts);
console.log('Design type counts:', designTypeCounts);
