import type { ReactElement } from "react";
import { Wrench } from "lucide-react";

export function SetupView(): ReactElement {
  return (
    <div className="flex-1 flex items-center justify-center p-6 w-full min-h-[60vh]">
      <div className="max-w-md w-full mx-auto my-auto p-8 rounded-3xl bg-[#1e293b]/60 border border-slate-700/60 text-center flex flex-col items-center gap-4 shadow-xl backdrop-blur-sm">
        <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full text-xs font-semibold">
          Coming Soon
        </span>

        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-1">
          <Wrench className="w-8 h-8" />
        </div>

        <h2 className="text-xl font-bold text-slate-100">
          Developer Workspace
        </h2>

        <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
          The workspace is coming soon... Buggy is setting up the desk and monitors!
        </p>
      </div>
    </div>
  );
}
