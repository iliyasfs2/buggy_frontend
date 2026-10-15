import { create } from "zustand";
import {
  UserProfile,
  AvatarConfig,
  RegisterPayload,
  LoginPayload,
  registerApi,
  loginApi,
  getMeApi,
  updateAvatarApi,
  getAuthToken,
  setAuthToken,
  removeAuthToken,
} from "@/services/authApi";
import { useNavStore } from "./useNavStore";
import { useRoadmapStore } from "./useRoadmapStore";
import { fetchUserProgress } from "@/services/progressApi";

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  initAuth: () => Promise<void>;
  updateAvatar: (avatar: AvatarConfig) => Promise<void>;
  setUser: (user: UserProfile) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  setUser: (user: UserProfile) => set({ user }),

  login: async (payload: LoginPayload) => {
    set({ isLoading: true });
    try {
      const res = await loginApi(payload);
      setAuthToken(res.access_token);
      set({
        token: res.access_token,
        user: res.user,
        isAuthenticated: true,
        isInitialized: true,
      });

      const progress = await fetchUserProgress();
      useNavStore.getState().syncNav(progress);
      useRoadmapStore.getState().syncProgress(progress);
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (payload: RegisterPayload) => {
    set({ isLoading: true });
    try {
      const res = await registerApi(payload);
      setAuthToken(res.access_token);
      set({
        token: res.access_token,
        user: res.user,
        isAuthenticated: true,
        isInitialized: true,
      });

      const progress = await fetchUserProgress();
      useNavStore.getState().syncNav(progress);
      useRoadmapStore.getState().syncProgress(progress);
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    removeAuthToken();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isInitialized: true,
    });
    try {
      const progress = await fetchUserProgress();
      useNavStore.getState().syncNav(progress);
      useRoadmapStore.getState().syncProgress(progress);
    } catch {}
  },

  initAuth: async () => {
    const token = getAuthToken();
    if (!token) {
      set({ isInitialized: true, isAuthenticated: false, token: null, user: null });
      return;
    }

    try {
      const user = await getMeApi(token);
      set({
        token,
        user,
        isAuthenticated: true,
        isInitialized: true,
      });
      try {
        const progress = await fetchUserProgress();
        useNavStore.getState().syncNav(progress);
        useRoadmapStore.getState().syncProgress(progress);
      } catch {}
    } catch {
      removeAuthToken();
      set({ token: null, user: null, isAuthenticated: false, isInitialized: true });
    }
  },

  updateAvatar: async (avatar: AvatarConfig) => {
    try {
      const res = await updateAvatarApi(avatar);
      set({ user: res.user });
    } catch {
      set((state) => ({
        user: state.user
          ? {
              ...state.user,
              avatar,
              avatar_config: avatar,
            }
          : null,
      }));
    }
  },
}));
