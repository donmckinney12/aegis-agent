import {
    Agent,
    Policy,
    AuditEvent,
    TrustGraphNode,
    TrustGraphEdge,
    DashboardMetrics,
} from "./types";

// ============================================================
// Dashboard KPI Metrics
// ============================================================
export const dashboardMetrics: DashboardMetrics = {
    totalAgents: 147,
    activeSessions: 89,
    policyViolations: 3,
    trustScore: 97.2,
    agentsChange: 12.5,
    sessionsChange: -3.1,
    violationsChange: -40,
    trustScoreChange: 1.8,
};

// ============================================================
// Agent Registry
// ============================================================
export const agents: Agent[] = [
    {
        id: "agent-001",
        name: "GPT-Orchestrator-Prime",
        spiffeId: "spiffe://aegis.io/agent/orchestrator/prime",
        type: "orchestrator",
        status: "active",
        trustLevel: "verified",
        description: "Primary orchestration agent for multi-step workflow coordination across all business units.",
        owner: "Platform Team",
        lastActive: "2026-03-03T12:10:00Z",
        createdAt: "2025-11-15T09:00:00Z",
        certificateExpiry: "2026-03-04T12:00:00Z",
        policies: ["pol-001", "pol-002", "pol-005"],
        tags: ["production", "tier-1", "critical"],
        metrics: { requestsToday: 14523, avgLatencyMs: 2.3, errorRate: 0.001 },
    },
    {
        id: "agent-002",
        name: "FinBot-Refund-Handler",
        spiffeId: "spiffe://aegis.io/agent/executor/finbot-refund",
        type: "executor",
        status: "active",
        trustLevel: "verified",
        description: "Handles automated refund processing up to $500. Requires human approval for amounts above threshold.",
        owner: "Finance Ops",
        lastActive: "2026-03-03T12:08:32Z",
        createdAt: "2026-01-10T14:30:00Z",
        certificateExpiry: "2026-03-04T14:30:00Z",
        policies: ["pol-001", "pol-003"],
        tags: ["production", "pci-compliant", "finance"],
        metrics: { requestsToday: 892, avgLatencyMs: 45.2, errorRate: 0.003 },
    },
    {
        id: "agent-003",
        name: "RAG-Knowledge-Retriever",
        spiffeId: "spiffe://aegis.io/agent/retriever/rag-knowledge",
        type: "retriever",
        status: "active",
        trustLevel: "verified",
        description: "Retrieval-Augmented Generation agent that queries the enterprise knowledge base for context enrichment.",
        owner: "AI Platform",
        lastActive: "2026-03-03T12:12:05Z",
        createdAt: "2025-12-01T08:00:00Z",
        certificateExpiry: "2026-03-04T08:00:00Z",
        policies: ["pol-001", "pol-004"],
        tags: ["production", "data-access", "tier-2"],
        metrics: { requestsToday: 28451, avgLatencyMs: 8.7, errorRate: 0.0005 },
    },
    {
        id: "agent-004",
        name: "Claude-Code-Reviewer",
        spiffeId: "spiffe://aegis.io/agent/llm/claude-reviewer",
        type: "llm",
        status: "active",
        trustLevel: "conditional",
        description: "AI code review agent that analyzes PRs for security vulnerabilities, style issues, and performance.",
        owner: "Engineering",
        lastActive: "2026-03-03T11:55:00Z",
        createdAt: "2026-02-01T10:00:00Z",
        certificateExpiry: "2026-03-04T10:00:00Z",
        policies: ["pol-001", "pol-006"],
        tags: ["production", "code-access", "engineering"],
        metrics: { requestsToday: 342, avgLatencyMs: 1200, errorRate: 0.01 },
    },
    {
        id: "agent-005",
        name: "Sentinel-Threat-Monitor",
        spiffeId: "spiffe://aegis.io/agent/tool/sentinel-threat",
        type: "tool",
        status: "active",
        trustLevel: "verified",
        description: "Continuous threat monitoring agent that scans network traffic and agent communications for anomalies.",
        owner: "Security Team",
        lastActive: "2026-03-03T12:14:59Z",
        createdAt: "2025-10-01T00:00:00Z",
        certificateExpiry: "2026-03-04T00:00:00Z",
        policies: ["pol-001", "pol-002", "pol-007"],
        tags: ["production", "security", "tier-1", "critical"],
        metrics: { requestsToday: 98234, avgLatencyMs: 0.4, errorRate: 0.0001 },
    },
    {
        id: "agent-006",
        name: "DataPipeline-ETL-Runner",
        spiffeId: "spiffe://aegis.io/agent/executor/etl-runner",
        type: "executor",
        status: "inactive",
        trustLevel: "verified",
        description: "Scheduled ETL pipeline executor for nightly data warehouse updates and transformation jobs.",
        owner: "Data Engineering",
        lastActive: "2026-03-03T06:00:00Z",
        createdAt: "2025-09-15T12:00:00Z",
        certificateExpiry: "2026-03-04T12:00:00Z",
        policies: ["pol-001", "pol-008"],
        tags: ["production", "batch", "data"],
        metrics: { requestsToday: 0, avgLatencyMs: 3200, errorRate: 0.005 },
    },
    {
        id: "agent-007",
        name: "Customer-Support-Bot",
        spiffeId: "spiffe://aegis.io/agent/llm/support-bot",
        type: "llm",
        status: "active",
        trustLevel: "verified",
        description: "Customer-facing support agent handling tier-1 inquiries, ticket routing, and FAQ responses.",
        owner: "Customer Success",
        lastActive: "2026-03-03T12:13:45Z",
        createdAt: "2026-01-20T09:00:00Z",
        certificateExpiry: "2026-03-04T09:00:00Z",
        policies: ["pol-001", "pol-009"],
        tags: ["production", "customer-facing", "pii-access"],
        metrics: { requestsToday: 5621, avgLatencyMs: 850, errorRate: 0.002 },
    },
    {
        id: "agent-008",
        name: "Compliance-Auditor-v2",
        spiffeId: "spiffe://aegis.io/agent/tool/compliance-auditor",
        type: "tool",
        status: "provisioning",
        trustLevel: "untrusted",
        description: "Next-generation compliance auditing agent currently in provisioning. Pending security review.",
        owner: "Legal & Compliance",
        lastActive: "2026-03-03T10:00:00Z",
        createdAt: "2026-03-01T15:00:00Z",
        certificateExpiry: "2026-03-02T15:00:00Z",
        policies: [],
        tags: ["staging", "compliance", "pending-review"],
        metrics: { requestsToday: 12, avgLatencyMs: 150, errorRate: 0.1 },
    },
    {
        id: "agent-009",
        name: "Legacy-Inventory-Sync",
        spiffeId: "spiffe://aegis.io/agent/executor/inventory-sync",
        type: "executor",
        status: "suspended",
        trustLevel: "revoked",
        description: "SUSPENDED: Certificate revoked due to policy violation. Attempted unauthorized access to PII database.",
        owner: "Supply Chain",
        lastActive: "2026-02-28T14:00:00Z",
        createdAt: "2025-08-10T11:00:00Z",
        certificateExpiry: "2026-02-28T14:00:00Z",
        policies: ["pol-001"],
        tags: ["suspended", "investigation", "legacy"],
        metrics: { requestsToday: 0, avgLatencyMs: 0, errorRate: 0 },
    },
    {
        id: "agent-010",
        name: "Gemini-Research-Analyst",
        spiffeId: "spiffe://aegis.io/agent/llm/gemini-research",
        type: "llm",
        status: "active",
        trustLevel: "verified",
        description: "Research analysis agent that synthesizes market data, competitive intelligence, and trend reports.",
        owner: "Strategy",
        lastActive: "2026-03-03T12:05:00Z",
        createdAt: "2026-02-15T08:00:00Z",
        certificateExpiry: "2026-03-04T08:00:00Z",
        policies: ["pol-001", "pol-004", "pol-010"],
        tags: ["production", "data-access", "research"],
        metrics: { requestsToday: 156, avgLatencyMs: 2100, errorRate: 0.008 },
    },
];

