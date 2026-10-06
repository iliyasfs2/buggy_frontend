import type { Chapter } from "@/types/roadmap";
import { JAVASCRIPT_CHAPTER_1, JAVASCRIPT_CHAPTER_2 } from "@/data/mock/roadmap/javascript";

export { JAVASCRIPT_CHAPTER_1, JAVASCRIPT_CHAPTER_2 };

export const MOCK_JAVASCRIPT_CHAPTERS: Chapter[] = [
  JAVASCRIPT_CHAPTER_1,
  JAVASCRIPT_CHAPTER_2
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
