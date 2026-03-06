import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { ArrowRight, Clock, User, BookOpen, Zap, Shield, Code, Newspaper } from "lucide-react";

const featuredPost = {
    title: "Announcing Aegis-Agent ID v5.0: The Enterprise Upgrade",
    excerpt: "Today we are thrilled to announce the general availability of v5.0, featuring multi-region clustering, live threat intelligence heuristics, SOC 2 enforcement out of the box, and a completely redesigned dashboard experience.",
    date: "March 1, 2026",
    category: "Product Updates",
    readTime: "5 min read",
    author: "Aegis Engineering Team",
    color: "text-primary",
    border: "border-primary/20",
    bg: "bg-primary/5",
};

const posts = [
    {
        title: "Why Static API Keys Will Fail the Agentic Era",
        excerpt: "As autonomous systems scale to thousands of instances, manually rotating API keys becomes a critical vulnerability. Discover how SPIFFE solves the secret zero problem.",
        date: "February 28, 2026",
        category: "Architecture",
        readTime: "8 min read",
        author: "Dr. Elena Rostova",
        icon: Shield,
        color: "text-emerald-400",
    },
    {
        title: "Enforcing Rego Policies at Sub-Millisecond Speeds",
        excerpt: "Deep dive into the Aegis Control Plane. We explain how our embedded Go OPA engine processes complex RBAC and ABAC rules faster than LLM token generation.",
        date: "February 15, 2026",
        category: "Engineering",
        readTime: "12 min read",
        author: "James Chen",
        icon: Code,
        color: "text-cyan-400",
    },
    {
        title: "Zero-Trust for AI: Beyond Traditional Identity",
        excerpt: "Traditional zero-trust models weren't designed for AI agents that scale horizontally, communicate peer-to-peer, and make autonomous decisions. Here's how we rethought the model.",
        date: "February 5, 2026",
        category: "Research",
        readTime: "10 min read",
        author: "Sarah Kim",
        icon: Shield,
        color: "text-violet-400",
    },
    {
        title: "Building a SPIFFE-Compatible CA in Pure Go",
        excerpt: "Walk through how we built a fully SPIFFE-compliant certificate authority using Go's crypto/x509 and crypto/ecdsa packages — no external dependencies required.",
        date: "January 22, 2026",
        category: "Engineering",
        readTime: "15 min read",
        author: "James Chen",
        icon: Code,
        color: "text-cyan-400",
    },
    {
        title: "The Cost of LLM Agent Sprawl (And How to Control It)",
        excerpt: "When every microservice spawns its own LLM agents, token costs explode. We built per-agent cost attribution into the Aegis dashboard to solve this.",
        date: "January 10, 2026",
        category: "Product",
        readTime: "7 min read",
        author: "Marcus Wong",
        icon: Zap,
        color: "text-amber-400",
    },
    {
        title: "How We Migrated from SQLite to PostgreSQL in Production",
        excerpt: "A candid post-mortem on migrating our control plane from embedded SQLite to managed PostgreSQL on Fly.io — zero downtime, with pgxpool connection pooling.",
        date: "December 28, 2025",
        category: "Engineering",
        readTime: "9 min read",
        author: "Aegis Infrastructure Team",
        icon: Code,
        color: "text-cyan-400",
    },
];

const categories = ["All", "Engineering", "Architecture", "Product", "Research", "Product Updates"];

export default function BlogPage() {
    return (
        <div className="min-h-screen bg-background selection:bg-primary/30">
            <PublicNavbar />

            <main className="pt-32 pb-24 px-6 md:px-12 max-w-6xl mx-auto">
                {/* Hero */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                            <Newspaper className="w-5 h-5 text-indigo-400" />
                        </div>
                        <span className="text-xs font-medium text-indigo-400 uppercase tracking-widest">Blog</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                        Engineering <span className="aegis-gradient-text">Journal</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl">
                        Insights on cryptography, workload identity, and building zero-trust infrastructure for autonomous AI.
                    </p>
                </div>

                {/* Category Tabs */}
                <div className="flex flex-wrap gap-2 mb-12">
                    {categories.map((cat, i) => (
                        <button
                            key={cat}
                            className={`px-4 py-2 rounded-full text-xs font-medium border transition-colors ${i === 0
                                    ? "bg-primary/10 text-primary border-primary/20"
                                    : "bg-card/30 text-muted-foreground border-border/50 hover:bg-card/60 hover:text-foreground"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Featured Post */}
                <article className={`group cursor-pointer p-8 md:p-10 rounded-3xl border ${featuredPost.border} ${featuredPost.bg} mb-12 hover:shadow-[0_0_40px_rgba(99,102,241,0.08)] transition-all`}>
                    <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground mb-4">
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full border border-primary/20">
                            ⭐ Featured
                        </span>
                        <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20">
                            {featuredPost.category}
                        </span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{featuredPost.readTime}</span>
                    </div>

                    <h2 className="text-2xl md:text-4xl font-bold mb-4 group-hover:text-primary transition-colors">
                        {featuredPost.title}
                    </h2>

                    <p className="text-muted-foreground text-lg leading-relaxed mb-6 max-w-3xl">
                        {featuredPost.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="w-4 h-4" />
                            {featuredPost.author}
                            <span className="text-muted-foreground/50">·</span>
                            {featuredPost.date}
                        </div>
                        <div className="flex items-center text-sm font-semibold text-primary group-hover:translate-x-1 transition-transform">
                            Read Article <ArrowRight className="w-4 h-4 ml-2" />
                        </div>
                    </div>
                </article>

                {/* Post Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                    {posts.map((post) => (
                        <article
                            key={post.title}
                            className="group cursor-pointer p-6 rounded-2xl border border-border/50 bg-card/30 hover:bg-card/60 hover:border-indigo-500/20 transition-all"
                        >
                            <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground mb-4">
                                <span className={`px-2.5 py-0.5 rounded-full border border-border/50 ${post.color}`}>
                                    {post.category}
                                </span>
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                            </div>

                            <h3 className="text-lg font-bold mb-3 group-hover:text-indigo-400 transition-colors leading-snug">
                                {post.title}
                            </h3>

                            <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                                {post.excerpt}
                            </p>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <User className="w-3.5 h-3.5" />
                                    {post.author}
                                </div>
                                <span className="text-xs text-muted-foreground">{post.date}</span>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Newsletter CTA */}
                <div className="text-center rounded-2xl border border-primary/20 bg-primary/5 p-12">
                    <BookOpen className="w-8 h-8 text-primary mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-3">Stay in the loop</h2>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        Get the latest on AI agent security, zero-trust architecture, and Aegis product updates.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="you@company.com"
                            className="flex-1 px-4 py-3 rounded-full bg-background border border-border/50 text-sm focus:outline-none focus:border-primary/50"
                        />
                        <button className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-colors text-sm">
                            Subscribe
                        </button>
                    </div>
                </div>
            </main>

            <PublicFooter />
        </div>
    );
}
