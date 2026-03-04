"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Shield,
    Code,
    Play,
    FileText,
    Bot,
    AlertTriangle,
    CheckCircle2,
} from "lucide-react";
import { policies } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { Policy } from "@/lib/types";

export default function PoliciesPage() {
    const [selectedPolicy, setSelectedPolicy] = useState<Policy>(policies[0]);
    const [editedCode, setEditedCode] = useState(policies[0].regoCode);
    const [testOutput, setTestOutput] = useState<string | null>(null);

    const handleSelectPolicy = (policy: Policy) => {
        setSelectedPolicy(policy);
        setEditedCode(policy.regoCode);
        setTestOutput(null);
    };

    const handleSimulate = () => {
        setTestOutput(
            `✓ Policy "${selectedPolicy.name}" evaluated successfully.\n\n` +
            `Input:\n  agent_id: "agent-002"\n  action: "refund"\n  amount: 250\n\n` +
            `Result: ALLOW\n  - Identity verified ✓\n  - Certificate valid ✓\n  - Amount within limits ✓\n  - Daily total OK ✓\n\n` +
            `Evaluation time: 0.8ms\nRego version: v0.68.0`
        );
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "active":
                return "bg-emerald-400/10 text-emerald-400 border-emerald-400/20";
            case "draft":
                return "bg-blue-400/10 text-blue-400 border-blue-400/20";
            case "violated":
                return "bg-red-400/10 text-red-400 border-red-400/20";
            default:
                return "bg-zinc-400/10 text-zinc-400 border-zinc-400/20";
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <Shield className="w-6 h-6 text-primary" />
                    Policy Management
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Define and manage OPA/Rego policies for agent access control
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Policy List */}
                <div className="lg:col-span-4 space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-1">
                        Policies ({policies.length})
                    </p>
                    {policies.map((policy) => (
                        <button
                            key={policy.id}
                            onClick={() => handleSelectPolicy(policy)}
                            className={cn(
                                "w-full text-left p-4 rounded-xl border transition-all duration-200",
                                selectedPolicy.id === policy.id
                                    ? "bg-card border-primary/30 aegis-glow-sm"
                                    : "bg-card/50 border-border/50 hover:bg-card/80 hover:border-border"
                            )}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <p className="text-sm font-semibold pr-2">{policy.name}</p>
                                <Badge
                                    variant="outline"
                                    className={cn(
                                        "text-[10px] px-1.5 py-0 capitalize flex-shrink-0",
                                        getStatusStyle(policy.status)
                                    )}
                                >
                                    {policy.status}
                                </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                {policy.description}
                            </p>
                            <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Bot className="w-3 h-3" />
                                    {policy.assignedAgents} agents
                                </span>
                                <span className="flex items-center gap-1">
                                    <FileText className="w-3 h-3" />
                                    {policy.category}
                                </span>
                                {policy.violations > 0 && (
                                    <span className="flex items-center gap-1 text-red-400">
                                        <AlertTriangle className="w-3 h-3" />
                                        {policy.violations}
                                    </span>
                                )}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Policy Editor */}
                <div className="lg:col-span-8 space-y-4">
                    {/* Editor Header */}
                    <Card className="border-border/50 bg-card/50">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                                        <Code className="w-4 h-4 text-primary" />
                                        {selectedPolicy.name}
                                    </CardTitle>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {selectedPolicy.description}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={handleSimulate}
                                        className="gap-2 border-primary/30 text-primary hover:bg-primary/10"
                                    >
                                        <Play className="w-3.5 h-3.5" />
                                        Simulate
                                    </Button>
                                    <Button size="sm" className="gap-2">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        Save
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            {/* Rego Code Editor */}
                            <div className="rounded-lg border border-border/50 overflow-hidden">
                                <div className="flex items-center gap-2 px-3 py-2 bg-muted/30 border-b border-border/50">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-400/60" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
                                        <div className="w-3 h-3 rounded-full bg-green-400/60" />
                                    </div>
                                    <span className="text-[10px] text-muted-foreground ml-2 font-mono">
                                        {selectedPolicy.id}.rego
                                    </span>
                                </div>
                                <Textarea
                                    value={editedCode}
                                    onChange={(e) => setEditedCode(e.target.value)}
                                    className="min-h-[350px] rounded-none border-0 bg-[oklch(0.11_0.01_260)] font-mono text-xs leading-relaxed resize-none focus-visible:ring-0 focus-visible:ring-offset-0 text-emerald-300/90 p-4"
                                    spellCheck={false}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Test Output */}
                    {testOutput && (
                        <Card className="border-border/50 bg-card/50">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                    Simulation Result
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <pre className="text-xs font-mono text-emerald-300/80 bg-[oklch(0.11_0.01_260)] rounded-lg p-4 whitespace-pre-wrap">
                                    {testOutput}
                                </pre>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
