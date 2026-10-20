"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles,
  Download,
  FileSpreadsheet,
  Plus,
  ArrowRight,
  Sliders,
  Check,
  Calendar,
  Layers,
  ChevronRight,
  Trash2,
} from "lucide-react";

interface ScheduledPin {
  id: string;
  imageUrl: string;
  title: string | null;
  targetKeyword: string | null;
  pinType: string | null;
  status: string;
  scheduleDate: string | null;
  scheduleTime: string | null;
  used?: boolean;
  brandKit?: { brandName: string; kitName: string } | null;
}

export default function SchedulePage() {
  const [scheduledPins, setScheduledPins] = useState<ScheduledPin[]>([]);
  const [unscheduledPins, setUnscheduledPins] = useState<ScheduledPin[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Auto-spread modal state
  const [showSpreadModal, setShowSpreadModal] = useState(false);
  const [spreadPinsPerDay, setSpreadPinsPerDay] = useState(3);
  const [spreadStartDate, setSpreadStartDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split("T")[0]
  );
  const [selectedSlotHours, setSelectedSlotHours] = useState<number[]>([9, 14, 20]);

  // Selected pins for bulk spread
  const [selectedPinIds, setSelectedPinIds] = useState<string[]>([]);

  useEffect(() => {
    fetchScheduleData();
  }, []);

  const fetchScheduleData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/schedule");
      const data = await res.json();
      if (data.success) {
        setScheduledPins(data.scheduled || []);
        setUnscheduledPins(data.unscheduled || []);
        // Default select all unscheduled pins for auto-spread convenience
        if (data.unscheduled) {
          setSelectedPinIds(data.unscheduled.map((p: ScheduledPin) => p.id));
        }
      }
    } catch (err) {
      console.error("Failed to load schedule:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (pinId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "PUBLISHED" ? "SCHEDULED" : "PUBLISHED";
    try {
      await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pinId, status: nextStatus }),
      });
      fetchScheduleData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnschedule = async (pinId: string) => {
    try {
      await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pinId, scheduledDate: null, status: "DRAFT" }),
      });
      fetchScheduleData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuickSchedule = async (pinId: string, dateStr: string) => {
    if (!dateStr) return;
    try {
      await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pinId,
          scheduledDate: new Date(dateStr).toISOString(),
          status: "SCHEDULED",
        }),
      });
      fetchScheduleData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleExecuteSpread = async () => {
    if (selectedPinIds.length === 0) {
      alert("Please select at least one pin to schedule.");
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch("/api/schedule/spread", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pinIds: selectedPinIds,
          startDate: spreadStartDate,
          pinsPerDay: spreadPinsPerDay,
          hours: selectedSlotHours,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowSpreadModal(false);
        fetchScheduleData();
      } else {
        alert(data.error || "Auto-spread failed");
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleExportCsv = async () => {
    try {
      const res = await fetch("/api/pins/export/csv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `pinterest_schedule_${Date.now()}.csv`;
        a.click();
      } else {
        alert("Failed to export CSV");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportZip = async () => {
    try {
      const res = await fetch("/api/pins/export/zip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ compressed: true }),
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `pinforge_scheduled_pins_${Date.now()}.zip`;
        a.click();
      } else {
        alert("Failed to export ZIP");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const scheduledCount = scheduledPins.filter((p) => p.status === "SCHEDULED").length;
  const publishedCount = scheduledPins.filter((p) => p.status === "PUBLISHED").length;

  // Group scheduled pins by Day (YYYY-MM-DD)
  const groupedSchedule: Record<string, ScheduledPin[]> = {};
  for (const pin of scheduledPins) {
    if (!pin.scheduleDate) continue;
    const dayKey = pin.scheduleDate;
    if (!groupedSchedule[dayKey]) {
      groupedSchedule[dayKey] = [];
    }
    groupedSchedule[dayKey].push(pin);
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Posting Scheduler</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-950/80 text-blue-300 border border-blue-800/60 font-medium">
              Calendar &amp; Auto-Spread
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Auto-spread batch pins across calendar slots with organic jitter, sync published tickmarks, and export Pinterest bulk files.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowSpreadModal(true)}
            className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2 rounded-lg flex items-center gap-1.5 font-medium shadow-sm shadow-blue-500/20 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Auto-Spread ({unscheduledPins.length} Unscheduled)</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="text-xs bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-lg flex items-center gap-1.5 font-medium transition-all"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pinterest CSV</span>
          </button>

          <button
            onClick={handleExportZip}
            className="text-xs bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-lg flex items-center gap-1.5 font-medium transition-all"
          >
            <Download className="w-3.5 h-3.5 text-purple-400" />
            <span>ZIP Export</span>
          </button>
        </div>
      </div>

      {/* Metric Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Scheduled Queue</div>
            <div className="text-xl font-bold text-blue-400 mt-1">{scheduledCount} Pins</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Published / Tickmarked</div>
            <div className="text-xl font-bold text-emerald-400 mt-1">{publishedCount} Pins</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Unscheduled Drafts</div>
            <div className="text-xl font-bold text-amber-400 mt-1">{unscheduledPins.length} Pins</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <CalendarDays className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Layout: Unscheduled Drawer on Left, Calendar Timeline on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Unscheduled Pins Drawer */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase tracking-wider font-semibold px-1">
            <span>Unscheduled Queue ({unscheduledPins.length})</span>
            {unscheduledPins.length > 0 && (
              <button
                onClick={() => setShowSpreadModal(true)}
                className="text-[11px] text-blue-400 hover:text-blue-300 font-medium normal-case"
              >
                Spread All &rarr;
              </button>
            )}
          </div>

          <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
            {loading ? (
              <div className="p-8 text-center text-slate-500 text-xs">Loading queue...</div>
            ) : unscheduledPins.length === 0 ? (
              <div className="p-8 border border-dashed border-slate-800 rounded-xl text-center text-slate-500 text-xs">
                All pins are currently scheduled! Generate more in{" "}
                <Link href="/generate" className="text-blue-400 hover:underline">
                  Generate
                </Link>
                .
              </div>
            ) : (
              unscheduledPins.map((pin) => (
                <div
                  key={pin.id}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex gap-3 items-center"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pin.imageUrl}
                    alt={pin.title || "Pin preview"}
                    className="w-12 h-16 rounded object-cover border border-slate-800 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-semibold text-slate-200 truncate">
                      {pin.title || "Untitled Pin"}
                    </h5>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">
                      {pin.targetKeyword || pin.pinType || "Draft"}
                    </div>

                    <div className="mt-2 flex items-center gap-1.5">
                      <input
                        type="datetime-local"
                        className="bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-[10px] text-slate-300 focus:outline-none focus:border-blue-500"
                        onChange={(e) => handleQuickSchedule(pin.id, e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Scheduled Calendar Timeline */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase tracking-wider font-semibold px-1">
            <span>Publishing Timeline</span>
            <span className="text-[11px] normal-case text-slate-500 font-mono">
              {scheduledPins.length} slots assigned
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-500 text-xs">Loading timeline...</div>
          ) : Object.keys(groupedSchedule).length === 0 ? (
            <div className="p-12 border border-slate-800 rounded-2xl bg-slate-900/40 text-center space-y-3">
              <Calendar className="w-10 h-10 text-slate-600 mx-auto" />
              <h4 className="text-sm font-semibold text-slate-300">No Pins Scheduled Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Use the Auto-Spread engine above to distribute unscheduled pins across calendar slots with natural jitter.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedSchedule)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([dayStr, pins]) => {
                  const dateObj = new Date(dayStr + "T00:00:00");
                  const formattedDay = dateObj.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  });

                  return (
                    <div key={dayStr} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                          {formattedDay}
                        </h4>
                        <span className="text-[10px] font-mono text-slate-500">
                          ({pins.length} pins)
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {pins.map((pin) => {
                          const timeStr = pin.scheduleTime || "09:00";
                          const isPublished = pin.status === "PUBLISHED" || pin.used;

                          return (
                            <div
                              key={pin.id}
                              className={`p-3.5 rounded-xl border transition-all flex gap-3 items-start ${
                                isPublished
                                  ? "bg-emerald-950/20 border-emerald-800/40"
                                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                              }`}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={pin.imageUrl}
                                alt={pin.title || "Pin preview"}
                                className="w-14 h-20 rounded object-cover border border-slate-800 shrink-0 shadow-sm"
                              />

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <span className="text-[11px] font-mono font-semibold text-blue-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{timeStr}</span>
                                  </span>

                                  <button
                                    onClick={() => handleToggleStatus(pin.id, pin.status)}
                                    title={isPublished ? "Mark as Scheduled" : "Mark as Published (Tickmark)"}
                                    className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 border transition-all ${
                                      isPublished
                                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                        : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
                                    }`}
                                  >
                                    <Check className="w-3 h-3" />
                                    <span>{isPublished ? "Published" : "Tickmark"}</span>
                                  </button>
                                </div>

                                <h5 className="text-xs font-semibold text-slate-200 mt-1 line-clamp-1">
                                  {pin.title || "Untitled Pin"}
                                </h5>

                                <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                                  {pin.brandKit?.brandName
                                    ? `Brand: ${pin.brandKit.brandName}`
                                    : pin.targetKeyword || pin.pinType}
                                </div>

                                <div className="mt-2 flex items-center justify-end">
                                  <button
                                    onClick={() => handleUnschedule(pin.id)}
                                    title="Unschedule (move back to drafts)"
                                    className="text-[10px] text-slate-500 hover:text-red-400 flex items-center gap-1"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    <span>Unschedule</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>

      {/* Auto-Spread Modal */}
      {showSpreadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white">Auto-Spread Scheduler</h3>
              </div>
              <button
                onClick={() => setShowSpreadModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Distribute your unscheduled pins across calendar days evenly. PinForge automatically injects random posting jitter (&plusmn;15 min) so Pinterest detects genuine organic creator activity.
            </p>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium">Start Date</label>
                <input
                  type="date"
                  value={spreadStartDate}
                  onChange={(e) => setSpreadStartDate(e.target.value)}
                  className="w-full bg-slate-850 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-300 font-medium">
                  <span>Pins Per Day</span>
                  <span className="font-mono text-blue-400">{spreadPinsPerDay} pins/day</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="6"
                  value={spreadPinsPerDay}
                  onChange={(e) => setSpreadPinsPerDay(parseInt(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium">Posting Time Slots</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Morning (9 AM)", hour: 9 },
                    { label: "Afternoon (2 PM)", hour: 14 },
                    { label: "Evening (8 PM)", hour: 20 },
                  ].map((slot) => {
                    const active = selectedSlotHours.includes(slot.hour);
                    return (
                      <button
                        key={slot.hour}
                        type="button"
                        onClick={() => {
                          if (active) {
                            if (selectedSlotHours.length > 1) {
                              setSelectedSlotHours(selectedSlotHours.filter((h) => h !== slot.hour));
                            }
                          } else {
                            setSelectedSlotHours([...selectedSlotHours, slot.hour].sort((a, b) => a - b));
                          }
                        }}
                        className={`p-2 rounded-lg border text-xs font-medium transition-all ${
                          active
                            ? "bg-blue-600/20 border-blue-500 text-blue-300"
                            : "bg-slate-850 border-slate-800 text-slate-400"
                        }`}
                      >
                        {slot.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs text-slate-400 space-y-1">
                <div className="text-slate-200 font-medium">Spread Projection</div>
                <div>
                  Scheduling <span className="text-blue-400 font-bold">{selectedPinIds.length}</span> pins over{" "}
                  <span className="text-white font-bold">
                    {Math.ceil(selectedPinIds.length / spreadPinsPerDay)} days
                  </span>
                  .
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowSpreadModal(false)}
                className="text-xs px-3.5 py-2 rounded-lg text-slate-400 hover:text-white font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteSpread}
                disabled={actionLoading || selectedPinIds.length === 0}
                className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 shadow-sm shadow-blue-500/20 disabled:opacity-50"
              >
                {actionLoading ? "Spreading Pins..." : "Execute Auto-Spread"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
