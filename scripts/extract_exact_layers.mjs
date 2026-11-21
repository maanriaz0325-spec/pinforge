import fs from 'fs';
import vm from 'vm';

const appJs = fs.readFileSync('c:/Users/Hp/Downloads/Forge/.temp_apd/app-BAn9QVgC.js', 'utf8');

// The standard AutoPinDesign layer helper runtime
const runtimeHeader = `
const si = (p) => p + Math.random().toString(36).substring(2, 8);
const Y = (color, t = {}) => ({ enabled: true, shape: "rect", color, opacity: 1, paddingX: 28, paddingY: 10, radius: 0, borderWidth: 0, borderColor: "#111111", hug: true, ...t });
const ke = () => ({ ...Y("#FFFFFF"), enabled: false });
const ui = { enabled: true, color: "#000000", blur: 14, offsetX: 0, offsetY: 3, opacity: 0.45 };
const Ha = (opacity = 0.45, blur = 12) => ({ enabled: true, color: "#000000", blur, offsetX: 0, offsetY: 3, opacity });
const dh = (color, blur = 22) => ({ enabled: true, color, blur, offsetX: 0, offsetY: 0, opacity: 0.9 });
const Gt = (color, strokeWidth = 14) => ({ stroke: color, strokeWidth });
const As = (e, t) => (i) => (i * e) / t;
const mr = (color, paddingX) => Y(color, { hug: true, hugHeight: false, paddingX, paddingY: 0 });
const vw = () => Ha(0.45, 12);

function le(e = {}) {
  return { id: si("s_"), type: "shape", name: "Shape", x: 0, y: 0, width: 300, height: 200, rotation: 0, opacity: 1, visible: true, locked: false, role: "decor", shape: "rect", fill: "#111111", stroke: "#111111", strokeWidth: 0, cornerRadius: 0, ...e };
}

function ee(e = {}) {
  return { id: si("t_"), type: "text", name: "Text", x: 0, y: 0, width: 600, height: 120, rotation: 0, opacity: 1, visible: true, locked: false, role: "none", text: "Your text", fontFamily: "Inter", fontSize: 56, fontWeight: 400, lineHeight: 1.1, align: "center", fill: "#111111", letterSpacing: 0, textTransform: "none", italic: false, ...e };
}

function H(fill, name = "Text band") {
  return le({ name, role: "band", fill, x: 0, y: 0, width: 1000, height: 400 });
}

function Gr(x, y, w, fill = "#111111", height = 3) {
  return le({ name: "Divider line", role: "decor", x, y, width: w, height, fill });
}

function me(W, y, height, text, n = {}) {
  return ee({ name: "Title line", role: "title-line", x: W * 0.08, y, width: W * 0.84, height, text, fontFamily: "Playfair Display", fontWeight: 800, fontSize: height * 0.82, lineHeight: 1, textTransform: "uppercase", letterSpacing: 1, fill: "#111111", minFontSize: 20, background: Y("#FFFFFF"), ...n });
}

function he(W, y, height, text, n = {}) {
  return me(W, y, height, text, { background: ke(), letterSpacing: 0, fontWeight: 400, lineHeight: 0.8, ...n });
}

function Za(x, y, w, height, text, r = {}) {
  return me(1000, y, height, text, { name: "Subtitle line", role: "subtitle", x, width: w, background: ke(), letterSpacing: 0, ...r });
}

function V(x, y, size, text, shape, bg, color, l = {}) {
  const isPill = shape === "pill";
  return ee({ name: "Number badge", role: "badge", x, y, width: isPill ? size * 1.6 : size, height: size, text, fontFamily: "Anton", fontWeight: 400, fontSize: size * 0.58, lineHeight: 1, fill: color, minFontSize: 16, autoFit: true, background: Y(bg, { hug: false, shape: shape === "circle" ? "circle" : isPill ? "pill" : "rect", radius: shape === "rounded" ? size * 0.18 : 0, paddingX: size * 0.08, paddingY: size * 0.08 }), ...l });
}

function Ai(W, y, height, text, n = {}) {
  return V(W * 0.1, y, height, text, "square", "#FFFFFF", "#FFFFFF", { x: W * 0.1, width: W * 0.8, height, background: ke(), lineHeight: 0.74, ...n });
}

function Ie(x, y, w, h, text, r = {}) {
  return ee({ name: "Title", role: "title", x, y, width: w, height: h, text, fontFamily: "Anton", fontWeight: 400, fontSize: 120, lineHeight: 1.05, textTransform: "uppercase", fill: "#111111", minFontSize: 22, ...r });
}

function et(x, y, w, h, text, r = {}) {
  return ee({ name: "Script accent", role: "accent", x, y, width: w, height: h, text, fontFamily: "Great Vibes", fontWeight: 400, fontSize: h * 0.9, lineHeight: 1, fill: "#B5651D", minFontSize: 20, ...r });
}

function Di(x, y, w, h, text, r = {}) {
  return ee({ name: "Label", role: "decor", x, y, width: w, height: h, text, fontFamily: "Montserrat", fontWeight: 600, fontSize: h * 0.6, letterSpacing: 4, textTransform: "uppercase", fill: "#111111", minFontSize: 12, ...r });
}

function Ct(x, y, w, h, fill, rotation = 0, radius = h / 2) {
  return le({ name: "Ornament", role: "decor", x, y, width: w, height: h, fill, rotation, cornerRadius: radius });
}

function G(W, H, style, s = {}) {
  const n = Math.max(36, W * 0.05);
  const r = { name: "Website footer", role: "website", x: W * 0.15, y: H - n - H * 0.028, width: W * 0.7, height: n, text: "yourwebsite.com", fontFamily: "Montserrat", fontWeight: 700, fontSize: W * 0.024, letterSpacing: W * 0.004, textTransform: "uppercase", minFontSize: 11, background: ke() };
  const o = {
    "over-image": { fill: "#FFFFFF", shadow: ui },
    "dark-pill": { fill: "#FFFFFF", background: Y("#111111", { shape: "pill", paddingX: W * 0.03, paddingY: W * 0.01 }) },
    "light-pill": { fill: "#111111", background: Y("#FFFFFF", { shape: "pill", paddingX: W * 0.03, paddingY: W * 0.01 }) },
    "plain-dark": { fill: "#111111" },
    "plain-light": { fill: "#FFFFFF" }
  };
  return ee({ ...r, ...(o[style] || o["plain-light"]), ...s });
}

const Lt = (e, t, i, s = 0.07) => ({ x: e.x + e.width * s, y: e.y + e.height * t, w: e.width * (1 - s * 2), h: e.height * i });
const yr = "#EE1A5B";
const qt = "Abril Fatface";
const Ei = "Playfair Display";
`;

