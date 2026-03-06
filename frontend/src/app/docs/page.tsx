import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { BookOpen, Zap, Shield, Code, Terminal, Key, Globe, ArrowRight, FileText, Cpu } from "lucide-react";
import Link from "next/link";

const guides = [
    {
        icon: Zap,
        title: "Quick Start",
        description: "Get Aegis up and running in under 5 minutes with your first agent identity.",
        sections: ["Install the SDK", "Create your first SVID", "Evaluate a policy", "View the trust graph"],
        color: "text-cyan-400",
        border: "border-cyan-500/20",
        bg: "bg-cyan-500/5",
    },
    {
        icon: Shield,
        title: "SPIFFE & SVIDs",
        description: "Deep dive into X.509 certificates, trust domains, and workload attestation.",
        sections: ["Trust domain configuration", "Certificate authority setup", "SVID lifecycle management", "Certificate rotation & TTL"],
        color: "text-emerald-400",
        border: "border-emerald-500/20",
        bg: "bg-emerald-500/5",
    },
    {
        icon: Code,
        title: "Rego Policy Authoring",
        description: "Write, test, and deploy Open Policy Agent rules for granular access control.",
        sections: ["Rego syntax fundamentals", "RBAC & ABAC patterns", "Financial transaction limits", "Policy simulation & testing"],
        color: "text-indigo-400",
        border: "border-indigo-500/20",
        bg: "bg-indigo-500/5",
    },
    {
        icon: Terminal,
        title: "Go SDK Reference",
        description: "Integrate Aegis into your Go microservices with our native client library.",
        sections: ["Client initialization", "Identity verification", "Policy evaluation calls", "Middleware integration"],
        color: "text-amber-400",
        border: "border-amber-500/20",
        bg: "bg-amber-500/5",
    },
    {
        icon: Key,
        title: "Authentication & API Keys",
        description: "Manage service accounts, scoped tokens, and developer credentials.",
        sections: ["API key generation", "Scoped permissions", "Key rotation strategies", "Webhook authentication"],
        color: "text-pink-400",
        border: "border-pink-500/20",
        bg: "bg-pink-500/5",
    },
    {
        icon: Globe,
        title: "Deployment & Infrastructure",
        description: "Deploy Aegis to production across Fly.io, AWS, GCP, and on-prem clusters.",
        sections: ["Docker deployment", "Fly.io configuration", "PostgreSQL setup", "Multi-region clustering"],
        color: "text-violet-400",
        border: "border-violet-500/20",
        bg: "bg-violet-500/5",
    },
];

const sdkSnippet = `import (
    "github.com/aegis-agent-id/sdk-go"
)

func main() {
    client, _ := aegis.NewClient("aegis.io", aegis.WithAutoRotate())

    // Issue an SVID for this workload
    svid, _ := client.IssueSVID("orchestrator", "prime", 24*time.Hour)
    fmt.Println("SPIFFE ID:", svid.SpiffeID)

    // Evaluate a policy
    result, _ := client.EvaluatePolicy("financial-limits", map[string]interface{}{
        "action": "refund",
        "amount": 250,
    })
    fmt.Println("Allowed:", result.Allow)
}`;

export default function DocsPage() {
    return (
        <div className="min-h-screen bg-background selection:bg-primary/30">
            <PublicNavbar />
            <main className="pt-32 pb-24 px-6 md:px-12 max-w-6xl mx-auto">
                {/* Hero */}
                <div className="mb-16">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-xs font-medium text-primary uppercase tracking-widest">Documentation</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                        Build with <span className="aegis-gradient-text">Aegis</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl">
                        Everything you need to implement zero-trust identity for your AI agents — from first SVID to production-scale policy enforcement.
                    </p>
                </div>

                {/* Quick Install */}
                <div className="rounded-2xl border border-border/50 bg-card/30 p-6 md:p-8 mb-16">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Cpu className="w-5 h-5 text-cyan-400" />
                        Install in 30 Seconds
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase mb-2">Go SDK</p>
                            <pre className="text-sm font-mono bg-[oklch(0.11_0.01_260)] text-emerald-300/80 p-4 rounded-xl border border-border/50 overflow-x-auto">
                                go get github.com/aegis-agent-id/sdk-go
                            </pre>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase mb-2">Docker (Self-Hosted)</p>
                            <pre className="text-sm font-mono bg-[oklch(0.11_0.01_260)] text-emerald-300/80 p-4 rounded-xl border border-border/50 overflow-x-auto">
                                docker pull aegis/control-plane:latest
                            </pre>
                        </div>
                    </div>
                </div>

                {/* Guide Cards */}
                <h2 className="text-2xl font-bold mb-8">Guides & Tutorials</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {guides.map((guide) => (
                        <div
                            key={guide.title}
                            className={`p-6 rounded-2xl border ${guide.border} ${guide.bg} hover:bg-card/80 transition-all cursor-pointer group`}
                        >
                            <guide.icon className={`w-8 h-8 ${guide.color} mb-4`} />
                            <h3 className="text-lg font-semibold mb-2 group-hover:text-foreground transition-colors">{guide.title}</h3>
                            <p className="text-sm text-muted-foreground mb-4">{guide.description}</p>
                            <ul className="space-y-1.5">
                                {guide.sections.map((section) => (
                                    <li key={section} className="text-xs text-muted-foreground flex items-center gap-2">
                                        <FileText className="w-3 h-3 flex-shrink-0" />
                                        {section}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-4 flex items-center text-xs font-semibold text-primary group-hover:translate-x-1 transition-transform">
                                Read Guide <ArrowRight className="w-3 h-3 ml-1" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* SDK Example */}
                <div className="rounded-2xl border border-border/50 bg-card/30 p-6 md:p-8 mb-16">
                    <h2 className="text-2xl font-bold mb-2">Go SDK Example</h2>
                    <p className="text-sm text-muted-foreground mb-6">
                        Issue an SVID and evaluate a policy in under 10 lines of Go.
                    </p>
                    <div className="rounded-xl border border-border/50 overflow-hidden">
                        <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/30 border-b border-border/50">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-400/60" />
                                <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
                                <div className="w-3 h-3 rounded-full bg-green-400/60" />
                            </div>
                            <span className="text-[10px] text-muted-foreground ml-2 font-mono">main.go</span>
                        </div>
                        <pre className="text-xs font-mono bg-[oklch(0.11_0.01_260)] text-emerald-300/80 p-6 overflow-x-auto leading-relaxed">
                            {sdkSnippet}
                        </pre>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center rounded-2xl border border-primary/20 bg-primary/5 p-12">
                    <h2 className="text-2xl font-bold mb-3">Ready to secure your AI agents?</h2>
                    <p className="text-muted-foreground mb-6">
                        Start with the free Developer tier — no credit card required.
                    </p>
                    <Link href="/pricing" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-colors">
                        View Pricing <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </main>
            <PublicFooter />
        </div>
    );
}
