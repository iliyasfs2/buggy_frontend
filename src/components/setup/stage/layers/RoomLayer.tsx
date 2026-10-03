import type { ReactElement } from "react";

export interface RoomLayerProps {
  wallArt: string;
}

export function RoomLayer({ wallArt }: RoomLayerProps): ReactElement {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      <div className="absolute inset-0 bg-gradient-to-b from-[#131d2e] via-[#101826] to-[#0d1420]" />

      <div className="absolute bottom-0 inset-x-0 h-28 bg-[#090d16] border-t-2 border-slate-800/80" />

      <div className="absolute top-4 sm:top-6 left-1/2 -translate-x-1/2 z-0">
        <div className="w-40 sm:w-52 h-24 sm:h-32 bg-slate-900 border-4 border-slate-700/90 rounded-xl shadow-2xl p-2.5 flex flex-col justify-between overflow-hidden relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-slate-600 bg-slate-800 shadow" />

          {wallArt === "js_matrix" && (
            <div className="flex-1 bg-gradient-to-br from-yellow-500/20 to-slate-900 rounded-lg p-2 flex items-center justify-center border border-yellow-500/30">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-400 rounded-xl flex items-center justify-center shadow-lg border border-yellow-300">
                  <span className="font-mono font-black text-xl sm:text-2xl text-slate-950">JS</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-yellow-400 mt-1">JAVASCRIPT</span>
              </div>
            </div>
          )}

          {wallArt === "cyber_city" && (
            <div className="flex-1 bg-gradient-to-b from-indigo-950 via-purple-950 to-pink-950 rounded-lg p-2 flex flex-col justify-between overflow-hidden border border-pink-500/30 relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-b from-yellow-300 to-pink-500 absolute top-2 right-4 opacity-90 shadow-md" />
              <div className="flex items-end justify-between gap-1 z-10 mt-auto">
                <div className="w-4 h-10 bg-indigo-950 border-t-2 border-cyan-400" />
                <div className="w-6 h-14 bg-slate-900 border-t-2 border-pink-400" />
                <div className="w-5 h-8 bg-indigo-950 border-t-2 border-yellow-400" />
                <div className="w-5 h-12 bg-slate-900 border-t-2 border-cyan-400" />
              </div>
            </div>
          )}

          {wallArt === "git_branch" && (
            <div className="flex-1 bg-slate-950 rounded-lg p-2 flex flex-col justify-center border border-blue-500/30 font-mono text-[9px]">
              <div className="flex items-center gap-2 text-blue-400 mb-2">
                <span className="w-3 h-3 rounded-full border-2 border-blue-400 bg-blue-500 shadow-sm" />
                <span className="h-0.5 w-10 bg-blue-400" />
                <span className="w-3 h-3 rounded-full border-2 border-blue-400 bg-blue-500 shadow-sm" />
                <span className="text-[9px] text-slate-300 font-bold">main</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 pl-4">
                <span className="w-3 h-3 rounded-full border-2 border-emerald-400 bg-emerald-500 shadow-sm" />
                <span className="h-0.5 w-8 bg-emerald-400" />
                <span className="w-3 h-3 rounded-full border-2 border-emerald-400 bg-emerald-500 shadow-sm" />
                <span className="text-[9px] text-slate-300 font-bold">feat/v2</span>
              </div>
            </div>
          )}

          {wallArt === "bug_bounty" && (
            <div className="flex-1 bg-gradient-to-b from-amber-950/50 to-slate-950 rounded-lg p-2 flex flex-col items-center justify-center border border-amber-500/40">
              <span className="text-3xl sm:text-4xl mb-0.5">🏆</span>
              <span className="text-[10px] font-bold text-amber-300 font-mono tracking-wider">BUG HUNTER</span>
            </div>
          )}

          <div className="text-[8px] font-mono text-slate-500 text-center mt-1">
            BUGGY STUDIO
          </div>
        </div>
      </div>
    </div>
  );
}
