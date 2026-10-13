import { create } from "zustand";
import { persist } from "zustand/middleware";
import { claimQuestApi, type ProgressData } from "@/services/progressApi";
import { MOCK_JAVASCRIPT_CHAPTERS } from "@/constants/roadmap";
export type TabId = "path" | "debug" | "setup" | "store" | "profile";
export interface NavState {
  activeTab: TabId;
  streakCount: number;
  byteBalance: number;
  batteryCount: number;
  totalXP: number;
  completedNodesCount: number;
  jsCount: number;
  activeCourse: string;
  dailyQuests: import("@/services/progressApi").Quest[];
  currentTrack: string;
  setActiveTab: (tab: TabId) => void;
  setTrack: (track: string) => void;
  addXp: (amount: number) => void;
  setBatteryCount: (count: number) => void;
  setByteBalance: (count: number) => void;
  rechargeBattery: () => void;
  switchCourse: (course: string) => void;
  syncNav: (data: ProgressData) => void;
  claimQuest: (questId: string) => Promise<void>;
}
export const useNavStore = create<NavState>()(
  persist(
    (set) => ({
      activeTab: "path",
      streakCount: 0,
      byteBalance: 0,
      batteryCount: 5,
      totalXP: 0,
      completedNodesCount: 0,
      jsCount: 0,
      activeCourse: "javascript",
      dailyQuests: [],
      currentTrack: "JS",
      setActiveTab: (tab: TabId) => set({ activeTab: tab }),
      setTrack: (track: string) => set({ currentTrack: track }),
      addXp: (amount: number) =>
        set((state) => ({
          byteBalance: state.byteBalance + amount,
          totalXP: state.totalXP + amount
        })),
      setBatteryCount: (count: number) => set({ batteryCount: count }),
      setByteBalance: (count: number) => set({ byteBalance: count }),
      switchCourse: (course: string) => set({ activeCourse: course }),
      rechargeBattery: async () => {
        try {
          const res = await fetch(process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/progress/recharge-battery` : "http://localhost:8000/progress/recharge-battery", { method: "POST" });
          if (res.ok) {
            const data = await res.json();
            set({ batteryCount: data.battery });
          }
        } catch(e) {}
      },
      claimQuest: async (questId: string) => {  const data = await claimQuestApi(questId); set((state) => ({ ...state, dailyQuests: data.daily_quests_state, byteBalance: data.bytes })); },
      syncNav: (data: ProgressData) =>
        set((state) => {
          let completedChaptersCount = 0;
          MOCK_JAVASCRIPT_CHAPTERS.forEach((ch) => {
            const allNodesCompleted = ch.nodes.every(node => data.completed_nodes.includes(node.id));
            if (allNodesCompleted) completedChaptersCount++;
          });
          return {
            streakCount: data.streak,
            byteBalance: data.bytes ?? data.totalXP,
            batteryCount: data.battery,
            totalXP: data.totalXP ?? 0,
            completedNodesCount: data.completed_nodes?.length ?? 0,
            activeCourse: data.active_course ?? "javascript",
            dailyQuests: data.daily_quests_state || [],
            jsCount: completedChaptersCount * 5
          };
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
export const selectBatteryCount = (state: NavState): number => state.batteryCount;
export const selectTotalXP = (state: NavState): number => state.totalXP;
export const selectCompletedNodesCount = (state: NavState): number => state.completedNodesCount;
export const selectJsCount = (state: NavState): number => state.jsCount;
export const selectCurrentTrack = (state: NavState): string => state.currentTrack;
export const selectSetActiveTab = (state: NavState): ((tab: TabId) => void) => state.setActiveTab;
export const selectSetTrack = (state: NavState): ((track: string) => void) => state.setTrack;
export const selectActiveCourse = (state: NavState): string => state.activeCourse;
export const selectHasCompletedToday = (state: NavState) => {
  const q1 = state.dailyQuests?.find((q: import("@/services/progressApi").Quest) => q.id === "q1");
  return q1 ? q1.current > 0 : false;
};