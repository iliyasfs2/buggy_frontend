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
        <div className="w-14 h-14 rounded-full bg-slate-800 border-2 border-slate-600 shadow-xl flex items-center justify-center relative">
          <div className="w-11 h-11 rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-indigo-500/30 border border-indigo-400 flex items-center justify-center">
              <span className="text-xs font-mono font-bold text-indigo-200">&lt;/&gt;</span>
            </div>
          </div>
          <div className="absolute -top-1 w-12 h-3 border-t-2 border-x-2 border-slate-500 rounded-t-full" />
          <div className="absolute -left-1.5 top-4 w-3 h-5 bg-slate-700 rounded-l-md border border-slate-600" />
          <div className="absolute -right-1.5 top-4 w-3 h-5 bg-slate-700 rounded-r-md border border-slate-600" />
        </div>

        <div className="w-20 h-10 bg-slate-800 rounded-t-2xl border-t border-x border-slate-600 -mt-1 flex justify-center shadow-lg">
          <div className="w-6 h-3 bg-slate-900 rounded-b-md border-b border-slate-700" />
        </div>

        <div className="w-24 h-4 bg-slate-900 rounded-t-md border-t-2 border-slate-700 -mt-1" />
      </div>
    </div>
  );
}
