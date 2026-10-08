export interface ProgressData {
  totalXP: number;
  streak: number;
  battery: number;
  completed_nodes: string[];
  unlocked_nodes: string[];
}

export const fetchUserProgress = async (): Promise<ProgressData> => {
  const res = await fetch("/api/progress");
  if (!res.ok) throw new Error("Failed to fetch progress");
  return res.json();
};

export const completeNode = async (
  nodeId: string,
  earnedXp: number,
  nextNodeId: string | null
): Promise<ProgressData> => {
  const res = await fetch("/api/progress/complete-node", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ nodeId, earnedXp, nextNodeId })
  });
  if (!res.ok) throw new Error("Failed to complete node");
  return res.json();
};
