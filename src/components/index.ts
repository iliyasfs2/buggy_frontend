export {
  DesktopSidebar,
  DesktopMetricBar,
  MobileHeader,
  MobileBottomNav,
  AppShell,
  HomeClient,
} from "./layout";
export type {
  DesktopSidebarProps,
  DesktopMetricBarProps,
  MobileHeaderProps,
  MobileBottomNavProps,
  AppShellProps,
} from "./layout";

export {
  StatBadge,
  PathIcon,
  VaultIcon,
  SetupIcon,
  StoreIcon,
  ProfileIcon,
  BuggyLogo,
  StreakPopover,
  BatteryPopover,
  BytePopover,
  CoursePopover,
} from "./shared";
export type {
  StatBadgeProps,
  StatBadgeVariant,
  BuggyLogoProps,
  StreakPopoverProps,
} from "./shared";

export { SetupView } from "./setup";

export {
  PathView,
  ChapterSection,
  PathNodeButton,
  LessonNode,
  LessonIcon,
  PathGuidebookModal,
  PathSidebar,
} from "./path";
export type {
  LessonNodeProps,
  NodeState,
  NodePalette,
  LessonIconType,
  LessonIconProps,
} from "./path";

export {
  ProfileView,
  AvatarRenderer,
  AvatarCustomizer,
  AvatarCustomizerModal,
  StatisticsGrid,
  AchievementsList,
} from "./profile";
export type { AvatarRendererProps } from "./profile";

export { DailyQuestsCard } from "./quests";

export { RouteGuard } from "./auth/RouteGuard";

export {
  LessonPlayer,
  STEP_REGISTRY,
  getStepRenderer,
} from "./lesson";

export { StoreView } from "./store";
export { DebugView } from "./debug";
