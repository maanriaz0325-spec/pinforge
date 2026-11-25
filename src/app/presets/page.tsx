"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Sparkles,
  Layers,
  ArrowRight,
  Copy,
  Check,
  Search,
  Maximize2,
  X,
  Eye,
  Sliders,
  Image as ImageIcon,
  Palette,
  ExternalLink,
  Grid,
  Filter,
  LayoutTemplate,
  Type,
  Loader2,
  Upload,
  Heart,
  Trash2,
} from "lucide-react";
import { PinTemplateVisualPreview } from "@/components/PinTemplateVisualPreview";
import { PresetCustomizerEditor } from "@/components/PresetCustomizerEditor";

interface PresetItem {
  id: string;
  num: number;
  name: string;
  refLabel: string;
  refGroup: 1 | 2 | 3 | 4;
  defaultTopic: string;
  typography: string;
  decorElements: string;
  placement: string;
  description: string;
}

interface StudioTemplate {
  id: string;
  name: string;
  description: string;
  primaryCategory: string;
  categories: string[];
  designTypes: string[];
  width: number;
  height: number;
  aspectRatio: string;
  imageCount?: number;
  layoutId: string;
  collageGap: number;
  fonts: string[];
  colors: string[];
  layerTexts: string[];
  headlinePreview: string;
  visualConfig?: {
    badge?: { text: string; shape: string; bg: string; color: string } | null;
    blockStyle?: string;
    bandColor?: string;
    accentColor?: string;
    scriptWord?: string | null;
    photoTheme?: string;
  };
}

