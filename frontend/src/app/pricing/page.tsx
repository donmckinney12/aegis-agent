"use client";

import { useState } from "react";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function PricingPage() {
    const [isYearly, setIsYearly] = useState(false);
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const { isSignedIn } = useAuth();
    const router = useRouter();

    const handleCheckout = async (priceId: string, planName: string) => {
        if (!isSignedIn) {
            router.push("/sign-up");
            return;
        }

        try {
            setIsLoading(planName);
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ priceId }),
            });

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                console.error("No checkout URL returned", data);
            }
        } catch (error) {
            console.error("Failed to start checkout", error);
        } finally {
            setIsLoading(null);
        }
    };

    return (
        <div className="min-h-screen bg-background selection:bg-primary/30 flex flex-col">
            <PublicNavbar />

            <main className="flex-1 pt-32 pb-24 px-6 md:px-12 max-w-6xl mx-auto w-full">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 mt-8">
                        Transparent <span className="aegis-gradient-text">Pricing</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                        Scale your agent network securely with pricing that makes sense. No hidden fees, just pure infrastructure.
                    </p>

                    <div className="flex items-center justify-center gap-3 mb-12">
                        <span className={cn("text-sm font-medium", !isYearly ? "text-foreground" : "text-muted-foreground")}>Monthly</span>
                        <button
                            onClick={() => setIsYearly(!isYearly)}
                            className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary/20 border border-primary/30 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                            role="switch"
                            aria-checked={isYearly}
                        >
                            <span
                                className={cn(
                                    "inline-block h-4 w-4 transform rounded-full bg-primary transition-transform",
                                    isYearly ? "translate-x-6" : "translate-x-1"
                                )}
                            />
                        </button>
                        <span className={cn("text-sm font-medium flex items-center gap-1.5", isYearly ? "text-foreground" : "text-muted-foreground")}>
                            Yearly
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">Save 20%</span>
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Starter Plan */}
                    <div className="p-8 rounded-3xl border border-border/50 bg-card/50 hover:bg-card/80 transition-colors flex flex-col">
                        <h3 className="text-2xl font-bold mb-2">Developer</h3>
                        <p className="text-muted-foreground text-sm mb-6">Perfect for building and testing AI agents locally.</p>
                        <div className="mb-8">
                            <span className="text-5xl font-extrabold">$0</span>
                            <span className="text-muted-foreground">/mo</span>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            {["Up to 5 active agents", "1,000 policy checks/mo", "Community Support", "Basic Trust Graph"].map((item) => (
                                <li key={item} className="flex items-center gap-3 text-sm">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <Link href="/sign-up" className="block mt-auto">
                            <Button className="w-full" variant="outline">Start for Free</Button>
                        </Link>
                    </div>

                    {/* Pro Plan */}
                    <div className="p-8 rounded-3xl border border-primary/50 bg-primary/5 hover:border-primary/80 transition-all shadow-[0_0_30px_rgba(99,102,241,0.15)] flex flex-col relative scale-105">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider rounded-full">
                            Most Popular
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Growth</h3>
                        <p className="text-muted-foreground text-sm mb-6">For scaling autonomous systems in production.</p>
                        <div className="mb-8">
                            <span className="text-5xl font-extrabold">${isYearly ? "239" : "299"}</span>
                            <span className="text-muted-foreground">/mo</span>
                            {isYearly && <p className="text-xs text-muted-foreground block mt-1">Billed annually at $2,868/year</p>}
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            {["Up to 50 active agents", "100,000 policy checks/mo", "Priority Email Support", "Advanced Analytics", "SOC 2 Export"].map((item) => (
                                <li key={item} className="flex items-center gap-3 text-sm">
                                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <Button
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 mt-auto"
                            onClick={() => handleCheckout(
                                isYearly ? process.env.NEXT_PUBLIC_STRIPE_PRICE_GROWTH_YEARLY! : process.env.NEXT_PUBLIC_STRIPE_PRICE_GROWTH_MONTHLY!,
                                "growth"
                            )}
                            disabled={isLoading === "growth"}
                        >
                            {isLoading === "growth" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Start 14-Day Trial
                        </Button>
                    </div>

                    {/* Enterprise Plan */}
                    <div className="p-8 rounded-3xl border border-border/50 bg-card/50 hover:bg-card/80 transition-colors flex flex-col">
                        <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
                        <p className="text-muted-foreground text-sm mb-6">Custom infrastructure for mission-critical swarms.</p>
                        <div className="mb-8">
                            {isYearly ? (
                                <>
                                    <span className="text-5xl font-extrabold">$3,999</span>
                                    <span className="text-muted-foreground">/mo</span>
                                    <p className="text-xs text-muted-foreground block mt-1">Billed annually at $47,988/year</p>
                                </>
                            ) : (
                                <>
                                    <span className="text-5xl font-extrabold">$4,999</span>
                                    <span className="text-muted-foreground">/mo</span>
                                </>
                            )}
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            {["Unlimited agents", "Unlimited policy checks", "24/7 Phone Support", "Dedicated VPC Deployment", "Custom ML Threat Models"].map((item) => (
                                <li key={item} className="flex items-center gap-3 text-sm">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <Button
                            className="w-full mt-auto"
                            variant="outline"
                            onClick={() => handleCheckout(
                                isYearly ? process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_YEARLY! : process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_MONTHLY!,
                                "enterprise"
                            )}
                            disabled={isLoading === "enterprise"}
                        >
                            {isLoading === "enterprise" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Checkout
                        </Button>
                    </div>
                </div>
            </main>

            <PublicFooter />
        </div>
    );
}
