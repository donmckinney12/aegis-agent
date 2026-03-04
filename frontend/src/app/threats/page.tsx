"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crosshair, ShieldAlert, Bug, Activity, AlertTriangle } from "lucide-react";
import { cn, formatTimeAgo } from "@/lib/utils";
import { PremiumGuard } from "@/components/layout/premium-guard";

const incidents = [
    { id: "INC-9942", title: "Anomalous Data Exfiltration Attempt", agent: "Customer-Support-Bot", severity: "Critical", status: "Blocked", time: "2026-03-03T12:00:00Z" },
    { id: "INC-9941", title: "Excessive Token Usage Spike", agent: "GPT-Orchestrator", severity: "High", status: "Investigating", time: "2026-03-03T10:15:00Z" },
    { id: "INC-9940", title: "SVID Rotation Failure", agent: "FinBot-Refund", severity: "Medium", status: "Resolved", time: "2026-03-02T18:30:00Z" },
];

const vulnerabilities = [
    { cve: "CVE-2025-4412", package: "langchain-core", version: "0.2.1", severity: "High", affectedAgents: 3 },
    { cve: "CVE-2026-1092", package: "openai-python", version: "1.12.0", severity: "Critical", affectedAgents: 1 },
    { cve: "CVE-2025-8834", package: "requests", version: "2.31.0", severity: "Medium", affectedAgents: 8 },
];

export default function ThreatsPage() {
    return (
        <PremiumGuard featureName="Threat Intelligence">
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Threat Intelligence</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Central command for AI behavioral anomalies and container vulnerabilities.
                        </p>
                    </div>
                    <Button variant="destructive" className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30">
                        <ShieldAlert className="w-4 h-4 mr-2" />
                        Engage Lockdown Mode
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Active Incidents */}
                    <Card className="border-border/50 bg-card/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base text-red-400">
                                <Crosshair className="w-4 h-4" />
                                Active Incidents (Behavioral)
                            </CardTitle>
                            <CardDescription>Anomalies detected by the Aegis ML pattern engine.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {incidents.map(inc => (
                                <div key={inc.id} className="p-3 rounded-lg border border-border/50 bg-background/50 flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-xs text-muted-foreground">{inc.id}</span>
                                            <Badge variant="outline" className={cn(
                                                "text-[10px]",
                                                inc.severity === "Critical" ? "bg-red-500/10 text-red-400" :
                                                    inc.severity === "High" ? "bg-orange-500/10 text-orange-400" : "bg-amber-500/10 text-amber-400"
                                            )}>
                                                {inc.severity}
                                            </Badge>
                                        </div>
                                        <span className="text-[10px] text-muted-foreground">{formatTimeAgo(inc.time)}</span>
                                    </div>
                                    <p className="text-sm font-semibold">{inc.title}</p>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-xs text-muted-foreground">Agent: <span className="text-foreground">{inc.agent}</span></span>
                                        <Badge variant="secondary" className="text-[10px] bg-muted/50">{inc.status}</Badge>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Vulnerability Scanner */}
                    <Card className="border-border/50 bg-card/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base text-orange-400">
                                <Bug className="w-4 h-4" />
                                Agent Container Vulnerabilities
                            </CardTitle>
                            <CardDescription>Known CVEs scanned from agent container images.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {vulnerabilities.map(vul => (
                                <div key={vul.cve} className="p-3 rounded-lg border border-border/50 bg-background/50 flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <span className="font-mono font-bold text-sm text-primary">{vul.cve}</span>
                                        <Badge variant="outline" className={cn(
                                            "text-[10px]",
                                            vul.severity === "Critical" ? "bg-red-500/10 text-red-400" :
                                                vul.severity === "High" ? "bg-orange-500/10 text-orange-400" : "bg-amber-500/10 text-amber-400"
                                        )}>
                                            {vul.severity}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className="text-muted-foreground">Package:</span>
                                        <code className="bg-muted px-1 rounded">{vul.package}@{vul.version}</code>
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                                        <AlertTriangle className="w-3 h-3 text-amber-400" />
                                        Affects {vul.affectedAgents} running agents
                                        <Button variant="link" className="text-xs h-auto p-0 ml-auto h-4">Patch Now</Button>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PremiumGuard>
    );
}
