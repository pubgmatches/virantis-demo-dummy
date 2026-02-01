'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Plus,
    LayoutGrid,
    TrendingUp,
    AlertTriangle,
    Shield,
    Clock,
    ChevronRight,
    ArrowUpRight,
    Activity,
    FileText
} from 'lucide-react';
import { DashboardNav } from '@/components/DashboardNav';
import { AIChatWidget } from '@/components/AIChatWidget';
import { PendingApprovals } from '@/components/PendingApprovals';
import { SecurityScorecard } from '@/components/SecurityScorecard';
import { RiskTimeline } from '@/components/RiskTimeline';
import { RemediationTracker } from '@/components/RemediationTracker';
import { Button, Card, StatCard } from '@/components/ui';
import { generateExecutiveSummary } from '@/lib/generateExecutiveSummary';
import mockData from '@/data/mock_dashboard.json';

export default function DashboardPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check auth
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

    const { stats, applications } = mockData;

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
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
        return date.toLocaleDateString();
    };

    // Get recent assessments across all apps
    const recentAssessments = applications
        .flatMap((app) =>
            app.assessments.slice(0, 2).map((assess) => ({
                ...assess,
                appName: app.name,
                appId: app.id,
            }))
        )
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

    return (
        <div className="min-h-screen bg-deep-navy">
            <DashboardNav />

            <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-2xl font-semibold text-white mb-1"
                        >
                            Welcome back, {mockData.user.name.split(' ')[0]}
                        </motion.h1>
                        <p className="text-zinc-400">Here&apos;s an overview of your security assessments</p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Button
                            variant="secondary"
                            icon={<FileText className="w-4 h-4" />}
                            onClick={() => generateExecutiveSummary()}
                        >
                            Export Summary
                        </Button>
                        <Link href="/analyze">
                            <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
                                New Assessment
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8"
                >
                    <StatCard
                        title="Total Applications"
                        value={stats.totalApps}
                        icon={<LayoutGrid className="w-5 h-5" />}
                    />
                    <StatCard
                        title="Assessments This Month"
                        value={stats.assessmentsThisMonth}
                        icon={<Activity className="w-5 h-5" />}
                    />
                    <StatCard
                        title="Critical Issues"
                        value={stats.criticalIssues}
                        variant="critical"
                        icon={<AlertTriangle className="w-5 h-5" />}
                    />
                    <StatCard
                        title="Avg Risk Score"
                        value={stats.avgRiskScore}
                        variant="high"
                        icon={<TrendingUp className="w-5 h-5" />}
                    />
                </motion.div>

                {/* Main Grid: 3 columns */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column: Applications + Remediation */}
                    <div className="lg:col-span-5 space-y-6">
                        {/* Applications List */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-white">Your Applications</h2>
                                <span className="text-sm text-zinc-500">{applications.length} apps</span>
                            </div>

                            <div className="space-y-3">
                                {applications.map((app, index) => (
                                    <motion.div
                                        key={app.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + index * 0.1 }}
                                    >
                                        <Link href={`/dashboard/${app.id}`}>
                                            <Card className="p-4 hover:border-cyan/30 cursor-pointer group">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan/20 to-purple/20 flex items-center justify-center">
                                                            <Shield className="w-5 h-5 text-cyan" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-white font-medium group-hover:text-cyan transition-colors">
                                                                {app.name}
                                                            </h3>
                                                            <p className="text-sm text-zinc-500">
                                                                Last assessed {formatDate(app.lastAssessed)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="hidden sm:flex items-center gap-4">
                                                        <div className="text-center">
                                                            <p className="text-lg font-semibold text-white">{app.totalThreats}</p>
                                                            <p className="text-xs text-zinc-500">Threats</p>
                                                        </div>
                                                        <span className={`badge ${getRiskBadge(app.riskLevel)}`}>
                                                            {app.riskLevel.charAt(0).toUpperCase() + app.riskLevel.slice(1)}
                                                        </span>
                                                        <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-cyan transition-colors" />
                                                    </div>
                                                </div>
                                            </Card>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Remediation Tracker */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <RemediationTracker />
                        </motion.div>
                    </div>

                    {/* Center Column: Timeline + Pending Approvals */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Risk Timeline */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <RiskTimeline />
                        </motion.div>

                        {/* Pending Approvals */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <PendingApprovals />
                        </motion.div>
                    </div>

                    {/* Right Column: Scorecard + Recent Activity */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Security Scorecard */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <SecurityScorecard />
                        </motion.div>

                        {/* Recent Activity */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
                                <Clock className="w-4 h-4 text-zinc-500" />
                            </div>

                            <Card className="p-0 overflow-hidden">
                                {recentAssessments.map((assess, index) => (
                                    <Link
                                        key={assess.id}
                                        href={`/dashboard/${assess.appId}/${assess.id}`}
                                        className={`block p-4 hover:bg-white/5 transition-colors ${index < recentAssessments.length - 1 ? 'border-b border-zinc-800/50' : ''
                                            }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-sm text-white font-medium">{assess.appName}</p>
                                                <p className="text-xs text-zinc-500 mt-1">{formatDate(assess.date)}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`badge text-xs ${getRiskBadge(assess.riskLevel)}`}>
                                                    {assess.threats.total} threats
                                                </span>
                                                <ArrowUpRight className="w-3 h-3 text-zinc-600" />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </main>

            {/* AI Chat Widget */}
            <AIChatWidget context={{ type: 'dashboard' }} />
        </div>
    );
}
