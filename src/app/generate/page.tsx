"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Sliders,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Coins,
  Palette,
  ExternalLink,
  Type,
  Layout,
  Layers,
  Wand2,
  ListPlus,
  RefreshCw,
  RotateCcw,
} from "lucide-react";

interface ModelOption {
  id: string;
  label: string;
  tier: string;
  pricePerImage: number;
  runwareModelId: string;
  notes?: string;
}

interface PinTypeOption {
  id: string;
  name: string;
  compositionRule: string;
}

interface TemplateOption {
  id: string;
  name: string;
  niche: { name: string };
  systemPrompt: string;
}

interface GeneratedIdea {
  idea: string;
  angle: string;
  composition: string;
  setting: string;
  mood: string;
  targetKeyword: string;
}

const STYLES = [
  "Editorial",
  "Simple",
  "Minimalist",
  "Bold",
  "Luxury",
  "Dark & Moody",
  "Bright & Airy",
  "Cozy Rustic",
  "Vintage",
  "Cinematic",
];

const OVERLAY_PRESET_OPTIONS = [
  // Reference Image 1 (8 Distinct Styles)
  { id: "classic_clean_travel", label: "1. Classic Clean (Serif + Cursive Subtitle + Trip Tagline)" },
  { id: "modern_bold_peach", label: "2. Modern Bold Peach (Peach Painted Splash + Sunburst + Heart)" },
  { id: "handwritten_explore", label: "3. Handwritten Style (Bold Script + Golden Underline Swoop)" },
  { id: "minimal_clean_nature", label: "4. Minimal & Clean (Centered Serif + Subtle Divider Line)" },
  { id: "playful_colorful_badge", label: "5. Playful & Colorful (Triple Badges + Sun Rays + Bottom Tag)" },
  { id: "dark_cinematic_road", label: "6. Dark & Cinematic (Top Gradient Scrim + Gold Cursive)" },
  { id: "healthy_habits_icons", label: "7. Modern Lifestyle Icons (3 Vertical Lifestyle Icons)" },
  { id: "collage_washi_gems", label: "8. Collage / Washi Style (Torn Paper Note + Washi Tape)" },
  // Reference Image 2 (8 Distinct Styles)
  { id: "classic_elegant_santorini", label: "9. Classic Elegant (Editorial Serif + Dotted Flight Path ✈)" },
  { id: "modern_bold_amber", label: "10. Modern Bold Amber (Golden Painted Splash Backdrop)" },
  { id: "handwritten_torn_desk", label: "11. Handwritten Desk Note (Torn Note + Centered Washi Tape)" },
  { id: "minimal_clean_fitness", label: "12. Minimal Clean Fitness (Metric Header + 3 Circular Icons)" },
  { id: "playful_pastel_rainbow", label: "13. Playful Pastel Rainbow (Scalloped Cloud Badge + Mini Rainbow)" },
  { id: "dark_cinematic_coffee", label: "14. Dark Cinematic Coffee (Charcoal Paint Brush Splash Backdrop)" },
  { id: "modern_overlay_sage_home", label: "15. Modern Sage Frosted Card (Translucent Sage + Leaf Sprig)" },
  { id: "collage_craft_ribbon", label: "16. Blush Craft Note (Peach Torn Note + DIY Stamp + Heart)" },
  // Reference Image 3: Preset 17
  { id: "bold_center_badge", label: "17. Bold Center Listicle Banner (35 Christmas / Slate Card + Big Number & Pill)" },
  // Reference Image 4: Preset 18
  { id: "editorial_tall_script", label: "18. Tall Editorial Serif + Script (Giant Bodoni Number + Plum Script + Ribbon)" },
];

const ASPECT_OPTIONS = [
  {
    id: "2:3",
    title: "Pinterest",
    ratio: "2:3",
    dims: "768 × 1152",
    desc: "Feed standard",
    aspectBox: "w-3.5 h-5",
  },
  {
    id: "9:16",
    title: "Tall",
    ratio: "9:16",
    dims: "720 × 1280",
    desc: "Reels / Stories",
    aspectBox: "w-3 h-5.5",
  },
  {
    id: "1:1",
    title: "Square",
    ratio: "1:1",
    dims: "1024 × 1024",
    desc: "Square feed",
    aspectBox: "w-4 h-4",
  },
  {
    id: "4:5",
    title: "Portrait",
    ratio: "4:5",
    dims: "864 × 1080",
    desc: "Vertical post",
    aspectBox: "w-3.5 h-4.5",
  },
  {
    id: "16:9",
    title: "Landscape",
    ratio: "16:9",
    dims: "1280 × 720",
    desc: "Wide banner",
    aspectBox: "w-5.5 h-3",
  },
] as const;

const EIGHTEEN_PRESETS_CYCLE_CLIENT = [
  "classic_clean_travel",
  "modern_bold_peach",
  "handwritten_explore",
  "minimal_clean_nature",
  "playful_colorful_badge",
  "dark_cinematic_road",
  "healthy_habits_icons",
  "collage_washi_gems",
  "classic_elegant_santorini",
  "modern_bold_amber",
  "handwritten_torn_desk",
  "minimal_clean_fitness",
  "playful_pastel_rainbow",
  "dark_cinematic_coffee",
  "modern_overlay_sage_home",
  "collage_craft_ribbon",
  "bold_center_badge",
  "editorial_tall_script",
];

const SIXTEEN_PRESETS_CYCLE_CLIENT = EIGHTEEN_PRESETS_CYCLE_CLIENT;


function computeDistributedModes(
  totalCount: number,
  ratioInImage: number,
  ratioOverlay: number,
  ratioNoText: number
): Array<"canvas" | "in_image" | "none"> {
  if (totalCount <= 0) return [];
  const sum = (ratioInImage || 0) + (ratioOverlay || 0) + (ratioNoText || 0);
  if (sum <= 0) return Array(totalCount).fill("canvas");

  let countInImage = Math.round((ratioInImage / sum) * totalCount);
  let countOverlay = Math.round((ratioOverlay / sum) * totalCount);
  let countNone = totalCount - countInImage - countOverlay;

  if (countNone < 0) {
    if (countInImage >= countOverlay && countInImage > 0) {
      countInImage += countNone;
    } else {
      countOverlay += countNone;
    }
    countNone = 0;
  }

  const inImageItems = Array(Math.max(0, countInImage)).fill("in_image" as const);
  const overlayItems = Array(Math.max(0, countOverlay)).fill("canvas" as const);
  const noneItems = Array(Math.max(0, countNone)).fill("none" as const);

  const result: Array<"canvas" | "in_image" | "none"> = [];
  while (inImageItems.length > 0 || overlayItems.length > 0 || noneItems.length > 0) {
    if (inImageItems.length > 0) result.push(inImageItems.pop()!);
    if (overlayItems.length > 0) result.push(overlayItems.pop()!);
    if (noneItems.length > 0) result.push(noneItems.pop()!);
  }

  return result.slice(0, totalCount);
}

