import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { Code, Copy, ArrowRight, Globe, Shield, Key, Database, Activity, Server, Zap } from "lucide-react";

const endpoints = [
    {
        method: "GET",
        path: "/api/v1/agents",
        description: "List all registered agents with optional status and type filters.",
        params: "?status=active&type=executor",
        response: `{
  "data": [
    {
      "id": "ag_spiffe_001",
      "name": "FinBot-Refund",
      "spiffe_id": "spiffe://aegis.io/agent/executor/finbot-refund",
      "status": "active",
      "trust_level": "verified",
      "certificate_expiry": "2026-03-06T10:00:00Z"
    }
  ],
  "total": 42
}`,
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
    },
    {
        method: "POST",
        path: "/api/v1/agents",
        description: "Register a new agent and issue its first SPIFFE SVID.",
        params: "",
        response: `{
  "id": "ag_spiffe_043",
  "spiffe_id": "spiffe://aegis.io/agent/orchestrator/prime",
  "svid": {
    "certificate": "-----BEGIN CERTIFICATE-----\\nMIIB...",
    "serial": "AEG-2026-0043",
    "expires_at": "2026-03-06T10:00:00Z"
  }
}`,
        color: "text-cyan-400",
        bg: "bg-cyan-500/10",
    },
    {
        method: "POST",
        path: "/api/v1/policies/evaluate",
        description: "Evaluate a Rego policy against a given input. Returns allow/deny with reasons.",
        params: "",
        response: `{
  "allow": true,
  "reasons": ["Policy evaluation passed"],
  "elapsed": "0.4ms"
}`,
        color: "text-cyan-400",
        bg: "bg-cyan-500/10",
    },
    {
        method: "GET",
        path: "/api/v1/audit",
        description: "Retrieve audit events with severity and type filtering.",
        params: "?severity=critical&type=auth_failure",
        response: `{
  "data": [
    {
      "id": "evt_7291",
      "type": "certificate_issued",
      "severity": "info",
      "agent_id": "ag_spiffe_001",
      "details": "SVID issued for spiffe://aegis.io/agent/executor/finbot-refund",
      "timestamp": "2026-03-05T14:32:00Z"
    }
  ]
}`,
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
    },
    {
        method: "GET",
        path: "/api/v1/identity/trust-bundle",
        description: "Returns the root CA trust bundle for the configured SPIFFE trust domain.",
        params: "",
        response: `{
  "trust_domain": "aegis.io",
  "root_ca": "-----BEGIN CERTIFICATE-----\\nMIIB..."
}`,
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
    },
    {
        method: "DELETE",
        path: "/api/v1/agents/:id",
        description: "Deregister an agent and revoke its active certificates.",
        params: "",
        response: `{
  "message": "Agent deregistered and certificate revoked",
  "revoked_serial": "AEG-2026-0012"
}`,
        color: "text-red-400",
        bg: "bg-red-500/10",
    },
];

const methodColors: Record<string, string> = {
    GET: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    POST: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    PUT: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    DELETE: "text-red-400 bg-red-500/10 border-red-500/20",
};

