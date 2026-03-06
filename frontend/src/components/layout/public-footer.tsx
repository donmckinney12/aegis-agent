import Link from "next/link";
import { Shield } from "lucide-react";

export function PublicFooter() {
    return (
        <footer className="border-t border-border/50 bg-muted/10 py-12 px-6 mt-24">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="col-span-1 md:col-span-1">
                    <div className="flex items-center gap-2 mb-4">
                        <Shield className="w-5 h-5 text-primary" />
                        <span className="font-bold tracking-tight text-lg">AEGIS</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Zero-Trust Identity Control Plane for the Agentic Era.
                    </p>
                </div>
                <div>
                    <h4 className="font-semibold mb-4 text-sm mt-2">Platform</h4>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                        <li><Link href="/features" className="hover:text-primary transition-colors">Features</Link></li>
                        <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                        <li><Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
                        <li><Link href="/sign-in" className="hover:text-primary transition-colors">Sign In</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold mb-4 text-sm mt-2">Resources</h4>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                        <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                        <li><Link href="/docs" className="hover:text-primary transition-colors">Documentation</Link></li>
                        <li><Link href="/api-reference" className="hover:text-primary transition-colors">API Reference</Link></li>
                        <li><Link href="/security" className="hover:text-primary transition-colors">Security Posture</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold mb-4 text-sm mt-2">Company</h4>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                        <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                        <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Sales</Link></li>
                        <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
                        <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                        <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                    </ul>
                </div>
            </div>
            <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-border/50 text-center text-xs text-muted-foreground flex flex-col sm:flex-row justify-between items-center">
                <p>© 2026 Aegis Security Inc. All rights reserved.</p>
                <div className="mt-4 sm:mt-0 space-x-4">
                    <span>Powered by SPIFFE</span>
                    <span>Backed by OPA</span>
                </div>
            </div>
        </footer>
    );
}
