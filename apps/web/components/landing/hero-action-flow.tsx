"use client";

import { type JSX, type ReactNode, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bot,
  Boxes,
  Check,
  Crown,
  MessageCircle,
  MousePointer2,
  PanelsTopLeft,
  Sparkles,
  Terminal,
} from "lucide-react";

import { LogoIcon } from "@/components/logo-3d";
import { cn } from "@/lib/utils";

interface HeroActionFlowProps {
  isAuthenticated: boolean;
}

interface FlowStep {
  eyebrow: string;
  title: string;
  detail: string;
  rail: string;
  status: string;
}

const FLOW_STEPS: FlowStep[] = [
  {
    eyebrow: "AUTH FLOW",
    title: "Click into Discord OAuth",
    detail: "Start on the landing page, hit the Discord button, and hand control to the local callback flow.",
    rail: "Discord OAuth handoff",
    status: "OAuth request ready",
  },
  {
    eyebrow: "LOCAL DEPLOY",
    title: "Bring the stack online with Docker",
    detail: "Web, API, bot, and PostgreSQL come up together so the whole Clout system is running on the same machine.",
    rail: "Compose boots the stack",
    status: "Containers booting",
  },
  {
    eyebrow: "DASHBOARD",
    title: "Open the dashboard control plane",
    detail: "Land in a live overview with reputation, services, and command surfaces already connected.",
    rail: "Control plane goes live",
    status: "Dashboard live",
  },
];

const SERVICES = [
  { icon: PanelsTopLeft, label: "web", tint: "from-indigo-300 to-indigo-100" },
  { icon: Activity, label: "api", tint: "from-cyan-300 to-cyan-100" },
  { icon: Bot, label: "bot", tint: "from-violet-300 to-violet-100" },
  { icon: Boxes, label: "db", tint: "from-emerald-300 to-emerald-100" },
] as const;

const DASHBOARD_METRICS = [
  { label: "Karma", value: "+128" },
  { label: "Servers", value: "12" },
  { label: "Latency", value: "42ms" },
] as const;

const DASHBOARD_BARS = [0.42, 0.76, 0.58] as const;
const STEP_DURATION_MS = 2600;
const SCENE_DURATION_SECONDS = 7.8;

