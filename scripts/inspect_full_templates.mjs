import fs from 'fs';

const appJs = fs.readFileSync('c:/Users/Hp/Downloads/Forge/.temp_apd/app-BAn9QVgC.js', 'utf8');

// Let's inspect a few templates between match indices
// Let's take the snippet of hb-bronde-blocks and m1-lob-pink-blocks and a few others
const idsToInspect = [
  'hb-bronde-blocks',
  'hb-chic-teal-brush',
  'm1-lob-pink-blocks',
  'f3-editorial-white-blocks',
  'tr-fashion-capsule-arch',
  'blog-736-center-band'
];

idsToInspect.forEach(id => {
  const needle = `id:"${id}"`;
  const pos = appJs.indexOf(needle);
  if (pos !== -1) {
    console.log(`=== TEMPLATE ${id} ===`);
    // Find surrounding j({ ... })
    const start = Math.max(0, pos - 20);
    const end = Math.min(appJs.length, pos + 1200);
    console.log(appJs.substring(start, end));
    console.log('\n===============================\n');
  }
});
