import type { ReactElement } from "react";

export interface MonitorGlowProps {
  color?: string;
  className?: string;
  isFlickering?: boolean;
}

export function MonitorGlow({
  color = "#38bdf8",
  className = "",
  isFlickering = false
}: MonitorGlowProps): ReactElement {
  return (
    <div
      className={`pointer-events-none absolute inset-0 flex items-center justify-center ${className}`}
      aria-hidden="true"
    >
      <div
        className={`w-4/5 h-3/4 rounded-full blur-3xl opacity-40 transition-opacity duration-300 ${
          isFlickering ? "opacity-80 scale-105" : "animate-glow-pulse"
        }`}
        style={{
          background: `radial-gradient(ellipse at center, ${color} 0%, transparent 70%)`
        }}
      />
    </div>
  );
}
