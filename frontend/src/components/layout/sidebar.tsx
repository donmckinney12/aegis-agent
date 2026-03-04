"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    LineChart,
    Bot,
    Users,
    Key,
    Network,
    Shield,
    Crosshair,
    CheckCircle,
    FileText,
    Webhook,
    Activity,
    Settings,
    CreditCard,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navGroups = [
    {
        label: "Overview",
        items: [
            { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
            { href: "/analytics", label: "Analytics & Reports", icon: LineChart },
        ],
    },
    {
        label: "Access & Identity",
        items: [
            { href: "/agents", label: "Agent Registry", icon: Bot },
            { href: "/access", label: "Access Management", icon: Users },
            { href: "/api-keys", label: "API Keys & Tokens", icon: Key },
        ],
    },
    {
        label: "Security & Governance",
        items: [
            { href: "/trust-graph", label: "Trust Graph", icon: Network },
            { href: "/policies", label: "Policy Engine", icon: Shield },
            { href: "/threats", label: "Threat Intel", icon: Crosshair },
            { href: "/compliance", label: "Compliance", icon: CheckCircle },
        ],
    },
    {
        label: "Ops & Integrations",
        items: [
            { href: "/audit", label: "Audit Trail", icon: FileText },
            { href: "/integrations", label: "Webhooks", icon: Webhook },
            { href: "/infrastructure", label: "Infrastructure", icon: Activity },
        ],
    },
    {
        label: "Administration",
        items: [
            { href: "/settings", label: "Settings", icon: Settings },
            { href: "/billing", label: "Billing & Usage", icon: CreditCard },
        ],
    },
];

export function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <motion.aside
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className={cn(
                "fixed left-0 top-0 z-40 h-screen border-r border-border bg-sidebar/80 backdrop-blur-xl transition-all duration-300 flex flex-col shadow-2xl",
                collapsed ? "w-[68px]" : "w-[240px]"
            )}
        >
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 px-4 h-16 border-b border-border/50 flex-shrink-0 hover:bg-white/5 transition-colors relative group">
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)] group-hover:scale-105 transition-transform">
                    <Shield className="w-5 h-5 text-white" />
                </div>
                {!collapsed && (
                    <div className="overflow-hidden">
                        <h1 className="text-sm font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                            AEGIS
                        </h1>
                        <p className="text-[10px] text-primary/80 font-bold tracking-widest uppercase mt-0.5">
                            Agent ID
                        </p>
                    </div>
                )}
            </Link>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-4 scrollbar-hide relative">
                <nav className="space-y-6 px-3">
                    {navGroups.map((group, i) => (
                        <div key={i} className="flex flex-col gap-1 relative">
                            {!collapsed && (
                                <p className="px-3 mb-2 text-[10px] font-bold tracking-widest text-muted-foreground/50 uppercase hidden md:block">
                                    {group.label}
                                </p>
                            )}
                            {group.items.map((item) => {
                                const isActive =
                                    pathname === item.href ||
                                    (item.href !== "/" && pathname.startsWith(item.href));
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        title={collapsed ? item.label : undefined}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden",
                                            isActive
                                                ? "text-primary shadow-[0_4px_20px_-4px_rgba(99,102,241,0.2)]"
                                                : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="active-sidebar-tab"
                                                className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl"
                                                initial={false}
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        )}
                                        <item.icon
                                            className={cn(
                                                "w-[18px] h-[18px] flex-shrink-0 transition-colors relative z-10",
                                                isActive
                                                    ? "text-primary"
                                                    : "text-muted-foreground group-hover:text-foreground"
                                            )}
                                        />
                                        {!collapsed && <span className="truncate relative z-10 tracking-wide">{item.label}</span>}
                                        {isActive && !collapsed && (
                                            <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_currentColor] animate-pulse relative z-10" />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    ))}
                </nav>
            </div>

            {/* Collapse Button */}
            <div className="p-3 border-t border-border/50 mt-auto flex-shrink-0 bg-sidebar/50 backdrop-blur-md">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                    {collapsed ? (
                        <ChevronRight className="w-4 h-4" />
                    ) : (
                        <>
                            <ChevronLeft className="w-4 h-4" />
                            <span>Collapse</span>
                        </>
                    )}
                </button>
            </div>
        </motion.aside>
    );
}
