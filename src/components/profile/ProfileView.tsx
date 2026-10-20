"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Search,
  UserCheck,
  UserPlus,
  Plus,
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
  const [isStreakPickerOpen, setIsStreakPickerOpen] = useState(false);
  const [streakPickerSearch, setStreakPickerSearch] = useState("");
  const [selectedStreakUserIds, setSelectedStreakUserIds] = useState<string[]>([]);
  const [selectedStreakFriend, setSelectedStreakFriend] = useState<{
    id: string;
    username: string;
    avatar_config?: Partial<AvatarConfig> | null;
    streak?: number;
    has_completed_today?: boolean;
  } | null>(null);
  const [pokedFriends, setPokedFriends] = useState<Record<string, boolean>>({});
  const [pokeToast, setPokeToast] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storageKey = `buggy_streak_friends_${currentUser?.id || currentUser?.username || "default"}`;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSelectedStreakUserIds(parsed);
        }
      }
    } catch {
    }
  }, [currentUser?.id, currentUser?.username]);

  const handleToggleStreakFriend = useCallback((friendId: string) => {
    soundEffects.playSoftClick();
    setSelectedStreakUserIds((prev) => {
      let next: string[];
      if (prev.includes(friendId)) {
        next = prev.filter((id) => id !== friendId);
      } else {
        if (prev.length >= 5) return prev;
        next = [...prev, friendId];
      }
      if (typeof window !== "undefined") {
        const storageKey = `buggy_streak_friends_${currentUser?.id || currentUser?.username || "default"}`;
        try {
          localStorage.setItem(storageKey, JSON.stringify(next));
        } catch {
        }
      }
      return next;
    });
  }, [currentUser?.id, currentUser?.username]);

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
    if (profile?.rank_title === "Senior" || currentRank === 1) return "Senior";
    if (profile?.rank_title === "Mid-Level" || currentRank === 2) return "Mid-Level";
    if (profile?.rank_title === "Junior" || currentRank === 3) return "Junior";
    return null;
  }, [profile?.rank_title, currentRank]);

  const leagueName = useMemo<string>(() => {
    if (profile?.league) return profile.league;
    if (currentRank <= 0) return "Unranked";
    if (currentRank <= 3) return "Grandmaster League";
    if (currentRank <= 10) return "Emerald League";
    if (currentRank <= 25) return "Diamond League";
    if (currentRank <= 50) return "Ruby League";
    return "Obsidian League";
  }, [profile?.league, currentRank]);

  const coderBadgeStyle = useMemo(() => {
    if (coderLevel === "Senior") {
      return "bg-amber-400/20 text-amber-300 border border-amber-400/50 shadow-sm shadow-amber-500/10";
    }
    if (coderLevel === "Mid-Level") {
      return "bg-slate-300/20 text-slate-200 border border-slate-300/50 shadow-sm";
    }
    if (coderLevel === "Junior") {
      return "bg-amber-700/20 text-amber-400 border border-amber-600/50 shadow-sm";
    }
    return "";
  }, [coderLevel]);

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
    const userMap = new Map<string, UserConnectionItem>();
    for (const f of following) {
      userMap.set(String(f.id), f);
      userMap.set(f.username.toLowerCase(), f);
    }
    for (const f of followers) {
      if (!userMap.has(String(f.id))) {
        userMap.set(String(f.id), f);
        userMap.set(f.username.toLowerCase(), f);
      }
    }

    if (!isMe) {
      return following.slice(0, 5).map((f) => ({
        id: String(f.id),
        username: f.username,
        avatar_config: f.avatar_config,
        streak: f.streak || 5,
        has_completed_today: (f.username.charCodeAt(0) % 2 === 0),
      }));
    }

    const list: Array<{
      id: string;
      username: string;
      avatar_config?: Partial<AvatarConfig> | null;
      streak?: number;
      has_completed_today?: boolean;
    }> = [];

    for (const id of selectedStreakUserIds) {
      const friend = userMap.get(id) || userMap.get(id.toLowerCase());
      if (friend) {
        list.push({
          id: String(friend.id),
          username: friend.username,
          avatar_config: friend.avatar_config,
          streak: friend.streak || 5,
          has_completed_today: (friend.username.charCodeAt(0) % 2 === 0),
        });
      }
    }

    return list.slice(0, 5);
  }, [isMe, selectedStreakUserIds, following, followers]);

  const activeConnections = activeTab === "following" ? following : followers;

  return (
    <div className="w-full min-h-screen px-0 sm:pl-10 md:pl-16 lg:pl-24 xl:pl-32 sm:pr-8 lg:pr-10 pt-0 pb-32 sm:py-8 flex flex-col lg:flex-row items-start gap-8 xl:gap-14 select-none relative">
      <div className="w-full max-w-xl xl:max-w-2xl flex flex-col shrink-0">
        <div className="hidden md:flex lg:hidden justify-end w-full mb-4 px-4 sm:px-0">
          <DesktopMetricBar inline />
        </div>

        {!isMe && (
          <div className="px-4 sm:px-0">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white font-black text-sm transition-colors py-1.5 mb-4 cursor-pointer w-fit"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{cameFromLeaderboard ? "Back to Leaderboard" : "Back"}</span>
            </button>
          </div>
        )}

        {notFound && !loading ? (
          <div className="w-full p-8 rounded-[24px] border-2 border-b-4 border-slate-700 border-b-slate-800 bg-[#0d182e]/90 text-center mt-8 mx-4 sm:mx-0">
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
              className={`relative w-full h-[260px] md:h-[310px] rounded-none sm:rounded-[24px] border-0 bg-gradient-to-b from-[#0f1f3d] via-[#0b162c] to-[#081021] overflow-hidden shadow-2xl ${
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

              {coderLevel && (
                <div
                  className={`absolute bottom-3.5 left-4 sm:left-4 z-20 h-7 px-3 rounded-full backdrop-blur-md inline-flex items-center gap-1.5 text-xs font-black shadow-lg ${coderBadgeStyle}`}
                >
                  <span>
                    {coderLevel === "Senior" ? "👑" : coderLevel === "Mid-Level" ? "🥈" : "🥉"}
                  </span>
                  <span>{coderLevel}</span>
                </div>
              )}

              <div className="absolute bottom-2 sm:bottom-3 inset-x-0 flex flex-col items-center justify-end pointer-events-none">
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

            <div className="px-4 sm:px-0 flex flex-col">
              <div className="mt-6 flex items-baseline gap-2.5 flex-wrap">
                <h1 className="font-black text-[22px] sm:text-[26px] text-white tracking-tight">
                  {profileDisplayName}
                </h1>
                <span className="text-sm sm:text-base font-bold text-slate-400 font-mono">
                  @{profileHandle}
                </span>
                {coderLevel && (
                  <span
                    className={`h-6 px-2.5 rounded-full text-xs font-black inline-flex items-center gap-1 select-none ${coderBadgeStyle}`}
                    title={`Season ${profile?.season_number || 1} • Rank #${currentRank}`}
                  >
                    <span>{coderLevel === "Senior" ? "👑" : coderLevel === "Mid-Level" ? "🥈" : "🥉"}</span>
                    <span>{coderLevel}</span>
                  </span>
                )}
              </div>

              <div className="mt-4 flex items-center gap-6 sm:gap-8 flex-wrap select-none">
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playSoftClick();
                    setIsCoursesModalOpen(true);
                  }}
                  title={`${profileDisplayName}'s Courses`}
                  className="inline-flex items-center gap-1.5 group cursor-pointer transition-transform active:scale-95 hover:opacity-90 mr-1 sm:mr-2"
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
                className="flex-1 h-[52px] px-5 rounded-2xl bg-[#101826] hover:bg-slate-800/40 active:bg-slate-700 active:translate-y-1 active:border-b-2 border-2 border-b-4 border-blue-600 border-b-blue-800 text-white font-bold text-sm sm:text-base inline-flex items-center justify-center gap-2.5 shadow-lg shadow-blue-950/50 transition-all cursor-pointer"
              >
                <img src="/icons/dev-card.png" alt="Dev Card" className="w-8 h-auto max-h-8 object-contain shrink-0 drop-shadow" />
                <span>View Intro &amp; Skills</span>
              </button>

              {isMe ? (
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playSoftClick();
                    setIsSearchOpen(true);
                  }}
                  title="Find Friends"
                  className="w-[52px] h-[52px] rounded-2xl bg-[#101826] hover:bg-slate-800/40 active:bg-slate-700 active:translate-y-1 active:border-b-2 border-2 border-b-4 border-blue-600 border-b-blue-800 flex items-center justify-center transition-all shadow-md shadow-blue-950/40 cursor-pointer shrink-0"
                >
                  <img src="/icons/add-friend.png" alt="Add Friend" className="w-7 h-7 object-contain" />
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
              <h2 className="text-sm sm:text-base font-black text-slate-300 uppercase tracking-wider mb-3.5">
                Overview
              </h2>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="p-3.5 sm:p-4 rounded-2xl border-2 border-b-4 border-slate-700 border-b-slate-800 bg-[#0d182e]/80 flex items-center gap-3 sm:gap-3.5 shadow-md">
                  <img
                    src="/icons/streak.png"
                    alt="Streak"
                    className="w-8 h-8 sm:w-9 sm:h-9 object-contain shrink-0 drop-shadow"
                  />
                  <div className="min-w-0 flex flex-col">
                    <span className="text-lg sm:text-xl font-black text-white leading-tight truncate">
                      {effectiveStreak} days
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-400 mt-0.5 truncate">
                      Active Streak
                    </span>
                  </div>
                </div>

                <div className="p-3.5 sm:p-4 rounded-2xl border-2 border-b-4 border-slate-700 border-b-slate-800 bg-[#0d182e]/80 flex items-center gap-3 sm:gap-3.5 shadow-md">
                  {currentCourse.iconSrc ? (
                    <img
                      src={currentCourse.iconSrc}
                      alt={currentCourse.title}
                      className="w-8 h-8 sm:w-9 sm:h-9 object-contain shrink-0 drop-shadow rounded-lg"
                    />
                  ) : (
                    <span className="text-2xl sm:text-3xl select-none shrink-0">
                      {currentCourse.fallbackEmoji}
                    </span>
                  )}
                  <div className="min-w-0 flex flex-col">
                    <span className="text-lg sm:text-xl font-black text-white leading-tight truncate">
                      {completedNodesCount || 66}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-400 mt-0.5 truncate">
                      Lessons Finished
                    </span>
                  </div>
                </div>

                <div
                  onClick={() => {
                    soundEffects.playSoftClick();
                    router.push("/leaderboard");
                  }}
                  className="p-3.5 sm:p-4 rounded-2xl border-2 border-b-4 border-slate-700 border-b-slate-800 bg-[#0d182e]/80 flex items-center gap-3 sm:gap-3.5 shadow-md cursor-pointer hover:border-blue-500 hover:border-b-blue-600 transition-all group"
                  title="View 10-Day Season Leaderboard"
                >
                  <img
                    src="/icons/trophy.png"
                    alt="Season Standing"
                    className="w-8 h-8 sm:w-9 sm:h-9 object-contain shrink-0 drop-shadow group-hover:scale-105 transition-transform"
                  />
                  <div className="min-w-0 flex flex-col">
                    <span className="text-lg sm:text-xl font-black text-white leading-tight truncate">
                      {hasRank ? `Rank #${currentRank}` : coderLevel || "Unranked"}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-400 mt-0.5 truncate flex items-center gap-1">
                      <span>Season {profile?.season_number || 1}</span>
                      <span className="text-cyan-400 font-mono text-[11px] sm:text-xs">
                        • {coderLevel ? coderLevel : leagueName}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="p-3.5 sm:p-4 rounded-2xl border-2 border-b-4 border-slate-700 border-b-slate-800 bg-[#0d182e]/80 flex items-center gap-3 sm:gap-3.5 shadow-md">
                  <img
                    src="/icons/lightning.png"
                    alt="Total XP"
                    className="w-8 h-8 sm:w-9 sm:h-9 object-contain shrink-0 drop-shadow"
                  />
                  <div className="min-w-0 flex flex-col">
                    <span className="text-lg sm:text-xl font-black text-white leading-tight truncate">
                      {effectiveXp.toLocaleString()} XP
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-400 mt-0.5 truncate">
                      Total XP • {effectiveSeasonXp.toLocaleString()} Season
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-7">
              <div className="flex items-center justify-between mb-3.5">
                <h2 className="text-sm sm:text-base font-black text-slate-300 uppercase tracking-wider">
                  Friend Streaks
                </h2>
              </div>

              <div className="grid grid-cols-5 gap-2 sm:gap-4 md:gap-6 justify-items-center pt-2 pb-3 px-1">
                {friendsForStreaks.map((f) => (
                  <div
                    key={f.id}
                    onClick={() => {
                      soundEffects.playSoftClick();
                      setSelectedStreakFriend(f);
                    }}
                    className="flex flex-col items-center gap-1.5 sm:gap-2 w-full max-w-[76px] cursor-pointer group"
                    title={`${f.username} • ${f.streak || 1} days shared streak • Click to Poke!`}
                  >
                    <div className="w-[54px] h-[54px] sm:w-[68px] sm:h-[68px] md:w-[76px] md:h-[76px] rounded-full bg-slate-950 overflow-hidden flex items-center justify-center shadow-md transition-all border-2 border-slate-700 group-hover:border-cyan-400 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.35)] shrink-0">
                      <AvatarRenderer config={f.avatar_config || DEFAULT_AVATAR_CONFIG} className="w-full h-full scale-[1.05]" />
                    </div>

                    <div className="flex items-center gap-1.5 mt-1 text-sm sm:text-base font-black text-white group-hover:scale-105 transition-transform select-none">
                      <img
                        src="/icons/streak.png"
                        alt="Streak"
                        className="w-4 h-4 sm:w-5 sm:h-5 object-contain drop-shadow shrink-0"
                      />
                      <span className="font-mono text-amber-400 font-black">
                        {f.streak || 1}
                      </span>
                    </div>
                  </div>
                ))}

                {Array.from({ length: Math.max(0, 5 - friendsForStreaks.length) }).map((_, idx) => (
                  <div
                    key={`empty-streak-slot-${idx}`}
                    onClick={() => {
                      soundEffects.playSoftClick();
                      if (isMe) {
                        setStreakPickerSearch("");
                        setIsStreakPickerOpen(true);
                      } else {
                        setIsSearchOpen(true);
                      }
                    }}
                    className="flex flex-col items-center gap-1.5 sm:gap-2 w-full max-w-[76px] cursor-pointer group"
                    title="Choose a friend you follow to form a Debug Peer Streak!"
                  >
                    <div className="w-[54px] h-[54px] sm:w-[68px] sm:h-[68px] md:w-[76px] md:h-[76px] rounded-full border-2 border-dashed border-slate-700 group-hover:border-cyan-400 flex items-center justify-center text-slate-500 group-hover:text-cyan-300 transition-all shadow-sm bg-slate-900/30 group-hover:bg-slate-900/60 group-hover:scale-105 shrink-0">
                      <Plus className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 transition-transform group-hover:rotate-90" />
                    </div>
                    <span className="text-xs sm:text-sm font-black text-slate-400 group-hover:text-cyan-300 truncate max-w-[70px] text-center transition-colors mt-1 select-none">
                      Add
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-7">
              <AchievementsList />
            </div>
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
                {currentCourse.iconSrc ? (
                  <img src={currentCourse.iconSrc} alt="Course" className="w-5 h-5 object-contain" />
                ) : (
                  <span className="text-xl">{currentCourse.fallbackEmoji}</span>
                )}
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
                <img src="/icons/dev-card.png" alt="Dev Card" className="w-5 h-auto max-h-5 object-contain" />
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
                    <span className="text-sm font-black text-amber-400">
                      {hasRank ? `#${currentRank}${coderLevel ? ` (${coderLevel})` : ""}` : "—"}
                    </span>
                  </div>
                  <div className="h-[44px] px-3.5 rounded-xl bg-[#091224] border border-slate-800 flex items-center justify-between">
                    <span className="text-sm font-bold text-white">Season XP (10-Day)</span>
                    <span className="text-sm font-black text-amber-400">{effectiveSeasonXp.toLocaleString()}</span>
                  </div>
                  <div className="h-[44px] px-3.5 rounded-xl bg-[#091224] border border-slate-800 flex items-center justify-between sm:col-span-2">
                    <span className="text-sm font-bold text-white">Competitive League</span>
                    <span className="text-sm font-black text-cyan-400">{leagueName}</span>
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

      {selectedStreakFriend && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedStreakFriend(null)}
        >
          <div
            className="w-full sm:max-w-md rounded-t-[28px] sm:rounded-[24px] border-2 border-b-4 border-slate-700 border-b-slate-800 bg-gradient-to-b from-[#101d38] via-[#0c162c] to-[#091020] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-5 border-b border-slate-800/90 flex items-center justify-between gap-3 bg-[#0b1528]/90 shrink-0">
              <div className="flex items-center gap-2">
                <img src="/icons/streak.png" alt="Streak" className="w-5 h-5 object-contain" />
                <span className="text-base sm:text-lg font-black text-white">
                  Friend Streak Chain
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  soundEffects.playSoftClick();
                  setSelectedStreakFriend(null);
                }}
                className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 sm:p-6 flex flex-col gap-5">
              <div className="flex items-center justify-center gap-4 py-4 px-3 bg-[#081120]/80 rounded-2xl border border-slate-800/80 shadow-inner">
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-14 h-14 rounded-full bg-slate-950 border-2 border-cyan-400 overflow-hidden flex items-center justify-center shadow-md">
                    <AvatarRenderer config={effectiveAvatar} className="w-full h-full scale-[1.05]" />
                  </div>
                  <span className="text-xs font-bold text-slate-300">You</span>
                </div>

                <div className="flex flex-col items-center gap-1 px-1">
                  <div className="flex items-center gap-1">
                    <div className="w-6 sm:w-8 h-0.5 bg-gradient-to-r from-cyan-400 to-orange-400" />
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center shadow-inner">
                      <img src="/icons/streak.png" alt="Streak" className="w-6 h-6 object-contain drop-shadow animate-pulse" />
                    </div>
                    <div className="w-6 sm:w-8 h-0.5 bg-gradient-to-r from-orange-400 to-cyan-400" />
                  </div>
                  <span className="text-xs font-black text-amber-400 font-mono">
                    {selectedStreakFriend.streak || 1} Days
                  </span>
                </div>

                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-14 h-14 rounded-full bg-slate-950 border-2 border-slate-700 overflow-hidden flex items-center justify-center shadow-md">
                    <AvatarRenderer config={selectedStreakFriend.avatar_config || DEFAULT_AVATAR_CONFIG} className="w-full h-full scale-[1.05]" />
                  </div>
                  <span className="text-xs font-bold text-slate-300 truncate max-w-[80px]">
                    {selectedStreakFriend.username}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0d1b33]/60 border border-slate-800 flex flex-col gap-2.5">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Daily Streak Rule
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  Both peers must solve at least one debug challenge daily before midnight to keep this shared flame alive.
                </p>

                <div className="mt-1 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="font-bold text-slate-300">Your status today:</span>
                    <span className="font-black text-emerald-400 flex items-center gap-1">
                      ✓ Solved
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="font-bold text-slate-300">{selectedStreakFriend.username}&apos;s status:</span>
                    {selectedStreakFriend.has_completed_today ? (
                      <span className="font-black text-emerald-400 flex items-center gap-1">
                        ✓ Solved
                      </span>
                    ) : (
                      <span className="font-black text-amber-400 flex items-center gap-1 animate-pulse">
                        ⏳ Pending (Flame Melting!)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  disabled={pokedFriends[selectedStreakFriend.id]}
                  onClick={() => {
                    soundEffects.playIgnite();
                    setPokedFriends((prev) => ({ ...prev, [selectedStreakFriend.id]: true }));
                    setPokeToast(`Red-light Poke sent to @${selectedStreakFriend.username}!`);
                    setTimeout(() => setPokeToast(null), 3000);
                  }}
                  className={`flex-1 h-[46px] px-4 rounded-xl font-bold text-sm inline-flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    pokedFriends[selectedStreakFriend.id]
                      ? "bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed"
                      : "bg-rose-600 hover:bg-rose-500 text-white border-2 border-b-4 border-rose-400 border-b-rose-800 shadow-lg shadow-rose-950/50 active:translate-y-0.5"
                  }`}
                >
                  <span>🚨</span>
                  <span>
                    {pokedFriends[selectedStreakFriend.id] ? "Poke Sent!" : "Send Poke (چراغ قرمز)"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playSoftClick();
                    const friendName = selectedStreakFriend.username;
                    setSelectedStreakFriend(null);
                    router.push(`/profile/${encodeURIComponent(friendName)}`);
                  }}
                  className="h-[46px] px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border-2 border-b-4 border-slate-600 border-b-slate-900 text-white font-bold text-sm inline-flex items-center justify-center gap-1.5 transition-all active:translate-y-0.5 cursor-pointer"
                >
                  <span>View Profile</span>
                  <span>↗</span>
                </button>
              </div>

              {isMe && (
                <button
                  type="button"
                  onClick={() => {
                    handleToggleStreakFriend(selectedStreakFriend.id);
                    setSelectedStreakFriend(null);
                  }}
                  className="w-full h-9 rounded-xl bg-slate-900/80 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-900/60 text-slate-500 hover:text-rose-400 text-xs font-bold transition-all cursor-pointer"
                >
                  Remove from Friend Streaks
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {isStreakPickerOpen && isMe && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setIsStreakPickerOpen(false)}
        >
          <div
            className="w-full sm:max-w-md max-h-[85vh] rounded-t-[28px] sm:rounded-[24px] border-2 border-b-4 border-slate-700 border-b-slate-800 bg-gradient-to-b from-[#101d38] via-[#0c162c] to-[#091020] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-5 border-b border-slate-800/90 flex items-center justify-between gap-3 bg-[#0b1528]/90 shrink-0">
              <div className="flex items-center gap-2">
                <img src="/icons/streak.png" alt="Streak" className="w-5 h-5 object-contain" />
                <h3 className="text-base sm:text-lg font-black text-white">
                  Choose Streak Buddies
                </h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-slate-700">
                  {selectedStreakUserIds.length}/5
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  soundEffects.playSoftClick();
                  setIsStreakPickerOpen(false);
                }}
                className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 border-b border-slate-800/70 bg-[#081020]/50 shrink-0">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={streakPickerSearch}
                  onChange={(e) => setStreakPickerSearch(e.target.value)}
                  placeholder="Search among coders you follow..."
                  className="w-full h-10 pl-9 pr-3 rounded-xl bg-slate-900/90 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2">
              {following.length === 0 ? (
                <div className="py-10 px-4 text-center flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                    <UserPlus className="w-6 h-6 text-slate-500" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold text-slate-300">
                      You are not following anyone yet
                    </span>
                    <span className="text-xs text-slate-500 max-w-xs">
                      Follow other coders first, then pick up to 5 friends to form shared daily debug streaks!
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      soundEffects.playSoftClick();
                      setIsStreakPickerOpen(false);
                      setIsSearchOpen(true);
                    }}
                    className="mt-2 h-10 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-cyan-950/40"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Find Coders to Follow</span>
                  </button>
                </div>
              ) : (
                following
                  .filter((u) => {
                    if (!streakPickerSearch.trim()) return true;
                    return u.username.toLowerCase().includes(streakPickerSearch.trim().toLowerCase());
                  })
                  .map((u) => {
                    const isSelected = selectedStreakUserIds.includes(String(u.id)) || selectedStreakUserIds.includes(u.username);
                    const isFull = selectedStreakUserIds.length >= 5 && !isSelected;

                    return (
                      <div
                        key={u.id}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/40 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-slate-950 overflow-hidden flex items-center justify-center border border-slate-800 shrink-0">
                            <AvatarRenderer config={u.avatar_config || DEFAULT_AVATAR_CONFIG} size={40} />
                          </div>
                          <div className="min-w-0 flex flex-col">
                            <span className="text-sm font-bold text-white leading-tight truncate">
                              {u.username}
                            </span>
                            <span className="text-xs font-bold text-slate-400 truncate mt-0.5 flex items-center gap-1">
                              <img src="/icons/streak.png" alt="Streak" className="w-3 h-3 object-contain shrink-0" />
                              <span className="font-mono text-amber-400">{u.streak || 5} days</span>
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          disabled={isFull}
                          onClick={() => handleToggleStreakFriend(String(u.id))}
                          className={`h-9 px-3.5 rounded-xl font-bold text-xs inline-flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                            isSelected
                              ? "bg-emerald-950/80 hover:bg-rose-950/80 border border-emerald-500/70 hover:border-rose-500/70 text-emerald-300 hover:text-rose-300"
                              : isFull
                              ? "bg-slate-800/60 border border-slate-700/60 text-slate-500 cursor-not-allowed"
                              : "bg-cyan-600 hover:bg-cyan-500 border border-cyan-400 text-white shadow-md shadow-cyan-950/30"
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>In Streaks</span>
                            </>
                          ) : isFull ? (
                            <span>Full (5/5)</span>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add to Streaks</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        </div>
      )}

      {pokeToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-rose-950/90 border border-rose-500/60 text-rose-200 text-xs sm:text-sm font-bold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom duration-200">
          <span>🚨</span>
          <span>{pokeToast}</span>
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
