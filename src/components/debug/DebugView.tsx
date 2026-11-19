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
import { DailyQuestsCard } from "@/components/quests/DailyQuestsCard";

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
    <div className="w-full pl-4 sm:pl-10 md:pl-16 lg:pl-24 xl:pl-32 pr-4 sm:pr-8 lg:pr-10 pt-3 pb-4 md:py-3 flex flex-col lg:flex-row items-start gap-8 xl:gap-14 select-none relative">
      <div className="w-full max-w-xl xl:max-w-2xl flex flex-col gap-3 shrink-0">
        <div className="hidden md:flex lg:hidden justify-end w-full">
          <DesktopMetricBar inline />
        </div>

        <div className="relative w-full rounded-3xl bg-slate-900/90 border-2 border-b-4 border-slate-700/80 border-b-slate-600 px-5 py-3.5 sm:px-6 sm:py-3.5 shadow-xl flex items-center justify-between gap-4 overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-sky-500/10 via-indigo-500/5 to-transparent pointer-events-none" />

          <div className="flex items-center gap-3.5 sm:gap-4 relative z-10 min-w-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-sky-500/15 border-2 border-sky-500/30 flex items-center justify-center shrink-0 shadow-inner text-sky-400">
              <Wrench className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2} />
            </div>
            <div className="flex flex-col min-w-0">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight break-words leading-tight">
                Debug Lab
              </h1>
              <p className="text-xs sm:text-sm font-bold text-slate-400 mt-0.5 leading-snug break-words">
                Fix past mistakes and sharpen your coding skills.
              </p>
            </div>
          </div>
        </div>

        <section className="flex flex-col gap-1.5">
          <div className="px-1">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">
              SKILL DRILLS
            </h2>
          </div>

          <div className="flex flex-col space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-5 p-4 sm:px-6 sm:py-3.5 rounded-3xl bg-slate-900/90 border-2 border-b-4 border-slate-700/80 border-b-slate-600 hover:border-slate-600 transition-all shadow-xl">
              <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
                  <Terminal className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2} />
                </div>
                <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                    <h3 className="text-base sm:text-lg lg:text-xl font-black text-white tracking-tight break-words leading-snug">
                      Output Lab
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300 text-xs font-black shrink-0">
                      +5 Bytes
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-400 leading-snug break-words">
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
                className="w-full sm:w-44 h-11 sm:h-12 px-5 rounded-2xl bg-sky-500 hover:bg-sky-400 border-b-[5px] border-sky-700 hover:translate-y-[2px] hover:border-b-[3px] active:translate-y-[4px] active:border-b-0 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center shrink-0 transition-all duration-150 cursor-pointer shadow-md"
              >
                <span>Start Drill</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-5 p-4 sm:px-6 sm:py-3.5 rounded-3xl bg-slate-900/90 border-2 border-b-4 border-slate-700/80 border-b-slate-600 hover:border-slate-600 transition-all shadow-xl">
              <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Wand2 className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2} />
                </div>
                <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                    <h3 className="text-base sm:text-lg lg:text-xl font-black text-white tracking-tight break-words leading-snug">
                      Clean Code
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-black shrink-0">
                      +20 XP
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-400 leading-snug break-words">
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
                className="w-full sm:w-44 h-11 sm:h-12 px-5 rounded-2xl bg-amber-400 hover:bg-amber-300 border-b-[5px] border-amber-600 hover:translate-y-[2px] hover:border-b-[3px] active:translate-y-[4px] active:border-b-0 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center shrink-0 transition-all duration-150 cursor-pointer shadow-md"
              >
                <span>Start Challenge</span>
              </button>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-1.5">
          <div className="px-1">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">
              TARGETED REVIEW
            </h2>
          </div>

          <div className="flex flex-col space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-5 p-4 sm:px-6 sm:py-3.5 rounded-3xl bg-slate-900/90 border-2 border-b-4 border-slate-700/80 border-b-slate-600 hover:border-slate-600 transition-all shadow-xl">
              <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                  <RotateCcw className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2} />
                </div>
                <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                    <h3 className="text-base sm:text-lg lg:text-xl font-black text-white tracking-tight break-words leading-snug">
                      Mistakes Bank
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-black shrink-0">
                      {mistakesCount} Left
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-400 leading-snug break-words">
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
                className="w-full sm:w-44 h-11 sm:h-12 px-5 rounded-2xl bg-rose-500 hover:bg-rose-400 border-b-[5px] border-rose-700 hover:translate-y-[2px] hover:border-b-[3px] active:translate-y-[4px] active:border-b-0 text-white font-black text-sm sm:text-base flex items-center justify-center shrink-0 transition-all duration-150 cursor-pointer shadow-md"
              >
                <span>Fix Mistakes</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-5 p-4 sm:px-6 sm:py-3.5 rounded-3xl bg-slate-900/90 border-2 border-b-4 border-slate-700/80 border-b-slate-600 hover:border-slate-600 transition-all shadow-xl">
              <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                  <Layers className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2} />
                </div>
                <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg lg:text-xl font-black text-white tracking-tight break-words leading-snug">
                    Mini Scenarios
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-slate-400 leading-snug break-words">
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
                className="w-full sm:w-44 h-11 sm:h-12 px-5 rounded-2xl bg-purple-600 hover:bg-purple-500 border-b-[5px] border-purple-800 hover:translate-y-[2px] hover:border-b-[3px] active:translate-y-[4px] active:border-b-0 text-white font-black text-sm sm:text-base flex items-center justify-center shrink-0 transition-all duration-150 cursor-pointer shadow-md"
              >
                <span>Play Scenario</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      <div className="hidden lg:flex flex-1 flex-col items-center gap-5 sticky top-4">
        <DesktopMetricBar inline />
        <div className="w-full max-w-[360px]">
          <DailyQuestsCard />
        </div>
      </div>
    </div>
  );
}
