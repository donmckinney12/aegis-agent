"use client";

import { useUser } from "@clerk/nextjs";
import { ShieldAlert, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface AdminGuardProps {
    children: React.ReactNode;
    featureName?: string;
}

export function AdminGuard({ children, featureName = "this page" }: AdminGuardProps) {
    const { user, isLoaded } = useUser();
    const router = useRouter();

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const isAdmin = user?.publicMetadata?.role === "admin";

    if (!isAdmin) {
        return (
            <div className="flex items-center justify-center min-h-[500px]">
                <Card className="max-w-md border-red-500/20 bg-card/80">
                    <CardContent className="pt-8 pb-8 text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
                            <Lock className="w-8 h-8 text-red-400" />
                        </div>
                        <h2 className="text-xl font-bold">Admin Access Required</h2>
                        <p className="text-sm text-muted-foreground">
                            <span className="font-semibold text-foreground">{featureName}</span> is restricted to administrators.
                            Contact your organization admin to request access.
                        </p>
                        <Button
                            variant="outline"
                            className="border-primary/30 text-primary hover:bg-primary/10"
                            onClick={() => router.push("/dashboard")}
                        >
                            Return to Dashboard
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return <>{children}</>;
}
