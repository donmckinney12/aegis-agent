"use client";

import { useUser } from "@clerk/nextjs";
import { Lock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Link from "next/link";

export function PremiumGuard({ children, featureName = "This feature" }: { children: React.ReactNode, featureName?: string }) {
    const { user, isLoaded } = useUser();

    if (!isLoaded) return null;

    // Check if the user has a premium tier stored in their Clerk publicMetadata
    const tier = user?.publicMetadata?.tier as string | undefined;
    const isPremium = tier === "growth" || tier === "enterprise";

    if (isPremium) {
        return <>{children}</>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
            <Card className="max-w-md border-indigo-500/20 bg-indigo-500/5 shadow-[0_0_40px_rgba(99,102,241,0.1)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
                <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4 border border-indigo-500/30">
                        <Lock className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-2xl">{featureName} is disabled.</CardTitle>
                    <CardDescription className="text-base mt-2">
                        Upgrade your Aegis-ID deployment to the <strong className="text-foreground">Growth</strong> or <strong className="text-foreground">Enterprise</strong> tier to unlock advanced capabilities.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <ul className="text-sm text-left text-muted-foreground space-y-2 mb-6">
                        <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-amber-400" /> Unlock Threat Intelligence</li>
                        <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-amber-400" /> SOC2 & ISO27001 Compliance Reports</li>
                        <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-amber-400" /> Webhook Integrations</li>
                    </ul>
                    <Link href="/pricing" className="block w-full">
                        <Button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
                            Upgrade Now
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}
