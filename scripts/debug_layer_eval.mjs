import fs from 'fs';
import vm from 'vm';

const appJs = fs.readFileSync('c:/Users/Hp/Downloads/Forge/.temp_apd/app-BAn9QVgC.js', 'utf8');

const tStartRegex = /id:"hb-bronde-blocks"/;
const m = tStartRegex.exec(appJs);
const chunk = appJs.substring(m.index, m.index + 2000);
const layersStartIdx = chunk.indexOf('layers:');
const layersSnippet = chunk.substring(layersStartIdx + 7);
const arrowIdx = layersSnippet.indexOf('=>');
const rest = layersSnippet.substring(arrowIdx + 2).trimStart();
const openChar = rest[0];
const closeChar = openChar === '{' ? '}' : openChar === '[' ? ']' : null;
console.log('openChar:', openChar, 'closeChar:', closeChar);

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
console.log('closeIdx:', closeIdx);
const fnParam = layersSnippet.substring(0, arrowIdx).trim();
const fnBody = rest.substring(0, closeIdx + 1);
const fullFn = `(${fnParam} => ${fnBody})`;
console.log('fullFn snippet:', fullFn.substring(0, 200));

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
function le(e = {}) { return { id: si("s_"), type: "shape", ...e }; }
function ee(e = {}) { return { id: si("t_"), type: "text", ...e }; }
function H(fill, name = "Text band") { return le({ name, role: "band", fill }); }
function Gr(x, y, w, fill = "#111111", height = 3) { return le({ name: "Divider line", role: "decor", x, y, width: w, height, fill }); }
function me(W, y, height, text, n = {}) { return ee({ name: "Title line", role: "title-line", x: W * 0.08, y, width: W * 0.84, height, text, fontFamily: "Playfair Display", fontWeight: 800, fontSize: height * 0.82, lineHeight: 1, textTransform: "uppercase", letterSpacing: 1, fill: "#111111", minFontSize: 20, background: Y("#FFFFFF"), ...n }); }
function he(W, y, height, text, n = {}) { return me(W, y, height, text, { background: ke(), letterSpacing: 0, fontWeight: 400, lineHeight: 0.8, ...n }); }
function Za(x, y, w, height, text, r = {}) { return me(1000, y, height, text, { name: "Subtitle line", role: "subtitle", x, width: w, background: ke(), letterSpacing: 0, ...r }); }
function V(x, y, size, text, shape, bg, color, l = {}) { return ee({ name: "Number badge", role: "badge", x, y, width: size, height: size, text, fontFamily: "Anton", ...l }); }
function Ai(W, y, height, text, n = {}) { return V(W * 0.1, y, height, text, "square", "#FFFFFF", "#FFFFFF", { x: W * 0.1, width: W * 0.8, height, background: ke(), lineHeight: 0.74, ...n }); }
function Ie(x, y, w, h, text, r = {}) { return ee({ name: "Title", role: "title", x, y, width: w, height: h, text, fontFamily: "Anton", fontWeight: 400, fontSize: 120, ...r }); }
function et(x, y, w, h, text, r = {}) { return ee({ name: "Script accent", role: "accent", x, y, width: w, height: h, text, fontFamily: "Great Vibes", ...r }); }
function Di(x, y, w, h, text, r = {}) { return ee({ name: "Label", role: "decor", x, y, width: w, height: h, text, fontFamily: "Montserrat", ...r }); }
function Ct(x, y, w, h, fill, rotation = 0) { return le({ name: "Ornament", role: "decor", x, y, width: w, height: h, fill, rotation }); }
function G(W, H, style, s = {}) { return ee({ name: "Website footer", role: "website", text: "yourwebsite.com", ...s }); }
const Lt = (e, t, i, s = 0.07) => ({ x: e.x + e.width * s, y: e.y + e.height * t, w: e.width * (1 - s * 2), h: e.height * i });
const yr = "#EE1A5B";
const qt = "Abril Fatface";
const Ei = "Playfair Display";
`;

const evalCode = `
  ${runtimeHeader}
  const canvasWidth = 1080;
  const canvasHeight = 1920;
  const band = { x: 0, y: Math.round(canvasHeight * 0.35), width: canvasWidth, height: Math.round(canvasHeight * 0.3) };
  const fn = ${fullFn};
  fn({ W: canvasWidth, H: canvasHeight, band });
`;

try {
  const ctx = vm.createContext({ Array, Object, Math, String, Number, Boolean, RegExp, console });
  const res = vm.runInContext(evalCode, ctx);
  console.log('Result length:', res.length);
} catch (e) {
  console.error('Eval failed:', e);
}
