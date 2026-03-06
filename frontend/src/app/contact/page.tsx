"use client";

import { useState } from "react";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Shield, Mail, MessageSquare, Building2, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);
        const firstName = formData.get("firstName") as string;
        const lastName = formData.get("lastName") as string;
        const email = formData.get("email") as string;

        if (!firstName || !lastName || !email) {
            toast.error("Please fill in all required fields");
            return;
        }

        setSending(true);
        toast.loading("Sending your message...", { id: "contact-form" });

        // Simulate sending (in production, this would hit an API endpoint)
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setSending(false);
        setSent(true);
        form.reset();

        toast.success("Message sent!", {
            id: "contact-form",
            description: `Thanks ${firstName}! We'll get back to you at ${email} within 24 hours.`,
        });
    };

    return (
        <div className="min-h-screen bg-background selection:bg-primary/30">
            <PublicNavbar />

            <main className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
                {/* Left Side: Info */}
                <div className="flex-1 space-y-8 lg:pr-12">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 mt-8">
                            Let&apos;s secure your <span className="aegis-gradient-text">Swarm</span>
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Have questions about our SPIFFE infrastructure? Need a custom SLA for your trading bots? Our engineering team is ready to help you design a zero-trust network for your AI agents.
                        </p>
                    </div>

                    <div className="space-y-6 pt-8 border-t border-border/50">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shrink-0">
                                <Mail className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground">Email Support</h3>
                                <p className="text-sm text-muted-foreground mt-1">Our team responds within 24 hours.</p>
                                <a href="mailto:hello@aegis-agent.com" className="text-sm text-indigo-400 hover:underline mt-2 inline-block">hello@aegis-agent.com</a>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 shrink-0">
                                <MessageSquare className="w-5 h-5 text-cyan-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground">Community Discord</h3>
                                <p className="text-sm text-muted-foreground mt-1">Join developers building secure agents.</p>
                                <a href="#" className="text-sm text-cyan-400 hover:underline mt-2 inline-block">Join the Server</a>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0">
                                <Building2 className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground">Enterprise Office</h3>
                                <p className="text-sm text-muted-foreground mt-1">San Francisco, CA</p>
                                <p className="text-sm text-muted-foreground">Market St. 94105</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Contact Form */}
                <div className="flex-1">
                    <div className="p-8 rounded-3xl border border-border/50 bg-card/50 glass relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-cyan-500/5" />

                        {sent ? (
                            <div className="relative z-10 text-center py-12">
                                <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                                <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                                <p className="text-muted-foreground mb-6">
                                    We&apos;ll get back to you within 24 hours.
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={() => setSent(false)}
                                    className="border-primary/30 text-primary hover:bg-primary/10"
                                >
                                    Send Another Message
                                </Button>
                            </div>
                        ) : (
                            <form className="relative z-10 space-y-6" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">First Name *</label>
                                        <Input name="firstName" placeholder="Alan" className="bg-background/50" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Last Name *</label>
                                        <Input name="lastName" placeholder="Turing" className="bg-background/50" required />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Work Email *</label>
                                    <Input name="email" type="email" placeholder="alan@enigma.com" className="bg-background/50" required />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Company</label>
                                    <Input name="company" placeholder="Bletchley Park" className="bg-background/50" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Message</label>
                                    <Textarea
                                        name="message"
                                        placeholder="Tell us about the agents you are deploying..."
                                        className="bg-background/50 min-h-[120px] resize-none"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={sending}
                                    className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
                                >
                                    {sending ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        "Send Message"
                                    )}
                                </Button>
                                <p className="text-xs text-center text-muted-foreground mt-4">
                                    By submitting this form, you agree to our{" "}
                                    <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a> and{" "}
                                    <a href="/terms" className="text-primary hover:underline">Terms of Service</a>.
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </main>

            <PublicFooter />
        </div>
    );
}
