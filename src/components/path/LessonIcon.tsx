import type { ReactElement } from "react";
import Image from "next/image";

export type LessonIconType = "code" | "brain" | "coffee" | "puzzle" | "crown" | "energy_core";

export interface LessonIconProps {
  type: LessonIconType;
  className?: string;
}

const ICON_PATHS: Record<LessonIconType, string> = {
  code: "/icons/nodes/code.png",
  brain: "/icons/nodes/brain.png",
  coffee: "/icons/nodes/coffee.png",
  puzzle: "/icons/nodes/puzzle.png",
  crown: "/icons/nodes/crown.png",
  energy_core: "/icons/nodes/crown.png"
};

export function LessonIcon({
  type,
  className = "w-[24px] h-[24px] sm:w-[26px] sm:h-[26px]"
}: LessonIconProps): ReactElement {
  const iconSrc = ICON_PATHS[type] || ICON_PATHS.crown;

  return (
    <Image
      src={iconSrc}
      alt={type}
      width={48}
      height={48}
      className={`${className} object-contain pointer-events-none select-none`}
      priority
    />
  );
}
