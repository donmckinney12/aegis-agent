"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Users, Shield, UserPlus, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const users = [
    { id: "usr-01", name: "Alice Chen", email: "alice@aegis.io", role: "Super Admin", team: "Platform Security", status: "Active", lastLogin: "2 mins ago", mfa: true },
    { id: "usr-02", name: "Bob Smith", email: "bob@aegis.io", role: "Policy Engineer", team: "Trust & Safety", status: "Active", lastLogin: "1 hour ago", mfa: true },
    { id: "usr-03", name: "Charlie Davis", email: "charlie@aegis.io", role: "Auditor", team: "Compliance", status: "Active", lastLogin: "3 days ago", mfa: true },
    { id: "usr-04", name: "Diana Prince", email: "diana@company.com", role: "Developer", team: "App Delivery", status: "Invited", lastLogin: "Never", mfa: false },
    { id: "usr-05", name: "Evan Wright", email: "evan@company.com", role: "Developer", team: "App Delivery", status: "Inactive", lastLogin: "2 months ago", mfa: false },
];

export default function AccessManagementPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Access Management</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage human operators, roles, teams, and Azure AD / Okta SSO configurations.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10">
                        <Shield className="w-4 h-4 mr-2" />
                        Configure SSO
                    </Button>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Invite User
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="border-border/50 bg-card/50">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                            <Users className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">24</p>
                            <p className="text-xs text-muted-foreground">Total Users</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-border/50 bg-card/50">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">4</p>
                            <p className="text-xs text-muted-foreground">Custom Roles</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-border/50 bg-card/50">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <Lock className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">100%</p>
                            <p className="text-xs text-muted-foreground">MFA Enforcement (Active)</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-border/50 bg-card/50">
                <CardHeader>
                    <CardTitle className="text-base">Directory</CardTitle>
                    <CardDescription>Human operators with access to the Aegis Control Plane.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border border-border/50 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Team</TableHead>
                                    <TableHead>MFA</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Last Login</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((u) => (
                                    <TableRow key={u.id} className="hover:bg-muted/30">
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-sm">{u.name}</span>
                                                <span className="text-xs text-muted-foreground">{u.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-[10px] bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
                                                {u.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">{u.team}</TableCell>
                                        <TableCell>
                                            {u.mfa ? (
                                                <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Enabled</Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-[10px] bg-red-500/10 text-red-400 border-red-500/20">Disabled</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <span className={cn(
                                                "text-xs flex items-center gap-1.5",
                                                u.status === "Active" ? "text-emerald-400" :
                                                    u.status === "Invited" ? "text-amber-400" : "text-muted-foreground"
                                            )}>
                                                <span className={cn(
                                                    "w-1.5 h-1.5 rounded-full",
                                                    u.status === "Active" ? "bg-emerald-400" :
                                                        u.status === "Invited" ? "bg-amber-400" : "bg-muted-foreground"
                                                )} />
                                                {u.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right text-xs text-muted-foreground">
                                            {u.lastLogin}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
