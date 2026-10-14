import React, { type ReactElement } from "react";

export interface TrackPillProps {
  track: string;
  onSwitch?: () => void;
  className?: string;
}

export function TrackPill({
  track,
  onSwitch,
  className = "",
}: TrackPillProps): ReactElement {
  return (
    <button
      type="button"
      onClick={onSwitch}
      aria-label="Switch active track"
      className={className}
    >
      {track}
    </button>
  );
}
