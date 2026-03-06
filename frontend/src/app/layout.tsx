import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aegis Agent ID — Zero-Trust Identity for AI Agents",
  description:
    "Enterprise-grade Identity and Access Management platform for the Agentic Era. Cryptographically verified AI agent identities with SPIFFE/SPIRE.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: { colorPrimary: "#6366f1" },
        elements: {
          card: "bg-card border-border",
          navbar: "hidden",
        },
      }}
    >
      <html lang="en" className="dark">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <AppShell>{children}</AppShell>
          <Toaster theme="dark" position="top-right" richColors closeButton />
        </body>
      </html>
    </ClerkProvider>
  );
}
