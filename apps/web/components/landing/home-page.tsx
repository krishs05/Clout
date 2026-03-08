"use client";

import { type ComponentType, type JSX, Suspense, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Bot,
  Boxes,
  Check,
  Crown,
  ExternalLink,
  FileText,
  Github,
  Mail,
  Menu,
  MessageCircle,
  Music,
  PanelsTopLeft,
  Shield,
  Sparkles,
  Terminal,
  Wallet,
  X,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { LogoIcon } from "@/components/logo-3d";
import { SelfHostedExpandableSection } from "@/components/self-hosted-expandable-section";
import { BorderBeam } from "@/components/magicui/border-beam";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { MagicCard } from "@/components/magicui/magic-card";
import { SparklesText } from "@/components/magicui/sparkles-text";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clearCloutToken, useCloutSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { HeroActionFlow } from "./hero-action-flow";
import { ShowcaseCube } from "./showcase-cube";

const REPO_URL = "https://github.com/krishs05/clout";

const navigationItems = [
  { label: "Features", href: "#features" },
  { label: "Showcase", href: "#showcase" },
  { label: "Docs", href: "#docs" },
  { label: "Contact", href: "#contact" },
];

const benefits = [
  "Discord OAuth login for secure dashboard access",
  "Self-hosted deployment with Docker and PostgreSQL",
  "Karma, economy, moderation, music, and analytics in one stack",
];

const featureCards = [
  {
    icon: Crown,
    title: "Karma & Reputation",
    description:
      "Track good and bad deeds with visible reputation metrics that make community trust tangible.",
    accent: "text-indigo-300",
    tint: "bg-indigo-500/10",
  },
  {
    icon: Wallet,
    title: "Economy System",
    description:
      "Daily rewards, balances, transfers, and mini-games give your server a durable incentive layer.",
    accent: "text-amber-300",
    tint: "bg-amber-500/10",
  },
  {
    icon: Shield,
    title: "Moderation",
    description:
      "Welcome flows, auto-mod toggles, and server-level settings stay manageable from one control plane.",
    accent: "text-emerald-300",
    tint: "bg-emerald-500/10",
  },
  {
    icon: Music,
    title: "Music",
    description:
      "Music support stays inside the platform story instead of turning the product into a novelty bot.",
    accent: "text-pink-300",
    tint: "bg-pink-500/10",
  },
  {
    icon: PanelsTopLeft,
    title: "Dashboard",
    description:
      "Manage servers, embeds, commands, and analytics from a premium web dashboard with live status updates.",
    accent: "text-violet-300",
    tint: "bg-violet-500/10",
  },
  {
    icon: Boxes,
    title: "Customization",
    description:
      "Embed templates, server settings, custom commands, and open-source extensibility keep the stack adaptable.",
    accent: "text-violet-300",
    tint: "bg-violet-500/10",
  },
];

const showcaseItems = [
  {
    id: "karma",
    eyebrow: "Reputation Tracking",
    title: "Karma that shapes community behavior",
    description:
      "Good and bad deeds build a visible social layer across your server, with reputation exposed in both commands and dashboard views.",
    icon: Crown,
    stat: "+128 trust events",
    chips: ["good deeds", "bad deeds", "leaderboard"],
    tone: "indigo",
    preview: {
      overview: {
        label: "Trust ledger",
        value: "+128",
        hint: "Surface who improves the room and who needs attention.",
        bars: [0.34, 0.78, 0.5],
        chips: ["trust", "events", "rank"],
      },
      activity: {
        label: "Weekly pulse",
        value: "36/wk",
        hint: "Track daily deed volume and trend changes in real time.",
        bars: [0.58, 0.42, 0.84],
        chips: ["streaks", "shifts", "alerts"],
      },
      actions: {
        label: "Command flow",
        value: "/good",
        hint: "Jump into profile views, leaderboards, and moderation context.",
        bars: [0.26, 0.66, 0.52],
        chips: ["profile", "review", "board"],
      },
    },
  },
  {
    id: "economy",
    eyebrow: "Virtual Currency",
    title: "Economy features that feel native to your server",
    description:
      "Daily rewards, balances, transfers, and mini-games connect retention mechanics to the members who actually show up.",
    icon: Wallet,
    stat: "4.2k coins moved",
    chips: ["daily", "pay", "rewards"],
    tone: "amber",
    preview: {
      overview: {
        label: "Balance stream",
        value: "4.2k",
        hint: "See how coins move across rewards, payouts, and games.",
        bars: [0.82, 0.48, 0.68],
        chips: ["daily", "payout", "bank"],
      },
      activity: {
        label: "Reward loop",
        value: "92%",
        hint: "Preview retention around daily claims and recurring activity.",
        bars: [0.52, 0.86, 0.42],
        chips: ["streak", "bonus", "claim"],
      },
      actions: {
        label: "Transfer tools",
        value: "/pay",
        hint: "Open the commands that keep the server economy feeling native.",
        bars: [0.38, 0.6, 0.76],
        chips: ["send", "redeem", "game"],
      },
    },
  },
  {
    id: "moderation",
    eyebrow: "Server Protection",
    title: "Moderation tools without a cluttered control panel",
    description:
      "Configure welcome flows, anti-link, anti-invite, anti-spam, and mod-log settings from a dashboard built for server operators.",
    icon: Shield,
    stat: "12 rules active",
    chips: ["anti-link", "anti-spam", "mod log"],
    tone: "emerald",
    preview: {
      overview: {
        label: "Rule guard",
        value: "12",
        hint: "Keep moderation rules visible without opening a separate panel.",
        bars: [0.7, 0.5, 0.88],
        chips: ["rules", "safety", "logs"],
      },
      activity: {
        label: "Threat queue",
        value: "live",
        hint: "Preview anti-link, anti-spam, and welcome checks at a glance.",
        bars: [0.44, 0.82, 0.58],
        chips: ["scan", "block", "trace"],
      },
      actions: {
        label: "Operator tools",
        value: "/warn",
        hint: "Open the moderator actions that keep the server under control.",
        bars: [0.3, 0.56, 0.78],
        chips: ["warn", "kick", "audit"],
      },
    },
  },
  {
    id: "music",
    eyebrow: "Voice Experience",
    title: "Music and entertainment as part of the platform",
    description:
      "Keep fun features in the stack without letting them define the whole product. The experience stays cohesive and admin-friendly.",
    icon: Music,
    stat: "queue orchestration",
    chips: ["voice", "queue", "playback"],
    tone: "violet",
    preview: {
      overview: {
        label: "Queue room",
        value: "24trk",
        hint: "Preview the player queue and current session state instantly.",
        bars: [0.46, 0.74, 0.6],
        chips: ["queue", "now", "mood"],
      },
      activity: {
        label: "Playback",
        value: "sync",
        hint: "Follow transitions between tracks, votes, and listener actions.",
        bars: [0.68, 0.36, 0.84],
        chips: ["play", "skip", "vote"],
      },
      actions: {
        label: "Voice controls",
        value: "/play",
        hint: "Open the command path for sessions, skips, and stop controls.",
        bars: [0.28, 0.64, 0.9],
        chips: ["join", "skip", "stop"],
      },
    },
  },
] as const;

type ShowcaseItem = (typeof showcaseItems)[number];
type ShowcaseItemId = ShowcaseItem["id"];
type ShowcaseView = "overview" | "activity" | "actions";

const SHOWCASE_VIEWS = ["overview", "activity", "actions"] as const;

const SHOWCASE_VIEW_META: Record<
  ShowcaseView,
  {
    accentClass: string;
    label: string;
  }
> = {
  overview: {
    accentClass: "bg-red-400/85",
    label: "Overview",
  },
  activity: {
    accentClass: "bg-amber-400/85",
    label: "Activity",
  },
  actions: {
    accentClass: "bg-emerald-400/85",
    label: "Actions",
  },
};

const SHOWCASE_TONE_STYLES = {
  indigo: {
    activeBorder: "border-indigo-400/40",
    activePanel: "bg-indigo-500/[0.14]",
    activeGlow: "shadow-[0_20px_50px_rgba(99,102,241,0.18)]",
    hoverPanel: "hover:border-indigo-400/20 hover:bg-indigo-500/[0.06]",
    eyebrow: "text-indigo-100/80",
    body: "text-zinc-100/92",
    hint: "text-zinc-300/80",
    pill: "border-indigo-400/20 bg-indigo-500/10 text-indigo-100",
  },
  amber: {
    activeBorder: "border-amber-400/40",
    activePanel: "bg-amber-500/[0.14]",
    activeGlow: "shadow-[0_20px_50px_rgba(245,158,11,0.16)]",
    hoverPanel: "hover:border-amber-400/20 hover:bg-amber-500/[0.06]",
    eyebrow: "text-amber-100/80",
    body: "text-zinc-100/92",
    hint: "text-zinc-300/80",
    pill: "border-amber-400/20 bg-amber-500/10 text-amber-100",
  },
  emerald: {
    activeBorder: "border-emerald-400/40",
    activePanel: "bg-emerald-500/[0.14]",
    activeGlow: "shadow-[0_20px_50px_rgba(16,185,129,0.16)]",
    hoverPanel: "hover:border-emerald-400/20 hover:bg-emerald-500/[0.06]",
    eyebrow: "text-emerald-100/80",
    body: "text-zinc-100/92",
    hint: "text-zinc-300/80",
    pill: "border-emerald-400/20 bg-emerald-500/10 text-emerald-100",
  },
  violet: {
    activeBorder: "border-violet-400/40",
    activePanel: "bg-violet-500/[0.14]",
    activeGlow: "shadow-[0_20px_50px_rgba(139,92,246,0.16)]",
    hoverPanel: "hover:border-violet-400/20 hover:bg-violet-500/[0.06]",
    eyebrow: "text-violet-100/80",
    body: "text-zinc-100/92",
    hint: "text-zinc-300/80",
    pill: "border-violet-400/20 bg-violet-500/10 text-violet-100",
  },
} as const;

const getStartedSteps = [
  {
    step: "STEP 01",
    icon: Github,
    title: "Clone & install",
    description: "Grab the monorepo, install workspaces, and prepare the web, API, and bot apps together.",
    href: `${REPO_URL}#1-clone--install`,
  },
  {
    step: "STEP 02",
    icon: FileText,
    title: "Configure environment",
    description: "Set Discord OAuth credentials, database access, JWT secrets, and optional feature keys.",
    href: `${REPO_URL}#2-environment-setup`,
  },
  {
    step: "STEP 03",
    icon: Bot,
    title: "Run & deploy",
    description: "Push the schema, start development services, and use Docker when you are ready to self-host.",
    href: `${REPO_URL}#4-run-development`,
  },
];

const docsLinks = [
  {
    title: "Project Overview",
    description: "Architecture, stack, and app boundaries for web, API, bot, and shared packages.",
    href: REPO_URL,
  },
  {
    title: "Quick Start",
    description: "Install, environment setup, database push, and local development commands.",
    href: `${REPO_URL}#quick-start`,
  },
  {
    title: "Docker Deployment",
    description: "Use Docker Compose to bring up PostgreSQL, API, bot, and frontend together.",
    href: `${REPO_URL}#docker-deployment`,
  },
  {
    title: "Environment Variables",
    description: "Reference Discord, database, JWT, and optional API keys from the README.",
    href: `${REPO_URL}#environment-variables`,
  },
];

const footerResources = [
  { label: "Documentation", href: "#docs" },
  { label: "GitHub", href: REPO_URL },
  { label: "Docker Deployment", href: `${REPO_URL}#docker-deployment` },
  { label: "Contributing", href: `${REPO_URL}#contributing` },
];

const footerConnect = [
  { label: "Email", href: "mailto:hello@clout.dev" },
  { label: "GitHub Issues", href: `${REPO_URL}/issues` },
  { label: "Discord Developer Portal", href: "https://discord.com/developers/applications" },
];

function scrollToId(id: string): void {
  const target = document.getElementById(id);
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function ShowcaseFeatureArt({
  activeView,
  icon: Icon,
  onActivate,
  onViewChange,
  preview,
  title,
  tone,
}: {
  activeView: ShowcaseView;
  icon: ComponentType<{ className?: string }>;
  onActivate: () => void;
  onViewChange: (view: ShowcaseView) => void;
  preview: ShowcaseItem["preview"];
  title: string;
  tone: "amber" | "emerald" | "indigo" | "violet";
}) {
  const palette = {
    indigo: {
      border: "border-indigo-500/20",
      glow: "from-indigo-500/25 to-violet-500/10",
      icon: "text-indigo-200",
      iconBg: "bg-indigo-500/15",
      line: "bg-indigo-400/70",
      chip: "border-indigo-500/20 bg-indigo-500/10 text-indigo-200",
      bar: "bg-indigo-400/80",
    },
    amber: {
      border: "border-amber-500/20",
      glow: "from-amber-500/25 to-orange-500/10",
      icon: "text-amber-200",
      iconBg: "bg-amber-500/15",
      line: "bg-amber-300/70",
      chip: "border-amber-500/20 bg-amber-500/10 text-amber-200",
      bar: "bg-amber-300/80",
    },
    emerald: {
      border: "border-emerald-500/20",
      glow: "from-emerald-500/25 to-teal-500/10",
      icon: "text-emerald-200",
      iconBg: "bg-emerald-500/15",
      line: "bg-emerald-300/70",
      chip: "border-emerald-500/20 bg-emerald-500/10 text-emerald-200",
      bar: "bg-emerald-300/80",
    },
    violet: {
      border: "border-violet-500/20",
      glow: "from-violet-500/25 to-pink-500/10",
      icon: "text-violet-200",
      iconBg: "bg-violet-500/15",
      line: "bg-violet-300/70",
      chip: "border-violet-500/20 bg-violet-500/10 text-violet-200",
      bar: "bg-violet-300/80",
    },
  }[tone];
  const activePreview = preview[activeView];

  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-[168px] min-h-[220px] overflow-hidden rounded-[1.2rem] border bg-[#0b0d12] p-2.5 shadow-[0_18px_38px_rgba(0,0,0,0.28)] sm:max-w-[188px] sm:min-h-[248px] sm:rounded-[1.35rem] sm:p-3 md:mx-0 md:min-h-[260px]",
        palette.border,
      )}
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-90", palette.glow)} />
      <div className="absolute inset-x-3 top-3 flex items-center justify-between">
        <div className={cn("flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[0.95rem] backdrop-blur-sm", palette.iconBg)}>
          <Icon className={cn("h-[18px] w-[18px]", palette.icon)} />
        </div>
        <div className="flex items-center gap-1.5">
          {SHOWCASE_VIEWS.map((view) => {
            const selected = activeView === view;

            return (
              <button
                key={view}
                type="button"
                aria-label={`Open ${SHOWCASE_VIEW_META[view].label.toLowerCase()} preview for ${title}`}
                aria-pressed={selected}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onActivate();
                  onViewChange(view);
                }}
                className={cn(
                  "h-2.5 w-2.5 rounded-full transition duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40",
                  SHOWCASE_VIEW_META[view].accentClass,
                  selected ? "ring-1 ring-white/45" : "opacity-75 hover:opacity-100",
                )}
              />
            );
          })}
        </div>
      </div>

      <div className="absolute inset-x-3 bottom-3 top-10 flex scale-[0.9] origin-top flex-col rounded-[0.95rem] border border-white/[0.08] bg-[#090b10]/90 p-3 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-zinc-400">
          <Terminal className="h-3 w-3" />
          clout.module
        </div>

        <div className="mt-2 flex flex-1 flex-col gap-2 overflow-hidden">
          <div className="flex items-center gap-2 rounded-[0.9rem] border border-white/[0.06] bg-white/[0.03] px-2.5 py-2">
            <Activity className={cn("h-4 w-4 shrink-0", palette.icon)} />
            <div className="flex-1">
              <p className="truncate text-[10px] uppercase tracking-[0.18em] text-zinc-400">{activePreview.label}</p>
              <div className={cn("mt-1.5 h-1.5 w-20 rounded-full", palette.line)} />
            </div>
          </div>
          <p className="line-clamp-2 min-h-8 text-[10px] leading-[1.45] text-zinc-300/85">{activePreview.hint}</p>
          <div className="grid h-12 grid-cols-3 gap-1.5">
            {activePreview.bars.map((height, index) => (
              <div key={index} className="rounded-[0.9rem] border border-white/[0.06] bg-white/[0.03] p-2">
                <div className="flex h-full items-end">
                  <div className={cn("w-full rounded-md", palette.bar)} style={{ height: `${height * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-1">
            {activePreview.chips.map((chip) => (
              <span
                key={chip}
                className={cn(
                  "truncate rounded-full border px-1.5 py-1 text-center text-[10px] uppercase tracking-[0.12em]",
                  palette.chip,
                )}
              >
                {chip}
              </span>
            ))}
          </div>
          <p className="pt-1 text-[10px] uppercase tracking-[0.16em] text-zinc-400">Click lights for more info</p>
        </div>
      </div>
    </div>
  );
}

export function HomePage(): JSX.Element {
  const { isAuthenticated, loginUrl } = useCloutSession();
  const [activeSection, setActiveSection] = useState("features");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeShowcaseIndex, setActiveShowcaseIndex] = useState(0);
  const [showcaseViews, setShowcaseViews] = useState<Record<ShowcaseItemId, ShowcaseView>>({
    karma: "overview",
    economy: "overview",
    moderation: "overview",
    music: "overview",
  });
  const [authNotice, setAuthNotice] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const handleScroll = (): void => {
      const ids = navigationItems.map((item) => item.href.replace("#", ""));
      const selected = ids.find((id) => {
        const node = document.getElementById(id);
        if (!node) {
          return false;
        }

        const rect = node.getBoundingClientRect();
        return rect.top <= 140 && rect.bottom >= 140;
      });

      if (selected) {
        setActiveSection(selected);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const error = new URLSearchParams(window.location.search).get("error");
    if (!error) {
      return;
    }

    const message =
      error === "auth_failed"
        ? "Sign-in failed. Please try again."
        : "No token was returned. Please try signing in again.";

    setAuthNotice(message);
    toast.error("Discord sign-in failed", {
      description: message,
    });
    window.history.replaceState({}, "", "/");
  }, []);

  const showcasePanel = useMemo(
    () => showcaseItems[activeShowcaseIndex] ?? showcaseItems[0],
    [activeShowcaseIndex],
  );
  const activeShowcaseView = showcaseViews[showcasePanel.id] ?? "overview";
  const activeShowcasePreview = showcasePanel.preview[activeShowcaseView];
  const activeShowcaseTone = SHOWCASE_TONE_STYLES[showcasePanel.tone];

  const handleShowcaseSelect = (index: number): void => {
    setActiveShowcaseIndex(index);
  };

  const handleShowcaseViewChange = (id: ShowcaseItemId, index: number, view: ShowcaseView): void => {
    setShowcaseViews((current) => ({
      ...current,
      [id]: view,
    }));
    handleShowcaseSelect(index);
  };

  const handleSignOut = (): void => {
    clearCloutToken();
    toast.success("Signed out", {
      description: "Your local dashboard session has been cleared.",
    });
  };

  const handleSubscribe = (): void => {
    if (!email.trim()) {
      toast.info("Enter an email address first", {
        description: "The updates form is UI-only in this pass, but the interaction is still wired.",
      });
      return;
    }

    toast.success("Subscribed locally", {
      description: "This redesign keeps updates UI-only for now. No backend subscription was created.",
    });
    setEmail("");
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0a0a0b] text-white">
      <div className="pointer-events-none fixed inset-0 z-0">
        <FlickeringGrid
          className="absolute inset-0"
          squareSize={6}
          gridGap={8}
          color="#8b5cf6"
          maxOpacity={0.12}
          flickerChance={0.05}
        />
        <div className="absolute left-[12%] top-10 h-96 w-96 rounded-full bg-indigo-500/[0.05] blur-[140px]" />
        <div className="absolute bottom-0 right-[8%] h-[28rem] w-[28rem] rounded-full bg-violet-500/[0.04] blur-[160px]" />
      </div>

      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed left-0 right-0 top-0 z-50 glass-strong"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-9 w-9">
              <LogoIcon className="h-full w-full" />
            </div>
            <span className="text-xl font-semibold text-white">Clout</span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navigationItems.map((item) => {
              const id = item.href.replace("#", "");
              const active = activeSection === id;

              return (
                <button
                  key={item.label}
                  onClick={() => scrollToId(id)}
                  className={cn(
                    "rounded-xl border px-4 py-2 text-sm transition-all",
                    active
                      ? "border-indigo-500/20 bg-indigo-500/10 text-indigo-300"
                      : "border-transparent text-zinc-400 hover:bg-white/[0.03] hover:text-zinc-200",
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="border-zinc-700 bg-transparent text-zinc-300 hover:bg-white/[0.03] hover:text-white"
              >
                Dashboard
              </Button>
            </Link>
            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="text-zinc-400 hover:bg-red-500/10 hover:text-red-300"
                >
                  Sign Out
                </Button>
                <Link href="/dashboard">
                  <Button className="bg-indigo-600 text-white hover:bg-indigo-500">
                    Open Dashboard
                  </Button>
                </Link>
              </>
            ) : (
              <Link href={loginUrl}>
                <Button className="bg-indigo-600 text-white hover:bg-indigo-500">
                  Login with Discord
                </Button>
              </Link>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {mobileMenuOpen ? (
          <div className="border-t border-white/[0.06] bg-[#0a0a0b]/95 px-4 py-4 md:hidden">
            <div className="flex flex-col gap-2">
              {navigationItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    scrollToId(item.href.replace("#", ""));
                    setMobileMenuOpen(false);
                  }}
                  className="rounded-xl px-4 py-3 text-left text-zinc-300 transition-colors hover:bg-white/[0.03]"
                >
                  {item.label}
                </button>
              ))}
              <Link href="/dashboard" className="rounded-xl px-4 py-3 text-zinc-300 hover:bg-white/[0.03]">
                Dashboard
              </Link>
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" className="rounded-xl bg-indigo-600 px-4 py-3 text-white">
                    Open Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="rounded-xl px-4 py-3 text-left text-red-300 hover:bg-red-500/10"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link href={loginUrl} className="rounded-xl bg-indigo-600 px-4 py-3 text-white">
                  Login with Discord
                </Link>
              )}
            </div>
          </div>
        ) : null}
      </motion.nav>

      <main className="relative z-10">
        <section className="pt-16 pb-12 sm:pt-20 sm:pb-14 md:pt-24 md:pb-20">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 md:py-12 lg:px-8 lg:py-14">
            {authNotice ? (
              <Alert className="mb-6 border-red-500/20 bg-red-500/10 text-red-100 sm:mb-8">
                <AlertTitle>Authentication issue</AlertTitle>
                <AlertDescription>{authNotice}</AlertDescription>
              </Alert>
            ) : null}

            <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(33rem,42rem)] lg:gap-14">
              <div className="min-w-0">
                <Badge className="mb-4 border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-indigo-300 sm:mb-6 sm:px-4 sm:py-1.5">
                  <Sparkles className="mr-1.5 h-3 w-3 sm:mr-2 sm:h-3.5 sm:w-3.5" />
                  <span className="text-xs sm:text-sm">Open-source Discord bot with premium control surfaces</span>
                </Badge>
                <motion.h1
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
                >
                  <span>Build</span>
                  <br />
                  <SparklesText
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
                    colors={{ first: "#6366f1", second: "#8b5cf6" }}
                    sparklesCount={5}
                  >
                    Community
                  </SparklesText>
                  <span> Clout</span>
                </motion.h1>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-300/85 sm:mt-6 sm:text-lg">
                  Clout is a full-stack Discord bot with a premium dashboard for communities that care about
                  quality, control, and open-source ownership. Sign in with Discord to access the dashboard,
                  manage servers, and configure the bot without leaving the browser.
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:gap-4 sm:flex-row">
                  <Link href={isAuthenticated ? "/dashboard" : loginUrl} className="w-full sm:w-auto">
                    <Button className="h-12 w-full min-h-[3rem] bg-indigo-600 px-6 text-base text-white hover:bg-indigo-500 sm:w-auto sm:px-8">
                      {isAuthenticated ? "Open Dashboard" : "Login with Discord"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => scrollToId("features")}
                    className="h-12 w-full min-h-[3rem] border-zinc-700 bg-transparent px-6 text-base text-zinc-300 hover:bg-white/[0.03] hover:text-white sm:w-auto sm:px-8"
                  >
                    Explore Features
                  </Button>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                  {benefits.map((benefit) => (
                    <div key={benefit} className="flex min-w-0 items-start gap-3 rounded-2xl border border-white/[0.05] bg-white/[0.02] p-3 sm:p-4">
                      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 sm:h-7 sm:w-7">
                        <Check className="h-3 w-3 text-emerald-400 sm:h-3.5 sm:w-3.5" />
                      </div>
                      <p className="min-w-0 text-sm leading-relaxed text-zinc-300/85">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative min-w-0 max-w-[42rem] lg:justify-self-end">
                <div className="absolute -left-10 top-10 h-36 w-36 rounded-full bg-indigo-500/20 blur-3xl" />
                <div className="absolute -bottom-10 right-0 h-40 w-40 rounded-full bg-violet-500/15 blur-3xl" />
                <HeroActionFlow isAuthenticated={isAuthenticated} />
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-14 sm:py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex flex-col gap-4 sm:mb-14 sm:gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <Badge className="mb-3 border-violet-500/20 bg-violet-500/10 text-violet-300 sm:mb-4">Features</Badge>
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">Everything your server needs</h2>
              </div>
              <p className="max-w-2xl text-sm text-zinc-400 sm:text-base">
                The bot, API, and dashboard are designed as one product. Features stay consistent whether you are
                running commands in Discord or configuring behavior in the web app.
              </p>
            </div>

            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
              {featureCards.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.45, delay: index * 0.05 }}
                >
                  <MagicCard className="glass card-hover h-full rounded-[1.5rem] border-white/[0.06] p-4 inner-glow sm:rounded-[1.75rem] sm:p-6 md:p-7">
                    <div className={cn("mb-4 flex h-10 w-10 items-center justify-center rounded-2xl sm:mb-6 sm:h-12 sm:w-12", feature.tint)}>
                      <feature.icon className={cn("h-5 w-5 sm:h-6 sm:w-6", feature.accent)} />
                    </div>
                    <h3 className="text-xl font-semibold text-white sm:text-2xl">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-400 sm:mt-3 sm:text-base">{feature.description}</p>
                  </MagicCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="showcase" className="py-14 sm:py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 sm:mb-14">
              <Badge className="mb-3 border-indigo-500/20 bg-indigo-500/10 text-indigo-300 sm:mb-4">Showcase</Badge>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">See Clout in action</h2>
              <p className="mt-3 max-w-2xl text-sm text-zinc-300/80 sm:mt-4 sm:text-base">
                A streamlined gallery view keeps the active module in focus while still letting you scan every
                system quickly. Open any card to inspect the live preview state for reputation, economy,
                moderation, and voice features.
              </p>
            </div>

            <div className="space-y-8">
              <div
                className={cn(
                  "relative overflow-hidden rounded-[1.6rem] border bg-white/[0.02] p-3 sm:rounded-[1.85rem] sm:p-5 md:p-6 xl:p-7",
                  activeShowcaseTone.activeBorder,
                  activeShowcaseTone.activePanel,
                  activeShowcaseTone.activeGlow,
                )}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.1),transparent_34%)]" />
                <div className="relative grid min-w-0 gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.9fr)] lg:items-center xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
                  <div className="order-2 min-w-0 overflow-hidden rounded-[1.4rem] border border-white/[0.06] bg-black/20 sm:rounded-[1.8rem] lg:order-1">
                    <ShowcaseCube
                      activeIndex={activeShowcaseIndex}
                      activeView={activeShowcaseView}
                      onViewChange={(view) => handleShowcaseViewChange(showcasePanel.id, activeShowcaseIndex, view)}
                    />
                  </div>

                  <div className="relative z-10 order-1 min-w-0 lg:order-2">
                    <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">
                      FEATURE {String(activeShowcaseIndex + 1).padStart(2, "0")} / 04
                    </p>
                    <p className={cn("mt-3 text-[11px] uppercase tracking-[0.24em]", activeShowcaseTone.eyebrow)}>
                      {showcasePanel.eyebrow}
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold leading-tight text-zinc-100 sm:text-3xl md:max-w-[12ch] md:text-4xl">
                      {showcasePanel.title}
                    </h3>
                    <p className={cn("mt-4 max-w-xl text-base leading-8", activeShowcaseTone.body)}>
                      {showcasePanel.description}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <span className={cn("rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.18em]", activeShowcaseTone.pill)}>
                        {SHOWCASE_VIEW_META[activeShowcaseView].label}
                      </span>
                      <span className={cn("rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.18em]", activeShowcaseTone.pill)}>
                        {activeShowcasePreview.label}
                      </span>
                      <span className={cn("rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.18em]", activeShowcaseTone.pill)}>
                        {activeShowcasePreview.value}
                      </span>
                    </div>

                    <p className={cn("mt-5 max-w-xl text-sm leading-7", activeShowcaseTone.hint)}>
                      {activeShowcasePreview.hint}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {showcasePanel.chips.map((chip) => (
                        <span
                          key={chip}
                          className="rounded-full border border-white/[0.08] bg-black/20 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-zinc-300"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>

                    <p className="mt-6 text-xs text-zinc-300/75">
                      Click a gallery card or the red, yellow, and green controls to drill into each module preview.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {showcaseItems.map((item, index) => {
                  const active = index === activeShowcaseIndex;
                  const selectedView = showcaseViews[item.id];
                  const selectedPreview = item.preview[selectedView];
                  const toneStyles = SHOWCASE_TONE_STYLES[item.tone];

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      whileHover={{
                        y: -6,
                        rotate: active ? 0 : index % 2 === 0 ? -0.35 : 0.35,
                      }}
                      onMouseEnter={() => handleShowcaseSelect(index)}
                      onFocus={() => handleShowcaseSelect(index)}
                      onClick={() => handleShowcaseSelect(index)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          handleShowcaseSelect(index);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-pressed={active}
                      aria-label={`Open ${item.title}`}
                      className={cn(
                        "group relative grid w-full min-w-0 gap-5 overflow-hidden rounded-[1.6rem] border p-4 text-left transition-all md:min-h-[280px] md:grid-cols-[minmax(176px,208px)_minmax(0,1fr)] md:items-center md:p-5",
                        active
                          ? cn(toneStyles.activeBorder, toneStyles.activePanel, toneStyles.activeGlow, "text-white")
                          : cn("border-white/[0.06] bg-white/[0.02]", toneStyles.hoverPanel),
                      )}
                    >
                      <div
                        className={cn(
                          "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300",
                          active && "opacity-100",
                        )}
                      >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_38%)]" />
                      </div>
                      <div className="absolute right-4 top-4 text-[2.8rem] font-semibold tracking-tight text-white/[0.05] md:right-5 md:top-5 md:text-[3rem]">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <ShowcaseFeatureArt
                        activeView={selectedView}
                        icon={item.icon}
                        onActivate={() => handleShowcaseSelect(index)}
                        onViewChange={(view) => handleShowcaseViewChange(item.id, index, view)}
                        preview={item.preview}
                        title={item.title}
                        tone={item.tone}
                      />
                      <div className="relative z-10 min-w-0 pr-7 md:pr-10">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-white/30" />
                          <p className={cn("text-[11px] uppercase tracking-[0.28em]", active ? toneStyles.eyebrow : "text-zinc-500")}>
                            {item.eyebrow}
                          </p>
                        </div>
                        <h3 className="mt-3 max-w-[22rem] text-[1.35rem] font-semibold leading-[1.08] tracking-[-0.02em] md:text-[1.52rem] xl:text-[1.64rem]">
                          {item.title}
                        </h3>
                        <p className={cn("mt-2.5 max-w-[28rem] text-[0.94rem] leading-7", active ? toneStyles.body : "text-zinc-400")}>
                          {item.description}
                        </p>
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          <span
                            className={cn(
                              "rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.18em]",
                              active ? toneStyles.pill : "border-white/[0.08] bg-white/[0.03] text-zinc-400",
                            )}
                          >
                            {SHOWCASE_VIEW_META[selectedView].label}
                          </span>
                          <span
                            className={cn(
                              "rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.18em]",
                              active ? toneStyles.pill : "border-white/[0.08] bg-white/[0.03] text-zinc-400",
                            )}
                          >
                            {selectedPreview.value}
                          </span>
                        </div>
                        <p className={cn("mt-3 max-w-[28rem] text-xs leading-6", active ? toneStyles.hint : "text-zinc-500")}>
                          {selectedPreview.hint}
                        </p>
                        <p className={cn("mt-2 text-xs", active ? toneStyles.hint : "text-zinc-500")}>
                          Click the card or the preview lights for more info.
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="docs" className="py-14 sm:py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 grid gap-4 sm:mb-14 sm:gap-6 lg:grid-cols-[0.84fr_1.16fr] lg:items-end">
              <div className="max-w-xl">
                <Badge className="mb-3 border-violet-500/20 bg-violet-500/10 text-violet-300 sm:mb-4">Docs</Badge>
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">Get started without leaving the site</h2>
              </div>
              <p className="max-w-2xl text-sm text-zinc-400 sm:text-base lg:justify-self-end">
                This section is backed by the current README. It summarizes the actual project structure, quick-start
                steps, deployment paths, and environment variables instead of inventing a separate docs product.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {getStartedSteps.map((step, index) => (
                <motion.a
                  key={step.step}
                  href={step.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="glass card-hover rounded-[1.5rem] border-white/[0.06] p-4 sm:rounded-[1.75rem] sm:p-6"
                >
                  <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">{step.step}</p>
                  <div className="mt-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/10 sm:mt-5 sm:h-12 sm:w-12">
                    <step.icon className="h-5 w-5 text-indigo-300 sm:h-6 sm:w-6" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold sm:mt-5 sm:text-2xl">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400 sm:mt-3 sm:text-base">{step.description}</p>
                  <div className="mt-6 inline-flex items-center gap-2 text-sm text-indigo-300">
                    View docs
                    <ExternalLink className="h-4 w-4" />
                  </div>
                </motion.a>
              ))}
            </div>

            <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-[1.5rem] border border-white/[0.06] bg-white/[0.02] p-4 sm:rounded-[1.75rem] sm:p-6 md:p-8">
                <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">Open Source Structure</p>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {docsLinks.map((item) => (
                    <a
                      key={item.title}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-colors hover:bg-white/[0.04]"
                    >
                      <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.description}</p>
                    </a>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/[0.06] bg-white/[0.02] p-4 sm:rounded-[1.75rem] sm:p-6 md:p-8">
                <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">Why the stack fits Clout</p>
                <div className="mt-6 space-y-4">
                  {[
                    "Next.js 16 powers the landing page and dashboard UI.",
                    "Express and WebSocket endpoints drive bot controls and live status.",
                    "Discord.js and Prisma keep the bot layer and data layer explicit.",
                    "Docker Compose remains the shortest path to self-hosted development.",
                  ].map((line) => (
                    <div key={line} className="flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      </div>
                      <p className="text-sm leading-relaxed text-zinc-400">{line}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 sm:py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 sm:mb-10">
              <Badge className="mb-3 border-emerald-500/20 bg-emerald-500/10 text-emerald-300 sm:mb-4">Self-Hosted</Badge>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">Open source by default, self-hosted by design</h2>
              <p className="mt-3 max-w-2xl text-sm text-zinc-400 sm:mt-4 sm:text-base">
                The existing Clout expandable section stays in the experience, but the surrounding page now positions it
                as part of the product story rather than an isolated block.
              </p>
            </div>
            <Suspense
              fallback={
                <div className="glass flex h-80 items-center justify-center rounded-[1.75rem] border-white/[0.06]">
                  <div className="flex items-center gap-3 text-zinc-500">
                    <div className="h-5 w-5 rounded-full border-2 border-indigo-500/30 border-t-indigo-400 animate-spin" />
                    <span>Loading self-hosted section...</span>
                  </div>
                </div>
              }
            >
              <SelfHostedExpandableSection />
            </Suspense>
          </div>
        </section>

        <section className="py-14 sm:py-20 md:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-white/[0.03] p-6 text-center inner-glow sm:rounded-[2rem] sm:p-8 md:p-10">
              <BorderBeam size={260} duration={12} delay={5} />
              <div className="relative z-10">
                <div className="mx-auto mb-4 h-12 w-12 sm:mb-6 sm:h-16 sm:w-16">
                  <LogoIcon className="h-full w-full" />
                </div>
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">Ready to elevate your community?</h2>
                <p className="mx-auto mt-3 max-w-2xl text-sm text-zinc-400 sm:mt-4 sm:text-base">
                  Start with Discord OAuth, move into the dashboard, and configure a bot stack that you actually control.
                </p>
                <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:mt-8 sm:gap-4 sm:flex-row">
                  <Link href={isAuthenticated ? "/dashboard" : loginUrl} className="w-full sm:w-auto">
                    <Button className="h-12 w-full min-h-[3rem] bg-indigo-600 px-6 text-base text-white hover:bg-indigo-500 sm:w-auto sm:px-8">
                      {isAuthenticated ? "Open Dashboard" : "Login with Discord"}
                    </Button>
                  </Link>
                  <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                    <Button
                      variant="outline"
                      className="h-12 w-full min-h-[3rem] border-zinc-700 bg-transparent px-6 text-base text-zinc-300 hover:bg-white/[0.03] hover:text-white sm:w-auto sm:px-8"
                    >
                      View on GitHub
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer id="contact" className="relative z-10 border-t border-white/[0.06] py-10 sm:py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-[1.5rem] border border-white/[0.06] bg-white/[0.02] p-4 sm:rounded-[1.75rem] sm:p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 shrink-0">
                  <LogoIcon className="h-full w-full" />
                </div>
                <span className="text-xl font-semibold">Clout</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                Premium dashboard experience, open-source bot architecture, and self-hosted control for communities that value quality.
              </p>
              <div className="mt-6 flex gap-3">
                <a
                  href={REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] text-zinc-300 transition-colors hover:bg-white/[0.04] hover:text-white"
                >
                  <Github className="h-4 w-4" />
                </a>
                <a
                  href={`${REPO_URL}#docker-deployment`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] text-zinc-300 transition-colors hover:bg-white/[0.04] hover:text-white"
                >
                  <Boxes className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/[0.06] bg-white/[0.02] p-4 sm:rounded-[1.75rem] sm:p-6">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-zinc-500">Resources</p>
              <div className="mt-5 space-y-3">
                {footerResources.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith("#") ? undefined : "_blank"}
                    rel={item.href.startsWith("#") ? undefined : "noopener noreferrer"}
                    className="block text-sm text-zinc-300 transition-colors hover:text-white"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/[0.06] bg-white/[0.02] p-4 sm:rounded-[1.75rem] sm:p-6">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-zinc-500">Connect</p>
              <div className="mt-5 space-y-4">
                {footerConnect.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel={item.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                    className="flex items-center gap-3 text-sm text-zinc-300 transition-colors hover:text-white"
                  >
                    {item.label === "Email" ? <Mail className="h-4 w-4" /> : null}
                    {item.label === "GitHub Issues" ? <MessageCircle className="h-4 w-4" /> : null}
                    {item.label === "Discord Developer Portal" ? <BookOpen className="h-4 w-4" /> : null}
                    <span>{item.label}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/[0.06] bg-white/[0.02] p-4 sm:rounded-[1.75rem] sm:p-6">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-zinc-500">Get Updates</p>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                This redesign keeps subscriptions frontend-only for now. The interaction is present without adding backend storage.
              </p>
              <div className="mt-5 space-y-3">
                <Input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@community.dev"
                  className="border-white/[0.06] bg-white/[0.03] text-zinc-200"
                />
                <Button onClick={handleSubscribe} className="w-full bg-indigo-600 text-white hover:bg-indigo-500">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
