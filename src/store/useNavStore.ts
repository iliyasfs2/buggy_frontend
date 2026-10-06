import { create } from "zustand";

export type TabId = "path" | "debug" | "setup" | "store" | "profile";

export interface NavState {
  activeTab: TabId;
  streakCount: number;
  byteBalance: number;
  batteryCount: number | string;
  jsCount: number;
  currentTrack: string;
  setActiveTab: (tab: TabId) => void;
  setTrack: (track: string) => void;
}

export const useNavStore = create<NavState>((set) => ({
  activeTab: "path",
  streakCount: 14,
  byteBalance: 1250,
  batteryCount: "5/5",
  jsCount: 12,
  currentTrack: "JS",
  setActiveTab: (tab: TabId) => set({ activeTab: tab }),
  setTrack: (track: string) => set({ currentTrack: track })
}));

export const selectActiveTab = (state: NavState): TabId => state.activeTab;
export const selectStreakCount = (state: NavState): number => state.streakCount;
export const selectByteBalance = (state: NavState): number => state.byteBalance;
export const selectBatteryCount = (state: NavState): number | string => state.batteryCount;
export const selectJsCount = (state: NavState): number => state.jsCount;
export const selectCurrentTrack = (state: NavState): string => state.currentTrack;
export const selectSetActiveTab = (state: NavState): ((tab: TabId) => void) => state.setActiveTab;
export const selectSetTrack = (state: NavState): ((track: string) => void) => state.setTrack;
