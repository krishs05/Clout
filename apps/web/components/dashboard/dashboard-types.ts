import {
  BarChart3,
  Command,
  LayoutDashboard,
  type LucideIcon,
  Server,
  Settings,
  ShieldCheck,
} from "lucide-react";

export interface BotStatus {
  online: boolean;
  uptime: number;
  guilds: number;
  users: number;
  commands: number;
  websocketPing: number;
  memoryUsage: number;
}

export interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  owner?: boolean;
  permissions?: string;
}

export interface User {
  id: string;
  discordId: string;
  username: string;
  avatar: string | null;
  balance: number;
  goodDeeds: number;
  badDeeds: number;
  guilds?: DiscordGuild[];
}

export interface DashboardNavItem {
  description: string;
  icon: LucideIcon;
  id: DashboardTabId;
  label: string;
}

export type DashboardTabId =
  | "overview"
  | "servers"
  | "embeds"
  | "commands"
  | "analytics"
  | "admin";

export const DASHBOARD_ITEMS: DashboardNavItem[] = [
  {
    id: "overview",
    label: "Overview",
    description: "Status, controls, and account health",
    icon: LayoutDashboard,
  },
  {
    id: "servers",
    label: "Servers",
    description: "Guild settings and moderation controls",
    icon: Server,
  },
  {
    id: "embeds",
    label: "Embed Editor",
    description: "Brand the bot output your way",
    icon: Settings,
  },
  {
    id: "commands",
    label: "Commands",
    description: "Current slash command surface",
    icon: Command,
  },
  {
    id: "analytics",
    label: "Analytics",
    description: "Activity and growth snapshots",
    icon: BarChart3,
  },
  {
    id: "admin",
    label: "Admin",
    description: "Moderation log and bot settings",
    icon: ShieldCheck,
  },
];
