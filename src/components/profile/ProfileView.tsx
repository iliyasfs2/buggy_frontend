"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Search,
  UserCheck,
  UserPlus,
  X,
} from "lucide-react";
import { AvatarRenderer } from "@/components/profile/AvatarRenderer";
import { AvatarCustomizerModal } from "@/components/profile/AvatarCustomizerModal";
import { DesktopMetricBar } from "@/components/layout/DesktopMetricBar";
import { soundEffects } from "@/utils/soundEffects";
import { useAuthStore } from "@/store/useAuthStore";
import { useGameStore } from "@/store/useGameStore";
import { DEFAULT_AVATAR_CONFIG, type AvatarConfig } from "@/services/authApi";
import {
  fetchUserProfileApi,
  fetchUserConnectionsApi,
  fetchLeaderboardApi,
  followUserApi,
  unfollowUserApi,
  type UserProfileData,
  type UserConnectionItem,
  type LeaderboardUserEntry,
} from "@/services/progressApi";

export interface ProfileViewProps {
  username?: string;
  isOwnProfile?: boolean;
  is_me?: boolean;
}

export function ProfileView({ username, isOwnProfile, is_me }: ProfileViewProps) {
  const router = useRouter();
  const { user: currentUser, updateAvatar } = useAuthStore();
  const streakCount = useGameStore((s) => s.streakCount);
  const totalXP = useGameStore((s) => s.totalXP);
  const seasonXpStore = useGameStore((s) => s.season_xp);

  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [followers, setFollowers] = useState<UserConnectionItem[]>([]);
  const [following, setFollowing] = useState<UserConnectionItem[]>([]);
  const [activeTab, setActiveTab] = useState<"following" | "followers">("following");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDevCardOpen, setIsDevCardOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [directoryUsers, setDirectoryUsers] = useState<LeaderboardUserEntry[]>([]);

  const targetIdentifier = useMemo(() => {
    if (!username || username.trim() === "" || username.trim().toLowerCase() === "current") {
      return currentUser?.username || "You";
    }
    return decodeURIComponent(username).trim();
  }, [username, currentUser?.username]);

  const isMe = useMemo(() => {
    if (isOwnProfile !== undefined) return isOwnProfile;
    if (is_me !== undefined) return is_me;
    if (!username || username.trim().toLowerCase() === "current") return true;
    if (profile?.is_me !== undefined) return profile.is_me;
    if (currentUser?.username && targetIdentifier.toLowerCase() === currentUser.username.toLowerCase()) {
      return true;
    }
    return false;
  }, [isOwnProfile, is_me, username, profile?.is_me, currentUser?.username, targetIdentifier]);

  useEffect(() => {
    let active = true;
    setLoading(true);

    Promise.all([
      fetchUserProfileApi(targetIdentifier),
      fetchUserConnectionsApi(targetIdentifier).catch(() => ({ followers: [], following: [] })),
    ])
      .then(([profData, connData]) => {
        if (!active) return;
        setProfile(profData);
        setFollowers(connData.followers || []);
        setFollowing(connData.following || []);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        const selfCheck =
          isOwnProfile === true ||
          is_me === true ||
          !username ||
          targetIdentifier.toLowerCase() === "you" ||
          targetIdentifier.toLowerCase() === "current" ||
          Boolean(currentUser?.username && targetIdentifier.toLowerCase() === currentUser.username.toLowerCase());

        setProfile({
          id: targetIdentifier,
          username: selfCheck ? (currentUser?.username || "You") : targetIdentifier,
          avatar_config: selfCheck
            ? (currentUser?.avatar_config || currentUser?.avatar || DEFAULT_AVATAR_CONFIG)
            : DEFAULT_AVATAR_CONFIG,
          joined_at: currentUser?.created_at ? currentUser.created_at.slice(0, 10) : "2026-10-01",
          streak: selfCheck ? streakCount : 0,
          total_xp: selfCheck ? totalXP : 0,
          season_xp: selfCheck ? seasonXpStore : 0,
          current_rank: 1,
          rank_title: "Senior",
          followers_count: 0,
          following_count: 0,
          is_following: false,
          is_me: selfCheck,
        });
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [targetIdentifier, currentUser, isOwnProfile, is_me, username, streakCount, totalXP, seasonXpStore]);

  useEffect(() => {
    if (!isSearchOpen || directoryUsers.length > 0) return;
    fetchLeaderboardApi()
      .then((res) => {
        if (res.leaderboard) {
          setDirectoryUsers(res.leaderboard);
        }
      })
      .catch(() => {
        setDirectoryUsers([]);
      });
  }, [isSearchOpen, directoryUsers.length]);

  const handleToggleFollow = useCallback(async () => {
    if (!profile || isMe || isSubmitting) return;

    soundEffects.playSoftClick();
    const previousFollowing = profile.is_following;
    const previousFollowers = profile.followers_count;
    const nextFollowing = !previousFollowing;
    const nextFollowers = nextFollowing ? previousFollowers + 1 : Math.max(0, previousFollowers - 1);

    setProfile((prev) =>
      prev
        ? {
            ...prev,
            is_following: nextFollowing,
            followers_count: nextFollowers,
          }
        : null
    );

    setIsSubmitting(true);
    try {
      if (nextFollowing) {
        await followUserApi(profile.id || profile.username);
      } else {
        await unfollowUserApi(profile.id || profile.username);
      }
      const updatedConnections = await fetchUserConnectionsApi(targetIdentifier).catch(() => null);
      if (updatedConnections) {
        setFollowers(updatedConnections.followers || []);
        setFollowing(updatedConnections.following || []);
      }
    } catch {
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              is_following: previousFollowing,
              followers_count: previousFollowers,
            }
          : null
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [profile, isMe, isSubmitting, targetIdentifier]);

  const handleSaveAvatar = async (config: AvatarConfig) => {
    await updateAvatar(config);
    setProfile((prev) => (prev ? { ...prev, avatar_config: config } : null));
    setIsEditModalOpen(false);
  };

  const handleBack = () => {
    soundEffects.playSoftClick();
    router.push("/leaderboard");
  };

  const currentRank = profile?.current_rank ?? 20;
  const effectiveXp = profile?.total_xp ?? (isMe ? totalXP : 0);
  const effectiveStreak = profile?.streak ?? (isMe ? streakCount : 0);
  const effectiveSeasonXp = profile?.season_xp ?? (isMe ? seasonXpStore : 0);

  const effectiveAvatar =
    (isMe
      ? currentUser?.avatar_config || currentUser?.avatar || profile?.avatar_config
      : profile?.avatar_config) || DEFAULT_AVATAR_CONFIG;

  const coderLevel = useMemo<"Senior" | "Mid-Level" | "Junior">(() => {
    if (profile?.rank_title === "Senior" || currentRank === 1 || effectiveXp >= 3000) {
      return "Senior";
    }
    if (profile?.rank_title === "Mid-Level" || currentRank === 2 || effectiveXp >= 1000) {
      return "Mid-Level";
    }
    return "Junior";
  }, [profile?.rank_title, currentRank, effectiveXp]);

  const coderBadgeStyle = useMemo(() => {
    if (coderLevel === "Senior") {
      return "bg-amber-400/15 text-amber-300 border border-amber-400/50 shadow-sm shadow-amber-500/10";
    }
    if (coderLevel === "Mid-Level") {
      return "bg-slate-300/15 text-slate-200 border border-slate-300/50 shadow-sm";
    }
    return "bg-amber-700/20 text-amber-400 border border-amber-600/50 shadow-sm";
  }, [coderLevel]);

  const formattedJoinedDate = useMemo(() => {
    const rawDate = profile?.joined_at || (isMe ? currentUser?.created_at : null);
    if (!rawDate) return "Joined Oct 2026";
    try {
      const d = new Date(rawDate);
      if (isNaN(d.getTime())) return `Joined ${rawDate}`;
      return `Joined ${d.toLocaleDateString("en-US", { month: "short", year: "numeric" })}`;
    } catch {
      return `Joined ${rawDate}`;
    }
  }, [profile?.joined_at, isMe, currentUser?.created_at]);

  const profileDisplayName = isMe
    ? currentUser?.username || profile?.username || "You"
    : profile?.username || targetIdentifier;
  const profileHandle = profileDisplayName.toLowerCase().replace(/\s+/g, "_");

  const followingCount = profile?.following_count ?? following.length;
  const followersCount = profile?.followers_count ?? followers.length;

  const filteredSearchUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return directoryUsers.filter((u) => {
      if (u.is_current_user) return false;
      if (currentUser?.username && u.username.toLowerCase() === currentUser.username.toLowerCase()) {
        return false;
      }
      if (!q) return true;
      return u.username.toLowerCase().includes(q) || (u.coder_title && u.coder_title.toLowerCase().includes(q));
    });
  }, [directoryUsers, searchQuery, currentUser?.username]);

  const activeConnections = activeTab === "following" ? following : followers;

  return (
    <div className="w-full max-w-[1024px] mx-auto px-4 md:px-8 py-6 md:py-8 pb-24 md:pb-16 select-none">
      <div className="flex lg:hidden justify-end w-full mb-4">
        <DesktopMetricBar inline />
      </div>

      {!isMe && (
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white font-black text-sm transition-colors py-1.5 mb-4 cursor-pointer w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Leaderboard</span>
        </button>
      )}

      <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
        <div className="w-full lg:w-[600px] lg:max-w-[60%] flex flex-col shrink-0">
          <div className="relative w-full h-[180px] md:h-[220px] rounded-[24px] border-2 border-b-4 border-[#1e3a6e] border-b-[#09152b] bg-gradient-to-b from-[#0f1f3d] via-[#0b162c] to-[#081021] overflow-hidden shadow-xl">
            <div
              className="absolute inset-0 opacity-25 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 50% 25%, rgba(56, 189, 248, 0.28), transparent 65%), linear-gradient(to right, rgba(30, 58, 110, 0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(30, 58, 110, 0.25) 1px, transparent 1px)",
                backgroundSize: "100% 100%, 28px 28px, 28px 28px",
              }}
            />

            <div className="absolute top-5 left-6 hidden sm:flex flex-col gap-1.5 px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500/80" />
                <span className="w-2 h-2 rounded-full bg-amber-400/80" />
                <span className="w-2 h-2 rounded-full bg-emerald-400/80" />
              </div>
              <div className="w-16 h-1.5 rounded-full bg-cyan-400/30" />
              <div className="w-12 h-1.5 rounded-full bg-indigo-400/30" />
            </div>

            {isMe && (
              <button
                type="button"
                onClick={() => {
                  soundEffects.playSoftClick();
                  setIsEditModalOpen(true);
                }}
                className="absolute top-3.5 right-3.5 z-20 h-9 px-3.5 rounded-xl bg-[#162a52]/95 hover:bg-[#1e386b] border-2 border-b-4 border-[#2b4c8c] border-b-[#0a162e] text-white font-black text-xs inline-flex items-center gap-1.5 shadow-lg active:translate-y-0.5 transition-all cursor-pointer"
              >
                <span>🎨</span>
                <span>Room &amp; Avatar</span>
              </button>
            )}

            {currentRank >= 1 && currentRank <= 3 && (
              <div
                className={`absolute bottom-3.5 left-3.5 z-20 h-7 px-3 rounded-full bg-slate-950/90 border backdrop-blur-md inline-flex items-center gap-1.5 text-xs font-black shadow-lg ${
                  currentRank === 1
                    ? "border-amber-400/50 text-amber-300"
                    : currentRank === 2
                    ? "border-slate-300/50 text-slate-200"
                    : "border-amber-600/50 text-amber-400"
                }`}
              >
                <span>{currentRank === 1 ? "👑" : currentRank === 2 ? "🥈" : "🥉"}</span>
                <span>Season Rank #{currentRank}</span>
              </div>
            )}

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center justify-end pointer-events-none">
              <div className="relative w-[120px] h-[120px] flex items-center justify-center translate-y-3">
                <div className="rounded-full p-1 bg-slate-950/90 border-2 border-cyan-400/40 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                  <AvatarRenderer config={effectiveAvatar} size={108} />
                </div>
              </div>

              <div className="relative z-10 w-48 sm:w-56 h-5 rounded-t-xl bg-gradient-to-b from-[#1e293b] to-[#0f172a] border-t-2 border-x-2 border-slate-700 flex items-center justify-center shadow-inner">
                <div className="w-12 h-1.5 rounded-full bg-cyan-400/50" />
              </div>
            </div>
          </div>

          <div className="mt-6 border-b-2 border-slate-800 pb-6">
            <div className="flex flex-col items-start">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-[24px] sm:text-[28px] font-black text-white leading-tight tracking-tight">
                  {profileDisplayName}
                </h1>

                <span
                  className={`h-6 px-2.5 rounded-full text-xs font-bold inline-flex items-center gap-1 ${coderBadgeStyle}`}
                >
                  <span>
                    {coderLevel === "Senior" ? "👑" : coderLevel === "Mid-Level" ? "🥈" : "🥉"}
                  </span>
                  <span>{coderLevel}</span>
                </span>
              </div>

              <span className="text-sm font-bold text-slate-400 mt-1 text-left">
                @{profileHandle}
              </span>

              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 mt-2">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{formattedJoinedDate}</span>
              </div>

              <div className="flex items-center gap-3 mt-3">
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playSoftClick();
                    setActiveTab("following");
                  }}
                  className="inline-flex items-baseline gap-1.5 hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <span className="text-base font-black text-cyan-400">{followingCount}</span>
                  <span className="text-sm font-bold text-slate-300">Following</span>
                </button>

                <span className="text-slate-600 font-black">•</span>

                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playSoftClick();
                    setActiveTab("followers");
                  }}
                  className="inline-flex items-baseline gap-1.5 hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <span className="text-base font-black text-cyan-400">{followersCount}</span>
                  <span className="text-sm font-bold text-slate-300">Followers</span>
                </button>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3">
              {loading ? (
                <div className="w-full h-[50px] bg-slate-800/60 rounded-2xl animate-pulse" />
              ) : isMe ? (
                <div className="flex items-center gap-3">
                  <Link
                    href="/settings"
                    onClick={() => soundEffects.playSoftClick()}
                    className="flex-1 h-[50px] px-5 rounded-2xl bg-[#132342] hover:bg-[#192d54] border-2 border-b-4 border-[#233b69] border-b-[#091326] text-slate-100 font-bold text-sm inline-flex items-center justify-center gap-2 transition-all active:translate-y-0.5 shadow-md"
                  >
                    <span>⚙️</span>
                    <span>Account Settings</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      soundEffects.playSoftClick();
                      setIsSearchOpen((prev) => !prev);
                    }}
                    className="h-[50px] px-4 rounded-2xl bg-[#0f243c] hover:bg-[#15304f] border-2 border-b-4 border-cyan-500/40 border-b-cyan-900 text-cyan-300 font-bold text-sm inline-flex items-center justify-center gap-2 transition-all active:translate-y-0.5 shadow-md cursor-pointer shrink-0"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span className="hidden sm:inline">Find Friends</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleToggleFollow}
                  disabled={isSubmitting}
                  className={`w-full h-[50px] px-6 rounded-2xl font-bold text-sm inline-flex items-center justify-center gap-2 transition-all active:translate-y-0.5 cursor-pointer ${
                    profile?.is_following
                      ? "bg-[#0d1b33] hover:bg-[#132647] border-2 border-b-4 border-[#1e3660] border-b-[#071021] text-cyan-400 shadow-md"
                      : "bg-cyan-500 hover:bg-cyan-400 border-2 border-b-4 border-cyan-300 border-b-cyan-700 text-slate-950 shadow-lg shadow-cyan-950/40"
                  }`}
                >
                  {profile?.is_following ? (
                    <>
                      <UserCheck className="w-4 h-4" />
                      <span>✓ Following</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>+ Follow</span>
                    </>
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  soundEffects.playSoftClick();
                  setIsDevCardOpen(true);
                }}
                className="w-full h-[54px] px-5 rounded-2xl bg-gradient-to-r from-[#132347] via-[#1e1b4b] to-[#132347] hover:from-[#192f5e] hover:via-[#282463] hover:to-[#192f5e] border-2 border-b-4 border-amber-400/75 border-b-amber-600 text-amber-300 font-bold text-[15px] sm:text-base inline-flex items-center justify-center gap-2.5 shadow-lg shadow-amber-500/10 active:translate-y-0.5 transition-all cursor-pointer"
              >
                <span>🪪</span>
                <span>View Intro &amp; Skills Card (Dev Card)</span>
              </button>
            </div>

            {isMe && isSearchOpen && (
              <div className="mt-4 p-4 rounded-2xl border-2 border-b-4 border-slate-800 border-b-slate-950 bg-slate-900/90 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-black text-white">Find &amp; Follow Coders</span>
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="relative mb-3">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by username..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm font-bold text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
                  {filteredSearchUsers.length === 0 ? (
                    <div className="py-4 text-center text-xs font-bold text-slate-500">
                      No matching users found.
                    </div>
                  ) : (
                    filteredSearchUsers.slice(0, 8).map((u) => (
                      <div
                        key={u.id}
                        onClick={() => {
                          soundEffects.playSoftClick();
                          setIsSearchOpen(false);
                          router.push(`/profile/${encodeURIComponent(u.username)}`);
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-[#0b1324] border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-full bg-slate-950 overflow-hidden flex items-center justify-center border border-slate-800 shrink-0">
                            <AvatarRenderer config={u.avatar_config || DEFAULT_AVATAR_CONFIG} size={36} />
                          </div>
                          <div className="min-w-0">
                            <div className="font-black text-white text-sm truncate">{u.username}</div>
                            <div className="text-[11px] text-slate-400 font-bold truncate">
                              @{u.username.toLowerCase().replace(/\s+/g, "_")}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-black text-cyan-400 shrink-0">View &rarr;</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 w-full">
            <h2 className="text-[18px] sm:text-[20px] font-black text-white mb-4 tracking-tight">
              Performance Statistics
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="h-[92px] rounded-2xl border-2 border-b-4 border-[#172a4f] border-b-[#091224] bg-[#0d182e]/90 p-4 flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[#091122] border border-slate-800 flex items-center justify-center text-2xl shrink-0">
                  🔥
                </div>
                <div className="min-w-0 flex flex-col">
                  <span className="text-[20px] font-black text-white leading-tight truncate">
                    {effectiveStreak}
                  </span>
                  <span className="text-xs font-bold text-slate-400 mt-0.5 truncate">
                    Active Day Streak
                  </span>
                </div>
              </div>

              <div className="h-[92px] rounded-2xl border-2 border-b-4 border-[#172a4f] border-b-[#091224] bg-[#0d182e]/90 p-4 flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[#091122] border border-slate-800 flex items-center justify-center text-2xl shrink-0">
                  ⚡
                </div>
                <div className="min-w-0 flex flex-col">
                  <span className="text-[20px] font-black text-white leading-tight truncate">
                    {effectiveXp.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-slate-400 mt-0.5 truncate">
                    Total Score (XP)
                  </span>
                </div>
              </div>

              <div className="h-[92px] rounded-2xl border-2 border-b-4 border-[#172a4f] border-b-[#091224] bg-[#0d182e]/90 p-4 flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[#091122] border border-slate-800 flex items-center justify-center text-2xl shrink-0">
                  🏆
                </div>
                <div className="min-w-0 flex flex-col">
                  <span className="text-[20px] font-black text-white leading-tight truncate">
                    Rank #{currentRank}
                  </span>
                  <span className="text-xs font-bold text-slate-400 mt-0.5 truncate">
                    Current Compile Season
                  </span>
                </div>
              </div>

              <div className="h-[92px] rounded-2xl border-2 border-b-4 border-[#172a4f] border-b-[#091224] bg-[#0d182e]/90 p-4 flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[#091122] border border-slate-800 flex items-center justify-center text-2xl shrink-0">
                  🎯
                </div>
                <div className="min-w-0 flex flex-col">
                  <span className="text-[20px] font-black text-white leading-tight truncate">
                    {effectiveSeasonXp.toLocaleString()} XP
                  </span>
                  <span className="text-xs font-bold text-slate-400 mt-0.5 truncate">
                    XP Earned This Week
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[380px] lg:max-w-[40%] shrink-0 lg:sticky lg:top-6 flex flex-col gap-5">
          <div className="hidden lg:flex justify-end w-full">
            <DesktopMetricBar inline />
          </div>

          <div className="w-full max-h-[460px] rounded-[24px] border-2 border-b-4 border-[#172a4f] border-b-[#091224] bg-[#0d182e]/90 flex flex-col overflow-hidden shadow-xl">
            <div className="h-[52px] shrink-0 grid grid-cols-2 border-b-2 border-slate-800/90 bg-[#0a1326]/60">
              <button
                type="button"
                onClick={() => {
                  soundEffects.playSoftClick();
                  setActiveTab("following");
                }}
                className={`h-full font-bold text-sm flex items-center justify-center transition-colors cursor-pointer border-b-4 ${
                  activeTab === "following"
                    ? "border-cyan-400 text-cyan-400 font-black"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                Following ({followingCount})
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEffects.playSoftClick();
                  setActiveTab("followers");
                }}
                className={`h-full font-bold text-sm flex items-center justify-center transition-colors cursor-pointer border-b-4 ${
                  activeTab === "followers"
                    ? "border-cyan-400 text-cyan-400 font-black"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                Followers ({followersCount})
              </button>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
              {activeConnections.length === 0 ? (
                <div className="py-12 px-4 text-center flex flex-col items-center justify-center gap-2">
                  <span className="text-sm font-bold text-slate-500">
                    No {activeTab} yet.
                  </span>
                </div>
              ) : (
                activeConnections.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      soundEffects.playSoftClick();
                      router.push(`/profile/${encodeURIComponent(item.username)}`);
                    }}
                    className="h-16 p-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-slate-950 overflow-hidden flex items-center justify-center border border-slate-800 shrink-0">
                        <AvatarRenderer config={item.avatar_config || DEFAULT_AVATAR_CONFIG} size={40} />
                      </div>
                      <div className="min-w-0 flex flex-col">
                        <span className="text-sm font-bold text-white leading-tight truncate">
                          {item.username}
                        </span>
                        <span className="text-xs font-bold text-slate-400 truncate mt-0.5">
                          @{item.username.toLowerCase().replace(/\s+/g, "_")}
                        </span>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-amber-400 shrink-0 ml-2">
                      {item.total_xp.toLocaleString()} XP
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {isDevCardOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200"
          onClick={() => setIsDevCardOpen(false)}
        >
          <div
            className="w-full h-full md:h-auto md:w-[640px] md:max-w-[640px] md:max-h-[85vh] rounded-none md:rounded-[24px] border-0 md:border-2 md:border-b-4 border-[#233b69] border-b-[#091326] bg-gradient-to-b from-[#101d38] via-[#0c162c] to-[#091020] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-slate-800/90 flex items-center justify-between gap-3 shrink-0 bg-[#0b1528]/90">
              <div className="h-7 px-3 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold inline-flex items-center gap-1.5">
                <span>🟢</span>
                <span>Open to Work &amp; Projects</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundEffects.playSoftClick();
                  setIsDevCardOpen(false);
                }}
                className="h-8 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-black inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <span>✕</span>
                <span>Close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-6">
              <div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-2xl bg-slate-950 border-2 border-cyan-400/50 flex items-center justify-center overflow-hidden shrink-0 shadow-lg shadow-cyan-500/10">
                    <AvatarRenderer config={effectiveAvatar} size={66} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-[22px] sm:text-[24px] font-black text-white leading-tight truncate">
                        {profileDisplayName}
                      </h3>
                      <span
                        className={`h-6 px-2.5 rounded-full text-xs font-bold inline-flex items-center gap-1 ${coderBadgeStyle}`}
                      >
                        <span>
                          {coderLevel === "Senior" ? "👑" : coderLevel === "Mid-Level" ? "🥈" : "🥉"}
                        </span>
                        <span>{coderLevel}</span>
                      </span>
                    </div>

                    <div className="text-[15px] font-bold text-cyan-400 mt-1">
                      {coderLevel} Full-Stack Developer &amp; Debugger
                    </div>

                    <div className="text-xs font-bold text-slate-400 mt-0.5">
                      @{profileHandle} • Season Rank #{currentRank}
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-sm text-slate-300 font-medium leading-relaxed">
                  Passionate software engineer focused on building scalable modern web applications,
                  hunting down complex runtime bugs, and mastering algorithmic problem-solving through
                  daily hands-on coding challenges in Buggy.
                </p>
              </div>

              <div>
                <h4 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                  <span>Verified Skills in Buggy</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="h-[44px] px-3.5 rounded-xl bg-[#091224] border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">JavaScript (ES6+)</span>
                      <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black inline-flex items-center justify-center">
                        ✓
                      </span>
                    </div>
                    <span className="text-sm font-black text-amber-400">
                      {Math.min(98, Math.max(65, 70 + Math.floor(effectiveXp / 200)))}%
                    </span>
                  </div>

                  <div className="h-[44px] px-3.5 rounded-xl bg-[#091224] border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">Python &amp; Logic</span>
                      <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black inline-flex items-center justify-center">
                        ✓
                      </span>
                    </div>
                    <span className="text-sm font-black text-amber-400">
                      {Math.min(95, Math.max(55, 60 + Math.floor(effectiveXp / 250)))}%
                    </span>
                  </div>

                  <div className="h-[44px] px-3.5 rounded-xl bg-[#091224] border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">Bug Hunting</span>
                      <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black inline-flex items-center justify-center">
                        ✓
                      </span>
                    </div>
                    <span className="text-sm font-black text-amber-400">Advanced</span>
                  </div>

                  <div className="h-[44px] px-3.5 rounded-xl bg-[#091224] border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">TypeScript</span>
                      <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black inline-flex items-center justify-center">
                        ✓
                      </span>
                    </div>
                    <span className="text-sm font-black text-amber-400">84%</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-base font-bold text-white mb-3">
                  Tech Stack &amp; Specialized Skills
                </h4>

                <div className="flex flex-wrap gap-2">
                  {[
                    "React",
                    "Next.js",
                    "TypeScript",
                    "JavaScript",
                    "FastAPI",
                    "Tailwind CSS",
                    "Node.js",
                    "Git & GitHub",
                    "REST APIs",
                  ].map((tech) => (
                    <span
                      key={tech}
                      className="h-8 px-3 rounded-full bg-[#132342] border border-[#243f73] text-slate-200 text-[13px] font-bold inline-flex items-center"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-base font-bold text-white mb-3">
                  Featured Projects &amp; Portfolio
                </h4>

                <div className="flex flex-col gap-3">
                  <div className="min-h-[80px] p-3.5 rounded-2xl bg-[#091224] border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="text-[15px] font-bold text-white truncate">
                        Buggy Interactive Code Sandbox
                      </div>
                      <div className="text-xs font-bold text-slate-400 mt-1 line-clamp-1">
                        Gamified debugging challenges, real-time AST execution, and streak tracking.
                      </div>
                    </div>

                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => soundEffects.playSoftClick()}
                      className="h-8 px-3 rounded-xl bg-[#132342] hover:bg-[#1a2f59] border border-[#26447d] text-cyan-400 text-xs font-bold inline-flex items-center gap-1 shrink-0 transition-colors"
                    >
                      <span>View Link</span>
                      <span>↗</span>
                    </a>
                  </div>

                  <div className="min-h-[80px] p-3.5 rounded-2xl bg-[#091224] border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="text-[15px] font-bold text-white truncate">
                        Full-Stack Algorithm Visualizer
                      </div>
                      <div className="text-xs font-bold text-slate-400 mt-1 line-clamp-1">
                        Interactive step-by-step visualization of graph, sorting, and dynamic programming.
                      </div>
                    </div>

                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => soundEffects.playSoftClick()}
                      className="h-8 px-3 rounded-xl bg-[#132342] hover:bg-[#1a2f59] border border-[#26447d] text-cyan-400 text-xs font-bold inline-flex items-center gap-1 shrink-0 transition-colors"
                    >
                      <span>View Link</span>
                      <span>↗</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 sm:px-6 py-4 border-t border-slate-800/90 bg-[#0b1528]/95 shrink-0 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <a
                href={`https://github.com/${profileHandle}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => soundEffects.playSoftClick()}
                className="h-[44px] px-3 rounded-xl bg-[#132342] hover:bg-[#1a2f59] border-2 border-b-4 border-[#233b69] border-b-[#081121] text-white text-sm font-bold inline-flex items-center justify-center gap-1.5 transition-all active:translate-y-0.5"
              >
                <span>GitHub</span>
                <span>↗</span>
              </a>

              <a
                href={`https://linkedin.com/in/${profileHandle}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => soundEffects.playSoftClick()}
                className="h-[44px] px-3 rounded-xl bg-[#132342] hover:bg-[#1a2f59] border-2 border-b-4 border-[#233b69] border-b-[#081121] text-cyan-300 text-sm font-bold inline-flex items-center justify-center gap-1.5 transition-all active:translate-y-0.5"
              >
                <span>LinkedIn</span>
                <span>↗</span>
              </a>

              <a
                href={`https://${profileHandle}.dev`}
                target="_blank"
                rel="noreferrer"
                onClick={() => soundEffects.playSoftClick()}
                className="h-[44px] px-3 rounded-xl bg-[#132342] hover:bg-[#1a2f59] border-2 border-b-4 border-[#233b69] border-b-[#081121] text-amber-300 text-sm font-bold inline-flex items-center justify-center gap-1.5 transition-all active:translate-y-0.5"
              >
                <span>Website</span>
                <span>↗</span>
              </a>

              <a
                href={`https://t.me/${profileHandle}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => soundEffects.playSoftClick()}
                className="h-[44px] px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 border-2 border-b-4 border-cyan-300 border-b-cyan-700 text-slate-950 text-sm font-bold inline-flex items-center justify-center gap-1.5 transition-all active:translate-y-0.5"
              >
                <span>Telegram</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        </div>
      )}

      <AvatarCustomizerModal
        isOpen={isEditModalOpen}
        initialConfig={effectiveAvatar}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveAvatar}
      />
    </div>
  );
}
