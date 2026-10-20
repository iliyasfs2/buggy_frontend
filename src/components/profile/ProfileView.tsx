"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Search,
  UserCheck,
  UserPlus,
  X,
} from "lucide-react";
import { AvatarRenderer } from "@/components/profile/AvatarRenderer";
import { AvatarCustomizerModal } from "@/components/profile/AvatarCustomizerModal";
import { AchievementsList } from "@/components/profile/AchievementsList";
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
  switchCourseApi,
  type UserProfileData,
  type UserConnectionItem,
  type LeaderboardUserEntry,
} from "@/services/progressApi";

const ALL_COURSES = [
  {
    id: "javascript",
    title: "JavaScript",
    code: "JS",
    iconSrc: "/icons/js-badge.png",
    fallbackEmoji: "⚡",
    badge: "Active",
  },
  {
    id: "python",
    title: "Python",
    code: "PY",
    iconSrc: null,
    fallbackEmoji: "🐍",
    badge: "Available",
  },
  {
    id: "react",
    title: "React",
    code: "React",
    iconSrc: null,
    fallbackEmoji: "⚛️",
    badge: "Available",
  },
] as const;

export interface ProfileViewProps {
  username?: string;
  isOwnProfile?: boolean;
  is_me?: boolean;
  from?: string;
}

