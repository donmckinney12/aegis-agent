"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Webhook, Plus, Bell, ShieldAlert, Cpu, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { PremiumGuard } from "@/components/layout/premium-guard";
import { toast } from "sonner";

const initialIntegrations = [
    { id: "slack", name: "Slack Alerting", destination: "#aegis-security-alerts", events: ["Threat Detected", "Audit Critical"], status: true, icon: Bell },
    { id: "splunk", name: "Splunk (SIEM)", destination: "https://http-inputs-aegis.splunkcloud.com/services/collector", events: ["All Audit Events", "Policy Evaluations"], status: true, icon: ShieldAlert },
    { id: "pd", name: "PagerDuty", destination: "Global SecOps Service", events: ["Agent Compromised", "Cluster Down"], status: false, icon: Cpu },
];

export default function IntegrationsPage() {
    const [integrations, setIntegrations] = useState(initialIntegrations);
    const [adding, setAdding] = useState(false);

    const handleToggle = (id: string) => {
        setIntegrations(prev => prev.map(i => {
            if (i.id === id) {
                const newStatus = !i.status;
                if (newStatus) {
                    toast.success(`${i.name} enabled`, {
                        description: `Events will now be forwarded to ${i.destination}`,
                    });
                } else {
                    toast.warning(`${i.name} disabled`, {
                        description: "Event forwarding paused. No data will be sent until re-enabled.",
                    });
                }
                return { ...i, status: newStatus };
            }
            return i;
        }));
    };

    const handleAddIntegration = async () => {
        setAdding(true);
        await new Promise(r => setTimeout(r, 1500));
        const newIntegration = {
            id: `custom-${integrations.length + 1}`,
            name: "Custom Webhook",
            destination: "https://hooks.example.com/aegis",
            events: ["All Events"],
            status: true,
            icon: Webhook,
        };
        setIntegrations(prev => [...prev, newIntegration]);
        setAdding(false);
        toast.success("🔗 Integration Added", {
            description: "Custom webhook endpoint configured. A test payload has been dispatched.",
        });
    };

    return (
        <PremiumGuard featureName="Webhooks & Integrations">
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Webhooks & Integrations</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Connect Aegis to your SIEM, alerting pipelines, and external sinks.
                        </p>
                    </div>
                    <Button
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={handleAddIntegration}
                        disabled={adding}
                    >
                        {adding ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Plus className="w-4 h-4 mr-2" />
                        )}
                        Add Integration
                    </Button>
                </div>

                <div className="grid gap-6">
                    {integrations.map((integration) => (
                        <Card key={integration.id} className="border-border/50 bg-card/50">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                                        <integration.icon className="w-5 h-5 text-foreground" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base">{integration.name}</CardTitle>
                                        <CardDescription className="font-mono text-xs mt-0.5">{integration.destination}</CardDescription>
                                    </div>
                                </div>
                                <Switch
                                    checked={integration.status}
                                    onCheckedChange={() => handleToggle(integration.id)}
                                />
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <span className="text-xs text-muted-foreground mr-2 font-medium">Forwarding Events:</span>
                                    {integration.events.map((ev) => (
                                        <Badge key={ev} variant="secondary" className="text-[10px] font-normal bg-accent">
                                            {ev}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </PremiumGuard>
    );
}
