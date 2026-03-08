"use client";

import { memo } from "react";
import {
  AlertTriangle,
  Ban,
  FileText,
  Shield,
  ShieldAlert,
  UserX,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const AdminSection = memo(function AdminSection() {
  return (
    <div className="space-y-6 md:space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass rounded-[1.75rem] border-white/[0.06] inner-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <FileText className="h-5 w-5 text-indigo-300" />
              Moderation log
            </CardTitle>
            <CardDescription className="text-zinc-500">
              Recent warns, kicks, and bans across your servers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-[1.25rem] border border-white/[0.06] bg-white/[0.02] p-6">
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03]">
                  <Shield className="h-6 w-6 text-zinc-500" />
                </div>
                <p className="text-sm font-medium text-zinc-300">No moderation events yet</p>
                <p className="mt-1 text-xs text-zinc-500">
                  Warns, kicks, and bans will appear here when they occur.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass rounded-[1.75rem] border-white/[0.06] inner-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Shield className="h-5 w-5 text-violet-300" />
              Bot settings
            </CardTitle>
            <CardDescription className="text-zinc-500">
              Global defaults and feature toggles (per-server in Servers)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
              <div>
                <p className="text-sm font-medium text-zinc-200">Command prefix</p>
                <p className="text-xs text-zinc-500">Fallback when slash commands are unavailable</p>
              </div>
              <span className="rounded-xl bg-white/[0.05] px-3 py-1.5 font-mono text-sm text-zinc-300">!</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
              <div>
                <p className="text-sm font-medium text-zinc-200">Log level</p>
                <p className="text-xs text-zinc-500">Console and file verbosity</p>
              </div>
              <span className="rounded-xl bg-white/[0.05] px-3 py-1.5 text-sm text-zinc-300">info</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass rounded-[1.75rem] border-red-500/10 inner-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-200">
            <ShieldAlert className="h-5 w-5" />
            Dangerous zone
          </CardTitle>
          <CardDescription className="text-zinc-500">
            Irreversible or high-impact actions. Use with care.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Separator className="bg-white/[0.06]" />
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                <UserX className="h-5 w-5 text-amber-300" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-200">Leave server (bot)</p>
                <p className="text-xs text-zinc-500">Remove the bot from a Discord server</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="border-amber-500/20 text-amber-300 hover:bg-amber-500/10 hover:text-amber-200"
            >
              Choose server
            </Button>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
                <Ban className="h-5 w-5 text-red-300" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-200">Reset moderation data</p>
                <p className="text-xs text-zinc-500">Clear warns and logs for a server</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="border-red-500/20 text-red-300 hover:bg-red-500/10 hover:text-red-200"
            >
              Reset
            </Button>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
            <p className="text-xs text-amber-200/90">
              These actions may require confirmation in a future update. Ensure you have backups or exports if needed.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});
