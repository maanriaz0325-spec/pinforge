"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  DollarSign,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Clock,
  Layers,
  Palette,
  ArrowUpRight,
} from "lucide-react";

interface ModelSpend {
  model: string;
  count: number;
  spend: number;
}

interface KitSpend {
  name: string;
  count: number;
  spend: number;
}

interface LedgerEvent {
  id: string;
  jobId: string;
  pinId?: string | null;
  kind: string;
  model?: string | null;
  amount: number;
  createdAt: string;
}

interface StatsData {
  totalPins: number;
  totalCost: number;
  avgCostPerPin: number;
  monthlyBudget: number;
  currentMonthSpend: number;
  budgetPercent: number;
  spendByModel: ModelSpend[];
  spendByBrandKit: KitSpend[];
  recentLedger: LedgerEvent[];
}

export default function StatsPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stats");
      const data = await res.json();
      if (data.success && data.stats) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to load stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const budgetPercent = stats?.budgetPercent ?? 0;
  const budgetStatus =
    budgetPercent > 90 ? "exceeded" : budgetPercent > 70 ? "warning" : "safe";

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Cost &amp; Intelligence Stats</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 font-medium">
              Live Ledger Reconciled
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Real-time generation spend, cost per pin, model breakdown, budget guard, and audit ledger.
          </p>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Pins Created</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            {loading ? "..." : stats?.totalPins || 0}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Stored in persistent library</div>
        </div>

        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Spend</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-2">
            ${loading ? "..." : (stats?.totalCost || 0).toFixed(4)}
          </div>
          <div className="text-[11px] text-emerald-400/80 mt-1">Reconciled from CostEvents</div>
        </div>

        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Avg Cost / Pin</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            ${loading ? "..." : (stats?.avgCostPerPin || 0).toFixed(4)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Spec target: &lt; $0.010/pin</div>
        </div>

        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Monthly Budget</span>
            <BarChart3 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            ${stats?.monthlyBudget ? stats.monthlyBudget.toFixed(2) : "50.00"}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            ${(stats?.currentMonthSpend || 0).toFixed(3)} spent this month
          </div>
        </div>
      </div>

      {/* Budget Guard Progress Bar */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Monthly Budget Guard (Spec Section 37)
            </h4>
          </div>

          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
              budgetStatus === "safe"
                ? "bg-emerald-950/60 text-emerald-300 border-emerald-800/40"
                : budgetStatus === "warning"
                ? "bg-amber-950/60 text-amber-300 border-amber-800/40"
                : "bg-red-950/60 text-red-300 border-red-800/40"
            }`}
          >
            {budgetPercent.toFixed(1)}% Consumed ({budgetStatus.toUpperCase()})
          </span>
        </div>

        <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              budgetStatus === "safe"
                ? "bg-emerald-500"
                : budgetStatus === "warning"
                ? "bg-amber-500"
                : "bg-red-500"
            }`}
            style={{ width: `${Math.min(100, Math.max(1, budgetPercent))}%` }}
          />
        </div>

        <div className="flex justify-between text-[11px] text-slate-500 font-mono">
          <span>$0.00</span>
          <span>Budget: ${(stats?.monthlyBudget || 50).toFixed(2)}</span>
        </div>
      </div>

      {/* Model & Brand Kit Breakdown Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Spend by Model */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Spend by Image Model
            </h4>
          </div>

          <div className="space-y-2">
            {stats?.spendByModel && stats.spendByModel.length > 0 ? (
              stats.spendByModel.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-850/80 border border-slate-800/80 flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-semibold text-slate-200">{item.model}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {item.count} images generated
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-emerald-400 font-mono">
                      ${item.spend.toFixed(4)}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {stats.totalCost > 0
                        ? `${((item.spend / stats.totalCost) * 100).toFixed(1)}% of total`
                        : "0%"}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-slate-500">No model spend recorded yet.</div>
            )}
          </div>
        </div>

        {/* Spend by Brand Kit */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-purple-400" />
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Spend by Brand Kit
            </h4>
          </div>

          <div className="space-y-2">
            {stats?.spendByBrandKit && stats.spendByBrandKit.length > 0 ? (
              stats.spendByBrandKit.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-850/80 border border-slate-800/80 flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-semibold text-slate-200">{item.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {item.count} pins associated
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-purple-400 font-mono">
                      ${item.spend.toFixed(4)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-slate-500">No kit spend recorded yet.</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent CostEvent Audit Ledger */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Atomic CostEvent Audit Ledger (Spec Section 8)
            </h4>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            Last {stats?.recentLedger?.length || 0} events
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-medium">
                <th className="pb-3 px-3">Timestamp</th>
                <th className="pb-3 px-3">Kind</th>
                <th className="pb-3 px-3">Model / Provider</th>
                <th className="pb-3 px-3">Job ID</th>
                <th className="pb-3 px-3 text-right">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {stats?.recentLedger && stats.recentLedger.length > 0 ? (
                stats.recentLedger.map((evt) => (
                  <tr key={evt.id} className="hover:bg-slate-850/40">
                    <td className="py-2.5 px-3 font-mono text-slate-400 text-[11px]">
                      {new Date(evt.createdAt).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-slate-800 text-slate-300">
                        {evt.kind}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 font-mono text-[11px]">
                      {evt.model || "—"}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">
                      {evt.jobId.slice(0, 8)}...
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold text-emerald-400">
                      ${evt.amount.toFixed(4)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 text-xs">
                    No transactions recorded in CostEvent table yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
