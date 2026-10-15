import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  claimQuestApi,
  buyStoreItemApi,
  decreaseBatteryApi,
  rechargeBatteryApi,
  type ProgressData,
  type Quest,
} from "@/services/progressApi";
import { MOCK_JAVASCRIPT_CHAPTERS } from "@/constants/roadmap";

export type TabId = "path" | "debug" | "leaderboard" | "setup" | "store" | "profile";

export interface NavState {
  activeTab: TabId;
  streakCount: number;
  byteBalance: number;
  battery: number;
  batteryCount: number;
  maxBattery: number;
  secondsUntilNextRefill: number;
  batteryRefillAt: number | null;
  streakFreezeCount: number;
  mistakesCount: number;
  pendingMistakesCount: number;
  totalXP: number;
  completedNodesCount: number;
  jsCount: number;
  activeCourse: string;
  dailyQuests: Quest[];
  currentTrack: string;
  setActiveTab: (tab: TabId) => void;
  setTrack: (track: string) => void;
  addXp: (amount: number) => void;
  setBattery: (count: number) => void;
  setBatteryCount: (count: number) => void;
  setByteBalance: (count: number) => void;
  setMistakesCount: (count: number) => void;
  setPendingMistakesCount: (count: number) => void;
  setSecondsUntilNextRefill: (seconds: number) => void;
  decrementRefillTimer: () => void;
  rechargeBattery: () => Promise<ProgressData>;
  decreaseBattery: () => Promise<ProgressData>;
  switchCourse: (course: string) => void;
  syncNav: (data: ProgressData) => void;
  claimQuest: (questId: string) => Promise<void>;
  buyStoreItem: (itemId: string) => Promise<ProgressData>;
}

export const useNavStore = create<NavState>()(
  persist(
    (set) => ({
      activeTab: "path",
      streakCount: 0,
      byteBalance: 0,
      battery: 5,
      batteryCount: 5,
      maxBattery: 5,
      secondsUntilNextRefill: 0,
      batteryRefillAt: null,
      streakFreezeCount: 0,
      mistakesCount: 0,
      pendingMistakesCount: 0,
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
          totalXP: state.totalXP + amount,
        })),
      setBattery: (count: number) =>
        set({
          battery: count,
          batteryCount: count,
          secondsUntilNextRefill: count >= 5 ? 0 : 1800,
        }),
      setBatteryCount: (count: number) =>
        set({
          battery: count,
          batteryCount: count,
          secondsUntilNextRefill: count >= 5 ? 0 : 1800,
        }),
      setByteBalance: (count: number) => set({ byteBalance: count }),
      setMistakesCount: (count: number) =>
        set({ mistakesCount: count, pendingMistakesCount: count }),
      setPendingMistakesCount: (count: number) =>
        set({ mistakesCount: count, pendingMistakesCount: count }),
      setSecondsUntilNextRefill: (seconds: number) =>
        set({ secondsUntilNextRefill: seconds }),
      decrementRefillTimer: () =>
        set((state) => {
          if (state.battery >= 5) {
            return {
              battery: 5,
              batteryCount: 5,
              secondsUntilNextRefill: 0,
            };
          }

          if (state.secondsUntilNextRefill <= 1) {
            const nextBattery = Math.min(5, state.battery + 1);
            return {
              battery: nextBattery,
              batteryCount: nextBattery,
              secondsUntilNextRefill: nextBattery >= 5 ? 0 : 1800,
            };
          }

          return {
            secondsUntilNextRefill: state.secondsUntilNextRefill - 1,
          };
        }),
      switchCourse: (course: string) => set({ activeCourse: course }),
      rechargeBattery: async () => {
        try {
          const data = await rechargeBatteryApi();
          set((state) => ({
            ...state,
            battery: data.battery,
            batteryCount: data.battery,
            secondsUntilNextRefill: data.seconds_until_next_refill ?? 0,
            batteryRefillAt: data.battery_recharge_at ?? null,
          }));
          return data;
        } catch {
          return {} as ProgressData;
        }
      },
      decreaseBattery: async () => {
        try {
          const data = await decreaseBatteryApi();
          set((state) => ({
            ...state,
            battery: data.battery,
            batteryCount: data.battery,
            secondsUntilNextRefill:
              data.seconds_until_next_refill ?? (data.battery < 5 ? 1800 : 0),
            batteryRefillAt: data.battery_recharge_at ?? null,
          }));
          return data;
        } catch {
          return {} as ProgressData;
        }
      },
      claimQuest: async (questId: string) => {
        const data = await claimQuestApi(questId);
        set((state) => ({
          ...state,
          dailyQuests: data.daily_quests_state,
          byteBalance: data.bytes,
        }));
      },
      buyStoreItem: async (itemId: string) => {
        const data = await buyStoreItemApi(itemId);
        set((state) => ({
          ...state,
          battery: data.battery,
          batteryCount: data.battery,
          secondsUntilNextRefill:
            data.seconds_until_next_refill ?? (data.battery < 5 ? 1800 : 0),
          batteryRefillAt: data.battery_recharge_at ?? null,
          byteBalance: data.bytes,
          streakCount: data.streak,
          totalXP: data.totalXP,
          streakFreezeCount: data.streak_freeze ?? state.streakFreezeCount,
        }));
        return data;
      },
      syncNav: (data: ProgressData) =>
        set(() => {
          let completedChaptersCount = 0;
          MOCK_JAVASCRIPT_CHAPTERS.forEach((ch) => {
            const allNodesCompleted = ch.nodes?.every((node) =>
              data.completed_nodes?.includes(node.id)
            );
            if (allNodesCompleted) completedChaptersCount++;
          });
          const mistakes =
            data.unresolved_mistakes_count ?? data.mistakes_count ?? 0;
          return {
            streakCount: data.streak,
            byteBalance: data.bytes ?? data.totalXP,
            battery: data.battery,
            batteryCount: data.battery,
            maxBattery: data.max_battery ?? 5,
            secondsUntilNextRefill:
              data.seconds_until_next_refill ?? (data.battery < 5 ? 1800 : 0),
            batteryRefillAt: data.battery_recharge_at ?? null,
            streakFreezeCount: data.streak_freeze ?? 0,
            mistakesCount: mistakes,
            pendingMistakesCount: mistakes,
            totalXP: data.totalXP ?? 0,
            completedNodesCount: data.completed_nodes?.length ?? 0,
            activeCourse: data.active_course ?? "javascript",
            dailyQuests: data.daily_quests_state || [],
            jsCount: completedChaptersCount * 5,
          };
        }),
    }),
    {
      name: "buggy-nav-storage",
    }
  )
);

