import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { Shield, BrainCircuit, Network, Fingerprint, Globe, Zap, Users, Code, ArrowRight, Lock, Award } from "lucide-react";
import Link from "next/link";

const stats = [
    { value: "18+", label: "API Endpoints", icon: Code },
    { value: "<1ms", label: "Policy Evaluation", icon: Zap },
    { value: "X.509", label: "Certificate Standard", icon: Lock },
    { value: "24/7", label: "Monitoring", icon: Shield },
];

const values = [
    {
        icon: Fingerprint,
        title: "Identity First",
        description: "Identity is the new perimeter. Without strong, verifiable workload identity, network segmentation is meaningless.",
        color: "text-purple-400",
        border: "border-purple-500/20",
        bg: "bg-purple-500/5",
    },
    {
        icon: Network,
        title: "Decentralized Trust",
        description: "Agents operate in fluid federated environments. We utilize SPIFFE to ensure cross-cluster and cross-cloud authentication.",
        color: "text-emerald-400",
        border: "border-emerald-500/20",
        bg: "bg-emerald-500/5",
    },
    {
        icon: Shield,
        title: "Security by Default",
        description: "Every design decision starts with the threat model. We assume breach and architect for zero-trust from day one.",
        color: "text-cyan-400",
        border: "border-cyan-500/20",
        bg: "bg-cyan-500/5",
    },
    {
        icon: BrainCircuit,
        title: "Built for AI Scale",
        description: "Traditional IAM wasn't designed for agents that spawn thousands of instances. Our architecture is purpose-built for the agentic era.",
        color: "text-indigo-400",
        border: "border-indigo-500/20",
        bg: "bg-indigo-500/5",
    },
];

const timeline = [
    { year: "2024", title: "Idea & Research", description: "Identified the gap in AI agent identity. Designed the SPIFFE-based architecture." },
    { year: "2025 Q1", title: "Core Engine Built", description: "Go control plane with OPA policy engine and SPIFFE certificate authority." },
    { year: "2025 Q3", title: "Enterprise Expansion", description: "Added 8 enterprise modules: analytics, compliance, threat intel, and more." },
    { year: "2026 Q1", title: "Production Launch", description: "Full SaaS platform live with Stripe billing, Clerk auth, and cloud deployment." },
    { year: "2026 Q2", title: "SOC 2 Certification", description: "Pursuing SOC 2 Type II and ISO 27001 compliance certifications." },
];

const team = [
    { name: "Donald McKinney", role: "Founder & CEO", focus: "Product vision, architecture, and go-to-market strategy" },
    { name: "Engineering Team", role: "Core Platform", focus: "Go control plane, SPIFFE CA, OPA engine, REST API" },
    { name: "Security Team", role: "Product Security", focus: "Cryptographic infrastructure, pen testing, threat modeling" },
    { name: "Growth Team", role: "Marketing & Sales", focus: "Enterprise partnerships, developer advocacy, content" },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background selection:bg-primary/30">
            <PublicNavbar />

            <main className="pt-32 pb-24 px-6 md:px-12 max-w-6xl mx-auto">
                {/* Hero */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 mt-8">
                        Securing the <span className="aegis-gradient-text">Agentic Future</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        We are building the identity layer that autonomous AI agents need to operate safely at scale — cryptographic, verifiable, and zero-trust by design.
                    </p>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
                    {stats.map((stat) => (
                        <div key={stat.label} className="p-6 rounded-2xl border border-border/50 bg-card/30 text-center">
                            <stat.icon className="w-6 h-6 text-primary mx-auto mb-3" />
                            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Mission Statement */}
                <div className="relative p-12 rounded-3xl border border-indigo-500/20 bg-indigo-500/5 overflow-hidden mb-20">
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
                <h2 className="text-2xl font-bold mb-8 text-center">What We Believe</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
                    {values.map((value) => (
                        <div key={value.title} className={`p-6 rounded-2xl border ${value.border} ${value.bg}`}>
                            <value.icon className={`w-8 h-8 ${value.color} mb-4`} />
                            <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                        </div>
                    ))}
                </div>

                {/* Company Timeline */}
                <h2 className="text-2xl font-bold mb-8 text-center">Our Journey</h2>
                <div className="relative mb-20">
                    <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border/50 md:-translate-x-px" />
                    <div className="space-y-8">
                        {timeline.map((item, i) => (
                            <div key={item.year} className={`relative flex flex-col md:flex-row items-start gap-4 md:gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                                <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'} pl-10 md:pl-0`}>
                                    <span className="text-xs font-bold text-primary uppercase tracking-wider">{item.year}</span>
                                    <h3 className="text-lg font-semibold mt-1">{item.title}</h3>
                                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                                </div>
                                <div className="absolute left-2.5 md:left-1/2 md:-translate-x-1/2 top-0 w-3 h-3 rounded-full bg-primary border-2 border-background" />
                                <div className="flex-1 hidden md:block" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Team */}
                <h2 className="text-2xl font-bold mb-8 text-center">The Team</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
                    {team.map((member) => (
                        <div key={member.name} className="p-6 rounded-2xl border border-border/50 bg-card/30 text-center">
                            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 mx-auto mb-4 flex items-center justify-center">
                                <Users className="w-7 h-7 text-primary" />
                            </div>
                            <h3 className="font-semibold text-foreground">{member.name}</h3>
                            <p className="text-xs text-primary font-medium mt-0.5">{member.role}</p>
                            <p className="text-xs text-muted-foreground mt-2">{member.focus}</p>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center rounded-2xl border border-primary/20 bg-primary/5 p-12">
                    <Award className="w-8 h-8 text-primary mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-3">Join Our Mission</h2>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        We&apos;re building the security infrastructure that the agentic era demands. Come build with us.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/careers" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-colors">
                            View Open Roles <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 border border-border/50 text-foreground rounded-full font-semibold hover:bg-muted/50 transition-colors">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </main>

            <PublicFooter />
        </div>
    );
}
