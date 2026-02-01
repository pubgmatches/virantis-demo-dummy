'use client';

import { motion } from 'framer-motion';
import { Shield, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui';

interface SecurityScorecardProps {
    score?: number;
    criticalOpen?: number;
    highPending?: number;
    resolvedThisMonth?: number;
    trend?: number;
}

export function SecurityScorecard({
    score = 72,
    criticalOpen = 0,
    highPending = 2,
    resolvedThisMonth = 5,
    trend = 5,
}: SecurityScorecardProps) {
    const getGrade = (score: number) => {
        if (score >= 90) return { grade: 'A', label: 'Excellent' };
        if (score >= 80) return { grade: 'A-', label: 'Very Good' };
        if (score >= 70) return { grade: 'B+', label: 'Good' };
        if (score >= 60) return { grade: 'B', label: 'Moderate' };
        if (score >= 50) return { grade: 'C', label: 'Fair' };
        return { grade: 'D', label: 'Needs Work' };
    };

    const { grade, label } = getGrade(score);

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-emerald';
        if (score >= 60) return 'text-yellow-500';
        return 'text-red-500';
    };

    const getProgressColor = (score: number) => {
        if (score >= 80) return 'from-emerald to-emerald';
        if (score >= 60) return 'from-yellow-500 to-yellow-500';
        return 'from-red-500 to-red-500';
    };

    return (
        <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
                <Shield className="w-5 h-5 text-cyan" />
                <h3 className="font-semibold text-white">Security Scorecard</h3>
            </div>

            {/* Score Ring */}
            <div className="flex items-center justify-center mb-6">
                <div className="relative w-32 h-32">
                    {/* Background ring */}
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="64"
                            cy="64"
                            r="56"
                            strokeWidth="12"
                            stroke="currentColor"
                            fill="none"
                            className="text-zinc-800"
                        />
                        <motion.circle
                            cx="64"
                            cy="64"
                            r="56"
                            strokeWidth="12"
                            stroke="url(#scoreGradient)"
                            fill="none"
                            strokeLinecap="round"
                            initial={{ strokeDasharray: '0 352' }}
                            animate={{ strokeDasharray: `${(score / 100) * 352} 352` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                        />
                        <defs>
                            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor={score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444'} />
                                <stop offset="100%" stopColor={score >= 80 ? '#059669' : score >= 60 ? '#d97706' : '#dc2626'} />
                            </linearGradient>
                        </defs>
                    </svg>
                    {/* Center content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.span
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            className={`text-3xl font-bold ${getScoreColor(score)}`}
                        >
                            {score}
                        </motion.span>
                        <span className="text-sm text-zinc-400">/100</span>
                    </div>
                </div>
            </div>

            {/* Grade */}
            <div className="text-center mb-6">
                <span className={`text-4xl font-bold ${getScoreColor(score)}`}>{grade}</span>
                <p className="text-sm text-zinc-400 mt-1">{label}</p>
            </div>

            {/* Stats */}
            <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-midnight rounded-lg">
                    {criticalOpen === 0 ? (
                        <>
                            <span className="text-sm text-zinc-400 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-emerald" />
                                No critical issues
                            </span>
                            <span className="text-emerald font-medium">✓</span>
                        </>
                    ) : (
                        <>
                            <span className="text-sm text-zinc-400 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-red-500" />
                                Critical issues
                            </span>
                            <span className="text-red-500 font-medium">{criticalOpen}</span>
                        </>
                    )}
                </div>

                <div className="flex items-center justify-between p-3 bg-midnight rounded-lg">
                    <span className="text-sm text-zinc-400">High priority pending</span>
                    <span className="text-yellow-500 font-medium">{highPending}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-midnight rounded-lg">
                    <span className="text-sm text-zinc-400 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald" />
                        From last month
                    </span>
                    <span className={`font-medium ${trend >= 0 ? 'text-emerald' : 'text-red-500'}`}>
                        {trend >= 0 ? '+' : ''}{trend} pts
                    </span>
                </div>
            </div>
        </Card>
    );
}
