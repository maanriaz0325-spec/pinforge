"use client";

import React, { useState, useRef, useEffect } from "react";
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
} from "lucide-react";
import { PinTemplateVisualPreview, TemplatePreviewData } from "./PinTemplateVisualPreview";

export const POPULAR_FONTS = [
  { id: "Montserrat, sans-serif", label: "Montserrat (Modern Clean Sans)" },
  { id: "Playfair Display, Georgia, serif", label: "Playfair Display (Luxury Editorial Serif)" },
  { id: "Anton, sans-serif", label: "Anton (High-CTR Bold Condensed)" },
  { id: "Great Vibes, cursive", label: "Great Vibes (Flowing Cursive Accent)" },
  { id: "Didot, Bodoni MT, serif", label: "Didot / Bodoni (High Fashion Editorial)" },
  { id: "Oswald, sans-serif", label: "Oswald (Modern Headline Grotesque)" },
  { id: "Cinzel, serif", label: "Cinzel (Classic Roman Elegance)" },
  { id: "Dancing Script, cursive", label: "Dancing Script (Lively Calligraphy)" },
  { id: "Caveat, cursive", label: "Caveat (Organic Marker Hand)" },
  { id: "Poppins, sans-serif", label: "Poppins (Clean Geometric Rounded)" },
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
  "#1F1A17", // Deep Dark Slate
  "#E2E8F0", // Slate White
];

