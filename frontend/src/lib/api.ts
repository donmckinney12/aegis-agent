import type {
    Agent,
    Policy,
    AuditEvent,
    TrustGraphNode,
    TrustGraphEdge,
    DashboardMetrics,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || `API error: ${res.status}`);
    }
    return res.json();
}

// Dashboard
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
    return fetchAPI<DashboardMetrics>("/api/v1/dashboard/metrics");
}

export async function getDashboardActivity(): Promise<
    { date: string; authentications: number; policyChecks: number; violations: number }[]
> {
    return fetchAPI("/api/v1/dashboard/activity");
}

// Agents
export async function listAgents(
    status?: string,
    type?: string
): Promise<Agent[]> {
    const params = new URLSearchParams();
    if (status && status !== "all") params.set("status", status);
    if (type && type !== "all") params.set("type", type);
    const query = params.toString() ? `?${params.toString()}` : "";
    return fetchAPI<Agent[]>(`/api/v1/agents${query}`);
}

export async function getAgent(id: string): Promise<Agent> {
    return fetchAPI<Agent>(`/api/v1/agents/${id}`);
}

export async function registerAgent(data: {
    name: string;
    type: string;
    description: string;
    owner: string;
    tags: string[];
}): Promise<Agent> {
    return fetchAPI<Agent>("/api/v1/agents", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

// Policies
export async function listPolicies(): Promise<Policy[]> {
    return fetchAPI<Policy[]>("/api/v1/policies");
}

export async function getPolicy(id: string): Promise<Policy> {
    return fetchAPI<Policy>(`/api/v1/policies/${id}`);
}

export async function evaluatePolicy(
    id: string,
    input: Record<string, unknown>
): Promise<{ allow: boolean; reasons: string[]; elapsed: string }> {
    return fetchAPI(`/api/v1/policies/${id}/evaluate`, {
        method: "POST",
        body: JSON.stringify({ policyId: id, input }),
    });
}

// Audit
export async function listAuditEvents(
    severity?: string,
    type?: string
): Promise<AuditEvent[]> {
    const params = new URLSearchParams();
    if (severity && severity !== "all") params.set("severity", severity);
    if (type && type !== "all") params.set("type", type);
    const query = params.toString() ? `?${params.toString()}` : "";
    return fetchAPI<AuditEvent[]>(`/api/v1/audit/events${query}`);
}

// Trust Graph
export async function getTrustGraphNodes(): Promise<TrustGraphNode[]> {
    return fetchAPI<TrustGraphNode[]>("/api/v1/trust-graph/nodes");
}

export async function getTrustGraphEdges(): Promise<TrustGraphEdge[]> {
    return fetchAPI<TrustGraphEdge[]>("/api/v1/trust-graph/edges");
}

// Identity
export async function issueSVID(data: {
    agentType: string;
    agentPath: string;
    ttlHours?: number;
}): Promise<{
    spiffeId: string;
    certificate: string;
    privateKey: string;
    expiresAt: string;
    serial: string;
}> {
    return fetchAPI("/api/v1/identity/issue-svid", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function getTrustBundle(): Promise<{
    trustDomain: string;
    rootCa: string;
}> {
    return fetchAPI("/api/v1/identity/trust-bundle");
}

// Health
export async function healthCheck(): Promise<{
    status: string;
    version: string;
    trustDomain: string;
}> {
    return fetchAPI("/api/v1/health");
}
