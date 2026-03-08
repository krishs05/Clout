"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Shield,
  Zap,
  Users,
  X,
  Check,
  Copy,
  Activity,
  Coins,
  MessageSquare,
  Terminal,
  Github,
  Crown,
  ChevronRight,
  Pause,
  Play
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ============================================================================
// TYPES & MOCK DATA
// ============================================================================

interface Metric {
  label: string;
  value: string;
  suffix?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface LiveEvent {
  id: string;
  type: "command" | "economy" | "moderation";
  message: string;
  timestamp: Date;
}

interface TabData {
  id: string;
  label: string;
  metrics: Metric[];
}

const TAB_DATA: TabData[] = [
  {
    id: "moderation",
    label: "Moderation",
    metrics: [
      { label: "Auto-mod Rules", value: "Custom", icon: Shield, color: "text-emerald-400" },
      { label: "Warning System", value: "Active", icon: Activity, color: "text-amber-400" },
      { label: "Clean Actions", value: "Automated", icon: MessageSquare, color: "text-indigo-400" },
    ],
  },
  {
    id: "economy",
    label: "Economy",
    metrics: [
      { label: "Database", value: "Local", icon: Coins, color: "text-amber-400" },
      { label: "Daily Claims", value: "Custom", icon: Zap, color: "text-yellow-400" },
      { label: "Transactions", value: "Real-time", icon: Activity, color: "text-emerald-400" },
    ],
  },
  {
    id: "community",
    label: "Community",
    metrics: [
      { label: "Member Tracking", value: "Enabled", icon: Users, color: "text-indigo-400" },
      { label: "Logging", value: "Active", icon: MessageSquare, color: "text-violet-400" },
      { label: "Karma System", value: "Ready", icon: Crown, color: "text-pink-400" },
    ],
  },
];

const BENEFITS = [
  "Free forever with no paywalls",
  "Self-hosted for full control",
  "Real-time dashboard updates",
  "Custom economy & karma system",
  "12+ slash commands included",
  "PostgreSQL database backend"
];

const CODE_SNIPPET = `version: "3.8"
services:
  clout:
    image: clout/bot:latest
    environment:
      - DISCORD_TOKEN=your_token_here
      - DATABASE_URL=postgresql://...
    ports:
      - "3001:3001"`;

// ============================================================================
// UTILITY COMPONENTS
// ============================================================================

// Replaced AnimatedCounter since we are passing static feature strings now
function AnimatedCounter({ value, suffix = "" }: { value: string; suffix?: string }) {
  return (
    <span>
      {value}{suffix && ` ${suffix}`}
    </span>
  );
}

// Copy to clipboard with toast
function CopyCodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Copied to clipboard!", {
      description: "Docker Compose configuration ready to paste.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <div className="relative glass rounded-xl p-4 border border-white/[0.05]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Terminal className="w-3.5 h-3.5" />
            docker-compose.yml
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 px-2 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.05]"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1.5" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1.5" />
                Copy
              </>
            )}
          </Button>
        </div>
        <pre className="text-xs text-zinc-300 font-mono leading-relaxed overflow-x-auto">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

// Live feed component with simulated events
function LiveFeed({ isActive }: { isActive: boolean }) {
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  const eventTemplates = [
    { type: "command" as const, message: "User ran /daily reward" },
    { type: "economy" as const, message: "+50 coins transferred to @alice" },
    { type: "moderation" as const, message: "Auto-mod deleted spam message" },
    { type: "command" as const, message: "New custom command created" },
    { type: "economy" as const, message: "@bob purchased premium role" },
    { type: "moderation" as const, message: "Warning issued to @user123" },
  ];

  useEffect(() => {
    if (!isActive || isPaused) return;

    // Static display of features, no random simulated data
    const initialEvents: LiveEvent[] = [
      {
        id: "ev_1",
        type: "command",
        message: "Bot fully customizable via dashboard",
        timestamp: new Date(),
      },
      {
        id: "ev_2",
        type: "economy",
        message: "Your own database, your own rules",
        timestamp: new Date(Date.now() - 5000),
      },
      {
        id: "ev_3",
        type: "moderation",
        message: "Self-hosted tracking and events",
        timestamp: new Date(Date.now() - 15000),
      }
    ];
    setEvents(initialEvents);
  }, [isActive, isPaused]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case "command": return <Zap className="w-3.5 h-3.5 text-indigo-400" />;
      case "economy": return <Coins className="w-3.5 h-3.5 text-amber-400" />;
      case "moderation": return <Shield className="w-3.5 h-3.5 text-emerald-400" />;
      default: return <Activity className="w-3.5 h-3.5 text-zinc-400" />;
    }
  };

  return (
    <div className="glass rounded-xl p-4 border border-white/[0.05]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm font-medium text-zinc-300">Live Activity</span>
        </div>
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="p-1.5 rounded-lg hover:bg-white/[0.05] text-zinc-500 transition-colors"
        >
          {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3 py-2 px-3 rounded-lg bg-white/[0.02]"
            >
              {getEventIcon(event.type)}
              <span className="text-xs text-zinc-400 flex-1">{event.message}</span>
              <span className="text-[10px] text-zinc-600">
                {event.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
        {events.length === 0 && (
          <div className="text-center py-6 text-zinc-500 text-sm">
            Waiting for activity...
          </div>
        )}
      </div>
    </div>
  );
}

// Metric card with animated counter
function MetricCard({ metric, delay }: { metric: Metric; delay: number }) {
  const IconComponent = metric.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="glass rounded-xl p-4 border border-white/[0.05] card-hover"
    >
      <div className={`p-2 rounded-lg bg-white/[0.03] w-fit mb-3 ${metric.color}`}>
        <IconComponent className="w-5 h-5" />
      </div>
      <p className="text-2xl font-semibold text-white">
        <AnimatedCounter value={metric.value} suffix={metric.suffix} />
      </p>
      <p className="text-sm text-zinc-500 mt-1">{metric.label}</p>
    </motion.div>
  );
}

