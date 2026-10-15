"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Lock,
  ShieldCheck,
  Volume2,
  VolumeX,
  Flame,
  Trophy,
  LogOut,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Sliders,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { updateUsernameApi, changePasswordApi } from "@/services/authApi";
import { soundEffects } from "@/utils/soundEffects";
import { DesktopMetricBar } from "@/components/layout/DesktopMetricBar";

interface TactileSwitchProps {
  checked: boolean;
  onChange: (val: boolean) => void;
  ariaLabel: string;
}

function TactileSwitch({ checked, onChange, ariaLabel }: TactileSwitchProps) {
  const handleClick = () => {
    soundEffects.playSoftClick();
    onChange(!checked);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={handleClick}
      className={`relative w-16 h-9 rounded-full transition-all cursor-pointer p-1 select-none flex items-center ${
        checked
          ? "bg-emerald-500 border-b-[5px] border-emerald-700 active:border-b-[2px] active:translate-y-[3px]"
          : "bg-slate-800 border-b-[5px] border-slate-950 active:border-b-[2px] active:translate-y-[3px]"
      }`}
    >
      <div
        className={`w-6 h-6 rounded-full bg-white shadow-md border-b-2 border-slate-300 transition-transform flex items-center justify-center ${
          checked ? "translate-x-7" : "translate-x-0.5"
        }`}
      >
        <div
          className={`w-2 h-2 rounded-full ${
            checked ? "bg-emerald-500" : "bg-slate-400"
          }`}
        />
      </div>
    </button>
  );
}

type SettingsSection = "account" | "security" | "preferences";

const SECTIONS: { id: SettingsSection; label: string; icon: React.ElementType }[] = [
  { id: "account", label: "Account", icon: User },
  { id: "security", label: "Security", icon: ShieldCheck },
  { id: "preferences", label: "Sound & Notifications", icon: Sliders },
];

