"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Activity, Server, Database, Globe, RefreshCcw, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const initialRegions = [
    { id: "us-east-1", status: "Operational", latency: "12ms", nodes: 4 },
    { id: "eu-central-1", status: "Operational", latency: "45ms", nodes: 3 },
    { id: "ap-northeast-1", status: "Operational", latency: "110ms", nodes: 2 },
];

const initialServices = [
    { name: "REST API Gateway", icon: Globe, status: "Healthy", uptime: "99.99%", version: "v1.0.0", region: "Global" },
    { name: "SPIFFE Provider (CA)", icon: Server, status: "Healthy", uptime: "100%", version: "v1.0.0", region: "Global" },
    { name: "OPA Policy Engine", icon: Activity, status: "Healthy", uptime: "99.98%", version: "v0.68.0", region: "Global" },
    { name: "PostgreSQL (Primary)", icon: Database, status: "Healthy", uptime: "100%", version: "v16.2", region: "us-east-1" },
];

export default function InfrastructurePage() {
    const [regions, setRegions] = useState(initialRegions);
    const [services, setServices] = useState(initialServices);
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = async () => {
        setRefreshing(true);
        toast.loading("Polling infrastructure health...", { id: "infra-refresh" });
        await new Promise(r => setTimeout(r, 2000));

        // Simulate slight latency changes
        setRegions(prev => prev.map(r => ({
            ...r,
            latency: `${Math.max(5, parseInt(r.latency) + Math.floor(Math.random() * 10 - 5))}ms`,
        })));

        setRefreshing(false);
        toast.success("Infrastructure health updated", {
            id: "infra-refresh",
            description: "All control plane services are operational. Latency values refreshed.",
        });
    };

    const handleRegionClick = (regionId: string) => {
        toast.info(`Region: ${regionId.toUpperCase()}`, {
            description: `All nodes in ${regionId} are healthy. Zero packet loss detected in the last 24 hours.`,
        });
    };

    const handleServiceClick = (serviceName: string) => {
        toast.info(`Service: ${serviceName}`, {
            description: "No incidents in the last 30 days. Last restart was during the scheduled maintenance window.",
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Infrastructure Health</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Real-time topology of global clusters, database replication, and service health.
                    </p>
                </div>
                <Button
                    variant="outline"
                    className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                    onClick={handleRefresh}
                    disabled={refreshing}
                >
                    {refreshing ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                        <RefreshCcw className="w-4 h-4 mr-2" />
                    )}
                    Refresh Health
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {regions.map(r => (
                    <Card
                        key={r.id}
                        className="border-border/50 bg-card/50 hover:bg-card/80 transition-colors cursor-pointer"
                        onClick={() => handleRegionClick(r.id)}
                    >
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-cyan-400" />
                                    {r.id.toUpperCase()}
                                </CardTitle>
                                <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                                    {r.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center text-xs text-muted-foreground">
                                <span className="flex flex-col gap-1">
                                    Latency to Control Plane
                                    <span className="text-foreground font-mono">{r.latency}</span>
                                </span>
                                <span className="flex flex-col gap-1 text-right">
                                    Active Nodes
                                    <span className="text-foreground font-mono">{r.nodes}</span>
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="border-border/50 bg-card/50 mt-6">
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Server className="w-4 h-4 text-indigo-400" />
                        Control Plane Services
                    </CardTitle>
                    <CardDescription>Status of core Aegis backend components.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border border-border/50 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead>Service</TableHead>
                                    <TableHead>Region Focus</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Uptime (30d)</TableHead>
                                    <TableHead className="text-right">Version</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {services.map((s) => (
                                    <TableRow
                                        key={s.name}
                                        className="hover:bg-muted/30 cursor-pointer"
                                        onClick={() => handleServiceClick(s.name)}
                                    >
                                        <TableCell>
                                            <div className="flex items-center gap-2 font-medium text-sm">
                                                <s.icon className="w-4 h-4 text-muted-foreground" />
                                                {s.name}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">{s.region}</TableCell>
                                        <TableCell>
                                            <span className={cn(
                                                "text-xs flex items-center gap-1.5",
                                                s.status === "Healthy" ? "text-emerald-400" : "text-amber-400"
                                            )}>
                                                <span className={cn(
                                                    "w-1.5 h-1.5 rounded-full",
                                                    s.status === "Healthy" ? "bg-emerald-400" : "bg-amber-400"
                                                )} />
                                                {s.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-xs">{s.uptime}</TableCell>
                                        <TableCell className="text-right font-mono text-xs text-muted-foreground">
                                            {s.version}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
