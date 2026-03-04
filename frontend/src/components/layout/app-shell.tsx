"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const isMarketingOrAuth = pathname === "/" || pathname?.startsWith("/sign-");

    if (isMarketingOrAuth) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-background">
            <Sidebar />
            <div className="pl-[240px] transition-all duration-300">
                <Topbar />
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}
