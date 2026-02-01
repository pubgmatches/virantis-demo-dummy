'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    ArrowLeft,
    Image as ImageIcon,
    GitBranch,
    Download,
    Maximize2,
    Clock,
    User,
    FileText,
    ExternalLink,
    History
} from 'lucide-react';
import { DashboardNav } from '@/components/DashboardNav';
import { AIChatWidget } from '@/components/AIChatWidget';
import { Button, Card } from '@/components/ui';
import mockData from '@/data/mock_dashboard.json';

interface Application {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    lastAssessed: string;
    riskLevel: string;
    totalThreats: number;
    intakeType: string;
    intakeFile: string;
    assessments: {
        id: string;
        intakeFile: string;
        date: string;
    }[];
}

export default function IntakeDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const appId = params.appId as string;
    const [isLoading, setIsLoading] = useState(true);
    const [app, setApp] = useState<Application | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const isAuth = sessionStorage.getItem('isAuthenticated');
        if (!isAuth) {
            router.push('/login');
            return;
        }

        const foundApp = mockData.applications.find((a) => a.id === appId);
        if (foundApp) {
            setApp(foundApp as unknown as Application);
        }
        setIsLoading(false);
    }, [router, appId]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-deep-navy flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-cyan border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!app) {
        return (
            <div className="min-h-screen bg-deep-navy">
                <DashboardNav />
                <div className="container mx-auto px-6 py-16 text-center">
                    <h1 className="text-2xl text-white mb-4">Application not found</h1>
                    <Link href="/dashboard">
                        <Button variant="secondary">Back to Dashboard</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // Mock intake history from assessments
    const intakeHistory = app.assessments.map((assess) => ({
        id: assess.id,
        file: assess.intakeFile,
        date: assess.date,
    }));

    return (
        <div className="min-h-screen bg-deep-navy">
            <DashboardNav />

            <main className="container mx-auto px-6 py-8">
                {/* Back Link */}
                <Link href={`/dashboard/${appId}`} className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6">
                    <ArrowLeft className="w-4 h-4" />
                    Back to {app.name}
                </Link>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-2xl font-semibold text-white mb-2">
                        Intake Sources
                    </h1>
                    <p className="text-zinc-400">
                        All intake information for {app.name}
                    </p>
                </motion.div>

                <div className="grid grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="col-span-2 space-y-6">
                        {/* Architecture Diagram */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Card className="p-6">
                                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <ImageIcon className="w-5 h-5 text-cyan" />
                                    Architecture Diagram
                                </h2>

                                {/* Diagram Preview */}
                                <div
                                    className={`relative bg-midnight rounded-xl border border-zinc-800 overflow-hidden transition-all ${isFullscreen ? 'fixed inset-4 z-50' : 'aspect-video'
                                        }`}
                                >
                                    {/* Mock diagram with components */}
                                    <div className="absolute inset-0 p-8">
                                        <div className="relative w-full h-full">
                                            {/* User Interface */}
                                            <div className="absolute top-[10%] left-[10%] w-32 h-16 bg-cyan/10 border border-cyan/30 rounded-lg flex items-center justify-center">
                                                <div className="text-center">
                                                    <User className="w-6 h-6 text-cyan mx-auto mb-1" />
                                                    <span className="text-xs text-cyan">User Interface</span>
                                                </div>
                                            </div>

                                            {/* Orchestrator */}
                                            <div className="absolute top-[40%] left-[35%] w-36 h-20 bg-purple/10 border border-purple/30 rounded-lg flex items-center justify-center">
                                                <div className="text-center">
                                                    <div className="w-8 h-8 rounded-full bg-purple/20 flex items-center justify-center mx-auto mb-1">
                                                        <span className="text-xs text-purple">⚙️</span>
                                                    </div>
                                                    <span className="text-xs text-purple">Orchestrator Agent</span>
                                                </div>
                                            </div>

                                            {/* Email Fetcher */}
                                            <div className="absolute top-[10%] right-[15%] w-32 h-16 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center justify-center animate-pulse">
                                                <div className="text-center">
                                                    <span className="text-xs text-red-400">Email Fetcher</span>
                                                    <p className="text-[10px] text-red-500/70">Attack Target</p>
                                                </div>
                                            </div>

                                            {/* Payment API */}
                                            <div className="absolute top-[40%] right-[10%] w-28 h-14 bg-emerald/10 border border-emerald/30 rounded-lg flex items-center justify-center">
                                                <span className="text-xs text-emerald">Payment API</span>
                                            </div>

                                            {/* Data Stores */}
                                            <div className="absolute bottom-[15%] left-[30%] w-28 h-14 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-center justify-center">
                                                <span className="text-xs text-yellow-400">Memory Store</span>
                                            </div>

                                            <div className="absolute bottom-[15%] right-[30%] w-28 h-14 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-center justify-center">
                                                <span className="text-xs text-yellow-400">Booking DB</span>
                                            </div>

                                            {/* Connection lines (simplified) */}
                                            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                                <line x1="25%" y1="25%" x2="40%" y2="45%" stroke="rgba(100,100,100,0.3)" strokeWidth="1" strokeDasharray="4" />
                                                <line x1="55%" y1="50%" x2="75%" y2="50%" stroke="rgba(100,100,100,0.3)" strokeWidth="1" strokeDasharray="4" />
                                                <line x1="50%" y1="60%" x2="40%" y2="75%" stroke="rgba(100,100,100,0.3)" strokeWidth="1" strokeDasharray="4" />
                                                <line x1="50%" y1="60%" x2="60%" y2="75%" stroke="rgba(100,100,100,0.3)" strokeWidth="1" strokeDasharray="4" />
                                                {/* Attack path */}
                                                <line x1="75%" y1="25%" x2="55%" y2="45%" stroke="rgba(239,68,68,0.5)" strokeWidth="2" strokeDasharray="6" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Controls overlay */}
                                    <div className="absolute bottom-4 right-4 flex gap-2">
                                        <button
                                            onClick={() => setIsFullscreen(!isFullscreen)}
                                            className="p-2 bg-zinc-900/80 hover:bg-zinc-800 rounded-lg transition-colors"
                                        >
                                            <Maximize2 className="w-4 h-4 text-zinc-400" />
                                        </button>
                                        <button className="p-2 bg-zinc-900/80 hover:bg-zinc-800 rounded-lg transition-colors">
                                            <Download className="w-4 h-4 text-zinc-400" />
                                        </button>
                                    </div>

                                    {/* Close button for fullscreen */}
                                    {isFullscreen && (
                                        <button
                                            onClick={() => setIsFullscreen(false)}
                                            className="absolute top-4 right-4 p-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors"
                                        >
                                            <span className="text-white">✕</span>
                                        </button>
                                    )}
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex items-center gap-2 text-zinc-400">
                                        <ImageIcon className="w-4 h-4" />
                                        <span className="text-sm">{app.intakeFile}</span>
                                    </div>
                                    <Button variant="secondary" size="sm" icon={<Download className="w-3 h-3" />}>
                                        Download Original
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>

                        {/* Description */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card className="p-6">
                                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-purple" />
                                    Application Description
                                </h2>
                                <p className="text-zinc-300 leading-relaxed">
                                    {app.description}
                                </p>
                                <div className="mt-4 pt-4 border-t border-zinc-800 text-sm text-zinc-500">
                                    <p>Last updated: {formatDate(app.lastAssessed)}</p>
                                </div>
                            </Card>
                        </motion.div>

                        {/* Repository Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Card className="p-6">
                                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <GitBranch className="w-5 h-5 text-emerald" />
                                    Repository Information
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-midnight rounded-lg border border-zinc-800">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center">
                                                <GitBranch className="w-5 h-5 text-zinc-400" />
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">github.com/virantis/fintravel-agent</p>
                                                <p className="text-sm text-zinc-500">Branch: main • Last commit: 2 days ago</p>
                                            </div>
                                        </div>
                                        <Button variant="secondary" size="sm" icon={<ExternalLink className="w-3 h-3" />}>
                                            Open
                                        </Button>
                                    </div>
                                    <p className="text-sm text-zinc-500">
                                        Repository is connected and monitored for changes. Automatic threat model updates are enabled.
                                    </p>
                                </div>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-6"
                    >
                        {/* App Details */}
                        <Card className="p-6">
                            <h3 className="font-semibold text-white mb-4">App Details</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-zinc-500 mb-1">Application Name</p>
                                    <p className="text-white">{app.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-500 mb-1">Owner</p>
                                    <p className="text-white">Security Team</p>
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-500 mb-1">Created</p>
                                    <p className="text-white">{formatDate(app.createdAt)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-500 mb-1">Type</p>
                                    <span className="badge bg-purple/15 text-purple">Agentic AI Application</span>
                                </div>
                            </div>
                        </Card>

                        {/* Intake History */}
                        <Card className="p-6">
                            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                                <History className="w-4 h-4 text-zinc-400" />
                                Previous Intakes
                            </h3>
                            <div className="space-y-3">
                                {intakeHistory.map((intake, index) => (
                                    <div
                                        key={intake.id}
                                        className={`p-3 rounded-lg border transition-colors ${index === 0
                                                ? 'bg-cyan/5 border-cyan/20'
                                                : 'bg-zinc-800/30 border-zinc-800 hover:border-zinc-700'
                                            } cursor-pointer`}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <ImageIcon className="w-3 h-3 text-zinc-400" />
                                            <span className="text-sm text-white truncate">{intake.file}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-3 h-3 text-zinc-500" />
                                            <span className="text-xs text-zinc-500">{formatDate(intake.date)}</span>
                                            {index === 0 && (
                                                <span className="text-xs text-cyan ml-auto">Current</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </main>

            {/* AI Chat Widget */}
            <AIChatWidget context={{ type: 'app', appName: app.name }} />
        </div>
    );
}