export function SettingsView() {
  const router = useRouter();
  const { user, setUser, logout } = useAuthStore();

  const [activeSection, setActiveSection] = useState<SettingsSection | null>(null);

  const [username, setUsername] = useState("");
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [usernameSuccess, setUsernameSuccess] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [streakReminder, setStreakReminder] = useState(true);
  const [leaderboardAlerts, setLeaderboardAlerts] = useState(true);

  useEffect(() => {
    if (user?.username) {
      setUsername(user.username);
    }
  }, [user]);

  useEffect(() => {
    setSoundEnabled(soundEffects.isEnabled());
    if (typeof window !== "undefined") {
      const storedStreak = localStorage.getItem("buggy_streak_reminder");
      if (storedStreak !== null) setStreakReminder(storedStreak === "true");

      const storedLb = localStorage.getItem("buggy_leaderboard_alerts");
      if (storedLb !== null) setLeaderboardAlerts(storedLb === "true");
    }
  }, []);

  const handleSoundToggle = (val: boolean) => {
    setSoundEnabled(val);
    soundEffects.setEnabled(val);
  };

  const handleStreakReminderToggle = (val: boolean) => {
    setStreakReminder(val);
    if (typeof window !== "undefined") {
      localStorage.setItem("buggy_streak_reminder", val ? "true" : "false");
    }
  };

  const handleLeaderboardAlertsToggle = (val: boolean) => {
    setLeaderboardAlerts(val);
    if (typeof window !== "undefined") {
      localStorage.setItem("buggy_leaderboard_alerts", val ? "true" : "false");
    }
  };

  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects.playSoftClick();
    setUsernameError(null);
    setUsernameSuccess(false);

    const clean = username.trim();
    if (clean.length < 3) {
      setUsernameError("Username must be at least 3 characters");
      return;
    }
    if (clean === user?.username) {
      setUsernameSuccess(true);
      setTimeout(() => setUsernameSuccess(false), 3000);
      return;
    }

    setUsernameLoading(true);
    try {
      const res = await updateUsernameApi(clean);
      setUser(res.user);
      setUsernameSuccess(true);
      setTimeout(() => setUsernameSuccess(false), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update username";
      setUsernameError(msg);
    } finally {
      setUsernameLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects.playSoftClick();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (!currentPassword) {
      setPasswordError("Please enter your current password");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }

    setPasswordLoading(true);
    try {
      await changePasswordApi(currentPassword, newPassword);
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to change password";
      setPasswordError(msg);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = async () => {
    soundEffects.playSoftClick();
    await logout();
    router.push("/login");
  };

  const currentSection: SettingsSection = activeSection ?? "account";
  const isUsernameModified =
    username.trim().length >= 3 && username.trim() !== (user?.username || "");

  const renderMenuBox = () => (
    <div className="w-full rounded-2xl bg-[#0e1626]/95 border-2 border-slate-800 p-3 sm:p-4 shadow-xl flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        {SECTIONS.map((section) => {
          const isSelected = currentSection === section.id;
          const Icon = section.icon;

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => {
                soundEffects.playSoftClick();
                setActiveSection(section.id);
              }}
              className={`w-full px-4 py-3.5 rounded-2xl flex items-center justify-between text-left transition-all cursor-pointer select-none group ${
                isSelected
                  ? "bg-sky-500/10 border-2 border-sky-400 border-b-4 border-b-sky-600 text-sky-300 font-black shadow-md"
                  : "bg-transparent border-2 border-transparent text-slate-400 font-bold hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-5 h-5 shrink-0 ${
                    isSelected
                      ? "text-sky-300 stroke-[2.5]"
                      : "text-slate-400 group-hover:text-white"
                  }`}
                />
                <span className="text-sm tracking-wide">{section.label}</span>
              </div>
              <ChevronRight
                className={`w-4 h-4 shrink-0 transition-transform lg:hidden ${
                  isSelected
                    ? "text-sky-300 translate-x-0.5"
                    : "text-slate-500 group-hover:text-slate-300"
                }`}
              />
            </button>
          );
        })}
      </div>

      <div className="border-t border-slate-800 my-1" />

      <button
        type="button"
        onClick={handleLogout}
        className="w-full px-4 py-3.5 rounded-2xl flex items-center justify-center gap-2.5 transition-all cursor-pointer select-none bg-rose-500/10 border-2 border-rose-500/40 border-b-4 border-b-rose-700 active:border-b-2 active:translate-y-[2px] text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 font-black text-sm uppercase tracking-wider shadow-md"
      >
        <LogOut className="w-4 h-4 stroke-[2.5]" />
        <span>Sign Out</span>
      </button>
    </div>
  );

  const renderAccountCard = () => (
    <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-5 sm:p-7 flex flex-col gap-6 shadow-xl">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-black uppercase tracking-wider text-slate-200">
          Your Email
        </label>
        <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-[#0b101b] border-2 border-slate-800 text-slate-400 cursor-not-allowed">
          <Lock className="w-4 h-4 text-slate-500 shrink-0" />
          <span className="font-mono text-sm text-slate-300 font-black truncate">
            {user?.email || "user@buggy.dev"}
          </span>
          <span className="ml-auto text-[10px] font-black uppercase px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-400">
            Read Only
          </span>
        </div>
        <span className="text-xs font-semibold text-slate-400 px-1">
          Your email is fixed and used for authentication.
        </span>
      </div>

      <div className="h-px bg-slate-800/80" />

      <form onSubmit={handleUpdateUsername} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="settings-username"
            className="text-sm font-black uppercase tracking-wider text-slate-200"
          >
            Username
          </label>
          <input
            id="settings-username"
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setUsernameError(null);
            }}
            placeholder="Enter username"
            className="w-full px-4 py-3.5 rounded-2xl bg-[#0b101b] border-2 border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-sm font-black transition-all"
          />
        </div>

        {usernameError && (
          <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{usernameError}</span>
          </div>
        )}

        {usernameSuccess && (
          <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <Check className="w-4 h-4 shrink-0" />
            <span>Username updated successfully!</span>
          </div>
        )}

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={usernameLoading || !isUsernameModified}
            className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-md select-none ${
              !isUsernameModified || usernameLoading
                ? "bg-slate-800 text-slate-500 border-b-4 border-slate-900 cursor-not-allowed opacity-60"
                : "bg-emerald-600 hover:bg-emerald-500 active:translate-y-1 border-b-4 border-emerald-800 active:border-b-0 text-white cursor-pointer"
            }`}
          >
            {usernameLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );

  const renderSecurityCard = () => (
    <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-5 sm:p-7 flex flex-col gap-6 shadow-xl">
      <form onSubmit={handleChangePassword} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="settings-current-password"
            className="text-sm font-black uppercase tracking-wider text-slate-200"
          >
            Current Password
          </label>
          <div className="relative">
            <input
              id="settings-current-password"
              type={showCurrentPass ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                setPasswordError(null);
              }}
              placeholder="Enter current password"
              className="w-full px-4 py-3.5 rounded-2xl bg-[#0b101b] border-2 border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-sm font-black transition-all pr-12"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPass(!showCurrentPass)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1 cursor-pointer transition-colors"
            >
              {showCurrentPass ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="settings-new-password"
            className="text-sm font-black uppercase tracking-wider text-slate-200"
          >
            New Password
          </label>
          <div className="relative">
            <input
              id="settings-new-password"
              type={showNewPass ? "text" : "password"}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setPasswordError(null);
              }}
              placeholder="At least 6 characters"
              className="w-full px-4 py-3.5 rounded-2xl bg-[#0b101b] border-2 border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-sm font-black transition-all pr-12"
            />
            <button
              type="button"
              onClick={() => setShowNewPass(!showNewPass)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1 cursor-pointer transition-colors"
            >
              {showNewPass ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {passwordError && (
          <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{passwordError}</span>
          </div>
        )}

        {passwordSuccess && (
          <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <Check className="w-4 h-4 shrink-0" />
            <span>Password changed successfully!</span>
          </div>
        )}

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={passwordLoading || !currentPassword || !newPassword}
            className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:translate-y-1 border-b-4 border-emerald-800 active:border-b-0 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            {passwordLoading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );

  const renderPreferencesCard = () => (
    <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-5 sm:p-7 flex flex-col gap-6 shadow-xl">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            {soundEnabled ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-black text-slate-100 truncate">
              Sound Effects
            </span>
            <span className="text-xs font-bold text-slate-400 leading-snug">
              Play sounds for correct answers, mistakes, and victory cues
            </span>
          </div>
        </div>
        <div className="shrink-0">
          <TactileSwitch
            checked={soundEnabled}
            onChange={handleSoundToggle}
            ariaLabel="Toggle sound effects"
          />
        </div>
      </div>

      <div className="h-px bg-slate-800/80" />

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
            <Flame className="w-5 h-5 fill-orange-400" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-black text-slate-100 truncate">
              Daily Streak Reminder
            </span>
            <span className="text-xs font-bold text-slate-400 leading-snug">
              Evening notifications so you never lose your active streak
            </span>
          </div>
        </div>
        <div className="shrink-0">
          <TactileSwitch
            checked={streakReminder}
            onChange={handleStreakReminderToggle}
            ariaLabel="Toggle streak reminder"
          />
        </div>
      </div>

      <div className="h-px bg-slate-800/80" />

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Trophy className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-black text-slate-100 truncate">
              Leaderboard Alerts
            </span>
            <span className="text-xs font-bold text-slate-400 leading-snug">
              Notifications on rank promotions, overtakes, and season end resets
            </span>
          </div>
        </div>
        <div className="shrink-0">
          <TactileSwitch
            checked={leaderboardAlerts}
            onChange={handleLeaderboardAlertsToggle}
            ariaLabel="Toggle leaderboard alerts"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen pl-4 sm:pl-10 md:pl-16 lg:pl-24 xl:pl-32 pr-4 sm:pr-8 lg:pr-10 py-6 sm:py-8 flex flex-col lg:flex-row items-start gap-8 xl:gap-14 pb-32 md:pb-16 select-none">
      <div
        className={`w-full max-w-xl xl:max-w-2xl flex flex-col gap-6 shrink-0 ${
          activeSection === null ? "hidden lg:flex" : "flex"
        }`}
      >
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => {
              soundEffects.playSoftClick();
              setActiveSection(null);
            }}
            className="lg:hidden inline-flex items-center gap-2 text-xs sm:text-sm font-black text-slate-400 hover:text-white transition-colors cursor-pointer group w-fit"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5] group-hover:-translate-x-1 transition-transform" />
            <span>Back to Settings</span>
          </button>

          <div className="flex items-center justify-between w-full px-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
              {currentSection === "account"
                ? "Account"
                : currentSection === "security"
                ? "Security & Password"
                : "Sound & Notifications"}
            </h1>
          </div>
        </div>

        {currentSection === "account" && renderAccountCard()}
        {currentSection === "security" && renderSecurityCard()}
        {currentSection === "preferences" && renderPreferencesCard()}
      </div>

      <div
        className={`w-full lg:w-[320px] xl:w-[360px] flex flex-col items-center gap-5 sticky top-8 shrink-0 ${
          activeSection !== null ? "hidden lg:flex" : "flex"
        }`}
      >
        <div className="hidden lg:flex w-full justify-center">
          <DesktopMetricBar inline />
        </div>

        <div className="w-full lg:hidden px-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
            Settings
          </h1>
        </div>

        {renderMenuBox()}
      </div>
    </div>
  );
}
