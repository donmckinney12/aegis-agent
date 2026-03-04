"use client";

import { use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft,
    Shield,
    Clock,
    Zap,
    AlertCircle,
    Key,
    FileText,
    Network,
} from "lucide-react";
import { agents, policies, auditEvents } from "@/lib/mock-data";
import {
    cn,
    getStatusColor,
    getTrustLevelBg,
    getAgentTypeIcon,
    formatNumber,
    getSeverityColor,
    formatTimeAgo,
} from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function AgentDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const agent = agents.find((a) => a.id === id);
    if (!agent) return notFound();

    const agentPolicies = policies.filter((p) => agent.policies.includes(p.id));
    const agentEvents = auditEvents.filter((e) => e.agentId === agent.id);

    return (
        <div className="space-y-6">
            {/* Back Nav */}
            <Link href="/agents">
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-4 h-4" /> Back to Registry
                </Button>
            </Link>

            {/* Agent Header */}
            <div className="flex items-start gap-4">
                <div className="text-4xl">{getAgentTypeIcon(agent.type)}</div>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold tracking-tight">{agent.name}</h1>
                    <p className="text-sm text-muted-foreground font-mono mt-1">
                        {agent.spiffeId}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                        <Badge variant="outline" className={cn("capitalize", getStatusColor(agent.status))}>
                            {agent.status}
                        </Badge>
                        <Badge variant="outline" className={cn("capitalize", getTrustLevelBg(agent.trustLevel))}>
                            {agent.trustLevel}
                        </Badge>
                        {agent.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs text-muted-foreground">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Owner", value: agent.owner, icon: Shield },
                    { label: "Last Active", value: formatTimeAgo(agent.lastActive), icon: Clock },
                    { label: "Requests Today", value: formatNumber(agent.metrics.requestsToday), icon: Zap },
                    { label: "Error Rate", value: `${(agent.metrics.errorRate * 100).toFixed(2)}%`, icon: AlertCircle },
                ].map((item) => (
                    <Card key={item.label} className="border-border/50 bg-card/50">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center">
                                <item.icon className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">{item.label}</p>
                                <p className="text-sm font-semibold">{item.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Description */}
            <Card className="border-border/50 bg-card/50">
                <CardHeader>
                    <CardTitle className="text-sm font-semibold">Description</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground">{agent.description}</p>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Certificate Info */}
                <Card className="border-border/50 bg-card/50">
                    <CardHeader>
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <Key className="w-4 h-4 text-primary" />
                            Certificate
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-0">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">SPIFFE ID</span>
                            <span className="font-mono text-xs">{agent.spiffeId}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Created</span>
                            <span>{new Date(agent.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Certificate Expiry</span>
                            <span>{new Date(agent.certificateExpiry).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Avg Latency</span>
                            <span>{agent.metrics.avgLatencyMs}ms</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Assigned Policies */}
                <Card className="border-border/50 bg-card/50">
                    <CardHeader>
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary" />
                            Assigned Policies ({agentPolicies.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 pt-0">
                        {agentPolicies.length > 0 ? (
                            agentPolicies.map((pol) => (
                                <div
                                    key={pol.id}
                                    className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30 border border-border/30"
                                >
                                    <div>
                                        <p className="text-xs font-medium">{pol.name}</p>
                                        <p className="text-[10px] text-muted-foreground">{pol.category}</p>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            "text-[10px] capitalize",
                                            pol.status === "active"
                                                ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20"
                                                : "bg-zinc-400/10 text-zinc-400 border-zinc-400/20"
                                        )}
                                    >
                                        {pol.status}
                                    </Badge>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-muted-foreground text-center py-4">
                                No policies assigned
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <Card className="border-border/50 bg-card/50">
                <CardHeader>
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <Network className="w-4 h-4 text-primary" />
                        Recent Activity
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                    {agentEvents.length > 0 ? (
                        agentEvents.map((event) => (
                            <div
                                key={event.id}
                                className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/30"
                            >
                                <Badge
                                    variant="outline"
                                    className={cn("text-[10px] capitalize mt-0.5", getSeverityColor(event.severity))}
                                >
                                    {event.severity}
                                </Badge>
                                <div className="flex-1">
                                    <p className="text-xs font-medium">{event.eventType}</p>
                                    <p className="text-[11px] text-muted-foreground mt-0.5">
                                        {event.description}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground/60 mt-1">
                                        {formatTimeAgo(event.timestamp)} • Trace: {event.traceId}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-xs text-muted-foreground text-center py-4">
                            No recent activity
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