export function ProfileView({ username, isOwnProfile, is_me, from }: ProfileViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user: currentUser, updateAvatar } = useAuthStore();
  const streakCount = useGameStore((s) => s.streakCount);
  const totalXP = useGameStore((s) => s.totalXP);
  const seasonXpStore = useGameStore((s) => s.season_xp);
  const activeCourse = useGameStore((s) => s.activeCourse);
  const switchCourse = useGameStore((s) => s.switchCourse);
  const completedNodesCount = useGameStore((s) => s.completedNodesCount);

  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [followers, setFollowers] = useState<UserConnectionItem[]>([]);
  const [following, setFollowing] = useState<UserConnectionItem[]>([]);
  const [activeTab, setActiveTab] = useState<"following" | "followers">("following");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDevCardOpen, setIsDevCardOpen] = useState(false);
  const [isFriendsModalOpen, setIsFriendsModalOpen] = useState(false);
  const [isCoursesModalOpen, setIsCoursesModalOpen] = useState(false);
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
    setNotFound(false);

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

        if (!selfCheck) {
          setProfile(null);
          setFollowers([]);
          setFollowing([]);
          setNotFound(true);
          setLoading(false);
          return;
        }

        setProfile({
          id: "current",
          username: currentUser?.username || "You",
          avatar_config: currentUser?.avatar_config || currentUser?.avatar || DEFAULT_AVATAR_CONFIG,
          joined_at: currentUser?.created_at ? currentUser.created_at.slice(0, 10) : "",
          streak: streakCount,
          total_xp: totalXP,
          season_xp: seasonXpStore,
          current_rank: 0,
          rank_title: null,
          followers_count: 0,
          following_count: 0,
          is_following: false,
          is_me: true,
        });
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [targetIdentifier, currentUser, isOwnProfile, is_me, username, streakCount, totalXP, seasonXpStore]);

  useEffect(() => {
    fetchLeaderboardApi()
      .then((res) => {
        if (res.leaderboard) {
          setDirectoryUsers(res.leaderboard);
        }
      })
      .catch(() => {
        setDirectoryUsers([]);
      });
  }, []);

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

  const cameFromLeaderboard = from === "leaderboard" || searchParams?.get("from") === "leaderboard";

  const handleBack = () => {
    soundEffects.playSoftClick();
    if (cameFromLeaderboard) {
      router.push("/leaderboard");
      return;
    }
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/profile");
  };

  const openUserProfile = (name: string, connectionId?: string) => {
    soundEffects.playSoftClick();
    const isSelf =
      (currentUser?.username && name.toLowerCase() === currentUser.username.toLowerCase()) ||
      (currentUser?.id !== undefined && connectionId === `user_${currentUser.id}`);
    router.push(isSelf ? "/profile" : `/profile/${encodeURIComponent(name)}`);
  };

  const currentRank = profile?.current_rank ?? 0;
  const hasRank = currentRank > 0;
  const effectiveXp = profile?.total_xp ?? (isMe ? totalXP : 0);
  const effectiveStreak = profile?.streak ?? (isMe ? streakCount : 0);
  const effectiveSeasonXp = profile?.season_xp ?? (isMe ? seasonXpStore : 0);

  const effectiveAvatar =
    (isMe
      ? currentUser?.avatar_config || currentUser?.avatar || profile?.avatar_config
      : profile?.avatar_config) || DEFAULT_AVATAR_CONFIG;

  const coderLevel = useMemo<"Senior" | "Mid-Level" | "Junior" | null>(() => {
    if (profile?.rank_title === "Senior" || profile?.rank_title === "Mid-Level" || profile?.rank_title === "Junior") {
      return profile.rank_title;
    }
    return null;
  }, [profile?.rank_title]);

  const effectiveLevel = useMemo<"Senior" | "Mid-Level" | "Junior">(() => {
    if (coderLevel) return coderLevel;
    if (profile?.rank_title === "Senior" || profile?.rank_title === "Mid-Level" || profile?.rank_title === "Junior") {
      return profile.rank_title;
    }
    if (currentRank === 1) return "Senior";
    if (currentRank === 2) return "Mid-Level";
    if (currentRank === 3) return "Junior";
    return "Senior";
  }, [coderLevel, profile?.rank_title, currentRank]);

  const coderBadgeStyle = useMemo(() => {
    if (effectiveLevel === "Senior") {
      return "bg-amber-400/20 text-amber-300 border border-amber-400/50 shadow-sm shadow-amber-500/10";
    }
    if (effectiveLevel === "Mid-Level") {
      return "bg-slate-300/20 text-slate-200 border border-slate-300/50 shadow-sm";
    }
    return "bg-amber-700/20 text-amber-400 border border-amber-600/50 shadow-sm";
  }, [effectiveLevel]);

  const formattedJoinedDate = useMemo(() => {
    const rawDate = profile?.joined_at || (isMe ? currentUser?.created_at : null);
    if (!rawDate) return null;
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

  const followingCount = following.length;
  const followersCount = followers.length;

  const currentCourse = useMemo(() => {
    const raw = (profile?.active_course || activeCourse || "javascript").toLowerCase();
    if (raw === "python") {
      return {
        title: "Python",
        code: "PY",
        iconSrc: null,
        fallbackEmoji: "🐍",
      };
    }
    if (raw === "react") {
      return {
        title: "React",
        code: "React",
        iconSrc: null,
        fallbackEmoji: "⚛️",
      };
    }
    return {
      title: "JavaScript",
      code: "JS",
      iconSrc: "/icons/js-badge.png",
      fallbackEmoji: "⚡",
    };
  }, [profile?.active_course, activeCourse]);

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

  const friendsForStreaks = useMemo(() => {
    const list: Array<{ id: string; username: string; avatar_config?: any; streak?: number }> = [];
    const seen = new Set<string>();

    for (const f of following) {
      const key = f.username.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        list.push({
          id: f.id,
          username: f.username,
          avatar_config: f.avatar_config,
          streak: f.streak || 5,
        });
      }
    }

    for (const f of followers) {
      if (list.length >= 5) break;
      const key = f.username.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        list.push({
          id: f.id,
          username: f.username,
          avatar_config: f.avatar_config,
          streak: f.streak || 3,
        });
      }
    }

    for (const u of directoryUsers) {
      if (list.length >= 5) break;
      if (u.is_current_user) continue;
      if (currentUser?.username && u.username.toLowerCase() === currentUser.username.toLowerCase()) continue;
      const key = u.username.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        list.push({
          id: String(u.id),
          username: u.username,
          avatar_config: u.avatar_config,
          streak: u.streak || 7,
        });
      }
    }

    return list.slice(0, 5);
  }, [following, followers, directoryUsers, currentUser?.username]);

  const activeConnections = activeTab === "following" ? following : followers;

  return (
    <div className="w-full min-h-screen pl-4 sm:pl-10 md:pl-16 lg:pl-24 xl:pl-32 pr-4 sm:pr-8 lg:pr-10 py-6 sm:py-8 flex flex-col lg:flex-row items-start gap-8 xl:gap-14 pb-32 md:pb-16 select-none relative">
      <div className="w-full max-w-xl xl:max-w-2xl flex flex-col shrink-0">
        <div className="hidden md:flex lg:hidden justify-end w-full mb-4">
          <DesktopMetricBar inline />
        </div>

        {!isMe && (
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white font-black text-sm transition-colors py-1.5 mb-4 cursor-pointer w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{cameFromLeaderboard ? "Back to Leaderboard" : "Back"}</span>
          </button>
        )}

        {notFound && !loading ? (
          <div className="w-full p-8 rounded-[24px] border-2 border-b-4 border-slate-700 border-b-slate-800 bg-[#0d182e]/90 text-center mt-8">
            <div className="text-4xl mb-3">🔍</div>
            <h2 className="text-lg font-black text-white">User not found</h2>
            <p className="mt-2 text-sm font-bold text-slate-400">
              No coder with the username @{targetIdentifier} exists.
            </p>
          </div>
        ) : (
          <>
            <div
              onClick={() => {
                if (isMe) {
                  soundEffects.playSoftClick();
                  setIsEditModalOpen(true);
                }
              }}
              className={`relative -mx-4 w-[calc(100%+2rem)] sm:mx-0 sm:w-full h-[220px] md:h-[260px] rounded-none sm:rounded-[24px] border-y-2 border-b-4 sm:border-2 sm:border-b-4 border-x-0 sm:border-x-2 border-slate-700 border-b-slate-800 bg-gradient-to-b from-[#0f1f3d] via-[#0b162c] to-[#081021] overflow-hidden shadow-xl ${
                isMe ? "cursor-pointer group" : ""
              }`}
            >
              <div
                className="absolute inset-0 opacity-25 pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 50% 25%, rgba(56, 189, 248, 0.28), transparent 65%), linear-gradient(to right, rgba(30, 58, 110, 0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(30, 58, 110, 0.25) 1px, transparent 1px)",
                  backgroundSize: "100% 100%, 28px 28px, 28px 28px",
                }}
              />

              <div
                className={`absolute bottom-3 left-3.5 z-20 h-7 px-3 rounded-full backdrop-blur-md inline-flex items-center gap-1.5 text-xs font-black shadow-lg ${coderBadgeStyle}`}
              >
                <span>
                  {effectiveLevel === "Senior" ? "👑" : effectiveLevel === "Mid-Level" ? "🥈" : "🥉"}
                </span>
                <span>{effectiveLevel}</span>
              </div>

              <div className="absolute bottom-0 inset-x-0 flex flex-col items-center justify-end pointer-events-none">
                <div className="relative mb-[-10px] z-10 transition-transform duration-200 group-hover:scale-105">
                  <div className="rounded-full p-1 bg-slate-950/90 border-2 border-cyan-400/40 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                    <AvatarRenderer config={effectiveAvatar} size={120} />
                  </div>
                </div>

                <div className="relative z-10 w-52 sm:w-64 h-5 rounded-t-xl bg-gradient-to-b from-[#1e293b] to-[#0f172a] border-t-2 border-x-2 border-slate-700 flex items-center justify-center shadow-inner">
                  <div className="w-14 h-1.5 rounded-full bg-cyan-400/40" />
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-baseline gap-2.5 flex-wrap">
              <h1 className="font-black text-2xl sm:text-3xl text-white tracking-tight">
                {profileDisplayName}
              </h1>
              <span className="text-sm sm:text-base font-bold text-slate-400 font-mono">
                @{profileHandle}
              </span>
            </div>

            <div className="mt-4 flex items-center gap-4 sm:gap-6 flex-wrap select-none">
              <button
                type="button"
                onClick={() => {
                  soundEffects.playSoftClick();
                  setIsCoursesModalOpen(true);
                }}
                title={`${profileDisplayName}'s Courses`}
                className="inline-flex items-center gap-1.5 group cursor-pointer transition-transform active:scale-95 hover:opacity-90"
              >
                {currentCourse.iconSrc ? (
                  <img
                    src={currentCourse.iconSrc}
                    alt={currentCourse.title}
                    className="w-6 h-6 object-contain shrink-0"
                  />
                ) : (
                  <span className="text-xl select-none">{currentCourse.fallbackEmoji}</span>
                )}
                <span className="text-sm sm:text-base font-black text-white font-mono">
                  +2
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEffects.playSoftClick();
                  setActiveTab("following");
                  setIsFriendsModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 group cursor-pointer transition-transform active:scale-95"
              >
                <span className="text-sm sm:text-base font-black text-cyan-400">
                  {followingCount}
                </span>
                <span className="text-sm sm:text-base font-black text-cyan-400 group-hover:text-cyan-300 transition-colors">
                  Following
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEffects.playSoftClick();
                  setActiveTab("followers");
                  setIsFriendsModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 group cursor-pointer transition-transform active:scale-95"
              >
                <span className="text-sm sm:text-base font-black text-cyan-400">
                  {followersCount}
                </span>
                <span className="text-sm sm:text-base font-black text-cyan-400 group-hover:text-cyan-300 transition-colors">
                  Followers
                </span>
              </button>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  soundEffects.playSoftClick();
                  setIsDevCardOpen(true);
                }}
                className="flex-1 h-[52px] px-5 rounded-2xl bg-gradient-to-r from-[#172554] via-[#1e1b4b] to-[#172554] hover:from-[#1e3a8a] hover:via-[#2e1065] hover:to-[#1e3a8a] border-2 border-b-4 border-amber-400/80 border-b-amber-600 text-amber-300 font-bold text-sm sm:text-base inline-flex items-center justify-center gap-2.5 shadow-lg shadow-amber-500/10 active:translate-y-0.5 transition-all cursor-pointer"
              >
                <span className="text-lg">🪪</span>
                <span>View Intro &amp; Skills (Dev Card)</span>
              </button>

              {isMe ? (
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playSoftClick();
                    setIsSearchOpen(true);
                  }}
                  title="Find Friends"
                  className="w-[52px] h-[52px] rounded-2xl bg-[#0e172a] hover:bg-slate-800 border-2 border-b-4 border-slate-700 border-b-slate-800 text-cyan-400 flex items-center justify-center transition-all active:translate-y-0.5 shadow-md cursor-pointer shrink-0"
                >
                  <UserPlus className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleToggleFollow}
                  disabled={isSubmitting}
                  className={`h-[52px] px-5 rounded-2xl font-bold text-sm inline-flex items-center justify-center gap-2 transition-all active:translate-y-0.5 cursor-pointer shrink-0 ${
                    profile?.is_following
                      ? "bg-[#0d1b33] hover:bg-[#132647] border-2 border-b-4 border-slate-700 border-b-slate-800 text-cyan-400 shadow-md"
                      : "bg-cyan-500 hover:bg-cyan-400 border-2 border-b-4 border-cyan-300 border-b-cyan-700 text-slate-950 shadow-lg shadow-cyan-950/40"
                  }`}
                >
                  {profile?.is_following ? (
                    <>
                      <UserCheck className="w-4 h-4" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Follow</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="mt-7">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
                Overview
              </h2>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 p-4 rounded-2xl border-2 border-b-4 border-slate-700 border-b-slate-800 bg-[#0d182e]/80">
                <div className="flex items-center gap-3.5 p-1">
                  <span className="text-2xl sm:text-3xl select-none shrink-0">🔥</span>
                  <div className="min-w-0 flex flex-col">
                    <span className="text-base sm:text-lg font-black text-white leading-tight truncate">
                      {effectiveStreak} days
                    </span>
                    <span className="text-xs font-bold text-slate-400 mt-0.5 truncate">
                      Active Streak
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-1">
                  <span className="text-2xl sm:text-3xl select-none shrink-0">💻</span>
                  <div className="min-w-0 flex flex-col">
                    <span className="text-base sm:text-lg font-black text-white leading-tight truncate">
                      {completedNodesCount || 66}
                    </span>
                    <span className="text-xs font-bold text-slate-400 mt-0.5 truncate">
                      Lessons Finished
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-1">
                  <span className="text-2xl sm:text-3xl select-none shrink-0">🏆</span>
                  <div className="min-w-0 flex flex-col">
                    <span className="text-base sm:text-lg font-black text-white leading-tight truncate">
                      {hasRank ? `Rank #${currentRank}` : coderLevel || "Senior"}
                    </span>
                    <span className="text-xs font-bold text-slate-400 mt-0.5 truncate">
                      Season Standing
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-1">
                  <span className="text-2xl sm:text-3xl select-none shrink-0">⚡</span>
                  <div className="min-w-0 flex flex-col">
                    <span className="text-base sm:text-lg font-black text-white leading-tight truncate">
                      {effectiveXp.toLocaleString()} XP
                    </span>
                    <span className="text-xs font-bold text-slate-400 mt-0.5 truncate">
                      Total XP
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-7">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                  Friend Streaks
                </h2>
                {isMe && (
                  <button
                    type="button"
                    onClick={() => {
                      soundEffects.playSoftClick();
                      setIsSearchOpen(true);
                    }}
                    className="text-xs font-black text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                  >
                    Find Friends
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-none">
                {friendsForStreaks.slice(0, 5).map((f) => (
                  <div
                    key={f.id}
                    onClick={() => openUserProfile(f.username, f.id)}
                    className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
                  >
                    <div className="relative w-14 h-14 rounded-full bg-slate-950 border-2 border-slate-700 group-hover:border-cyan-400 overflow-hidden transition-all flex items-center justify-center shadow-md">
                      <AvatarRenderer config={f.avatar_config || DEFAULT_AVATAR_CONFIG} size={48} />
                      <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-slate-950 border border-slate-700 text-[10px] font-black text-rose-400 flex items-center gap-0.5 shadow">
                        <span>🔥</span>
                        <span>{f.streak || 1}</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-300 group-hover:text-white truncate max-w-[64px] text-center">
                      {f.username}
                    </span>
                  </div>
                ))}

                <div
                  onClick={() => {
                    soundEffects.playSoftClick();
                    setIsSearchOpen(true);
                  }}
                  className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
                >
                  <div className="w-14 h-14 rounded-full border-2 border-dashed border-slate-600 group-hover:border-cyan-400 flex items-center justify-center text-slate-400 group-hover:text-cyan-300 transition-colors shadow-sm bg-slate-900/40">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-400 group-hover:text-cyan-300 truncate max-w-[64px] text-center">
                    Add
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-7">
              <AchievementsList />
            </div>
          </>
        )}
      </div>

      <div className="hidden lg:flex flex-1 justify-center sticky top-8">
        <DesktopMetricBar inline />
      </div>

      {isCoursesModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setIsCoursesModalOpen(false)}
        >
          <div
            className="w-full sm:max-w-md rounded-t-[28px] sm:rounded-[24px] border-2 border-b-4 border-slate-700 border-b-slate-800 bg-gradient-to-b from-[#101d38] via-[#0c162c] to-[#091020] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-5 border-b border-slate-800/90 flex items-center justify-between gap-3 bg-[#0b1528]/90 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚡</span>
                <span className="text-base sm:text-lg font-black text-white">
                  {profileDisplayName} Courses
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundEffects.playSoftClick();
                  setIsCoursesModalOpen(false);
                }}
                className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 sm:p-6 flex flex-col gap-4">
              <span className="text-xs font-bold text-slate-400">
                Programming tracks and learning paths:
              </span>

              <div className="grid grid-cols-3 gap-3">
                {ALL_COURSES.map((c) => {
                  const isActive = (profile?.active_course || activeCourse || "javascript").toLowerCase() === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={async () => {
                        if (isMe && !isActive) {
                          soundEffects.playSoftClick();
                          try {
                            await switchCourseApi(c.id);
                            switchCourse(c.id);
                          } catch {
                            switchCourse(c.id);
                          }
                        }
                      }}
                      className={`p-3.5 rounded-2xl border-2 border-b-4 flex flex-col items-center gap-2 transition-all ${
                        isActive
                          ? "bg-slate-900/90 border-amber-400 border-b-amber-600 shadow-lg shadow-amber-500/10"
                          : isMe
                          ? "bg-slate-950/80 border-slate-700 border-b-slate-800 hover:border-slate-600 cursor-pointer hover:scale-[1.02]"
                          : "bg-slate-950/80 border-slate-700 border-b-slate-800 opacity-75"
                      }`}
                    >
                      <div className="w-12 h-12 rounded-2xl bg-[#091122] border border-slate-800 flex items-center justify-center text-2xl shadow-inner">
                        {c.iconSrc ? (
                          <img src={c.iconSrc} alt={c.title} className="w-8 h-8 object-contain" />
                        ) : (
                          <span>{c.fallbackEmoji}</span>
                        )}
                      </div>

                      <div className="flex flex-col items-center text-center">
                        <span className="text-xs font-black text-white">{c.title}</span>
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full mt-1 ${
                            isActive
                              ? "bg-amber-400/20 text-amber-300 border border-amber-400/40"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {isActive ? "Active" : c.badge}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {isFriendsModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setIsFriendsModalOpen(false)}
        >
          <div
            className="w-full sm:max-w-md max-h-[85vh] h-[520px] rounded-t-[28px] sm:rounded-[24px] border-2 border-b-4 border-slate-700 border-b-slate-800 bg-gradient-to-b from-[#101d38] via-[#0c162c] to-[#091020] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-800/90 flex items-center justify-between gap-3 bg-[#0b1528]/90 shrink-0">
              <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playSoftClick();
                    setActiveTab("following");
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition-colors cursor-pointer ${
                    activeTab === "following"
                      ? "bg-cyan-500 text-slate-950 shadow"
                      : "text-slate-400 hover:text-white"
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
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition-colors cursor-pointer ${
                    activeTab === "followers"
                      ? "bg-cyan-500 text-slate-950 shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Followers ({followersCount})
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundEffects.playSoftClick();
                  setIsFriendsModalOpen(false);
                }}
                className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2">
              {activeConnections.length === 0 ? (
                <div className="py-12 px-4 text-center flex flex-col items-center justify-center gap-2">
                  <span className="text-sm font-bold text-slate-500">
                    {loading ? "Loading..." : activeTab === "following" ? "Not following anyone yet." : "No followers yet."}
                  </span>
                </div>
              ) : (
                activeConnections.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setIsFriendsModalOpen(false);
                      openUserProfile(item.username, item.id);
                    }}
                    className="h-16 p-3 rounded-xl flex items-center justify-between hover:bg-slate-800/40 transition-colors cursor-pointer"
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
      )}

      {isSearchOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="w-full sm:max-w-md max-h-[85vh] h-[520px] rounded-t-[28px] sm:rounded-[24px] border-2 border-b-4 border-slate-700 border-b-slate-800 bg-gradient-to-b from-[#101d38] via-[#0c162c] to-[#091020] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-800/90 flex items-center justify-between gap-3 bg-[#0b1528]/90 shrink-0">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-black text-white">Find Coders</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundEffects.playSoftClick();
                  setIsSearchOpen(false);
                }}
                className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 border-b border-slate-800/70 bg-[#081020]/50">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by username or title..."
                  className="w-full h-10 pl-9 pr-3 rounded-xl bg-slate-900/90 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2">
              {filteredSearchUsers.length === 0 ? (
                <div className="py-12 px-4 text-center text-sm font-bold text-slate-500">
                  {directoryUsers.length === 0 ? "Loading coders..." : "No matching coders found."}
                </div>
              ) : (
                filteredSearchUsers.map((u) => (
                  <div
                    key={u.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      openUserProfile(u.username, u.id);
                    }}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/40 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-slate-950 overflow-hidden flex items-center justify-center border border-slate-800 shrink-0">
                        <AvatarRenderer config={u.avatar_config || DEFAULT_AVATAR_CONFIG} size={40} />
                      </div>
                      <div className="min-w-0 flex flex-col">
                        <span className="text-sm font-bold text-white leading-tight truncate">
                          {u.username}
                        </span>
                        <span className="text-xs font-bold text-slate-400 truncate mt-0.5">
                          {u.coder_title || `@${u.username.toLowerCase().replace(/\s+/g, "_")}`}
                        </span>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-amber-400 shrink-0 ml-2">
                      {(u.total_xp ?? u.season_xp).toLocaleString()} XP
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {isDevCardOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200"
          onClick={() => setIsDevCardOpen(false)}
        >
          <div
            className="w-full h-full md:h-auto md:w-[640px] md:max-w-[640px] md:max-h-[85vh] rounded-none md:rounded-[24px] border-0 md:border-2 md:border-b-4 border-slate-700 border-b-slate-800 bg-gradient-to-b from-[#101d38] via-[#0c162c] to-[#091020] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-slate-800/90 flex items-center justify-between gap-3 shrink-0 bg-[#0b1528]/90">
              <div className="flex items-center gap-2">
                <span className="text-lg">🪪</span>
                <span className="text-sm font-black text-white">Dev Card</span>
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
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-2xl bg-slate-950 border-2 border-cyan-400/50 flex items-center justify-center overflow-hidden shrink-0 shadow-lg shadow-cyan-500/10">
                  <AvatarRenderer config={effectiveAvatar} size={66} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-[22px] sm:text-[24px] font-black text-white leading-tight truncate">
                      {profileDisplayName}
                    </h3>
                    {coderLevel && (
                      <span
                        className={`h-6 px-2.5 rounded-full text-xs font-bold inline-flex items-center gap-1 ${coderBadgeStyle}`}
                      >
                        <span>
                          {coderLevel === "Senior" ? "👑" : coderLevel === "Mid-Level" ? "🥈" : "🥉"}
                        </span>
                        <span>{coderLevel}</span>
                      </span>
                    )}
                  </div>

                  <div className="text-xs font-bold text-slate-400 mt-1">
                    @{profileHandle}
                    {hasRank ? ` • Season Rank #${currentRank}` : ""}
                  </div>
                  {formattedJoinedDate && (
                    <div className="text-xs font-bold text-slate-500 mt-0.5">{formattedJoinedDate}</div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-base font-bold text-white mb-3">About</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  {isMe ? "You haven't added a bio yet." : "This coder hasn't added a bio yet."}
                </p>
              </div>

              <div>
                <h4 className="text-base font-bold text-white mb-3">Verified Stats in Buggy</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="h-[44px] px-3.5 rounded-xl bg-[#091224] border border-slate-800 flex items-center justify-between">
                    <span className="text-sm font-bold text-white">Total XP</span>
                    <span className="text-sm font-black text-amber-400">{effectiveXp.toLocaleString()}</span>
                  </div>
                  <div className="h-[44px] px-3.5 rounded-xl bg-[#091224] border border-slate-800 flex items-center justify-between">
                    <span className="text-sm font-bold text-white">Day Streak</span>
                    <span className="text-sm font-black text-amber-400">{effectiveStreak}</span>
                  </div>
                  <div className="h-[44px] px-3.5 rounded-xl bg-[#091224] border border-slate-800 flex items-center justify-between">
                    <span className="text-sm font-bold text-white">Season Rank</span>
                    <span className="text-sm font-black text-amber-400">{hasRank ? `#${currentRank}` : "—"}</span>
                  </div>
                  <div className="h-[44px] px-3.5 rounded-xl bg-[#091224] border border-slate-800 flex items-center justify-between">
                    <span className="text-sm font-bold text-white">XP This Week</span>
                    <span className="text-sm font-black text-amber-400">{effectiveSeasonXp.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-base font-bold text-white mb-3">Tech Stack &amp; Specialized Skills</h4>
                <p className="text-sm text-slate-500 font-medium">No tech stack added yet.</p>
              </div>

              <div>
                <h4 className="text-base font-bold text-white mb-3">Featured Projects &amp; Portfolio</h4>
                <p className="text-sm text-slate-500 font-medium">No projects added yet.</p>
              </div>
            </div>

            <div className="px-5 sm:px-6 py-4 border-t border-slate-800/90 bg-[#0b1528]/95 shrink-0">
              <p className="text-sm text-slate-500 font-bold text-center">No contact links added yet.</p>
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
