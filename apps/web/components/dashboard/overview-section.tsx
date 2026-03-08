"use client";

import { memo } from "react";
import {
  Activity,
  AlertTriangle,
  Clock,
  Crown,
  Database,
  Heart,
  Play,
  RefreshCw,
  Server,
  Shield,
  Sparkles,
  Square,
  Users,
  Wallet,
  ExternalLink,
  BookOpen,
  Command,
  Zap,
} from "lucide-react";
import Link from "next/link";

import { BorderBeam } from "@/components/magicui/border-beam";
import { MagicCard } from "@/components/magicui/magic-card";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { BotStatus, User } from "./dashboard-types";

const REPO_URL = "https://github.com/krishs05/clout";

const StatCard = memo(function StatCard({
  description,
  icon: Icon,
  label,
  trend,
  value,
}: {
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  trend: "active" | "good" | "neutral" | "warning";
  value: number | string;
}) {
  const trendColors = {
    good: "text-emerald-400",
    warning: "text-amber-400",
    neutral: "text-zinc-400",
    active: "text-indigo-400",
  };

  return (
    <MagicCard className="glass overflow-hidden rounded-[1.5rem] border-white/[0.06] shadow-xl" gradientColor="rgba(255,255,255,0.05)">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className={`rounded-xl bg-white/[0.03] p-2.5 ${trendColors[trend]}`}>
            <Icon className="h-5 w-5" />
          </div>
          {trend === "active" ? <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> : null}
        </div>
        <div className="mt-5">
          <div className="text-3xl font-semibold text-white">
            {typeof value === "number" ? <NumberTicker value={value} className="text-white dark:text-white" /> : value}
          </div>
          <p className="mt-1 text-sm text-zinc-300">{label}</p>
          <p className="mt-1 text-xs text-zinc-500">{description}</p>
        </div>
      </CardContent>
    </MagicCard>
  );
});

