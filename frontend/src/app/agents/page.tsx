"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Bot,
    Search,
    Filter,
    ExternalLink,
    Clock,
    Zap,
    AlertCircle,
} from "lucide-react";
import { agents } from "@/lib/mock-data";
import {
    cn,
    getStatusColor,
    getTrustLevelBg,
    getAgentTypeIcon,
    formatTimeAgo,
    formatNumber,
} from "@/lib/utils";
import Link from "next/link";
import type { AgentStatus, AgentType, TrustLevel } from "@/lib/types";

export default function AgentsPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [typeFilter, setTypeFilter] = useState<string>("all");

    const filtered = useMemo(() => {
        return agents.filter((agent) => {
            const matchesSearch =
                agent.name.toLowerCase().includes(search.toLowerCase()) ||
                agent.spiffeId.toLowerCase().includes(search.toLowerCase()) ||
                agent.owner.toLowerCase().includes(search.toLowerCase());
            const matchesStatus =
                statusFilter === "all" || agent.status === statusFilter;
            const matchesType = typeFilter === "all" || agent.type === typeFilter;
            return matchesSearch && matchesStatus && matchesType;
        });
    }, [search, statusFilter, typeFilter]);

    const stats = useMemo(
        () => ({
            total: agents.length,
            active: agents.filter((a) => a.status === "active").length,
            verified: agents.filter((a) => a.trustLevel === "verified").length,
            violations: agents.filter((a) => a.trustLevel === "revoked").length,
        }),
        []
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <Bot className="w-6 h-6 text-primary" />
                    Agent Registry
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Manage and monitor all registered AI agents with SPIFFE identities
                </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: "Total Agents", value: stats.total, color: "text-foreground" },
                    { label: "Active", value: stats.active, color: "text-emerald-400" },
                    { label: "Verified", value: stats.verified, color: "text-cyan-400" },
                    { label: "Revoked", value: stats.violations, color: "text-red-400" },
                ].map((s) => (
                    <Card key={s.label} className="border-border/50 bg-card/50">
                        <CardContent className="p-4">
                            <p className={cn("text-2xl font-bold", s.color)}>{s.value}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name, SPIFFE ID, or owner..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 bg-muted/50 border-border/50"
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[150px] bg-muted/50 border-border/50">
                        <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                        <SelectItem value="provisioning">Provisioning</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full sm:w-[150px] bg-muted/50 border-border/50">
                        <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                        <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="llm">LLM</SelectItem>
                        <SelectItem value="tool">Tool</SelectItem>
                        <SelectItem value="orchestrator">Orchestrator</SelectItem>
                        <SelectItem value="retriever">Retriever</SelectItem>
                        <SelectItem value="executor">Executor</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Agent Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((agent) => (
                    <Link key={agent.id} href={`/agents/${agent.id}`}>
                        <Card className="border-border/50 bg-card/50 hover:bg-card/80 transition-all duration-300 cursor-pointer group hover:aegis-border-glow h-full">
                            <CardContent className="p-5">
                                {/* Agent Header */}
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="text-2xl">{getAgentTypeIcon(agent.type)}</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
                                            {agent.name}
                                        </p>
                                        <p className="text-[11px] text-muted-foreground font-mono truncate mt-0.5">
                                            {agent.spiffeId}
                                        </p>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                                </div>

                                {/* Badges */}
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            "text-[10px] px-1.5 py-0 capitalize",
                                            getStatusColor(agent.status)
                                        )}
                                    >
                                        {agent.status}
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            "text-[10px] px-1.5 py-0 capitalize",
                                            getTrustLevelBg(agent.trustLevel)
                                        )}
                                    >
                                        {agent.trustLevel}
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        className="text-[10px] px-1.5 py-0 capitalize text-muted-foreground"
                                    >
                                        {agent.type}
                                    </Badge>
                                </div>

                                {/* Description */}
                                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                                    {agent.description}
                                </p>

                                {/* Metrics Row */}
                                <div className="flex items-center gap-4 text-[11px] text-muted-foreground pt-3 border-t border-border/50">
                                    <div className="flex items-center gap-1">
                                        <Zap className="w-3 h-3" />
                                        <span>{formatNumber(agent.metrics.requestsToday)} req</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        <span>{agent.metrics.avgLatencyMs}ms</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        <span>{(agent.metrics.errorRate * 100).toFixed(1)}%</span>
                                    </div>
                                    <div className="ml-auto text-[10px]">
                                        {formatTimeAgo(agent.lastActive)}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {filtered.length === 0 && (
                <Card className="border-border/50 bg-card/50">
                    <CardContent className="p-12 text-center">
                        <Bot className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">
                            No agents found matching your criteria
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
