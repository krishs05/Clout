"use client";

import { memo, useEffect, useState } from "react";
import { Send, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const EMBED_PLACEHOLDERS = ["{username}", "{goodDeeds}", "{badDeeds}", "{balance}"];

interface ServerOption {
  id: string;
  discordId: string;
  name: string;
}

interface EmbedEditorSectionProps {
  servers?: ServerOption[];
  token?: string | null;
}

export const EmbedEditorSection = memo(function EmbedEditorSection({ servers = [], token }: EmbedEditorSectionProps) {
  const [selectedServerId, setSelectedServerId] = useState<string>("");
  const [color, setColor] = useState("#6366f1");
  const [title, setTitle] = useState("{username}'s Profile");
  const [description, setDescription] = useState("Good deeds: {goodDeeds} | Bad deeds: {badDeeds}");
  const [footer, setFooter] = useState("Clout Bot");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  const [sendChannelId, setSendChannelId] = useState("");
  const [sendTitle, setSendTitle] = useState("");
  const [sendDescription, setSendDescription] = useState("");
  const [sendColor, setSendColor] = useState("#6366f1");
  const [sendFooter, setSendFooter] = useState("");
  const [sending, setSending] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  const selectedServer = servers.find((s) => s.discordId === selectedServerId);

  useEffect(() => {
    if (!selectedServerId || !token) return;
    setLoading(true);
    fetch(`${apiUrl}/servers/${selectedServerId}/embed`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Failed to load"))))
      .then((body) => {
        const data = body.data || body;
        if (data.color) setColor(data.color);
        if (data.title) setTitle(data.title);
        if (data.description) setDescription(data.description);
        if (data.footer) setFooter(data.footer);
      })
      .catch(() => toast.error("Could not load embed config for this server"))
      .finally(() => setLoading(false));
  }, [selectedServerId, token, apiUrl]);

  const handleSave = async () => {
    if (!selectedServerId || !token) {
      toast.error("Select a server first");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${apiUrl}/servers/${selectedServerId}/embed`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ color, title, description, footer }),
      });
      if (!res.ok) throw new Error("Save failed");
      toast.success("Embed configuration saved");
    } catch {
      toast.error("Failed to save embed configuration");
    } finally {
      setSaving(false);
    }
  };

  const handleSendCustomEmbed = async () => {
    if (!token) {
      toast.error("You must be logged in to send embeds");
      return;
    }
    if (!sendChannelId.trim() || (!sendTitle.trim() && !sendDescription.trim())) {
      toast.error("Enter a channel ID and at least a title or description");
      return;
    }
    setSending(true);
    try {
      const res = await fetch(`${apiUrl}/bot/send-embed`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          channelId: sendChannelId.trim(),
          embed: {
            title: sendTitle || undefined,
            description: sendDescription || undefined,
            color: sendColor.replace("#", ""),
            footer: sendFooter || undefined,
          },
        }),
      });
      if (res.ok) {
        toast.success("Embed sent");
        setSendTitle("");
        setSendDescription("");
        setSendFooter("");
      } else {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error || "Send failed");
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to send embed";
      if (msg.includes("not found") || msg.includes("404") || msg.includes("not configured")) {
        toast.error("Send-embed API not configured. Add POST /bot/send-embed to enable sending from the dashboard.");
      } else {
        toast.error(msg);
      }
    } finally {
      setSending(false);
    }
  };

  const previewTitle = title.replace(/\{username\}/g, "DemoUser");
  const previewDescription = description
    .replace(/\{goodDeeds\}/g, "12")
    .replace(/\{badDeeds\}/g, "3")
    .replace(/\{balance\}/g, "1,240");

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass rounded-[1.75rem] border-white/[0.06] inner-glow">
          <CardHeader>
            <CardTitle className="text-white">Embed configuration</CardTitle>
            <CardDescription className="text-zinc-500">Customize how embeds appear in Discord (per server)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {servers.length > 0 ? (
              <div className="space-y-2">
                <Label className="text-zinc-400">Server</Label>
                <select
                  value={selectedServerId}
                  onChange={(e) => setSelectedServerId(e.target.value)}
                  className="w-full rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                >
                  <option value="">Select a server</option>
                  {servers.map((s) => (
                    <option key={s.id} value={s.discordId}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <p className="text-xs text-zinc-500">Add the bot to a server and refresh to configure embeds.</p>
            )}

            <div className="space-y-2">
              <Label className="text-zinc-400">Accent color</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-10 w-12 cursor-pointer rounded-lg border-0 bg-transparent"
                />
                <Input
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="font-mono border-white/[0.06] bg-white/[0.03] text-zinc-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-400">Title template</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="{username}'s Profile"
                className="border-white/[0.06] bg-white/[0.03] text-zinc-200"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-400">Description template</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Good deeds: {goodDeeds} | Bad deeds: {badDeeds}"
                className="resize-none border-white/[0.06] bg-white/[0.03] text-zinc-200"
              />
              <p className="text-xs text-zinc-500">
                Placeholders: {EMBED_PLACEHOLDERS.join(", ")}
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-400">Footer text</Label>
              <Input
                value={footer}
                onChange={(e) => setFooter(e.target.value)}
                className="border-white/[0.06] bg-white/[0.03] text-zinc-200"
              />
            </div>

            <Button
              onClick={handleSave}
              disabled={!selectedServerId || saving || loading}
              className="w-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20"
            >
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </CardContent>
        </Card>

        <Card className="glass rounded-[1.75rem] border-white/[0.06] inner-glow">
          <CardHeader>
            <CardTitle className="text-white">Preview</CardTitle>
            <CardDescription className="text-zinc-500">Discord-style render preview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-2xl" style={{ borderLeft: `4px solid ${color}` }}>
              <div className="bg-[#2f3136] p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-bold text-white">
                    C
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-white">Clout</span>
                      <Badge className="border-0 bg-[#5865F2] px-1 py-0 text-[10px] text-white">BOT</Badge>
                    </div>
                    <div className="mt-0.5 text-xs text-gray-400">Today at 4:20 PM</div>
                    <div className="mt-3 rounded-lg bg-[#36393f] p-3">
                      <div className="mb-2 text-sm font-semibold" style={{ color }}>
                        {previewTitle}
                      </div>
                      <div className="text-sm text-gray-300">
                        {previewDescription}
                      </div>
                      <div className="mt-3 flex items-center gap-2 border-t border-white/10 pt-3 text-xs text-gray-400">
                        <Sparkles className="h-3 w-3 shrink-0" />
                        {footer}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass rounded-[1.75rem] border-white/[0.06] inner-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Send className="h-5 w-5 text-emerald-300" />
            Send custom embed
          </CardTitle>
          <CardDescription className="text-zinc-500">
            Post a one-off embed to a channel (requires bot permission and send-embed API)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-zinc-400">Channel ID</Label>
              <Input
                value={sendChannelId}
                onChange={(e) => setSendChannelId(e.target.value)}
                placeholder="e.g. 123456789012345678"
                className="font-mono border-white/[0.06] bg-white/[0.03] text-zinc-200"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400">Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={sendColor}
                  onChange={(e) => setSendColor(e.target.value)}
                  className="h-9 w-10 cursor-pointer rounded-lg border-0 bg-transparent"
                />
                <Input
                  value={sendColor}
                  onChange={(e) => setSendColor(e.target.value)}
                  className="font-mono border-white/[0.06] bg-white/[0.03] text-zinc-200"
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-400">Title</Label>
            <Input
              value={sendTitle}
              onChange={(e) => setSendTitle(e.target.value)}
              placeholder="Announcement"
              className="border-white/[0.06] bg-white/[0.03] text-zinc-200"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-400">Description</Label>
            <Textarea
              value={sendDescription}
              onChange={(e) => setSendDescription(e.target.value)}
              rows={2}
              placeholder="Your message here…"
              className="resize-none border-white/[0.06] bg-white/[0.03] text-zinc-200"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-400">Footer (optional)</Label>
            <Input
              value={sendFooter}
              onChange={(e) => setSendFooter(e.target.value)}
              className="border-white/[0.06] bg-white/[0.03] text-zinc-200"
            />
          </div>
          <Button
            onClick={handleSendCustomEmbed}
            disabled={sending || !token}
            className="border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
          >
            <Send className="mr-2 h-4 w-4" />
            {sending ? "Sending…" : "Send embed"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
});