export const OverviewSection = memo(function OverviewSection({
  botStatus,
  controlBot,
  isBotLoading,
  user,
}: {
  botStatus: BotStatus | null;
  controlBot: (action: "restart" | "start" | "stop") => void;
  isBotLoading: boolean;
  user: User | null;
}) {
  const uptimeText = botStatus?.uptime
    ? (Date.now() - botStatus.uptime) / 1000 > 60
      ? `${Math.floor((Date.now() - botStatus.uptime) / 1000 / 3600)}h ${Math.floor(((Date.now() - botStatus.uptime) / 1000 % 3600) / 60)}m`
      : `${Math.floor((Date.now() - botStatus.uptime) / 1000)}s`
    : "--";

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.03] p-8 inner-glow">
        {botStatus?.online ? <BorderBeam size={260} duration={12} delay={6} className="opacity-50" /> : null}
        <div className="absolute -left-12 top-0 h-44 w-44 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-violet-500/12 blur-3xl" />
        <div className="relative z-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">Operations Overview</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">
              {botStatus?.online ? "Clout is live across your stack" : "Bring your bot online and start configuring"}
            </h2>
            <p className="mt-4 max-w-2xl text-zinc-400">
              The dashboard keeps the current auth, API, and websocket behavior intact while making status, control
              surfaces, and server management easier to scan.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                onClick={() => controlBot("start")}
                disabled={Boolean(botStatus?.online) || isBotLoading}
                className="bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/20"
              >
                <Play className="mr-2 h-4 w-4 fill-current" />
                Start Instance
              </Button>
              <Button
                onClick={() => controlBot("stop")}
                disabled={!botStatus?.online || isBotLoading}
                variant="outline"
                className="border-red-500/20 bg-transparent text-red-300 hover:bg-red-500/10 hover:text-red-200"
              >
                <Square className="mr-2 h-4 w-4" />
                Stop Instance
              </Button>
              <Button
                onClick={() => controlBot("restart")}
                disabled={isBotLoading}
                variant="outline"
                className="border-amber-500/20 bg-transparent text-amber-300 hover:bg-amber-500/10 hover:text-amber-200"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isBotLoading ? "animate-spin" : ""}`} />
                Restart
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[1.5rem] border border-white/[0.06] bg-white/[0.02] p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Current status</p>
              <p className={`mt-3 text-lg font-medium ${botStatus?.online ? "text-emerald-300" : "text-zinc-300"}`}>
                {botStatus?.online ? "Connected to Discord gateway" : "Disconnected from Discord gateway"}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/[0.06] bg-white/[0.02] p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Session owner</p>
              <p className="mt-3 text-lg font-medium text-white">{user?.username || "Unknown user"}</p>
              <p className="mt-1 text-sm text-zinc-500">Authenticated with Discord OAuth</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Servers" value={botStatus?.guilds || 0} icon={Server} description="Connected guilds" trend="active" />
        <StatCard label="Users" value={botStatus?.users || 0} icon={Users} description="Tracked members" trend="neutral" />
        <StatCard label="Commands" value={botStatus?.commands || 0} icon={Command} description="Available slash commands" trend="neutral" />
        <StatCard label="Ping" value={`${botStatus?.websocketPing || 0}ms`} icon={Activity} description="Gateway latency" trend={botStatus?.websocketPing && botStatus.websocketPing < 100 ? "good" : "warning"} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass rounded-[1.75rem] border-white/[0.06] inner-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Database className="h-5 w-5 text-indigo-300" />
              Machine status
            </CardTitle>
            <CardDescription className="text-zinc-500">Live bot and process details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-indigo-500/10 p-2">
                  <Clock className="h-4 w-4 text-indigo-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-200">System uptime</p>
                  <p className="text-xs text-zinc-500">Time since last restart</p>
                </div>
              </div>
              <span className="rounded-xl bg-white/[0.05] px-3 py-1 text-sm text-zinc-200">{uptimeText}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-emerald-500/10 p-2">
                  <Database className="h-4 w-4 text-emerald-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-200">Memory usage</p>
                  <p className="text-xs text-zinc-500">RAM consumption</p>
                </div>
              </div>
              <span className="rounded-xl bg-white/[0.05] px-3 py-1 text-sm text-zinc-200">
                {botStatus?.memoryUsage ? `${(botStatus.memoryUsage / 1024 / 1024).toFixed(1)} MB` : "--"}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-amber-500/10 p-2">
                  <Activity className="h-4 w-4 text-amber-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-200">WebSocket ping</p>
                  <p className="text-xs text-zinc-500">Gateway latency</p>
                </div>
              </div>
              <span className="rounded-xl bg-white/[0.05] px-3 py-1 text-sm text-zinc-200">{botStatus?.websocketPing || 0}ms</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass rounded-[1.75rem] border-white/[0.06] inner-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Zap className="h-5 w-5 text-amber-300" />
              Quick actions
            </CardTitle>
            <CardDescription className="text-zinc-500">Useful links tied to the actual repo and setup docs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Open dashboard landing",
                  description: "Return to the public site",
                  href: "/",
                  icon: Sparkles,
                  accent: "text-indigo-300 bg-indigo-500/10",
                },
                {
                  title: "Read quick start",
                  description: "Open README quick start",
                  href: `${REPO_URL}#quick-start`,
                  icon: BookOpen,
                  accent: "text-emerald-300 bg-emerald-500/10",
                },
                {
                  title: "Docker deployment",
                  description: "Review self-hosting steps",
                  href: `${REPO_URL}#docker-deployment`,
                  icon: ExternalLink,
                  accent: "text-violet-300 bg-violet-500/10",
                },
                {
                  title: "GitHub issues",
                  description: "Track implementation work",
                  href: `${REPO_URL}/issues`,
                  icon: Shield,
                  accent: "text-amber-300 bg-amber-500/10",
                },
              ].map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  target={item.href.startsWith("/") ? undefined : "_blank"}
                  rel={item.href.startsWith("/") ? undefined : "noopener noreferrer"}
                  className="rounded-[1.25rem] border border-white/[0.06] bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.05]"
                >
                  <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${item.accent}`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-medium text-zinc-200">{item.title}</h3>
                  <p className="mt-1 text-xs text-zinc-500">{item.description}</p>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass rounded-[1.75rem] border-white/[0.06] inner-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Crown className="h-5 w-5 text-indigo-300" />
            Your reputation
          </CardTitle>
          <CardDescription className="text-zinc-500">Karma and economy data from the authenticated account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex min-h-[140px] flex-col items-center justify-center rounded-[1.25rem] border border-emerald-500/15 bg-emerald-500/5 p-4 text-center">
              <Heart className="mb-3 h-6 w-6 text-emerald-300" />
              <p className="text-3xl font-semibold text-emerald-300">{user?.goodDeeds || 0}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.24em] text-zinc-500">Good deeds</p>
            </div>
            <div className="flex min-h-[140px] flex-col items-center justify-center rounded-[1.25rem] border border-red-500/15 bg-red-500/5 p-4 text-center">
              <AlertTriangle className="mb-3 h-6 w-6 text-red-300" />
              <p className="text-3xl font-semibold text-red-300">{user?.badDeeds || 0}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.24em] text-zinc-500">Bad deeds</p>
            </div>
            <div className="flex min-h-[140px] flex-col items-center justify-center rounded-[1.25rem] border border-amber-500/15 bg-amber-500/5 p-4 text-center">
              <Wallet className="mb-3 h-6 w-6 text-amber-300" />
              <p className="text-3xl font-semibold text-amber-300">{user?.balance || 0}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.24em] text-zinc-500">Coins</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});
