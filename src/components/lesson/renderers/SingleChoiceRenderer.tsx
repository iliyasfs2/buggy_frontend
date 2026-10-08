"use client";

import { useMemo, type ReactElement } from "react";
import type { StepRendererProps, SingleChoiceStep } from "@/types/lesson";
import { shuffleArray } from "@/utils/shuffle";
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

export function SingleChoiceRenderer({
  step,
  value,
  onChange,
  isSubmitted,
  isCorrect,
  isShaking
}: StepRendererProps<SingleChoiceStep>): ReactElement {
  const shuffledOptions = useMemo(() => {
    return shuffleArray(step.options);
  }, [step.options]);

  const selectedValue = typeof value === "string" ? value : typeof value === "number" ? step.options[value] : null;

  return (
    <div className="w-full flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-200 ease-out h-full">
      <div className={HEADER_SLOT_CLASSES}>
        <div className={EYEBROW_SLOT_CLASSES}>
          <p className={QUESTION_EYEBROW_CLASSES}>
            {step.title || "Read and respond"}
          </p>
        </div>
        <div className={PROMPT_SLOT_CLASSES}>
          <h1 className={QUESTION_PROMPT_CLASSES}>
            {step.question}
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
                className={`w-full rounded-2xl py-2.5 sm:py-3.5 px-3 sm:px-4 flex items-center gap-2 sm:gap-3 font-mono select-none cursor-pointer ${btnStyle} ${animationStyle}`}
              >
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 text-xs sm:text-sm flex items-center justify-center font-mono shrink-0">
                  {index + 1}
                </span>
                <span className="flex-1 text-center text-base sm:text-lg font-bold text-slate-100 leading-tight">
                  {option}
                </span>
                <div className="w-7 sm:w-8 shrink-0" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
