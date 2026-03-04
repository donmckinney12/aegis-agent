import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export function PublicNavbar() {
    return (
        <nav className="fixed top-0 inset-x-0 z-50 h-16 border-b border-border bg-background/80 backdrop-blur-xl flex items-center justify-between px-6 md:px-12">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center aegis-glow-sm">
                    <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold tracking-tight aegis-gradient-text text-lg hidden sm:inline-block">AEGIS</span>
            </Link>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground mr-8">
                <Link href="/features" className="hover:text-foreground transition-colors">Features</Link>
                <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
                <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            </div>

            <div className="flex items-center gap-4">
                <SignedOut>
                    <Button asChild variant="ghost" className="text-sm">
                        <Link href="/sign-in">Sign In</Link>
                    </Button>
                    <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 aegis-glow-sm">
                        <Link href="/sign-up">Get Started</Link>
                    </Button>
                </SignedOut>
                <SignedIn>
                    <Button asChild variant="ghost" className="text-sm mr-2">
                        <Link href="/dashboard">Dashboard</Link>
                    </Button>
                    <UserButton afterSignOutUrl="/" />
                </SignedIn>
            </div>
        </nav>
    );
}
