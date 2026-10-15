export interface AvatarConfig {
  skin_color?: string;
  hair_style?: "short_wavy" | "short_curly" | "sleek" | "parted" | "bald" | string;
  hair_color?: string;
  eye_style?: "round" | "happy" | "focus" | "wink" | string;
  expression?: "happy" | "smile" | "open" | "neutral" | string;
  accessory?: "none" | "yellow_glasses" | "headphones" | string;
  shirt_color?: string;
  bg_color?: string;
  presetId?: string;
  bodyColor?: string;
  clothing?: string;
}

export const DEFAULT_AVATAR_CONFIG: Required<
  Omit<AvatarConfig, "presetId" | "bodyColor" | "clothing">
> = {
  skin_color: "#FCD34D",
  hair_style: "short_wavy",
  hair_color: "#1E293B",
  eye_style: "round",
  expression: "happy",
  accessory: "yellow_glasses",
  shirt_color: "#0284C7",
  bg_color: "#0F172A",
};

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  age?: number;
  created_at?: string;
  avatar?: AvatarConfig;
  avatar_config?: AvatarConfig;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: UserProfile;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  age?: number;
}

export interface LoginPayload {
  login: string;
  password: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const TOKEN_KEY = "buggy_auth_token";

export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setAuthToken = (token: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeAuthToken = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
};

export const registerApi = async (payload: RegisterPayload): Promise<AuthResponse> => {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || "Registration failed");
  }
  return data;
};

export const loginApi = async (payload: LoginPayload): Promise<AuthResponse> => {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || "Login failed");
  }
  return data;
};

export const getMeApi = async (token?: string): Promise<UserProfile> => {
  const activeToken = token || getAuthToken();
  if (!activeToken) throw new Error("No token found");

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        "Authorization": `Bearer ${activeToken}`,
      },
      signal: controller.signal,
    });

    const data = await res.json();
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        removeAuthToken();
      }
      throw new Error(data.detail || "Failed to fetch user");
    }
    return data;
  } finally {
    clearTimeout(timeoutId);
  }
};

export const updateAvatarApi = async (
  avatar: AvatarConfig
): Promise<{ user: UserProfile; avatar_config?: AvatarConfig }> => {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/api/user/avatar`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ avatar_config: avatar, ...avatar }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || "Failed to update avatar");
  }
  return data;
};

export const updateUsernameApi = async (
  username: string
): Promise<{ success: boolean; user: UserProfile }> => {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/api/user/username`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ username }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || "Failed to update username");
  }
  return data;
};

export const updateEmailApi = async (
  email: string
): Promise<{ success: boolean; user: UserProfile }> => {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/api/user/email`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || "Failed to update email");
  }
  return data;
};

export const changePasswordApi = async (
  current_password: string,
  new_password: string
): Promise<{ success: boolean; message: string }> => {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/api/user/password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ current_password, new_password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || "Failed to change password");
  }
  return data;
};
