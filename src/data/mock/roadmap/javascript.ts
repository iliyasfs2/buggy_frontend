import { Chapter } from "../../../types/roadmap";

export const JAVASCRIPT_CHAPTER_1: Chapter = {
  id: "js-ch-1",
  chapterNumber: 1,
  language: "javascript",
  title: "JavaScript Fundamentals",
  description: "First commands, storing data, and fixing your first bugs.",
  themeColor: "#E8C94A",
  nodes: [
    {
      id: "js-1-1",
      order: 1,
      title: "Hello Console",
      type: "lesson",
      status: "completed",
      xpReward: 15,
      totalSteps: 4
    },
    {
      id: "js-1-2",
      order: 2,
      title: "Storing Data (let & const)",
      type: "lesson",
      status: "current",
      xpReward: 20,
      totalSteps: 5
    },
    {
      id: "js-1-3",
      order: 3,
      title: "Working with Values (Strings & Numbers)",
      type: "lesson",
      status: "locked",
      xpReward: 20,
      totalSteps: 4
    },
    {
      id: "js-1-4",
      order: 4,
      title: "True or False (Booleans & Null)",
      type: "lesson",
      status: "locked",
      xpReward: 25,
      totalSteps: 4
    },
    {
      id: "js-1-5",
      order: 5,
      title: "Chapter 1 Boss: The Bug Hunt",
      type: "boss_challenge",
      status: "locked",
      xpReward: 35,
      totalSteps: 6
    }
  ]
};

export const JAVASCRIPT_CHAPTER_2: Chapter = {
  id: "js-ch-2",
  chapterNumber: 2,
  language: "javascript",
  title: "Functions & Arrays",
  description: "Define reusable blocks, work with lists, and modern methods.",
  themeColor: "#58CC02",
  nodes: [
    {
      id: "js-2-1",
      order: 1,
      title: "Function Declarations",
      type: "lesson",
      status: "locked",
      xpReward: 20,
      totalSteps: 4
    },
    {
      id: "js-2-2",
      order: 2,
      title: "Arrow Functions",
      type: "lesson",
      status: "locked",
      xpReward: 20,
      totalSteps: 5
    },
    {
      id: "js-2-3",
      order: 3,
      title: "Array Basics & Methods",
      type: "lesson",
      status: "locked",
      xpReward: 25,
      totalSteps: 5
    },
    {
      id: "js-2-4",
      order: 4,
      title: "Objects & Key-Values",
      type: "lesson",
      status: "locked",
      xpReward: 30,
      totalSteps: 4
    },
    {
      id: "js-2-5",
      order: 5,
      title: "Master Function Boss",
      type: "boss_challenge",
      status: "locked",
      xpReward: 40,
      totalSteps: 6
    }
  ]
};