// ============================================================
// OPA/Rego Policies
// ============================================================
export const policies: Policy[] = [
    {
        id: "pol-001",
        name: "Global Identity Verification",
        description: "All agents must present a valid SPIFFE SVID before any API call. Certificates must not be expired.",
        status: "active",
        regoCode: `package aegis.identity

import rego.v1

default allow := false

allow if {
    input.svid.spiffe_id != ""
    valid_certificate
    not revoked
}

valid_certificate if {
    time.now_ns() < input.svid.expires_at
}

revoked if {
    input.svid.serial in data.revocation_list
}`,
        assignedAgents: 147,
        lastModified: "2026-02-28T10:00:00Z",
        createdBy: "Security Team",
        violations: 0,
        category: "Identity",
    },
    {
        id: "pol-002",
        name: "Cross-Domain Communication",
        description: "Restrict agent communication to authorized trust domains only. Orchestrators can communicate across domains.",
        status: "active",
        regoCode: `package aegis.cross_domain

import rego.v1

default allow := false

allow if {
    same_domain
}

allow if {
    input.source.type == "orchestrator"
    target_domain_authorized
}

same_domain if {
    input.source.trust_domain == input.target.trust_domain
}

target_domain_authorized if {
    input.target.trust_domain in data.authorized_domains[input.source.id]
}`,
        assignedAgents: 12,
        lastModified: "2026-03-01T14:00:00Z",
        createdBy: "Platform Team",
        violations: 0,
        category: "Communication",
    },
    {
        id: "pol-003",
        name: "Financial Transaction Limits",
        description: "Executor agents handling financial operations are limited to $500 per transaction, $5000 daily.",
        status: "active",
        regoCode: `package aegis.finance

import rego.v1

default allow := false

allow if {
    input.action == "refund"
    input.amount <= 500
    daily_total_ok
}

daily_total_ok if {
    data.daily_totals[input.agent_id] + input.amount <= 5000
}

deny[msg] if {
    input.amount > 500
    msg := sprintf("Transaction amount $%v exceeds $500 limit", [input.amount])
}`,
        assignedAgents: 3,
        lastModified: "2026-02-20T09:00:00Z",
        createdBy: "Finance Ops",
        violations: 1,
        category: "Financial",
    },
    {
        id: "pol-004",
        name: "Data Access Classification",
        description: "Agents can only access data at or below their clearance level. PII requires explicit authorization.",
        status: "active",
        regoCode: `package aegis.data_access

import rego.v1

default allow := false

clearance_levels := {
    "public": 0,
    "internal": 1,
    "confidential": 2,
    "restricted": 3
}

allow if {
    agent_level := clearance_levels[input.agent.clearance]
    data_level := clearance_levels[input.resource.classification]
    agent_level >= data_level
    not pii_without_auth
}

pii_without_auth if {
    input.resource.contains_pii
    not input.agent.pii_authorized
}`,
        assignedAgents: 18,
        lastModified: "2026-03-02T16:00:00Z",
        createdBy: "Data Governance",
        violations: 2,
        category: "Data Access",
    },
    {
        id: "pol-005",
        name: "Rate Limiting & Throttling",
        description: "Enforce per-agent rate limits to prevent resource exhaustion and cascading failures.",
        status: "active",
        regoCode: `package aegis.rate_limit

import rego.v1

default allow := false

allow if {
    under_rate_limit
    under_burst_limit
}

under_rate_limit if {
    limit := data.rate_limits[input.agent.type]
    input.requests_per_minute <= limit.rpm
}

under_burst_limit if {
    limit := data.rate_limits[input.agent.type]
    input.burst_count <= limit.max_burst
}`,
        assignedAgents: 147,
        lastModified: "2026-02-15T11:00:00Z",
        createdBy: "Platform Team",
        violations: 0,
        category: "Performance",
    },
    {
        id: "pol-006",
        name: "Code Repository Access",
        description: "LLM agents reviewing code may only access repositories they are explicitly assigned to.",
        status: "draft",
        regoCode: `package aegis.code_access

import rego.v1

default allow := false

allow if {
    input.action in ["read", "review", "comment"]
    repo_authorized
}

repo_authorized if {
    input.repository in data.agent_repos[input.agent_id]
}

deny[msg] if {
    input.action in ["write", "merge", "delete"]
    msg := "LLM agents cannot perform write operations on repositories"
}`,
        assignedAgents: 2,
        lastModified: "2026-03-03T08:00:00Z",
        createdBy: "Engineering",
        violations: 0,
        category: "Code Access",
    },
];