function FrameGlow(): JSX.Element {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 opacity-55"
        style={{
          backgroundImage: "radial-gradient(rgba(129,140,248,0.16) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      />
      <div className="pointer-events-none absolute inset-x-[14%] top-0 h-36 rounded-full bg-indigo-500/18 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 right-0 h-44 w-44 rounded-full bg-violet-500/18 blur-3xl" />
    </>
  );
}

function SceneShell({ children }: { children: ReactNode }): JSX.Element {
  return (
    <div className="relative h-[20rem] max-h-[55vh] overflow-hidden rounded-[1.5rem] border border-white/[0.06] bg-[linear-gradient(180deg,rgba(8,10,18,0.98),rgba(11,13,22,0.92))] sm:h-[26rem] sm:max-h-[65vh] sm:rounded-[1.85rem] md:h-[28rem] md:max-h-[70vh] lg:h-[34rem] lg:max-h-[72vh] xl:h-[32rem] xl:max-h-[68vh]">
      <div
        className="pointer-events-none absolute inset-0 opacity-45"
        style={{
          backgroundImage: "radial-gradient(rgba(99,102,241,0.18) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(99,102,241,0.22),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(139,92,246,0.14),transparent_26%),radial-gradient(circle_at_60%_78%,rgba(79,70,229,0.16),transparent_24%)]" />
      {children}
      <div className="pointer-events-none absolute inset-x-[16%] bottom-[6%] h-5 rounded-full bg-indigo-950/70 blur-2xl" />
    </div>
  );
}

function SceneTransition({ children, sceneKey, reduceMotion }: { children: ReactNode; sceneKey: string; reduceMotion: boolean | null }): JSX.Element {
  return (
    <motion.div
      key={sceneKey}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.985, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0"
    >
      {children}
    </motion.div>
  );
}

function AuthScene({ reduceMotion }: { reduceMotion: boolean | null }): JSX.Element {
  return (
    <SceneShell>
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -10, 0], x: [0, 5, 0] }}
        transition={{ duration: 5.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className="pointer-events-none absolute left-[14%] top-[12%] h-4 w-4 rounded-full bg-indigo-100/85 shadow-[0_0_18px_rgba(191,219,254,0.9)]"
      />
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, 12, 0] }}
        transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.5 }}
        className="pointer-events-none absolute right-[16%] top-[18%] h-3.5 w-3.5 rounded-full bg-violet-100/80 shadow-[0_0_16px_rgba(221,214,254,0.85)]"
      />

      <div className="absolute inset-x-[4%] top-[4%] bottom-[4%] scale-[0.88] origin-top rounded-[1.45rem] border border-indigo-400/16 bg-[linear-gradient(180deg,rgba(18,22,46,0.96),rgba(8,11,24,0.94))] p-2.5 shadow-[0_24px_60px_rgba(8,10,20,0.46)] sm:scale-[0.94] sm:rounded-[1.8rem] sm:p-4 md:scale-[0.92]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl border border-white/[0.08] bg-white/[0.04] p-1.5">
              <LogoIcon className="h-full w-full" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-zinc-400">landing.page</p>
              <p className="mt-0.5 text-xs font-medium text-zinc-100">Discord sign-in</p>
            </div>
          </div>
          <div className="flex gap-1">
            <span className="h-2 w-2 rounded-full bg-red-400/85" />
            <span className="h-2 w-2 rounded-full bg-amber-300/85" />
            <span className="h-2 w-2 rounded-full bg-emerald-300/85" />
          </div>
        </div>

        <div className="mt-2.5 grid grid-cols-[minmax(0,1.12fr)_minmax(7.75rem,0.88fr)] items-start gap-2 sm:mt-3 sm:gap-3">
          <div className="rounded-[1.05rem] border border-white/[0.06] bg-black/25 p-2.5 sm:rounded-[1.2rem] sm:p-3">
            <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-400">oauth gateway</p>
            <div className="mt-2 space-y-1.5 sm:space-y-2">
              <div className="h-1.5 rounded-full bg-white/[0.06]" />
              <div className="h-1.5 w-4/5 rounded-full bg-white/[0.06]" />
              <div className="h-1.5 w-3/5 rounded-full bg-white/[0.06]" />
            </div>

            <motion.div
              animate={
                reduceMotion
                  ? undefined
                  : {
                      scale: [1, 1, 1.02, 0.99, 1],
                      boxShadow: [
                        "0 0 0 rgba(99,102,241,0)",
                        "0 0 0 rgba(99,102,241,0)",
                        "0 0 30px rgba(99,102,241,0.42)",
                        "0 0 12px rgba(99,102,241,0.18)",
                        "0 0 0 rgba(99,102,241,0)",
                      ],
                    }
              }
              transition={{
                duration: SCENE_DURATION_SECONDS,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                times: [0, 0.08, 0.16, 0.22, 1],
              }}
              className="mt-2.5 flex items-center justify-between rounded-[0.95rem] border border-indigo-400/24 bg-indigo-500/14 px-2.5 py-2 sm:mt-3 sm:rounded-[1rem] sm:px-3 sm:py-2.5"
            >
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-indigo-50 sm:text-xs">
                <MessageCircle className="h-3 w-3 text-indigo-200 sm:h-3.5 sm:w-3.5" />
                Login with Discord
              </div>
              <ArrowRight className="h-3 w-3 text-indigo-200 sm:h-3.5 sm:w-3.5" />
            </motion.div>

            <div className="mt-2 flex items-start gap-1.5 rounded-[0.95rem] border border-emerald-400/14 bg-emerald-500/8 px-2.5 py-1.5 text-[9px] uppercase leading-snug tracking-[0.14em] text-emerald-200 sm:rounded-full sm:text-[10px] sm:tracking-[0.2em]">
              <Check className="mt-0.5 h-3 w-3 shrink-0 sm:mt-0" />
              redirect localhost:3001/auth/callback
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="rounded-[1rem] border border-white/[0.06] bg-white/[0.03] p-2.5 sm:rounded-[1.1rem] sm:p-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">session</p>
              <p className="mt-1.5 text-xl font-semibold text-white sm:mt-2 sm:text-2xl">OAuth</p>
              <p className="mt-1 text-[11px] leading-relaxed text-zinc-300/85 sm:mt-1.5 sm:text-xs">Authorize with Discord and redirect back into Clout.</p>
            </div>
            <div className="rounded-[1rem] border border-white/[0.06] bg-white/[0.03] p-2.5 sm:rounded-[1.1rem] sm:p-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">scope</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {["identify", "guilds", "email"].map((scope) => (
                  <span
                    key={scope}
                    className="rounded-full border border-indigo-400/14 bg-indigo-500/10 px-2 py-0.5 text-[9px] uppercase tracking-[0.12em] text-indigo-100 sm:text-[10px] sm:tracking-[0.16em]"
                  >
                    {scope}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <motion.div
          animate={
            reduceMotion
              ? undefined
              : {
                  x: [12, 90, 90, 12],
                  y: [10, 84, 84, 10],
                  scale: [1, 1, 0.92, 1],
                }
          }
          transition={{
            duration: SCENE_DURATION_SECONDS,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            times: [0, 0.1, 0.18, 0.28],
          }}
          className="pointer-events-none absolute left-5 top-7 hidden text-white drop-shadow-[0_0_12px_rgba(0,0,0,0.6)] sm:block"
          style={{ willChange: "transform" }}
        >
          <MousePointer2 className="h-5 w-5" />
        </motion.div>
      </div>
    </SceneShell>
  );
}

function DeployScene({ reduceMotion }: { reduceMotion: boolean | null }): JSX.Element {
  return (
    <SceneShell>
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
        transition={{ duration: 5.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className="pointer-events-none absolute left-[18%] top-[14%] h-4 w-4 rounded-full bg-violet-100/82 shadow-[0_0_18px_rgba(221,214,254,0.85)]"
      />
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, 10, 0] }}
        transition={{ duration: 4.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.6 }}
        className="pointer-events-none absolute right-[13%] top-[20%] h-3.5 w-3.5 rounded-full bg-indigo-100/78 shadow-[0_0_16px_rgba(191,219,254,0.82)]"
      />

      <div className="absolute inset-x-[5%] top-[5%] bottom-[5%] min-h-0 scale-[0.92] origin-top grid gap-4 sm:scale-[0.88] sm:grid-cols-[1.22fr_0.78fr] md:scale-[0.85]">
        <div className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-[1.8rem] border border-violet-400/16 bg-[linear-gradient(180deg,rgba(18,13,34,0.96),rgba(8,8,18,0.94))] p-4 shadow-[0_24px_60px_rgba(8,10,20,0.46)] sm:p-5">
          <div className="flex shrink-0 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04]">
                <Terminal className="h-5 w-5 text-violet-200" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-zinc-400">docker compose</p>
                <p className="mt-1 text-sm font-medium text-zinc-100">Local deployment</p>
              </div>
            </div>
            <div className="rounded-full border border-violet-400/14 bg-violet-500/10 px-3 py-1.5 text-[11px] tracking-[0.08em] text-violet-100">
              up -d
            </div>
          </div>

          <div className="mt-3 min-w-0 shrink-0 overflow-hidden rounded-[1.35rem] border border-white/[0.06] bg-black/25 p-3">
            <div className="flex min-w-0 items-center gap-2 text-xs text-zinc-300">
              <span className="text-violet-300">$</span>
              <span>docker compose up -d</span>
            </div>
            <div className="mt-3 h-px bg-white/[0.06]" />

            <div className="mt-3 min-h-0 max-h-[14rem] space-y-2 overflow-hidden">
              {SERVICES.map((service, index) => (
                <motion.div
                  key={service.label}
                  animate={
                    reduceMotion
                      ? undefined
                      : {
                          opacity: [0.34, 0.34, 1, 1],
                          x: [-8, -8, 0, 0],
                          scale: [0.98, 0.98, 1, 1],
                        }
                  }
                  transition={{
                    duration: SCENE_DURATION_SECONDS,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    times: [0, 0.12 + index * 0.08, 0.22 + index * 0.08, 1],
                  }}
                  className="flex items-center justify-between rounded-[1rem] border border-white/[0.05] bg-white/[0.03] px-3 py-2"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br", service.tint)}>
                      <service.icon className="h-3.5 w-3.5 text-slate-950" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-400">{service.label}</p>
                      <p className="mt-0.5 text-xs font-medium text-zinc-100">Service healthy</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-400/14 bg-emerald-500/8 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-emerald-200">
                    <Check className="h-3 w-3" />
                    ready
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex min-h-0 min-w-0 flex-col gap-3">
          <div className="min-w-0 rounded-[1.35rem] border border-white/[0.06] bg-white/[0.03] p-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">stack</p>
            <p className="mt-2 text-2xl font-semibold text-white">4 services</p>
            <p className="mt-1.5 text-xs leading-relaxed text-zinc-300/85">Everything needed for Clout comes up together instead of being split across unrelated tools.</p>
          </div>
          <div className="min-w-0 rounded-[1.35rem] border border-white/[0.06] bg-white/[0.03] p-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">boot order</p>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {SERVICES.map((service, index) => (
                <div key={service.label} className="flex items-center gap-1.5">
                  <motion.div
                    animate={reduceMotion ? undefined : { opacity: [0.32, 0.32, 1, 1] }}
                    transition={{
                      duration: SCENE_DURATION_SECONDS,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                      times: [0, 0.16 + index * 0.08, 0.24 + index * 0.08, 1],
                    }}
                    className="rounded-full border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-zinc-300"
                  >
                    {service.label}
                  </motion.div>
                  {index < SERVICES.length - 1 ? <ArrowRight className="h-3 w-3 shrink-0 text-zinc-600" /> : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SceneShell>
  );
}

function DashboardScene({ isAuthenticated, reduceMotion }: { isAuthenticated: boolean; reduceMotion: boolean | null }): JSX.Element {
  return (
    <SceneShell>
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -8, 0], x: [0, 3, 0] }}
        transition={{ duration: 5.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className="pointer-events-none absolute left-[18%] top-[12%] h-4 w-4 rounded-full bg-indigo-100/85 shadow-[0_0_18px_rgba(191,219,254,0.88)]"
      />
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, 10, 0] }}
        transition={{ duration: 4.7, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.5 }}
        className="pointer-events-none absolute right-[12%] top-[18%] h-3.5 w-3.5 rounded-full bg-violet-100/80 shadow-[0_0_16px_rgba(221,214,254,0.84)]"
      />

      <motion.div
        animate={reduceMotion ? undefined : { opacity: [0.9, 1, 0.9], y: [0, -4, 0] }}
        transition={{ duration: 4.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        style={{ scale: 0.88 }}
        className="absolute inset-x-[5%] top-[5%] bottom-[5%] min-h-0 min-w-0 origin-top rounded-[1.85rem] border border-indigo-300/18 bg-[linear-gradient(180deg,rgba(13,16,33,0.98),rgba(7,9,18,0.95))] p-3 shadow-[0_28px_70px_rgba(7,9,20,0.48)] sm:p-4"
      >
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
          <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
            <div className="h-8 w-8 shrink-0 rounded-xl border border-white/[0.08] bg-white/[0.04] p-1.5 sm:h-10 sm:w-10 sm:rounded-2xl sm:p-2">
              <LogoIcon className="h-full w-full" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[10px] uppercase tracking-[0.24em] text-zinc-400 sm:tracking-[0.28em]">clout.dashboard</p>
              <p className="mt-0.5 truncate text-xs font-medium text-zinc-100 sm:mt-1 sm:text-sm">Local overview</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-400/14 bg-emerald-500/8 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-emerald-200 sm:gap-2 sm:px-3 sm:py-1.5 sm:text-[11px] sm:tracking-[0.2em]">
            <Sparkles className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
            <span className="truncate">{isAuthenticated ? "session detected" : "dashboard live"}</span>
          </div>
        </div>

        <div className="mt-3 grid h-[calc(100%-3rem)] min-h-0 gap-2.5 sm:grid-cols-[5.5rem_minmax(0,1fr)]">
          <div className="min-h-0 min-w-0 overflow-hidden rounded-[1.35rem] border border-white/[0.06] bg-[#08101d]/90 p-2.5">
            <div className="flex h-full min-w-0 flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03]">
                  <Crown className="h-4 w-4 text-indigo-200" />
                </div>
                {["overview", "servers", "cmd", "karma"].map((item, index) => (
                  <div
                    key={item}
                    className={cn(
                      "rounded-full border px-3 py-2.5 text-center text-[11px] uppercase tracking-[0.12em] whitespace-nowrap",
                      index === 0
                        ? "border-indigo-400/18 bg-indigo-500/12 text-indigo-100"
                        : "border-white/[0.05] bg-white/[0.03] text-zinc-400",
                    )}
                  >
                    {item}
                  </div>
                ))}
              </div>
              <div className="rounded-full border border-emerald-400/14 bg-emerald-500/8 px-3 py-2.5 text-center text-[11px] uppercase tracking-[0.12em] text-emerald-200 whitespace-nowrap">
                live
              </div>
            </div>
          </div>

          <div className="grid min-h-0 min-w-0 grid-rows-[auto_minmax(0,1fr)] gap-2.5 overflow-hidden">
            <div className="grid min-w-0 gap-2.5 sm:grid-cols-3">
              {DASHBOARD_METRICS.map((metric) => (
                <div key={metric.label} className="min-w-0 rounded-[1.1rem] border border-white/[0.06] bg-white/[0.03] p-3">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">{metric.label}</p>
                  <p className="mt-1 text-xl font-semibold text-white">{metric.value}</p>
                </div>
              ))}
            </div>

            <div className="grid min-h-0 min-w-0 gap-2.5 md:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
              <div className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-[1.2rem] border border-white/[0.06] bg-white/[0.03] p-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">community health</p>
                    <p className="mt-1 text-sm font-medium text-zinc-100">Karma signal overview</p>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10">
                    <BarChart3 className="h-4 w-4 text-indigo-200" />
                  </div>
                </div>

                <div className="mt-3 h-2 rounded-full bg-white/[0.05] p-[2px]">
                  <motion.div
                    animate={reduceMotion ? undefined : { width: ["24%", "72%", "82%", "74%"] }}
                    transition={{ duration: SCENE_DURATION_SECONDS, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-indigo-300 via-violet-300 to-indigo-100"
                  />
                </div>

                <div className="mt-2 grid min-h-0 flex-1 grid-cols-3 gap-2">
                  {DASHBOARD_BARS.map((bar, index) => (
                    <div key={index} className="min-h-0 rounded-[1rem] border border-white/[0.06] bg-black/20 p-2">
                      <div className="flex h-full items-end">
                        <motion.div
                          animate={reduceMotion ? undefined : { scaleY: [0.36, 0.92, 0.74, 1] }}
                          transition={{
                            duration: SCENE_DURATION_SECONDS,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                            delay: index * 0.2,
                          }}
                          className="w-full rounded-md bg-gradient-to-t from-indigo-500 via-violet-400 to-indigo-200"
                          style={{ height: `${bar * 100}%`, transformOrigin: "bottom", willChange: "transform" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid min-h-0 min-w-0 gap-2.5">
                <div className="min-h-0 min-w-0 overflow-hidden rounded-[1.2rem] border border-white/[0.06] bg-white/[0.03] p-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">connected surfaces</p>
                      <p className="mt-1 text-sm font-medium text-zinc-100">Commands and sync</p>
                    </div>
                    <div className="rounded-full border border-emerald-400/14 bg-emerald-500/8 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-emerald-200">
                      stable
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {["/good", "/daily", "ws sync"].map((label) => (
                      <div
                        key={label}
                        className="rounded-full border border-indigo-400/14 bg-indigo-500/8 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-indigo-100"
                      >
                        {label}
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {[
                      { label: "events", value: "24" },
                      { label: "rooms", value: "8" },
                    ].map((item) => (
                      <div key={item.label} className="rounded-[0.95rem] border border-white/[0.06] bg-black/20 p-2.5">
                        <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-400">{item.label}</p>
                        <p className="mt-1 text-sm font-semibold text-white">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="min-h-0 min-w-0 overflow-hidden rounded-[1.2rem] border border-white/[0.06] bg-white/[0.03] p-2.5">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">status</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-300">
                    Reputation, services, and commands stay visible in one local control plane.
                  </p>
                  <div className="mt-2 rounded-full border border-white/[0.06] bg-black/20 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-zinc-300">
                    Healthy local session
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </SceneShell>
  );
}

export function HeroActionFlow({ isAuthenticated }: HeroActionFlowProps): JSX.Element {
  const reduceMotion = useReducedMotion();
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (reduceMotion || isAuthenticated) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveStep((current) => (current + 1) % FLOW_STEPS.length);
    }, STEP_DURATION_MS);

    return () => window.clearInterval(intervalId);
  }, [isAuthenticated, reduceMotion]);

  const presentedStep = reduceMotion || isAuthenticated ? 2 : activeStep;
  const currentStep = FLOW_STEPS[presentedStep] ?? FLOW_STEPS[0];

  return (
    <div className="relative w-full max-w-full min-w-0 overflow-hidden rounded-[1.7rem] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(20,24,54,0.98),rgba(8,10,18,0.98))] p-2.5 shadow-[0_32px_90px_rgba(0,0,0,0.45)] sm:rounded-[2rem] sm:p-4 md:p-5 xl:rounded-[2.4rem]">
      <FrameGlow />

      <div className="relative min-w-0 overflow-hidden rounded-[2rem] border border-white/[0.07] bg-[linear-gradient(180deg,rgba(16,18,34,0.92),rgba(6,8,14,0.94))] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] sm:p-4 md:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 max-w-md">
            <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-400 sm:text-[11px] sm:tracking-[0.28em]">Clout In Action</p>
            <motion.div
              key={presentedStep}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22 }}
              className="mt-2 sm:mt-3"
            >
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-indigo-200 sm:text-sm sm:tracking-[0.26em]">{currentStep.eyebrow}</p>
              <h3 className="mt-1.5 text-xl font-semibold text-white sm:mt-2 sm:text-2xl sm:leading-tight md:text-[2rem]">{currentStep.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-300/85 sm:mt-3 sm:text-sm md:text-[15px]">{currentStep.detail}</p>
            </motion.div>
          </div>

          <div className="shrink-0 self-start rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-2 text-left sm:px-4 sm:text-right">
            <p className="text-[10px] uppercase tracking-[0.3em] text-indigo-200">Flow</p>
            <p className="mt-1 text-sm font-medium text-white">
              {String(presentedStep + 1).padStart(2, "0")} / {String(FLOW_STEPS.length).padStart(2, "0")}
            </p>
          </div>
        </div>

        <div className="relative mt-4 max-h-[55vh] sm:mt-6 sm:max-h-[65vh] md:max-h-[70vh] lg:max-h-[72vh] xl:max-h-[68vh]">
          <SceneTransition sceneKey={`scene-${presentedStep}`} reduceMotion={reduceMotion}>
            {presentedStep === 0 ? <AuthScene reduceMotion={reduceMotion} /> : null}
            {presentedStep === 1 ? <DeployScene reduceMotion={reduceMotion} /> : null}
            {presentedStep === 2 ? <DashboardScene isAuthenticated={isAuthenticated} reduceMotion={reduceMotion} /> : null}
          </SceneTransition>
          <div className="h-[20rem] max-h-[55vh] sm:h-[26rem] sm:max-h-[65vh] md:h-[28rem] md:max-h-[70vh] lg:h-[34rem] lg:max-h-[72vh] xl:h-[32rem] xl:max-h-[68vh]" />
        </div>

        <div className="mt-4 sm:mt-5">
          <div className="h-px bg-white/[0.06]" />
          <div className="relative mt-3 overflow-hidden sm:mt-4">
            <div className="absolute left-0 right-0 top-0 h-px bg-white/[0.06]" />
            <motion.div
              animate={{ width: `${((presentedStep + 1) / FLOW_STEPS.length) * 100}%` }}
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-0 top-0 h-px bg-gradient-to-r from-indigo-300 via-violet-300 to-indigo-100"
            />
            <div className="grid grid-cols-1 gap-2.5 pt-4 sm:grid-cols-2 sm:gap-3 sm:pt-6 md:grid-cols-3">
              {FLOW_STEPS.map((step, index) => {
                const active = presentedStep === index;

                return (
                  <div key={step.title} className="relative min-h-0 min-w-0 rounded-[1.2rem] border border-white/[0.06] bg-white/[0.03] p-3 sm:p-4">
                    <div
                      className={cn(
                        "mb-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[10px] font-medium sm:mb-4 sm:h-8 sm:w-8 sm:text-[11px]",
                        active
                          ? "border-indigo-300/30 bg-indigo-500/14 text-indigo-50"
                          : "border-white/[0.08] bg-black/20 text-zinc-400",
                      )}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <p className={cn("text-[10px] uppercase tracking-[0.22em] sm:text-[11px] sm:tracking-[0.26em]", active ? "text-indigo-200" : "text-zinc-400")}>
                      {step.eyebrow}
                    </p>
                    <p className="mt-1.5 text-xs font-medium leading-snug text-zinc-100 sm:mt-2 sm:text-sm">{step.rail}</p>
                    <p className="mt-1.5 text-[12px] leading-relaxed text-zinc-300/85 sm:mt-2 sm:text-[13px]">
                      {active ? step.status : "Ready in sequence"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
