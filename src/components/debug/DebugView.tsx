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
import { fetchUserProgress } from "@/services/progressApi";
import { soundEffects } from "@/utils/soundEffects";
import { DesktopMetricBar } from "@/components/layout/DesktopMetricBar";

export function DebugView() {
  const router = useRouter();
  const mistakesCount = useGameStore(selectMistakesCount);
  const setMistakesCount = useGameStore((state) => state.setMistakesCount);
  const syncNav = useGameStore((state) => state.syncNav);

  useEffect(() => {
    fetchUserProgress()
      .then((prog) => {
        syncNav(prog);
      })
      .catch(() => {});

    fetchMistakesApi()
      .then((data) => {
        setMistakesCount(data.count);
      })
      .catch(() => {});
  }, [setMistakesCount, syncNav]);

  return (
    <div className="w-full px-3.5 sm:px-6 md:pl-8 lg:pl-10 xl:pl-14 md:pr-6 lg:pr-8 pt-3 pb-4 md:py-3 flex flex-col lg:flex-row items-start justify-between gap-6 xl:gap-8 select-none relative">
      <div className="w-full flex-1 max-w-4xl xl:max-w-[960px] flex flex-col gap-3.5">
        <div className="hidden md:flex lg:hidden justify-end w-full">
          <DesktopMetricBar inline />
        </div>

        <div className="relative w-full rounded-3xl bg-slate-900/90 border-2 border-slate-800 px-5 py-4 sm:px-7 sm:py-5 shadow-xl flex items-center justify-between gap-4 overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-sky-500/10 via-indigo-500/5 to-transparent pointer-events-none" />

          <div className="flex items-center gap-3.5 sm:gap-5 relative z-10 min-w-0">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-sky-500/15 border-2 border-sky-500/30 flex items-center justify-center shrink-0 shadow-inner text-sky-400">
              <Wrench className="w-6 h-6 sm:w-8 sm:h-8" strokeWidth={2} />
            </div>
            <div className="flex flex-col min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight break-words leading-tight">
                Debug Lab
              </h1>
              <p className="text-xs sm:text-base lg:text-lg font-bold text-slate-400 mt-1 leading-snug break-words">
                Fix past mistakes and sharpen your coding skills.
              </p>
            </div>
          </div>
        </div>

        <section className="flex flex-col gap-2">
          <div className="px-1">
            <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-400">
              SKILL DRILLS
            </h2>
          </div>

          <div className="flex flex-col space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 p-4 sm:px-7 sm:py-5 lg:px-8 lg:py-[22px] rounded-3xl bg-slate-900/90 border-2 border-b-4 border-slate-800 border-b-slate-950/90 hover:border-slate-700 transition-all shadow-xl">
              <div className="flex items-start sm:items-center gap-3.5 sm:gap-5 min-w-0 flex-1">
                <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-[68px] lg:h-[68px] rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
                  <Terminal className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9" strokeWidth={2} />
                </div>
                <div className="flex flex-col gap-1 sm:gap-1.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <h3 className="text-base sm:text-xl lg:text-2xl font-black text-white tracking-tight break-words leading-snug">
                      Output Lab
                    </h3>
                    <span className="px-3 py-0.5 sm:py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300 text-xs sm:text-sm font-black shrink-0">
                      +5 Bytes
                    </span>
                  </div>
                  <p className="text-xs sm:text-base lg:text-[17px] font-bold text-slate-400 leading-snug break-words">
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
                className="w-full sm:w-48 lg:w-52 h-12 sm:h-[52px] lg:h-[56px] px-6 rounded-2xl bg-sky-500 hover:bg-sky-400 border-b-[5px] border-sky-700 hover:translate-y-[2px] hover:border-b-[3px] active:translate-y-[4px] active:border-b-0 text-slate-950 font-black text-sm sm:text-base lg:text-lg flex items-center justify-center shrink-0 transition-all duration-150 cursor-pointer shadow-md"
              >
                <span>Start Drill</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 p-4 sm:px-7 sm:py-5 lg:px-8 lg:py-[22px] rounded-3xl bg-slate-900/90 border-2 border-b-4 border-slate-800 border-b-slate-950/90 hover:border-slate-700 transition-all shadow-xl">
              <div className="flex items-start sm:items-center gap-3.5 sm:gap-5 min-w-0 flex-1">
                <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-[68px] lg:h-[68px] rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Wand2 className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9" strokeWidth={2} />
                </div>
                <div className="flex flex-col gap-1 sm:gap-1.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <h3 className="text-base sm:text-xl lg:text-2xl font-black text-white tracking-tight break-words leading-snug">
                      Clean Code
                    </h3>
                    <span className="px-3 py-0.5 sm:py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-black shrink-0">
                      +20 XP
                    </span>
                  </div>
                  <p className="text-xs sm:text-base lg:text-[17px] font-bold text-slate-400 leading-snug break-words">
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
                className="w-full sm:w-48 lg:w-52 h-12 sm:h-[52px] lg:h-[56px] px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 border-b-[5px] border-amber-600 hover:translate-y-[2px] hover:border-b-[3px] active:translate-y-[4px] active:border-b-0 text-slate-950 font-black text-sm sm:text-base lg:text-lg flex items-center justify-center shrink-0 transition-all duration-150 cursor-pointer shadow-md"
              >
                <span>Start Challenge</span>
              </button>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <div className="px-1">
            <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-400">
              TARGETED REVIEW
            </h2>
          </div>

          <div className="flex flex-col space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 p-4 sm:px-7 sm:py-5 lg:px-8 lg:py-[22px] rounded-3xl bg-slate-900/90 border-2 border-b-4 border-slate-800 border-b-slate-950/90 hover:border-slate-700 transition-all shadow-xl">
              <div className="flex items-start sm:items-center gap-3.5 sm:gap-5 min-w-0 flex-1">
                <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-[68px] lg:h-[68px] rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                  <RotateCcw className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9" strokeWidth={2} />
                </div>
                <div className="flex flex-col gap-1 sm:gap-1.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <h3 className="text-base sm:text-xl lg:text-2xl font-black text-white tracking-tight break-words leading-snug">
                      Mistakes Bank
                    </h3>
                    <span className="px-3 py-0.5 sm:py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs sm:text-sm font-black shrink-0">
                      {mistakesCount} Left
                    </span>
                  </div>
                  <p className="text-xs sm:text-base lg:text-[17px] font-bold text-slate-400 leading-snug break-words">
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
                className="w-full sm:w-48 lg:w-52 h-12 sm:h-[52px] lg:h-[56px] px-6 rounded-2xl bg-rose-500 hover:bg-rose-400 border-b-[5px] border-rose-700 hover:translate-y-[2px] hover:border-b-[3px] active:translate-y-[4px] active:border-b-0 text-white font-black text-sm sm:text-base lg:text-lg flex items-center justify-center shrink-0 transition-all duration-150 cursor-pointer shadow-md"
              >
                <span>Fix Mistakes</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 p-4 sm:px-7 sm:py-5 lg:px-8 lg:py-[22px] rounded-3xl bg-slate-900/90 border-2 border-b-4 border-slate-800 border-b-slate-950/90 hover:border-slate-700 transition-all shadow-xl">
              <div className="flex items-start sm:items-center gap-3.5 sm:gap-5 min-w-0 flex-1">
                <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-[68px] lg:h-[68px] rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                  <Layers className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9" strokeWidth={2} />
                </div>
                <div className="flex flex-col gap-1 sm:gap-1.5 min-w-0 flex-1">
                  <h3 className="text-base sm:text-xl lg:text-2xl font-black text-white tracking-tight break-words leading-snug">
                    Mini Scenarios
                  </h3>
                  <p className="text-xs sm:text-base lg:text-[17px] font-bold text-slate-400 leading-snug break-words">
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
                className="w-full sm:w-48 lg:w-52 h-12 sm:h-[52px] lg:h-[56px] px-6 rounded-2xl bg-purple-600 hover:bg-purple-500 border-b-[5px] border-purple-800 hover:translate-y-[2px] hover:border-b-[3px] active:translate-y-[4px] active:border-b-0 text-white font-black text-sm sm:text-base lg:text-lg flex items-center justify-center shrink-0 transition-all duration-150 cursor-pointer shadow-md"
              >
                <span>Play Scenario</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      <div className="hidden lg:flex shrink-0 justify-end sticky top-3">
        <DesktopMetricBar inline />
      </div>
    </div>
  );
}
