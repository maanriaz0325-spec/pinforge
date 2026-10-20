"use client";

import { useEffect, useState } from "react";
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
  Lightbulb,
} from "lucide-react";

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

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [niches, setNiches] = useState<NicheItem[]>([]);
  const [loading, setLoading] = useState(true);
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

  async function loadData() {
    try {
      setLoading(true);
      setErrorMsg(null);
      const [tRes, nRes] = await Promise.all([fetch("/api/templates"), fetch("/api/niches")]);
      const tJson = await tRes.json();
      const nJson = await nRes.json();

      if (tJson.success) setTemplates(tJson.data || []);
      if (nJson.success) setNiches(nJson.data || []);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to load templates");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

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
        loadData();
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
      loadData();
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
      loadData();
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
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Niche Templates</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-medium">
              {templates.length} Active Templates
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Niche-specific visual strategist system prompts, forbidden elements, and keyword themes.
          </p>
        </div>

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

      {loading && (
        <div className="py-24 flex items-center justify-center text-slate-400 gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-red-500" />
          <span className="text-sm">Loading Niche Templates...</span>
        </div>
      )}

      {/* Grid of Templates */}
      {!loading && (
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

      {/* Editor Modal */}
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

              {/* System Prompt (Spec Section 32.1) */}
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

              {/* Style Notes */}
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

              {/* Forbidden Elements & Keyword Seeds */}
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
