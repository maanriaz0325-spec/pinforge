"use client";

import { useEffect, useState } from "react";
import {
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Loader2,
  Save,
  RefreshCw,
  Cpu,
  Layers,
  Coins,
  Globe,
} from "lucide-react";

interface SettingsData {
  hasRunwareKey: boolean;
  runwareKeyMasked: string;
  hasOpenrouterKey: boolean;
  openrouterKeyMasked: string;
  defaultTextModel: string;
  defaultImageModel: string;
  currency: string;
  timezone: string;
  monthlyBudget: number | null;
  maxConcurrency: number;
}

interface FreeModel {
  id: string;
  name: string;
  context_length: number;
  description?: string;
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Form states
  const [runwareKeyInput, setRunwareKeyInput] = useState("");
  const [openrouterKeyInput, setOpenrouterKeyInput] = useState("");
  const [showRunwareKey, setShowRunwareKey] = useState(false);
  const [showOpenrouterKey, setShowOpenrouterKey] = useState(false);
  const [defaultTextModel, setDefaultTextModel] = useState("google/gemini-2.0-flash-exp:free");
  const [defaultImageModel, setDefaultImageModel] = useState("runware:100@1");
  const [currency, setCurrency] = useState("USD");
  const [timezone, setTimezone] = useState("UTC");
  const [monthlyBudget, setMonthlyBudget] = useState(50.0);
  const [maxConcurrency, setMaxConcurrency] = useState(3);

  // Existing keys metadata
  const [settings, setSettings] = useState<SettingsData | null>(null);

  // Connection testing states
  const [testingRunware, setTestingRunware] = useState(false);
  const [runwareTestStatus, setRunwareTestStatus] = useState<{
    success: boolean;
    status: string;
    message: string;
  } | null>(null);

  const [testingOpenRouter, setTestingOpenRouter] = useState(false);
  const [openrouterTestStatus, setOpenrouterTestStatus] = useState<{
    success: boolean;
    status: string;
    message: string;
  } | null>(null);

  // Free models dropdown
  const [freeModels, setFreeModels] = useState<FreeModel[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);

  // Fetch initial settings
  async function fetchSettings() {
    try {
      setLoading(true);
      const res = await fetch("/api/settings");
      const json = await res.json();
      if (json.success && json.data) {
        setSettings(json.data);
        setDefaultTextModel(json.data.defaultTextModel);
        setDefaultImageModel(json.data.defaultImageModel);
        setCurrency(json.data.currency || "USD");
        setTimezone(json.data.timezone || "UTC");
        setMonthlyBudget(json.data.monthlyBudget ?? 50.0);
        setMaxConcurrency(json.data.maxConcurrency ?? 3);
      }
    } catch {
      setFeedback({ type: "error", message: "Failed to load current settings." });
    } finally {
      setLoading(false);
    }
  }

