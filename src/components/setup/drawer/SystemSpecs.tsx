"use client";

import type { ReactElement } from "react";
import { useSetupStore } from "@/store/useSetupStore";
import { Terminal, Cpu, Zap, Activity, Award, Flame, RefreshCw } from "lucide-react";

export function SystemSpecs(): ReactElement {
  const compiledLines = useSetupStore((state) => state.compiledLines);
  const debugRate = useSetupStore((state) => state.debugRate);
  const uptimeHours = useSetupStore((state) => state.uptimeHours);
  const setupScore = useSetupStore((state) => state.setupScore);
  const incrementStats = useSetupStore((state) => state.incrementStats);

  const formattedLines = new Intl.NumberFormat().format(compiledLines);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-slate-900/90 border-2 border-slate-700/80 rounded-xl p-3.5 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider">Compiled Lines</span>
            <Terminal className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-sky-400 font-mono tracking-tight my-1">
            {formattedLines} <span className="text-xs text-slate-400 font-normal">LOC</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
            <span className="text-emerald-400 font-semibold">+15 LOC/min</span>
            <span>avg throughput</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border-2 border-slate-700/80 rounded-xl p-3.5 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider">Debug Success</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 font-mono tracking-tight my-1">
            {debugRate}%
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
            <div
              className="bg-amber-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, debugRate)}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-900/90 border-2 border-slate-700/80 rounded-xl p-3.5 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider">Workspace Uptime</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono tracking-tight my-1">
            {uptimeHours} <span className="text-xs text-slate-400 font-normal">HRS</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Optimal Temperature</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border-2 border-slate-700/80 rounded-xl p-3.5 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider">Setup Prestige</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-400 font-mono tracking-tight my-1 flex items-center gap-2">
            <span>Tier {setupScore}</span>
            <span className="text-base text-yellow-400">{"★".repeat(Math.min(5, setupScore))}</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Full Stack Artisan
          </div>
        </div>
      </div>

      <div className="bg-[#0e1624] border-2 border-slate-700/80 rounded-xl p-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-200">
              Telemetry & Rig Overclocking
            </h4>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40">
            ENGINE STATUS: ONLINE
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => incrementStats("compiledLines", 75)}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 px-3.5 py-2 rounded-lg text-xs font-mono font-medium border border-slate-700 transition-all cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5 text-sky-400" />
            <span>Run Syntax Benchmark (+75 LOC)</span>
          </button>

          <button
            onClick={() => incrementStats("debugRate", 1)}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 px-3.5 py-2 rounded-lg text-xs font-mono font-medium border border-slate-700 transition-all cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Overclock Debug Engine (+1%)</span>
          </button>

          <button
            onClick={() => incrementStats("uptimeHours", 2)}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 px-3.5 py-2 rounded-lg text-xs font-mono font-medium border border-slate-700 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Purge Memory Cache (+2 hrs)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
