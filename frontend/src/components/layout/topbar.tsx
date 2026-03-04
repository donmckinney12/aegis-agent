"use client";

import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { UserButton, OrganizationSwitcher } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export function Topbar() {
    return (
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 border-b border-border bg-background/80 backdrop-blur-xl">
            {/* Search */}
            <div className="flex items-center gap-3 flex-1 max-w-md">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search agents, policies, events..."
                        className="pl-9 bg-muted/50 border-border/50 focus:border-primary/50 h-9 text-sm"
                    />
                </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
                {/* System Status */}
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-400/10 border border-emerald-400/20">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-medium text-emerald-400">
                        All Systems Operational
                    </span>
                </div>

                {/* Notifications */}
                <button className="relative p-2 rounded-lg hover:bg-accent transition-colors">
                    <Bell className="w-[18px] h-[18px] text-muted-foreground" />
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-400" />
                </button>

                {/* Clerk Auth */}
                <div className="flex items-center gap-4 pl-4 border-l border-border h-8">
                    <OrganizationSwitcher
                        appearance={{
                            baseTheme: dark,
                            elements: { organizationSwitcherTrigger: "focus:shadow-none" }
                        }}
                    />
                    <UserButton
                        appearance={{ baseTheme: dark }}
                        afterSignOutUrl="/sign-in"
                    />
                </div>
            </div>
        </header>
    );
}
