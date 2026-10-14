import type { NavItemConfig } from "@/types/navigation";
import {
  PathIcon,
  VaultIcon,
  SetupIcon,
  StoreIcon,
  ProfileIcon
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
  }
];
