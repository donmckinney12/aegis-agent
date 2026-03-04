import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";

export default function DocsPage() {
    return (
        <div className="min-h-screen bg-background selection:bg-primary/30">
            <PublicNavbar />
            <main className="pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-primary">
                    Documentation
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                    Welcome to the Aegis-Agent ID platform documentation. Here you will find comprehensive guides on configuring SPIFFE, writing Rego policies, and deploying our control plane.
                </p>
                <div className="p-8 rounded-2xl border border-border/50 bg-card/50">
                    <h2 className="text-xl font-semibold mb-4 text-foreground">Quickstart</h2>
                    <ul className="space-y-2 text-muted-foreground list-disc pl-5">
                        <li>Setting up your first Organization</li>
                        <li>Generating long-lived API keys</li>
                        <li>Connecting the Go SDK to your microservices</li>
                    </ul>
                </div>
            </main>
            <PublicFooter />
        </div>
    );
}
