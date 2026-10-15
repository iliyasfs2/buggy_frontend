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
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { updateUsernameApi, changePasswordApi } from "@/services/authApi";
import { soundEffects } from "@/utils/soundEffects";

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

export function SettingsView() {
  const router = useRouter();
  const { user, setUser, logout } = useAuthStore();

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

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 flex flex-col gap-8 pb-32 md:pb-16 select-none">
      <div className="flex items-center justify-start w-full px-1">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
          Settings
        </h1>
      </div>

      <div className="flex flex-col gap-6">
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-2 px-1 text-slate-300">
            <User className="w-4 h-4 text-blue-400" />
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-300">
              Account Information
            </h2>
          </div>

          <div className="bg-slate-900/80 border-2 border-slate-800 rounded-3xl p-5 sm:p-6 flex flex-col gap-5 shadow-xl">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-200">
                Registered Email
              </label>
              <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-[#0b101b] border-2 border-slate-800 text-slate-300 cursor-not-allowed">
                <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="font-mono text-sm text-slate-300 font-bold truncate">
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

            <form onSubmit={handleUpdateUsername} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="settings-username"
                  className="text-xs font-black uppercase tracking-wider text-slate-200"
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
                  className="w-full px-4 py-3.5 rounded-2xl bg-[#0b101b] border-2 border-slate-700 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-sm font-bold transition-all"
                />
              </div>

              {usernameError && (
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{usernameError}</span>
                </div>
              )}

              {usernameSuccess && (
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Username updated successfully!</span>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={usernameLoading || !username.trim()}
                  className="px-6 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                >
                  {usernameLoading ? "Saving..." : "Save Username"}
                </button>
              </div>
            </form>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-2 px-1 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-300">
              Security
            </h2>
          </div>

          <div className="bg-slate-900/80 border-2 border-slate-800 rounded-3xl p-5 sm:p-6 flex flex-col gap-5 shadow-xl">
            <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="settings-current-password"
                  className="text-xs font-black uppercase tracking-wider text-slate-200"
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
                    className="w-full px-4 py-3.5 rounded-2xl bg-[#0b101b] border-2 border-slate-700 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 text-sm font-bold transition-all pr-12"
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
                  className="text-xs font-black uppercase tracking-wider text-slate-200"
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
                    className="w-full px-4 py-3.5 rounded-2xl bg-[#0b101b] border-2 border-slate-700 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 text-sm font-bold transition-all pr-12"
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
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              {passwordSuccess && (
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Password changed successfully!</span>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={passwordLoading || !currentPassword || !newPassword}
                  className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1 transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                >
                  {passwordLoading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-2 px-1 text-slate-300">
            <Sliders className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-300">
              Preferences & Notifications
            </h2>
          </div>

          <div className="bg-slate-900/80 border-2 border-slate-800 rounded-3xl p-5 sm:p-6 flex flex-col gap-5 shadow-xl">
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
                  <span className="text-sm font-black text-slate-200 truncate">
                    Sound Effects
                  </span>
                  <span className="text-xs font-bold text-slate-400 leading-snug">
                    Correct answers, mistakes, byte coins, and celebratory victory cues
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
                  <span className="text-sm font-black text-slate-200 truncate">
                    Streak Reminder
                  </span>
                  <span className="text-xs font-bold text-slate-400 leading-snug">
                    Evening notification alerts if daily practice is not yet completed
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
                  <span className="text-sm font-black text-slate-200 truncate">
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
        </section>

        <section className="flex flex-col gap-3 pt-2">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-4 px-6 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-sm uppercase tracking-wider border-b-4 border-rose-800 active:border-b-0 active:translate-y-1 transition-all shadow-xl flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of Buggy</span>
          </button>
          <span className="text-center text-xs font-semibold text-slate-500">
            Signing out will securely clear your active session token.
          </span>
        </section>
      </div>
    </div>
  );
}
