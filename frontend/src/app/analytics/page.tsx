"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, BarChart as RechartsBarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Activity, Zap, Server, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const latencyData = [
    { time: "00:00", p50: 12, p90: 25, p99: 85 },
    { time: "04:00", p50: 15, p90: 30, p99: 90 },
    { time: "08:00", p50: 25, p90: 55, p99: 140 },
    { time: "12:00", p50: 20, p90: 45, p99: 110 },
    { time: "16:00", p50: 18, p90: 35, p99: 95 },
    { time: "20:00", p50: 14, p90: 28, p99: 88 },
    { time: "24:00", p50: 12, p90: 24, p99: 82 },
];

const costData = [
    { agent: "GPT-Orchestrator", cost: 1250, calls: 45000 },
    { agent: "Claude-Reviewer", cost: 840, calls: 24000 },
    { agent: "Customer-Support", cost: 620, calls: 52000 },
    { agent: "FinBot-Refund", cost: 450, calls: 12000 },
    { agent: "RAG-Knowledge", cost: 210, calls: 18000 },
];

export default function AnalyticsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Analytics & Reports</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Deep dive into agent latency, API costs, and performance percentiles.
                    </p>
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
