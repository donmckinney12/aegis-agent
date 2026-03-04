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
    FileText,
    Search,
    Filter,
    Clock,
    MapPin,
    Link as LinkIcon,
    AlertTriangle,
    CheckCircle2,
    Info,
    AlertOctagon,
} from "lucide-react";
import { auditEvents } from "@/lib/mock-data";
import { cn, getSeverityColor, formatTimeAgo } from "@/lib/utils";

const severityIcons = {
    info: Info,
    warning: AlertTriangle,
    critical: AlertOctagon,
    success: CheckCircle2,
};

export default function AuditPage() {
    const [search, setSearch] = useState("");
    const [severityFilter, setSeverityFilter] = useState<string>("all");
    const [typeFilter, setTypeFilter] = useState<string>("all");

    const eventTypes = useMemo(
        () => [...new Set(auditEvents.map((e) => e.eventType))],
        []
    );

    const filtered = useMemo(() => {
        return auditEvents.filter((event) => {
            const matchesSearch =
                event.agentName.toLowerCase().includes(search.toLowerCase()) ||
                event.description.toLowerCase().includes(search.toLowerCase()) ||
                event.traceId.toLowerCase().includes(search.toLowerCase());
            const matchesSeverity =
                severityFilter === "all" || event.severity === severityFilter;
            const matchesType =
                typeFilter === "all" || event.eventType === typeFilter;
            return matchesSearch && matchesSeverity && matchesType;
        });
    }, [search, severityFilter, typeFilter]);

    const stats = useMemo(
        () => ({
            total: auditEvents.length,
            critical: auditEvents.filter((e) => e.severity === "critical").length,
            warnings: auditEvents.filter((e) => e.severity === "warning").length,
            success: auditEvents.filter((e) => e.severity === "success").length,
        }),
        []
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <FileText className="w-6 h-6 text-primary" />
                    Audit Trail
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    OpenTelemetry-powered event log with full trace correlation across agents
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: "Total Events", value: stats.total, color: "text-foreground" },
                    { label: "Critical", value: stats.critical, color: "text-red-400" },
                    { label: "Warnings", value: stats.warnings, color: "text-amber-400" },
                    { label: "Success", value: stats.success, color: "text-emerald-400" },
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
                        placeholder="Search events, agents, or trace IDs..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 bg-muted/50 border-border/50"
                    />
                </div>
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                    <SelectTrigger className="w-full sm:w-[150px] bg-muted/50 border-border/50">
                        <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                        <SelectValue placeholder="Severity" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Severity</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="success">Success</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full sm:w-[180px] bg-muted/50 border-border/50">
                        <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                        <SelectValue placeholder="Event Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {eventTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                                {type}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Event Timeline */}
            <div className="space-y-3">
                {filtered.map((event, idx) => {
                    const SeverityIcon =
                        severityIcons[event.severity as keyof typeof severityIcons] || Info;
                    return (
                        <Card
                            key={event.id}
                            className={cn(
                                "border-border/50 bg-card/50 hover:bg-card/80 transition-all duration-200",
                                event.severity === "critical" &&
                                "border-l-2 border-l-red-400/60",
                                event.severity === "warning" &&
                                "border-l-2 border-l-amber-400/60"
                            )}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start gap-4">
                                    {/* Timeline Indicator */}
                                    <div className="flex flex-col items-center pt-1">
                                        <div
                                            className={cn(
                                                "w-8 h-8 rounded-lg flex items-center justify-center",
                                                event.severity === "critical"
                                                    ? "bg-red-400/10"
                                                    : event.severity === "warning"
                                                        ? "bg-amber-400/10"
                                                        : event.severity === "success"
                                                            ? "bg-emerald-400/10"
                                                            : "bg-blue-400/10"
                                            )}
                                        >
                                            <SeverityIcon
                                                className={cn(
                                                    "w-4 h-4",
                                                    event.severity === "critical"
                                                        ? "text-red-400"
                                                        : event.severity === "warning"
                                                            ? "text-amber-400"
                                                            : event.severity === "success"
                                                                ? "text-emerald-400"
                                                                : "text-blue-400"
                                                )}
                                            />
                                        </div>
                                        {idx < filtered.length - 1 && (
                                            <div className="w-px h-full bg-border/30 mt-2 min-h-[20px]" />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    "text-[10px] px-1.5 py-0 capitalize",
                                                    getSeverityColor(event.severity)
                                                )}
                                            >
                                                {event.severity}
                                            </Badge>
                                            <span className="text-xs font-medium text-primary">
                                                {event.eventType}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground/60 ml-auto">
                                                {formatTimeAgo(event.timestamp)}
                                            </span>
                                        </div>

                                        <p className="text-sm font-medium mb-1">
                                            {event.agentName}
                                        </p>
                                        <p className="text-xs text-muted-foreground mb-3">
                                            {event.description}
                                        </p>

                                        {/* Metadata */}
                                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground/70">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                {event.sourceIp}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <LinkIcon className="w-3 h-3" />
                                                {event.traceId}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {new Date(event.timestamp).toLocaleTimeString()}
                                            </span>
                                        </div>

                                        {/* Metadata Tags */}
                                        {Object.keys(event.metadata).length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                {Object.entries(event.metadata).map(([key, value]) => (
                                                    <span
                                                        key={key}
                                                        className="px-2 py-0.5 rounded-md bg-muted/50 text-[10px] font-mono text-muted-foreground"
                                                    >
                                                        {key}={value}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {filtered.length === 0 && (
                <Card className="border-border/50 bg-card/50">
                    <CardContent className="p-12 text-center">
                        <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">
                            No events found matching your criteria
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
