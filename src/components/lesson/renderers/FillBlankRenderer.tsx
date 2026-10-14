"use client";

import { useMemo, type ReactElement } from "react";
import type { StepRendererProps, FillBlankStep } from "@/types/lesson";
import { shuffleArray } from "@/utils/shuffle";
import {
  CODE_SLOT_CLASSES,
  HEADER_SLOT_CLASSES,
  EYEBROW_SLOT_CLASSES,
  PROMPT_SLOT_CLASSES,
  INTERACTIVE_SLOT_CLASSES,
  QUESTION_EYEBROW_CLASSES,
  QUESTION_PROMPT_CLASSES
} from "../lessonSlots";

export function FillBlankRenderer({
  step,
  value,
  onChange,
  isSubmitted,
  isCorrect,
  isShaking
}: StepRendererProps<FillBlankStep>): ReactElement {
  const answer = typeof value === "string" ? value : "";

  const shuffledOptions = useMemo(() => {
    return step.options && step.options.length > 0 ? shuffleArray(step.options) : [];
  }, [step.options]);

  const parts = step.codeTemplate.split(/_{3,}/);

  return (
    <div className="w-full flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-200 ease-out h-full">
      <div className={HEADER_SLOT_CLASSES}>
        <div className={EYEBROW_SLOT_CLASSES}>
          <p className={QUESTION_EYEBROW_CLASSES}>
            {step.title || "Fill in the blank"}
          </p>
        </div>
        <div className={PROMPT_SLOT_CLASSES}>
          <h1 className={QUESTION_PROMPT_CLASSES}>
            {step.instruction}
          </h1>
        </div>
      </div>

      <div className={CODE_SLOT_CLASSES}>
        <div
          dir="ltr"
          className="w-full p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center gap-2 font-mono text-lg text-sky-300 shadow-inner"
        >
          <span>{parts[0]}</span>
          <input
            type="text"
            value={answer}
            onChange={(event) => onChange(event.target.value)}
            placeholder="?"
            aria-label="Fill in the blank answer"
            autoFocus
            disabled={isSubmitted && isCorrect}
            className="w-24 px-3 py-1.5 text-center bg-slate-950 border-b-2 border-sky-500 rounded-lg text-sky-400 font-bold outline-none select-text placeholder:text-slate-600 disabled:opacity-70 focus:ring-2 focus:ring-sky-500/50 transition-all duration-300"
          />
          {parts[1] && <span>{parts[1]}</span>}
        </div>
      </div>

      <div className={INTERACTIVE_SLOT_CLASSES}>
        {shuffledOptions.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
            {shuffledOptions.map((option) => {
              const isChosen = answer === option;
              let chipStyle = "border-b-4 border-slate-700 bg-slate-800 text-slate-200";
              let animationStyle = "active:translate-y-1 active:border-b-[0px] transition-all duration-75";

              if (isChosen) {
                if (isSubmitted) {
                  if (isCorrect) {
                    chipStyle = "border-b-4 border-emerald-600 bg-emerald-950/70 text-emerald-200 ring-2 ring-emerald-500";
                    animationStyle = "scale-[1.05] transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-lg shadow-emerald-500/20";
                  } else {
                    chipStyle = "border-b-4 border-rose-600 bg-rose-950/70 text-rose-200 ring-2 ring-rose-500";
                  }
                } else if (isShaking) {
                  chipStyle = "border-b-4 border-rose-600 bg-rose-950/70 text-rose-200 ring-2 ring-rose-500";
                  animationStyle = "shadow-[0_0_15px_rgba(225,29,72,0.4)]";
                } else {
                  chipStyle = "border-b-4 border-sky-600 bg-sky-950/60 text-sky-200 ring-2 ring-sky-500";
                }
              }

              return (
                <button
                  key={`${step.id}-${option}`}
                  type="button"
                  disabled={isSubmitted && isCorrect}
                  onClick={() => onChange(isChosen ? "" : option)}
                  className={`px-4 py-2.5 sm:px-5 sm:py-3.5 rounded-xl font-mono text-base sm:text-lg font-bold select-none cursor-pointer ${chipStyle} ${animationStyle}`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