const PRESETS: PresetItem[] = [
  // --- Reference Image 1: Presets 1 to 8 ---
  {
    id: "classic_clean_travel",
    num: 1,
    name: "Classic Clean Travel",
    refLabel: "Ref 1 (1/8)",
    refGroup: 1,
    defaultTopic: "10 Best Travel Spots in Canada",
    typography: "Playfair Display Serif + Dancing Script Cursive",
    decorElements: "Category Kicker + Dotted Flight Trail (✈) + Top Scrim",
    placement: "Top Left (<25% footprint)",
    description: "Classic travel headline with elegant serif, italic script accent, and clean letter-spaced category tag.",
  },
  {
    id: "modern_bold_peach",
    num: 2,
    name: "Modern Bold Peach Splash",
    refLabel: "Ref 1 (2/8)",
    refGroup: 1,
    defaultTopic: "Good Food Restaurant & Cafe",
    typography: "Handwritten Script + Distressed Heavy Sans",
    decorElements: "Peach Painted Brush Splash + Sunburst Sparkle + Heart",
    placement: "Top Left Floating Card",
    description: "Vibrant painted peach acrylic brush splash backdrop with energetic typography and mini decorative sparkles.",
  },
  {
    id: "handwritten_explore",
    num: 3,
    name: "Handwritten Explore Wave",
    refLabel: "Ref 1 (3/8)",
    refGroup: 1,
    defaultTopic: "Explore More Coastal Places",
    typography: "Expressive Bold Script + Spaced Subtitle",
    decorElements: "Golden Underline Swoop + Sparkle Heart Icon",
    placement: "Top Right Dynamic Wave",
    description: "Spontaneous handwritten calligraphy paired with an energetic swooping underline, ideal for coastal adventures.",
  },
  {
    id: "minimal_clean_nature",
    num: 4,
    name: "Minimal Nature & Clean Line",
    refLabel: "Ref 1 (4/8)",
    refGroup: 1,
    defaultTopic: "Changes - Subtle Ways to Flourish",
    typography: "Didot/Bodoni Elegant Serif + Clean Tracked Subtitle",
    decorElements: "Thin Horizontal Accent Divider Line + Category Track",
    placement: "Top Centered Block",
    description: "Ultra-clean editorial serif layout with crisp horizontal divider line and airy letter-spacing.",
  },
  {
    id: "colorful_tags_steps",
    num: 5,
    name: "Colorful Step Tags",
    refLabel: "Ref 1 (5/8)",
    refGroup: 1,
    defaultTopic: "Top 7 Tips for Mindful Morning Habits",
    typography: "Ultra-Heavy Grotesk Sans + Number Badge",
    decorElements: "Multi-Color Rounded Number Pills + Outline Pill Box",
    placement: "Top Stack Left (<25% footprint)",
    description: "Punchy, modern listicle style featuring a contrasting number badge and multi-color stacked highlight tags.",
  },
  {
    id: "dark_scrim_contrast",
    num: 6,
    name: "Dark Scrim Bold Contrast",
    refLabel: "Ref 1 (6/8)",
    refGroup: 1,
    defaultTopic: "10 Reasons Why Dogs Bring Pure Joy",
    typography: "Modernist Geometric Sans + Playful Highlight Word",
    decorElements: "Radial Dark Vignette Scrim + White Backing Box",
    placement: "Top Half Banner",
    description: "High readability dark backdrop overlay with vibrant keyword highlight for maximum CTR.",
  },
  {
    id: "healthy_icons_list",
    num: 7,
    name: "Health & Icons Checklist",
    refLabel: "Ref 1 (7/8)",
    refGroup: 1,
    defaultTopic: "Healthy Eating 4 Wholesome Meal Prep Rules",
    typography: "Rounded Modern Sans + Elegant Serif Script",
    decorElements: "Mini Line Icons (Apple, Heart, Bowl) + Segment Divider",
    placement: "Top Left Structured Column",
    description: "Structured wellness checklist with mini vector iconography and clean segmented dividers.",
  },
  {
    id: "washi_gem_craft",
    num: 8,
    name: "Washi Tape & Gem Craft",
    refLabel: "Ref 1 (8/8)",
    refGroup: 1,
    defaultTopic: "Unique Gift Ideas for Creative People",
    typography: "Organic Serif + Marker Hand Script",
    decorElements: "Realistic Diagonal Washi Tape Ribbon + Faceted Gem Sparkle",
    placement: "Top Left Floating Label",
    description: "Artisan DIY craft feel featuring realistic textured tape ribbon and delicate faceted sparkle icons.",
  },

  // --- Reference Image 2: Presets 9 to 16 ---
  {
    id: "santorini_flight_trail",
    num: 9,
    name: "Santorini Flight Trail",
    refLabel: "Ref 2 (1/8)",
    refGroup: 2,
    defaultTopic: "Santorini Travel Guide: Top 10 Must-Visit Spots",
    typography: "Tall Editorial Serif + Swash Script Kicker",
    decorElements: "Curved Airplane Flight Path (✈) + Top Gradient Scrim",
    placement: "Top Center Editorial Block",
    description: "Signature luxury wanderlust layout with a graceful looping flight trail and warm Mediterranean aesthetic.",
  },
  {
    id: "amber_splash_bold",
    num: 10,
    name: "Amber Brush Splash",
    refLabel: "Ref 2 (2/8)",
    refGroup: 2,
    defaultTopic: "Savory Recipes: Homemade Gourmet Pasta & Sauce",
    typography: "Textured Heavy Slab + Casual Brush Subtitle",
    decorElements: "Rich Golden-Amber Paint Splash + Star Sparkles",
    placement: "Top Left Organic Shape",
    description: "Warm golden-amber painterly splash backdrop that pops off food and lifestyle photography.",
  },
  {
    id: "pinned_note_desk",
    num: 11,
    name: "Pinned Desk Sticky Note",
    refLabel: "Ref 2 (3/8)",
    refGroup: 2,
    defaultTopic: "Productivity Hacks: 5 Daily Morning Routines",
    typography: "Casual Felt-Pen Marker + Crisp Sans Monospace",
    decorElements: "Realistic Push Pin (📌) + Cast Drop Shadow Note",
    placement: "Top Left Realistic Stationery",
    description: "Realistic desk stationery aesthetic with pushpin fastener, gentle rotation, and realistic drop shadow.",
  },
  {
    id: "frosted_glass_gym",
    num: 12,
    name: "Frosted Glass Gym Card",
    refLabel: "Ref 2 (4/8)",
    refGroup: 2,
    defaultTopic: "Full Body Workout: Build Core Strength in 20 Mins",
    typography: "High-Impact Condensed Sans + Neon Accent Tag",
    decorElements: "Backdrop Blur Acrylic Glass + Neon Cyan Accent Strip",
    placement: "Top Centered Float Card",
    description: "Modern frosted glassmorphic card with dynamic neon accent line, engineered for high-energy fitness pins.",
  },
  {
    id: "pastel_cloud_wellness",
    num: 13,
    name: "Pastel Cloud Mindful Habits",
    refLabel: "Ref 2 (5/8)",
    refGroup: 2,
    defaultTopic: "Mindful Living: Gentle Daily Self-Care Routines",
    typography: "Soft Rounded Sans + Flowing Italic Script",
    decorElements: "Frosted Soft Cloud Pill + Floating Lavender Sparkles",
    placement: "Top Center Gentle Cloud",
    description: "Calming pastel cloud shape with soft rounded edges and whimsical lavender star sparkles.",
  },
  {
    id: "charcoal_dark_coffee",
    num: 14,
    name: "Charcoal Scrim Dark Coffee",
    refLabel: "Ref 2 (6/8)",
    refGroup: 2,
    defaultTopic: "Artisan Coffee Roasts: Brewing the Perfect Pour-Over",
    typography: "Bold High-Contrast Serif + Crisp All-Caps Subtitle",
    decorElements: "Smooth Charcoal Scrim Gradient + Minimal White Framing",
    placement: "Top Half Moody Scrim",
    description: "Sophisticated moody dark scrim that creates striking contrast over warm coffee and rustic wood textures.",
  },
  {
    id: "sage_home_glow",
    num: 15,
    name: "Sage Green & Soft Glow",
    refLabel: "Ref 2 (7/8)",
    refGroup: 2,
    defaultTopic: "Living Room Decor: Cozy Modern Minimalist Spaces",
    typography: "Refined Modern Serif + Wide-Track Subtitle",
    decorElements: "Sage Green Rounded Tag + Diffuse Soft Backlight Glow",
    placement: "Top Left Structured Block",
    description: "Earthy sage green aesthetic with subtle backlight glow, perfectly attuned to interior decor and lifestyle.",
  },
  {
    id: "craft_ribbon_diy",
    num: 16,
    name: "Craft Ribbon & Stamp DIY",
    refLabel: "Ref 2 (8/8)",
    refGroup: 2,
    defaultTopic: "Easy DIY Pottery Projects: Beginner Clay Creations",
    typography: "Artisan Typewriter Sans + Playful Handwritten Accent",
    decorElements: "Folded Craft Paper Ribbon + Circular 'Handmade' Badge Stamp",
    placement: "Top Left Ribbon Banner",
    description: "Charming folded craft paper ribbon banner complete with an artisan handmade quality stamp.",
  },

  // --- Reference Image 3: Preset 17 ---
  {
    id: "christmas_slate_listicle",
    num: 17,
    name: "Christmas Decor Slate 4-Grid Listicle",
    refLabel: "Ref 3 (Preset 17)",
    refGroup: 3,
    defaultTopic: "35 Christmas Decor Ideas 2026",
    typography: "Condensed Headline Sans + Monospace Subtitle",
    decorElements: "Solid Deep-Slate Card + Giant Listicle Number + Pill CTA",
    placement: "Center Floating Square Card (between 4-grid photo quadrants)",
    description: "Exact 1:1 match of Ref 3: Designed for 4-photo quadrant collages with a centered deep slate card, white listicle count, and [ MORE IDEAS. ] pill.",
  },

  // --- Reference Image 4: Preset 18 ---
  {
    id: "purple_script_ribbon",
    num: 18,
    name: "20 Dark Purple Almond Nails Ribbon",
    refLabel: "Ref 4 (Preset 18)",
    refGroup: 4,
    defaultTopic: "20 Dark Purple Almond Nails",
    typography: "Giant Didot Serif Number + Flowing Cursive Script + Clean Sans",
    decorElements: "Angular Lavender Brush Ribbon + Jewel Tone Serif + Script Highlight",
    placement: "Upper Center Ribbon Floating Banner",
    description: "Exact 1:1 match of Ref 4: High-contrast luxury beauty pin with giant serif number '20', flowing script 'Dark Purple', and angled lavender ribbon tag.",
  },
];

