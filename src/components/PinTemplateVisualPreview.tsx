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
  ],
  homedecor: [
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
  ],
  fashion: [
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=600&q=80",
  ],
  food: [
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
  ],
  outdoor: [
    "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
  ],
  lifestyle: [
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
  ],
};

export function PinTemplateVisualPreview({
  template,
  className = "",
  showWebsite = true,
}: {
  template: TemplatePreviewData;
  className?: string;
  showWebsite?: boolean;
}) {
  const layout = template.layoutId || "single";
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
    return defaultPhotos[idx] || defaultPhotos[0];
  };

  // Typography & Styling Overrides
  const primaryFont = template.customFont || template.fonts?.[0] || "Montserrat, sans-serif";
  const accentColor = template.customAccentColor || config.accentColor || template.colors?.[1] || "#EE1A5B";
  const bandColor = template.customBandColor || config.bandColor || "#FFFFFF";
  const blockStyle = config.blockStyle || "clean-overlay";

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
    blockStyle === "viral-grid-cta";

  return (
    <div
      className={`relative w-full aspect-[2/3] overflow-hidden rounded-xl bg-slate-950 select-none shadow-md ${className}`}
      style={{ fontFamily: primaryFont }}
    >
      {/* ======================================================== */}
      {/* 1. PHOTO COLLAGE OR SIGNATURE GEOMETRIC ARTWORK */}
      {/* ======================================================== */}
      <div className="absolute inset-0 pointer-events-none">
        {/* If user uploaded images, render photo collage */}
        {hasCustomImages ? (
          <>
            {layout === "single" && (
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${getPhoto(0)})` }}
              >
                <div className="w-full h-full bg-gradient-to-t from-black/85 via-black/35 to-black/30" />
              </div>
            )}
            {layout === "two-side" && (
              <div className="w-full h-full grid grid-cols-2 gap-[2px] bg-white/20">
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
            {layout === "grid-2x2" && (
              <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-[2px] bg-white/20">
                {[0, 1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${getPhoto(idx)})` }}
                  />
                ))}
              </div>
            )}
            {layout.startsWith("band-") && (
              <div className="w-full h-full flex flex-col">
                <div className="h-[40%] grid grid-cols-2 gap-[2px]">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${getPhoto(0)})` }}
                  />
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${getPhoto(1)})` }}
                  />
                </div>
                <div
                  className="h-[25%] w-full flex items-center justify-center p-2 relative shadow-md z-10"
                  style={{ backgroundColor: bandColor }}
                />
                <div className="h-[35%] grid grid-cols-2 gap-[2px]">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${getPhoto(2)})` }}
                  />
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${getPhoto(3)})` }}
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          /* Signature AutoPinDesign Abstract Geometric Backdrop (Screenshot Exact Reproduction) */
          <div className="w-full h-full flex">
            {/* Left Column: Warm Beige (#EFE7DC) + Coral Top Sun (#E48E83) + Clay Bottom Moon (#C39F8F) */}
            <div className="w-1/2 h-full bg-[#EFE7DC] relative overflow-hidden border-r border-white/60">
              <div className="absolute top-[8%] left-[10%] w-[75%] aspect-square rounded-full bg-[#E48E83] opacity-90 shadow-xs" />
              <div className="absolute bottom-[8%] left-[10%] w-[75%] aspect-square rounded-full bg-[#C39F8F] opacity-90 shadow-xs" />
            </div>

            {/* Right Column: Olive Sage Green (#8E9880) + Olive Top Sun (#758169) + Dark Band + Sage Moss Moon (#A2AE95) */}
            <div className="w-1/2 h-full bg-[#8E9880] relative overflow-hidden">
              <div className="absolute top-[8%] right-[10%] w-[75%] aspect-square rounded-full bg-[#758169] opacity-85 shadow-xs" />
              <div className="absolute top-[48%] inset-x-0 h-9 bg-[#6A745E] opacity-75" />
              <div className="absolute bottom-[8%] right-[10%] w-[75%] aspect-square rounded-full bg-[#A2AE95] opacity-85 shadow-xs" />
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 2. NUMBER BADGE (FOR GENERIC OVERLAYS) */}
      {/* ======================================================== */}
      {hasBadge && !isIntegratedArchetype && (
        <div
          className={`absolute z-30 flex items-center justify-center font-extrabold shadow-lg transition-transform ${
            layout.startsWith("band-")
              ? "top-[32%] left-1/2 -translate-x-1/2 -translate-y-1/2"
              : layout === "grid-2x2"
              ? "top-[28%] left-1/2 -translate-x-1/2 -translate-y-1/2"
              : "top-4 left-4"
          } ${
            badgeShape === "circle"
              ? "w-11 h-11 rounded-full border-2 border-white/60"
              : badgeShape === "pill"
              ? "px-3 py-1 rounded-full border border-white/50 text-xs"
              : "w-10 h-10 rounded-sm border-2 border-white/60"
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
      {/* 3. OVERLAY TEXT STYLING ARCHETYPES */}
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
            {/* Top Number in White Box */}
            <div className="bg-white text-black px-4 py-0.5 shadow-md border border-black/5">
              <span className="text-2xl sm:text-3xl font-black font-serif tracking-tight leading-none">
                {badgeText || lines[0] || "50"}
              </span>
            </div>

            {/* Stepped White Caps */}
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

            {/* Italic Accent */}
            <span className="text-[11px] font-serif italic text-black/90 font-medium">
              {lines[3] || "for Women"}
            </span>

            {/* Beige Highlight Pill */}
            <div className="bg-[#EFE6DB] text-black px-4 py-0.5 shadow-xs border border-[#DFD5C8]">
              <span className="text-xs sm:text-sm font-black font-serif tracking-wider uppercase">
                {lines[4] || "OVER 50"}
              </span>
            </div>

            {/* Italic Subline */}
            <span className="text-[10px] font-serif italic text-black/80 font-medium">
              {lines[5] || "That Look"}
            </span>

            {/* Bottom White Box */}
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
            {/* Top Number in SOLID BLACK BOX */}
            <div className="bg-black text-white px-4 py-1 shadow-lg border border-white/20">
              <span className="text-2xl sm:text-3xl font-black font-serif tracking-tight leading-none">
                {badgeText || lines[0] || "50"}
              </span>
            </div>

            {/* Tag with Dashes */}
            <div className="bg-white text-black px-3 py-0.5 shadow-xs">
              <span className="text-[10px] font-bold tracking-widest uppercase">
                {lines[1] || "- TRENDY -"}
              </span>
            </div>

            {/* Giant White Box with Bold Condensed Text */}
            <div className="bg-white text-black px-5 py-1 shadow-md w-full max-w-[80%]">
              <span
                className="text-2xl sm:text-3xl font-black tracking-tighter leading-none block uppercase"
                style={{ fontFamily: "Anton, sans-serif" }}
              >
                {lines[2] || "SHORT"}
              </span>
            </div>

            {/* Divider Subtitle */}
            <div className="bg-white text-black px-3 py-0.5 shadow-xs">
              <span className="text-[11px] font-bold tracking-wider uppercase">
                {lines[3] || "— HAIRSTYLES —"}
              </span>
            </div>

            {/* Black Box: IDEAS */}
            <div className="bg-black text-white px-4 py-0.5 shadow-md">
              <span className="text-xs sm:text-sm font-black tracking-widest uppercase">
                {lines[4] || "IDEAS"}
              </span>
            </div>

            {/* White Box: FOR EVERY WOMAN */}
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
            {/* Top Row: Giant Circular Badge + Flowing Script */}
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

            {/* Large Bold Keyword in Accent Color */}
            <div
              className="text-2xl sm:text-3xl font-black tracking-tight leading-none uppercase"
              style={{
                color: accentColor,
                fontFamily: "Anton, Oswald, sans-serif",
              }}
            >
              {lines[2] || "MUSHROOM"}
            </div>

            {/* Description Text */}
            <div className="text-[11px] sm:text-xs font-black text-black leading-tight tracking-tight uppercase max-w-[95%]">
              {lines[3] || "BROWN HAIR IDEAS YOU'LL LOVE"}
            </div>

            {/* Tracked Small Caps Kicker */}
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
            {/* Top Row: Huge Number + Script Word */}
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

            {/* Bold Red Keyword */}
            <div
              className="text-lg sm:text-xl font-black uppercase tracking-tight text-center"
              style={{
                color: accentColor || "#C92A2A",
                fontFamily: "Anton, Oswald, sans-serif",
              }}
            >
              {lines[2] || "SHORT HOLIDAY"}
            </div>

            {/* White Description Card */}
            <div className="bg-white text-black p-2 shadow-md rounded-none text-center w-full max-w-[85%]">
              <span className="text-[10px] sm:text-[11px] font-bold leading-tight block uppercase">
                {lines[3] || "HAIRSTYLES FOR WOMEN WITH BOBS AND PIXIES"}
              </span>
            </div>

            {/* Red Pill CTA Button */}
            <div
              className="px-4 py-1.5 rounded-full shadow-lg text-white font-black text-[11px] tracking-wider uppercase transition-transform hover:scale-105"
              style={{ backgroundColor: accentColor || "#C92A2A" }}
            >
              {ctaText || "GET THE IDEAS"}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* ARCHETYPE 6: WHITE BLOCKS (Standard AutoPinDesign)             */}
        {/* ============================================================== */}
        {blockStyle === "white-blocks" && (
          <div className="space-y-1 flex flex-col items-center">
            {lines.map((line, idx) => (
              <span
                key={idx}
                className={`px-2.5 py-0.5 text-xs sm:text-sm ${
                  isBold ? "font-black" : "font-semibold"
                } ${letterSpacing} ${isUppercase ? "uppercase" : ""} ${
                  isItalic ? "italic" : ""
                } shadow-sm rounded-[2px] transition-colors`}
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
        {/* ARCHETYPE 7: BLACK BOXES (Standard AutoPinDesign)             */}
        {/* ============================================================== */}
        {blockStyle === "black-boxes" && (
          <div className="space-y-1 flex flex-col items-start pl-2">
            {lines.map((line, idx) => (
              <span
                key={idx}
                className={`px-2.5 py-0.5 text-xs sm:text-sm ${
                  isBold ? "font-black" : "font-semibold"
                } ${letterSpacing} ${isUppercase ? "uppercase" : ""} ${
                  isItalic ? "italic" : ""
                } shadow-md rounded-[2px] transition-colors`}
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
        {/* ARCHETYPE 8: FRAMED CARD (Standard AutoPinDesign)              */}
        {/* ============================================================== */}
        {blockStyle === "framed-card" && (
          <div
            className="mx-auto w-[90%] p-3.5 rounded-xl border-2 border-white/80 shadow-2xl flex flex-col items-center text-center backdrop-blur-xs transition-colors"
            style={{
              backgroundColor: bandColor !== "#FFFFFF" ? bandColor : "#1F1A17ee",
            }}
          >
            <span
              className="text-[9px] uppercase tracking-widest font-semibold mb-1"
              style={{ color: accentColor }}
            >
              {kicker}
            </span>
            <div
              className={`text-xs sm:text-sm ${
                isBold ? "font-black" : "font-semibold"
              } leading-snug ${isUppercase ? "uppercase" : ""} ${
                isItalic ? "italic" : ""
              } ${letterSpacing}`}
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
        {/* ARCHETYPE 9: SCRIPT ACCENT + BOLD (Standard AutoPinDesign)     */}
        {/* ============================================================== */}
        {blockStyle === "script-accent" && (
          <div className="flex flex-col items-center text-center space-y-0.5">
            <span
              className="text-base sm:text-xl italic font-serif leading-none"
              style={{
                color: accentColor,
                fontFamily: "Great Vibes, Dancing Script, serif",
              }}
            >
              {scriptWord}
            </span>
            <span
              className={`text-xs sm:text-sm ${
                isBold ? "font-black" : "font-semibold"
              } ${isUppercase ? "uppercase" : ""} ${letterSpacing} drop-shadow-md`}
              style={{
                fontFamily: primaryFont,
                color: customTextColor || "#FFFFFF",
              }}
            >
              {lines.slice(0, 3).join(" ")}
            </span>
          </div>
        )}

        {/* ============================================================== */}
        {/* ARCHETYPE 10: CLEAN OVERLAY / FALLBACK                         */}
        {/* ============================================================== */}
        {(blockStyle === "band-split" || blockStyle === "clean-overlay") && (
          <div className="flex flex-col items-center text-center px-2">
            <div
              className={`text-xs sm:text-sm ${
                isBold ? "font-black" : "font-semibold"
              } ${isUppercase ? "uppercase" : ""} leading-tight ${letterSpacing} drop-shadow-md`}
              style={{
                color: customTextColor
                  ? customTextColor
                  : layout.startsWith("band-")
                  ? bandColor === "#FFFFFF" || bandColor === "#F5EFE6"
                    ? "#111111"
                    : "#FFFFFF"
                  : "#FFFFFF",
                fontFamily: primaryFont,
              }}
            >
              {lines.join(" ")}
            </div>
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
