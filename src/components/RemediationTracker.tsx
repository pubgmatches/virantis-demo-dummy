'use client';

import { motion } from 'framer-motion';
import {
    ListTodo,
    CheckCircle,
    Clock,
    AlertCircle,
    ExternalLink,
    ChevronRight
} from 'lucide-react';
import { Card } from '@/components/ui';

interface RemediationItem {
    id: string;
    threatName: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    status: 'open' | 'in_progress' | 'fixed' | 'verified';
    jiraId?: string;
    assignee?: string;
    dueDate?: string;
}

interface RemediationTrackerProps {
    items?: RemediationItem[];
}

const mockItems: RemediationItem[] = [
    {
        id: 'r1',
        threatName: 'SQL Injection in Query Builder',
        severity: 'critical',
        status: 'in_progress',
        jiraId: 'SEC-1001',
        assignee: 'Sarah Chen',
        dueDate: '2025-02-10',
    },
    {
        id: 'r2',
        threatName: 'Memory Poisoning via Context',
        severity: 'critical',
        status: 'open',
        jiraId: 'SEC-1002',
        assignee: 'Unassigned',
        dueDate: '2025-02-15',
    },
    {
        id: 'r3',
        threatName: 'Weak Session Token Generation',
        severity: 'high',
        status: 'fixed',
        jiraId: 'SEC-998',
        assignee: 'Alex Kim',
    },
    {
        id: 'r4',
        threatName: 'CSRF in Payment Form',
        severity: 'high',
        status: 'verified',
        jiraId: 'SEC-995',
        assignee: 'Jordan Lee',
    },
    {
        id: 'r5',
        threatName: 'Missing Rate Limiting on API',
        severity: 'medium',
        status: 'in_progress',
        jiraId: 'SEC-1005',
        assignee: 'Casey Wong',
        dueDate: '2025-02-20',
    },
];

const statusConfig = {
    open: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10', label: 'Open' },
    in_progress: { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10', label: 'In Progress' },
    fixed: { icon: CheckCircle, color: 'text-blue-400', bg: 'bg-blue-400/10', label: 'Fixed' },
    verified: { icon: CheckCircle, color: 'text-emerald', bg: 'bg-emerald/10', label: 'Verified' },
};

const severityBadge = {
    critical: 'badge-critical',
    high: 'badge-high',
    medium: 'badge-medium',
    low: 'badge-low',
};

export function RemediationTracker({ items = mockItems }: RemediationTrackerProps) {
    const stats = {
        total: items.length,
        open: items.filter((i) => i.status === 'open').length,
        inProgress: items.filter((i) => i.status === 'in_progress').length,
        fixed: items.filter((i) => i.status === 'fixed' || i.status === 'verified').length,
    };

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-white flex items-center gap-2">
                    <ListTodo className="w-5 h-5 text-purple" />
                    Remediation Tracker
                </h3>
                <div className="flex items-center gap-2 text-xs">
                    <span className="text-red-500">{stats.open} open</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-yellow-500">{stats.inProgress} in progress</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-emerald">{stats.fixed} resolved</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden mb-6">
                <div className="h-full flex">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(stats.fixed / stats.total) * 100}%` }}
                        transition={{ duration: 0.5 }}
                        className="bg-emerald"
                    />
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(stats.inProgress / stats.total) * 100}%` }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-yellow-500"
                    />
                </div>
            </div>

            {/* Items List */}
            <div className="space-y-3 max-h-[280px] overflow-y-auto">
                {items.map((item, index) => {
                    const StatusIcon = statusConfig[item.status].icon;
                    return (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-3 bg-midnight rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer group"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                    <div className={`mt-0.5 p-1.5 rounded-lg ${statusConfig[item.status].bg}`}>
                                        <StatusIcon className={`w-3 h-3 ${statusConfig[item.status].color}`} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-white font-medium line-clamp-1">
                                            {item.threatName}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`badge text-xs ${severityBadge[item.severity]}`}>
                                                {item.severity}
                                            </span>
                                            {item.jiraId && (
                                                <span className="text-xs text-zinc-500 flex items-center gap-1">
                                                    <ExternalLink className="w-3 h-3" />
                                                    {item.jiraId}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`text-xs ${statusConfig[item.status].color}`}>
                                        {statusConfig[item.status].label}
                                    </span>
                                    {item.dueDate && (
                                        <p className="text-xs text-zinc-600 mt-1">
                                            Due: {new Date(item.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* View All Link */}
            <button className="w-full mt-4 py-2 text-sm text-cyan hover:text-white transition-colors flex items-center justify-center gap-1">
                View full tracker
                <ChevronRight className="w-4 h-4" />
            </button>
        </Card>
    );
}