const SUGGESTED_TOPICS = [
  "35 Christmas Decor Ideas 2026",
  "20 Dark Purple Almond Nails",
  "10 Best Travel Spots in Canada",
  "Good Food Restaurant & Cafe",
  "Explore More Coastal Places",
  "Healthy Eating Meal Prep",
  "Stronger Every Day Workout Routine",
  "Home Decor Inspiration & Styling",
  "Coffee Better Days Aesthetic",
  "Creative Ideas & Artisan DIY",
];

const STUDIO_CATEGORIES = [
  { id: "all", label: "All Categories" },
  { id: "Home & Home Decor", label: "Home Decor" },
  { id: "Fashion & Outfits", label: "Fashion" },
  { id: "Food & Recipes", label: "Food & Recipes" },
  { id: "Hair & Hairstyles", label: "Hair & Nails" },
  { id: "Travel & Places", label: "Travel & Places" },
  { id: "Health, Fitness & Wellness", label: "Wellness & Fitness" },
  { id: "Holidays & Events", label: "Holidays & Events" },
  { id: "DIY & Crafts", label: "Artisan & DIY" },
  { id: "Business, Finance & Quotes", label: "Quotes & Lifestyle" },
];

const STUDIO_LAYOUTS = [
  { id: "all", label: "All Layouts" },
  { id: "single", label: "Single Hero Pin" },
  { id: "grid-2x2", label: "2×2 Photo Grid" },
  { id: "band-2-2", label: "2 Top / 2 Bottom Band" },
  { id: "band-2-3", label: "2 Top / 3 Bottom Split" },
  { id: "band-1-1", label: "1 Top / 1 Bottom Split" },
  { id: "two-side", label: "Two Column Split" },
  { id: "three-hero-top", label: "Top Hero + 2 Stack" },
];

const STUDIO_STYLES = [
  { id: "all", label: "All Archetypes" },
  { id: "white-blocks", label: "Stacked White Blocks" },
  { id: "black-boxes", label: "Solid Black Boxes" },
  { id: "number-badge", label: "Number Badges" },
  { id: "framed-card", label: "Framed Rounded Card" },
  { id: "script-accent", label: "Script Cursive Accent" },
  { id: "brush-banner", label: "Brush Ribbon Banner" },
  { id: "glow", label: "Neon / Soft Glow" },
];

