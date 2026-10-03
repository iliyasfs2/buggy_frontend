import type { ReactElement } from "react";

export interface CompanionLayerProps {
  buggyHat: string;
  isHopping?: boolean;
  isHappy?: boolean;
  onBuggyClick?: () => void;
}

export function CompanionLayer({
  buggyHat,
  isHopping = false,
  isHappy = false,
  onBuggyClick
}: CompanionLayerProps): ReactElement {
  return (
    <div className="absolute bottom-[20%] right-[18%] z-20 select-none pointer-events-none">
      <div
        onClick={onBuggyClick}
        className={`pointer-events-auto cursor-pointer transition-transform flex flex-col items-center group ${
          isHopping ? "animate-buggy-hop" : "animate-buggy-bob hover:scale-105"
        }`}
        role="button"
        tabIndex={0}
        aria-label="Pet Buggy Mascot"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onBuggyClick?.();
          }
        }}
      >
        <div className="relative flex flex-col items-center">
          {buggyHat === "wizard_hat" && (
            <div className="absolute -top-7 z-20 flex flex-col items-center">
              <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[22px] border-b-purple-600 relative">
                <span className="text-[9px] text-amber-300 absolute -top-1 -right-2">✨</span>
              </div>
              <div className="w-11 h-2 bg-purple-700 rounded-full border-t border-purple-400 shadow -mt-0.5" />
            </div>
          )}

          {buggyHat === "beanie_dev" && (
            <div className="absolute -top-4 z-20 flex flex-col items-center">
              <div className="w-2.5 h-2.5 rounded-full bg-orange-600 -mb-1 shadow" />
              <div className="w-10 h-5 bg-orange-500 rounded-t-full border-t-2 border-orange-300 flex items-end justify-center shadow">
                <div className="w-11 h-2 bg-orange-600 rounded-md border-t border-orange-400" />
              </div>
            </div>
          )}

          {buggyHat === "party_crown" && (
            <div className="absolute -top-5 z-20 flex flex-col items-center">
              <div className="flex items-end gap-0.5">
                <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[9px] border-b-yellow-400" />
                <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[13px] border-b-yellow-400" />
                <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[9px] border-b-yellow-400" />
              </div>
              <div className="w-9 h-2 bg-yellow-500 rounded-sm border-t border-yellow-200 flex justify-around items-center px-1">
                <div className="w-1 h-1 rounded-full bg-rose-500" />
                <div className="w-1 h-1 rounded-full bg-blue-500" />
                <div className="w-1 h-1 rounded-full bg-emerald-500" />
              </div>
            </div>
          )}

          {buggyHat !== "wizard_hat" && buggyHat !== "beanie_dev" && (
            <div className="flex justify-center gap-3 -mb-1 z-10">
              <div className="w-1 h-3 bg-sky-400 rounded-full animate-antenna-left flex flex-col items-center">
                <div className="w-2 h-2 rounded-full bg-sky-300 shadow-[0_0_4px_rgba(56,189,248,0.8)] -mt-1" />
              </div>
              <div className="w-1 h-3 bg-sky-400 rounded-full animate-antenna-right flex flex-col items-center">
                <div className="w-2 h-2 rounded-full bg-sky-300 shadow-[0_0_4px_rgba(56,189,248,0.8)] -mt-1" />
              </div>
            </div>
          )}

          <div className="w-12 sm:w-13 h-10 sm:h-11 bg-gradient-to-b from-sky-400 to-blue-600 rounded-2xl border-2 border-sky-300 shadow-[0_4px_12px_rgba(56,189,248,0.4)] flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-1 left-1.5 w-3 h-1.5 bg-white/40 rounded-full blur-[0.5px]" />

            {buggyHat === "cyber_visor" && (
              <div className="w-9 h-3.5 bg-cyan-950 border border-cyan-400 rounded-sm shadow-[0_0_6px_rgba(6,182,212,0.9)] flex items-center justify-center z-10 my-0.5">
                <div className="w-7 h-1 bg-cyan-300 rounded-full animate-pulse" />
              </div>
            )}

            {buggyHat !== "cyber_visor" && (
              <div className="flex items-center justify-center gap-2 z-0 my-0.5">
                {isHappy ? (
                  <div className="flex gap-2">
                    <span className="text-xs font-black text-slate-950 select-none">^</span>
                    <span className="text-xs font-black text-slate-950 select-none">^</span>
                  </div>
                ) : (
                  <div className="flex gap-2 animate-eye-blink">
                    <div className="w-2.5 h-3 bg-slate-950 rounded-full flex items-start justify-end p-0.5">
                      <div className="w-1 h-1 bg-white rounded-full" />
                    </div>
                    <div className="w-2.5 h-3 bg-slate-950 rounded-full flex items-start justify-end p-0.5">
                      <div className="w-1 h-1 bg-white rounded-full" />
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-center mt-0.5">
              {isHappy ? (
                <div className="w-3 h-1.5 border-b-2 border-slate-950 rounded-b-full" />
              ) : (
                <div className="w-1.5 h-1 bg-slate-900 rounded-full" />
              )}
            </div>
          </div>

          <div className="flex justify-between w-8 -mt-1 z-0">
            <div className="w-2.5 h-2 bg-blue-700 rounded-full border border-blue-500" />
            <div className="w-2.5 h-2 bg-blue-700 rounded-full border border-blue-500" />
          </div>
        </div>

        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-1 bg-slate-900/90 border border-slate-700 px-1.5 py-0.5 rounded text-[8px] font-mono text-sky-300 whitespace-nowrap shadow">
          Pet Buggy
        </div>
      </div>
    </div>
  );
}
