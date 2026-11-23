"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Upload,
  Sparkles,
  Sliders,
  Palette,
  Type,
  Image as ImageIcon,
  Check,
  RotateCcw,
  Download,
  Save,
  Layers,
  ChevronDown,
  X,
  ExternalLink,
  Plus,
  Trash2,
  Loader2,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  RotateCw,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Wand2,
  RefreshCw,
  Copy,
  ArrowUp,
  ArrowDown,
  Maximize2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import {
  PinTemplateVisualPreview,
  TemplatePreviewData,
  ImageSlotAdjustment,
  TextLayerAdjustment,
} from "./PinTemplateVisualPreview";

export const POPULAR_FONTS = [
  { id: "Montserrat, sans-serif", label: "Montserrat (Clean Sans)" },
  { id: "Josefin Sans, sans-serif", label: "Josefin Sans (AutoPinDesign Studio)" },
  { id: "Anton, Oswald, sans-serif", label: "Anton (High-CTR Bold Condensed)" },
  { id: "Playfair Display, Georgia, serif", label: "Playfair Display (Luxury Editorial)" },
  { id: "Kaushan Script, cursive", label: "Kaushan Script (Vibrant Cursive)" },
  { id: "Great Vibes, cursive", label: "Great Vibes (Flowing Accent)" },
  { id: "Didot, Bodoni MT, serif", label: "Didot / Bodoni (High Fashion)" },
  { id: "Oswald, sans-serif", label: "Oswald (Grotesque Caps)" },
  { id: "Cinzel, serif", label: "Cinzel (Classic Roman)" },
  { id: "Dancing Script, cursive", label: "Dancing Script (Lively Calligraphy)" },
  { id: "Caveat, cursive", label: "Caveat (Organic Marker Hand)" },
  { id: "Poppins, sans-serif", label: "Poppins (Clean Geometric)" },
  { id: "Inter, sans-serif", label: "Inter (Minimalist Swiss Sans)" },
];

export const COLOR_SWATCHES = [
  "#FFFFFF",
  "#111111",
  "#EE1A5B", // Hot Pink
  "#FF5C8D", // Soft Pink
  "#F59E0B", // Amber Gold
  "#10B981", // Emerald
  "#6366F1", // Indigo
  "#8B5CF6", // Purple
  "#EC4899", // Rose
  "#06B6D4", // Cyan
  "#84CC16", // Lime
  "#F4EAE0", // Warm Beige
  "#758169", // Sage Olive
  "#1F1A17", // Deep Dark Slate
  "#E2E8F0", // Slate White
];

export const ASPECT_RATIO_PRESETS = [
  { id: "2:3", label: "2:3", desc: "Pinterest Standard", w: 1000, h: 1500 },
  { id: "3:4", label: "3:4", desc: "Classic Vertical", w: 900, h: 1200 },
  { id: "4:5", label: "4:5", desc: "Portrait Post", w: 1080, h: 1350 },
  { id: "9:16", label: "9:16", desc: "Story / Idea Pin", w: 1080, h: 1920 },
  { id: "1:1", label: "1:1", desc: "Square Pin", w: 1000, h: 1000 },
  { id: "1:2", label: "1:2", desc: "Tall Listicle", w: 736, h: 1472 },
  { id: "custom", label: "+ Custom", desc: "Custom Dimensions", w: 1000, h: 1500 },
];

interface PresetCustomizerEditorProps {
  initialTemplate?: TemplatePreviewData | null;
  initialTemplateId?: string;
  onApplyAI?: (config: {
    templateId: string;
    prompt: string;
    headline: string;
    customFont: string;
    textColor: string;
    accentColor: string;
    bandColor: string;
    badgeBg: string;
    badgeText: string;
  }) => void;
  onSavePinSuccess?: (pin: any) => void;
  className?: string;
  compact?: boolean;
}

// Curated Collage Layout Patterns by Image Quantity
export const COLLAGE_PATTERNS_BY_COUNT: Record<number, { id: string; label: string; desc: string }[]> = {
  1: [
    { id: "default", label: "Full Bleed", desc: "100% canvas coverage" },
    { id: "single-framed", label: "Framed Inset", desc: "Elegant border frame" },
    { id: "single-hero-top", label: "Hero Top", desc: "72% photo + colored base" },
  ],
  2: [
    { id: "default", label: "Split Columns", desc: "50/50 side-by-side" },
    { id: "two-rows", label: "Stacked Rows", desc: "Top & bottom halves" },
    { id: "two-asymmetric", label: "60/40 Hero", desc: "Left hero + right column" },
    { id: "two-hero-top", label: "Top Hero 65/35", desc: "Top hero + bottom strip" },
  ],
  3: [
    { id: "default", label: "Top Hero + 2", desc: "1 Top hero + 2 bottom split" },
    { id: "three-hero-bottom", label: "2 Top + Hero", desc: "2 Top split + 1 bottom hero" },
    { id: "three-hero-left", label: "Left Hero + 2", desc: "1 Left hero + 2 right stack" },
    { id: "three-cols", label: "3 Columns", desc: "3 Vertical panels" },
    { id: "three-rows", label: "3 Rows", desc: "3 Horizontal stacks" },
  ],
  4: [
    { id: "default", label: "2x2 Quad Grid", desc: "4 Equal quadrants" },
    { id: "four-hero-top", label: "1 Top + 3 Cols", desc: "Top hero + 3 bottom cols" },
    { id: "four-hero-left", label: "1 Left + 3 Stack", desc: "Left hero + 3 right rows" },
    { id: "four-cols", label: "4 Columns", desc: "4 Vertical slices" },
    { id: "four-rows", label: "4 Rows", desc: "4 Horizontal rows" },
  ],
  5: [
    { id: "default", label: "2 Top + 3 Bottom", desc: "2 Hero top + 3 bottom split" },
    { id: "five-top3-bottom2", label: "3 Top + 2 Bottom", desc: "3 Top split + 2 bottom hero" },
    { id: "five-hero-top", label: "1 Top + 4 Grid", desc: "1 Wide hero + 2x2 grid" },
    { id: "five-hero-left", label: "1 Left + 4 Grid", desc: "1 Tall hero + 2x2 grid" },
  ],
  6: [
    { id: "default", label: "2x3 Grid", desc: "2 Columns x 3 rows" },
    { id: "six-grid-3x2", label: "3x2 Grid", desc: "3 Columns x 2 rows" },
    { id: "six-top2-bottom4", label: "2 Top + 4 Grid", desc: "2 Top hero + 2x2 grid" },
    { id: "six-hero-top", label: "1 Top + 5 Gallery", desc: "1 Big hero + 5 bottom row" },
  ],
};