// ============================================================
// Audit Trail Events
// ============================================================
export const auditEvents: AuditEvent[] = [
    {
        id: "evt-001",
        timestamp: "2026-03-03T12:14:59Z",
        agentId: "agent-005",
        agentName: "Sentinel-Threat-Monitor",
        eventType: "threat.detected",
        severity: "critical",
        description: "Anomalous traffic pattern detected from agent-009. Possible credential stuffing attempt blocked.",
        sourceIp: "10.0.42.15",
        traceId: "trace-7f3a2b1c",
        metadata: { threat_type: "credential_stuffing", blocked: "true", source_agent: "agent-009" },
    },
    {
        id: "evt-002",
        timestamp: "2026-03-03T12:13:45Z",
        agentId: "agent-007",
        agentName: "Customer-Support-Bot",
        eventType: "auth.success",
        severity: "info",
        description: "Certificate renewed and SVID rotated successfully. New expiry: 2026-03-04T09:00:00Z.",
        sourceIp: "10.0.12.88",
        traceId: "trace-4e8d9c2f",
        metadata: { cert_serial: "AEG-2026-0307-CSUP", ttl: "24h" },
    },
    {
        id: "evt-003",
        timestamp: "2026-03-03T12:12:05Z",
        agentId: "agent-003",
        agentName: "RAG-Knowledge-Retriever",
        eventType: "data.access",
        severity: "info",
        description: "Accessed knowledge base index 'enterprise-docs-v3'. 847 document chunks retrieved.",
        sourceIp: "10.0.8.201",
        traceId: "trace-1a5f7e3d",
        metadata: { index: "enterprise-docs-v3", chunks: "847", latency_ms: "8.2" },
    },
    {
        id: "evt-004",
        timestamp: "2026-03-03T12:10:00Z",
        agentId: "agent-001",
        agentName: "GPT-Orchestrator-Prime",
        eventType: "workflow.initiated",
        severity: "info",
        description: "Multi-agent workflow 'quarterly-report-gen' initiated. Coordinating 4 sub-agents.",
        sourceIp: "10.0.1.10",
        traceId: "trace-9b2c4d6e",
        metadata: { workflow: "quarterly-report-gen", sub_agents: "4", estimated_duration: "120s" },
    },
    {
        id: "evt-005",
        timestamp: "2026-03-03T12:08:32Z",
        agentId: "agent-002",
        agentName: "FinBot-Refund-Handler",
        eventType: "policy.violation",
        severity: "warning",
        description: "Attempted refund of $750 exceeds $500 policy limit. Transaction blocked. Escalated to human review.",
        sourceIp: "10.0.22.44",
        traceId: "trace-5f1a8c3b",
        metadata: { amount: "$750", limit: "$500", policy: "pol-003", escalated_to: "finance-manager@aegis.io" },
    },
    {
        id: "evt-006",
        timestamp: "2026-03-03T12:05:00Z",
        agentId: "agent-010",
        agentName: "Gemini-Research-Analyst",
        eventType: "api.call",
        severity: "info",
        description: "External API call to market-data-provider. Response received in 1.8s. Rate limit: 45/100 remaining.",
        sourceIp: "10.0.30.77",
        traceId: "trace-2d7e9f4a",
        metadata: { api: "market-data-provider", status: "200", rate_remaining: "45" },
    },
    {
        id: "evt-007",
        timestamp: "2026-03-03T11:55:00Z",
        agentId: "agent-004",
        agentName: "Claude-Code-Reviewer",
        eventType: "code.review",
        severity: "success",
        description: "Completed code review for PR #4821. Found 2 security issues (SQL injection, XSS). PR flagged for revision.",
        sourceIp: "10.0.15.33",
        traceId: "trace-8c3b1d5e",
        metadata: { pr: "#4821", issues_found: "2", severity: "high", repo: "aegis-core" },
    },
    {
        id: "evt-008",
        timestamp: "2026-03-03T11:45:00Z",
        agentId: "agent-009",
        agentName: "Legacy-Inventory-Sync",
        eventType: "auth.revoked",
        severity: "critical",
        description: "Certificate revoked by Security Team. Agent suspended pending investigation of unauthorized PII access attempt.",
        sourceIp: "10.0.50.12",
        traceId: "trace-6a9d2c7f",
        metadata: { reason: "unauthorized_pii_access", revoked_by: "security-admin", investigation: "INC-2026-0303" },
    },
    {
        id: "evt-009",
        timestamp: "2026-03-03T11:30:00Z",
        agentId: "agent-008",
        agentName: "Compliance-Auditor-v2",
        eventType: "provision.started",
        severity: "info",
        description: "Agent provisioning initiated. Awaiting security review and SPIFFE ID assignment.",
        sourceIp: "10.0.5.100",
        traceId: "trace-3f8a1b4c",
        metadata: { stage: "security_review", estimated_completion: "2026-03-04T15:00:00Z" },
    },
    {
        id: "evt-010",
        timestamp: "2026-03-03T11:00:00Z",
        agentId: "agent-001",
        agentName: "GPT-Orchestrator-Prime",
        eventType: "trust.verified",
        severity: "success",
        description: "Trust verification completed for cross-domain communication with partner-domain.io. Mutual TLS established.",
        sourceIp: "10.0.1.10",
        traceId: "trace-7d4e2a9b",
        metadata: { remote_domain: "partner-domain.io", protocol: "mTLS", verification: "mutual" },
    },
];