// Find all template starting points
const tStartRegex = /id:"([^"]+)",name:"([^"]+)"/g;
let match;
const templateList = [];
const seenIds = new Set();

while ((match = tStartRegex.exec(appJs)) !== null) {
  const id = match[1];
  const name = match[2];
  const lookahead = appJs.substring(match.index, match.index + 500);
  if (lookahead.includes('categories:') && !seenIds.has(id)) {
    seenIds.add(id);
    templateList.push({ id, name, index: match.index });
  }
}

const fullExtracted = [];
let evaluatedCount = 0;

for (let k = 0; k < templateList.length; k++) {
  const current = templateList[k];
  const nextIdx = k + 1 < templateList.length ? templateList[k + 1].index : appJs.length;
  const chunk = appJs.substring(Math.max(0, current.index - 50), Math.min(nextIdx, current.index + 5000));

  const descMatch = chunk.match(/description:"([^"]*)"/);
  const description = descMatch ? descMatch[1] : '';

  const famMatch = chunk.match(/family:(\d+)/);
  const family = famMatch ? parseInt(famMatch[1], 10) : 1;

  let categories = [];
  const catMatch = chunk.match(/categories:(\[[^\]]*\])/);
  if (catMatch) {
    try {
      categories = JSON.parse(catMatch[1].replace(/\.\.\.br/g, '"Lifestyle","Listicle","Custom Blog Pin"'));
    } catch {
      const ms = catMatch[1].match(/"([^"]+)"/g);
      if (ms) categories = ms.map(s => s.slice(1, -1));
    }
  }

  let designTypes = [];
  const dtMatch = chunk.match(/designTypes:(\[[^\]]*\])/);
  if (dtMatch) {
    try {
      designTypes = JSON.parse(dtMatch[1]);
    } catch {
      const ms = dtMatch[1].match(/"([^"]+)"/g);
      if (ms) designTypes = ms.map(s => s.slice(1, -1));
    }
  }

  const wMatch = chunk.match(/\bw:(\d+)/);
  const hMatch = chunk.match(/\bh:(\d+)/);
  const width = wMatch ? parseInt(wMatch[1], 10) : 1000;
  const height = hMatch ? parseInt(hMatch[1], 10) : 1500;

  let aspectRatio = "2:3";
  if (width === 736 && height === 1472) aspectRatio = "1:2";
  else if (width === 1080 && height === 1920) aspectRatio = "9:16";
  else if (width === 900 && height === 1200) aspectRatio = "3:4";
  else if (width === 1000 && height === 1000) aspectRatio = "1:1";

  // Collage
  let layoutId = 'single';
  let collageGap = 0;
  let collageBand = 0.3;
  const collageMatch = chunk.match(/collage:\{([^}]+)\}/);
  if (collageMatch) {
    const lMatch = collageMatch[1].match(/layoutId:"([^"]+)"/);
    if (lMatch) layoutId = lMatch[1];
    const gMatch = collageMatch[1].match(/gap:(\d+)/);
    if (gMatch) collageGap = parseInt(gMatch[1], 10);
    const bMatch = collageMatch[1].match(/band:([0-9.]+)/);
    if (bMatch) collageBand = parseFloat(bMatch[1]);
  }

  // Extract layers function string
  let evaluatedLayers = [];
  const layersStartIdx = chunk.indexOf('layers:');
  if (layersStartIdx !== -1) {
    const layersSnippet = chunk.substring(layersStartIdx + 7);
    const arrowIdx = layersSnippet.indexOf('=>');
    if (arrowIdx !== -1) {
      // Look for first '{' or '[' after arrow
      const rest = layersSnippet.substring(arrowIdx + 2).trimStart();
      const openChar = rest[0];
      const closeChar = openChar === '{' ? '}' : openChar === '[' ? ']' : null;
      
      if (closeChar) {
        let depth = 0;
        let inS = null;
        let closeIdx = -1;
        for (let i = 0; i < rest.length; i++) {
          const c = rest[i];
          if (inS) {
            if (c === inS && rest[i - 1] !== '\\') inS = null;
          } else {
            if (c === '"' || c === "'" || c === '`') inS = c;
            else if (c === openChar) depth++;
            else if (c === closeChar) {
              depth--;
              if (depth === 0) {
                closeIdx = i;
                break;
              }
            }
          }
        }

        if (closeIdx !== -1) {
          const fnParam = layersSnippet.substring(0, arrowIdx).trim();
          const fnBody = rest.substring(0, closeIdx + 1);
          const fullFn = `(${fnParam} => ${fnBody})`;
          const evalCode = `
            ${runtimeHeader}
            const W = ${width};
            const H = ${height};
            const band = { x: 0, y: Math.round(H * 0.35), width: W, height: Math.round(H * ${collageBand}) };
            const fn = ${fullFn};
            fn({ W, H, band });
          `;
          try {
            const ctx = vm.createContext({ Array, Object, Math, String, Number, Boolean, RegExp, console });
            const res = vm.runInContext(evalCode, ctx, { timeout: 1000 });
            if (Array.isArray(res)) {
              evaluatedLayers = res.flat(2).filter(Boolean);
              evaluatedCount++;
            }
          } catch (e) {
            // console.error("Error evaluating " + current.id + ":", e.message);
          }
        }
      }
    }
  }

  // Extract all distinct fonts used
  const fonts = new Set();
  const colors = new Set();

  evaluatedLayers.forEach(l => {
    if (l.fontFamily) fonts.add(l.fontFamily);
    if (l.fill && l.fill.startsWith('#')) colors.add(l.fill.toUpperCase());
    if (l.background?.color && l.background.color.startsWith('#')) colors.add(l.background.color.toUpperCase());
    if (l.stroke && l.stroke.startsWith('#')) colors.add(l.stroke.toUpperCase());
  });

  if (fonts.size === 0) fonts.add("Playfair Display").add("Montserrat");
  if (colors.size === 0) colors.add("#111111").add("#FFFFFF");

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

  fullExtracted.push({
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
    collageBand,
    fonts: Array.from(fonts),
    colors: Array.from(colors),
    layers: evaluatedLayers
  });
}

console.log(`Evaluated ${evaluatedCount} / ${fullExtracted.length} templates successfully with full layer geometries!`);

fs.writeFileSync('c:/Users/Hp/Downloads/Forge/pinforge/src/server/data/apd_exact_templates.json', JSON.stringify(fullExtracted, null, 2));
console.log('Saved apd_exact_templates.json!');
