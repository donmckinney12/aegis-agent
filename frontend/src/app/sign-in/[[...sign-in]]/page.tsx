import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px]" />
                <div className="w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[100px] -translate-y-32" />
            </div>

            <div className="relative z-10">
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 aegis-glow-sm shadow-lg shadow-indigo-500/20 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /></svg>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Sign in to Aegis</h1>
                    <p className="text-sm text-foreground/60 w-full max-w-sm mx-auto">
                        Zero-Trust Identity Control Plane for AI Agents
                    </p>
                </div>
                <SignIn appearance={{ elements: { formButtonPrimary: 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' } }} />
            </div>
        </div>
    );
}
