'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Bell,
    AlertTriangle,
    ChevronRight,
    GitPullRequest,
    MessageSquare,
    Ticket,
    GitBranch
} from 'lucide-react';
import { Card } from '@/components/ui';

interface PendingApproval {
    id: string;
    source: 'jira' | 'github' | 'servicenow' | 'slack';
    title: string;
    description: string;
    timestamp: string;
    appName: string;
    recommendation: 'assess' | 'skip';
    severity: 'high' | 'medium' | 'low';
}

const mockApprovals: PendingApproval[] = [
    {
        id: 'pa-1',
        source: 'jira',
        title: 'SEC-1234: Add new payment provider',
        description: 'Integration with Stripe Connect for vendor payouts',
        timestamp: '2 hours ago',
        appName: 'PaymentGateway API',
        recommendation: 'assess',
        severity: 'high',
    },
    {
        id: 'pa-2',
        source: 'github',
        title: 'PR #142: Refactor auth middleware',
        description: 'Updated JWT validation logic',
        timestamp: '1 day ago',
        appName: 'AuthService',
        recommendation: 'skip',
        severity: 'low',
    },
    {
        id: 'pa-3',
        source: 'servicenow',
        title: 'CHG0012345: Database migration',
        description: 'Moving from PostgreSQL to CockroachDB',
        timestamp: '3 days ago',
        appName: 'FinTravel AI Agent',
        recommendation: 'assess',
        severity: 'medium',
    },
];

const sourceIcons = {
    jira: Ticket,
    github: GitPullRequest,
    servicenow: GitBranch,
    slack: MessageSquare,
};

const sourceColors = {
    jira: 'text-blue-400',
    github: 'text-zinc-400',
    servicenow: 'text-green-400',
    slack: 'text-purple',
};

export function PendingApprovals() {
    const pendingCount = mockApprovals.filter((a) => a.recommendation === 'assess').length;

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white flex items-center gap-2">
                    <Bell className="w-4 h-4 text-yellow-500" />
                    Pending Approvals
                </h3>
                {pendingCount > 0 && (
                    <span className="badge bg-yellow-500/15 text-yellow-500">
                        {pendingCount} needs review
                    </span>
                )}
            </div>

            <div className="space-y-3">
                {mockApprovals.slice(0, 3).map((approval) => {
                    const Icon = sourceIcons[approval.source];
                    return (
                        <motion.div
                            key={approval.id}
                            whileHover={{ x: 2 }}
                            className="p-3 rounded-lg bg-midnight border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                    <div className={`mt-0.5 ${sourceColors[approval.source]}`}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-white font-medium line-clamp-1">
                                            {approval.title}
                                        </p>
                                        <p className="text-xs text-zinc-500 mt-0.5">
                                            {approval.appName} • {approval.timestamp}
                                        </p>
                                    </div>
                                </div>
                                {approval.recommendation === 'assess' ? (
                                    <span className="badge badge-high text-xs">Assess</span>
                                ) : (
                                    <span className="badge badge-info text-xs">Skip</span>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <Link href="/dashboard/approvals" className="block mt-4">
                <button className="w-full py-2 text-sm text-cyan hover:text-white transition-colors flex items-center justify-center gap-1">
                    View all approvals
                    <ChevronRight className="w-4 h-4" />
                </button>
            </Link>
        </Card>
    );
}
