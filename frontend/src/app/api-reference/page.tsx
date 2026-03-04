import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";

export default function ApiReferencePage() {
    return (
        <div className="min-h-screen bg-background selection:bg-primary/30">
            <PublicNavbar />
            <main className="pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-cyan-400">
                    API Reference
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                    Integrate Aegis directly into your CI/CD pipelines and infrastructure headless through our REST and gRPC endpoints.
                </p>
                <div className="p-8 rounded-2xl border border-border/50 bg-card/50">
                    <pre className="text-xs text-muted-foreground overflow-x-auto bg-background p-4 rounded-lg border border-border">
                        {`GET /api/v1/agents
Authorization: Bearer <token>

{
  "data": [
    {
      "id": "ag_123",
      "spiffe_id": "spiffe://aegis.local/agent/trading-bot",
      "status": "active"
    }
  ]
}`}
                    </pre>
                </div>
            </main>
            <PublicFooter />
        </div>
    );
}
