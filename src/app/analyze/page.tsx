'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { EnhancedIngestionPanel } from '@/components/EnhancedIngestionPanel';

export default function AnalyzePage() {
    const router = useRouter();

    const handleContinue = (data: {
        sources: string[];
        file?: File;
        jiraTicket?: string;
        description?: string;
        iacFile?: File;
        githubUrl?: string;
    }) => {
        // Store intake data in sessionStorage for demo purposes
        sessionStorage.setItem('intakeData', JSON.stringify({
            sources: data.sources,
            fileName: data.file?.name,
            jiraTicket: data.jiraTicket,
            description: data.description,
            iacFileName: data.iacFile?.name,
            githubUrl: data.githubUrl,
            timestamp: new Date().toISOString(),
        }));

        // Navigate to clarification page
        router.push('/analyze/clarify');
    };

    return (
        <main className="min-h-screen bg-deep-navy relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-radial from-purple/10 via-transparent to-transparent blur-3xl" />
            </div>

            {/* Navigation */}
            <nav className="relative z-10 container mx-auto px-6 py-6">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <Shield className="w-8 h-8 text-cyan" />
                        <span className="text-xl font-semibold">Virantis</span>
                    </Link>
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Link>
                </div>
            </nav>

            {/* Content */}
            <section className="relative z-10 container mx-auto px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-semibold mb-4">
                        <span className="text-white">Start Your </span>
                        <span className="text-cyan">Threat Analysis</span>
                    </h1>
                    <p className="text-zinc-400 max-w-xl mx-auto">
                        Provide your architecture inputs and our AI agents will automatically
                        identify components, data flows, and potential security threats.
                    </p>
                </motion.div>

                <EnhancedIngestionPanel onContinue={handleContinue} />

                {/* Process Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="max-w-3xl mx-auto mt-12"
                >
                    <div className="grid grid-cols-4 gap-4 text-center">
                        {processSteps.map((step, index) => (
                            <div key={step.title} className="p-4">
                                <div className="text-3xl font-light text-cyan mb-2">{index + 1}</div>
                                <div className="text-sm font-medium text-white mb-1">{step.title}</div>
                                <div className="text-xs text-zinc-500">{step.description}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </section>
        </main>
    );
}

const processSteps = [
    {
        title: 'Input',
        description: 'Multiple sources',
    },
    {
        title: 'Clarify',
        description: 'AI questions',
    },
    {
        title: 'Analyze',
        description: 'Threat detection',
    },
    {
        title: 'Report',
        description: 'Actionable insights',
    },
];
