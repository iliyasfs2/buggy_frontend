"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Terminal,
  Wand2,
  Layers,
  Check,
  X,
  ArrowRight,
} from "lucide-react";
import type {
  DebugChallengesData,
  OutputLabDrill,
  CleanCodeDrill,
  MiniScenarioDrill,
} from "@/services/debugApi";
import { completeNode, type ProgressData } from "@/services/progressApi";
import { useNavStore } from "@/store/useNavStore";
import { useRoadmapStore } from "@/store/useRoadmapStore";
import { soundEffects } from "@/utils/soundEffects";

export type CuratedDebugMode =
  | "debug_tracing"
  | "debug_refactor"
  | "debug_stories";

interface DebugDrillPlayerProps {
  mode: CuratedDebugMode;
  challenges: DebugChallengesData;
  onComplete: () => void;
  onExit: () => void;
}

const JS_KEYWORDS = new Set([
  "let",
  "const",
  "var",
  "function",
  "return",
  "if",
  "else",
  "for",
  "async",
  "await",
  "catch",
  "true",
  "false",
  "null",
  "undefined",
]);

function renderHighlightedLine(line: string, lineIdx: number) {
  const tokenRegex =
    /(".*?"|'.*?'|`.*?`|\b(?:let|const|var|function|return|if|else|for|async|await|catch|true|false|null|undefined)\b|\b\d+\b|\b(?:console|document|localStorage|window)\b|\b(?:log|map|filter|find|reduce|slice|concat|trim|includes|json|querySelector|addEventListener|toggle|setItem|push)\b)/g;

  const parts = line.split(tokenRegex);

  return (
    <div key={lineIdx} className="leading-relaxed whitespace-pre-wrap break-words">
      {parts.map((part, idx) => {
        if (!part) return null;
        if (
          (part.startsWith('"') && part.endsWith('"')) ||
          (part.startsWith("'") && part.endsWith("'")) ||
          (part.startsWith("`") && part.endsWith("`"))
        ) {
          return (
            <span key={idx} className="text-amber-300">
              {part}
            </span>
          );
        }
        if (JS_KEYWORDS.has(part)) {
          return (
            <span key={idx} className="text-violet-400 font-bold">
              {part}
            </span>
          );
        }
        if (/^\d+$/.test(part)) {
          return (
            <span key={idx} className="text-emerald-300">
              {part}
            </span>
          );
        }
        if (
          part === "console" ||
          part === "document" ||
          part === "localStorage" ||
          part === "window"
        ) {
          return (
            <span key={idx} className="text-sky-300">
              {part}
            </span>
          );
        }
        if (
          [
            "log",
            "map",
            "filter",
            "find",
            "reduce",
            "slice",
            "concat",
            "trim",
            "includes",
            "json",
            "querySelector",
            "addEventListener",
            "toggle",
            "setItem",
            "push",
          ].includes(part)
        ) {
          return (
            <span key={idx} className="text-cyan-300">
              {part}
            </span>
          );
        }
        return (
          <span key={idx} className="text-slate-100">
            {part}
          </span>
        );
      })}
    </div>
  );
}

function SyntaxCodeBlock({ code }: { code: string }) {
  const lines = code.split("\n");
  return (
    <div className="font-mono text-sm sm:text-base leading-relaxed">
      {lines.map((line, idx) => (
        <div key={idx} className="flex items-start gap-3">
          <span className="w-5 text-right text-xs text-slate-600 select-none pt-0.5 shrink-0">
            {idx + 1}
          </span>
          <div className="flex-1 min-w-0">{renderHighlightedLine(line, idx)}</div>
        </div>
      ))}
    </div>
  );
}

