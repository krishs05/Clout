"use client";

import type { ReactNode } from "react";
import {
  LogOut,
  Menu,
} from "lucide-react";
import Link from "next/link";

import { LogoIcon } from "@/components/logo-3d";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { DASHBOARD_ITEMS, type BotStatus, type DashboardTabId, type User } from "./dashboard-types";

const TAB_LABELS: Record<DashboardTabId, string> = {
  overview: "Operations overview",
  servers: "Server configuration",
  embeds: "Embed editor",
  commands: "Slash commands",
  analytics: "Analytics",
  admin: "Admin & moderation",
};

interface DashboardShellProps {
  activeTab: DashboardTabId;
  botStatus: BotStatus | null;
  children: ReactNode;
  mobileMenuOpen: boolean;
  onMobileMenuChange: (open: boolean) => void;
  onSignOut: () => void;
  onTabChange: (tab: DashboardTabId) => void;
  user: User | null;
}

function SidebarContent({
  activeTab,
  botStatus,
  onSignOut,
  onTabChange,
  user,
}: Omit<DashboardShellProps, "children" | "mobileMenuOpen" | "onMobileMenuChange">) {
  return (
    <>
      <div className="p-5">
        <div className="rounded-[1.75rem] border border-white/[0.08] bg-white/[0.03] p-5 inner-glow">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-10 w-10">
              <LogoIcon className="h-full w-full" />
            </div>
            <div>
              <p className="text-lg font-semibold text-white">Clout</p>
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Dashboard</p>
            </div>
          </Link>
          <div className="mt-5 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-indigo-200">Session</p>
            <p className="mt-2 text-sm text-indigo-100">
              {botStatus?.online ? "Bot online and responding in real time." : "Bot currently offline. Control it from Overview."}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2 px-4 pb-4">
        {DASHBOARD_ITEMS.map((item) => {
          const active = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full rounded-[1.25rem] border px-4 py-3 text-left transition-all",
                active
                  ? "border-indigo-500/20 bg-indigo-500/10 text-indigo-200"
                  : "border-transparent bg-transparent text-zinc-400 hover:bg-white/[0.03] hover:text-zinc-200",
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn("rounded-xl p-2", active ? "bg-white/[0.08]" : "bg-white/[0.03]")}>
                  <item.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-zinc-500">{item.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </nav>

      <div className="p-4 pt-0">
        <Separator className="mb-4 bg-white/[0.06]" />
        <div className="flex items-center gap-3 rounded-[1.25rem] border border-white/[0.06] bg-white/[0.02] p-3">
          <Avatar className="h-10 w-10 border border-white/[0.06]">
            <AvatarImage src={user?.avatar || undefined} />
            <AvatarFallback className="bg-indigo-500/10 text-indigo-300">
              {user?.username?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-zinc-200">{user?.username}</p>
            <p className="text-xs text-zinc-500">Logged in</p>
          </div>
        </div>
        <Button
          variant="ghost"
          onClick={onSignOut}
          className="mt-3 w-full justify-start rounded-xl text-zinc-400 hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </>
  );
}

export function DashboardShell({
  activeTab,
  botStatus,
  children,
  mobileMenuOpen,
  onMobileMenuChange,
  onSignOut,
  onTabChange,
  user,
}: DashboardShellProps) {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-[#0a0a0b] text-white">
        <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.08),transparent_30%)]" />

        <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-white/[0.06] bg-[#0a0a0b]/90 backdrop-blur-2xl lg:flex lg:flex-col">
          <SidebarContent
            activeTab={activeTab}
            botStatus={botStatus}
            onSignOut={onSignOut}
            onTabChange={onTabChange}
            user={user}
          />
        </aside>

        <Sheet open={mobileMenuOpen} onOpenChange={onMobileMenuChange}>
          <SheetContent side="left" className="w-72 border-r border-white/[0.06] bg-[#0a0a0b]/95 p-0 backdrop-blur-2xl">
            <SidebarContent
              activeTab={activeTab}
              botStatus={botStatus}
              onSignOut={onSignOut}
              onTabChange={(tab) => {
                onTabChange(tab);
                onMobileMenuChange(false);
              }}
              user={user}
            />
          </SheetContent>
        </Sheet>

        <main className="relative z-10 lg:ml-72">
          <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#0a0a0b]/80 backdrop-blur-2xl">
            <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-4 md:px-8">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => onMobileMenuChange(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">Clout Control Surface</p>
                  <h1 className="text-xl font-semibold text-white">{TAB_LABELS[activeTab]}</h1>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <ThemeToggle />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        "flex items-center gap-2 rounded-xl border px-3 py-2 text-sm",
                        botStatus?.online
                          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                          : "border-red-500/20 bg-red-500/10 text-red-300",
                      )}
                    >
                      <span className={cn("h-2 w-2 rounded-full", botStatus?.online ? "bg-emerald-400 animate-pulse" : "bg-red-400")} />
                      {botStatus?.online ? "Online" : "Offline"}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Bot status</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[1400px] px-4 py-6 md:px-8 md:py-8">{children}</div>
        </main>
      </div>
    </TooltipProvider>
  );
}