  // Fetch free models list
  async function fetchModels() {
    try {
      setLoadingModels(true);
      const res = await fetch("/api/settings/openrouter-models");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setFreeModels(json.data);
      }
    } catch {
      // Keep fallbacks
    } finally {
      setLoadingModels(false);
    }
  }

  useEffect(() => {
    fetchSettings();
    fetchModels();
  }, []);

  // Test Runware Connection
  async function handleTestRunware() {
    setTestingRunware(true);
    setRunwareTestStatus(null);
    try {
      const res = await fetch("/api/settings/test-runware", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: runwareKeyInput.trim() || undefined,
        }),
      });
      const data = await res.json();
      setRunwareTestStatus(data);
    } catch (e: unknown) {
      setRunwareTestStatus({
        success: false,
        status: "network_error",
        message: e instanceof Error ? e.message : "Network failure while testing Runware",
      });
    } finally {
      setTestingRunware(false);
    }
  }

  // Test OpenRouter Connection
  async function handleTestOpenRouter() {
    setTestingOpenRouter(true);
    setOpenrouterTestStatus(null);
    try {
      const res = await fetch("/api/settings/test-openrouter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: openrouterKeyInput.trim() || undefined,
        }),
      });
      const data = await res.json();
      setOpenrouterTestStatus(data);
    } catch (e: unknown) {
      setOpenrouterTestStatus({
        success: false,
        status: "network_error",
        message: e instanceof Error ? e.message : "Network failure while testing OpenRouter",
      });
    } finally {
      setTestingOpenRouter(false);
    }
  }

  // Save Settings
  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const payload: Record<string, unknown> = {
        defaultTextModel,
        defaultImageModel,
        currency,
        timezone,
        monthlyBudget,
        maxConcurrency,
      };

      if (runwareKeyInput.trim()) {
        payload.runwareKey = runwareKeyInput.trim();
      }

      if (openrouterKeyInput.trim()) {
        payload.openrouterKey = openrouterKeyInput.trim();
      }

      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setSettings(data.data);
        setRunwareKeyInput("");
        setOpenrouterKeyInput("");
        setFeedback({ type: "success", message: "Settings encrypted and saved successfully!" });
        // Refresh models if a new key was entered
        fetchModels();
      } else {
        setFeedback({ type: "error", message: data.error || "Failed to save settings." });
      }
    } catch (e: unknown) {
      setFeedback({
        type: "error",
        message: e instanceof Error ? e.message : "Network error while saving settings.",
      });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-slate-400 gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-red-500" />
        <span className="text-sm">Loading security & API parameters...</span>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2.5">
          <KeyRound className="w-6 h-6 text-red-500" />
          <h1 className="text-2xl font-bold text-white tracking-tight">API Settings & BYO Keys</h1>
        </div>
        <p className="text-slate-400 text-sm mt-1">
          Keys are encrypted at rest with AES-256-GCM, never exposed to browser bundles, and proxy-invoked solely via backend workers.
        </p>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-sm ${
            feedback.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-red-500/10 border-red-500/30 text-red-300"
          }`}
        >
          <span>{feedback.message}</span>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs opacity-70 hover:opacity-100 uppercase font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-8">
        {/* Section 1: Provider Keys */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Third-Party Credentials (Zero-Markup Execution)</span>
          </div>

          {/* Runware Card */}
          <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-white block">Runware API Key</span>
                <span className="text-xs text-slate-400">
                  Powering FLUX.1 Schnell ($0.0019), SDXL, Dev, and Wan Eco tiers.
                </span>
              </div>
              {settings?.hasRunwareKey && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Configured ({settings.runwareKeyMasked})</span>
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type={showRunwareKey ? "text" : "password"}
                  placeholder={
                    settings?.hasRunwareKey
                      ? "Paste new key to replace existing encrypted key..."
                      : "Paste your Runware API Key (e.g. rw_...)"
                  }
                  value={runwareKeyInput}
                  onChange={(e) => setRunwareKeyInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-red-500/50 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowRunwareKey(!showRunwareKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showRunwareKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <button
                type="button"
                onClick={handleTestRunware}
                disabled={testingRunware || (!runwareKeyInput.trim() && !settings?.hasRunwareKey)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold text-slate-200 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5 shrink-0"
              >
                {testingRunware ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Testing...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Test Connection</span>
                  </>
                )}
              </button>
            </div>

            {/* Runware Test Status Result */}
            {runwareTestStatus && (
              <div
                className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                  runwareTestStatus.success
                    ? "bg-emerald-950/40 border border-emerald-500/30 text-emerald-300"
                    : "bg-red-950/40 border border-red-500/30 text-red-300"
                }`}
              >
                {runwareTestStatus.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                )}
                <span>{runwareTestStatus.message}</span>
              </div>
            )}
          </div>

          {/* OpenRouter Card */}
          <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-white block">OpenRouter API Key</span>
                <span className="text-xs text-slate-400">
                  Access 100% free copy models (Gemini Flash Exp, Llama 3.3 70B, DeepSeek R1).
                </span>
              </div>
              {settings?.hasOpenrouterKey && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Configured ({settings.openrouterKeyMasked})</span>
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type={showOpenrouterKey ? "text" : "password"}
                  placeholder={
                    settings?.hasOpenrouterKey
                      ? "Paste new key to replace existing encrypted key..."
                      : "Paste your OpenRouter API Key (e.g. sk-or-v1-...)"
                  }
                  value={openrouterKeyInput}
                  onChange={(e) => setOpenrouterKeyInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-red-500/50 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowOpenrouterKey(!showOpenrouterKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showOpenrouterKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <button
                type="button"
                onClick={handleTestOpenRouter}
                disabled={testingOpenRouter || (!openrouterKeyInput.trim() && !settings?.hasOpenrouterKey)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold text-slate-200 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5 shrink-0"
              >
                {testingOpenRouter ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Testing...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Test Connection</span>
                  </>
                )}
              </button>
            </div>

            {/* OpenRouter Test Status Result */}
            {openrouterTestStatus && (
              <div
                className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                  openrouterTestStatus.success
                    ? "bg-emerald-950/40 border border-emerald-500/30 text-emerald-300"
                    : "bg-red-950/40 border border-red-500/30 text-red-300"
                }`}
              >
                {openrouterTestStatus.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                )}
                <span>{openrouterTestStatus.message}</span>
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Model & Generation Defaults */}
        <div className="space-y-6 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
            <Cpu className="w-4 h-4 text-purple-400" />
            <span>Engine Defaults</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Default Text Model */}
            <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
              <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                <span>Default Text Model (Free Tier)</span>
                {loadingModels && <Loader2 className="w-3 h-3 animate-spin text-slate-500" />}
              </label>
              <select
                value={defaultTextModel}
                onChange={(e) => setDefaultTextModel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-red-500/50"
              >
                {freeModels.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({Math.round(m.context_length / 1024)}k ctx)
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500">
                Fallback chain automatically engages if the primary model rate-limits.
              </p>
            </div>

            {/* Default Image Model */}
            <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
              <label className="text-xs font-medium text-slate-300 block">
                Default Image Model Tier
              </label>
              <select
                value={defaultImageModel}
                onChange={(e) => setDefaultImageModel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-red-500/50"
              >
                <option value="runware:100@1">Draft – FLUX.1 Schnell ($0.0019/pin)</option>
                <option value="civitai:101055@128078">Standard – SDXL 1.0 ($0.0030/pin)</option>
                <option value="runware:101@1">Premium – FLUX.1 Dev ($0.0096/pin)</option>
                <option value="openai:dall-e-3">GPT Image 2 – Text Accurate ($0.0060/pin)</option>
                <option value="runware:fast@1">Eco – Wan 2.1 Fast ($0.0015/pin)</option>
              </select>
              <p className="text-[11px] text-slate-500">
                Can be overridden per generation or in individual Brand Kits.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Guardrails & Currency */}
        <div className="space-y-6 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
            <Coins className="w-4 h-4 text-yellow-400" />
            <span>Budget & Concurrency Controls</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
              <label className="text-xs font-medium text-slate-300 block">
                Monthly Budget Guard ($)
              </label>
              <input
                type="number"
                step="5"
                min="0"
                value={monthlyBudget ?? ""}
                onChange={(e) => setMonthlyBudget(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-red-500/50"
              />
              <p className="text-[11px] text-slate-500">Warns at 80%, pauses batch jobs at 100%.</p>
            </div>

            <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
              <label className="text-xs font-medium text-slate-300 block">
                Max Parallel Workers
              </label>
              <input
                type="number"
                min="1"
                max="8"
                value={maxConcurrency}
                onChange={(e) => setMaxConcurrency(parseInt(e.target.value, 10) || 1)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-red-500/50"
              />
              <p className="text-[11px] text-slate-500">Safe default: 3 for standard models.</p>
            </div>

            <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
              <label className="text-xs font-medium text-slate-300 block">Timezone</label>
              <input
                type="text"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-red-500/50 font-mono"
              />
              <p className="text-[11px] text-slate-500">Used for Calendar posting schedules.</p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-lg shadow-red-500/20 disabled:opacity-50 transition-colors"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Encrypting & Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
