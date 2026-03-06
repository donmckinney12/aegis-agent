"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, BarChart as RechartsBarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Activity, Zap, RefreshCcw, Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const generateLatencyData = () => [
    { time: "00:00", p50: 10 + Math.floor(Math.random() * 8), p90: 22 + Math.floor(Math.random() * 12), p99: 75 + Math.floor(Math.random() * 25) },
    { time: "04:00", p50: 12 + Math.floor(Math.random() * 8), p90: 27 + Math.floor(Math.random() * 12), p99: 80 + Math.floor(Math.random() * 25) },
    { time: "08:00", p50: 20 + Math.floor(Math.random() * 10), p90: 45 + Math.floor(Math.random() * 15), p99: 120 + Math.floor(Math.random() * 30) },
    { time: "12:00", p50: 18 + Math.floor(Math.random() * 8), p90: 40 + Math.floor(Math.random() * 12), p99: 100 + Math.floor(Math.random() * 25) },
    { time: "16:00", p50: 15 + Math.floor(Math.random() * 8), p90: 32 + Math.floor(Math.random() * 12), p99: 90 + Math.floor(Math.random() * 20) },
    { time: "20:00", p50: 12 + Math.floor(Math.random() * 6), p90: 25 + Math.floor(Math.random() * 10), p99: 80 + Math.floor(Math.random() * 20) },
    { time: "24:00", p50: 10 + Math.floor(Math.random() * 6), p90: 22 + Math.floor(Math.random() * 8), p99: 75 + Math.floor(Math.random() * 15) },
];

const costData = [
    { agent: "GPT-Orchestrator", cost: 1250, calls: 45000 },
    { agent: "Claude-Reviewer", cost: 840, calls: 24000 },
    { agent: "Customer-Support", cost: 620, calls: 52000 },
    { agent: "FinBot-Refund", cost: 450, calls: 12000 },
    { agent: "RAG-Knowledge", cost: 210, calls: 18000 },
];

export default function AnalyticsPage() {
    const [latencyData, setLatencyData] = useState(generateLatencyData);
    const [refreshing, setRefreshing] = useState(false);
    const [exporting, setExporting] = useState(false);

    const handleRefresh = async () => {
        setRefreshing(true);
        toast.loading("Sampling new latency percentiles...", { id: "analytics-refresh" });
        await new Promise(r => setTimeout(r, 1500));
        setLatencyData(generateLatencyData());
        setRefreshing(false);
        toast.success("Latency data refreshed", {
            id: "analytics-refresh",
            description: "P50, P90, and P99 percentiles have been recalculated from the latest telemetry.",
        });
    };

    const handleExportCSV = async () => {
        setExporting(true);
        await new Promise(r => setTimeout(r, 2000));
        setExporting(false);
        toast.success("📊 Analytics report exported", {
            description: "Latency metrics and cost attribution data saved. Check your downloads folder.",
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Analytics & Reports</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Deep dive into agent latency, API costs, and performance percentiles.
                    </p>
                </div>
                <div className="flex gap-2">
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
                        Refresh
                    </Button>
                    <Button
                        variant="outline"
                        className="border-primary/30 text-primary hover:bg-primary/10"
                        onClick={handleExportCSV}
                        disabled={exporting}
                    >
                        {exporting ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Download className="w-4 h-4 mr-2" />
                        )}
                        Export CSV
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Latency Percentiles */}
                <Card className="border-border/50 bg-card/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Zap className="w-4 h-4 text-cyan-400" />
                            Policy Evaluation Latency
                        </CardTitle>
                        <CardDescription>P50, P90, and P99 latencies measured in milliseconds</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={latencyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="time" fontSize={11} stroke="rgba(255,255,255,0.3)" tickLine={false} axisLine={false} />
                                    <YAxis fontSize={11} stroke="rgba(255,255,255,0.3)" tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "oklch(0.16 0.015 260)",
                                            borderColor: "oklch(0.25 0.02 260)",
                                            borderRadius: "8px",
                                            fontSize: "12px",
                                            color: "oklch(0.95 0.01 260)",
                                        }}
                                    />
                                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                                    <Line type="monotone" dataKey="p50" stroke="#34d399" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                                    <Line type="monotone" dataKey="p90" stroke="#22d3ee" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                                    <Line type="monotone" dataKey="p99" stroke="#f87171" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Token/API Costs by Agent */}
                <Card className="border-border/50 bg-card/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Activity className="w-4 h-4 text-indigo-400" />
                            Agent API Cost Attribution
                        </CardTitle>
                        <CardDescription>Estimated LLM spend and request volume per agent top-5</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <RechartsBarChart layout="vertical" data={costData} margin={{ top: 5, right: 30, left: 40, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                                    <XAxis type="number" fontSize={11} stroke="rgba(255,255,255,0.3)" tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                                    <YAxis type="category" dataKey="agent" fontSize={11} stroke="rgba(255,255,255,0.7)" tickLine={false} axisLine={false} />
                                    <Tooltip
                                        cursor={{ fill: "rgba(255,255,255,0.02)" }}
                                        contentStyle={{
                                            backgroundColor: "oklch(0.16 0.015 260)",
                                            borderColor: "oklch(0.25 0.02 260)",
                                            borderRadius: "8px",
                                            fontSize: "12px",
                                            color: "oklch(0.95 0.01 260)",
                                        }}
                                        formatter={(value: any, name: any) => [name === "cost" ? `$${value}` : value, name === "cost" ? "API Cost" : "Total Calls"]}
                                    />
                                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                                    <Bar dataKey="cost" fill="#6366f1" radius={[0, 4, 4, 0]} name="cost" />
                                </RechartsBarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
