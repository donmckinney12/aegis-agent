import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function BlogPage() {
    const posts = [
        {
            id: 1,
            title: "Why Static API Keys Will Fail the Agentic Era",
            excerpt: "As autonomous systems scale to thousands of instances, manually rotating API keys becomes a critical vulnerability. Discover how SPIFFE solves the secret zero problem.",
            date: "March 1, 2026",
            category: "Architecture",
            readTime: "8 min read",
            author: "Dr. Elena Rostova",
        },
        {
            id: 2,
            title: "Enforcing Rego Policies at Sub-Millisecond Speeds",
            excerpt: "Deep dive into the Aegis Control Plane. We explain how our embedded Rust and Go OPA engines process complex RBAC and ABAC rules faster than LLM token generation.",
            date: "February 15, 2026",
            category: "Engineering",
            readTime: "12 min read",
            author: "James Chen",
        },
        {
            id: 3,
            title: "Announcing Aegis-Agent ID v5.0: The Enterprise Upgrade",
            excerpt: "Today we are thrilled to announce the general availability of v5.0, featuring multi-region clustering, live threat intelligence heuristics, and SOC 2 enforcement out of the box.",
            date: "February 2, 2026",
            category: "Product Updates",
            readTime: "5 min read",
            author: "Aegis Flow Team",
        }
    ];

    return (
        <div className="min-h-screen bg-background selection:bg-primary/30">
            <PublicNavbar />

            <main className="pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto">
                <div className="mb-16">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 mt-8">
                        Engineering <span className="aegis-gradient-text">Journal</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl">
                        Insights on cryptography, workload identity, and building zero-trust infrastructure for autonomous AI.
                    </p>
                </div>

                <div className="space-y-12">
                    {posts.map((post) => (
                        <article key={post.id} className="group cursor-pointer block p-8 rounded-3xl border border-border/50 bg-card/30 hover:bg-card/80 transition-all hover:shadow-[0_0_30px_rgba(99,102,241,0.05)] hover:border-indigo-500/20">
                            <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground mb-4">
                                <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20">{post.category}</span>
                                <span>{post.date}</span>
                                <span>•</span>
                                <span>{post.readTime}</span>
                            </div>

                            <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-indigo-400 transition-colors">
                                {post.title}
                            </h2>

                            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                                {post.excerpt}
                            </p>

                            <div className="flex items-center justify-between">
                                <div className="text-sm font-medium text-foreground">
                                    By {post.author}
                                </div>
                                <div className="flex items-center text-sm font-semibold text-primary group-hover:translate-x-1 transition-transform">
                                    Read Article <ArrowRight className="w-4 h-4 ml-2" />
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </main>

            <PublicFooter />
        </div>
    );
}
