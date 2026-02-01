'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import Link from 'next/link';
import { ProgressPipeline } from '@/components/ProgressPipeline';

export default function ProgressPage() {
    const router = useRouter();

    const handleComplete = () => {
        router.push('/results');
    };

    return (
        <main className="min-h-screen bg-deep-navy relative overflow-hidden flex flex-col">
            {/* Background Glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-radial from-purple/15 via-transparent to-transparent blur-3xl" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-radial from-cyan/10 via-transparent to-transparent blur-3xl" />
            </div>

            {/* Navigation */}
            <nav className="relative z-10 container mx-auto px-6 py-6">
                <Link href="/" className="flex items-center gap-2 w-fit">
                    <Shield className="w-8 h-8 text-cyan" />
                    <span className="text-xl font-semibold">Virantis</span>
                </Link>
            </nav>

            {/* Content */}
            <section className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl font-semibold mb-4">
                        <span className="text-white">Analyzing Your </span>
                        <span className="text-cyan">Architecture</span>
                    </h1>
                    <p className="text-zinc-400 max-w-xl mx-auto">
                        Our multi-agent AI system is scanning your diagram for components,
                        data flows, and potential security threats.
                    </p>
                </motion.div>

                <ProgressPipeline onComplete={handleComplete} />

                {/* Analysis Details */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="mt-16 text-center"
                >
                    <p className="text-zinc-600 text-sm">
                        Estimated time: ~3 seconds
                    </p>
                </motion.div>
            </section>
        </main>
    );
}
