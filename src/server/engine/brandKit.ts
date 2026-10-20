export type SettingSource = "manual" | "kit" | "template" | "global";

export interface ResolvedSetting<T = any> {
  value: T;
  source: SettingSource;
}

/**
 * Precedence Resolver per Spec Section 33.1
 * Priority: job.manual > kit (if enabled) > template.defaults > global
 */
export function resolveSetting<T = any>(
  field: string,
  sources: {
    jobManual?: Record<string, any>;
    kit?: { enabled: boolean; values: Record<string, any> } | null;
    templateDefaults?: Record<string, any> | null;
    globalSettings?: Record<string, any> | null;
  }
): ResolvedSetting<T> {
  const { jobManual, kit, templateDefaults, globalSettings } = sources;

  if (jobManual && jobManual[field] !== undefined && jobManual[field] !== null && jobManual[field] !== "") {
    return { value: jobManual[field], source: "manual" };
  }

  if (kit && kit.enabled && kit.values && kit.values[field] !== undefined && kit.values[field] !== null && kit.values[field] !== "") {
    return { value: kit.values[field], source: "kit" };
  }

  if (templateDefaults && templateDefaults[field] !== undefined && templateDefaults[field] !== null && templateDefaults[field] !== "") {
    return { value: templateDefaults[field], source: "template" };
  }

  if (globalSettings && globalSettings[field] !== undefined && globalSettings[field] !== null) {
    return { value: globalSettings[field], source: "global" };
  }

  return { value: undefined as unknown as T, source: "global" };
}

/**
 * Color translation dictionary mapping hex approximations to natural color descriptors
 * Required by Spec Section 33.4: "models hex nahi samajhte"
 */
const COLOR_NAMES: Array<{ name: string; rgb: [number, number, number] }> = [
  { name: "terracotta", rgb: [200, 85, 61] },
  { name: "sage green", rgb: [154, 172, 147] },
  { name: "forest green", rgb: [34, 75, 45] },
  { name: "olive green", rgb: [107, 122, 59] },
  { name: "mint", rgb: [178, 222, 206] },
  { name: "navy blue", rgb: [20, 35, 60] },
  { name: "slate blue", rgb: [80, 100, 125] },
  { name: "sky blue", rgb: [135, 206, 235] },
  { name: "warm beige", rgb: [225, 215, 195] },
  { name: "cream", rgb: [248, 245, 235] },
  { name: "pure white", rgb: [255, 255, 255] },
  { name: "charcoal", rgb: [45, 45, 48] },
  { name: "espresso brown", rgb: [55, 38, 28] },
  { name: "caramel", rgb: [180, 115, 55] },
  { name: "amber gold", rgb: [220, 150, 40] },
  { name: "mustard yellow", rgb: [215, 175, 50] },
  { name: "blush pink", rgb: [235, 185, 185] },
  { name: "dusty rose", rgb: [195, 130, 135] },
  { name: "coral", rgb: [235, 110, 95] },
  { name: "lavender", rgb: [190, 175, 215] },
  { name: "rich plum", rgb: [95, 40, 75] },
  { name: "terracotta rust", rgb: [175, 70, 45] },
];

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "").trim();
  if (clean.length === 3) {
    return [
      parseInt(clean[0] + clean[0], 16),
      parseInt(clean[1] + clean[1], 16),
      parseInt(clean[2] + clean[2], 16),
    ];
  }
  return [
    parseInt(clean.slice(0, 2), 16) || 0,
    parseInt(clean.slice(2, 4), 16) || 0,
    parseInt(clean.slice(4, 6), 16) || 0,
  ];
}

/**
 * Finds the nearest natural color name for a given hex code using Euclidean distance in RGB
 */
