"use client";

import { type JSX } from "react";
import { motion } from "framer-motion";
import { Crown, MousePointer2, Music2, Shield, Wallet } from "lucide-react";

import { cn } from "@/lib/utils";

interface ShowcaseCubeProps {
  activeIndex: number;
  activeView: "overview" | "activity" | "actions";
  onViewChange: (view: "overview" | "activity" | "actions") => void;
}

const SHOWCASE_STATES = [
  {
    icon: Crown,
    badge: "Karma signal",
    accent: "bg-indigo-400",
    accentSoft: "bg-indigo-500/12",
    accentBorder: "border-indigo-400/30",
    accentText: "text-indigo-200",
    shell: "from-[#151b46] via-[#101735] to-[#0a0f22]",
    glow: "from-indigo-500/28 via-violet-500/10 to-transparent",
    header: [56, 34, 42],
    widgets: [52, 84, 60],
  },
  {
    icon: Wallet,
    badge: "Economy flow",
    accent: "bg-amber-400",
    accentSoft: "bg-amber-500/12",
    accentBorder: "border-amber-400/30",
    accentText: "text-amber-200",
    shell: "from-[#37240b] via-[#221708] to-[#120d06]",
    glow: "from-amber-500/26 via-orange-500/10 to-transparent",
    header: [62, 28, 46],
    widgets: [70, 52, 88],
  },
  {
    icon: Shield,
    badge: "Protection state",
    accent: "bg-emerald-400",
    accentSoft: "bg-emerald-500/12",
    accentBorder: "border-emerald-400/30",
    accentText: "text-emerald-200",
    shell: "from-[#0a2b23] via-[#0b1d18] to-[#08120f]",
    glow: "from-emerald-500/24 via-teal-500/10 to-transparent",
    header: [46, 36, 64],
    widgets: [86, 58, 72],
  },
  {
    icon: Music2,
    badge: "Voice control",
    accent: "bg-violet-400",
    accentSoft: "bg-violet-500/12",
    accentBorder: "border-violet-400/30",
    accentText: "text-violet-200",
    shell: "from-[#24133d] via-[#160f28] to-[#0e0a18]",
    glow: "from-violet-500/26 via-fuchsia-500/10 to-transparent",
    header: [52, 42, 30],
    widgets: [54, 92, 46],
  },
] as const;

const SHOWCASE_VIEW_META = {
  overview: {
    accentClass: "bg-rose-400/90",
    label: "Overview",
    multiplier: 1,
  },
  activity: {
    accentClass: "bg-amber-400/90",
    label: "Activity",
    multiplier: 1.15,
  },
  actions: {
    accentClass: "bg-emerald-400/90",
    label: "Actions",
    multiplier: 0.88,
  },
} as const;

const SHOWCASE_VIEWS = ["overview", "activity", "actions"] as const;

