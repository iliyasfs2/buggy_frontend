"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  Wand2,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Terminal,
} from "lucide-react";
import {
  useGameStore,
  selectMistakesCount,
} from "@/store/useGameStore";
import {
  fetchMistakesApi,
  resolveMistakeApi,
  type MistakeItem,
} from "@/services/debugApi";
import { soundEffects } from "@/utils/soundEffects";

export function DebugView() {
  const mistakesCount = useGameStore(selectMistakesCount);
  const setMistakesCount = useGameStore(
    (state) => state.setMistakesCount
  );
  const addXp = useGameStore((state) => state.addXp);

  const [mistakes, setMistakes] = useState<MistakeItem[]>([]);
  const [activeModal, setActiveModal] = useState<
    "mistakes" | "reading" | "refactor" | "stories" | null
  >(null);
  const [selectedMistakeIndex, setSelectedMistakeIndex] = useState(0);
  const [isResolving, setIsResolving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [readingAnswer, setReadingAnswer] = useState<string | null>(null);
  const [readingResult, setReadingResult] = useState<"correct" | "incorrect" | null>(null);

  const [refactorAnswer, setRefactorAnswer] = useState<string | null>(null);
  const [refactorResult, setRefactorResult] = useState<"correct" | "incorrect" | null>(null);

  useEffect(() => {
    fetchMistakesApi()
      .then((data) => {
        setMistakes(data.mistakes);
        setMistakesCount(data.count);
      })
      .catch(() => {});
  }, [setMistakesCount]);

  const handleOpenMistakesModal = () => {
    soundEffects.playSoftClick();
    setSelectedMistakeIndex(0);
    setActiveModal("mistakes");
  };

  const handleResolveMistake = async (mistake: MistakeItem) => {
    if (isResolving) return;
    setIsResolving(true);
    soundEffects.playSoftClick();

    try {
      const res = await resolveMistakeApi(mistake.id);
      soundEffects.playVictory();
      addXp(10);
      setMistakesCount(res.remaining_count);
      setMistakes((prev) => prev.filter((m) => m.id !== mistake.id));
      setToastMessage("Bug cleared! +10 Bytes and +10 XP earned!");
      setTimeout(() => setToastMessage(null), 3000);

      if (selectedMistakeIndex >= mistakes.length - 1) {
        setSelectedMistakeIndex(Math.max(0, mistakes.length - 2));
      }
    } catch {
      soundEffects.playIncorrect();
      setToastMessage("Failed to resolve bug. Try again.");
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setIsResolving(false);
    }
  };

  const handleCheckReading = (chosen: string) => {
    setReadingAnswer(chosen);
    if (chosen === "10 undefined") {
      soundEffects.playVictory();
      setReadingResult("correct");
      addXp(15);
    } else {
      soundEffects.playIncorrect();
      setReadingResult("incorrect");
    }
  };

  const handleCheckRefactor = (chosen: string) => {
    setRefactorAnswer(chosen);
    if (chosen === "const double = arr.map(n => n * 2);") {
      soundEffects.playVictory();
      setRefactorResult("correct");
      addXp(20);
    } else {
      soundEffects.playIncorrect();
      setRefactorResult("incorrect");
    }
  };

  const currentMistake = mistakes[selectedMistakeIndex];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-10 flex flex-col gap-8 select-none relative">
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-emerald-500 text-slate-950 font-black text-sm shadow-2xl flex items-center gap-2 border-2 border-emerald-400"
          >
            <span>✓</span>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

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
            <span>8 Tracing Drills</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-black text-slate-300">
            <Wand2 className="w-4 h-4 text-amber-400" />
            <span>6 Refactors</span>
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
                setReadingAnswer(null);
                setReadingResult(null);
                setActiveModal("reading");
              }}
              className="w-full py-3 px-4 rounded-2xl bg-sky-500 hover:bg-sky-400 active:translate-y-1 border-b-4 border-sky-700 active:border-b-0 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <span>Start Practice</span>
              <span className="text-xs bg-sky-600/40 text-slate-950 px-2 py-0.5 rounded-full">
                +15 XP
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
                setRefactorAnswer(null);
                setRefactorResult(null);
                setActiveModal("refactor");
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
                  {mistakesCount > 30 ? "30+" : mistakesCount}
                </span>
              )}
            </div>

            <p className="text-xs font-bold text-slate-400 leading-relaxed">
              Review and resolve the exact pitfalls and bugs you previously struggled with during lessons.
            </p>

            <button
              type="button"
              onClick={handleOpenMistakesModal}
              className="w-full py-3 px-4 rounded-2xl bg-rose-500 hover:bg-rose-400 active:translate-y-1 border-b-4 border-rose-700 active:border-b-0 text-white font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <span>Review Bugs</span>
              <span className="text-xs bg-rose-600/60 px-2 py-0.5 rounded-full">
                {mistakesCount} Pending
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
                setActiveModal("stories");
              }}
              className="w-full py-3 px-4 rounded-2xl bg-purple-600 hover:bg-purple-500 active:translate-y-1 border-b-4 border-purple-800 active:border-b-0 text-white font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <span>Explore Stories</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {activeModal === "mistakes" && (
          <div className="fixed inset-0 z-50 bg-[#0f172a]/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-xl bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-rose-400" />
                  <h3 className="text-lg font-black text-white">Mistakes Bank</h3>
                  <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {mistakes.length}
                  </span>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center font-black"
                >
                  ✕
                </button>
              </div>

              {mistakes.length === 0 ? (
                <div className="py-12 flex flex-col items-center text-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-3xl">
                    🎉
                  </div>
                  <h4 className="text-lg font-black text-white">Your Bug Bank is Empty!</h4>
                  <p className="text-xs text-slate-400 max-w-xs">
                    You have resolved all previous errors. Solve roadmap lessons to log any new mistakes here.
                  </p>
                </div>
              ) : currentMistake ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                    <span>
                      Bug {selectedMistakeIndex + 1} of {mistakes.length}
                    </span>
                    <span className="text-sky-400">{currentMistake.lesson_title}</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
                    <p className="text-xs font-black text-slate-300">
                      {currentMistake.question_title}
                    </p>
                    {currentMistake.code_snippet && (
                      <pre className="p-3 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono overflow-x-auto border border-slate-800">
                        {currentMistake.code_snippet}
                      </pre>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-800/40 text-rose-300">
                      <div className="flex items-center gap-1 font-black mb-1">
                        <XCircle className="w-3.5 h-3.5 text-rose-400" />
                        <span>Your Answer:</span>
                      </div>
                      <p className="font-mono text-[11px] break-all">{currentMistake.user_answer}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-emerald-300">
                      <div className="flex items-center gap-1 font-black mb-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Correct Answer:</span>
                      </div>
                      <p className="font-mono text-[11px] break-all">{currentMistake.correct_answer}</p>
                    </div>
                  </div>

                  {currentMistake.explanation && (
                    <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 text-xs text-slate-300 leading-relaxed">
                      <strong className="text-amber-400">Explanation: </strong>
                      {currentMistake.explanation}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex gap-2">
                      <button
                        disabled={selectedMistakeIndex === 0}
                        onClick={() => setSelectedMistakeIndex((prev) => prev - 1)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 disabled:opacity-40 text-xs font-bold text-slate-300"
                      >
                        Previous
                      </button>
                      <button
                        disabled={selectedMistakeIndex >= mistakes.length - 1}
                        onClick={() => setSelectedMistakeIndex((prev) => prev + 1)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 disabled:opacity-40 text-xs font-bold text-slate-300"
                      >
                        Next
                      </button>
                    </div>

                    <button
                      type="button"
                      disabled={isResolving}
                      onClick={() => handleResolveMistake(currentMistake)}
                      className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isResolving ? "Resolving..." : "Mark Resolved (+10 XP)"}</span>
                    </button>
                  </div>
                </div>
              ) : null}
            </motion.div>
          </div>
        )}

        {activeModal === "reading" && (
          <div className="fixed inset-0 z-50 bg-[#0f172a]/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-sky-400" />
                  <h3 className="text-lg font-black text-white">Code Reading Drill</h3>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center font-black"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs font-bold text-slate-400">
                What will be printed to the console when the following snippet executes?
              </p>

              <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-sky-300 overflow-x-auto leading-relaxed">
{`function checkScope() {
  if (true) {
    var a = 10;
    let b = 20;
  }
  console.log(a, typeof b);
}
checkScope();`}
              </pre>

              <div className="flex flex-col gap-2 mt-2">
                {[
                  "10 20",
                  "10 undefined",
                  "ReferenceError",
                  "undefined undefined",
                ].map((opt) => {
                  const isSelected = readingAnswer === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => handleCheckReading(opt)}
                      disabled={readingResult !== null}
                      className={`p-3 rounded-xl border text-xs font-mono font-bold text-left transition-all ${
                        isSelected
                          ? readingResult === "correct"
                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                            : "bg-rose-500/20 border-rose-500 text-rose-300"
                          : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {readingResult === "correct" && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Correct! let is block-scoped so typeof b is &apos;undefined&apos;. +15 XP</span>
                </div>
              )}
            </motion.div>
          </div>
        )}

        {activeModal === "refactor" && (
          <div className="fixed inset-0 z-50 bg-[#0f172a]/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-black text-white">Code Refactor Drill</h3>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center font-black"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs font-bold text-slate-400">
                Select the cleanest, most modern ES6+ refactoring for this imperative loop:
              </p>

              <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-amber-300 overflow-x-auto leading-relaxed">
{`// Legacy code
var double = [];
for (var i = 0; i < arr.length; i++) {
  double.push(arr[i] * 2);
}`}
              </pre>

              <div className="flex flex-col gap-2 mt-2">
                {[
                  "const double = arr.map(n => n * 2);",
                  "let double = []; arr.forEach(n => double.push(n * 2));",
                  "const double = arr.filter(n => n * 2);",
                ].map((opt) => {
                  const isSelected = refactorAnswer === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => handleCheckRefactor(opt)}
                      disabled={refactorResult !== null}
                      className={`p-3 rounded-xl border text-xs font-mono font-bold text-left transition-all ${
                        isSelected
                          ? refactorResult === "correct"
                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                            : "bg-rose-500/20 border-rose-500 text-rose-300"
                          : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {refactorResult === "correct" && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Spot on! Array.prototype.map produces a clean, declarative transformation. +20 XP</span>
                </div>
              )}
            </motion.div>
          </div>
        )}

        {activeModal === "stories" && (
          <div className="fixed inset-0 z-50 bg-[#0f172a]/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-black text-white">Code Stories</h3>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center font-black"
                >
                  ✕
                </button>
              </div>

              <div className="flex flex-col gap-3">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-black text-white">Story 1: The Debounce Mystery</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Help an e-commerce search bar prevent flooding the API with keystroke requests.
                    </p>
                  </div>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0">
                    Ready
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4 opacity-75">
                  <div>
                    <h4 className="text-sm font-black text-slate-300">Story 2: The Expired Token</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Implement an automatic JWT refresh interceptor without kicking the user out.
                    </p>
                  </div>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-500 shrink-0">
                    Next Up
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundEffects.playVictory();
                  setToastMessage("Starting Story: The Debounce Mystery!");
                  setTimeout(() => setToastMessage(null), 2500);
                  setActiveModal(null);
                }}
                className="w-full py-3.5 px-6 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
              >
                <span>Begin Story 1</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
