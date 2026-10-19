"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Pencil, Search, UserCheck, UserPlus, X } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState<"followers" | "following">("followers");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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
          joined_at: currentUser?.created_at ? currentUser.created_at.slice(0, 10) : "2026-09-01",
          streak: selfCheck ? streakCount : 0,
          total_xp: selfCheck ? totalXP : 0,
          season_xp: selfCheck ? seasonXpStore : 0,
          current_rank: 20,
          rank_title: null,
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
  const effectiveAvatar =
    (isMe
      ? currentUser?.avatar_config || currentUser?.avatar || profile?.avatar_config
      : profile?.avatar_config) || DEFAULT_AVATAR_CONFIG;

  const avatarBorderClass =
    currentRank === 1
      ? "border-4 border-amber-400 shadow-xl shadow-amber-400/25"
      : currentRank === 2
      ? "border-4 border-slate-300 shadow-xl shadow-slate-300/25"
      : currentRank === 3
      ? "border-4 border-amber-600 shadow-xl shadow-amber-600/25"
      : "border-4 border-slate-700 shadow-md";

  const formattedJoinedDate = useMemo(() => {
    const rawDate = profile?.joined_at || (isMe ? currentUser?.created_at : null);
    if (!rawDate) return "Joined Recently";
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

  return (
    <div className="w-full min-h-screen pl-4 sm:pl-10 md:pl-16 lg:pl-24 xl:pl-32 pr-4 sm:pr-8 lg:pr-10 py-6 sm:py-8 flex flex-col lg:flex-row items-start gap-8 xl:gap-14 pb-24 md:pb-16 select-none">
      <div className="w-full max-w-xl xl:max-w-2xl flex flex-col shrink-0">
        <div className="hidden md:flex lg:hidden justify-end w-full mb-4">
          <DesktopMetricBar inline />
        </div>

        {!isMe && (
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white font-black text-sm transition-colors py-2 mb-4 cursor-pointer w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Leaderboard</span>
          </button>
        )}

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b-2 border-slate-800 pb-6 mb-6">
          <div className="flex flex-col items-start min-w-0">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight truncate max-w-full">
              {profileDisplayName}
            </h1>

            <span className="text-slate-400 font-bold text-sm mt-0.5 dir-ltr">
              @{profileHandle}
            </span>

            {formattedJoinedDate && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold mt-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formattedJoinedDate}</span>
              </div>
            )}

            <div className="flex items-center gap-3 text-sm font-black text-cyan-400 mt-3">
              <button
                type="button"
                onClick={() => {
                  soundEffects.playSoftClick();
                  setActiveTab("following");
                }}
                className="hover:underline cursor-pointer"
              >
                {profile?.following_count ?? following.length} Following
              </button>
              <span className="text-slate-600 font-black">&bull;</span>
              <button
                type="button"
                onClick={() => {
                  soundEffects.playSoftClick();
                  setActiveTab("followers");
                }}
                className="hover:underline cursor-pointer"
              >
                {profile?.followers_count ?? followers.length} Followers
              </button>
            </div>
          </div>

          <div className="relative shrink-0 self-center sm:self-auto">
            <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-slate-950 overflow-hidden flex items-center justify-center ${avatarBorderClass}`}>
              <AvatarRenderer config={effectiveAvatar} size={104} />
            </div>

            {currentRank === 1 && (
              <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[11px] uppercase tracking-wider shadow-md whitespace-nowrap">
                👑 Senior
              </span>
            )}
            {currentRank === 2 && (
              <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-slate-300 text-slate-950 font-black text-[11px] uppercase tracking-wider shadow-md whitespace-nowrap">
                🥈 Mid-Level
              </span>
            )}
            {currentRank === 3 && (
              <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-600 text-white font-black text-[11px] uppercase tracking-wider shadow-md whitespace-nowrap">
                🥉 Junior
              </span>
            )}

            {isMe && (
              <button
                type="button"
                onClick={() => {
                  soundEffects.playSoftClick();
                  setIsEditModalOpen(true);
                }}
                aria-label="Change Avatar"
                className="absolute bottom-0 right-0 w-8 h-8 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 flex items-center justify-center border-b-2 border-amber-600 active:translate-y-0.5 shadow-md transition-all cursor-pointer z-10"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="w-full mb-8">
          {loading ? (
            <div className="w-36 h-11 bg-slate-800/60 rounded-xl animate-pulse" />
          ) : isMe ? (
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/settings"
                onClick={() => soundEffects.playSoftClick()}
                className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border-2 border-b-4 border-slate-700 border-b-slate-900 text-slate-200 font-black text-sm px-5 py-2.5 rounded-xl transition-all active:translate-y-0.5 shadow-md"
              >
                <Pencil className="w-4 h-4" />
                <span>Edit Profile</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  soundEffects.playSoftClick();
                  setIsSearchOpen((prev) => !prev);
                }}
                className="inline-flex items-center gap-2 bg-cyan-500/15 hover:bg-cyan-500/25 border-2 border-b-4 border-cyan-500/40 border-b-cyan-800 text-cyan-300 font-black text-sm px-5 py-2.5 rounded-xl transition-all active:translate-y-0.5 shadow-md cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add Friends</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleToggleFollow}
              disabled={isSubmitting}
              className={`inline-flex items-center gap-2 font-black text-sm px-6 py-2.5 rounded-xl transition-all select-none cursor-pointer active:translate-y-0.5 ${
                profile?.is_following
                  ? "bg-slate-900 hover:bg-slate-800 border-2 border-b-4 border-slate-700 border-b-slate-800 text-cyan-400 shadow-md"
                  : "bg-cyan-500 hover:bg-cyan-400 border-2 border-cyan-400 border-b-4 border-b-cyan-700 text-slate-950 shadow-lg shadow-cyan-950/40"
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

          {isMe && isSearchOpen && (
            <div className="mt-4 p-4 rounded-2xl border-2 border-b-4 border-slate-800 border-b-slate-700 bg-slate-900/90 shadow-xl">
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

              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
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
                      <span className="text-xs font-black text-cyan-400 shrink-0">View Profile &rarr;</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="w-full mb-8">
          <h2 className="text-xl font-black text-white mb-4 tracking-tight">
            Statistics
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border-2 border-b-4 border-slate-800 border-b-slate-700 bg-slate-900/60 p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-2xl shrink-0">
                🔥
              </div>
              <div className="min-w-0">
                <div className="font-black text-white text-lg sm:text-xl leading-tight">
                  {profile?.streak ?? (isMe ? streakCount : 0)}
                </div>
                <div className="text-xs text-slate-400 font-bold truncate">Day Streak</div>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-b-4 border-slate-800 border-b-slate-700 bg-slate-900/60 p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-2xl shrink-0">
                ⚡
              </div>
              <div className="min-w-0">
                <div className="font-black text-white text-lg sm:text-xl leading-tight truncate">
                  {(profile?.total_xp ?? (isMe ? totalXP : 0)).toLocaleString()}
                </div>
                <div className="text-xs text-slate-400 font-bold truncate">Total XP</div>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-b-4 border-slate-800 border-b-slate-700 bg-slate-900/60 p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-2xl shrink-0">
                🏆
              </div>
              <div className="min-w-0">
                <div className="font-black text-white text-lg sm:text-xl leading-tight truncate">
                  #{currentRank} {profile?.rank_title ? `(${profile.rank_title})` : ""}
                </div>
                <div className="text-xs text-slate-400 font-bold truncate">Current Season Rank</div>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-b-4 border-slate-800 border-b-slate-700 bg-slate-900/60 p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-2xl shrink-0">
                🎯
              </div>
              <div className="min-w-0">
                <div className="font-black text-white text-lg sm:text-xl leading-tight truncate">
                  {(profile?.season_xp ?? (isMe ? seasonXpStore : 0)).toLocaleString()} XP
                </div>
                <div className="text-xs text-slate-400 font-bold truncate">Weekly Season XP</div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full rounded-2xl border-2 border-b-4 border-slate-800 border-b-slate-700 bg-slate-900/60 p-5">
          <div className="flex items-center gap-6 border-b-2 border-slate-800 pb-3 mb-4">
            <button
              type="button"
              onClick={() => {
                soundEffects.playSoftClick();
                setActiveTab("followers");
              }}
              className={`font-black text-sm pb-2 -mb-3 transition-colors cursor-pointer border-b-2 ${
                activeTab === "followers"
                  ? "border-cyan-400 text-white"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              Followers ({followers.length})
            </button>
            <button
              type="button"
              onClick={() => {
                soundEffects.playSoftClick();
                setActiveTab("following");
              }}
              className={`font-black text-sm pb-2 -mb-3 transition-colors cursor-pointer border-b-2 ${
                activeTab === "following"
                  ? "border-cyan-400 text-white"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              Following ({following.length})
            </button>
          </div>

          <div className="flex flex-col gap-2.5">
            {(activeTab === "followers" ? followers : following).length === 0 ? (
              <div className="py-6 text-center text-slate-500 font-bold text-sm">
                No {activeTab} yet.
              </div>
            ) : (
              (activeTab === "followers" ? followers : following).map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    soundEffects.playSoftClick();
                    router.push(`/profile/${encodeURIComponent(item.username)}`);
                  }}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#0b1324] border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-slate-950 overflow-hidden flex items-center justify-center border border-slate-800 shrink-0">
                      <AvatarRenderer config={item.avatar_config || DEFAULT_AVATAR_CONFIG} size={40} />
                    </div>
                    <div className="min-w-0">
                      <div className="font-black text-white text-sm sm:text-base truncate">
                        {item.username}
                      </div>
                      <div className="text-xs text-slate-400 font-bold">
                        @{item.username.toLowerCase().replace(/\s+/g, "_")}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono font-black text-sm text-amber-400">
                      {item.total_xp.toLocaleString()} <span className="text-xs text-amber-300 font-sans">XP</span>
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 justify-center sticky top-8">
        <DesktopMetricBar inline />
      </div>

      <AvatarCustomizerModal
        isOpen={isEditModalOpen}
        initialConfig={effectiveAvatar}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveAvatar}
      />
    </div>
  );
}