// ============================================================================
// DASHBOARD PREVIEW CARD (COLLAPSED STATE)
// ============================================================================

interface DashboardPreviewCardProps {
  onClick: () => void;
  layoutId: string;
}

function DashboardPreviewCard({ onClick, layoutId }: DashboardPreviewCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();

    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const previewItems = [
    { icon: Shield, title: "Moderation Ready", desc: "Auto-moderation enabled", color: "bg-indigo-500/10", iconColor: "text-indigo-400" },
    { icon: Zap, title: "Economy Active", desc: "Virtual currency running", color: "bg-emerald-500/10", iconColor: "text-emerald-400" },
    { icon: Users, title: "Community Growing", desc: "Member tracking active", color: "bg-amber-500/10", iconColor: "text-amber-400" },
  ];

  return (
    <motion.div
      ref={cardRef}
      layoutId={layoutId}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="relative glass rounded-2xl p-6 border border-white/[0.05] cursor-pointer overflow-hidden group"
    >
      {/* Spotlight effect */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.06), transparent 40%)`,
        }}
      />

      {/* Border highlight on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          boxShadow: isHovered ? "inset 0 0 0 1px rgba(99, 102, 241, 0.2)" : "none"
        }}
      />

      {/* Window chrome */}
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/[0.05]">
        <div className="w-3 h-3 rounded-full bg-red-400/80" />
        <div className="w-3 h-3 rounded-full bg-amber-400/80" />
        <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
        <span className="ml-3 text-xs text-zinc-600 font-mono">clout-dashboard</span>
      </div>

      {/* Preview rows */}
      <div className="space-y-3">
        {previewItems.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 + 0.3 }}
            whileHover={{ x: 2, backgroundColor: "rgba(255, 255, 255, 0.03)" }}
            className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] transition-colors"
          >
            <motion.div
              whileHover={{ x: 2 }}
              className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center`}
            >
              <item.icon className={`w-5 h-5 ${item.iconColor}`} />
            </motion.div>
            <div>
              <p className="text-sm font-medium text-zinc-200">{item.title}</p>
              <p className="text-xs text-zinc-500">{item.desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-600 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        ))}
      </div>

      {/* Click hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        className="absolute bottom-4 right-4 text-[10px] text-zinc-500 uppercase tracking-wider"
      >
        Click to explore
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// EXPANDED DASHBOARD CONTENT (MODAL / INLINE)
// ============================================================================

interface DashboardExpandedContentProps {
  onClose: () => void;
  layoutId: string;
  isModal?: boolean;
}

function DashboardExpandedContent({ onClose, layoutId, isModal = true }: DashboardExpandedContentProps) {
  const [activeTab, setActiveTab] = useState("moderation");

  return (
    <motion.div
      layoutId={layoutId}
      className={cn(
        "bg-[#0a0a0b] overflow-hidden",
        isModal
          ? "rounded-2xl border border-white/[0.06] shadow-2xl"
          : "rounded-none border-0"
      )}
    >
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/[0.05]">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-400/80" />
            <div className="w-3 h-3 rounded-full bg-amber-400/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
            <span className="ml-3 text-xs text-zinc-500 font-mono">clout-dashboard</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/[0.05] text-zinc-400 hover:text-zinc-200 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full bg-white/[0.02] border border-white/[0.05] p-1 mb-6">
              {TAB_DATA.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex-1 data-[state=active]:bg-indigo-500/10 data-[state=active]:text-indigo-300 text-zinc-400"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {TAB_DATA.map((tab) => (
              <TabsContent key={tab.id} value={tab.id} className="mt-0">
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Metric cards */}
                  <div className="lg:col-span-2">
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {tab.metrics.map((metric, i) => (
                        <MetricCard key={metric.label} metric={metric} delay={i * 0.1} />
                      ))}
                    </div>

                    {/* Code snippet */}
                    <CopyCodeBlock code={CODE_SNIPPET} />
                  </div>

                  {/* Live feed */}
                  <div className="lg:col-span-1">
                    <LiveFeed isActive={activeTab === tab.id} />
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Footer CTAs */}
          <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-white/[0.05]">
            <Button
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-6"
            >
              <Crown className="w-4 h-4 mr-2" />
              Get Started Free
            </Button>
            <Button
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-white/[0.03] bg-transparent"
            >
              <Github className="w-4 h-4 mr-2" />
              View on GitHub
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// MAIN SECTION COMPONENT
// ============================================================================

