"use client";

import { memo, useEffect, useState } from "react";
import {
  ArrowLeft,
  Ban,
  BookOpen,
  ExternalLink,
  Plus,
  Save,
  Server,
  Shield,
  UserMinus,
  UserX,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { DiscordGuild } from "./dashboard-types";

const REPO_URL = "https://github.com/krishs05/clout";
const DISCORD_CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || "";

const ADMINISTRATOR = 0x8;
const MANAGE_GUILD = 0x20;

function canManageGuild(g: DiscordGuild): boolean {
  const p = g.permissions ? parseInt(g.permissions, 10) : 0;
  return (p & ADMINISTRATOR) === ADMINISTRATOR || (p & MANAGE_GUILD) === MANAGE_GUILD;
}

function inviteUrl(guildId: string): string {
  const base = "https://discord.com/oauth2/authorize";
  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    permissions: "277025508352",
    scope: "bot applications.commands",
    guild_id: guildId,
  });
  return `${base}?${params.toString()}`;
}

interface ServersSectionProps {
  guilds: DiscordGuild[];
  servers: any[];
  token: string;
}

export const ServersSection = memo(function ServersSection({ guilds, servers, token }: ServersSectionProps) {
  const [selectedServer, setSelectedServer] = useState<any | null>(null);
  const [settings, setSettings] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [modEvents, setModEvents] = useState<any[]>([]);
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);

  const connectedIds = new Set((servers || []).map((s: any) => s.discordId));
  const availableToAdd = (guilds || []).filter((g) => canManageGuild(g) && !connectedIds.has(g.id));

  const handleSelectServer = async (server: any) => {
    setSelectedServer(server);
    setLoading(true);
    setModEvents([]);
    setRoles([]);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const [detailRes, eventsRes, rolesRes] = await Promise.all([
        fetch(`${apiUrl}/servers/${server.discordId}`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${apiUrl}/servers/${server.discordId}/moderation/events`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${apiUrl}/servers/${server.discordId}/roles`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (detailRes.ok) {
        const data = await detailRes.json();
        const raw = data.data?.settings ?? {};
        setSettings({
          ...raw,
          modRoleIdsWarn: Array.isArray(raw.modRoleIdsWarn) ? raw.modRoleIdsWarn : [],
          modRoleIdsKick: Array.isArray(raw.modRoleIdsKick) ? raw.modRoleIdsKick : [],
          modRoleIdsBan: Array.isArray(raw.modRoleIdsBan) ? raw.modRoleIdsBan : [],
        });
      } else {
        setSettings({});
      }
      if (eventsRes.ok) {
        const d = await eventsRes.json();
        setModEvents(d.data || []);
      }
      if (rolesRes.ok) {
        const d = await rolesRes.json();
        setRoles(d.data || []);
      }
    } catch (e) {
      console.error("Failed to load server", e);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!selectedServer) return;
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const res = await fetch(`${apiUrl}/servers/${selectedServer.discordId}/settings`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          welcomeChannelId: settings?.welcomeChannelId || null,
          welcomeMessage: settings?.welcomeMessage || null,
          leaveChannelId: settings?.leaveChannelId || null,
          leaveMessage: settings?.leaveMessage || null,
          antiLinkEnabled: settings?.antiLinkEnabled ?? false,
          antiSpamEnabled: settings?.antiSpamEnabled ?? false,
          antiInvitesEnabled: settings?.antiInvitesEnabled ?? false,
          modLogChannelId: settings?.modLogChannelId || null,
          modRoleIdsWarn: Array.isArray(settings?.modRoleIdsWarn) ? settings.modRoleIdsWarn : null,
          modRoleIdsKick: Array.isArray(settings?.modRoleIdsKick) ? settings.modRoleIdsKick : null,
          modRoleIdsBan: Array.isArray(settings?.modRoleIdsBan) ? settings.modRoleIdsBan : null,
        }),
      });
      if (res.ok) toast.success("Settings saved");
      else toast.error("Failed to save");
    } catch {
      toast.error("Failed to save");
    }
    setLoading(false);
  };

  const setModRoles = (key: "modRoleIdsWarn" | "modRoleIdsKick" | "modRoleIdsBan", roleIds: string[]) => {
    setSettings((s: any) => ({ ...(s ?? {}), [key]: roleIds }));
  };

  function modRoleArray(key: "modRoleIdsWarn" | "modRoleIdsKick" | "modRoleIdsBan"): string[] {
    const v = settings?.[key];
    return Array.isArray(v) ? v : [];
  }

  if (selectedServer) {
    return (
      <div className="space-y-6">
        <Card className="glass rounded-[1.75rem] border-white/[0.06] inner-glow">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <Button variant="ghost" size="icon" onClick={() => setSelectedServer(null)}>
              <ArrowLeft className="h-5 w-5 text-zinc-400" />
            </Button>
            <div>
              <CardTitle className="text-white">{selectedServer.name} settings</CardTitle>
              <CardDescription className="text-zinc-500">Configure welcome, leave, auto-moderation, and who can moderate</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {loading && !settings ? (
              <div className="text-sm text-zinc-400">Loading server settings...</div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label className="text-zinc-400">Welcome Channel ID</Label>
                  <Input className="border-white/[0.06] bg-white/[0.03] text-zinc-200" value={settings?.welcomeChannelId || ""} onChange={(e) => setSettings({ ...settings, welcomeChannelId: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400">Welcome Message</Label>
                  <Textarea className="min-h-[100px] resize-none border-white/[0.06] bg-white/[0.03] text-zinc-200" value={settings?.welcomeMessage || ""} onChange={(e) => setSettings({ ...settings, welcomeMessage: e.target.value })} />
                  <p className="text-xs text-zinc-500">Variables: {"{user}"}, {"{server}"}, {"{memberCount}"}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400">Leave Channel ID</Label>
                  <Input className="border-white/[0.06] bg-white/[0.03] text-zinc-200" value={settings?.leaveChannelId || ""} onChange={(e) => setSettings({ ...settings, leaveChannelId: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400">Leave Message</Label>
                  <Textarea className="min-h-[100px] resize-none border-white/[0.06] bg-white/[0.03] text-zinc-200" value={settings?.leaveMessage || ""} onChange={(e) => setSettings({ ...settings, leaveMessage: e.target.value })} />
                </div>
                <Separator className="bg-white/[0.06]" />
                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 text-sm font-medium text-white">
                    <Shield className="h-4 w-4 text-indigo-300" />
                    Auto-moderation
                  </h4>
                  {[
                    ["Anti-Link", "Deletes messages containing links", "antiLinkEnabled"],
                    ["Anti-Invite", "Deletes Discord server invites", "antiInvitesEnabled"],
                    ["Anti-Spam", "Deletes rapid duplicate messages", "antiSpamEnabled"],
                  ].map(([title, description, key]) => (
                    <div key={key} className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                      <div>
                        <Label className="text-sm text-zinc-200">{title}</Label>
                        <p className="text-xs text-zinc-500">{description}</p>
                      </div>
                      <Switch checked={settings?.[key] || false} onCheckedChange={(checked) => setSettings({ ...settings, [key]: checked })} />
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400">Mod Log Channel ID</Label>
                  <Input className="border-white/[0.06] bg-white/[0.03] text-zinc-200" value={settings?.modLogChannelId || ""} onChange={(e) => setSettings({ ...settings, modLogChannelId: e.target.value })} />
                </div>
                <Button onClick={handleSave} disabled={loading} className="w-full bg-indigo-600 text-white hover:bg-indigo-500">
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="glass rounded-[1.75rem] border-white/[0.06] inner-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Shield className="h-5 w-5 text-violet-300" />
              Moderation
            </CardTitle>
            <CardDescription className="text-zinc-500">Recent events and which roles can warn, kick, or ban</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="mb-3 text-sm font-medium text-zinc-300">Recent warns, kicks, and bans</h4>
              {modEvents.length === 0 ? (
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-center text-sm text-zinc-500">
                  No moderation events yet. Events will appear here when the bot logs them.
                </div>
              ) : (
                <ul className="space-y-2">
                  {modEvents.map((ev: any) => (
                    <li key={ev.id} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                      {ev.action === "warn" && <UserMinus className="h-4 w-4 text-amber-400" />}
                      {ev.action === "kick" && <UserX className="h-4 w-4 text-orange-400" />}
                      {ev.action === "ban" && <Ban className="h-4 w-4 text-red-400" />}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-zinc-200">
                          <span className="font-medium">{ev.moderatorUsername}</span> {ev.action}ed <span className="font-medium">{ev.targetUsername}</span>
                          {ev.reason ? `: ${ev.reason}` : ""}
                        </p>
                        <p className="text-xs text-zinc-500">{new Date(ev.createdAt).toLocaleString()}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <Separator className="bg-white/[0.06]" />
            <div>
              <h4 className="mb-3 text-sm font-medium text-zinc-300">Roles allowed to moderate</h4>
              <p className="mb-4 text-xs text-zinc-500">Select which Discord roles can use /warn, /kick, and /ban. Leave empty to allow only server moderators.</p>
              {roles.length === 0 ? (
                <p className="text-sm text-zinc-500">Could not load roles. Ensure the bot is in the server and has permission to view roles.</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { key: "modRoleIdsWarn" as const, label: "Can warn", color: "amber" },
                    { key: "modRoleIdsKick" as const, label: "Can kick", color: "orange" },
                    { key: "modRoleIdsBan" as const, label: "Can ban", color: "red" },
                  ].map(({ key, label }) => (
                    <div key={key} className="space-y-2">
                      <Label className="text-zinc-400">{label}</Label>
                      <select
                        multiple
                        className="h-28 w-full rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                        value={modRoleArray(key)}
                        onChange={(e) => {
                          const selected = Array.from(e.target.selectedOptions, (o) => o.value);
                          setModRoles(key, selected);
                        }}
                      >
                        {roles.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-zinc-500">Ctrl+click to select multiple</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="glass rounded-[1.75rem] border-white/[0.06] inner-glow">
        <CardHeader>
          <CardTitle className="text-white">Connected servers</CardTitle>
          <CardDescription className="text-zinc-500">Servers where Clout is already added. Click to configure.</CardDescription>
        </CardHeader>
        <CardContent>
          {servers && servers.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {servers.map((server) => (
                <button
                  key={server.id}
                  onClick={() => handleSelectServer(server)}
                  className="rounded-[1.5rem] border border-white/[0.06] bg-white/[0.03] p-5 text-left transition-colors hover:bg-white/[0.06]"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10">
                    <Server className="h-6 w-6 text-indigo-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{server.name}</h3>
                  <p className="mt-1 text-xs text-zinc-500">ID: {server.discordId}</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-center">
              <p className="text-sm text-zinc-400">No servers with Clout yet. Add the bot to a server below, then it will appear here.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {availableToAdd.length > 0 && DISCORD_CLIENT_ID && (
        <Card className="glass rounded-[1.75rem] border-white/[0.06] inner-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Plus className="h-5 w-5 text-emerald-300" />
              Add Clout to a server
            </CardTitle>
            <CardDescription className="text-zinc-500">Servers you manage where the bot is not added yet. Use the invite link to add Clout.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {availableToAdd.map((guild) => (
                <div key={guild.id} className="flex items-center justify-between gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-zinc-200">{guild.name}</p>
                    <p className="text-xs text-zinc-500">ID: {guild.id}</p>
                  </div>
                  <a
                    href={inviteUrl(guild.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-300 hover:bg-emerald-500/20"
                  >
                    Add bot
                  </a>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {(!guilds || guilds.length === 0) && (!servers || servers.length === 0) && (
        <div className="mx-auto flex max-w-lg flex-col items-center justify-center rounded-[1.75rem] border border-white/[0.06] bg-white/[0.02] px-4 py-16 text-center">
          <div className="relative mb-8 h-24 w-24">
            <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-xl animate-pulse" />
            <div className="relative flex h-full w-full items-center justify-center rounded-full border border-white/[0.05] bg-white/[0.03]">
              <Server className="h-10 w-10 text-indigo-300" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white">No servers found</h3>
          <p className="mt-3 text-zinc-400">
            Reconnect your Discord account so we can see your servers, or add Clout from the Discord app.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link href={REPO_URL} target="_blank" rel="noopener noreferrer">
              <Button className="bg-indigo-600 text-white hover:bg-indigo-500">
                <ExternalLink className="mr-2 h-4 w-4" />
                Open repository
              </Button>
            </Link>
            <Link href={`${REPO_URL}#quick-start`} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="border-white/[0.1] bg-white/[0.02] text-zinc-300 hover:bg-white/[0.06]">
                <BookOpen className="mr-2 h-4 w-4" />
                Read setup guide
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
});
