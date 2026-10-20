"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Images,
  Search,
  Loader2,
  Sparkles,
  X,
  Maximize2,
  ArrowRight,
  ExternalLink,
  Save,
  RefreshCw,
  Sliders,
  Type,
  Eye,
  CheckCircle2,
  AlertCircle,
  Download,
  FileSpreadsheet,
  Calendar,
} from "lucide-react";
import { OVERLAY_PRESETS, PresetName } from "@/server/engine/overlay";
import { calculateSeoScore, validateAndFixSeo } from "@/server/engine/seo";

interface PinRecord {
  id: string;
  imageUrl: string;
  rawImageUrl?: string;
  width: number;
  height: number;
  modelUsed: string;
  cost: number;
  title: string;
  description: string;
  altText: string;
  hashtags: string;
  targetKeyword: string;
  secondaryKeywords?: string;
  destinationUrl?: string;
  pinType: string;
  textMode: string;
  overlayText?: string;
  overlayJson?: string;
  status: string;
  createdAt: string;
}

const PRESET_LIST: { id: PresetName; label: string }[] = [
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

export default function LibraryPage() {
  const [pins, setPins] = useState<PinRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Detail Modal / Editor States
  const [selectedPin, setSelectedPin] = useState<PinRecord | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editAltText, setEditAltText] = useState("");
  const [editKeyword, setEditKeyword] = useState("");
  const [editHashtags, setEditHashtags] = useState("");
  const [editOverlayText, setEditOverlayText] = useState("");
  const [editPreset, setEditPreset] = useState<PresetName>("classic_clean_travel");
  const [showRawImage, setShowRawImage] = useState(false);

  const [savingSeo, setSavingSeo] = useState(false);
  const [rerendering, setRerendering] = useState(false);
  const [regeneratingSeo, setRegeneratingSeo] = useState(false);
  const [modalFeedback, setModalFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Multi-Select & Bulk Actions
  const [selectedPinIds, setSelectedPinIds] = useState<string[]>([]);
  const [exporting, setExporting] = useState(false);

  const toggleSelectPin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPinIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleBulkExportCsv = async () => {
    try {
      setExporting(true);
      const res = await fetch("/api/pins/export/csv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pinIds: selectedPinIds.length > 0 ? selectedPinIds : undefined }),
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `pinterest_bulk_${Date.now()}.csv`;
        a.click();
      } else {
        alert("Failed to export CSV");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setExporting(false);
    }
  };

  const handleBulkExportZip = async () => {
    try {
      setExporting(true);
      const res = await fetch("/api/pins/export/zip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pinIds: selectedPinIds.length > 0 ? selectedPinIds : undefined,
          compressed: true,
        }),
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `pinforge_pins_${Date.now()}.zip`;
        a.click();
      } else {
        alert("Failed to export ZIP");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setExporting(false);
    }
  };

  async function loadPins() {
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await fetch("/api/pins");
      const json = await res.json();
      if (json.success && json.data) {
        setPins(json.data.pins || []);
      } else {
        setErrorMsg(json.error || "Failed to load pins.");
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Network error fetching pins.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPins();
  }, []);

  function openPinEditor(pin: PinRecord) {
    setSelectedPin(pin);
    setEditTitle(pin.title || "");
    setEditDescription(pin.description || "");
    setEditAltText(pin.altText || "");
    setEditKeyword(pin.targetKeyword || "");

    let tagsArr: string[] = [];
    try {
      tagsArr = JSON.parse(pin.hashtags || "[]");
    } catch {}
    setEditHashtags(tagsArr.join(", "));

    setEditOverlayText(pin.overlayText || "");

    let preset: PresetName = "classic_clean_travel";
    try {
      if (pin.overlayJson) {
        const parsed = JSON.parse(pin.overlayJson);
        if (parsed.text?.preset && parsed.text.preset in OVERLAY_PRESETS) preset = parsed.text.preset;
      }
    } catch {}
    setEditPreset(preset);
    setShowRawImage(false);
    setModalFeedback(null);
  }

  // Calculate live SEO score
  let currentSeoScore = 75;
  if (selectedPin) {
    try {
      const fixed = validateAndFixSeo({
        targetKeyword: editKeyword || "pinterest",
        secondaryKeywords: [],
        title: editTitle,
        description: editDescription,
        altText: editAltText,
        hashtags: editHashtags.split(",").map((s) => s.trim()).filter(Boolean),
        boardSuggestion: "Ideas",
      });
      currentSeoScore = calculateSeoScore(fixed, selectedPin.description || editTitle);
    } catch {}
  }

  // Save SEO copy changes
  async function handleSaveSeo() {
    if (!selectedPin) return;
    setSavingSeo(true);
    setModalFeedback(null);

    try {
      const tags = editHashtags.split(",").map((s) => s.trim().replace(/^#/, "")).filter(Boolean);
      const res = await fetch(`/api/pins/${selectedPin.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          altText: editAltText,
          targetKeyword: editKeyword,
          hashtags: tags,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setSelectedPin(json.data);
        setPins((prev) => prev.map((p) => (p.id === json.data.id ? json.data : p)));
        setModalFeedback({ type: "success", text: "SEO copy saved successfully!" });
      } else {
        setModalFeedback({ type: "error", text: json.error || "Failed to update SEO." });
      }
    } catch (err: unknown) {
      setModalFeedback({ type: "error", text: err instanceof Error ? err.message : "Network error" });
    } finally {
      setSavingSeo(false);
    }
  }

  // Re-render overlay for free
  async function handleReRender() {
    if (!selectedPin || !editOverlayText.trim()) return;
    setRerendering(true);
    setModalFeedback(null);

    try {
      const res = await fetch(`/api/pins/${selectedPin.id}/re-render`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          overlayText: editOverlayText.trim(),
          preset: editPreset,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setSelectedPin(json.data);
        setPins((prev) => prev.map((p) => (p.id === json.data.id ? json.data : p)));
        setModalFeedback({ type: "success", text: "Overlay re-rendered for free! ✅" });
      } else {
        setModalFeedback({ type: "error", text: json.error || "Failed to re-render overlay." });
      }
    } catch (err: unknown) {
      setModalFeedback({ type: "error", text: err instanceof Error ? err.message : "Network error" });
    } finally {
      setRerendering(false);
    }
  }

  // Regenerate SEO via free copy model
  async function handleRegenerateSeo() {
    if (!selectedPin) return;
    setRegeneratingSeo(true);
    setModalFeedback(null);

    try {
      const res = await fetch(`/api/pins/${selectedPin.id}/regenerate-seo`, {
        method: "POST",
      });

      const json = await res.json();
      if (json.success && json.data?.seo) {
        const seo = json.data.seo;
        setEditTitle(seo.title);
        setEditDescription(seo.description);
        setEditAltText(seo.altText);
        setEditKeyword(seo.targetKeyword);
        setEditHashtags(seo.hashtags.join(", "));
        setSelectedPin(json.data.pin);
        setPins((prev) => prev.map((p) => (p.id === json.data.pin.id ? json.data.pin : p)));
        setModalFeedback({ type: "success", text: "SEO copy regenerated with AI! 🚀" });
      } else {
        setModalFeedback({ type: "error", text: json.error || "Failed to regenerate SEO." });
      }
    } catch (err: unknown) {
      setModalFeedback({ type: "error", text: err instanceof Error ? err.message : "Network error" });
    } finally {
      setRegeneratingSeo(false);
    }
  }

  const filteredPins = pins.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.modelUsed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.pinType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Pin Library</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-medium">
              {pins.length} {pins.length === 1 ? "Pin" : "Pins"} Saved
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Persisted images, live SEO copywriting editor, free overlay re-rendering, and metadata.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg text-xs text-slate-300 w-full sm:w-64 focus-within:border-red-500/50">
            <Search className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <input
              type="text"
              placeholder="Search pins, titles, models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none w-full placeholder:text-slate-600 text-xs text-slate-200"
            />
          </div>

          <Link
            href="/generate"
            className="px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shrink-0 transition-colors flex items-center gap-1.5 shadow-sm shadow-red-500/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate New</span>
          </Link>
        </div>
      </div>

      {/* Error state */}
      {errorMsg && (
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-950/40 text-red-300 text-sm flex items-center justify-between">
          <span>{errorMsg}</span>
          <button onClick={loadPins} className="text-xs underline font-semibold hover:text-white">
            Retry
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="py-24 flex flex-col items-center justify-center text-slate-400 gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-red-500" />
          <span className="text-sm">Loading persistent Pin Library...</span>
        </div>
      )}

      {/* Empty state */}
      {!loading && pins.length === 0 && (
        <div className="py-20 border border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center p-6">
          <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-slate-500 mb-3 border border-slate-800">
            <Images className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-200">No pins in library yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
            Generate your first Pinterest pin using prompt mode. Images and SEO copy are saved permanently.
          </p>
          <Link
            href="/generate"
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span>Create First Pin</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Bulk Action Toolbar */}
      {!loading && pins.length > 0 && (
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => {
                if (selectedPinIds.length === filteredPins.length) {
                  setSelectedPinIds([]);
                } else {
                  setSelectedPinIds(filteredPins.map((p) => p.id));
                }
              }}
              className="text-slate-400 hover:text-white font-medium flex items-center gap-1.5"
            >
              <div
                className={`w-4 h-4 rounded border flex items-center justify-center ${
                  selectedPinIds.length === filteredPins.length && filteredPins.length > 0
                    ? "bg-red-600 border-red-500 text-white"
                    : selectedPinIds.length > 0
                    ? "bg-red-600/30 border-red-500 text-white"
                    : "border-slate-700 bg-slate-800"
                }`}
              >
                {selectedPinIds.length > 0 && <CheckCircle2 className="w-3 h-3" />}
              </div>
              <span>
                {selectedPinIds.length > 0
                  ? `${selectedPinIds.length} of ${filteredPins.length} selected`
                  : `Select All (${filteredPins.length})`}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkExportCsv}
              disabled={exporting}
              className="text-xs bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-all"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>{selectedPinIds.length > 0 ? "Export Selected CSV" : "Export All CSV"}</span>
            </button>

            <button
              onClick={handleBulkExportZip}
              disabled={exporting}
              className="text-xs bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-all"
            >
              <Download className="w-3.5 h-3.5 text-purple-400" />
              <span>{selectedPinIds.length > 0 ? "Download Selected ZIP" : "Download All ZIP"}</span>
            </button>

            <Link
              href="/schedule"
              className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold transition-all shadow-sm shadow-blue-500/20"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Go to Scheduler</span>
            </Link>
          </div>
        </div>
      )}

      {/* Pin Grid */}
      {!loading && pins.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredPins.map((pin) => {
            const dateStr = new Date(pin.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            });
            const isSelected = selectedPinIds.includes(pin.id);

            return (
              <div
                key={pin.id}
                onClick={() => openPinEditor(pin)}
                className={`group relative bg-slate-900/60 rounded-xl border overflow-hidden transition-all cursor-pointer flex flex-col shadow-sm ${
                  isSelected
                    ? "border-red-500/80 bg-red-950/10 shadow-lg shadow-red-950/20"
                    : "border-slate-800 hover:border-slate-700"
                }`}
              >
                {/* Image Container */}
                <div className="relative aspect-[2/3] w-full bg-slate-950 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pin.imageUrl}
                    alt={pin.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Select Checkbox Top Left */}
                  <button
                    type="button"
                    onClick={(e) => toggleSelectPin(pin.id, e)}
                    className="absolute top-2 left-2 z-10 w-5 h-5 rounded border flex items-center justify-center transition-all bg-slate-950/80 backdrop-blur-sm"
                    style={{
                      borderColor: isSelected ? "#ef4444" : "#475569",
                      backgroundColor: isSelected ? "#ef4444" : "rgba(2, 6, 23, 0.8)",
                    }}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </button>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 pointer-events-none">
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-medium bg-slate-950/80 backdrop-blur-sm text-emerald-400 border border-emerald-500/20">
                      ${pin.cost.toFixed(4)}
                    </span>
                  </div>
                </div>

                {/* Card Meta */}
                <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-between">
                  <h4 className="text-xs font-semibold text-slate-200 line-clamp-2 leading-snug">
                    {pin.title}
                  </h4>
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                    <span className="truncate max-w-[90px]">{pin.modelUsed}</span>
                    <span>{dateStr}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pin Detail & SEO Editor Modal (Spec Section 35) */}
      {selectedPin && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative flex flex-col lg:flex-row">
            {/* Close Button */}
            <button
              onClick={() => setSelectedPin(null)}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left: Image View & Toggle */}
            <div className="w-full lg:w-5/12 bg-slate-950 p-6 flex flex-col items-center justify-between border-b lg:border-b-0 lg:border-r border-slate-800">
              <div className="w-full flex items-center justify-between mb-3">
                <span className="text-xs text-slate-400 font-medium">Preview</span>
                {selectedPin.rawImageUrl && (
                  <button
                    onClick={() => setShowRawImage(!showRawImage)}
                    className="text-[11px] px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 border border-slate-700"
                  >
                    <Eye className="w-3 h-3" />
                    <span>{showRawImage ? "Show Final Overlay" : "Show Clean Photo"}</span>
                  </button>
                )}
              </div>

              <div className="rounded-xl overflow-hidden shadow-xl border border-slate-800 max-h-[60vh] w-full flex items-center justify-center bg-black/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={showRawImage && selectedPin.rawImageUrl ? selectedPin.rawImageUrl : selectedPin.imageUrl}
                  alt={selectedPin.title}
                  className="w-full h-auto object-contain max-h-[60vh]"
                />
              </div>

              <div className="w-full mt-4 flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800">
                <span>{selectedPin.width} × {selectedPin.height}</span>
                <span className="font-mono text-emerald-400 font-bold">${selectedPin.cost.toFixed(4)}</span>
                <a
                  href={selectedPin.imageUrl}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="text-slate-300 hover:text-white flex items-center gap-1 underline"
                >
                  <span>Full Size</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Right: Comprehensive SEO & Overlay Editor */}
            <div className="w-full lg:w-7/12 p-6 space-y-6">
              {/* Header with SEO Score Badge */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-red-400 font-semibold block">
                    Pinterest Copy & Overlay Editor
                  </span>
                  <span className="text-xs text-slate-400">{selectedPin.pinType}</span>
                </div>

                {/* Score badge */}
                <div
                  className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                    currentSeoScore >= 80
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : currentSeoScore >= 60
                      ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                      : "bg-red-500/10 text-red-400 border-red-500/30"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>SEO Score: {currentSeoScore}/100</span>
                </div>
              </div>

              {/* Feedback Alert */}
              {modalFeedback && (
                <div
                  className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                    modalFeedback.type === "success"
                      ? "bg-emerald-950/40 border border-emerald-500/30 text-emerald-300"
                      : "bg-red-950/40 border border-red-500/30 text-red-300"
                  }`}
                >
                  {modalFeedback.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  )}
                  <span>{modalFeedback.text}</span>
                </div>
              )}

              {/* Overlay Re-Render Section (Free) */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5 text-purple-400" />
                    <span>Overlay Hook & Preset (Free Re-Render)</span>
                  </span>
                  <button
                    onClick={handleReRender}
                    disabled={rerendering || !editOverlayText.trim()}
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    {rerendering ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <RefreshCw className="w-3 h-3" />
                    )}
                    <span>Re-render ($0.00)</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Headline Text</label>
                    <input
                      type="text"
                      value={editOverlayText}
                      onChange={(e) => setEditOverlayText(e.target.value)}
                      placeholder="e.g. 10 Cozy Living Room Ideas"
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-red-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Preset Style</label>
                    <select
                      value={editPreset}
                      onChange={(e) => setEditPreset(e.target.value as PresetName)}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-red-500/50"
                    >
                      {PRESET_LIST.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* SEO Copywriting Editor */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">Pinterest SEO Metadata</span>
                  <button
                    onClick={handleRegenerateSeo}
                    disabled={regeneratingSeo}
                    className="text-xs text-yellow-400 hover:text-yellow-300 flex items-center gap-1 underline font-medium"
                  >
                    {regeneratingSeo ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Sparkles className="w-3 h-3" />
                    )}
                    <span>Regenerate Copy with AI</span>
                  </button>
                </div>

                {/* Title */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Title (Target keyword in first 40 chars)</span>
                    <span className={editTitle.length > 100 ? "text-red-400" : ""}>
                      {editTitle.length} / 100
                    </span>
                  </div>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-red-500/50 font-medium"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Description (200-450 chars, soft CTA)</span>
                    <span className={editDescription.length > 500 ? "text-red-400" : ""}>
                      {editDescription.length} / 500
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-red-500/50 leading-relaxed font-sans"
                  />
                </div>

                {/* Alt Text */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Alt Text (Accessibility & search indexing)</span>
                    <span className={editAltText.length > 300 ? "text-red-400" : ""}>
                      {editAltText.length} / 300
                    </span>
                  </div>
                  <input
                    type="text"
                    value={editAltText}
                    onChange={(e) => setEditAltText(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-red-500/50"
                  />
                </div>

                {/* Target Keyword & Hashtags */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400 block">Primary Keyword</span>
                    <input
                      type="text"
                      value={editKeyword}
                      onChange={(e) => setEditKeyword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-red-500/50 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400 block">Hashtags (Comma-separated)</span>
                    <input
                      type="text"
                      value={editHashtags}
                      onChange={(e) => setEditHashtags(e.target.value)}
                      placeholder="homedecor, aesthetic, modern"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-red-500/50 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Action Bar */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleSaveSeo}
                  disabled={savingSeo}
                  className="px-5 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-red-500/20 transition-colors"
                >
                  {savingSeo ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>Save Copy & Metadata</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
