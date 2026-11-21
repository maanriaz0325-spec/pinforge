"use client";

import { useEffect, useState, useMemo } from "react";
import {
  LayoutTemplate,
  Plus,
  Sparkles,
  Loader2,
  Trash2,
  Copy,
  Download,
  AlertCircle,
  CheckCircle2,
  X,
  Edit3,
  Search,
  SlidersHorizontal,
  ExternalLink,
  Layers,
  Palette,
  Type,
  Grid,
  Filter,
  Check,
} from "lucide-react";
import Link from "next/link";
import { PinTemplateVisualPreview } from "@/components/PinTemplateVisualPreview";

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

interface NicheItem {
  id: string;
  name: string;
}

interface TemplateItem {
  id: string;
  name: string;
  nicheId: string;
  niche: NicheItem;
  systemPrompt: string;
  styleNotes?: string;
  forbiddenElements?: string;
  keywordSeeds?: string;
  version: number;
  qualityScore: number;
  qualityDetails?: {
    suggestions: string[];
    wordCount: number;
  };
  createdAt: string;
}

const CATEGORY_TABS = [
  { id: "all", label: "All Templates" },
  { id: "hair", label: "Hair & Hairstyles", match: "Hair" },
  { id: "beauty", label: "Beauty & Skincare", match: "Beauty" },
  { id: "fashion", label: "Fashion & Style", match: "Fashion" },
  { id: "home", label: "Home Decor & Living", match: "Home Decor" },
  { id: "outdoor", label: "Patio & Outdoor", match: ["Patio", "Balcony"] },
  { id: "food", label: "Food & Recipes", match: "Food / Recipe" },
  { id: "listicle", label: "Listicles & Ideas", match: "Listicle" },
  { id: "howto", label: "How-To & Guides", match: "How-To" },
  { id: "quote", label: "Quotes & Relationships", match: ["Quote", "Relationship"] },
  { id: "blog", label: "Custom Blog Pin (736×1472)", match: "Custom Blog Pin" },
];

