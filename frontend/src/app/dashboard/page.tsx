"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  Zap,
  AlertTriangle,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Activity,
  WifiOff,
  Hexagon
} from "lucide-react";
import { cn, getSeverityColor, formatTimeAgo } from "@/lib/utils";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import * as api from "@/lib/api";
import type { DashboardMetrics, AuditEvent } from "@/lib/types";
import {
  dashboardMetrics as fallbackMetrics,
  activityChartData as fallbackActivity,
  auditEvents as fallbackEvents,
} from "@/lib/mock-data";
import { motion, Variants } from "framer-motion";
import { useUser } from "@clerk/nextjs";

export default function DashboardPage() {
  const { user } = useUser();
  const [metrics, setMetrics] = useState<DashboardMetrics>(fallbackMetrics);
  const [activityData, setActivityData] = useState(fallbackActivity);
  const [events, setEvents] = useState<AuditEvent[]>(fallbackEvents);
  const [backendConnected, setBackendConnected] = useState<boolean | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [m, a, e] = await Promise.all([
          api.getDashboardMetrics(),
          api.getDashboardActivity(),
          api.listAuditEvents(),
        ]);
        setMetrics(m);
        setActivityData(a);
        setEvents(e);
        setBackendConnected(true);
      } catch {
        setBackendConnected(false);
      }
    }
    fetchData();
    const interval = setInterval(fetchData, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const isEnterprise = user?.publicMetadata?.tier === "enterprise" || user?.publicMetadata?.tier === "growth";

  const kpiCards = [
    {
      title: "Total Agents",
      value: metrics.totalAgents,
      change: metrics.agentsChange,
      icon: Bot,
      color: "from-indigo-500 to-indigo-600",
      glowColor: "rgba(99, 102, 241, 0.4)",
      bgGlow: "bg-indigo-500/10"
    },
    {
      title: "Active Sessions",
      value: metrics.activeSessions,
      change: metrics.sessionsChange,
      icon: Zap,
      color: "from-cyan-400 to-cyan-500",
      glowColor: "rgba(34, 211, 238, 0.4)",
      bgGlow: "bg-cyan-500/10"
    },
    {
      title: "Policy Violations",
      value: metrics.policyViolations,
      change: metrics.violationsChange,
      icon: AlertTriangle,
      color: "from-amber-400 to-orange-500",
      glowColor: "rgba(251, 191, 36, 0.4)",
      bgGlow: "bg-amber-500/10"
    },
    {
      title: "Trust Score",
      value: `${metrics.trustScore}%`,
      change: metrics.trustScoreChange,
      icon: ShieldCheck,
      color: "from-emerald-400 to-emerald-500",
      glowColor: "rgba(52, 211, 153, 0.4)",
      bgGlow: "bg-emerald-500/10"
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 relative"
    >
      {/* Ambient Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -mr-48 -mt-48" />

      {/* Page Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Governance Dashboard
          </h1>
          <p className="text-base text-muted-foreground mt-2 max-w-xl">
            Real-time overview of your AI agent network security posture and zero-trust policy evaluations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Subscription Tier Badge */}
          <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold shadow-lg backdrop-blur-md",
            isEnterprise ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/30 shadow-indigo-500/10" : "bg-muted/50 text-muted-foreground border-border/50"
          )}>
            <Hexagon className="w-4 h-4" />
            {user?.publicMetadata?.tier === "enterprise" ? "Enterprise" : user?.publicMetadata?.tier === "growth" ? "Growth" : "Developer Tier"}
          </div>

          {/* Backend Status */}
          {backendConnected !== null && (
            <div
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium shadow-lg backdrop-blur-md transition-colors",
                backendConnected
                  ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/30 shadow-emerald-400/10"
                  : "bg-amber-400/10 text-amber-400 border-amber-400/30 shadow-amber-400/10"
              )}
            >
              {backendConnected ? (
                <>
                  <div className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </div>
                  Live — Go Control Plane
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4" />
                  Mock Data
                </>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, idx) => (
          <motion.div
            key={kpi.title}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Card
              className="relative overflow-hidden border-border/50 bg-card/40 backdrop-blur-xl hover:bg-card/80 transition-all duration-500 shadow-2xl shadow-black/20 group"
            >
              {/* Inner ambient glow on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ boxShadow: `inset 0 0 60px ${kpi.glowColor}` }}
              />
              {/* Radial gradient background behind icon */}
              <div className={cn("absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-50 transition-opacity group-hover:opacity-100", kpi.bgGlow)} />

              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between mb-6">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300",
                      kpi.color
                    )}
                    style={{ boxShadow: `0 10px 20px -10px ${kpi.glowColor}` }}
                  >
                    <kpi.icon className="w-6 h-6 text-white" />
                  </div>
                  <div
                    className={cn(
                      "flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border shadow-inner",
                      kpi.change >= 0
                        ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                        : "text-red-400 bg-red-400/10 border-red-400/20"
                    )}
                  >
                    {kpi.change >= 0 ? (
                      <TrendingUp className="w-3.5 h-3.5" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5" />
                    )}
                    {Math.abs(kpi.change)}%
                  </div>
                </div>
                <p className="text-4xl font-extrabold tracking-tight tabular-nums">{kpi.value}</p>
                <p className="text-sm tracking-wide font-medium text-muted-foreground mt-2">{kpi.title}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts & Activity Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Chart */}
        <Card className="lg:col-span-2 border-border/50 bg-card/40 backdrop-blur-xl shadow-2xl shadow-black/20 overflow-hidden relative group">
          <div className="absolute top-0 left-1/2 w-[80%] h-1/2 bg-primary/5 rounded-[100%] blur-[80px] -translate-x-1/2 -mt-20 pointer-events-none transition-opacity group-hover:opacity-100 opacity-50" />
          <CardHeader className="pb-4 border-b border-border/10 relative">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
                  <Activity className="w-4 h-4" />
                </div>
                Network Throughput
              </CardTitle>
              <div className="flex items-center gap-5 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                  <span className="text-muted-foreground">Authentications</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                  <span className="text-muted-foreground">Policy Evaluans</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 relative">
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={activityData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="authGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="policyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="date" fontSize={12} stroke="rgba(255,255,255,0.3)" tickLine={false} axisLine={false} dy={10} />
                  <YAxis fontSize={12} stroke="rgba(255,255,255,0.3)" tickLine={false} axisLine={false} dx={-10} tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v)} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(10, 10, 15, 0.9)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "12px",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "#fff",
                      padding: "12px 16px"
                    }}
                    cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2, strokeDasharray: '4 4' }}
                  />
                  <Area type="monotone" dataKey="authentications" stroke="#6366f1" fill="url(#authGrad)" strokeWidth={3} activeDot={{ r: 6, strokeWidth: 0, fill: '#6366f1', style: { filter: 'drop-shadow(0 0 8px rgba(99,102,241,0.8))' } }} />
                  <Area type="monotone" dataKey="policyChecks" stroke="#22d3ee" fill="url(#policyGrad)" strokeWidth={3} activeDot={{ r: 6, strokeWidth: 0, fill: '#22d3ee', style: { filter: 'drop-shadow(0 0 8px rgba(34,211,238,0.8))' } }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Events */}
        <Card className="border-border/50 bg-card/40 backdrop-blur-xl shadow-2xl shadow-black/20 overflow-hidden flex flex-col">
          <CardHeader className="pb-4 border-b border-border/10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                Zero-Trust Audits
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 flex flex-col">
            <div className="divide-y divide-border/10 flex-1">
              {events.slice(0, 5).map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-4 p-5 hover:bg-muted/30 transition-colors group cursor-pointer"
                >
                  <div className="mt-1">
                    <div className={cn(
                      "w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]",
                      event.severity === "critical" ? "bg-red-500 text-red-500" :
                        event.severity === "warning" ? "bg-orange-500 text-orange-500" :
                          event.severity === "info" ? "bg-amber-400 text-amber-400" : "bg-emerald-400 text-emerald-400"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">{event.agentName}</p>
                      <span className="text-[11px] font-medium text-muted-foreground/80">{formatTimeAgo(event.timestamp)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/audit"
              className="bg-muted/20 hover:bg-muted/40 p-4 text-center text-sm font-semibold text-primary transition-colors border-t border-border/10 flex items-center justify-center gap-2 group mt-auto"
            >
              View Entire Security Log <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        <Link href="/agents">
          <div className="relative p-6 rounded-3xl border border-border/50 bg-card/40 backdrop-blur-xl hover:bg-card/80 transition-all duration-300 cursor-pointer group shadow-xl shadow-black/10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 opacity-50" />
            <div className="flex items-center gap-5 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]">
                <Bot className="w-7 h-7 text-indigo-400 group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="text-base font-bold text-foreground group-hover:text-indigo-400 transition-colors">Issue SVID Identity</p>
                <p className="text-xs font-medium text-muted-foreground mt-1">Register a new autonomous agent</p>
              </div>
            </div>
          </div>
        </Link>
        <Link href="/policies">
          <div className="relative p-6 rounded-3xl border border-border/50 bg-card/40 backdrop-blur-xl hover:bg-card/80 transition-all duration-300 cursor-pointer group shadow-xl shadow-black/10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 opacity-50" />
            <div className="flex items-center gap-5 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]">
                <ShieldCheck className="w-7 h-7 text-purple-400 group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="text-base font-bold text-foreground group-hover:text-purple-400 transition-colors">Enforce Rego Policy</p>
                <p className="text-xs font-medium text-muted-foreground mt-1">Define strict Zero-Trust rules</p>
              </div>
            </div>
          </div>
        </Link>
        <Link href="/trust-graph">
          <div className="relative p-6 rounded-3xl border border-border/50 bg-card/40 backdrop-blur-xl hover:bg-card/80 transition-all duration-300 cursor-pointer group shadow-xl shadow-black/10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 opacity-50" />
            <div className="flex items-center gap-5 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(34,211,238,0.5)]">
                <Activity className="w-7 h-7 text-cyan-400 group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="text-base font-bold text-foreground group-hover:text-cyan-400 transition-colors">Explore Trust Graph</p>
                <p className="text-xs font-medium text-muted-foreground mt-1">Visualize topological networking</p>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
