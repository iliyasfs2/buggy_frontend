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
    <div className="w-full min-h-screen px-3.5 sm:pl-10 md:pl-14 lg:pl-20 xl:pl-28 sm:pr-8 lg:pr-10 py-5 sm:py-8 flex flex-col lg:flex-row items-start gap-8 xl:gap-12 pb-32 md:pb-16 select-none relative">
      <div className="w-full max-w-2xl xl:max-w-3xl flex flex-col gap-7 sm:gap-8 shrink-0">
        <div className="hidden md:flex lg:hidden justify-end w-full">
          <DesktopMetricBar inline />
        </div>

        <div className="relative w-full rounded-3xl bg-slate-900/90 border-2 border-slate-800 p-5 sm:p-7 lg:p-8 shadow-2xl flex items-center justify-between gap-4 overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-sky-500/10 via-indigo-500/5 to-transparent pointer-events-none" />

          <div className="flex items-center gap-3.5 sm:gap-5 relative z-10 min-w-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl bg-sky-500/15 border-2 border-sky-500/30 flex items-center justify-center shrink-0 shadow-inner text-sky-400">
              <Wrench className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9" strokeWidth={2} />
            </div>
            <div className="flex flex-col min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight break-words">
                Debug Lab
              </h1>
              <p className="text-xs sm:text-sm lg:text-base font-bold text-slate-400 mt-1 leading-relaxed break-words">
                Fix past mistakes and sharpen your coding skills.
              </p>
            </div>
          </div>
        </div>

        <section className="flex flex-col gap-3.5 sm:gap-4">
          <div className="px-1">
            <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-400">
              SKILL DRILLS
            </h2>
          </div>

          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 p-5 sm:p-6 lg:p-7 rounded-3xl bg-slate-900/90 border-2 border-b-4 border-slate-800 border-b-slate-950/90 hover:border-slate-700 transition-all shadow-xl">
              <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
                  <Terminal className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={2} />
                </div>
                <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                    <h3 className="text-base sm:text-lg lg:text-xl font-black text-white tracking-tight break-words">
                      Output Lab
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300 text-xs font-black shrink-0">
                      +5 Bytes
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm lg:text-base font-bold text-slate-400 leading-relaxed break-words">
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
                className="w-full sm:w-44 h-12 px-5 rounded-2xl bg-sky-500 hover:bg-sky-400 border-b-[5px] border-sky-700 hover:translate-y-[2px] hover:border-b-[3px] active:translate-y-[4px] active:border-b-0 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center shrink-0 transition-all duration-150 cursor-pointer shadow-md"
              >
                <span>Start Drill</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 p-5 sm:p-6 lg:p-7 rounded-3xl bg-slate-900/90 border-2 border-b-4 border-slate-800 border-b-slate-950/90 hover:border-slate-700 transition-all shadow-xl">
              <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Wand2 className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={2} />
                </div>
                <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                    <h3 className="text-base sm:text-lg lg:text-xl font-black text-white tracking-tight break-words">
                      Clean Code
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-black shrink-0">
                      +20 XP
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm lg:text-base font-bold text-slate-400 leading-relaxed break-words">
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
                className="w-full sm:w-44 h-12 px-5 rounded-2xl bg-amber-400 hover:bg-amber-300 border-b-[5px] border-amber-600 hover:translate-y-[2px] hover:border-b-[3px] active:translate-y-[4px] active:border-b-0 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center shrink-0 transition-all duration-150 cursor-pointer shadow-md"
              >
                <span>Start Challenge</span>
              </button>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-3.5 sm:gap-4">
          <div className="px-1">
            <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-400">
              TARGETED REVIEW
            </h2>
          </div>

          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 p-5 sm:p-6 lg:p-7 rounded-3xl bg-slate-900/90 border-2 border-b-4 border-slate-800 border-b-slate-950/90 hover:border-slate-700 transition-all shadow-xl">
              <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                  <RotateCcw className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={2} />
                </div>
                <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                    <h3 className="text-base sm:text-lg lg:text-xl font-black text-white tracking-tight break-words">
                      Mistakes Bank
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-black shrink-0">
                      {mistakesCount} Left
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm lg:text-base font-bold text-slate-400 leading-relaxed break-words">
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
                className="w-full sm:w-44 h-12 px-5 rounded-2xl bg-rose-500 hover:bg-rose-400 border-b-[5px] border-rose-700 hover:translate-y-[2px] hover:border-b-[3px] active:translate-y-[4px] active:border-b-0 text-white font-black text-sm sm:text-base flex items-center justify-center shrink-0 transition-all duration-150 cursor-pointer shadow-md"
              >
                <span>Fix Mistakes</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 p-5 sm:p-6 lg:p-7 rounded-3xl bg-slate-900/90 border-2 border-b-4 border-slate-800 border-b-slate-950/90 hover:border-slate-700 transition-all shadow-xl">
              <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                  <Layers className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={2} />
                </div>
                <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg lg:text-xl font-black text-white tracking-tight break-words">
                    Mini Scenarios
                  </h3>
                  <p className="text-xs sm:text-sm lg:text-base font-bold text-slate-400 leading-relaxed break-words">
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
                className="w-full sm:w-44 h-12 px-5 rounded-2xl bg-purple-600 hover:bg-purple-500 border-b-[5px] border-purple-800 hover:translate-y-[2px] hover:border-b-[3px] active:translate-y-[4px] active:border-b-0 text-white font-black text-sm sm:text-base flex items-center justify-center shrink-0 transition-all duration-150 cursor-pointer shadow-md"
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
