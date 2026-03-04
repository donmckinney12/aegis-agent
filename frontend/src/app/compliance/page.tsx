"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, ShieldCheck, FileDown, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { PremiumGuard } from "@/components/layout/premium-guard";

const frameworks = [
    { id: "soc2", name: "SOC 2 Type II", score: 94, status: "Passing", expected: "Q3 2026", icon: ShieldCheck, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { id: "iso", name: "ISO 27001", score: 88, status: "Needs Review", expected: "Q4 2026", icon: CheckCircle, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    { id: "hipaa", name: "HIPAA", score: 100, status: "Compliant", expected: "Current", icon: ShieldCheck, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
];

const failingControls = [
    { id: "CC6.1", framework: "SOC 2", desc: "Logical Access Security (Agent auto-rotation failed)", severity: "Medium" },
    { id: "A.9.2.2", framework: "ISO 27001", desc: "User Access Provisioning (Missing approval step)", severity: "Low" },
];

export default function CompliancePage() {
    return (
        <PremiumGuard featureName="Continuous Compliance">
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Compliance Posture</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Automated auditing and continuous compliance monitoring for AI agent workloads.
                        </p>
                    </div>
                    <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                        <FileDown className="w-4 h-4 mr-2" />
                        Export Auditor Report (PDF)
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {frameworks.map(fw => (
                        <Card key={fw.id} className={cn("border-border/50 bg-card/50 hover:bg-card/80 transition-colors cursor-pointer border-t-4", fw.border)}>
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <fw.icon className={cn("w-5 h-5", fw.color)} />
                                        {fw.name}
                                    </CardTitle>
                                    <div className={cn("w-12 h-12 rounded-full border-4 flex items-center justify-center font-bold text-sm", fw.border, fw.color)}>
                                        {fw.score}%
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between mt-2">
                                    <Badge variant="outline" className={cn("text-[10px]", fw.bg, fw.color, fw.border)}>
                                        {fw.status}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">Audit: {fw.expected}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card className="border-border/50 bg-card/50">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2 text-amber-400">
                            <AlertCircle className="w-4 h-4" />
                            Failing Controls Action Items
                        </CardTitle>
                        <CardDescription>Controls requiring manual intervention to achieve 100% compliance mapping.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {failingControls.map(fc => (
                                <div key={fc.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-xs font-bold text-muted-foreground">{fc.framework} {fc.id}</span>
                                            <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-400 border-amber-500/20">{fc.severity}</Badge>
                                        </div>
                                        <p className="text-sm">{fc.desc}</p>
                                    </div>
                                    <Button variant="outline" size="sm">Review Policy</Button>
                                </div>
                            ))}
                            {failingControls.length === 0 && (
                                <div className="p-8 text-center text-muted-foreground text-sm">
                                    <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-3 opacity-50" />
                                    No failing controls detected across your monitored frameworks.
                                </div>
                            )}
                        </div>

                    </CardContent>
                </Card>
            </div>
        </PremiumGuard>
    );
}
