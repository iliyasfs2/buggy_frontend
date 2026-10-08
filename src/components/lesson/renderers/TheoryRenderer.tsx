"use client";

import { useEffect, type ReactElement } from "react";
import type { StepRendererProps, TheoryStep } from "@/types/lesson";
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

export function TheoryRenderer({
  step,
  onChange
}: StepRendererProps<TheoryStep>): ReactElement {
  useEffect(() => {
    onChange(true);
  }, [onChange]);

  return (
    <div className="w-full flex flex-col animate-in fade-in zoom-in-95 duration-200 h-full">
      <div className={HEADER_SLOT_CLASSES}>
        <div className={EYEBROW_SLOT_CLASSES}>
          <p className={QUESTION_EYEBROW_CLASSES}>
            {step.title || "Concept overview"}
          </p>
        </div>
        <div className={PROMPT_SLOT_CLASSES}>
          <h1 className={QUESTION_PROMPT_CLASSES}>
            {step.content}
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

      <div className={INTERACTIVE_SLOT_CLASSES} />
    </div>
  );
}
