import { getAuthToken, type AvatarConfig } from "./authApi";

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
  season_xp?: number;
  streak: number;
  battery: number;
  max_battery?: number;
  seconds_until_next_refill?: number;
  unresolved_mistakes_count?: number;
  battery_recharge_at?: number | null;
  bytes: number;
  streak_freeze?: number;
  streak_increased?: boolean;
  last_active_date?: string | null;
  active_course: string;
  completed_nodes: string[];
  unlocked_nodes: string[];
  daily_quests_date?: string;
  daily_quests_state: Quest[];
  mistakes_count?: number;
}

export interface SeasonRewards {
  first: number;
  second: number;
  third: number;
}

export interface SeasonData {
  season_number: number;
  title: string;
  description: string;
  end_time: string;
  seconds_left: number;
  rewards: SeasonRewards;
}

export interface LeaderboardUserEntry {
  rank: number;
  id: string;
  username: string;
  coder_title: string;
  season_xp: number;
  streak: number;
  avatar_config?: AvatarConfig;
  is_current_user: boolean;
}

export interface CurrentUserLeaderboardInfo {
  id: string;
  username: string;
  rank: number;
  season_xp: number;
  total_xp: number;
  streak: number;
  coder_title: string;
  avatar_config?: AvatarConfig;
  is_top: boolean;
}

export interface LeaderboardResponse {
  season: SeasonData;
  current_user: CurrentUserLeaderboardInfo;
  leaderboard: LeaderboardUserEntry[];
}

export interface UserProfileData {
  id: string;
  username: string;
  avatar_config?: AvatarConfig;
  joined_at: string;
  streak: number;
  total_xp: number;
  season_xp: number;
  current_rank: number;
  rank_title: string | null;
  followers_count: number;
  following_count: number;
  is_following: boolean;
  is_me: boolean;
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
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const res = await fetch(`${API_BASE_URL}/progress`, {
      headers: getHeaders(),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error("Failed to fetch progress");
    return res.json();
  } finally {
    clearTimeout(timeoutId);
  }
};

export interface CompleteNodePayload {
  nodeId: string;
  earnedXp: number;
  nextNodeId?: string | null;
  flawless?: boolean;
  earnedBytes?: number;
  mode?: string;
}

export const completeNode = async (
  nodeIdOrPayload: string | CompleteNodePayload,
  earnedXp?: number,
  nextNodeId?: string | null,
  options?: { flawless?: boolean; earnedBytes?: number; mode?: string }
): Promise<ProgressData> => {
  const body: CompleteNodePayload =
    typeof nodeIdOrPayload === "string"
      ? {
          nodeId: nodeIdOrPayload,
          earnedXp: earnedXp ?? 0,
          nextNodeId: nextNodeId ?? null,
          flawless: options?.flawless ?? false,
          earnedBytes: options?.earnedBytes ?? 0,
          mode: options?.mode,
        }
      : nodeIdOrPayload;

  const res = await fetch(`${API_BASE_URL}/progress/complete-node`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to complete node");
  return res.json();
};

export const decreaseBatteryApi = async (): Promise<ProgressData> => {
  const res = await fetch(`${API_BASE_URL}/progress/decrease-battery`, {
    method: "POST",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to decrease battery");
  return res.json();
};

export const rechargeBatteryApi = async (): Promise<ProgressData> => {
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

export const fetchLeaderboardApi = async (): Promise<LeaderboardResponse> => {
  const res = await fetch(`${API_BASE_URL}/api/leaderboard`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch leaderboard");
  return res.json();
};

export const simulateSeasonEndApi = async (): Promise<{ success: boolean; season: SeasonData; user_progress: ProgressData }> => {
  const res = await fetch(`${API_BASE_URL}/api/dev/simulate-season-end`, {
    method: "POST",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to simulate season end");
  return res.json();
};

export const fetchUserProfileApi = async (userId: string): Promise<UserProfileData> => {
  const res = await fetch(`${API_BASE_URL}/api/users/${userId}/profile`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch user profile");
  return res.json();
};

export const followUserApi = async (userId: string): Promise<{ success: boolean; is_following: boolean; followers_count: number }> => {
  const res = await fetch(`${API_BASE_URL}/api/users/${userId}/follow`, {
    method: "POST",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to follow user");
  return res.json();
};

export const unfollowUserApi = async (userId: string): Promise<{ success: boolean; is_following: boolean; followers_count: number }> => {
  const res = await fetch(`${API_BASE_URL}/api/users/${userId}/follow`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to unfollow user");
  return res.json();
};