export default function PresetsShowcasePage() {
  // Main view switcher: "studio" (AutoPinDesign) | "custom18" (18 Reference Presets) | "editor" (Live Customizer)
  const [mainTab, setMainTab] = useState<"studio" | "custom18" | "editor">("studio");
  const [customizerTemplateId, setCustomizerTemplateId] = useState<string>("sb-pink-combat-boots");

  // Studio Presets State
  const [studioTemplates, setStudioTemplates] = useState<StudioTemplate[]>([]);
  const [studioLoading, setStudioLoading] = useState(false);
  const [selectedStudioCat, setSelectedStudioCat] = useState("all");
  const [selectedStudioLayout, setSelectedStudioLayout] = useState("all");
  const [selectedStudioStyle, setSelectedStudioStyle] = useState("all");
  const [studioSearch, setStudioSearch] = useState("");
  const [featuredCollection, setFeaturedCollection] = useState<string>("all");
  const [favoritedIds, setFavoritedIds] = useState<Set<string>>(new Set());

  function toggleFavorite(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    setFavoritedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleCustomizeTemplate(templateId: string) {
    setCustomizerTemplateId(templateId);
    setMainTab("editor");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  const [selectedStudioDetail, setSelectedStudioDetail] = useState<StudioTemplate | null>(null);

  // 18 Reference Presets State
  const [activeGroup, setActiveGroup] = useState<number | 0>(0); // 0 = all
  const [searchQuery, setSearchQuery] = useState("");
  const [previewTopic, setPreviewTopic] = useState("35 Christmas Decor Ideas 2026");
  const [viewMode, setViewMode] = useState<"exact" | "live" | "transparent">("exact");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [inspectPreset, setInspectPreset] = useState<PresetItem | null>(null);
  const [showRefSheets, setShowRefSheets] = useState(false);

  // Fetch Studio Templates
  useEffect(() => {
    async function loadStudioTemplates() {
      try {
        setStudioLoading(true);
        const res = await fetch("/api/templates/studio");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setStudioTemplates(json.data);
        }
      } catch (err) {
        console.error("Failed to load studio templates:", err);
      } finally {
        setStudioLoading(false);
      }
    }
    loadStudioTemplates();
  }, []);

  // Filter 18 Reference presets
  const filteredPresets = PRESETS.filter((p) => {
    if (activeGroup !== 0 && p.refGroup !== activeGroup) return false;
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.typography.toLowerCase().includes(q) ||
        p.decorElements.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Filter Studio presets
  const filteredStudioTemplates = useMemo(() => {
    return studioTemplates.filter((t) => {
      if (featuredCollection === "viral") {
        if (!t.name.toLowerCase().includes("viral")) return false;
      } else if (featuredCollection === "luxe") {
        if (!t.name.toLowerCase().includes("luxe")) return false;
      } else if (featuredCollection === "script-bar") {
        if (!t.name.toLowerCase().includes("script & bar") && !t.name.toLowerCase().includes("script and bar")) return false;
      } else if (featuredCollection === "high-ctr") {
        if (!t.name.toLowerCase().includes("high ctr")) return false;
      } else if (featuredCollection === "favorites") {
        if (!favoritedIds.has(t.id)) return false;
      }

      if (selectedStudioCat !== "all") {
        const cat = selectedStudioCat.toLowerCase();
        const match =
          t.primaryCategory.toLowerCase() === cat ||
          t.categories.some((c) => c.toLowerCase() === cat || c.toLowerCase().includes(cat));
        if (!match) return false;
      }
      if (selectedStudioLayout !== "all") {
        if (t.layoutId.toLowerCase() !== selectedStudioLayout.toLowerCase()) return false;
      }
      if (selectedStudioStyle !== "all") {
        const style = t.visualConfig?.blockStyle || "";
        if (selectedStudioStyle === "number-badge") {
          if (!t.visualConfig?.badge) return false;
        } else if (style !== selectedStudioStyle) {
          return false;
        }
      }
      if (studioSearch.trim()) {
        const q = studioSearch.toLowerCase();
        const match =
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.primaryCategory.toLowerCase().includes(q) ||
          t.fonts.some((f) => f.toLowerCase().includes(q)) ||
          t.layerTexts.some((txt) => txt.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    });
  }, [studioTemplates, selectedStudioCat, selectedStudioLayout, selectedStudioStyle, studioSearch, featuredCollection, favoritedIds]);

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getPresetImageSrc = (preset: PresetItem) => {
    if (viewMode === "exact") {
      return `/presets/exact/preset_${preset.num}.jpg`;
    }
    if (viewMode === "live") {
      return `/api/presets/preview?preset=${preset.id}&topic=${encodeURIComponent(
        previewTopic || preset.defaultTopic
      )}&bg=photo`;
    }
    return `/api/presets/preview?preset=${preset.id}&topic=${encodeURIComponent(
      previewTopic || preset.defaultTopic
    )}&bg=none`;
  };

  return (
    <div className="min-w-0 flex-1 bg-slate-950 text-slate-100 min-h-screen">
      {/* Top Banner / Navigation Header */}
      <div className="border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                <Layers className="w-4 h-4" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                Pinterest Overlay Presets & Studio Gallery
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                247 Studio + 18 Live
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Select any extracted AutoPinDesign overlay preset or live reference design to apply high-CTR typography, badges, and layout collages.
            </p>
          </div>

          {/* Primary View Switcher Tabs */}
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setMainTab("studio")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                mainTab === "studio"
                  ? "bg-red-600 text-white shadow-md shadow-red-900/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Studio Presets ({studioTemplates.length || 272})</span>
            </button>
            <button
              onClick={() => setMainTab("editor")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                mainTab === "editor"
                  ? "bg-red-600 text-white shadow-md shadow-red-900/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>🎨 Pin Customizer & Studio Editor</span>
            </button>
            <button
              onClick={() => setMainTab("custom18")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                mainTab === "custom18"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-900/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>18 Custom Reference Presets</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* ========================================================================= */}
        {/* TAB 1: AutoPinDesign Studio Presets Gallery (247)                          */}
        {/* ========================================================================= */}
        {mainTab === "studio" && (
          <div className="space-y-6">
            {/* Studio Filter Controls */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 space-y-3.5 shadow-sm">
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search 247 templates by title, font, color, or keyword..."
                    value={studioSearch}
                    onChange={(e) => setStudioSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>

                {/* Layout Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 whitespace-nowrap">Layout:</span>
                  <select
                    value={selectedStudioLayout}
                    onChange={(e) => setSelectedStudioLayout(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-red-500"
                  >
                    {STUDIO_LAYOUTS.map((ly) => (
                      <option key={ly.id} value={ly.id}>
                        {ly.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Styling Archetype Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 whitespace-nowrap">Style Archetype:</span>
                  <select
                    value={selectedStudioStyle}
                    onChange={(e) => setSelectedStudioStyle(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-red-500"
                  >
                    {STUDIO_STYLES.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Category Filter Chips */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80 overflow-x-auto text-xs">
                <span className="text-slate-400 font-medium shrink-0">Niche Category:</span>
                {STUDIO_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedStudioCat(cat.id)}
                    className={`px-3 py-1 rounded-full text-[11px] font-medium border whitespace-nowrap transition-all cursor-pointer ${
                      selectedStudioCat === cat.id
                        ? "bg-red-600 text-white border-red-500 font-semibold shadow-sm"
                        : "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-300"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Results count & status */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <div>
                Showing <span className="text-white font-bold">{filteredStudioTemplates.length}</span> of{" "}
                <span className="text-white font-bold">{studioTemplates.length}</span> extracted templates
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <span>Layout geometries rendered with live typography & badges</span>
              </div>
            </div>

            {/* Studio Templates Grid */}
            {featuredCollection === "viral" && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/40 to-slate-900 border border-red-800/40 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-red-400" />
                    <span>Viral Pin Collection</span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Exact recreations of top-performing Pins — every box stays in place, just swap the photos and words.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-red-400 bg-red-950 px-2.5 py-1 rounded-full border border-red-800/60">
                  {filteredStudioTemplates.length} Templates
                </span>
              </div>
            )}

            {featuredCollection === "luxe" && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/30 to-slate-900 border border-amber-800/40 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Luxe Hair & Editorial Collection</span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Two-line caps, stacked numbers, modern black number boxes, and high-end beauty magazine layouts.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950 px-2.5 py-1 rounded-full border border-amber-800/60">
                  {filteredStudioTemplates.length} Templates
                </span>
              </div>
            )}

            {featuredCollection === "script-bar" && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/30 to-slate-900 border border-purple-800/40 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>Script & Bar Collection</span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Vibrant outlined number badges, elegant script keyword kickers, bold contrast colored topic bars.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950 px-2.5 py-1 rounded-full border border-purple-800/60">
                  {filteredStudioTemplates.length} Templates
                </span>
              </div>
            )}

            {featuredCollection === "high-ctr" && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-pink-950/30 to-slate-900 border border-pink-800/40 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-pink-400" />
                    <span>High CTR Ruled Lead-In & Band Collection</span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Ruled lead-in headlines, huge pink caps, double ruled lines, and high-visibility contrast ribbons.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-pink-400 bg-pink-950 px-2.5 py-1 rounded-full border border-pink-800/60">
                  {filteredStudioTemplates.length} Templates
                </span>
              </div>
            )}

            {studioLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                <Loader2 className="w-8 h-8 animate-spin text-red-500 mb-3" />
                <span className="text-sm">Loading 247 AutoPinDesign presets...</span>
              </div>
            ) : filteredStudioTemplates.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-800">
                <p className="text-slate-400 text-sm">No studio presets matched your current filter.</p>
                <button
                  onClick={() => {
                    setSelectedStudioCat("all");
                    setSelectedStudioLayout("all");
                    setSelectedStudioStyle("all");
                    setStudioSearch("");
                  }}
                  className="mt-3 text-xs text-red-400 hover:underline cursor-pointer"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStudioTemplates.map((t) => {
                  const isFavorited = favoritedIds.has(t.id);
                  const imageCountDisplay = t.imageCount || (t.layoutId === "single" ? 1 : t.layoutId?.includes("two") ? 2 : t.layoutId?.includes("three") ? 3 : t.layoutId?.includes("5") || t.layoutId?.includes("2-3") ? 5 : t.layoutId?.includes("6") || t.layoutId?.includes("2-4") ? 6 : 4);
                  const ratioDisplay = t.aspectRatio || "1:2";

                  return (
                    <div
                      key={t.id}
                      onClick={() => handleCustomizeTemplate(t.id)}
                      className="bg-[#121620] rounded-2xl border border-slate-800/90 hover:border-slate-700 transition-all flex flex-col overflow-hidden shadow-xl group cursor-pointer"
                    >
                      {/* Visual Layout Preview Container */}
                      <div className="relative aspect-[1/2] bg-[#0c0f16] overflow-hidden flex items-center justify-center border-b border-slate-800/80 p-2">
                        <PinTemplateVisualPreview template={t} className="w-full h-full shadow-inner" />

                        {/* Top-Right Circular Heart Favorite Button (matching AutoPinDesign) */}
                        <button
                          type="button"
                          onClick={(e) => toggleFavorite(t.id, e)}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md flex items-center justify-center transition-transform hover:scale-110 z-20 cursor-pointer"
                          title="Save to favorites"
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              isFavorited ? "fill-red-500 text-red-500" : "text-slate-700"
                            }`}
                          />
                        </button>

                        {/* Hover Overlay with Action Buttons */}
                        <div className="absolute inset-0 bg-slate-950/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2.5 backdrop-blur-[2px] p-4 z-10">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCustomizeTemplate(t.id);
                            }}
                            className="w-full max-w-[170px] py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xl transition-all cursor-pointer"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                            <span>Customize & Edit</span>
                          </button>
                          <Link
                            href={`/generate?preset=${encodeURIComponent(t.id)}&topic=${encodeURIComponent(
                              t.headlinePreview || t.name
                            )}`}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-[170px] py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xl border border-slate-700 transition-all cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            <span>AI Generate</span>
                          </Link>
                        </div>
                      </div>

                      {/* Card Body matching AutoPinDesign */}
                      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                        <div className="space-y-2">
                          {/* Template Name */}
                          <h3 className="text-xs font-bold text-white group-hover:text-red-400 transition-colors line-clamp-2 leading-snug">
                            {t.name}
                          </h3>

                          {/* Dark Pill Badges matching screenshots */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#1c2230] text-slate-300 border border-slate-700/50">
                              {imageCountDisplay} {imageCountDisplay === 1 ? "image" : "images"}
                            </span>
                            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#1c2230] text-slate-300 border border-slate-700/50">
                              {ratioDisplay}
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#1c2230] text-slate-300 border border-slate-700/50">
                              {t.primaryCategory}
                            </span>
                            {t.categories?.[0] && t.categories[0] !== t.primaryCategory && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#1c2230] text-slate-300 border border-slate-700/50">
                                {t.categories[0]}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Bottom Action Icons matching AutoPinDesign */}
                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard?.writeText(t.name);
                              }}
                              className="p-1.5 text-slate-500 hover:text-slate-300 transition-colors rounded-md hover:bg-slate-800 cursor-pointer"
                              title="Copy Template Name"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              className="p-1.5 text-slate-500 hover:text-red-400 transition-colors rounded-md hover:bg-slate-800 cursor-pointer"
                              title="Delete / Hide"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCustomizeTemplate(t.id);
                            }}
                            className="text-[11px] font-bold text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                          >
                            <span>Customize</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: Live Pin Customizer & Studio Editor (AutoPinDesign Dual-Sync)         */}
        {/* ========================================================================= */}
        {mainTab === "editor" && (
          <div className="space-y-6">
            <PresetCustomizerEditor
              initialTemplateId={customizerTemplateId}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: 18 Custom Reference Presets (Ref 1 to 4)                           */}
        {/* ========================================================================= */}
        {mainTab === "custom18" && (
          <div className="space-y-6">
            {/* Reference Image Comparison Sheets (Collapsible) */}
            <div className="flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-semibold text-white">Authentic Reference Source Sheets</span>
                <span className="text-xs text-slate-400">(Ref 1 to 4 uploaded design sheets)</span>
              </div>
              <button
                onClick={() => setShowRefSheets(!showRefSheets)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-2 transition-all cursor-pointer ${
                  showRefSheets
                    ? "bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/20"
                    : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{showRefSheets ? "Hide Source Sheets" : "View 4 Original Sheets"}</span>
              </button>
            </div>

            {showRefSheets && (
              <div className="bg-slate-900/90 rounded-2xl border border-purple-500/30 p-6 space-y-4 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-purple-300">Reference Sheet 1</span>
                      <span className="text-[10px] text-slate-400">Presets 1–8</span>
                    </div>
                    <div className="relative rounded-lg overflow-hidden border border-slate-700/60 aspect-[2/3] bg-black">
                      <img src="/presets/ref_1_8.jpg" alt="Reference 1" className="w-full h-full object-contain" />
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Travel, Food & Peach Splash, Explore Waves, Nature Lines, Colorful Tags, Dark Scrims, Healthy Icons, Washi Gems.
                    </p>
                  </div>

                  <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-purple-300">Reference Sheet 2</span>
                      <span className="text-[10px] text-slate-400">Presets 9–16</span>
                    </div>
                    <div className="relative rounded-lg overflow-hidden border border-slate-700/60 aspect-[2/3] bg-black">
                      <img src="/presets/ref_9_16.jpg" alt="Reference 2" className="w-full h-full object-contain" />
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Santorini Flight Trail, Amber Splash, Pinned Desk Note, Frosted Gym, Pastel Cloud, Dark Charcoal Coffee, Sage Home, Craft Ribbon.
                    </p>
                  </div>

                  <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-purple-300">Reference Sheet 3</span>
                      <span className="text-[10px] text-slate-400">Preset 17</span>
                    </div>
                    <div className="relative rounded-lg overflow-hidden border border-slate-700/60 aspect-[2/3] bg-black">
                      <img src="/presets/ref_17.jpg" alt="Reference 3" className="w-full h-full object-contain" />
                    </div>
                    <p className="text-[11px] text-slate-400">
                      35 Christmas Decor Ideas 2026: 4-grid photo style, center deep slate card, white listicle number & [ MORE IDEAS. ] pill.
                    </p>
                  </div>

                  <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-purple-300">Reference Sheet 4</span>
                      <span className="text-[10px] text-slate-400">Preset 18</span>
                    </div>
                    <div className="relative rounded-lg overflow-hidden border border-slate-700/60 aspect-[2/3] bg-black">
                      <img src="/presets/ref_18.jpg" alt="Reference 4" className="w-full h-full object-contain" />
                    </div>
                    <p className="text-[11px] text-slate-400">
                      20 Dark Purple Almond Nails: Giant high-contrast serif number, rich jewel tone serif, flowing script, brush ribbon tag.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Interactive Controls Bar */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 space-y-3.5 shadow-sm">
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search presets by name, typography, or decor style..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>

                {/* Topic Switcher Bar */}
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-xs text-slate-400 whitespace-nowrap">Live Topic:</span>
                  <input
                    type="text"
                    value={previewTopic}
                    onChange={(e) => setPreviewTopic(e.target.value)}
                    placeholder="Enter any topic to test dynamic adaptation..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>

                {/* View Mode Switcher */}
                <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-1 shrink-0">
                  <button
                    onClick={() => setViewMode("exact")}
                    className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                      viewMode === "exact"
                        ? "bg-red-600 text-white font-semibold shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Exact Reference
                  </button>
                  <button
                    onClick={() => setViewMode("live")}
                    className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                      viewMode === "live"
                        ? "bg-slate-800 text-white font-semibold shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Live Dynamic Topic
                  </button>
                  <button
                    onClick={() => setViewMode("transparent")}
                    className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                      viewMode === "transparent"
                        ? "bg-slate-800 text-white font-semibold shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Isolated Layer
                  </button>
                </div>
              </div>

              {/* Quick Topic Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px]">
                <span className="text-slate-400 shrink-0">Try Topics:</span>
                {SUGGESTED_TOPICS.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setPreviewTopic(topic)}
                    className={`px-2.5 py-1 rounded-md border whitespace-nowrap transition-colors cursor-pointer ${
                      previewTopic === topic
                        ? "bg-red-500/10 text-red-400 border-red-500/30 font-medium"
                        : "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-300"
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>

              {/* Reference Source Filter Pills */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80 overflow-x-auto text-xs">
                <span className="text-slate-400 font-medium">Filter Reference:</span>
                {[
                  { id: 0, label: "All 18 Presets" },
                  { id: 1, label: "Ref 1 (Presets 1–8: Travel & Adventure)" },
                  { id: 2, label: "Ref 2 (Presets 9–16: Wellness & Studio)" },
                  { id: 3, label: "Ref 3 (Preset 17: Christmas 4-Grid Listicle)" },
                  { id: 4, label: "Ref 4 (Preset 18: Luxury Almond Nails)" },
                ].map((grp) => (
                  <button
                    key={grp.id}
                    onClick={() => setActiveGroup(grp.id as any)}
                    className={`px-3 py-1 rounded-full text-[11px] font-medium border transition-all cursor-pointer ${
                      activeGroup === grp.id
                        ? "bg-white text-slate-900 border-white font-semibold shadow-sm"
                        : "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-300"
                    }`}
                  >
                    {grp.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 18 Presets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPresets.map((preset) => {
                const imgSrc = getPresetImageSrc(preset);

                return (
                  <div
                    key={preset.id}
                    className="bg-slate-900 rounded-xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col overflow-hidden shadow-lg group"
                  >
                    {/* Card Header */}
                    <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-6 h-6 rounded-md bg-slate-800 text-slate-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-slate-700">
                          #{preset.num}
                        </span>
                        <h3 className="text-sm font-bold text-white truncate group-hover:text-red-400 transition-colors">
                          {preset.name}
                        </h3>
                      </div>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 text-purple-300 border border-purple-500/20 shrink-0">
                        {preset.refLabel}
                      </span>
                    </div>

                    {/* Preset Image Container (Standard 2:3 Pinterest Canvas) */}
                    <div className="relative aspect-[2/3] bg-slate-950 overflow-hidden flex items-center justify-center border-b border-slate-800/80">
                      <img
                        src={imgSrc}
                        alt={preset.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        loading="lazy"
                      />

                      {/* Hover Overlay with Inspect, Customize & Generator button */}
                      <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2.5 p-4 backdrop-blur-[2px]">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCustomizeTemplate(preset.id);
                          }}
                          className="w-full py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-xl transition-all cursor-pointer"
                        >
                          <Sliders className="w-3.5 h-3.5" />
                          <span>🎨 Customize Preset</span>
                        </button>

                        <div className="flex items-center gap-2 w-full">
                          <button
                            type="button"
                            onClick={() => setInspectPreset(preset)}
                            className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1 shadow-md border border-slate-600 transition-all cursor-pointer"
                          >
                            <Maximize2 className="w-3 h-3" />
                            <span>Details</span>
                          </button>
                          <Link
                            href={`/generate?preset=${preset.id}&topic=${encodeURIComponent(previewTopic || preset.defaultTopic)}`}
                            className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1 shadow-md border border-slate-600 transition-all cursor-pointer"
                          >
                            <Sparkles className="w-3 h-3 text-red-400" />
                            <span>Generate</span>
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Card Specs & Design Blueprint */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3 text-xs">
                      <div className="space-y-2">
                        <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2">
                          {preset.description}
                        </p>

                        <div className="space-y-1.5 bg-slate-950/60 rounded-lg p-2.5 border border-slate-800/60 font-mono text-[10px]">
                          <div className="flex items-start justify-between gap-1 text-slate-400">
                            <span>Typography:</span>
                            <span className="text-slate-200 text-right truncate max-w-[180px]">
                              {preset.typography}
                            </span>
                          </div>
                          <div className="flex items-start justify-between gap-1 text-slate-400">
                            <span>Decor:</span>
                            <span className="text-amber-300 text-right truncate max-w-[180px]">
                              {preset.decorElements}
                            </span>
                          </div>
                          <div className="flex items-start justify-between gap-1 text-slate-400">
                            <span>Placement:</span>
                            <span className="text-emerald-400 text-right truncate max-w-[180px]">
                              {preset.placement}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-800/80">
                        <button
                          onClick={() => handleCopyId(preset.id)}
                          className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] font-mono flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                        >
                          {copiedId === preset.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy ID</span>
                            </>
                          )}
                        </button>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCustomizeTemplate(preset.id);
                            }}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-md shadow-red-900/30 transition-all cursor-pointer"
                          >
                            <Sliders className="w-3 h-3" />
                            <span>Customize</span>
                          </button>
                          <Link
                            href={`/generate?preset=${preset.id}&topic=${encodeURIComponent(previewTopic || preset.defaultTopic)}`}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg text-[11px] flex items-center border border-slate-700 transition-all cursor-pointer"
                            title="Open in AI Generator"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Studio Template Detail Modal */}
      {selectedStudioDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setSelectedStudioDetail(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-800 font-semibold">
                  {selectedStudioDetail.primaryCategory}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                  {selectedStudioDetail.aspectRatio} ({selectedStudioDetail.width}×{selectedStudioDetail.height})
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-2">{selectedStudioDetail.name}</h2>
              <p className="text-xs text-slate-400 mt-1">{selectedStudioDetail.description}</p>
            </div>

            {/* High-fidelity Visual Preview */}
            <div className="flex justify-center py-2 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <PinTemplateVisualPreview template={selectedStudioDetail} className="w-48 shadow-2xl rounded-xl overflow-hidden" />
            </div>

            {/* Layout & Design Details */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Layout Format:</span>
                <span className="text-white font-semibold">{selectedStudioDetail.layoutId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Template ID:</span>
                <span className="text-slate-300 font-mono">{selectedStudioDetail.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Archetype:</span>
                <span className="text-purple-300 font-semibold">
                  {selectedStudioDetail.visualConfig?.blockStyle || "clean-overlay"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Typography Fonts:</span>
                <div className="flex flex-wrap gap-1">
                  {selectedStudioDetail.fonts.map((f) => (
                    <span key={f} className="px-2 py-0.5 rounded bg-slate-800 text-purple-300 font-medium text-[11px]">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Colors:</span>
                <div className="flex items-center gap-2">
                  {selectedStudioDetail.colors.map((clr, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <span className="w-3.5 h-3.5 rounded-full border border-slate-700" style={{ backgroundColor: clr }} />
                      <span className="font-mono text-[10px] text-slate-300">{clr}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Default Headline Layers */}
            {selectedStudioDetail.layerTexts.length > 0 && (
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-300">Default Headline Layers:</span>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 space-y-1 text-xs">
                  {selectedStudioDetail.layerTexts.map((txt, idx) => (
                    <div key={idx} className="text-slate-200 flex items-center gap-2 text-[11px]">
                      <span className="text-[10px] text-slate-500 font-mono">0{idx + 1}.</span>
                      <span className="font-medium">{txt}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 flex flex-wrap items-center justify-end gap-2.5">
              <button
                onClick={() => setSelectedStudioDetail(null)}
                className="px-3.5 py-2 text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
              <Link
                href={`/generate?preset=${encodeURIComponent(selectedStudioDetail.id)}&mode=upload`}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700 shadow-sm"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Image & Edit Preset</span>
              </Link>
              <Link
                href={`/generate?preset=${encodeURIComponent(selectedStudioDetail.id)}&topic=${encodeURIComponent(
                  selectedStudioDetail.headlinePreview || selectedStudioDetail.name
                )}`}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate with AI</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Reference Preset Inspect Modal */}
      {inspectPreset && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 font-mono text-sm font-bold flex items-center justify-center">
                  #{inspectPreset.num}
                </span>
                <div>
                  <h2 className="text-base font-bold text-white">{inspectPreset.name}</h2>
                  <span className="text-xs text-purple-400 font-mono">
                    {inspectPreset.refLabel} • ID: {inspectPreset.id}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setInspectPreset(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative aspect-[2/3] bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
                <img
                  src={getPresetImageSrc(inspectPreset)}
                  alt={inspectPreset.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] mb-1">
                    Design Blueprint
                  </h4>
                  <p className="text-slate-300 leading-relaxed">{inspectPreset.description}</p>
                </div>

                <div className="bg-slate-950 rounded-xl p-3.5 border border-slate-800 space-y-2.5 font-mono text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Typography:</span>
                    <span className="text-white font-sans">{inspectPreset.typography}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Decorative Elements:</span>
                    <span className="text-amber-300 font-sans">{inspectPreset.decorElements}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Placement:</span>
                    <span className="text-emerald-400 font-sans">{inspectPreset.placement}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] mb-1">
                    Test Live Prompt
                  </h4>
                  <input
                    type="text"
                    value={previewTopic}
                    onChange={(e) => setPreviewTopic(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
              <button
                onClick={() => handleCopyId(inspectPreset.id)}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono flex items-center gap-2 border border-slate-700 transition-all cursor-pointer"
              >
                {copiedId === inspectPreset.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Preset ID</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <Link
                  href={`/generate?preset=${inspectPreset.id}&mode=upload`}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700 shadow-sm"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload & Edit</span>
                </Link>

                <Link
                  href={`/generate?preset=${inspectPreset.id}&topic=${encodeURIComponent(
                    previewTopic || inspectPreset.defaultTopic
                  )}`}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-lg shadow-red-600/20 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate with AI</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
