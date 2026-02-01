'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    ArrowLeft,
    Bell,
    AlertTriangle,
    CheckCircle,
    XCircle,
    GitPullRequest,
    MessageSquare,
    Ticket,
    GitBranch,
    Bot,
    Zap,
    ExternalLink,
    Clock
} from 'lucide-react';
import { DashboardNav } from '@/components/DashboardNav';
import { AIChatWidget } from '@/components/AIChatWidget';
import { Button, Card } from '@/components/ui';

interface PendingApproval {
    id: string;
    source: 'jira' | 'github' | 'servicenow' | 'slack';
    sourceId: string;
    title: string;
    description: string;
    timestamp: string;
    appId: string;
    appName: string;
    recommendation: 'assess' | 'skip';
    severity: 'high' | 'medium' | 'low';
    aiAnalysis: string;
    changes: string[];
}

const mockApprovals: PendingApproval[] = [
    {
        id: 'pa-1',
        source: 'jira',
        sourceId: 'SEC-1234',
        title: 'Add new payment provider integration',
        description: 'Integration with Stripe Connect for vendor payouts. This adds a new external API connection to handle financial transactions.',
        timestamp: '2 hours ago',
        appId: 'payment-gateway',
        appName: 'PaymentGateway API',
        recommendation: 'assess',
        severity: 'high',
        aiAnalysis: 'This change introduces a new external API connection to Stripe Connect. Based on the architecture, this creates potential data exfiltration risks for financial data. The integration handles sensitive payment information that flows through the existing Payment Processing module. A threat assessment is strongly recommended to identify risks related to API authentication, data validation, and transaction integrity.',
        changes: [
            'New StripeConnectService class added',
            'Vendor payout endpoints exposed',
            'New database fields for payout tracking',
            'External API authentication configured',
        ],
    },
    {
        id: 'pa-2',
        source: 'github',
        sourceId: 'PR #142',
        title: 'Refactor auth middleware',
        description: 'Updated JWT validation logic and improved token refresh mechanism.',
        timestamp: '1 day ago',
        appId: 'auth-service',
        appName: 'AuthService',
        recommendation: 'skip',
        severity: 'low',
        aiAnalysis: 'This is a routine refactoring of the authentication middleware. The changes improve the existing JWT validation without altering the security architecture. The token refresh mechanism was optimized for performance. No new attack surfaces were introduced. Recommend acknowledging without full threat reassessment.',
        changes: [
            'Refactored validateToken() method',
            'Improved error handling for expired tokens',
            'Performance optimization in token cache',
        ],
    },
    {
        id: 'pa-3',
        source: 'servicenow',
        sourceId: 'CHG0012345',
        title: 'Database migration to CockroachDB',
        description: 'Moving primary datastore from PostgreSQL to CockroachDB for better distributed performance.',
        timestamp: '3 days ago',
        appId: 'fintravel-agent',
        appName: 'FinTravel AI Agent',
        recommendation: 'assess',
        severity: 'medium',
        aiAnalysis: 'Major infrastructure change moving from PostgreSQL to CockroachDB. While CockroachDB offers similar security features, the migration introduces potential risks around data encryption configuration, connection string handling, and temporary data exposure during migration. Recommend reassessment focusing on data-at-rest encryption and connection security.',
        changes: [
            'Database driver change from pg to cockroachdb',
            'Connection string updates across services',
            'Migration scripts for data transfer',
            'Updated ORM configurations',
        ],
    },
    {
        id: 'pa-4',
        source: 'slack',
        sourceId: '#security-alerts',
        title: 'Third-party dependency vulnerability',
        description: 'Critical CVE detected in lodash dependency used by Travel Booking module.',
        timestamp: '5 hours ago',
        appId: 'fintravel-agent',
        appName: 'FinTravel AI Agent',
        recommendation: 'assess',
        severity: 'high',
        aiAnalysis: 'A critical CVE (CVE-2024-XXXXX) was detected in the lodash package. This vulnerability could allow prototype pollution attacks which may lead to arbitrary code execution. The affected package is used in the Travel Booking module for data transformation. Immediate patching and threat reassessment recommended.',
        changes: [
            'lodash@4.17.19 has known vulnerability',
            'Affects BookingService data processing',
            'Potential prototype pollution vector',
        ],
    },
];

const sourceIcons = {
    jira: Ticket,
    github: GitPullRequest,
    servicenow: GitBranch,
    slack: MessageSquare,
};

const sourceColors = {
    jira: 'text-blue-400 bg-blue-400/10',
    github: 'text-zinc-400 bg-zinc-400/10',
    servicenow: 'text-green-400 bg-green-400/10',
    slack: 'text-purple bg-purple/10',
};

const sourceLabels = {
    jira: 'Jira',
    github: 'GitHub',
    servicenow: 'ServiceNow',
    slack: 'Slack',
};

