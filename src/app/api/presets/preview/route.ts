import { NextRequest, NextResponse } from "next/server";
import { renderOverlaySvg } from "@/server/engine/overlay";
import { generateFullNicheOverlayContent } from "@/server/engine/seo";

function getPresetBackdropSvg(preset: string, w: number, h: number): string {
  switch (preset) {
    case "classic_clean_travel":
      return `
        <!-- Scenic Alpine Lake Backdrop (Ref 1) -->
        <defs>
          <linearGradient id="bg_lake" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#1e3a8a"/>
            <stop offset="35%" stop-color="#0284c7"/>
            <stop offset="65%" stop-color="#0d9488"/>
            <stop offset="100%" stop-color="#064e3b"/>
          </linearGradient>
        </defs>
        <rect width="${w}" height="${h}" fill="url(#bg_lake)"/>
        <polygon points="0,520 180,360 320,470 480,300 620,420 768,340 768,1152 0,1152" fill="#0f172a" opacity="0.65"/>
        <polygon points="0,660 140,570 280,620 440,520 600,600 768,550 768,1152 0,1152" fill="#042f2e" opacity="0.85"/>
        <rect y="720" width="${w}" height="432" fill="#0d9488" opacity="0.4"/>
      `;
    case "modern_bold_peach":
      return `
        <!-- Warm Cafe Table & Bakery Backdrop (Ref 1) -->
        <defs>
          <radialGradient id="bg_cafe" cx="50%" cy="55%" r="70%">
            <stop offset="0%" stop-color="#78350f"/>
            <stop offset="50%" stop-color="#451a03"/>
            <stop offset="100%" stop-color="#1c1917"/>
          </radialGradient>
        </defs>
        <rect width="${w}" height="${h}" fill="url(#bg_cafe)"/>
        <circle cx="384" cy="740" r="140" fill="#fef3c7" opacity="0.25"/>
        <circle cx="384" cy="740" r="110" fill="#d97706" opacity="0.45"/>
        <circle cx="384" cy="740" r="85" fill="#fef3c7" opacity="0.75"/>
        <ellipse cx="580" cy="850" rx="90" ry="45" transform="rotate(-25 580 850)" fill="#b45309" opacity="0.8"/>
      `;
    case "handwritten_explore":
      return `
        <!-- Mediterranean Coastline Backdrop (Ref 1) -->
        <defs>
          <linearGradient id="bg_coast" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#0284c7"/>
            <stop offset="40%" stop-color="#38bdf8"/>
            <stop offset="70%" stop-color="#0369a1"/>
            <stop offset="100%" stop-color="#0c4a6e"/>
          </linearGradient>
        </defs>
        <rect width="${w}" height="${h}" fill="url(#bg_coast)"/>
        <path d="M 450,250 Q 560,500 500,800 Q 460,950 550,1152 L 768,1152 L 768,200 Z" fill="#3f3f46" opacity="0.75"/>
      `;
    case "minimal_clean_nature":
      return `
        <!-- Sunlit Field & Daisy Backdrop (Ref 1) -->
        <defs>
          <radialGradient id="bg_nature" cx="40%" cy="40%" r="65%">
            <stop offset="0%" stop-color="#78350f"/>
            <stop offset="60%" stop-color="#292524"/>
            <stop offset="100%" stop-color="#141414"/>
          </radialGradient>
        </defs>
        <rect width="${w}" height="${h}" fill="url(#bg_nature)"/>
        <circle cx="600" cy="500" r="28" fill="#facc15" opacity="0.9"/>
        <ellipse cx="600" cy="430" rx="14" ry="42" fill="#fafaf9" opacity="0.85"/>
        <ellipse cx="600" cy="570" rx="14" ry="42" fill="#fafaf9" opacity="0.85"/>
        <ellipse cx="530" cy="500" rx="42" ry="14" fill="#fafaf9" opacity="0.85"/>
        <ellipse cx="670" cy="500" rx="42" ry="14" fill="#fafaf9" opacity="0.85"/>
      `;
    case "playful_colorful_badge":
      return `
        <!-- Forest Cabin & Pine Trees Backdrop (Ref 1) -->
        <defs>
          <linearGradient id="bg_forest" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#0284c7"/>
            <stop offset="35%" stop-color="#38bdf8"/>
            <stop offset="60%" stop-color="#064e3b"/>
            <stop offset="100%" stop-color="#022c22"/>
          </linearGradient>
        </defs>
        <rect width="${w}" height="${h}" fill="url(#bg_forest)"/>
        <polygon points="120,480 40,700 200,700" fill="#064e3b" opacity="0.9"/>
        <polygon points="260,520 180,750 340,750" fill="#042f2e" opacity="0.95"/>
        <polygon points="650,440 560,680 740,680" fill="#064e3b" opacity="0.85"/>
        <polygon points="180,720 320,720 250,650" fill="#78350f"/>
        <rect x="200" y="720" width="100" height="90" fill="#451a03"/>
      `;
    case "dark_cinematic_road":
      return `
        <!-- Moody Twilight Highway Road Backdrop (Ref 1) -->
        <defs>
          <linearGradient id="bg_road" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#0f172a"/>
            <stop offset="45%" stop-color="#1e293b"/>
            <stop offset="75%" stop-color="#334155"/>
            <stop offset="100%" stop-color="#090d16"/>
          </linearGradient>
        </defs>
        <rect width="${w}" height="${h}" fill="url(#bg_road)"/>
        <path d="M 384,650 Q 320,800 200,1152 L 568,1152 Q 448,800 384,650 Z" fill="#0f172a"/>
        <path d="M 384,650 Q 380,800 384,1152" stroke="#eab308" stroke-width="4" stroke-dasharray="25,20" fill="none"/>
      `;
    case "healthy_habits_icons":
      return `
        <!-- Green Wellness Smoothie & Mint Backdrop (Ref 1) -->
        <defs>
          <radialGradient id="bg_smoothie" cx="60%" cy="75%" r="60%">
            <stop offset="0%" stop-color="#86efac"/>
            <stop offset="50%" stop-color="#16a34a"/>
            <stop offset="100%" stop-color="#14532d"/>
          </radialGradient>
        </defs>
        <rect width="${w}" height="${h}" fill="url(#bg_smoothie)"/>
        <rect x="440" y="620" width="180" height="280" rx="30" fill="#4ade80" opacity="0.8"/>
        <rect x="470" y="580" width="120" height="40" rx="10" fill="#f0fdf4"/>
      `;
    case "collage_washi_gems":
      return `
        <!-- Tropical Rocky Beach & Lagoon Backdrop (Ref 1) -->
        <defs>
          <linearGradient id="bg_gems" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#0284c7"/>
            <stop offset="40%" stop-color="#06b6d4"/>
            <stop offset="75%" stop-color="#0d9488"/>
            <stop offset="100%" stop-color="#134e4a"/>
          </linearGradient>
        </defs>
        <rect width="${w}" height="${h}" fill="url(#bg_gems)"/>
        <path d="M 0,200 Q 150,450 100,750 Q 50,950 180,1152 L 0,1152 Z" fill="#292524" opacity="0.75"/>
      `;
    case "classic_elegant_santorini":
      return `
        <!-- Santorini Sunset & White Domes Backdrop (Ref 2) -->
        <defs>
          <linearGradient id="bg_sant" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#312e81"/>
            <stop offset="40%" stop-color="#f59e0b"/>
            <stop offset="70%" stop-color="#0284c7"/>
            <stop offset="100%" stop-color="#0f172a"/>
          </linearGradient>
        </defs>
        <rect width="${w}" height="${h}" fill="url(#bg_sant)"/>
        <circle cx="560" cy="720" r="90" fill="#1d4ed8"/>
        <rect x="470" y="720" width="180" height="120" fill="#ffffff"/>
      `;
    case "modern_bold_amber":
      return `
        <!-- Healthy Mediterranean Grain Bowl Backdrop (Ref 2) -->
        <defs>
          <radialGradient id="bg_grain" cx="50%" cy="60%" r="65%">
            <stop offset="0%" stop-color="#78350f"/>
            <stop offset="60%" stop-color="#451a03"/>
            <stop offset="100%" stop-color="#1c1917"/>
          </radialGradient>
        </defs>
        <rect width="${w}" height="${h}" fill="url(#bg_grain)"/>
        <circle cx="384" cy="720" r="220" fill="#f5f5f4" opacity="0.95"/>
        <circle cx="384" cy="720" r="190" fill="#b45309" opacity="0.85"/>
        <circle cx="340" cy="680" r="50" fill="#16a34a" opacity="0.9"/>
        <circle cx="430" cy="740" r="45" fill="#dc2626" opacity="0.9"/>
      `;
    case "handwritten_torn_desk":
      return `
        <!-- Wooden Office Desk & Laptop Backdrop (Ref 2) -->
        <defs>
          <linearGradient id="bg_desk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#44403c"/>
            <stop offset="45%" stop-color="#292524"/>
            <stop offset="100%" stop-color="#78350f"/>
          </linearGradient>
        </defs>
        <rect width="${w}" height="${h}" fill="url(#bg_desk)"/>
        <rect x="80" y="650" width="300" height="200" rx="8" fill="#1c1917" opacity="0.9"/>
        <circle cx="520" cy="720" r="45" fill="#fafaf9" opacity="0.8"/>
      `;
    case "minimal_clean_fitness":
      return `
        <!-- Minimal Modern Gym & Dumbbells Backdrop (Ref 2) -->
        <defs>
          <linearGradient id="bg_gym" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#18181b"/>
            <stop offset="60%" stop-color="#27272a"/>
            <stop offset="100%" stop-color="#09090b"/>
          </linearGradient>
        </defs>
        <rect width="${w}" height="${h}" fill="url(#bg_gym)"/>
        <rect x="420" y="750" width="220" height="40" rx="10" fill="#71717a"/>
        <circle cx="420" cy="770" r="50" fill="#18181b" stroke="#52525b" stroke-width="8"/>
        <circle cx="640" cy="770" r="50" fill="#18181b" stroke="#52525b" stroke-width="8"/>
      `;
    case "playful_pastel_rainbow":
      return `
        <!-- Bright Pastel Nursery & Playroom Backdrop (Ref 2) -->
        <defs>
          <linearGradient id="bg_play" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#fdf2f8"/>
            <stop offset="50%" stop-color="#fce7f3"/>
            <stop offset="100%" stop-color="#e0e7ff"/>
          </linearGradient>
        </defs>
        <rect width="${w}" height="${h}" fill="url(#bg_play)"/>
        <rect x="60" y="800" width="648" height="24" rx="4" fill="#d97706" opacity="0.6"/>
        <circle cx="200" cy="750" r="45" fill="#f472b6" opacity="0.75"/>
        <circle cx="340" cy="740" r="50" fill="#38bdf8" opacity="0.75"/>
      `;
    case "dark_cinematic_coffee":
      return `
        <!-- Dark Moody Espresso Cup Backdrop (Ref 2) -->
        <defs>
          <radialGradient id="bg_dark_coffee" cx="50%" cy="65%" r="60%">
            <stop offset="0%" stop-color="#262626"/>
            <stop offset="60%" stop-color="#171717"/>
            <stop offset="100%" stop-color="#0a0a0a"/>
          </radialGradient>
        </defs>
        <rect width="${w}" height="${h}" fill="url(#bg_dark_coffee)"/>
        <ellipse cx="384" cy="780" rx="160" ry="70" fill="#000000" stroke="#333333" stroke-width="4"/>
        <ellipse cx="384" cy="770" rx="120" ry="50" fill="#1c1917"/>
        <ellipse cx="384" cy="770" rx="100" ry="40" fill="#78350f"/>
        <ellipse cx="384" cy="770" rx="75" ry="28" fill="#d97706" opacity="0.8"/>
      `;
    case "modern_overlay_sage_home":
      return `
        <!-- Cozy Scandinavian Sage Living Room Backdrop (Ref 2) -->
        <defs>
          <linearGradient id="bg_sage_room" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#2d3748"/>
            <stop offset="50%" stop-color="#1c2826"/>
            <stop offset="100%" stop-color="#141d1b"/>
          </linearGradient>
        </defs>
        <rect width="${w}" height="${h}" fill="url(#bg_sage_room)"/>
        <rect x="80" y="720" width="608" height="240" rx="16" fill="#374151" opacity="0.9"/>
        <rect x="140" y="700" width="140" height="120" rx="12" fill="#047857" opacity="0.8"/>
        <circle cx="560" cy="620" r="60" fill="#fef3c7" opacity="0.3"/>
      `;
    case "collage_craft_ribbon":
      return `
        <!-- Artisan Pottery Studio & Dried Florals Backdrop (Ref 2) -->
        <defs>
          <linearGradient id="bg_craft" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#6c3b2b"/>
            <stop offset="50%" stop-color="#442a20"/>
            <stop offset="100%" stop-color="#23140f"/>
          </linearGradient>
        </defs>
        <rect width="${w}" height="${h}" fill="url(#bg_craft)"/>
        <path d="M 280,680 Q 240,780 250,880 L 370,880 Q 380,780 340,680 Z" fill="#d97706" opacity="0.7"/>
      `;
    case "bold_center_badge":
    case "bold_center_listicle":
      return `
        <!-- 4-Split Christmas Decor Collage Backdrop (Ref 3) -->
        <rect width="${w}" height="${h}" fill="#1c2826"/>
        <rect x="0" y="0" width="${w/2 - 2}" height="${h/2 - 2}" fill="#1b2a21"/>
        <circle cx="${w/4}" cy="${h/4}" r="75" fill="none" stroke="#166534" stroke-width="26"/>
        <circle cx="${w/4}" cy="${h/4}" r="75" fill="none" stroke="#fef08a" stroke-width="5" stroke-dasharray="8,10"/>
        <rect x="${w/2 + 2}" y="0" width="${w/2 - 2}" height="${h/2 - 2}" fill="#2e2b20"/>
        <polygon points="${3*w/4},60 ${3*w/4 - 110},${h/2 - 50} ${3*w/4 + 110},${h/2 - 50}" fill="#14532d"/>
        <circle cx="${3*w/4 - 30}" cy="${h/4}" r="6" fill="#fef08a"/>
        <circle cx="${3*w/4 + 40}" cy="${h/4 + 40}" r="6" fill="#fef08a"/>
        <circle cx="${3*w/4}" cy="${h/4 - 50}" r="6" fill="#fef08a"/>
        <rect x="0" y="${h/2 + 2}" width="${w/2 - 2}" height="${h/2 - 2}" fill="#18231c"/>
        <polygon points="${w/4},${h/2 + 60} ${w/4 - 120},${h - 60} ${w/4 + 120},${h - 60}" fill="#166534"/>
        <circle cx="${w/4 - 20}" cy="${3*h/4}" r="6" fill="#fef08a"/>
        <circle cx="${w/4 + 30}" cy="${3*h/4 + 50}" r="6" fill="#fef08a"/>
        <rect x="${w/2 + 2}" y="${h/2 + 2}" width="${w/2 - 2}" height="${h/2 - 2}" fill="#3f271d"/>
        <circle cx="${3*w/4}" cy="${h/2 + 90}" r="40" fill="none" stroke="#15803d" stroke-width="16"/>
        <rect x="${w/2 + 40}" y="${h - 180}" width="${w/2 - 80}" height="120" rx="8" fill="#171717"/>
        <circle cx="${3*w/4}" cy="${h - 120}" r="30" fill="#ea580c" opacity="0.85"/>
        <line x1="${w/2}" y1="0" x2="${w/2}" y2="${h}" stroke="#ffffff" stroke-width="5"/>
        <line x1="0" y1="${h/2}" x2="${w}" y2="${h/2}" stroke="#ffffff" stroke-width="5"/>
      `;
    case "editorial_tall_script":
      return `
        <!-- Luxury Knitted Sweater & Manicure Backdrop (Ref 4) -->
        <defs>
          <linearGradient id="bg_mani" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#4a3b32"/>
            <stop offset="50%" stop-color="#302422"/>
            <stop offset="100%" stop-color="#1c1615"/>
          </linearGradient>
        </defs>
        <rect width="${w}" height="${h}" fill="url(#bg_mani)"/>
        <path d="M 0,${h} Q ${w*0.35},${h*0.58} ${w*0.8},${h*0.42} Q ${w*0.95},${h*0.55} ${w},${h*0.8} L ${w},${h} Z" fill="#ede5dc" opacity="0.9"/>
        <ellipse cx="${w*0.62}" cy="${h*0.58}" rx="14" ry="28" transform="rotate(35 ${w*0.62} ${h*0.58})" fill="#3b0764"/>
        <ellipse cx="${w*0.72}" cy="${h*0.52}" rx="14" ry="28" transform="rotate(25 ${w*0.72} ${h*0.52})" fill="#3b0764"/>
        <ellipse cx="${w*0.82}" cy="${h*0.50}" rx="14" ry="28" transform="rotate(15 ${w*0.82} ${h*0.50})" fill="#3b0764"/>
        <ellipse cx="${w*0.88}" cy="${h*0.60}" rx="13" ry="26" transform="rotate(40 ${w*0.88} ${h*0.60})" fill="#3b0764"/>
      `;
    default:
      return `<rect width="${w}" height="${h}" fill="#1e293b"/>`;
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const preset = searchParams.get("preset") || "classic_clean_travel";
    const topic = searchParams.get("topic") || "Living Room Ideas";
    const headline = searchParams.get("headline") || undefined;
    const pinType = searchParams.get("pinType") || "inspiration";
    const palette = searchParams.get("palette") || undefined;
    const luminance = (searchParams.get("luminance") as "auto" | "light" | "dark") || undefined;
    const bg = searchParams.get("bg"); // "photo" | "sample" | "none"

    const nicheData = generateFullNicheOverlayContent(
      topic,
      undefined,
      preset,
      pinType,
      headline
    );

    let svg = renderOverlaySvg({
      canvas: { w: 768, h: 1152 },
      text: {
        content: headline || nicheData.fullHook,
        preset,
        fontFamily: "Playfair Display, Georgia, serif",
        weight: 700,
        color: "#ffffff",
        align: "center",
        maxLines: 4,
        box: { x: 0.08, y: 0.65, w: 0.84, h: 0.28 },
      },
      background: { type: "scrim" },
      nicheData,
      palette,
      luminanceMode: luminance,
    });

    // If requested with a realistic photo/scenic backdrop for showcase preview
    if (bg === "photo" || bg === "sample" || bg === "true") {
      const backdrop = getPresetBackdropSvg(preset, 768, 1152);
      // Inject backdrop right after the opening <svg ...> tag
      const svgTagEnd = svg.indexOf(">");
      if (svgTagEnd !== -1) {
        svg = svg.slice(0, svgTagEnd + 1) + backdrop + svg.slice(svgTagEnd + 1);
      }
    }

    return new NextResponse(svg, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "public, max-age=120, s-maxage=120",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to generate preset preview";
    return new NextResponse(`<svg xmlns="http://www.w3.org/2000/svg" width="768" height="1152"><text x="50" y="100" fill="red">${message}</text></svg>`, {
      status: 500,
      headers: { "Content-Type": "image/svg+xml" },
    });
  }
}
