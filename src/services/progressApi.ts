import { getAuthToken } from "./authApi";

export interface Quest {
  id: string;
  title: string;
  current: number;
  target: number;
  reward_bytes: number;
  claimed: boolean;
}

export interface ProgressData {
  totalXP: number;
  streak: number;
  battery: number;
  bytes: number;
  streak_freeze?: number;
  active_course: string;
  completed_nodes: string[];
  unlocked_nodes: string[];
  daily_quests_date?: string;
  daily_quests_state: Quest[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const getHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept": "application/json",
  };
  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export const fetchUserProgress = async (): Promise<ProgressData> => {
  const res = await fetch(`${API_BASE_URL}/progress`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch progress");
  return res.json();
};

export const completeNode = async (
  nodeId: string,
  earnedXp: number,
  nextNodeId: string | null
): Promise<ProgressData> => {
  const res = await fetch(`${API_BASE_URL}/progress/complete-node`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ nodeId, earnedXp, nextNodeId }),
  });
  if (!res.ok) throw new Error("Failed to complete node");
  return res.json();
};

export const decreaseBatteryApi = async (): Promise<{ battery: number }> => {
  const res = await fetch(`${API_BASE_URL}/progress/decrease-battery`, {
    method: "POST",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to decrease battery");
  return res.json();
};

export const rechargeBatteryApi = async (): Promise<{ battery: number }> => {
  const res = await fetch(`${API_BASE_URL}/progress/recharge-battery`, {
    method: "POST",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to recharge battery");
  return res.json();
};

export const byteTransactionApi = async (amount: number): Promise<{ bytes: number }> => {
  const res = await fetch(`${API_BASE_URL}/bytes/transaction`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ amount }),
  });
  if (!res.ok) throw new Error("Failed to perform byte transaction");
  return res.json();
};

export const switchCourseApi = async (courseId: string): Promise<ProgressData> => {
  const res = await fetch(`${API_BASE_URL}/user/course`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ courseId }),
  });
  if (!res.ok) throw new Error("Failed to switch course");
  return res.json();
};

export const claimQuestApi = async (questId: string): Promise<ProgressData> => {
  const res = await fetch(`${API_BASE_URL}/quests/claim`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ questId }),
  });
  if (!res.ok) throw new Error("Failed to claim quest");
  return res.json();
};

export const buyStoreItemApi = async (itemId: string): Promise<ProgressData> => {
  const res = await fetch(`${API_BASE_URL}/api/store/buy`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ item_id: itemId }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || "Failed to purchase store item");
  }
  return data;
};