export const useGameStore = useNavStore;

export const selectActiveTab = (state: NavState): TabId => state.activeTab;
export const selectStreakCount = (state: NavState): number => state.streakCount;
export const selectByteBalance = (state: NavState): number => state.byteBalance;
export const selectBattery = (state: NavState): number => state.battery;
export const selectBatteryCount = (state: NavState): number => state.batteryCount;
export const selectMaxBattery = (state: NavState): number => state.maxBattery;
export const selectSecondsUntilNextRefill = (state: NavState): number =>
  state.secondsUntilNextRefill;
export const selectBatteryRefillAt = (state: NavState): number | null =>
  state.batteryRefillAt;
export const selectStreakFreezeCount = (state: NavState): number =>
  state.streakFreezeCount;
export const selectMistakesCount = (state: NavState): number =>
  state.mistakesCount;
export const selectPendingMistakesCount = (state: NavState): number =>
  state.pendingMistakesCount;
export const selectTotalXP = (state: NavState): number => state.totalXP;
export const selectCompletedNodesCount = (state: NavState): number =>
  state.completedNodesCount;
export const selectJsCount = (state: NavState): number => state.jsCount;
export const selectCurrentTrack = (state: NavState): string => state.currentTrack;
export const selectSetActiveTab = (state: NavState): ((tab: TabId) => void) =>
  state.setActiveTab;
export const selectSetTrack = (state: NavState): ((track: string) => void) =>
  state.setTrack;
export const selectActiveCourse = (state: NavState): string => state.activeCourse;
export const selectHasCompletedToday = (state: NavState) => {
  const q1 = state.dailyQuests?.find((q: Quest) => q.id === "q1");
  return q1 ? q1.current > 0 : false;
};