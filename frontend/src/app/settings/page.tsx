"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Settings as SettingsIcon,
    Shield,
    Bell,
    Database,
    Key,
    Globe,
    Clock,
    Server,
} from "lucide-react";

const settingsGroups = [
    {
        title: "Identity Provider",
        icon: Shield,
        items: [
            { label: "SPIFFE Trust Domain", value: "aegis.io", type: "domain" },
            { label: "SPIRE Server", value: "spire-server.aegis.internal:8081", type: "endpoint" },
            { label: "Certificate TTL", value: "24 hours", type: "duration" },
            { label: "Auto-Rotation", value: "Enabled", type: "status" },
        ],
    },
    {
        title: "Policy Engine",
        icon: Key,
        items: [
            { label: "OPA Version", value: "v0.68.0", type: "version" },
            { label: "Rego Version", value: "v1", type: "version" },
            { label: "Decision Logging", value: "Enabled", type: "status" },
            { label: "Bundle Sync", value: "Every 30s", type: "duration" },
        ],
    },
    {
        title: "Database",
        icon: Database,
        items: [
            { label: "Engine", value: "SurrealDB v2.2", type: "version" },
            { label: "Region", value: "us-east-1 (Primary)", type: "region" },
            { label: "Replication", value: "3 replicas, sync", type: "status" },
            { label: "Backup Schedule", value: "Every 6 hours", type: "duration" },
        ],
    },
    {
        title: "Observability",
        icon: Globe,
        items: [
            { label: "Tracing Backend", value: "OpenTelemetry / Jaeger", type: "service" },
            { label: "Metrics", value: "Prometheus + Grafana", type: "service" },
            { label: "Log Retention", value: "90 days", type: "duration" },
            { label: "Sampling Rate", value: "100%", type: "percentage" },
        ],
    },
    {
        title: "Infrastructure",
        icon: Server,
        items: [
            { label: "Orchestration", value: "Kubernetes v1.31", type: "version" },
            { label: "Service Mesh", value: "Istio + Envoy", type: "service" },
            { label: "Secrets Manager", value: "HashiCorp Vault", type: "service" },
            { label: "Container Runtime", value: "containerd", type: "service" },
        ],
    },
];

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <SettingsIcon className="w-6 h-6 text-primary" />
                    Settings
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Platform configuration and infrastructure status
                </p>
            </div>

            {/* Platform Info */}
            <Card className="border-border/50 bg-card/50 aegis-gradient">
                <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center aegis-glow">
                            <Shield className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">Aegis Agent ID Platform</h2>
                            <p className="text-sm text-muted-foreground">
                                Zero-Trust Identity for AI Agents
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                                <Badge variant="outline" className="bg-emerald-400/10 text-emerald-400 border-emerald-400/20">
                                    v1.0.0
                                </Badge>
                                <Badge variant="outline" className="bg-cyan-400/10 text-cyan-400 border-cyan-400/20">
                                    Enterprise
                                </Badge>
                                <div className="flex items-center gap-1 text-xs text-emerald-400">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    All Systems Operational
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Settings Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {settingsGroups.map((group) => (
                    <Card key={group.title} className="border-border/50 bg-card/50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <group.icon className="w-4 h-4 text-primary" />
                                {group.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-0">
                            {group.items.map((item, idx) => (
                                <div key={item.label}>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground">
                                            {item.label}
                                        </span>
                                        <span className="text-xs font-medium font-mono">
                                            {item.value}
                                        </span>
                                    </div>
                                    {idx < group.items.length - 1 && (
                                        <Separator className="mt-3 bg-border/30" />
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
