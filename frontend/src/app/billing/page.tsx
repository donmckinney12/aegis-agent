"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, CheckCircle, TrendingUp, Download, Loader2 } from "lucide-react";

export default function BillingPage() {
    const [isLoading, setIsLoading] = useState(false);

    const handlePortalClick = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/billing/portal", { method: "POST" });
            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                console.error("Portal Error:", data.error);
            }
        } catch (error) {
            console.error("Failed to load portal", error);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Billing & Usage</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Subscription tiers, invoice history, and projected usage.
                    </p>
                </div>
                <Button
                    variant="outline"
                    className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10"
                    onClick={handlePortalClick}
                    disabled={isLoading}
                >
                    {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Manage via Stripe
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Tier Details */}
                <Card className="lg:col-span-2 border-border/50 bg-card/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
                    <CardHeader>
                        <CardTitle className="text-base flex items-center justify-between">
                            Current Plan
                            <Badge variant="outline" className="text-indigo-400 border-indigo-500/30 bg-indigo-500/10">
                                Enterprise "God Tier"
                            </Badge>
                        </CardTitle>
                        <CardDescription>Billed annually. Next invoice on March 3, 2027.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="text-4xl font-bold tracking-tight">$4,999<span className="text-sm text-muted-foreground font-normal">/mo</span></div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-medium">
                                <span>Monthly Agent Identity Quota</span>
                                <span>1.4M / 5M</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                                <div className="bg-indigo-500 h-full rounded-full w-[28%]" />
                            </div>
                            <p className="text-[10px] text-muted-foreground">Overage is billed at $0.005 per additional 1,000 agents requested.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Dedicated Support Engineer</div>
                            <div className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> 99.99% SLA</div>
                            <div className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Infinite Audit Retention</div>
                            <div className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Threat Intel Sync</div>
                        </div>

                        <Button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
                            Upgrade Limits
                        </Button>
                    </CardContent>
                </Card>

                {/* Invoice History */}
                <Card className="border-border/50 bg-card/50">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-cyan-400" />
                            Recent Invoices
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { id: "INV-2026-03", date: "Mar 3, 2026", amount: "$59,988.00", status: "Paid" },
                            { id: "INV-2025-03", date: "Mar 3, 2025", amount: "$24,000.00", status: "Paid" },
                            { id: "INV-2024-03", date: "Mar 3, 2024", amount: "$15,000.00", status: "Paid" },
                        ].map(inv => (
                            <div key={inv.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-background/50 hover:bg-muted/30 transition-colors">
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-xs font-semibold">{inv.amount}</span>
                                    <span className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                                        {inv.date} • <span className="text-emerald-400">{inv.status}</span>
                                    </span>
                                </div>
                                <Button variant="ghost" size="icon" className="w-6 h-6 text-muted-foreground hover:text-foreground">
                                    <Download className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
