"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  Layers,
  LayoutTemplate,
  Images,
  CalendarDays,
  Palette,
  BarChart3,
  Settings,
  Flame,
} from "lucide-react";

const NAV_ITEMS = [
  { name: "Generate", href: "/generate", icon: Sparkles, badge: "Core" },
  { name: "Overlay Presets", href: "/presets", icon: Layers, badge: "18 Live" },
  { name: "Templates", href: "/templates", icon: LayoutTemplate },
  { name: "Library", href: "/library", icon: Images },
  { name: "Schedule", href: "/schedule", icon: CalendarDays },
  { name: "Brand Kit", href: "/brand-kit", icon: Palette },
  { name: "Stats", href: "/stats", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0 shrink-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 flex items-center justify-between">
        <Link href="/generate" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-red-500/20 group-hover:scale-105 transition-transform">
            <Flame className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg text-white tracking-tight">PinForge</span>
              <span className="text-[10px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded">
                v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400">Pinterest Pin Factory</p>
          </div>
        </Link>
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase px-3 mb-2">
          Workspace
        </div>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href === "/generate" && pathname === "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-red-500/10 text-red-400 border border-red-500/20 font-semibold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? "text-red-400" : "text-slate-400"}`} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Cost & BYO Key Indicator Footer */}
      <div className="p-4 border-t border-slate-800 text-xs text-slate-400">
        <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-medium">BYO Engine</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Runware+OR</span>
        </div>
      </div>
    </aside>
  );
}