export default function TemplatesPage() {
  const [activeTab, setActiveTab] = useState<"studio" | "niche">("studio");

  // AutoPinDesign Studio Templates State
  const [studioTemplates, setStudioTemplates] = useState<StudioTemplate[]>([]);
  const [studioLoading, setStudioLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLayout, setSelectedLayout] = useState("all");
  const [selectedRatio, setSelectedRatio] = useState("all");
  const [selectedTemplateDetail, setSelectedTemplateDetail] = useState<StudioTemplate | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Niche Strategist Templates State
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [niches, setNiches] = useState<NicheItem[]>([]);
  const [nicheLoading, setNicheLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Editor Modal State
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formNicheId, setFormNicheId] = useState("");
  const [newNicheName, setNewNicheName] = useState("");
  const [formSystemPrompt, setFormSystemPrompt] = useState("");
  const [formStyleNotes, setFormStyleNotes] = useState("");
  const [formForbidden, setFormForbidden] = useState("");
  const [formKeywords, setFormKeywords] = useState("");
  const [savingTemplate, setSavingTemplate] = useState(false);

  // AI Draft Modal State
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiNiche, setAiNiche] = useState("");
  const [aiTaste, setAiTaste] = useState("");
  const [draftingAi, setDraftingAi] = useState(false);

  // Load AutoPinDesign templates
  async function loadStudioTemplates() {
    try {
      setStudioLoading(true);
      const res = await fetch("/api/templates/studio");
      const json = await res.json();
      if (json.success) {
        setStudioTemplates(json.data || []);
      }
    } catch (err) {
      console.error("Failed to load studio templates:", err);
    } finally {
      setStudioLoading(false);
    }
  }

  // Load Niche templates
  async function loadNicheData() {
    try {
      setNicheLoading(true);
      setErrorMsg(null);
      const [tRes, nRes] = await Promise.all([fetch("/api/templates"), fetch("/api/niches")]);
      const tJson = await tRes.json();
      const nJson = await nRes.json();

      if (tJson.success) setTemplates(tJson.data || []);
      if (nJson.success) setNiches(nJson.data || []);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to load templates");
    } finally {
      setNicheLoading(false);
    }
  }

  useEffect(() => {
    loadStudioTemplates();
    loadNicheData();
  }, []);

  // Filter studio templates
  const filteredStudioTemplates = useMemo(() => {
    return studioTemplates.filter((t) => {
      // Category filter
      if (selectedCategory !== "all") {
        const tabDef = CATEGORY_TABS.find((tab) => tab.id === selectedCategory);
        if (tabDef && tabDef.match) {
          if (Array.isArray(tabDef.match)) {
            const hasMatch = tabDef.match.some((m) => t.categories.includes(m));
            if (!hasMatch) return false;
          } else {
            if (!t.categories.includes(tabDef.match)) return false;
          }
        }
      }

      // Layout filter
      if (selectedLayout !== "all") {
        if (t.layoutId !== selectedLayout) return false;
      }

      // Ratio filter
      if (selectedRatio !== "all") {
        if (t.aspectRatio !== selectedRatio) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = t.name.toLowerCase().includes(q);
        const matchesDesc = t.description.toLowerCase().includes(q);
        const matchesHeadline = t.headlinePreview.toLowerCase().includes(q);
        const matchesCats = t.categories.some((c) => c.toLowerCase().includes(q));
        const matchesFonts = t.fonts.some((f) => f.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesHeadline && !matchesCats && !matchesFonts) {
          return false;
        }
      }

      return true;
    });
  }, [studioTemplates, selectedCategory, selectedLayout, selectedRatio, searchQuery]);

  // Unique layout options for dropdown
  const layoutOptions = useMemo(() => {
    const set = new Set<string>();
    studioTemplates.forEach((t) => set.add(t.layoutId));
    return Array.from(set).sort();
  }, [studioTemplates]);

  function handleCopyId(id: string) {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  // Niche Template Handlers
  function openCreateModal() {
    setEditingId(null);
    setFormName("");
    setFormNicheId(niches[0]?.id || "");
    setNewNicheName("");
    setFormSystemPrompt(`ROLE: You are a Pinterest visual strategist for [Niche].
AUDIENCE: Women 25–45 searching for [Intent].
VISUAL IDENTITY: Warm natural daylight, balanced textures, clean lines.
MUST INCLUDE: Real lived-in feel, authentic styling, vertical composition.
MUST AVOID: Clutter, neon colors, text/watermarks, blurry hands.
COMPOSITION: Listicle = wide room; How-to = detail step in action; Inspo = styled vignette.
DIVERSITY: Every pin must differ in room area, camera angle, or featured subject.
KEYWORD THEMES: niche ideas, modern niche aesthetic.`);
    setFormStyleNotes("Focus on crisp morning window light and organic textures.");
    setFormForbidden("clutter, neon glare, watermarks, blurry text");
    setFormKeywords("niche ideas, niche inspiration, modern aesthetic");
    setEditorOpen(true);
  }

  function openEditModal(t: TemplateItem) {
    setEditingId(t.id);
    setFormName(t.name);
    setFormNicheId(t.nicheId);
    setNewNicheName("");
    setFormSystemPrompt(t.systemPrompt);
    setFormStyleNotes(t.styleNotes || "");

    try {
      setFormForbidden(JSON.parse(t.forbiddenElements || "[]").join(", "));
    } catch {
      setFormForbidden(t.forbiddenElements || "");
    }

    try {
      setFormKeywords(JSON.parse(t.keywordSeeds || "[]").join(", "));
    } catch {
      setFormKeywords(t.keywordSeeds || "");
    }

    setEditorOpen(true);
  }

  async function handleSaveTemplate(e: React.FormEvent) {
    e.preventDefault();
    if (!formName.trim() || !formSystemPrompt.trim()) return;

    setSavingTemplate(true);
    try {
      let finalNicheId = formNicheId;
      if (newNicheName.trim()) {
        const nRes = await fetch("/api/niches", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newNicheName.trim() }),
        });
        const nJson = await nRes.json();
        if (nJson.success && nJson.data) {
          finalNicheId = nJson.data.id;
        }
      }

      const payload = {
        name: formName.trim(),
        nicheId: finalNicheId,
        systemPrompt: formSystemPrompt.trim(),
        styleNotes: formStyleNotes.trim() || undefined,
        forbiddenElements: formForbidden.split(",").map((s) => s.trim()).filter(Boolean),
        keywordSeeds: formKeywords.split(",").map((s) => s.trim()).filter(Boolean),
      };

      const url = editingId ? `/api/templates/${editingId}` : "/api/templates";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setEditorOpen(false);
        loadNicheData();
      } else {
        alert(json.error || "Failed to save template");
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error saving template");
    } finally {
      setSavingTemplate(false);
    }
  }

  async function handleDeleteTemplate(id: string) {
    if (!confirm("Are you sure you want to delete this template? (Soft-delete protected)")) return;
    try {
      await fetch(`/api/templates/${id}`, { method: "DELETE" });
      loadNicheData();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDuplicateTemplate(t: TemplateItem) {
    try {
      const forbidden = JSON.parse(t.forbiddenElements || "[]");
      const seeds = JSON.parse(t.keywordSeeds || "[]");

      await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${t.name} (Copy)`,
          nicheId: t.nicheId,
          systemPrompt: t.systemPrompt,
          styleNotes: t.styleNotes,
          forbiddenElements: forbidden,
          keywordSeeds: seeds,
        }),
      });
      loadNicheData();
    } catch (err) {
      console.error(err);
    }
  }

  function handleExportJson(t: TemplateItem) {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(t, null, 2));
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `${t.name.toLowerCase().replace(/\s+/g, "_")}_template.json`);
    dlAnchor.click();
  }

  async function handleDraftWithAi() {
    if (!aiNiche.trim()) return;
    setDraftingAi(true);
    try {
      const res = await fetch("/api/templates/generate-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nicheName: aiNiche.trim(), tasteNotes: aiTaste.trim() }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setAiModalOpen(false);
        setEditingId(null);
        setFormName(json.data.name);
        setNewNicheName(aiNiche.trim());
        setFormSystemPrompt(json.data.systemPrompt);
        setFormStyleNotes(json.data.styleNotes);
        setFormForbidden(json.data.forbiddenElements.join(", "));
        setFormKeywords(json.data.keywordSeeds.join(", "));
        setEditorOpen(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDraftingAi(false);
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header & Mode Tabs */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <LayoutTemplate className="w-6 h-6 text-red-500" />
              <span>Pinterest Pin Templates</span>
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-950/80 text-red-400 border border-red-800/60 font-semibold">
              AutoPinDesign Studio
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Browse all 247 categorized pin design templates, high-CTR typography styles, and layout collages.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("studio")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "studio"
                ? "bg-red-600 text-white shadow-md shadow-red-900/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Studio Templates ({studioTemplates.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("niche")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "niche"
                ? "bg-purple-600 text-white shadow-md shadow-purple-900/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Niche Strategist Prompts ({templates.length})</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: AutoPinDesign Studio Templates Gallery */}
      {/* ======================================================== */}
      {activeTab === "studio" && (
        <div className="space-y-6">
          {/* Category Tabs Scrollbar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORY_TABS.map((tab) => {
              const isSelected = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                    isSelected
                      ? "bg-red-600 border-red-500 text-white shadow-sm"
                      : "bg-slate-900/90 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search & Filters Bar */}
          <div className="bg-slate-900/80 border border-slate-800/80 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search templates by title, keywords, font, or aesthetic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filter Dropdowns */}
            <div className="flex items-center gap-3">
              {/* Layout Filter */}
              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800/80 px-3 py-1.5 rounded-xl text-xs text-slate-300">
                <Layers className="w-3.5 h-3.5 text-slate-500" />
                <select
                  value={selectedLayout}
                  onChange={(e) => setSelectedLayout(e.target.value)}
                  className="bg-transparent text-slate-200 focus:outline-none text-xs cursor-pointer"
                >
                  <option value="all" className="bg-slate-900 text-white">All Layouts</option>
                  {layoutOptions.map((lo) => (
                    <option key={lo} value={lo} className="bg-slate-900 text-white">
                      Layout: {lo}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ratio Filter */}
              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800/80 px-3 py-1.5 rounded-xl text-xs text-slate-300">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                <select
                  value={selectedRatio}
                  onChange={(e) => setSelectedRatio(e.target.value)}
                  className="bg-transparent text-slate-200 focus:outline-none text-xs cursor-pointer"
                >
                  <option value="all" className="bg-slate-900 text-white">All Ratios</option>
                  <option value="2:3" className="bg-slate-900 text-white">2:3 (Standard)</option>
                  <option value="1:2" className="bg-slate-900 text-white">1:2 (Custom Blog Pin)</option>
                  <option value="9:16" className="bg-slate-900 text-white">9:16 (Full Vertical)</option>
                  <option value="3:4" className="bg-slate-900 text-white">3:4 (Portrait)</option>
                </select>
              </div>

              <span className="text-xs text-slate-400 font-medium whitespace-nowrap pl-2">
                Showing <strong className="text-white">{filteredStudioTemplates.length}</strong> pins
              </span>
            </div>
          </div>

          {/* Loading State */}
          {studioLoading && (
            <div className="py-24 flex items-center justify-center text-slate-400 gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-red-500" />
              <span className="text-sm">Loading 247 AutoPinDesign templates...</span>
            </div>
          )}

          {/* Templates Grid */}
          {!studioLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredStudioTemplates.map((t) => {
                // Determine preview colors
                const primaryColor = t.colors[0] || "#111111";
                const accentColor = t.colors[2] || t.colors[1] || "#EE1A5B";
                const bgColor = primaryColor === "#FFFFFF" ? "#1A1A1A" : primaryColor;

                return (
                  <div
                    key={t.id}
                    className="group bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between hover:shadow-xl hover:shadow-slate-950/50"
                  >
                    {/* Visual Preview Header Canvas */}
                    <div className="relative border-b border-slate-800/80 bg-slate-950">
                      <PinTemplateVisualPreview template={t} className="rounded-t-2xl rounded-b-none" />

                      {/* Layout & Aspect Overlay Badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 z-30">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-black/75 text-white backdrop-blur-md border border-white/20">
                          {t.aspectRatio}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-black/60 text-slate-200 backdrop-blur-md border border-white/10">
                          {t.layoutId}
                        </span>
                      </div>

                      {/* Primary Category Pill */}
                      <div className="absolute top-3 right-3 z-30">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-600/90 text-white border border-red-500/50 shadow-sm">
                          {t.primaryCategory}
                        </span>
                      </div>
                    </div>

                    {/* Template Information Card Content */}
                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-bold text-white tracking-tight line-clamp-1 group-hover:text-red-400 transition-colors">
                            {t.name}
                          </h3>
                        </div>

                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {t.description || "High-converting Pinterest Pin Studio layout template with balanced typography."}
                        </p>

                        {/* Font & Color Palette Tags */}
                        <div className="pt-2 flex flex-wrap items-center gap-1.5">
                          {t.fonts.slice(0, 2).map((font) => (
                            <span
                              key={font}
                              className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60 flex items-center gap-1"
                            >
                              <Type className="w-2.5 h-2.5 text-slate-400" />
                              {font}
                            </span>
                          ))}

                          <div className="flex items-center gap-1 ml-auto">
                            {t.colors.slice(0, 4).map((c, i) => (
                              <span
                                key={i}
                                className="w-3.5 h-3.5 rounded-full border border-slate-700 shadow-xs"
                                style={{ backgroundColor: c }}
                                title={c}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                        <button
                          onClick={() => setSelectedTemplateDetail(t)}
                          className="text-xs text-slate-400 hover:text-white font-semibold transition-colors flex items-center gap-1"
                        >
                          <span>Details</span>
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopyId(t.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs"
                            title="Copy Template ID"
                          >
                            {copiedId === t.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <Link
                            href={`/generate?preset=${encodeURIComponent(t.id)}&topic=${encodeURIComponent(t.headlinePreview || t.name)}`}
                            className="text-xs bg-red-600 hover:bg-red-500 text-white font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                          >
                            <span>Use Pin</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Template Detail Modal */}
      {selectedTemplateDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setSelectedTemplateDetail(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-800 font-semibold">
                  {selectedTemplateDetail.primaryCategory}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                  {selectedTemplateDetail.aspectRatio} ({selectedTemplateDetail.width}×{selectedTemplateDetail.height})
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mt-2">
                {selectedTemplateDetail.name}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {selectedTemplateDetail.description}
              </p>
            </div>

            {/* Visual Live Preview */}
            <div className="flex justify-center py-2 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <PinTemplateVisualPreview template={selectedTemplateDetail} className="w-48 shadow-2xl rounded-xl overflow-hidden" />
            </div>

            {/* Layout & Design Types */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Layout Format:</span>
                <span className="text-white font-semibold">{selectedTemplateDetail.layoutId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Template ID:</span>
                <span className="text-slate-300 font-mono">{selectedTemplateDetail.id}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1.5">Categories:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTemplateDetail.categories.map((c) => (
                    <span key={c} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-slate-400 block mb-1.5">Typography Fonts:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTemplateDetail.fonts.map((f) => (
                    <span key={f} className="px-2 py-0.5 rounded bg-slate-800 text-purple-300 font-medium">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-slate-400 block mb-1.5">Palette Colors:</span>
                <div className="flex items-center gap-2">
                  {selectedTemplateDetail.colors.map((clr, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full border border-slate-700" style={{ backgroundColor: clr }} />
                      <span className="font-mono text-[11px] text-slate-300">{clr}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sample Headline Layer Text */}
            {selectedTemplateDetail.layerTexts.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-300">Default Headline Layers:</span>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1">
                  {selectedTemplateDetail.layerTexts.map((txt, idx) => (
                    <div key={idx} className="text-xs text-slate-200 flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 font-mono">0{idx + 1}.</span>
                      <span className="font-semibold">{txt}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedTemplateDetail(null)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
              <Link
                href={`/generate?preset=${encodeURIComponent(selectedTemplateDetail.id)}&topic=${encodeURIComponent(selectedTemplateDetail.headlinePreview || selectedTemplateDetail.name)}`}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span>Use this Template</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: Niche Strategist System Prompts */}
      {/* ======================================================== */}
      {activeTab === "niche" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Manage custom visual strategist system prompts, avoid lists, and seed keywords.
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setAiNiche("");
                  setAiTaste("");
                  setAiModalOpen(true);
                }}
                className="text-xs bg-purple-600 hover:bg-purple-500 text-white px-3.5 py-2 rounded-lg flex items-center gap-1.5 font-semibold shadow-sm transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Draft with AI</span>
              </button>

              <button
                onClick={openCreateModal}
                className="text-xs bg-red-600 hover:bg-red-500 text-white px-3.5 py-2 rounded-lg flex items-center gap-1.5 font-semibold shadow-sm transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Template</span>
              </button>
            </div>
          </div>

          {nicheLoading && (
            <div className="py-24 flex items-center justify-center text-slate-400 gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
              <span className="text-sm">Loading Niche Templates...</span>
            </div>
          )}

          {!nicheLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {templates.map((t) => (
                <div
                  key={t.id}
                  className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-medium">
                        {t.niche?.name || "General"}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-slate-500">v{t.version}</span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded font-bold border flex items-center gap-1 ${
                            t.qualityScore >= 80
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : t.qualityScore >= 60
                              ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                              : "bg-red-500/10 text-red-400 border-red-500/20"
                          }`}
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>{t.qualityScore}/100</span>
                        </span>
                      </div>
                    </div>

                    <h2 className="text-lg font-bold text-white tracking-tight">{t.name}</h2>
                    <p className="text-xs text-slate-400 mt-2 font-mono bg-slate-950 p-3 rounded-lg border border-slate-800/80 leading-relaxed max-h-36 overflow-y-auto whitespace-pre-wrap">
                      {t.systemPrompt}
                    </p>

                    {t.styleNotes && (
                      <p className="text-xs text-slate-500 mt-2 italic">
                        <span className="font-semibold text-slate-400 not-italic">Style:</span> {t.styleNotes}
                      </p>
                    )}
                  </div>

                  {/* Action Toolbar */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(t)}
                        className="p-1.5 rounded hover:bg-slate-800 hover:text-white"
                        title="Edit Template"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDuplicateTemplate(t)}
                        className="p-1.5 rounded hover:bg-slate-800 hover:text-white"
                        title="Duplicate"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleExportJson(t)}
                        className="p-1.5 rounded hover:bg-slate-800 hover:text-white"
                        title="Export JSON"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTemplate(t.id)}
                        className="p-1.5 rounded hover:bg-red-950/60 hover:text-red-400"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <span className="text-[11px] text-slate-500">
                      {t.qualityDetails?.wordCount || 0} words
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Niche Template Editor Modal */}
      {editorOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 space-y-5 relative">
            <button
              onClick={() => setEditorOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-lg font-bold text-white">
                {editingId ? "Edit Niche Template" : "Create New Niche Template"}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Defines the visual strategist role and criteria for automated Pinterest generation.
              </p>
            </div>

            <form onSubmit={handleSaveTemplate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Template Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Scandinavian Living Room"
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-red-500/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Niche</label>
                  <select
                    value={formNicheId}
                    onChange={(e) => setFormNicheId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-red-500/50"
                  >
                    {niches.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  System Prompt (7-Section Visual Strategist Blueprint)
                </label>
                <textarea
                  rows={8}
                  required
                  value={formSystemPrompt}
                  onChange={(e) => setFormSystemPrompt(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-xs text-slate-200 font-mono leading-relaxed focus:outline-none focus:border-red-500/50"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Style Notes & Lighting
                </label>
                <input
                  type="text"
                  value={formStyleNotes}
                  onChange={(e) => setFormStyleNotes(e.target.value)}
                  placeholder="e.g. Soft window light, warm oak tones, cozy natural textures"
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-red-500/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Forbidden Elements (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formForbidden}
                    onChange={(e) => setFormForbidden(e.target.value)}
                    placeholder="clutter, neon colors, watermarks"
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-red-500/50"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Keyword Seeds (Min 5 recommended)
                  </label>
                  <input
                    type="text"
                    value={formKeywords}
                    onChange={(e) => setFormKeywords(e.target.value)}
                    placeholder="scandinavian living room, small space decor"
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-red-500/50"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditorOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingTemplate}
                  className="px-5 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold"
                >
                  {savingTemplate ? "Saving..." : "Save Template"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Draft Modal */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 relative shadow-2xl">
            <button
              onClick={() => setAiModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h2 className="text-base font-bold text-white">Draft Template with AI</h2>
            </div>
            <p className="text-xs text-slate-400">
              Provide your niche name and a few words describing your taste. AI will generate a structured 7-section blueprint for your review.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Niche Name</label>
                <input
                  type="text"
                  placeholder="e.g. Vegan Desserts, Boho Nursery, Outdoor Living"
                  value={aiNiche}
                  onChange={(e) => setAiNiche(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-red-500/50"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Taste / Style Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Earthy rustic tones, raw linen, dried floral accents, warm natural light..."
                  value={aiTaste}
                  onChange={(e) => setAiTaste(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-slate-200 focus:outline-none focus:border-red-500/50"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setAiModalOpen(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDraftWithAi}
                disabled={draftingAi || !aiNiche.trim()}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                {draftingAi ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>Generate Draft</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
