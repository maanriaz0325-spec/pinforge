"use client";

import React from "react";

export interface VisualConfig {
  badge?: {
    text: string;
    shape: string;
    bg: string;
    color: string;
  } | null;
  blockStyle?: string;
  bandColor?: string;
  accentColor?: string;
  scriptWord?: string | null;
  photoTheme?: string;
  ctaText?: string;
  kicker?: string;
  abstractCollage?: boolean;
}

export interface TemplatePreviewData {
  id: string;
  name: string;
  layoutId?: string;
  aspectRatio?: string;
  imageCount?: number;
  fonts?: string[];
  colors?: string[];
  layerTexts?: string[];
  headlinePreview?: string;
  primaryCategory?: string;
  visualConfig?: VisualConfig;
  // Dynamic user customization overrides:
  customImages?: string[];
  customFont?: string;
  customTextColor?: string;
  customAccentColor?: string;
  customBandColor?: string;
  customBadgeBg?: string;
  customBadgeText?: string;
  customBadgeShape?: string;
  customLines?: string[];
  customKicker?: string;
  customScriptWord?: string;
  customCtaText?: string;
  customWebsite?: string;
  fontStyle?: {
    uppercase?: boolean;
    bold?: boolean;
    italic?: boolean;
    letterSpacing?: string;
  };
}

// Curated high-aesthetic royalty-free Unsplash photos by niche
const NICHE_PHOTOS: Record<string, string[]> = {
  hair: [
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1523263685509-57c1421938b6?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80",
  ],
  homedecor: [
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=600&q=80",
  ],
  fashion: [
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80",
  ],
  food: [
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=600&q=80",
  ],
  outdoor: [
    "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
  ],
  lifestyle: [
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
  ],
};

function resolveImageCount(layoutId?: string, imageCount?: number): number {
  if (imageCount && imageCount > 0) return imageCount;
  if (!layoutId) return 4;
  const l = layoutId.toLowerCase();
  if (l === "single" || l.includes("single") || l === "pin-standard" || l === "pin-square") return 1;
  if (l === "two-side" || l === "two-stack" || l === "two-hero" || l === "band-1-1") return 2;
  if (l === "three-hero-top" || l === "three-hero-left" || l === "three-rows" || l === "three-cols" || l === "band-1-2" || l === "band-2-1") return 3;
  if (l === "grid-2x2" || l === "band-2-2" || l === "hero-4" || l === "four-cols" || l === "four-rows") return 4;
  if (l === "band-2-3" || l === "two-top-three-bottom" || l === "three-top-two-bottom" || l === "center-hero") return 5;
  if (l === "band-2-4" || l === "grid-2x3" || l === "hero-top-grid-6" || l === "top2-gap-grid4" || l === "top2-band-grid4" || l === "grid4-band-2" || l === "band-3-3") return 6;
  return 4;
}

