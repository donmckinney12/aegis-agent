import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { AgentStatus, AgentType, TrustLevel, EventSeverity } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getTrustLevelColor(level: TrustLevel): string {
  const colors: Record<TrustLevel, string> = {
    verified: "text-emerald-400",
    conditional: "text-amber-400",
    untrusted: "text-orange-400",
    revoked: "text-red-400",
  };
  return colors[level];
}

export function getTrustLevelBg(level: TrustLevel): string {
  const colors: Record<TrustLevel, string> = {
    verified: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
    conditional: "bg-amber-400/10 text-amber-400 border-amber-400/20",
    untrusted: "bg-orange-400/10 text-orange-400 border-orange-400/20",
    revoked: "bg-red-400/10 text-red-400 border-red-400/20",
  };
  return colors[level];
}

export function getStatusColor(status: AgentStatus): string {
  const colors: Record<AgentStatus, string> = {
    active: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
    inactive: "bg-zinc-400/10 text-zinc-400 border-zinc-400/20",
    suspended: "bg-red-400/10 text-red-400 border-red-400/20",
    provisioning: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  };
  return colors[status];
}

export function getAgentTypeIcon(type: AgentType): string {
  const icons: Record<AgentType, string> = {
    llm: "🧠",
    tool: "🔧",
    orchestrator: "🎯",
    retriever: "📚",
    executor: "⚡",
  };
  return icons[type];
}

export function getSeverityColor(severity: EventSeverity): string {
  const colors: Record<EventSeverity, string> = {
    info: "bg-blue-400/10 text-blue-400 border-blue-400/20",
    warning: "bg-amber-400/10 text-amber-400 border-amber-400/20",
    critical: "bg-red-400/10 text-red-400 border-red-400/20",
    success: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  };
  return colors[severity];
}

export function formatTimeAgo(dateStr: string): string {
  const now = new Date("2026-03-03T18:15:00Z");
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}
