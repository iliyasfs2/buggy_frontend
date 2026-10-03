"use client";

import type { ReactElement } from "react";
import { useSetupStore } from "@/store/useSetupStore";
import type { SetupCategory, GearItem } from "@/types/setup";
import { Check, Monitor, Keyboard, Coffee, Image as ImageIcon, Sparkles, Crown } from "lucide-react";

const CATEGORY_TABS: { id: SetupCategory | "all"; label: string; icon: typeof Monitor }[] = [
  { id: "all", label: "All Gear", icon: Sparkles },
  { id: "monitor", label: "Monitors", icon: Monitor },
  { id: "keyboard", label: "Keyboards", icon: Keyboard },
  { id: "drink", label: "Drinks", icon: Coffee },
  { id: "wallArt", label: "Wall Art", icon: ImageIcon },
  { id: "buggyHat", label: "Hats", icon: Crown }
];

export function GearInventory(): ReactElement {
  const inventory = useSetupStore((state) => state.inventory);
  const equipped = useSetupStore((state) => state.equipped);
  const selectedCategory = useSetupStore((state) => state.selectedCategory);
  const equipItem = useSetupStore((state) => state.equipItem);
  const setSelectedCategory = useSetupStore((state) => state.setSelectedCategory);

  const filteredItems = inventory.filter((item) => {
    if (selectedCategory === "all") return true;
    return item.category === selectedCategory;
  });

  const getRarityBadgeColor = (rarity: GearItem["rarity"]): string => {
    switch (rarity) {
      case "legendary":
        return "bg-amber-950/80 text-amber-300 border-amber-500/50";
      case "epic":
        return "bg-purple-950/80 text-purple-300 border-purple-500/50";
      case "rare":
        return "bg-blue-950/80 text-blue-300 border-blue-500/50";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORY_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = selectedCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/20"
                  : "bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/80"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredItems.map((item) => {
          const isEquipped = equipped[item.category] === item.id;
          return (
            <div
              key={item.id}
              onClick={() => equipItem(item.category, item.id)}
              className={`group relative flex flex-col justify-between p-3.5 rounded-xl border-2 transition-all cursor-pointer select-none ${
                isEquipped
                  ? "bg-[#162235] border-sky-400/90 shadow-[0_0_15px_rgba(56,189,248,0.25)]"
                  : "bg-slate-900/80 hover:bg-slate-800/90 border-slate-700/80 hover:border-slate-600"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.accentColor || "#38bdf8" }}
                  />
                  <h3 className="font-semibold text-sm text-slate-100 group-hover:text-sky-300 transition-colors">
                    {item.name}
                  </h3>
                </div>

                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${getRarityBadgeColor(
                    item.rarity
                  )}`}
                >
                  {item.rarity || "common"}
                </span>
              </div>

              <p className="text-xs text-slate-400 mb-3 line-clamp-2 leading-relaxed">
                {item.description}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                  {item.category}
                </span>

                {isEquipped ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-sky-400 font-mono">
                    <Check className="w-3.5 h-3.5" />
                    EQUIPPED
                  </span>
                ) : (
                  <span className="text-xs font-medium text-slate-400 group-hover:text-slate-200">
                    Equip Gear
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
