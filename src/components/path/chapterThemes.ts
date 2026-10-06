import type { NodePalette } from "./LessonNode";

export interface ChapterTheme {
  cardBg: string;
  cardBorder: string;
  textColor: string;
  subtextColor: string;
  btnBg: string;
  btnBorder: string;
  btnText: string;
  nodePalette: NodePalette;
}

export const CHAPTER_THEMES: Record<number, ChapterTheme> = {
  1: {
    cardBg: "oklch(74% 0.184 86.047)",
    cardBorder: "oklch(60% 0.19 86.047)",
    textColor: "#ffffff",
    subtextColor: "rgba(255, 255, 255, 0.92)",
    btnBg: "rgba(0, 0, 0, 0.18)",
    btnBorder: "rgba(0, 0, 0, 0.28)",
    btnText: "#ffffff",
    nodePalette: {
      primary: "oklch(79.5% 0.184 86.047)",
      light: "oklch(84.5% 0.16 86.047)",
      highlight: "oklch(91% 0.11 86.047)",
      sideWall: "oklch(67.5% 0.19 86.047)",
      lowerSide: "oklch(60% 0.19 86.047)",
      bottomEdge: "oklch(60% 0.19 86.047)"
    }
  },
  2: {
    cardBg: "oklch(66% 0.20 138)",
    cardBorder: "oklch(53% 0.22 138)",
    textColor: "#ffffff",
    subtextColor: "rgba(255, 255, 255, 0.92)",
    btnBg: "rgba(0, 0, 0, 0.18)",
    btnBorder: "rgba(0, 0, 0, 0.28)",
    btnText: "#ffffff",
    nodePalette: {
      primary: "oklch(72% 0.21 138)",
      light: "oklch(78% 0.18 138)",
      highlight: "oklch(86% 0.13 138)",
      sideWall: "oklch(58% 0.22 138)",
      lowerSide: "oklch(50% 0.22 138)",
      bottomEdge: "oklch(50% 0.22 138)"
    }
  },
  3: {
    cardBg: "oklch(66% 0.17 225)",
    cardBorder: "oklch(53% 0.19 225)",
    textColor: "#ffffff",
    subtextColor: "rgba(255, 255, 255, 0.92)",
    btnBg: "rgba(0, 0, 0, 0.18)",
    btnBorder: "rgba(0, 0, 0, 0.28)",
    btnText: "#ffffff",
    nodePalette: {
      primary: "oklch(72% 0.17 225)",
      light: "oklch(78% 0.14 225)",
      highlight: "oklch(86% 0.10 225)",
      sideWall: "oklch(58% 0.19 225)",
      lowerSide: "oklch(50% 0.19 225)",
      bottomEdge: "oklch(50% 0.19 225)"
    }
  },
  4: {
    cardBg: "oklch(63% 0.22 300)",
    cardBorder: "oklch(50% 0.24 300)",
    textColor: "#ffffff",
    subtextColor: "rgba(255, 255, 255, 0.92)",
    btnBg: "rgba(0, 0, 0, 0.18)",
    btnBorder: "rgba(0, 0, 0, 0.28)",
    btnText: "#ffffff",
    nodePalette: {
      primary: "oklch(67% 0.22 300)",
      light: "oklch(74% 0.18 300)",
      highlight: "oklch(82% 0.13 300)",
      sideWall: "oklch(52% 0.24 300)",
      lowerSide: "oklch(45% 0.24 300)",
      bottomEdge: "oklch(45% 0.24 300)"
    }
  }
};

export function getChapterTheme(chapterNumber: number): ChapterTheme {
  const normalized = ((chapterNumber - 1) % 4) + 1;
  return CHAPTER_THEMES[normalized] || CHAPTER_THEMES[1];
}
