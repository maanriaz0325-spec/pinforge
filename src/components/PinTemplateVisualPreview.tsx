"use client";

import React from "react";

export interface ImageSlotAdjustment {
  url?: string;
  zoom?: number; // 1 to 2.5
  panX?: number; // -50% to +50%
  panY?: number; // -50% to +50%
  fit?: "cover" | "contain" | "fill";
  brightness?: number; // 50 to 150
  contrast?: number; // 50 to 150
  saturation?: number; // 0 to 200
  rotation?: number; // 0, 90, 180, 270
}

export interface TextLayerAdjustment {
  id: string;
  text: string;
  role: "badge" | "title" | "subtitle" | "website" | "cta" | "kicker";
  fontFamily?: string;
  fontWeight?: string;
  fontSizePx?: number;
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
  isStrikethrough?: boolean;
  isUppercase?: boolean;
  textAlign?: "left" | "center" | "right";
  color?: string;
  bgHighlight?: string;
  outlineColor?: string;
  outlineWidth?: number;
  shape?: "circle" | "rounded" | "square" | "pill" | "none";
  containerShape?: "circle" | "rounded" | "square" | "pill" | "none";
  position?: "top-left" | "center-top" | "over-band" | "over-image";
  visible?: boolean;
  letterSpacing?: string;
  lineHeight?: number;
  opacity?: number;
  rotation?: number;
  textShadow?: boolean;
  shadowColor?: string;
}

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
  collagePattern?: string;
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
  customBadgeColor?: string;
  customBadgeText?: string;
  customBadgeShape?: string;
  customBadgePosition?: "top-left" | "center-top" | "over-band" | "over-image";
  customLines?: string[];
  customKicker?: string;
  customScriptWord?: string;
  customCtaText?: string;
  customWebsite?: string;
  showWebsite?: boolean;
  fontStyle?: {
    uppercase?: boolean;
    bold?: boolean;
    italic?: boolean;
    letterSpacing?: string;
  };
  // Overlay Placement Overrides:
  overlayVerticalPosition?: "top" | "upper-center" | "center" | "lower-center" | "bottom";
  overlayOffsetY?: number; // 10 to 85 (%)
  overlayHorizontalAlign?: "left" | "center" | "right";
  // Design Tab overrides:
  canvasRatio?: "2:3" | "3:4" | "4:5" | "9:16" | "1:1" | "1:2" | "custom";
  customWidth?: number;
  customHeight?: number;
  bgType?: "solid" | "gradient" | "image" | "transparent";
  bgColor?: string;
  bgGradientStart?: string;
  bgGradientEnd?: string;
  borderColor?: string;
  borderWidth?: number;
  cornerRadius?: number;
  collageGap?: number;
  snapToElements?: boolean;
  // Images Tab overrides (per slot):
  slotAdjustments?: Record<number, ImageSlotAdjustment>;
  onSlotClick?: (slotIndex: number) => void;
  // Text Tab overrides (per word/layer):
  customTextLayers?: TextLayerAdjustment[];
  onLayerClick?: (layerId: string) => void;
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
  showWebsite: propShowWebsite,
}: {
  template: TemplatePreviewData;
  className?: string;
  showWebsite?: boolean;
}) {
  const layout = template.layoutId || "two-side";
  const imageCount = resolveImageCount(template.layoutId, template.imageCount);
  const collagePattern = template.collagePattern || "default";
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
  const badgeLayer = template.customTextLayers?.find((l) => l.role === "badge") || template.customTextLayers?.[0];
  const defaultBadge = config.badge;
  const hasBadge = Boolean(defaultBadge || template.customBadgeText || badgeLayer?.text);
  const badgeText = template.customBadgeText || badgeLayer?.text || defaultBadge?.text || "20";
  const badgeBg = template.customBadgeBg || badgeLayer?.bgHighlight || defaultBadge?.bg || accentColor;
  const badgeColor = template.customBadgeColor || badgeLayer?.color || defaultBadge?.color || "#FFFFFF";
  const badgeShape = template.customBadgeShape || badgeLayer?.shape || defaultBadge?.shape || "circle";
  const badgePosition = template.customBadgePosition || badgeLayer?.position || "top-left";

  // Website watermark configuration
  const websiteLayer = template.customTextLayers?.find(
    (l) => l.role === "website" || l.id === "layer-website"
  );
  const hasWebsiteInLayers = template.customTextLayers !== undefined
    ? Boolean(websiteLayer && websiteLayer.visible !== false && websiteLayer.text && websiteLayer.text.trim() !== "")
    : true;

  const showWebsite =
    template.showWebsite !== undefined
      ? Boolean(template.showWebsite && hasWebsiteInLayers)
      : propShowWebsite !== undefined
      ? Boolean(propShowWebsite && hasWebsiteInLayers)
      : hasWebsiteInLayers;

  const website =
    (websiteLayer && websiteLayer.text) ||
    template.customWebsite ||
    (template.customTextLayers ? "" : "pinforge.app");

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

  // Resolve aspect ratio class or style
  const effectiveRatio = template.canvasRatio || template.aspectRatio || "2:3";
  const aspectClass =
    effectiveRatio === "1:2"
      ? "aspect-[1/2]"
      : effectiveRatio === "9:16"
      ? "aspect-[9/16]"
      : effectiveRatio === "1:1"
      ? "aspect-square"
      : effectiveRatio === "4:5"
      ? "aspect-[4/5]"
      : effectiveRatio === "3:4"
      ? "aspect-[3/4]"
      : "aspect-[2/3]";

  // Dynamic Background Style
  const bgType = template.bgType || "solid";
  const bgStyle: React.CSSProperties = {};
  if (bgType === "gradient") {
    bgStyle.backgroundImage = `linear-gradient(135deg, ${template.bgGradientStart || "#EE1A5B"}, ${template.bgGradientEnd || "#8B5CF6"})`;
  } else if (bgType === "transparent") {
    bgStyle.backgroundColor = "transparent";
  } else if (bgType === "solid" && template.bgColor) {
    bgStyle.backgroundColor = template.bgColor;
  } else {
    bgStyle.backgroundColor = "#0b0f19";
  }

  // Frame Border & Corner Radius
  const borderWidth = template.borderWidth ?? 0;
  const borderColor = template.borderColor || "#FFFFFF";
  const cornerRadius = template.cornerRadius ?? 12;
  const collageGap = template.collageGap !== undefined ? template.collageGap : 2;

  // Single Slot Renderer (handles per-slot photo, zoom, pan, brightness, contrast, rotation, fit)
  const renderSlot = (idx: number, fallbackBg?: string) => {
    const slotAdj = template.slotAdjustments?.[idx];
    const userImg = slotAdj?.url || (template.customImages && template.customImages[idx]) || (hasCustomImages && userImages[idx]) || (hasCustomImages && userImages[0]);
    const activeImg = userImg || (hasCustomImages ? getPhoto(idx) : null);

    if (activeImg) {
      const zoom = slotAdj?.zoom ?? 1;
      const panX = slotAdj?.panX ?? 0;
      const panY = slotAdj?.panY ?? 0;
      const rotation = slotAdj?.rotation ?? 0;
      const brightness = slotAdj?.brightness ?? 100;
      const contrast = slotAdj?.contrast ?? 100;
      const saturation = slotAdj?.saturation ?? 100;
      const fit = slotAdj?.fit || "cover";

      return (
        <div
          className="relative w-full h-full overflow-hidden bg-slate-900 group/slot cursor-pointer select-none"
          onClick={() => template.onSlotClick?.(idx)}
        >
          <img
            src={activeImg}
            alt={`Slot ${idx + 1}`}
            className="w-full h-full pointer-events-none transition-transform duration-75"
            style={{
              objectFit: fit,
              transform: `scale(${zoom}) translate(${panX}%, ${panY}%) rotate(${rotation}deg)`,
              filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
            }}
          />
          {template.onSlotClick && (
            <div className="absolute inset-0 bg-red-600/10 opacity-0 group-hover/slot:opacity-100 transition-opacity border border-red-500/50 pointer-events-none flex items-center justify-center">
              <span className="text-[10px] bg-black/75 px-1.5 py-0.5 rounded text-white font-mono">
                Slot {idx + 1}
              </span>
            </div>
          )}
        </div>
      );
    }

    // Abstract geometric placeholder matching screenshot
    return (
      <div
        className={`relative w-full h-full overflow-hidden ${fallbackBg || "bg-[#EFE7DC]"} flex items-center justify-center cursor-pointer select-none`}
        onClick={() => template.onSlotClick?.(idx)}
      >
        <div className="w-16 sm:w-20 aspect-square rounded-full bg-[#E48E83] opacity-80" />
      </div>
    );
  };

  // Helper to extract layer adjustment if customized by user
  const getLayer = (idx: number) => {
    if (template.customTextLayers && template.customTextLayers[idx]) {
      return template.customTextLayers[idx];
    }
    return null;
  };

  // Dynamic Overlay Placement
  const overlayOffsetY = template.overlayOffsetY !== undefined ? template.overlayOffsetY : (
    template.overlayVerticalPosition === "top" ? 22 :
    template.overlayVerticalPosition === "upper-center" ? 36 :
    template.overlayVerticalPosition === "lower-center" ? 64 :
    template.overlayVerticalPosition === "bottom" ? 78 : 50
  );

  const overlayHAlign = template.overlayHorizontalAlign || "center";
  const alignClass =
    overlayHAlign === "left" ? "items-start text-left pl-3" :
    overlayHAlign === "right" ? "items-end text-right pr-3" :
    "items-center text-center";

  // Floating position groups for any detached layers
  const topLeftLayers = (template.customTextLayers || []).filter(
    (l) => l.position === "top-left" && l.visible !== false
  );
  const centerTopLayers = (template.customTextLayers || []).filter(
    (l) => l.position === "center-top" && l.visible !== false
  );
  const overImageLayers = (template.customTextLayers || []).filter(
    (l) => l.position === "over-image" && l.visible !== false
  );

  // Helper to render detached/floating or extra custom layers
  const renderCustomLayerElement = (layer: TextLayerAdjustment) => {
    if (layer.visible === false) return null;
    const font = layer.fontFamily || primaryFont;
    const color = layer.color || "#FFFFFF";
    const bg = layer.bgHighlight && layer.bgHighlight !== "transparent" ? layer.bgHighlight : undefined;

    let weight: string | number = 700;
    if (layer.fontWeight) {
      if (layer.fontWeight === "Black") weight = 900;
      else if (layer.fontWeight === "ExtraBold") weight = 800;
      else if (layer.fontWeight === "Bold") weight = 700;
      else if (layer.fontWeight === "SemiBold") weight = 600;
      else if (layer.fontWeight === "Medium") weight = 500;
      else if (layer.fontWeight === "Regular") weight = 400;
      else weight = layer.fontWeight;
    } else if (layer.isBold !== undefined) {
      weight = layer.isBold ? 700 : 400;
    }

    const size = layer.fontSizePx ? `${layer.fontSizePx}px` : "16px";
    const isItalic = Boolean(layer.isItalic);
    const isUnderline = Boolean(layer.isUnderline);
    const isStrikethrough = Boolean(layer.isStrikethrough);
    const isUppercase = layer.isUppercase !== false;
    const textAlign = layer.textAlign || "center";
    const letterSpacing = layer.letterSpacing || "normal";
    const lineHeight = layer.lineHeight || 1.15;
    const opacity = layer.opacity !== undefined ? layer.opacity : 1;
    const rotation = layer.rotation ? `rotate(${layer.rotation}deg)` : undefined;
    const shadow = layer.textShadow && layer.shadowColor ? `0 2px 4px ${layer.shadowColor}` : undefined;

    const shape = layer.shape || layer.containerShape;
    let shapeClass = "";
    if (shape === "circle") {
      shapeClass = "rounded-full aspect-square min-w-[38px] min-h-[38px] inline-flex items-center justify-center p-2 border-2 border-white/80 shadow-xl";
    } else if (shape === "pill") {
      shapeClass = "rounded-full px-4 py-1.5 inline-flex items-center justify-center border-2 border-white/80 shadow-xl";
    } else if (shape === "rounded") {
      shapeClass = "rounded-xl px-3 py-2 inline-flex items-center justify-center border-2 border-white/80 shadow-xl";
    } else if (shape === "square") {
      shapeClass = "rounded-none aspect-square min-w-[38px] min-h-[38px] inline-flex items-center justify-center p-2 border-2 border-white/80 shadow-xl";
    }

    return (
      <div
        key={layer.id}
        onClick={() => template.onLayerClick?.(layer.id)}
        className={`${shapeClass} cursor-pointer select-none transition-all hover:scale-105 pointer-events-auto shadow-2xl`}
        style={{
          fontFamily: font,
          color: color,
          backgroundColor: bg || (shape && shape !== "none" ? (accentColor || "#EE1A5B") : undefined),
          fontWeight: weight,
          fontSize: size,
          fontStyle: isItalic ? "italic" : "normal",
          textDecoration: isUnderline ? "underline" : isStrikethrough ? "line-through" : "none",
          textTransform: isUppercase ? "uppercase" : "none",
          textAlign: textAlign as any,
          letterSpacing,
          lineHeight,
          opacity,
          transform: rotation,
          textShadow: shadow,
        }}
      >
        <span>{layer.text}</span>
      </div>
    );
  };

  // Universal Dynamic Layer Text Renderer
  const renderLayer = (
    layerIdx: number,
    fallbackText: string,
    defaultStyle: {
      font?: string;
      color?: string;
      bg?: string;
      weight?: string | number;
      sizePx?: number;
      italic?: boolean;
      underline?: boolean;
      uppercase?: boolean;
      letterSpacing?: string;
      lineHeight?: number;
      textAlign?: string;
      textShadow?: string;
    } = {},
    className: string = ""
  ) => {
    // In controlled mode: check if user provided customTextLayers
    if (template.customTextLayers) {
      const layer = template.customTextLayers[layerIdx];
      // 1. If this layer was deleted or hidden, do NOT render fallback!
      if (!layer || layer.visible === false) return null;

      // 2. If this layer is detached to top-left, center-top, or over-image, do NOT render in central band!
      if (layer.position && layer.position !== "over-band") {
        return null;
      }
    }

    const layer = template.customTextLayers?.[layerIdx];
    const text = layer?.text !== undefined && layer?.text !== "" ? layer.text : (lines[layerIdx] || fallbackText);
    if (!text) return null;

    const font = layer?.fontFamily || defaultStyle.font || primaryFont;
    const color = layer?.color || defaultStyle.color || "#FFFFFF";
    const bg = layer?.bgHighlight && layer.bgHighlight !== "transparent" ? layer.bgHighlight : defaultStyle.bg;

    let weight: string | number = defaultStyle.weight || 700;
    if (layer?.fontWeight) {
      if (layer.fontWeight === "Black") weight = 900;
      else if (layer.fontWeight === "ExtraBold") weight = 800;
      else if (layer.fontWeight === "Bold") weight = 700;
      else if (layer.fontWeight === "SemiBold") weight = 600;
      else if (layer.fontWeight === "Medium") weight = 500;
      else if (layer.fontWeight === "Regular") weight = 400;
      else weight = layer.fontWeight;
    } else if (layer?.isBold !== undefined) {
      weight = layer.isBold ? 700 : 400;
    }

    const size = layer?.fontSizePx ? `${layer.fontSizePx}px` : (defaultStyle.sizePx ? `${defaultStyle.sizePx}px` : undefined);
    const isItalic = layer?.isItalic !== undefined ? layer.isItalic : Boolean(defaultStyle.italic);
    const isUnderline = layer?.isUnderline !== undefined ? layer.isUnderline : Boolean(defaultStyle.underline);
    const isStrikethrough = Boolean(layer?.isStrikethrough);
    const isUppercase = layer?.isUppercase !== undefined ? layer.isUppercase : (defaultStyle.uppercase !== false);
    
    // Horizontal text align: priority is layer textAlign, then global overlayHorizontalAlign, then defaultStyle
    const textAlign = layer?.textAlign || template.overlayHorizontalAlign || defaultStyle.textAlign || "center";
    const selfAlignClass =
      textAlign === "left" ? "self-start text-left" :
      textAlign === "right" ? "self-end text-right" :
      "self-center text-center";

    const letterSpacing = layer?.letterSpacing || defaultStyle.letterSpacing || "normal";
    const lineHeight = layer?.lineHeight || defaultStyle.lineHeight || 1.15;
    const opacity = layer?.opacity !== undefined ? layer.opacity : 1;
    const rotation = layer?.rotation ? `rotate(${layer.rotation}deg)` : undefined;
    const shadow = layer?.textShadow && layer?.shadowColor ? `0 2px 4px ${layer.shadowColor}` : defaultStyle.textShadow;

    const shape = layer?.shape || layer?.containerShape;
    let shapeClass = "";
    if (shape === "circle") {
      shapeClass = "rounded-full aspect-square min-w-[38px] min-h-[38px] inline-flex items-center justify-center p-2 border border-white/70 shadow-md";
    } else if (shape === "pill") {
      shapeClass = "rounded-full px-4 py-1 inline-flex items-center justify-center border border-white/70 shadow-md";
    } else if (shape === "rounded") {
      shapeClass = "rounded-xl px-3 py-1.5 inline-flex items-center justify-center border border-white/70 shadow-md";
    } else if (shape === "square") {
      shapeClass = "rounded-none aspect-square min-w-[38px] min-h-[38px] inline-flex items-center justify-center p-2 border border-white/70 shadow-md";
    }

    return (
      <span
        onClick={() => template.onLayerClick?.(layer?.id || `layer-${layerIdx}`)}
        className={`${className} ${shapeClass} ${selfAlignClass} transition-all pointer-events-auto cursor-pointer`}
        style={{
          fontFamily: font,
          color: color,
          backgroundColor: bg && bg !== "transparent" ? bg : undefined,
          fontWeight: weight,
          fontSize: size,
          fontStyle: isItalic ? "italic" : "normal",
          textDecoration: isUnderline ? "underline" : isStrikethrough ? "line-through" : "none",
          textTransform: isUppercase ? "uppercase" : "none",
          textAlign: textAlign as any,
          letterSpacing,
          lineHeight,
          opacity,
          transform: rotation,
          textShadow: shadow,
        }}
      >
        {text}
      </span>
    );
  };

  return (
    <div
      className={`relative w-full ${aspectClass} overflow-hidden select-none shadow-md ${className}`}
      style={{
        fontFamily: primaryFont,
        borderWidth: `${borderWidth}px`,
        borderColor: borderColor,
        borderStyle: borderWidth > 0 ? "solid" : "none",
        borderRadius: `${cornerRadius}px`,
        ...bgStyle,
      }}
    >
      {/* ======================================================== */}
      {/* 1. PHOTO COLLAGE WITH DYNAMIC LAYOUT PATTERNS            */}
      {/* ======================================================== */}
      <div className="absolute inset-0 pointer-events-none">
        {/* 1 Image Patterns */}
        {imageCount === 1 && (
          collagePattern === "single-framed" ? (
            <div className="w-full h-full p-3 pointer-events-auto flex items-center justify-center">
              <div className="w-full h-full overflow-hidden shadow-inner border border-white/50 rounded-xl">
                {renderSlot(0, "bg-[#EFE7DC]")}
              </div>
            </div>
          ) : collagePattern === "single-hero-top" ? (
            <div className="w-full h-full pointer-events-auto flex flex-col">
              <div className="h-[72%] w-full">{renderSlot(0, "bg-[#EFE7DC]")}</div>
              <div className="h-[28%] w-full bg-[#EFE7DC]/50 flex items-center justify-center" />
            </div>
          ) : (
            <div className="w-full h-full pointer-events-auto">
              {renderSlot(0, "bg-[#EFE7DC]")}
            </div>
          )
        )}

        {/* 2 Images Patterns */}
        {imageCount === 2 && (
          collagePattern === "two-rows" ? (
            <div className="w-full h-full flex flex-col pointer-events-auto" style={{ gap: `${collageGap}px` }}>
              <div className="h-1/2 w-full">{renderSlot(0, "bg-[#EFE7DC]")}</div>
              <div className="h-1/2 w-full">{renderSlot(1, "bg-[#8E9880]")}</div>
            </div>
          ) : collagePattern === "two-asymmetric" ? (
            <div className="w-full h-full grid grid-cols-[1.3fr_1fr] pointer-events-auto" style={{ gap: `${collageGap}px` }}>
              {renderSlot(0, "bg-[#EFE7DC]")}
              {renderSlot(1, "bg-[#8E9880]")}
            </div>
          ) : collagePattern === "two-hero-top" ? (
            <div className="w-full h-full flex flex-col pointer-events-auto" style={{ gap: `${collageGap}px` }}>
              <div className="h-[65%] w-full">{renderSlot(0, "bg-[#EFE7DC]")}</div>
              <div className="h-[35%] w-full">{renderSlot(1, "bg-[#8E9880]")}</div>
            </div>
          ) : (
            <div className="w-full h-full grid grid-cols-2 pointer-events-auto" style={{ gap: `${collageGap}px` }}>
              {renderSlot(0, "bg-[#EFE7DC]")}
              {renderSlot(1, "bg-[#8E9880]")}
            </div>
          )
        )}

        {/* 3 Images Patterns */}
        {imageCount === 3 && (
          collagePattern === "three-hero-bottom" ? (
            <div className="w-full h-full flex flex-col pointer-events-auto" style={{ gap: `${collageGap}px` }}>
              <div className="h-[48%] grid grid-cols-2" style={{ gap: `${collageGap}px` }}>
                {renderSlot(0, "bg-[#EFE7DC]")}
                {renderSlot(1, "bg-[#8E9880]")}
              </div>
              <div className="h-[52%] w-full">{renderSlot(2, "bg-[#C39F8F]/40")}</div>
            </div>
          ) : collagePattern === "three-hero-left" ? (
            <div className="w-full h-full grid grid-cols-[1.2fr_1fr] pointer-events-auto" style={{ gap: `${collageGap}px` }}>
              <div className="h-full w-full">{renderSlot(0, "bg-[#EFE7DC]")}</div>
              <div className="h-full flex flex-col" style={{ gap: `${collageGap}px` }}>
                <div className="h-1/2 w-full">{renderSlot(1, "bg-[#C39F8F]/40")}</div>
                <div className="h-1/2 w-full">{renderSlot(2, "bg-[#8E9880]")}</div>
              </div>
            </div>
          ) : collagePattern === "three-cols" ? (
            <div className="w-full h-full grid grid-cols-3 pointer-events-auto" style={{ gap: `${collageGap}px` }}>
              {renderSlot(0, "bg-[#EFE7DC]")}
              {renderSlot(1, "bg-[#C39F8F]/40")}
              {renderSlot(2, "bg-[#8E9880]")}
            </div>
          ) : collagePattern === "three-rows" ? (
            <div className="w-full h-full grid grid-rows-3 pointer-events-auto" style={{ gap: `${collageGap}px` }}>
              {renderSlot(0, "bg-[#EFE7DC]")}
              {renderSlot(1, "bg-[#C39F8F]/40")}
              {renderSlot(2, "bg-[#8E9880]")}
            </div>
          ) : (
            <div className="w-full h-full flex flex-col pointer-events-auto" style={{ gap: `${collageGap}px` }}>
              <div className="h-[52%] w-full">{renderSlot(0, "bg-[#EFE7DC]")}</div>
              <div className="h-[48%] grid grid-cols-2" style={{ gap: `${collageGap}px` }}>
                {renderSlot(1, "bg-[#C39F8F]/40")}
                {renderSlot(2, "bg-[#8E9880]")}
              </div>
            </div>
          )
        )}

        {/* 4 Images Patterns */}
        {imageCount === 4 && (
          collagePattern === "four-hero-top" ? (
            <div className="w-full h-full flex flex-col pointer-events-auto" style={{ gap: `${collageGap}px` }}>
              <div className="h-[50%] w-full">{renderSlot(0, "bg-[#EFE7DC]")}</div>
              <div className="h-[50%] grid grid-cols-3" style={{ gap: `${collageGap}px` }}>
                {renderSlot(1, "bg-[#8E9880]")}
                {renderSlot(2, "bg-[#EFE7DC]")}
                {renderSlot(3, "bg-[#8E9880]")}
              </div>
            </div>
          ) : collagePattern === "four-hero-left" ? (
            <div className="w-full h-full grid grid-cols-2 pointer-events-auto" style={{ gap: `${collageGap}px` }}>
              <div className="h-full w-full">{renderSlot(0, "bg-[#EFE7DC]")}</div>
              <div className="h-full flex flex-col" style={{ gap: `${collageGap}px` }}>
                <div className="h-1/3 w-full">{renderSlot(1, "bg-[#8E9880]")}</div>
                <div className="h-1/3 w-full">{renderSlot(2, "bg-[#EFE7DC]")}</div>
                <div className="h-1/3 w-full">{renderSlot(3, "bg-[#8E9880]")}</div>
              </div>
            </div>
          ) : collagePattern === "four-cols" ? (
            <div className="w-full h-full grid grid-cols-4 pointer-events-auto" style={{ gap: `${collageGap}px` }}>
              {[0, 1, 2, 3].map((i) => (
                <React.Fragment key={i}>
                  {renderSlot(i, i % 2 === 0 ? "bg-[#EFE7DC]" : "bg-[#8E9880]")}
                </React.Fragment>
              ))}
            </div>
          ) : collagePattern === "four-rows" ? (
            <div className="w-full h-full grid grid-rows-4 pointer-events-auto" style={{ gap: `${collageGap}px` }}>
              {[0, 1, 2, 3].map((i) => (
                <React.Fragment key={i}>
                  {renderSlot(i, i % 2 === 0 ? "bg-[#EFE7DC]" : "bg-[#8E9880]")}
                </React.Fragment>
              ))}
            </div>
          ) : (
            <div className="w-full h-full grid grid-cols-2 grid-rows-2 pointer-events-auto" style={{ gap: `${collageGap}px` }}>
              {renderSlot(0, "bg-[#EFE7DC]")}
              {renderSlot(1, "bg-[#8E9880]")}
              {renderSlot(2, "bg-[#EFE7DC]")}
              {renderSlot(3, "bg-[#8E9880]")}
            </div>
          )
        )}

        {/* 5 Images Patterns */}
        {imageCount === 5 && (
          collagePattern === "five-top3-bottom2" ? (
            <div className="w-full h-full flex flex-col pointer-events-auto" style={{ gap: `${collageGap}px` }}>
              <div className="h-[55%] grid grid-cols-3" style={{ gap: `${collageGap}px` }}>
                {renderSlot(0, "bg-[#EFE7DC]")}
                {renderSlot(1, "bg-[#8E9880]")}
                {renderSlot(2, "bg-[#C39F8F]/40")}
              </div>
              <div className="h-[45%] grid grid-cols-2" style={{ gap: `${collageGap}px` }}>
                {renderSlot(3, "bg-[#EFE7DC]")}
                {renderSlot(4, "bg-[#8E9880]")}
              </div>
            </div>
          ) : collagePattern === "five-hero-top" ? (
            <div className="w-full h-full flex flex-col pointer-events-auto" style={{ gap: `${collageGap}px` }}>
              <div className="h-[46%] w-full">{renderSlot(0, "bg-[#EFE7DC]")}</div>
              <div className="h-[54%] grid grid-cols-2 grid-rows-2" style={{ gap: `${collageGap}px` }}>
                {renderSlot(1, "bg-[#8E9880]")}
                {renderSlot(2, "bg-[#C39F8F]/40")}
                {renderSlot(3, "bg-[#EFE7DC]")}
                {renderSlot(4, "bg-[#8E9880]")}
              </div>
            </div>
          ) : collagePattern === "five-hero-left" ? (
            <div className="w-full h-full grid grid-cols-[1.1fr_1fr] pointer-events-auto" style={{ gap: `${collageGap}px` }}>
              <div className="h-full w-full">{renderSlot(0, "bg-[#EFE7DC]")}</div>
              <div className="h-full grid grid-cols-2 grid-rows-2" style={{ gap: `${collageGap}px` }}>
                {renderSlot(1, "bg-[#8E9880]")}
                {renderSlot(2, "bg-[#C39F8F]/40")}
                {renderSlot(3, "bg-[#EFE7DC]")}
                {renderSlot(4, "bg-[#8E9880]")}
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col pointer-events-auto" style={{ gap: `${collageGap}px` }}>
              <div className="h-[45%] grid grid-cols-2" style={{ gap: `${collageGap}px` }}>
                {renderSlot(0, "bg-[#EFE7DC]")}
                {renderSlot(1, "bg-[#8E9880]")}
              </div>
              <div className="h-[55%] grid grid-cols-3" style={{ gap: `${collageGap}px` }}>
                {renderSlot(2, "bg-[#C39F8F]/40")}
                {renderSlot(3, "bg-[#EFE7DC]")}
                {renderSlot(4, "bg-[#8E9880]")}
              </div>
            </div>
          )
        )}

        {/* 6 Images Patterns */}
        {imageCount >= 6 && (
          collagePattern === "six-grid-3x2" ? (
            <div className="w-full h-full grid grid-cols-3 grid-rows-2 pointer-events-auto" style={{ gap: `${collageGap}px` }}>
              {[0, 1, 2, 3, 4, 5].map((idx) => (
                <React.Fragment key={idx}>
                  {renderSlot(idx, idx % 2 === 0 ? "bg-[#EFE7DC]" : "bg-[#8E9880]")}
                </React.Fragment>
              ))}
            </div>
          ) : collagePattern === "six-top2-bottom4" ? (
            <div className="w-full h-full flex flex-col pointer-events-auto" style={{ gap: `${collageGap}px` }}>
              <div className="h-[42%] grid grid-cols-2" style={{ gap: `${collageGap}px` }}>
                {renderSlot(0, "bg-[#EFE7DC]")}
                {renderSlot(1, "bg-[#8E9880]")}
              </div>
              <div className="h-[58%] grid grid-cols-2 grid-rows-2" style={{ gap: `${collageGap}px` }}>
                {[2, 3, 4, 5].map((idx) => (
                  <React.Fragment key={idx}>
                    {renderSlot(idx, idx % 2 === 0 ? "bg-[#C39F8F]/40" : "bg-[#8E9880]")}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ) : collagePattern === "six-hero-top" ? (
            <div className="w-full h-full flex flex-col pointer-events-auto" style={{ gap: `${collageGap}px` }}>
              <div className="h-[44%] w-full">{renderSlot(0, "bg-[#EFE7DC]")}</div>
              <div className="h-[56%] grid grid-cols-5" style={{ gap: `${collageGap}px` }}>
                {[1, 2, 3, 4, 5].map((idx) => (
                  <React.Fragment key={idx}>
                    {renderSlot(idx, idx % 2 === 0 ? "bg-[#8E9880]" : "bg-[#EFE7DC]")}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full h-full grid grid-cols-2 grid-rows-3 pointer-events-auto" style={{ gap: `${collageGap}px` }}>
              {[0, 1, 2, 3, 4, 5].map((idx) => (
                <React.Fragment key={idx}>
                  {renderSlot(idx, idx % 2 === 0 ? "bg-[#EFE7DC]" : "bg-[#8E9880]")}
                </React.Fragment>
              ))}
            </div>
          )
        )}
      </div>

      {/* ======================================================== */}
      {/* 2. NUMBER BADGE & DETACHED FLOATING LAYERS (SHAPE & POS) */}
      {/* ======================================================== */}
      {/* A) Detached layers positioned at "top-left" */}
      {topLeftLayers.length > 0 ? (
        <div className="absolute top-4 left-4 z-30 flex flex-col items-start gap-1.5 pointer-events-auto">
          {topLeftLayers.map((l) => renderCustomLayerElement(l))}
        </div>
      ) : (
        !template.customTextLayers && hasBadge && (!isIntegratedArchetype || badgePosition !== "over-band") && badgePosition === "top-left" && (
          <div
            onClick={() => template.onLayerClick?.(badgeLayer?.id || "layer-badge")}
            className={`absolute z-30 top-4 left-4 flex items-center justify-center font-black shadow-2xl transition-all cursor-pointer pointer-events-auto ${
              badgeShape === "circle" ? "w-12 h-12 rounded-full border-2 border-white/80" :
              badgeShape === "pill" ? "px-4 py-1.5 rounded-full border-2 border-white/80 text-xs sm:text-sm" :
              badgeShape === "rounded" ? "w-12 h-12 rounded-2xl border-2 border-white/80" :
              "w-11 h-11 rounded-none border-2 border-white/80"
            }`}
            style={{ backgroundColor: badgeBg || accentColor || "#EE1A5B", color: badgeColor }}
          >
            <span className="text-sm sm:text-base tracking-tighter leading-none">{badgeText}</span>
          </div>
        )
      )}

      {/* B) Detached layers positioned at "center-top" */}
      {centerTopLayers.length > 0 ? (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1.5 pointer-events-auto">
          {centerTopLayers.map((l) => renderCustomLayerElement(l))}
        </div>
      ) : (
        !template.customTextLayers && hasBadge && (!isIntegratedArchetype || badgePosition !== "over-band") && badgePosition === "center-top" && (
          <div
            onClick={() => template.onLayerClick?.(badgeLayer?.id || "layer-badge")}
            className={`absolute z-30 top-4 left-1/2 -translate-x-1/2 flex items-center justify-center font-black shadow-2xl transition-all cursor-pointer pointer-events-auto ${
              badgeShape === "circle" ? "w-12 h-12 rounded-full border-2 border-white/80" :
              badgeShape === "pill" ? "px-4 py-1.5 rounded-full border-2 border-white/80 text-xs sm:text-sm" :
              badgeShape === "rounded" ? "w-12 h-12 rounded-2xl border-2 border-white/80" :
              "w-11 h-11 rounded-none border-2 border-white/80"
            }`}
            style={{ backgroundColor: badgeBg || accentColor || "#EE1A5B", color: badgeColor }}
          >
            <span className="text-sm sm:text-base tracking-tighter leading-none">{badgeText}</span>
          </div>
        )
      )}

      {/* C) Detached layers positioned at "over-image" */}
      {overImageLayers.length > 0 ? (
        <div className="absolute bottom-14 right-4 z-30 flex flex-col items-end gap-1.5 pointer-events-auto">
          {overImageLayers.map((l) => renderCustomLayerElement(l))}
        </div>
      ) : (
        !template.customTextLayers && hasBadge && (!isIntegratedArchetype || badgePosition !== "over-band") && badgePosition === "over-image" && (
          <div
            onClick={() => template.onLayerClick?.(badgeLayer?.id || "layer-badge")}
            className={`absolute z-30 top-5 right-5 flex items-center justify-center font-black shadow-2xl transition-all cursor-pointer pointer-events-auto ${
              badgeShape === "circle" ? "w-12 h-12 rounded-full border-2 border-white/80" :
              badgeShape === "pill" ? "px-4 py-1.5 rounded-full border-2 border-white/80 text-xs sm:text-sm" :
              badgeShape === "rounded" ? "w-12 h-12 rounded-2xl border-2 border-white/80" :
              "w-11 h-11 rounded-none border-2 border-white/80"
            }`}
            style={{ backgroundColor: badgeBg || accentColor || "#EE1A5B", color: badgeColor }}
          >
            <span className="text-sm sm:text-base tracking-tighter leading-none">{badgeText}</span>
          </div>
        )
      )}

      {/* ======================================================== */}
      {/* 3. STYLISH OVERLAY TYPOGRAPHY ARCHETYPES                 */}
      {/* ======================================================== */}
      <div
        className={`absolute inset-x-0 flex flex-col ${alignClass} px-3 z-20 pointer-events-none transition-all duration-75`}
        style={{
          top: `${overlayOffsetY}%`,
          transform: "translateY(-50%)",
        }}
      >
        {/* ============================================================== */}
        {/* ARCHETYPE: SCRIPT & BAR (Screenshots 1 & 2)                    */}
        {/* ============================================================== */}
        {blockStyle === "script-and-bar" && (
          <div className="w-full max-w-[94%] flex flex-col items-center text-center shadow-2xl relative">
            <div className="bg-white w-full py-1 px-4 flex items-center justify-center gap-2 border-b border-black/10">
              {renderLayer(0, badgeText || lines[0] || "20", {
                color: accentColor,
                font: "Anton, Oswald, sans-serif",
                weight: 900,
                sizePx: 44,
                textShadow: "1px 1px 0 #111111, -1px -1px 0 #111111, 1px -1px 0 #111111, -1px 1px 0 #111111",
              }, "leading-none")}
              {renderLayer(1, scriptWord || lines[1] || "Trendy", {
                color: "#111111",
                font: "Kaushan Script, Caveat, cursive",
                italic: true,
                sizePx: 36,
                uppercase: false,
              }, "leading-none")}
            </div>

            <div
              className="w-full py-2 px-3 shadow-md"
              style={{ backgroundColor: bandColor || accentColor }}
            >
              {renderLayer(2, lines[2] || lines[1] || "COMBAT BOOT OUTFITS", {
                color: "#FFFFFF",
                font: "Anton, Oswald, sans-serif",
                weight: 900,
                sizePx: 18,
                uppercase: true,
              }, "leading-tight block uppercase tracking-wide")}
            </div>

            <div className="bg-white w-full py-1.5 px-3">
              {renderLayer(3, lines[3] || lines[2] || "YOU CAN'T GET AROUND RIGHT NOW", {
                color: "#111111",
                font: "Montserrat, sans-serif",
                weight: 900,
                sizePx: 11,
                uppercase: true,
              }, "leading-tight block uppercase tracking-normal")}
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
                {renderLayer(0, lines[0] || "— 20 TRENDY WINTER —", {
                  color: "#111111",
                  font: primaryFont,
                  weight: 900,
                  sizePx: 13,
                  uppercase: true,
                }, "tracking-tight uppercase")}
                <div className="h-[1.5px] bg-black/40 flex-1 max-w-[35px]" />
              </div>

              {renderLayer(1, lines[1] || "OUTFIT IDEAS", {
                color: accentColor,
                font: "Anton, Oswald, sans-serif",
                weight: 900,
                sizePx: 38,
                uppercase: true,
              }, "tracking-tight leading-none my-0.5")}

              {lines[2] && renderLayer(2, lines[2], {
                color: accentColor,
                font: "Anton, Oswald, sans-serif",
                weight: 900,
                sizePx: 38,
                uppercase: true,
              }, "tracking-tight leading-none mb-1")}

              {renderLayer(3, lines[3] || lines[2] || "YOU'LL WANT TO COPY BEFORE THE COLD REALLY HITS", {
                color: "#111111",
                font: "Montserrat, sans-serif",
                weight: 900,
                sizePx: 10,
                uppercase: true,
              }, "tracking-tight max-w-[90%] leading-tight pt-0.5")}
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
              {renderLayer(0, badgeText || "25", {
                color: accentColor,
                font: primaryFont,
                weight: 900,
                sizePx: 28,
              }, "leading-none")}
              {renderLayer(1, scriptWord || "Pretty", {
                color: "#111111",
                font: "Great Vibes, Dancing Script, cursive",
                italic: true,
                sizePx: 24,
                uppercase: false,
              }, "leading-none my-0.5")}
              {renderLayer(2, lines[2] || "BALAYAGE", {
                color: "#111111",
                font: "Anton, Oswald, sans-serif",
                weight: 900,
                sizePx: 18,
                uppercase: true,
              }, "leading-none uppercase tracking-tight")}
              {renderLayer(3, lines[3] || "HAIR IDEAS", {
                color: accentColor,
                font: primaryFont,
                weight: 900,
                sizePx: 14,
                uppercase: true,
              }, "leading-tight uppercase tracking-tight")}
              {renderLayer(4, lines[4] || "TO SAVE NOW", {
                color: "#333333",
                font: primaryFont,
                weight: 700,
                sizePx: 8,
                uppercase: true,
              }, "uppercase tracking-widest pt-0.5")}
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
            {renderLayer(0, kicker || "FASHION & STYLE EDIT", {
              color: "#666666",
              font: "monospace",
              weight: 700,
              sizePx: 9,
              uppercase: true,
            }, "tracking-widest font-mono uppercase")}
            {renderLayer(1, scriptWord || "Chic", {
              color: accentColor,
              font: "Great Vibes, Dancing Script, cursive",
              italic: true,
              sizePx: 30,
              uppercase: false,
            }, "leading-none")}
            {renderLayer(2, lines[2] || lines[1] || "Capsule Wardrobe Essentials", {
              color: "#111111",
              font: "Didot, Bodoni MT, serif",
              weight: 900,
              sizePx: 16,
              uppercase: false,
            }, "tracking-tight leading-snug")}
          </div>
        )}

        {/* ============================================================== */}
        {/* ARCHETYPE: BIG CAPS BAND (Screenshot 6)                        */}
        {/* ============================================================== */}
        {blockStyle === "big-caps-band" && (
          <div className="bg-white text-black p-4 shadow-2xl rounded-none w-full max-w-[92%] flex flex-col items-center text-center space-y-1 border border-black/10">
            <div className="flex items-center justify-center gap-3 w-full">
              {renderLayer(0, badgeText || lines[0] || "19", {
                color: "#111111",
                font: "Anton, Oswald, sans-serif",
                weight: 900,
                sizePx: 56,
              }, "tracking-tighter leading-none")}
              <div className="flex flex-col items-start text-left">
                {renderLayer(1, lines[1] || "SMALL", {
                  color: "#111111",
                  font: primaryFont,
                  weight: 900,
                  sizePx: 12,
                  uppercase: true,
                }, "tracking-widest uppercase")}
                {renderLayer(2, lines[2] || "APARTMENT", {
                  color: "#111111",
                  font: "Anton, Oswald, sans-serif",
                  weight: 900,
                  sizePx: 28,
                  uppercase: true,
                }, "tracking-tight leading-none uppercase")}
              </div>
            </div>
            <div className="pt-1 border-t border-black/10 w-full">
              {renderLayer(3, lines[3] || "PATIOS TO MAXIMIZE SPACE", {
                color: "#333333",
                font: primaryFont,
                weight: 900,
                sizePx: 10,
                uppercase: true,
              }, "tracking-wider uppercase")}
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
                {renderLayer(0, badgeText || "21", {
                  color: "#FFFFFF",
                  font: primaryFont,
                  weight: 900,
                  sizePx: 22,
                }, "leading-none")}
              </div>
              {renderLayer(1, lines[1] || "CLEVER", {
                color: "#111111",
                font: "Anton, Oswald, sans-serif",
                weight: 900,
                sizePx: 28,
                uppercase: true,
              }, "tracking-tight leading-none uppercase")}
            </div>
            {renderLayer(2, lines[2] || "COOL IDEAS FOR", {
              color: accentColor || "#5A6B48",
              font: "Anton, Oswald, sans-serif",
              weight: 900,
              sizePx: 18,
              uppercase: true,
            }, "tracking-tight leading-none uppercase")}
            {renderLayer(3, lines[3] || "SMALL PATIOS", {
              color: "#111111",
              font: "Anton, Oswald, sans-serif",
              weight: 900,
              sizePx: 20,
              uppercase: true,
            }, "tracking-tight leading-none uppercase")}
          </div>
        )}

        {/* ============================================================== */}
        {/* ARCHETYPE: COLOR STRIPS (Screenshots 6 & 7)                    */}
        {/* ============================================================== */}
        {blockStyle === "color-strips" && (
          <div className="w-full max-w-[94%] flex flex-col shadow-2xl">
            <div className="bg-[#F6EFE9] py-1.5 px-3 flex items-center justify-center gap-2">
              {renderLayer(0, lines[0] || lines[1] || "WAYS TO USE", {
                color: "#111111",
                font: primaryFont,
                weight: 900,
                sizePx: 12,
                uppercase: true,
              }, "tracking-wide uppercase")}
            </div>
            <div
              className="py-2 px-3 text-center shadow-inner"
              style={{ backgroundColor: bandColor || "#2D5A3A" }}
            >
              {renderLayer(1, lines[1] || lines[2] || "ROSEMARY OIL FOR", {
                color: "#FFFFFF",
                font: primaryFont,
                weight: 900,
                sizePx: 14,
                uppercase: true,
              }, "tracking-wider uppercase block")}
            </div>
            <div className="bg-[#F6EFE9] py-1.5 px-3 text-center">
              {renderLayer(2, lines[2] || lines[3] || "HAIR GROWTH", {
                color: "#111111",
                font: primaryFont,
                weight: 900,
                sizePx: 14,
                uppercase: true,
              }, "tracking-wide uppercase block")}
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
            {renderLayer(0, lines[0] || "TRANSFORM YOUR", {
              color: "#FFFFFF",
              font: "Anton, Oswald, sans-serif",
              weight: 900,
              sizePx: 20,
              uppercase: true,
            }, "tracking-tight block leading-tight uppercase")}
            {renderLayer(1, lines[1] || "KITCHEN WITH", {
              color: "#111111",
              font: "Anton, Oswald, sans-serif",
              weight: 900,
              sizePx: 20,
              uppercase: true,
            }, "tracking-tight block leading-tight uppercase")}
            {renderLayer(2, lines[2] || "UPCYCLED PALLETS", {
              color: "#FFFFFF",
              font: "Anton, Oswald, sans-serif",
              weight: 900,
              sizePx: 20,
              uppercase: true,
            }, "tracking-tight block leading-tight uppercase")}
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
              {renderLayer(0, badgeText || "25", {
                color: "#FFFFFF",
                font: primaryFont,
                weight: 900,
                sizePx: 14,
              }, "leading-none")}
            </div>
            <div className="pt-2">
              {renderLayer(1, scriptWord || "Stunning", {
                color: accentColor || "#E91E63",
                font: "Great Vibes, Dancing Script, cursive",
                italic: true,
                sizePx: 24,
                uppercase: false,
              }, "italic leading-none")}
            </div>
            <div>
              {renderLayer(2, lines[1] || lines[2] || "BALAYAGE HAIR COLOR IDEAS", {
                color: "#111111",
                font: "Anton, Oswald, sans-serif",
                weight: 900,
                sizePx: 17,
                uppercase: true,
              }, "tracking-tight leading-tight uppercase block")}
            </div>
            <div>
              {renderLayer(3, lines[3] || "FOR LONG LAYERED HAIR", {
                color: "#555555",
                font: primaryFont,
                weight: 700,
                sizePx: 10,
                uppercase: true,
              }, "tracking-wide uppercase block")}
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
              {renderLayer(0, badgeText || "25", {
                color: "#111111",
                font: primaryFont,
                weight: 900,
                sizePx: 16,
              }, "leading-none")}
            </div>
            <div className="bg-[#1F2937ee] text-white p-4 rounded-xs shadow-2xl w-full text-center space-y-1 border border-white/10 backdrop-blur-xs">
              {renderLayer(1, scriptWord || "Dreamy", {
                color: accentColor || "#EAB308",
                font: "Great Vibes, cursive",
                italic: true,
                sizePx: 24,
                uppercase: false,
              }, "italic leading-none block")}
              {renderLayer(2, lines[1] || "BALAYAGE", {
                color: "#FFFFFF",
                font: "Anton, Oswald, sans-serif",
                weight: 900,
                sizePx: 20,
                uppercase: true,
              }, "tracking-tight leading-none block uppercase")}
              {renderLayer(3, lines[2] || "HAIR COLOR IDEAS", {
                color: "#FFFFFF",
                font: "Anton, Oswald, sans-serif",
                weight: 900,
                sizePx: 14,
                uppercase: true,
              }, "tracking-tight leading-none block uppercase")}
              {renderLayer(4, lines[3] || "FOR LONG LAYERED HAIR", {
                color: accentColor || "#EAB308",
                font: primaryFont,
                weight: 700,
                sizePx: 9,
                uppercase: true,
              }, "tracking-wider block uppercase")}
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
              {renderLayer(0, badgeText || "12", {
                color: "#FFFFFF",
                font: primaryFont,
                weight: 900,
                sizePx: 11,
              }, "px-1.5 py-0.5 rounded bg-red-600 font-mono")}
              {renderLayer(1, scriptWord || "Dreamy", {
                color: "#F472B6",
                font: "Great Vibes, cursive",
                italic: true,
                sizePx: 20,
                uppercase: false,
              }, "italic leading-none")}
            </div>
            {renderLayer(2, lines[1] || lines[2] || "BUCKET LIST PLACES TO VISIT", {
              color: "#FFFFFF",
              font: "Didot, Bodoni MT, serif",
              weight: 900,
              sizePx: 15,
              uppercase: true,
            }, "tracking-tight uppercase leading-snug")}
            {renderLayer(3, lines[3] || "THE ULTIMATE 2026 TRAVEL GUIDE", {
              color: "#94A3B8",
              font: primaryFont,
              weight: 700,
              sizePx: 9,
              uppercase: true,
            }, "tracking-widest uppercase")}
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
              {renderLayer(0, badgeText || "41", {
                color: "#FFFFFF",
                font: "Didot, Bodoni MT, serif",
                weight: 900,
                sizePx: 30,
              }, "leading-none")}
              {renderLayer(1, scriptWord || "Farmhouse", {
                color: "#FFFFFF",
                font: "Great Vibes, cursive",
                italic: true,
                sizePx: 24,
                uppercase: false,
              }, "italic leading-none")}
            </div>
            {renderLayer(2, lines[1] || lines[2] || "BEDROOM", {
              color: "#FFFFFF",
              font: "Anton, Oswald, sans-serif",
              weight: 900,
              sizePx: 22,
              uppercase: true,
            }, "tracking-tight uppercase leading-none")}
            {renderLayer(3, lines[2] || lines[3] || "Decor Ideas", {
              color: "#F3E8FF",
              font: "Playfair Display, serif",
              italic: true,
              sizePx: 14,
              uppercase: false,
            }, "italic leading-normal")}
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
            {renderLayer(0, badgeText || "40", {
              color: accentColor || "#22D3EE",
              font: primaryFont,
              weight: 900,
              sizePx: 32,
            }, "leading-none mb-1")}
            {renderLayer(1, lines[1] || "STUNNING", {
              color: accentColor || "#22D3EE",
              font: "Anton, Oswald, sans-serif",
              weight: 900,
              sizePx: 18,
              uppercase: true,
            }, "tracking-tight leading-tight uppercase")}
            {renderLayer(2, lines[2] || "TV UNIT", {
              color: accentColor || "#22D3EE",
              font: "Anton, Oswald, sans-serif",
              weight: 900,
              sizePx: 16,
              uppercase: true,
            }, "tracking-tight leading-tight uppercase")}
            {renderLayer(3, lines[3] || "MODERN DESIGNS", {
              color: accentColor || "#22D3EE",
              font: "Anton, Oswald, sans-serif",
              weight: 900,
              sizePx: 13,
              uppercase: true,
            }, "tracking-wide leading-tight uppercase")}
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
              {renderLayer(0, badgeText || "25", {
                color: bandColor || "#0F172A",
                font: primaryFont,
                weight: 900,
                sizePx: 14,
              }, "leading-none")}
            </div>
            <div className="pt-2">
              {renderLayer(1, lines[1] || "COASTAL", {
                color: accentColor || "#A3E635",
                font: "Anton, Oswald, sans-serif",
                weight: 900,
                sizePx: 22,
                uppercase: true,
              }, "tracking-tight leading-none block uppercase")}
              {renderLayer(2, lines[2] || "BEDROOM", {
                color: accentColor || "#A3E635",
                font: "Anton, Oswald, sans-serif",
                weight: 900,
                sizePx: 22,
                uppercase: true,
              }, "tracking-tight leading-none block uppercase")}
            </div>
            {renderLayer(3, scriptWord || "Ideas", {
              color: "#38BDF8",
              font: "Great Vibes, cursive",
              italic: true,
              sizePx: 18,
              uppercase: false,
            }, "italic leading-none")}
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
              {renderLayer(0, badgeText || "25", {
                color: "#111111",
                font: "Anton, Oswald, sans-serif",
                weight: 900,
                sizePx: 38,
              }, "tracking-tighter leading-none")}
              <div className="flex flex-col items-start text-left">
                {renderLayer(1, lines[1] || "BALAYAGE", {
                  color: accentColor || "#DC2626",
                  font: "Anton, Oswald, sans-serif",
                  weight: 900,
                  sizePx: 17,
                  uppercase: true,
                }, "tracking-tight leading-none uppercase")}
                {renderLayer(2, lines[2] || "HAIR IDEAS", {
                  color: "#111111",
                  font: "Anton, Oswald, sans-serif",
                  weight: 900,
                  sizePx: 14,
                  uppercase: true,
                }, "tracking-tight leading-none uppercase")}
              </div>
            </div>
            {renderLayer(3, lines[3] || "FOR LONG LAYERED HAIR", {
              color: "#555555",
              font: primaryFont,
              weight: 700,
              sizePx: 9,
              uppercase: true,
            }, "tracking-wider uppercase block")}
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
            {renderLayer(0, kicker || "MAISON DE BEAUTÉ", {
              color: "#064E3B",
              font: "monospace",
              weight: 700,
              sizePx: 9,
              uppercase: true,
            }, "tracking-widest font-mono uppercase")}
            <div className="w-10 h-10 rounded-full border-2 border-[#D4AF37] bg-white flex items-center justify-center font-black font-serif text-sm text-[#111111] shadow-xs">
              {renderLayer(1, badgeText || "50", {
                color: "#111111",
                font: "Didot, Bodoni MT, serif",
                weight: 900,
                sizePx: 14,
              }, "leading-none")}
            </div>
            {renderLayer(2, scriptWord || "Timeless", {
              color: "#D4AF37",
              font: "Playfair Display, Great Vibes, cursive",
              italic: true,
              sizePx: 24,
              uppercase: false,
            }, "italic leading-none")}
            {renderLayer(3, lines[2] || lines[3] || "HAUTE COUTURE LOOKS", {
              color: "#111111",
              font: "Didot, Bodoni MT, serif",
              weight: 900,
              sizePx: 17,
              uppercase: true,
            }, "uppercase tracking-tight leading-tight block")}
            {renderLayer(4, lines[3] || lines[4] || "THE DEFINITIVE LUXURY CAPSULE 2026", {
              color: "#555555",
              font: primaryFont,
              weight: 700,
              sizePx: 8,
              uppercase: true,
            }, "tracking-widest uppercase block")}
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
              {renderLayer(0, kicker || "2026 DROPS", {
                color: "#06B6D4",
                font: "monospace",
                weight: 700,
                sizePx: 9,
                uppercase: true,
              }, "font-mono tracking-widest")}
              <div className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#06B6D4] text-black">
                {renderLayer(1, badgeText || "35+", {
                  color: "#000000",
                  font: primaryFont,
                  weight: 900,
                  sizePx: 10,
                }, "leading-none")}
              </div>
            </div>
            {renderLayer(2, lines[2] || "STREETWEAR AESTHETIC", {
              color: "#FFFFFF",
              font: "Anton, Oswald, sans-serif",
              weight: 900,
              sizePx: 22,
              uppercase: true,
            }, "tracking-tight leading-none uppercase block pt-1")}
            {renderLayer(3, lines[3] || "TRENDS DOMINATING TOKYO & NYC", {
              color: "#EC4899",
              font: primaryFont,
              weight: 700,
              sizePx: 9,
              uppercase: true,
            }, "tracking-wider uppercase block")}
          </div>
        )}

        {/* ============================================================== */}
        {/* PINFORGE ORIGINAL 3: PROVENCE LAVENDER & BOTANICAL CREST       */}
        {/* ============================================================== */}
        {blockStyle === "forge-provence-lavender" && (
          <div className="bg-[#FDF4FF] text-[#1E1B4B] p-4 shadow-2xl rounded-2xl w-full max-w-[88%] flex flex-col items-center text-center space-y-1.5 border border-[#E9D5FF]">
            {renderLayer(0, kicker || "FRENCH LIVING", {
              color: "#8B5CF6",
              font: "monospace",
              weight: 700,
              sizePx: 8,
              uppercase: true,
            }, "tracking-widest font-mono uppercase")}
            {renderLayer(1, scriptWord || "Charming", {
              color: "#8B5CF6",
              font: "Great Vibes, cursive",
              italic: true,
              sizePx: 24,
              uppercase: false,
            }, "italic leading-none")}
            {renderLayer(2, lines[2] || "PROVENCE BEDROOMS", {
              color: "#1E1B4B",
              font: "Didot, Bodoni MT, serif",
              weight: 900,
              sizePx: 16,
              uppercase: true,
            }, "tracking-tight leading-tight uppercase block")}
            {renderLayer(3, lines[3] || "RUSTIC SOUTHERN FRANCE ELEGANCE", {
              color: "#4C1D95",
              font: "Playfair Display, serif",
              italic: true,
              sizePx: 9,
              uppercase: false,
            }, "italic")}
          </div>
        )}

        {/* ============================================================== */}
        {/* ARCHETYPE: LUXE HAIR — STEPPED BOXES & ITALIC PILLS            */}
        {/* ============================================================== */}
        {blockStyle === "luxe-stepped-boxes" && (
          <div className="flex flex-col items-center text-center space-y-1.5 w-full max-w-[92%]">
            <div className="bg-white px-4 py-0.5 rounded-none shadow-md border border-black/5">
              {renderLayer(0, badgeText || lines[0] || "50", {
                color: "#111111",
                font: "Didot, Bodoni MT, serif",
                weight: 900,
                sizePx: 30,
              }, "leading-none")}
            </div>

            <div className="space-y-1 flex flex-col items-center">
              <div className="bg-white px-3 py-0.5 shadow-sm rounded-none">
                {renderLayer(1, lines[1] || "MEDIUM LENGTH", {
                  color: "#111111",
                  font: "Didot, Bodoni MT, serif",
                  weight: 900,
                  sizePx: 13,
                  uppercase: true,
                }, "tracking-normal leading-tight uppercase")}
              </div>
              <div className="bg-white px-3 py-0.5 shadow-sm rounded-none">
                {renderLayer(2, lines[2] || "HAIRSTYLE IDEAS", {
                  color: "#111111",
                  font: "Didot, Bodoni MT, serif",
                  weight: 900,
                  sizePx: 13,
                  uppercase: true,
                }, "tracking-normal leading-tight uppercase")}
              </div>
            </div>

            <div className="space-y-1 flex flex-col items-center pt-0.5">
              <div className="bg-[#EFE6DB] px-3.5 py-0.5 rounded-full shadow-xs border border-[#DFD5C8]">
                {renderLayer(3, lines[3] || "That Work for", {
                  color: "#222222",
                  font: "Playfair Display, Didot, serif",
                  italic: true,
                  sizePx: 12,
                  uppercase: false,
                }, "italic tracking-tight")}
              </div>
              <div className="bg-[#EFE6DB] px-3.5 py-0.5 rounded-full shadow-xs border border-[#DFD5C8]">
                {renderLayer(4, lines[4] || "Every Hair Type", {
                  color: "#222222",
                  font: "Playfair Display, Didot, serif",
                  italic: true,
                  sizePx: 12,
                  uppercase: false,
                }, "italic tracking-tight")}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* ARCHETYPE: LUXE HAIR — STACKED CAPS, OVER 50                   */}
        {/* ============================================================== */}
        {blockStyle === "luxe-stacked-over-50" && (
          <div className="flex flex-col items-center text-center space-y-1.5 w-full max-w-[92%]">
            <div className="bg-white px-4 py-0.5 shadow-md border border-black/5">
              {renderLayer(0, badgeText || lines[0] || "50", {
                color: "#111111",
                font: "Didot, Bodoni MT, serif",
                weight: 900,
                sizePx: 30,
              }, "leading-none")}
            </div>

            <div className="bg-white px-3.5 py-0.5 shadow-sm">
              {renderLayer(1, lines[1] || "SHORT", {
                color: "#111111",
                font: "Didot, Bodoni MT, serif",
                weight: 900,
                sizePx: 14,
                uppercase: true,
              }, "tracking-normal uppercase")}
            </div>
            <div className="bg-white px-3.5 py-0.5 shadow-sm">
              {renderLayer(2, lines[2] || "HAIRSTYLES", {
                color: "#111111",
                font: "Didot, Bodoni MT, serif",
                weight: 900,
                sizePx: 14,
                uppercase: true,
              }, "tracking-normal uppercase")}
            </div>

            {renderLayer(3, lines[3] || "for Women", {
              color: "#222222",
              font: "Playfair Display, serif",
              italic: true,
              sizePx: 12,
              uppercase: false,
            }, "italic font-medium")}

            <div className="bg-[#EFE6DB] px-4 py-0.5 shadow-xs border border-[#DFD5C8]">
              {renderLayer(4, lines[4] || "OVER 50", {
                color: "#111111",
                font: "Didot, Bodoni MT, serif",
                weight: 900,
                sizePx: 14,
                uppercase: true,
              }, "tracking-wider uppercase")}
            </div>

            {renderLayer(5, lines[5] || "That Look", {
              color: "#333333",
              font: "Playfair Display, serif",
              italic: true,
              sizePx: 11,
              uppercase: false,
            }, "italic font-medium")}

            <div className="bg-white px-3 py-0.5 shadow-sm">
              {renderLayer(6, lines[6] || "ABSOLUTELY MODERN", {
                color: "#111111",
                font: "Didot, Bodoni MT, serif",
                weight: 900,
                sizePx: 12,
                uppercase: true,
              }, "tracking-normal uppercase")}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* ARCHETYPE: LUXE HAIR — BLACK NUMBER BOX & TRENDY TAG           */}
        {/* ============================================================== */}
        {blockStyle === "luxe-black-boxes" && (
          <div className="flex flex-col items-center text-center space-y-1.5 w-full max-w-[92%]">
            <div className="bg-black px-4 py-1 shadow-lg border border-white/20">
              {renderLayer(0, badgeText || lines[0] || "50", {
                color: "#FFFFFF",
                font: "Didot, Bodoni MT, serif",
                weight: 900,
                sizePx: 32,
              }, "leading-none")}
            </div>

            <div className="bg-white px-3 py-0.5 shadow-xs">
              {renderLayer(1, lines[1] || "- TRENDY -", {
                color: "#111111",
                font: primaryFont,
                weight: 700,
                sizePx: 10,
                uppercase: true,
              }, "tracking-widest uppercase")}
            </div>

            <div className="bg-white px-5 py-1 shadow-md w-full max-w-[80%]">
              {renderLayer(2, lines[2] || "SHORT", {
                color: "#111111",
                font: "Anton, sans-serif",
                weight: 900,
                sizePx: 32,
                uppercase: true,
              }, "tracking-tighter leading-none block uppercase")}
            </div>

            <div className="bg-white px-3 py-0.5 shadow-xs">
              {renderLayer(3, lines[3] || "— HAIRSTYLES —", {
                color: "#111111",
                font: primaryFont,
                weight: 700,
                sizePx: 11,
                uppercase: true,
              }, "tracking-wider uppercase")}
            </div>

            <div className="bg-black px-4 py-0.5 shadow-md">
              {renderLayer(4, lines[4] || "IDEAS", {
                color: "#FFFFFF",
                font: "Anton, Oswald, sans-serif",
                weight: 900,
                sizePx: 13,
                uppercase: true,
              }, "tracking-widest uppercase")}
            </div>

            <div className="bg-white px-3 py-0.5 shadow-xs">
              {renderLayer(5, lines[5] || "FOR EVERY WOMAN", {
                color: "#111111",
                font: primaryFont,
                weight: 700,
                sizePx: 10,
                uppercase: true,
              }, "tracking-wider uppercase")}
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
                {renderLayer(0, badgeText || "32", {
                  color: "#FFFFFF",
                  font: primaryFont,
                  weight: 900,
                  sizePx: 20,
                }, "leading-none")}
              </div>
              {renderLayer(1, scriptWord || "Chic", {
                color: "#111111",
                font: "Great Vibes, Dancing Script, cursive",
                italic: true,
                sizePx: 30,
                uppercase: false,
              }, "italic font-serif leading-none")}
            </div>

            <div>
              {renderLayer(2, lines[2] || "MUSHROOM", {
                color: accentColor,
                font: "Anton, Oswald, sans-serif",
                weight: 900,
                sizePx: 30,
                uppercase: true,
              }, "tracking-tight leading-none uppercase block")}
            </div>

            <div>
              {renderLayer(3, lines[3] || "BROWN HAIR IDEAS YOU'LL LOVE", {
                color: "#111111",
                font: primaryFont,
                weight: 900,
                sizePx: 12,
                uppercase: true,
              }, "leading-tight tracking-tight uppercase block")}
            </div>

            <div className="pt-0.5 border-t border-black/10 w-full">
              {renderLayer(4, lines[4] || "EASY LOOKS TO SHOW YOUR STYLIST", {
                color: "#555555",
                font: primaryFont,
                weight: 600,
                sizePx: 9,
                uppercase: true,
              }, "tracking-widest uppercase block")}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* ARCHETYPE: VIRAL PIN — HUGE NUMBER & CTA                       */}
        {/* ============================================================== */}
        {blockStyle === "viral-grid-cta" && (
          <div className="w-full max-w-[92%] flex flex-col items-center space-y-1.5">
            <div className="flex items-center justify-center gap-2">
              {renderLayer(0, badgeText || "58", {
                color: accentColor || "#C92A2A",
                font: "Anton, Oswald, sans-serif",
                weight: 900,
                sizePx: 48,
              }, "tracking-tighter leading-none")}
              {renderLayer(1, scriptWord || "Gorgeous", {
                color: "#111111",
                font: "Great Vibes, Dancing Script, cursive",
                italic: true,
                sizePx: 36,
                uppercase: false,
              }, "italic leading-none drop-shadow-xs")}
            </div>

            <div>
              {renderLayer(2, lines[2] || "SHORT HOLIDAY", {
                color: accentColor || "#C92A2A",
                font: "Anton, Oswald, sans-serif",
                weight: 900,
                sizePx: 20,
                uppercase: true,
              }, "uppercase tracking-tight text-center block")}
            </div>

            <div className="bg-white text-black p-2 shadow-md rounded-none text-center w-full max-w-[85%]">
              {renderLayer(3, lines[3] || "HAIRSTYLES FOR WOMEN WITH BOBS AND PIXIES", {
                color: "#111111",
                font: primaryFont,
                weight: 700,
                sizePx: 11,
                uppercase: true,
              }, "leading-tight block uppercase")}
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
          <div className="flex flex-col items-center space-y-1.5 max-w-[90%] text-center">
            {lines.map((line, idx) => (
              <div
                key={idx}
                className="bg-white/95 px-3 py-1 shadow-lg"
              >
                {renderLayer(idx, line, {
                  color: idx === 1 ? accentColor : "#111111",
                  font: primaryFont,
                  weight: 900,
                  sizePx: 16,
                  uppercase: true,
                }, "tracking-tight uppercase")}
              </div>
            ))}
          </div>
        )}

        {/* ============================================================== */}
        {/* ARCHETYPE: BLACK BOXES                                         */}
        {/* ============================================================== */}
        {blockStyle === "black-boxes" && (
          <div className="flex flex-col items-center space-y-1.5 max-w-[90%] text-center">
            {lines.map((line, idx) => (
              <div
                key={idx}
                className="bg-black/95 px-3.5 py-1.5 shadow-xl border border-white/20"
              >
                {renderLayer(idx, line, {
                  color: idx === 1 ? accentColor : "#FFFFFF",
                  font: primaryFont,
                  weight: 900,
                  sizePx: 16,
                  uppercase: true,
                }, "tracking-tight uppercase")}
              </div>
            ))}
          </div>
        )}

        {/* ============================================================== */}
        {/* ARCHETYPE: COLOR BAND CARD                                     */}
        {/* ============================================================== */}
        {blockStyle === "color-band-card" && (
          <div
            className="w-full py-4 px-5 shadow-2xl flex flex-col items-center text-center space-y-1.5 relative border-y border-white/20"
            style={{ backgroundColor: bandColor || "rgba(0,0,0,0.85)" }}
          >
            <div className="flex items-center gap-2">
              {renderLayer(0, badgeText || lines[0] || "20+", {
                color: accentColor,
                font: primaryFont,
                weight: 900,
                sizePx: 18,
              }, "tracking-tight")}
              {renderLayer(1, scriptWord || lines[1] || "Trendy", {
                color: "#FFFFFF",
                font: "Kaushan Script, Caveat, cursive",
                italic: true,
                sizePx: 22,
                uppercase: false,
              }, "")}
            </div>
            {renderLayer(2, lines[2] || "OUTFIT INSPIRATION", {
              color: "#FFFFFF",
              font: "Anton, Oswald, sans-serif",
              weight: 900,
              sizePx: 22,
              uppercase: true,
            }, "tracking-wide leading-tight")}
            {lines[3] && renderLayer(3, lines[3], {
              color: "#EEEEEE",
              font: primaryFont,
              weight: 600,
              sizePx: 11,
              uppercase: false,
            }, "leading-tight opacity-90")}
          </div>
        )}

        {/* ============================================================== */}
        {/* ARCHETYPE: MAGAZINE EDITORIAL                                  */}
        {/* ============================================================== */}
        {blockStyle === "magazine-editorial" && (
          <div className="bg-[#FFFFFFf2] text-black p-4 shadow-2xl rounded-xs w-full max-w-[88%] flex flex-col items-center text-center space-y-2 border border-black/15 backdrop-blur-xs">
            <div className="w-full flex items-center justify-between border-b border-black/15 pb-1 text-[8px] font-bold tracking-widest uppercase text-black/70 font-mono">
              {renderLayer(0, kicker || "EDITORIAL", {
                color: "#444444",
                font: "monospace",
                weight: 700,
                sizePx: 8,
                uppercase: true,
              }, "font-mono uppercase")}
              <span>ISSUE #{badgeText || "01"}</span>
            </div>

            <div>
              {renderLayer(1, lines.slice(0, 3).join(" "), {
                color: "#111111",
                font: "Didot, Bodoni MT, serif",
                weight: 900,
                sizePx: 16,
                uppercase: true,
              }, "leading-snug tracking-tight uppercase block")}
            </div>

            <div className="w-8 h-[2px] rounded-full" style={{ backgroundColor: accentColor }} />

            <div>
              {renderLayer(2, lines[3] || "Exclusive Guide & Ideas", {
                color: "#333333",
                font: "Playfair Display, serif",
                italic: true,
                sizePx: 10,
                uppercase: false,
              }, "italic")}
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
            {renderLayer(0, kicker || "SPOTLIGHT", {
              color: accentColor,
              font: primaryFont,
              weight: 700,
              sizePx: 9,
              uppercase: true,
            }, "tracking-widest uppercase mb-1 block")}
            {renderLayer(1, lines.join(" "), {
              color: "#FFFFFF",
              font: primaryFont,
              weight: 900,
              sizePx: 14,
              uppercase: true,
            }, "leading-snug uppercase tracking-tight block")}
          </div>
        )}

        {/* ============================================================== */}
        {/* ARCHETYPE: SCRIPT ACCENT                                       */}
        {/* ============================================================== */}
        {blockStyle === "script-accent" && (
          <div className="bg-white/95 text-black p-3.5 shadow-xl rounded-none w-full max-w-[88%] flex flex-col items-center text-center space-y-1 border border-black/10">
            {renderLayer(0, scriptWord || "Inspo", {
              color: accentColor,
              font: "Great Vibes, Dancing Script, cursive",
              italic: true,
              sizePx: 28,
              uppercase: false,
            }, "italic leading-none block")}
            {renderLayer(1, lines.slice(0, 3).join(" "), {
              color: "#111111",
              font: primaryFont,
              weight: 900,
              sizePx: 14,
              uppercase: true,
            }, "tracking-tight uppercase block")}
          </div>
        )}

        {/* ============================================================== */}
        {/* ARCHETYPE: BRUSH BANNER                                        */}
        {/* ============================================================== */}
        {blockStyle === "brush-banner" && (
          <div className="flex flex-col items-center text-center space-y-1.5 w-full max-w-[90%]">
            <div className="bg-white text-black px-3 py-1 shadow-sm">
              {renderLayer(0, lines.slice(0, 2).join(" "), {
                color: "#111111",
                font: primaryFont,
                weight: 900,
                sizePx: 13,
                uppercase: true,
              }, "tracking-tight uppercase block")}
            </div>
            <div
              className="px-4 py-1 rounded-xs shadow-md transform -rotate-1 border border-black/10 text-white"
              style={{ backgroundColor: accentColor }}
            >
              {renderLayer(1, lines[2] || scriptWord || "TRENDS 2026", {
                color: "#FFFFFF",
                font: primaryFont,
                weight: 900,
                sizePx: 12,
                uppercase: true,
              }, "tracking-wide uppercase block")}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* ARCHETYPE: STICKER OUTLINE                                     */}
        {/* ============================================================== */}
        {blockStyle === "sticker-outline" && (
          <div className="flex flex-col items-center text-center space-y-1 w-full max-w-[90%]">
            {lines.map((line, idx) => (
              <div key={idx} className="px-2 py-0.5">
                {renderLayer(idx, line, {
                  color: idx === 1 ? accentColor : "#FFFFFF",
                  font: primaryFont,
                  weight: 900,
                  sizePx: 15,
                  uppercase: true,
                  textShadow: "2px 2px 0 #111111, -2px -2px 0 #111111, 2px -2px 0 #111111, -2px 2px 0 #111111, 0 3px 6px rgba(0,0,0,0.8)",
                }, "tracking-tight uppercase")}
              </div>
            ))}
          </div>
        )}

        {/* Additional Custom User Text Layers (Added by user, position === 'over-band') */}
        {template.customTextLayers && template.customTextLayers.length > 4 && (
          <div className="w-full flex flex-col items-center gap-1.5 mt-2 pointer-events-auto">
            {template.customTextLayers.slice(4).filter((l) => l.role !== "website" && (!l.position || l.position === "over-band") && l.visible !== false).map((layer) => (
              renderCustomLayerElement(layer)
            ))}
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 4. FOOTER WEBSITE WATERMARK */}
      {/* ======================================================== */}
      {showWebsite && website && website.trim() !== "" && (
        <div
          onClick={() => template.onLayerClick?.(websiteLayer?.id || "layer-website")}
          className="absolute bottom-2 inset-x-0 flex justify-center z-20 cursor-pointer pointer-events-auto"
        >
          <span
            className="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-black/60 text-white/90 backdrop-blur-xs border border-white/10 transition-transform hover:scale-105"
            style={{
              fontFamily: websiteLayer?.fontFamily,
              color: websiteLayer?.color,
            }}
          >
            {website}
          </span>
        </div>
      )}
    </div>
  );
}
