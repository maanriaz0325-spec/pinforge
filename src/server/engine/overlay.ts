import crypto from "crypto";
import { CatchyOverlayContent } from "./nicheStrategies";

export interface OverlayBox {
  x: number; // 0 to 1 fraction of width
  y: number; // 0 to 1 fraction of height
  w: number; // 0 to 1 fraction of width
  h: number; // 0 to 1 fraction of height
}

export interface OverlayConfig {
  canvas: { w: number; h: number };
  text: {
    content: string;
    preset: string;
    fontFamily: string;
    weight: number;
    color: string;
    align: "left" | "center" | "right";
    maxLines: number;
    box: OverlayBox;
  };
  background: {
    type: "none" | "card" | "scrim" | "solid_band" | "outline" | "frosted";
    color?: string;
    opacity?: number;
    radius?: number;
    from?: string;
    to?: string;
    height?: number;
  };
  accent?: {
    color: string;
  };
  logo?: {
    url?: string;
    position: "top_left" | "top_right" | "bottom_left" | "bottom_right";
    scale: number; // fraction of width e.g. 0.15
    opacity: number;
  };
  url?: {
    text: string;
    size: number;
    position: "bottom_center";
  };
  nicheData?: CatchyOverlayContent;
  palette?: string;
  luminanceMode?: "auto" | "light" | "dark";
}

export type PresetName =
  // Reference Image 1: 8 Distinct Styles
  | "classic_clean_travel"
  | "modern_bold_peach"
  | "handwritten_explore"
  | "minimal_clean_nature"
  | "playful_colorful_badge"
  | "dark_cinematic_road"
  | "healthy_habits_icons"
  | "collage_washi_gems"
  // Reference Image 2: 8 Distinct Styles
  | "classic_elegant_santorini"
  | "modern_bold_amber"
  | "handwritten_torn_desk"
  | "minimal_clean_fitness"
  | "playful_pastel_rainbow"
  | "dark_cinematic_coffee"
  | "modern_overlay_sage_home"
  | "collage_craft_ribbon"
  // Reference Image 3: 1 Distinct Style (Preset 17)
  | "bold_center_badge"
  // Reference Image 4: 1 Distinct Style (Preset 18)
  | "editorial_tall_script";

export const OVERLAY_PRESETS: Record<PresetName, Partial<OverlayConfig>> = {
  // --- Reference Image 1: 8 Distinct Styles ---
  classic_clean_travel: {
    text: {
      content: "",
      preset: "classic_clean_travel",
      fontFamily: "Playfair Display, Georgia, serif",
      weight: 700,
      color: "#ffffff",
      align: "left",
      maxLines: 4,
      box: { x: 0.08, y: 0.16, w: 0.84, h: 0.28 },
    },
    background: {
      type: "scrim",
      from: "rgba(0,0,0,0.85)",
      to: "rgba(0,0,0,0.0)",
      height: 0.45,
    },
  },
  modern_bold_peach: {
    text: {
      content: "",
      preset: "modern_bold_peach",
      fontFamily: "Inter, Montserrat, sans-serif",
      weight: 900,
      color: "#ffffff",
      align: "left",
      maxLines: 4,
      box: { x: 0.08, y: 0.16, w: 0.84, h: 0.28 },
    },
    background: {
      type: "scrim",
      from: "rgba(0,0,0,0.85)",
      to: "rgba(0,0,0,0.0)",
      height: 0.45,
    },
  },
  handwritten_explore: {
    text: {
      content: "",
      preset: "handwritten_explore",
      fontFamily: "Playfair Display, Georgia, cursive",
      weight: 700,
      color: "#ffffff",
      align: "left",
      maxLines: 4,
      box: { x: 0.08, y: 0.16, w: 0.84, h: 0.28 },
    },
    background: {
      type: "scrim",
      from: "rgba(0,0,0,0.8)",
      to: "rgba(0,0,0,0.0)",
      height: 0.45,
    },
  },
  minimal_clean_nature: {
    text: {
      content: "",
      preset: "minimal_clean_nature",
      fontFamily: "Inter, sans-serif",
      weight: 800,
      color: "#ffffff",
      align: "left",
      maxLines: 4,
      box: { x: 0.08, y: 0.16, w: 0.84, h: 0.28 },
    },
    background: {
      type: "scrim",
      from: "rgba(0,0,0,0.85)",
      to: "rgba(0,0,0,0.0)",
      height: 0.45,
    },
  },
  playful_colorful_badge: {
    text: {
      content: "",
      preset: "playful_colorful_badge",
      fontFamily: "Inter, Montserrat, sans-serif",
      weight: 800,
      color: "#ffffff",
      align: "left",
      maxLines: 4,
      box: { x: 0.08, y: 0.16, w: 0.84, h: 0.28 },
    },
    background: {
      type: "scrim",
      from: "rgba(0,0,0,0.85)",
      to: "rgba(0,0,0,0.0)",
      height: 0.45,
    },
  },
  dark_cinematic_road: {
    text: {
      content: "",
      preset: "dark_cinematic_road",
      fontFamily: "Playfair Display, Georgia, serif",
      weight: 800,
      color: "#ffffff",
      align: "center",
      maxLines: 4,
      box: { x: 0.06, y: 0.16, w: 0.86, h: 0.28 },
    },
    background: {
      type: "scrim",
      from: "rgba(0,0,0,0.9)",
      to: "rgba(0,0,0,0.0)",
      height: 0.45,
    },
  },
  healthy_habits_icons: {
    text: {
      content: "",
      preset: "healthy_habits_icons",
      fontFamily: "Inter, sans-serif",
      weight: 800,
      color: "#ffffff",
      align: "left",
      maxLines: 4,
      box: { x: 0.06, y: 0.12, w: 0.76, h: 0.32 },
    },
    background: {
      type: "scrim",
      from: "rgba(0,0,0,0.88)",
      to: "rgba(0,0,0,0.0)",
      height: 0.48,
    },
  },
  collage_washi_gems: {
    text: {
      content: "",
      preset: "collage_washi_gems",
      fontFamily: "Playfair Display, Georgia, serif",
      weight: 700,
      color: "#292524",
      align: "center",
      maxLines: 4,
      box: { x: 0.08, y: 0.12, w: 0.76, h: 0.32 },
    },
    background: {
      type: "card",
      color: "#faf7f2",
      opacity: 0.96,
      radius: 4,
    },
  },

  // --- Reference Image 2: 8 Distinct Styles ---
  classic_elegant_santorini: {
    text: {
      content: "",
      preset: "classic_elegant_santorini",
      fontFamily: "Playfair Display, Georgia, serif",
      weight: 700,
      color: "#0c2340",
      align: "left",
      maxLines: 4,
      box: { x: 0.08, y: 0.14, w: 0.84, h: 0.28 },
    },
    background: {
      type: "scrim",
      from: "rgba(255,255,255,0.95)",
      to: "rgba(255,255,255,0.0)",
      height: 0.45,
    },
  },
  modern_bold_amber: {
    text: {
      content: "",
      preset: "modern_bold_amber",
      fontFamily: "Inter, Montserrat, sans-serif",
      weight: 900,
      color: "#18181b",
      align: "left",
      maxLines: 4,
      box: { x: 0.08, y: 0.15, w: 0.84, h: 0.28 },
    },
    background: {
      type: "scrim",
      from: "rgba(0,0,0,0.85)",
      to: "rgba(0,0,0,0.0)",
      height: 0.45,
    },
  },
  handwritten_torn_desk: {
    text: {
      content: "",
      preset: "handwritten_torn_desk",
      fontFamily: "Playfair Display, Georgia, cursive",
      weight: 700,
      color: "#1e293b",
      align: "center",
      maxLines: 4,
      box: { x: 0.08, y: 0.12, w: 0.76, h: 0.32 },
    },
    background: {
      type: "card",
      color: "#fdfbf7",
      opacity: 0.96,
      radius: 6,
    },
  },
  minimal_clean_fitness: {
    text: {
      content: "",
      preset: "minimal_clean_fitness",
      fontFamily: "Inter, sans-serif",
      weight: 800,
      color: "#0f172a",
      align: "left",
      maxLines: 4,
      box: { x: 0.08, y: 0.14, w: 0.76, h: 0.32 },
    },
    background: {
      type: "scrim",
      from: "rgba(255,255,255,0.95)",
      to: "rgba(255,255,255,0.0)",
      height: 0.45,
    },
  },
  playful_pastel_rainbow: {
    text: {
      content: "",
      preset: "playful_pastel_rainbow",
      fontFamily: "Inter, Montserrat, sans-serif",
      weight: 900,
      color: "#0f172a",
      align: "center",
      maxLines: 4,
      box: { x: 0.08, y: 0.14, w: 0.76, h: 0.32 },
    },
    background: {
      type: "card",
      color: "#fffbeb",
      opacity: 0.98,
      radius: 16,
    },
  },
  dark_cinematic_coffee: {
    text: {
      content: "",
      preset: "dark_cinematic_coffee",
      fontFamily: "Playfair Display, Georgia, serif",
      weight: 800,
      color: "#ffffff",
      align: "center",
      maxLines: 4,
      box: { x: 0.06, y: 0.15, w: 0.86, h: 0.28 },
    },
    background: {
      type: "scrim",
      from: "rgba(0,0,0,0.9)",
      to: "rgba(0,0,0,0.0)",
      height: 0.45,
    },
  },
  modern_overlay_sage_home: {
    text: {
      content: "",
      preset: "modern_overlay_sage_home",
      fontFamily: "Inter, sans-serif",
      weight: 800,
      color: "#ffffff",
      align: "left",
      maxLines: 4,
      box: { x: 0.06, y: 0.12, w: 0.76, h: 0.32 },
    },
    background: {
      type: "card",
      color: "#3d5a45",
      opacity: 0.92,
      radius: 12,
    },
  },
  collage_craft_ribbon: {
    text: {
      content: "",
      preset: "collage_craft_ribbon",
      fontFamily: "Playfair Display, Georgia, serif",
      weight: 700,
      color: "#292524",
      align: "center",
      maxLines: 4,
      box: { x: 0.08, y: 0.65, w: 0.76, h: 0.32 },
    },
    background: {
      type: "card",
      color: "#fae8e0",
      opacity: 0.96,
      radius: 6,
    },
  },

  // --- Reference Image 3: Preset 17 (Bold Center Listicle Banner) ---
  bold_center_badge: {
    text: {
      content: "",
      preset: "bold_center_badge",
      fontFamily: "Inter, Montserrat, sans-serif",
      weight: 900,
      color: "#ffffff",
      align: "center",
      maxLines: 3,
      box: { x: 0.05, y: 0.38, w: 0.90, h: 0.25 },
    },
    background: {
      type: "card",
      color: "#35483d",
      opacity: 0.95,
      radius: 8,
    },
  },
  editorial_tall_script: {
    text: {
      content: "",
      preset: "editorial_tall_script",
      fontFamily: "Playfair Display, Didot, Georgia, serif",
      weight: 800,
      color: "#ffffff",
      align: "left",
      maxLines: 4,
      box: { x: 0.08, y: 0.08, w: 0.50, h: 0.48 },
    },
    background: {
      type: "none",
      color: "transparent",
      opacity: 1.0,
    },
  },
};

/**
 * Calculates WCAG 2.1 relative luminance of a hex color
 */