export function ShowcaseCube({ activeIndex, activeView, onViewChange }: ShowcaseCubeProps): JSX.Element {
  const state = SHOWCASE_STATES[activeIndex] ?? SHOWCASE_STATES[0];
  const Icon = state.icon;
  const viewMeta = SHOWCASE_VIEW_META[activeView];
  const widgetHeights = state.widgets.map((value) => Math.round(value * viewMeta.multiplier));
  const progressWidth = activeView === "overview" ? 62 + activeIndex * 8 : activeView === "activity" ? 78 : 46 + activeIndex * 6;

  return (
    <div className="relative h-[232px] w-full min-w-0 overflow-hidden rounded-[1.45rem] border border-white/[0.08] bg-white/[0.02] shadow-2xl shadow-black/40 sm:h-[320px] sm:rounded-[1.85rem] md:h-[360px] lg:h-[390px] lg:rounded-[2rem]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(129,140,248,0.18),transparent_44%),radial-gradient(circle_at_bottom,rgba(139,92,246,0.08),transparent_32%)]" />
      <div className="absolute inset-x-6 bottom-4 h-14 rounded-full bg-black/40 blur-2xl sm:inset-x-10 sm:h-16" />

      <motion.div
        key={activeIndex}
        initial={{ opacity: 0.84, scale: 0.985, rotateX: 8, rotateY: -10, y: 12 }}
        animate={{ opacity: 1, scale: 1, rotateX: 6, rotateY: -8, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 flex items-center justify-center p-2 sm:p-5 md:p-8"
        style={{ perspective: 1400 }}
      >
        <motion.div
          animate={{ rotateX: 6, rotateY: -8 + activeIndex * 1.5 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "relative h-full w-full max-w-[16rem] origin-center scale-[0.66] rounded-[2rem] border border-white/[0.1] bg-gradient-to-br shadow-[0_28px_70px_rgba(0,0,0,0.42)] sm:max-w-[23rem] sm:scale-[0.86] md:max-w-[28rem] md:scale-[0.94] lg:max-w-[30rem] lg:scale-100",
            state.shell,
          )}
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className={cn("absolute inset-0 rounded-[2rem] bg-gradient-to-br", state.glow)} />
          <div className="absolute inset-[1px] rounded-[calc(2rem-1px)] border border-white/[0.08]" />

          <div className="absolute bottom-3 left-3 top-3 w-[4.4rem] rounded-[1.25rem] border border-white/[0.08] bg-[#09101b]/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:bottom-5 sm:left-5 sm:top-5 sm:w-24 sm:rounded-[1.6rem]" />
          <div className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] sm:left-7 sm:top-7 sm:h-10 sm:w-10 sm:rounded-2xl">
            <Icon className={cn("h-4 w-4 sm:h-5 sm:w-5", state.accentText)} />
          </div>

          <motion.div
            className={cn("absolute bottom-5 left-4 h-11 w-11 rounded-[0.95rem] border shadow-[0_0_28px_rgba(99,102,241,0.25)] sm:bottom-8 sm:left-7 sm:h-16 sm:w-16 sm:rounded-[1.2rem]", state.accentBorder, state.accentSoft)}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <Crown className={cn("h-5 w-5 sm:h-7 sm:w-7", state.accentText)} />
            </div>
            <motion.div
              className={cn("absolute -right-2 -top-2 hidden h-5 w-5 rounded-lg shadow-lg sm:-right-4 sm:-top-4 sm:block sm:h-7 sm:w-7 sm:rounded-xl", state.accent)}
              animate={{ y: [0, 10, 0], x: [0, -4, 0] }}
              transition={{ duration: 3.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            />
          </motion.div>

          <div className="absolute left-[5.8rem] right-4 top-4 flex items-center justify-between sm:left-[8.5rem] sm:right-6 sm:top-7">
            <div className="space-y-1.5 sm:space-y-2">
              {state.header.map((width, index) => (
                <motion.div
                  key={`${activeIndex}-${index}`}
                  className={cn("h-1 rounded-full sm:h-1.5", index === 1 ? state.accent : "bg-white/65")}
                  initial={{ width: 0, opacity: 0.45 }}
                  animate={{ width, opacity: 1 }}
                  transition={{ duration: 0.45, delay: 0.08 * index }}
                />
              ))}
            </div>
            <div className="flex gap-2">
              {SHOWCASE_VIEWS.map((view) => {
                const selected = activeView === view;

                return (
                  <button
                    key={view}
                    type="button"
                    aria-label={`Open ${SHOWCASE_VIEW_META[view].label.toLowerCase()} view`}
                    aria-pressed={selected}
                    onClick={() => onViewChange(view)}
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

          <div className="absolute left-[5.8rem] right-4 top-[4.45rem] min-w-0 rounded-[1rem] border border-white/[0.08] bg-[#070b12]/92 p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:left-[8.5rem] sm:right-6 sm:top-[5.9rem] sm:rounded-[1.45rem] sm:p-4">
            <div className="flex min-w-0 items-start justify-between gap-3 text-[11px] uppercase tracking-[0.22em] text-zinc-400">
              <span className="min-w-0 truncate">clout.dashboard</span>
              <span className={cn("min-w-0 truncate text-right", state.accentText)}>
                {state.badge} · {viewMeta.label}
              </span>
            </div>

            <div className="mt-3 flex items-center gap-2 rounded-[0.95rem] border border-white/[0.06] bg-white/[0.03] px-2.5 py-2 sm:mt-5 sm:gap-3 sm:rounded-2xl sm:px-3 sm:py-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03] sm:h-9 sm:w-9 sm:rounded-xl">
                <span className={cn("h-2 w-2 rounded-full shadow-[0_0_18px_currentColor]", state.accentText)} />
              </div>
              <div className="flex-1">
                <div className="h-1.5 rounded-full bg-white/[0.08] sm:h-2" />
                <motion.div
                  key={`progress-${activeIndex}`}
                  className={cn("mt-1.5 h-1.5 rounded-full sm:mt-2 sm:h-2", state.accent)}
                  initial={{ width: "28%" }}
                  animate={{ width: `${progressWidth}%` }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 sm:mt-5 sm:gap-3">
              {widgetHeights.map((value, index) => (
                <div key={`${activeIndex}-${index}`} className="rounded-[0.95rem] border border-white/[0.06] bg-white/[0.03] p-2 sm:rounded-2xl sm:p-3">
                  <div className="flex h-11 items-end justify-center sm:h-16">
                    <motion.div
                      className={cn("w-3 rounded-full sm:w-4", state.accent)}
                      initial={{ height: 18 }}
                      animate={{ height: value }}
                      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <motion.div
            className="absolute top-[6.1rem] hidden h-[9.8rem] w-4 rounded-full bg-white/18 blur-[10px] sm:block"
            animate={{ x: [152, 270, 152] }}
            transition={{ duration: 3.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />

          <motion.div
            className="absolute left-[10.4rem] top-[6.9rem] hidden h-8 w-8 sm:left-[12.2rem] sm:top-[8.95rem] sm:block sm:h-10 sm:w-10"
            animate={{ x: [0, 76, 152, 76, 0] }}
            transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: [0.42, 0, 0.58, 1] }}
          >
            <div className={cn("absolute inset-0 rounded-full border", state.accentBorder)} />
            <div className={cn("absolute inset-[0.72rem] rounded-full", state.accent)} />
            <div className="absolute -left-2 -top-2 rounded-xl border border-white/[0.08] bg-[#05070c]/85 p-1.5 shadow-[0_14px_34px_rgba(0,0,0,0.32)]">
              <MousePointer2 className={cn("h-3.5 w-3.5", state.accentText)} />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
