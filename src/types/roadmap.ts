export type NodeStatus = "completed" | "current" | "locked";
export type NodeType = "lesson" | "quiz" | "boss_challenge";

export interface PathNode {
  id: string;
  order: number;
  title: string;
  type: NodeType;
  status: NodeStatus;
  xpReward: number;
  totalSteps: number;
}

export interface Chapter {
  id: string;
  chapterNumber: number;
  language: "javascript" | "python";
  title: string;
  description: string;
  themeColor: string;
  nodes: PathNode[];
}

export interface RoadmapProgress {
  totalNodes: number;
  completedNodes: number;
  totalXpEarned: number;
  currentStreak: number;
}
