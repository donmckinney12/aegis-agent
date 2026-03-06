"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, Shield, ShieldCheck, ShieldOff, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { AdminGuard } from "@/components/layout/admin-guard";

const initialUsers = [
    { id: "usr-01", name: "Alice Chen", email: "alice@company.com", role: "Admin", team: "Platform", status: "Active", lastLogin: "5 minutes ago", mfa: true },
    { id: "usr-02", name: "Bob Martinez", email: "bob@company.com", role: "Security Lead", team: "SecOps", status: "Active", lastLogin: "1 hour ago", mfa: true },
    { id: "usr-03", name: "Carla Kim", email: "carla@company.com", role: "Developer", team: "AI/ML", status: "Active", lastLogin: "3 hours ago", mfa: true },
    { id: "usr-04", name: "Derek Patel", email: "derek@company.com", role: "Viewer", team: "Compliance", status: "Active", lastLogin: "1 day ago", mfa: false },
    { id: "usr-05", name: "Evan Wright", email: "evan@company.com", role: "Developer", team: "App Delivery", status: "Inactive", lastLogin: "2 months ago", mfa: false },
];

export default function AccessManagementPage() {
    const [users, setUsers] = useState(initialUsers);

    const handleToggleMFA = (id: string, name: string, currentMfa: boolean) => {
        setUsers(prev => prev.map(u =>
            u.id === id ? { ...u, mfa: !currentMfa } : u
        ));
        if (!currentMfa) {
            toast.success(`MFA enabled for ${name}`, {
                description: "User will be prompted to set up two-factor authentication on next login.",
            });
        } else {
            toast.warning(`MFA disabled for ${name}`, {
                description: "This reduces account security. Consider re-enabling MFA.",
            });
        }
    };

    const handleToggleStatus = (id: string, name: string, currentStatus: string) => {
        const newStatus = currentStatus === "Active" ? "Suspended" : "Active";
        setUsers(prev => prev.map(u =>
            u.id === id ? { ...u, status: newStatus } : u
        ));
        if (newStatus === "Suspended") {
            toast.error(`${name} has been suspended`, {
                description: "Their access tokens will be invalidated within 60 seconds.",
            });
        } else {
            toast.success(`${name} reactivated`, {
                description: "Full access has been restored to their account.",
            });
        }
    };

    const handleInviteUser = () => {
        const newUser = {
            id: `usr-${String(users.length + 1).padStart(2, "0")}`,
            name: "Pending Invite",
            email: "invite-pending@company.com",
            role: "Viewer",
            team: "Unassigned",
            status: "Invited",
            lastLogin: "Never",
            mfa: false,
        };
        setUsers(prev => [newUser, ...prev]);
        toast.success("📧 Invitation sent", {
            description: "A new user invitation has been dispatched. They have 48 hours to accept.",
        });
    };

    return (
        <AdminGuard featureName="Access Management">
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Access Management</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Manage users, roles, and multi-factor authentication across your organization.
                        </p>
                    </div>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleInviteUser}>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Invite User
                    </Button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-border/50 bg-card/50">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Users</p>
                                    <p className="text-2xl font-bold">{users.length}</p>
                                </div>
                                <Users className="w-8 h-8 text-primary opacity-50" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-border/50 bg-card/50">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">MFA Enabled</p>
                                    <p className="text-2xl font-bold text-emerald-400">{users.filter(u => u.mfa).length}/{users.length}</p>
                                </div>
                                <ShieldCheck className="w-8 h-8 text-emerald-400 opacity-50" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-border/50 bg-card/50">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Active Sessions</p>
                                    <p className="text-2xl font-bold text-cyan-400">{users.filter(u => u.status === "Active").length}</p>
                                </div>
                                <Shield className="w-8 h-8 text-cyan-400 opacity-50" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Users Table */}
                <Card className="border-border/50 bg-card/50">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Users className="w-4 h-4 text-primary" />
                            Organization Members
                        </CardTitle>
                        <CardDescription>View and manage user roles, MFA enforcement, and access status.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border border-border/50 overflow-hidden">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Team</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>MFA</TableHead>
                                        <TableHead>Last Active</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((u) => (
                                        <TableRow key={u.id} className="hover:bg-muted/30 group">
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-sm">{u.name}</span>
                                                    <span className="text-xs text-muted-foreground">{u.email}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={cn(
                                                    "text-[10px]",
                                                    u.role === "Admin" && "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
                                                    u.role === "Security Lead" && "bg-red-500/10 text-red-400 border-red-500/20",
                                                    u.role === "Developer" && "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
                                                    u.role === "Viewer" && "bg-muted text-muted-foreground",
                                                )}>
                                                    {u.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">{u.team}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={cn(
                                                    "text-[10px]",
                                                    u.status === "Active" && "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                                                    u.status === "Inactive" && "bg-muted text-muted-foreground",
                                                    u.status === "Suspended" && "bg-red-500/10 text-red-400 border-red-500/20",
                                                    u.status === "Invited" && "bg-amber-500/10 text-amber-400 border-amber-500/20",
                                                )}>
                                                    {u.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <button onClick={() => handleToggleMFA(u.id, u.name, u.mfa)}>
                                                    {u.mfa ? (
                                                        <ShieldCheck className="w-4 h-4 text-emerald-400 hover:text-emerald-300 transition-colors" />
                                                    ) : (
                                                        <ShieldOff className="w-4 h-4 text-red-400 hover:text-red-300 transition-colors" />
                                                    )}
                                                </button>
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">{u.lastLogin}</TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => handleToggleStatus(u.id, u.name, u.status)}
                                                >
                                                    {u.status === "Active" ? "Suspend" : "Activate"}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminGuard>
    );
}
