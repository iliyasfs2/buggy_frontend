"use client";

import { useState, useEffect, useMemo, useRef, type ReactElement } from "react";
import { Reorder } from "framer-motion";
import type { StepRendererProps, LineOrderingStep } from "@/types/lesson";
import { shuffleArray } from "@/utils/shuffle";
import {
  CODE_SLOT_CLASSES,
  HEADER_SLOT_CLASSES,
  EYEBROW_SLOT_CLASSES,
  PROMPT_SLOT_CLASSES,
  QUESTION_EYEBROW_CLASSES,
  QUESTION_PROMPT_CLASSES,
  INTERACTIVE_SLOT_CLASSES,
} from "../lessonSlots";

const CAPSULE_CLASSES =
  "px-5 py-3 rounded-xl border-b-4 font-mono text-lg font-bold shadow-sm select-none max-w-full active:translate-y-1 active:border-b-[0px] transition-all duration-75 hover:bg-slate-750";

const ASSEMBLY_BOX_CLASSES =
  "w-full min-h-[56px] mb-4 bg-slate-950/60 rounded-2xl p-3 flex flex-wrap gap-2 items-center text-left transition-all duration-300";

export function LineOrderingRenderer({
  step,
  value,
  onChange,
  isSubmitted,
  isCorrect,
  isShaking
}: StepRendererProps<LineOrderingStep>): ReactElement {
  const [selectedOrder, setSelectedOrder] = useState<number[]>(
    Array.isArray(value) ? value : []
  );
  const draggingRef = useRef(false);
  const dragEndedAtRef = useRef(0);

  const shuffledIndices = useMemo(() => {
    return shuffleArray(step.lines.map((_, i) => i));
  }, [step.lines]);

  useEffect(() => {
    if (Array.isArray(value)) {
      setSelectedOrder(value);
    }
  }, [value]);

  const applyOrder = (next: number[]) => {
    setSelectedOrder(next);
    onChange(next);
  };

  const handleSelectLine = (index: number) => {
    if (isSubmitted) return;
    if (draggingRef.current) return;
    if (performance.now() - dragEndedAtRef.current < 250) return;
    const exists = selectedOrder.includes(index);
    if (exists) {
      applyOrder(selectedOrder.filter((i) => i !== index));
    } else {
      applyOrder([...selectedOrder, index]);
    }
  };

  const handleReorder = (next: number[]) => {
    applyOrder(next);
  };

  const assemblyBoxState = isSubmitted
    ? isCorrect
      ? " border border-emerald-600 bg-emerald-950/20"
      : " border border-rose-600 bg-rose-950/20"
    : isShaking
      ? " border border-rose-600 bg-rose-950/20 ring-1 ring-inset ring-rose-500/50"
      : " border border-slate-700/50";

  return (
    <div className="w-full flex flex-col animate-in fade-in zoom-in-95 duration-200 h-full">
      <div className={HEADER_SLOT_CLASSES}>
        <div className={EYEBROW_SLOT_CLASSES}>
          <p className={QUESTION_EYEBROW_CLASSES}>
            {step.title || "Arrange code blocks"}
          </p>
        </div>
        <div className={PROMPT_SLOT_CLASSES}>
          <h1 className={QUESTION_PROMPT_CLASSES}>
            {step.instruction}
          </h1>
        </div>
      </div>

      <div className={CODE_SLOT_CLASSES} />

      <div className={INTERACTIVE_SLOT_CLASSES}>
        {selectedOrder.length === 0 ? (
          <div dir="ltr" className={`${ASSEMBLY_BOX_CLASSES}${assemblyBoxState}`}>
            <span className="w-full flex items-center justify-center min-h-[40px] text-xs font-mono text-slate-500">
              Tap code blocks below to place them here in order
            </span>
          </div>
        ) : (
          <Reorder.Group
            axis="x"
            values={selectedOrder}
            onReorder={handleReorder}
            dir="ltr"
            className={`${ASSEMBLY_BOX_CLASSES}${assemblyBoxState}`}
          >
            {selectedOrder.map((lineIdx, rank) => {
              let itemStyle = "bg-slate-800 border-slate-700 text-sky-300";
              let animationStyle = "";

              if (isSubmitted) {
                if (isCorrect) {
                  itemStyle = "bg-emerald-950/70 border-emerald-600 text-emerald-200 ring-2 ring-emerald-500";
                  animationStyle = "scale-[1.02] transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-lg shadow-emerald-500/20";
                } else {
                  itemStyle = "bg-rose-950/80 border-rose-600 text-rose-200 ring-2 ring-rose-500";
                }
              } else if (isShaking) {
                itemStyle = "bg-rose-950/80 border-rose-600 text-rose-200 ring-2 ring-rose-500";
                animationStyle = "shadow-[0_0_15px_rgba(225,29,72,0.4)]";
              }

              return (
                <Reorder.Item
                  key={lineIdx}
                  value={lineIdx}
                  onClick={() => handleSelectLine(lineIdx)}
                  onDragStart={() => {
                    draggingRef.current = true;
                  }}
                  onDragEnd={() => {
                    draggingRef.current = false;
                    dragEndedAtRef.current = performance.now();
                  }}
                  whileTap={{ scale: 0.96 }}
                  className={`${CAPSULE_CLASSES} ${itemStyle} ${animationStyle} cursor-pointer`}
                >
                  <span className="truncate">
                    {step.type !== "code_order" && (
                      <span className="text-sky-500 mr-1.5 opacity-80">{rank + 1}.</span>
                    )}
                    {step.lines[lineIdx]}
                  </span>
                </Reorder.Item>
              );
            })}
          </Reorder.Group>
        )}

        <div className="w-full flex flex-wrap items-center justify-center gap-3 mt-auto pt-4">
          {shuffledIndices.map((originalIndex) => {
            const line = step.lines[originalIndex];
            const isPlaced = selectedOrder.includes(originalIndex);

            if (isPlaced) {
              return (
                <div
                  key={`${step.id}-${originalIndex}`}
                  className="max-w-full px-5 py-3 rounded-xl bg-slate-900/40 border-2 border-dashed border-slate-800 font-mono text-lg font-bold select-none"
                >
                  <span className="block truncate invisible">{line}</span>
                </div>
              );
            }

            return (
              <button
                key={`${step.id}-${originalIndex}`}
                type="button"
                disabled={isSubmitted}
                onClick={() => handleSelectLine(originalIndex)}
                className={`${CAPSULE_CLASSES} px-5 py-3 text-lg bg-slate-800 border-slate-700 text-sky-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span className="block truncate">{line}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
