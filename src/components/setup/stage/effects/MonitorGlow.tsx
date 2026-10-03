import type { ReactElement } from "react";

export interface MonitorGlowProps {
  className?: string;
  isFlickering?: boolean;
}

export function MonitorGlow({ className = "", isFlickering = false }: MonitorGlowProps): ReactElement {
  return (
    <div
      className={`pointer-events-none absolute -inset-4 rounded-3xl bg-sky-500/10 blur-2xl transition-opacity duration-300 ${
        isFlickering ? "opacity-60" : "opacity-20"
      } ${className}`}
      aria-hidden="true"
    />
  );
}