// ============================================================
// Trust Graph Topology
// ============================================================
export const trustGraphNodes: TrustGraphNode[] = [
    { id: "agent-001", agentName: "GPT-Orchestrator-Prime", spiffeId: "spiffe://aegis.io/agent/orchestrator/prime", type: "orchestrator", status: "active", trustLevel: "verified" },
    { id: "agent-002", agentName: "FinBot-Refund-Handler", spiffeId: "spiffe://aegis.io/agent/executor/finbot-refund", type: "executor", status: "active", trustLevel: "verified" },
    { id: "agent-003", agentName: "RAG-Knowledge-Retriever", spiffeId: "spiffe://aegis.io/agent/retriever/rag-knowledge", type: "retriever", status: "active", trustLevel: "verified" },
    { id: "agent-004", agentName: "Claude-Code-Reviewer", spiffeId: "spiffe://aegis.io/agent/llm/claude-reviewer", type: "llm", status: "active", trustLevel: "conditional" },
    { id: "agent-005", agentName: "Sentinel-Threat-Monitor", spiffeId: "spiffe://aegis.io/agent/tool/sentinel-threat", type: "tool", status: "active", trustLevel: "verified" },
    { id: "agent-006", agentName: "DataPipeline-ETL-Runner", spiffeId: "spiffe://aegis.io/agent/executor/etl-runner", type: "executor", status: "inactive", trustLevel: "verified" },
    { id: "agent-007", agentName: "Customer-Support-Bot", spiffeId: "spiffe://aegis.io/agent/llm/support-bot", type: "llm", status: "active", trustLevel: "verified" },
    { id: "agent-008", agentName: "Compliance-Auditor-v2", spiffeId: "spiffe://aegis.io/agent/tool/compliance-auditor", type: "tool", status: "provisioning", trustLevel: "untrusted" },
    { id: "agent-009", agentName: "Legacy-Inventory-Sync", spiffeId: "spiffe://aegis.io/agent/executor/inventory-sync", type: "executor", status: "suspended", trustLevel: "revoked" },
    { id: "agent-010", agentName: "Gemini-Research-Analyst", spiffeId: "spiffe://aegis.io/agent/llm/gemini-research", type: "llm", status: "active", trustLevel: "verified" },
];