export function hexToColorName(hex: string): string {
  if (!hex || typeof hex !== "string") return "neutral";
  const [r, g, b] = hexToRgb(hex);

  let closestName = "neutral";
  let minDistance = Infinity;

  for (const color of COLOR_NAMES) {
    const dr = r - color.rgb[0];
    const dg = g - color.rgb[1];
    const db = b - color.rgb[2];
    const dist = Math.sqrt(dr * dr + dg * dg + db * db);
    if (dist < minDistance) {
      minDistance = dist;
      closestName = color.name;
    }
  }

  return closestName;
}

/**
 * Formats a 5-color palette into a gentle prompt phrase for AI image generation (Spec Section 33.4)
 */
export function formatPaletteForPrompt(palette: string[] | string): string {
  let hexList: string[] = [];
  if (Array.isArray(palette)) {
    hexList = palette;
  } else if (typeof palette === "string") {
    try {
      hexList = JSON.parse(palette);
    } catch {
      hexList = palette.split(",").map((s) => s.trim()).filter(Boolean);
    }
  }

  if (!hexList || hexList.length === 0) return "";

  const uniqueNames = Array.from(new Set(hexList.map((h) => hexToColorName(h)))).filter(
    (name) => name !== "pure white" && name !== "charcoal"
  );

  if (uniqueNames.length === 0) return "";
  if (uniqueNames.length === 1) return `in a cohesive color palette of ${uniqueNames[0]}`;
  if (uniqueNames.length === 2) return `in a cohesive color palette of ${uniqueNames[0]} and ${uniqueNames[1]}`;

  const top3 = uniqueNames.slice(0, 3);
  return `in a cohesive color palette of ${top3.slice(0, -1).join(", ")} and ${top3[top3.length - 1]}`;
}

/**
 * AI Website Extractor (Spec Section 33.2)
 * Extracts metadata, title, colors, fonts, and logo candidates from a website URL
 */
