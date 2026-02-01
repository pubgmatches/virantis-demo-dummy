'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    ArrowLeft,
    RefreshCw,
    Plus,
    Image as ImageIcon,
    GitBranch,
    Clock,
    TrendingUp,
    TrendingDown,
    Minus,
    Eye,
    Trash2,
    GitCompare,
    AlertTriangle,
    Shield
} from 'lucide-react';
import { DashboardNav } from '@/components/DashboardNav';
import { AIChatWidget } from '@/components/AIChatWidget';
import { Button, Card, StatCard } from '@/components/ui';
import mockData from '@/data/mock_dashboard.json';

interface Assessment {
    id: string;
    date: string;
    duration: string;
    methodology: string;
    intakeType: string;
    intakeFile: string;
    status: string;
    riskLevel: string;
    threats: {
        total: number;
        critical: number;
        high: number;
        medium: number;
        low: number;
    };
    changes: string;
}

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
    assessments: Assessment[];
}

export default function AppDetailPage() {
    const router = useRouter();
    const params = useParams();
    const appId = params.appId as string;
    const [isLoading, setIsLoading] = useState(true);
    const [app, setApp] = useState<Application | null>(null);
    const [selectedAssessments, setSelectedAssessments] = useState<string[]>([]);

    useEffect(() => {
        const isAuth = sessionStorage.getItem('isAuthenticated');
        if (!isAuth) {
            router.push('/login');
            return;
        }

        const foundApp = mockData.applications.find((a) => a.id === appId);
        if (foundApp) {
            setApp(foundApp as Application);
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

    const getRiskBadge = (level: string) => {
        const styles = {
            critical: 'badge-critical',
            high: 'badge-high',
            medium: 'badge-medium',
            low: 'badge-low',
        };
        return styles[level as keyof typeof styles] || 'badge-info';
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getRiskTrend = () => {
        if (app.assessments.length < 2) return 'stable';
        const current = app.assessments[0].threats.total;
        const previous = app.assessments[1].threats.total;
        if (current > previous) return 'up';
        if (current < previous) return 'down';
        return 'stable';
    };

    const toggleAssessmentSelection = (id: string) => {
        setSelectedAssessments((prev) => {
            if (prev.includes(id)) {
                return prev.filter((a) => a !== id);
            }
            if (prev.length < 2) {
                return [...prev, id];
            }
            return [prev[1], id];
        });
    };

    const canCompare = selectedAssessments.length === 2;

    return (
        <div className="min-h-screen bg-deep-navy">
            <DashboardNav />

            <main className="container mx-auto px-6 py-8">
                {/* Back Link */}
                <Link href="/dashboard" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>

                {/* App Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start justify-between mb-8"
                >
                    <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan/20 to-purple/20 flex items-center justify-center">
                            <Shield className="w-7 h-7 text-cyan" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold text-white mb-1">{app.name}</h1>
                            <p className="text-zinc-400 max-w-2xl">{app.description}</p>
                            <p className="text-sm text-zinc-600 mt-2">
                                Created {formatDate(app.createdAt)}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="secondary"
                            icon={<RefreshCw className="w-4 h-4" />}
                            onClick={() => router.push('/analyze')}
                        >
                            Re-assess
                        </Button>
                        <Link href="/analyze">
                            <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
                                New Assessment
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                {/* Stats Row */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-4 gap-4 mb-8"
                >
                    <Card className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-zinc-500 mb-1">Current Risk</p>
                                <span className={`badge ${getRiskBadge(app.riskLevel)} text-base`}>
                                    {app.riskLevel.charAt(0).toUpperCase() + app.riskLevel.slice(1)}
                                </span>
                            </div>
                            {getRiskTrend() === 'up' && <TrendingUp className="w-5 h-5 text-red-500" />}
                            {getRiskTrend() === 'down' && <TrendingDown className="w-5 h-5 text-green-500" />}
                            {getRiskTrend() === 'stable' && <Minus className="w-5 h-5 text-zinc-500" />}
                        </div>
                    </Card>
                    <StatCard
                        title="Total Threats"
                        value={app.totalThreats}
                        icon={<AlertTriangle className="w-5 h-5" />}
                    />
                    <StatCard
                        title="Assessments"
                        value={app.assessments.length}
                        icon={<Clock className="w-5 h-5" />}
                    />
                    <Link href={`/dashboard/${app.id}/intake`}>
                        <Card className="p-4 hover:border-cyan/30 cursor-pointer transition-colors">
                            <p className="text-sm text-zinc-500 mb-1">Last Intake</p>
                            <div className="flex items-center gap-2">
                                {app.intakeType === 'image' ? (
                                    <ImageIcon className="w-4 h-4 text-cyan" />
                                ) : (
                                    <GitBranch className="w-4 h-4 text-purple" />
                                )}
                                <span className="text-white text-sm truncate">{app.intakeFile}</span>
                            </div>
                        </Card>
                    </Link>
                </motion.div>

                {/* Compare Button */}
                {canCompare && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4"
                    >
                        <Link href={`/dashboard/${app.id}/compare?a=${selectedAssessments[0]}&b=${selectedAssessments[1]}`}>
                            <Button variant="primary" icon={<GitCompare className="w-4 h-4" />}>
                                Compare Selected ({selectedAssessments.length})
                            </Button>
                        </Link>
                    </motion.div>
                )}

                {/* Assessment History */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-white">Assessment History</h2>
                        <p className="text-sm text-zinc-500">Select two to compare</p>
                    </div>

                    <Card className="p-0 overflow-hidden">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-zinc-800 text-sm font-medium text-zinc-400 bg-midnight">
                            <div className="col-span-1"></div>
                            <div className="col-span-2">Date</div>
                            <div className="col-span-2">Intake</div>
                            <div className="col-span-2">Methodology</div>
                            <div className="col-span-2">Threats</div>
                            <div className="col-span-1">Risk</div>
                            <div className="col-span-2">Actions</div>
                        </div>

                        {/* Table Body */}
                        {app.assessments.map((assess, index) => (
                            <div
                                key={assess.id}
                                className={`grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-zinc-800/50 hover:bg-white/5 transition-colors ${selectedAssessments.includes(assess.id) ? 'bg-cyan/5 border-cyan/20' : ''
                                    }`}
                            >
                                {/* Checkbox */}
                                <div className="col-span-1">
                                    <button
                                        onClick={() => toggleAssessmentSelection(assess.id)}
                                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${selectedAssessments.includes(assess.id)
                                            ? 'bg-cyan border-cyan'
                                            : 'border-zinc-600 hover:border-zinc-400'
                                            }`}
                                    >
                                        {selectedAssessments.includes(assess.id) && (
                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>

                                {/* Date */}
                                <div className="col-span-2">
                                    <p className="text-white text-sm">{formatDate(assess.date)}</p>
                                    <p className="text-xs text-zinc-500">{assess.duration}</p>
                                </div>

                                {/* Intake */}
                                <div className="col-span-2 flex items-center gap-2">
                                    {assess.intakeType === 'image' ? (
                                        <ImageIcon className="w-4 h-4 text-cyan" />
                                    ) : (
                                        <GitBranch className="w-4 h-4 text-purple" />
                                    )}
                                    <span className="text-zinc-400 text-sm truncate">{assess.intakeFile}</span>
                                </div>

                                {/* Methodology */}
                                <div className="col-span-2">
                                    <span className="text-zinc-400 text-sm">{assess.methodology}</span>
                                </div>

                                {/* Threats */}
                                <div className="col-span-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-medium">{assess.threats.total}</span>
                                        <span className="text-xs text-zinc-500">
                                            ({assess.threats.critical}C / {assess.threats.high}H / {assess.threats.medium}M)
                                        </span>
                                    </div>
                                    {assess.changes && (
                                        <p className="text-xs text-zinc-600 mt-1">{assess.changes}</p>
                                    )}
                                </div>

                                {/* Risk */}
                                <div className="col-span-1">
                                    <span className={`badge ${getRiskBadge(assess.riskLevel)}`}>
                                        {assess.riskLevel.charAt(0).toUpperCase() + assess.riskLevel.slice(1)}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="col-span-2 flex items-center gap-2">
                                    <Link href={`/dashboard/${app.id}/${assess.id}`}>
                                        <Button variant="secondary" size="sm" icon={<Eye className="w-3 h-3" />}>
                                            View
                                        </Button>
                                    </Link>
                                    <button className="p-2 rounded-lg hover:bg-red-500/10 text-zinc-500 hover:text-red-500 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </Card>
                </motion.div>
            </main>

            {/* AI Chat Widget */}
            <AIChatWidget context={{ type: 'app', appName: app.name }} />
        </div>
    );
}
