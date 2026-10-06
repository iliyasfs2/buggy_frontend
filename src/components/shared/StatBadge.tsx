"use client";

import type { ReactElement } from "react";
import Image from "next/image";

export type StatBadgeVariant = "streak" | "byte" | "battery" | "js";

export interface StatBadgeProps {
  variant: StatBadgeVariant;
  value: number | string;
  compact?: boolean;
  className?: string;
}

interface VariantConfig {
  iconSrc: string;
  iconAlt: string;
  valueColor: string;
  label: string;
  formattedValue: string;
}

function resolveVariant(variant: StatBadgeVariant, value: number | string): VariantConfig {
  const formattedNumber = typeof value === "number" ? value.toLocaleString("en-US") : value;

  switch (variant) {
    case "streak":
      return {
        iconSrc: "/icons/streak.png",
        iconAlt: "Streak icon",
        valueColor: "text-yellow-400",
        label: `Streak: ${value} days`,
        formattedValue: value.toString()
      };
    case "byte":
      return {
        iconSrc: "/icons/byte.png",
        iconAlt: "Byte icon",
        valueColor: "text-sky-400",
        label: `Balance: ${formattedNumber} bytes`,
        formattedValue: formattedNumber
      };
    case "js":
      return {
        iconSrc: "/icons/js-badge.png",
        iconAlt: "JavaScript icon",
        valueColor: "text-amber-400",
        label: `JavaScript: ${value}`,
        formattedValue: value.toString()
      };
    default:
      return {
        iconSrc: "/icons/battery.png",
        iconAlt: "Battery icon",
        valueColor: "text-emerald-400",
        label: `Battery: ${typeof value === "number" ? `${value}/5` : value}`,
        formattedValue: typeof value === "number" ? `${value}/5` : value
      };
  }
}

export function StatBadge({
  variant,
  value,
  compact = false,
  className = ""
}: StatBadgeProps): ReactElement {
  const { iconSrc, iconAlt, valueColor, label, formattedValue } = resolveVariant(variant, value);

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
