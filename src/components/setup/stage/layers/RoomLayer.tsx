import type { ReactElement } from "react";

export interface RoomLayerProps {
  wallArt: string;
}

export function RoomLayer({ wallArt }: RoomLayerProps): ReactElement {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at top center, #1e293b 0%, #0f172a 100%)"
        }}
      />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-8 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />

      <div className="absolute bottom-0 inset-x-0 h-[22%] bg-slate-900 border-t-2 border-slate-700/50">
        <div className="w-full h-full opacity-30 flex justify-between px-12">
          <div className="w-px h-full bg-slate-800" />
          <div className="w-px h-full bg-slate-800" />
          <div className="w-px h-full bg-slate-800" />
          <div className="w-px h-full bg-slate-800" />
        </div>
      </div>

      <div className="absolute top-[8%] left-1/2 -translate-x-1/2 z-0">
        <div className="w-36 sm:w-44 h-24 sm:h-28 bg-slate-900/90 border-2 border-slate-700 rounded-xl shadow-xl p-2 flex flex-col justify-between overflow-hidden">
          {wallArt === "js_matrix" && (
            <div className="flex-1 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex flex-col items-center justify-center p-1.5">
              <div className="w-8 h-8 bg-yellow-400 rounded-md flex items-center justify-center shadow-md">
                <span className="font-mono font-black text-slate-950 text-base">JS</span>
              </div>
              <span className="text-[9px] font-mono font-bold text-yellow-400 mt-1">JAVASCRIPT</span>
            </div>
          )}

          {wallArt === "cyber_city" && (
            <div className="flex-1 bg-gradient-to-b from-indigo-950 to-pink-950 border border-pink-500/30 rounded-lg flex flex-col justify-between p-1.5 overflow-hidden relative">
              <div className="w-5 h-5 rounded-full bg-yellow-300 absolute top-1 right-2 opacity-80" />
              <div className="flex items-end justify-between gap-1 z-10 mt-auto">
                <div className="w-3 h-6 bg-slate-900 border-t border-cyan-400" />
                <div className="w-4 h-9 bg-slate-900 border-t border-pink-400" />
                <div className="w-4 h-5 bg-slate-900 border-t border-yellow-400" />
              </div>
            </div>
          )}

          {wallArt === "git_branch" && (
            <div className="flex-1 bg-slate-950 border border-blue-500/30 rounded-lg flex flex-col justify-center px-2 py-1 font-mono text-[8px]">
              <div className="flex items-center gap-1.5 text-blue-400 mb-1">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="h-0.5 w-6 bg-blue-400" />
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-slate-300 text-[8px]">main</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 pl-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="h-0.5 w-4 bg-emerald-400" />
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-slate-300 text-[8px]">v2</span>
              </div>
            </div>
          )}

          {wallArt === "bug_bounty" && (
            <div className="flex-1 bg-amber-950/40 border border-amber-500/30 rounded-lg flex flex-col items-center justify-center p-1">
              <span className="text-2xl mb-0.5">🏆</span>
              <span className="text-[8px] font-bold text-amber-300 font-mono">BUG BOUNTY</span>
            </div>
          )}

          <div className="text-[7px] font-mono text-slate-500 text-center">
            BUGGY STUDIO
          </div>
        </div>
      </div>
    </div>
  );
}
