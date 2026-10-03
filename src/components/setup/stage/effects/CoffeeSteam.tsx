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
    <div className={`pointer-events-none relative w-8 h-10 ${className}`} aria-hidden="true">
      <svg
        className="absolute bottom-0 left-1 w-3 h-8 text-slate-300/60 animate-steam-1"
        viewBox="0 0 10 30"
        fill="none"
      >
        <path
          d="M 5 28 Q 1 18 7 12 Q 13 6 5 2"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <svg
        className="absolute bottom-0 left-3 w-3.5 h-9 text-slate-200/50 animate-steam-2"
        viewBox="0 0 10 30"
        fill="none"
      >
        <path
          d="M 5 28 Q 9 19 3 13 Q -2 7 5 2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
