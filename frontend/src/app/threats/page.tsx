"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crosshair, ShieldAlert, Bug, AlertTriangle, Loader2, CheckCircle } from "lucide-react";
import { cn, formatTimeAgo } from "@/lib/utils";
import { PremiumGuard } from "@/components/layout/premium-guard";
import { toast } from "sonner";

const initialIncidents = [
    { id: "INC-9942", title: "Anomalous Data Exfiltration Attempt", agent: "Customer-Support-Bot", severity: "Critical", status: "Blocked", time: "2026-03-03T12:00:00Z" },
    { id: "INC-9941", title: "Excessive Token Usage Spike", agent: "GPT-Orchestrator", severity: "High", status: "Investigating", time: "2026-03-03T10:15:00Z" },
    { id: "INC-9940", title: "SVID Rotation Failure", agent: "FinBot-Refund", severity: "Medium", status: "Resolved", time: "2026-03-02T18:30:00Z" },
];

const initialVulnerabilities = [
    { cve: "CVE-2025-4412", package: "langchain-core", version: "0.2.1", severity: "High", affectedAgents: 3, patched: false },
    { cve: "CVE-2026-1092", package: "openai-python", version: "1.12.0", severity: "Critical", affectedAgents: 1, patched: false },
    { cve: "CVE-2025-8834", package: "requests", version: "2.31.0", severity: "Medium", affectedAgents: 8, patched: false },
];

export default function ThreatsPage() {
    const [incidents, setIncidents] = useState(initialIncidents);
    const [vulnerabilities, setVulnerabilities] = useState(initialVulnerabilities);
    const [lockdownActive, setLockdownActive] = useState(false);
    const [lockdownLoading, setLockdownLoading] = useState(false);

    const handleLockdown = async () => {
        setLockdownLoading(true);
        await new Promise(r => setTimeout(r, 1500));
        setLockdownActive(!lockdownActive);
        setLockdownLoading(false);
        if (!lockdownActive) {
            toast.warning("🔒 Lockdown Mode Engaged", {
                description: "All agent communications are now restricted to verified-only traffic. External API calls suspended.",
            });
            setIncidents(prev => prev.map(inc =>
                inc.status === "Investigating" ? { ...inc, status: "Contained" } : inc
            ));
        } else {
            toast.success("🔓 Lockdown Mode Disengaged", {
                description: "Normal agent operations resumed. Monitoring elevated for 24 hours.",
            });
        }
    };

    const handlePatch = async (cve: string) => {
        toast.loading(`Patching ${cve}...`, { id: cve });
        await new Promise(r => setTimeout(r, 2000));
        setVulnerabilities(prev => prev.map(v =>
            v.cve === cve ? { ...v, patched: true } : v
        ));
        toast.success(`${cve} patched successfully`, {
            id: cve,
            description: "Affected agent containers will be rebuilt on next deployment cycle.",
        });
    };

    const handleResolveIncident = (id: string) => {
        setIncidents(prev => prev.map(inc =>
            inc.id === id ? { ...inc, status: "Resolved" } : inc
        ));
        toast.success(`${id} marked as resolved`, {
            description: "Incident has been closed and archived to the audit trail.",
        });
    };

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
                    <Button
                        variant="destructive"
                        className={cn(
                            "border transition-all",
                            lockdownActive
                                ? "bg-red-500/40 text-red-200 border-red-400/50 shadow-lg shadow-red-500/20"
                                : "bg-red-500/20 text-red-400 hover:bg-red-500/30 border-red-500/30"
                        )}
                        onClick={handleLockdown}
                        disabled={lockdownLoading}
                    >
                        {lockdownLoading ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <ShieldAlert className="w-4 h-4 mr-2" />
                        )}
                        {lockdownActive ? "Disengage Lockdown" : "Engage Lockdown Mode"}
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
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary" className={cn(
                                                "text-[10px] bg-muted/50",
                                                inc.status === "Resolved" && "bg-emerald-500/10 text-emerald-400",
                                                inc.status === "Contained" && "bg-amber-500/10 text-amber-400",
                                            )}>{inc.status}</Badge>
                                            {inc.status !== "Resolved" && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 text-[10px] px-2 text-emerald-400 hover:text-emerald-300"
                                                    onClick={() => handleResolveIncident(inc.id)}
                                                >
                                                    <CheckCircle className="w-3 h-3 mr-1" /> Resolve
                                                </Button>
                                            )}
                                        </div>
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
                                            vul.patched ? "bg-emerald-500/10 text-emerald-400" :
                                                vul.severity === "Critical" ? "bg-red-500/10 text-red-400" :
                                                    vul.severity === "High" ? "bg-orange-500/10 text-orange-400" : "bg-amber-500/10 text-amber-400"
                                        )}>
                                            {vul.patched ? "Patched" : vul.severity}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className="text-muted-foreground">Package:</span>
                                        <code className="bg-muted px-1 rounded">{vul.package}@{vul.version}</code>
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                                        <AlertTriangle className="w-3 h-3 text-amber-400" />
                                        Affects {vul.affectedAgents} running agents
                                        {!vul.patched && (
                                            <Button
                                                variant="link"
                                                className="text-xs h-auto p-0 ml-auto h-4"
                                                onClick={() => handlePatch(vul.cve)}
                                            >
                                                Patch Now
                                            </Button>
                                        )}
                                        {vul.patched && (
                                            <span className="ml-auto text-emerald-400 flex items-center gap-1">
                                                <CheckCircle className="w-3 h-3" /> Applied
                                            </span>
                                        )}
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
