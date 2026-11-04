"use client";

import React from "react";
import { Trophy } from "lucide-react";
import type { CourseMasteryItem } from "@/services/progressApi";

interface LanguageVisualMeta {
  barGradient: string;
  percentText: string;
  renderIcon: (compact?: boolean) => React.ReactNode;
}

function getLanguageVisualMeta(courseId: string, shortLabel?: string): LanguageVisualMeta {
  const key = (courseId || "").toLowerCase().trim();
  const sizeClass = (compact?: boolean) => (compact ? "w-5 h-5" : "w-5 h-5 sm:w-6 sm:h-6");

  if (key === "javascript" || key === "js") {
    return {
      barGradient: "from-amber-400 to-amber-500",
      percentText: "text-amber-400",
      renderIcon: (compact) => (
        <img
          src="/icons/js-badge.png"
          alt="JavaScript"
          className={`${sizeClass(compact)} object-contain shrink-0`}
        />
      ),
    };
  }

  if (key === "python" || key === "py") {
    return {
      barGradient: "from-sky-400 via-blue-500 to-amber-400",
      percentText: "text-sky-300",
      renderIcon: (compact) => (
        <div
          className={`${sizeClass(compact)} rounded-md bg-slate-950 border border-sky-500/40 flex items-center justify-center shrink-0`}
        >
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" aria-hidden="true">
            <path
              fill="#38BDF8"
              d="M11.9 2C7.8 2 8.1 3.8 8.1 3.8V6h3.9v.7H6.5S4 6.4 4 10.2c0 3.8 2.2 3.7 2.2 3.7h1.3v-1.8s-.1-2.2 2.1-2.2h3.8s2 .1 2-1.9V4.2S15.7 2 11.9 2zm-2 1.3a.7.7 0 1 1 0 1.4.7.7 0 0 1 0-1.4z"
            />
            <path
              fill="#FBBF24"
              d="M12.1 22c4.1 0 3.8-1.8 3.8-1.8V18H12v-.7h5.5S20 17.6 20 13.8c0-3.8-2.2-3.7-2.2-3.7h-1.3v1.8s.1 2.2-2.1 2.2h-3.8s-2-.1-2 1.9v3.8S8.3 22 12.1 22zm2-1.3a.7.7 0 1 1 0-1.4.7.7 0 0 1 0 1.4z"
            />
          </svg>
        </div>
      ),
    };
  }

  if (key === "typescript" || key === "ts") {
    return {
      barGradient: "from-blue-500 to-sky-400",
      percentText: "text-sky-300",
      renderIcon: (compact) => (
        <span
          className={`${sizeClass(compact)} rounded-md bg-[#3178C6] text-white text-[10px] font-black inline-flex items-center justify-center shrink-0 shadow-sm`}
        >
          TS
        </span>
      ),
    };
  }

  if (key === "react") {
    return {
      barGradient: "from-cyan-400 to-sky-500",
      percentText: "text-cyan-300",
      renderIcon: (compact) => (
        <div
          className={`${sizeClass(compact)} rounded-md bg-cyan-950/80 border border-cyan-400/40 flex items-center justify-center shrink-0`}
        >
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <circle cx="12" cy="12" r="1.8" fill="currentColor" />
            <ellipse cx="12" cy="12" rx="9" ry="3.8" />
            <ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(60 12 12)" />
            <ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(120 12 12)" />
          </svg>
        </div>
      ),
    };
  }

  if (key === "cpp" || key === "c++") {
    return {
      barGradient: "from-indigo-400 to-blue-500",
      percentText: "text-indigo-300",
      renderIcon: (compact) => (
        <span
          className={`${sizeClass(compact)} rounded-md bg-indigo-600 text-white text-[9px] font-black inline-flex items-center justify-center shrink-0`}
        >
          C++
        </span>
      ),
    };
  }

  if (key === "go" || key === "golang") {
    return {
      barGradient: "from-teal-400 to-cyan-400",
      percentText: "text-teal-300",
      renderIcon: (compact) => (
        <span
          className={`${sizeClass(compact)} rounded-md bg-teal-600 text-white text-[9px] font-black inline-flex items-center justify-center shrink-0`}
        >
          GO
        </span>
      ),
    };
  }

  if (key === "rust") {
    return {
      barGradient: "from-orange-400 to-amber-500",
      percentText: "text-orange-300",
      renderIcon: (compact) => (
        <span
          className={`${sizeClass(compact)} rounded-md bg-orange-600 text-white text-[9px] font-black inline-flex items-center justify-center shrink-0`}
        >
          RS
        </span>
      ),
    };
  }

  const label = (shortLabel || courseId || "</>").slice(0, 3).toUpperCase();
  return {
    barGradient: "from-purple-400 to-pink-500",
    percentText: "text-purple-300",
    renderIcon: (compact) => (
      <span
        className={`${sizeClass(compact)} rounded-md bg-purple-600 text-white text-[9px] font-black inline-flex items-center justify-center shrink-0`}
      >
        {label}
      </span>
    ),
  };
}