export function PinTemplateVisualPreview({
  template,
  className = "",
  showWebsite = true,
}: {
  template: TemplatePreviewData;
  className?: string;
  showWebsite?: boolean;
}) {
  const layout = template.layoutId || "two-side";
  const imageCount = resolveImageCount(template.layoutId, template.imageCount);
  const config = template.visualConfig || {};
  const photoTheme = config.photoTheme || "lifestyle";
  const defaultPhotos = NICHE_PHOTOS[photoTheme] || NICHE_PHOTOS.lifestyle;

  // Use user-uploaded images if available
  const hasCustomImages = Boolean(template.customImages && template.customImages.length > 0);
  const userImages = template.customImages || [];

  const getPhoto = (idx: number) => {
    if (hasCustomImages && userImages.length > 0) {
      if (userImages[idx]) return userImages[idx];
      return userImages[0];
    }
    return defaultPhotos[idx % defaultPhotos.length] || defaultPhotos[0];
  };

  // Typography & Styling Overrides
  const primaryFont = template.customFont || template.fonts?.[0] || "Montserrat, sans-serif";
  const accentColor = template.customAccentColor || config.accentColor || template.colors?.[1] || "#EE1A5B";
  const bandColor = template.customBandColor || config.bandColor || "#FFFFFF";
  const blockStyle = config.blockStyle || "color-band-card";

  // Badge configuration
  const defaultBadge = config.badge;
  const hasBadge = Boolean(defaultBadge || template.customBadgeText);
  const badgeText = template.customBadgeText || defaultBadge?.text || "20";
  const badgeBg = template.customBadgeBg || defaultBadge?.bg || accentColor;
  const badgeColor = defaultBadge?.color || "#FFFFFF";
  const badgeShape = template.customBadgeShape || defaultBadge?.shape || "circle";

  // Split headline lines or use user custom lines
  const rawLines =
    template.layerTexts && template.layerTexts.length > 0
      ? template.layerTexts
      : (template.headlinePreview || template.name).split(" ").slice(0, 5);

  const lines =
    template.customLines && template.customLines.length > 0 ? template.customLines : rawLines;

  // Additional customizable content
  const kicker = template.customKicker || config.kicker || template.primaryCategory || "IDEAS & INSPO";
  const scriptWord = template.customScriptWord || config.scriptWord || "Chic";
  const ctaText = template.customCtaText || config.ctaText || "GET THE IDEAS";
  const website = template.customWebsite || "pinforge.app";

  // Determines whether the integrated archetype handles the badge inline
  const isIntegratedArchetype =
    blockStyle === "luxe-stepped-boxes" ||
    blockStyle === "luxe-stacked-over-50" ||
    blockStyle === "luxe-black-boxes" ||
    blockStyle === "viral-badge-script" ||
    blockStyle === "viral-grid-cta" ||
    blockStyle === "color-band-card" ||
    blockStyle === "script-and-bar" ||
    blockStyle === "ruled-lead-in" ||
    blockStyle === "circle-medallion" ||
    blockStyle === "minimalist-floating-card" ||
    blockStyle === "big-caps-band" ||
    blockStyle === "olive-circle-distressed" ||
    blockStyle === "color-strips" ||
    blockStyle === "rust-band" ||
    blockStyle === "rounded-headline-card" ||
    blockStyle === "magazine-dark-card" ||
    blockStyle === "navy-band-serif" ||
    blockStyle === "framed-double-border-card" ||
    blockStyle === "big-colour-circle" ||
    blockStyle === "neon-framed-card" ||
    blockStyle === "tilted-ribbon-card" ||
    blockStyle === "forge-linen-gold" ||
    blockStyle === "forge-cyber-noir" ||
    blockStyle === "forge-provence-lavender";

  return (
    <div
      className={`relative w-full aspect-[2/3] overflow-hidden rounded-xl bg-slate-950 select-none shadow-md ${className}`}
      style={{ fontFamily: primaryFont }}
    >
      {/* ======================================================== */}
      {/* 1. PHOTO COLLAGE OR SIGNATURE GEOMETRIC ARTWORK */}
      {/* ======================================================== */}
      <div className="absolute inset-0 pointer-events-none">
        {hasCustomImages ? (
          /* User Uploaded Photos Rendered In Layout */
          <>
            {imageCount === 1 && (
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${getPhoto(0)})` }}
              >
                <div className="w-full h-full bg-gradient-to-t from-black/85 via-black/35 to-black/30" />
              </div>
            )}

            {imageCount === 2 && (
              <div className="w-full h-full grid grid-cols-2 gap-[2px] bg-white/30">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${getPhoto(0)})` }}
                />
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${getPhoto(1)})` }}
                />
              </div>
            )}

            {imageCount === 3 && (
              <div className="w-full h-full flex flex-col gap-[2px] bg-white/30">
                <div
                  className="h-[55%] w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${getPhoto(0)})` }}
                />
                <div className="h-[45%] grid grid-cols-2 gap-[2px]">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${getPhoto(1)})` }}
                  />
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${getPhoto(2)})` }}
                  />
                </div>
              </div>
            )}

            {imageCount === 4 && (
              <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-[2px] bg-white/30">
                {[0, 1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${getPhoto(idx)})` }}
                  />
                ))}
              </div>
            )}

            {imageCount === 5 && (
              <div className="w-full h-full flex flex-col gap-[2px] bg-white/30">
                <div className="h-[45%] grid grid-cols-2 gap-[2px]">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${getPhoto(0)})` }}
                  />
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${getPhoto(1)})` }}
                  />
                </div>
                <div className="h-[55%] grid grid-cols-3 gap-[2px]">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${getPhoto(2)})` }}
                  />
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${getPhoto(3)})` }}
                  />
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${getPhoto(4)})` }}
                  />
                </div>
              </div>
            )}

            {imageCount >= 6 && (
              <div className="w-full h-full grid grid-cols-2 grid-rows-3 gap-[2px] bg-white/30">
                {[0, 1, 2, 3, 4, 5].map((idx) => (
                  <div
                    key={idx}
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${getPhoto(idx)})` }}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          /* Signature AutoPinDesign Abstract Geometric Collage (Screenshot Exact Reproduction) */
          <>
            {/* 1 Image: Elegant Single Panel */}
            {imageCount === 1 && (
              <div className="w-full h-full bg-[#EFE7DC] relative overflow-hidden flex flex-col justify-between p-6">
                <div className="w-36 h-36 rounded-full bg-[#E48E83] opacity-80 shadow-xs self-start -ml-8 -mt-8" />
                <div className="w-44 h-44 rounded-full bg-[#8E9880] opacity-80 shadow-xs self-end -mr-10 -mb-10" />
              </div>
            )}

            {/* 2 Images: Split Left & Right Columns */}
            {imageCount === 2 && (
              <div className="w-full h-full flex">
                <div className="w-1/2 h-full bg-[#EFE7DC] relative overflow-hidden border-r border-white/60">
                  <div className="absolute top-[8%] left-[10%] w-[75%] aspect-square rounded-full bg-[#E48E83] opacity-90 shadow-xs" />
                  <div className="absolute bottom-[8%] left-[10%] w-[75%] aspect-square rounded-full bg-[#C39F8F] opacity-90 shadow-xs" />
                </div>
                <div className="w-1/2 h-full bg-[#8E9880] relative overflow-hidden">
                  <div className="absolute top-[8%] right-[10%] w-[75%] aspect-square rounded-full bg-[#758169] opacity-85 shadow-xs" />
                  <div className="absolute top-[48%] inset-x-0 h-9 bg-[#6A745E] opacity-75" />
                  <div className="absolute bottom-[8%] right-[10%] w-[75%] aspect-square rounded-full bg-[#A2AE95] opacity-85 shadow-xs" />
                </div>
              </div>
            )}

            {/* 3 Images: 1 Hero Top + 2 Split Bottom */}
            {imageCount === 3 && (
              <div className="w-full h-full flex flex-col">
                <div className="h-[52%] w-full bg-[#EFE7DC] relative overflow-hidden border-b border-white/60">
                  <div className="absolute top-[10%] left-[20%] w-[50%] aspect-square rounded-full bg-[#E48E83] opacity-85" />
                </div>
                <div className="h-[48%] w-full flex">
                  <div className="w-1/2 h-full bg-[#C39F8F]/40 relative overflow-hidden border-r border-white/60">
                    <div className="absolute bottom-[10%] left-[15%] w-[70%] aspect-square rounded-full bg-[#C39F8F] opacity-90" />
                  </div>
                  <div className="w-1/2 h-full bg-[#8E9880] relative overflow-hidden">
                    <div className="absolute bottom-[10%] right-[15%] w-[70%] aspect-square rounded-full bg-[#A2AE95] opacity-85" />
                  </div>
                </div>
              </div>
            )}

            {/* 4 Images: 4 Quadrants (2x2 Grid) */}
            {imageCount === 4 && (
              <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-[2px] bg-white/60">
                <div className="w-full h-full bg-[#EFE7DC] relative overflow-hidden">
                  <div className="absolute top-[10%] left-[10%] w-[75%] aspect-square rounded-full bg-[#E48E83] opacity-90" />
                </div>
                <div className="w-full h-full bg-[#8E9880] relative overflow-hidden">
                  <div className="absolute top-[10%] right-[10%] w-[75%] aspect-square rounded-full bg-[#758169] opacity-85" />
                </div>
                <div className="w-full h-full bg-[#EFE7DC] relative overflow-hidden">
                  <div className="absolute bottom-[10%] left-[10%] w-[75%] aspect-square rounded-full bg-[#C39F8F] opacity-90" />
                </div>
                <div className="w-full h-full bg-[#8E9880] relative overflow-hidden">
                  <div className="absolute top-[30%] inset-x-0 h-6 bg-[#6A745E] opacity-75" />
                  <div className="absolute bottom-[10%] right-[10%] w-[75%] aspect-square rounded-full bg-[#A2AE95] opacity-85" />
                </div>
              </div>
            )}

            {/* 5 Images: 2 Top Panels + 3 Bottom Panels */}
            {imageCount === 5 && (
              <div className="w-full h-full flex flex-col gap-[2px] bg-white/60">
                <div className="h-[45%] grid grid-cols-2 gap-[2px]">
                  <div className="w-full h-full bg-[#EFE7DC] relative overflow-hidden">
                    <div className="absolute top-[10%] left-[10%] w-[70%] aspect-square rounded-full bg-[#E48E83] opacity-85" />
                  </div>
                  <div className="w-full h-full bg-[#8E9880] relative overflow-hidden">
                    <div className="absolute top-[10%] right-[10%] w-[70%] aspect-square rounded-full bg-[#758169] opacity-85" />
                  </div>
                </div>
                <div className="h-[55%] grid grid-cols-3 gap-[2px]">
                  <div className="w-full h-full bg-[#C39F8F]/40 relative overflow-hidden">
                    <div className="absolute bottom-[10%] left-[10%] w-[80%] aspect-square rounded-full bg-[#C39F8F] opacity-85" />
                  </div>
                  <div className="w-full h-full bg-[#EFE7DC] relative overflow-hidden">
                    <div className="absolute bottom-[10%] inset-x-[10%] w-[80%] aspect-square rounded-full bg-[#E48E83] opacity-85" />
                  </div>
                  <div className="w-full h-full bg-[#8E9880] relative overflow-hidden">
                    <div className="absolute bottom-[10%] right-[10%] w-[80%] aspect-square rounded-full bg-[#A2AE95] opacity-85" />
                  </div>
                </div>
              </div>
            )}

            {/* 6 Images: 2x3 Grid */}
            {imageCount >= 6 && (
              <div className="w-full h-full grid grid-cols-2 grid-rows-3 gap-[2px] bg-white/60">
                <div className="w-full h-full bg-[#EFE7DC] relative overflow-hidden">
                  <div className="absolute top-[10%] left-[10%] w-[70%] aspect-square rounded-full bg-[#E48E83] opacity-85" />
                </div>
                <div className="w-full h-full bg-[#8E9880] relative overflow-hidden">
                  <div className="absolute top-[10%] right-[10%] w-[70%] aspect-square rounded-full bg-[#758169] opacity-85" />
                </div>
                <div className="w-full h-full bg-[#C39F8F]/40 relative overflow-hidden">
                  <div className="absolute top-[10%] left-[10%] w-[70%] aspect-square rounded-full bg-[#C39F8F] opacity-85" />
                </div>
                <div className="w-full h-full bg-[#8E9880] relative overflow-hidden">
                  <div className="absolute top-[20%] inset-x-0 h-4 bg-[#6A745E] opacity-75" />
                </div>
                <div className="w-full h-full bg-[#EFE7DC] relative overflow-hidden">
                  <div className="absolute bottom-[10%] left-[10%] w-[70%] aspect-square rounded-full bg-[#E48E83] opacity-85" />
                </div>
                <div className="w-full h-full bg-[#8E9880] relative overflow-hidden">
                  <div className="absolute bottom-[10%] right-[10%] w-[70%] aspect-square rounded-full bg-[#A2AE95] opacity-85" />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ======================================================== */}
      {/* 2. NUMBER BADGE (FOR OVERLAYS REQUIRING FLOATING BADGE)   */}
      {/* ======================================================== */}
      {hasBadge && !isIntegratedArchetype && (
        <div
          className={`absolute z-30 flex items-center justify-center font-extrabold shadow-lg transition-transform ${
            badgeShape === "circle"
              ? "w-11 h-11 rounded-full border-2 border-white/60 top-4 left-4"
              : badgeShape === "pill"
              ? "px-3.5 py-1 rounded-full border border-white/50 text-xs top-4 left-4"
              : "w-10 h-10 rounded-sm border-2 border-white/60 top-4 left-4"
          }`}
          style={{
            backgroundColor: badgeBg,
            color: badgeColor,
          }}
        >
          <span className="text-xs sm:text-sm tracking-tighter leading-none">{badgeText}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. STYLISH OVERLAY TYPOGRAPHY ARCHETYPES                 */}
      {/* ======================================================== */}
      <div className="absolute inset-0 flex flex-col justify-center items-center px-4 z-20 pointer-events-none">
        {/* ============================================================== */}
        {/* ARCHETYPE: SCRIPT & BAR (Screenshots 1 & 2)                    */}
        {/* ============================================================== */}
        {blockStyle === "script-and-bar" && (
          <div className="w-full max-w-[94%] flex flex-col items-center text-center shadow-2xl relative">
            <div className="bg-white w-full py-1 px-4 flex items-center justify-center gap-2 border-b border-black/10">
              <span
                className="text-4xl sm:text-5xl font-black tracking-tight leading-none"
                style={{
                  color: accentColor,
                  fontFamily: "Anton, Oswald, sans-serif",
                  textShadow: "1px 1px 0 #111111, -1px -1px 0 #111111, 1px -1px 0 #111111, -1px 1px 0 #111111",
                }}
              >
                {badgeText || lines[0] || "20"}
              </span>
              <span
                className="text-3xl sm:text-4xl italic font-serif leading-none text-black"
                style={{ fontFamily: "Kaushan Script, Caveat, cursive" }}
              >
                {scriptWord || lines[1] || "Trendy"}
              </span>
            </div>

            <div
              className="w-full py-2 px-3 shadow-md"
              style={{ backgroundColor: bandColor || accentColor }}
            >
              <span
                className="text-base sm:text-lg font-black text-white tracking-wide uppercase leading-tight block"
                style={{ fontFamily: "Anton, Oswald, sans-serif" }}
              >
                {lines[2] || lines[1] || "COMBAT BOOT OUTFITS"}
              </span>
            </div>

            <div className="bg-white w-full py-1.5 px-3">
              <span className="text-[10px] sm:text-[11px] font-black text-black tracking-normal uppercase leading-tight block">
                {lines[3] || lines[2] || "YOU CAN'T GET AROUND RIGHT NOW"}
              </span>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* ARCHETYPE: RULED LEAD-IN (Screenshot 4)                        */}
        {/* ============================================================== */}
        {blockStyle === "ruled-lead-in" && (
          <div className="w-full max-w-[92%] flex flex-col items-center text-center relative shadow-2xl">
            <div className="bg-white w-full py-2.5 px-3 flex flex-col items-center">
              <div className="flex items-center justify-center gap-2 w-full mb-1">
                <div className="h-[1.5px] bg-black/40 flex-1 max-w-[35px]" />
                <span className="text-xs sm:text-sm font-black tracking-tight uppercase text-black">
                  {lines[0] || "— 20 TRENDY WINTER —"}
                </span>
                <div className="h-[1.5px] bg-black/40 flex-1 max-w-[35px]" />
              </div>

              <div
                className="text-3xl sm:text-4xl font-black uppercase tracking-tight leading-none my-0.5"
                style={{
                  color: accentColor,
                  fontFamily: "Anton, Oswald, sans-serif",
                }}
              >
                {lines[1] || "OUTFIT IDEAS"}
              </div>

              {lines[3] && (
                <div
                  className="text-3xl sm:text-4xl font-black uppercase tracking-tight leading-none mb-1"
                  style={{
                    color: accentColor,
                    fontFamily: "Anton, Oswald, sans-serif",
                  }}
                >
                  {lines[2]}
                </div>
              )}

              <span className="text-[9px] sm:text-[10px] font-black text-black/90 uppercase tracking-tight max-w-[90%] leading-tight pt-0.5">
                {lines[3] || lines[2] || "YOU'LL WANT TO COPY BEFORE THE COLD REALLY HITS"}
              </span>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* ARCHETYPE: CIRCLE MEDALLION (Screenshot 5)                     */}
        {/* ============================================================== */}
        {blockStyle === "circle-medallion" && (
          <div className="flex flex-col items-center text-center space-y-2">
            <div
              className="w-48 h-48 sm:w-52 sm:h-52 rounded-full bg-white flex flex-col items-center justify-center p-3 shadow-2xl relative"
              style={{
                border: `3px solid ${accentColor}`,
                outline: "4px solid rgba(255,255,255,0.7)",
              }}
            >
              <span
                className="text-2xl sm:text-3xl font-black leading-none"
                style={{ color: accentColor }}
              >
                {badgeText || "25"}
              </span>
              <span
                className="text-xl sm:text-2xl italic font-serif leading-none text-black my-0.5"
                style={{ fontFamily: "Great Vibes, Dancing Script, cursive" }}
              >
                {scriptWord || "Pretty"}
              </span>
              <span
                className="text-base sm:text-lg font-black text-black leading-none uppercase tracking-tight"
                style={{ fontFamily: "Anton, Oswald, sans-serif" }}
              >
                {lines[2] || "BALAYAGE"}
              </span>
              <span
                className="text-xs sm:text-sm font-black leading-tight uppercase tracking-tight"
                style={{ color: accentColor }}
              >
                {lines[3] || "HAIR IDEAS"}
              </span>
              <span className="text-[8px] font-bold text-black/80 uppercase tracking-widest pt-0.5">
                {lines[4] || "TO SAVE NOW"}
              </span>
            </div>
            <div
              className="px-4 py-1 rounded-full text-white font-black text-[10px] uppercase tracking-wider shadow-lg"
              style={{ backgroundColor: accentColor }}
            >
              {ctaText || "SEE ALL THE IDEAS"}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* ARCHETYPE: MINIMALIST FLOATING CARD (Screenshot 5)             */}
        {/* ============================================================== */}
        {blockStyle === "minimalist-floating-card" && (
          <div className="bg-white/95 text-black p-5 shadow-2xl rounded-2xl w-full max-w-[85%] flex flex-col items-center text-center space-y-1.5 border border-black/5 backdrop-blur-xs">
            <span className="text-[8px] sm:text-[9px] uppercase tracking-widest font-bold text-black/60 font-mono">
              {kicker || "FASHION & STYLE EDIT"}
            </span>
            <span
              className="text-2xl sm:text-3xl italic font-serif leading-none"
              style={{ color: accentColor, fontFamily: "Great Vibes, Dancing Script, cursive" }}
            >
              {scriptWord || "Chic"}
            </span>
            <span className="text-sm sm:text-base font-black font-serif tracking-tight text-black leading-snug">
              {lines[2] || lines[1] || "Capsule Wardrobe Essentials"}
            </span>
          </div>
        )}

        {/* ============================================================== */}
        {/* ARCHETYPE: BIG CAPS BAND (Screenshot 6)                        */}
        {/* ============================================================== */}
        {blockStyle === "big-caps-band" && (
          <div className="bg-white text-black p-4 shadow-2xl rounded-none w-full max-w-[92%] flex flex-col items-center text-center space-y-1 border border-black/10">
            <div className="flex items-center justify-center gap-3 w-full">
              <span
                className="text-5xl sm:text-6xl font-black tracking-tighter leading-none"
                style={{ fontFamily: "Anton, Oswald, sans-serif" }}
              >
                {badgeText || lines[0] || "19"}
              </span>
              <div className="flex flex-col items-start text-left">
                <span className="text-xs sm:text-sm font-black tracking-widest uppercase text-black">
                  {lines[1] || "SMALL"}
                </span>
                <span
                  className="text-2xl sm:text-3xl font-black uppercase tracking-tight leading-none text-black"
                  style={{ fontFamily: "Anton, Oswald, sans-serif" }}
                >
                  {lines[2] || "APARTMENT"}
                </span>
              </div>
            </div>
            <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-black/80 pt-1 border-t border-black/10 w-full">
              {lines[3] || "PATIOS TO MAXIMIZE SPACE"}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* ARCHETYPE: OLIVE CIRCLE & DISTRESSED (Screenshot 6)            */}
        {/* ============================================================== */}
        {blockStyle === "olive-circle-distressed" && (
          <div className="bg-white text-black p-3.5 shadow-2xl rounded-none w-full max-w-[92%] flex flex-col items-center text-center space-y-1.5 border border-black/10">
            <div className="flex items-center justify-center gap-2.5 w-full">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-black text-2xl text-white shadow-md shrink-0"
                style={{ backgroundColor: accentColor || "#5A6B48" }}
              >
                {badgeText || "21"}
              </div>
              <span
                className="text-2xl sm:text-3xl font-black uppercase tracking-tight leading-none text-black"
                style={{ fontFamily: "Anton, Oswald, sans-serif" }}
              >
                {lines[1] || "CLEVER"}
              </span>
            </div>
            <div
              className="text-base sm:text-lg font-black uppercase tracking-tight leading-none"
              style={{ color: accentColor || "#5A6B48", fontFamily: "Anton, Oswald, sans-serif" }}
            >
              {lines[2] || "COOL IDEAS FOR"}
            </div>
            <div
              className="text-lg sm:text-xl font-black uppercase tracking-tight leading-none text-black"
              style={{ fontFamily: "Anton, Oswald, sans-serif" }}
            >
              {lines[3] || "SMALL PATIOS"}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* ARCHETYPE: COLOR STRIPS (Screenshots 6 & 7)                    */}
        {/* ============================================================== */}
        {blockStyle === "color-strips" && (
          <div className="w-full max-w-[94%] flex flex-col shadow-2xl">
            <div className="bg-[#F6EFE9] py-1.5 px-3 flex items-center justify-center gap-2">
              {badgeText && (
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-black text-white"
                  style={{ backgroundColor: accentColor || "#5C3D28" }}
                >
                  {badgeText}
                </span>
              )}
              <span className="text-[11px] sm:text-xs font-black uppercase tracking-wide text-black">
                {lines[0] || lines[1] || "WAYS TO USE"}
              </span>
            </div>
            <div
              className="py-2 px-3 text-center shadow-inner"
              style={{ backgroundColor: bandColor || "#2D5A3A" }}
            >
              <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-white block">
                {lines[1] || lines[2] || "ROSEMARY OIL FOR"}
              </span>
            </div>
            <div className="bg-[#F6EFE9] py-1.5 px-3 text-center">
              <span className="text-xs sm:text-sm font-black uppercase tracking-wide text-black block">
                {lines[2] || lines[3] || "HAIR GROWTH"}
              </span>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* ARCHETYPE: RUST BAND (Screenshot 7)                            */}
        {/* ============================================================== */}
        {blockStyle === "rust-band" && (
          <div
            className="w-full py-4 px-4 shadow-2xl text-center space-y-1"
            style={{ backgroundColor: bandColor || "#C05A2B" }}
          >
            <span
              className="text-lg sm:text-xl font-black uppercase tracking-tight text-white block leading-tight"
              style={{ fontFamily: "Anton, Oswald, sans-serif" }}
            >
              {lines[0] || "TRANSFORM YOUR"}
            </span>
            <span
              className="text-lg sm:text-xl font-black uppercase tracking-tight text-black block leading-tight"
              style={{ fontFamily: "Anton, Oswald, sans-serif" }}
            >
              {lines[1] || "KITCHEN WITH"}
            </span>
            <span
              className="text-lg sm:text-xl font-black uppercase tracking-tight text-white block leading-tight"
              style={{ fontFamily: "Anton, Oswald, sans-serif" }}
            >
              {lines[2] || "UPCYCLED PALLETS"}
            </span>
          </div>
        )}

        {/* ============================================================== */}
        {/* ARCHETYPE: ROUNDED HEADLINE CARD (Screenshot 8)                */}
        {/* ============================================================== */}
        {blockStyle === "rounded-headline-card" && (
          <div className="bg-white text-black p-4 rounded-2xl shadow-2xl w-full max-w-[85%] flex flex-col items-center text-center space-y-1 relative border border-black/10">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm text-white shadow-md absolute -top-4.5 inset-x-0 mx-auto"
              style={{ backgroundColor: accentColor || "#E91E63" }}
            >
              {badgeText || "25"}
            </div>
            <div className="pt-2">
              <span
                className="text-2xl italic font-serif leading-none"
                style={{ color: accentColor || "#E91E63", fontFamily: "Great Vibes, Dancing Script, cursive" }}
              >
                {scriptWord || "Stunning"}
              </span>
            </div>
            <div
              className="text-base sm:text-lg font-black uppercase tracking-tight leading-tight text-black"
              style={{ fontFamily: "Anton, Oswald, sans-serif" }}
            >
              {lines[1] || lines[2] || "BALAYAGE HAIR COLOR IDEAS"}
            </div>
            <div className="text-[9px] font-black uppercase tracking-wide text-black/70">
              {lines[3] || "FOR LONG LAYERED HAIR"}
            </div>
            <div
              className="px-4 py-1 rounded-full text-white font-black text-[10px] uppercase tracking-wider shadow-md mt-1"
              style={{ backgroundColor: accentColor || "#E91E63" }}
            >
              {ctaText || "GET THE IDEAS"}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* ARCHETYPE: MAGAZINE DARK CARD (Screenshot 8)                   */}
        {/* ============================================================== */}
        {blockStyle === "magazine-dark-card" && (
          <div className="flex flex-col items-center w-full max-w-[88%] space-y-2">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-black text-base text-black shadow-lg"
              style={{ backgroundColor: accentColor || "#EAB308" }}
            >
              {badgeText || "25"}
            </div>
            <div className="bg-[#1F2937ee] text-white p-4 rounded-xs shadow-2xl w-full text-center space-y-1 border border-white/10 backdrop-blur-xs">
              <span
                className="text-2xl italic font-serif leading-none block"
                style={{ color: accentColor || "#EAB308", fontFamily: "Great Vibes, cursive" }}
              >
                {scriptWord || "Dreamy"}
              </span>
              <span
                className="text-lg sm:text-xl font-black uppercase tracking-tight leading-none text-white block"
                style={{ fontFamily: "Anton, Oswald, sans-serif" }}
              >
                {lines[1] || "BALAYAGE"}
              </span>
              <span
                className="text-sm font-black uppercase tracking-tight leading-none text-white block"
                style={{ fontFamily: "Anton, Oswald, sans-serif" }}
              >
                {lines[2] || "HAIR COLOR IDEAS"}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider block" style={{ color: accentColor || "#EAB308" }}>
                {lines[3] || "FOR LONG LAYERED HAIR"}
              </span>
              <div className="pt-1.5 flex justify-center">
                <span className="px-3.5 py-0.5 rounded-full bg-white text-black font-black text-[9px] uppercase tracking-wider shadow-sm">
                  {ctaText || "SEE ALL THE LOOKS"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* ARCHETYPE: NAVY BAND SERIF (Screenshot 8)                      */}
        {/* ============================================================== */}
        {blockStyle === "navy-band-serif" && (
          <div className="bg-[#0F172A] text-white p-3.5 shadow-2xl w-full max-w-[94%] flex flex-col items-center text-center space-y-1 border-t-2 border-b-2 border-white/20">
            <div className="flex items-center justify-center gap-2">
              <span className="px-1.5 py-0.5 rounded bg-red-600 text-white font-mono text-[10px] font-bold">
                {badgeText || "12"}
              </span>
              <span
                className="text-xl italic font-serif leading-none text-pink-400"
                style={{ fontFamily: "Great Vibes, cursive" }}
              >
                {scriptWord || "Dreamy"}
              </span>
            </div>
            <span className="text-sm sm:text-base font-black font-serif tracking-tight text-white uppercase leading-snug">
              {lines[1] || lines[2] || "BUCKET LIST PLACES TO VISIT"}
            </span>
            <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400">
              {lines[3] || "THE ULTIMATE 2026 TRAVEL GUIDE"}
            </span>
          </div>
        )}

        {/* ============================================================== */}
        {/* ARCHETYPE: FRAMED DOUBLE BORDER CARD (Screenshot 9)            */}
        {/* ============================================================== */}
        {blockStyle === "framed-double-border-card" && (
          <div
            className="p-4 shadow-2xl w-full max-w-[85%] flex flex-col items-center text-center space-y-1 relative"
            style={{
              backgroundColor: bandColor || "#6B4423",
              border: "3px solid #FFFFFF",
              outline: "1px solid rgba(255,255,255,0.4)",
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl font-black font-serif text-white">
                {badgeText || "41"}
              </span>
              <span
                className="text-2xl italic font-serif text-white leading-none"
                style={{ fontFamily: "Great Vibes, cursive" }}
              >
                {scriptWord || "Farmhouse"}
              </span>
            </div>
            <span
              className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white leading-none"
              style={{ fontFamily: "Anton, Oswald, sans-serif" }}
            >
              {lines[1] || lines[2] || "BEDROOM"}
            </span>
            <span className="text-sm font-serif italic text-white/90">
              {lines[2] || lines[3] || "Decor Ideas"}
            </span>
          </div>
        )}

        {/* ============================================================== */}
        {/* ARCHETYPE: BIG COLOUR CIRCLE (Screenshot 9)                    */}
        {/* ============================================================== */}
        {blockStyle === "big-colour-circle" && (
          <div
            className="w-52 h-52 sm:w-56 sm:h-56 rounded-full flex flex-col items-center justify-center p-4 text-center shadow-2xl"
            style={{
              backgroundColor: bandColor || "#B83B5E",
              border: "3px solid #FFFFFF",
              outline: "4px solid rgba(255,255,255,0.5)",
            }}
          >
            <span
              className="text-3xl font-black leading-none mb-1"
              style={{ color: accentColor || "#22D3EE" }}
            >
              {badgeText || "40"}
            </span>
            <span
              className="text-base sm:text-lg font-black uppercase tracking-tight leading-tight"
              style={{ color: accentColor || "#22D3EE", fontFamily: "Anton, Oswald, sans-serif" }}
            >
              {lines[1] || "STUNNING"}
            </span>
            <span
              className="text-sm sm:text-base font-black uppercase tracking-tight leading-tight"
              style={{ color: accentColor || "#22D3EE", fontFamily: "Anton, Oswald, sans-serif" }}
            >
              {lines[2] || "TV UNIT"}
            </span>
            <span
              className="text-xs sm:text-sm font-black uppercase tracking-wide leading-tight"
              style={{ color: accentColor || "#22D3EE", fontFamily: "Anton, Oswald, sans-serif" }}
            >
              {lines[3] || "MODERN DESIGNS"}
            </span>
          </div>
        )}

        {/* ============================================================== */}
        {/* ARCHETYPE: NEON FRAMED CARD (Screenshot 9)                     */}
        {/* ============================================================== */}
        {blockStyle === "neon-framed-card" && (
          <div
            className="p-4 rounded-xs shadow-2xl w-full max-w-[85%] flex flex-col items-center text-center space-y-1 relative"
            style={{
              backgroundColor: bandColor || "#0F172A",
              border: `3px solid ${accentColor || "#A3E635"}`,
              boxShadow: `0 0 15px ${accentColor || "#A3E635"}40`,
            }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm absolute -top-4 inset-x-0 mx-auto shadow-md"
              style={{
                backgroundColor: accentColor || "#A3E635",
                color: bandColor || "#0F172A",
              }}
            >
              {badgeText || "25"}
            </div>
            <div className="pt-2">
              <span
                className="text-xl sm:text-2xl font-black uppercase tracking-tight leading-none block"
                style={{ color: accentColor || "#A3E635", fontFamily: "Anton, Oswald, sans-serif" }}
              >
                {lines[1] || "COASTAL"}
              </span>
              <span
                className="text-xl sm:text-2xl font-black uppercase tracking-tight leading-none block"
                style={{ color: accentColor || "#A3E635", fontFamily: "Anton, Oswald, sans-serif" }}
              >
                {lines[2] || "BEDROOM"}
              </span>
            </div>
            <span
              className="text-lg italic font-serif leading-none"
              style={{ color: "#38BDF8", fontFamily: "Great Vibes, cursive" }}
            >
              {scriptWord || "Ideas"}
            </span>
          </div>
        )}

        {/* ============================================================== */}
        {/* ARCHETYPE: TILTED RIBBON CARD (Screenshot 10)                  */}
        {/* ============================================================== */}
        {blockStyle === "tilted-ribbon-card" && (
          <div className="bg-[#FBF7F0] text-black p-4 shadow-2xl rounded-none w-full max-w-[92%] flex flex-col items-center text-center space-y-1 relative border border-black/10">
            <div
              className="px-3 py-0.5 text-white font-black text-[9px] uppercase tracking-wider absolute -top-3 left-4 transform -rotate-3 shadow-md"
              style={{ backgroundColor: accentColor || "#DC2626" }}
            >
              {kicker || "MUST-TRY"}
            </div>
            <div className="flex items-center justify-center gap-2 pt-1">
              <span
                className="text-4xl font-black tracking-tighter leading-none text-black"
                style={{ fontFamily: "Anton, Oswald, sans-serif" }}
              >
                {badgeText || "25"}
              </span>
              <div className="flex flex-col items-start text-left">
                <span
                  className="text-base sm:text-lg font-black uppercase tracking-tight leading-none"
                  style={{ color: accentColor || "#DC2626", fontFamily: "Anton, Oswald, sans-serif" }}
                >
                  {lines[1] || "BALAYAGE"}
                </span>
                <span
                  className="text-sm font-black uppercase tracking-tight leading-none text-black"
                  style={{ fontFamily: "Anton, Oswald, sans-serif" }}
                >
                  {lines[2] || "HAIR IDEAS"}
                </span>
              </div>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-black/70">
              {lines[3] || "FOR LONG LAYERED HAIR"}
            </span>
            <div className="pt-1">
              <span className="px-3 py-0.5 rounded-full bg-black text-white font-black text-[9px] uppercase tracking-wider shadow-xs">
                {ctaText || "GET THE IDEAS"}
              </span>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* PINFORGE ORIGINAL 1: LUXURY LINEN & GILDED SEAL               */}
        {/* ============================================================== */}
        {blockStyle === "forge-linen-gold" && (
          <div className="bg-[#FDFBF7] text-[#111111] p-5 shadow-2xl rounded-xs w-full max-w-[88%] flex flex-col items-center text-center space-y-2 border-2 border-[#D4AF37] relative">
            <span className="text-[9px] uppercase tracking-widest font-bold text-[#064E3B] font-mono">
              {kicker || "MAISON DE BEAUTÉ"}
            </span>
            <div className="w-10 h-10 rounded-full border-2 border-[#D4AF37] bg-white flex items-center justify-center font-black font-serif text-sm text-[#111111] shadow-xs">
              {badgeText || "50"}
            </div>
            <span
              className="text-2xl italic font-serif leading-none text-[#D4AF37]"
              style={{ fontFamily: "Playfair Display, Great Vibes, cursive" }}
            >
              {scriptWord || "Timeless"}
            </span>
            <span className="text-base sm:text-lg font-black font-serif uppercase tracking-tight text-[#111111] leading-tight">
              {lines[2] || lines[3] || "HAUTE COUTURE LOOKS"}
            </span>
            <span className="text-[8px] font-bold uppercase tracking-widest text-black/60">
              {lines[3] || lines[4] || "THE DEFINITIVE LUXURY CAPSULE 2026"}
            </span>
          </div>
        )}

        {/* ============================================================== */}
        {/* PINFORGE ORIGINAL 2: CYBER NOIR HOLOGRAPHIC GLOW               */}
        {/* ============================================================== */}
        {blockStyle === "forge-cyber-noir" && (
          <div
            className="p-4 rounded-xs shadow-2xl w-full max-w-[88%] flex flex-col items-center text-center space-y-1 relative"
            style={{
              backgroundColor: "#09090Bee",
              border: "2px solid #06B6D4",
              boxShadow: "0 0 20px rgba(6,182,212,0.4), inset 0 0 15px rgba(236,72,153,0.2)",
            }}
          >
            <div className="flex items-center justify-between w-full border-b border-[#06B6D4]/30 pb-1">
              <span className="text-[9px] font-mono font-bold tracking-widest text-[#06B6D4]">
                {kicker || "2026 DROPS"}
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#06B6D4] text-black">
                {badgeText || "35+"}
              </span>
            </div>
            <span
              className="text-xl sm:text-2xl font-black uppercase tracking-tight leading-none text-white pt-1"
              style={{ fontFamily: "Anton, Oswald, sans-serif" }}
            >
              {lines[2] || "STREETWEAR AESTHETIC"}
            </span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#EC4899]">
              {lines[3] || "TRENDS DOMINATING TOKYO & NYC"}
            </span>
          </div>
        )}

        {/* ============================================================== */}
        {/* PINFORGE ORIGINAL 3: PROVENCE LAVENDER & BOTANICAL CREST       */}
        {/* ============================================================== */}
        {blockStyle === "forge-provence-lavender" && (
          <div className="bg-[#FDF4FF] text-[#1E1B4B] p-4 shadow-2xl rounded-2xl w-full max-w-[88%] flex flex-col items-center text-center space-y-1.5 border border-[#E9D5FF]">
            <span className="text-[8px] uppercase tracking-widest font-bold text-[#8B5CF6] font-mono">
              {kicker || "FRENCH LIVING"}
            </span>
            <span
              className="text-2xl italic font-serif leading-none text-[#8B5CF6]"
              style={{ fontFamily: "Great Vibes, cursive" }}
            >
              {scriptWord || "Charming"}
            </span>
            <span className="text-base font-black font-serif uppercase tracking-tight text-[#1E1B4B] leading-tight">
              {lines[2] || "PROVENCE BEDROOMS"}
            </span>
            <span className="text-[9px] font-serif italic text-black/70">
              {lines[3] || "RUSTIC SOUTHERN FRANCE ELEGANCE"}
            </span>
          </div>
        )}

        {/* ============================================================== */}
        {/* ARCHETYPE: LUXE HAIR — STEPPED BOXES & ITALIC PILLS            */}
        {/* ============================================================== */}
        {blockStyle === "luxe-stepped-boxes" && (
          <div className="flex flex-col items-center text-center space-y-1.5 w-full max-w-[92%]">
            <div className="bg-white text-black px-4 py-0.5 rounded-none shadow-md border border-black/5">
              <span className="text-2xl sm:text-3xl font-black font-serif tracking-tight leading-none">
                {badgeText || lines[0] || "50"}
              </span>
            </div>

            <div className="space-y-1 flex flex-col items-center">
              <div className="bg-white text-black px-3 py-0.5 shadow-sm rounded-none">
                <span className="text-xs sm:text-sm font-black font-serif tracking-normal leading-tight uppercase">
                  {lines[1] || "MEDIUM LENGTH"}
                </span>
              </div>
              <div className="bg-white text-black px-3 py-0.5 shadow-sm rounded-none">
                <span className="text-xs sm:text-sm font-black font-serif tracking-normal leading-tight uppercase">
                  {lines[2] || "HAIRSTYLE IDEAS"}
                </span>
              </div>
            </div>

            <div className="space-y-1 flex flex-col items-center pt-0.5">
              <div className="bg-[#EFE6DB] text-[#222222] px-3.5 py-0.5 rounded-full shadow-xs border border-[#DFD5C8]">
                <span className="text-[11px] sm:text-xs font-medium font-serif italic tracking-tight">
                  {lines[3] || "That Work for"}
                </span>
              </div>
              <div className="bg-[#EFE6DB] text-[#222222] px-3.5 py-0.5 rounded-full shadow-xs border border-[#DFD5C8]">
                <span className="text-[11px] sm:text-xs font-medium font-serif italic tracking-tight">
                  {lines[4] || "Every Hair Type"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* ARCHETYPE: LUXE HAIR — STACKED CAPS, OVER 50                   */}
        {/* ============================================================== */}
        {blockStyle === "luxe-stacked-over-50" && (
          <div className="flex flex-col items-center text-center space-y-1.5 w-full max-w-[92%]">
            <div className="bg-white text-black px-4 py-0.5 shadow-md border border-black/5">
              <span className="text-2xl sm:text-3xl font-black font-serif tracking-tight leading-none">
                {badgeText || lines[0] || "50"}
              </span>
            </div>

            <div className="bg-white text-black px-3.5 py-0.5 shadow-sm">
              <span className="text-xs sm:text-sm font-black font-serif tracking-normal uppercase">
                {lines[1] || "SHORT"}
              </span>
            </div>
            <div className="bg-white text-black px-3.5 py-0.5 shadow-sm">
              <span className="text-xs sm:text-sm font-black font-serif tracking-normal uppercase">
                {lines[2] || "HAIRSTYLES"}
              </span>
            </div>

            <span className="text-[11px] font-serif italic text-black/90 font-medium">
              {lines[3] || "for Women"}
            </span>

            <div className="bg-[#EFE6DB] text-black px-4 py-0.5 shadow-xs border border-[#DFD5C8]">
              <span className="text-xs sm:text-sm font-black font-serif tracking-wider uppercase">
                {lines[4] || "OVER 50"}
              </span>
            </div>

            <span className="text-[10px] font-serif italic text-black/80 font-medium">
              {lines[5] || "That Look"}
            </span>

            <div className="bg-white text-black px-3 py-0.5 shadow-sm">
              <span className="text-[11px] sm:text-xs font-black font-serif tracking-normal uppercase">
                {lines[6] || "ABSOLUTELY MODERN"}
              </span>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* ARCHETYPE: LUXE HAIR — BLACK NUMBER BOX & TRENDY TAG           */}
        {/* ============================================================== */}
        {blockStyle === "luxe-black-boxes" && (
          <div className="flex flex-col items-center text-center space-y-1.5 w-full max-w-[92%]">
            <div className="bg-black text-white px-4 py-1 shadow-lg border border-white/20">
              <span className="text-2xl sm:text-3xl font-black font-serif tracking-tight leading-none">
                {badgeText || lines[0] || "50"}
              </span>
            </div>

            <div className="bg-white text-black px-3 py-0.5 shadow-xs">
              <span className="text-[10px] font-bold tracking-widest uppercase">
                {lines[1] || "- TRENDY -"}
              </span>
            </div>

            <div className="bg-white text-black px-5 py-1 shadow-md w-full max-w-[80%]">
              <span
                className="text-2xl sm:text-3xl font-black tracking-tighter leading-none block uppercase"
                style={{ fontFamily: "Anton, sans-serif" }}
              >
                {lines[2] || "SHORT"}
              </span>
            </div>

            <div className="bg-white text-black px-3 py-0.5 shadow-xs">
              <span className="text-[11px] font-bold tracking-wider uppercase">
                {lines[3] || "— HAIRSTYLES —"}
              </span>
            </div>

            <div className="bg-black text-white px-4 py-0.5 shadow-md">
              <span className="text-xs sm:text-sm font-black tracking-widest uppercase">
                {lines[4] || "IDEAS"}
              </span>
            </div>

            <div className="bg-white text-black px-3 py-0.5 shadow-xs">
              <span className="text-[10px] font-bold tracking-wider uppercase">
                {lines[5] || "FOR EVERY WOMAN"}
              </span>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* ARCHETYPE: VIRAL PIN — CIRCLE BADGE & SCRIPT                   */}
        {/* ============================================================== */}
        {blockStyle === "viral-badge-script" && (
          <div className="bg-white text-black p-3.5 shadow-2xl rounded-none w-full max-w-[88%] flex flex-col items-center text-center space-y-1.5 border border-black/5">
            <div className="flex items-center justify-center gap-2.5 w-full">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center font-black text-xl text-white shadow-md shrink-0"
                style={{ backgroundColor: badgeBg || accentColor }}
              >
                <span className="leading-none">{badgeText || "32"}</span>
              </div>
              <span
                className="text-2xl sm:text-3xl italic font-serif leading-none text-black"
                style={{ fontFamily: "Great Vibes, Dancing Script, cursive" }}
              >
                {scriptWord || "Chic"}
              </span>
            </div>

            <div
              className="text-2xl sm:text-3xl font-black tracking-tight leading-none uppercase"
              style={{
                color: accentColor,
                fontFamily: "Anton, Oswald, sans-serif",
              }}
            >
              {lines[2] || "MUSHROOM"}
            </div>

            <div className="text-[11px] sm:text-xs font-black text-black leading-tight tracking-tight uppercase max-w-[95%]">
              {lines[3] || "BROWN HAIR IDEAS YOU'LL LOVE"}
            </div>

            <div className="text-[8px] sm:text-[9px] text-black/70 tracking-widest font-semibold uppercase pt-0.5 border-t border-black/10 w-full">
              {lines[4] || "EASY LOOKS TO SHOW YOUR STYLIST"}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* ARCHETYPE: VIRAL PIN — HUGE NUMBER & CTA                       */}
        {/* ============================================================== */}
        {blockStyle === "viral-grid-cta" && (
          <div className="w-full max-w-[92%] flex flex-col items-center space-y-1.5">
            <div className="flex items-center justify-center gap-2">
              <span
                className="text-5xl font-black tracking-tighter leading-none"
                style={{
                  color: accentColor || "#C92A2A",
                  fontFamily: "Anton, Oswald, sans-serif",
                }}
              >
                {badgeText || "58"}
              </span>
              <span
                className="text-3xl sm:text-4xl italic font-serif leading-none text-black drop-shadow-xs"
                style={{ fontFamily: "Great Vibes, Dancing Script, cursive" }}
              >
                {scriptWord || "Gorgeous"}
              </span>
            </div>

            <div
              className="text-lg sm:text-xl font-black uppercase tracking-tight text-center"
              style={{
                color: accentColor || "#C92A2A",
                fontFamily: "Anton, Oswald, sans-serif",
              }}
            >
              {lines[2] || "SHORT HOLIDAY"}
            </div>

            <div className="bg-white text-black p-2 shadow-md rounded-none text-center w-full max-w-[85%]">
              <span className="text-[10px] sm:text-[11px] font-bold leading-tight block uppercase">
                {lines[3] || "HAIRSTYLES FOR WOMEN WITH BOBS AND PIXIES"}
              </span>
            </div>

            <div
              className="px-4 py-1.5 rounded-full shadow-lg text-white font-black text-[11px] tracking-wider uppercase transition-transform hover:scale-105"
              style={{ backgroundColor: accentColor || "#C92A2A" }}
            >
              {ctaText || "GET THE IDEAS"}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* ARCHETYPE: WHITE BLOCKS                                        */}
        {/* ============================================================== */}
        {blockStyle === "white-blocks" && (
          <div className="space-y-1 flex flex-col items-center w-full max-w-[90%]">
            {lines.map((line, idx) => (
              <span
                key={idx}
                className="px-3 py-0.5 text-xs sm:text-sm font-black shadow-md rounded-[2px] uppercase tracking-tight"
                style={{
                  backgroundColor: bandColor !== "#FFFFFF" ? bandColor : "#FFFFFF",
                  color: idx === 1 || idx === 2 ? accentColor : "#111111",
                  fontFamily: primaryFont,
                }}
              >
                {line}
              </span>
            ))}
          </div>
        )}

        {/* ============================================================== */}
        {/* ARCHETYPE: BLACK BOXES                                         */}
        {/* ============================================================== */}
        {blockStyle === "black-boxes" && (
          <div className="space-y-1 flex flex-col items-center w-full max-w-[90%]">
            {lines.map((line, idx) => (
              <span
                key={idx}
                className="px-3 py-0.5 text-xs sm:text-sm font-black shadow-lg rounded-[2px] uppercase tracking-wide"
                style={{
                  backgroundColor: bandColor !== "#FFFFFF" ? bandColor : "#111111",
                  color: idx === 1 ? accentColor : "#FFFFFF",
                  fontFamily: primaryFont,
                }}
              >
                {line}
              </span>
            ))}
          </div>
        )}

        {/* ============================================================== */}
        {/* ARCHETYPE: COLOR BAND CARD                                     */}
        {/* ============================================================== */}
        {blockStyle === "color-band-card" && (
          <div className="bg-white text-black p-3.5 shadow-2xl rounded-none w-full max-w-[90%] flex flex-col items-center text-center space-y-1.5 border-t-2 border-b-2 border-black/10">
            <div className="flex items-center justify-between w-full border-b border-black/10 pb-1">
              <span
                className="text-[9px] uppercase tracking-widest font-black"
                style={{ color: accentColor }}
              >
                {kicker}
              </span>
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                style={{ backgroundColor: badgeBg }}
              >
                {badgeText}
              </span>
            </div>

            <div
              className="text-base sm:text-lg font-black tracking-tight leading-tight uppercase"
              style={{ color: "#111111", fontFamily: primaryFont }}
            >
              {lines.slice(0, 3).join(" ")}
            </div>

            <div
              className="px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-xs"
              style={{ backgroundColor: accentColor }}
            >
              {ctaText}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* ARCHETYPE: MAGAZINE EDITORIAL                                  */}
        {/* ============================================================== */}
        {blockStyle === "magazine-editorial" && (
          <div className="bg-[#FFFFFFf2] text-black p-4 shadow-2xl rounded-xs w-full max-w-[88%] flex flex-col items-center text-center space-y-2 border border-black/15 backdrop-blur-xs">
            <div className="w-full flex items-center justify-between border-b border-black/15 pb-1 text-[8px] font-bold tracking-widest uppercase text-black/70 font-mono">
              <span>{kicker}</span>
              <span>ISSUE #{badgeText || "01"}</span>
            </div>

            <div
              className="text-sm sm:text-base font-black font-serif leading-snug tracking-tight uppercase"
              style={{ color: "#111111" }}
            >
              {lines.slice(0, 3).join(" ")}
            </div>

            <div className="w-8 h-[2px] rounded-full" style={{ backgroundColor: accentColor }} />

            <div className="text-[9px] font-serif italic text-black/80">
              {lines[3] || "Exclusive Guide & Ideas"}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* ARCHETYPE: FRAMED CARD                                         */}
        {/* ============================================================== */}
        {blockStyle === "framed-card" && (
          <div
            className="mx-auto w-[90%] p-3.5 rounded-xl border-2 border-white shadow-2xl flex flex-col items-center text-center backdrop-blur-xs transition-colors"
            style={{
              backgroundColor: bandColor !== "#FFFFFF" ? bandColor : "#1F1A17ee",
            }}
          >
            <span
              className="text-[9px] uppercase tracking-widest font-bold mb-1"
              style={{ color: accentColor }}
            >
              {kicker}
            </span>
            <div
              className="text-xs sm:text-sm font-black leading-snug uppercase tracking-tight"
              style={{
                fontFamily: primaryFont,
                color: "#FFFFFF",
              }}
            >
              {lines.join(" ")}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* ARCHETYPE: SCRIPT ACCENT                                       */}
        {/* ============================================================== */}
        {blockStyle === "script-accent" && (
          <div className="bg-white/95 text-black p-3.5 shadow-xl rounded-none w-full max-w-[88%] flex flex-col items-center text-center space-y-1 border border-black/10">
            <span
              className="text-2xl sm:text-3xl italic font-serif leading-none"
              style={{
                color: accentColor,
                fontFamily: "Great Vibes, Dancing Script, cursive",
              }}
            >
              {scriptWord}
            </span>
            <span
              className="text-xs sm:text-sm font-black uppercase tracking-tight"
              style={{
                fontFamily: primaryFont,
                color: "#111111",
              }}
            >
              {lines.slice(0, 3).join(" ")}
            </span>
          </div>
        )}

        {/* ============================================================== */}
        {/* ARCHETYPE: BRUSH BANNER                                        */}
        {/* ============================================================== */}
        {blockStyle === "brush-banner" && (
          <div className="flex flex-col items-center text-center space-y-1.5 w-full max-w-[90%]">
            <div
              className="text-xs sm:text-sm font-black uppercase tracking-tight drop-shadow-md bg-white text-black px-3 py-1 shadow-sm"
              style={{ fontFamily: primaryFont }}
            >
              {lines.slice(0, 2).join(" ")}
            </div>
            <div
              className="px-4 py-1 font-black text-xs rounded-xs shadow-md transform -rotate-1 border border-black/10 text-white"
              style={{
                backgroundColor: accentColor,
                fontFamily: primaryFont,
              }}
            >
              {lines[2] || scriptWord || "TRENDS 2026"}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* ARCHETYPE: STICKER OUTLINE                                     */}
        {/* ============================================================== */}
        {blockStyle === "sticker-outline" && (
          <div className="flex flex-col items-center text-center space-y-1 w-full max-w-[90%]">
            {lines.map((line, idx) => (
              <span
                key={idx}
                className="text-xs sm:text-sm font-black uppercase tracking-tight px-2 py-0.5"
                style={{
                  color: idx === 1 ? accentColor : "#FFFFFF",
                  textShadow:
                    "2px 2px 0 #111111, -2px -2px 0 #111111, 2px -2px 0 #111111, -2px 2px 0 #111111, 0 3px 6px rgba(0,0,0,0.8)",
                  fontFamily: primaryFont,
                }}
              >
                {line}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 4. FOOTER WEBSITE WATERMARK */}
      {/* ======================================================== */}
      {showWebsite && (
        <div className="absolute bottom-2 inset-x-0 flex justify-center z-20">
          <span className="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-black/60 text-white/90 backdrop-blur-xs border border-white/10">
            {website}
          </span>
        </div>
      )}
    </div>
  );
}
