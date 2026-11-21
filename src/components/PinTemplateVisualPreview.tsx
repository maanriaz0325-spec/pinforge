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
  const badgeText = template.customBadgeText || defaultBadge?.text || "50";
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
  const kicker = template.customKicker || template.primaryCategory || "IDEAS & INSPO";
  const scriptWord = template.customScriptWord || config.scriptWord || "Chic";
  const ctaText = template.customCtaText || config.ctaText || "GET THE IDEAS";
  const website = template.customWebsite || "pinforge.app";

  // Font styling options
  const isUppercase = template.fontStyle?.uppercase !== false;
  const isBold = template.fontStyle?.bold !== false;
  const isItalic = template.fontStyle?.italic === true;
  const letterSpacing = template.fontStyle?.letterSpacing || "tracking-tight";
  const customTextColor = template.customTextColor;

  // Determines whether the integrated archetype handles the badge inline
  const isIntegratedArchetype =
    blockStyle === "luxe-stepped-boxes" ||
    blockStyle === "luxe-stacked-over-50" ||
    blockStyle === "luxe-black-boxes" ||
    blockStyle === "viral-badge-script" ||
    blockStyle === "viral-grid-cta" ||
    blockStyle === "color-band-card";

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
        {/* ARCHETYPE 1: LUXE HAIR — STEPPED BOXES & ITALIC PILLS (Card 1) */}
        {/* ============================================================== */}
        {blockStyle === "luxe-stepped-boxes" && (
          <div className="flex flex-col items-center text-center space-y-1.5 w-full max-w-[92%]">
            {/* Top Number in White Box */}
            <div className="bg-white text-black px-4 py-0.5 rounded-none shadow-md border border-black/5">
              <span className="text-2xl sm:text-3xl font-black font-serif tracking-tight leading-none">
                {badgeText || lines[0] || "50"}
              </span>
            </div>

            {/* Stepped White Highlight Boxes */}
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

            {/* Beige Italic Pills */}
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
        {/* ARCHETYPE 2: LUXE HAIR — STACKED CAPS, ITALIC OVER 50 (Card 2) */}
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
        {/* ARCHETYPE 3: LUXE HAIR — BLACK NUMBER BOX & TRENDY TAG (Card 3)*/}
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
        {/* ARCHETYPE 4: VIRAL PIN — CIRCLE BADGE, SCRIPT & KEYWORD (Card 4 & 6) */}
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
        {/* ARCHETYPE 5: VIRAL PIN — HUGE RED NUMBER, SCRIPT & CTA (Card 5) */}
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
        {/* ARCHETYPE 6: WHITE BLOCKS (e.g. hb-bronde-blocks)              */}
        {/* ============================================================== */}
        {blockStyle === "white-blocks" && (
          <div className="space-y-1 flex flex-col items-center w-full max-w-[90%]">
            {lines.map((line, idx) => (
              <span
                key={idx}
                className="px-3 py-0.5 text-xs sm:text-sm font-black shadow-md rounded-[2px] uppercase tracking-tight"
                style={{
                  backgroundColor: bandColor !== "#FFFFFF" ? bandColor : "#FFFFFF",
                  color: customTextColor
                    ? customTextColor
                    : idx === 1 || idx === 2
                    ? accentColor
                    : "#111111",
                  fontFamily: primaryFont,
                }}
              >
                {line}
              </span>
            ))}
          </div>
        )}

        {/* ============================================================== */}
        {/* ARCHETYPE 7: BLACK BOXES (e.g. ctr-fp-black-boxes-left)        */}
        {/* ============================================================== */}
        {blockStyle === "black-boxes" && (
          <div className="space-y-1 flex flex-col items-center w-full max-w-[90%]">
            {lines.map((line, idx) => (
              <span
                key={idx}
                className="px-3 py-0.5 text-xs sm:text-sm font-black shadow-lg rounded-[2px] uppercase tracking-wide"
                style={{
                  backgroundColor: bandColor !== "#FFFFFF" ? bandColor : "#111111",
                  color: customTextColor ? customTextColor : idx === 1 ? accentColor : "#FFFFFF",
                  fontFamily: primaryFont,
                }}
              >
                {line}
              </span>
            ))}
          </div>
        )}

        {/* ============================================================== */}
        {/* ARCHETYPE 8: COLOR BAND CARD (e.g. High CTR Band Pin)          */}
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
              style={{ color: customTextColor || "#111111", fontFamily: primaryFont }}
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
        {/* ARCHETYPE 9: MAGAZINE EDITORIAL (e.g. pm-mag-cover, luxury)    */}
        {/* ============================================================== */}
        {blockStyle === "magazine-editorial" && (
          <div className="bg-[#FFFFFFf2] text-black p-4 shadow-2xl rounded-xs w-full max-w-[88%] flex flex-col items-center text-center space-y-2 border border-black/15 backdrop-blur-xs">
            <div className="w-full flex items-center justify-between border-b border-black/15 pb-1 text-[8px] font-bold tracking-widest uppercase text-black/70 font-mono">
              <span>{kicker}</span>
              <span>ISSUE #{badgeText || "01"}</span>
            </div>

            <div
              className="text-sm sm:text-base font-black font-serif leading-snug tracking-tight uppercase"
              style={{ color: customTextColor || "#111111" }}
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
        {/* ARCHETYPE 10: FRAMED CARD (e.g. cv-framed-box)                 */}
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
                color: customTextColor || "#FFFFFF",
              }}
            >
              {lines.join(" ")}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* ARCHETYPE 11: SCRIPT ACCENT + BOLD SERIF                       */}
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
                color: customTextColor || "#111111",
              }}
            >
              {lines.slice(0, 3).join(" ")}
            </span>
          </div>
        )}

        {/* ============================================================== */}
        {/* ARCHETYPE 12: BRUSH BANNER                                     */}
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
        {/* ARCHETYPE 13: STICKER OUTLINE                                  */}
        {/* ============================================================== */}
        {blockStyle === "sticker-outline" && (
          <div className="flex flex-col items-center text-center space-y-1 w-full max-w-[90%]">
            {lines.map((line, idx) => (
              <span
                key={idx}
                className="text-xs sm:text-sm font-black uppercase tracking-tight px-2 py-0.5"
                style={{
                  color: customTextColor
                    ? customTextColor
                    : idx === 1
                    ? accentColor
                    : "#FFFFFF",
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
