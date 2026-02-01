'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('alex.chen@virantis.io');
    const [password, setPassword] = useState('demo123');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate login
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock validation
        if (email && password) {
            // Store auth state
            sessionStorage.setItem('isAuthenticated', 'true');
            sessionStorage.setItem('user', JSON.stringify({
                name: 'Alex Chen',
                email: email,
                role: 'Security Engineer'
            }));
            router.push('/dashboard');
        } else {
            setError('Please enter valid credentials');
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-deep-navy relative overflow-hidden flex items-center justify-center">
            {/* Background Glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-radial from-purple/10 via-transparent to-transparent blur-3xl" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-radial from-cyan/10 via-transparent to-transparent blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md mx-4"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <Shield className="w-10 h-10 text-cyan" />
                        <span className="text-3xl font-semibold">Virantis</span>
                    </div>
                    <p className="text-zinc-400">Sign in to your account</p>
                </div>

                {/* Login Card */}
                <div className="card p-8">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label className="block text-sm text-zinc-400 mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-midnight border border-zinc-800 rounded-lg pl-12 pr-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan transition-colors"
                                    placeholder="you@company.com"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm text-zinc-400 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-midnight border border-zinc-800 rounded-lg pl-12 pr-12 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan transition-colors"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-red-500 text-sm text-center"
                            >
                                {error}
                            </motion.p>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            loading={isLoading}
                            icon={!isLoading ? <ArrowRight className="w-5 h-5" /> : undefined}
                            className="w-full"
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>

                    {/* Demo Hint */}
                    <div className="mt-6 pt-6 border-t border-zinc-800">
                        <p className="text-zinc-500 text-sm text-center">
                            Demo credentials are pre-filled. Just click Sign In.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-zinc-600 text-sm mt-6">
                    Agentic AI Threat Modeling Platform
                </p>
            </motion.div>
        </main>
    );
}
