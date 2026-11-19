"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Terminal,
  Wand2,
  RotateCcw,
  Layers,
  Wrench,
} from "lucide-react";
import {
  useGameStore,
  selectMistakesCount,
} from "@/store/useGameStore";
import { fetchMistakesApi } from "@/services/debugApi";
import { soundEffects } from "@/utils/soundEffects";
import { DesktopMetricBar } from "@/components/layout/DesktopMetricBar";

export function DebugView() {
  const router = useRouter();
  const mistakesCount = useGameStore(selectMistakesCount);
  const setMistakesCount = useGameStore((state) => state.setMistakesCount);

  useEffect(() => {
    fetchMistakesApi()
      .then((data) => {
        setMistakesCount(data.count);
      })
      .catch(() => {});
  }, [setMistakesCount]);

  return (
    <div className="w-full min-h-screen pl-4 sm:pl-10 md:pl-16 lg:pl-24 xl:pl-32 pr-4 sm:pr-8 lg:pr-10 py-6 sm:py-8 flex flex-col lg:flex-row items-start gap-8 xl:gap-14 pb-32 md:pb-16 select-none relative">
      <div className="w-full max-w-xl xl:max-w-2xl flex flex-col gap-7 shrink-0">
        <div className="hidden md:flex lg:hidden justify-end w-full">
          <DesktopMetricBar inline />
        </div>

        <div className="relative w-full rounded-2xl bg-[#131f24] border-2 border-slate-800 p-5 sm:p-6 shadow-xl flex items-center justify-between gap-4 overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-sky-500/10 via-indigo-500/5 to-transparent pointer-events-none" />

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-sky-500/15 border-2 border-sky-500/30 flex items-center justify-center shrink-0 shadow-inner text-sky-400">
              <Wrench className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Debug Lab
              </h1>
              <p className="text-xs sm:text-sm font-bold text-slate-400 mt-0.5">
                Fix past mistakes and sharpen your coding skills.
              </p>
            </div>
          </div>
        </div>

        <section className="flex flex-col gap-3">
          <div className="px-1">
            <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-400">
              SKILL DRILLS
            </h2>
          </div>

          <div className="flex flex-col space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-[#131f24] border-2 border-slate-800 hover:border-slate-700 transition-all shadow-lg">
              <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
                  <Terminal className="w-6 h-6" strokeWidth={2} />
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                      Output Lab
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300 text-[11px] font-black">
                      +5 Bytes
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-400 leading-relaxed">
                    Read short code and predict the console output.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundEffects.playSoftClick();
                  router.push("/lesson?mode=debug_tracing");
                }}
                className="w-full sm:w-36 h-11 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 active:translate-y-0.5 border-b-4 border-sky-700 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center shrink-0 transition-all cursor-pointer shadow-md"
              >
                <span>Start Drill</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-[#131f24] border-2 border-slate-800 hover:border-slate-700 transition-all shadow-lg">
              <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Wand2 className="w-6 h-6" strokeWidth={2} />
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                      Clean Code
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-black">
                      +20 XP
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-400 leading-relaxed">
                    Turn messy JavaScript into clean, modern code.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundEffects.playSoftClick();
                  router.push("/lesson?mode=debug_refactor");
                }}
                className="w-full sm:w-36 h-11 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 active:translate-y-0.5 border-b-4 border-amber-600 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center shrink-0 transition-all cursor-pointer shadow-md"
              >
                <span>Start Challenge</span>
              </button>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <div className="px-1">
            <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-400">
              TARGETED REVIEW
            </h2>
          </div>

          <div className="flex flex-col space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-[#131f24] border-2 border-slate-800 hover:border-slate-700 transition-all shadow-lg">
              <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                  <RotateCcw className="w-6 h-6" strokeWidth={2} />
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                      Mistakes Bank
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[11px] font-black">
                      {mistakesCount} Left
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-400 leading-relaxed">
                    Practice the exact bugs you missed in previous lessons.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundEffects.playSoftClick();
                  router.push("/lesson?mode=debug_mistakes");
                }}
                className="w-full sm:w-36 h-11 px-4 rounded-xl bg-rose-500 hover:bg-rose-400 active:translate-y-0.5 border-b-4 border-rose-700 text-white font-black text-xs sm:text-sm flex items-center justify-center shrink-0 transition-all cursor-pointer shadow-md"
              >
                <span>Fix Mistakes</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-[#131f24] border-2 border-slate-800 hover:border-slate-700 transition-all shadow-lg">
              <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                  <Layers className="w-6 h-6" strokeWidth={2} />
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                    Mini Scenarios
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-slate-400 leading-relaxed">
                    Build real mini-features step by step.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundEffects.playSoftClick();
                  router.push("/lesson?mode=debug_stories");
                }}
                className="w-full sm:w-36 h-11 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 active:translate-y-0.5 border-b-4 border-purple-800 text-white font-black text-xs sm:text-sm flex items-center justify-center shrink-0 transition-all cursor-pointer shadow-md"
              >
                <span>Play Scenario</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      <div className="hidden lg:flex flex-1 justify-center sticky top-8">
        <DesktopMetricBar inline />
      </div>
    </div>
  );
}
