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
  const photos = NICHE_PHOTOS[photoTheme] || NICHE_PHOTOS.lifestyle;

  const primaryFont = template.fonts?.[0] || "Montserrat, sans-serif";
  const accentColor = config.accentColor || template.colors?.[1] || "#EE1A5B";
  const bandColor = config.bandColor || "#FFFFFF";
  const blockStyle = config.blockStyle || "clean-overlay";
  const badge = config.badge;

  // Split headline lines
  const lines = template.layerTexts && template.layerTexts.length > 0
    ? template.layerTexts.slice(0, 4)
    : (template.headlinePreview || template.name).split(" ").slice(0, 4);

  return (
    <div
      className={`relative w-full aspect-[2/3] overflow-hidden rounded-xl bg-slate-950 select-none shadow-md ${className}`}
      style={{ fontFamily: primaryFont }}
    >
      {/* ======================================================== */}
      {/* 1. PHOTO COLLAGE LAYOUTS */}
      {/* ======================================================== */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Layout: Single Photo */}
        {layout === "single" && (
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${photos[0]})` }}
          >
            <div className="w-full h-full bg-gradient-to-t from-black/85 via-black/35 to-black/30" />
          </div>
        )}

        {/* Layout: Grid 2x2 */}
        {layout === "grid-2x2" && (
          <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-[2px] bg-white/20">
            {photos.slice(0, 4).map((img, i) => (
              <div
                key={i}
                className="w-full h-full bg-cover bg-center relative"
                style={{ backgroundImage: `url(${img})` }}
              >
                <div className="absolute inset-0 bg-black/30" />
              </div>
            ))}
          </div>
        )}

        {/* Layout: Band 2-2 (2 Top + Center Band + 2 Bottom) */}
        {layout === "band-2-2" && (
          <div className="w-full h-full flex flex-col">
            <div className="h-[38%] grid grid-cols-2 gap-[2px]">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${photos[0]})` }}
              />
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${photos[1]})` }}
              />
            </div>
            <div
              className="h-[28%] w-full flex items-center justify-center p-2 relative shadow-md z-10"
              style={{ backgroundColor: bandColor }}
            />
            <div className="h-[34%] grid grid-cols-2 gap-[2px]">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${photos[2]})` }}
              />
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${photos[3]})` }}
              />
            </div>
          </div>
        )}

        {/* Layout: Band 2-3 (2 Top + Center Band + 3 Bottom) */}
        {layout === "band-2-3" && (
          <div className="w-full h-full flex flex-col">
            <div className="h-[38%] grid grid-cols-2 gap-[2px]">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${photos[0]})` }}
              />
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${photos[1]})` }}
              />
            </div>
            <div
              className="h-[28%] w-full flex items-center justify-center p-2 relative shadow-md z-10"
              style={{ backgroundColor: bandColor }}
            />
            <div className="h-[34%] grid grid-cols-3 gap-[2px]">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${photos[2]})` }}
              />
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${photos[3]})` }}
              />
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${photos[0]})` }}
              />
            </div>
          </div>
        )}

        {/* Layout: Band 1-1 (1 Top + Center Band + 1 Bottom) */}
        {layout === "band-1-1" && (
          <div className="w-full h-full flex flex-col">
            <div
              className="h-[40%] w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${photos[0]})` }}
            />
            <div
              className="h-[26%] w-full flex items-center justify-center p-2 relative shadow-md z-10"
              style={{ backgroundColor: bandColor }}
            />
            <div
              className="h-[34%] w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${photos[1]})` }}
            />
          </div>
        )}

        {/* Layout: Two Side (2 Columns) */}
        {layout === "two-side" && (
          <div className="w-full h-full grid grid-cols-2 gap-[2px] bg-white/20">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${photos[0]})` }}
            />
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${photos[1]})` }}
            />
          </div>
        )}

        {/* Layout: Two Stack (2 Rows) */}
        {layout === "two-stack" && (
          <div className="w-full h-full grid grid-rows-2 gap-[2px] bg-white/20">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${photos[0]})` }}
            />
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${photos[1]})` }}
            />
          </div>
        )}

        {/* Fallback for other layouts: split hero */}
        {layout !== "single" &&
          layout !== "grid-2x2" &&
          layout !== "band-2-2" &&
          layout !== "band-2-3" &&
          layout !== "band-1-1" &&
          layout !== "two-side" &&
          layout !== "two-stack" && (
            <div className="w-full h-full flex flex-col">
              <div
                className="h-[60%] w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${photos[0]})` }}
              />
              <div className="h-[40%] grid grid-cols-2 gap-[2px]">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${photos[1]})` }}
                />
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${photos[2]})` }}
                />
              </div>
            </div>
          )}
      </div>

      {/* ======================================================== */}
      {/* 2. NUMBER BADGE (CIRCLE / SQUARE / PILL) */}
      {/* ======================================================== */}
      {badge && (
        <div
          className={`absolute z-30 flex items-center justify-center font-extrabold shadow-lg transition-transform ${
            layout.startsWith("band-")
              ? "top-[32%] left-1/2 -translate-x-1/2 -translate-y-1/2"
              : layout === "grid-2x2"
              ? "top-[28%] left-1/2 -translate-x-1/2 -translate-y-1/2"
              : "top-4 left-4"
          } ${
            badge.shape === "circle"
              ? "w-11 h-11 rounded-full border-2 border-white/60"
              : badge.shape === "pill"
              ? "px-3 py-1 rounded-full border border-white/50 text-xs"
              : "w-10 h-10 rounded-sm border-2 border-white/60"
          }`}
          style={{
            backgroundColor: badge.bg,
            color: badge.color,
          }}
        >
          <span className="text-xs sm:text-sm tracking-tighter leading-none">
            {badge.text}
          </span>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. OVERLAY TEXT STYLING ARCHETYPES */}
      {/* ======================================================== */}
      <div
        className={`absolute inset-0 flex flex-col justify-center px-4 z-20 pointer-events-none ${
          layout.startsWith("band-") ? "pt-[6%]" : ""
        }`}
      >
        {/* A. WHITE BLOCKS (e.g. hb-bronde-blocks, hb-fall-blocks) */}
        {blockStyle === "white-blocks" && (
          <div className="space-y-1 flex flex-col items-center">
            {lines.map((line, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 text-xs sm:text-sm font-black tracking-tight uppercase shadow-sm rounded-[2px]"
                style={{
                  backgroundColor: "#FFFFFF",
                  color: idx === 1 || idx === 2 ? accentColor : "#111111",
                  fontFamily: primaryFont,
                }}
              >
                {line}
              </span>
            ))}
          </div>
        )}

        {/* B. BLACK BOXES (e.g. ctr-fp-black-boxes-left) */}
        {blockStyle === "black-boxes" && (
          <div className="space-y-1 flex flex-col items-start pl-2">
            {lines.map((line, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 text-xs sm:text-sm font-black tracking-tight uppercase shadow-md rounded-[2px]"
                style={{
                  backgroundColor: "#111111",
                  color: idx === 1 ? accentColor : "#FFFFFF",
                  fontFamily: primaryFont,
                }}
              >
                {line}
              </span>
            ))}
          </div>
        )}

        {/* C. FRAMED CARD / TEXT PANEL (e.g. cv-framed-box, tr-fashion-capsule-arch) */}
        {blockStyle === "framed-card" && (
          <div
            className="mx-auto w-[90%] p-3.5 rounded-xl border-2 border-white/80 shadow-2xl flex flex-col items-center text-center backdrop-blur-xs"
            style={{
              backgroundColor: bandColor !== "#FFFFFF" ? bandColor : "#1F1A17ee",
            }}
          >
            <span className="text-[9px] uppercase tracking-widest text-slate-300 font-semibold mb-1">
              {template.primaryCategory || "IDEAS & INSPO"}
            </span>
            <div
              className="text-white text-xs sm:text-sm font-black leading-snug uppercase tracking-tight"
              style={{ fontFamily: primaryFont }}
            >
              {lines.join(" ")}
            </div>
          </div>
        )}

        {/* D. SCRIPT ACCENT + BOLD SERIF (e.g. tr-fashion-capsule-arch, blog-736-five-band) */}
        {blockStyle === "script-accent" && (
          <div className="flex flex-col items-center text-center space-y-0.5">
            <span
              className="text-base sm:text-lg italic font-serif leading-none"
              style={{
                color: accentColor,
                fontFamily: "Playfair Display, serif",
              }}
            >
              {config.scriptWord || "Chic"}
            </span>
            <span
              className="text-xs sm:text-sm font-black uppercase text-white tracking-tight drop-shadow-md"
              style={{ fontFamily: primaryFont }}
            >
              {lines.slice(0, 3).join(" ")}
            </span>
          </div>
        )}

        {/* E. BRUSH BANNER (e.g. hb-chic-teal-brush) */}
        {blockStyle === "brush-banner" && (
          <div className="flex flex-col items-center text-center space-y-1.5">
            <div
              className="text-xs sm:text-sm font-black uppercase tracking-tight text-white drop-shadow-lg"
              style={{ fontFamily: primaryFont }}
            >
              {lines.slice(0, 2).join(" ")}
            </div>
            <div
              className="px-3.5 py-1 bg-white text-slate-900 font-bold text-[11px] rounded-xs shadow-md transform -rotate-1 border border-slate-300"
              style={{ color: accentColor }}
            >
              {lines[2] || "TRENDS 2026"}
            </div>
          </div>
        )}

        {/* F. NEON GLOW / STICKER OUTLINE (e.g. hb-chic-teal-brush, hb-sticker-serif) */}
        {(blockStyle === "glow" || blockStyle === "sticker-outline") && (
          <div className="flex flex-col items-center text-center space-y-1">
            {lines.map((line, idx) => (
              <span
                key={idx}
                className="text-xs sm:text-sm font-black tracking-tight uppercase"
                style={{
                  color: idx === 1 ? accentColor : "#FFFFFF",
                  textShadow:
                    blockStyle === "glow"
                      ? `0 0 12px ${accentColor}`
                      : "2px 2px 0 #111111, -2px -2px 0 #111111, 2px -2px 0 #111111, -2px 2px 0 #111111",
                  fontFamily: primaryFont,
                }}
              >
                {line}
              </span>
            ))}
          </div>
        )}

        {/* G. BAND SPLIT / CLEAN OVERLAY (Default) */}
        {(blockStyle === "band-split" || blockStyle === "clean-overlay") && (
          <div className="flex flex-col items-center text-center px-2">
            <div
              className="text-xs sm:text-sm font-black uppercase leading-tight tracking-tight drop-shadow-md"
              style={{
                color: layout.startsWith("band-")
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
            yourwebsite.com
          </span>
        </div>
      )}
    </div>
  );
}
