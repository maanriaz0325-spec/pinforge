import fs from 'fs';
import vm from 'vm';

const appJs = fs.readFileSync('c:/Users/Hp/Downloads/Forge/.temp_apd/app-BAn9QVgC.js', 'utf8');

// Build the execution environment
const sandbox = {
  console,
  Array,
  Object,
  Math,
  String,
  Number,
  Boolean,
  Date,
  RegExp,
  Set,
  Map
};

const scriptCode = `
const si = (p) => p + Math.random().toString(36).substring(2, 8);
const Y = (color, t = {}) => ({ enabled: true, shape: "rect", color, opacity: 1, paddingX: 28, paddingY: 10, radius: 0, borderWidth: 0, borderColor: "#111111", hug: true, ...t });
const ke = () => ({ ...Y("#FFFFFF"), enabled: false });
const ui = { enabled: true, color: "#000000", blur: 14, offsetX: 0, offsetY: 3, opacity: 0.45 };
const Ha = (opacity = 0.45, blur = 12) => ({ enabled: true, color: "#000000", blur, offsetX: 0, offsetY: 3, opacity });
const dh = (color, blur = 22) => ({ enabled: true, color, blur, offsetX: 0, offsetY: 0, opacity: 0.9 });
const Gt = (color, strokeWidth = 14) => ({ stroke: color, strokeWidth });
const As = (e, t) => (i) => (i * e) / t;
const mr = (color, paddingX) => Y(color, { hug: true, hugHeight: false, paddingX, paddingY: 0 });

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

function j(t) {
  const W = t.w || 1000;
  const H = t.h || 1500;
  const band = { x: 0, y: H * 0.35, width: W, height: H * 0.3 };
  let evaluatedLayers = [];
  if (typeof t.layers === 'function') {
    try {
      evaluatedLayers = t.layers({ W, H, band });
    } catch (err) {
      console.error("Layer eval error in " + t.id, err.message);
    }
  }
  return {
    ...t,
    evaluatedLayers
  };
}
`;

// Now let's extract the Gb array definition from appJs
const gbStart = appJs.indexOf('Gb=[');
// Find Gb matching closing bracket
let depth = 0;
let inStr = null;
let gbEnd = -1;
for (let i = gbStart + 3; i < appJs.length; i++) {
  const c = appJs[i];
  if (inStr) {
    if (c === inStr && appJs[i - 1] !== '\\') inStr = null;
  } else {
    if (c === '"' || c === "'" || c === '`') inStr = c;
    else if (c === '[') depth++;
    else if (c === ']') {
      depth--;
      if (depth === 0) {
        gbEnd = i;
        break;
      }
    }
  }
}

const gbCode = appJs.substring(gbStart, gbEnd + 1);
const fullCode = scriptCode + '\n' + gbCode + '\nGb;\n';

const ctx = vm.createContext(sandbox);
const result = vm.runInContext(fullCode, ctx);

console.log('Successfully evaluated Gb! Count:', result.length);
console.log('Template 1 layers count:', result[0].evaluatedLayers.length);
console.log('Template 1 layers:', JSON.stringify(result[0].evaluatedLayers, null, 2));
console.log('Template 2 layers count:', result[1].evaluatedLayers.length);
console.log('Template 2 layers:', JSON.stringify(result[1].evaluatedLayers, null, 2));
