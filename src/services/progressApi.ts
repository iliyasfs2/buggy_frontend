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
  active_course: string;
    completed_nodes: string[];
  unlocked_nodes: string[];
  daily_quests_date?: string;
  daily_quests_state: import("@/services/progressApi").Quest[];
}
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const fetchUserProgress = async (): Promise<ProgressData> => {
  const res = await fetch(`${API_BASE_URL}/progress`, {
    headers: {
      "Accept": "application/json",
    }
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
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({ nodeId, earnedXp, nextNodeId })
  });
  if (!res.ok) throw new Error("Failed to complete node");
  return res.json();
};
export const decreaseBatteryApi = async (): Promise<{ battery: number }> => {
  const res = await fetch(`${API_BASE_URL}/progress/decrease-battery`, {
    method: "POST",
    headers: { "Accept": "application/json" }
  });
  if (!res.ok) throw new Error("Failed to decrease battery");
  return res.json();
};
export const rechargeBatteryApi = async (): Promise<{ battery: number }> => {
  const res = await fetch(`${API_BASE_URL}/progress/recharge-battery`, {
    method: "POST",
    headers: { "Accept": "application/json" }
  });
  if (!res.ok) throw new Error("Failed to recharge battery");
  return res.json();
};
export const byteTransactionApi = async (amount: number): Promise<{ bytes: number }> => {
  const res = await fetch(`${API_BASE_URL}/bytes/transaction`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({ amount })
  });
  if (!res.ok) throw new Error("Failed to perform byte transaction");
  return res.json();
};
export const switchCourseApi = async (courseId: string): Promise<ProgressData> => {
  const res = await fetch(`${API_BASE_URL}/user/course`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({ courseId })
  });
  if (!res.ok) throw new Error("Failed to switch course");
  return res.json();
};
export const claimQuestApi = async (questId: string): Promise<ProgressData> => {
  const res = await fetch(`${API_BASE_URL}/quests/claim`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({ questId })
  });
  if (!res.ok) throw new Error("Failed to claim quest");
  return res.json();
};