export default function ApprovalsPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [approvals, setApprovals] = useState(mockApprovals);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'assess' | 'skip'>('all');

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

    const filteredApprovals = approvals.filter((a) =>
        filter === 'all' ? true : a.recommendation === filter
    );

    const handleDismiss = (id: string) => {
        setApprovals((prev) => prev.filter((a) => a.id !== id));
    };

    const handleStartAssessment = (appId: string) => {
        router.push('/analyze');
    };

    return (
        <div className="min-h-screen bg-deep-navy">
            <DashboardNav />

            <main className="container mx-auto px-6 py-8">
                {/* Back Link */}
                <Link href="/dashboard" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-8"
                >
                    <div>
                        <h1 className="text-2xl font-semibold text-white mb-1 flex items-center gap-3">
                            <Bell className="w-6 h-6 text-yellow-500" />
                            Pending Approvals
                        </h1>
                        <p className="text-zinc-400">
                            Review detected changes from your integrations and decide whether to trigger assessments
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="badge bg-yellow-500/15 text-yellow-500">
                            {approvals.filter((a) => a.recommendation === 'assess').length} needs review
                        </span>
                    </div>
                </motion.div>

                {/* Filter Tabs */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex gap-2 mb-6"
                >
                    {[
                        { key: 'all', label: 'All Changes' },
                        { key: 'assess', label: 'Recommend Assess' },
                        { key: 'skip', label: 'Recommend Skip' },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setFilter(tab.key as 'all' | 'assess' | 'skip')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === tab.key
                                    ? 'bg-cyan/20 text-cyan border border-cyan/30'
                                    : 'bg-zinc-800/50 text-zinc-400 border border-zinc-800 hover:border-zinc-700'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </motion.div>

                {/* Approvals List */}
                <div className="space-y-4">
                    {filteredApprovals.map((approval, index) => {
                        const Icon = sourceIcons[approval.source];
                        const isExpanded = expandedId === approval.id;

                        return (
                            <motion.div
                                key={approval.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card className="p-0 overflow-hidden">
                                    {/* Header Row */}
                                    <div
                                        onClick={() => setExpandedId(isExpanded ? null : approval.id)}
                                        className="p-6 cursor-pointer hover:bg-white/5 transition-colors"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-4">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${sourceColors[approval.source]}`}>
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={`text-xs font-medium ${sourceColors[approval.source].split(' ')[0]}`}>
                                                            {sourceLabels[approval.source]}
                                                        </span>
                                                        <span className="text-xs text-zinc-600">•</span>
                                                        <span className="text-xs text-zinc-500">{approval.sourceId}</span>
                                                        <span className="text-xs text-zinc-600">•</span>
                                                        <span className="text-xs text-zinc-500 flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {approval.timestamp}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-white font-medium mb-1">{approval.title}</h3>
                                                    <p className="text-sm text-zinc-400">{approval.description}</p>
                                                    <p className="text-xs text-zinc-600 mt-2">
                                                        Application: {approval.appName}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                {approval.recommendation === 'assess' ? (
                                                    <span className="badge badge-high flex items-center gap-1">
                                                        <AlertTriangle className="w-3 h-3" />
                                                        Recommend Assessment
                                                    </span>
                                                ) : (
                                                    <span className="badge badge-info flex items-center gap-1">
                                                        <CheckCircle className="w-3 h-3" />
                                                        Safe to Skip
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Content */}
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="border-t border-zinc-800"
                                        >
                                            <div className="p-6 bg-midnight/50">
                                                {/* AI Analysis */}
                                                <div className="mb-6">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <Bot className="w-4 h-4 text-cyan" />
                                                        <h4 className="font-medium text-white">AI Analysis</h4>
                                                    </div>
                                                    <div className="p-4 bg-cyan/5 border border-cyan/20 rounded-lg">
                                                        <p className="text-sm text-zinc-300 leading-relaxed">
                                                            {approval.aiAnalysis}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Detected Changes */}
                                                <div className="mb-6">
                                                    <h4 className="font-medium text-white mb-3">Detected Changes</h4>
                                                    <ul className="space-y-2">
                                                        {approval.changes.map((change, i) => (
                                                            <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                                                                <span className="text-cyan mt-1">•</span>
                                                                {change}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                                                    <button className="text-sm text-zinc-500 hover:text-white transition-colors flex items-center gap-1">
                                                        <ExternalLink className="w-3 h-3" />
                                                        View in {sourceLabels[approval.source]}
                                                    </button>
                                                    <div className="flex items-center gap-3">
                                                        <Button
                                                            variant="secondary"
                                                            size="sm"
                                                            icon={<XCircle className="w-3 h-3" />}
                                                            onClick={() => handleDismiss(approval.id)}
                                                        >
                                                            Dismiss
                                                        </Button>
                                                        <Button
                                                            variant="primary"
                                                            size="sm"
                                                            icon={<Zap className="w-3 h-3" />}
                                                            onClick={() => handleStartAssessment(approval.appId)}
                                                        >
                                                            Start Assessment
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>

                {filteredApprovals.length === 0 && (
                    <Card className="p-12 text-center">
                        <CheckCircle className="w-12 h-12 text-emerald mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">All caught up!</h3>
                        <p className="text-zinc-500">No pending approvals in this category.</p>
                    </Card>
                )}
            </main>

            {/* AI Chat Widget */}
            <AIChatWidget context={{ type: 'dashboard' }} />
        </div>
    );
}
