import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { FileText } from "lucide-react";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background selection:bg-primary/30">
            <PublicNavbar />
            <main className="pt-32 pb-24 px-6 md:px-12 max-w-3xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
                        <p className="text-xs text-muted-foreground">Last updated: March 5, 2026</p>
                    </div>
                </div>

                <div className="space-y-8 text-foreground/80 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold mb-3 text-foreground">1. Acceptance of Terms</h2>
                        <p>
                            By accessing or using the Aegis-Agent ID platform (&quot;Service&quot;), you agree to be bound by these Terms of Service. If you are using the Service on behalf of an organization, you represent that you have the authority to bind that organization to these terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3 text-foreground">2. Description of Service</h2>
                        <p>
                            Aegis-Agent ID provides a zero-trust identity control plane for AI agents, including SPIFFE-based X.509 certificate issuance, OPA/Rego policy evaluation, audit logging, and related infrastructure services. The Service is provided as a cloud-hosted SaaS platform with optional self-hosted deployment.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3 text-foreground">3. Account Registration</h2>
                        <p className="mb-3">
                            You must provide accurate and complete information when creating an account. You are responsible for maintaining the security of your account credentials and for all activities that occur under your account.
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                            <li>You must be at least 18 years old to use the Service</li>
                            <li>One person or legal entity may maintain no more than one free account</li>
                            <li>You are responsible for all content posted and activity under your account</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3 text-foreground">4. Subscription & Billing</h2>
                        <p className="mb-3">
                            Paid plans are billed in advance on a monthly or annual basis. All fees are non-refundable except as required by law. We reserve the right to modify pricing with 30 days written notice.
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                            <li><strong>Developer Tier:</strong> Free, limited to 5 agent identities and 1,000 API requests/minute</li>
                            <li><strong>Growth Tier:</strong> $49/month or $470/year, up to 100 agent identities</li>
                            <li><strong>Enterprise Tier:</strong> $199/month or $1,990/year, unlimited agent identities with dedicated support</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3 text-foreground">5. Acceptable Use</h2>
                        <p className="mb-3">You agree not to:</p>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                            <li>Use the Service for any unlawful purpose or to violate any regulations</li>
                            <li>Attempt to gain unauthorized access to any part of the Service</li>
                            <li>Interfere with or disrupt the integrity or performance of the Service</li>
                            <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
                            <li>Use the Service to build a competing product or service</li>
                            <li>Exceed rate limits or abuse API endpoints through automated means</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3 text-foreground">6. Data Ownership & Security</h2>
                        <p>
                            You retain all ownership rights to your data, including agent configurations, policy definitions, and audit logs. We will not access your data except as necessary to provide the Service, comply with law, or as otherwise authorized by you. All data is encrypted at rest (AES-256) and in transit (TLS 1.3).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3 text-foreground">7. Service Level Agreement</h2>
                        <p>
                            Enterprise customers are entitled to a 99.99% uptime SLA, measured monthly. In the event of downtime exceeding the SLA, customers may request service credits equal to 10% of their monthly fee per hour of downtime, up to a maximum of 100% of the monthly fee.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3 text-foreground">8. Limitation of Liability</h2>
                        <p>
                            To the maximum extent permitted by law, Aegis-Agent ID shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3 text-foreground">9. Termination</h2>
                        <p>
                            Either party may terminate these terms at any time. Upon termination, your right to access the Service ceases immediately. We will make your data available for export for 30 days following termination. After that period, we may delete your data in accordance with our data retention policies.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3 text-foreground">10. Governing Law</h2>
                        <p>
                            These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions. Any disputes arising under these terms shall be resolved in the state or federal courts located in San Francisco County, California.
                        </p>
                    </section>

                    <section className="pt-4 border-t border-border/50">
                        <p className="text-sm text-muted-foreground">
                            Questions about these terms? Contact us at <a href="mailto:legal@aegis-agent.com" className="text-primary hover:underline">legal@aegis-agent.com</a>.
                        </p>
                    </section>
                </div>
            </main>
            <PublicFooter />
        </div>
    );
}
