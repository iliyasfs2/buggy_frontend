import { create } from "zustand";
import type { SetupCategory, SetupMetric, GearItem, SetupStoreState } from "@/types/setup";

export const INITIAL_GEAR_INVENTORY: GearItem[] = [
  {
    id: "laptop_standard",
    name: "MacBook Neo 16\"",
    category: "monitor",
    description: "Sleek Retina workspace with minimal dark code editor and status bar",
    unlocked: true,
    rarity: "common",
    accentColor: "#38bdf8"
  },
  {
    id: "dual_curved",
    name: "Dual Curved 4K",
    category: "monitor",
    description: "Panoramic ultra-wide dual screens running split IDE and live debug graph",
    unlocked: true,
    rarity: "rare",
    accentColor: "#818cf8"
  },
  {
    id: "cyber_hologram",
    name: "Cyber Hologram HUD",
    category: "monitor",
    description: "Floating neon syntax projection with wireframe AST debugger",
    unlocked: true,
    rarity: "legendary",
    accentColor: "#f43f5e"
  },
  {
    id: "retro_crt",
    name: "Vintage CRT 90s",
    category: "monitor",
    description: "Curved cathode green phosphor terminal with retro scanlines",
    unlocked: true,
    rarity: "epic",
    accentColor: "#22c55e"
  },
  {
    id: "slate_compact",
    name: "Slate 65% Mech",
    category: "keyboard",
    description: "Lubed linear switches with stealth dark slate keycaps",
    unlocked: true,
    rarity: "common",
    accentColor: "#64748b"
  },
  {
    id: "cyber_rgb",
    name: "Cyberpunk Split",
    category: "keyboard",
    description: "Ergonomic split keyboard with animated neon underglow matrix",
    unlocked: true,
    rarity: "epic",
    accentColor: "#ec4899"
  },
  {
    id: "vintage_beige",
    name: "Model M Clicky",
    category: "keyboard",
    description: "Classic tactile buckling spring with iconic red ESC keycap",
    unlocked: true,
    rarity: "rare",
    accentColor: "#e2e8f0"
  },
  {
    id: "hot_coffee",
    name: "Dark Roast Mug",
    category: "drink",
    description: "Freshly brewed dark espresso with continuous hot steam",
    unlocked: true,
    rarity: "common",
    accentColor: "#f59e0b"
  },
  {
    id: "boba_tea",
    name: "Cyber Matcha Boba",
    category: "drink",
    description: "Cold green tea with giant boba straw and ice cubes",
    unlocked: true,
    rarity: "rare",
    accentColor: "#10b981"
  },
  {
    id: "energy_drink",
    name: "Byte Surge Can",
    category: "drink",
    description: "Electro-charged carbonated energy fuel with glowing glyphs",
    unlocked: true,
    rarity: "epic",
    accentColor: "#06b6d4"
  },
  {
    id: "js_matrix",
    name: "JS Matrix Wall",
    category: "wallArt",
    description: "Cascading JavaScript syntax rain and glowing token waterfall",
    unlocked: true,
    rarity: "common",
    accentColor: "#eab308"
  },
  {
    id: "cyber_city",
    name: "Neo-Tokyo Pixel",
    category: "wallArt",
    description: "Synthwave glowing pixel city skyline with neon sunset",
    unlocked: true,
    rarity: "rare",
    accentColor: "#d946ef"
  },
  {
    id: "git_branch",
    name: "Git Flow Blueprint",
    category: "wallArt",
    description: "Minimalist glowing commit tree and release merge graph",
    unlocked: true,
    rarity: "rare",
    accentColor: "#3b82f6"
  },
  {
    id: "bug_bounty",
    name: "Bug Hunter Plaque",
    category: "wallArt",
    description: "Gold framed trophy for zero-day bug squashing excellence",
    unlocked: true,
    rarity: "legendary",
    accentColor: "#eab308"
  },
  {
    id: "none",
    name: "Clean Antenna",
    category: "buggyHat",
    description: "Natural Buggy look with dual responsive wiggle antennae",
    unlocked: true,
    rarity: "common",
    accentColor: "#94a3b8"
  },
  {
    id: "wizard_hat",
    name: "Archmage Cap",
    category: "buggyHat",
    description: "Pointy purple wizard hat with glowing gold stars",
    unlocked: true,
    rarity: "legendary",
    accentColor: "#a855f7"
  },
  {
    id: "beanie_dev",
    name: "Rust Beanie",
    category: "buggyHat",
    description: "Cozy knit developer beanie for late night debugging sessions",
    unlocked: true,
    rarity: "rare",
    accentColor: "#f97316"
  },
  {
    id: "cyber_visor",
    name: "AR Cyber Visor",
    category: "buggyHat",
    description: "Sleek glowing cyan optical visor with scrolling data HUD",
    unlocked: true,
    rarity: "epic",
    accentColor: "#06b6d4"
  },
  {
    id: "party_crown",
    name: "Release Crown",
    category: "buggyHat",
    description: "Golden jeweled crown for shipping stable releases",
    unlocked: true,
    rarity: "legendary",
    accentColor: "#eab308"
  }
];

export const useSetupStore = create<SetupStoreState>((set) => ({
  equipped: {
    monitor: "laptop_standard",
    keyboard: "slate_compact",
    drink: "hot_coffee",
    wallArt: "js_matrix",
    buggyHat: "none"
  },
  inventory: INITIAL_GEAR_INVENTORY,
  compiledLines: 1420,
  debugRate: 94,
  uptimeHours: 38,
  setupScore: 3,
  activeDrawerTab: "gear",
  selectedCategory: "all",
  equipItem: (category: SetupCategory, itemId: string) =>
    set((state) => ({
      equipped: {
        ...state.equipped,
        [category]: itemId
      }
    })),
  incrementStats: (metric: SetupMetric, value: number) =>
    set((state) => ({
      [metric]: Math.max(0, state[metric] + value)
    })),
  setActiveDrawerTab: (tab: "gear" | "specs") => set({ activeDrawerTab: tab }),
  setSelectedCategory: (category: SetupCategory | "all") => set({ selectedCategory: category })
}));