interface BrandKitOption {
  id: string;
  kitName: string;
  brandName: string;
  fontFamily: string;
  overlayPreset: string;
  palette: string | null;
  logoPng: string | null;
}

export default function GeneratePage() {
  // Mode selector: "way1" (Prompt Mode), "bulk" (Bulk Multi-Line Prompts), "way2a" (Auto-Idea Zero Input), "way2b" (Single-line expansion)
  const [activeWay, setActiveWay] = useState<"way1" | "bulk" | "way2a" | "way2b">("way1");

  // Aspect ratio state
  const [selectedAspect, setSelectedAspect] = useState<"2:3" | "9:16" | "1:1" | "4:5" | "16:9">("2:3");

  const [prompt, setPrompt] = useState("");
  const [bulkPromptsText, setBulkPromptsText] = useState("");
  const [bulkGenerating, setBulkGenerating] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<{ current: number; total: number; promptName: string } | null>(null);
  const [bulkResults, setBulkResults] = useState<any[]>([]);

  // Bulk Pin Visual Type Ratios (%)
  const [ratioInImage, setRatioInImage] = useState<number>(50);
  const [ratioOverlay, setRatioOverlay] = useState<number>(30);
  const [ratioNoText, setRatioNoText] = useState<number>(20);
  const [cyclePresetsInBulk, setCyclePresetsInBulk] = useState<boolean>(true);

  const [models, setModels] = useState<ModelOption[]>([]);
  const [pinTypes, setPinTypes] = useState<PinTypeOption[]>([]);
  const [templates, setTemplates] = useState<TemplateOption[]>([]);
  const [brandKits, setBrandKits] = useState<BrandKitOption[]>([]);
  const [brandKitEnabled, setBrandKitEnabled] = useState(false);
  const [selectedBrandKitId, setSelectedBrandKitId] = useState("");
  const [selectedModelId, setSelectedModelId] = useState("");
  const [selectedPinTypeId, setSelectedPinTypeId] = useState("inspiration");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("Editorial");

  // Overlay options
  const [textMode, setTextMode] = useState<"canvas" | "in_image" | "none">("canvas");
  const [overlayPreset, setOverlayPreset] = useState("classic_clean_travel");
  const [customOverlayText, setCustomOverlayText] = useState("");
  const [bulkDefaultOverlayText, setBulkDefaultOverlayText] = useState("");
  const [presetIsManual, setPresetIsManual] = useState(false);

  // Way 2a states
  const [ideaCount, setIdeaCount] = useState(10);
  const [inventedIdeas, setInventedIdeas] = useState<GeneratedIdea[]>([]);
  const [inventingIdeas, setInventingIdeas] = useState(false);

  // Way 2b states
  const [rawIdeaLines, setRawIdeaLines] = useState("");
  const [expandedPrompts, setExpandedPrompts] = useState<{ original: string; expandedPrompt: string }[]>([]);
  const [expandingIdeas, setExpandingIdeas] = useState(false);

  // Prompt Enhancer states
  const [enhancingPrompt, setEnhancingPrompt] = useState(false);
  const [originalPromptHistory, setOriginalPromptHistory] = useState<string | null>(null);
  const [promptEnhancedBadge, setPromptEnhancedBadge] = useState<string | null>(null);
  const [autoEnhance, setAutoEnhance] = useState(false);

  const [loadingData, setLoadingData] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [generatedResult, setGeneratedResult] = useState<{
    pinId: string;
    imageUrl: string;
    title?: string;
    cost: number;
    model: string;
    seoScore?: number;
  } | null>(null);

  useEffect(() => {
    async function loadMetadata() {
      try {
        setLoadingData(true);
        const [modelsRes, pinTypesRes, templatesRes, settingsRes, brandKitsRes] = await Promise.all([
          fetch("/api/models"),
          fetch("/api/pintypes"),
          fetch("/api/templates"),
          fetch("/api/settings"),
          fetch("/api/brand-kits"),
        ]);

        const modelsJson = await modelsRes.json();
        const pinTypesJson = await pinTypesRes.json();
        const templatesJson = await templatesRes.json();
        const settingsJson = await settingsRes.json();
        const brandKitsJson = await brandKitsRes.json();

        if (modelsJson.success && Array.isArray(modelsJson.data)) {
          setModels(modelsJson.data);
          const defaultImageModelId = settingsJson?.data?.defaultImageModel;
          const match = modelsJson.data.find(
            (m: ModelOption) => m.runwareModelId === defaultImageModelId || m.id === defaultImageModelId
          );
          setSelectedModelId(match ? match.id : modelsJson.data[0]?.id || "");
        }

        if (pinTypesJson.success && Array.isArray(pinTypesJson.data)) {
          setPinTypes(pinTypesJson.data);
        }

        if (templatesJson.success && Array.isArray(templatesJson.data)) {
          setTemplates(templatesJson.data);
          if (templatesJson.data.length > 0) {
            setSelectedTemplateId(templatesJson.data[0].id);
          }
        }

        if (brandKitsJson.success && Array.isArray(brandKitsJson.kits)) {
          setBrandKits(brandKitsJson.kits);
          if (brandKitsJson.kits.length > 0) {
            setSelectedBrandKitId(brandKitsJson.kits[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to load metadata:", err);
      } finally {
        setLoadingData(false);
      }
    }

    loadMetadata();

    // Check query params if navigated from Presets Showcase
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const presetParam = params.get("preset");
      const topicParam = params.get("topic");
      const headlineParam = params.get("headline");

      if (presetParam) {
        setOverlayPreset(presetParam);
        setTextMode("canvas");
        setPresetIsManual(true);
      }
      if (topicParam) {
        setPrompt(topicParam);
      }
      if (headlineParam) {
        setCustomOverlayText(headlineParam);
      }
    }
  }, []);

  const selectedModel = models.find((m) => m.id === selectedModelId);
  const estimatedCost = selectedModel?.pricePerImage ?? 0.0019;

  // Way 2a: Invent ideas with Diversity Engine
  async function handleInventIdeas() {
    if (!selectedTemplateId) {
      setErrorMsg("Please select a Niche Template for Auto-Idea Mode.");
      return;
    }

    setInventingIdeas(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/ideas/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: selectedTemplateId,
          count: ideaCount,
        }),
      });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setInventedIdeas(json.data);
      } else {
        setErrorMsg(json.error || "Failed to invent ideas.");
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Network error generating ideas.");
    } finally {
      setInventingIdeas(false);
    }
  }

  // Way 2b: Expand single-line ideas
  async function handleExpandLines() {
    if (!selectedTemplateId) {
      setErrorMsg("Please select a Niche Template for Idea Expansion.");
      return;
    }

    const lines = rawIdeaLines
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length >= 3);

    if (lines.length === 0) {
      setErrorMsg("Enter at least one idea line to expand.");
      return;
    }

    setExpandingIdeas(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/ideas/expand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: selectedTemplateId,
          lines,
        }),
      });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setExpandedPrompts(json.data);
      } else {
        setErrorMsg(json.error || "Failed to expand idea lines.");
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Network error expanding ideas.");
    } finally {
      setExpandingIdeas(false);
    }
  }

  // Handle AI Prompt Enhancement
  async function handleEnhancePrompt() {
    if (!prompt.trim()) {
      setErrorMsg("Please enter an image prompt or idea first to enhance it.");
      return;
    }
    setEnhancingPrompt(true);
    setErrorMsg(null);
    try {
      const activeTemplate = templates.find((t) => t.id === selectedTemplateId);
      const res = await fetch("/api/prompt/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          style: selectedStyle,
          niche: activeTemplate?.niche?.name || activeTemplate?.name,
          pinType: selectedPinTypeId,
        }),
      });

      const json = await res.json();
      if (json.success && json.data?.enhancedPrompt) {
        setOriginalPromptHistory(prompt);
        setPrompt(json.data.enhancedPrompt);
        setPromptEnhancedBadge(json.data.enhancementTechnique === "ai_llm" ? "AI Enhanced ✨" : "Enhanced for Pinterest ✨");
      } else {
        setErrorMsg(json.error || "Failed to enhance prompt.");
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Network error enhancing prompt.");
    } finally {
      setEnhancingPrompt(false);
    }
  }

  function handleUndoEnhance() {
    if (originalPromptHistory !== null) {
      setPrompt(originalPromptHistory);
      setOriginalPromptHistory(null);
      setPromptEnhancedBadge(null);
    }
  }

  // Execute generation for single prompt
  async function handleGenerate(promptToUse: string, headline?: string) {
    if (!promptToUse.trim()) {
      setErrorMsg("Please provide an image prompt.");
      return;
    }
    if (!selectedModelId) {
      setErrorMsg("Please select an image generation model.");
      return;
    }

    setGenerating(true);
    setErrorMsg(null);
    setGeneratedResult(null);

    let finalPrompt = promptToUse.trim();

    // Auto-enhance if enabled and not already enhanced
    if (autoEnhance && !promptEnhancedBadge) {
      try {
        const activeTemplate = templates.find((t) => t.id === selectedTemplateId);
        const enhRes = await fetch("/api/prompt/enhance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: finalPrompt,
            style: selectedStyle,
            niche: activeTemplate?.niche?.name || activeTemplate?.name,
            pinType: selectedPinTypeId,
          }),
        });
        const enhJson = await enhRes.json();
        if (enhJson.success && enhJson.data?.enhancedPrompt) {
          finalPrompt = enhJson.data.enhancedPrompt;
        }
      } catch {}
    }

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: finalPrompt,
          modelId: selectedModelId,
          aspectRatio: selectedAspect,
          pinTypeId: selectedPinTypeId,
          style: selectedStyle,
          textMode,
          overlayPreset,
          overlayText: headline || customOverlayText.trim() || undefined,
          brandKitId: brandKitEnabled ? selectedBrandKitId : undefined,
          brandKitEnabled,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setErrorMsg(json.error || "Generation request failed.");
      } else {
        setGeneratedResult({
          pinId: json.data.pin.id,
          imageUrl: json.data.pin.imageUrl,
          title: json.data.pin.title,
          cost: json.data.cost,
          model: json.data.model,
          seoScore: json.data.seo?.seoScore,
        });
        if (activeWay === "way1") setPrompt("");
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Network error during generation.");
    } finally {
      setGenerating(false);
    }
  }

  // Execute bulk generation for multi-line prompts, auto-ideas, or expanded lines
  async function handleBulkGenerate(customPrompts?: string[]) {
    const lines =
      customPrompts && customPrompts.length > 0
        ? customPrompts
        : bulkPromptsText
            .split("\n")
            .map((l) => l.trim())
            .filter((l) => l.length > 0);

    if (lines.length === 0) {
      setErrorMsg("Please enter at least one prompt line for bulk generation.");
      return;
    }
    if (!selectedModelId) {
      setErrorMsg("Please select an image generation model.");
      return;
    }

    setBulkGenerating(true);
    setErrorMsg(null);
    setBulkResults([]);
    setBulkProgress({ current: 0, total: lines.length, promptName: lines[0].slice(0, 45) });

    const accumulated: any[] = [];
    const totalLines = lines.length;
    const distributedModes = computeDistributedModes(totalLines, ratioInImage, ratioOverlay, ratioNoText);
    let overlayCounter = 0;

    for (let i = 0; i < lines.length; i++) {
      const rawLine = lines[i];
      let linePrompt = rawLine;
      let lineCustomOverlay: string | undefined = undefined;

      if (rawLine.includes("|")) {
        const parts = rawLine.split("|");
        linePrompt = parts[0].trim();
        lineCustomOverlay = parts.slice(1).join("|").trim();
      } else if (bulkDefaultOverlayText.trim()) {
        lineCustomOverlay = bulkDefaultOverlayText.trim();
      }

      const itemTextMode = distributedModes[i] || "canvas";
      let itemOverlayPreset = overlayPreset;
      if (cyclePresetsInBulk) {
        itemOverlayPreset = EIGHTEEN_PRESETS_CYCLE_CLIENT[overlayCounter % EIGHTEEN_PRESETS_CYCLE_CLIENT.length];
        if (itemTextMode === "canvas") {
          overlayCounter++;
        }
      }

      setBulkProgress({
        current: i + 1,
        total: lines.length,
        promptName: linePrompt.slice(0, 45) + (linePrompt.length > 45 ? "..." : ""),
      });

      let promptToSend = linePrompt;
      if (autoEnhance) {
        try {
          const activeTemplate = templates.find((t) => t.id === selectedTemplateId);
          const enhRes = await fetch("/api/prompt/enhance", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              prompt: promptToSend,
              style: selectedStyle,
              niche: activeTemplate?.niche?.name || activeTemplate?.name,
              pinType: selectedPinTypeId,
            }),
          });
          const enhJson = await enhRes.json();
          if (enhJson.success && enhJson.data?.enhancedPrompt) {
            promptToSend = enhJson.data.enhancedPrompt;
          }
        } catch {}
      }

      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: promptToSend,
            modelId: selectedModelId,
            aspectRatio: selectedAspect,
            pinTypeId: selectedPinTypeId,
            style: selectedStyle,
            textMode: itemTextMode,
            overlayPreset: itemOverlayPreset,
            overlayText: lineCustomOverlay || undefined,
            brandKitId: brandKitEnabled ? selectedBrandKitId : undefined,
            brandKitEnabled,
          }),
        });

        const json = await res.json();
        if (json.success && json.data) {
          accumulated.push({
            pin: json.data.pin,
            seo: json.data.seo,
            prompt: linePrompt,
            cost: json.data.cost,
            model: json.data.model,
            textMode: itemTextMode,
            presetUsed: itemOverlayPreset,
          });
          setBulkResults([...accumulated]);
        }
      } catch (itemErr: unknown) {
        console.error("Bulk item error:", itemErr);
      }
    }

    setBulkGenerating(false);
    setBulkProgress(null);
  }

  function renderPinTypeRatioControls(totalCount: number) {
    const detectedCount = totalCount > 0 ? totalCount : 10;
    const sumRatios = (ratioInImage || 0) + (ratioOverlay || 0) + (ratioNoText || 0);
    const inImgCount = sumRatios > 0 ? Math.round(((ratioInImage || 0) / sumRatios) * detectedCount) : 0;
    const ovCount = sumRatios > 0 ? Math.round(((ratioOverlay || 0) / sumRatios) * detectedCount) : 0;
    const clnCount = Math.max(0, detectedCount - inImgCount - ovCount);
    const activePresetLabel = OVERLAY_PRESET_OPTIONS.find((p) => p.id === overlayPreset)?.label || overlayPreset;

    return (
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/80 space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
          <div>
            <span className="text-xs font-semibold text-white flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pin Visual Type Ratio Distribution</span>
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Distribute your batch across In-Image AI Typography, 18 Graphic Presets, and Clean Photography.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => {
                setRatioInImage(50);
                setRatioOverlay(30);
                setRatioNoText(20);
              }}
              className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors cursor-pointer"
            >
              50 / 30 / 20 (Recommended)
            </button>
            <button
              type="button"
              onClick={() => {
                setRatioInImage(34);
                setRatioOverlay(33);
                setRatioNoText(33);
              }}
              className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Balanced (33/33/33)
            </button>
            <button
              type="button"
              onClick={() => {
                setRatioInImage(0);
                setRatioOverlay(100);
                setRatioNoText(0);
              }}
              className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              100% Canvas Overlay
            </button>
            <button
              type="button"
              onClick={() => {
                setRatioInImage(100);
                setRatioOverlay(0);
                setRatioNoText(0);
              }}
              className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              100% In-Image
            </button>
            <button
              type="button"
              onClick={() => {
                setRatioInImage(0);
                setRatioOverlay(0);
                setRatioNoText(100);
              }}
              className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              100% Clean
            </button>
          </div>
        </div>

        {/* Sliders / Number inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Text In Image */}
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-blue-400">Text In Image (AI)</span>
              <span className="font-mono text-white font-semibold">{ratioInImage}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={ratioInImage}
              onChange={(e) => setRatioInImage(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block leading-tight">
              Seamless typography baked directly into the photo.
            </span>
          </div>

          {/* Overlay Text */}
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-red-400">Canvas Overlay (Preset)</span>
              <span className="font-mono text-white font-semibold">{ratioOverlay}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={ratioOverlay}
              onChange={(e) => setRatioOverlay(Number(e.target.value))}
              className="w-full accent-red-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block leading-tight">
              Rendered with our 18 authentic reference presets.
            </span>
          </div>

          {/* Clean / No Text */}
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-emerald-400">No Text (Clean Photo)</span>
              <span className="font-mono text-white font-semibold">{ratioNoText}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={ratioNoText}
              onChange={(e) => setRatioNoText(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block leading-tight">
              Pure photographic aesthetic with negative space.
            </span>
          </div>
        </div>

        {/* Live Distribution preview & 18 Presets Cycle toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-800/60">
          <div className="text-xs text-slate-300 flex flex-wrap items-center gap-2">
            <span className="text-slate-500">
              Distribution for {detectedCount} pins:
            </span>
            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono text-[11px]">
              {inImgCount} In-Image
            </span>
            <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 font-mono text-[11px]">
              {ovCount} Overlay
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[11px]">
              {clnCount} Clean
            </span>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={cyclePresetsInBulk}
                onChange={(e) => setCyclePresetsInBulk(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-red-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-[11px] text-slate-300">
                Rotate through all 18 reference presets
              </span>
            </label>
            {!cyclePresetsInBulk && (
              <span className="text-[10px] text-amber-400 font-mono">
                (Locked: {activePresetLabel.slice(0, 22)}...)
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  function renderBulkProgressAndResults() {
    return (
      <>
        {/* Bulk Generation Progress Bar */}
        {bulkGenerating && bulkProgress && (
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 space-y-2 animate-pulse mt-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-emerald-300 font-medium flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                Processing pin {bulkProgress.current} of {bulkProgress.total}: &quot;{bulkProgress.promptName}&quot;
              </span>
              <span className="font-mono text-emerald-400 font-semibold">
                {Math.round((bulkProgress.current / bulkProgress.total) * 100)}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                style={{ width: `${(bulkProgress.current / bulkProgress.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Bulk Generated Results Gallery */}
        {bulkResults.length > 0 && (
          <div className="space-y-3 pt-3 border-t border-slate-800 mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-white">
                  Generated Pins ({bulkResults.length}):
                </span>
              </div>
              <Link
                href="/library"
                className="text-xs text-red-400 hover:text-white flex items-center gap-1 font-semibold underline"
              >
                <span>Open Full Library</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto p-1">
              {bulkResults.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-800 bg-slate-950 flex gap-4 items-start hover:border-slate-700 transition-colors"
                >
                  <div className="w-24 h-36 rounded-lg overflow-hidden bg-slate-900 border border-slate-800 shrink-0 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.pin.imageUrl}
                      alt={item.seo?.title || item.pin.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-1.5 text-xs text-slate-300 min-w-0">
                    <div className="flex items-center justify-between gap-1 flex-wrap">
                      <div className="flex items-center gap-1">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-medium ${
                          item.textMode === "in_image"
                            ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                            : item.textMode === "none"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}>
                          {item.textMode === "in_image" ? "In-Image Text" : item.textMode === "none" ? "Clean Photo" : "Canvas Overlay"}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 text-[10px] font-mono font-medium truncate max-w-[120px]">
                          {item.seo?.targetKeyword || item.pin.targetKeyword}
                        </span>
                      </div>
                      <span className="font-mono text-emerald-400 font-bold text-[11px] shrink-0">
                        ${item.cost.toFixed(4)}
                      </span>
                    </div>

                    <h4 className="font-semibold text-white text-xs leading-snug line-clamp-1">
                      {item.seo?.title || item.pin.title}
                    </h4>

                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {item.seo?.description || item.pin.description}
                    </p>

                    <div className="text-[10px] text-slate-500 line-clamp-1">
                      <strong>Alt:</strong> {item.seo?.altText || item.pin.altText}
                    </div>

                    <div className="flex items-center gap-1 flex-wrap pt-0.5">
                      {(() => {
                        try {
                          const tags = typeof item.pin.hashtags === "string" ? JSON.parse(item.pin.hashtags) : item.seo?.hashtags || [];
                          return (tags as string[]).slice(0, 3).map((t, tidx) => (
                            <span key={tidx} className="text-[10px] text-blue-400">
                              #{t}
                            </span>
                          ));
                        } catch {
                          return null;
                        }
                      })()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Generate Pins</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-medium">
              Way 1 & Way 2 Engine
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Choose between Prompt Mode or Niche-Aware Auto-Idea Generation with our 3-Axis Diversity Engine.
          </p>
        </div>

        <Link
          href="/library"
          className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
        >
          <span>View Library</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => setActiveWay("way1")}
          className={`p-4 rounded-xl border text-left transition-all ${
            activeWay === "way1"
              ? "bg-red-500/10 border-red-500 text-white shadow-md shadow-red-500/10"
              : "bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-sm">Way 1: Single Prompt</span>
            <Sparkles className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-xs text-slate-400">Single prompt with AI Prompt Enhancement.</p>
        </button>

        <button
          type="button"
          onClick={() => setActiveWay("bulk")}
          className={`p-4 rounded-xl border text-left transition-all ${
            activeWay === "bulk"
              ? "bg-emerald-500/10 border-emerald-500 text-white shadow-md shadow-emerald-500/10"
              : "bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-sm">Way 2: Bulk Prompts</span>
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xs text-slate-400">Multi-line prompts (no char limit, 1 pin per line).</p>
        </button>

        <button
          type="button"
          onClick={() => setActiveWay("way2a")}
          className={`p-4 rounded-xl border text-left transition-all ${
            activeWay === "way2a"
              ? "bg-purple-500/10 border-purple-500 text-white shadow-md shadow-purple-500/10"
              : "bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-sm">Way 3: Auto-Ideas</span>
            <Wand2 className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-xs text-slate-400">Zero input count. 3-axis diversity engine.</p>
        </button>

        <button
          type="button"
          onClick={() => setActiveWay("way2b")}
          className={`p-4 rounded-xl border text-left transition-all ${
            activeWay === "way2b"
              ? "bg-blue-500/10 border-blue-500 text-white shadow-md shadow-blue-500/10"
              : "bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-sm">Way 4: Line Expander</span>
            <ListPlus className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-xs text-slate-400">1 short line per pin expanded to 90 words.</p>
        </button>
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-950/40 text-red-300 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold block">Error</span>
            <span className="text-xs opacity-90">{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-xs opacity-70 hover:opacity-100 uppercase">
            Dismiss
          </button>
        </div>
      )}

      {/* Success Result Card */}
      {generatedResult && (
        <div className="p-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 font-medium text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Pin Successfully Generated and Saved!</span>
            </div>
            <Link
              href="/library"
              className="text-xs text-emerald-300 hover:text-white flex items-center gap-1 font-semibold underline"
            >
              <span>Inspect in Library</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 items-center">
            <div className="w-40 h-60 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 shrink-0 shadow-lg relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={generatedResult.imageUrl}
                alt="Generated Pin"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-2 text-xs text-slate-300 flex-1">
              <div>
                <span className="text-slate-500 block">SEO Title:</span>
                <span className="font-semibold text-white text-sm">{generatedResult.title}</span>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-slate-500 block">Model Executed:</span>
                  <span className="text-slate-200">{generatedResult.model}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Actual Cost:</span>
                  <span className="font-mono text-emerald-400 font-bold">${generatedResult.cost.toFixed(4)}</span>
                </div>
                {generatedResult.seoScore !== undefined && (
                  <div>
                    <span className="text-slate-500 block">SEO Score:</span>
                    <span className="font-mono text-yellow-400 font-bold">{generatedResult.seoScore}/100</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template Selector Bar (Spec Section 12 & 32) */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-red-400" />
          <span className="text-xs font-semibold text-white">Niche Template:</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedTemplateId}
            onChange={(e) => setSelectedTemplateId(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-red-500/50 w-full sm:w-64"
          >
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.niche?.name}: {t.name}
              </option>
            ))}
          </select>

          <Link
            href="/templates"
            className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded border border-slate-700 shrink-0"
          >
            Manage
          </Link>
        </div>
      </div>

      {/* Mode A: Way 1 Prompt Form */}
      {activeWay === "way1" && (
        <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <label className="text-sm font-semibold text-white flex items-center gap-2">
              <span>Image Prompt</span>
              <span className="text-xs text-slate-500 font-normal">({prompt.length} chars)</span>
              {promptEnhancedBadge && (
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-medium flex items-center gap-1 animate-pulse">
                  <Sparkles className="w-3 h-3 text-purple-300" />
                  {promptEnhancedBadge}
                </span>
              )}
            </label>

            <div className="flex items-center gap-2">
              {originalPromptHistory && (
                <button
                  type="button"
                  onClick={handleUndoEnhance}
                  className="px-2.5 py-1 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                  title="Revert back to your original input"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Undo</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleEnhancePrompt}
                disabled={enhancingPrompt || !prompt.trim()}
                className="px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-purple-500/20 transition-all cursor-pointer"
                title="Deeply enhance this idea into a photorealistic, targeted Pinterest visual prompt"
              >
                {enhancingPrompt ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Wand2 className="w-3.5 h-3.5 text-yellow-300" />
                )}
                <span>{enhancingPrompt ? "Enhancing..." : "✨ Enhance Prompt"}</span>
              </button>
            </div>
          </div>

          <textarea
            rows={4}
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              if (promptEnhancedBadge) setPromptEnhancedBadge(null);
            }}
            placeholder="e.g. Modern minimalist kitchen or type a short idea: 'aesthetic coffee corner'..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-red-500/50 leading-relaxed font-sans"
          />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-400 pt-1 gap-2">
            <span className="text-[11px] text-slate-500">
              💡 Tip: Click <strong>&quot;✨ Enhance Prompt&quot;</strong> to enrich your idea with lighting, textures, depth of field &amp; Pinterest composition.
            </span>
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoEnhance}
                onChange={(e) => setAutoEnhance(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-purple-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-[11px] text-slate-400">Auto-enhance before generating</span>
            </label>
          </div>
        </div>
      )}

      {/* Mode B: Bulk Multi-Line Prompts */}
      {activeWay === "bulk" && (
        <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white">Bulk Multi-Line Prompts</h3>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold">
                  Batch Mode
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Enter multiple prompts, one per line. Use <code className="text-emerald-400 font-mono text-[11px]">Prompt | Custom Overlay Text</code> to define a headline per pin, or leave blank to auto-generate a 5–6 word CTR hook.
              </p>
            </div>

            <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300">
              {bulkPromptsText.split("\n").filter((l) => l.trim().length > 0).length} prompts detected
            </span>
          </div>

          <textarea
            rows={6}
            value={bulkPromptsText}
            onChange={(e) => setBulkPromptsText(e.target.value)}
            placeholder={`Modern Scandinavian kitchen with fluted oak island | 10+ Dreamy Kitchen Ideas\nLuxury traditional bathroom with clawfoot tub and brass fixtures | Elegant Bathroom Remodel\nMinimalist home office with sunlit monstera plant\nCozy reading nook with bouclé armchair by warm bay window | Cozy Reading Nook Inspo\nArtisanal sourdough bread on rustic wood cutting board`}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 leading-relaxed font-mono"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-300 flex items-center justify-between">
                <span>Default Bulk Headline Hook (Optional)</span>
                <span className="text-[10px] text-slate-500">5-6 words recommended</span>
              </label>
              <input
                type="text"
                placeholder="Fallback for lines without ' | headline'..."
                value={bulkDefaultOverlayText}
                onChange={(e) => setBulkDefaultOverlayText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div className="flex flex-col justify-end space-y-1">
              <div className="text-[11px] text-slate-500">
                ⚡ No prompt character limit. Each line receives its own SEO title, description, hashtags &amp; alt text.
              </div>
            </div>
          </div>

          {/* Pin Visual Type Ratio Distribution Card */}
          {renderPinTypeRatioControls(bulkPromptsText.split("\n").filter((l) => l.trim().length > 0).length || 10)}

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <span className="text-[11px] text-slate-500">
                ⚡ No prompt character limit. Each line is processed individually.
              </span>
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoEnhance}
                  onChange={(e) => setAutoEnhance(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-purple-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-[11px] text-slate-400">Auto-enhance prompts with AI before generation</span>
              </label>
            </div>

            <button
              type="button"
              onClick={() => handleBulkGenerate()}
              disabled={bulkGenerating || bulkPromptsText.split("\n").filter((l) => l.trim().length > 0).length === 0}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
            >
              {bulkGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>
                    Generating {bulkProgress?.current || 1} of {bulkProgress?.total || 1}...
                  </span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>
                    Generate All ({bulkPromptsText.split("\n").filter((l) => l.trim().length > 0).length} Pins)
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Bulk Generation Progress & Results */}
          {renderBulkProgressAndResults()}
        </div>
      )}

      {/* Mode C: Way 2a Zero-Input Auto-Ideas */}
      {activeWay === "way2a" && (
        <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-white">Invent Ideas with Diversity Engine</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Generates distinct concept signatures (composition × mood × setting) avoiding duplicate feeds.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Count:</span>
              <select
                value={ideaCount}
                onChange={(e) => setIdeaCount(parseInt(e.target.value, 10))}
                className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200"
              >
                <option value={5}>5 Pins</option>
                <option value={10}>10 Pins</option>
                <option value={20}>20 Pins</option>
              </select>

              <button
                type="button"
                onClick={handleInventIdeas}
                disabled={inventingIdeas}
                className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
              >
                {inventingIdeas ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                <span>Invent Ideas</span>
              </button>
            </div>
          </div>

          {/* Invented Ideas List */}
          {inventedIdeas.length > 0 && (
            <div className="space-y-4 pt-2 border-t border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-300 block">
                  Generated Diverse Concepts ({inventedIdeas.length}):
                </span>
                <button
                  type="button"
                  onClick={() => handleBulkGenerate(inventedIdeas.map((i) => i.idea))}
                  disabled={bulkGenerating}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-purple-500/20 transition-all cursor-pointer"
                >
                  {bulkGenerating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Generating All ({bulkProgress?.current || 1}/{bulkProgress?.total || inventedIdeas.length})...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate All {inventedIdeas.length} Pins with Selected Ratios</span>
                    </>
                  )}
                </button>
              </div>

              {/* Pin Type Visual Ratio Controls for Auto-Ideas */}
              {renderPinTypeRatioControls(inventedIdeas.length)}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-72 overflow-y-auto p-1">
                {inventedIdeas.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border border-slate-800 bg-slate-950/70 flex flex-col justify-between space-y-2 hover:border-slate-700"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                        <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-purple-400">
                          {item.composition}
                        </span>
                        <span>{item.mood}</span>
                      </div>
                      <p className="text-xs text-slate-200 leading-snug">{item.idea}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleGenerate(item.idea)}
                      disabled={generating}
                      className="self-end px-3 py-1 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded text-[11px] font-semibold flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Generate Single Pin</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Bulk Progress & Results Gallery */}
              {renderBulkProgressAndResults()}
            </div>
          )}
        </div>
      )}

      {/* Mode C: Way 2b Single-Line Ideas */}
      {activeWay === "way2b" && (
        <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Single-Line Idea Expansion</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Enter one short idea per line. The tool expands each line into a 60–90 word visual prompt preserving your subject.
            </p>
          </div>

          <textarea
            rows={4}
            value={rawIdeaLines}
            onChange={(e) => setRawIdeaLines(e.target.value)}
            placeholder={`cozy reading nook with plants\nmodern bouclé armchair by bay window\nminimalist ceramics on open wooden shelving`}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-red-500/50 leading-relaxed font-mono"
          />

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleExpandLines}
              disabled={expandingIdeas || !rawIdeaLines.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {expandingIdeas ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ListPlus className="w-3.5 h-3.5" />}
              <span>Expand Prompts</span>
            </button>
          </div>

          {/* Expanded Prompts Display */}
          {expandedPrompts.length > 0 && (
            <div className="space-y-4 pt-2 border-t border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-300 block">
                  Expanded Prompts ({expandedPrompts.length}):
                </span>
                <button
                  type="button"
                  onClick={() => handleBulkGenerate(expandedPrompts.map((p) => p.expandedPrompt))}
                  disabled={bulkGenerating}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  {bulkGenerating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Generating All ({bulkProgress?.current || 1}/{bulkProgress?.total || expandedPrompts.length})...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate All {expandedPrompts.length} Pins with Selected Ratios</span>
                    </>
                  )}
                </button>
              </div>

              {/* Pin Type Visual Ratio Controls for Line Expander */}
              {renderPinTypeRatioControls(expandedPrompts.length)}

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {expandedPrompts.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border border-slate-800 bg-slate-950/70 flex flex-col justify-between space-y-2"
                  >
                    <div>
                      <span className="text-[11px] font-semibold text-blue-400 block mb-1">
                        Original: &quot;{p.original}&quot;
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">{p.expandedPrompt}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleGenerate(p.expandedPrompt)}
                      disabled={generating}
                      className="self-end px-3 py-1 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded text-[11px] font-semibold flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Generate Single Pin</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Bulk Progress & Results Gallery */}
              {renderBulkProgressAndResults()}
            </div>
          )}
        </div>
      )}

      {/* Aspect Ratio Selector */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-white flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Layout className="w-4 h-4 text-red-400" />
            <span>Aspect Ratio</span>
          </span>
          <span className="text-xs text-slate-400">
            Selected: <strong className="text-white font-mono">{selectedAspect}</strong> ({ASPECT_OPTIONS.find((a) => a.id === selectedAspect)?.dims})
          </span>
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {ASPECT_OPTIONS.map((item) => {
            const isSelected = item.id === selectedAspect;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedAspect(item.id)}
                className={`p-3.5 rounded-xl border text-center flex flex-col items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? "bg-red-500/10 border-red-500 text-white shadow-md shadow-red-500/10 ring-1 ring-red-500/50"
                    : "bg-slate-900/40 border-slate-800 text-slate-300 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-center h-10 w-full mb-2">
                  <div
                    className={`rounded border transition-colors ${
                      isSelected ? "border-red-400 bg-red-400/20" : "border-slate-600 bg-slate-800/40"
                    } ${item.aspectBox}`}
                  />
                </div>
                <div className="font-semibold text-xs text-white">{item.title}</div>
                <div className="text-[11px] font-mono text-red-400 font-medium mt-0.5">{item.ratio}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{item.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Model Selection */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-white flex items-center justify-between">
          <span>Image Model & Quality Tier</span>
          <span className="text-xs text-slate-400">Runware REST Provider</span>
        </label>

        {loadingData ? (
          <div className="p-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-red-500" />
            <span>Loading Models...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {models.map((m) => {
              const isSelected = m.id === selectedModelId;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedModelId(m.id)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "bg-red-500/10 border-red-500 text-white shadow-md shadow-red-500/10"
                      : "bg-slate-900/40 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm">{m.label}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700">
                      ${m.pricePerImage.toFixed(4)}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">{m.tier} Tier</div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Brand Kit Integration (Spec Section 33.7) */}
      <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-purple-400" />
            <div>
              <span className="text-sm font-semibold text-white">Brand Kit Aesthetic</span>
              <span className="text-xs text-slate-400 block sm:inline sm:ml-2">
                Lock 5-color palette, logo PNG, typography &amp; provenance
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const nextState = !brandKitEnabled;
                setBrandKitEnabled(nextState);
                if (nextState) {
                  const activeKit = brandKits.find((k) => k.id === selectedBrandKitId);
                  if (activeKit?.overlayPreset) {
                    setOverlayPreset(activeKit.overlayPreset);
                    setPresetIsManual(false);
                  }
                }
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                brandKitEnabled
                  ? "bg-purple-600 text-white shadow-sm shadow-purple-500/20"
                  : "bg-slate-950 text-slate-400 border border-slate-800"
              }`}
            >
              {brandKitEnabled ? "Brand Kit: ON" : "Brand Kit: OFF"}
            </button>

            <Link
              href="/brand-kit"
              className="text-xs text-purple-400 hover:text-purple-300 px-2 py-1 rounded border border-purple-500/20 bg-purple-950/30 flex items-center gap-1 font-medium"
            >
              <span>Manage</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {brandKitEnabled && (
          <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1 w-full space-y-1">
              <label className="text-xs text-slate-400">Active Brand Kit</label>
              <select
                value={selectedBrandKitId}
                onChange={(e) => {
                  setSelectedBrandKitId(e.target.value);
                  const activeKit = brandKits.find((k) => k.id === e.target.value);
                  if (activeKit?.overlayPreset) {
                    setOverlayPreset(activeKit.overlayPreset);
                    setPresetIsManual(false);
                  }
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              >
                {brandKits.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.kitName} ({k.brandName})
                  </option>
                ))}
              </select>
            </div>

            {(() => {
              const activeKit = brandKits.find((k) => k.id === selectedBrandKitId);
              let colors: string[] = [];
              try {
                if (activeKit?.palette) colors = JSON.parse(activeKit.palette);
              } catch {}

              return (
                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {colors.slice(0, 5).map((hex, idx) => (
                      <div
                        key={idx}
                        className="w-3.5 h-3.5 rounded-full border border-slate-700"
                        style={{ backgroundColor: hex }}
                        title={hex}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-purple-300 font-mono">
                    {activeKit?.fontFamily || "Playfair"}
                  </span>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Text & Overlay Mode */}
      <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-white flex items-center gap-2">
            <Type className="w-4 h-4 text-red-400" />
            <span>Typography Overlay Preset</span>
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setTextMode("canvas")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                textMode === "canvas"
                  ? "bg-red-500/20 text-red-300 border border-red-500/40"
                  : "bg-slate-950 text-slate-400 border border-slate-800"
              }`}
            >
              Canvas Overlay
            </button>
            <button
              type="button"
              onClick={() => setTextMode("in_image")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                textMode === "in_image"
                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                  : "bg-slate-950 text-slate-400 border border-slate-800"
              }`}
            >
              In-Image Text (AI)
            </button>
            <button
              type="button"
              onClick={() => setTextMode("none")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                textMode === "none"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-slate-950 text-slate-400 border border-slate-800"
              }`}
            >
              No Text
            </button>
          </div>
        </div>

        {textMode === "canvas" && (
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <Layout className="w-3.5 h-3.5 text-purple-400" />
                    <span>Overlay Preset</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {brandKitEnabled && !presetIsManual ? (
                      <span className="text-[10px] text-purple-300 bg-purple-950/80 border border-purple-800/40 px-1.5 py-0.5 rounded font-medium">
                        from Brand Kit
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded font-medium">
                        manual
                      </span>
                    )}
                  </div>
                </div>
                <select
                  value={overlayPreset}
                  onChange={(e) => {
                    setOverlayPreset(e.target.value);
                    setPresetIsManual(true);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-red-500/50"
                >
                  {OVERLAY_PRESET_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                {/* Selected Preset Visual Card */}
                {(() => {
                  const selIdx = OVERLAY_PRESET_OPTIONS.findIndex((p) => p.id === overlayPreset);
                  const pNum = selIdx !== -1 ? selIdx + 1 : 1;
                  const currentOpt = OVERLAY_PRESET_OPTIONS[selIdx] || OVERLAY_PRESET_OPTIONS[0];
                  return (
                    <div className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-lg border border-slate-800 mt-2">
                      <div className="w-12 h-18 rounded overflow-hidden shrink-0 bg-black border border-slate-700 relative aspect-[2/3]">
                        <img
                          src={`/presets/exact/preset_${pNum}.jpg`}
                          alt={currentOpt.label}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-white truncate">
                            Preset #{pNum}: {currentOpt.label.split("(")[0].replace(/^\d+\.\s*/, "")}
                          </span>
                          <Link
                            href="/presets"
                            className="text-[10px] text-red-400 hover:text-red-300 font-medium shrink-0 flex items-center gap-1"
                          >
                            <span>Browse All 18</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </Link>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">
                          {currentOpt.label.includes("(") ? currentOpt.label.split("(")[1].replace(")", "") : ""}
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 block">Custom Headline Hook (Optional)</label>
                <input
                  type="text"
                  placeholder="Auto-generated hook if left blank..."
                  value={customOverlayText}
                  onChange={(e) => setCustomOverlayText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-red-500/50"
                />
              </div>
            </div>
          </div>
        )}

        {textMode === "in_image" && (
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-blue-300 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-blue-400" />
                <span>In-Image Typography Text (5–6 Words Recommended)</span>
              </label>
              <span className="text-[10px] text-slate-500">Baked directly into photo by AI</span>
            </div>
            <input
              type="text"
              placeholder="Auto-derived catchy hook from topic if left blank..."
              value={customOverlayText}
              onChange={(e) => setCustomOverlayText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50"
            />
            <p className="text-[11px] text-slate-400">
              💡 The AI model will render this exact phrase as clean, legible typography inside the composition. Leave blank to let the system generate a high-CTR 5–6 word hook from your prompt.
            </p>
          </div>
        )}
      </div>

      {/* Style & Pin Type Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-red-400" />
            <span>Image Style Preset</span>
          </label>
          <select
            value={selectedStyle}
            onChange={(e) => setSelectedStyle(e.target.value)}
            disabled={generating}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-red-500/50"
          >
            {STYLES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-purple-400" />
            <span>Pin Type Category</span>
          </label>
          <select
            value={selectedPinTypeId}
            onChange={(e) => setSelectedPinTypeId(e.target.value)}
            disabled={generating}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-red-500/50"
          >
            {pinTypes.map((pt) => (
              <option key={pt.id} value={pt.id}>
                {pt.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Generate Button for Way 1 */}
      {activeWay === "way1" && (
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Estimated Cost (1 pin)</div>
              <div className="text-sm font-bold text-white font-mono">
                ${estimatedCost.toFixed(4)}{" "}
                <span className="text-[11px] font-normal text-slate-400 font-sans">
                  ({selectedModel?.label || "Selected Model"})
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleGenerate(prompt)}
            disabled={generating || !prompt.trim()}
            className="px-6 py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-lg shadow-red-500/20 transition-colors"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating & Rendering...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Pin</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