function TemplateCodeBlock({
  template,
  selectedOption,
  status,
}: {
  template: string;
  selectedOption: string | null;
  status: "idle" | "correct" | "wrong";
}) {
  const lines = template.split("\n");
  const slotStyle =
    status === "correct"
      ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
      : status === "wrong"
      ? "bg-rose-500/20 border-rose-400 text-rose-300"
      : selectedOption
      ? "bg-sky-500/20 border-sky-400 text-sky-300"
      : "bg-amber-500/15 border-amber-400/70 text-amber-300 animate-pulse";

  return (
    <div className="font-mono text-sm sm:text-base leading-relaxed">
      {lines.map((line, lineIdx) => {
        const segments = line.split("___");
        return (
          <div key={lineIdx} className="flex items-start gap-3 py-0.5">
            <span className="w-5 text-right text-xs text-slate-600 select-none pt-0.5 shrink-0">
              {lineIdx + 1}
            </span>
            <div className="flex-1 min-w-0 whitespace-pre-wrap break-words text-slate-100">
              {segments.map((seg, segIdx) => (
                <React.Fragment key={segIdx}>
                  <span>{seg}</span>
                  {segIdx < segments.length - 1 && (
                    <span
                      className={`inline-flex items-center justify-center px-2.5 py-0.5 mx-1 rounded-lg border-2 font-mono font-black text-xs sm:text-sm transition-all ${slotStyle}`}
                    >
                      {selectedOption || "___"}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function DebugDrillPlayer({
  mode,
  challenges,
  onComplete,
  onExit,
}: DebugDrillPlayerProps) {
  const outputDrills: OutputLabDrill[] = challenges.output_lab || [];
  const cleanDrills: CleanCodeDrill[] = challenges.clean_code || [];
  const scenarioDrills: MiniScenarioDrill[] = challenges.mini_scenarios || [];

  const [drillIndex, setDrillIndex] = useState(0);
  const [scenarioStepIndex, setScenarioStepIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedbackStatus, setFeedbackStatus] = useState<
    "idle" | "correct" | "wrong"
  >("idle");
  const [mistakesCount, setMistakesCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [committedData, setCommittedData] = useState<ProgressData | null>(null);
  const committedRef = useRef(false);

  const totalUnits = useMemo(() => {
    if (mode === "debug_tracing") return outputDrills.length;
    if (mode === "debug_refactor") return cleanDrills.length;
    return scenarioDrills.reduce((acc, s) => acc + s.steps.length, 0);
  }, [mode, outputDrills.length, cleanDrills.length, scenarioDrills]);

  const completedUnits = useMemo(() => {
    if (mode === "debug_tracing" || mode === "debug_refactor") {
      return drillIndex + (feedbackStatus !== "idle" ? 1 : 0);
    }
    let count = 0;
    for (let i = 0; i < drillIndex; i++) {
      count += scenarioDrills[i]?.steps.length || 3;
    }
    count += scenarioStepIndex + (feedbackStatus !== "idle" ? 1 : 0);
    return count;
  }, [mode, drillIndex, scenarioStepIndex, feedbackStatus, scenarioDrills]);

  const progressPercentage =
    totalUnits > 0 ? Math.min(100, Math.round((completedUnits / totalUnits) * 100)) : 0;

  const currentOutputDrill =
    mode === "debug_tracing" ? outputDrills[drillIndex] : null;
  const currentCleanDrill =
    mode === "debug_refactor" ? cleanDrills[drillIndex] : null;
  const currentScenario =
    mode === "debug_stories" ? scenarioDrills[drillIndex] : null;
  const currentScenarioStep =
    currentScenario ? currentScenario.steps[scenarioStepIndex] : null;

  const currentAnswer = useMemo(() => {
    if (mode === "debug_tracing") return currentOutputDrill?.answer || "";
    if (mode === "debug_refactor") return currentCleanDrill?.answer || "";
    return currentScenarioStep?.answer || "";
  }, [mode, currentOutputDrill, currentCleanDrill, currentScenarioStep]);

  const currentExplanation = useMemo(() => {
    if (mode === "debug_tracing") return currentOutputDrill?.explanation || "";
    if (mode === "debug_refactor") return currentCleanDrill?.explanation || "";
    if (currentScenarioStep) {
      return feedbackStatus === "correct"
        ? `Correct! "${currentScenarioStep.answer}" completes Step ${currentScenarioStep.step}.`
        : `The right code is "${currentScenarioStep.answer}".`;
    }
    return "";
  }, [
    mode,
    currentOutputDrill,
    currentCleanDrill,
    currentScenarioStep,
    feedbackStatus,
  ]);

  const handleSelectOption = (option: string) => {
    if (feedbackStatus !== "idle") return;
    setSelectedOption(option);
    const isRight = option.trim() === currentAnswer.trim();
    if (isRight) {
      soundEffects.playCorrect();
      setFeedbackStatus("correct");
      setCorrectCount((prev) => prev + 1);
    } else {
      soundEffects.playIncorrect();
      setFeedbackStatus("wrong");
      setMistakesCount((prev) => prev + 1);
    }
  };

  const handleContinue = () => {
    if (feedbackStatus === "idle") return;

    if (mode === "debug_tracing") {
      if (drillIndex + 1 < outputDrills.length) {
        setDrillIndex((prev) => prev + 1);
        setSelectedOption(null);
        setFeedbackStatus("idle");
      } else {
        soundEffects.playVictory();
        setIsFinished(true);
      }
      return;
    }

    if (mode === "debug_refactor") {
      if (drillIndex + 1 < cleanDrills.length) {
        setDrillIndex((prev) => prev + 1);
        setSelectedOption(null);
        setFeedbackStatus("idle");
      } else {
        soundEffects.playVictory();
        setIsFinished(true);
      }
      return;
    }

    if (mode === "debug_stories" && currentScenario) {
      if (scenarioStepIndex + 1 < currentScenario.steps.length) {
        setScenarioStepIndex((prev) => prev + 1);
        setSelectedOption(null);
        setFeedbackStatus("idle");
      } else if (drillIndex + 1 < scenarioDrills.length) {
        setDrillIndex((prev) => prev + 1);
        setScenarioStepIndex(0);
        setSelectedOption(null);
        setFeedbackStatus("idle");
      } else {
        soundEffects.playVictory();
        setIsFinished(true);
      }
    }
  };

  const rewardXp =
    mode === "debug_stories" ? 30 : mode === "debug_refactor" ? 25 : 20;
  const rewardBytes =
    mode === "debug_stories" ? 30 : mode === "debug_refactor" ? 15 : 10;
  const accuracyPercentage =
    totalUnits > 0
      ? Math.max(0, Math.round(((totalUnits - mistakesCount) / totalUnits) * 100))
      : 100;

  useEffect(() => {
    if (!isFinished || committedRef.current) return;
    committedRef.current = true;

    const nodeId =
      mode === "debug_stories"
        ? "debug-stories"
        : mode === "debug_refactor"
        ? "debug-refactor"
        : "debug-tracing";

    completeNode({
      nodeId,
      earnedXp: rewardXp,
      earnedBytes: rewardBytes,
      flawless: mistakesCount === 0,
      accuracy: accuracyPercentage,
      mode,
    })
      .then((data) => {
        setCommittedData(data);
        useNavStore.getState().syncNav(data);
        useRoadmapStore.getState().syncProgress(data);
      })
      .catch(() => {});
  }, [
    isFinished,
    mode,
    rewardXp,
    rewardBytes,
    mistakesCount,
    accuracyPercentage,
  ]);

  const modeMeta = useMemo(() => {
    if (mode === "debug_tracing") {
      return {
        label: "Output Lab",
        badgeClass: "text-sky-400 bg-sky-500/10 border-sky-500/30",
        Icon: Terminal,
      };
    }
    if (mode === "debug_refactor") {
      return {
        label: "Clean Code",
        badgeClass: "text-violet-400 bg-violet-500/10 border-violet-500/30",
        Icon: Wand2,
      };
    }
    return {
      label: "Mini Scenarios",
      badgeClass: "text-amber-400 bg-amber-500/10 border-amber-500/30",
      Icon: Layers,
    };
  }, [mode]);

  const ModeIcon = modeMeta.Icon;

  if (isFinished) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center p-6 select-none">
        <div className="max-w-md w-full rounded-3xl bg-[#131f24] border-2 border-slate-800 border-b-[5px] border-b-slate-950 p-7 sm:p-8 text-center flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Check className="w-8 h-8" strokeWidth={2} />
          </div>

          <div className="space-y-1.5">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${modeMeta.badgeClass}`}
            >
              <ModeIcon className="w-3.5 h-3.5" strokeWidth={2} />
              <span>{modeMeta.label} Complete</span>
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight pt-1">
              Great Job in Debug Lab
            </h2>
            <p className="text-sm text-slate-400 font-medium">
              You finished all drills and earned your daily rewards.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 w-full">
            <div className="rounded-2xl bg-[#0f172a] border-2 border-slate-800 p-3.5 flex flex-col items-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase">
                XP Earned
              </span>
              <span className="text-lg font-black text-emerald-400 mt-1">
                +{rewardXp} XP
              </span>
            </div>
            <div className="rounded-2xl bg-[#0f172a] border-2 border-slate-800 p-3.5 flex flex-col items-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase">
                Bytes
              </span>
              <span className="text-lg font-black text-sky-400 mt-1">
                +{rewardBytes}
              </span>
            </div>
            <div className="rounded-2xl bg-[#0f172a] border-2 border-slate-800 p-3.5 flex flex-col items-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase">
                Accuracy
              </span>
              <span className="text-lg font-black text-amber-400 mt-1">
                {accuracyPercentage}%
              </span>
            </div>
          </div>

          {committedData?.daily_quests_state && (
            <div className="w-full rounded-2xl bg-[#0f172a] border border-slate-800 px-4 py-3 text-left">
              <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                Daily Quests Progress
              </div>
              <div className="space-y-2">
                {committedData.daily_quests_state.slice(0, 3).map((q) => {
                  const done = q.current >= q.target;
                  return (
                    <div
                      key={q.id}
                      className="flex items-center justify-between text-xs font-bold"
                    >
                      <span
                        className={
                          done ? "text-emerald-400" : "text-slate-300"
                        }
                      >
                        {q.title}
                      </span>
                      <span
                        className={
                          done ? "text-emerald-400" : "text-slate-400"
                        }
                      >
                        {Math.min(q.current, q.target)}/{q.target}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={onComplete}
            className="w-full py-3.5 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm border-b-[5px] border-emerald-700 hover:translate-y-[2px] hover:border-b-[3px] active:translate-y-[4px] active:border-b-[1px] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Back to Debug Lab</span>
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col justify-between select-none">
      <header className="w-full border-b border-slate-800/80 bg-[#131f24]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          <button
            type="button"
            onClick={onExit}
            aria-label="Exit drill"
            className="w-10 h-10 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 border-b-[3px] border-b-slate-950 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>

          <div
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-extrabold shrink-0 ${modeMeta.badgeClass}`}
          >
            <ModeIcon className="w-4 h-4" strokeWidth={2} />
            <span>{modeMeta.label}</span>
          </div>

          <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700/60">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <div className="text-xs sm:text-sm font-black text-slate-300 font-mono shrink-0">
            {mode === "debug_stories"
              ? `Scenario ${drillIndex + 1}/${scenarioDrills.length}`
              : `${drillIndex + 1}/${
                  mode === "debug_tracing"
                    ? outputDrills.length
                    : cleanDrills.length
                }`}
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col justify-center max-w-2xl w-full mx-auto px-4 sm:px-6 py-6">
        {mode === "debug_tracing" && currentOutputDrill && (
          <div className="space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
                <Terminal className="w-5 h-5" strokeWidth={2} />
              </div>
              <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
                What appears in the console?
              </h1>
            </div>

            <div className="rounded-2xl bg-[#131f24] border-2 border-slate-800 border-b-[5px] border-b-slate-950 overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <Terminal className="w-3.5 h-3.5 text-sky-400" strokeWidth={2} />
                  <span>console.js</span>
                </div>
                <span className="text-[11px] font-bold text-slate-500 uppercase">
                  Drill {drillIndex + 1} of {outputDrills.length}
                </span>
              </div>
              <div className="p-4 sm:p-5">
                <SyntaxCodeBlock code={currentOutputDrill.code} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {currentOutputDrill.options.map((option, idx) => {
                const isSelected = selectedOption === option;
                const isAnswer = option === currentOutputDrill.answer;

                let btnClass =
                  "bg-[#131f24] hover:bg-slate-800/80 border-slate-700 border-b-slate-950 text-slate-100";
                if (feedbackStatus !== "idle") {
                  if (isAnswer) {
                    btnClass =
                      "bg-emerald-500/15 border-emerald-500 border-b-emerald-700 text-emerald-300";
                  } else if (isSelected && feedbackStatus === "wrong") {
                    btnClass =
                      "bg-rose-500/15 border-rose-500 border-b-rose-700 text-rose-300";
                  } else {
                    btnClass =
                      "bg-[#131f24] border-slate-800 border-b-slate-950 text-slate-500 opacity-60";
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={feedbackStatus !== "idle"}
                    onClick={() => handleSelectOption(option)}
                    className={`w-full p-4 rounded-2xl border-2 border-b-[5px] font-mono text-sm sm:text-base font-bold text-left flex items-center justify-between gap-3 transition-all ${
                      feedbackStatus === "idle"
                        ? "hover:translate-y-[2px] hover:border-b-[3px] active:translate-y-[4px] active:border-b-[1px] cursor-pointer"
                        : "cursor-default"
                    } ${btnClass}`}
                  >
                    <span className="truncate">{option}</span>
                    {feedbackStatus !== "idle" && isAnswer && (
                      <Check
                        className="w-5 h-5 text-emerald-400 shrink-0"
                        strokeWidth={2}
                      />
                    )}
                    {feedbackStatus === "wrong" && isSelected && !isAnswer && (
                      <X
                        className="w-5 h-5 text-rose-400 shrink-0"
                        strokeWidth={2}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {mode === "debug_refactor" && currentCleanDrill && (
          <div className="space-y-5">
            <div className="rounded-2xl bg-amber-950/15 border-2 border-amber-500/40 border-b-[5px] border-b-amber-950/80 overflow-hidden">
              <div className="px-4 py-2.5 bg-amber-500/10 border-b border-amber-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-extrabold text-amber-300 uppercase tracking-wider">
                  <Wand2 className="w-4 h-4 text-amber-400" strokeWidth={2} />
                  <span>Messy Code</span>
                </div>
                <span className="text-[11px] font-bold text-amber-300/70">
                  Drill {drillIndex + 1} of {cleanDrills.length}
                </span>
              </div>
              <div className="p-4 sm:p-5">
                <SyntaxCodeBlock code={currentCleanDrill.messy_code} />
              </div>
            </div>

            <div className="pt-1">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-100">
                {currentCleanDrill.prompt}
              </h2>
            </div>

            <div className="space-y-3">
              {currentCleanDrill.options.map((option, idx) => {
                const isSelected = selectedOption === option;
                const isAnswer = option === currentCleanDrill.answer;

                let cardClass =
                  "bg-[#131f24] hover:bg-slate-800/80 border-slate-700 border-b-slate-950 text-slate-100";
                if (feedbackStatus !== "idle") {
                  if (isAnswer) {
                    cardClass =
                      "bg-emerald-500/15 border-emerald-500 border-b-emerald-700 text-emerald-300";
                  } else if (isSelected && feedbackStatus === "wrong") {
                    cardClass =
                      "bg-rose-500/15 border-rose-500 border-b-rose-700 text-rose-300";
                  } else {
                    cardClass =
                      "bg-[#131f24] border-slate-800 border-b-slate-950 text-slate-500 opacity-60";
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={feedbackStatus !== "idle"}
                    onClick={() => handleSelectOption(option)}
                    className={`w-full p-4 rounded-2xl border-2 border-b-[5px] font-mono text-xs sm:text-sm font-bold text-left flex items-center justify-between gap-3 transition-all ${
                      feedbackStatus === "idle"
                        ? "hover:translate-y-[2px] hover:border-b-[3px] active:translate-y-[4px] active:border-b-[1px] cursor-pointer"
                        : "cursor-default"
                    } ${cardClass}`}
                  >
                    <span className="whitespace-pre-wrap break-words leading-relaxed">
                      {option}
                    </span>
                    {feedbackStatus !== "idle" && isAnswer && (
                      <Check
                        className="w-5 h-5 text-emerald-400 shrink-0"
                        strokeWidth={2}
                      />
                    )}
                    {feedbackStatus === "wrong" && isSelected && !isAnswer && (
                      <X
                        className="w-5 h-5 text-rose-400 shrink-0"
                        strokeWidth={2}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {mode === "debug_stories" &&
          currentScenario &&
          currentScenarioStep && (
            <div className="space-y-6">
              <div className="rounded-2xl bg-[#131f24] border-2 border-slate-800 p-4 sm:p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                      <Layers className="w-5 h-5" strokeWidth={2} />
                    </div>
                    <div>
                      <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
                        {currentScenario.title}
                      </h1>
                      <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
                        {currentScenario.subtitle}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-extrabold shrink-0">
                    Step {currentScenarioStep.step} of{" "}
                    {currentScenario.steps.length}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {currentScenario.steps.map((s, idx) => {
                    const isDone =
                      idx < scenarioStepIndex ||
                      (idx === scenarioStepIndex &&
                        feedbackStatus === "correct");
                    const isCurrent = idx === scenarioStepIndex;
                    return (
                      <div
                        key={s.step}
                        className={`h-2 rounded-full transition-all ${
                          isDone
                            ? "bg-emerald-500"
                            : isCurrent
                            ? "bg-amber-400"
                            : "bg-slate-800"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-base sm:text-lg font-extrabold text-slate-100">
                  {currentScenarioStep.instruction}
                </h2>

                <div className="rounded-2xl bg-[#131f24] border-2 border-slate-800 border-b-[5px] border-b-slate-950 p-4 sm:p-5">
                  <TemplateCodeBlock
                    template={currentScenarioStep.code_template}
                    selectedOption={selectedOption}
                    status={feedbackStatus}
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                  Choose a code pill to fill the blank:
                </span>
                <div className="grid grid-cols-3 gap-3">
                  {currentScenarioStep.options.map((option, idx) => {
                    const isSelected = selectedOption === option;
                    const isAnswer = option === currentScenarioStep.answer;

                    let pillClass =
                      "bg-[#131f24] hover:bg-slate-800 border-slate-700 border-b-slate-950 text-slate-100";
                    if (feedbackStatus !== "idle") {
                      if (isAnswer) {
                        pillClass =
                          "bg-emerald-500/15 border-emerald-500 border-b-emerald-700 text-emerald-300";
                      } else if (isSelected && feedbackStatus === "wrong") {
                        pillClass =
                          "bg-rose-500/15 border-rose-500 border-b-rose-700 text-rose-300";
                      } else {
                        pillClass =
                          "bg-[#131f24] border-slate-800 border-b-slate-950 text-slate-500 opacity-60";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={feedbackStatus !== "idle"}
                        onClick={() => handleSelectOption(option)}
                        className={`py-3.5 px-4 rounded-2xl border-2 border-b-[5px] font-mono text-sm sm:text-base font-black flex items-center justify-center gap-2 transition-all ${
                          feedbackStatus === "idle"
                            ? "hover:translate-y-[2px] hover:border-b-[3px] active:translate-y-[4px] active:border-b-[1px] cursor-pointer"
                            : "cursor-default"
                        } ${pillClass}`}
                      >
                        <span>{option}</span>
                        {feedbackStatus !== "idle" && isAnswer && (
                          <Check
                            className="w-4 h-4 text-emerald-400 shrink-0"
                            strokeWidth={2}
                          />
                        )}
                        {feedbackStatus === "wrong" &&
                          isSelected &&
                          !isAnswer && (
                            <X
                              className="w-4 h-4 text-rose-400 shrink-0"
                              strokeWidth={2}
                            />
                          )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
      </main>

      <footer
        className={`w-full border-t-2 transition-colors ${
          feedbackStatus === "correct"
            ? "bg-emerald-950/40 border-emerald-500/40"
            : feedbackStatus === "wrong"
            ? "bg-rose-950/40 border-rose-500/40"
            : "bg-[#131f24] border-slate-800"
        }`}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 min-h-[84px]">
          {feedbackStatus !== "idle" ? (
            <>
              <div className="flex items-start sm:items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border-2 ${
                    feedbackStatus === "correct"
                      ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                      : "bg-rose-500/20 border-rose-500/50 text-rose-400"
                  }`}
                >
                  {feedbackStatus === "correct" ? (
                    <Check className="w-5 h-5" strokeWidth={2} />
                  ) : (
                    <X className="w-5 h-5" strokeWidth={2} />
                  )}
                </div>
                <div className="min-w-0">
                  <div
                    className={`text-sm font-black ${
                      feedbackStatus === "correct"
                        ? "text-emerald-400"
                        : "text-rose-400"
                    }`}
                  >
                    {feedbackStatus === "correct"
                      ? "Correct Answer"
                      : "Not Quite Right"}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 font-medium mt-0.5">
                    {currentExplanation}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleContinue}
                className={`w-full sm:w-auto px-7 py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 border-b-[5px] hover:translate-y-[2px] hover:border-b-[3px] active:translate-y-[4px] active:border-b-[1px] transition-all cursor-pointer shrink-0 ${
                  feedbackStatus === "correct"
                    ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 border-emerald-700"
                    : "bg-rose-500 hover:bg-rose-400 text-white border-rose-700"
                }`}
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" strokeWidth={2} />
              </button>
            </>
          ) : (
            <div className="flex items-center justify-between w-full text-xs sm:text-sm font-bold text-slate-400">
              <span>Select an option above to check your answer.</span>
              <span className="font-mono text-slate-500">
                +{rewardXp} XP / +{rewardBytes} Bytes
              </span>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
