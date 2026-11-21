import fs from 'fs';

const appJs = fs.readFileSync('c:/Users/Hp/Downloads/Forge/.temp_apd/app-BAn9QVgC.js', 'utf8');

// Known constant arrays in appJs
const knownConstants = {
  br: ["Lifestyle", "Listicle", "Custom Blog Pin"]
};

// Also search for any other varName = ["..."]
const constRegex = /\b([a-zA-Z0-9_$]+)\s*=\s*(\[[^\]]*\])/g;
let cm;
while ((cm = constRegex.exec(appJs)) !== null) {
  try {
    const parsed = JSON.parse(cm[2].replace(/'/g, '"'));
    if (Array.isArray(parsed) && parsed.every(x => typeof x === 'string')) {
      knownConstants[cm[1]] = parsed;
    }
  } catch (e) {}
}

// Regex to capture EVERY template object with id:"...", name:"..."
const tStartRegex = /id:"([^"]+)",name:"([^"]+)"/g;
let match;
const indices = [];
const seenIds = new Set();

while ((match = tStartRegex.exec(appJs)) !== null) {
  const id = match[1];
  const name = match[2];
  // Filter out any non-template IDs like pin-standard (which has category:"pinterest" instead of categories)
  // Check if categories: or categories exists nearby
  const lookahead = appJs.substring(match.index, match.index + 500);
  if (lookahead.includes('categories:')) {
    if (!seenIds.has(id)) {
      seenIds.add(id);
      indices.push({
        id,
        name,
        index: match.index
      });
    }
  }
}

console.log(`Found ${indices.length} template starting points!`);

const templates = [];

for (let k = 0; k < indices.length; k++) {
  const current = indices[k];
  const chunk = appJs.substring(Math.max(0, current.index - 50), Math.min(appJs.length, current.index + 8000));
  
  // Extract description
  const descMatch = chunk.match(/description:"([^"]*)"/);
  // Extract family
  const famMatch = chunk.match(/family:(\d+)/);
  
  // Extract categories safely
  let categories = [];
  const catMatch = chunk.match(/categories:(\[[^\]]*\])/);
  if (catMatch) {
    const rawCatStr = catMatch[1];
    let resolvedStr = rawCatStr;
    for (const [k, v] of Object.entries(knownConstants)) {
      resolvedStr = resolvedStr.replace(`...${k}`, JSON.stringify(v).slice(1, -1));
    }
    try {
      categories = JSON.parse(resolvedStr.replace(/'/g, '"'));
    } catch {
      const strMatches = rawCatStr.match(/"([^"]+)"/g);
      if (strMatches) {
        categories = strMatches.map(s => s.slice(1, -1));
      }
      if (rawCatStr.includes('...br')) {
        categories.push(...knownConstants.br);
      }
    }
  }
  // Deduplicate categories
  categories = Array.from(new Set(categories));

  // Extract designTypes safely
  let designTypes = [];
  const dtMatch = chunk.match(/designTypes:(\[[^\]]*\])/);
  if (dtMatch) {
    try {
      designTypes = JSON.parse(dtMatch[1].replace(/'/g, '"'));
    } catch {
      const dtStrs = dtMatch[1].match(/"([^"]+)"/g);
      if (dtStrs) designTypes = dtStrs.map(s => s.slice(1, -1));
    }
  }

  // Extract w, h
  const wMatch = chunk.match(/\bw:(\d+)/);
  const hMatch = chunk.match(/\bh:(\d+)/);

  // Extract collage
  const collageMatch = chunk.match(/collage:\{([^}]+)\}/);
  let layoutId = 'single';
  let collageGap = 0;
  if (collageMatch) {
    const lMatch = collageMatch[1].match(/layoutId:"([^"]+)"/);
    if (lMatch) layoutId = lMatch[1];
    const gMatch = collageMatch[1].match(/gap:(\d+)/);
    if (gMatch) collageGap = parseInt(gMatch[1], 10);
  }

  // Extract sample texts
  const sampleTexts = [];
  const textMatches = chunk.match(/"([^"\\]{3,60})"/g);
  if (textMatches) {
    const ignoreList = new Set([
      'single', 'circle', 'square', 'rect', 'plain-light', 'plain-dark',
      'over-image', 'decor', 'subtitle', 'title-line', 'website', 'cta',
      'Anton', 'Montserrat', 'Playfair Display', 'Poppins', 'DM Serif Display',
      'Permanent Marker', 'Abril Fatface', 'Libre Baskerville', 'Josefin Sans',
      'Rubik Distressed', 'Brush banner', 'Ornament', 'Text card', 'Website watermark',
      'Subtitle line', 'Call to action', 'Website footer', 'Rule', 'Shape', 'Footer bar',
      current.id, current.name
    ]);
    for (const raw of textMatches) {
      const val = raw.slice(1, -1).trim();
      if (!ignoreList.has(val) && !categories.includes(val) && !designTypes.includes(val) && val !== current.description) {
        if (!sampleTexts.includes(val)) sampleTexts.push(val);
      }
    }
  }

  // Extract fonts
  const fonts = [];
  const fontRegex = /fontFamily:(?:([A-Za-z0-9_$]+)|"([^"]+)")/g;
  let fm;
  while ((fm = fontRegex.exec(chunk)) !== null) {
    let f = fm[2] || fm[1];
    if (f === 'qt') f = 'Abril Fatface';
    if (f === 'Ei') f = 'Playfair Display';
    if (f && !fonts.includes(f) && !['i', 'e', 't', 's', 'n'].includes(f)) fonts.push(f);
  }

  // Extract hex colors
  const colors = [];
  const colorRegex = /#[0-9A-Fa-f]{6}/g;
  let cm2;
  while ((cm2 = colorRegex.exec(chunk)) !== null) {
    if (!colors.includes(cm2[0])) colors.push(cm2[0]);
  }
  if (chunk.includes('yr')) colors.push('#EE1A5B');

  templates.push({
    id: current.id,
    name: current.name,
    description: descMatch ? descMatch[1] : '',
    family: famMatch ? parseInt(famMatch[1], 10) : 1,
    categories,
    designTypes,
    width: wMatch ? parseInt(wMatch[1], 10) : 1000,
    height: hMatch ? parseInt(hMatch[1], 10) : 1500,
    layoutId,
    collageGap,
    fonts,
    colors,
    sampleTexts: sampleTexts.slice(0, 6)
  });
}

console.log(`Successfully parsed ${templates.length} total templates!`);

// Summary of categories
const categoryCounts = {};
templates.forEach(t => {
  t.categories.forEach(c => {
    categoryCounts[c] = (categoryCounts[c] || 0) + 1;
  });
});
console.log('Category Counts:', categoryCounts);

// Save to JSON
fs.writeFileSync('c:/Users/Hp/Downloads/Forge/.temp_apd/extracted_apd_templates.json', JSON.stringify(templates, null, 2));
console.log('Saved to c:/Users/Hp/Downloads/Forge/.temp_apd/extracted_apd_templates.json');
