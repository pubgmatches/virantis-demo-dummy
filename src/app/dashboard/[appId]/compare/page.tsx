'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    ArrowLeft,
    TrendingUp,
    TrendingDown,
    Minus,
    Calendar,
    AlertTriangle,
    Plus,
    MinusCircle
} from 'lucide-react';
import { DashboardNav } from '@/components/DashboardNav';
import { Button, Card } from '@/components/ui';
import mockData from '@/data/mock_dashboard.json';

interface ThreatStats {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
}

interface Assessment {
    id: string;
    date: string;
    duration: string;
    methodology: string;
    intakeType: string;
    intakeFile: string;
    status: string;
    riskLevel: string;
    threats: ThreatStats;
    changes: string;
}

function CompareContent() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();

    const appId = params.appId as string;
    const assessmentA = searchParams.get('a');
    const assessmentB = searchParams.get('b');

    const [isLoading, setIsLoading] = useState(true);

    const app = mockData.applications.find((a) => a.id === appId);
    const assessA = app?.assessments.find((a) => a.id === assessmentA) as Assessment | undefined;
    const assessB = app?.assessments.find((a) => a.id === assessmentB) as Assessment | undefined;

    useEffect(() => {
        const isAuth = sessionStorage.getItem('isAuthenticated');
        if (!isAuth) {
            router.push('/login');
            return;
        }
        setIsLoading(false);
    }, [router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-deep-navy flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-cyan border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!app || !assessA || !assessB) {
        return (
            <div className="min-h-screen bg-deep-navy">
                <DashboardNav />
                <div className="container mx-auto px-6 py-16 text-center">
                    <h1 className="text-2xl text-white mb-4">Assessments not found</h1>
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
            month: 'short',
            day: 'numeric',
        });
    };

    const getRiskBadge = (level: string) => {
        const styles = {
            critical: 'badge-critical',
            high: 'badge-high',
            medium: 'badge-medium',
            low: 'badge-low',
        };
        return styles[level as keyof typeof styles] || 'badge-info';
    };

    const getDiff = (a: number, b: number) => {
        const diff = a - b;
        if (diff > 0) return { value: `+${diff}`, trend: 'up', color: 'text-red-500' };
        if (diff < 0) return { value: `${diff}`, trend: 'down', color: 'text-green-500' };
        return { value: '0', trend: 'stable', color: 'text-zinc-500' };
    };

    // Sort by date - newer first
    const [older, newer] = [assessA, assessB].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const totalDiff = getDiff(newer.threats.total, older.threats.total);
    const criticalDiff = getDiff(newer.threats.critical, older.threats.critical);
    const highDiff = getDiff(newer.threats.high, older.threats.high);
    const mediumDiff = getDiff(newer.threats.medium, older.threats.medium);

    // Mock threat changes
    const newThreats = [
        { name: 'Memory Poisoning', severity: 'critical' },
        { name: 'Indirect Prompt Injection', severity: 'critical' },
    ];

    const resolvedThreats = [
        { name: 'Weak Session Token', severity: 'medium' },
    ];

    const unchangedThreats = [
        { name: 'SQL Injection', severity: 'high' },
        { name: 'Session Hijacking', severity: 'high' },
        { name: 'Resource Overload', severity: 'medium' },
        { name: 'Sensitive Data Exposure', severity: 'medium' },
    ];

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
                        Assessment Comparison
                    </h1>
                    <p className="text-zinc-400">
                        Comparing {formatDate(older.date)} vs {formatDate(newer.date)}
                    </p>
                </motion.div>

                {/* Comparison Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 gap-6 mb-8"
                >
                    {/* Older Assessment */}
                    <Card className="p-6 border-zinc-700">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm text-zinc-500">Baseline</span>
                            <span className={`badge ${getRiskBadge(older.riskLevel)}`}>
                                {older.riskLevel.charAt(0).toUpperCase() + older.riskLevel.slice(1)}
                            </span>
                        </div>
                        <p className="text-white font-medium flex items-center gap-2 mb-2">
                            <Calendar className="w-4 h-4 text-zinc-500" />
                            {formatDate(older.date)}
                        </p>
                        <div className="grid grid-cols-4 gap-4 mt-4 text-center">
                            <div>
                                <p className="text-2xl font-semibold text-white">{older.threats.total}</p>
                                <p className="text-xs text-zinc-500">Total</p>
                            </div>
                            <div>
                                <p className="text-2xl font-semibold text-red-500">{older.threats.critical}</p>
                                <p className="text-xs text-zinc-500">Critical</p>
                            </div>
                            <div>
                                <p className="text-2xl font-semibold text-orange-500">{older.threats.high}</p>
                                <p className="text-xs text-zinc-500">High</p>
                            </div>
                            <div>
                                <p className="text-2xl font-semibold text-yellow-500">{older.threats.medium}</p>
                                <p className="text-xs text-zinc-500">Medium</p>
                            </div>
                        </div>
                    </Card>

                    {/* Newer Assessment */}
                    <Card className="p-6 border-cyan/30">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm text-cyan">Latest</span>
                            <span className={`badge ${getRiskBadge(newer.riskLevel)}`}>
                                {newer.riskLevel.charAt(0).toUpperCase() + newer.riskLevel.slice(1)}
                            </span>
                        </div>
                        <p className="text-white font-medium flex items-center gap-2 mb-2">
                            <Calendar className="w-4 h-4 text-cyan" />
                            {formatDate(newer.date)}
                        </p>
                        <div className="grid grid-cols-4 gap-4 mt-4 text-center">
                            <div>
                                <p className="text-2xl font-semibold text-white">{newer.threats.total}</p>
                                <p className="text-xs text-zinc-500">Total</p>
                            </div>
                            <div>
                                <p className="text-2xl font-semibold text-red-500">{newer.threats.critical}</p>
                                <p className="text-xs text-zinc-500">Critical</p>
                            </div>
                            <div>
                                <p className="text-2xl font-semibold text-orange-500">{newer.threats.high}</p>
                                <p className="text-xs text-zinc-500">High</p>
                            </div>
                            <div>
                                <p className="text-2xl font-semibold text-yellow-500">{newer.threats.medium}</p>
                                <p className="text-xs text-zinc-500">Medium</p>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Diff Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                >
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Change Summary</h2>
                        <div className="grid grid-cols-4 gap-6">
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    {totalDiff.trend === 'up' && <TrendingUp className="w-5 h-5 text-red-500" />}
                                    {totalDiff.trend === 'down' && <TrendingDown className="w-5 h-5 text-green-500" />}
                                    {totalDiff.trend === 'stable' && <Minus className="w-5 h-5 text-zinc-500" />}
                                    <span className={`text-2xl font-semibold ${totalDiff.color}`}>{totalDiff.value}</span>
                                </div>
                                <p className="text-sm text-zinc-500">Total Threats</p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    {criticalDiff.trend === 'up' && <TrendingUp className="w-5 h-5 text-red-500" />}
                                    {criticalDiff.trend === 'down' && <TrendingDown className="w-5 h-5 text-green-500" />}
                                    {criticalDiff.trend === 'stable' && <Minus className="w-5 h-5 text-zinc-500" />}
                                    <span className={`text-2xl font-semibold ${criticalDiff.color}`}>{criticalDiff.value}</span>
                                </div>
                                <p className="text-sm text-zinc-500">Critical</p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    {highDiff.trend === 'up' && <TrendingUp className="w-5 h-5 text-red-500" />}
                                    {highDiff.trend === 'down' && <TrendingDown className="w-5 h-5 text-green-500" />}
                                    {highDiff.trend === 'stable' && <Minus className="w-5 h-5 text-zinc-500" />}
                                    <span className={`text-2xl font-semibold ${highDiff.color}`}>{highDiff.value}</span>
                                </div>
                                <p className="text-sm text-zinc-500">High</p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    {mediumDiff.trend === 'up' && <TrendingUp className="w-5 h-5 text-red-500" />}
                                    {mediumDiff.trend === 'down' && <TrendingDown className="w-5 h-5 text-green-500" />}
                                    {mediumDiff.trend === 'stable' && <Minus className="w-5 h-5 text-zinc-500" />}
                                    <span className={`text-2xl font-semibold ${mediumDiff.color}`}>{mediumDiff.value}</span>
                                </div>
                                <p className="text-sm text-zinc-500">Medium</p>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Threat Changes */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-3 gap-6"
                >
                    {/* New Threats */}
                    <Card className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Plus className="w-5 h-5 text-red-500" />
                            <h3 className="font-semibold text-white">New Threats</h3>
                            <span className="badge badge-critical ml-auto">{newThreats.length}</span>
                        </div>
                        <div className="space-y-3">
                            {newThreats.map((threat) => (
                                <div key={threat.name} className="flex items-center justify-between p-3 bg-red-500/5 rounded-lg border border-red-500/20">
                                    <span className="text-white text-sm">{threat.name}</span>
                                    <span className={`badge ${getRiskBadge(threat.severity)} text-xs`}>
                                        {threat.severity}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Resolved */}
                    <Card className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <MinusCircle className="w-5 h-5 text-green-500" />
                            <h3 className="font-semibold text-white">Resolved</h3>
                            <span className="badge bg-green-500/15 text-green-500 ml-auto">{resolvedThreats.length}</span>
                        </div>
                        <div className="space-y-3">
                            {resolvedThreats.map((threat) => (
                                <div key={threat.name} className="flex items-center justify-between p-3 bg-green-500/5 rounded-lg border border-green-500/20">
                                    <span className="text-zinc-400 text-sm line-through">{threat.name}</span>
                                    <span className="badge bg-green-500/15 text-green-500 text-xs">
                                        Fixed
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Unchanged */}
                    <Card className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Minus className="w-5 h-5 text-zinc-500" />
                            <h3 className="font-semibold text-white">Unchanged</h3>
                            <span className="badge bg-zinc-500/15 text-zinc-400 ml-auto">{unchangedThreats.length}</span>
                        </div>
                        <div className="space-y-3">
                            {unchangedThreats.map((threat) => (
                                <div key={threat.name} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
                                    <span className="text-zinc-400 text-sm">{threat.name}</span>
                                    <span className={`badge ${getRiskBadge(threat.severity)} text-xs`}>
                                        {threat.severity}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </motion.div>
            </main>
        </div>
    );
}

export default function ComparePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-deep-navy flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-cyan border-t-transparent rounded-full" />
            </div>
        }>
            <CompareContent />
        </Suspense>
    );
}
