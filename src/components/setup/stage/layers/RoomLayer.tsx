import type { ReactElement } from "react";

export interface RoomLayerProps {
  wallArt: string;
}

export function RoomLayer({ wallArt }: RoomLayerProps): ReactElement {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b111d] via-[#101826] to-[#152033]" />

      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(56, 189, 248, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(56, 189, 248, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: "28px 28px"
        }}
      />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent blur-sm" />
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full opacity-60" />

      <div className="absolute top-6 left-6 md:left-12 w-28 md:w-36 h-36 md:h-44 rounded-lg bg-slate-900/90 border-2 border-slate-700/80 shadow-2xl overflow-hidden p-2 flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-slate-800 pb-1 mb-1">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>
          <span className="text-[8px] font-mono uppercase tracking-wider text-slate-500">
            {wallArt === "js_matrix" ? "matrix.js" : wallArt === "cyber_city" ? "skyline.png" : wallArt === "git_branch" ? "git_graph" : "bounty.trophy"}
          </span>
        </div>

        {wallArt === "js_matrix" && (
          <div className="flex-1 flex flex-col justify-around font-mono text-[8px] md:text-[9px] text-emerald-400 leading-tight select-none opacity-90 overflow-hidden">
            <div className="text-yellow-400">const bug = null;</div>
            <div className="text-emerald-400">while(coding) &#123;</div>
            <div className="pl-2 text-cyan-400">optimize();</div>
            <div className="pl-2 text-slate-400">deploy(🚀);</div>
            <div className="text-emerald-400">&#125;</div>
            <div className="text-pink-400">return 200_OK;</div>
          </div>
        )}

        {wallArt === "cyber_city" && (
          <div className="flex-1 relative rounded overflow-hidden bg-gradient-to-b from-indigo-950 via-purple-950 to-pink-950 flex flex-col justify-end p-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-b from-yellow-300 to-pink-500 absolute top-2 right-3 opacity-90" />
            <div className="flex items-end justify-between gap-1 z-10">
              <div className="w-4 h-12 bg-indigo-950 border-t-2 border-cyan-400" />
              <div className="w-5 h-16 bg-slate-900 border-t-2 border-pink-400" />
              <div className="w-6 h-10 bg-indigo-950 border-t-2 border-yellow-400" />
              <div className="w-4 h-14 bg-slate-900 border-t-2 border-cyan-400" />
            </div>
          </div>
        )}

        {wallArt === "git_branch" && (
          <div className="flex-1 relative flex flex-col justify-center px-1 font-mono text-[8px]">
            <div className="flex items-center gap-1.5 text-blue-400 mb-2">
              <span className="w-2.5 h-2.5 rounded-full border-2 border-blue-400 bg-blue-950" />
              <span className="h-0.5 w-6 bg-blue-500" />
              <span className="w-2.5 h-2.5 rounded-full border-2 border-blue-400 bg-blue-500" />
              <span className="text-[7px] text-slate-400">main</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400 pl-3">
              <span className="w-2.5 h-2.5 rounded-full border-2 border-emerald-400 bg-emerald-950" />
              <span className="h-0.5 w-4 bg-emerald-500" />
              <span className="w-2.5 h-2.5 rounded-full border-2 border-emerald-400 bg-emerald-500" />
              <span className="text-[7px] text-slate-400">feat/v2</span>
            </div>
          </div>
        )}

        {wallArt === "bug_bounty" && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-1 bg-gradient-to-b from-amber-950/40 to-slate-900 rounded border border-amber-500/30">
            <span className="text-2xl mb-1">🏆</span>
            <span className="text-[8px] font-bold text-amber-400 tracking-wider">BUG HUNTER</span>
            <span className="text-[7px] text-slate-400 font-mono">100% SQUASHED</span>
          </div>
        )}

        <div className="text-[7px] font-mono text-slate-600 text-right mt-1">
          BUGGY ART v2
        </div>
      </div>

      <div className="absolute top-10 right-8 md:right-16 flex flex-col gap-3">
        <div className="w-20 md:w-28 h-2 bg-slate-800 rounded-full border border-slate-700 shadow flex items-center justify-around px-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500/30 border border-emerald-400" />
          <div className="w-2 h-2 rounded-full bg-cyan-400/50" />
          <div className="w-4 h-1.5 rounded bg-slate-600" />
        </div>
        <div className="w-16 md:w-20 h-2 bg-slate-800 rounded-full border border-slate-700 shadow self-end flex items-center justify-end px-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400/40" />
        </div>
      </div>
    </div>
  );
}
