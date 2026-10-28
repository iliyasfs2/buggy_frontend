import { Code2 } from "lucide-react";
import type { Chapter } from "@/types/roadmap";
import { MOCK_JAVASCRIPT_CHAPTERS } from "@/constants/roadmap";

export interface CourseItem {
  id: string;
  title: string;
  shortLabel: string;
  icon: typeof Code2;
  color: string;
  badgeVariant: "js";
  chapters: Chapter[];
}

export const ALL_COURSES: readonly CourseItem[] = [
  {
    id: "javascript",
    title: "JavaScript",
    shortLabel: "JS",
    icon: Code2,
    color: "amber",
    badgeVariant: "js",
    chapters: MOCK_JAVASCRIPT_CHAPTERS,
  },
];

export const COURSES: readonly CourseItem[] = ALL_COURSES.filter(
  (c) => Array.isArray(c.chapters) && c.chapters.length > 0 && c.chapters.some((ch) => ch.nodes && ch.nodes.length > 0)
);

export const getCourseConfig = (courseId: string): CourseItem => {
  return COURSES.find((c) => c.id === courseId) || COURSES[0];
};
