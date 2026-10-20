"use client";

import React, { useState, useEffect } from "react";
import {
  Palette,
  Sparkles,
  Plus,
  Trash2,
  Copy,
  RotateCcw,
  Globe,
  Upload,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
  Image as ImageIcon,
  Type,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { hexToColorName } from "@/server/engine/brandKit";

interface BrandKitData {
  id: string;
  kitName: string;
  brandName: string;
  websiteUrl: string | null;
  styleVibe: string | null;
  customAdjectives: string | null;
  referenceImage: string | null;
  logoPng: string | null;
  logoPosition: string;
  logoOpacity: number;
  googleFontUrl: string | null;
  fontFamily: string;
  overlayPreset: string;
  palette: string | null;
  negativePrompt: string | null;
  brandVoice: string | null;
  ctaPresets: string | null;
  defaultAspect: string;
  defaultModel: string | null;
  utmTemplate: string | null;
  _count?: { pins: number };
}

const PRESET_OPTIONS = [
  // Reference Image 1 (Presets 1–8)
  { id: "classic_clean_travel", label: "1. Classic Clean (Travel in Canada)" },
  { id: "modern_bold_peach", label: "2. Modern Bold Peach (Good Food In The City)" },
  { id: "handwritten_explore", label: "3. Handwritten Style (Explore More ♡)" },
  { id: "minimal_clean_nature", label: "4. Minimal & Clean (Small Changes Nature)" },
  { id: "playful_colorful_badge", label: "5. Playful & Colorful (Weekend Getaway)" },
  { id: "dark_cinematic_road", label: "6. Dark & Cinematic (10 Scenic Road Trips)" },
  { id: "healthy_habits_icons", label: "7. Modern Lifestyle Icons (Green Smoothie)" },
  { id: "collage_washi_gems", label: "8. Collage / Washi Style (Hidden Gems)" },
  // Reference Image 2 (Presets 9–16)
  { id: "classic_elegant_santorini", label: "9. Classic Elegant (Dream Destinations ✈)" },
  { id: "modern_bold_amber", label: "10. Modern Bold Amber (Healthy Eating Bowl)" },
  { id: "handwritten_torn_desk", label: "11. Handwritten Desk Note (Small Steps Everyday)" },
  { id: "minimal_clean_fitness", label: "12. Minimal Clean Fitness (Stronger Every Day)" },
  { id: "playful_pastel_rainbow", label: "13. Playful Pastel Rainbow (Little Moments Big Joy)" },
  { id: "dark_cinematic_coffee", label: "14. Dark Cinematic Coffee (Good Coffee Better Days)" },
  { id: "modern_overlay_sage_home", label: "15. Modern Sage Frosted Card (Home Inspiration)" },
  { id: "collage_craft_ribbon", label: "16. Blush Craft Note (Creative Ideas ♡)" },
  // Reference Image 3: Preset 17
  { id: "bold_center_badge", label: "17. Bold Center Listicle Banner (35 Christmas Decor Ideas 2026)" },
  // Reference Image 4: Preset 18
  { id: "editorial_tall_script", label: "18. Tall Luxury Editorial Script (20 Almond Nails That Take Minutes)" },
];

const FONT_OPTIONS = [
  "Playfair Display",
  "Montserrat",
  "Cormorant Garamond",
  "Plus Jakarta Sans",
  "Cinzel",
  "Lora",
  "Outfit",
  "Cinzel Decorative",
];

export default function BrandKitPage() {
  const [kits, setKits] = useState<BrandKitData[]>([]);
  const [selectedKit, setSelectedKit] = useState<BrandKitData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // AI Scraper Modal State
  const [showAiModal, setShowAiModal] = useState(false);
  const [scrapeUrl, setScrapeUrl] = useState("");
  const [scraping, setScraping] = useState(false);

  // Form State
  const [kitName, setKitName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [styleVibe, setStyleVibe] = useState("");
  const [fontFamily, setFontFamily] = useState("Playfair Display");
  const [overlayPreset, setOverlayPreset] = useState("classic_clean_travel");
  const [paletteColors, setPaletteColors] = useState<string[]>([
    "#FFFFFF",
    "#2D2D30",
    "#C8553D",
    "#9AAC93",
    "#E1D7C3",
  ]);
  const [logoPng, setLogoPng] = useState("");
  const [logoPosition, setLogoPosition] = useState("bottom_right");
  const [logoOpacity, setLogoOpacity] = useState(0.9);
  const [referenceImage, setReferenceImage] = useState("");
  const [refStrength, setRefStrength] = useState(0.6);
  const [brandVoice, setBrandVoice] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingRef, setUploadingRef] = useState(false);

  useEffect(() => {
    fetchKits();
  }, []);

  const fetchKits = async (selectId?: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/brand-kits");
      const data = await res.json();
      if (data.success && data.kits) {
        setKits(data.kits);
        if (data.kits.length > 0) {
          const target = selectId
            ? data.kits.find((k: BrandKitData) => k.id === selectId) || data.kits[0]
            : data.kits[0];
          selectKitToEdit(target);
        } else {
          setSelectedKit(null);
        }
      }
    } catch (err) {
      console.error("Failed to load kits:", err);
    } finally {
      setLoading(false);
    }
  };

  const selectKitToEdit = (kit: BrandKitData) => {
    setSelectedKit(kit);
    setKitName(kit.kitName || "");
    setBrandName(kit.brandName || "");
    setWebsiteUrl(kit.websiteUrl || "");
    setStyleVibe(kit.styleVibe || "");
    setFontFamily(kit.fontFamily || "Playfair Display");
    setOverlayPreset(kit.overlayPreset || "classic_clean_travel");
    setLogoPng(kit.logoPng || "");
    setLogoPosition(kit.logoPosition || "bottom_right");
    setLogoOpacity(kit.logoOpacity ?? 0.9);
    setReferenceImage(kit.referenceImage || "");
    setBrandVoice(kit.brandVoice || "");
    setNegativePrompt(kit.negativePrompt || "");

    // Parse palette
    try {
      if (kit.palette) {
        const parsed = JSON.parse(kit.palette);
        if (Array.isArray(parsed) && parsed.length >= 5) {
          setPaletteColors(parsed.slice(0, 5));
        }
      }
    } catch {
      setPaletteColors(["#FFFFFF", "#2D2D30", "#C8553D", "#9AAC93", "#E1D7C3"]);
    }
  };

  const handleColorChange = (index: number, newHex: string) => {
    const updated = [...paletteColors];
    updated[index] = newHex;
    setPaletteColors(updated);
  };

  const handleSave = async () => {
    if (!selectedKit) return;
    if (!kitName.trim() || !brandName.trim()) {
      setStatusMsg({ type: "error", text: "Kit Name and Brand Name are required." });
      return;
    }

    setSaving(true);
    setStatusMsg(null);
    try {
      const res = await fetch(`/api/brand-kits/${selectedKit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kitName,
          brandName,
          websiteUrl,
          styleVibe,
          fontFamily,
          overlayPreset,
          palette: paletteColors,
          logoPng: logoPng || null,
          logoPosition,
          logoOpacity,
          referenceImage: referenceImage || null,
          brandVoice,
          negativePrompt,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatusMsg({ type: "success", text: "Brand Kit saved successfully." });
        fetchKits(selectedKit.id);
      } else {
        setStatusMsg({ type: "error", text: data.error || "Failed to save." });
      }
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Network error." });
    } finally {
      setSaving(false);
    }
  };

  const handleCreateNew = async () => {
    const name = `Brand Kit ${kits.length + 1}`;
    try {
      const res = await fetch("/api/brand-kits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kitName: name,
          brandName: "My Brand",
          fontFamily: "Playfair Display",
          overlayPreset: "classic_clean_travel",
          palette: ["#FFFFFF", "#2D2D30", "#C8553D", "#9AAC93", "#E1D7C3"],
        }),
      });
      const data = await res.json();
      if (data.success && data.kit) {
        fetchKits(data.kit.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDuplicate = async () => {
    if (!selectedKit) return;
    try {
      const res = await fetch(`/api/brand-kits/${selectedKit.id}/duplicate`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success && data.kit) {
        fetchKits(data.kit.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!selectedKit) return;
    if (!confirm(`Are you sure you want to delete '${selectedKit.kitName}'?`)) return;

    try {
      const res = await fetch(`/api/brand-kits/${selectedKit.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        fetchKits();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleScrapeWebsite = async () => {
    if (!scrapeUrl.trim()) return;
    setScraping(true);
    setStatusMsg(null);
    try {
      const res = await fetch("/api/brand-kits/extract-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: scrapeUrl }),
      });
      const data = await res.json();
      if (data.success && data.brandData) {
        const b = data.brandData;
        setKitName(`${b.brandName} Kit`);
        setBrandName(b.brandName);
        setWebsiteUrl(b.websiteUrl);
        setStyleVibe(b.suggestedVibe || "");
        if (b.palette && b.palette.length >= 5) {
          setPaletteColors(b.palette);
        }
        if (b.fontFamily) setFontFamily(b.fontFamily);
        if (b.suggestedPreset) setOverlayPreset(b.suggestedPreset);
        if (b.logoCandidate) setLogoPng(b.logoCandidate);
        if (b.description) setBrandVoice(b.description);

        setShowAiModal(false);
        setStatusMsg({
          type: "success",
          text: `Extracted brand elements from ${b.websiteUrl}! Review and click 'Save Changes'.`,
        });
      } else {
        alert(data.error || "Failed to extract website");
      }
    } catch (err: any) {
      alert(`Scraping error: ${err.message}`);
    } finally {
      setScraping(false);
    }
  };

  const handleFileUpload = async (file: File, type: "logo" | "reference") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    if (type === "logo") setUploadingLogo(true);
    else setUploadingRef(true);

    try {
      const res = await fetch("/api/brand-kits/upload-asset", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        if (type === "logo") setLogoPng(data.url);
        else setReferenceImage(data.url);
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (err: any) {
      alert(`Upload error: ${err.message}`);
    } finally {
      if (type === "logo") setUploadingLogo(false);
      else setUploadingRef(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Brand Kits</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-800/60 font-medium">
              Multi-Brand Engine
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Lock visual aesthetics, 5-color palettes, typography, logos, and reference images across multiple Pinterest accounts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAiModal(true)}
            className="text-xs bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 px-3.5 py-2 rounded-lg flex items-center gap-1.5 font-medium transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>AI from Website</span>
          </button>

          <button
            onClick={handleCreateNew}
            className="text-xs bg-red-600 hover:bg-red-500 text-white px-3.5 py-2 rounded-lg flex items-center gap-1.5 font-medium shadow-sm shadow-red-500/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Brand Kit</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Left Kits Sidebar, Right Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Brand Kits List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase tracking-wider font-semibold px-1">
            <span>Your Brand Kits ({kits.length})</span>
          </div>

          <div className="space-y-2">
            {loading ? (
              <div className="p-8 text-center text-slate-500 text-xs">Loading kits...</div>
            ) : kits.length === 0 ? (
              <div className="p-8 border border-dashed border-slate-800 rounded-xl text-center text-slate-500 text-xs">
                No brand kits created yet. Click 'New Brand Kit' above.
              </div>
            ) : (
              kits.map((k) => {
                const isSelected = selectedKit?.id === k.id;
                let previewColors: string[] = [];
                try {
                  previewColors = k.palette ? JSON.parse(k.palette) : [];
                } catch {}

                return (
                  <div
                    key={k.id}
                    onClick={() => selectKitToEdit(k)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-slate-800/80 border-purple-500/60 shadow-lg shadow-purple-950/20"
                        : "bg-slate-900/60 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                        <h4 className="text-sm font-semibold text-slate-200">{k.kitName}</h4>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {k._count?.pins || 0} pins
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                      {k.brandName} {k.websiteUrl ? `• ${k.websiteUrl.replace(/^https?:\/\//, "")}` : ""}
                    </p>

                    {previewColors.length > 0 && (
                      <div className="flex items-center gap-1.5 mt-3">
                        {previewColors.slice(0, 5).map((hex, idx) => (
                          <div
                            key={idx}
                            className="w-4 h-4 rounded-full border border-slate-700/80 shadow-sm"
                            style={{ backgroundColor: hex }}
                            title={hex}
                          />
                        ))}
                        <span className="text-[10px] text-slate-500 font-mono ml-1">
                          {k.fontFamily}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Selected Kit Editor */}
        <div className="lg:col-span-8">
          {selectedKit ? (
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-8">
              {/* Top Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">{kitName || "Untitled Kit"}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-400">Settings Precedence:</span>
                    <span className="text-[10px] font-semibold text-purple-300 bg-purple-950/60 border border-purple-800/40 px-2 py-0.5 rounded">
                      job manual &gt; brand kit &gt; template &gt; global
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDuplicate}
                    title="Duplicate this Brand Kit"
                    className="p-2 rounded-lg border border-slate-800 bg-slate-850 hover:bg-slate-800 text-slate-300 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleDelete}
                    title="Delete Brand Kit"
                    className="p-2 rounded-lg border border-slate-800 bg-slate-850 hover:bg-red-950/40 text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="text-xs bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-semibold shadow-sm shadow-red-500/20 transition-all flex items-center gap-1.5"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>

              {/* Status Message */}
              {statusMsg && (
                <div
                  className={`p-3.5 rounded-xl text-xs flex items-center gap-2 border ${
                    statusMsg.type === "success"
                      ? "bg-emerald-950/30 border-emerald-800/50 text-emerald-300"
                      : "bg-red-950/30 border-red-800/50 text-red-300"
                  }`}
                >
                  {statusMsg.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{statusMsg.text}</span>
                </div>
              )}

              {/* General Brand Details */}
              <div className="space-y-4">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>Brand Identity</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400">Kit Name</label>
                    <input
                      type="text"
                      value={kitName}
                      onChange={(e) => setKitName(e.target.value)}
                      className="w-full bg-slate-850 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                      placeholder="e.g. Nordic Decor Primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400">Brand Display Name</label>
                    <input
                      type="text"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      className="w-full bg-slate-850 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                      placeholder="e.g. Nordic Nest"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400">Website URL (for watermark strip)</label>
                    <input
                      type="text"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      className="w-full bg-slate-850 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                      placeholder="e.g. nordicnest.com"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400">Style Vibe / Visual Adjectives</label>
                    <input
                      type="text"
                      value={styleVibe}
                      onChange={(e) => setStyleVibe(e.target.value)}
                      className="w-full bg-slate-850 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                      placeholder="e.g. minimalist scandi, warm organic, light airy"
                    />
                  </div>
                </div>
              </div>

              {/* 5-Color Brand Palette */}
              <div className="space-y-4 border-t border-slate-800/80 pt-6">
                <div>
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Palette className="w-3.5 h-3.5 text-purple-400" />
                    <span>5-Color Brand Palette (Spec Section 33.3 & 33.4)</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Colors are automatically translated to natural color descriptors for prompt injection because AI models do not understand raw hex codes.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {paletteColors.map((hex, index) => {
                    const roles = ["Background", "Text", "Primary", "Accent", "Secondary"];
                    const colorName = hexToColorName(hex);

                    return (
                      <div
                        key={index}
                        className="p-3 rounded-xl bg-slate-850 border border-slate-800 space-y-2 text-center"
                      >
                        <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                          {roles[index]}
                        </span>

                        <div className="flex items-center justify-center">
                          <input
                            type="color"
                            value={hex.startsWith("#") ? hex : "#CCCCCC"}
                            onChange={(e) => handleColorChange(index, e.target.value.toUpperCase())}
                            className="w-12 h-12 rounded-lg cursor-pointer bg-transparent border-0"
                          />
                        </div>

                        <input
                          type="text"
                          value={hex}
                          onChange={(e) => handleColorChange(index, e.target.value.toUpperCase())}
                          className="w-full bg-slate-900 border border-slate-800 rounded px-1.5 py-1 text-[11px] text-center font-mono text-slate-200 focus:outline-none focus:border-purple-500"
                        />

                        <div className="text-[10px] text-purple-300 font-medium capitalize">
                          &ldquo;{colorName}&rdquo;
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Logo & Watermark Strip */}
              <div className="space-y-4 border-t border-slate-800/80 pt-6">
                <div>
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
                    <span>Brand Logo &amp; Placement (Spec Section 30.6)</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Transparent PNG logo automatically scaled and checked against overlay text collision.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
                  <div className="space-y-3">
                    <label className="text-xs text-slate-400">Logo Image (PNG)</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={logoPng}
                        onChange={(e) => setLogoPng(e.target.value)}
                        placeholder="/uploads/brand/logo.png or URL"
                        className="flex-1 bg-slate-850 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                      />
                      <label className="cursor-pointer text-xs bg-slate-800 hover:bg-slate-750 text-slate-200 px-3 py-2 rounded-lg border border-slate-700 flex items-center gap-1.5 font-medium transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingLogo ? "..." : "Upload"}</span>
                        <input
                          type="file"
                          accept="image/png,image/svg+xml"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) handleFileUpload(e.target.files[0], "logo");
                          }}
                        />
                      </label>
                    </div>

                    {logoPng && (
                      <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={logoPng} alt="Logo Preview" className="h-10 max-w-[120px] object-contain" />
                        <span className="text-[11px] text-slate-400">Preview at 100% scale</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs text-slate-400">Position</label>
                        <select
                          value={logoPosition}
                          onChange={(e) => setLogoPosition(e.target.value)}
                          className="w-full bg-slate-850 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                        >
                          <option value="bottom_right">Bottom Right (Default)</option>
                          <option value="bottom_left">Bottom Left</option>
                          <option value="top_right">Top Right</option>
                          <option value="top_left">Top Left</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs text-slate-400">Opacity ({logoOpacity})</label>
                        <input
                          type="range"
                          min="0.2"
                          max="1.0"
                          step="0.05"
                          value={logoOpacity}
                          onChange={(e) => setLogoOpacity(parseFloat(e.target.value))}
                          className="w-full mt-2 accent-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Typography & Overlay Preset */}
              <div className="space-y-4 border-t border-slate-800/80 pt-6">
                <div>
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Type className="w-3.5 h-3.5 text-purple-400" />
                    <span>Typography &amp; Default Canvas Preset</span>
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400">Font Family</label>
                    <select
                      value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value)}
                      className="w-full bg-slate-850 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500 font-medium"
                    >
                      {FONT_OPTIONS.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400">Default Overlay Preset</label>
                    <select
                      value={overlayPreset}
                      onChange={(e) => setOverlayPreset(e.target.value)}
                      className="w-full bg-slate-850 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                    >
                      {PRESET_OPTIONS.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Reference Image (seedImage) Flow */}
              <div className="space-y-4 border-t border-slate-800/80 pt-6">
                <div>
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-purple-400" />
                    <span>Reference Image (seedImage - Spec Section 29.4)</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Style anchor for Runware models supporting seedImage (e.g. Standard SDXL). Strength 0.6 recommended.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={referenceImage}
                        onChange={(e) => setReferenceImage(e.target.value)}
                        placeholder="Reference image path or URL"
                        className="flex-1 bg-slate-850 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                      />
                      <label className="cursor-pointer text-xs bg-slate-800 hover:bg-slate-750 text-slate-200 px-3 py-2 rounded-lg border border-slate-700 flex items-center gap-1.5 font-medium transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingRef ? "..." : "Upload"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) handleFileUpload(e.target.files[0], "reference");
                          }}
                        />
                      </label>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Strength: {refStrength}</span>
                        <span className="text-[10px] text-slate-500">
                          {refStrength < 0.5 ? "Strict composition" : "Loose style inspiration"}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.3"
                        max="0.8"
                        step="0.05"
                        value={refStrength}
                        onChange={(e) => setRefStrength(parseFloat(e.target.value))}
                        className="w-full accent-purple-500"
                      />
                    </div>
                  </div>

                  {referenceImage && (
                    <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={referenceImage} alt="Ref preview" className="h-16 w-16 rounded object-cover" />
                      <div className="text-xs text-slate-400">
                        <div className="text-slate-200 font-medium">Style Reference Loaded</div>
                        <div className="text-[10px] text-amber-400 mt-0.5">
                          Applies to Standard tier models
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 border border-slate-800 rounded-2xl bg-slate-900/40 text-center">
              <Palette className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-slate-300">No Brand Kit Selected</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Select an existing brand kit from the left list or create a new one to customize your Pinterest brand aesthetic.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* AI Website Scraper Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white">AI Brand Kit from Website</h3>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Enter any brand or client website URL. PinForge will fetch the page, parse the brand name, logo, 5-color palette, typography, and synthesize a matching style vibe.
            </p>

            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-medium">Website URL</label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Globe className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={scrapeUrl}
                    onChange={(e) => setScrapeUrl(e.target.value)}
                    placeholder="https://nordicnest.com"
                    className="w-full bg-slate-850 border border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAiModal(false)}
                className="text-xs px-3.5 py-2 rounded-lg text-slate-400 hover:text-white font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleScrapeWebsite}
                disabled={scraping || !scrapeUrl.trim()}
                className="text-xs bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 shadow-sm shadow-purple-500/20 disabled:opacity-50"
              >
                {scraping ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Extracting Website...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Extract Brand Elements</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