interface PresetCustomizerEditorProps {
  initialTemplate?: TemplatePreviewData | null;
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

export function PresetCustomizerEditor({
  initialTemplate,
  onApplyAI,
  onSavePinSuccess,
  className = "",
  compact = false,
}: PresetCustomizerEditorProps) {
  // Source Mode: "ai" vs "upload"
  const [sourceMode, setSourceMode] = useState<"ai" | "upload">("upload");

  // Active Template
  const [template, setTemplate] = useState<TemplatePreviewData>(
    initialTemplate || {
      id: "hb-bronde-blocks",
      name: "Hair — White Blocks, Pink Keyword (4 lines)",
      layoutId: "single",
      primaryCategory: "Hair & Hairstyles",
      fonts: ["Anton"],
      colors: ["#FFFFFF", "#111111", "#EE1A5B"],
      layerTexts: ["20+ Most", "Gorgeous", "Bronde Hair Color", "Ideas 2026"],
      visualConfig: {
        badge: { text: "20+", shape: "circle", bg: "#EE1A5B", color: "#FFFFFF" },
        blockStyle: "white-blocks",
        bandColor: "#FFFFFF",
        accentColor: "#EE1A5B",
        photoTheme: "hair",
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
        }
      } catch (err) {
        console.error("Failed to load studio templates:", err);
      }
    }
    loadStudioTemplates();
  }, []);

  function handleSelectNewTemplate(tId: string) {
    const found = studioTemplates.find((t) => t.id === tId);
    if (!found) return;
    setTemplate(found);
    if (found.fonts?.[0]) setSelectedFont(`${found.fonts[0]}, sans-serif`);
    if (found.visualConfig?.blockStyle === "white-blocks") setTextColor("#111111");
    else setTextColor("#FFFFFF");
    if (found.visualConfig?.accentColor) setAccentColor(found.visualConfig.accentColor);
    if (found.visualConfig?.bandColor) setBandColor(found.visualConfig.bandColor);
    if (found.visualConfig?.badge) {
      setBadgeBg(found.visualConfig.badge.bg);
      setBadgeText(found.visualConfig.badge.text);
      setBadgeShape(found.visualConfig.badge.shape || "circle");
    }
    if (found.layerTexts && found.layerTexts.length > 0) {
      setLines(found.layerTexts);
    }
    if (found.primaryCategory) setKicker(found.primaryCategory);
    if (found.visualConfig?.scriptWord) setScriptWord(found.visualConfig.scriptWord);
  }

  // User uploaded images (can be 1 or multiple for collages)
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Typography & Styling states
  const [selectedFont, setSelectedFont] = useState<string>(
    template.fonts?.[0] ? `${template.fonts[0]}, sans-serif` : "Montserrat, sans-serif"
  );
  const [isUppercase, setIsUppercase] = useState<boolean>(true);
  const [isBold, setIsBold] = useState<boolean>(true);
  const [isItalic, setIsItalic] = useState<boolean>(false);
  const [letterSpacing, setLetterSpacing] = useState<string>("tracking-tight");

  // Color customization states
  const [textColor, setTextColor] = useState<string>(
    template.visualConfig?.blockStyle === "white-blocks" ? "#111111" : "#FFFFFF"
  );
  const [accentColor, setAccentColor] = useState<string>(
    template.visualConfig?.accentColor || template.colors?.[1] || "#EE1A5B"
  );
  const [bandColor, setBandColor] = useState<string>(
    template.visualConfig?.bandColor || "#FFFFFF"
  );
  const [badgeBg, setBadgeBg] = useState<string>(
    template.visualConfig?.badge?.bg || "#EE1A5B"
  );
  const [badgeText, setBadgeText] = useState<string>(
    template.visualConfig?.badge?.text || "NEW"
  );
  const [badgeShape, setBadgeShape] = useState<string>(
    template.visualConfig?.badge?.shape || "circle"
  );

  // Headline Lines & Text editing
  const defaultLines = template.layerTexts && template.layerTexts.length > 0
    ? template.layerTexts
    : ["35 Best", "Living Room", "Decor Ideas", "For 2026"];

  const [lines, setLines] = useState<string[]>(defaultLines);
  const [kicker, setKicker] = useState<string>(template.primaryCategory || "TRENDING INSPIRATION");
  const [scriptWord, setScriptWord] = useState<string>(template.visualConfig?.scriptWord || "Inspo ♡");
  const [website, setWebsite] = useState<string>("pinforge.app");

  // AI Prompt (if in AI mode)
  const [aiPrompt, setAiPrompt] = useState<string>(lines.join(" "));

  // Saving / Composite state
  const [savingPin, setSavingPin] = useState(false);
  const [savedSuccessMsg, setSavedSuccessMsg] = useState<string | null>(null);

  // Handle Image Upload
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const newUrls: string[] = [];
      for (let i = 0; i < Math.min(files.length, 4); i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const json = await res.json();
        if (json.success && json.url) {
          newUrls.push(json.url);
        } else {
          // Fallback to local DataURL preview
          const reader = new FileReader();
          const p = new Promise<string>((resolve) => {
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
          const dataUrl = await p;
          newUrls.push(dataUrl);
        }
      }
      setUploadedImages((prev) => [...newUrls, ...prev].slice(0, 4));
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  }

  function handleRemoveImage(index: number) {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  }

  // Update a single headline line
  function handleLineChange(index: number, val: string) {
    const next = [...lines];
    next[index] = val;
    setLines(next);
  }

  function handleAddLine() {
    if (lines.length < 5) {
      setLines([...lines, "New Highlight Line"]);
    }
  }

  function handleRemoveLine(index: number) {
    if (lines.length > 1) {
      setLines(lines.filter((_, i) => i !== index));
    }
  }

  // Save composite pin to database
  async function handleSavePin() {
    setSavingPin(true);
    setSavedSuccessMsg(null);
    try {
      const activeImg = uploadedImages[0] || "/placeholder.jpg";
      const res = await fetch("/api/pins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: activeImg,
          rawImageUrl: activeImg,
          title: lines.join(" "),
          description: `${kicker} - ${scriptWord}. Created with PinForge Custom Preset Studio.`,
          altText: lines.join(" "),
          targetKeyword: lines[0] || "pinterest ideas",
          hashtags: [kicker.toLowerCase().replace(/\s+/g, ""), "pininspo", "pinteresttrend"],
          pinType: template.primaryCategory || "Custom Preset Pin",
          textMode: "canvas",
          overlayText: lines.join(" "),
          overlayJson: {
            presetId: template.id,
            font: selectedFont,
            textColor,
            accentColor,
            bandColor,
            badgeBg,
            badgeText,
            lines,
            kicker,
            scriptWord,
            website,
          },
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSavedSuccessMsg("Pin saved successfully to your Library! 🎉");
        if (onSavePinSuccess) onSavePinSuccess(json.data);
      }
    } catch (err) {
      console.error("Failed to save pin:", err);
    } finally {
      setSavingPin(false);
    }
  }

  // Composed template preview object
  const livePreviewTemplate: TemplatePreviewData = {
    ...template,
    customImages: uploadedImages.length > 0 ? uploadedImages : undefined,
    customFont: selectedFont,
    customTextColor: textColor,
    customAccentColor: accentColor,
    customBandColor: bandColor,
    customBadgeBg: badgeBg,
    customBadgeText: badgeText,
    customBadgeShape: badgeShape,
    customLines: lines,
    customKicker: kicker,
    customScriptWord: scriptWord,
    customWebsite: website,
    fontStyle: {
      uppercase: isUppercase,
      bold: isBold,
      italic: isItalic,
      letterSpacing,
    },
  };

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl ${className}`}>
      {/* Top Header & Mode Toggle */}
      <div className="p-4 md:p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950/40">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-red-600/10 border border-red-500/20 text-red-500 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Preset Customizer & Pin Studio Editor
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Choose whether to generate an AI background or upload your own photo, then customize fonts, colors, and layout text with instant preview.
          </p>
        </div>

        {/* Source Switcher: Upload Photo vs AI Generate */}
        <div className="flex items-center bg-slate-950 border border-slate-800 p-1 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => setSourceMode("upload")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              sourceMode === "upload"
                ? "bg-red-600 text-white shadow-md shadow-red-900/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload My Image</span>
          </button>
          <button
            type="button"
            onClick={() => setSourceMode("ai")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              sourceMode === "ai"
                ? "bg-purple-600 text-white shadow-md shadow-purple-900/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Generate Photo</span>
          </button>
        </div>
      </div>

      {/* Preset Switcher Bar */}
      <div className="px-4 md:px-6 py-2.5 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Active Preset:</span>
          <select
            value={template.id}
            onChange={(e) => handleSelectNewTemplate(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white font-semibold focus:outline-none focus:border-red-500 max-w-[280px] truncate"
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
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
            Layout: {template.layoutId || "single"}
          </span>
          <span className="px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/40 text-[10px] font-semibold">
            Archetype: {template.visualConfig?.blockStyle || "clean-overlay"}
          </span>
        </div>
      </div>

      <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ======================================================== */}
        {/* LEFT COLUMN: Controls & Customizers (7 Cols)             */}
        {/* ======================================================== */}
        <div className="lg:col-span-7 space-y-5">
          {/* Section 1: Image Source (Upload or AI Prompt) */}
          {sourceMode === "upload" ? (
            <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-red-500" />
                  Upload Photo into Preset Layout
                </span>
                <span className="text-[11px] text-slate-400">
                  {uploadedImages.length > 0
                    ? `${uploadedImages.length} image(s) loaded`
                    : "Supports Single & Multi-Collage"}
                </span>
              </div>

              {/* Upload Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-800 hover:border-red-500/60 rounded-xl p-5 text-center cursor-pointer transition-all bg-slate-900/30 hover:bg-red-500/5 group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="w-10 h-10 rounded-full bg-slate-800 group-hover:bg-red-600 text-slate-300 group-hover:text-white mx-auto flex items-center justify-center transition-colors mb-2">
                  {uploading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Upload className="w-5 h-5" />
                  )}
                </div>
                <div className="text-xs font-semibold text-slate-200">
                  Click to browse or drag & drop your photos
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  PNG, JPG, or WEBP. Upload 1 hero image or up to 4 for collages.
                </p>
              </div>

              {/* Uploaded Thumbnails list */}
              {uploadedImages.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pt-1">
                  {uploadedImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative w-16 h-20 rounded-lg overflow-hidden border border-slate-700 shrink-0 group/thumb"
                    >
                      <img src={img} alt="Uploaded" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage(idx);
                        }}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/80 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-16 h-20 rounded-lg border border-dashed border-slate-700 hover:border-slate-500 flex flex-col items-center justify-center text-slate-400 hover:text-white shrink-0 text-[10px]"
                  >
                    <Plus className="w-4 h-4 mb-1" />
                    <span>Add</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  AI Generation Prompt for Background Photo
                </span>
                <span className="text-[11px] text-purple-300 font-mono">Runware AI Provider</span>
              </div>
              <textarea
                rows={2}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g. Modern aesthetic living room with warm sunlight, bouclé sofa, and fiddle leaf fig..."
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
              <p className="text-[11px] text-slate-400">
                The AI will generate high-resolution commercial photography tailored to your niche, and this preset layout will be seamlessly composited over it.
              </p>
            </div>
          )}

          {/* Section 2: Typography & Font Styler */}
          <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Type className="w-4 h-4 text-amber-400" />
                Typography System & Font Styling
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Pinterest High-CTR Fonts</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Font Family Dropdown */}
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Font Family:</label>
                <select
                  value={selectedFont}
                  onChange={(e) => setSelectedFont(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-sans"
                >
                  {POPULAR_FONTS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Letter Spacing Dropdown */}
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Letter Spacing (Tracking):</label>
                <select
                  value={letterSpacing}
                  onChange={(e) => setLetterSpacing(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                >
                  <option value="tracking-tighter">Tighter (-0.05em)</option>
                  <option value="tracking-tight">Tight (-0.025em)</option>
                  <option value="tracking-normal">Normal (0em)</option>
                  <option value="tracking-wide">Wide (+0.025em)</option>
                  <option value="tracking-widest">Extra Wide (+0.05em)</option>
                </select>
              </div>
            </div>

            {/* Quick Font Styling Toggles */}
            <div className="flex items-center gap-2 pt-1 text-xs">
              <button
                type="button"
                onClick={() => setIsUppercase(!isUppercase)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                  isUppercase
                    ? "bg-red-600/10 text-red-400 border-red-500/40"
                    : "bg-slate-900 text-slate-400 border-slate-800"
                }`}
              >
                {isUppercase ? "ALL CAPS ON" : "Mixed Case"}
              </button>
              <button
                type="button"
                onClick={() => setIsBold(!isBold)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                  isBold
                    ? "bg-red-600/10 text-red-400 border-red-500/40"
                    : "bg-slate-900 text-slate-400 border-slate-800"
                }`}
              >
                {isBold ? "Bold Weight" : "Regular Weight"}
              </button>
              <button
                type="button"
                onClick={() => setIsItalic(!isItalic)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                  isItalic
                    ? "bg-red-600/10 text-red-400 border-red-500/40"
                    : "bg-slate-900 text-slate-400 border-slate-800"
                }`}
              >
                Italic Slant
              </button>
            </div>
          </div>

          {/* Section 3: Color Palette & Swatches */}
          <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Palette className="w-4 h-4 text-emerald-400" />
                Color Theme & Element Tints
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Live Hex & Swatches</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Text Color */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-mono block">Text Color</label>
                <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg p-1.5">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <input
                    type="text"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-16 bg-transparent text-[11px] font-mono text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Accent Color */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-mono block">Accent / Script</label>
                <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg p-1.5">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <input
                    type="text"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-16 bg-transparent text-[11px] font-mono text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Band / Box Fill */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-mono block">Card / Band Fill</label>
                <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg p-1.5">
                  <input
                    type="color"
                    value={bandColor}
                    onChange={(e) => setBandColor(e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <input
                    type="text"
                    value={bandColor}
                    onChange={(e) => setBandColor(e.target.value)}
                    className="w-16 bg-transparent text-[11px] font-mono text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Badge Background */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-mono block">Badge Color</label>
                <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg p-1.5">
                  <input
                    type="color"
                    value={badgeBg}
                    onChange={(e) => setBadgeBg(e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <input
                    type="text"
                    value={badgeBg}
                    onChange={(e) => setBadgeBg(e.target.value)}
                    className="w-16 bg-transparent text-[11px] font-mono text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Quick Swatch Pills */}
            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-[10px] text-slate-400 block mb-1.5">Quick Palette Swatches:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {COLOR_SWATCHES.map((swatch) => (
                  <button
                    key={swatch}
                    type="button"
                    onClick={() => {
                      setAccentColor(swatch);
                      setBadgeBg(swatch);
                    }}
                    className="w-5 h-5 rounded-md border border-slate-700 hover:scale-110 transition-transform cursor-pointer"
                    style={{ backgroundColor: swatch }}
                    title={`Apply ${swatch}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: Headline Text & Layer Editing */}
          <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400" />
                Editable Headline Lines & Badges
              </span>
              <button
                type="button"
                onClick={handleAddLine}
                className="text-[11px] text-red-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Line</span>
              </button>
            </div>

            {/* Headline text lines */}
            <div className="space-y-2">
              {lines.map((line, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 font-mono w-5">0{idx + 1}.</span>
                  <input
                    type="text"
                    value={line}
                    onChange={(e) => handleLineChange(idx, e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-red-500 font-medium"
                  />
                  {lines.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveLine(idx)}
                      className="p-1.5 text-slate-500 hover:text-red-400 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Badge & Script inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800/80">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Badge Text:</label>
                <input
                  type="text"
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  className="w-full px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-white font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Script Accent Word:</label>
                <input
                  type="text"
                  value={scriptWord}
                  onChange={(e) => setScriptWord(e.target.value)}
                  className="w-full px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Website Tag:</label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: Live Interactive Pin Preview (5 Cols)      */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 flex flex-col items-center space-y-4">
          <div className="w-full flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-white">Live Real-Time Preview</span>
            <span className="font-mono text-[11px]">{template.layoutId || "single"} • 2:3 Canvas</span>
          </div>

          {/* Interactive Visual Canvas Container */}
          <div className="w-full max-w-[280px] sm:max-w-[320px] shadow-2xl rounded-2xl overflow-hidden border-2 border-slate-800/80 bg-slate-950 p-1">
            <PinTemplateVisualPreview
              template={livePreviewTemplate}
              className="w-full shadow-inner"
              showWebsite={Boolean(website)}
            />
          </div>

          {/* Save / Apply Success Message */}
          {savedSuccessMsg && (
            <div className="w-full max-w-[320px] p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{savedSuccessMsg}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="w-full max-w-[320px] space-y-2">
            {sourceMode === "ai" ? (
              <button
                type="button"
                onClick={() => {
                  if (onApplyAI) {
                    onApplyAI({
                      templateId: template.id,
                      prompt: aiPrompt,
                      headline: lines.join(" "),
                      customFont: selectedFont,
                      textColor,
                      accentColor,
                      bandColor,
                      badgeBg,
                      badgeText,
                    });
                  }
                }}
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate AI Pin with this Preset</span>
              </button>
            ) : (
              <button
                type="button"
                disabled={savingPin}
                onClick={handleSavePin}
                className="w-full py-2.5 bg-red-600 hover:bg-red-500 disabled:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-900/30 transition-all cursor-pointer"
              >
                {savingPin ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving to Pins Library...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Custom Pin to Library</span>
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                // Reset styling to template defaults
                setSelectedFont(template.fonts?.[0] ? `${template.fonts[0]}, sans-serif` : "Montserrat, sans-serif");
                setTextColor(template.visualConfig?.blockStyle === "white-blocks" ? "#111111" : "#FFFFFF");
                setAccentColor(template.visualConfig?.accentColor || template.colors?.[1] || "#EE1A5B");
                setBandColor(template.visualConfig?.bandColor || "#FFFFFF");
                setBadgeBg(template.visualConfig?.badge?.bg || "#EE1A5B");
                setBadgeText(template.visualConfig?.badge?.text || "NEW");
                setLines(defaultLines);
              }}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Preset Styles to Default</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
