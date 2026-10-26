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
  Globe,
  Mail,
  Github,
  Linkedin,
  Edit3,
  ExternalLink,
  ShieldCheck,
  Check,
} from "lucide-react";
import { AvatarRenderer } from "@/components/profile/AvatarRenderer";
import { AvatarCustomizerModal } from "@/components/profile/AvatarCustomizerModal";
import { ProfileHonors } from "@/components/profile/ProfileHonors";
import { DesktopMetricBar } from "@/components/layout/DesktopMetricBar";
import { soundEffects } from "@/utils/soundEffects";
import { useAuthStore } from "@/store/useAuthStore";
import { useGameStore } from "@/store/useGameStore";
import { useNavStore } from "@/store/useNavStore";
import { DEFAULT_AVATAR_CONFIG, type AvatarConfig } from "@/services/authApi";
import {
  fetchUserProfileApi,
  fetchUserConnectionsApi,
  fetchLeaderboardApi,
  followUserApi,
  unfollowUserApi,
  switchCourseApi,
  updateDevCardApi,
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

export interface DevCardDataState {
  specialtyTitle: string;
  collabStatus: string;
  bio: string;
  techStack: string[];
  githubUrl: string;
  linkedinUrl: string;
  websiteUrl: string;
  email: string;
}

const DEFAULT_DEV_CARD_DATA: DevCardDataState = {
  specialtyTitle: "Full-Stack Developer & Debug Engineer",
  collabStatus: "🟢 Open to Work & Projects",
  bio: "Passionate about scalable architectures, solving complex algorithmic challenges, and continuous learning on Buggy.",
  techStack: ["React", "Next.js", "FastAPI", "TypeScript", "Tailwind CSS", "Docker", "PostgreSQL", "Python"],
  githubUrl: "https://github.com",
  linkedinUrl: "https://linkedin.com",
  websiteUrl: "https://buggy.dev",
  email: "coder@buggy.dev",
};

const VERIFIED_BUGGY_SKILLS = [
  { name: "JavaScript", percent: 92, badge: "Buggy Verified ✓", desc: "Verified via advanced Buggy tests" },
  { name: "Debugging & Problem Solving", percent: 96, badge: "Buggy Verified ✓", desc: "Verified with 50+ solved challenges" },
  { name: "Python & Backend", percent: 84, badge: "Buggy Verified ✓", desc: "Verified in backend tracks" },
  { name: "React & Architecture", percent: 88, badge: "Buggy Verified ✓", desc: "Verified in frontend architecture" },
];

const FEATURED_DEV_PROJECTS = [
  {
    id: "p1",
    title: "Buggy Core Engine",
    desc: "Real-time cloud evaluation and sandboxed execution engine for debug challenges.",
    tech: "FastAPI • Docker • Redis",
    link: "https://github.com",
  },
  {
    id: "p2",
    title: "DevPulse Leaderboard",
    desc: "10-day competitive leaderboard system with dynamic ranking and seasonal badges.",
    tech: "Next.js • Tailwind • PostgreSQL",
    link: "https://github.com",
  },
  {
    id: "p3",
    title: "SmartCode Runner",
    desc: "Interactive client-side sandbox with intelligent error diagnostics and AST analysis.",
    tech: "TypeScript • WebAssembly",
    link: "https://github.com",
  },
];

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
  const navCompletedNodesCount = useNavStore((s) => s.completedNodesCount);
  const navMistakesCount = useNavStore((s) => s.mistakesCount);

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

  const [isEditingDevCard, setIsEditingDevCard] = useState(false);
  const [devCardData, setDevCardData] = useState<DevCardDataState>(DEFAULT_DEV_CARD_DATA);
  const [editDevCardForm, setEditDevCardForm] = useState<DevCardDataState>(DEFAULT_DEV_CARD_DATA);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const devCardStorageKey = `buggy_dev_card_${currentUser?.id || currentUser?.username || "default"}`;
    try {
      const stored = localStorage.getItem(devCardStorageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object") {
          setDevCardData((prev) => {
            const next = { ...prev, ...parsed };
            setEditDevCardForm(next);
            return next;
          });
        }
      }
    } catch {
    }
  }, [currentUser?.id, currentUser?.username]);

  const handleSaveDevCard = (updated: DevCardDataState) => {
    soundEffects.playSoftClick();
    setDevCardData(updated);
    setIsEditingDevCard(false);
    if (typeof window !== "undefined") {
      const devCardStorageKey = `buggy_dev_card_${currentUser?.id || currentUser?.username || "default"}`;
      try {
        localStorage.setItem(devCardStorageKey, JSON.stringify(updated));
      } catch {
      }
    }
    updateDevCardApi(updated)
      .then(() => {
        setDirectoryUsers((prev) =>
          prev.map((u) =>
            u.id === `user_${currentUser?.id}` || u.username === currentUser?.username
              ? { ...u, coder_title: updated.specialtyTitle }
              : u
          )
        );
      })
      .catch(() => {});
  };

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
        if (profData?.dev_card && typeof profData.dev_card === "object" && Object.keys(profData.dev_card).length > 0) {
          setDevCardData((prev) => {
            const next = { ...prev, ...profData.dev_card };
            if (profData.coder_title) {
              next.specialtyTitle = profData.coder_title;
            }
            setEditDevCardForm(next);
            return next;
          });
        } else if (profData?.coder_title) {
          setDevCardData((prev) => {
            const next = { ...prev, specialtyTitle: profData.coder_title! };
            setEditDevCardForm(next);
            return next;
          });
        }
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
  const effectiveCompletedNodes = profile?.completed_nodes_count ?? (isMe ? navCompletedNodesCount : 0);
  const effectiveSolvedMistakes = profile?.solved_mistakes_count ?? (isMe ? navMistakesCount : 0);

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

  const streakBuddiesCandidates = useMemo(() => {
    const userMap = new Map<string, UserConnectionItem>();
    for (const f of following) {
      userMap.set(String(f.id), f);
    }
    for (const f of followers) {
      if (!userMap.has(String(f.id))) {
        userMap.set(String(f.id), f);
      }
    }
    return Array.from(userMap.values());
  }, [following, followers]);

  const activeConnections = activeTab === "following" ? following : followers;

  return (
    <div className="w-full min-h-screen px-0 sm:pl-10 md:pl-16 lg:pl-24 xl:pl-32 sm:pr-8 lg:pr-10 pt-0 pb-6 sm:py-8 flex flex-col lg:flex-row items-start gap-8 xl:gap-14 select-none relative">
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
              className={`relative w-full rounded-none sm:rounded-[24px] border-0 overflow-hidden shadow-2xl bg-[#091122] ${
                isMe ? "cursor-pointer group" : ""
              }`}
            >
              <svg
                viewBox="0 0 800 520"
                className="w-full h-auto block sm:hidden select-none pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="roomWallGradMobile" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0f1f3d" />
                    <stop offset="65%" stopColor="#0b152b" />
                    <stop offset="100%" stopColor="#070c18" />
                  </linearGradient>
                  <linearGradient id="roomFloorGradMobile" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#070d1a" />
                    <stop offset="100%" stopColor="#03060d" />
                  </linearGradient>
                  <linearGradient id="deskGradMobile" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1e293b" />
                    <stop offset="100%" stopColor="#0f172a" />
                  </linearGradient>
                  <radialGradient id="cyberGlowMobile" cx="50%" cy="40%" r="50%">
                    <stop offset="0%" stopColor="rgba(56, 189, 248, 0.25)" />
                    <stop offset="100%" stopColor="transparent" />
                  </radialGradient>
                </defs>

                <rect x="0" y="0" width="800" height="260" fill="url(#roomWallGradMobile)" />
                <rect x="0" y="0" width="800" height="260" fill="url(#cyberGlowMobile)" />

                <g stroke="rgba(30, 58, 110, 0.3)" strokeWidth="1">
                  <line x1="0" y1="65" x2="800" y2="65" />
                  <line x1="0" y1="130" x2="800" y2="130" />
                  <line x1="0" y1="195" x2="800" y2="195" />
                  <line x1="160" y1="0" x2="160" y2="260" />
                  <line x1="320" y1="0" x2="320" y2="260" />
                  <line x1="480" y1="0" x2="480" y2="260" />
                  <line x1="640" y1="0" x2="640" y2="260" />
                </g>

                <rect x="70" y="70" width="130" height="8" rx="2" fill="#1e293b" />
                <rect x="80" y="52" width="12" height="18" fill="#38bdf8" fillOpacity="0.8" rx="1" />
                <rect x="94" y="46" width="10" height="24" fill="#a855f7" fillOpacity="0.8" rx="1" />
                <rect x="106" y="56" width="14" height="14" fill="#34d399" fillOpacity="0.8" rx="1" />

                <rect x="600" y="70" width="130" height="8" rx="2" fill="#1e293b" />
                <rect x="615" y="48" width="22" height="22" rx="3" fill="#0f172a" stroke="#0ea5e9" strokeWidth="1.5" />
                <circle cx="626" cy="59" r="3" fill="#22d3ee" />

                <polygon points="0,260 800,260 800,520 0,520" fill="url(#roomFloorGradMobile)" />
                <line x1="0" y1="260" x2="800" y2="260" stroke="#0284c7" strokeWidth="2" strokeOpacity="0.7" />

                <g stroke="rgba(2, 132, 199, 0.25)" strokeWidth="1.5">
                  <line x1="-100" y1="520" x2="200" y2="260" />
                  <line x1="80" y1="520" x2="320" y2="260" />
                  <line x1="720" y1="520" x2="480" y2="260" />
                  <line x1="900" y1="520" x2="600" y2="260" />
                </g>

                <g transform="translate(240, 285)">
                  <rect x="0" y="0" width="320" height="24" rx="6" fill="url(#deskGradMobile)" stroke="#334155" strokeWidth="2" />
                  <rect x="110" y="6" width="100" height="4" rx="2" fill="#38bdf8" fillOpacity="0.7" />
                </g>
              </svg>

              <svg
                viewBox="0 0 800 360"
                className="w-full h-auto hidden sm:block select-none pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="roomWallGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0f1f3d" />
                    <stop offset="65%" stopColor="#0b152b" />
                    <stop offset="100%" stopColor="#070c18" />
                  </linearGradient>
                  <linearGradient id="roomFloorGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#070d1a" />
                    <stop offset="100%" stopColor="#03060d" />
                  </linearGradient>
                  <linearGradient id="deskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1e293b" />
                    <stop offset="100%" stopColor="#0f172a" />
                  </linearGradient>
                  <radialGradient id="cyberGlow" cx="50%" cy="40%" r="50%">
                    <stop offset="0%" stopColor="rgba(56, 189, 248, 0.25)" />
                    <stop offset="100%" stopColor="transparent" />
                  </radialGradient>
                </defs>

                <rect x="0" y="0" width="800" height="260" fill="url(#roomWallGrad)" />
                <rect x="0" y="0" width="800" height="260" fill="url(#cyberGlow)" />

                <g stroke="rgba(30, 58, 110, 0.3)" strokeWidth="1">
                  <line x1="0" y1="65" x2="800" y2="65" />
                  <line x1="0" y1="130" x2="800" y2="130" />
                  <line x1="0" y1="195" x2="800" y2="195" />
                  <line x1="160" y1="0" x2="160" y2="260" />
                  <line x1="320" y1="0" x2="320" y2="260" />
                  <line x1="480" y1="0" x2="480" y2="260" />
                  <line x1="640" y1="0" x2="640" y2="260" />
                </g>

                <rect x="70" y="70" width="130" height="8" rx="2" fill="#1e293b" />
                <rect x="80" y="52" width="12" height="18" fill="#38bdf8" fillOpacity="0.8" rx="1" />
                <rect x="94" y="46" width="10" height="24" fill="#a855f7" fillOpacity="0.8" rx="1" />
                <rect x="106" y="56" width="14" height="14" fill="#34d399" fillOpacity="0.8" rx="1" />

                <rect x="600" y="70" width="130" height="8" rx="2" fill="#1e293b" />
                <rect x="615" y="48" width="22" height="22" rx="3" fill="#0f172a" stroke="#0ea5e9" strokeWidth="1.5" />
                <circle cx="626" cy="59" r="3" fill="#22d3ee" />

                <polygon points="0,260 800,260 800,360 0,360" fill="url(#roomFloorGrad)" />
                <line x1="0" y1="260" x2="800" y2="260" stroke="#0284c7" strokeWidth="2" strokeOpacity="0.7" />

                <g stroke="rgba(2, 132, 199, 0.25)" strokeWidth="1.5">
                  <line x1="0" y1="360" x2="200" y2="260" />
                  <line x1="200" y1="360" x2="320" y2="260" />
                  <line x1="600" y1="360" x2="480" y2="260" />
                  <line x1="800" y1="360" x2="600" y2="260" />
                </g>

                <g transform="translate(240, 285)">
                  <rect x="0" y="0" width="320" height="24" rx="6" fill="url(#deskGrad)" stroke="#334155" strokeWidth="2" />
                  <rect x="110" y="6" width="100" height="4" rx="2" fill="#38bdf8" fillOpacity="0.7" />
                </g>
              </svg>

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[56%] sm:w-[50%] max-w-[400px] aspect-square flex items-center justify-center transition-transform duration-300 group-hover:scale-105 mb-16 sm:mb-4">
                  <svg
                    viewBox="0 0 400 400"
                    className="w-full h-full select-none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <radialGradient id="charGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="rgba(34, 211, 238, 0.3)" />
                        <stop offset="100%" stopColor="transparent" />
                      </radialGradient>
                    </defs>
                    <circle cx="200" cy="200" r="160" fill="url(#charGlow)" />
                    <g transform="translate(60, 60)">
                      <AvatarRenderer config={effectiveAvatar} size={280} />
                    </g>
                  </svg>
                </div>
              </div>

              {coderLevel && (
                <div
                  className={`absolute bottom-3.5 left-4 z-20 h-7 px-3 rounded-full backdrop-blur-md inline-flex items-center gap-1.5 text-xs font-black shadow-lg ${coderBadgeStyle}`}
                >
                  <span>
                    {coderLevel === "Senior" ? "👑" : coderLevel === "Mid-Level" ? "🥈" : "🥉"}
                  </span>
                  <span>{coderLevel}</span>
                </div>
              )}
            </div>

            <div className="px-4 sm:px-0 flex flex-col">
              <div className="mt-6 flex items-baseline gap-2.5 flex-wrap">
                <h1 className="font-black text-[22px] sm:text-[26px] text-white tracking-tight">
                  {profileDisplayName}
                </h1>
                <span className="text-sm sm:text-base font-bold text-slate-400 font-mono">
                  @{profileHandle}
                </span>
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

              <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
                <div className="p-3 sm:p-4 rounded-2xl border-2 border-b-4 border-slate-700 border-b-slate-800 bg-[#0d182e]/80 flex items-center gap-2.5 sm:gap-3.5 shadow-md">
                  <img
                    src="/icons/streak.png"
                    alt="Streak"
                    className="w-8 h-8 sm:w-9 sm:h-9 object-contain shrink-0 drop-shadow"
                  />
                  <div className="min-w-0 flex flex-col">
                    <span className="text-base sm:text-xl font-black text-white leading-tight whitespace-nowrap">
                      {effectiveStreak} Days
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-400 mt-0.5 whitespace-nowrap">
                      Streak
                    </span>
                  </div>
                </div>

                <div className="p-3 sm:p-4 rounded-2xl border-2 border-b-4 border-slate-700 border-b-slate-800 bg-[#0d182e]/80 flex items-center gap-2.5 sm:gap-3.5 shadow-md">
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
                    <span className="text-base sm:text-xl font-black text-white leading-tight whitespace-nowrap">
                      {effectiveCompletedNodes}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-400 mt-0.5 whitespace-nowrap">
                      Lessons
                    </span>
                  </div>
                </div>

                <div
                  onClick={() => {
                    soundEffects.playSoftClick();
                    router.push("/leaderboard");
                  }}
                  className="p-3 sm:p-4 rounded-2xl border-2 border-b-4 border-slate-700 border-b-slate-800 bg-[#0d182e]/80 flex items-center gap-2.5 sm:gap-3.5 shadow-md cursor-pointer hover:border-blue-500 hover:border-b-blue-600 transition-all group"
                  title="View 10-Day Season Leaderboard"
                >
                  <img
                    src="/icons/trophy.png"
                    alt="Season Standing"
                    className="w-8 h-8 sm:w-9 sm:h-9 object-contain shrink-0 drop-shadow group-hover:scale-105 transition-transform"
                  />
                  <div className="min-w-0 flex flex-col">
                    <span className="text-base sm:text-xl font-black text-white leading-tight whitespace-nowrap">
                      {hasRank ? `Rank #${currentRank}` : "Unranked"}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-400 mt-0.5 whitespace-nowrap">
                      Season Rank
                    </span>
                  </div>
                </div>

                <div className="p-3 sm:p-4 rounded-2xl border-2 border-b-4 border-slate-700 border-b-slate-800 bg-[#0d182e]/80 flex items-center gap-2.5 sm:gap-3.5 shadow-md">
                  <img
                    src="/icons/lightning.png"
                    alt="Total XP"
                    className="w-8 h-8 sm:w-9 sm:h-9 object-contain shrink-0 drop-shadow"
                  />
                  <div className="min-w-0 flex flex-col">
                    <span className="text-base sm:text-xl font-black text-white leading-tight whitespace-nowrap">
                      {effectiveXp.toLocaleString()} XP
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-400 mt-0.5 whitespace-nowrap">
                      Total XP
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 sm:mt-8">
              <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                <h2 className="text-sm sm:text-base font-black text-slate-300 uppercase tracking-wider">
                  Friend Streaks
                </h2>
              </div>

              <div className="grid grid-cols-5 gap-2 sm:gap-4 md:gap-6 justify-items-center py-0.5 px-1">
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

            <div className="mt-6 sm:mt-8">
              <ProfileHonors
                streak={effectiveStreak}
                totalXP={effectiveXp}
                completedNodesCount={effectiveCompletedNodes}
                followersCount={followersCount}
                currentRank={currentRank}
                solvedMistakesCount={effectiveSolvedMistakes}
              />
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
          className="fixed inset-0 z-50 overflow-y-auto bg-[#0f172a] md:bg-black/60 md:backdrop-blur-sm md:flex md:items-center md:justify-center md:p-4 animate-in fade-in duration-200"
          onClick={() => setIsCoursesModalOpen(false)}
        >
          <div
            className="w-full min-h-screen md:min-h-0 md:max-w-md md:rounded-3xl border-0 md:border-2 md:border-b-4 border-slate-700 border-b-slate-800 bg-[#0f172a] md:bg-gradient-to-b md:from-[#101d38] md:via-[#0c162c] md:to-[#091020] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-5 border-b border-slate-800/90 flex items-center justify-between gap-3 bg-[#0b1528] shrink-0 sticky top-0 z-10">
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

            <div className="p-5 sm:p-6 flex flex-col gap-4 flex-1">
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
          className="fixed inset-0 z-50 overflow-y-auto bg-[#0f172a] md:bg-black/60 md:backdrop-blur-sm md:flex md:items-center md:justify-center md:p-4 animate-in fade-in duration-200"
          onClick={() => setIsFriendsModalOpen(false)}
        >
          <div
            className="w-full min-h-screen md:min-h-0 md:max-w-md md:h-[540px] md:rounded-3xl border-0 md:border-2 md:border-b-4 border-slate-700 border-b-slate-800 bg-[#0f172a] md:bg-gradient-to-b md:from-[#101d38] md:via-[#0c162c] md:to-[#091020] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-800/90 flex items-center justify-between gap-3 bg-[#0b1528] shrink-0 sticky top-0 z-10">
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
          className="fixed inset-0 z-50 overflow-y-auto bg-[#0c162c] md:bg-black/60 md:backdrop-blur-sm md:flex md:items-center md:justify-center md:p-4 animate-in fade-in duration-200"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="w-full min-h-screen md:min-h-0 md:max-w-xl md:h-[650px] md:rounded-3xl border-0 md:border-2 md:border-b-4 border-slate-700 border-b-slate-800 bg-[#0c162c] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-5 flex items-center justify-between gap-3 bg-[#0c162c] shrink-0 sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-cyan-400" strokeWidth={2.5} />
                <span className="text-base sm:text-lg font-black text-white">Find Coders</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundEffects.playSoftClick();
                  setIsSearchOpen(false);
                }}
                className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
              >
                <X className="w-5 h-5" strokeWidth={3} />
              </button>
            </div>

            <div className="px-4 py-2 bg-[#0c162c] shrink-0">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={2.75} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by username or title..."
                  className="w-full h-12 pl-10 pr-3.5 rounded-2xl bg-slate-900/90 border-[3px] border-slate-700 text-sm font-bold text-white placeholder-slate-400 placeholder:font-bold focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2 bg-[#0c162c] flex flex-col">
              {filteredSearchUsers.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center gap-4 my-auto">
                  <Search className="w-16 h-16 text-slate-400" strokeWidth={2.2} />
                  <span className="text-base font-bold text-slate-400">
                    {directoryUsers.length === 0 ? "Loading coders..." : "No matching coders found"}
                  </span>
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
          className="fixed inset-0 z-50 overflow-y-auto bg-[#0f172a] md:bg-black/60 md:backdrop-blur-sm md:flex md:items-center md:justify-center md:p-4 animate-in fade-in duration-200"
          onClick={() => setIsDevCardOpen(false)}
        >
          <div
            className="w-full min-h-screen md:min-h-0 md:w-[640px] md:max-w-[640px] md:max-h-[88vh] rounded-none md:rounded-3xl border-0 md:border-2 md:border-b-4 border-slate-700 border-b-slate-800 bg-[#0f172a] md:bg-gradient-to-b md:from-[#101d38] md:via-[#0c162c] md:to-[#091020] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-slate-800/90 flex items-center justify-between gap-3 shrink-0 bg-[#0b1528] sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <img src="/icons/dev-card.png" alt="Dev Card" className="w-5 h-auto max-h-5 object-contain" />
                <span className="text-base font-black text-white">Developer Card (Dev Card)</span>
              </div>

              <div className="flex items-center gap-2">
                {isMe && !isEditingDevCard && (
                  <button
                    type="button"
                    onClick={() => {
                      soundEffects.playSoftClick();
                      setEditDevCardForm(devCardData);
                      setIsEditingDevCard(true);
                    }}
                    className="h-8 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-400 hover:text-cyan-300 text-xs font-black inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Card</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playSoftClick();
                    setIsDevCardOpen(false);
                    setIsEditingDevCard(false);
                  }}
                  className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-6">
              {isEditingDevCard ? (
                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-300">Developer Specialty Title:</label>
                    <input
                      type="text"
                      value={editDevCardForm.specialtyTitle}
                      onChange={(e) => setEditDevCardForm((prev) => ({ ...prev, specialtyTitle: e.target.value }))}
                      placeholder="e.g. Full-Stack Developer & Debug Engineer"
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-300">Collaboration &amp; Project Status:</label>
                    <select
                      value={editDevCardForm.collabStatus}
                      onChange={(e) => setEditDevCardForm((prev) => ({ ...prev, collabStatus: e.target.value }))}
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                    >
                      <option value="🟢 Open to Work & Projects">🟢 Open to Work &amp; Projects</option>
                      <option value="🟡 Exploring New Opportunities">🟡 Exploring New Opportunities</option>
                      <option value="🔴 Busy with Current Projects">🔴 Busy with Current Projects</option>
                      <option value="💼 Available for Mentorship & Consulting">💼 Available for Mentorship &amp; Consulting</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-300">Short Bio (max 2 lines):</label>
                    <textarea
                      rows={2}
                      value={editDevCardForm.bio}
                      onChange={(e) => setEditDevCardForm((prev) => ({ ...prev, bio: e.target.value }))}
                      placeholder="Write about your coding passions and current goals..."
                      className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-300">Tech Stack &amp; Tools (comma separated):</label>
                    <input
                      type="text"
                      value={editDevCardForm.techStack.join(", ")}
                      onChange={(e) =>
                        setEditDevCardForm((prev) => ({
                          ...prev,
                          techStack: e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        }))
                      }
                      placeholder="React, Next.js, FastAPI, Docker, TypeScript"
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-400">GitHub Link:</label>
                      <input
                        type="text"
                        value={editDevCardForm.githubUrl}
                        onChange={(e) => setEditDevCardForm((prev) => ({ ...prev, githubUrl: e.target.value }))}
                        placeholder="https://github.com/..."
                        className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-400">LinkedIn Link:</label>
                      <input
                        type="text"
                        value={editDevCardForm.linkedinUrl}
                        onChange={(e) => setEditDevCardForm((prev) => ({ ...prev, linkedinUrl: e.target.value }))}
                        placeholder="https://linkedin.com/in/..."
                        className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-400">Website / Portfolio Link:</label>
                      <input
                        type="text"
                        value={editDevCardForm.websiteUrl}
                        onChange={(e) => setEditDevCardForm((prev) => ({ ...prev, websiteUrl: e.target.value }))}
                        placeholder="https://mysite.dev"
                        className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-400">Work Email:</label>
                      <input
                        type="email"
                        value={editDevCardForm.email}
                        onChange={(e) => setEditDevCardForm((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="coder@example.com"
                        className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsEditingDevCard(false)}
                      className="h-10 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveDevCard(editDevCardForm)}
                      className="h-10 px-5 rounded-xl bg-cyan-600 hover:bg-cyan-500 border border-cyan-400 text-white font-bold text-xs inline-flex items-center gap-1.5 transition-all shadow-md shadow-cyan-950/40 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-2xl bg-[#091326] border border-slate-800/80">
                    <div className="w-20 h-20 rounded-2xl bg-slate-950 border-2 border-cyan-400/50 flex items-center justify-center overflow-hidden shrink-0 shadow-lg shadow-cyan-500/10">
                      <AvatarRenderer config={effectiveAvatar} size={74} />
                    </div>

                    <div className="flex-1 min-w-0 text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
                        <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                          <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                            {profileDisplayName}
                          </h3>
                        </div>

                        <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-1 rounded-full self-center sm:self-auto shrink-0 shadow-sm">
                          {devCardData.collabStatus}
                        </span>
                      </div>

                      <div className="text-sm font-black text-cyan-300 mt-1">
                        {devCardData.specialtyTitle}
                      </div>

                      <div className="text-xs font-bold text-slate-400 mt-0.5">
                        @{profileHandle}
                        {hasRank ? ` • Season Rank #${currentRank}` : ""}
                        {formattedJoinedDate ? ` • ${formattedJoinedDate}` : ""}
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed font-medium mt-3 bg-[#060c18] p-2.5 rounded-xl border border-slate-800/70">
                        {devCardData.bio}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                        <span>Section 1: Verified Skills in Buggy</span>
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {VERIFIED_BUGGY_SKILLS.map((skill) => (
                        <div
                          key={skill.name}
                          className="p-3 rounded-2xl bg-[#091326] border border-slate-800 flex flex-col gap-2 shadow-sm"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-black text-white">{skill.name}</span>
                            <span className="text-[10px] font-black text-amber-400 bg-amber-950/80 border border-amber-500/50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                              <ShieldCheck className="w-2.5 h-2.5" />
                              <span>{skill.badge}</span>
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 rounded-full"
                                style={{ width: `${skill.percent}%` }}
                              />
                            </div>
                            <span className="text-xs font-mono font-black text-amber-400 shrink-0">
                              {skill.percent}%
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-medium">{skill.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-black text-white mb-3 flex items-center gap-1.5">
                      <span>🛠️</span>
                      <span>Section 2: Tech Stack &amp; Tools</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {devCardData.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1.5 rounded-xl bg-[#09152b] hover:bg-[#0d2042] border border-cyan-500/30 text-cyan-300 hover:text-white text-xs font-black shadow-sm transition-colors cursor-default"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-black text-white mb-3 flex items-center gap-1.5">
                      <span>🚀</span>
                      <span>Section 3: Featured Projects &amp; Portfolio</span>
                    </h4>

                    <div className="space-y-2.5">
                      {FEATURED_DEV_PROJECTS.map((proj) => (
                        <div
                          key={proj.id}
                          className="p-3.5 rounded-2xl bg-[#091326] border border-slate-800 hover:border-slate-700 flex flex-col gap-2 transition-colors"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-black text-white">{proj.title}</span>
                              <span className="text-[10px] font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-800">
                                {proj.tech}
                              </span>
                            </div>

                            <a
                              href={proj.link}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
                            >
                              <span>View</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>

                          <p className="text-xs text-slate-400 leading-relaxed font-medium">
                            {proj.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="px-5 sm:px-6 py-4 border-t border-slate-800/90 bg-[#0b1528] shrink-0">
              <div className="flex items-center justify-between flex-wrap gap-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-400">Contact &amp; Social:</span>
                  <a
                    href={devCardData.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="GitHub"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                  <a
                    href={devCardData.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a
                    href={devCardData.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Website"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                  <a
                    href={`mailto:${devCardData.email}`}
                    className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Email"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-500">
                    ID: {profile?.id || currentUser?.id || "buggy-coder"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedStreakFriend && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-[#0f172a] md:bg-black/60 md:backdrop-blur-sm md:flex md:items-center md:justify-center md:p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedStreakFriend(null)}
        >
          <div
            className="w-full min-h-screen md:min-h-0 md:max-w-md md:rounded-3xl border-0 md:border-2 md:border-b-4 border-slate-700 border-b-slate-800 bg-[#0f172a] md:bg-gradient-to-b md:from-[#101d38] md:via-[#0c162c] md:to-[#091020] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-5 border-b border-slate-800/90 flex items-center justify-between gap-3 bg-[#0b1528] shrink-0 sticky top-0 z-10">
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

            <div className="p-5 sm:p-6 flex flex-col gap-5 flex-1">
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
                    {pokedFriends[selectedStreakFriend.id] ? "Poke Sent!" : "Send Poke (Red-light Alert)"}
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
          className="fixed inset-0 z-50 overflow-y-auto bg-[#0c162c] md:bg-black/60 md:backdrop-blur-sm md:flex md:items-center md:justify-center md:p-4 animate-in fade-in duration-200"
          onClick={() => setIsStreakPickerOpen(false)}
        >
          <div
            className="w-full min-h-screen md:min-h-0 md:max-w-xl md:h-[650px] md:rounded-3xl border-0 md:border-2 md:border-b-4 border-slate-700 border-b-slate-800 bg-[#0c162c] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-5 flex items-center justify-between gap-3 bg-[#0c162c] shrink-0 sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <img src="/icons/streak.png" alt="Streak" className="w-5 h-5 object-contain" />
                <h3 className="text-base sm:text-lg font-black text-white">
                  Choose Streak Buddies
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  soundEffects.playSoftClick();
                  setIsStreakPickerOpen(false);
                }}
                className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
              >
                <X className="w-5 h-5" strokeWidth={3} />
              </button>
            </div>

            <div className="px-4 py-2 bg-[#0c162c] shrink-0">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={2.75} />
                <input
                  type="text"
                  value={streakPickerSearch}
                  onChange={(e) => setStreakPickerSearch(e.target.value)}
                  placeholder="Search among coders you follow..."
                  className="w-full h-12 pl-10 pr-3.5 rounded-2xl bg-slate-900/90 border-[3px] border-slate-700 text-sm font-bold text-white placeholder-slate-400 placeholder:font-bold focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2 bg-[#0c162c] flex flex-col">
              {streakBuddiesCandidates.filter((u) => {
                if (!streakPickerSearch.trim()) return true;
                return u.username.toLowerCase().includes(streakPickerSearch.trim().toLowerCase());
              }).length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center gap-4 my-auto">
                  <UserPlus className="w-16 h-16 text-slate-400" strokeWidth={2.2} />
                  <span className="text-base font-bold text-slate-400">
                    No friends found
                  </span>
                </div>
              ) : (
                streakBuddiesCandidates
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
                            <span className="text-sm font-bold text-white leading-tight">
                              {u.username}
                            </span>
                            <span className="text-xs font-bold text-slate-400 mt-0.5 flex items-center gap-1">
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
