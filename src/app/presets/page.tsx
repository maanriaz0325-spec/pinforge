"use client";

import React, { useState } from "react";
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
} from "lucide-react";

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
    placement: "Top Centered Editorial",
    description: "Minimalist quiet-luxury aesthetic with fine geometric rules and centered serif typography.",
  },
  {
    id: "playful_colorful_badge",
    num: 5,
    name: "Playful Colorful Tag",
    refLabel: "Ref 1 (5/8)",
    refGroup: 1,
    defaultTopic: "Weekend Getaway Ideas",
    typography: "Inter Black 900 Sans + Rounded Tagline",
    decorElements: "Dual Stacked Color Badges (Golden Yellow + Salmon Pink) + Sunburst",
    placement: "Top Left Angle Tag",
    description: "High-CTR dual stacked pastel badges designed for viral weekend getaways, road trips, and cozy cabins.",
  },
  {
    id: "dark_cinematic_road",
    num: 6,
    name: "Dark Cinematic Road",
    refLabel: "Ref 1 (6/8)",
    refGroup: 1,
    defaultTopic: "Must See Places This Year",
    typography: "High-Contrast White Serif + Golden Cursive Subtitle",
    decorElements: "Atmospheric Twilight Scrim + Subtle Letter Spacing",
    placement: "Top Centered Atmospheric",
    description: "Moody cinematic twilight gradient with crisp white serif and gold script subtitle for atmospheric photography.",
  },
  {
    id: "healthy_habits_icons",
    num: 7,
    name: "Modern Lifestyle Icons Card",
    refLabel: "Ref 1 (7/8)",
    refGroup: 1,
    defaultTopic: "Healthy Habits - Better You",
    typography: "Modern Clean Sans + Elegant Italic Subtitle",
    decorElements: "Card with 3 Circular Lifestyle Action Icons (Diet, Activity, Mind)",
    placement: "Left Floating Card",
    description: "Clean informational card with 3 circular icons and bullet points, designed for wellness, smoothies, and routines.",
  },
  {
    id: "collage_washi_gems",
    num: 8,
    name: "Pinned Polaroid & Washi Note",
    refLabel: "Ref 1 (8/8)",
    refGroup: 1,
    defaultTopic: "Hidden Gems Off The Beaten Path",
    typography: "Casual Cursive Script + Clean Sans Subtitle",
    decorElements: "Torn Kraft Paper Note + Translucent Grey Washi Tape Strip",
    placement: "Right Floating Polaroid",
    description: "Realistic torn craft paper post-it pinned with authentic washi tape, ideal for beach finds and secret spots.",
  },

  // --- Reference Image 2: Presets 9 to 16 ---
  {
    id: "classic_elegant_santorini",
    num: 9,
    name: "Classic Elegant Flight",
    refLabel: "Ref 2 (1/8)",
    refGroup: 2,
    defaultTopic: "Dream Destinations in Greece",
    typography: "Refined Editorial Serif + Spaced Monospace Kicker",
    decorElements: "Airplane Silhouette + Curved Dotted Flight Trail (✈)",
    placement: "Top Left Travel Scrim",
    description: "High-end wanderlust aesthetic featuring an airplane silhouette and dotted flight path across the sky.",
  },
  {
    id: "modern_bold_amber",
    num: 10,
    name: "Modern Bold Amber Splash",
    refLabel: "Ref 2 (2/8)",
    refGroup: 2,
    defaultTopic: "Healthy Eating Meal Prep",
    typography: "Bold Black Sans + Slanted Script Subtitle",
    decorElements: "Golden-Amber Jagged Painted Backdrop + Sparkle Stars",
    placement: "Top Left Painted Badge",
    description: "Warm golden-amber painted splash highlight with distressed typography, tailored for fresh food & bowls.",
  },
  {
    id: "handwritten_torn_desk",
    num: 11,
    name: "Pinned Kraft Desk Note",
    refLabel: "Ref 2 (3/8)",
    refGroup: 2,
    defaultTopic: "Small Steps Big Dreams",
    typography: "Casual Handwritten Felt Pen + Soft Drop Shadow",
    decorElements: "Off-white Torn Paper Note + Top Centered Washi Strip",
    placement: "Top Floating Note",
    description: "Warm office desk notepad pinned to the pin canvas with a grey washi tape strip, perfect for motivation and advice.",
  },
  {
    id: "minimal_clean_fitness",
    num: 12,
    name: "Frosted Fitness & Metric Card",
    refLabel: "Ref 2 (4/8)",
    refGroup: 2,
    defaultTopic: "Stronger Every Day Workout Routine",
    typography: "Geometric High-Weight Sans + Spaced Numbers",
    decorElements: "Frosted Glassmorphism Card + 3 Circular Action Icons",
    placement: "Top Right Floating Card",
    description: "Translucent frosted glass card displaying 3 circular activity metric icons for workouts and gym aesthetics.",
  },
  {
    id: "playful_pastel_rainbow",
    num: 13,
    name: "Playful Pastel Rainbow Card",
    refLabel: "Ref 2 (5/8)",
    refGroup: 2,
    defaultTopic: "Little Moments Big Joy Nursery",
    typography: "Playful Multi-Tone Pastel Sans + Rounded Cloud Badge",
    decorElements: "Scalloped Cloud Card + Illustrated Mini Rainbow & Confetti",
    placement: "Top Center Whimsical Card",
    description: "Whimsical pastel cloud container with joyful rainbow illustration, suited for nursery, mom life, and crafts.",
  },
  {
    id: "dark_cinematic_coffee",
    num: 14,
    name: "Dark Cinematic Coffee Splash",
    refLabel: "Ref 2 (6/8)",
    refGroup: 2,
    defaultTopic: "Coffee Better Days Aesthetic",
    typography: "High-Contrast Bodoni Serif + White Italic Accent",
    decorElements: "Charcoal Paint Brush Splash + Minimalist Divider Line",
    placement: "Top Centered Moody Card",
    description: "Rustic textured black brushstroke backdrop with elegant high-contrast white serif typography for dark roasts & cafes.",
  },
  {
    id: "modern_overlay_sage_home",
    num: 15,
    name: "Modern Sage Frosted Card",
    refLabel: "Ref 2 (7/8)",
    refGroup: 2,
    defaultTopic: "Home Decor Inspiration & Styling",
    typography: "Clean Architectural Sans + Spaced Subheadings",
    decorElements: "Translucent Sage Green Card + Botanical Leaf Sprig Icon",
    placement: "Left Floating Card",
    description: "Earthy translucent sage-green card with botanical leaf sprig illustration and 3 checklist bullet points for interiors.",
  },
  {
    id: "collage_craft_ribbon",
    num: 16,
    name: "Blush Craft Note & Heart Stamp",
    refLabel: "Ref 2 (8/8)",
    refGroup: 2,
    defaultTopic: "Creative Ideas & Artisan DIY",
    typography: "Cursive Calligraphy + Clean Spaced Tagline",
    decorElements: "Blush Pink Torn Note + Translucent Washi Tape + Stamped Heart",
    placement: "Bottom Right Craft Note",
    description: "Warm blush pink textured scrap note with kraft tape and artisan stamp heart, ideal for DIY, ceramics, and crafts.",
  },

  // --- Reference Image 3: Preset 17 ---
  {
    id: "bold_center_badge",
    num: 17,
    name: "Bold Center Listicle Banner",
    refLabel: "Ref 3 (Preset 17)",
    refGroup: 3,
    defaultTopic: "35 Christmas Decor Ideas 2026",
    typography: "Giant White 115px Listicle Number + Bold White Sans Title + Year",
    decorElements: "Deep Slate Banner Across Center + Rounded Pill Button [ MORE IDEAS. ]",
    placement: "Center Full-Width Card (Grid Collage style)",
    description: "High-converting viral listicle banner spanning across the center with giant listicle number, high-contrast year, and click-optimized [ MORE IDEAS. ] pill button.",
  },

  // --- Reference Image 4: Preset 18 ---
  {
    id: "editorial_tall_script",
    num: 18,
    name: "Tall Editorial Serif + Script",
    refLabel: "Ref 4 (Preset 18)",
    refGroup: 4,
    defaultTopic: "20 Dark Purple Almond Nails That Take Minutes",
    typography: "Giant 122px Bodoni Serif Number + Deep Plum Serif + Cursive Accent Script",
    decorElements: "Plum Brush Stroke Ribbon Tag ('That Take Minutes') + Corner Scrim",
    placement: "Top Left Luxury Editorial Stack",
    description: "Luxury beauty & fashion magazine typography featuring a giant serif number, rich jewel-toned title, flowing cursive script, and horizontal acrylic brush stroke ribbon tag.",
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

export default function PresetsShowcasePage() {
  const [activeGroup, setActiveGroup] = useState<number | 0>(0); // 0 = all
  const [searchQuery, setSearchQuery] = useState("");
  const [previewTopic, setPreviewTopic] = useState("35 Christmas Decor Ideas 2026");
  const [bgMode, setBgMode] = useState<"photo" | "none">("photo");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [inspectPreset, setInspectPreset] = useState<PresetItem | null>(null);
  const [showRefSheets, setShowRefSheets] = useState(false);

  // Filter presets
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

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
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
                18 Authentic Pinterest Overlay Presets
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                18 Live
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Exact 1:1 Pinterest overlay presets matching the uploaded reference pins. Fully live with real SVG typography, washi tape, and brush strokes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowRefSheets(!showRefSheets)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-2 transition-all cursor-pointer ${
                showRefSheets
                  ? "bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/20"
                  : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showRefSheets ? "Hide Original Sheets" : "View Original Reference Sheets"}</span>
            </button>

            <Link
              href="/generate"
              className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-lg shadow-red-600/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Open Studio Generator</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Reference Image Comparison Sheets (Collapsible) */}
        {showRefSheets && (
          <div className="bg-slate-900/90 rounded-2xl border border-purple-500/30 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-purple-400" />
                  Original Reference Sheets Provided
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  The exact design source images for all 18 presets: Ref 1 (Presets 1–8), Ref 2 (Presets 9–16), Ref 3 (Preset 17), Ref 4 (Preset 18).
                </p>
              </div>
              <button
                onClick={() => setShowRefSheets(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-purple-300">Reference Sheet 1</span>
                  <span className="text-[10px] text-slate-400">Presets 1–8</span>
                </div>
                <div className="relative rounded-lg overflow-hidden border border-slate-700/60 aspect-[2/3] bg-black">
                  <img
                    src="/presets/ref_1_8.jpg"
                    alt="Reference 1"
                    className="w-full h-full object-contain"
                  />
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
                  <img
                    src="/presets/ref_9_16.jpg"
                    alt="Reference 2"
                    className="w-full h-full object-contain"
                  />
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
                  <img
                    src="/presets/ref_17.jpg"
                    alt="Reference 3"
                    className="w-full h-full object-contain"
                  />
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
                  <img
                    src="/presets/ref_18.jpg"
                    alt="Reference 4"
                    className="w-full h-full object-contain"
                  />
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

            {/* Background Mode Toggle */}
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-1 shrink-0">
              <button
                onClick={() => setBgMode("photo")}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  bgMode === "photo"
                    ? "bg-slate-800 text-white font-semibold shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Finished Pin View
              </button>
              <button
                onClick={() => setBgMode("none")}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  bgMode === "none"
                    ? "bg-slate-800 text-white font-semibold shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Isolated Overlay
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
            const previewUrl = `/api/presets/preview?preset=${preset.id}&topic=${encodeURIComponent(
              previewTopic || preset.defaultTopic
            )}&bg=${bgMode}`;

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

                {/* Live SVG Render Container (Standard 2:3 Pinterest Canvas) */}
                <div className="relative aspect-[2/3] bg-slate-950 overflow-hidden flex items-center justify-center border-b border-slate-800/80">
                  <img
                    src={previewUrl}
                    alt={preset.name}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                    loading="lazy"
                  />

                  {/* Hover Overlay with Inspect & Fullscreen button */}
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                    <button
                      onClick={() => setInspectPreset(preset)}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-xl border border-slate-600 transition-all cursor-pointer"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Inspect Details</span>
                    </button>
                    <Link
                      href={`/generate?preset=${preset.id}&topic=${encodeURIComponent(previewTopic || preset.defaultTopic)}`}
                      className="px-3.5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xl transition-all cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate</span>
                    </Link>
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
                        <span className="text-slate-400">Typography:</span>
                        <span className="text-slate-200 text-right truncate max-w-[180px]">
                          {preset.typography}
                        </span>
                      </div>
                      <div className="flex items-start justify-between gap-1 text-slate-400">
                        <span className="text-slate-400">Decorative:</span>
                        <span className="text-amber-300 text-right truncate max-w-[180px]">
                          {preset.decorElements}
                        </span>
                      </div>
                      <div className="flex items-start justify-between gap-1 text-slate-400">
                        <span className="text-slate-400">Footprint:</span>
                        <span className="text-emerald-400 text-right">{preset.placement}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-800/80">
                    <button
                      onClick={() => handleCopyId(preset.id)}
                      className="px-2.5 py-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 text-[11px] font-mono flex items-center gap-1.5 border border-transparent hover:border-slate-700 transition-all cursor-pointer"
                    >
                      {copiedId === preset.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>{preset.id}</span>
                        </>
                      )}
                    </button>

                    <Link
                      href={`/generate?preset=${preset.id}&topic=${encodeURIComponent(
                        previewTopic || preset.defaultTopic
                      )}`}
                      className="px-3 py-1.5 bg-red-600/90 hover:bg-red-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <span>Use In Studio</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Inspect High-Res Modal */}
      {inspectPreset && (
        <div className="fixed inset-0 bg-black/85 z-50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
            {/* Left: Big Preview */}
            <div className="md:w-1/2 bg-slate-950 flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-slate-800">
              <div className="relative aspect-[2/3] w-full max-w-[360px] rounded-xl overflow-hidden shadow-2xl border border-slate-800">
                <img
                  src={`/api/presets/preview?preset=${inspectPreset.id}&topic=${encodeURIComponent(
                    previewTopic || inspectPreset.defaultTopic
                  )}&bg=${bgMode}`}
                  alt={inspectPreset.name}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Right: Info & Controls */}
            <div className="md:w-1/2 p-6 flex flex-col justify-between space-y-6 overflow-y-auto">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-red-500/10 text-red-400 font-mono text-sm font-bold flex items-center justify-center border border-red-500/20">
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

                <div className="mt-4 space-y-4 text-xs">
                  <div>
                    <h4 className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] mb-1">
                      Preset Design Blueprint
                    </h4>
                    <p className="text-slate-300 leading-relaxed">{inspectPreset.description}</p>
                  </div>

                  <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-3 font-mono text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Typography System:</span>
                      <span className="text-white font-sans">{inspectPreset.typography}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Decorative Elements:</span>
                      <span className="text-amber-300 font-sans">{inspectPreset.decorElements}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Canvas Footprint:</span>
                      <span className="text-emerald-400 font-sans">
                        {inspectPreset.placement} (strictly ≤ 25% area)
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] mb-1.5">
                      Live Testing Prompt
                    </h4>
                    <input
                      type="text"
                      value={previewTopic}
                      onChange={(e) => setPreviewTopic(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                <button
                  onClick={() => handleCopyId(inspectPreset.id)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono flex items-center gap-2 border border-slate-700 transition-all cursor-pointer"
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

                <Link
                  href={`/generate?preset=${inspectPreset.id}&topic=${encodeURIComponent(
                    previewTopic || inspectPreset.defaultTopic
                  )}`}
                  className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-lg shadow-red-600/20 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Use This Preset In Studio</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
