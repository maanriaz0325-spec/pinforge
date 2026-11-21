import fs from 'fs';

const appJs = fs.readFileSync('c:/Users/Hp/Downloads/Forge/.temp_apd/app-BAn9QVgC.js', 'utf8');

const knownConstants = {
  br: ["Lifestyle", "Listicle", "Custom Blog Pin"]
};

const tStartRegex = /id:"([^"]+)",name:"([^"]+)"/g;
let match;
const indices = [];
const seenIds = new Set();

while ((match = tStartRegex.exec(appJs)) !== null) {
  const id = match[1];
  const name = match[2];
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

const cleanTemplates = [];

for (let k = 0; k < indices.length; k++) {
  const current = indices[k];
  const nextIdx = k + 1 < indices.length ? indices[k + 1].index : appJs.length;
  const templateSnippet = appJs.substring(current.index, Math.min(nextIdx, current.index + 4000));
  
  const descMatch = templateSnippet.match(/description:"([^"]*)"/);
  const description = descMatch ? descMatch[1] : '';

  const famMatch = templateSnippet.match(/family:(\d+)/);
  const family = famMatch ? parseInt(famMatch[1], 10) : 1;

  let categories = [];
  const catMatch = templateSnippet.match(/categories:(\[[^\]]*\])/);
  if (catMatch) {
    const rawCatStr = catMatch[1];
    let resolvedStr = rawCatStr;
    for (const [key, val] of Object.entries(knownConstants)) {
      resolvedStr = resolvedStr.replace(`...${key}`, JSON.stringify(val).slice(1, -1));
    }
    try {
      categories = JSON.parse(resolvedStr.replace(/'/g, '"'));
    } catch {
      const strMatches = rawCatStr.match(/"([^"]+)"/g);
      if (strMatches) categories = strMatches.map(s => s.slice(1, -1));
      if (rawCatStr.includes('...br')) categories.push(...knownConstants.br);
    }
  }
  categories = Array.from(new Set(categories));

  let designTypes = [];
  const dtMatch = templateSnippet.match(/designTypes:(\[[^\]]*\])/);
  if (dtMatch) {
    try {
      designTypes = JSON.parse(dtMatch[1].replace(/'/g, '"'));
    } catch {
      const dtStrs = dtMatch[1].match(/"([^"]+)"/g);
      if (dtStrs) designTypes = dtStrs.map(s => s.slice(1, -1));
    }
  }

  const wMatch = templateSnippet.match(/\bw:(\d+)/);
  const hMatch = templateSnippet.match(/\bh:(\d+)/);
  const width = wMatch ? parseInt(wMatch[1], 10) : 1000;
  const height = hMatch ? parseInt(hMatch[1], 10) : 1500;

  let aspectRatio = "2:3";
  if (width === 736 && height === 1472) aspectRatio = "1:2";
  else if (width === 1080 && height === 1920) aspectRatio = "9:16";
  else if (width === 900 && height === 1200) aspectRatio = "3:4";
  else if (width === 1000 && height === 1000) aspectRatio = "1:1";

  const collageMatch = templateSnippet.match(/collage:\{([^}]+)\}/);
  let layoutId = 'single';
  let collageGap = 0;
  if (collageMatch) {
    const lMatch = collageMatch[1].match(/layoutId:"([^"]+)"/);
    if (lMatch) layoutId = lMatch[1];
    const gMatch = collageMatch[1].match(/gap:(\d+)/);
    if (gMatch) collageGap = parseInt(gMatch[1], 10);
  }

  // Extract layers: look inside the layers: (...) => [ ... ] section
  const layerTexts = [];
  const layersIdx = templateSnippet.indexOf('layers:');
  if (layersIdx !== -1) {
    const layersCode = templateSnippet.substring(layersIdx);
    // Find all string literals inside layersCode
    const strLitRegex = /"([^"\\]{1,80})"/g;
    let sm;
    const reserved = new Set([
      'single', 'circle', 'square', 'rect', 'plain-light', 'plain-dark',
      'over-image', 'decor', 'subtitle', 'title-line', 'website', 'cta',
      'dark-pill', 'light-pill', 'plain', 'none', 'uppercase', 'lowercase',
      'center', 'left', 'right', 'Anton', 'Montserrat', 'Playfair Display',
      'Poppins', 'DM Serif Display', 'Permanent Marker', 'Abril Fatface',
      'Libre Baskerville', 'Josefin Sans', 'Rubik Distressed', 'Brush banner',
      'Ornament', 'Text card', 'Website watermark', 'Subtitle line',
      'Call to action', 'Website footer', 'Rule', 'Shape', 'Footer bar',
      'Pacifico', 'Oswald', 'Sacramento', 'Archivo Black', 'Great Vibes'
    ]);
    while ((sm = strLitRegex.exec(layersCode)) !== null) {
      const val = sm[1].trim();
      if (val && !val.startsWith('#') && !reserved.has(val) && !categories.includes(val) && !designTypes.includes(val) && val !== current.name && val !== description) {
        if (!layerTexts.includes(val)) layerTexts.push(val);
      }
    }
  }

  // Fallback: quotes from description
  if (layerTexts.length === 0 && description) {
    const descQuoteMatch = description.match(/[“"]([^“”"]+)[”"]/);
    if (descQuoteMatch) {
      layerTexts.push(...descQuoteMatch[1].split('/').map(s => s.trim()).filter(Boolean));
    }
  }

  // Extract fonts
  const fonts = [];
  const fontRegex = /fontFamily:(?:([A-Za-z0-9_$]+)|"([^"]+)")/g;
  let fm;
  while ((fm = fontRegex.exec(templateSnippet)) !== null) {
    let f = fm[2] || fm[1];
    if (f === 'qt') f = 'Abril Fatface';
    if (f === 'Ei') f = 'Playfair Display';
    if (f && !fonts.includes(f) && !['i', 'e', 't', 's', 'n', 'r'].includes(f)) fonts.push(f);
  }
  if (fonts.length === 0) fonts.push('Montserrat', 'Playfair Display');

  // Extract colors
  const colors = [];
  const colorRegex = /#[0-9A-Fa-f]{6}/g;
  let cm2;
  while ((cm2 = colorRegex.exec(templateSnippet)) !== null) {
    if (!colors.includes(cm2[0])) colors.push(cm2[0]);
  }
  if (templateSnippet.includes('yr')) colors.push('#EE1A5B');
  if (colors.length === 0) colors.push('#111111', '#FFFFFF');

  // Primary category assignment
  let primaryCategory = "Lifestyle";
  if (categories.includes("Hair")) primaryCategory = "Hair & Hairstyles";
  else if (categories.includes("Beauty")) primaryCategory = "Beauty & Skincare";
  else if (categories.includes("Fashion")) primaryCategory = "Fashion & Style";
  else if (categories.includes("Home Decor") || categories.includes("Living Room")) primaryCategory = "Home Decor & Living";
  else if (categories.includes("Patio") || categories.includes("Balcony")) primaryCategory = "Patio & Outdoor";
  else if (categories.includes("Food / Recipe")) primaryCategory = "Food & Recipes";
  else if (categories.includes("Relationship")) primaryCategory = "Relationships & Advice";
  else if (categories.includes("Quote")) primaryCategory = "Quotes & Inspiration";
  else if (categories.includes("How-To")) primaryCategory = "How-To & Guides";
  else if (categories.includes("Listicle")) primaryCategory = "Listicles & Ideas";
  else if (categories.includes("Custom Blog Pin")) primaryCategory = "Custom Blog Pins";

  cleanTemplates.push({
    id: current.id,
    name: current.name,
    description,
    primaryCategory,
    categories,
    designTypes,
    width,
    height,
    aspectRatio,
    layoutId,
    collageGap,
    fonts,
    colors: colors.slice(0, 5),
    layerTexts: layerTexts.slice(0, 8),
    headlinePreview: layerTexts.length > 0 ? layerTexts.join(' ') : current.name
  });
}

console.log(`Cleanly processed ${cleanTemplates.length} templates!`);

fs.writeFileSync('c:/Users/Hp/Downloads/Forge/pinforge/src/server/data/apd_templates.json', JSON.stringify(cleanTemplates, null, 2));
console.log('Saved 247 categorized templates with complete layers to pinforge/src/server/data/apd_templates.json');
