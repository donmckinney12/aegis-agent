"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Key, Plus, Copy, EyeOff, RotateCw, Trash2, CheckCircle, Loader2 } from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";
import { toast } from "sonner";

const initialApiKeys = [
    { id: "key-1", name: "Terraform Production", key: "sk_live_aegis_8f92...3b1c", created: "2026-01-15T10:00:00Z", lastUsed: "2026-03-03T10:15:00Z", status: "Active" },
    { id: "key-2", name: "CI/CD Pipeline (GitHub)", key: "sk_live_aegis_4a1b...9d2e", created: "2026-02-01T14:30:00Z", lastUsed: "2026-03-03T12:05:00Z", status: "Active" },
    { id: "key-3", name: "Local Dev (Alice)", key: "sk_test_aegis_7c8d...1f4a", created: "2026-02-28T09:12:00Z", lastUsed: "2026-03-02T16:45:00Z", status: "Active" },
    { id: "key-4", name: "Legacy Integration", key: "sk_live_aegis_2b3c...8e5f", created: "2025-11-10T08:20:00Z", lastUsed: "2026-01-05T11:30:00Z", status: "Revoked" },
];

export default function ApiKeysPage() {
    const [apiKeys, setApiKeys] = useState(initialApiKeys);
    const [generating, setGenerating] = useState(false);

    const handleCopy = (key: string, name: string) => {
        navigator.clipboard.writeText(key);
        toast.success("Copied to clipboard", {
            description: `API key for "${name}" has been copied.`,
        });
    };

    const handleGenerate = async () => {
        setGenerating(true);
        await new Promise(r => setTimeout(r, 1800));
        const newKey = {
            id: `key-${apiKeys.length + 1}`,
            name: `New API Key #${apiKeys.length + 1}`,
            key: `sk_live_aegis_${Math.random().toString(36).substring(2, 6)}...${Math.random().toString(36).substring(2, 6)}`,
            created: new Date().toISOString(),
            lastUsed: "Never",
            status: "Active",
        };
        setApiKeys(prev => [newKey, ...prev]);
        setGenerating(false);
        toast.success("🔑 API Key Generated", {
            description: `"${newKey.name}" is now active. Copy it now — it won't be shown again.`,
        });
    };

    const handleRotate = async (id: string, name: string) => {
        toast.loading(`Rotating key for "${name}"...`, { id });
        await new Promise(r => setTimeout(r, 1500));
        setApiKeys(prev => prev.map(k =>
            k.id === id ? {
                ...k,
                key: `sk_live_aegis_${Math.random().toString(36).substring(2, 6)}...${Math.random().toString(36).substring(2, 6)}`,
                lastUsed: "Just now",
            } : k
        ));
        toast.success(`Key rotated for "${name}"`, {
            id,
            description: "The old key has been invalidated. Update your integration configs.",
        });
    };

    const handleRevoke = (id: string, name: string) => {
        setApiKeys(prev => prev.map(k =>
            k.id === id ? { ...k, status: "Revoked" } : k
        ));
        toast.error(`Key revoked: "${name}"`, {
            description: "This key can no longer authenticate API requests.",
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">API Keys & Tokens</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Service accounts and developer credentials for programmatic Aegis administration.
                    </p>
                </div>
                <Button
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={handleGenerate}
                    disabled={generating}
                >
                    {generating ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                        <Plus className="w-4 h-4 mr-2" />
                    )}
                    Generate New Key
                </Button>
            </div>

            <Card className="border-border/50 bg-card/50">
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Key className="w-4 h-4 text-primary" />
                        Active Credentials
                    </CardTitle>
                    <CardDescription>Manage API keys used by your automation tools and scripts.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border border-border/50 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Secret Key</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead>Last Used</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {apiKeys.map((k) => (
                                    <TableRow key={k.id} className="hover:bg-muted/30 group">
                                        <TableCell className="font-medium text-sm">{k.name}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <code className="text-xs bg-muted/50 px-2 py-1 rounded text-muted-foreground font-mono">
                                                    {k.key}
                                                </code>
                                                <button
                                                    className="text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
                                                    onClick={() => handleCopy(k.key, k.name)}
                                                >
                                                    <Copy className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={k.status === "Active" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}>
                                                {k.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">{formatTimeAgo(k.created)}</TableCell>
                                        <TableCell className="text-xs text-muted-foreground">{k.lastUsed === "Never" || k.lastUsed === "Just now" ? k.lastUsed : formatTimeAgo(k.lastUsed)}</TableCell>
                                        <TableCell className="text-right">
                                            {k.status === "Active" && (
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                        onClick={() => handleRotate(k.id, k.name)}
                                                    >
                                                        <RotateCw className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                                                        onClick={() => handleRevoke(k.id, k.name)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5 mt-8">
                <EyeOff className="w-3 h-3" />
                For security reasons, API keys are only shown once upon creation.
            </p>
        </div>
    );
}
