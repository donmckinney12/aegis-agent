import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import {
    Briefcase,
    MapPin,
    Code,
    Shield,
    Database,
    Cpu,
    ArrowRight,
    Heart,
    Zap,
    Globe,
    Coffee,
    TrendingUp,
    Users,
} from "lucide-react";
import Link from "next/link";

const openRoles = [
    {
        title: "Senior Go Engineer",
        team: "Control Plane",
        location: "Remote (US/EU)",
        type: "Full-Time",
        description: "Build the core Aegis control plane — SPIFFE certificate issuance, OPA policy engine, and REST API layer.",
        tags: ["Go", "PostgreSQL", "OPA", "SPIFFE"],
        icon: Code,
        color: "text-cyan-400",
        border: "border-cyan-500/20",
    },
    {
        title: "Staff Security Engineer",
        team: "Product Security",
        location: "Remote (Global)",
        type: "Full-Time",
        description: "Own the security posture of our cryptographic infrastructure — from X.509 certificate chains to Rego policy verification.",
        tags: ["Cryptography", "X.509", "Pen Testing", "Threat Modeling"],
        icon: Shield,
        color: "text-emerald-400",
        border: "border-emerald-500/20",
    },
    {
        title: "Full-Stack Engineer",
        team: "Dashboard",
        location: "San Francisco, CA",
        type: "Full-Time",
        description: "Build the next-gen Aegis dashboard — React Flow trust graphs, real-time telemetry, and enterprise admin consoles.",
        tags: ["Next.js", "React", "TypeScript", "Recharts"],
        icon: Cpu,
        color: "text-indigo-400",
        border: "border-indigo-500/20",
    },
    {
        title: "Security Researcher",
        team: "Threat Intelligence",
        location: "Remote (Global)",
        type: "Full-Time",
        description: "Research adversarial attacks on agentic AI systems and build behavioral anomaly detection models for the Aegis threat engine.",
        tags: ["AI Security", "Behavioral Analysis", "CVE Research", "MITRE ATT&CK"],
        icon: Shield,
        color: "text-red-400",
        border: "border-red-500/20",
    },
    {
        title: "DevOps / SRE",
        team: "Infrastructure",
        location: "Remote (US)",
        type: "Full-Time",
        description: "Manage multi-region Fly.io deployments, PostgreSQL replication, CI/CD pipelines, and observability for 99.99% uptime.",
        tags: ["Fly.io", "Docker", "GitHub Actions", "PostgreSQL"],
        icon: Database,
        color: "text-amber-400",
        border: "border-amber-500/20",
    },
];

const perks = [
    { icon: Globe, title: "Remote-First", description: "Work from anywhere in the world with async-friendly culture." },
    { icon: TrendingUp, title: "Equity Stake", description: "Meaningful equity in a pre-Series A security infrastructure company." },
    { icon: Heart, title: "Health & Wellness", description: "Comprehensive medical, dental, and vision for you and your family." },
    { icon: Coffee, title: "Home Office Budget", description: "$2,500 stipend for your ideal remote workspace setup." },
    { icon: Zap, title: "Learning Budget", description: "$1,500/year for conferences, courses, and certifications." },
    { icon: Users, title: "Team Offsites", description: "Quarterly team retreats in cities like Austin, Denver, and Lisbon." },
];

const values = [
    { title: "Security is the Product", description: "We don't ship features that compromise the trust our users place in us." },
    { title: "Craftsmanship over Speed", description: "We write code that's meant to protect billions of API calls. It has to be right." },
    { title: "Transparency Wins", description: "We open-source our approach, publish our security posture, and never hide behind NDAs." },
    { title: "Small Team, Outsized Impact", description: "Every engineer here directly shapes the future of AI agent security." },
];

export default function CareersPage() {
    return (
        <div className="min-h-screen bg-background selection:bg-primary/30">
            <PublicNavbar />
            <main className="pt-32 pb-24 px-6 md:px-12 max-w-6xl mx-auto">
                {/* Hero */}
                <div className="mb-16">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                            <Briefcase className="w-5 h-5 text-indigo-400" />
                        </div>
                        <span className="text-xs font-medium text-indigo-400 uppercase tracking-widest">Careers</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                        Build the <span className="aegis-gradient-text">Shield</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl">
                        Join us in building the last line of defense for the Agentic Era. We&apos;re a small, world-class team securing the infrastructure that autonomous AI agents run on.
                    </p>
                </div>

                {/* Values */}
                <h2 className="text-2xl font-bold mb-6">Our Values</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
                    {values.map((value) => (
                        <div key={value.title} className="p-6 rounded-2xl border border-border/50 bg-card/30">
                            <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                            <p className="text-sm text-muted-foreground">{value.description}</p>
                        </div>
                    ))}
                </div>

                {/* Open Roles */}
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Briefcase className="w-6 h-6 text-primary" />
                    Open Positions ({openRoles.length})
                </h2>
                <div className="space-y-4 mb-16">
                    {openRoles.map((role) => (
                        <div
                            key={role.title}
                            className={`p-6 rounded-2xl border ${role.border} bg-card/30 hover:bg-card/60 transition-all cursor-pointer group`}
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <role.icon className={`w-5 h-5 ${role.color}`} />
                                        <h3 className="text-lg font-semibold group-hover:text-foreground transition-colors">{role.title}</h3>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-3">{role.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {role.tags.map((tag) => (
                                            <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted border border-border/50 text-muted-foreground">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <MapPin className="w-3.5 h-3.5" />
                                        {role.location}
                                    </div>
                                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${role.border} ${role.color}`}>
                                        {role.team}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Benefits & Perks */}
                <h2 className="text-2xl font-bold mb-6">Benefits & Perks</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
                    {perks.map((perk) => (
                        <div key={perk.title} className="p-5 rounded-2xl border border-border/50 bg-card/30">
                            <perk.icon className="w-6 h-6 text-primary mb-3" />
                            <h3 className="font-semibold text-foreground mb-1 text-sm">{perk.title}</h3>
                            <p className="text-xs text-muted-foreground">{perk.description}</p>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center rounded-2xl border border-primary/20 bg-primary/5 p-12">
                    <h2 className="text-2xl font-bold mb-3">Don&apos;t see your role?</h2>
                    <p className="text-muted-foreground mb-6">
                        We&apos;re always looking for exceptional people. Send us your resume and tell us what you&apos;d build.
                    </p>
                    <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-colors">
                        Get in Touch <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </main>
            <PublicFooter />
        </div>
    );
}
