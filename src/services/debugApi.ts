import { getAuthToken } from "./authApi";

export interface MistakeItem {
  id: number;
  user_id: string;
  node_id: string;
  lesson_title: string;
  question_title: string;
  code_snippet: string;
  user_answer: string;
  correct_answer: string;
  explanation: string;
  status: "pending" | "resolved";
  created_at?: string;
}

export interface MistakesResponse {
  mistakes: MistakeItem[];
  count: number;
}

export interface ResolveMistakeResponse {
  success: boolean;
  resolved_id: number;
  remaining_count: number;
  reward_bytes: number;
  progress?: import("./progressApi").ProgressData;
}

export interface DebugStats {
  pending_mistakes_count: number;
  resolved_mistakes_count: number;
  reading_exercises_count: number;
  refactor_exercises_count: number;
  stories_count: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const getHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export const fetchMistakesApi = async (): Promise<MistakesResponse> => {
  const res = await fetch(`${API_BASE_URL}/api/debug/mistakes`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch mistakes");
  return res.json();
};

export const resolveMistakeApi = async (mistakeId: number): Promise<ResolveMistakeResponse> => {
  const res = await fetch(`${API_BASE_URL}/api/debug/mistakes/${mistakeId}/resolve`, {
    method: "POST",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to resolve mistake");
  return res.json();
};

export const fetchDebugStatsApi = async (): Promise<DebugStats> => {
  const res = await fetch(`${API_BASE_URL}/api/debug/stats`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch debug stats");
  return res.json();
};
