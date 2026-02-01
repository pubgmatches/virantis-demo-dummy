'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card } from '@/components/ui';

interface DataPoint {
    date: string;
    score: number;
    threats: number;
    label: string;
}

interface RiskTimelineProps {
    data?: DataPoint[];
}

const mockData: DataPoint[] = [
    { date: '2024-09', score: 45, threats: 8, label: 'Sep' },
    { date: '2024-10', score: 52, threats: 10, label: 'Oct' },
    { date: '2024-11', score: 48, threats: 9, label: 'Nov' },
    { date: '2024-12', score: 65, threats: 14, label: 'Dec' },
    { date: '2025-01', score: 58, threats: 12, label: 'Jan' },
    { date: '2025-02', score: 72, threats: 16, label: 'Feb' },
];

export function RiskTimeline({ data = mockData }: RiskTimelineProps) {
    const maxScore = Math.max(...data.map((d) => d.score));
    const minScore = Math.min(...data.map((d) => d.score));
    const currentScore = data[data.length - 1].score;
    const previousScore = data[data.length - 2].score;
    const trend = currentScore > previousScore ? 'up' : currentScore < previousScore ? 'down' : 'stable';
    const trendChange = Math.abs(currentScore - previousScore);

    const getScoreColor = (score: number) => {
        if (score >= 70) return 'text-red-500';
        if (score >= 50) return 'text-orange-500';
        if (score >= 30) return 'text-yellow-500';
        return 'text-emerald';
    };

    const getBarColor = (score: number) => {
        if (score >= 70) return 'from-red-500/60 to-red-500';
        if (score >= 50) return 'from-orange-500/60 to-orange-500';
        if (score >= 30) return 'from-yellow-500/60 to-yellow-500';
        return 'from-emerald/60 to-emerald';
    };

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-white">Risk Score Trend</h3>
                <div className="flex items-center gap-2 text-sm">
                    {trend === 'up' && <TrendingUp className="w-4 h-4 text-red-500" />}
                    {trend === 'down' && <TrendingDown className="w-4 h-4 text-emerald" />}
                    {trend === 'stable' && <Minus className="w-4 h-4 text-zinc-500" />}
                    <span className={`${trend === 'up' ? 'text-red-500' : trend === 'down' ? 'text-emerald' : 'text-zinc-500'}`}>
                        {trend === 'up' ? '+' : trend === 'down' ? '-' : ''}{trendChange} pts
                    </span>
                </div>
            </div>

            {/* Chart */}
            <div className="relative h-32">
                {/* Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                    {[0, 1, 2, 3].map((i) => (
                        <div key={i} className="border-t border-zinc-800/50" />
                    ))}
                </div>

                {/* Bars */}
                <div className="relative h-full flex items-end justify-between gap-2">
                    {data.map((point, index) => {
                        const height = ((point.score - minScore + 10) / (maxScore - minScore + 20)) * 100;
                        const isLast = index === data.length - 1;

                        return (
                            <motion.div
                                key={point.date}
                                initial={{ height: 0 }}
                                animate={{ height: `${height}%` }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="flex-1 relative group cursor-pointer"
                            >
                                <div
                                    className={`w-full h-full rounded-t-lg bg-gradient-to-t ${getBarColor(point.score)} ${isLast ? 'ring-2 ring-white/20' : ''
                                        }`}
                                />

                                {/* Tooltip */}
                                <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs whitespace-nowrap">
                                        <p className="text-white font-medium">Score: {point.score}</p>
                                        <p className="text-zinc-400">{point.threats} threats</p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Labels */}
            <div className="flex justify-between mt-2">
                {data.map((point) => (
                    <span key={point.date} className="text-xs text-zinc-500 flex-1 text-center">
                        {point.label}
                    </span>
                ))}
            </div>

            {/* Current Score */}
            <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center justify-between">
                <span className="text-sm text-zinc-400">Current Risk Score</span>
                <span className={`text-2xl font-bold ${getScoreColor(currentScore)}`}>
                    {currentScore}
                </span>
            </div>
        </Card>
    );
}
