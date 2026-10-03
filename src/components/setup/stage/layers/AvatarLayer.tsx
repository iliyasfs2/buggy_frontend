import type { ReactElement } from "react";

export interface AvatarLayerProps {
  className?: string;
}

export function AvatarLayer({ className = "" }: AvatarLayerProps): ReactElement {
  return (
    <div
      className={`absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none select-none z-20 flex flex-col items-center ${className}`}
    >
      <div className="relative flex flex-col items-center">
        <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-slate-800 border-2 border-slate-600 shadow-2xl flex items-center justify-center relative z-10">
          <div className="w-13 sm:w-16 h-13 sm:h-16 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center overflow-hidden relative">
            <div className="w-10 sm:w-12 h-10 sm:h-12 bg-indigo-950 rounded-full border border-indigo-500/40 flex items-center justify-center">
              <span className="text-xs sm:text-sm font-mono font-black text-indigo-300">&lt;/&gt;</span>
            </div>
          </div>

          <div className="absolute -top-1.5 w-14 sm:w-18 h-4 border-t-4 border-x-2 border-slate-500 rounded-t-full" />
          <div className="absolute -left-2 top-5 sm:top-6 w-3.5 h-6 bg-slate-700 rounded-l-lg border-2 border-cyan-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
          <div className="absolute -right-2 top-5 sm:top-6 w-3.5 h-6 bg-slate-700 rounded-r-lg border-2 border-cyan-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
        </div>

        <div className="w-24 sm:w-32 h-14 sm:h-16 bg-slate-800 border-t-2 border-x-2 border-slate-600 rounded-t-3xl -mt-2 flex justify-center shadow-xl z-10 relative">
          <div className="w-8 sm:w-10 h-4 bg-slate-900 rounded-b-lg border-b border-slate-700" />
        </div>

        <div className="absolute -inset-x-3 -top-6 bottom-0 bg-slate-900/95 border-2 border-slate-700 rounded-t-[2.5rem] shadow-2xl -z-0 flex flex-col justify-between p-2">
          <div className="w-12 sm:w-16 h-3 bg-sky-500/30 border border-sky-400/50 rounded-full mx-auto" />
          <div className="w-full flex justify-between px-1">
            <div className="w-3.5 h-10 bg-slate-800 border border-slate-600 rounded-md" />
            <div className="w-3.5 h-10 bg-slate-800 border border-slate-600 rounded-md" />
          </div>
        </div>

        <div className="w-5 h-6 bg-slate-950 border-x-2 border-slate-700" />
      </div>
    </div>
  );
}
