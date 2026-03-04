import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";

export default function CareersPage() {
    return (
        <div className="min-h-screen bg-background selection:bg-primary/30">
            <PublicNavbar />
            <main className="pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-indigo-400">
                    Careers at Aegis
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                    Help us build the absolute final layer of defense for the Agentic Era. We are hiring distributed systems experts across the globe.
                </p>

                <div className="space-y-4">
                    {[
                        { title: "Senior Rust Engineer", team: "Core Cryptography", type: "Remote (US)" },
                        { title: "Staff Go Engineer", team: "Control Plane", type: "San Francisco, CA" },
                        { title: "Security Researcher", team: "Threat Intel", type: "Remote (Global)" }
                    ].map((job, i) => (
                        <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-2xl border border-border/50 bg-card/50 hover:border-indigo-500/30 transition-colors cursor-pointer">
                            <div>
                                <h3 className="font-semibold text-foreground">{job.title}</h3>
                                <p className="text-sm text-muted-foreground">{job.team}</p>
                            </div>
                            <div className="mt-4 sm:mt-0 text-sm font-medium text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 inline-block text-center w-fit">
                                {job.type}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <PublicFooter />
        </div>
    );
}
