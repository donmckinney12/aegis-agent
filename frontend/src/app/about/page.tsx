import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { Shield, BrainCircuit, Network, Fingerprint } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background selection:bg-primary/30">
            <PublicNavbar />

            <main className="pt-32 pb-24 px-6 md:px-12 max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 mt-8">
                        Securing the <span className="aegis-gradient-text">Agentic Future</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        We are a team of cryptography researchers and distributed systems engineers who believe that autonomous AI requires a fundamentally new identity primitive.
                    </p>
                </div>

                {/* Vision Statement */}
                <div className="relative p-12 rounded-3xl border border-indigo-500/20 bg-indigo-500/5 overflow-hidden mb-24">
                    <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px]" />
                    <div className="absolute left-0 bottom-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px]" />

                    <h2 className="text-2xl font-bold mb-6 relative z-10">Our Mission</h2>
                    <p className="text-lg text-foreground/80 leading-relaxed relative z-10 mb-6">
                        By 2030, silicon-based agents will execute billions of API calls, trades, and micro-transactions daily. If these agents rely on static, shared API keys, the surface area for devastating cyberattacks becomes infinite.
                    </p>
                    <p className="text-lg text-foreground/80 leading-relaxed relative z-10">
                        Aegis-Agent ID exists to replace static secrets with dynamic, mathematically provable identity protocols. We are building the globally distributed zero-trust control plane that allows agents to attest to their origin before they ever touch your secure data.
                    </p>
                </div>

                {/* Values */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
                    <div className="space-y-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                            <Fingerprint className="w-6 h-6 text-purple-400" />
                        </div>
                        <h3 className="text-xl font-semibold">Identity First</h3>
                        <p className="text-muted-foreground leading-relaxed">Identity is the new perimeter. Without strong, verifiable workload identity, network segmentation is meaningless.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                            <Network className="w-6 h-6 text-emerald-400" />
                        </div>
                        <h3 className="text-xl font-semibold">Decentralized Trust</h3>
                        <p className="text-muted-foreground leading-relaxed">Agents operate in fluid federated environments. We utilize SPIFFE to ensure cross-cluster and cross-cloud authentication.</p>
                    </div>
                </div>
            </main>

            <PublicFooter />
        </div>
    );
}
