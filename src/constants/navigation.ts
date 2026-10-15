import type { NavItemConfig } from "@/types/navigation";
import {
  PathIcon,
  VaultIcon,
  SetupIcon,
  StoreIcon,
  ProfileIcon,
  LeaderboardIcon,
  SettingsIcon,
} from "@/components/shared";

export const NAVIGATION_ITEMS: readonly NavItemConfig[] = [
  {
    id: "path",
    label: "Path",
    icon: PathIcon
  },
  {
    id: "debug",
    label: "Debug",
    icon: VaultIcon
  },
  {
    id: "leaderboard",
    label: "Leaderboard",
    icon: LeaderboardIcon
  },
  {
    id: "setup",
    label: "Setup",
    icon: SetupIcon
  },
  {
    id: "store",
    label: "Store",
    icon: StoreIcon
  },
  {
    id: "profile",
    label: "Profile",
    icon: ProfileIcon
  },
  {
    id: "settings",
    label: "Settings",
    icon: SettingsIcon
  }
];

export const MOBILE_NAVIGATION_ITEMS: readonly NavItemConfig[] = NAVIGATION_ITEMS.filter(
  (item) => item.id !== "leaderboard" && item.id !== "settings"
);
