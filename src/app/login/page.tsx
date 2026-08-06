"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        // Front-end validation prototype simulation
        if (email === "admin@security.io" && password === "admin123") {
            setError("");
            router.push("/camera-management"); // Redirects directly into your main screen
        } else {
            setError("Invalid credential tokens. Try admin@security.io / admin123");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#181818] px-4">
            <div className="w-full max-w-md bg-[#242424] border border-neutral-800 rounded-xl p-8 shadow-2xl animate-fadeIn">

                {/* Branding Head */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#00A3FF]/10 text-[#00A3FF] font-bold text-xl mb-3 border border-[#00A3FF]/20">
                        FLOWGUARD
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-white">AI Core Command</h1>
                    <p className="text-xs text-neutral-500 mt-1">Infrastructure Control Gateway v2.4.0</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    {error && (
                        <div className="p-3 bg-red-950/30 border border-red-500/30 text-[#FF0000] text-xs font-semibold rounded text-center animate-fadeIn">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                            Identity Email
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="e.g., admin@security.io"
                            className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2.5 text-sm text-white placeholder-neutral-600 focus:border-[#00A3FF] focus:ring-1 focus:ring-[#00A3FF] outline-none transition-all font-mono"
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                            Security Key Access Pass
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2.5 text-sm text-white placeholder-neutral-600 focus:border-[#00A3FF] focus:ring-1 focus:ring-[#00A3FF] outline-none transition-all font-mono"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#00A3FF] hover:bg-blue-600 text-black font-bold py-2.5 rounded text-sm transition-colors mt-2 shadow-lg shadow-[#00A3FF]/10"
                    >
                        Authorize Session
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <span className="text-[10px] text-neutral-600 uppercase tracking-widest font-mono block">
                        SECURE RESTRICTED TERMINAL LAYER
                    </span>
                </div>

            </div>
        </div>
    );
}