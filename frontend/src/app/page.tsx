"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Bot, Zap, Globe, Lock, Code, ChevronRight, CheckCircle2 } from "lucide-react";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">

      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden px-6">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-400/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 mb-8 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-xs font-semibold text-indigo-300">Aegis-Agent ID v5.0 is Live</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            Zero-Trust Identity for <br />
            <span className="aegis-gradient-text">Autonomous AI Agents</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            The enterprise control plane for the Agentic Era. Cryptographically verify, authorize, and govern your AI workforce using SPIFFE/SPIRE and OPA at sub-millisecond latency.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="h-12 px-8 bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 rounded-full text-base w-full sm:w-auto">
              <Link href="/sign-up">
                Start Free Trial
                <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-8 rounded-full text-base bg-background/50 backdrop-blur-md border-border/50 hover:bg-muted w-full sm:w-auto">
              <Link href="/contact">
                Contact Sales
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 bg-muted/20 border-y border-border/50 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Enterprise-Grade by Design</h2>
            <p className="text-muted-foreground w-full max-w-2xl mx-auto mb-6">
              Everything you need to secure a complex mesh of AI microservices and autonomous agents communicating across un-trusted networks.
            </p>
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/features">
                Explore Platform Architecture <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "SPIFFE Workload Identity", desc: "Short-lived cryptographic X.509 SVIDs generated automatically. No static API keys to rotate or leak.", color: "text-indigo-400", bg: "bg-indigo-500/10" },
              { icon: Lock, title: "OPA Policy Engine", desc: "Write Rego policies to tightly control exactly which APIs and resources each AI agent can access.", color: "text-cyan-400", bg: "bg-cyan-500/10" },
              { icon: Bot, title: "Anomaly Detection", desc: "ML-powered threat intelligence instantly quarantines agents exhibiting unexpected request patterns.", color: "text-purple-400", bg: "bg-purple-500/10" },
              { icon: Zap, title: "Sub-Millisecond Engine", desc: "Built in Go (Golang) and Rust. Designed to verify trust faster than the fastest LLMs generate tokens.", color: "text-amber-400", bg: "bg-amber-500/10" },
              { icon: Globe, title: "Global Multi-Region", desc: "Deploy your control plane across multiple AWS/GCP regions for 99.99% high-availability.", color: "text-emerald-400", bg: "bg-emerald-500/10" },
              { icon: Code, title: "Developer Headless APIs", desc: "Fully scriptable REST & gRPC endpoints with Terraform providers for CI/CD integration.", color: "text-rose-400", bg: "bg-rose-500/10" },
            ].map((f, i) => (
              <div key={i} className="p-6 rounded-2xl border border-border/50 bg-card/50 hover:bg-card/80 transition-colors hover:border-primary/30 group">
                <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center ${f.bg} group-hover:scale-110 transition-transform`}>
                  <f.icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Compliance */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Trust is our currency.<br />Prove it to your auditors.</h2>
            <p className="text-lg text-muted-foreground mb-4">
              Aegis continuously monitors its own infrastructure and your agent configurations to mathematically prove compliance.
            </p>
            <Link href="/about" className="text-primary hover:underline text-sm font-medium flex items-center mb-4 transition-colors">
              Learn about our Mission & Values <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
            <ul className="space-y-4 pt-4">
              {["SOC 2 Type II Certified", "ISO 27001 Compliant", "HIPAA BAA Ready", "GDPR Data Processing Controls"].map((item) => (
                <li key={item} className="flex items-center gap-3 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex-1 relative w-full h-full min-h-[400px] rounded-2xl border border-border/50 bg-card/50 overflow-hidden glass shadow-2xl backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent" />
            <div className="p-8 h-full flex flex-col justify-center gap-6">
              <div className="flex items-center justify-between p-4 rounded-xl bg-background/80 border border-border/50">
                <div className="flex items-center gap-3"><Shield className="text-emerald-400" /> SOC 2 Type II</div>
                <div className="text-emerald-400 font-mono">100% Pass</div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-background/80 border border-border/50">
                <div className="flex items-center gap-3"><Lock className="text-cyan-400" /> ISO 27001</div>
                <div className="text-cyan-400 font-mono">100% Pass</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing & Blog Links */}
      <section className="py-24 px-6 bg-muted/20 border-y border-border/50 relative">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 text-center md:text-left">
          <div className="space-y-6 p-8 rounded-3xl border border-primary/20 bg-primary/5">
            <h3 className="text-2xl font-bold tracking-tight text-primary">Transparent Pricing</h3>
            <p className="text-muted-foreground">Scale from 5 to 50,000 agents securely without surprise bills.</p>
            <Button asChild variant="outline" className="rounded-full bg-background border-primary/30 hover:bg-primary/10">
              <Link href="/pricing" className="inline-block mt-4">
                View Pricing Plans
              </Link>
            </Button>
          </div>
          <div className="space-y-6 p-8 rounded-3xl border border-indigo-500/20 bg-indigo-500/5">
            <h3 className="text-2xl font-bold tracking-tight text-indigo-400">Engineering Journal</h3>
            <p className="text-muted-foreground">Read our latest research on cryptography, SPIFFE, and zero-trust.</p>
            <Button asChild variant="outline" className="rounded-full bg-background border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10">
              <Link href="/blog" className="inline-block mt-4">
                Read the Blog
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA / Contact */}
      <section id="contact" className="py-24 px-6 relative">
        <div className="max-w-4xl mx-auto text-center p-12 rounded-3xl border border-indigo-500/20 bg-indigo-500/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Ready to secure your agents?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Whether you are running 10 autonomous researchers or 10,000 algorithmic traders, Aegis provides absolute zero-trust guarantees.
            </p>
            <Button asChild size="lg" className="h-14 px-10 bg-white text-indigo-950 hover:bg-white/90 rounded-full text-lg shadow-[0_0_40px_rgba(255,255,255,0.3)] font-semibold transition-all hover:scale-105">
              <Link href="/sign-up">
                Join the Private Beta
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
