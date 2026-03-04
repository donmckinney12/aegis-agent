// ============================================================
// Aegis-Agent ID — Core Type Definitions
// ============================================================

export type AgentStatus = "active" | "inactive" | "suspended" | "provisioning";
export type TrustLevel = "verified" | "conditional" | "untrusted" | "revoked";
export type PolicyStatus = "active" | "draft" | "violated" | "archived";
export type EventSeverity = "info" | "warning" | "critical" | "success";
export type AgentType = "llm" | "tool" | "orchestrator" | "retriever" | "executor";

export interface Agent {
  id: string;
  name: string;
  spiffeId: string;
  type: AgentType;
  status: AgentStatus;
  trustLevel: TrustLevel;
  description: string;
  owner: string;
  lastActive: string;
  createdAt: string;
  certificateExpiry: string;
  policies: string[];
  tags: string[];
  metrics: {
    requestsToday: number;
    avgLatencyMs: number;
    errorRate: number;
  };
}

export interface Policy {
  id: string;
  name: string;
  description: string;
  status: PolicyStatus;
  regoCode: string;
  assignedAgents: number;
  lastModified: string;
  createdBy: string;
  violations: number;
  category: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  eventType: string;
  severity: EventSeverity;
  description: string;
  sourceIp: string;
  traceId: string;
  metadata: Record<string, string>;
}

export interface TrustGraphNode {
  id: string;
  agentName: string;
  spiffeId: string;
  type: AgentType;
  status: AgentStatus;
  trustLevel: TrustLevel;
}

export interface TrustGraphEdge {
  id: string;
  source: string;
  target: string;
  trustLevel: TrustLevel;
  protocol: string;
  requestsPerMin: number;
}

export interface DashboardMetrics {
  totalAgents: number;
  activeSessions: number;
  policyViolations: number;
  trustScore: number;
  agentsChange: number;
  sessionsChange: number;
  violationsChange: number;
  trustScoreChange: number;
}
