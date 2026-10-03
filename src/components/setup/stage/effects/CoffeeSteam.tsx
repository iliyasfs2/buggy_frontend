import type { ReactElement } from "react";

export interface CoffeeSteamProps {
  className?: string;
  active?: boolean;
}

export function CoffeeSteam({ className = "", active = true }: CoffeeSteamProps): ReactElement {
  if (!active) {
    return <div className={`pointer-events-none relative ${className}`} />;
  }

  return (
    <div className={`pointer-events-none relative w-6 h-8 ${className}`} aria-hidden="true">
      <div className="absolute bottom-0 left-1 w-1.5 h-6 bg-slate-300/40 rounded-full blur-[1px] animate-steam-1" />
      <div className="absolute bottom-0 left-3 w-1.5 h-7 bg-slate-200/30 rounded-full blur-[1px] animate-steam-2" />
    </div>
  );
}
