"use client";

import { memo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";

import { MagicCard } from "@/components/magicui/magic-card";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const analyticsData = [
  { name: "Mon", commands: 400, users: 240, good: 120, bad: 18, coins: 2400 },
  { name: "Tue", commands: 300, users: 139, good: 95, bad: 12, coins: 1890 },
  { name: "Wed", commands: 200, users: 980, good: 210, bad: 22, coins: 3200 },
  { name: "Thu", commands: 278, users: 390, good: 88, bad: 9, coins: 1560 },
  { name: "Fri", commands: 189, users: 480, good: 142, bad: 15, coins: 2100 },
  { name: "Sat", commands: 239, users: 380, good: 76, bad: 11, coins: 980 },
  { name: "Sun", commands: 349, users: 430, good: 104, bad: 14, coins: 2750 },
];

const topCommandsData = [
  { name: "/profile", count: 420, fill: "#6366f1" },
  { name: "/daily", count: 380, fill: "#8b5cf6" },
  { name: "/good", count: 290, fill: "#10b981" },
  { name: "/leaderboard", count: 195, fill: "#f59e0b" },
  { name: "/balance", count: 168, fill: "#0ea5e9" },
];

const tooltipStyle = {
  contentStyle: { backgroundColor: "rgba(10, 10, 11, 0.9)", borderColor: "rgba(255,255,255,0.06)", borderRadius: "8px" },
  itemStyle: { color: "#fff" },
};

export const AnalyticsSection = memo(function AnalyticsSection() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <MagicCard className="glass overflow-hidden rounded-[1.75rem] border-white/[0.06] shadow-xl" gradientColor="rgba(255,255,255,0.05)">
          <CardHeader>
            <CardTitle className="text-white">Command usage</CardTitle>
            <CardDescription className="text-zinc-500">Weekly commands executed</CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCommands" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip {...tooltipStyle} />
                  <Area type="monotone" dataKey="commands" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorCommands)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </MagicCard>

        <MagicCard className="glass overflow-hidden rounded-[1.75rem] border-white/[0.06] shadow-xl" gradientColor="rgba(255,255,255,0.05)">
          <CardHeader>
            <CardTitle className="text-white">User growth</CardTitle>
            <CardDescription className="text-zinc-500">Weekly member growth snapshot</CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip {...tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
                  <Bar dataKey="users" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </MagicCard>

        <MagicCard className="glass overflow-hidden rounded-[1.75rem] border-white/[0.06] shadow-xl" gradientColor="rgba(255,255,255,0.05)">
          <CardHeader>
            <CardTitle className="text-white">Karma activity</CardTitle>
            <CardDescription className="text-zinc-500">Good vs bad deeds over the week</CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorGood" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorBad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip {...tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 12 }} formatter={(value) => <span className="text-zinc-400">{value}</span>} />
                  <Area type="monotone" dataKey="good" name="Good deeds" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorGood)" />
                  <Area type="monotone" dataKey="bad" name="Bad deeds" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorBad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </MagicCard>

        <MagicCard className="glass overflow-hidden rounded-[1.75rem] border-white/[0.06] shadow-xl" gradientColor="rgba(255,255,255,0.05)">
          <CardHeader>
            <CardTitle className="text-white">Economy snapshot</CardTitle>
            <CardDescription className="text-zinc-500">Total coins in circulation (weekly)</CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} layout="vertical" barCategoryGap="12%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                  <XAxis type="number" stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} width={32} />
                  <RechartsTooltip {...tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
                  <Bar dataKey="coins" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </MagicCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <MagicCard className="glass overflow-hidden rounded-[1.75rem] border-white/[0.06] shadow-xl" gradientColor="rgba(255,255,255,0.05)">
          <CardHeader>
            <CardTitle className="text-white">Top commands</CardTitle>
            <CardDescription className="text-zinc-500">Most used slash commands this week</CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topCommandsData}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={{ stroke: "rgba(255,255,255,0.2)" }}
                  >
                    {topCommandsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <RechartsTooltip {...tooltipStyle} formatter={(value: number) => [value, "Uses"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </MagicCard>

        <MagicCard className="glass overflow-hidden rounded-[1.75rem] border-white/[0.06] shadow-xl" gradientColor="rgba(255,255,255,0.05)">
          <CardHeader>
            <CardTitle className="text-white">Moderation summary</CardTitle>
            <CardDescription className="text-zinc-500">Warns, kicks, and bans (last 7 days)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-center">
                <p className="text-2xl font-semibold text-amber-300">12</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-zinc-500">Warns</p>
              </div>
              <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-4 text-center">
                <p className="text-2xl font-semibold text-orange-300">3</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-zinc-500">Kicks</p>
              </div>
              <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-center">
                <p className="text-2xl font-semibold text-red-300">1</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-zinc-500">Bans</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-zinc-500">
              Connect a mod log channel in Server settings to track events in real time.
            </p>
          </CardContent>
        </MagicCard>
      </div>
    </div>
  );
});