export function getRelativeLuminance(hexColor: string): number {
  let hex = hexColor.replace("#", "");
  if (hex.length === 3) {
    hex = hex.split("").map((c) => c + c).join("");
  }
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const toLinear = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * Calculates contrast ratio between two colors (1 to 21)
 */
export function getContrastRatio(hex1: string, hex2: string): number {
  const l1 = getRelativeLuminance(hex1);
  const l2 = getRelativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Balanced line wrapping to avoid single-word orphans
 */
export function balancedWrap(text: string, maxCharsPerLine: number, maxLines: number): string[] {
  const words = text.trim().split(/\s+/);
  if (words.length === 0) return [];

  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    if (!currentLine) {
      currentLine = word;
    } else if ((currentLine + " " + word).length <= maxCharsPerLine) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);

  if (lines.length > maxLines) {
    const keep = lines.slice(0, maxLines);
    keep[maxLines - 1] = keep[maxLines - 1] + "...";
    return keep;
  }

  return lines;
}

export type PresetColorPalette =
  | "auto"
  | "warm_peach"
  | "golden_amber"
  | "ocean_azure"
  | "sage_forest"
  | "dark_cinematic"
  | "blush_craft"
  | "clean_slate"
  | "playful_pastel"
  | "christmas_holiday"
  | "luxury_plum_nails"
  | "salon_caramel_hair"
  | "dusty_blue_home"
  | "terracotta_boho"
  | "rose_skincare";

export interface AdaptiveColorPalette {
  id: string;
  name: string;
  primary: string;           // Base text color
  accent: string;            // Script flourish & highlight color
  brushOrBadgeBg: string;    // Brush splash or pill badge background
  brushOrBadgeText: string;  // Text inside brush or pill badge
  secondaryBadgeBg: string;  // Secondary ribbon or tag background
  secondaryBadgeText: string;// Text inside secondary tag
  cardBg: string;            // Card or torn paper background
  cardBorder: string;        // Card border stroke
  cardText: string;          // Text inside card
  washiTape: string;         // Washi tape strip color
  scrimColor: string;        // Gradient scrim color (black/navy/white)
  scrimOpacity: number;
  highlightLine: string;     // Underline or divider bar
  iconColor: string;         // Feature icon stroke & text
  isLightMode: boolean;      // Whether base text is dark
}

export const COLOR_PALETTES: Record<string, AdaptiveColorPalette> = {
  christmas_holiday: {
    id: "christmas_holiday",
    name: "Festive Christmas & Gold",
    primary: "#ffffff",
    accent: "#facc15",
    brushOrBadgeBg: "#14402a",       // Deep evergreen
    brushOrBadgeText: "#ffffff",
    secondaryBadgeBg: "#991b1b",     // Rich holiday crimson
    secondaryBadgeText: "#ffffff",
    cardBg: "#123724",
    cardBorder: "#276749",
    cardText: "#ffffff",
    washiTape: "#b91c1c",
    scrimColor: "#051f15",
    scrimOpacity: 0.85,
    highlightLine: "#eab308",
    iconColor: "#facc15",
    isLightMode: false,
  },
  luxury_plum_nails: {
    id: "luxury_plum_nails",
    name: "Luxury Plum & Rose Gold",
    primary: "#ffffff",
    accent: "#fbcfe8",
    brushOrBadgeBg: "#4a154b",       // Rich luxury plum
    brushOrBadgeText: "#ffffff",
    secondaryBadgeBg: "#be185d",     // Deep rose
    secondaryBadgeText: "#ffffff",
    cardBg: "#faf5f0",
    cardBorder: "#f3e8e2",
    cardText: "#3b0764",
    washiTape: "#c084fc",
    scrimColor: "#1e0b24",
    scrimOpacity: 0.82,
    highlightLine: "#f472b6",
    iconColor: "#f472b6",
    isLightMode: false,
  },
  salon_caramel_hair: {
    id: "salon_caramel_hair",
    name: "Salon Caramel & Mocha",
    primary: "#ffffff",
    accent: "#fde68a",
    brushOrBadgeBg: "#78350f",       // Warm caramel mocha
    brushOrBadgeText: "#ffffff",
    secondaryBadgeBg: "#b45309",     // Golden amber
    secondaryBadgeText: "#ffffff",
    cardBg: "#fefce8",
    cardBorder: "#fef08a",
    cardText: "#451a03",
    washiTape: "#d97706",
    scrimColor: "#1c1008",
    scrimOpacity: 0.85,
    highlightLine: "#f59e0b",
    iconColor: "#fde68a",
    isLightMode: false,
  },
  dusty_blue_home: {
    id: "dusty_blue_home",
    name: "Coastal Dusty Blue & Walnut",
    primary: "#ffffff",
    accent: "#93c5fd",
    brushOrBadgeBg: "#2c4866",       // Dusty coastal blue
    brushOrBadgeText: "#ffffff",
    secondaryBadgeBg: "#78350f",     // Warm walnut accent
    secondaryBadgeText: "#ffffff",
    cardBg: "#f0f4f8",
    cardBorder: "#d1dce5",
    cardText: "#0f2337",
    washiTape: "#64748b",
    scrimColor: "#0b1926",
    scrimOpacity: 0.85,
    highlightLine: "#60a5fa",
    iconColor: "#93c5fd",
    isLightMode: false,
  },
  terracotta_boho: {
    id: "terracotta_boho",
    name: "Warm Terracotta & Sand",
    primary: "#ffffff",
    accent: "#fed7aa",
    brushOrBadgeBg: "#9a3412",       // Sun-baked terracotta
    brushOrBadgeText: "#ffffff",
    secondaryBadgeBg: "#c2410c",     // Burnt rust
    secondaryBadgeText: "#ffffff",
    cardBg: "#fff7ed",
    cardBorder: "#fed7aa",
    cardText: "#431407",
    washiTape: "#ea580c",
    scrimColor: "#1e0b04",
    scrimOpacity: 0.85,
    highlightLine: "#fb923c",
    iconColor: "#fed7aa",
    isLightMode: false,
  },
  rose_skincare: {
    id: "rose_skincare",
    name: "Soft Rose & Petal Blush",
    primary: "#ffffff",
    accent: "#f43f5e",
    brushOrBadgeBg: "#fb7185",       // Soft blush rose
    brushOrBadgeText: "#ffffff",
    secondaryBadgeBg: "#059669",     // Botanical jade
    secondaryBadgeText: "#ffffff",
    cardBg: "#fff1f2",
    cardBorder: "#fecdd3",
    cardText: "#881337",
    washiTape: "#fda4af",
    scrimColor: "#1f0a10",
    scrimOpacity: 0.80,
    highlightLine: "#fb7185",
    iconColor: "#fb7185",
    isLightMode: false,
  },
  warm_peach: {
    id: "warm_peach",
    name: "Warm Peach & Coffee",
    primary: "#ffffff",
    accent: "#fca5a5",
    brushOrBadgeBg: "#f8a595",
    brushOrBadgeText: "#1c1917",
    secondaryBadgeBg: "#fb7185",
    secondaryBadgeText: "#ffffff",
    cardBg: "#fae8e0",
    cardBorder: "#ecd4ca",
    cardText: "#292524",
    washiTape: "#c2410c",
    scrimColor: "#000000",
    scrimOpacity: 0.75,
    highlightLine: "#f87171",
    iconColor: "#fca5a5",
    isLightMode: false,
  },
  golden_amber: {
    id: "golden_amber",
    name: "Golden Amber & Sunshine",
    primary: "#ffffff",
    accent: "#facc15",
    brushOrBadgeBg: "#f59e0b",
    brushOrBadgeText: "#18181b",
    secondaryBadgeBg: "#d97706",
    secondaryBadgeText: "#ffffff",
    cardBg: "#fef3c7",
    cardBorder: "#fde68a",
    cardText: "#1e293b",
    washiTape: "#d97706",
    scrimColor: "#000000",
    scrimOpacity: 0.75,
    highlightLine: "#f59e0b",
    iconColor: "#facc15",
    isLightMode: false,
  },
  ocean_azure: {
    id: "ocean_azure",
    name: "Ocean Azure & Deep Sea",
    primary: "#ffffff",
    accent: "#38bdf8",
    brushOrBadgeBg: "#0284c7",
    brushOrBadgeText: "#ffffff",
    secondaryBadgeBg: "#eab308",
    secondaryBadgeText: "#0f172a",
    cardBg: "#f0f9ff",
    cardBorder: "#bae6fd",
    cardText: "#0c4a6e",
    washiTape: "#ca8a04",
    scrimColor: "#0c2340",
    scrimOpacity: 0.82,
    highlightLine: "#38bdf8",
    iconColor: "#38bdf8",
    isLightMode: false,
  },
  sage_forest: {
    id: "sage_forest",
    name: "Organic Sage & Mint",
    primary: "#ffffff",
    accent: "#86efac",
    brushOrBadgeBg: "#586f52",
    brushOrBadgeText: "#ffffff",
    secondaryBadgeBg: "#8ca281",
    secondaryBadgeText: "#ffffff",
    cardBg: "#e8ede6",
    cardBorder: "#cfded0",
    cardText: "#14532d",
    washiTape: "#657a5c",
    scrimColor: "#062312",
    scrimOpacity: 0.78,
    highlightLine: "#8ca281",
    iconColor: "#14532d",
    isLightMode: false,
  },
  dark_cinematic: {
    id: "dark_cinematic",
    name: "Dark Cinematic & Gold",
    primary: "#ffffff",
    accent: "#facc15",
    brushOrBadgeBg: "#18181b",
    brushOrBadgeText: "#ffffff",
    secondaryBadgeBg: "#eab308",
    secondaryBadgeText: "#000000",
    cardBg: "#18181b",
    cardBorder: "#27272a",
    cardText: "#f4f4f5",
    washiTape: "#ca8a04",
    scrimColor: "#000000",
    scrimOpacity: 0.92,
    highlightLine: "#facc15",
    iconColor: "#facc15",
    isLightMode: false,
  },
  blush_craft: {
    id: "blush_craft",
    name: "Blush Kraft & Art Studio",
    primary: "#ffffff",
    accent: "#fb7185",
    brushOrBadgeBg: "#f43f5e",
    brushOrBadgeText: "#ffffff",
    secondaryBadgeBg: "#b45309",
    secondaryBadgeText: "#ffffff",
    cardBg: "#faf7f2",
    cardBorder: "#e7ded3",
    cardText: "#292524",
    washiTape: "#d8cbab",
    scrimColor: "#000000",
    scrimOpacity: 0.7,
    highlightLine: "#b45309",
    iconColor: "#b45309",
    isLightMode: false,
  },
  clean_slate: {
    id: "clean_slate",
    name: "Clean Minimalist Slate",
    primary: "#0f172a",
    accent: "#0284c7",
    brushOrBadgeBg: "#0f172a",
    brushOrBadgeText: "#ffffff",
    secondaryBadgeBg: "#475569",
    secondaryBadgeText: "#ffffff",
    cardBg: "#ffffff",
    cardBorder: "#e2e8f0",
    cardText: "#0f172a",
    washiTape: "#94a3b8",
    scrimColor: "#ffffff",
    scrimOpacity: 0.95,
    highlightLine: "#0f172a",
    iconColor: "#0f172a",
    isLightMode: true,
  },
  playful_pastel: {
    id: "playful_pastel",
    name: "Playful Pastel & Rainbow",
    primary: "#ffffff",
    accent: "#facc15",
    brushOrBadgeBg: "#fde047",
    brushOrBadgeText: "#18181b",
    secondaryBadgeBg: "#f43f5e",
    secondaryBadgeText: "#ffffff",
    cardBg: "#fffdf5",
    cardBorder: "#fef08a",
    cardText: "#0f172a",
    washiTape: "#38bdf8",
    scrimColor: "#000000",
    scrimOpacity: 0.65,
    highlightLine: "#f43f5e",
    iconColor: "#0284c7",
    isLightMode: false,
  },
};

/**
 * Intelligently resolves the optimal color palette for any user prompt,
 * harmonizing badge, card, and text colors to the mood of the image.
 */
export function resolveAdaptivePalette(
  paletteInput?: string,
  textContext?: string,
  luminanceMode?: "auto" | "light" | "dark"
): AdaptiveColorPalette {
  if (paletteInput && paletteInput !== "auto" && COLOR_PALETTES[paletteInput]) {
    const p = { ...COLOR_PALETTES[paletteInput] };
    if (luminanceMode === "light") p.isLightMode = true;
    if (luminanceMode === "dark") p.isLightMode = false;
    return p;
  }

  const t = (textContext || "").toLowerCase();
  let selected = COLOR_PALETTES.warm_peach;

  // 1. Christmas / Holiday Decor
  if (/christmas|xmas|holiday|noel|wreath|mantel|santa|winter\s*decor|advent|fir\s*tree|pine\s*garland/i.test(t)) {
    selected = COLOR_PALETTES.christmas_holiday;
  }
  // 2. Nails & Manicure (Purple, Plum, Rose, French, Almond)
  else if (/nail|manicure|almond\s*nail|french\s*tip|gel\s*nail|acrylic\s*nail|cuticle|nail\s*art|polish/i.test(t)) {
    selected = COLOR_PALETTES.luxury_plum_nails;
  }
  // 3. Hairstyles & Haircare (Caramel, Balayage, Blonde, Curls)
  else if (/hair|balayage|curls|blonde|brunette|hairstyle|haircut|updo|bob\s*cut|salon|highlights/i.test(t)) {
    selected = COLOR_PALETTES.salon_caramel_hair;
  }
  // 4. Kitchen & Bathroom (Dusty Blue, Walnut, Modern Remodel)
  else if (/kitchen|dusty\s*blue|cabinet|walnut|bathroom|bath|shower|tub|vanity/i.test(t)) {
    selected = COLOR_PALETTES.dusty_blue_home;
  }
  // 5. Terracotta / Boho / Pottery / Clay
  else if (/terracotta|boho|clay|pottery|ceramic|rustic|bohemian/i.test(t)) {
    selected = COLOR_PALETTES.terracotta_boho;
  }
  // 6. Skincare & Beauty Routine
  else if (/skincare|skin\s*routine|serum|facial|glow|beauty\s*routine|cosmetics|dewy/i.test(t)) {
    selected = COLOR_PALETTES.rose_skincare;
  }
  // 7. Travel & Ocean Escapes
  else if (/canada|santorini|travel|explore|cliff|beach|ocean|sea|flight|destination|wanderlust|lake|mountain|road\s*trip|scenic/i.test(t)) {
    selected = COLOR_PALETTES.ocean_azure;
  }
  // 8. Healthy Eating & Fresh Food
  else if (/salad|healthy\s*eating|breakfast|snack|recipe|fresh\s*food|sunny|sunshine|quinoa/i.test(t)) {
    selected = COLOR_PALETTES.golden_amber;
  }
  // 9. Coffee & Bakery
  else if (/coffee|latte|croissant|cafe|espresso|roast|baking|pastry|dessert/i.test(t)) {
    selected = COLOR_PALETTES.warm_peach;
  }
  // 10. Plants / Sage Home / Scandinavian Living Room / Bedroom
  else if (/smoothie|habits|healthy\s*habits|green|plants|wellness|living\s*room|cozy\s*home|home\s*inspiration|organic|herbs|lime|bedroom/i.test(t)) {
    selected = COLOR_PALETTES.sage_forest;
  }
  // 11. Fitness & Workout
  else if (/fitness|gym|workout|stronger|weights|active|energy|daisy|minimal|exercise/i.test(t)) {
    selected = COLOR_PALETTES.clean_slate;
  }
  // 12. Crafts & Handmade DIY
  else if (/diy|craft|art|creative|handmade|hidden\s*gems|stationery|journal|watercolor/i.test(t)) {
    selected = COLOR_PALETTES.blush_craft;
  }
  // 13. Kids & Playroom
  else if (/kids|play|playroom|little\s*moments|joy|rainbow|baby|nursery|toddler|toys/i.test(t)) {
    selected = COLOR_PALETTES.playful_pastel;
  }
  // 14. Dark / Moody / Twilight / Luxury
  else if (/moody|dusk|night|luxury|dark|dramatic|highway/i.test(t)) {
    selected = COLOR_PALETTES.dark_cinematic;
  }

  const p = { ...selected };
  if (luminanceMode === "light") p.isLightMode = true;
  if (luminanceMode === "dark") p.isLightMode = false;
  return p;
}

/**
 * Generates an SVG representation of the overlay that Sharp can composite over the raw image.
 * Supports all 11 core presets + the 8 new styles from the user's reference image with
 * live adaptive color harmony and high-contrast typography.
 */
export function renderOverlaySvg(config: OverlayConfig): string {
  const { canvas, text, background, accent, logo, url, nicheData } = config;
  const { w, h } = canvas;
  const rawPreset = text.preset || "classic_clean_travel";
  let preset = (rawPreset in OVERLAY_PRESETS ? rawPreset : "classic_clean_travel") as PresetName;

  // Extract niche content fields if provided
  const rawTextContent = text.content?.trim();
  let kicker = nicheData?.kicker;
  let mainTitle = nicheData?.mainTitle || rawTextContent || "Living Room Ideas";
  let accentScript = nicheData?.accentScript || "Ideas";
  let subtitle = nicheData?.subtitle || "Simple design ideas to elevate your aesthetic.";
  let bullets = nicheData?.footerBullets || ["BETTER LAYOUT", "SMART STORAGE", "FRESH LOOK"];
  let icons = nicheData?.iconsList || [
    { icon: "home", text: "Better Layout" },
    { icon: "storage", text: "Smart Storage" },
    { icon: "light", text: "More Light" },
    { icon: "heart", text: "Cozy Vibes" },
  ];

  // Universal Any-Niche Kicker & Hook Deduction
  const lowerSubject = (rawTextContent || mainTitle).toLowerCase();
  if (!kicker || kicker === "AESTHETIC" || kicker === "IDEAS & INSPO" || kicker === "HOME DESIGN") {
    if (lowerSubject.includes("canada") || lowerSubject.includes("santorini") || lowerSubject.includes("travel") || lowerSubject.includes("destination") || lowerSubject.includes("explore")) {
      kicker = lowerSubject.includes("canada") ? "THE BEST" : lowerSubject.includes("santorini") ? "DISCOVER" : "TRAVEL GUIDE";
      accentScript = lowerSubject.includes("canada") ? "in Canada" : lowerSubject.includes("santorini") ? "Destinations" : "Explore More ♡";
      subtitle = "Scenic routes and unforgettable places to explore on your next journey.";
      bullets = ["NATURE", "ADVENTURE", "BEAUTY"];
    } else if (lowerSubject.includes("coffee") || lowerSubject.includes("croissant") || lowerSubject.includes("cafe") || lowerSubject.includes("latte") || lowerSubject.includes("espresso")) {
      kicker = "GOOD COFFEE";
      accentScript = "Better Days";
      subtitle = "Rich comforting roasts and cafe aesthetics to elevate your mornings.";
      bullets = ["SIP", "RELAX", "REPEAT"];
    } else if (lowerSubject.includes("salad") || lowerSubject.includes("healthy eating") || lowerSubject.includes("recipe") || lowerSubject.includes("food") || lowerSubject.includes("dinner") || lowerSubject.includes("breakfast")) {
      kicker = "HEALTHY EATING";
      accentScript = "Better Mood ♡";
      subtitle = "Wholesome, colorful dishes with fresh ingredients to nourish your day.";
      bullets = ["BETTER FOOD", "BRIGHTER DAYS", "EASY PREP"];
    } else if (lowerSubject.includes("fitness") || lowerSubject.includes("gym") || lowerSubject.includes("workout") || lowerSubject.includes("stronger") || lowerSubject.includes("habits") || lowerSubject.includes("smoothie")) {
      kicker = lowerSubject.includes("fitness") ? "FITNESS" : "HEALTHY HABITS";
      accentScript = "Better You";
      subtitle = "Simple positive habits and mindful workouts for daily vitality.";
      bullets = ["EAT WELL", "STAY ACTIVE", "BE HAPPY"];
    } else if (lowerSubject.includes("diy") || lowerSubject.includes("craft") || lowerSubject.includes("pottery") || lowerSubject.includes("art") || lowerSubject.includes("creative")) {
      kicker = "CREATIVE DIY";
      accentScript = "Ideas ♡";
      subtitle = "Step-by-step inspiring artisan projects using simple materials.";
      bullets = ["CRAFT", "CREATE", "ENJOY"];
    } else if (lowerSubject.includes("kids") || lowerSubject.includes("playroom") || lowerSubject.includes("nursery") || lowerSubject.includes("moments") || lowerSubject.includes("joy")) {
      kicker = "LITTLE MOMENTS";
      accentScript = "Big Joy";
      subtitle = "Joyful creative spaces and moments that spark children's wonder.";
      bullets = ["PLAY", "LEARN", "GROW"];
    } else if (lowerSubject.includes("daisy") || lowerSubject.includes("flower") || lowerSubject.includes("nature") || lowerSubject.includes("changes")) {
      kicker = "SMALL";
      accentScript = "Make a Difference";
      subtitle = "Mindful moments and gentle simplicity that inspire a peaceful lifestyle.";
      bullets = ["PEACEFUL", "NATURAL", "MINDFUL"];
    } else if (lowerSubject.includes("bathroom") || lowerSubject.includes("bath")) {
      kicker = "BATHROOM DESIGN";
      accentScript = "Ideas";
      subtitle = "Rich wood double vanity paired with freestanding tub and marble tiles.";
      bullets = ["FREESTANDING TUB", "MARBLE TILES", "SPA RETREAT"];
    } else if (lowerSubject.includes("kitchen")) {
      kicker = "KITCHEN DESIGN";
      accentScript = "Ideas";
      subtitle = "Dusty blue shaker cabinets paired with warm walnut island.";
      bullets = ["DUSTY BLUE", "WALNUT ISLAND", "WARM WOOD"];
    } else if (lowerSubject.includes("living room") || lowerSubject.includes("living")) {
      kicker = "SMALL SPACE";
      accentScript = "Ideas";
      subtitle = "Simple design ideas to make your living room feel larger and brighter.";
      bullets = ["BETTER LAYOUT", "SMART STORAGE", "FRESH LOOK"];
    } else if (lowerSubject.includes("bedroom")) {
      kicker = "SANCTUARY";
      accentScript = "Makeover";
      subtitle = "Warm neutral layers and ambient lighting ideas for restful sleep.";
      bullets = ["WARM LAYERS", "SOFT LIGHT", "COZY VIBES"];
    } else if (lowerSubject.includes("hair")) {
      kicker = "HAIR INSPIRATION";
      accentScript = "Transformation";
      subtitle = "Stunning dimension and effortless movement for everyday chic.";
      bullets = ["HEALTHY SHINE", "EASY STYLING", "MODERN CUT"];
    } else if (lowerSubject.includes("nail")) {
      kicker = "MANICURE INSPO";
      accentScript = "Aesthetic";
      subtitle = "Trending nail art designs and clean aesthetic manicure ideas.";
      bullets = ["HIGH GLOSS", "CLEAN CUTICLES", "TRENDING SHAPE"];
    } else {
      kicker = "TRENDING INSPO";
    }
  }

  // Resolve Adaptive Color Harmony Palette
  const pal = resolveAdaptivePalette(
    config.palette,
    (rawTextContent || "") + " " + (nicheData?.mainTitle || "") + " " + kicker,
    config.luminanceMode
  );

  // Detect if subject is a portrait (e.g. hairstyles) so text doesn't cover face,
  // otherwise use the authentic top-left positioning from the reference image styles.
  const isPortraitSubject =
    kicker.toLowerCase().includes("hair") ||
    /hair|curls|balayage|bob|blonde|brunette|ponytail|updo|portrait|model|face|makeup|lookbook/i.test(mainTitle + " " + kicker);

  let logoSvg = "";
  if (logo?.url) {
    const scale = Math.min(0.22, Math.max(0.08, logo.scale || 0.14));
    const logoW = Math.round(w * scale);
    const logoH = Math.round(logoW * 0.45);
    const marginX = Math.round(w * 0.04);
    const marginY = Math.round(h * 0.04);
    let logoX = w - logoW - marginX;
    let logoY = h - logoH - marginY;
    if (logo.position === "top_left") {
      logoX = marginX;
      logoY = marginY;
    } else if (logo.position === "top_right") {
      logoX = w - logoW - marginX;
      logoY = marginY;
    } else if (logo.position === "bottom_left") {
      logoX = marginX;
      logoY = h - logoH - marginY;
    }

    // Text box collision avoidance
    const boxX = (text.box?.x ?? 0.08) * w;
    const boxY = (text.box?.y ?? 0.65) * h;
    const boxW = (text.box?.w ?? 0.84) * w;
    const boxH = (text.box?.h ?? 0.28) * h;

    const overlapsX = logoX < boxX + boxW && logoX + logoW > boxX;
    const overlapsY = logoY < boxY + boxH && logoY + logoH > boxY;
    if (overlapsX && overlapsY) {
      if (logo.position?.startsWith("bottom") || (!logo.position && boxY > h / 2)) {
        logoY = marginY; // shift to top margin
      } else {
        logoY = h - logoH - marginY; // shift to bottom margin
      }
    }

    logoSvg = `<image href="${escapeXml(logo.url)}" x="${logoX}" y="${logoY}" width="${logoW}" opacity="${logo.opacity ?? 0.9}" />`;
  }

  let urlSvg = "";
  if (url?.text) {
    urlSvg = `
      <rect x="${w / 2 - 120}" y="${h - 44}" width="240" height="26" rx="13" fill="#020617" fill-opacity="0.75"/>
      <text x="${w / 2}" y="${h - 26}" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="600" fill="#f8fafc" letter-spacing="1">
        ${escapeXml(url.text.toUpperCase())}
      </text>
    `;
  }

  // =========================================================================
  // 1A. CLASSIC CLEAN / ELEGANT SERIF (Canada Travel / Small Space Big Style)
  // =========================================================================
  if (preset === "classic_clean_travel") {
    const kickerY = isPortraitSubject ? Math.round(h * 0.70) : Math.round(h * 0.16);
    const titleY = kickerY + 52;
    const subY = titleY + 38;
    const scrimY = isPortraitSubject ? Math.round(h * 0.50) : 0;
    const scrimH = isPortraitSubject ? Math.round(h * 0.50) : Math.round(h * 0.55);

    const isTravelSky = /canada|santorini|travel|sky|destination|flight|trip|wanderlust|vacation|lake|beach|mountain|scenic/i.test(lowerSubject);
    const isLightMode = pal.isLightMode || isTravelSky;
    const titleColor = isLightMode ? "#0c2340" : "#ffffff";
    const kickerColor = isLightMode ? "#334155" : "#ffffff";
    const subColor = isLightMode ? "#475569" : "#f1f5f9";
    const scrimColor = isLightMode ? "#ffffff" : pal.scrimColor;
    const scrimOpacity = isLightMode ? 0.92 : pal.scrimOpacity;

    const titleWords = mainTitle.split(/\s+/);
    let titleLine1 = mainTitle;
    let titleLine2 = "";
    if (titleWords.length >= 3 && mainTitle.length > 18) {
      const mid = Math.ceil(titleWords.length / 2);
      titleLine1 = titleWords.slice(0, mid).join(" ");
      titleLine2 = titleWords.slice(mid).join(" ");
    }

    const flightPath = isTravelSky ? `
      <g opacity="0.85">
        <path d="M ${Math.round(w * 0.65)} ${kickerY - 4} Q ${Math.round(w * 0.75)} ${kickerY - 24} ${Math.round(w * 0.84)} ${kickerY - 14}" fill="none" stroke="${titleColor}" stroke-width="2" stroke-dasharray="4,4"/>
        <polygon points="${Math.round(w * 0.86)},${kickerY - 12} ${Math.round(w * 0.84)},${kickerY - 20} ${Math.round(w * 0.82)},${kickerY - 14}" fill="${titleColor}"/>
      </g>
    ` : `
      <g opacity="0.85">
        <line x1="${Math.round(w * 0.68)}" y1="${kickerY - 4}" x2="${Math.round(w * 0.86)}" y2="${kickerY - 4}" stroke="${pal.highlightLine || titleColor}" stroke-width="2"/>
        <circle cx="${Math.round(w * 0.87)}" cy="${kickerY - 4}" r="3" fill="${pal.highlightLine || titleColor}"/>
      </g>
    `;

    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
        <defs>
          <linearGradient id="scrim_es" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${scrimColor}" stop-opacity="${scrimOpacity}"/>
            <stop offset="65%" stop-color="${scrimColor}" stop-opacity="${scrimOpacity * 0.5}"/>
            <stop offset="100%" stop-color="${scrimColor}" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        <rect x="0" y="${scrimY}" width="${w}" height="${scrimH}" fill="url(#scrim_es)"/>
        ${flightPath}
        <!-- Category Kicker -->
        <text x="${Math.round(w * 0.08)}" y="${kickerY}" font-family="Inter, sans-serif" font-size="16" letter-spacing="5" font-weight="600" fill="${kickerColor}" opacity="0.95">
          ${escapeXml(kicker.toUpperCase())}
        </text>
        <!-- Big Serif Title -->
        <text x="${Math.round(w * 0.08)}" y="${titleY}" font-family="Playfair Display, Georgia, serif" font-size="${titleLine2 ? 40 : 48}" font-weight="700" fill="${titleColor}">
          <tspan x="${Math.round(w * 0.08)}" dy="0">${escapeXml(titleLine1)}</tspan>
          ${titleLine2 ? `<tspan x="${Math.round(w * 0.08)}" dy="44">${escapeXml(titleLine2)}</tspan>` : ""}
        </text>
        <!-- Cursive Script Accent -->
        <text x="${Math.round(w * 0.08)}" y="${subY + (titleLine2 ? 44 : 0)}" font-family="'Dancing Script', 'Caveat', cursive" font-style="italic" font-size="38" font-weight="700" fill="${pal.accent || titleColor}">
          ${escapeXml(accentScript || (isTravelSky ? "in Canada" : "Ideas & Styling"))}
        </text>
        <!-- Descriptive Subtitle / Bullets -->
        <text x="${Math.round(w * 0.08)}" y="${subY + (titleLine2 ? 44 : 0) + 38}" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="${subColor}" letter-spacing="3">
          ${escapeXml(bullets.slice(0, 3).join(" • "))}
        </text>
        ${logoSvg}
        ${urlSvg}
      </svg>
    `.trim();
  }

  // =========================================================================
  // 2A. MODERN BOLD PEACH (Good Food / Peach Painted Splash)
  // =========================================================================
  if (preset === "modern_bold_peach") {
    const badgeX = Math.round(w * 0.08);
    const badgeY = isPortraitSubject ? Math.round(h * 0.67) : Math.round(h * 0.16);
    const titleY = badgeY + 60;
    const scriptY = titleY + 44;
    const footerY = scriptY + 44;
    const scrimY = isPortraitSubject ? Math.round(h * 0.50) : 0;
    const scrimH = isPortraitSubject ? Math.round(h * 0.50) : Math.round(h * 0.55);

    const badgeText = kicker.includes(" ") ? kicker.split(" ")[0] : kicker;

    const rays = `
      <g stroke="${pal.accent}" stroke-width="2.5" stroke-linecap="round" opacity="0.95">
        <line x1="${badgeX + 18}" y1="${badgeY - 8}" x2="${badgeX + 14}" y2="${badgeY - 18}"/>
        <line x1="${badgeX + 30}" y1="${badgeY - 10}" x2="${badgeX + 30}" y2="${badgeY - 22}"/>
        <line x1="${badgeX + 42}" y1="${badgeY - 8}" x2="${badgeX + 46}" y2="${badgeY - 18}"/>
      </g>
    `;

    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
        <defs>
          <linearGradient id="scrim_mb" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${pal.scrimColor}" stop-opacity="${pal.scrimOpacity}"/>
            <stop offset="50%" stop-color="${pal.scrimColor}" stop-opacity="${pal.scrimOpacity * 0.5}"/>
            <stop offset="100%" stop-color="${pal.scrimColor}" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        <rect x="0" y="${scrimY}" width="${w}" height="${scrimH}" fill="url(#scrim_mb)"/>
        ${rays}
        <g transform="rotate(-1.5 ${badgeX + 65} ${badgeY + 19})">
          <rect x="${badgeX}" y="${badgeY}" width="140" height="40" rx="8" fill="${pal.brushOrBadgeBg}"/>
          <text x="${badgeX + 70}" y="${badgeY + 26}" text-anchor="middle" font-family="Inter, sans-serif" font-size="18" font-weight="900" fill="${pal.brushOrBadgeText}" letter-spacing="2">
            ${escapeXml(badgeText.slice(0, 12).toUpperCase())}
          </text>
        </g>
        <text x="${badgeX}" y="${titleY}" font-family="Inter, Montserrat, sans-serif" font-size="44" font-weight="900" fill="${pal.primary}" letter-spacing="1">
          ${escapeXml(mainTitle.toUpperCase())}
        </text>
        <text x="${badgeX}" y="${scriptY}" font-family="'Dancing Script', 'Caveat', 'Playfair Display', cursive" font-style="italic" font-size="44" font-weight="700" fill="${pal.accent}">
          ${escapeXml(accentScript)}
        </text>
        <text x="${badgeX}" y="${footerY}" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="${pal.highlightLine}" letter-spacing="3" opacity="0.95">
          ${escapeXml(bullets.slice(0, 3).join(" • "))}
        </text>
        ${logoSvg}
        ${urlSvg}
      </svg>
    `.trim();
  }

  // =========================================================================
  // 3A. HANDWRITTEN EXPLORE (Explore More ♡ / Coastal Cliff)
  // =========================================================================
  if (preset === "handwritten_explore") {
    const textX = Math.round(w * 0.08);
    const textY = isPortraitSubject ? Math.round(h * 0.73) : Math.round(h * 0.16);
    const titleWords = mainTitle.split(/\s+/);
    let line1 = "Explore";
    let line2 = `${mainTitle} \u2661`;
    if (titleWords.length >= 2) {
      line1 = titleWords.slice(0, 1).join(" ");
      line2 = `${titleWords.slice(1).join(" ")} \u2661`;
    }

    const pillY = textY + 98;
    const scrimY = isPortraitSubject ? Math.round(h * 0.52) : 0;
    const scrimH = isPortraitSubject ? Math.round(h * 0.48) : Math.round(h * 0.55);

    const tagText = accentScript && accentScript !== "Ideas" ? accentScript : "Feel Like Home";
    const brushUnderline = `
      <path d="M ${textX} ${textY + 64} Q ${textX + 90} ${textY + 74} ${textX + 180} ${textY + 64}" stroke="${pal.highlightLine}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    `;

    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
        <defs>
          <linearGradient id="scrim_hw" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${pal.scrimColor}" stop-opacity="${pal.scrimOpacity}"/>
            <stop offset="50%" stop-color="${pal.scrimColor}" stop-opacity="${pal.scrimOpacity * 0.5}"/>
            <stop offset="100%" stop-color="${pal.scrimColor}" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        <rect x="0" y="${scrimY}" width="${w}" height="${scrimH}" fill="url(#scrim_hw)"/>
        <text x="${textX}" y="${textY}" font-family="'Caveat', 'Dancing Script', 'Playfair Display', cursive" font-style="italic" font-size="50" font-weight="700" fill="${pal.accent}">
          <tspan x="${textX}" dy="0">${escapeXml(line1)}</tspan>
          <tspan x="${textX}" dy="54">${escapeXml(line2)}</tspan>
        </text>
        ${brushUnderline}
        <g transform="rotate(-1.8 ${textX + 115} ${pillY + 22})">
          <rect x="${textX}" y="${pillY}" width="230" height="46" rx="14" fill="${pal.secondaryBadgeBg}" opacity="0.96"/>
          <text x="${textX + 115}" y="${pillY + 31}" text-anchor="middle" font-family="'Caveat', 'Dancing Script', cursive" font-style="italic" font-size="28" font-weight="700" fill="${pal.secondaryBadgeText}">
            ${escapeXml(tagText)}
          </text>
        </g>
        ${logoSvg}
        ${urlSvg}
      </svg>
    `.trim();
  }

  // =========================================================================
  // 4A. MINIMAL CLEAN NATURE (Small Changes / Daisy Flower)
  // =========================================================================
  if (preset === "minimal_clean_nature") {
    const textX = Math.round(w * 0.08);
    const kickerY = isPortraitSubject ? Math.round(h * 0.72) : Math.round(h * 0.16);
    const titleY = kickerY + 40;
    const subY = titleY + 38;
    const scrimY = isPortraitSubject ? Math.round(h * 0.58) : 0;
    const scrimH = isPortraitSubject ? Math.round(h * 0.42) : Math.round(h * 0.52);

    const isLightMode = pal.isLightMode;
    const textColor = isLightMode ? "#0f172a" : "#ffffff";
    const subColor = isLightMode ? "#475569" : "#e2e8f0";
    const fadeFrom = isLightMode ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.85)";
    const fadeTo = isLightMode ? "rgba(255,255,255,0.0)" : "rgba(0,0,0,0.0)";

    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
        <defs>
          <linearGradient id="fade_mc" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${fadeFrom}" stop-opacity="1"/>
            <stop offset="60%" stop-color="${fadeFrom}" stop-opacity="0.6"/>
            <stop offset="100%" stop-color="${fadeTo}" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        <rect x="0" y="${scrimY}" width="${w}" height="${scrimH}" fill="url(#fade_mc)"/>
        <text x="${textX}" y="${kickerY}" font-family="Inter, sans-serif" font-size="14" font-weight="600" fill="${textColor}" letter-spacing="6">
          ${escapeXml(kicker.split("").join(" ").toUpperCase())}
        </text>
        <text x="${textX}" y="${titleY}" font-family="Playfair Display, Georgia, serif" font-size="42" font-weight="800" fill="${textColor}">
          ${escapeXml(mainTitle)}
        </text>
        <text x="${textX}" y="${subY}" font-family="Inter, sans-serif" font-size="15" font-weight="600" fill="${subColor}" letter-spacing="2">
          ${escapeXml(subtitle.slice(0, 38).toUpperCase())}
        </text>
        <line x1="${textX}" y1="${subY + 22}" x2="${textX + 60}" y2="${subY + 22}" stroke="${pal.highlightLine}" stroke-width="2.5"/>
        ${logoSvg}
        ${urlSvg}
      </svg>
    `.trim();
  }

  // =========================================================================
  // 5A. PLAYFUL COLORFUL BADGE (Weekend Getaway / Pine Cabin Lake)
  // =========================================================================
  if (preset === "playful_colorful_badge") {
    const textX = Math.round(w * 0.08);
    const tag1Y = isPortraitSubject ? Math.round(h * 0.67) : Math.round(h * 0.16);
    const tag2Y = tag1Y + 48;
    const tag3Y = tag2Y + 50;
    const footerY = tag3Y + 44;
    const scrimY = isPortraitSubject ? Math.round(h * 0.50) : 0;
    const scrimH = isPortraitSubject ? Math.round(h * 0.50) : Math.round(h * 0.55);

    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
        <defs>
          <linearGradient id="scrim_pc" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${pal.scrimColor}" stop-opacity="${pal.scrimOpacity}"/>
            <stop offset="50%" stop-color="${pal.scrimColor}" stop-opacity="${pal.scrimOpacity * 0.5}"/>
            <stop offset="100%" stop-color="${pal.scrimColor}" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        <rect x="0" y="${scrimY}" width="${w}" height="${scrimH}" fill="url(#scrim_pc)"/>
        <g stroke="${pal.accent}" stroke-width="2.5" stroke-linecap="round" opacity="0.95">
          <line x1="${textX - 8}" y1="${tag1Y + 14}" x2="${textX - 18}" y2="${tag1Y + 8}" />
          <line x1="${textX - 8}" y1="${tag1Y + 24}" x2="${textX - 20}" y2="${tag1Y + 24}" />
          <line x1="${textX - 6}" y1="${tag1Y + 34}" x2="${textX - 16}" y2="${tag1Y + 40}" />
          <line x1="${textX + 112}" y1="${tag1Y + 12}" x2="${textX + 122}" y2="${tag1Y + 6}" />
          <line x1="${textX + 114}" y1="${tag1Y + 22}" x2="${textX + 126}" y2="${tag1Y + 22}" />
        </g>
        <g transform="rotate(-3 ${textX + 50} ${tag1Y + 20})">
          <rect x="${textX}" y="${tag1Y}" width="115" height="42" rx="10" fill="${pal.brushOrBadgeBg}"/>
          <text x="${textX + 57}" y="${tag1Y + 28}" text-anchor="middle" font-family="'Inter', 'Montserrat', sans-serif" font-size="20" font-weight="900" fill="${pal.brushOrBadgeText}">
            ${escapeXml(kicker.slice(0, 10))}
          </text>
        </g>
        <g transform="rotate(1.5 ${textX + 130} ${tag2Y + 24})">
          <rect x="${textX}" y="${tag2Y}" width="260" height="50" rx="12" fill="${pal.cardBg}" filter="drop-shadow(0 4px 10px rgba(0,0,0,0.25))"/>
          <text x="${textX + 130}" y="${tag2Y + 34}" text-anchor="middle" font-family="'Caveat', 'Dancing Script', cursive" font-style="italic" font-size="30" font-weight="800" fill="${pal.cardText}">
            ${escapeXml(mainTitle.slice(0, 16))}
          </text>
        </g>
        <g transform="rotate(-1.5 ${textX + 120} ${tag3Y + 22})">
          <rect x="${textX}" y="${tag3Y}" width="240" height="46" rx="10" fill="${pal.secondaryBadgeBg}"/>
          <text x="${textX + 120}" y="${tag3Y + 31}" text-anchor="middle" font-family="'Inter', 'Montserrat', sans-serif" font-size="22" font-weight="900" fill="${pal.secondaryBadgeText}">
            ${escapeXml((accentScript || "Ideas").toUpperCase())}
          </text>
        </g>
        <text x="${textX}" y="${footerY}" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="#ffffff" letter-spacing="3" opacity="0.95">
          ${escapeXml(bullets.slice(0, 3).join(" • "))}
        </text>
        ${logoSvg}
        ${urlSvg}
      </svg>
    `.trim();
  }

  // =========================================================================
  // 6A. DARK CINEMATIC ROAD (Road Trip / Mountain Highway)
  // =========================================================================
  if (preset === "dark_cinematic_road") {
    const kickerY = isPortraitSubject ? Math.round(h * 0.69) : Math.round(h * 0.16);
    const titleY = kickerY + 44;
    const scriptY = titleY + 48;
    const footerY = scriptY + 42;
    const scrimY = isPortraitSubject ? Math.round(h * 0.48) : 0;
    const scrimH = isPortraitSubject ? Math.round(h * 0.52) : Math.round(h * 0.55);

    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
        <defs>
          <linearGradient id="scrim_dc" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#000000" stop-opacity="0.95"/>
            <stop offset="60%" stop-color="#000000" stop-opacity="0.6"/>
            <stop offset="100%" stop-color="#000000" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        <rect x="0" y="${scrimY}" width="${w}" height="${scrimH}" fill="url(#scrim_dc)"/>
        <text x="${Math.round(w / 2)}" y="${kickerY}" text-anchor="middle" font-family="'Inter', sans-serif" font-size="14" font-weight="600" fill="#e2e8f0" letter-spacing="5">
          ${escapeXml(kicker.toUpperCase())}
        </text>
        <text x="${Math.round(w / 2)}" y="${titleY}" text-anchor="middle" font-family="'Playfair Display', Georgia, serif" font-size="44" font-weight="800" fill="#ffffff" letter-spacing="2">
          ${escapeXml(mainTitle.toUpperCase())}
        </text>
        <text x="${Math.round(w / 2)}" y="${scriptY}" text-anchor="middle" font-family="'Dancing Script', 'Playfair Display', cursive" font-style="italic" font-size="44" font-weight="700" fill="${pal.accent}">
          ${escapeXml(accentScript || "Inspiration")}
        </text>
        <text x="${Math.round(w / 2)}" y="${footerY}" text-anchor="middle" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#ffffff" letter-spacing="3" opacity="0.85">
          ${escapeXml(bullets.slice(0, 3).join(" • "))}
        </text>
        ${logoSvg}
        ${urlSvg}
      </svg>
    `.trim();
  }

  // =========================================================================
  // 7A. HEALTHY HABITS ICONS (Lifestyle Icons Stack / Green Smoothie)
  // =========================================================================
  if (preset === "healthy_habits_icons") {
    const cardX = Math.round(w * 0.08);
    const cardY = isPortraitSubject ? Math.round(h * 0.55) : Math.round(h * 0.12);
    const cardW = Math.round(w * 0.84);
    const cardH = 250;

    const iconColor = pal.iconColor;
    const iconElements = icons.slice(0, 3).map((item, idx) => {
      const yPos = cardY + 115 + idx * 42;
      return `
        <g>
          <circle cx="${cardX + 24}" cy="${yPos - 4}" r="8" stroke="${iconColor}" stroke-width="2" fill="none"/>
          <text x="${cardX + 44}" y="${yPos + 2}" font-family="Inter, sans-serif" font-size="15" font-weight="600" fill="${iconColor}">
            ${escapeXml(item.text)}
          </text>
        </g>
      `;
    }).join("\n");

    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
        <defs>
          <filter id="icon_shadow" x="-5%" y="-5%" width="115%" height="115%">
            <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#000000" flood-opacity="0.25"/>
          </filter>
        </defs>
        <g filter="url(#icon_shadow)">
          <rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="14" fill="${pal.cardBg}" fill-opacity="0.92" stroke="${pal.cardBorder}" stroke-width="1.5"/>
          <text x="${cardX + 24}" y="${cardY + 44}" font-family="'Inter', 'Montserrat', sans-serif" font-size="32" font-weight="900" fill="${pal.cardText}" letter-spacing="1">
            ${escapeXml(mainTitle)}
          </text>
          <text x="${cardX + 24}" y="${cardY + 84}" font-family="'Dancing Script', 'Caveat', cursive" font-style="italic" font-size="34" font-weight="700" fill="${pal.accent}">
            ${escapeXml(accentScript || "Better You")}
          </text>
          ${iconElements}
        </g>
        ${logoSvg}
        ${urlSvg}
      </svg>
    `.trim();
  }

  // =========================================================================
  // 8A. COLLAGE WASHI GEMS (Hidden Gems / Torn Paper + Washi Tape)
  // =========================================================================
  if (preset === "collage_washi_gems") {
    const cardX = Math.round(w * 0.08);
    const cardY = isPortraitSubject ? Math.round(h * 0.65) : Math.round(h * 0.12);
    const cardW = Math.round(w * 0.74);
    const cardH = 220;
    const centerX = cardX + cardW / 2;

    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
        <defs>
          <filter id="note_shadow" x="-10%" y="-10%" width="125%" height="125%">
            <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000000" flood-opacity="0.35"/>
          </filter>
        </defs>
        <g transform="rotate(-1.8 ${centerX} ${cardY + 100})" filter="url(#note_shadow)">
          <rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="4" fill="${pal.cardBg}" stroke="${pal.cardBorder}" stroke-width="1.5"/>
          <rect x="${centerX - 48}" y="${cardY - 12}" width="96" height="24" rx="2" fill="${pal.washiTape}" opacity="0.88" transform="rotate(-3 ${centerX} ${cardY})"/>
          <text x="${centerX}" y="${cardY + 54}" text-anchor="middle" font-family="'Playfair Display', Georgia, serif" font-size="30" font-weight="700" fill="${pal.cardText}">
            ${escapeXml(mainTitle)}
          </text>
          <text x="${centerX}" y="${cardY + 95}" text-anchor="middle" font-family="'Dancing Script', 'Caveat', 'Playfair Display', cursive" font-style="italic" font-size="38" font-weight="700" fill="${pal.cardText}">
            ${escapeXml(accentScript || "Ideas")} \u2661
          </text>
          <rect x="${centerX - 105}" y="${cardY + 122}" width="210" height="38" rx="6" fill="${pal.secondaryBadgeBg}"/>
          <text x="${centerX}" y="${cardY + 146}" text-anchor="middle" font-family="'Dancing Script', 'Caveat', cursive" font-size="18" font-weight="700" fill="${pal.secondaryBadgeText}">
            ${escapeXml(subtitle.slice(0, 32))}
          </text>
        </g>
        ${logoSvg}
        ${urlSvg}
      </svg>
    `.trim();
  }

  // =========================================================================
  // 1B. CLASSIC ELEGANT SANTORINI (Discover Dream Destinations / Flight Loop)
  // =========================================================================
  if (preset === "classic_elegant_santorini") {
    const textX = Math.round(w * 0.08);
    const kickerY = isPortraitSubject ? Math.round(h * 0.70) : Math.round(h * 0.16);
    const titleY = kickerY + 48;
    const footerY = titleY + 54;
    const scrimY = isPortraitSubject ? Math.round(h * 0.50) : 0;
    const scrimH = isPortraitSubject ? Math.round(h * 0.50) : Math.round(h * 0.50);

    const isLightMode = pal.isLightMode !== false;
    const titleColor = isLightMode ? "#0c2340" : "#ffffff";
    const kickerColor = isLightMode ? "#334155" : "#e2e8f0";
    const scrimColor = isLightMode ? "#ffffff" : "#000000";

    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
        <defs>
          <linearGradient id="scrim_ces" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${scrimColor}" stop-opacity="0.94"/>
            <stop offset="60%" stop-color="${scrimColor}" stop-opacity="0.55"/>
            <stop offset="100%" stop-color="${scrimColor}" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        <rect x="0" y="${scrimY}" width="${w}" height="${scrimH}" fill="url(#scrim_ces)"/>
        <!-- Dotted Flight Trail or Celestial Flourish -->
        <g opacity="0.9">
          ${/canada|santorini|travel|sky|destination|flight|trip|wanderlust|vacation|lake|beach|mountain|ocean/i.test(lowerSubject) ? `
            <path d="M ${Math.round(w * 0.55)} ${kickerY - 4} Q ${Math.round(w * 0.68)} ${kickerY - 26} ${Math.round(w * 0.82)} ${kickerY - 14}" fill="none" stroke="${titleColor}" stroke-width="2" stroke-dasharray="4,4"/>
            <text x="${Math.round(w * 0.84)}" y="${kickerY - 10}" font-size="20" fill="${titleColor}">✈</text>
          ` : `
            <line x1="${Math.round(w * 0.55)}" y1="${kickerY - 4}" x2="${Math.round(w * 0.80)}" y2="${kickerY - 4}" stroke="${pal.highlightLine || titleColor}" stroke-width="2" stroke-dasharray="4,4"/>
            <text x="${Math.round(w * 0.82)}" y="${kickerY - 2}" font-size="16" fill="${pal.highlightLine || titleColor}">✦</text>
          `}
        </g>
        <!-- Category Kicker -->
        <text x="${textX}" y="${kickerY}" font-family="Inter, sans-serif" font-size="14" letter-spacing="5" font-weight="600" fill="${kickerColor}">
          ${escapeXml((kicker || "DISCOVER").toUpperCase())}
        </text>
        <!-- Editorial Serif Title -->
        <text x="${textX}" y="${titleY}" font-family="Playfair Display, Georgia, serif" font-size="44" font-weight="700" fill="${titleColor}">
          ${escapeXml(mainTitle)}
        </text>
        <!-- Spaced Tagline Footer -->
        <text x="${textX}" y="${footerY}" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="${titleColor}" letter-spacing="4" opacity="0.88">
          ${escapeXml(bullets.slice(0, 3).join(" • ").toUpperCase())}
        </text>
        ${logoSvg}
        ${urlSvg}
      </svg>
    `.trim();
  }

  // =========================================================================
  // 2B. MODERN BOLD AMBER (Healthy Eating / Golden Painted Splash Backdrop)
  // =========================================================================
  if (preset === "modern_bold_amber") {
    const textX = Math.round(w * 0.08);
    const textY = isPortraitSubject ? Math.round(h * 0.68) : Math.round(h * 0.16);
    const splashY = textY - 20;

    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
        <defs>
          <filter id="splash_shadow" x="-5%" y="-5%" width="115%" height="115%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.3"/>
          </filter>
        </defs>
        <!-- Golden Painted Splash Stroke Backdrop -->
        <g filter="url(#splash_shadow)">
          <path d="M ${textX} ${splashY} C ${textX + 60} ${splashY - 8}, ${textX + 180} ${splashY + 4}, ${textX + 270} ${splashY - 6} C ${textX + 285} ${splashY + 40}, ${textX + 275} ${splashY + 110}, ${textX + 265} ${splashY + 140} C ${textX + 180} ${splashY + 148}, ${textX + 80} ${splashY + 138}, ${textX - 8} ${splashY + 142} Z" fill="${pal.brushOrBadgeBg}" opacity="0.96"/>
          <!-- Script Title -->
          <text x="${textX + 18}" y="${textY + 36}" font-family="'Caveat', 'Dancing Script', cursive" font-style="italic" font-size="44" font-weight="700" fill="${pal.brushOrBadgeText}">
            ${escapeXml(mainTitle)}
          </text>
          <!-- Cursive Accent -->
          <text x="${textX + 18}" y="${textY + 76}" font-family="'Playfair Display', Georgia, serif" font-size="28" font-weight="800" fill="${pal.brushOrBadgeText}">
            ${escapeXml((accentScript || "Better Food").toUpperCase())}
          </text>
        </g>
        <!-- Marker Subtext Pill -->
        <rect x="${textX + 18}" y="${textY + 98}" width="180" height="28" rx="6" fill="#18181b"/>
        <text x="${textX + 108}" y="${textY + 116}" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="800" fill="#ffffff" letter-spacing="2">
          ${escapeXml((bullets[0] || "BRIGHTER DAYS").toUpperCase())}
        </text>
        ${logoSvg}
        ${urlSvg}
      </svg>
    `.trim();
  }

  // =========================================================================
  // 3B. HANDWRITTEN TORN DESK (Small Steps Big Dreams / Note on Desk)
  // =========================================================================
  if (preset === "handwritten_torn_desk") {
    const cardX = Math.round(w * 0.08);
    const cardY = isPortraitSubject ? Math.round(h * 0.62) : Math.round(h * 0.12);
    const cardW = Math.round(w * 0.65);
    const cardH = 210;
    const centerX = cardX + cardW / 2;

    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
        <defs>
          <filter id="desk_note_shadow" x="-10%" y="-10%" width="125%" height="125%">
            <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#000000" flood-opacity="0.35"/>
          </filter>
        </defs>
        <g transform="rotate(-2 ${centerX} ${cardY + 100})" filter="url(#desk_note_shadow)">
          <!-- Off-White Torn Paper Note -->
          <rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="3" fill="#fdfbf7"/>
          <!-- Top Centered Washi Tape -->
          <rect x="${centerX - 42}" y="${cardY - 14}" width="84" height="24" rx="2" fill="${pal.washiTape}" opacity="0.88" transform="rotate(1.5 ${centerX} ${cardY})"/>
          <!-- Handwritten Cursive Typography -->
          <text x="${cardX + 24}" y="${cardY + 54}" font-family="'Caveat', 'Dancing Script', cursive" font-style="italic" font-size="38" font-weight="700" fill="#1e293b">
            ${escapeXml(mainTitle)}
          </text>
          <text x="${cardX + 24}" y="${cardY + 98}" font-family="'Caveat', 'Dancing Script', cursive" font-style="italic" font-size="34" font-weight="700" fill="#0f172a">
            ${escapeXml(accentScript || "Big Dreams")} \u2661
          </text>
          <!-- Pencil Divider Line -->
          <line x1="${cardX + 24}" y1="${cardY + 124}" x2="${cardX + cardW - 24}" y2="${cardY + 124}" stroke="#cbd5e1" stroke-width="1.5"/>
          <!-- Dotted Footer -->
          <text x="${cardX + 24}" y="${cardY + 154}" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="#64748b" letter-spacing="1">
            ${escapeXml(bullets.slice(0, 3).join(" • "))}
          </text>
        </g>
        ${logoSvg}
        ${urlSvg}
      </svg>
    `.trim();
  }

  // =========================================================================
  // 4B. MINIMAL CLEAN FITNESS (Stronger Every Day / Metric Icons)
  // =========================================================================
  if (preset === "minimal_clean_fitness") {
    const textX = Math.round(w * 0.08);
    const kickerY = isPortraitSubject ? Math.round(h * 0.68) : Math.round(h * 0.16);
    const titleY = kickerY + 44;
    const iconStartY = titleY + 36;
    const scrimY = isPortraitSubject ? Math.round(h * 0.50) : 0;
    const scrimH = isPortraitSubject ? Math.round(h * 0.50) : Math.round(h * 0.52);

    const isLightMode = pal.isLightMode !== false;
    const textColor = isLightMode ? "#0f172a" : "#ffffff";
    const scrimColor = isLightMode ? "#ffffff" : "#000000";

    const fitnessIcons = [
      { label: "Better Health", iconSvg: `<circle cx="${textX + 12}" cy="${iconStartY + 14}" r="7" stroke="${textColor}" stroke-width="2" fill="none"/>` },
      { label: "More Energy", iconSvg: `<circle cx="${textX + 12}" cy="${iconStartY + 46}" r="7" stroke="${textColor}" stroke-width="2" fill="none"/>` },
      { label: "Happier You", iconSvg: `<circle cx="${textX + 12}" cy="${iconStartY + 78}" r="7" stroke="${textColor}" stroke-width="2" fill="none"/>` },
    ];

    const iconList = fitnessIcons.map((item, idx) => {
      const y = iconStartY + 18 + idx * 32;
      return `
        <g>
          ${item.iconSvg}
          <text x="${textX + 32}" y="${y}" font-family="Inter, sans-serif" font-size="14" font-weight="600" fill="${textColor}">
            ${escapeXml(item.label)}
          </text>
        </g>
      `;
    }).join("\n");

    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
        <defs>
          <linearGradient id="scrim_mcf" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${scrimColor}" stop-opacity="0.94"/>
            <stop offset="60%" stop-color="${scrimColor}" stop-opacity="0.55"/>
            <stop offset="100%" stop-color="${scrimColor}" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        <rect x="0" y="${scrimY}" width="${w}" height="${scrimH}" fill="url(#scrim_mcf)"/>
        <!-- Category Kicker -->
        <text x="${textX}" y="${kickerY}" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="${textColor}" letter-spacing="5">
          ${escapeXml((kicker || "FITNESS").toUpperCase())}
        </text>
        <!-- Clean Bold Title -->
        <text x="${textX}" y="${titleY}" font-family="Inter, sans-serif" font-size="38" font-weight="800" fill="${textColor}">
          ${escapeXml(mainTitle)}
        </text>
        <!-- 3 Circular Outline Icons with Labels -->
        ${iconList}
        ${logoSvg}
        ${urlSvg}
      </svg>
    `.trim();
  }

  // =========================================================================
  // 5B. PLAYFUL PASTEL RAINBOW (Little Moments Big Joy / Cloud Badge + Rainbow)
  // =========================================================================
  if (preset === "playful_pastel_rainbow") {
    const cardX = Math.round(w * 0.08);
    const cardY = isPortraitSubject ? Math.round(h * 0.60) : Math.round(h * 0.12);
    const cardW = Math.round(w * 0.74);
    const cardH = 260;
    const centerX = cardX + cardW / 2;

    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
        <defs>
          <filter id="cloud_shadow" x="-10%" y="-10%" width="125%" height="125%">
            <feDropShadow dx="0" dy="6" stdDeviation="12" flood-color="#000000" flood-opacity="0.25"/>
          </filter>
        </defs>
        <g filter="url(#cloud_shadow)">
          <!-- Scalloped Cloud Badge Card -->
          <rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="24" fill="#fffbeb" stroke="#fef08a" stroke-width="2"/>
          <!-- Playful Multi-Color Lettering -->
          <text x="${centerX}" y="${cardY + 52}" text-anchor="middle" font-family="'Caveat', 'Dancing Script', cursive" font-size="44" font-weight="900" fill="#0284c7">
            ${escapeXml(kicker.slice(0, 8))}
          </text>
          <text x="${centerX}" y="${cardY + 98}" text-anchor="middle" font-family="'Inter', 'Montserrat', sans-serif" font-size="36" font-weight="900" fill="#f43f5e">
            ${escapeXml(mainTitle.slice(0, 14))}
          </text>
          <text x="${centerX}" y="${cardY + 140}" text-anchor="middle" font-family="'Inter', sans-serif" font-size="34" font-weight="900" fill="#f59e0b">
            ${escapeXml((accentScript || "Big Joy").toUpperCase())}
          </text>
          <!-- Mini Pastel Rainbow Decal Illustration at Bottom -->
          <g transform="translate(${centerX - 35}, ${cardY + 175})">
            <path d="M 0 30 A 35 35 0 0 1 70 30" fill="none" stroke="#f87171" stroke-width="4"/>
            <path d="M 6 30 A 29 29 0 0 1 64 30" fill="none" stroke="#fbbf24" stroke-width="4"/>
            <path d="M 12 30 A 23 23 0 0 1 58 30" fill="none" stroke="#34d399" stroke-width="4"/>
            <path d="M 18 30 A 17 17 0 0 1 52 30" fill="none" stroke="#38bdf8" stroke-width="4"/>
          </g>
          <!-- Footer Tag -->
          <text x="${centerX}" y="${cardY + 232}" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="800" fill="#64748b" letter-spacing="3">
            ${escapeXml(bullets.slice(0, 3).join(" • "))}
          </text>
        </g>
        ${logoSvg}
        ${urlSvg}
      </svg>
    `.trim();
  }

  // =========================================================================
  // 6B. DARK CINEMATIC COFFEE (Good Coffee Better Days / Charcoal Brush Splash)
  // =========================================================================
  if (preset === "dark_cinematic_coffee") {
    const centerX = Math.round(w / 2);
    const textY = isPortraitSubject ? Math.round(h * 0.68) : Math.round(h * 0.16);

    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
        <!-- Authentic Charcoal Black Brush Splash Silhouette Backdrop -->
        <path d="M ${centerX - 180} ${textY - 30} C ${centerX - 60} ${textY - 45}, ${centerX + 80} ${textY - 35}, ${centerX + 190} ${textY - 40} C ${centerX + 210} ${textY + 40}, ${centerX + 195} ${textY + 130}, ${centerX + 180} ${textY + 175} C ${centerX + 60} ${textY + 190}, ${centerX - 70} ${textY + 180}, ${centerX - 195} ${textY + 165} C ${centerX - 210} ${textY + 90}, ${centerX - 200} ${textY + 20}, ${centerX - 180} ${textY - 30} Z" fill="#09090b" opacity="0.94"/>
        <!-- Small Tracked Uppercase Kicker -->
        <text x="${centerX}" y="${textY + 14}" text-anchor="middle" font-family="'Inter', sans-serif" font-size="13" font-weight="700" fill="#e2e8f0" letter-spacing="6">
          ${escapeXml((kicker || "GOOD").toUpperCase())}
        </text>
        <!-- Big Crisp White Serif Title -->
        <text x="${centerX}" y="${textY + 64}" text-anchor="middle" font-family="'Playfair Display', Georgia, serif" font-size="52" font-weight="800" fill="#ffffff">
          ${escapeXml(mainTitle)}
        </text>
        <!-- Golden Cursive Script Accent -->
        <text x="${centerX}" y="${textY + 114}" text-anchor="middle" font-family="'Dancing Script', 'Caveat', cursive" font-style="italic" font-size="44" font-weight="700" fill="#facc15">
          ${escapeXml(accentScript || "Better Days")}
        </text>
        <!-- Spaced Bottom Divider Tagline -->
        <text x="${centerX}" y="${textY + 154}" text-anchor="middle" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#94a3b8" letter-spacing="4">
          ${escapeXml(bullets.slice(0, 3).join(" • "))}
        </text>
        ${logoSvg}
        ${urlSvg}
      </svg>
    `.trim();
  }

  // =========================================================================
  // 7B. MODERN OVERLAY SAGE HOME (Home Inspiration / Frosted Sage Green Card)
  // =========================================================================
  if (preset === "modern_overlay_sage_home") {
    const cardX = Math.round(w * 0.08);
    const cardY = isPortraitSubject ? Math.round(h * 0.55) : Math.round(h * 0.12);
    const cardW = Math.round(w * 0.74);
    const cardH = 250;

    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
        <defs>
          <filter id="sage_shadow" x="-5%" y="-5%" width="115%" height="115%">
            <feDropShadow dx="0" dy="6" stdDeviation="12" flood-color="#000000" flood-opacity="0.35"/>
          </filter>
        </defs>
        <g filter="url(#sage_shadow)">
          <!-- Translucent Card with Adaptive Niche Colors -->
          <rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="12" fill="${pal.cardBg}" fill-opacity="0.92" stroke="${pal.cardBorder}" stroke-width="1.5"/>
          <!-- Crisp Sans Title -->
          <text x="${cardX + 24}" y="${cardY + 44}" font-family="'Inter', sans-serif" font-size="30" font-weight="900" fill="${pal.primary}" letter-spacing="1">
            ${escapeXml(mainTitle)}
          </text>
          <!-- Botanical Leaf Sprig Illustration in Top Right -->
          <g stroke="${pal.accent}" stroke-width="1.8" fill="none" opacity="0.95">
            <path d="M ${cardX + cardW - 18} ${cardY + 20} Q ${cardX + cardW - 35} ${cardY + 45} ${cardX + cardW - 48} ${cardY + 75}"/>
            <ellipse cx="${cardX + cardW - 28}" cy="${cardY + 32}" rx="6" ry="3" transform="rotate(-30 ${cardX + cardW - 28} ${cardY + 32})" fill="${pal.accent}" opacity="0.85"/>
            <ellipse cx="${cardX + cardW - 38}" cy="${cardY + 52}" rx="6" ry="3" transform="rotate(30 ${cardX + cardW - 38} ${cardY + 52})" fill="${pal.accent}" opacity="0.85"/>
          </g>
          <!-- Underline Divider -->
          <line x1="${cardX + 24}" y1="${cardY + 64}" x2="${cardX + 180}" y2="${cardY + 64}" stroke="${pal.highlightLine}" stroke-width="2.5"/>
          <!-- Dynamic 3 Checklist Items with Icons -->
          <g fill="${pal.primary}">
            <circle cx="${cardX + 34}" cy="${cardY + 102}" r="7" stroke="${pal.accent}" stroke-width="2" fill="none"/>
            <text x="${cardX + 54}" y="${cardY + 107}" font-family="Inter, sans-serif" font-size="14" font-weight="600">${escapeXml(bullets[0] || "Curated Inspo")}</text>
            <circle cx="${cardX + 34}" cy="${cardY + 142}" r="7" stroke="${pal.accent}" stroke-width="2" fill="none"/>
            <text x="${cardX + 54}" y="${cardY + 147}" font-family="Inter, sans-serif" font-size="14" font-weight="600">${escapeXml(bullets[1] || "Smart Ideas")}</text>
            <circle cx="${cardX + 34}" cy="${cardY + 182}" r="7" stroke="${pal.accent}" stroke-width="2" fill="none"/>
            <text x="${cardX + 54}" y="${cardY + 187}" font-family="Inter, sans-serif" font-size="14" font-weight="600">${escapeXml(bullets[2] || "Better Living")}</text>
          </g>
        </g>
        ${logoSvg}
        ${urlSvg}
      </svg>
    `.trim();
  }

  // =========================================================================
  // 8B. COLLAGE CRAFT RIBBON (DIY Creative Ideas / Blush Peach Craft Note)
  // =========================================================================
  if (preset === "collage_craft_ribbon") {
    const cardX = Math.round(w * 0.08);
    const cardY = isPortraitSubject ? Math.round(h * 0.65) : Math.round(h * 0.12);
    const cardW = Math.round(w * 0.68);
    const cardH = 220;
    const centerX = cardX + cardW / 2;

    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
        <defs>
          <filter id="craft_shadow" x="-10%" y="-10%" width="125%" height="125%">
            <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#000000" flood-opacity="0.3"/>
          </filter>
        </defs>
        <g transform="rotate(2 ${centerX} ${cardY + 100})" filter="url(#craft_shadow)">
          <!-- Niche Adaptive Note Card -->
          <rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="4" fill="${pal.cardBg}" stroke="${pal.cardBorder}" stroke-width="1"/>
          <!-- Top Washi Tape -->
          <rect x="${centerX - 45}" y="${cardY - 12}" width="90" height="22" rx="2" fill="${pal.washiTape}" opacity="0.9" transform="rotate(-2 ${centerX} ${cardY})"/>
          <!-- Small Category Stamp -->
          <text x="${centerX}" y="${cardY + 44}" text-anchor="middle" font-family="'Inter', sans-serif" font-size="13" font-weight="800" fill="${pal.accent}" letter-spacing="3">
            ${escapeXml((kicker || "DIY").toUpperCase())}
          </text>
          <!-- Big Fluid Brush Calligraphy -->
          <text x="${centerX}" y="${cardY + 95}" text-anchor="middle" font-family="'Dancing Script', 'Caveat', cursive" font-style="italic" font-size="42" font-weight="800" fill="${pal.cardText}">
            ${escapeXml(mainTitle)}
          </text>
          <text x="${centerX}" y="${cardY + 138}" text-anchor="middle" font-family="'Dancing Script', 'Caveat', cursive" font-style="italic" font-size="34" font-weight="700" fill="${pal.accent}">
            ${escapeXml(accentScript || "Ideas")} \u2661
          </text>
          <!-- Dotted Footer -->
          <text x="${centerX}" y="${cardY + 180}" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="${pal.cardText}" opacity="0.75" letter-spacing="2">
            ${escapeXml(bullets.slice(0, 3).join(" • "))}
          </text>
        </g>
        ${logoSvg}
        ${urlSvg}
      </svg>
    `.trim();
  }

  // =========================================================================
  // 9. BOLD CENTER BADGE (Preset 17 - Reference Image 3: Christmas 35 Ideas)
  // =========================================================================
  if (preset === "bold_center_badge") {
    const cardX = Math.round(w * 0.04);
    const cardW = Math.round(w * 0.92);
    const cardY = isPortraitSubject ? Math.round(h * 0.52) : Math.round(h * 0.38);
    const cardH = Math.round(h * 0.25); // exactly 25% height for max 25% footprint
    const centerX = Math.round(w / 2);

    // Dynamic number extraction (e.g. 35, 25, 20, 10 or default 35)
    const numberMatch = (rawTextContent || mainTitle).match(/\b(\d{1,3})\b/);
    const listNumber = numberMatch ? numberMatch[1] : "35";

    // Clean headline text without the number
    let headlineText = (rawTextContent || mainTitle)
      .replace(new RegExp(`\\b${listNumber}\\b`, "i"), "")
      .replace(/\s+/g, " ")
      .trim();
    if (!headlineText || headlineText.length < 3) {
      headlineText = "CHRISTMAS DECOR IDEAS";
    }

    // Split headline into 2 balanced lines if long
    const headlineLines = balancedWrap(headlineText.toUpperCase(), 18, 2);

    // Accent color & card color (default deep slate green #334539 as in image or dynamic niche palette)
    const cardColor = pal.brushOrBadgeBg && pal.brushOrBadgeBg !== "#ffffff" && pal.brushOrBadgeBg !== "#fae8e0"
      ? pal.brushOrBadgeBg
      : "#334539";
    const buttonBg = pal.cardBg && pal.cardBg !== "#18181b" ? pal.cardBg : "#ffffff";
    const buttonText = pal.cardText && pal.cardText !== "#ffffff" ? pal.cardText : "#1e293b";
    const buttonLabel = bullets[0] && bullets[0].length <= 14 ? bullets[0].toUpperCase() : "MORE IDEAS.";

    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
        <defs>
          <filter id="bcb_shadow" x="-5%" y="-5%" width="110%" height="110%">
            <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000000" flood-opacity="0.45"/>
          </filter>
        </defs>
        <!-- Centered Solid Card Banner -->
        <g filter="url(#bcb_shadow)">
          <rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="6" fill="${cardColor}" fill-opacity="0.96"/>
          
          <!-- Big Popping Top Listicle Number -->
          <text x="${centerX}" y="${cardY + 28}" text-anchor="middle" font-family="'Inter', 'Montserrat', Arial, sans-serif" font-size="115" font-weight="900" fill="#ffffff" stroke="#25332a" stroke-width="6" paint-order="stroke fill" letter-spacing="-2">
            ${escapeXml(listNumber)}
          </text>

          <!-- Bold White Sans Headline (Centered) -->
          ${headlineLines.map((line, idx) => `
            <text x="${centerX}" y="${cardY + 84 + idx * 36}" text-anchor="middle" font-family="'Inter', 'Montserrat', Arial, sans-serif" font-size="34" font-weight="900" fill="#ffffff" letter-spacing="1">
              ${escapeXml(line)}
            </text>
          `).join("")}

          <!-- Highlight Year / Sub-hook -->
          <text x="${centerX}" y="${cardY + 168}" text-anchor="middle" font-family="'Inter', 'Montserrat', Arial, sans-serif" font-size="62" font-weight="900" fill="#ffffff" stroke="#25332a" stroke-width="5" paint-order="stroke fill" letter-spacing="2">
            ${escapeXml(kicker && kicker !== "AESTHETIC" && kicker !== "HOME DESIGN" ? kicker.slice(0, 8) : "2026")}
          </text>

          <!-- Bottom Pill Button [ MORE IDEAS. / DYNAMIC LABEL ] -->
          <g transform="translate(${centerX - 95}, ${cardY + cardH - 32})">
            <rect x="0" y="0" width="190" height="34" rx="17" fill="${buttonBg}" stroke="${pal.highlightLine || "#1e293b"}" stroke-width="1.5"/>
            <text x="95" y="22" text-anchor="middle" font-family="'Inter', sans-serif" font-size="13" font-weight="800" fill="${buttonText}" letter-spacing="1.5">
              ${escapeXml(buttonLabel)}
            </text>
          </g>
        </g>
        ${logoSvg}
        ${urlSvg}
      </svg>
    `.trim();
  }

  // =========================================================================
  // 10. EDITORIAL TALL SCRIPT (Preset 18 - Reference Image 4: Nails / Luxury Editorial)
  // =========================================================================
  if (preset === "editorial_tall_script") {
    const textX = Math.round(w * 0.08);
    const startY = isPortraitSubject ? Math.round(h * 0.50) : Math.round(h * 0.10);

    // Number extraction (e.g. 20, 15, 10 or default 20)
    const numberMatch = (rawTextContent || mainTitle).match(/\b(\d{1,3})\b/);
    const listNumber = numberMatch ? numberMatch[1] : "20";

    // Plum/burgundy tone from reference image 4 (or dynamic jewel tone from palette)
    const plumColor = pal.brushOrBadgeBg && pal.brushOrBadgeBg !== "#ffffff" && pal.brushOrBadgeBg !== "#fae8e0"
      ? pal.brushOrBadgeBg
      : "#421b38";
    const ribbonTextColor = pal.brushOrBadgeText || "#ffffff";
    const kickerColor = pal.accent || "#fbcfe8";

    // Text elements extraction
    let cleanKicker = kicker && kicker !== "AESTHETIC" && kicker !== "HOME DESIGN" ? kicker : "Dark Purple";
    let scriptWord = accentScript && accentScript !== "Ideas" ? accentScript.replace(/♡/g, "").trim() : "Almond";
    let mainNoun = mainTitle.replace(new RegExp(`\\b${listNumber}\\b`, "i"), "").trim();
    if (!mainNoun || mainNoun.toLowerCase() === cleanKicker.toLowerCase()) {
      mainNoun = "Nails";
    }

    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
        <defs>
          <filter id="ets_shadow" x="-5%" y="-5%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000000" flood-opacity="0.35"/>
          </filter>
        </defs>
        <!-- Subtle gradient scrim in top-left corner for crystal readability -->
        <radialGradient id="corner_scrim" cx="15%" cy="20%" r="55%">
          <stop offset="0%" stop-color="#000000" stop-opacity="0.55"/>
          <stop offset="65%" stop-color="#000000" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0.0"/>
        </radialGradient>
        <rect x="0" y="0" width="${Math.round(w * 0.70)}" height="${Math.round(h * 0.65)}" fill="url(#corner_scrim)"/>

        <!-- Typography Stack -->
        <g filter="url(#ets_shadow)">
          <!-- Giant High-Contrast Serif Number (e.g. 20) -->
          <text x="${textX}" y="${startY + 105}" font-family="'Playfair Display', Didot, 'Bodoni MT', Georgia, serif" font-size="122" font-weight="900" fill="#ffffff" letter-spacing="-2">
            ${escapeXml(listNumber)}
          </text>

          <!-- Rich Plum / Contrast Bold Serif Subtitle (e.g. Dark Purple) -->
          <text x="${textX + 2}" y="${startY + 152}" font-family="'Playfair Display', Georgia, serif" font-size="44" font-weight="800" fill="${plumColor}" stroke="#ffffff" stroke-width="1.2" paint-order="stroke fill" letter-spacing="0.5">
            ${escapeXml(cleanKicker)}
          </text>

          <!-- Flowing Calligraphic Cursive Script Line (e.g. Almond) -->
          <text x="${textX + 4}" y="${startY + 215}" font-family="'Dancing Script', 'Caveat', cursive" font-style="italic" font-size="62" font-weight="700" fill="#ffffff" letter-spacing="1">
            ${escapeXml(scriptWord)}
          </text>

          <!-- Clean Editorial Bold Serif Main Noun (e.g. Nails) -->
          <text x="${textX + 4}" y="${startY + 272}" font-family="'Playfair Display', Georgia, serif" font-size="52" font-weight="800" fill="#ffffff" letter-spacing="0.5">
            ${escapeXml(mainNoun)}
          </text>

          <!-- Bottom Brushed Paint Swatch Pill Ribbon (e.g. That Take Minutes) -->
          <g transform="translate(${textX}, ${startY + 295})">
            <!-- Organic Brush Stroke Pill -->
            <path d="M 12 0 C 4 3, 0 8, 0 18 C 0 28, 4 33, 14 36 L 245 36 C 255 33, 260 28, 260 18 C 260 8, 255 3, 245 0 Z" fill="${plumColor}" opacity="0.95"/>
            <!-- Brush Edge Flourishes -->
            <path d="M -4 14 Q 4 18 10 16 M -2 22 Q 6 24 12 21 M 258 14 Q 266 18 270 16" stroke="${plumColor}" stroke-width="3" stroke-linecap="round" fill="none"/>
            <text x="130" y="24" text-anchor="middle" font-family="'Playfair Display', Georgia, serif" font-size="17" font-weight="700" fill="${ribbonTextColor}" letter-spacing="0.5">
              ${escapeXml(bullets[0] ? bullets[0].toLowerCase().replace(/(^|\s)\S/g, l => l.toUpperCase()) : "That Take Minutes")}
            </text>
          </g>
        </g>
        ${logoSvg}
        ${urlSvg}
      </svg>
    `.trim();
  }

  // =========================================================================
  // Standard Default & Core Fallbacks
  // =========================================================================
  const boxX = text.box.x * w;
  const boxY = text.box.y * h;
  const boxW = text.box.w * w;
  const boxH = text.box.h * h;

  let textColor = text.color;
  const bgColor = background.color || (background.type === "scrim" ? "#000000" : "#ffffff");
  const contrast = getContrastRatio(textColor, bgColor);
  if (contrast < 4.5 && background.type !== "none") {
    textColor = getContrastRatio("#ffffff", bgColor) >= 4.5 ? "#ffffff" : "#0f172a";
  }

  const rawContent = text.content || mainTitle;
  const lines = balancedWrap(rawContent, Math.floor(boxW / 18), text.maxLines || 4);
  const fontSize = Math.min(
    48,
    Math.max(22, Math.floor(boxH / (lines.length * 1.35)))
  );
  const lineHeight = fontSize * 1.3;

  let bgSvg = "";

  if (background.type === "card" || background.type === "frosted") {
    const pad = 24;
    const cardX = boxX - pad;
    const cardY = boxY - pad;
    const cardW = boxW + pad * 2;
    const cardH = lines.length * lineHeight + pad * 2;
    const radius = background.radius || 16;
    const opacity = background.opacity || 0.9;
    bgSvg = `
      <rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="${radius}" fill="${bgColor}" fill-opacity="${opacity}"/>
    `;
  } else if (background.type === "scrim") {
    const scrimH = (background.height || 0.45) * h;
    const isTop = text.box.y < 0.5;
    const scrimY = isTop ? 0 : h - scrimH;
    const gradId = `scrim_${isTop ? "top" : "bot"}`;
    bgSvg = `
      <defs>
        <linearGradient id="${gradId}" x1="0" y1="${isTop ? 0 : 1}" x2="0" y2="${isTop ? 1 : 0}">
          <stop offset="0%" stop-color="#000000" stop-opacity="0.85"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <rect x="0" y="${scrimY}" width="${w}" height="${scrimH}" fill="url(#${gradId})"/>
    `;
  } else if (background.type === "solid_band") {
    const bandH = (background.height || 0.2) * h;
    const bandY = h - bandH;
    bgSvg = `
      <rect x="0" y="${bandY}" width="${w}" height="${bandH}" fill="${bgColor}" fill-opacity="${background.opacity || 1.0}"/>
    `;
  }

  const textX = text.align === "center" ? boxX + boxW / 2 : text.align === "right" ? boxX + boxW : boxX;
  const textAnchor = text.align === "center" ? "middle" : text.align === "right" ? "end" : "start";

  const textElements = lines
    .map((line, i) => {
      const yPos = boxY + (i + 1) * lineHeight - 6;
      let strokeAttr = "";
      if (background.type === "outline") {
        strokeAttr = 'stroke="#000000" stroke-width="4" paint-order="stroke fill"';
      }
      return `<tspan x="${textX}" y="${yPos}" ${strokeAttr}>${escapeXml(line)}</tspan>`;
    })
    .join("\n");

  let accentSvg = "";
  if (accent?.color && text.preset === "accent_underline") {
    const lineY = boxY + lines.length * lineHeight + 12;
    accentSvg = `
      <rect x="${boxX + boxW / 2 - 40}" y="${lineY}" width="80" height="6" rx="3" fill="${accent.color}"/>
    `;
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
      ${bgSvg}
      <text font-family="${text.fontFamily}" font-size="${fontSize}" font-weight="${text.weight}" fill="${textColor}" text-anchor="${textAnchor}">
        ${textElements}
      </text>
      ${accentSvg}
      ${logoSvg}
      ${urlSvg}
    </svg>
  `.trim();
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const EIGHTEEN_PRESETS_CYCLE: PresetName[] = [
  "classic_clean_travel",
  "modern_bold_peach",
  "handwritten_explore",
  "minimal_clean_nature",
  "playful_colorful_badge",
  "dark_cinematic_road",
  "healthy_habits_icons",
  "collage_washi_gems",
  "classic_elegant_santorini",
  "modern_bold_amber",
  "handwritten_torn_desk",
  "minimal_clean_fitness",
  "playful_pastel_rainbow",
  "dark_cinematic_coffee",
  "modern_overlay_sage_home",
  "collage_craft_ribbon",
  "bold_center_badge",
  "editorial_tall_script",
];

export const SIXTEEN_PRESETS_CYCLE: PresetName[] = EIGHTEEN_PRESETS_CYCLE;


export interface PinRatioConfig {
  overlay?: number;
  in_image?: number;
  none?: number;
}

export function distributePinModes(
  totalCount: number,
  ratios?: PinRatioConfig
): Array<"canvas" | "in_image" | "none"> {
  if (totalCount <= 0) return [];

  const rawInImage = ratios?.in_image ?? 50;
  const rawOverlay = ratios?.overlay ?? 30;
  const rawNone = ratios?.none ?? 20;

  const sum = rawInImage + rawOverlay + rawNone;
  if (sum <= 0) {
    return Array(totalCount).fill("canvas");
  }

  // Exact target distribution based on percentage ratios
  let countInImage = Math.round((rawInImage / sum) * totalCount);
  let countOverlay = Math.round((rawOverlay / sum) * totalCount);
  let countNone = totalCount - countInImage - countOverlay;

  // Ensure non-negative and exact sum match
  if (countNone < 0) {
    if (countInImage >= countOverlay && countInImage > 0) {
      countInImage += countNone;
    } else {
      countOverlay += countNone;
    }
    countNone = 0;
  }

  // Build the items to interleave
  const inImageItems = Array(Math.max(0, countInImage)).fill("in_image" as const);
  const overlayItems = Array(Math.max(0, countOverlay)).fill("canvas" as const);
  const noneItems = Array(Math.max(0, countNone)).fill("none" as const);

  const result: Array<"canvas" | "in_image" | "none"> = [];
  while (inImageItems.length > 0 || overlayItems.length > 0 || noneItems.length > 0) {
    if (inImageItems.length > 0) result.push(inImageItems.pop()!);
    if (overlayItems.length > 0) result.push(overlayItems.pop()!);
    if (noneItems.length > 0) result.push(noneItems.pop()!);
  }

  return result.slice(0, totalCount);
}

