import type { Chapter } from "@/types/roadmap";

export const MOCK_JAVASCRIPT_CHAPTERS: Chapter[] = [
  {
    id: "js-chapter-1",
    chapterNumber: 1,
    language: "javascript",
    title: "Foundations & Syntax",
    description: "Master variables, primitive data types, expressions, and logical branches.",
    themeColor: "#3b82f6",
    nodes: [
      {
        id: "node-1",
        order: 1,
        title: "Variables & Scopes",
        type: "lesson",
        status: "completed",
        xpReward: 15,
        totalSteps: 3
      },
      {
        id: "node-2",
        order: 2,
        title: "Primitive Data Types",
        type: "lesson",
        status: "completed",
        xpReward: 15,
        totalSteps: 4
      },
      {
        id: "node-3",
        order: 3,
        title: "Syntax Checkpoint",
        type: "quiz",
        status: "completed",
        xpReward: 20,
        totalSteps: 5
      },
      {
        id: "node-4",
        order: 4,
        title: "Conditionals & Logic",
        type: "lesson",
        status: "current",
        xpReward: 20,
        totalSteps: 4
      },
      {
        id: "node-5",
        order: 5,
        title: "Switch & Ternaries",
        type: "lesson",
        status: "locked",
        xpReward: 20,
        totalSteps: 3
      },
      {
        id: "node-6",
        order: 6,
        title: "Syntax Review",
        type: "quiz",
        status: "locked",
        xpReward: 25,
        totalSteps: 5
      },
      {
        id: "node-7",
        order: 7,
        title: "The Syntax Sentinel",
        type: "boss_challenge",
        status: "locked",
        xpReward: 50,
        totalSteps: 6
      }
    ]
  },
  {
    id: "js-chapter-2",
    chapterNumber: 2,
    language: "javascript",
    title: "Loops & Data Collections",
    description: "Iterate across arrays, objects, and manipulate complex data structures.",
    themeColor: "#10b981",
    nodes: [
      {
        id: "node-8",
        order: 8,
        title: "For & While Loops",
        type: "lesson",
        status: "locked",
        xpReward: 20,
        totalSteps: 4
      },
      {
        id: "node-9",
        order: 9,
        title: "Array Fundamentals",
        type: "lesson",
        status: "locked",
        xpReward: 20,
        totalSteps: 4
      },
      {
        id: "node-10",
        order: 10,
        title: "Array Slicing Quiz",
        type: "quiz",
        status: "locked",
        xpReward: 25,
        totalSteps: 5
      },
      {
        id: "node-11",
        order: 11,
        title: "Object Literals & Maps",
        type: "lesson",
        status: "locked",
        xpReward: 25,
        totalSteps: 4
      },
      {
        id: "node-12",
        order: 12,
        title: "The Infinite Loop Beast",
        type: "boss_challenge",
        status: "locked",
        xpReward: 60,
        totalSteps: 6
      }
    ]
  },
  {
    id: "js-chapter-3",
    chapterNumber: 3,
    language: "javascript",
    title: "Functional Architecture",
    description: "Dive deep into first-class functions, closures, callbacks, and array pipelines.",
    themeColor: "#8b5cf6",
    nodes: [
      {
        id: "node-13",
        order: 13,
        title: "Arrow Functions & Context",
        type: "lesson",
        status: "locked",
        xpReward: 25,
        totalSteps: 4
      },
      {
        id: "node-14",
        order: 14,
        title: "Closures & Factories",
        type: "lesson",
        status: "locked",
        xpReward: 30,
        totalSteps: 5
      },
      {
        id: "node-15",
        order: 15,
        title: "Functional Pipelines Quiz",
        type: "quiz",
        status: "locked",
        xpReward: 30,
        totalSteps: 5
      },
      {
        id: "node-16",
        order: 16,
        title: "The Callback Chimera",
        type: "boss_challenge",
        status: "locked",
        xpReward: 75,
        totalSteps: 6
      }
    ]
  }
];

export interface QuestItem {
  id: string;
  title: string;
  current: number;
  total: number;
  xpReward: number;
  completed: boolean;
}

export const MOCK_DAILY_QUESTS: QuestItem[] = [
  {
    id: "quest-1",
    title: "Earn 50 XP today",
    current: 35,
    total: 50,
    xpReward: 20,
    completed: false
  },
  {
    id: "quest-2",
    title: "Complete 2 lessons with zero errors",
    current: 2,
    total: 2,
    xpReward: 30,
    completed: true
  },
  {
    id: "quest-3",
    title: "Squash 1 bug in the Bug Vault",
    current: 0,
    total: 1,
    xpReward: 40,
    completed: false
  }
];

export interface LeaderboardRank {
  rank: number;
  name: string;
  xp: number;
  avatarColor: string;
  isCurrentUser: boolean;
}

export const MOCK_LEADERBOARD_RANKS: LeaderboardRank[] = [
  {
    rank: 1,
    name: "Alex Byte",
    xp: 420,
    avatarColor: "bg-emerald-500",
    isCurrentUser: false
  },
  {
    rank: 2,
    name: "Sarah Code",
    xp: 380,
    avatarColor: "bg-purple-500",
    isCurrentUser: false
  },
  {
    rank: 3,
    name: "Neo Coder",
    xp: 345,
    avatarColor: "bg-amber-500",
    isCurrentUser: false
  },
  {
    rank: 4,
    name: "You (Bug Hunter)",
    xp: 310,
    avatarColor: "bg-sky-500",
    isCurrentUser: true
  },
  {
    rank: 5,
    name: "Devon Pixel",
    xp: 290,
    avatarColor: "bg-pink-500",
    isCurrentUser: false
  }
];
