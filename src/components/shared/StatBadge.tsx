"use client";

import type { ReactElement } from "react";
import Image from "next/image";

export type StatBadgeVariant = "streak" | "byte" | "battery";

export interface StatBadgeProps {
  variant: StatBadgeVariant;
  value: number | string;
  compact?: boolean;
  className?: string;
}

export function StatBadge({
  variant,
  value,
  compact = false,
  className = ""
}: StatBadgeProps): ReactElement {
  const isStreak = variant === "streak";
  const isByte = variant === "byte";

  let label = "";
  if (isStreak) {
    label = `Streak: ${value} days`;
  } else if (isByte) {
    label = `Balance: ${typeof value === "number" ? value.toLocaleString("en-US") : value} bytes`;
  } else {
    label = `Battery: ${typeof value === "number" ? `${value}/5` : value}`;
  }

  let formattedValue = "";
  if (isStreak) {
    formattedValue = value.toString();
  } else if (isByte) {
    formattedValue = typeof value === "number" ? value.toLocaleString("en-US") : value;
  } else {
    formattedValue = typeof value === "number" ? `${value}/5` : value;
  }

  const iconSrc = isStreak
    ? "/icons/streak.png"
    : isByte
    ? "/icons/byte.png"
    : "/icons/battery.png";

  const iconAlt = isStreak
    ? "Streak icon"
    : isByte
    ? "Byte icon"
    : "Battery icon";

  const valueColor = isStreak
    ? "text-yellow-400"
    : isByte
    ? "text-sky-400"
    : "text-emerald-400";

  const textSize = compact ? "text-sm font-bold" : "text-base font-bold";
  const gapSize = compact ? "gap-1.5" : "gap-2";
  const iconSize = compact ? "w-5 h-5" : "w-6 h-6";

  return (
    <div
      aria-label={label}
      className={`inline-flex items-center ${gapSize} whitespace-nowrap select-none bg-transparent ${className}`}
    >
      <Image
        src={iconSrc}
        alt={iconAlt}
        width={24}
        height={24}
        className={`${iconSize} object-contain shrink-0 bg-transparent`}
      />
      <span className={`${textSize} ${valueColor} leading-none`}>{formattedValue}</span>
    </div>
  );
}
