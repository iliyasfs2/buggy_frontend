"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import type { AvatarConfig } from "@/services/authApi";
import { DEFAULT_AVATAR_CONFIG } from "@/services/authApi";
import { AvatarRenderer } from "./AvatarRenderer";
import { useAuthStore } from "@/store/useAuthStore";
import { soundEffects } from "@/utils/soundEffects";

interface AvatarCustomizerProps {
  initialConfig?: AvatarConfig | null;
  onSaved?: () => void;
  className?: string;
}

type TabType =
  | "skin"
  | "hair_style"
  | "hair_color"
  | "face"
  | "accessory"
  | "clothing"
  | "background";

interface TabItem {
  id: TabType;
  label: string;
  icon: string;
}

const TABS: TabItem[] = [
  { id: "skin", label: "Skin", icon: "🎨" },
  { id: "hair_style", label: "Hair Style", icon: "✂️" },
  { id: "hair_color", label: "Hair Color", icon: "💈" },
  { id: "face", label: "Face", icon: "😊" },
  { id: "accessory", label: "Accessories", icon: "👓" },
  { id: "clothing", label: "Clothing", icon: "👕" },
  { id: "background", label: "Background", icon: "🖼️" },
];

const SKIN_COLORS = [
  { value: "#FCD34D", label: "Buggy Gold" },
  { value: "#FDE68A", label: "Light Almond" },
  { value: "#FED7AA", label: "Warm Peach" },
  { value: "#FEF08A", label: "Fair Cream" },
  { value: "#F59E0B", label: "Golden Tan" },
  { value: "#D97706", label: "Caramel" },
  { value: "#92400E", label: "Deep Bronze" },
  { value: "#78350F", label: "Espresso" },
];

const HAIR_STYLES = [
  { value: "short_wavy", label: "Short Wavy" },
  { value: "short_curly", label: "Curly" },
  { value: "sleek", label: "Sleek" },
  { value: "parted", label: "Parted" },
  { value: "bald", label: "Bald" },
];

const HAIR_COLORS = [
  { value: "#1E293B", label: "Midnight Black" },
  { value: "#451A03", label: "Dark Brown" },
  { value: "#78350F", label: "Chestnut" },
  { value: "#F59E0B", label: "Golden Blonde" },
  { value: "#94A3B8", label: "Silver" },
  { value: "#06B6D4", label: "Teal" },
  { value: "#EC4899", label: "Pink" },
  { value: "#10B981", label: "Emerald" },
];

const EYE_STYLES = [
  { value: "round", label: "Round" },
  { value: "happy", label: "Happy" },
  { value: "focus", label: "Focus" },
  { value: "wink", label: "Wink" },
];

const EXPRESSIONS = [
  { value: "happy", label: "Happy" },
  { value: "smile", label: "Smile" },
  { value: "open", label: "Open" },
  { value: "neutral", label: "Neutral" },
];

const ACCESSORIES = [
  { value: "none", label: "None" },
  { value: "yellow_glasses", label: "Yellow Glasses" },
  { value: "headphones", label: "Headphones" },
];

const SHIRT_COLORS = [
  { value: "#0284C7", label: "Buggy Blue" },
  { value: "#6366F1", label: "Indigo" },
  { value: "#10B981", label: "Emerald" },
  { value: "#F59E0B", label: "Amber Gold" },
  { value: "#EF4444", label: "Crimson" },
  { value: "#8B5CF6", label: "Violet" },
  { value: "#334155", label: "Slate" },
  { value: "#F8FAFC", label: "White" },
];

const BG_COLORS = [
  { value: "#0F172A", label: "Midnight Slate" },
  { value: "#1E1B4B", label: "Deep Navy" },
  { value: "#3B0764", label: "Royal Purple" },
  { value: "#064E3B", label: "Dark Emerald" },
  { value: "#451A03", label: "Chocolate" },
  { value: "#18181B", label: "Charcoal" },
  { value: "#0C4A6E", label: "Ocean Blue" },
  { value: "#4C0519", label: "Ruby Crimson" },
];