export async function extractBrandFromWebsite(url: string): Promise<{
  brandName: string;
  websiteUrl: string;
  description: string;
  logoCandidate?: string;
  palette: string[];
  fontFamily: string;
  suggestedVibe: string;
  suggestedAdjectives: string[];
  suggestedPreset: string;
}> {
  // Validate and normalize URL
  let targetUrl = url.trim();
  if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
    targetUrl = `https://${targetUrl}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout per spec

  let html = "";
  try {
    const res = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; PinForgeBrandBot/1.0; +https://pinforge.local)",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Failed to fetch website (${res.status} ${res.statusText})`);
    }

    const text = await res.text();
    html = text.slice(0, 1500000); // Max 1.5MB per spec
  } catch (err: any) {
    clearTimeout(timeoutId);
    throw new Error(`Website extraction failed: ${err.message || "Network timeout or unreachable URL"}`);
  }

  // Parse HTML
  let brandName = "";
  let description = "";
  let logoCandidate: string | undefined;
  let fontFamily = "Playfair Display";
  const extractedHexes: string[] = [];

  try {
    // 1. Brand name: og:site_name > title > hostname
    const ogSiteMatch = html.match(/<meta[^>]*property=["']og:site_name["'][^>]*content=["']([^"']+)["']/i) ||
                        html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:site_name["']/i);
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const urlObj = new URL(targetUrl);
    const hostBase = urlObj.hostname.replace(/^www\./, "").split(".")[0];
    const capitalizedHost = hostBase.charAt(0).toUpperCase() + hostBase.slice(1);

    const rawTitle = titleMatch ? titleMatch[1].split(/[-|–:•]/)[0].trim() : "";
    brandName = (ogSiteMatch ? ogSiteMatch[1].trim() : (rawTitle || capitalizedHost)).trim();

    // 2. Meta description
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
                      html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
    if (descMatch) {
      description = descMatch[1].trim();
    }

    // 3. Theme color
    const themeMatch = html.match(/<meta[^>]*name=["']theme-color["'][^>]*content=["']([^"']+)["']/i);
    if (themeMatch && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(themeMatch[1].trim())) {
      extractedHexes.push(themeMatch[1].trim().toUpperCase());
    }

    // 4. Logo candidate: og:image or img with logo or favicon
    const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
    const logoImgMatch = html.match(/<img[^>]*src=["']([^"']*(?:logo)[^"']*)["'][^>]*>/i);
    const iconMatch = html.match(/<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']+)["']/i);

    if (logoImgMatch && logoImgMatch[1]) {
      const src = logoImgMatch[1];
      logoCandidate = src.startsWith("http") ? src : new URL(src, targetUrl).toString();
    } else if (ogImageMatch && ogImageMatch[1]) {
      const src = ogImageMatch[1];
      logoCandidate = src.startsWith("http") ? src : new URL(src, targetUrl).toString();
    } else if (iconMatch && iconMatch[1]) {
      const src = iconMatch[1];
      logoCandidate = src.startsWith("http") ? src : new URL(src, targetUrl).toString();
    }

    // 5. Google Fonts
    const fontMatch = html.match(/fonts\.googleapis\.com\/css\?[^"']*family=([^&"':]+)/i);
    if (fontMatch && fontMatch[1]) {
      fontFamily = decodeURIComponent(fontMatch[1].replace(/\+/g, " "));
    }

    // 6. Extract color hexes from styles
    const hexRegex = /#([0-9a-f]{6})/gi;
    let match;
    while ((match = hexRegex.exec(html)) !== null && extractedHexes.length < 15) {
      const hex = match[0].toUpperCase();
      if (!["#000000", "#FFFFFF", "#333333", "#666666", "#CCCCCC", "#EEEEEE"].includes(hex)) {
        if (!extractedHexes.includes(hex)) {
          extractedHexes.push(hex);
        }
      }
    }
  } catch {
    // Graceful fallback
  }

  // Ensure 5 distinct colors for brand palette
  const defaultPalette = ["#FFFFFF", "#2D2D30", "#C8553D", "#9AAC93", "#E1D7C3"];
  const finalPalette = [...extractedHexes];
  for (const def of defaultPalette) {
    if (finalPalette.length >= 5) break;
    if (!finalPalette.includes(def)) {
      finalPalette.push(def);
    }
  }

  // Heuristic vibe & overlay preset mapping
  const descLower = `${brandName} ${description}`.toLowerCase();
  let suggestedVibe = "warm organic";
  let suggestedAdjectives = ["authentic", "warm", "inviting", "aesthetic"];
  let suggestedPreset = "classic_clean_travel";

  if (descLower.includes("minimal") || descLower.includes("modern") || descLower.includes("scandi")) {
    suggestedVibe = "minimalist scandi";
    suggestedAdjectives = ["minimal", "clean", "airy", "refined"];
    suggestedPreset = "minimal_clean_nature";
  } else if (descLower.includes("food") || descLower.includes("bakery") || descLower.includes("recipe")) {
    suggestedVibe = "artisanal gourmet";
    suggestedAdjectives = ["mouthwatering", "rustic", "wholesome", "golden"];
    suggestedPreset = "modern_bold_amber";
  } else if (descLower.includes("diy") || descLower.includes("craft") || descLower.includes("home")) {
    suggestedVibe = "cozy creative";
    suggestedAdjectives = ["inspiring", "tactile", "approachable", "vibrant"];
    suggestedPreset = "collage_craft_ribbon";
  } else if (descLower.includes("fashion") || descLower.includes("luxury") || descLower.includes("beauty")) {
    suggestedVibe = "chic elegance";
    suggestedAdjectives = ["luxe", "editorial", "polished", "sophisticated"];
    suggestedPreset = "editorial_tall_script";
  }

  return {
    brandName: brandName || "My Brand",
    websiteUrl: targetUrl,
    description: description.slice(0, 300),
    logoCandidate,
    palette: finalPalette.slice(0, 5),
    fontFamily,
    suggestedVibe,
    suggestedAdjectives,
    suggestedPreset,
  };
}
