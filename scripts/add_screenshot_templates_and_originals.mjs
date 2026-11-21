import fs from "fs";
import path from "path";

const filePath = path.resolve("./src/server/data/apd_templates.json");
const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

// 1. Templates extracted from the 10 user-uploaded screenshots:
const screenshotTemplates = [
  // --- Screenshot 1 (media_1795292023454_f7a1ccc2.jpg) ---
  {
    id: "sb-pink-combat-boots",
    name: 'Script & Bar — Pink Number, "Trendy" & Pink Bar',
    description: "Script & Bar: 4 images, 1:2 ratio, pink number 20, black script 'Trendy', solid pink bar 'COMBAT BOOT OUTFITS'.",
    primaryCategory: "Fashion & Style",
    categories: ["Fashion", "Lifestyle", "Listicle"],
    designTypes: ["two-side", "script-bar", "number-badge"],
    width: 736,
    height: 1472,
    aspectRatio: "1:2",
    imageCount: 4,
    layoutId: "two-side",
    fonts: ["Anton", "Kaushan Script", "Montserrat"],
    colors: ["#FF2E93", "#111111", "#FFFFFF"],
    layerTexts: [
      "20",
      "Trendy",
      "COMBAT BOOT OUTFITS",
      "YOU CAN'T GET AROUND RIGHT NOW"
    ],
    headlinePreview: "20 Trendy COMBAT BOOT OUTFITS YOU CAN'T GET AROUND RIGHT NOW",
    visualConfig: {
      badge: { text: "20", shape: "number-accent", bg: "#FF2E93", color: "#FF2E93" },
      blockStyle: "script-and-bar",
      bandColor: "#FF2E93",
      accentColor: "#FF2E93",
      scriptWord: "Trendy",
      photoTheme: "fashion",
      abstractCollage: true
    }
  },
  {
    id: "sb-teal-easy-6",
    name: 'Script & Bar — Teal Bar, "Easy", 6 Photos',
    description: "Script & Bar: 6 images, 1:2 ratio, teal number 20, black script 'Easy', solid teal bar 'FALL NAIL DESIGNS'.",
    primaryCategory: "Beauty & Skincare",
    categories: ["Beauty", "Listicle", "Nails"],
    designTypes: ["grid-2x3", "script-bar", "number-badge"],
    width: 736,
    height: 1472,
    aspectRatio: "1:2",
    imageCount: 6,
    layoutId: "grid-2x3",
    fonts: ["Anton", "Kaushan Script", "Montserrat"],
    colors: ["#14A3A0", "#111111", "#FFFFFF"],
    layerTexts: [
      "20",
      "Easy",
      "FALL NAIL DESIGNS",
      "YOU WILL WANT TO TRY THIS WEEK"
    ],
    headlinePreview: "20 Easy FALL NAIL DESIGNS YOU WILL WANT TO TRY THIS WEEK",
    visualConfig: {
      badge: { text: "20", shape: "number-accent", bg: "#14A3A0", color: "#14A3A0" },
      blockStyle: "script-and-bar",
      bandColor: "#14A3A0",
      accentColor: "#14A3A0",
      scriptWord: "Easy",
      photoTheme: "fashion",
      abstractCollage: true
    }
  },
  {
    id: "sb-orange-cozy",
    name: 'Script & Bar — Orange Bar, "Cozy", 5 Photos',
    description: "Script & Bar: 5 images, 1:2 ratio, orange number 20, script 'Cozy', solid orange bar 'FALL OUTFIT IDEAS'.",
    primaryCategory: "Fashion & Style",
    categories: ["Fashion", "Lifestyle", "Fall Decor"],
    designTypes: ["band-2-3", "script-bar", "number-badge"],
    width: 736,
    height: 1472,
    aspectRatio: "1:2",
    imageCount: 5,
    layoutId: "band-2-3",
    fonts: ["Anton", "Kaushan Script", "Montserrat"],
    colors: ["#F28A3C", "#111111", "#FFFFFF"],
    layerTexts: [
      "20",
      "Cozy",
      "FALL OUTFIT IDEAS",
      "TO WEAR ON REPEAT THIS SEASON"
    ],
    headlinePreview: "20 Cozy FALL OUTFIT IDEAS TO WEAR ON REPEAT THIS SEASON",
    visualConfig: {
      badge: { text: "20", shape: "number-accent", bg: "#F28A3C", color: "#F28A3C" },
      blockStyle: "script-and-bar",
      bandColor: "#F28A3C",
      accentColor: "#F28A3C",
      scriptWord: "Cozy",
      photoTheme: "fashion",
      abstractCollage: true
    }
  },

  // --- Screenshot 2 (media_1795292040393_d94cf789.jpg) ---
  {
    id: "sb-purple-chic-23",
    name: 'Script & Bar — Purple Bar, "Chic", 2:3',
    description: "Script & Bar: 4 images, 2:3 standard ratio, purple number 20, script 'Chic', purple bar 'WINTER OUTFITS'.",
    primaryCategory: "Fashion & Style",
    categories: ["Fashion", "Lifestyle", "Winter"],
    designTypes: ["grid-2x2", "script-bar", "number-badge"],
    width: 768,
    height: 1152,
    aspectRatio: "2:3",
    imageCount: 4,
    layoutId: "grid-2x2",
    fonts: ["Anton", "Kaushan Script", "Montserrat"],
    colors: ["#8B5CF6", "#111111", "#FFFFFF"],
    layerTexts: [
      "20",
      "Chic",
      "WINTER OUTFITS",
      "THAT LOOK EXPENSIVE ON A BUDGET"
    ],
    headlinePreview: "20 Chic WINTER OUTFITS THAT LOOK EXPENSIVE ON A BUDGET",
    visualConfig: {
      badge: { text: "20", shape: "number-accent", bg: "#8B5CF6", color: "#8B5CF6" },
      blockStyle: "script-and-bar",
      bandColor: "#8B5CF6",
      accentColor: "#8B5CF6",
      scriptWord: "Chic",
      photoTheme: "fashion",
      abstractCollage: true
    }
  },
  {
    id: "sb-red-recipes-6",
    name: 'Script & Bar — Red Bar, "Easy", Recipes, 6 Photos',
    description: "Script & Bar: 6 images, 1:2 ratio, red number 20, script 'Easy', solid red bar 'DINNER RECIPES'.",
    primaryCategory: "Food & Recipes",
    categories: ["Food", "Recipe", "Listicle"],
    designTypes: ["grid-2x3", "script-bar", "number-badge"],
    width: 736,
    height: 1472,
    aspectRatio: "1:2",
    imageCount: 6,
    layoutId: "grid-2x3",
    fonts: ["Anton", "Kaushan Script", "Montserrat"],
    colors: ["#E02424", "#111111", "#FFFFFF"],
    layerTexts: [
      "20",
      "Easy",
      "DINNER RECIPES",
      "YOUR FAMILY WILL ASK FOR AGAIN"
    ],
    headlinePreview: "20 Easy DINNER RECIPES YOUR FAMILY WILL ASK FOR AGAIN",
    visualConfig: {
      badge: { text: "20", shape: "number-accent", bg: "#E02424", color: "#E02424" },
      blockStyle: "script-and-bar",
      bandColor: "#E02424",
      accentColor: "#E02424",
      scriptWord: "Easy",
      photoTheme: "food",
      abstractCollage: true
    }
  },
  {
    id: "sb-black-yellow-bold",
    name: "Script & Bar — Black Bar, Yellow Caps & Number",
    description: "Script & Bar: 4 images, 1:2 ratio, yellow number 20, script 'Bold', black bar with bright yellow text.",
    primaryCategory: "Fashion & Style",
    categories: ["Fashion", "Lifestyle", "Street Style"],
    designTypes: ["two-side", "script-bar", "number-badge"],
    width: 736,
    height: 1472,
    aspectRatio: "1:2",
    imageCount: 4,
    layoutId: "two-side",
    fonts: ["Anton", "Kaushan Script", "Montserrat"],
    colors: ["#FBBF24", "#111111", "#FFFFFF"],
    layerTexts: [
      "20",
      "Bold",
      "STREET STYLE LOOKS",
      "EVERYONE IS COPYING RIGHT NOW"
    ],
    headlinePreview: "20 Bold STREET STYLE LOOKS EVERYONE IS COPYING RIGHT NOW",
    visualConfig: {
      badge: { text: "20", shape: "number-accent", bg: "#FBBF24", color: "#FBBF24" },
      blockStyle: "script-and-bar",
      bandColor: "#111111",
      accentColor: "#FBBF24",
      scriptWord: "Bold",
      photoTheme: "fashion",
      abstractCollage: true
    }
  },

  // --- Screenshot 4 (media_1795293128715_f1ab4eae.jpg) ---
  {
    id: "ctr-white-band-pink-nails",
    name: "High CTR — White Band, Pink Keyword, 4 Photos",
    description: "High CTR: 4 images, 1:2 ratio, clean white center band with black caps and vibrant pink keyword line.",
    primaryCategory: "Beauty & Skincare",
    categories: ["Beauty", "Hair", "Nails"],
    designTypes: ["two-side", "band-card", "high-ctr"],
    width: 736,
    height: 1472,
    aspectRatio: "1:2",
    imageCount: 4,
    layoutId: "two-side",
    fonts: ["Anton", "Montserrat"],
    colors: ["#EE1A5B", "#111111", "#FFFFFF"],
    layerTexts: [
      "20+ TRENDY",
      "HALLOWEEN NAILS",
      "FOR 2026"
    ],
    headlinePreview: "20+ TRENDY HALLOWEEN NAILS FOR 2026",
    visualConfig: {
      badge: { text: "20+", shape: "pill", bg: "#EE1A5B", color: "#FFFFFF" },
      blockStyle: "color-band-card",
      bandColor: "#FFFFFF",
      accentColor: "#EE1A5B",
      photoTheme: "fashion",
      abstractCollage: true
    }
  },
  {
    id: "ctr-ruled-lead-in-winter",
    name: "High CTR — Ruled Lead-in, Huge Pink Keyword, 6 Photos",
    description: "High CTR: 6 images, 9:16 vertical, ruled lead-in '— 20 TRENDY WINTER —', huge pink keyword, bottom pink strip.",
    primaryCategory: "Fashion & Style",
    categories: ["Fashion", "Lifestyle", "Winter"],
    designTypes: ["grid-2x3", "ruled-lead-in", "high-ctr"],
    width: 720,
    height: 1280,
    aspectRatio: "9:16",
    imageCount: 6,
    layoutId: "grid-2x3",
    fonts: ["Anton", "Montserrat"],
    colors: ["#EE1A5B", "#111111", "#FFFFFF"],
    layerTexts: [
      "— 20 TRENDY WINTER —",
      "OUTFIT IDEAS",
      "YOU'LL WANT TO COPY BEFORE THE COLD REALLY HITS"
    ],
    headlinePreview: "— 20 TRENDY WINTER — OUTFIT IDEAS YOU'LL WANT TO COPY BEFORE THE COLD REALLY HITS",
    visualConfig: {
      badge: { text: "20", shape: "pill", bg: "#EE1A5B", color: "#FFFFFF" },
      blockStyle: "ruled-lead-in",
      bandColor: "#FFFFFF",
      accentColor: "#EE1A5B",
      photoTheme: "fashion",
      abstractCollage: true
    }
  },
  {
    id: "ctr-ruled-lead-in-old-money",
    name: "High CTR — Ruled Lead-in, Two Huge Pink Lines",
    description: "High CTR: 4 images, 9:16 vertical, ruled lead-in '— 20 TIMELESS STYLE —', huge pink 'OLD MONEY OUTFITS'.",
    primaryCategory: "Fashion & Style",
    categories: ["Fashion", "Lifestyle", "Old Money"],
    designTypes: ["two-side", "ruled-lead-in", "high-ctr"],
    width: 720,
    height: 1280,
    aspectRatio: "9:16",
    imageCount: 4,
    layoutId: "two-side",
    fonts: ["Anton", "Montserrat"],
    colors: ["#EE1A5B", "#111111", "#FFFFFF"],
    layerTexts: [
      "— 20 TIMELESS STYLE —",
      "OLD MONEY",
      "OUTFITS",
      "TO COPY THIS SEASON"
    ],
    headlinePreview: "— 20 TIMELESS STYLE — OLD MONEY OUTFITS TO COPY THIS SEASON",
    visualConfig: {
      badge: { text: "20", shape: "pill", bg: "#EE1A5B", color: "#FFFFFF" },
      blockStyle: "ruled-lead-in",
      bandColor: "#FFFFFF",
      accentColor: "#EE1A5B",
      photoTheme: "fashion",
      abstractCollage: true
    }
  },

  // --- Screenshot 5 (media_1795293150533_87b44cb8.jpg) ---
  {
    id: "ctr-circle-medallion-balayage",
    name: "High CTR — 6-Photo Grid, Center Circle",
    description: "High CTR: 6 images, 1:2 ratio, large white circular medallion badge with magenta border, script and CTA pill.",
    primaryCategory: "Hair & Beauty",
    categories: ["Hair", "Home Decor", "Listicle"],
    designTypes: ["grid-2x3", "circle-medallion", "high-ctr"],
    width: 736,
    height: 1472,
    aspectRatio: "1:2",
    imageCount: 6,
    layoutId: "grid-2x3",
    fonts: ["Anton", "Great Vibes", "Montserrat"],
    colors: ["#EE1A5B", "#111111", "#FFFFFF"],
    layerTexts: [
      "25",
      "Pretty",
      "BALAYAGE",
      "HAIR IDEAS",
      "TO SAVE NOW",
      "SEE ALL THE IDEAS"
    ],
    headlinePreview: "25 Pretty BALAYAGE HAIR IDEAS TO SAVE NOW",
    visualConfig: {
      badge: { text: "25", shape: "circle", bg: "#EE1A5B", color: "#FFFFFF" },
      blockStyle: "circle-medallion",
      bandColor: "#FFFFFF",
      accentColor: "#EE1A5B",
      scriptWord: "Pretty",
      ctaText: "SEE ALL THE IDEAS",
      photoTheme: "hair",
      abstractCollage: true
    }
  },
  {
    id: "tr-fashion-capsule-arch",
    name: "Capsule Wardrobe — Minimalist Editorial",
    description: "Capsule Wardrobe: 1 single image, 2:3 ratio, clean minimalist editorial floating card with Didot serif.",
    primaryCategory: "Fashion & Style",
    categories: ["Fashion", "Lifestyle", "Minimalist"],
    designTypes: ["single", "minimalist-editorial"],
    width: 768,
    height: 1152,
    aspectRatio: "2:3",
    imageCount: 1,
    layoutId: "single",
    fonts: ["Didot", "Great Vibes", "Montserrat"],
    colors: ["#8B1E3F", "#111111", "#FFFFFF"],
    layerTexts: [
      "FASHION & STYLE EDIT",
      "Chic",
      "Capsule Wardrobe Essentials"
    ],
    headlinePreview: "FASHION & STYLE EDIT Chic Capsule Wardrobe Essentials",
    visualConfig: {
      badge: { text: "01", shape: "pill", bg: "#8B1E3F", color: "#FFFFFF" },
      blockStyle: "minimalist-floating-card",
      bandColor: "#FFFFFF",
      accentColor: "#8B1E3F",
      scriptWord: "Chic",
      kicker: "FASHION & STYLE EDIT",
      photoTheme: "fashion",
      abstractCollage: true
    }
  },
  {
    id: "ps-patio-tan-script",
    name: "Patio — Tan Badge, Script & Distressed",
    description: "Patio: 4 images, 2:3 ratio, white band, tan number badge '16', script 'patio', textured distressed keyword.",
    primaryCategory: "Patio & Outdoor",
    categories: ["Patio", "Home Decor"],
    designTypes: ["grid-2x2", "textured-badge"],
    width: 768,
    height: 1152,
    aspectRatio: "2:3",
    imageCount: 4,
    layoutId: "grid-2x2",
    fonts: ["Anton", "Caveat", "Montserrat"],
    colors: ["#C5A070", "#111111", "#FFFFFF"],
    layerTexts: [
      "16",
      "patio",
      "DECORATING",
      "IDEAS TO COPY"
    ],
    headlinePreview: "16 patio DECORATING IDEAS TO COPY",
    visualConfig: {
      badge: { text: "16", shape: "pill", bg: "#C5A070", color: "#111111" },
      blockStyle: "distressed-band",
      bandColor: "#FFFFFF",
      accentColor: "#C5A070",
      scriptWord: "patio",
      photoTheme: "outdoor",
      abstractCollage: true
    }
  },

  // --- Screenshot 6 (media_1795293170301_5d393e6c.jpg) ---
  {
    id: "ps-apartment-big-caps",
    name: "Small Apartment — Big Caps Band",
    description: "Small Apartment: 4 images, 2:3 ratio, massive bold number '19', tracked 'SMALL', huge bold caps 'APARTMENT'.",
    primaryCategory: "Patio & Outdoor",
    categories: ["Patio", "Balcony", "Home Decor"],
    designTypes: ["grid-2x2", "big-caps-band"],
    width: 768,
    height: 1152,
    aspectRatio: "2:3",
    imageCount: 4,
    layoutId: "grid-2x2",
    fonts: ["Anton", "Montserrat"],
    colors: ["#111111", "#FFFFFF"],
    layerTexts: [
      "19",
      "SMALL",
      "APARTMENT",
      "PATIOS TO MAXIMIZE SPACE"
    ],
    headlinePreview: "19 SMALL APARTMENT PATIOS TO MAXIMIZE SPACE",
    visualConfig: {
      badge: { text: "19", shape: "giant-number", bg: "#111111", color: "#111111" },
      blockStyle: "big-caps-band",
      bandColor: "#FFFFFF",
      accentColor: "#111111",
      photoTheme: "outdoor",
      abstractCollage: true
    }
  },
  {
    id: "ps-clever-olive",
    name: "Small Patios — Olive Badge & Distressed",
    description: "Small Patios: 4 images, 2:3 ratio, olive green circle badge '21', bold 'CLEVER', textured 'COOL IDEAS FOR SMALL PATIOS'.",
    primaryCategory: "Patio & Outdoor",
    categories: ["Patio", "Home Decor"],
    designTypes: ["grid-2x2", "olive-badge"],
    width: 768,
    height: 1152,
    aspectRatio: "2:3",
    imageCount: 4,
    layoutId: "grid-2x2",
    fonts: ["Anton", "Montserrat"],
    colors: ["#5A6B48", "#111111", "#FFFFFF"],
    layerTexts: [
      "21",
      "CLEVER",
      "COOL IDEAS FOR",
      "SMALL PATIOS"
    ],
    headlinePreview: "21 CLEVER COOL IDEAS FOR SMALL PATIOS",
    visualConfig: {
      badge: { text: "21", shape: "circle", bg: "#5A6B48", color: "#FFFFFF" },
      blockStyle: "olive-circle-distressed",
      bandColor: "#FFFFFF",
      accentColor: "#5A6B48",
      photoTheme: "outdoor",
      abstractCollage: true
    }
  },
  {
    id: "cv-strips-cream-green",
    name: "Colour Strips — Cream & Green",
    description: "Colour Strips: 4 images, 2:3 ratio, cream and forest green horizontal layered color bars with brown tile badge '4'.",
    primaryCategory: "Hair & Beauty",
    categories: ["Hair", "Beauty", "Natural"],
    designTypes: ["grid-2x2", "color-strips"],
    width: 768,
    height: 1152,
    aspectRatio: "2:3",
    imageCount: 4,
    layoutId: "grid-2x2",
    fonts: ["Anton", "Montserrat"],
    colors: ["#2D5A3A", "#F6EFE9", "#5C3D28"],
    layerTexts: [
      "4",
      "WAYS TO USE",
      "ROSEMARY OIL FOR",
      "HAIR GROWTH"
    ],
    headlinePreview: "4 WAYS TO USE ROSEMARY OIL FOR HAIR GROWTH",
    visualConfig: {
      badge: { text: "4", shape: "square", bg: "#5C3D28", color: "#FFFFFF" },
      blockStyle: "color-strips",
      bandColor: "#2D5A3A",
      accentColor: "#5C3D28",
      photoTheme: "hair",
      abstractCollage: true
    }
  },

  // --- Screenshot 7 (media_1795293192863_309c1857.jpg) ---
  {
    id: "cv-strips-beige-green-plain",
    name: "Colour Strips — Beige & Green, No Number",
    description: "Colour Strips: 3 images (1 top + 2 bottom), 2:3 ratio, beige and green layered bars with brown text.",
    primaryCategory: "Beauty & Skincare",
    categories: ["Beauty", "Skincare"],
    designTypes: ["three-hero-top", "color-strips"],
    width: 768,
    height: 1152,
    aspectRatio: "2:3",
    imageCount: 3,
    layoutId: "three-hero-top",
    fonts: ["Anton", "Montserrat"],
    colors: ["#4A7C3A", "#F5EBE1", "#4A2E1B"],
    layerTexts: [
      "WHAT HAPPENS WHEN",
      "WHEN YOU USE ALOE VERA",
      "ON YOUR FACE"
    ],
    headlinePreview: "WHAT HAPPENS WHEN YOU USE ALOE VERA ON YOUR FACE",
    visualConfig: {
      blockStyle: "color-strips",
      bandColor: "#4A7C3A",
      accentColor: "#4A2E1B",
      photoTheme: "lifestyle",
      abstractCollage: true
    }
  },
  {
    id: "cv-strips-cream-brown-number",
    name: "Colour Strips — Cream & Brown, Orange Number",
    description: "Colour Strips: 3 images (1 top + 2 bottom), 2:3 ratio, orange badge '52', brown center bar, orange style inspiration.",
    primaryCategory: "Hair & Beauty",
    categories: ["Hair", "Celebrity"],
    designTypes: ["three-hero-top", "color-strips"],
    width: 768,
    height: 1152,
    aspectRatio: "2:3",
    imageCount: 3,
    layoutId: "three-hero-top",
    fonts: ["Anton", "Montserrat"],
    colors: ["#E67E22", "#4A2E1B", "#FFFFFF"],
    layerTexts: [
      "52",
      "SHORT",
      "CELEBRITY HAIRSTYLES FOR",
      "STYLE INSPIRATION"
    ],
    headlinePreview: "52 SHORT CELEBRITY HAIRSTYLES FOR STYLE INSPIRATION",
    visualConfig: {
      badge: { text: "52", shape: "pill", bg: "#E67E22", color: "#FFFFFF" },
      blockStyle: "color-strips",
      bandColor: "#4A2E1B",
      accentColor: "#E67E22",
      photoTheme: "hair",
      abstractCollage: true
    }
  },
  {
    id: "cv-rust-band-tall-condensed",
    name: "Rust Band, Tall Condensed Caps",
    description: "Solid Rust Terracotta Band: 4 images, 1:2 ratio, heavy condensed caps in white and black.",
    primaryCategory: "Home Decor & Living",
    categories: ["Home Decor", "Kitchen", "DIY"],
    designTypes: ["two-side", "rust-band"],
    width: 736,
    height: 1472,
    aspectRatio: "1:2",
    imageCount: 4,
    layoutId: "two-side",
    fonts: ["Anton", "Oswald", "Montserrat"],
    colors: ["#C05A2B", "#111111", "#FFFFFF"],
    layerTexts: [
      "TRANSFORM YOUR",
      "KITCHEN WITH",
      "UPCYCLED PALLETS"
    ],
    headlinePreview: "TRANSFORM YOUR KITCHEN WITH UPCYCLED PALLETS",
    visualConfig: {
      blockStyle: "rust-band",
      bandColor: "#C05A2B",
      accentColor: "#111111",
      photoTheme: "homedecor",
      abstractCollage: true
    }
  },

  // --- Screenshot 8 (media_1795293225399_e12facf1.jpg) ---
  {
    id: "ctr-full-photo-rounded-card",
    name: "High CTR — Full Photo, Rounded Headline Card",
    description: "High CTR: 1 single image, 1:2 ratio, floating rounded white card with pink top badge '25', script and CTA pill.",
    primaryCategory: "Hair & Beauty",
    categories: ["Hair", "Beauty", "Balayage"],
    designTypes: ["single", "rounded-floating-card"],
    width: 736,
    height: 1472,
    aspectRatio: "1:2",
    imageCount: 1,
    layoutId: "single",
    fonts: ["Anton", "Great Vibes", "Montserrat"],
    colors: ["#E91E63", "#111111", "#FFFFFF"],
    layerTexts: [
      "25",
      "Stunning",
      "BALAYAGE HAIR",
      "COLOR IDEAS",
      "FOR LONG LAYERED HAIR",
      "GET THE IDEAS"
    ],
    headlinePreview: "25 Stunning BALAYAGE HAIR COLOR IDEAS FOR LONG LAYERED HAIR",
    visualConfig: {
      badge: { text: "25", shape: "circle", bg: "#E91E63", color: "#FFFFFF" },
      blockStyle: "rounded-headline-card",
      bandColor: "#FFFFFF",
      accentColor: "#E91E63",
      scriptWord: "Stunning",
      ctaText: "GET THE IDEAS",
      photoTheme: "hair",
      abstractCollage: true
    }
  },
  {
    id: "ctr-magazine-cover-yellow-script",
    name: "High CTR — Magazine Cover, Yellow Script",
    description: "High CTR: 1 single image, 1:2 ratio, top yellow circle badge '25', dark translucent card with yellow script 'Dreamy'.",
    primaryCategory: "Hair & Beauty",
    categories: ["Hair", "Beauty", "Magazine"],
    designTypes: ["single", "magazine-dark-card"],
    width: 736,
    height: 1472,
    aspectRatio: "1:2",
    imageCount: 1,
    layoutId: "single",
    fonts: ["Anton", "Great Vibes", "Montserrat"],
    colors: ["#EAB308", "#111111", "#FFFFFF"],
    layerTexts: [
      "25",
      "Dreamy",
      "BALAYAGE",
      "HAIR COLOR IDEAS",
      "FOR LONG LAYERED HAIR",
      "SEE ALL THE LOOKS"
    ],
    headlinePreview: "25 Dreamy BALAYAGE HAIR COLOR IDEAS FOR LONG LAYERED HAIR",
    visualConfig: {
      badge: { text: "25", shape: "circle", bg: "#EAB308", color: "#111111" },
      blockStyle: "magazine-dark-card",
      bandColor: "#1F2937ee",
      accentColor: "#EAB308",
      scriptWord: "Dreamy",
      ctaText: "SEE ALL THE LOOKS",
      photoTheme: "hair",
      abstractCollage: true
    }
  },
  {
    id: "tr-travel-destinations-band",
    name: "Travel Bucket List — Center Band Pin",
    description: "Travel Bucket List: 4 images, 2:3 ratio, dark navy center band, red square badge '12', pink script 'Dreamy'.",
    primaryCategory: "Lifestyle",
    categories: ["Lifestyle", "Travel", "Bucket List"],
    designTypes: ["grid-2x2", "navy-band"],
    width: 768,
    height: 1152,
    aspectRatio: "2:3",
    imageCount: 4,
    layoutId: "grid-2x2",
    fonts: ["Playfair Display", "Great Vibes", "Montserrat"],
    colors: ["#0F172A", "#F472B6", "#EF4444"],
    layerTexts: [
      "12",
      "Dreamy",
      "BUCKET LIST PLACES TO VISIT",
      "THE ULTIMATE 2026 TRAVEL GUIDE"
    ],
    headlinePreview: "12 Dreamy BUCKET LIST PLACES TO VISIT THE ULTIMATE 2026 TRAVEL GUIDE",
    visualConfig: {
      badge: { text: "12", shape: "square", bg: "#EF4444", color: "#FFFFFF" },
      blockStyle: "navy-band-serif",
      bandColor: "#0F172A",
      accentColor: "#F472B6",
      scriptWord: "Dreamy",
      photoTheme: "outdoor",
      abstractCollage: true
    }
  },

  // --- Screenshot 9 (media_1795293247217_4bde0080.jpg) ---
  {
    id: "cv-framed-brown-box",
    name: "Framed Brown Box on a Grid",
    description: "Framed Brown Box: 4 images, 1:2 ratio, solid dark brown rectangular box with white double frame and white script.",
    primaryCategory: "Home Decor & Living",
    categories: ["Home Decor", "Fall Decor", "Bedroom"],
    designTypes: ["two-side", "framed-box"],
    width: 736,
    height: 1472,
    aspectRatio: "1:2",
    imageCount: 4,
    layoutId: "two-side",
    fonts: ["Anton", "Great Vibes", "Playfair Display"],
    colors: ["#6B4423", "#FFFFFF"],
    layerTexts: [
      "41",
      "Farmhouse",
      "BEDROOM",
      "Decor Ideas"
    ],
    headlinePreview: "41 Farmhouse BEDROOM Decor Ideas",
    visualConfig: {
      badge: { text: "41", shape: "white-number", bg: "#6B4423", color: "#FFFFFF" },
      blockStyle: "framed-double-border-card",
      bandColor: "#6B4423",
      accentColor: "#FFFFFF",
      scriptWord: "Farmhouse",
      photoTheme: "homedecor",
      abstractCollage: true
    }
  },
  {
    id: "cv-mosaic-big-colour-circle",
    name: "Photo Mosaic + Big Colour Circle",
    description: "Photo Mosaic: 6 images, 1:2 ratio, massive crimson circle with bright teal bold typography.",
    primaryCategory: "Home Decor & Living",
    categories: ["Home Decor", "Living Room"],
    designTypes: ["grid-2x3", "big-colour-circle"],
    width: 736,
    height: 1472,
    aspectRatio: "1:2",
    imageCount: 6,
    layoutId: "grid-2x3",
    fonts: ["Anton", "Montserrat"],
    colors: ["#B83B5E", "#22D3EE", "#FFFFFF"],
    layerTexts: [
      "40",
      "STUNNING",
      "TV UNIT",
      "MODERN",
      "DESIGNS"
    ],
    headlinePreview: "40 STUNNING TV UNIT MODERN DESIGNS",
    visualConfig: {
      badge: { text: "40", shape: "circle", bg: "#B83B5E", color: "#22D3EE" },
      blockStyle: "big-colour-circle",
      bandColor: "#B83B5E",
      accentColor: "#22D3EE",
      photoTheme: "homedecor",
      abstractCollage: true
    }
  },
  {
    id: "cv-mosaic-neon-framed-card",
    name: "Photo Mosaic + Neon-Framed Card",
    description: "Photo Mosaic: 6 images, 1:2 ratio, deep navy card with bright neon lime border, neon badge '25' and cyan script.",
    primaryCategory: "Home Decor & Living",
    categories: ["Home Decor", "Lifestyle", "Bedroom"],
    designTypes: ["grid-2x3", "neon-frame"],
    width: 736,
    height: 1472,
    aspectRatio: "1:2",
    imageCount: 6,
    layoutId: "grid-2x3",
    fonts: ["Anton", "Great Vibes", "Montserrat"],
    colors: ["#0F172A", "#A3E635", "#38BDF8"],
    layerTexts: [
      "25",
      "COASTAL",
      "BEDROOM",
      "Ideas"
    ],
    headlinePreview: "25 COASTAL BEDROOM Ideas",
    visualConfig: {
      badge: { text: "25", shape: "circle", bg: "#A3E635", color: "#0F172A" },
      blockStyle: "neon-framed-card",
      bandColor: "#0F172A",
      accentColor: "#A3E635",
      scriptWord: "Ideas",
      photoTheme: "homedecor",
      abstractCollage: true
    }
  },

  // --- Screenshot 10 (media_1795293274828_bb0d0617.jpg) ---
  {
    id: "lx-pink-circle-flattering",
    name: "High CTR — Pink Circle, Script & Outlined Pink Keyword",
    description: "High CTR: 4 images, 1:2 ratio, pink circle badge '25', script 'Fun', pink outlined keyword 'FLATTERING'.",
    primaryCategory: "Hair & Beauty",
    categories: ["Hair", "Beauty"],
    designTypes: ["two-side", "script-bold", "number-badge"],
    width: 736,
    height: 1472,
    aspectRatio: "1:2",
    imageCount: 4,
    layoutId: "two-side",
    fonts: ["Anton", "Kaushan Script", "Montserrat"],
    colors: ["#E91E63", "#111111", "#FFFFFF"],
    layerTexts: [
      "25",
      "Fun",
      "FLATTERING",
      "HAIRCUTS FOR WOMEN OVER 40 THAT LOOK AMAZING"
    ],
    headlinePreview: "25 Fun FLATTERING HAIRCUTS FOR WOMEN OVER 40 THAT LOOK AMAZING",
    visualConfig: {
      badge: { text: "25", shape: "circle", bg: "#E91E63", color: "#FFFFFF" },
      blockStyle: "viral-badge-script",
      bandColor: "#FFFFFF",
      accentColor: "#E91E63",
      scriptWord: "Fun",
      photoTheme: "hair",
      abstractCollage: true
    }
  },
  {
    id: "ctr-tilted-ribbon-cream-band",
    name: "High CTR — Tilted Ribbon, Cream Band, 4 Photos",
    description: "High CTR: 4 images, 1:2 ratio, cream band with tilted red ribbon 'MUST-TRY', black number '25', bold red keyword.",
    primaryCategory: "Hair & Beauty",
    categories: ["Hair", "Balayage"],
    designTypes: ["two-side", "tilted-ribbon"],
    width: 736,
    height: 1472,
    aspectRatio: "1:2",
    imageCount: 4,
    layoutId: "two-side",
    fonts: ["Anton", "Montserrat"],
    colors: ["#DC2626", "#111111", "#FBF7F0"],
    layerTexts: [
      "MUST-TRY",
      "25",
      "BALAYAGE",
      "HAIR IDEAS",
      "FOR LONG LAYERED HAIR",
      "GET THE IDEAS"
    ],
    headlinePreview: "MUST-TRY 25 BALAYAGE HAIR IDEAS FOR LONG LAYERED HAIR",
    visualConfig: {
      badge: { text: "25", shape: "number-accent", bg: "#DC2626", color: "#111111" },
      blockStyle: "tilted-ribbon-card",
      bandColor: "#FBF7F0",
      accentColor: "#DC2626",
      kicker: "MUST-TRY",
      ctaText: "GET THE IDEAS",
      photoTheme: "hair",
      abstractCollage: true
    }
  },

  // =========================================================================
  // 2. EXCLUSIVE "PINFORGE ORIGINALS" (Elevated Designs Learning From The Best)
  // =========================================================================
  {
    id: "forge-luxury-linen-gold",
    name: "PinForge Original — Luxury Linen, Gilded Seal & Didot Serif",
    description: "PinForge Exclusive: Textured warm linen card, metallic gold seal badge, Bodoni Didot luxury editorial typography, emerald pill kicker.",
    primaryCategory: "Beauty & Skincare",
    categories: ["Beauty", "Luxury", "Editorial", "PinForge Original"],
    designTypes: ["single", "luxury-linen-gold"],
    width: 736,
    height: 1472,
    aspectRatio: "1:2",
    imageCount: 1,
    layoutId: "single",
    fonts: ["Cinzel", "Playfair Display", "Montserrat"],
    colors: ["#D4AF37", "#064E3B", "#FDFBF7", "#111111"],
    layerTexts: [
      "MAISON DE BEAUTÉ",
      "50",
      "Timeless",
      "HAUTE COUTURE LOOKS",
      "THE DEFINITIVE LUXURY CAPSULE 2026"
    ],
    headlinePreview: "50 Timeless HAUTE COUTURE LOOKS THE DEFINITIVE LUXURY CAPSULE 2026",
    visualConfig: {
      badge: { text: "50", shape: "circle", bg: "#D4AF37", color: "#111111" },
      blockStyle: "forge-linen-gold",
      bandColor: "#FDFBF7",
      accentColor: "#D4AF37",
      scriptWord: "Timeless",
      kicker: "MAISON DE BEAUTÉ",
      ctaText: "EXPLORE THE EDIT",
      photoTheme: "fashion",
      abstractCollage: true
    }
  },
  {
    id: "forge-neon-cyber-noir",
    name: "PinForge Original — Cyber Noir, Holographic Cyan Glow & Anton",
    description: "PinForge Exclusive: Obsidian noir cinematic frame, glowing neon cyan and hot magenta borders, high-CTR cyber typography.",
    primaryCategory: "Fashion & Style",
    categories: ["Fashion", "Street Style", "Cinematic", "PinForge Original"],
    designTypes: ["grid-2x2", "neon-cyber-noir"],
    width: 736,
    height: 1472,
    aspectRatio: "1:2",
    imageCount: 4,
    layoutId: "grid-2x2",
    fonts: ["Anton", "Oswald", "Montserrat"],
    colors: ["#06B6D4", "#EC4899", "#09090B", "#FFFFFF"],
    layerTexts: [
      "2026 DROPS",
      "35+",
      "Cyber",
      "STREETWEAR AESTHETIC",
      "TRENDS DOMINATING TOKYO & NYC"
    ],
    headlinePreview: "35+ Cyber STREETWEAR AESTHETIC TRENDS DOMINATING TOKYO & NYC",
    visualConfig: {
      badge: { text: "35+", shape: "pill", bg: "#06B6D4", color: "#09090B" },
      blockStyle: "forge-cyber-noir",
      bandColor: "#09090Bee",
      accentColor: "#06B6D4",
      scriptWord: "Cyber",
      kicker: "2026 DROPS",
      ctaText: "GET THE LOOKS",
      photoTheme: "fashion",
      abstractCollage: true
    }
  },
  {
    id: "forge-french-provence-lavender",
    name: "PinForge Original — Provence Lavender, Botanical Crest & Italic Didot",
    description: "PinForge Exclusive: Split lavender and cream pastel collage, French Riviera Didot typography, botanical crest, and lilac pill.",
    primaryCategory: "Home Decor & Living",
    categories: ["Home Decor", "Lifestyle", "Provence", "PinForge Original"],
    designTypes: ["two-side", "provence-lavender"],
    width: 736,
    height: 1472,
    aspectRatio: "1:2",
    imageCount: 2,
    layoutId: "two-side",
    fonts: ["Didot", "Great Vibes", "Montserrat"],
    colors: ["#8B5CF6", "#E9D5FF", "#FDF4FF", "#1E1B4B"],
    layerTexts: [
      "FRENCH LIVING",
      "24",
      "Charming",
      "PROVENCE BEDROOMS",
      "RUSTIC SOUTHERN FRANCE ELEGANCE"
    ],
    headlinePreview: "24 Charming PROVENCE BEDROOMS RUSTIC SOUTHERN FRANCE ELEGANCE",
    visualConfig: {
      badge: { text: "24", shape: "circle", bg: "#8B5CF6", color: "#FFFFFF" },
      blockStyle: "forge-provence-lavender",
      bandColor: "#FDF4FF",
      accentColor: "#8B5CF6",
      scriptWord: "Charming",
      kicker: "FRENCH LIVING",
      ctaText: "VIEW HOMES",
      photoTheme: "homedecor",
      abstractCollage: true
    }
  }
];

// Merge into data: replace if ID exists, or prepend to front
const existingMap = new Map();
for (const item of data) {
  existingMap.set(item.id, item);
}

for (const tmpl of screenshotTemplates) {
  existingMap.set(tmpl.id, tmpl);
}

// Prepend the new/screenshot templates right at the top
const result = [...screenshotTemplates];
for (const [id, item] of existingMap) {
  if (!screenshotTemplates.some((t) => t.id === id)) {
    result.push(item);
  }
}

fs.writeFileSync(filePath, JSON.stringify(result, null, 2), "utf-8");
console.log(`Updated apd_templates.json! Total enriched templates: ${result.length}`);
