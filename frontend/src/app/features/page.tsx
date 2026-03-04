import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { Shield, Lock, Bot, Zap, Globe, Code } from "lucide-react";

export default function FeaturesPage() {
    return (
        <div className="min-h-screen bg-background selection:bg-primary/30">
            <PublicNavbar />

            <main className="pt-32 pb-24 px-6 md:px-12 max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 mt-8">
                        Platform <span className="aegis-gradient-text">Features</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Deep dive into the architecture that powers the most secure autonomous agent swarms in the world.
                    </p>
                </div>

                <div className="space-y-24">
                    {/* Feature 1 */}
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1 space-y-6">
                            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                                <Shield className="w-8 h-8 text-indigo-400" />
                            </div>
                            <h2 className="text-3xl font-bold tracking-tight">SPIFFE/SPIRE Identity Platform</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Stop relying on static, long-lived API keys. Aegis automatically provisions cryptographically verifiable X.509 SVIDs (SPIFFE Verifiable Identity Documents) to every agent in your network.
                            </p>
                            <ul className="space-y-3 text-sm text-muted-foreground border-l-2 border-indigo-500/30 pl-4 py-2">
                                <li>• Automatic certificate rotation before expiry</li>
                                <li>• Node and workload attestation</li>
                                <li>• Built for massive scale and ephemeral compute</li>
                            </ul>
                        </div>
                        <div className="flex-1 w-full h-[400px] border border-border/50 rounded-2xl bg-card/50 glass relative overflow-hidden flex items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent" />
                            <div className="text-center">
                                <div className="w-32 h-32 rounded-full border border-indigo-500/30 flex items-center justify-center mx-auto mb-4 relative">
                                    <div className="absolute inset-0 rounded-full border border-indigo-500/10 animate-ping" />
                                    <Shield className="w-12 h-12 text-indigo-400" />
                                </div>
                                <p className="font-mono text-xs text-indigo-400">Verifying Identity...</p>
                            </div>
                        </div>
                    </div>

                    {/* Feature 2 */}
                    <div className="flex flex-col md:flex-row-reverse items-center gap-12">
                        <div className="flex-1 space-y-6">
                            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                                <Lock className="w-8 h-8 text-cyan-400" />
                            </div>
                            <h2 className="text-3xl font-bold tracking-tight">Open Policy Agent (OPA) Engine</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Centralized policy authoring with distributed enforcement. Use Rego to write fine-grained access control rules that determine exactly what APIs and resources your agents can access.
                            </p>
                            <ul className="space-y-3 text-sm text-muted-foreground border-l-2 border-cyan-500/30 pl-4 py-2">
                                <li>• Policy-as-Code workflow</li>
                                <li>• Sub-millisecond evaluation latency</li>
                                <li>• Context-aware dynamic authorization</li>
                            </ul>
                        </div>
                        <div className="flex-1 w-full h-[400px] border border-border/50 rounded-2xl bg-card/50 glass relative overflow-hidden flex items-center justify-center p-8">
                            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-transparent" />
                            <pre className="text-xs text-cyan-200/80 font-mono bg-background/80 p-6 rounded-xl border border-border w-full h-full overflow-hidden">
                                {`package aegis.authz

default allow = false

# Allow trading agent to execute market orders
allow {
    input.agent.type == "trading_bot"
    input.action == "execute_trade"
    input.resource.tier == "production"
    input.trust_score >= 90
}`}
                            </pre>
                        </div>
                    </div>
                </div>
            </main>

            <PublicFooter />
        </div>
    );
}