export interface CourseMasterySectionProps {
  courses?: CourseMasteryItem[];
  fallbackMasteryPercent?: number;
}

export function CourseMasterySection({
  courses,
  fallbackMasteryPercent = 0,
}: CourseMasterySectionProps) {
  const normalized: CourseMasteryItem[] =
    Array.isArray(courses) && courses.length > 0
      ? courses.map((c) => {
          const pct = Math.min(100, Math.max(0, Math.round(Number(c.percent) || 0)));
          return {
            ...c,
            percent: pct,
            isCompleted: Boolean(c.isCompleted || pct >= 100),
          };
        })
      : [
          {
            id: "javascript",
            title: "JavaScript",
            shortLabel: "JS",
            percent: Math.min(100, Math.max(0, Math.round(Number(fallbackMasteryPercent) || 0))),
            isCompleted: Number(fallbackMasteryPercent) >= 100,
          },
        ];

  if (normalized.length === 1) {
    const item = normalized[0];
    const meta = getLanguageVisualMeta(item.id, item.shortLabel);
    const completed = Boolean(item.isCompleted || item.percent >= 100);

    return (
      <div
        className={`p-3 sm:p-3.5 rounded-2xl flex flex-col gap-2 shrink-0 transition-colors ${
          completed
            ? "bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-amber-500/10 border border-emerald-400/50 shadow-[0_0_22px_rgba(16,185,129,0.14)]"
            : "bg-slate-900/85 border border-slate-800 shadow-sm"
        }`}
      >
        <div className="flex items-center justify-between gap-2 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            {meta.renderIcon(false)}
            <span className="text-xs sm:text-base font-black text-white truncate">
              {item.title}
            </span>
          </div>

          {completed ? (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-[10px] sm:text-xs font-black uppercase tracking-wider inline-flex items-center gap-1 shrink-0">
              <Trophy className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>Completed • 100%</span>
            </span>
          ) : (
            <span
              className={`text-xs sm:text-sm font-black font-mono shrink-0 ${
                item.percent > 0 ? meta.percentText : "text-slate-400"
              }`}
            >
              {item.percent}%
            </span>
          )}
        </div>

        <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              completed
                ? "bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400"
                : `bg-gradient-to-r ${meta.barGradient}`
            }`}
            style={{ width: `${completed ? 100 : item.percent}%` }}
          />
        </div>
      </div>
    );
  }

  const visibleItems = normalized.slice(0, 4);
  const gridColsClass =
    visibleItems.length === 2
      ? "grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5"
      : visibleItems.length === 3
      ? "grid-cols-1 sm:grid-cols-3 gap-2"
      : "grid-cols-2 sm:grid-cols-4 gap-2";

  return (
    <div className={`grid ${gridColsClass} shrink-0`}>
      {visibleItems.map((item) => {
        const meta = getLanguageVisualMeta(item.id, item.shortLabel);
        const completed = Boolean(item.isCompleted || item.percent >= 100);
        const displayLabel =
          visibleItems.length >= 4 ? item.shortLabel || item.title : item.title;

        return (
          <div
            key={item.id}
            className={`p-2.5 sm:p-3 rounded-2xl flex flex-col gap-2 min-w-0 transition-colors ${
              completed
                ? "bg-gradient-to-br from-emerald-500/15 via-slate-900/90 to-amber-500/10 border border-emerald-400/50 shadow-[0_0_16px_rgba(16,185,129,0.12)]"
                : "bg-slate-900/85 border border-slate-800 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between gap-1.5 min-w-0">
              <div className="flex items-center gap-1.5 min-w-0">
                {meta.renderIcon(true)}
                <span className="text-xs sm:text-sm font-black text-white truncate">
                  {displayLabel}
                </span>
              </div>

              {completed ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1 shrink-0">
                  <Trophy className="w-3 h-3 text-amber-300 shrink-0" />
                  <span>{visibleItems.length === 2 ? "Completed" : "100%"}</span>
                </span>
              ) : (
                <span
                  className={`text-[11px] sm:text-xs font-black font-mono shrink-0 ${
                    item.percent > 0 ? meta.percentText : "text-slate-400"
                  }`}
                >
                  {item.percent}%
                </span>
              )}
            </div>

            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  completed
                    ? "bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400"
                    : `bg-gradient-to-r ${meta.barGradient}`
                }`}
                style={{ width: `${completed ? 100 : item.percent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