export function AvatarCustomizer({
  initialConfig,
  onSaved,
  className = "",
}: AvatarCustomizerProps) {
  const { user, updateAvatar } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>("skin");
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const baseConfig: AvatarConfig = {
    ...DEFAULT_AVATAR_CONFIG,
    ...(user?.avatar_config || user?.avatar || {}),
    ...(initialConfig || {}),
  };

  const [draft, setDraft] = useState<AvatarConfig>(baseConfig);

  const handleUpdate = (field: keyof AvatarConfig, val: string) => {
    soundEffects.playSoftClick();
    setDraft((prev) => ({
      ...prev,
      [field]: val,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      soundEffects.playSoftClick();
      await updateAvatar(draft);
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 2000);
      if (onSaved) {
        onSaved();
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`w-full flex flex-col items-center select-none ${className}`}>
      <div className="w-full sticky top-0 z-20 pt-1 pb-4 bg-slate-950/95 backdrop-blur-md flex flex-col items-center">
        <div className="relative group p-4 rounded-3xl bg-slate-900/90 border-2 border-slate-800 shadow-2xl flex flex-col items-center">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-blue-500/10 via-transparent to-purple-500/10 pointer-events-none" />
          
          <div className="relative p-1 rounded-full ring-4 ring-slate-800/80 shadow-inner">
            <AvatarRenderer config={draft} size={150} />
          </div>

          <span className="mt-2.5 text-[11px] font-black uppercase tracking-wider text-slate-400">
            Live Avatar Preview
          </span>
        </div>

        {showSavedToast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute -bottom-2 bg-emerald-500 text-slate-950 px-4 py-1.5 rounded-full text-xs font-black shadow-lg flex items-center gap-1.5"
          >
            <span>✓</span> Changes saved successfully!
          </motion.div>
        )}
      </div>

      <div className="w-full mt-2 mb-4 overflow-x-auto no-scrollbar py-1">
        <div className="flex items-center gap-2 px-1 min-w-max mx-auto justify-center">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundEffects.playSoftClick();
                  setActiveTab(tab.id);
                }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg border-b-4 border-blue-800 translate-y-[-1px]"
                    : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800/80 border-b-4 border-slate-950"
                }`}
              >
                <span className="text-sm">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="w-full max-w-lg p-5 rounded-3xl bg-slate-900/80 border-2 border-slate-800/80 min-h-[220px] flex flex-col justify-center">
        {activeTab === "skin" && (
          <div className="grid grid-cols-4 sm:grid-cols-4 gap-3 place-items-center">
            {SKIN_COLORS.map((item) => {
              const isSelected = draft.skin_color === item.value;
              return (
                <button
                  key={item.value}
                  onClick={() => handleUpdate("skin_color", item.value)}
                  className={`relative w-14 h-14 rounded-2xl transition-transform active:scale-95 flex items-center justify-center cursor-pointer shadow-md ${
                    isSelected
                      ? "ring-4 ring-offset-2 ring-blue-500 ring-offset-slate-900 scale-105"
                      : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: item.value }}
                  title={item.label}
                >
                  {isSelected && (
                    <span className="text-slate-900 font-black text-sm drop-shadow">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {activeTab === "hair_style" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {HAIR_STYLES.map((item) => {
              const isSelected = draft.hair_style === item.value;
              return (
                <button
                  key={item.value}
                  onClick={() => handleUpdate("hair_style", item.value)}
                  className={`p-3 rounded-2xl flex flex-col items-center gap-2 transition-all cursor-pointer text-center ${
                    isSelected
                      ? "bg-blue-600/20 border-2 border-b-4 border-blue-500 text-white"
                      : "bg-slate-800/70 hover:bg-slate-800 border-2 border-b-4 border-slate-800 text-slate-300"
                  }`}
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-slate-950/60">
                    <AvatarRenderer
                      config={{ ...draft, hair_style: item.value, accessory: "none" }}
                      size={54}
                    />
                  </div>
                  <span className="text-xs font-bold truncate w-full">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {activeTab === "hair_color" && (
          <div className="grid grid-cols-4 sm:grid-cols-4 gap-3 place-items-center">
            {HAIR_COLORS.map((item) => {
              const isSelected = draft.hair_color === item.value;
              return (
                <button
                  key={item.value}
                  onClick={() => handleUpdate("hair_color", item.value)}
                  className={`relative w-14 h-14 rounded-2xl transition-transform active:scale-95 flex items-center justify-center cursor-pointer shadow-md ${
                    isSelected
                      ? "ring-4 ring-offset-2 ring-blue-500 ring-offset-slate-900 scale-105"
                      : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: item.value }}
                  title={item.label}
                >
                  {isSelected && (
                    <span className="text-white font-black text-sm drop-shadow">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {activeTab === "face" && (
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-xs font-bold text-slate-400 mb-2 px-1 text-left">
                Eye Shape:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {EYE_STYLES.map((item) => {
                  const isSelected = draft.eye_style === item.value;
                  return (
                    <button
                      key={item.value}
                      onClick={() => handleUpdate("eye_style", item.value)}
                      className={`p-2.5 rounded-2xl flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? "bg-blue-600/20 border-2 border-b-4 border-blue-500 text-white"
                          : "bg-slate-800/70 hover:bg-slate-800 border-2 border-b-4 border-slate-800 text-slate-300"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-slate-950/60">
                        <AvatarRenderer
                          config={{ ...draft, eye_style: item.value }}
                          size={46}
                        />
                      </div>
                      <span className="text-[11px] font-bold">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-400 mb-2 px-1 text-left">
                Mouth & Expression:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {EXPRESSIONS.map((item) => {
                  const isSelected = draft.expression === item.value;
                  return (
                    <button
                      key={item.value}
                      onClick={() => handleUpdate("expression", item.value)}
                      className={`p-2.5 rounded-2xl flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? "bg-blue-600/20 border-2 border-b-4 border-blue-500 text-white"
                          : "bg-slate-800/70 hover:bg-slate-800 border-2 border-b-4 border-slate-800 text-slate-300"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-slate-950/60">
                        <AvatarRenderer
                          config={{ ...draft, expression: item.value }}
                          size={46}
                        />
                      </div>
                      <span className="text-[11px] font-bold">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === "accessory" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {ACCESSORIES.map((item) => {
              const isSelected = (draft.accessory || "none") === item.value;
              return (
                <button
                  key={item.value}
                  onClick={() => handleUpdate("accessory", item.value)}
                  className={`p-3.5 rounded-2xl flex flex-col items-center gap-2.5 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-blue-600/20 border-2 border-b-4 border-blue-500 text-white"
                      : "bg-slate-800/70 hover:bg-slate-800 border-2 border-b-4 border-slate-800 text-slate-300"
                  }`}
                >
                  <div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center bg-slate-950/60">
                    <AvatarRenderer
                      config={{ ...draft, accessory: item.value }}
                      size={60}
                    />
                  </div>
                  <span className="text-xs font-bold">{item.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {activeTab === "clothing" && (
          <div className="grid grid-cols-4 sm:grid-cols-4 gap-3 place-items-center">
            {SHIRT_COLORS.map((item) => {
              const isSelected = draft.shirt_color === item.value;
              return (
                <button
                  key={item.value}
                  onClick={() => handleUpdate("shirt_color", item.value)}
                  className={`relative w-14 h-14 rounded-2xl transition-transform active:scale-95 flex items-center justify-center cursor-pointer shadow-md ${
                    isSelected
                      ? "ring-4 ring-offset-2 ring-blue-500 ring-offset-slate-900 scale-105"
                      : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: item.value }}
                  title={item.label}
                >
                  {isSelected && (
                    <span className="text-white font-black text-sm drop-shadow">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {activeTab === "background" && (
          <div className="grid grid-cols-4 sm:grid-cols-4 gap-3 place-items-center">
            {BG_COLORS.map((item) => {
              const isSelected = draft.bg_color === item.value;
              return (
                <button
                  key={item.value}
                  onClick={() => handleUpdate("bg_color", item.value)}
                  className={`relative w-14 h-14 rounded-2xl transition-transform active:scale-95 flex items-center justify-center cursor-pointer shadow-md ${
                    isSelected
                      ? "ring-4 ring-offset-2 ring-blue-500 ring-offset-slate-900 scale-105"
                      : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: item.value }}
                  title={item.label}
                >
                  {isSelected && (
                    <span className="text-white font-black text-sm drop-shadow">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="w-full max-w-lg mt-6 sticky bottom-4 z-20">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:translate-y-1 active:border-b-0 border-b-4 border-emerald-700 text-slate-950 font-black text-base shadow-2xl transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSaving ? (
            <span className="animate-spin w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full" />
          ) : (
            <>
              <span className="text-lg">💾</span>
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