export function PresetCustomizerEditor({
  initialTemplate,
  initialTemplateId,
  onApplyAI,
  onSavePinSuccess,
  className = "",
  compact = false,
}: PresetCustomizerEditorProps) {
  // Navigation Tabs: Design | Images | Text | Layers (matching screenshots 1, 3, 4)
  const [activeTab, setActiveTab] = useState<"design" | "images" | "text" | "layers">("design");

  // Active Template
  const [template, setTemplate] = useState<TemplatePreviewData>(
    initialTemplate || {
      id: "sb-pink-combat-boots",
      name: "Script & Bar — Pink Number, \"Trendy\" & Pink Bar",
      layoutId: "two-side",
      primaryCategory: "Fashion & Style",
      imageCount: 4,
      aspectRatio: "1:2",
      fonts: ["Anton", "Kaushan Script", "Montserrat"],
      colors: ["#FF2E93", "#111111", "#FFFFFF"],
      layerTexts: ["20", "Trendy", "COMBAT BOOT OUTFITS", "YOU CAN'T GET AROUND RIGHT NOW"],
      visualConfig: {
        badge: { text: "20", shape: "number-accent", bg: "#FF2E93", color: "#FF2E93" },
        blockStyle: "script-and-bar",
        bandColor: "#FF2E93",
        accentColor: "#FF2E93",
        scriptWord: "Trendy",
        photoTheme: "fashion",
      },
    }
  );

  // Available studio templates for instant switching
  const [studioTemplates, setStudioTemplates] = useState<TemplatePreviewData[]>([]);

  useEffect(() => {
    async function loadStudioTemplates() {
      try {
        const res = await fetch("/api/templates/studio");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setStudioTemplates(json.data);
          const targetId = initialTemplateId || initialTemplate?.id;
          if (targetId) {
            const match = json.data.find((t: TemplatePreviewData) => t.id === targetId);
            if (match) {
              setTemplate(match);
              initializeFromTemplate(match);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load studio templates:", err);
      }
    }
    loadStudioTemplates();
  }, [initialTemplateId, initialTemplate?.id]);

  // -------------------------------------------------------------
  // TAB 1: DESIGN STATE (Screenshots 1 & 2)
  // -------------------------------------------------------------
  const [canvasRatio, setCanvasRatio] = useState<"2:3" | "3:4" | "4:5" | "9:16" | "1:1" | "1:2" | "custom">(
    (template.aspectRatio as any) || "2:3"
  );
  const [customWidth, setCustomWidth] = useState<number>(1000);
  const [customHeight, setCustomHeight] = useState<number>(1500);

  // Overlay Placement State
  const [overlayOffsetY, setOverlayOffsetY] = useState<number>(50);
  const [overlayHorizontalAlign, setOverlayHorizontalAlign] = useState<"left" | "center" | "right">("center");

  // Background state
  const [bgType, setBgType] = useState<"solid" | "gradient" | "image" | "transparent">("solid");
  const [bgColor, setBgColor] = useState<string>("#FFFFFF");
  const [bgGradientStart, setBgGradientStart] = useState<string>("#EE1A5B");
  const [bgGradientEnd, setBgGradientEnd] = useState<string>("#8B5CF6");

  // Grid & Guides
  const [snapToElements, setSnapToElements] = useState<boolean>(true);

  // Border & Frame
  const [borderColor, setBorderColor] = useState<string>("#FFFFFF");
  const [borderWidth, setBorderWidth] = useState<number>(0);
  const [cornerRadius, setCornerRadius] = useState<number>(0);
  const [collageGap, setCollageGap] = useState<number>(template.collageGap ?? 8);

  // -------------------------------------------------------------
  // TAB 2: IMAGES STATE (Per-Slot Separate Settings - Screenshot 3)
  // -------------------------------------------------------------
  const initialSlotCount = template.imageCount || (template.layoutId === "single" ? 1 : template.layoutId?.includes("two") ? 2 : template.layoutId?.includes("three") ? 3 : template.layoutId?.includes("5") ? 5 : template.layoutId?.includes("6") ? 6 : 4);
  const [imageCount, setImageCount] = useState<number>(initialSlotCount);
  const [collagePattern, setCollagePattern] = useState<string>("default");
  const slotCount = imageCount;
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(0);
  const [slotAdjustments, setSlotAdjustments] = useState<Record<number, ImageSlotAdjustment>>({});
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);
  const slotFileInputRef = useRef<HTMLInputElement>(null);

  // -------------------------------------------------------------
  // TAB 3: TEXT STATE (Per-Layer Typography - Screenshots 4 & 5)
  // -------------------------------------------------------------
  const [textLayers, setTextLayers] = useState<TextLayerAdjustment[]>([
    {
      id: "layer-badge",
      text: template.visualConfig?.badge?.text || "50",
      role: "badge",
      fontFamily: "Josefin Sans, sans-serif",
      fontWeight: "Bold",
      fontSizePx: 56,
      isBold: true,
      isItalic: false,
      isUnderline: false,
      isUppercase: true,
      textAlign: "center",
      color: "#111111",
      bgHighlight: "#FFFFFF",
      shape: "square",
      position: "center-top",
      visible: true,
    },
    {
      id: "layer-title-1",
      text: template.layerTexts?.[1] || "Easy Lob",
      role: "title",
      fontFamily: "Josefin Sans, sans-serif",
      fontWeight: "SemiBold",
      fontSizePx: 42,
      isBold: true,
      isItalic: false,
      isUnderline: false,
      isUppercase: true,
      textAlign: "center",
      color: "#111111",
      bgHighlight: "#FFFFFF",
      shape: "rounded",
      position: "over-band",
      visible: true,
    },
    {
      id: "layer-title-2",
      text: template.layerTexts?.[2] || "Haircut to Inspire You",
      role: "title",
      fontFamily: "Josefin Sans, sans-serif",
      fontWeight: "SemiBold",
      fontSizePx: 36,
      isBold: true,
      isItalic: false,
      isUnderline: false,
      isUppercase: true,
      textAlign: "center",
      color: "#FFFFFF",
      bgHighlight: template.visualConfig?.accentColor || "#EE1A5B",
      shape: "rounded",
      position: "over-band",
      visible: true,
    },
    {
      id: "layer-subtitle",
      text: template.layerTexts?.[3] || "The looks everyone is saving",
      role: "subtitle",
      fontFamily: "Josefin Sans, sans-serif",
      fontWeight: "Regular",
      fontSizePx: 20,
      isBold: false,
      isItalic: true,
      isUnderline: false,
      isUppercase: false,
      textAlign: "center",
      color: "#FFFFFF",
      bgHighlight: "transparent",
      shape: "none",
      position: "over-band",
      visible: true,
    },
    {
      id: "layer-website",
      text: "yourwebsite.com",
      role: "website",
      fontFamily: "Montserrat, sans-serif",
      fontWeight: "Regular",
      fontSizePx: 14,
      isBold: false,
      isItalic: false,
      isUnderline: false,
      isUppercase: false,
      textAlign: "center",
      color: "#FFFFFF",
      bgHighlight: "transparent",
      shape: "none",
      position: "over-image",
      visible: true,
    },
  ]);

  const [selectedLayerId, setSelectedLayerId] = useState<string>("layer-badge");

  // AI Assistant Drawer / Prompt state
  const [showAiTextModal, setShowAiTextModal] = useState<boolean>(false);
  const [aiTopicInput, setAiTopicInput] = useState<string>(template.headlinePreview || template.name);
  const [aiGeneratingCopy, setAiGeneratingCopy] = useState<boolean>(false);

  // Save / Generation States
  const [generatingPin, setGeneratingPin] = useState<boolean>(false);
  const [savedSuccessMsg, setSavedSuccessMsg] = useState<string | null>(null);

  // Initialize all controls when switching template
  function initializeFromTemplate(t: TemplatePreviewData) {
    if (t.aspectRatio) setCanvasRatio(t.aspectRatio as any);
    if (t.visualConfig?.bandColor) setBgColor(t.visualConfig.bandColor);
    if (t.collageGap !== undefined) setCollageGap(t.collageGap);
    const resolvedCount = t.imageCount || (t.layoutId === "single" ? 1 : t.layoutId?.includes("two") ? 2 : t.layoutId?.includes("three") ? 3 : t.layoutId?.includes("5") ? 5 : t.layoutId?.includes("6") ? 6 : 4);
    setImageCount(resolvedCount);
    setCollagePattern(t.collagePattern || "default");

    const raw = t.layerTexts && t.layerTexts.length > 0
      ? t.layerTexts
      : (t.headlinePreview || t.name).split(" ").filter(Boolean);

    const defaultFont = t.fonts?.[0] || "Josefin Sans, sans-serif";
    const accentCol = t.visualConfig?.accentColor || "#EE1A5B";

    const layers: TextLayerAdjustment[] = [];

    // Slot 0: Badge or First Word/Number
    const bText = t.visualConfig?.badge?.text || raw[0] || "20";
    layers.push({
      id: "layer-badge",
      text: bText,
      role: "badge",
      fontFamily: defaultFont,
      fontWeight: "Bold",
      fontSizePx: 48,
      isBold: true,
      isItalic: false,
      isUnderline: false,
      isUppercase: true,
      textAlign: "center",
      color: accentCol,
      bgHighlight: "#FFFFFF",
      shape: (t.visualConfig?.badge?.shape as any) || "square",
      position: "center-top",
      visible: true,
      letterSpacing: "normal",
      lineHeight: 1.1,
      opacity: 1,
    });

    // Slots 1 to N: Title and subtitle lines
    if (raw.length > 1) {
      for (let i = 1; i < raw.length; i++) {
        const txt = raw[i];
        if (!txt) continue;
        const isScript = Boolean(t.visualConfig?.scriptWord && txt.toLowerCase() === t.visualConfig.scriptWord.toLowerCase());
        layers.push({
          id: `layer-${i}`,
          text: txt,
          role: i === 1 ? "title" : i === 2 ? "title" : i === 3 ? "subtitle" : "kicker",
          fontFamily: isScript ? "Kaushan Script, Dancing Script, cursive" : defaultFont,
          fontWeight: i === 1 || i === 2 ? "SemiBold" : "Regular",
          fontSizePx: i === 1 ? 38 : i === 2 ? 30 : i === 3 ? 18 : 13,
          isBold: i === 1 || i === 2,
          isItalic: isScript || i === 3,
          isUnderline: false,
          isUppercase: !isScript && i !== 3,
          textAlign: "center",
          color: i === 1 ? "#111111" : i === 2 ? "#FFFFFF" : "#111111",
          bgHighlight: i === 1 ? "#FFFFFF" : i === 2 ? accentCol : "transparent",
          shape: i === 1 || i === 2 ? "rounded" : "none",
          position: "over-band",
          visible: true,
          letterSpacing: "normal",
          lineHeight: 1.15,
          opacity: 1,
        });
      }
    } else {
      layers.push({
        id: "layer-title-1",
        text: "Trendy Ideas",
        role: "title",
        fontFamily: defaultFont,
        fontWeight: "Bold",
        fontSizePx: 38,
        isBold: true,
        isItalic: false,
        isUnderline: false,
        isUppercase: true,
        textAlign: "center",
        color: "#111111",
        bgHighlight: "#FFFFFF",
        shape: "rounded",
        position: "over-band",
        visible: true,
        letterSpacing: "normal",
        lineHeight: 1.15,
        opacity: 1,
      });
      layers.push({
        id: "layer-title-2",
        text: "For This Season",
        role: "title",
        fontFamily: defaultFont,
        fontWeight: "SemiBold",
        fontSizePx: 30,
        isBold: true,
        isItalic: false,
        isUnderline: false,
        isUppercase: true,
        textAlign: "center",
        color: "#FFFFFF",
        bgHighlight: accentCol,
        shape: "rounded",
        position: "over-band",
        visible: true,
        letterSpacing: "normal",
        lineHeight: 1.2,
        opacity: 1,
      });
      layers.push({
        id: "layer-subtitle",
        text: "You Can't Miss Out Right Now",
        role: "subtitle",
        fontFamily: defaultFont,
        fontWeight: "Regular",
        fontSizePx: 18,
        isBold: false,
        isItalic: true,
        isUnderline: false,
        isUppercase: false,
        textAlign: "center",
        color: "#111111",
        bgHighlight: "transparent",
        shape: "none",
        position: "over-band",
        visible: true,
        letterSpacing: "normal",
        lineHeight: 1.2,
        opacity: 1,
      });
    }

    // Always website watermark layer
    layers.push({
      id: "layer-website",
      text: "yourwebsite.com",
      role: "website",
      fontFamily: "Montserrat, sans-serif",
      fontWeight: "Regular",
      fontSizePx: 13,
      isBold: false,
      isItalic: false,
      isUnderline: false,
      isUppercase: false,
      textAlign: "center",
      color: "#FFFFFF",
      bgHighlight: "transparent",
      shape: "none",
      position: "over-image",
      visible: true,
      letterSpacing: "wider",
      lineHeight: 1.2,
      opacity: 1,
    });

    setTextLayers(layers);
    setSelectedLayerId(layers[0]?.id || "");
  }

  function handleSwitchTemplate(tId: string) {
    const found = studioTemplates.find((t) => t.id === tId);
    if (!found) return;
    setTemplate(found);
    initializeFromTemplate(found);
  }

  // -------------------------------------------------------------
  // PER-SLOT IMAGE ADJUSTMENT HANDLERS
  // -------------------------------------------------------------
  async function handleSlotUpload(e: React.ChangeEvent<HTMLInputElement>, slotIdx: number) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingSlot(slotIdx);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json();
      const finalUrl = json.success && json.url ? json.url : await readDataUrl(file);

      setSlotAdjustments((prev) => ({
        ...prev,
        [slotIdx]: {
          ...(prev[slotIdx] || { zoom: 1, panX: 0, panY: 0, fit: "cover", brightness: 100, contrast: 100, saturation: 100, rotation: 0 }),
          url: finalUrl,
        },
      }));
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploadingSlot(null);
    }
  }

  function readDataUrl(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }

  function updateSlotAdjustment(slotIdx: number, updates: Partial<ImageSlotAdjustment>) {
    setSlotAdjustments((prev) => ({
      ...prev,
      [slotIdx]: {
        ...(prev[slotIdx] || { zoom: 1, panX: 0, panY: 0, fit: "cover", brightness: 100, contrast: 100, saturation: 100, rotation: 0 }),
        ...updates,
      },
    }));
  }

  function handleSwapSlots(fromSlot: number, toSlot: number) {
    setSlotAdjustments((prev) => {
      const copy = { ...prev };
      const temp = copy[fromSlot];
      copy[fromSlot] = copy[toSlot];
      copy[toSlot] = temp;
      return copy;
    });
  }

  
  function handleAddSlot() {
    if (imageCount >= 6) return;
    const newCount = imageCount + 1;
    setImageCount(newCount);
    setSelectedSlotIndex(newCount - 1);
  }

  function handleRemoveSlot(slotIdxToRemove?: number) {
    if (imageCount <= 1) return;
    const targetIdx = slotIdxToRemove !== undefined ? slotIdxToRemove : imageCount - 1;
    setSlotAdjustments((prev) => {
      const copy: Record<number, ImageSlotAdjustment> = {};
      let newI = 0;
      for (let i = 0; i < imageCount; i++) {
        if (i === targetIdx) continue;
        if (prev[i]) copy[newI] = prev[i];
        newI++;
      }
      return copy;
    });
    const newCount = imageCount - 1;
    setImageCount(newCount);
    if (selectedSlotIndex !== null && selectedSlotIndex >= newCount) {
      setSelectedSlotIndex(newCount - 1);
    }
  }

  function handleClearSlot(slotIdx: number) {
    setSlotAdjustments((prev) => {
      const copy = { ...prev };
      delete copy[slotIdx];
      return copy;
    });
  }

  // -------------------------------------------------------------
  // PER-LAYER TYPOGRAPHY HANDLERS
  // -------------------------------------------------------------
  const activeLayer = textLayers.find((l) => l.id === selectedLayerId) || textLayers[0];
  const badgeLayer = textLayers.find((l) => l.role === "badge") || textLayers[0];

  function updateActiveLayer(updates: Partial<TextLayerAdjustment>) {
    const targetId = selectedLayerId || textLayers[0]?.id;
    setTextLayers((prev) =>
      prev.map((l) => (l.id === targetId ? { ...l, ...updates } : l))
    );
  }

  function updateBadgeLayer(updates: Partial<TextLayerAdjustment>) {
    const targetId = badgeLayer?.id || "layer-badge";
    setTextLayers((prev) =>
      prev.map((l) => (l.id === targetId ? { ...l, ...updates } : l))
    );
  }

  function handleAddTextLayer() {
    const newId = `layer-${Date.now()}`;
    const newLayer: TextLayerAdjustment = {
      id: newId,
      text: "New Text Layer",
      role: "title",
      fontFamily: "Josefin Sans, sans-serif",
      fontWeight: "SemiBold",
      fontSizePx: 28,
      isBold: true,
      isItalic: false,
      isUnderline: false,
      isUppercase: false,
      textAlign: "center",
      color: "#FFFFFF",
      bgHighlight: "#111111",
      shape: "rounded",
      position: "over-image",
      visible: true,
    };
    setTextLayers((prev) => [...prev, newLayer]);
    setSelectedLayerId(newId);
  }

  function handleRemoveLayer(layerId: string) {
    if (textLayers.length <= 1) return;
    setTextLayers((prev) => prev.filter((l) => l.id !== layerId));
    if (selectedLayerId === layerId) {
      setSelectedLayerId(textLayers[0]?.id || "");
    }
  }

  function handleMoveLayer(index: number, direction: "up" | "down" | "top" | "bottom") {
    setTextLayers((prev) => {
      const arr = [...prev];
      const target = arr[index];
      arr.splice(index, 1);
      if (direction === "up") arr.splice(Math.max(0, index - 1), 0, target);
      else if (direction === "down") arr.splice(Math.min(arr.length, index + 1), 0, target);
      else if (direction === "top") arr.unshift(target);
      else if (direction === "bottom") arr.push(target);
      return arr;
    });
  }

  // AI Text Copy Assistant Generator
  async function handleRunAiTextAssistant() {
    setAiGeneratingCopy(true);
    try {
      const res = await fetch("/api/prompt/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiTopicInput || "trending stylish ideas" }),
      });
      const json = await res.json();
      if (json.success && json.enhanced) {
        const words = json.enhanced.split(" ");
        const bText = String(Math.floor(Math.random() * 40) + 15);
        const t1 = words.slice(0, 3).join(" ") || "Trending Ideas";
        const t2 = words.slice(3, 7).join(" ") || "You Must Try";
        const sub = words.slice(7, 12).join(" ") || "The most popular aesthetic inspiration";

        setTextLayers((prev) =>
          prev.map((l) => {
            if (l.role === "badge") return { ...l, text: bText };
            if (l.id === "layer-title-1") return { ...l, text: t1 };
            if (l.id === "layer-title-2") return { ...l, text: t2 };
            if (l.role === "subtitle") return { ...l, text: sub };
            return l;
          })
        );
        setShowAiTextModal(false);
      }
    } catch (err) {
      console.error("AI Text Assistant failed:", err);
    } finally {
      setAiGeneratingCopy(false);
    }
  }

  // -------------------------------------------------------------
  // SAVE / GENERATE PIN ACTION
  // -------------------------------------------------------------
  async function handleGeneratePin() {
    setGeneratingPin(true);
    setSavedSuccessMsg(null);
    try {
      // Pick first uploaded image or slot image or placeholder
      const slot0 = slotAdjustments[0]?.url;
      const firstAvailableImg = slot0 || Object.values(slotAdjustments).find((s) => s?.url)?.url || "/placeholder.jpg";

      const titleText = textLayers.map((l) => l.text).filter(Boolean).join(" ");

      const res = await fetch("/api/pins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: firstAvailableImg,
          rawImageUrl: firstAvailableImg,
          title: titleText || template.name,
          description: `Customized with PinForge Studio Editor using ${template.name}.`,
          altText: titleText || template.name,
          targetKeyword: textLayers[1]?.text || template.primaryCategory || "pinterest ideas",
          hashtags: [
            template.primaryCategory?.toLowerCase().replace(/\s+/g, "") || "pininspo",
            "pinforge",
            "pinstudio",
          ],
          pinType: template.primaryCategory || "Custom Preset Pin",
          textMode: "canvas",
          overlayText: titleText,
          overlayJson: {
            presetId: template.id,
            canvasRatio,
            borderWidth,
            borderColor,
            cornerRadius,
            collageGap,
            bgType,
            bgColor,
            slotAdjustments,
            textLayers,
          },
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSavedSuccessMsg("Custom Pin created & saved to Library! 🎉");
        if (onSavePinSuccess) onSavePinSuccess(json.data);
      }
    } catch (err) {
      console.error("Failed to generate pin:", err);
    } finally {
      setGeneratingPin(false);
    }
  }

  // Composed Preview Object for PinTemplateVisualPreview
  const livePreviewData: TemplatePreviewData = useMemo(() => {
    const badgeL = textLayers.find((l) => l.role === "badge") || textLayers[0];
    return {
      ...template,
      imageCount,
      collagePattern,
      canvasRatio,
      customWidth,
      customHeight,
      bgType,
      bgColor,
      bgGradientStart,
      bgGradientEnd,
      borderColor,
      borderWidth,
      cornerRadius,
      collageGap,
      snapToElements,
      slotAdjustments,
      customTextLayers: textLayers,
      customLines: textLayers.filter((l) => l.role !== "website").map((l) => l.text),
      customBadgeText: badgeL?.text || "20",
      customBadgeShape: badgeL?.shape || "circle",
      customBadgePosition: (badgeL?.position || "top-left") as any,
      customBadgeBg: badgeL?.bgHighlight || template.visualConfig?.badge?.bg || "#EE1A5B",
      customBadgeColor: badgeL?.color || "#FFFFFF",
      onSlotClick: (idx) => {
        setSelectedSlotIndex(idx);
        setActiveTab("images");
      },
      onLayerClick: (layerId) => {
        setSelectedLayerId(layerId);
        setActiveTab("text");
      },
    };
  }, [
    template,
    imageCount,
    collagePattern,
    canvasRatio,
    customWidth,
    customHeight,
    bgType,
    bgColor,
    bgGradientStart,
    bgGradientEnd,
    borderColor,
    borderWidth,
    cornerRadius,
    collageGap,
    snapToElements,
    slotAdjustments,
    textLayers,
  ]);

  // Design Check warnings count
  const emptySlotsCount = Array.from({ length: slotCount }).filter(
    (_, i) => !slotAdjustments[i]?.url
  ).length;

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl ${className}`}>
      {/* Top Studio Header & Preset Switcher */}
      <div className="p-3.5 md:p-5 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-950/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-600/10 border border-red-500/20 text-red-500 flex items-center justify-center shrink-0">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">
                Pin Studio Editor & Layout Customizer
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                Live Dual-Sync
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Full editing for all {slotCount} image slots, separate per-word typography, canvas aspect ratio, and borders.
            </p>
          </div>
        </div>

        {/* Preset Selector Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 shrink-0 font-medium">Template:</span>
          <select
            value={template.id}
            onChange={(e) => handleSwitchTemplate(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-semibold focus:outline-none focus:border-red-500 max-w-[240px] truncate"
          >
            <option value={template.id}>{template.name}</option>
            {studioTemplates
              .filter((t) => t.id !== template.id)
              .map((t) => (
                <option key={t.id} value={t.id}>
                  {t.primaryCategory}: {t.name}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Editor Body: Left Sidebar (Controls) + Right Live Preview Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[700px]">
        {/* ======================================================== */}
        {/* LEFT COLUMN: AutoPinDesign Studio Sidebar (5 Cols)       */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 border-r border-slate-800 bg-[#121620] flex flex-col">
          {/* Top 4 Navigation Tabs (Design | Images | Text | Layers) */}
          <div className="grid grid-cols-4 border-b border-slate-800 bg-[#0e121a]">
            <button
              type="button"
              onClick={() => setActiveTab("design")}
              className={`py-3 text-xs font-bold transition-all relative flex flex-col items-center gap-1 cursor-pointer ${
                activeTab === "design"
                  ? "text-red-500 font-extrabold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>Design</span>
              {activeTab === "design" && (
                <div className="absolute bottom-0 inset-x-0 h-[2.5px] bg-red-500" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("images")}
              className={`py-3 text-xs font-bold transition-all relative flex flex-col items-center gap-1 cursor-pointer ${
                activeTab === "images"
                  ? "text-red-500 font-extrabold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>Images</span>
              {activeTab === "images" && (
                <div className="absolute bottom-0 inset-x-0 h-[2.5px] bg-red-500" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("text")}
              className={`py-3 text-xs font-bold transition-all relative flex flex-col items-center gap-1 cursor-pointer ${
                activeTab === "text"
                  ? "text-red-500 font-extrabold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>Text</span>
              {activeTab === "text" && (
                <div className="absolute bottom-0 inset-x-0 h-[2.5px] bg-red-500" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("layers")}
              className={`py-3 text-xs font-bold transition-all relative flex flex-col items-center gap-1 cursor-pointer ${
                activeTab === "layers"
                  ? "text-red-500 font-extrabold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>Layers</span>
              {activeTab === "layers" && (
                <div className="absolute bottom-0 inset-x-0 h-[2.5px] bg-red-500" />
              )}
            </button>
          </div>

          {/* Tab Content Panels (Scrollable) */}
          <div className="p-4 md:p-5 flex-1 overflow-y-auto space-y-5">
            {/* ------------------------------------------------------------- */}
            {/* TAB 1: DESIGN (Screenshots 1 & 2)                             */}
            {/* ------------------------------------------------------------- */}
            {activeTab === "design" && (
              <div className="space-y-5">
                {/* Canvas Size Section */}
                <div className="space-y-3">
                  <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Canvas Size</h3>
                  {/* Preset Dropdown */}
                  <select
                    value={canvasRatio}
                    onChange={(e) => setCanvasRatio(e.target.value as any)}
                    className="w-full bg-[#171d2b] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-red-500"
                  >
                    {ASPECT_RATIO_PRESETS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.desc} ({p.w} × {p.h})
                      </option>
                    ))}
                  </select>

                  {/* Quick Ratio Icon Buttons */}
                  <div className="grid grid-cols-4 gap-2">
                    {ASPECT_RATIO_PRESETS.slice(0, 7).map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setCanvasRatio(p.id as any)}
                        className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                          canvasRatio === p.id
                            ? "border-red-500 bg-red-500/10 text-red-400 shadow-sm"
                            : "border-slate-800 bg-[#161c28] text-slate-400 hover:border-slate-700 hover:text-slate-200"
                        }`}
                      >
                        <div
                          className={`border rounded-xs mb-1 ${
                            p.id === "1:1"
                              ? "w-4 h-4 border-current"
                              : p.id === "1:2"
                              ? "w-2.5 h-5 border-current"
                              : p.id === "9:16"
                              ? "w-3 h-5 border-current"
                              : "w-3.5 h-5 border-current"
                          }`}
                        />
                        <span className="text-[10px] font-bold">{p.label}</span>
                      </button>
                    ))}
                  </div>

                  <p className="text-[11px] text-slate-500 leading-tight">
                    Resizing re-flows the collage and scales other layers. Undo to revert.
                  </p>
                </div>

                {/* Background Section */}
                <div className="space-y-3 pt-3 border-t border-slate-800">
                  <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Background</h3>
                  {/* Segmented Control */}
                  <div className="grid grid-cols-4 bg-[#0d1118] p-1 rounded-xl border border-slate-800">
                    {(["solid", "gradient", "image", "transparent"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setBgType(t)}
                        className={`py-1 rounded-lg text-[11px] font-bold capitalize transition-all cursor-pointer ${
                          bgType === t ? "bg-[#202738] text-white shadow-xs" : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  {bgType === "solid" && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-300">
                        <span>Color</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={bgColor}
                            onChange={(e) => setBgColor(e.target.value)}
                            className="w-6 h-6 rounded cursor-pointer border border-slate-700 bg-transparent"
                          />
                          <span className="font-mono text-xs text-slate-400">{bgColor}</span>
                        </div>
                      </div>
                      {/* Quick Swatches */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {COLOR_SWATCHES.slice(0, 10).map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setBgColor(c)}
                            className="w-5 h-5 rounded-full border border-slate-700 hover:scale-110 transition-transform"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {bgType === "gradient" && (
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                      <div>
                        <span>Color 1</span>
                        <input
                          type="color"
                          value={bgGradientStart}
                          onChange={(e) => setBgGradientStart(e.target.value)}
                          className="w-full h-8 rounded mt-1 cursor-pointer border border-slate-700 bg-transparent"
                        />
                      </div>
                      <div>
                        <span>Color 2</span>
                        <input
                          type="color"
                          value={bgGradientEnd}
                          onChange={(e) => setBgGradientEnd(e.target.value)}
                          className="w-full h-8 rounded mt-1 cursor-pointer border border-slate-700 bg-transparent"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Grid & Guides */}
                <div className="space-y-3 pt-3 border-t border-slate-800">
                  <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Grid & Guides</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block">Snap to Elements</span>
                      <span className="text-[11px] text-slate-500">Guides are never exported.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSnapToElements(!snapToElements)}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                        snapToElements ? "bg-red-500" : "bg-slate-700"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                          snapToElements ? "left-6" : "left-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Border & Frame (Screenshot 2) */}
                <div className="space-y-3.5 pt-3 border-t border-slate-800">
                  <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Border & Frame</h3>

                  {/* Border color */}
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>Border color</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={borderColor}
                        onChange={(e) => setBorderColor(e.target.value)}
                        className="w-6 h-6 rounded cursor-pointer border border-slate-700 bg-transparent"
                      />
                      <span className="font-mono text-xs text-slate-400">{borderColor}</span>
                    </div>
                  </div>

                  {/* Border width slider */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300">Border width</span>
                      <span className="font-mono text-slate-400 text-[11px]">{borderWidth} px</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={30}
                      value={borderWidth}
                      onChange={(e) => setBorderWidth(Number(e.target.value))}
                      className="w-full accent-red-500 cursor-pointer"
                    />
                  </div>

                  {/* Corner radius slider */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300">Corner radius</span>
                      <span className="font-mono text-slate-400 text-[11px]">{cornerRadius} px</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={40}
                      value={cornerRadius}
                      onChange={(e) => setCornerRadius(Number(e.target.value))}
                      className="w-full accent-red-500 cursor-pointer"
                    />
                  </div>

                  {/* Gap between images slider */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300">Gap between images</span>
                      <span className="font-mono text-slate-400 text-[11px]">{collageGap} px</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={32}
                      value={collageGap}
                      onChange={(e) => setCollageGap(Number(e.target.value))}
                      className="w-full accent-red-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Design Check (Screenshot 2) */}
                <div className="space-y-2 pt-3 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Design Check</h3>
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-[11px] font-bold flex items-center justify-center">
                      {emptySlotsCount}
                    </span>
                  </div>
                  {emptySlotsCount > 0 ? (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">Empty frame slots</span>
                        <span className="text-[11px] text-amber-300/80">
                          {emptySlotsCount} of {slotCount} image slots still need a photo or AI generation.
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="font-bold">All {slotCount} image slots populated & verified!</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* TAB 2: IMAGES (Collage Layout Patterns & Per-Slot Settings)   */}
            {/* ------------------------------------------------------------- */}
            {activeTab === "images" && (
              <div className="space-y-4">
                {/* 1. COLLAGE QUANTITY & PATTERN SELECTOR */}
                <div className="p-3.5 rounded-xl bg-[#171d2b] border border-slate-700/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-red-400" />
                        <span>Collage Layout & Photos</span>
                      </h3>
                      <p className="text-[10px] text-slate-400">
                        Choose photo quantity (1 to 6) and select layout pattern.
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30">
                      {imageCount} {imageCount === 1 ? "Photo" : "Photos"}
                    </span>
                  </div>

                  {/* Quantity Pills & Add/Remove buttons */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] text-slate-300 font-bold block">Photo Quantity:</span>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => {
                            setImageCount(num);
                            setCollagePattern("default");
                            if (selectedSlotIndex !== null && selectedSlotIndex >= num) {
                              setSelectedSlotIndex(num - 1);
                            }
                          }}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                            imageCount === num
                              ? "bg-red-600 text-white shadow-md shadow-red-900/30 scale-105"
                              : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleAddSlot}
                        disabled={imageCount >= 6}
                        className="flex-1 py-1 px-2.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-red-500/60 disabled:opacity-40 text-slate-200 hover:text-white text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed transition-all"
                      >
                        <Plus className="w-3 h-3 text-emerald-400" />
                        <span>+ Add Photo Slot</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveSlot()}
                        disabled={imageCount <= 1}
                        className="flex-1 py-1 px-2.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-red-500/60 disabled:opacity-40 text-slate-200 hover:text-white text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed transition-all"
                      >
                        <Trash2 className="w-3 h-3 text-rose-400" />
                        <span>- Remove Slot</span>
                      </button>
                    </div>
                  </div>

                  {/* Collage Patterns dependent on Image Quantity */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-800">
                    {/* BADGE / ACCENT SHAPE & POSITION CONTROLS */}
                  <div className="pt-3 border-t border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Shape & Position (Badge / Tag)</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 capitalize">
                        {badgeLayer?.shape || "circle"} · {badgeLayer?.position || "top-left"}
                      </span>
                    </div>

                    {/* Shape Selector */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Shape</span>
                      <div className="grid grid-cols-4 gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-700">
                        {(["circle", "rounded", "square", "pill"] as const).map((sh) => (
                          <button
                            key={sh}
                            type="button"
                            onClick={() => updateBadgeLayer({ shape: sh, containerShape: sh })}
                            className={`py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                              (badgeLayer?.shape || "circle") === sh
                                ? "bg-red-600 text-white shadow-xs"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            {sh}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Position Selector */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Position</span>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: "top-left", label: "Top left" },
                          { id: "center-top", label: "Center top" },
                          { id: "over-band", label: "Over text band" },
                          { id: "over-image", label: "Over image" },
                        ].map((pos) => (
                          <button
                            key={pos.id}
                            type="button"
                            onClick={() => updateBadgeLayer({ position: pos.id as any })}
                            className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                              (badgeLayer?.position || "top-left") === pos.id
                                ? "border-red-500 bg-red-500/10 text-red-400"
                                : "border-slate-700 bg-slate-900 text-slate-400 hover:text-white"
                            }`}
                          >
                            {pos.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] text-slate-300 font-bold block">
                      Layout Patterns for {imageCount} {imageCount === 1 ? "Photo" : "Photos"}:
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {(COLLAGE_PATTERNS_BY_COUNT[imageCount] || COLLAGE_PATTERNS_BY_COUNT[4]).map((pat) => (
                        <button
                          key={pat.id}
                          type="button"
                          onClick={() => setCollagePattern(pat.id)}
                          className={`p-2 rounded-lg text-left cursor-pointer transition-all border ${
                            (collagePattern === pat.id || (pat.id === "default" && (!collagePattern || collagePattern === "default")))
                              ? "bg-red-600/15 border-red-500 text-white shadow-xs"
                              : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                          }`}
                        >
                          <span className="text-[11px] font-bold block truncate">{pat.label}</span>
                          <span className="text-[9px] text-slate-400 block truncate">{pat.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Image frames</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Select an image frame to crop, zoom, pan, brightness, or replace.
                  </p>
                </div>

                {/* Hidden File Input for Active Slot */}
                <input
                  ref={slotFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (selectedSlotIndex !== null) {
                      handleSlotUpload(e, selectedSlotIndex);
                    }
                  }}
                />

                {/* Image Slots List (Image 1 · slot 1 matching Screenshot 3) */}
                <div className="space-y-2">
                  {Array.from({ length: slotCount }).map((_, idx) => {
                    const slotData = slotAdjustments[idx];
                    const isSelected = selectedSlotIndex === idx;
                    const hasImage = Boolean(slotData?.url);

                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedSlotIndex(idx)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? "bg-[#181d28] border-red-500/90 shadow-md ring-1 ring-red-500/20"
                            : "bg-[#10141d] border-slate-800/90 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-md overflow-hidden bg-slate-900 border border-slate-700/80 shrink-0 flex items-center justify-center">
                            {hasImage ? (
                              <img src={slotData.url} alt="Slot" className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                            )}
                          </div>
                          <span className="text-xs font-semibold text-white">
                            Image {idx + 1} · slot {idx + 1}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-500 font-medium">
                            {hasImage ? "Assigned" : "Empty"}
                          </span>
                          {slotCount > 1 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveSlot(idx);
                              }}
                              className="p-1 text-slate-600 hover:text-red-400 transition-colors cursor-pointer"
                              title={`Remove Slot ${idx + 1}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  Select an image on the canvas to crop, replace, adjust or swap it.
                </p>

                {/* Active Selected Slot Inspector Panel */}
                {selectedSlotIndex !== null && (
                  <div className="p-4 rounded-xl bg-[#171d2b] border border-slate-700 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-700/80 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-red-500/20 text-red-400 text-xs font-bold flex items-center justify-center">
                          {selectedSlotIndex + 1}
                        </span>
                        <h4 className="text-xs font-bold text-white">
                          Editing Slot {selectedSlotIndex + 1}
                        </h4>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {slotAdjustments[selectedSlotIndex]?.url && (
                          <button
                            type="button"
                            onClick={() => handleClearSlot(selectedSlotIndex)}
                            className="p-1 text-slate-400 hover:text-red-400 rounded transition-colors"
                            title="Clear image from this slot"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Slot Upload / AI Actions */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => slotFileInputRef.current?.click()}
                        className="py-2 px-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                      >
                        {uploadingSlot === selectedSlotIndex ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Upload className="w-3.5 h-3.5" />
                        )}
                        <span>Upload Photo</span>
                      </button>

                      {/* Swap With Slot Dropdown */}
                      <select
                        onChange={(e) => {
                          const target = Number(e.target.value);
                          if (!isNaN(target)) handleSwapSlots(selectedSlotIndex, target);
                        }}
                        defaultValue=""
                        className="bg-slate-900 border border-slate-700 rounded-lg px-2 text-xs text-slate-300 font-medium focus:outline-none focus:border-red-500 cursor-pointer"
                      >
                        <option value="" disabled>
                          Swap with...
                        </option>
                        {Array.from({ length: slotCount })
                          .map((_, i) => i)
                          .filter((i) => i !== selectedSlotIndex)
                          .map((i) => (
                            <option key={i} value={i}>
                              Slot {i + 1}
                            </option>
                          ))}
                      </select>
                    </div>

                    {/* Transform & Crop Sliders */}
                    <div className="space-y-3 pt-2 border-t border-slate-800">
                      {/* Zoom Slider */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-300">Zoom / Scale</span>
                          <span className="font-mono text-slate-400 text-[11px]">
                            {Math.round((slotAdjustments[selectedSlotIndex]?.zoom ?? 1) * 100)}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min={1}
                          max={2.5}
                          step={0.05}
                          value={slotAdjustments[selectedSlotIndex]?.zoom ?? 1}
                          onChange={(e) =>
                            updateSlotAdjustment(selectedSlotIndex, { zoom: Number(e.target.value) })
                          }
                          className="w-full accent-red-500 cursor-pointer"
                        />
                      </div>

                      {/* Pan X Slider */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-300">Pan Horizontal (X)</span>
                          <span className="font-mono text-slate-400 text-[11px]">
                            {slotAdjustments[selectedSlotIndex]?.panX ?? 0}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min={-50}
                          max={50}
                          value={slotAdjustments[selectedSlotIndex]?.panX ?? 0}
                          onChange={(e) =>
                            updateSlotAdjustment(selectedSlotIndex, { panX: Number(e.target.value) })
                          }
                          className="w-full accent-red-500 cursor-pointer"
                        />
                      </div>

                      {/* Pan Y Slider */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-300">Pan Vertical (Y)</span>
                          <span className="font-mono text-slate-400 text-[11px]">
                            {slotAdjustments[selectedSlotIndex]?.panY ?? 0}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min={-50}
                          max={50}
                          value={slotAdjustments[selectedSlotIndex]?.panY ?? 0}
                          onChange={(e) =>
                            updateSlotAdjustment(selectedSlotIndex, { panY: Number(e.target.value) })
                          }
                          className="w-full accent-red-500 cursor-pointer"
                        />
                      </div>

                      {/* Fit Mode */}
                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-slate-300">Fit Mode</span>
                        <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-700">
                          {(["cover", "contain", "fill"] as const).map((f) => (
                            <button
                              key={f}
                              type="button"
                              onClick={() => updateSlotAdjustment(selectedSlotIndex, { fit: f })}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize cursor-pointer ${
                                (slotAdjustments[selectedSlotIndex]?.fit || "cover") === f
                                  ? "bg-red-600 text-white"
                                  : "text-slate-400 hover:text-white"
                              }`}
                            >
                              {f}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Image Filters (Brightness & Contrast) */}
                      <div className="space-y-2 pt-2 border-t border-slate-800">
                        <span className="text-[11px] font-bold text-slate-400 block uppercase">Filters</span>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-300">Brightness</span>
                            <span className="font-mono text-slate-400 text-[11px]">
                              {slotAdjustments[selectedSlotIndex]?.brightness ?? 100}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min={50}
                            max={150}
                            value={slotAdjustments[selectedSlotIndex]?.brightness ?? 100}
                            onChange={(e) =>
                              updateSlotAdjustment(selectedSlotIndex, { brightness: Number(e.target.value) })
                            }
                            className="w-full accent-red-500 cursor-pointer"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-300">Contrast</span>
                            <span className="font-mono text-slate-400 text-[11px]">
                              {slotAdjustments[selectedSlotIndex]?.contrast ?? 100}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min={50}
                            max={150}
                            value={slotAdjustments[selectedSlotIndex]?.contrast ?? 100}
                            onChange={(e) =>
                              updateSlotAdjustment(selectedSlotIndex, { contrast: Number(e.target.value) })
                            }
                            className="w-full accent-red-500 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* TAB 3: TEXT (Per-Layer Typography - Screenshots 4 & 5)        */}
            {/* ------------------------------------------------------------- */}
            {activeTab === "text" && (
              <div className="space-y-4">
                {/* AI Text Assistant Button (Screenshot 4) */}
                <button
                  type="button"
                  onClick={() => setShowAiTextModal(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-500 to-orange-500 hover:opacity-95 text-white font-extrabold text-xs shadow-lg shadow-red-950/40 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>✨ AI Text Assistant</span>
                </button>

                {/* OVERLAY PLACEMENT & CANVAS ALIGNMENT */}
                <div className="p-3.5 rounded-xl bg-[#171d2b] border border-slate-700/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-red-400" />
                      <span>Overlay Placement</span>
                    </h4>
                    <span className="font-mono text-slate-400 text-[11px]">{overlayOffsetY}% from top</span>
                  </div>

                  {/* Vertical Position Presets */}
                  <div className="grid grid-cols-5 gap-1">
                    {[
                      { label: "Top", val: 22 },
                      { label: "Up-Mid", val: 36 },
                      { label: "Center", val: 50 },
                      { label: "Low-Mid", val: 64 },
                      { label: "Bottom", val: 78 },
                    ].map((btn) => (
                      <button
                        key={btn.label}
                        type="button"
                        onClick={() => setOverlayOffsetY(btn.val)}
                        className={`py-1 rounded text-[10px] font-bold cursor-pointer transition-all ${
                          Math.abs(overlayOffsetY - btn.val) <= 5
                            ? "bg-red-600 text-white shadow-xs"
                            : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>

                  {/* Vertical Offset Slider */}
                  <input
                    type="range"
                    min={12}
                    max={88}
                    value={overlayOffsetY}
                    onChange={(e) => setOverlayOffsetY(Number(e.target.value))}
                    className="w-full accent-red-500 cursor-pointer"
                  />

                  {/* Horizontal Alignment */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-xs">
                    <span className="text-slate-300 text-[11px]">Horizontal Align</span>
                    <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                      {[
                        { id: "left", label: "Left" },
                        { id: "center", label: "Center" },
                        { id: "right", label: "Right" },
                      ].map((al) => (
                        <button
                          key={al.id}
                          type="button"
                          onClick={() => setOverlayHorizontalAlign(al.id as any)}
                          className={`px-2.5 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                            overlayHorizontalAlign === al.id
                              ? "bg-red-600 text-white"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          {al.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Text Layers List (Screenshot 4) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Text layers</h3>
                    <button
                      type="button"
                      onClick={handleAddTextLayer}
                      className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 font-bold cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Layer</span>
                    </button>
                  </div>

                  {textLayers.map((layer, idx) => {
                    const isSelected = selectedLayerId === layer.id;

                    return (
                      <div
                        key={layer.id}
                        onClick={() => setSelectedLayerId(layer.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? "bg-[#1d2333] border-red-500/80 shadow-md"
                            : "bg-[#151b26] border-slate-800 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <span className="text-xs font-semibold text-white truncate">
                            {layer.text || `Empty ${layer.role}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[11px] text-slate-500 lowercase font-medium">
                            {layer.role === "title" ? "title line" : layer.role}
                          </span>
                          {textLayers.length > 2 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveLayer(layer.id);
                              }}
                              className="p-1 text-slate-500 hover:text-red-400 cursor-pointer"
                              title="Delete layer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Selected Layer Typography Inspector (Screenshot 5) */}
                {activeLayer && (
                  <div className="p-4 rounded-xl bg-[#171d2b] border border-slate-700 space-y-4">
                    {/* Layer Actions Toolbar: Bring forward, send back, align (Screenshot 5) */}
                    <div className="flex items-center justify-between border-b border-slate-700/80 pb-2.5">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            const idx = textLayers.findIndex((l) => l.id === activeLayer.id);
                            if (idx > 0) handleMoveLayer(idx, "up");
                          }}
                          className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer"
                          title="Bring forward"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const idx = textLayers.findIndex((l) => l.id === activeLayer.id);
                            if (idx < textLayers.length - 1) handleMoveLayer(idx, "down");
                          }}
                          className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer"
                          title="Send backward"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        {(["left", "center", "right"] as const).map((al) => (
                          <button
                            key={al}
                            type="button"
                            onClick={() => updateActiveLayer({ textAlign: al })}
                            className={`w-7 h-7 rounded flex items-center justify-center cursor-pointer ${
                              (activeLayer.textAlign || "center") === al
                                ? "bg-red-600 text-white"
                                : "bg-slate-800 text-slate-400 hover:text-white"
                            }`}
                          >
                            {al === "left" ? (
                              <AlignLeft className="w-3.5 h-3.5" />
                            ) : al === "center" ? (
                              <AlignCenter className="w-3.5 h-3.5" />
                            ) : (
                              <AlignRight className="w-3.5 h-3.5" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Shape Selector: Circle | Rounded | Square | Pill (Screenshot 5) */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-300 uppercase block">Shape</span>
                      <div className="grid grid-cols-4 gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-700">
                        {(["circle", "rounded", "square", "pill"] as const).map((sh) => (
                          <button
                            key={sh}
                            type="button"
                            onClick={() => updateActiveLayer({ shape: sh })}
                            className={`py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                              activeLayer.shape === sh
                                ? "bg-red-600 text-white shadow-xs"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            {sh}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Position Selector (Screenshot 5) */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-300 uppercase block">Position</span>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: "top-left", label: "Top left" },
                          { id: "center-top", label: "Center top" },
                          { id: "over-band", label: "Over text band" },
                          { id: "over-image", label: "Over image" },
                        ].map((pos) => (
                          <button
                            key={pos.id}
                            type="button"
                            onClick={() => updateActiveLayer({ position: pos.id as any })}
                            className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                              (activeLayer.position || "center-top") === pos.id
                                ? "border-red-500 bg-red-500/10 text-red-400"
                                : "border-slate-700 bg-slate-900 text-slate-400 hover:text-white"
                            }`}
                          >
                            {pos.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* TYPOGRAPHY Header (Screenshot 5) */}
                    <div className="space-y-3 pt-2 border-t border-slate-800">
                      <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
                        Typography
                      </h4>

                      {/* Text String Input */}
                      <div className="space-y-1">
                        <span className="text-[11px] text-slate-300">Text Content</span>
                        <input
                          type="text"
                          value={activeLayer.text}
                          onChange={(e) => updateActiveLayer({ text: e.target.value })}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-red-500"
                        />
                      </div>

                      {/* Font Family Dropdown */}
                      <div className="space-y-1">
                        <span className="text-[11px] text-slate-300">Font</span>
                        <select
                          value={activeLayer.fontFamily || "Josefin Sans, sans-serif"}
                          onChange={(e) => updateActiveLayer({ fontFamily: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-semibold focus:outline-none focus:border-red-500"
                        >
                          {POPULAR_FONTS.map((f) => (
                            <option key={f.id} value={f.id}>
                              {f.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Weight and Max Size Grid (Screenshot 5) */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[11px] text-slate-300 block mb-1">Weight</span>
                          <select
                            value={activeLayer.fontWeight || "Bold"}
                            onChange={(e) => updateActiveLayer({ fontWeight: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
                          >
                            <option value="Regular">Regular</option>
                            <option value="Medium">Medium</option>
                            <option value="SemiBold">SemiBold</option>
                            <option value="Bold">Bold</option>
                            <option value="Black">Black</option>
                          </select>
                        </div>
                        <div>
                          <span className="text-[11px] text-slate-300 block mb-1">Max size (px)</span>
                          <input
                            type="number"
                            value={activeLayer.fontSizePx || 36}
                            onChange={(e) => updateActiveLayer({ fontSizePx: Number(e.target.value) })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
                          />
                        </div>
                      </div>

                      {/* Formatting Buttons: Bold, Italic, Underline, Uppercase (Screenshot 5) */}
                      <div className="flex items-center gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => updateActiveLayer({ isBold: !activeLayer.isBold })}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs cursor-pointer ${
                            activeLayer.isBold ? "bg-red-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
                          }`}
                          title="Bold"
                        >
                          <Bold className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => updateActiveLayer({ isItalic: !activeLayer.isItalic })}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center italic text-xs cursor-pointer ${
                            activeLayer.isItalic ? "bg-red-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
                          }`}
                          title="Italic"
                        >
                          <Italic className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => updateActiveLayer({ isUnderline: !activeLayer.isUnderline })}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs cursor-pointer ${
                            activeLayer.isUnderline ? "bg-red-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
                          }`}
                          title="Underline"
                        >
                          <Underline className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => updateActiveLayer({ isStrikethrough: !activeLayer.isStrikethrough })}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs line-through cursor-pointer ${
                            activeLayer.isStrikethrough ? "bg-red-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
                          }`}
                          title="Strikethrough"
                        >
                          S
                        </button>
                        <button
                          type="button"
                          onClick={() => updateActiveLayer({ isUppercase: !activeLayer.isUppercase })}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-extrabold text-xs cursor-pointer ${
                            activeLayer.isUppercase ? "bg-red-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
                          }`}
                          title="Toggle Uppercase"
                        >
                          TT
                        </button>
                      </div>

                      {/* Extra Fine-Tuning Sliders: Spacing, Line Height, Opacity, Rotation */}
                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/80">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] text-slate-300">
                            <span>Letter spacing</span>
                            <span className="font-mono text-[10px] text-slate-400">{activeLayer.letterSpacing || "0px"}</span>
                          </div>
                          <input
                            type="range"
                            min={-1}
                            max={10}
                            value={activeLayer.letterSpacing ? parseInt(activeLayer.letterSpacing) : 0}
                            onChange={(e) => updateActiveLayer({ letterSpacing: `${e.target.value}px` })}
                            className="w-full accent-red-500 cursor-pointer"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] text-slate-300">
                            <span>Line height</span>
                            <span className="font-mono text-[10px] text-slate-400">{activeLayer.lineHeight || 1.15}</span>
                          </div>
                          <input
                            type="range"
                            min={0.8}
                            max={2.0}
                            step={0.05}
                            value={activeLayer.lineHeight || 1.15}
                            onChange={(e) => updateActiveLayer({ lineHeight: Number(e.target.value) })}
                            className="w-full accent-red-500 cursor-pointer"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] text-slate-300">
                            <span>Opacity</span>
                            <span className="font-mono text-[10px] text-slate-400">{Math.round((activeLayer.opacity ?? 1) * 100)}%</span>
                          </div>
                          <input
                            type="range"
                            min={0.1}
                            max={1}
                            step={0.05}
                            value={activeLayer.opacity ?? 1}
                            onChange={(e) => updateActiveLayer({ opacity: Number(e.target.value) })}
                            className="w-full accent-red-500 cursor-pointer"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] text-slate-300">
                            <span>Rotation</span>
                            <span className="font-mono text-[10px] text-slate-400">{activeLayer.rotation ?? 0}°</span>
                          </div>
                          <input
                            type="range"
                            min={-30}
                            max={30}
                            value={activeLayer.rotation ?? 0}
                            onChange={(e) => updateActiveLayer({ rotation: Number(e.target.value) })}
                            className="w-full accent-red-500 cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* Text Shadow Preset Selector */}
                      <div className="space-y-1 pt-1">
                        <span className="text-[11px] text-slate-300 block">Text Shadow</span>
                        <div className="grid grid-cols-4 gap-1 text-[10px]">
                          {[
                            { label: "None", shadow: false, col: undefined },
                            { label: "Soft", shadow: true, col: "rgba(0,0,0,0.5)" },
                            { label: "Bold", shadow: true, col: "#111111" },
                            { label: "Glow", shadow: true, col: "#EE1A5B" },
                          ].map((sh) => (
                            <button
                              key={sh.label}
                              type="button"
                              onClick={() => updateActiveLayer({ textShadow: sh.shadow, shadowColor: sh.col })}
                              className={`py-1 rounded font-bold cursor-pointer transition-all ${
                                activeLayer.textShadow === sh.shadow && activeLayer.shadowColor === sh.col
                                  ? "bg-red-600 text-white"
                                  : "bg-slate-900 border border-slate-700 text-slate-400 hover:text-white"
                              }`}
                            >
                              {sh.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Quick Palette Swatches */}
                      <div className="space-y-1 pt-1">
                        <span className="text-[11px] text-slate-300 block">Quick Color Swatches</span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {["#FFFFFF", "#111111", "#EE1A5B", "#F97316", "#F59E0B", "#10B981", "#0EA5E9", "#8B5CF6", "#D4AF37", "#6B7280"].map((hex) => (
                            <button
                              key={hex}
                              type="button"
                              onClick={() => updateActiveLayer({ color: hex })}
                              className="w-5 h-5 rounded-full border border-white/30 cursor-pointer transition-transform hover:scale-125"
                              style={{ backgroundColor: hex }}
                              title={`Set text color to ${hex}`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Text Color & Highlight Color Pickers */}
                      <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                        <div>
                          <span className="text-slate-300 block mb-1">Text Color</span>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={activeLayer.color || "#FFFFFF"}
                              onChange={(e) => updateActiveLayer({ color: e.target.value })}
                              className="w-6 h-6 rounded cursor-pointer border border-slate-700 bg-transparent"
                            />
                            <span className="font-mono text-[11px] text-slate-400">{activeLayer.color}</span>
                          </div>
                        </div>
                        <div>
                          <span className="text-slate-300 block mb-1">Highlight / Shape BG</span>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={activeLayer.bgHighlight || "#111111"}
                              onChange={(e) => updateActiveLayer({ bgHighlight: e.target.value })}
                              className="w-6 h-6 rounded cursor-pointer border border-slate-700 bg-transparent"
                            />
                            <span className="font-mono text-[11px] text-slate-400">{activeLayer.bgHighlight}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* TAB 4: LAYERS (Layer Stack & Visibility)                      */}
            {/* ------------------------------------------------------------- */}
            {activeTab === "layers" && (
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Canvas Layer Stack</h3>
                <p className="text-[11px] text-slate-400">
                  Toggle visibility or inspect element stacking order.
                </p>

                <div className="space-y-1.5">
                  {textLayers.map((layer) => (
                    <div
                      key={layer.id}
                      className="p-2.5 rounded-xl bg-[#171d2b] border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Type className="w-3.5 h-3.5 text-red-400" />
                        <span className="font-semibold text-white truncate max-w-[170px]">
                          {layer.text}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setTextLayers((prev) =>
                              prev.map((l) => (l.id === layer.id ? { ...l, visible: !l.visible } : l))
                            );
                          }}
                          className="p-1 text-slate-400 hover:text-white"
                        >
                          {layer.visible !== false ? (
                            <Eye className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Image Slots Layers */}
                  {Array.from({ length: slotCount }).map((_, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-[#151b26] border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
                        <span className="font-semibold text-slate-300">
                          Photo Frame {i + 1}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {slotAdjustments[i]?.url ? "Custom Photo" : "Layout Grid"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action Bar */}
          <div className="p-4 border-t border-slate-800 bg-[#0e121a] flex flex-col gap-2">
            <button
              type="button"
              onClick={handleGeneratePin}
              disabled={generatingPin}
              className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs shadow-lg shadow-red-950/50 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              {generatingPin ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>🚀 Generate Pin with this Customized Template</span>
            </button>

            {savedSuccessMsg && (
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-center text-xs font-semibold">
                {savedSuccessMsg}
              </div>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: Live Interactive Pin Canvas (7 Cols)       */}
        {/* ======================================================== */}
        <div className="lg:col-span-7 bg-[#0b0e14] p-6 md:p-10 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Canvas Wrapper with realistic drop shadow */}
          <div className="w-full max-w-[380px] transition-all duration-150">
            <div className="relative shadow-2xl rounded-2xl overflow-hidden ring-1 ring-white/10 group">
              <PinTemplateVisualPreview
                template={livePreviewData}
                className="w-full h-full"
              />
            </div>

            {/* Canvas Footer Status */}
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400 px-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-[11px]">
                  {canvasRatio} · {slotCount} Slots · Live Dual-Sync
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                Click slots or layers on canvas to edit
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Text Assistant Modal */}
      {showAiTextModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-red-500" />
                <h3 className="text-base font-bold text-white">AI Pin Copy Generator</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAiTextModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Enter your pin topic, niche, or keyword. The AI will generate high-CTR headline titles, subtitle hooks, and badge numbers.
            </p>

            <div className="space-y-1">
              <span className="text-xs text-slate-300 font-medium">Topic or Niche</span>
              <input
                type="text"
                value={aiTopicInput}
                onChange={(e) => setAiTopicInput(e.target.value)}
                placeholder="e.g. 20 Trendy Winter Combat Boot Outfits..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAiTextModal(false)}
                className="px-4 py-2 rounded-lg text-xs text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRunAiTextAssistant}
                disabled={aiGeneratingCopy}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 disabled:opacity-50"
              >
                {aiGeneratingCopy ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>Generate & Apply Copy</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
