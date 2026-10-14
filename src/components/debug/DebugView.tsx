"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Code2,
  Wand2,
  RotateCcw,
  BookOpen,
  ChevronRight,
  Terminal,
} from "lucide-react";
import {
  useGameStore,
  selectMistakesCount,
} from "@/store/useGameStore";
import { fetchMistakesApi } from "@/services/debugApi";
import { soundEffects } from "@/utils/soundEffects";

export function DebugView() {
  const router = useRouter();
  const mistakesCount = useGameStore(selectMistakesCount);
  const setMistakesCount = useGameStore(
    (state) => state.setMistakesCount
  );

  useEffect(() => {
    fetchMistakesApi()
      .then((data) => {
        setMistakesCount(data.count);
      })
      .catch(() => {});
  }, [setMistakesCount]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-10 flex flex-col gap-8 select-none relative">
      <div className="relative w-full rounded-3xl bg-slate-900/90 border-2 border-slate-800 p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-sky-500/10 via-indigo-500/5 to-transparent pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-sky-500/15 border-2 border-sky-500/30 flex items-center justify-center p-3 shrink-0 shadow-inner text-sky-400 text-3xl">
            🛠️
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Debug Lab
            </h1>
            <p className="text-xs font-bold text-slate-400 mt-1 max-w-sm">
              Sharpen your developer intuition, trace mental outputs, and clear past mistakes.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 relative z-10">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-black text-slate-300">
            <Terminal className="w-4 h-4 text-sky-400" />
            <span>4 Tracing Drills</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-black text-slate-300">
            <Wand2 className="w-4 h-4 text-amber-400" />
            <span>3 Refactors</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-rose-950/40 border border-rose-800/40 text-xs font-black text-rose-300">
            <RotateCcw className="w-4 h-4 text-rose-400" />
            <span>{mistakesCount} Bugs in Bank</span>
          </div>
        </div>
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-400">
            Coding Practice
          </h2>
          <span className="text-xs font-bold text-slate-500">Skill Challenges</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative rounded-3xl bg-slate-900/90 border-2 border-slate-800 p-6 shadow-xl flex flex-col justify-between gap-5 transition-all hover:border-slate-700">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
                  <Code2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white tracking-tight">
                    Code Reading
                  </h3>
                  <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider">
                    Trace Outputs
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                Duolingo Listen
              </span>
            </div>

            <p className="text-xs font-bold text-slate-400 leading-relaxed">
              Trace execution in your head and predict console.log outputs without a debugger.
            </p>

            <button
              type="button"
              onClick={() => {
                soundEffects.playSoftClick();
                router.push("/lesson?mode=debug_tracing");
              }}
              className="w-full py-3 px-4 rounded-2xl bg-sky-500 hover:bg-sky-400 active:translate-y-1 border-b-4 border-sky-700 active:border-b-0 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <span>Start Practice</span>
              <span className="text-xs bg-sky-600/40 text-slate-950 px-2 py-0.5 rounded-full">
                +5 Bytes
              </span>
            </button>
          </div>

          <div className="relative rounded-3xl bg-slate-900/90 border-2 border-slate-800 p-6 shadow-xl flex flex-col justify-between gap-5 transition-all hover:border-slate-700">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Wand2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white tracking-tight">
                    Code Refactor
                  </h3>
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                    Clean & Modern
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                Duolingo Speak
              </span>
            </div>

            <p className="text-xs font-bold text-slate-400 leading-relaxed">
              Transform verbose conditionals, clumsy loops, and legacy syntax into idiomatic ES6+.
            </p>

            <button
              type="button"
              onClick={() => {
                soundEffects.playSoftClick();
                router.push("/lesson?mode=debug_refactor");
              }}
              className="w-full py-3 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 active:translate-y-1 border-b-4 border-amber-600 active:border-b-0 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <span>Start Refactor</span>
              <span className="text-xs bg-amber-500/40 text-slate-950 px-2 py-0.5 rounded-full">
                +20 XP
              </span>
            </button>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-400">
            Your Collections
          </h2>
          <span className="text-xs font-bold text-slate-500">Targeted Review</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative rounded-3xl bg-slate-900/90 border-2 border-slate-800 p-6 shadow-xl flex flex-col justify-between gap-5 transition-all hover:border-slate-700">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                  <RotateCcw className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white tracking-tight">
                    Mistakes Bank
                  </h3>
                  <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">
                    Error Log & Fixes
                  </span>
                </div>
              </div>

              {mistakesCount > 0 && (
                <span className="bg-rose-500 rounded-full text-xs font-black px-2.5 py-0.5 text-white shadow-md animate-pulse">
                  {mistakesCount > 30 ? "30+" : `+${mistakesCount}`}
                </span>
              )}
            </div>

            <p className="text-xs font-bold text-slate-400 leading-relaxed">
              Review and resolve the exact pitfalls and bugs you previously struggled with during lessons.
            </p>

            <button
              type="button"
              onClick={() => {
                soundEffects.playSoftClick();
                router.push("/lesson?mode=debug_mistakes");
              }}
              className={`w-full py-3 px-4 rounded-2xl active:translate-y-1 border-b-4 active:border-b-0 font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                mistakesCount > 0
                  ? "bg-rose-500 hover:bg-rose-400 border-rose-700 text-white"
                  : "bg-slate-800 hover:bg-slate-700 border-slate-950 text-slate-300"
              }`}
            >
              <span>{mistakesCount > 0 ? "Review Bugs" : "No Bugs to Fix"}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  mistakesCount > 0
                    ? "bg-rose-600/60 text-white"
                    : "bg-slate-900 text-emerald-400"
                }`}
              >
                {mistakesCount > 0 ? `${mistakesCount} Pending` : "Bank Empty"}
              </span>
            </button>
          </div>

          <div className="relative rounded-3xl bg-slate-900/90 border-2 border-slate-800 p-6 shadow-xl flex flex-col justify-between gap-5 transition-all hover:border-slate-700">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white tracking-tight">
                    Code Stories
                  </h3>
                  <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">
                    Micro-Feature Scenarios
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                Duolingo Stories
              </span>
            </div>

            <p className="text-xs font-bold text-slate-400 leading-relaxed">
              Real-world scenario simulations where you build functional mini-features step-by-step.
            </p>

            <button
              type="button"
              onClick={() => {
                soundEffects.playSoftClick();
                router.push("/lesson?mode=debug_stories");
              }}
              className="w-full py-3 px-4 rounded-2xl bg-purple-600 hover:bg-purple-500 active:translate-y-1 border-b-4 border-purple-800 active:border-b-0 text-white font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <span>Explore Stories</span>
              <span className="text-xs bg-purple-700/60 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                <span>+30 Bytes & XP</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