export const trustGraphEdges: TrustGraphEdge[] = [
    { id: "edge-1", source: "agent-001", target: "agent-002", trustLevel: "verified", protocol: "gRPC/mTLS", requestsPerMin: 45 },
    { id: "edge-2", source: "agent-001", target: "agent-003", trustLevel: "verified", protocol: "gRPC/mTLS", requestsPerMin: 120 },
    { id: "edge-3", source: "agent-001", target: "agent-004", trustLevel: "conditional", protocol: "gRPC/mTLS", requestsPerMin: 8 },
    { id: "edge-4", source: "agent-001", target: "agent-005", trustLevel: "verified", protocol: "gRPC/mTLS", requestsPerMin: 200 },
    { id: "edge-5", source: "agent-001", target: "agent-007", trustLevel: "verified", protocol: "gRPC/mTLS", requestsPerMin: 35 },
    { id: "edge-6", source: "agent-001", target: "agent-010", trustLevel: "verified", protocol: "gRPC/mTLS", requestsPerMin: 12 },
    { id: "edge-7", source: "agent-003", target: "agent-010", trustLevel: "verified", protocol: "REST/TLS", requestsPerMin: 25 },
    { id: "edge-8", source: "agent-005", target: "agent-001", trustLevel: "verified", protocol: "gRPC/mTLS", requestsPerMin: 300 },
    { id: "edge-9", source: "agent-005", target: "agent-009", trustLevel: "revoked", protocol: "BLOCKED", requestsPerMin: 0 },
    { id: "edge-10", source: "agent-007", target: "agent-003", trustLevel: "verified", protocol: "gRPC/mTLS", requestsPerMin: 55 },
    { id: "edge-11", source: "agent-002", target: "agent-001", trustLevel: "verified", protocol: "gRPC/mTLS", requestsPerMin: 10 },
    { id: "edge-12", source: "agent-004", target: "agent-003", trustLevel: "conditional", protocol: "REST/TLS", requestsPerMin: 5 },
];

// ============================================================
// Activity Chart Data (last 7 days)
// ============================================================
export const activityChartData = [
    { date: "Feb 25", authentications: 12400, policyChecks: 34200, violations: 2 },
    { date: "Feb 26", authentications: 13100, policyChecks: 36800, violations: 5 },
    { date: "Feb 27", authentications: 11800, policyChecks: 33100, violations: 1 },
    { date: "Feb 28", authentications: 14200, policyChecks: 39500, violations: 8 },
    { date: "Mar 01", authentications: 15600, policyChecks: 42100, violations: 3 },
    { date: "Mar 02", authentications: 14800, policyChecks: 40200, violations: 2 },
    { date: "Mar 03", authentications: 13500, policyChecks: 37800, violations: 3 },
];
