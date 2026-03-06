import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import {
    ShieldCheck,
    Lock,
    Key,
    Eye,
    FileCheck,
    Server,
    Bug,
    Award,
    Globe,
    CheckCircle2,
    ArrowRight,
} from "lucide-react";
import Link from "next/link";

const certifications = [
    { name: "SOC 2 Type II", status: "In Progress", expected: "Q3 2026", icon: FileCheck, color: "text-emerald-400", border: "border-emerald-500/20", bg: "bg-emerald-500/5" },
    { name: "ISO 27001", status: "Planned", expected: "Q4 2026", icon: Award, color: "text-cyan-400", border: "border-cyan-500/20", bg: "bg-cyan-500/5" },
    { name: "HIPAA", status: "Compliant", expected: "Current", icon: ShieldCheck, color: "text-emerald-400", border: "border-emerald-500/20", bg: "bg-emerald-500/5" },
    { name: "GDPR", status: "Compliant", expected: "Current", icon: Globe, color: "text-emerald-400", border: "border-emerald-500/20", bg: "bg-emerald-500/5" },
];

const securityPractices = [
    {
        icon: Lock,
        title: "Encryption at Rest & in Transit",
        description: "All data is encrypted with AES-256 at rest and TLS 1.3 in transit. Private keys never leave the control plane boundary.",
    },
    {
        icon: Key,
        title: "Zero-Trust Certificate Architecture",
        description: "Every agent identity is backed by a cryptographic X.509 SVID. No static API keys, no shared secrets, no ambient authority.",
    },
    {
        icon: Eye,
        title: "Comprehensive Audit Logging",
        description: "Every authentication attempt, policy evaluation, and certificate lifecycle event is immutably logged with full trace correlation.",
    },
    {
        icon: Server,
        title: "Infrastructure Isolation",
        description: "Customer workloads are isolated at the compute and database layer. Each organization runs on dedicated PostgreSQL schemas.",
    },
    {
        icon: ShieldCheck,
        title: "Automated Dependency Scanning",
        description: "All Go and Node.js dependencies are continuously scanned for CVEs via Dependabot and the Go vulnerability database.",
    },
    {
        icon: Bug,
        title: "Penetration Testing",
        description: "Annual third-party penetration tests are conducted on all exposed API surfaces, authentication flows, and certificate issuance paths.",
    },
];

const bountyTiers = [
    { severity: "Critical", reward: "$10,000 – $50,000", example: "RCE, authentication bypass, certificate forgery", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
    { severity: "High", reward: "$5,000 – $10,000", example: "Privilege escalation, SVID injection, policy bypass", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    { severity: "Medium", reward: "$1,000 – $5,000", example: "Information disclosure, CSRF, insecure defaults", color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
    { severity: "Low", reward: "$100 – $1,000", example: "Open redirect, minor information leakage", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
];

export default function SecurityPage() {
    return (
        <div className="min-h-screen bg-background selection:bg-primary/30">
            <PublicNavbar />
            <main className="pt-32 pb-24 px-6 md:px-12 max-w-6xl mx-auto">
                {/* Hero */}
                <div className="mb-16">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5 text-emerald-400" />
                        </div>
                        <span className="text-xs font-medium text-emerald-400 uppercase tracking-widest">Security</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                        Security <span className="aegis-gradient-text">Posture</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl">
                        Transparency is the foundation of trust. Security isn&apos;t a feature we bolt on — it&apos;s the product itself.
                    </p>
                </div>

                {/* Compliance Certifications */}
                <h2 className="text-2xl font-bold mb-6">Compliance & Certifications</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
                    {certifications.map((cert) => (
                        <div key={cert.name} className={`p-6 rounded-2xl border ${cert.border} ${cert.bg} text-center`}>
                            <cert.icon className={`w-8 h-8 ${cert.color} mx-auto mb-3`} />
                            <h3 className="font-semibold text-foreground mb-1">{cert.name}</h3>
                            <p className={`text-xs font-medium ${cert.color}`}>{cert.status}</p>
                            <p className="text-[10px] text-muted-foreground mt-1">{cert.expected}</p>
                        </div>
                    ))}
                </div>

                {/* Security Practices */}
                <h2 className="text-2xl font-bold mb-6">Engineering Practices</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {securityPractices.map((practice) => (
                        <div key={practice.title} className="p-6 rounded-2xl border border-border/50 bg-card/30 hover:bg-card/60 transition-colors">
                            <practice.icon className="w-6 h-6 text-emerald-400 mb-4" />
                            <h3 className="font-semibold text-foreground mb-2">{practice.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{practice.description}</p>
                        </div>
                    ))}
                </div>

                {/* Bug Bounty */}
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8 mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <Bug className="w-7 h-7 text-emerald-400" />
                        <div>
                            <h2 className="text-2xl font-bold">Bug Bounty Program</h2>
                            <p className="text-sm text-muted-foreground">Earn up to $50,000 for critical discoveries in our cryptographic implementation.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {bountyTiers.map((tier) => (
                            <div key={tier.severity} className={`p-4 rounded-xl border ${tier.border} ${tier.bg}`}>
                                <p className={`text-sm font-bold ${tier.color} mb-1`}>{tier.severity}</p>
                                <p className="text-lg font-bold text-foreground mb-2">{tier.reward}</p>
                                <p className="text-[10px] text-muted-foreground">{tier.example}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Responsible Disclosure */}
                <div className="rounded-2xl border border-border/50 bg-card/30 p-8 mb-16">
                    <h2 className="text-xl font-bold mb-4">Responsible Disclosure</h2>
                    <div className="space-y-3">
                        {[
                            "Email security findings to security@aegis-agent.com",
                            "Include a detailed description with steps to reproduce",
                            "Allow up to 5 business days for initial response",
                            "Do not publicly disclose until a patch is released",
                            "We will credit you publicly (with your permission) in our security advisories",
                        ].map((step, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-muted-foreground">{step}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center rounded-2xl border border-primary/20 bg-primary/5 p-12">
                    <h2 className="text-2xl font-bold mb-3">Need a compliance report?</h2>
                    <p className="text-muted-foreground mb-6">
                        Enterprise customers can request SOC 2, ISO 27001, and penetration test reports under NDA.
                    </p>
                    <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-colors">
                        Contact Security Team <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </main>
            <PublicFooter />
        </div>
    );
}