export function SelfHostedExpandableSection() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const sectionRef = useRef<HTMLDivElement>(null);

  const LAYOUT_ID = "dashboard-preview-card";

  // Check for mobile and URL state
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Check URL hash/query
    const hash = window.location.hash;
    const dashboardParam = searchParams.get("dashboard");
    if (hash === "#dashboard" || dashboardParam === "1") {
      setIsExpanded(true);
    }

    return () => window.removeEventListener("resize", checkMobile);
  }, [searchParams]);

  // Update URL when expanded state changes
  useEffect(() => {
    if (isExpanded) {
      window.history.replaceState(null, "", "#dashboard");
    } else {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }, [isExpanded]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isExpanded) {
        setIsExpanded(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isExpanded]);

  const handleOpen = () => {
    setIsExpanded(true);
    // Scroll to section on mobile
    if (isMobile && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleClose = () => {
    setIsExpanded(false);
  };

  return (
    <section
      ref={sectionRef}
      id="benefits"
      className="relative z-10 py-32"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass rounded-3xl p-8 md:p-12 lg:p-16 inner-glow relative overflow-hidden border border-white/[0.05]">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Badge
                variant="secondary"
                className="mb-4 bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
              >
                Why Clout?
              </Badge>
              <h2 className="text-3xl md:text-4xl font-semibold text-white mb-6">
                Self-hosted. <br />
                <span className="text-indigo-400">Full control.</span>
              </h2>
              <p className="text-zinc-400 mb-8 leading-relaxed">
                Unlike cloud-hosted bots, Clout runs on your own infrastructure.
                Your data stays yours. Customize everything. No monthly fees.
              </p>

              <div className="space-y-4">
                {BENEFITS.map((benefit, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                      <Check className="w-3 h-3 text-emerald-400" />
                    </div>
                    <span className="text-zinc-300">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right side - Preview or Expanded */}
            <div className="relative">
              <AnimatePresence mode="wait">
                {!isExpanded ? (
                  <DashboardPreviewCard
                    key="preview"
                    onClick={handleOpen}
                    layoutId={LAYOUT_ID}
                  />
                ) : isMobile ? (
                  // Mobile: Inline expansion
                  <motion.div
                    key="expanded-mobile"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <DashboardExpandedContent
                      onClose={handleClose}
                      layoutId={LAYOUT_ID}
                      isModal={false}
                    />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile: If expanded, the content is above. If not, we need a trigger */}
          {isMobile && !isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 text-center"
            >
              <Button
                onClick={handleOpen}
                variant="outline"
                className="border-zinc-700 text-zinc-300 hover:bg-white/[0.03] bg-transparent"
              >
                Explore Dashboard
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Desktop Modal */}
      <Dialog open={isExpanded && !isMobile} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent
          className="max-w-4xl p-0 bg-transparent border-0 overflow-visible [&>button]:hidden"
          onPointerDownOutside={handleClose}
        >
          <DialogTitle className="sr-only">Dashboard Deep Dive</DialogTitle>
          <DialogDescription className="sr-only">
            Explore the Clout dashboard features including moderation, economy, and community tools.
          </DialogDescription>
          <DashboardExpandedContent
            onClose={handleClose}
            layoutId={LAYOUT_ID}
            isModal={true}
          />
        </DialogContent>
      </Dialog>
    </section>
  );
}
