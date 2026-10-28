import { Code2 } from "lucide-react";
import type { Chapter } from "@/types/roadmap";
import { MOCK_JAVASCRIPT_CHAPTERS } from "@/constants/roadmap";

export interface CourseItem {
  id: string;
  title: string;
  shortLabel: string;
  code: string;
  icon: typeof Code2;
  iconSrc: string | null;
  fallbackEmoji: string;
  badge: string;
  color: string;
  badgeVariant: "js";
  chapters: Chapter[];
}

export const ALL_COURSES: readonly CourseItem[] = [
  {
    id: "javascript",
    title: "JavaScript",
    shortLabel: "JS",
    code: "JS",
    icon: Code2,
    iconSrc: "/icons/js-badge.png",
    fallbackEmoji: "⚡",
    badge: "Active",
    color: "amber",
    badgeVariant: "js",
    chapters: MOCK_JAVASCRIPT_CHAPTERS,
  },
];

export const COURSES: readonly CourseItem[] = ALL_COURSES.filter(
  (c) => Array.isArray(c.chapters) && c.chapters.length > 0 && c.chapters.some((ch) => ch.nodes && ch.nodes.length > 0)
);

export const getCourseConfig = (courseId?: string | null): CourseItem => {
  if (!courseId) return COURSES[0];
  const clean = courseId.trim().toLowerCase();
  return COURSES.find((c) => c.id === clean) || COURSES[0];
};
