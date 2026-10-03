import type { ReactElement } from "react";

export interface AvatarLayerProps {
  className?: string;
}

export function AvatarLayer({ className = "" }: AvatarLayerProps): ReactElement {
  return (
    <div
      className={`absolute bottom-[6%] left-1/2 -translate-x-1/2 pointer-events-none select-none z-30 flex flex-col items-center ${className}`}
    >
      <div className="relative flex flex-col items-center">
        <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-full bg-slate-800 border-2 border-slate-600 shadow-xl flex items-center justify-center relative z-10">
          <div className="w-11 sm:w-13 h-11 sm:h-13 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center overflow-hidden">
            <div className="w-8 sm:w-10 h-8 sm:h-10 bg-indigo-950 rounded-full border border-indigo-500/40 flex items-center justify-center">
              <span className="text-xs font-mono font-bold text-indigo-300">&lt;/&gt;</span>
            </div>
          </div>

          <div className="absolute -top-1 w-12 sm:w-14 h-3 border-t-2 border-x border-slate-500 rounded-t-full" />
          <div className="absolute -left-1.5 top-4 w-3 h-5 bg-slate-700 rounded-l-md border border-cyan-400/80 shadow-[0_0_6px_rgba(56,189,248,0.5)]" />
          <div className="absolute -right-1.5 top-4 w-3 h-5 bg-slate-700 rounded-r-md border border-cyan-400/80 shadow-[0_0_6px_rgba(56,189,248,0.5)]" />
        </div>

        <div className="w-20 sm:w-24 h-11 sm:h-12 bg-slate-800 border-t-2 border-x-2 border-slate-600 rounded-t-2xl -mt-2 flex justify-center shadow-lg z-10 relative">
          <div className="w-6 sm:w-8 h-3 bg-slate-900 rounded-b-md border-b border-slate-700" />
        </div>

        <div className="absolute -inset-x-2 -top-4 bottom-0 bg-slate-900 border-2 border-slate-700 rounded-t-3xl shadow-2xl -z-0 flex flex-col justify-between p-1.5">
          <div className="w-10 h-2 bg-sky-500/20 border border-sky-400/40 rounded-full mx-auto" />
          <div className="w-full flex justify-between px-0.5">
            <div className="w-2.5 h-8 bg-slate-800 border border-slate-600 rounded-sm" />
            <div className="w-2.5 h-8 bg-slate-800 border border-slate-600 rounded-sm" />
          </div>
        </div>

        <div className="w-4 h-4 bg-slate-950 border-x border-slate-700" />
      </div>
    </div>
  );
}
