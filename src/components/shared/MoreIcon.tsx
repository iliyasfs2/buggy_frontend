import type { ReactElement } from "react";

export interface MoreIconProps {
  className?: string;
}

export function MoreIcon({ className = "w-8 h-auto" }: MoreIconProps): ReactElement {
  return (
    <img
      src="/images/more-dots.png"
      alt="More"
      className={`object-contain select-none pointer-events-none drop-shadow-sm ${className}`}
    />
  );
}
