"use client";

import type { ReactElement } from "react";
import type { Chapter } from "@/types/roadmap";
import { X, BookOpen, CheckCircle2 } from "lucide-react";

export interface PathGuidebookModalProps {
  chapter: Chapter | null;
  onClose: () => void;
}

export function PathGuidebookModal({
  chapter,
  onClose
}: PathGuidebookModalProps): ReactElement | null {
  if (!chapter) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${chapter.title} Guidebook`}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl bg-[#1e293b] border-2 border-slate-700 shadow-2xl p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-slate-700/80 pb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-950 shadow"
              style={{ backgroundColor: chapter.themeColor }}
            >
              <BookOpen className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase font-bold text-slate-400">
                Chapter {chapter.chapterNumber} Guidebook
              </span>
              <h3 className="text-xl font-black text-slate-100">
                {chapter.title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close guidebook"
            className="p-2 rounded-full text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {chapter.description}
        </p>

        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-sky-400">
            Key Concepts
          </h4>

          <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-2.5">
            <div className="flex items-start gap-2.5 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Declare immutable bindings with <code className="text-sky-300 font-mono">const</code> and mutable state with <code className="text-sky-300 font-mono">let</code>.</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Strict equality checks (<code className="text-sky-300 font-mono">===</code>) avoid implicit type coercion bugs.</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Branch execution using clear guards before complex logic blocks.</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full mt-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 active:translate-y-0.5 border-b-4 border-slate-950 text-xs font-bold text-slate-200 uppercase tracking-wider transition-all cursor-pointer"
        >
          Got It
        </button>
      </div>
    </div>
  );
}