export default function ApiReferencePage() {
    return (
        <div className="min-h-screen bg-background selection:bg-primary/30">
            <PublicNavbar />
            <main className="pt-32 pb-24 px-6 md:px-12 max-w-6xl mx-auto">
                {/* Hero */}
                <div className="mb-16">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                            <Code className="w-5 h-5 text-cyan-400" />
                        </div>
                        <span className="text-xs font-medium text-cyan-400 uppercase tracking-widest">REST API</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                        API <span className="aegis-gradient-text">Reference</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl">
                        Integrate Aegis into your CI/CD pipelines, microservices, and agent orchestrators through our RESTful endpoints.
                    </p>
                </div>

                {/* Base URL */}
                <div className="rounded-2xl border border-border/50 bg-card/30 p-6 mb-12">
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase mb-3">Base URL</h2>
                    <div className="flex items-center gap-3">
                        <code className="text-lg font-mono text-emerald-300/90 bg-[oklch(0.11_0.01_260)] px-4 py-2 rounded-lg border border-border/50 flex-1">
                            https://api.aegis-agent.com/api/v1
                        </code>
                    </div>
                    <div className="flex items-center gap-6 mt-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-emerald-400" /> TLS 1.3</span>
                        <span className="flex items-center gap-1.5"><Key className="w-3.5 h-3.5 text-amber-400" /> Bearer Token Auth</span>
                        <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-cyan-400" /> Sub-ms Latency</span>
                        <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-indigo-400" /> JSON Responses</span>
                    </div>
                </div>

                {/* Auth Section */}
                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 mb-12">
                    <h2 className="text-lg font-semibold mb-2 flex items-center gap-2 text-amber-400">
                        <Key className="w-5 h-5" />
                        Authentication
                    </h2>
                    <p className="text-sm text-muted-foreground mb-4">
                        All API requests require a Bearer token in the Authorization header. Generate API keys from the dashboard.
                    </p>
                    <div className="rounded-xl border border-border/50 overflow-hidden">
                        <div className="flex items-center gap-2 px-4 py-2 bg-muted/30 border-b border-border/50">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-400/60" />
                                <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
                                <div className="w-3 h-3 rounded-full bg-green-400/60" />
                            </div>
                            <span className="text-[10px] text-muted-foreground ml-2 font-mono">curl</span>
                        </div>
                        <pre className="text-xs font-mono bg-[oklch(0.11_0.01_260)] text-emerald-300/80 p-4 overflow-x-auto">
                            {`curl -H "Authorization: Bearer sk_live_aegis_8f92...3b1c" \\
     -H "Content-Type: application/json" \\
     https://api.aegis-agent.com/api/v1/agents`}
                        </pre>
                    </div>
                </div>

                {/* Endpoints */}
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                    <Server className="w-6 h-6 text-primary" />
                    Endpoints
                </h2>
                <div className="space-y-6 mb-16">
                    {endpoints.map((ep, i) => (
                        <div key={i} className="rounded-2xl border border-border/50 bg-card/30 overflow-hidden">
                            <div className="p-6">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded border w-fit ${methodColors[ep.method]}`}>
                                        {ep.method}
                                    </span>
                                    <code className="text-sm font-mono text-foreground">
                                        {ep.path}{ep.params && <span className="text-muted-foreground">{ep.params}</span>}
                                    </code>
                                </div>
                                <p className="text-sm text-muted-foreground">{ep.description}</p>
                            </div>
                            <div className="border-t border-border/50">
                                <div className="flex items-center gap-2 px-4 py-2 bg-muted/20">
                                    <span className="text-[10px] text-muted-foreground font-mono">Response 200</span>
                                </div>
                                <pre className="text-xs font-mono bg-[oklch(0.11_0.01_260)] text-emerald-300/70 p-4 overflow-x-auto">
                                    {ep.response}
                                </pre>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Rate Limits */}
                <div className="rounded-2xl border border-border/50 bg-card/30 p-6 mb-16">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-indigo-400" />
                        Rate Limits
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl bg-background/50 border border-border/50 text-center">
                            <p className="text-2xl font-bold text-foreground">1,000</p>
                            <p className="text-xs text-muted-foreground mt-1">requests/min (Developer)</p>
                        </div>
                        <div className="p-4 rounded-xl bg-background/50 border border-border/50 text-center">
                            <p className="text-2xl font-bold text-cyan-400">10,000</p>
                            <p className="text-xs text-muted-foreground mt-1">requests/min (Growth)</p>
                        </div>
                        <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-center">
                            <p className="text-2xl font-bold text-indigo-400">Unlimited</p>
                            <p className="text-xs text-muted-foreground mt-1">requests/min (Enterprise)</p>
                        </div>
                    </div>
                </div>
            </main>
            <PublicFooter />
        </div>
    );
}
