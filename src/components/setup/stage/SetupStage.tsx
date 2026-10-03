"use client";

import type { ReactElement } from "react";
import { useState, useCallback } from "react";
import { Camera, Check } from "lucide-react";

export function SetupStage(): ReactElement {
  const [snapshotToast, setSnapshotToast] = useState<string | null>(null);

  const triggerSnapshot = useCallback(() => {
    setSnapshotToast("Workspace snapshot copied!");
    setTimeout(() => {
      setSnapshotToast(null);
    }, 2500);
  }, []);

  return (
    <div className="relative w-full max-w-3xl mx-auto aspect-[16/10] min-h-[360px] sm:min-h-[420px] rounded-3xl border-4 border-slate-700 bg-[#1e293b] shadow-2xl overflow-hidden select-none flex flex-col justify-between">
      <div className="absolute top-4 right-4 z-30">
        <button
          onClick={triggerSnapshot}
          className="flex items-center gap-1.5 bg-slate-800/90 hover:bg-slate-700 active:scale-95 border-2 border-slate-600 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-200 shadow transition-all cursor-pointer"
          title="Export Setup Snapshot"
        >
          <Camera className="w-4 h-4 text-sky-400" />
          <span className="font-mono text-xs">Snapshot</span>
        </button>
      </div>

      {snapshotToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 bg-emerald-600 border-2 border-emerald-400 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-xl flex items-center gap-1.5 animate-bounce">
          <Check className="w-4 h-4 text-white" />
          <span>{snapshotToast}</span>
        </div>
      )}

      <div className="relative flex-1 w-full flex items-center justify-between px-12 sm:px-20 pt-8">
        <div className="w-24 sm:w-28 h-32 sm:h-36 bg-[#334155] border-4 border-slate-600 rounded-2xl shadow-lg flex flex-col items-center justify-center p-2 relative">
          <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-slate-700 border-2 border-slate-500 flex items-center justify-center shadow-inner mb-2">
            <span className="font-mono font-black text-sm sm:text-base text-sky-400">&lt;/&gt;</span>
          </div>
          <div className="w-12 h-1.5 bg-slate-500 rounded-full mb-1" />
          <div className="w-8 h-1 bg-slate-500 rounded-full" />
        </div>

        <div className="flex flex-col items-center gap-2 mr-4 sm:mr-8">
          <div className="flex items-end justify-center gap-1.5">
            <div className="flex flex-col items-center">
              <div className="flex gap-1 -mb-1">
                <div className="w-2 h-4 bg-[#22c55e] rounded-full" />
                <div className="w-2.5 h-5 bg-[#16a34a] rounded-full" />
                <div className="w-2 h-4 bg-[#22c55e] rounded-full" />
              </div>
              <div className="w-7 h-7 bg-[#ea580c] border-b-4 border-[#c2410c] rounded-b-xl rounded-t-sm shadow-md flex items-center justify-center">
                <div className="w-5 h-1 bg-[#fb923c] rounded-full opacity-60" />
              </div>
            </div>
          </div>
          <div className="w-24 sm:w-32 h-2.5 bg-slate-600 rounded-full shadow-md" />
        </div>
      </div>

      <div className="relative w-full h-[24%] min-h-[84px] sm:min-h-[100px] bg-[#cbd5e1] border-b-8 border-slate-400 shadow-2xl flex items-start justify-between px-8 sm:px-16 pt-0">
        <div className="flex items-center -mt-5 sm:-mt-6">
          <div className="relative flex items-center">
            <div className="w-8 sm:w-9 h-10 sm:h-11 bg-emerald-500 border-b-4 border-emerald-700 rounded-b-2xl rounded-t-sm shadow-lg flex items-center justify-center">
              <div className="w-4 h-1 bg-emerald-300 rounded-full opacity-70 mb-3" />
            </div>
            <div className="w-3.5 h-6 border-4 border-emerald-500 rounded-r-xl -ml-1 mt-1 border-l-0" />
          </div>
        </div>

        <div className="relative -mt-12 sm:-mt-16 flex flex-col items-center">
          <div className="w-44 sm:w-56 h-28 sm:h-36 bg-slate-700 border-t-4 border-x-4 border-slate-500 rounded-t-2xl shadow-2xl flex flex-col items-center justify-center relative">
            <div className="w-7 h-7 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center shadow-inner">
              <div className="w-2.5 h-2.5 rounded-full bg-sky-400" />
            </div>
          </div>
          <div className="w-48 sm:w-60 h-2 bg-slate-800 rounded-sm shadow-md" />
        </div>

        <div className="w-16 sm:w-20" />
      </div>
    </div>
  );
}
