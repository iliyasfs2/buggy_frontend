import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProgressData } from "@/services/progressApi";

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
  addXp: (amount: number) => void;
  syncNav: (data: ProgressData) => void;
}

export const useNavStore = create<NavState>()(
  persist(
    (set) => ({
      activeTab: "path",
      streakCount: 14,
      byteBalance: 1250,
      batteryCount: "5/5",
      jsCount: 12,
      currentTrack: "JS",
      setActiveTab: (tab: TabId) => set({ activeTab: tab }),
      setTrack: (track: string) => set({ currentTrack: track }),
      addXp: (amount: number) =>
        set((state) => ({
          byteBalance: state.byteBalance + amount,
          jsCount: state.jsCount + 1
        })),
      syncNav: (data: ProgressData) =>
        set({
          streakCount: data.streak,
          byteBalance: data.totalXP,
          batteryCount: `${data.battery}/5`
        })
    }),
    {
      name: "buggy-nav-storage",
    }
  )
);

export const selectActiveTab = (state: NavState): TabId => state.activeTab;
export const selectStreakCount = (state: NavState): number => state.streakCount;
export const selectByteBalance = (state: NavState): number => state.byteBalance;
export const selectBatteryCount = (state: NavState): number | string => state.batteryCount;
export const selectJsCount = (state: NavState): number => state.jsCount;
export const selectCurrentTrack = (state: NavState): string => state.currentTrack;
export const selectSetActiveTab = (state: NavState): ((tab: TabId) => void) => state.setActiveTab;
export const selectSetTrack = (state: NavState): ((track: string) => void) => state.setTrack;
