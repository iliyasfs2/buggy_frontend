export type SetupCategory = "monitor" | "keyboard" | "drink" | "wallArt" | "buggyHat";

export type SetupMetric = "compiledLines" | "debugRate" | "uptimeHours" | "setupScore";

export interface EquippedSlots {
  monitor: string;
  keyboard: string;
  drink: string;
  wallArt: string;
  buggyHat: string;
}

export interface WorkspaceMetrics {
  compiledLines: number;
  debugRate: number;
  uptimeHours: number;
  setupScore: number;
}

export interface GearItem {
  id: string;
  name: string;
  category: SetupCategory;
  description: string;
  unlocked: boolean;
  cost?: number;
  badge?: string;
  rarity?: "common" | "rare" | "epic" | "legendary";
  accentColor?: string;
}

export interface SetupStoreState extends WorkspaceMetrics {
  equipped: EquippedSlots;
  inventory: GearItem[];
  activeDrawerTab: "gear" | "specs";
  selectedCategory: SetupCategory | "all";
  equipItem: (category: SetupCategory, itemId: string) => void;
  incrementStats: (metric: SetupMetric, value: number) => void;
  setActiveDrawerTab: (tab: "gear" | "specs") => void;
  setSelectedCategory: (category: SetupCategory | "all") => void;
}
