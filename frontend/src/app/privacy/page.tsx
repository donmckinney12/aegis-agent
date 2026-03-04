import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background selection:bg-primary/30">
            <PublicNavbar />
            <main className="pt-32 pb-24 px-6 md:px-12 max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold tracking-tight mb-8">
                    Privacy Policy
                </h1>
                <div className="prose prose-invert prose-indigo max-w-none">
                    <p className="text-muted-foreground">Last updated: March 4, 2026</p>

                    <h2 className="text-xl font-semibold mt-8 mb-4 text-foreground">1. Data Minimization By Design</h2>
                    <p className="text-foreground/80 leading-relaxed mb-6">
                        As a zero-trust platform, we adhere to absolute data minimization. We do not inspect the payloads of your agent's API requests. We only capture the required metadata (source IP, SPIFFE ID, target resource) necessary to evaluate OPA policies and enforce your security boundaries.
                    </p>

                    <h2 className="text-xl font-semibold mt-8 mb-4 text-foreground">2. Information Collection</h2>
                    <p className="text-foreground/80 leading-relaxed mb-6">
                        We collect billing information and organization administrator emails via our payment processor (Stripe) and identity provider (Clerk) explicitly for the provisioning of SaaS services.
                    </p>

                    <h2 className="text-xl font-semibold mt-8 mb-4 text-foreground">3. GDPA and CCPA Compliance</h2>
                    <p className="text-foreground/80 leading-relaxed">
                        You retain full ownership of your agent telemetry. You may export or purge your compliance logs via the dashboard or API at any instant. Address all data deletion requests to our DPO at privacy@aegis-agent.id.
                    </p>
                </div>
            </main>
            <PublicFooter />
        </div>
    );
}
