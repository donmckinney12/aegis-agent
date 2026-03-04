import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { ShieldCheck } from "lucide-react";

export default function SecurityPage() {
    return (
        <div className="min-h-screen bg-background selection:bg-primary/30">
            <PublicNavbar />
            <main className="pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-emerald-400 flex items-center gap-4">
                    <ShieldCheck className="w-10 h-10" /> Security Posture
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                    Transparency is the foundation of Trust. Aegis undergoes continuous penetration testing and maintains SOC 2 Type II and ISO 27001 compliance.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
                        <h3 className="font-semibold text-emerald-400 mb-2">Bug Bounty Program</h3>
                        <p className="text-sm text-foreground/80">Earn up to $50,000 for critical zero-day discoveries in our cryptographic implementation.</p>
                    </div>
                    <div className="p-6 rounded-2xl border border-border/50 bg-card/50">
                        <h3 className="font-semibold text-foreground mb-2">Compliance Reports</h3>
                        <p className="text-sm text-foreground/80">Available upon request under NDA across our Enterprise portal.</p>
                    </div>
                </div>
            </main>
            <PublicFooter />
        </div>
    );
}
