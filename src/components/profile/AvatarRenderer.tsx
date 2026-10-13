"use client";

import React, { useId } from "react";
import type { AvatarConfig } from "@/services/authApi";
import { DEFAULT_AVATAR_CONFIG } from "@/services/authApi";

export interface AvatarRendererProps {
  config?: Partial<AvatarConfig> | null;
  size?: number;
  className?: string;
}

export function AvatarRenderer({
  config,
  size = 120,
  className = "",
}: AvatarRendererProps) {
  const uniqueId = useId().replace(/:/g, "");
  const clipId = `avatar-clip-${uniqueId}`;

  const skinColor = config?.skin_color || DEFAULT_AVATAR_CONFIG.skin_color;
  const hairStyle = config?.hair_style || DEFAULT_AVATAR_CONFIG.hair_style;
  const hairColor = config?.hair_color || DEFAULT_AVATAR_CONFIG.hair_color;
  const eyeStyle = config?.eye_style || DEFAULT_AVATAR_CONFIG.eye_style;
  const expression = config?.expression || DEFAULT_AVATAR_CONFIG.expression;
  const accessory = config?.accessory || DEFAULT_AVATAR_CONFIG.accessory;
  const shirtColor = config?.shirt_color || DEFAULT_AVATAR_CONFIG.shirt_color;
  const bgColor = config?.bg_color || DEFAULT_AVATAR_CONFIG.bg_color;

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={`shrink-0 select-none ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: size, height: size }}
    >
      <defs>
        <clipPath id={clipId}>
          <circle cx="100" cy="100" r="96" />
        </clipPath>
      </defs>

      <circle cx="100" cy="100" r="96" fill={bgColor} />

      <g clipPath={`url(#${clipId})`}>
        <path
          d="M 85 110 L 115 110 L 115 142 C 115 146 85 146 85 142 Z"
          fill={skinColor}
        />
        <path
          d="M 85 112 Q 100 124 115 112 L 115 120 Q 100 132 85 120 Z"
          fill="rgba(0,0,0,0.12)"
        />

        <path
          d="M 38 198 C 40 152 68 138 86 138 L 114 138 C 132 138 160 152 162 198 Z"
          fill={shirtColor}
        />
        <path
          d="M 86 138 Q 100 154 114 138 Q 100 162 86 138 Z"
          fill="rgba(255,255,255,0.22)"
        />

        <ellipse cx="57" cy="94" rx="7" ry="11" fill={skinColor} />
        <ellipse cx="58" cy="94" rx="4" ry="7" fill="rgba(0,0,0,0.08)" />
        <ellipse cx="143" cy="94" rx="7" ry="11" fill={skinColor} />
        <ellipse cx="142" cy="94" rx="4" ry="7" fill="rgba(0,0,0,0.08)" />

        <path
          d="M 58 92 C 58 62 75 50 100 50 C 125 50 142 62 142 92 C 142 122 125 140 100 140 C 75 140 58 122 58 92 Z"
          fill={skinColor}
        />

        <ellipse cx="72" cy="106" rx="7" ry="5" fill="rgba(244, 63, 94, 0.22)" />
        <ellipse cx="128" cy="106" rx="7" ry="5" fill="rgba(244, 63, 94, 0.22)" />

        <path
          d="M 98 97 C 98 102 102 102 102 97"
          stroke="rgba(0,0,0,0.18)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {eyeStyle === "happy" ? (
          <g>
            <path
              d="M 73 93 Q 80 84 87 93"
              stroke="#1E293B"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 113 93 Q 120 84 127 93"
              stroke="#1E293B"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 72 78 Q 80 73 88 77"
              stroke="#1E293B"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 112 77 Q 120 73 128 78"
              stroke="#1E293B"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        ) : eyeStyle === "focus" ? (
          <g>
            <circle cx="80" cy="93" r="5.5" fill="#1E293B" />
            <circle cx="82" cy="91" r="1.8" fill="#FFFFFF" />
            <circle cx="120" cy="93" r="5.5" fill="#1E293B" />
            <circle cx="122" cy="91" r="1.8" fill="#FFFFFF" />
            <path
              d="M 72 79 L 88 83"
              stroke="#1E293B"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path
              d="M 128 79 L 112 83"
              stroke="#1E293B"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </g>
        ) : eyeStyle === "wink" ? (
          <g>
            <path
              d="M 73 93 Q 80 99 87 93"
              stroke="#1E293B"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="120" cy="92" r="6.5" fill="#1E293B" />
            <circle cx="122" cy="90" r="2.2" fill="#FFFFFF" />
            <path
              d="M 72 79 Q 80 76 88 79"
              stroke="#1E293B"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 112 78 Q 120 74 128 77"
              stroke="#1E293B"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        ) : (
          <g>
            <circle cx="80" cy="92" r="6.5" fill="#1E293B" />
            <circle cx="82" cy="90" r="2.2" fill="#FFFFFF" />
            <circle cx="120" cy="92" r="6.5" fill="#1E293B" />
            <circle cx="122" cy="90" r="2.2" fill="#FFFFFF" />
            <path
              d="M 72 80 Q 80 76 88 79"
              stroke="#1E293B"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 112 79 Q 120 76 128 80"
              stroke="#1E293B"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        )}

        {expression === "smile" ? (
          <path
            d="M 91 115 Q 100 124 109 115"
            stroke="#1E293B"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />
        ) : expression === "open" ? (
          <g>
            <ellipse cx="100" cy="119" rx="8" ry="9" fill="#991B1B" />
            <path
              d="M 95 124 Q 100 121 105 124"
              stroke="#F43F5E"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        ) : expression === "neutral" ? (
          <path
            d="M 92 117 L 108 117"
            stroke="#1E293B"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        ) : (
          <g>
            <path
              d="M 88 113 Q 100 114 112 113 Q 112 127 100 127 Q 88 127 88 113 Z"
              fill="#991B1B"
            />
            <path
              d="M 93 123 Q 100 120 107 123 Q 100 127 93 123 Z"
              fill="#F43F5E"
            />
            <path
              d="M 88 113 Q 100 115 112 113"
              stroke="#1E293B"
              strokeWidth="2.5"
              fill="none"
            />
          </g>
        )}

        {hairStyle === "bald" ? null : hairStyle === "short_curly" ? (
          <g>
            <path
              d="M 54 88 C 48 76 52 64 60 56 C 68 48 76 46 84 44 C 90 38 100 36 108 38 C 118 38 128 42 134 50 C 142 56 148 68 146 84 C 140 80 136 70 128 70 C 120 70 114 78 104 76 C 96 74 90 68 80 72 C 72 74 66 84 54 88 Z"
              fill={hairColor}
            />
            <circle cx="70" cy="50" r="10" fill={hairColor} />
            <circle cx="90" cy="40" r="11" fill={hairColor} />
            <circle cx="110" cy="40" r="11" fill={hairColor} />
            <circle cx="130" cy="50" r="10" fill={hairColor} />
            <circle cx="140" cy="65" r="9" fill={hairColor} />
            <circle cx="60" cy="65" r="9" fill={hairColor} />
            <path
              d="M 86 42 Q 91 38 96 42"
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 106 42 Q 111 38 116 42"
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        ) : hairStyle === "sleek" ? (
          <g>
            <path
              d="M 54 86 C 52 60 66 40 94 38 C 122 36 146 54 146 86 C 140 82 136 74 130 72 C 114 66 84 68 62 82 C 58 84 55 86 54 86 Z"
              fill={hairColor}
            />
            <path
              d="M 70 48 Q 96 42 126 50"
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        ) : hairStyle === "parted" ? (
          <g>
            <path
              d="M 54 86 C 52 62 66 42 90 40 C 114 38 144 52 146 86 C 140 82 134 74 126 72 C 104 68 96 66 88 78 C 82 72 70 74 58 84 C 56 85 54 86 54 86 Z"
              fill={hairColor}
            />
            <path
              d="M 88 40 L 88 56"
              stroke="rgba(0,0,0,0.2)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M 94 44 Q 114 42 132 52"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        ) : (
          <g>
            <path
              d="M 55 86 C 50 64 62 42 82 38 C 94 36 108 36 118 39 C 138 44 149 62 145 86 C 141 82 138 72 131 69 C 122 66 114 74 105 70 C 97 66 91 73 82 70 C 72 67 66 79 55 86 Z"
              fill={hairColor}
            />
            <path
              d="M 80 44 C 84 36 94 36 100 42 C 108 36 118 38 122 45"
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        )}

        {accessory === "yellow_glasses" ? (
          <g>
            <circle
              cx="80"
              cy="92"
              r="15"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="4.5"
            />
            <path
              d="M 71 86 L 79 80"
              stroke="rgba(255,255,255,0.6)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle
              cx="120"
              cy="92"
              r="15"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="4.5"
            />
            <path
              d="M 111 86 L 119 80"
              stroke="rgba(255,255,255,0.6)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M 95 92 Q 100 88 105 92"
              stroke="#F59E0B"
              strokeWidth="4.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 65 92 L 55 90"
              stroke="#F59E0B"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M 135 92 L 145 90"
              stroke="#F59E0B"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </g>
        ) : accessory === "headphones" ? (
          <g>
            <path
              d="M 52 94 C 50 42 150 42 148 94"
              stroke="#3B82F6"
              strokeWidth="7"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 64 70 C 80 56 120 56 136 70"
              stroke="#1E293B"
              strokeWidth="3.5"
              fill="none"
            />
            <rect
              x="46"
              y="82"
              width="11"
              height="26"
              rx="5.5"
              fill="#2563EB"
              stroke="#1D4ED8"
              strokeWidth="2"
            />
            <path
              d="M 49 87 L 49 103"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <rect
              x="143"
              y="82"
              width="11"
              height="26"
              rx="5.5"
              fill="#2563EB"
              stroke="#1D4ED8"
              strokeWidth="2"
            />
            <path
              d="M 151 87 L 151 103"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </g>
        ) : null}
      </g>
    </svg>
  );
}
