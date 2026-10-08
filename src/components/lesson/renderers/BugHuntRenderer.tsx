"use client";

import { useMemo, type ReactElement } from "react";
import type { StepRendererProps, BugHuntStep } from "@/types/lesson";
import { shuffleArray } from "@/utils/shuffle";
import { AlertCircle } from "lucide-react";
import {
  CODE_PANEL_CLASSES,
  CODE_SLOT_CLASSES,
  HEADER_SLOT_CLASSES,
  EYEBROW_SLOT_CLASSES,
  PROMPT_SLOT_CLASSES,
  INTERACTIVE_SLOT_CLASSES,
  QUESTION_EYEBROW_CLASSES,
  QUESTION_PROMPT_CLASSES
} from "../lessonSlots";

export function BugHuntRenderer({
  step,
  value,
  onChange,
  isSubmitted,
  isCorrect,
  isShaking
}: StepRendererProps<BugHuntStep>): ReactElement {
  const shuffledOptions = useMemo(() => {
    return step.options && step.options.length > 0 ? shuffleArray(step.options) : [];
  }, [step.options]);

  const selectedValue = typeof value === "string" ? value : typeof value === "number" && step.options ? step.options[value] : null;
  const selectedIndex = typeof value === "number" ? value : null;

  return (
    <div className="w-full flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-200 ease-out h-full">
      <div className={HEADER_SLOT_CLASSES}>
        <div className={EYEBROW_SLOT_CLASSES}>
          <p className={QUESTION_EYEBROW_CLASSES}>
            {step.title || "Fix the bug"}
          </p>
        </div>
        <div className={PROMPT_SLOT_CLASSES}>
          <h1 className={QUESTION_PROMPT_CLASSES}>
            {step.instruction}
          </h1>
        </div>
      </div>

      <div className={CODE_SLOT_CLASSES}>
        {step.codeSnippet ? (
          <div dir="ltr" className={CODE_PANEL_CLASSES}>
            <pre className="w-full text-center overflow-x-auto flex items-center justify-center">
              <code>{step.codeSnippet}</code>
            </pre>
          </div>
        ) : null}
      </div>

      <div className={INTERACTIVE_SLOT_CLASSES}>
        {shuffledOptions.length > 0 ? (
          <div className="flex flex-col gap-2.5 w-full">
            {shuffledOptions.map((option, index) => {
              const isSelected = selectedValue === option;
              let btnStyle = "border-2 border-b-4 border-slate-800 bg-slate-900/40 hover:bg-slate-800/40 text-slate-200";
              let animationStyle = "active:translate-y-1 active:border-b-[0px] transition-all duration-75";

              if (isSelected) {
                if (isSubmitted) {
                  if (isCorrect) {
                    btnStyle = "border-2 border-b-4 border-emerald-600 bg-emerald-950/70 text-emerald-200 ring-2 ring-emerald-500";
                    animationStyle = "scale-[1.02] transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-lg shadow-emerald-500/20";
                  } else {
                    btnStyle = "border-2 border-b-4 border-rose-600 bg-rose-950/70 text-rose-200 ring-2 ring-rose-500";
                  }
                } else if (isShaking) {
                  btnStyle = "border-2 border-b-4 border-rose-600 bg-rose-950/70 text-rose-200 ring-2 ring-rose-500";
                  animationStyle = "shadow-[0_0_15px_rgba(225,29,72,0.4)]";
                } else {
                  btnStyle = "border-2 border-b-4 border-sky-600 bg-sky-950/60 text-sky-200 ring-2 ring-sky-500";
                }
              }

              return (
                <button
                  key={`${step.id}-${option}`}
                  type="button"
                  disabled={isSubmitted && isCorrect}
                  onClick={() => onChange(option)}
                  className={`w-full rounded-2xl py-3.5 px-4 flex items-center gap-3 font-mono select-none cursor-pointer ${btnStyle} ${animationStyle}`}
                >
                  <span className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 text-sm flex items-center justify-center font-mono shrink-0">
                    {index + 1}
                  </span>
                  <span className="flex-1 text-center text-lg font-bold text-slate-100">
                    {option}
                  </span>
                  <div className="w-8 shrink-0" />
                </button>
              );
            })}
          </div>
        ) : step.codeLines && step.codeLines.length > 0 ? (
          <div dir="ltr" className="w-full rounded-2xl bg-[#0b1329] border-2 border-slate-700/80 shadow-lg overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-800/80 border-b border-slate-700/80 text-xs font-mono text-slate-400">
              <span>bug_inspection.js</span>
              <span className="text-[11px] uppercase tracking-wider text-rose-400 font-bold">Tap the error line</span>
            </div>

            <div className="flex flex-col py-2">
              {step.codeLines.map((line, index) => {
                const isSelected = selectedIndex === index;
                let rowStyle = "hover:bg-slate-800/60 text-slate-300";

                if (isSelected) {
                  if (isSubmitted) {
                    rowStyle = isCorrect
                      ? "bg-emerald-950/80 border-y border-emerald-500 text-emerald-200"
                      : "bg-rose-950/80 border-y border-rose-500 text-rose-200";
                  } else if (isShaking) {
                    rowStyle = "bg-rose-950/80 border-y border-rose-500 text-rose-200";
                  } else {
                    rowStyle = "bg-sky-950/60 border-y border-sky-500 text-sky-200 ring-1 ring-inset ring-sky-500/50";
                  }
                }

                return (
                  <button
                    key={index}
                    type="button"
                    disabled={isSubmitted}
                    onClick={() => onChange(index)}
                    className={`w-full text-left px-4 py-2.5 font-mono text-sm sm:text-base flex items-center gap-4 transition-colors cursor-pointer ${rowStyle}`}
                  >
                    <span className="w-6 text-right text-xs font-mono text-slate-500 select-none shrink-0">
                      {index + 1}
                    </span>
                    <span className="flex-1 min-w-0 truncate">{line}</span>
                    {isSelected && !isSubmitted && (
                      <AlertCircle className="w-4 h-4 text-sky-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
