"use client";

import { memo, useEffect, useState } from "react";
import { Command, Lock, Save, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const apiUrl = () => process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface CommandsSectionProps {
  commands: any[];
  servers?: any[];
  token?: string | null;
}

export const CommandsSection = memo(function CommandsSection({ commands: initialCommands, servers = [], token }: CommandsSectionProps) {
  const [commands, setCommands] = useState<any[]>(initialCommands);
  const [selectedServerId, setSelectedServerId] = useState<string>("");
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
  const [configs, setConfigs] = useState<Record<string, { allowedRoleIds: string[]; allowedUserIds: string[] }>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    setCommands(initialCommands);
  }, [initialCommands]);

  useEffect(() => {
    if (!token) return;
    const url = apiUrl();
    fetch(`${url}/bot/commands/discord`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.data?.length) setCommands(data.data);
      })
      .catch(() => {});
  }, [token]);

  useEffect(() => {
    if (!selectedServerId || !token) {
      setRoles([]);
      setConfigs({});
      return;
    }
    setLoading(true);
    const url = apiUrl();
    Promise.all([
      fetch(`${url}/servers/${selectedServerId}/roles`, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`${url}/servers/${selectedServerId}/command-config`, { headers: { Authorization: `Bearer ${token}` } }),
    ])
      .then(async ([rRes, cRes]) => {
        const rolesData = rRes.ok ? await rRes.json() : { data: [] };
        const configData = cRes.ok ? await cRes.json() : { data: [] };
        setRoles(rolesData.data || []);
        const map: Record<string, { allowedRoleIds: string[]; allowedUserIds: string[] }> = {};
        (configData.data || []).forEach((c: any) => {
          map[c.commandName] = {
            allowedRoleIds: c.allowedRoleIds ?? [],
            allowedUserIds: c.allowedUserIds ?? [],
          };
        });
        setConfigs(map);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedServerId, token]);

  const getConfig = (commandName: string) => configs[commandName] ?? { allowedRoleIds: [], allowedUserIds: [] };

  const setConfig = (commandName: string, patch: { allowedRoleIds?: string[]; allowedUserIds?: string[] }) => {
    setConfigs((prev) => {
      const current = prev[commandName] ?? { allowedRoleIds: [], allowedUserIds: [] };
      return { ...prev, [commandName]: { ...current, ...patch } };
    });
  };

  const saveConfig = async (commandName: string) => {
    if (!selectedServerId || !token) return;
    setSaving(commandName);
    try {
      const cfg = getConfig(commandName);
      const res = await fetch(`${apiUrl()}/servers/${selectedServerId}/command-config`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commandName,
          allowedRoleIds: cfg.allowedRoleIds,
          allowedUserIds: cfg.allowedUserIds,
        }),
      });
      if (res.ok) toast.success(`Saved permissions for /${commandName}`);
      else toast.error("Failed to save");
    } catch {
      toast.error("Failed to save");
    }
    setSaving(null);
  };

  const selectedServer = servers.find((s: any) => s.discordId === selectedServerId);

  return (
    <div className="space-y-6">
      <Card className="glass rounded-[1.75rem] border-white/[0.06] inner-glow">
        <CardHeader>
          <CardTitle className="text-white">Bot commands</CardTitle>
          <CardDescription className="text-zinc-500">
            Slash commands synced from Discord. Configure per-server who can use each command (by role or user).
          </CardDescription>
        </CardHeader>
        <CardContent>
          {commands && commands.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {commands.map((cmd) => (
                <div key={cmd.name} className="rounded-[1.25rem] border border-white/[0.06] bg-white/[0.03] p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Badge className="border-0 bg-indigo-500/10 text-indigo-300">{cmd.category || "General"}</Badge>
                    <h3 className="font-semibold text-white">/{cmd.name}</h3>
                  </div>
                  <p className="mb-3 text-sm text-zinc-400">{cmd.description}</p>
                  <code className="rounded bg-black/30 px-2 py-1 font-mono text-xs text-zinc-500">{cmd.usage || `/${cmd.name}`}</code>
                </div>
              ))}
            </div>
          ) : (
            <div className="mx-auto flex max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
              <div className="relative mb-8 h-24 w-24">
                <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-xl animate-pulse" />
                <div className="relative flex h-full w-full items-center justify-center rounded-full border border-white/[0.05] bg-white/[0.02]">
                  <Command className="h-10 w-10 text-indigo-300" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white">No commands found</h3>
              <p className="mt-3 text-zinc-400">
                We could not load slash commands. Ensure the bot is running and registered with Discord.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {servers.length > 0 && token && (
        <Card className="glass rounded-[1.75rem] border-white/[0.06] inner-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Lock className="h-5 w-5 text-violet-300" />
              Command access (per server)
            </CardTitle>
            <CardDescription className="text-zinc-500">
              Restrict which roles or users can run specific commands. Empty = use Discord&apos;s default permissions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Server</label>
              <select
                value={selectedServerId}
                onChange={(e) => setSelectedServerId(e.target.value)}
                className="w-full max-w-xs rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
              >
                <option value="">Select a server</option>
                {servers.map((s: any) => (
                  <option key={s.id} value={s.discordId}>{s.name}</option>
                ))}
              </select>
            </div>
            {selectedServerId && (
              <>
                {loading ? (
                  <p className="text-sm text-zinc-500">Loading roles and config…</p>
                ) : (
                  <div className="space-y-4">
                    {commands?.slice(0, 12).map((cmd) => {
                      const cfg = getConfig(cmd.name);
                      return (
                        <div key={cmd.name} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                          <div className="mb-3 flex items-center justify-between">
                            <span className="font-medium text-zinc-200">/{cmd.name}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/10"
                              disabled={saving === cmd.name}
                              onClick={() => saveConfig(cmd.name)}
                            >
                              {saving === cmd.name ? "Saving…" : <><Save className="mr-1 h-3 w-3" /> Save</>}
                            </Button>
                          </div>
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                              <label className="mb-1 flex items-center gap-1 text-xs text-zinc-500">
                                <Users className="h-3 w-3" /> Allowed roles
                              </label>
                              <select
                                multiple
                                className="h-20 w-full rounded-lg border border-white/[0.06] bg-white/[0.03] px-2 py-1 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                                value={cfg.allowedRoleIds}
                                onChange={(e) => setConfig(cmd.name, { allowedRoleIds: Array.from(e.target.selectedOptions, (o) => o.value) })}
                              >
                                {roles.map((r) => (
                                  <option key={r.id} value={r.id}>{r.name}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="mb-1 text-xs text-zinc-500">Allowed user IDs (comma-separated)</label>
                              <input
                                type="text"
                                className="h-20 w-full rounded-lg border border-white/[0.06] bg-white/[0.03] px-2 py-1 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                                placeholder="e.g. 123,456"
                                value={cfg.allowedUserIds.join(", ")}
                                onChange={(e) => setConfig(cmd.name, {
                                  allowedUserIds: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                                })}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {commands && commands.length > 12 && (
                      <p className="text-xs text-zinc-500">Showing first 12 commands. Configure others the same way after saving.</p>
                    )}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
});
