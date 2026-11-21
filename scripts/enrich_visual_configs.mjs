import fs from 'fs';

const appJs = fs.readFileSync('c:/Users/Hp/Downloads/Forge/.temp_apd/app-BAn9QVgC.js', 'utf8');
const templates = JSON.parse(fs.readFileSync('c:/Users/Hp/Downloads/Forge/pinforge/src/server/data/apd_templates.json', 'utf8'));

console.log('Enriching', templates.length, 'templates with exact visual styling rules...');

templates.forEach(t => {
  const needle = `id:"${t.id}"`;
  const idx = appJs.indexOf(needle);
  const chunk = idx !== -1 ? appJs.substring(idx, idx + 2500) : '';

  // 1. Detect Badge
  let badge = null;
  // Look for V(...) call
  // e.g. V(x, y, size, "50", "circle", "#FF5C8D", "#111111")
  const vMatch = chunk.match(/\bV\s*\([^,]+,[^,]+,[^,]+,\s*"([^"]+)",\s*"([^"]+)",\s*([^,]+),\s*([^,\)]+)/);
  if (vMatch) {
    let bg = vMatch[3].trim().replace(/['"]/g, '');
    let fg = vMatch[4].trim().replace(/['"]/g, '');
    if (bg === 'yr') bg = '#EE1A5B';
    if (fg === 'yr') fg = '#EE1A5B';
    badge = {
      text: vMatch[1],
      shape: vMatch[2],
      bg: bg.startsWith('#') ? bg : '#FF5C8D',
      color: fg.startsWith('#') ? fg : '#FFFFFF'
    };
  } else {
    // Check if Ai(...) call (square white badge)
    const aiMatch = chunk.match(/\bAi\s*\([^,]+,[^,]+,[^,]+,\s*"([^"]+)"/);
    if (aiMatch) {
      badge = {
        text: aiMatch[1],
        shape: 'square',
        bg: '#FFFFFF',
        color: '#111111'
      };
    }
  }

  // 2. Detect Block / Highlight Style
  let blockStyle = 'clean-overlay';
  if (chunk.includes('mr("#FFFFFF"') || chunk.includes('background:mr(') || chunk.includes('background:Y("#FFFFFF"')) {
    blockStyle = 'white-blocks';
  } else if (chunk.includes('background:Y("#111111"') || chunk.includes('background:Y("#000000"')) {
    blockStyle = 'black-boxes';
  } else if (chunk.includes('name:"Text card"') || chunk.includes('name:"Panel"') || chunk.includes('framed')) {
    blockStyle = 'framed-card';
  } else if (chunk.includes('Brush banner') || chunk.includes('name:"Brush banner"')) {
    blockStyle = 'brush-banner';
  } else if (chunk.includes('et(') || chunk.includes('Great Vibes') || chunk.includes('italic:!0') || chunk.includes('italic: true')) {
    blockStyle = 'script-accent';
  } else if (chunk.includes('dh(') || chunk.includes('shadow:dh(')) {
    blockStyle = 'glow';
  } else if (chunk.includes('strokeWidth:') || chunk.includes('Gt(')) {
    blockStyle = 'sticker-outline';
  } else if (t.layoutId.startsWith('band-')) {
    blockStyle = 'band-split';
  }

  // 3. Band Color for band layouts
  let bandColor = '#FFFFFF';
  const hMatch = chunk.match(/\bH\s*\(\s*["']([^"']+)["']/);
  if (hMatch) {
    bandColor = hMatch[1];
  } else if (t.colors.some(c => c === '#1F1A17' || c === '#111111')) {
    bandColor = '#111111';
  }

  // 4. Accent Color
  let accentColor = '#EE1A5B';
  if (t.colors.includes('#EE1A5B')) accentColor = '#EE1A5B';
  else if (t.colors.includes('#FF5C8D')) accentColor = '#FF5C8D';
  else if (t.colors.includes('#17899A')) accentColor = '#17899A';
  else if (t.colors.includes('#E25C6A')) accentColor = '#E25C6A';
  else if (t.colors.includes('#8B6A4E')) accentColor = '#8B6A4E';
  else if (t.colors.includes('#D4B483')) accentColor = '#D4B483';
  else if (t.colors.includes('#BE123C')) accentColor = '#BE123C';
  else if (t.colors.includes('#F7E45A')) accentColor = '#F7E45A';
  else if (t.colors.length > 2) accentColor = t.colors[2];

  // 5. Script accent word
  let scriptWord = null;
  const etMatch = chunk.match(/\bet\s*\([^,]+,[^,]+,[^,]+,[^,]+,\s*"([^"]+)"/);
  if (etMatch) {
    scriptWord = etMatch[1];
  }

  // 6. Photo theme
  let photoTheme = 'lifestyle';
  if (t.categories.includes('Hair')) photoTheme = 'hair';
  else if (t.categories.includes('Beauty')) photoTheme = 'beauty';
  else if (t.categories.includes('Home Decor') || t.categories.includes('Living Room')) photoTheme = 'homedecor';
  else if (t.categories.includes('Fashion')) photoTheme = 'fashion';
  else if (t.categories.includes('Food / Recipe')) photoTheme = 'food';
  else if (t.categories.includes('Patio') || t.categories.includes('Balcony')) photoTheme = 'outdoor';

  t.visualConfig = {
    badge,
    blockStyle,
    bandColor,
    accentColor,
    scriptWord,
    photoTheme
  };
});

console.log('Sample 1 visual config:', templates[0].visualConfig);
console.log('Sample 2 visual config:', templates[1].visualConfig);
console.log('Sample 10 visual config:', templates[10].visualConfig);
console.log('Sample 50 visual config:', templates[50].visualConfig);

fs.writeFileSync('c:/Users/Hp/Downloads/Forge/pinforge/src/server/data/apd_templates.json', JSON.stringify(templates, null, 2));
console.log('Saved enriched apd_templates.json!');
