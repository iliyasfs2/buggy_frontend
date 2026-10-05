import { Chapter } from "../../../types/roadmap";

export const JAVASCRIPT_CHAPTER_1: Chapter = {
  id: "js-ch-1",
  chapterNumber: 1,
  language: "javascript",
  title: "Chapter 1: JavaScript Fundamentals",
  description: "Variables, data types, and basic operations",
  themeColor: "#f59e0b",
  nodes: [
    {
      id: "js-1-1",
      order: 1,
      title: "Variables (let & const)",
      type: "lesson",
      status: "completed",
      xpReward: 15,
      totalSteps: 4
    },
    {
      id: "js-1-2",
      order: 2,
      title: "Data Types",
      type: "lesson",
      status: "current",
      xpReward: 20,
      totalSteps: 5
    },
    {
      id: "js-1-3",
      order: 3,
      title: "Operators & Expressions",
      type: "lesson",
      status: "locked",
      xpReward: 20,
      totalSteps: 4
    },
    {
      id: "js-1-4",
      order: 4,
      title: "Chapter 1 Boss Challenge",
      type: "boss_challenge",
      status: "locked",
      xpReward: 35,
      totalSteps: 6
    }
  ]
};
