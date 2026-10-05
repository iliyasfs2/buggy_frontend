"use client";

import type { ReactElement } from "react";
import type { Chapter } from "@/types/roadmap";
import { BookOpen } from "lucide-react";

export interface ChapterHeaderProps {
  chapter: Chapter;
  onOpenGuidebook?: (chapter: Chapter) => void;
}

export function ChapterHeader({
  chapter,
  onOpenGuidebook
}: ChapterHeaderProps): ReactElement {
  return (
    <div className="w-full max-w-xl mx-auto mb-8 rounded-2xl bg-slate-900 border-2 border-slate-700/80 p-5 shadow-xl select-none">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full text-slate-950 font-mono"
              style={{ backgroundColor: chapter.themeColor }}
            >
              Chapter {chapter.chapterNumber}
            </span>
            <span className="text-xs font-mono uppercase text-slate-400">
              {chapter.language}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
            {chapter.title}
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
            {chapter.description}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onOpenGuidebook?.(chapter)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:translate-y-0.5 border-b-4 border-slate-950 hover:border-slate-900 text-xs font-bold text-slate-200 transition-all shrink-0 cursor-pointer"
          title="Open Chapter Guidebook"
        >
          <BookOpen className="w-4 h-4 text-sky-400" />
          <span className="hidden sm:inline font-mono">Guidebook</span>
        </button>
      </div>
    </div>
  );
}
