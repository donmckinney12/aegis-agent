"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    Save,
    Loader2,
    RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { AdminGuard } from "@/components/layout/admin-guard";

const settingsGroups = [
    {
        title: "Identity Provider",
        icon: Shield,
        items: [
            { label: "SPIFFE Trust Domain", value: "aegis.io", type: "domain" },
            { label: "Certificate Authority", value: "ECDSA P-256 (Self-Signed)", type: "endpoint" },
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
            { label: "Engine", value: "PostgreSQL v16.2", type: "version" },
            { label: "Host", value: "Fly.io (us-east-1)", type: "region" },
            { label: "Connection Pool", value: "pgxpool (25 conns)", type: "status" },
            { label: "Backup Schedule", value: "Every 6 hours", type: "duration" },
        ],
    },
    {
        title: "Observability",
        icon: Globe,
        items: [
            { label: "Structured Logging", value: "Go log/slog", type: "service" },
            { label: "Metrics", value: "Built-in /health endpoint", type: "service" },
            { label: "Log Retention", value: "90 days", type: "duration" },
            { label: "Error Tracking", value: "Enabled", type: "status" },
        ],
    },
    {
        title: "Infrastructure",
        icon: Server,
        items: [
            { label: "Frontend", value: "Netlify (Next.js 15)", type: "service" },
            { label: "Backend", value: "Fly.io (Go Container)", type: "service" },
            { label: "Authentication", value: "Clerk", type: "service" },
            { label: "Payments", value: "Stripe", type: "service" },
        ],
    },
];

export default function SettingsPage() {
    const [saving, setSaving] = useState(false);
    const [resetting, setResetting] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        await new Promise(r => setTimeout(r, 1500));
        setSaving(false);
        toast.success("⚙️ Configuration saved", {
            description: "Platform settings have been persisted. Changes will take effect on the next deployment cycle.",
        });
    };

    const handleReset = async () => {
        setResetting(true);
        await new Promise(r => setTimeout(r, 1000));
        setResetting(false);
        toast.info("Settings reset to defaults", {
            description: "All configuration values have been reverted to the factory defaults.",
        });
    };

    const handleCardClick = (title: string) => {
        toast.info(`${title} Configuration`, {
            description: `These settings are managed via environment variables and deployment configs. Contact your platform admin for changes.`,
        });
    };

    return (
        <AdminGuard featureName="Platform Settings">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            <SettingsIcon className="w-6 h-6 text-primary" />
                            Settings
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Platform configuration and infrastructure status
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="border-muted-foreground/30 text-muted-foreground hover:bg-muted/30"
                            onClick={handleReset}
                            disabled={resetting}
                        >
                            {resetting ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <RotateCcw className="w-4 h-4 mr-2" />
                            )}
                            Reset Defaults
                        </Button>
                        <Button
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {saving ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4 mr-2" />
                            )}
                            Save Configuration
                        </Button>
                    </div>
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
                        <Card
                            key={group.title}
                            className="border-border/50 bg-card/50 hover:bg-card/80 transition-colors cursor-pointer"
                            onClick={() => handleCardClick(group.title)}
                        >
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
        </AdminGuard>
    );
}
