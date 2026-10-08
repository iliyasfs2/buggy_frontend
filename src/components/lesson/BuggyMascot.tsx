"use client";

import type { ReactElement } from "react";
import type { MascotMood } from "@/types/lesson";
import { Sparkles } from "lucide-react";

export interface BuggyMascotProps {
  mood?: MascotMood;
  dialogue?: string;
  className?: string;
}

export function BuggyMascot({
  mood = "idle",
  dialogue,
  className = ""
}: BuggyMascotProps): ReactElement {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div className="relative shrink-0">
        <div
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-b from-amber-400 to-amber-500 border-2 border-amber-300 border-b-4 border-b-amber-600 shadow-md flex items-center justify-center relative transition-transform duration-300 ${
            mood === "happy" || mood === "celebrate"
              ? "animate-bounce"
              : mood === "confused"
              ? "animate-pulse rotate-6"
              : mood === "thinking"
              ? "-rotate-3"
              : ""
          }`}
        >
          <div className="absolute -top-3 left-2 w-1.5 h-4 bg-amber-600 rounded-full rotate-[-20deg] flex items-start justify-center">
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                mood === "happy" || mood === "celebrate"
                  ? "bg-amber-200 shadow-[0_0_8px_#fef08a]"
                  : "bg-amber-300"
              }`}
            />
          </div>
          <div className="absolute -top-3 right-2 w-1.5 h-4 bg-amber-600 rounded-full rotate-[20deg] flex items-start justify-center">
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                mood === "happy" || mood === "celebrate"
                  ? "bg-amber-200 shadow-[0_0_8px_#fef08a]"
                  : "bg-amber-300"
              }`}
            />
          </div>

          <div
            className={`w-11 h-6 rounded-lg bg-slate-950 border-2 border-amber-200 flex items-center justify-around px-1 transition-transform ${
              mood === "confused"
                ? "rotate-12 translate-y-0.5"
                : mood === "thinking"
                ? "-rotate-6"
                : ""
            }`}
          >
            <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 flex items-center justify-center">
              <div
                className={`w-1.5 h-1.5 rounded-full bg-white ${
                  mood === "alert"
                    ? "scale-125"
                    : mood === "thinking"
                    ? "translate-y-[-1px]"
                    : ""
                }`}
              />
            </div>
            <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 flex items-center justify-center">
              <div
                className={`w-1.5 h-1.5 rounded-full bg-white ${
                  mood === "alert"
                    ? "scale-125"
                    : mood === "thinking"
                    ? "translate-y-[-1px]"
                    : ""
                }`}
              />
            </div>
          </div>

          <div className="absolute bottom-2 inset-x-0 flex justify-center">
            {mood === "happy" || mood === "celebrate" ? (
              <div className="w-4 h-2 rounded-b-full bg-slate-950 border-b border-white" />
            ) : mood === "confused" ? (
              <div className="w-3 h-1 bg-slate-950 rounded-full rotate-[-8deg]" />
            ) : mood === "thinking" ? (
              <div className="w-2.5 h-1 bg-slate-950 rounded-full" />
            ) : (
              <div className="w-3 h-1.5 rounded-b-full bg-slate-950" />
            )}
          </div>

          {(mood === "happy" || mood === "celebrate") && (
            <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-amber-200 animate-spin" />
          )}
        </div>
      </div>

      {dialogue && (
        <div className="relative bg-[#1e293b] border-2 border-slate-700 rounded-2xl p-3 sm:p-3.5 shadow-md flex-1 min-w-0 animate-in fade-in slide-in-from-left-2 duration-200">
          <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[8px] border-r-slate-700" />
          <div className="absolute top-1/2 -left-[6px] -translate-y-1/2 w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-r-[7px] border-r-[#1e293b]" />
          <p className="text-xs sm:text-sm font-bold text-slate-200 leading-snug">
            {dialogue}
          </p>
        </div>
      )}
    </div>
  );
}
