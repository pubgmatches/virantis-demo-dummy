'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield,
    AlertTriangle,
    AlertCircle,
    Info,
    ChevronDown,
    ChevronUp,
    ExternalLink,
    FileText,
    Network
} from 'lucide-react';
import { Button, Card, StatCard } from '@/components/ui';
import threatModelData from '@/data/dummy_threat_model.json';

interface Threat {
    id: string;
    name: string;
    category: string;
    source: string;
    severity: string;
    affectedComponent: string;
    description: string;
    dread: {
        damage: number;
        reproducibility: number;
        exploitability: number;
        affectedUsers: number;
        discoverability: number;
        total: number;
    };
    mitigation: string;
    status: string;
}

interface ThreatDashboardProps {
    onViewGraph: () => void;
    onExportPdf: () => void;
    onCreateTicket: (threat: Threat) => void;
}

export function ThreatDashboard({ onViewGraph, onExportPdf, onCreateTicket }: ThreatDashboardProps) {
    const [expandedThreat, setExpandedThreat] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<'severity' | 'name'>('severity');

    const { threats, summary, application, components } = threatModelData;

    const getComponentName = (componentId: string) => {
        const component = components.find((c) => c.id === componentId);
        return component?.name || componentId;
    };

    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };

    const sortedThreats = [...threats].sort((a, b) => {
        if (sortBy === 'severity') {
            return (severityOrder[a.severity as keyof typeof severityOrder] || 4) -
                (severityOrder[b.severity as keyof typeof severityOrder] || 4);
        }
        return a.name.localeCompare(b.name);
    });

    const getSeverityBadge = (severity: string) => {
        const styles = {
            critical: 'badge-critical',
            high: 'badge-high',
            medium: 'badge-medium',
            low: 'badge-low',
        };
        return styles[severity as keyof typeof styles] || 'badge-info';
    };

    const getCategoryLabel = (category: string) => {
        if (category === 'Agentic') return 'Agentic';
        if (category.startsWith('STRIDE-')) return category.replace('STRIDE-', '');
        return category;
    };

    const toggleThreat = (threatId: string) => {
        setExpandedThreat(expandedThreat === threatId ? null : threatId);
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Application Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-semibold mb-2">
                    <span className="text-white">Threat Analysis: </span>
                    <span className="text-cyan">{application.name}</span>
                </h1>
                <p className="text-zinc-400">{application.description}</p>
            </motion.div>

            {/* Summary Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-4 gap-4 mb-8"
            >
                <StatCard
                    title="Total Threats"
                    value={summary.totalThreats}
                    icon={<Shield className="w-5 h-5" />}
                />
                <StatCard
                    title="Critical"
                    value={summary.critical}
                    variant="critical"
                    icon={<AlertTriangle className="w-5 h-5" />}
                />
                <StatCard
                    title="High"
                    value={summary.high}
                    variant="high"
                    icon={<AlertCircle className="w-5 h-5" />}
                />
                <StatCard
                    title="Medium"
                    value={summary.medium}
                    variant="medium"
                    icon={<Info className="w-5 h-5" />}
                />
            </motion.div>

            {/* Action Bar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-between mb-6"
            >
                <div className="flex items-center gap-4">
                    <Button variant="primary" icon={<Network className="w-4 h-4" />} onClick={onViewGraph}>
                        View Attack Graph
                    </Button>
                    <Button variant="secondary" icon={<FileText className="w-4 h-4" />} onClick={onExportPdf}>
                        Export PDF Report
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-zinc-500 text-sm">Sort by:</span>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'severity' | 'name')}
                        className="bg-dark-blue-gray border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan"
                    >
                        <option value="severity">Severity</option>
                        <option value="name">Name</option>
                    </select>
                </div>
            </motion.div>

            {/* Threats Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card p-0 overflow-hidden"
            >
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-zinc-800 text-sm font-medium text-zinc-400">
                    <div className="col-span-2">Severity</div>
                    <div className="col-span-3">Threat Name</div>
                    <div className="col-span-2">Category</div>
                    <div className="col-span-3">Affected Component</div>
                    <div className="col-span-2">Source</div>
                </div>

                {/* Table Body */}
                {sortedThreats.map((threat) => (
                    <div key={threat.id}>
                        {/* Row */}
                        <div
                            onClick={() => toggleThreat(threat.id)}
                            className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-zinc-800/50 hover:bg-white/5 cursor-pointer transition-colors items-center"
                        >
                            <div className="col-span-2">
                                <span className={`badge ${getSeverityBadge(threat.severity)}`}>
                                    {threat.severity.charAt(0).toUpperCase() + threat.severity.slice(1)}
                                </span>
                            </div>
                            <div className="col-span-3 text-white font-medium flex items-center gap-2">
                                {threat.name}
                                {expandedThreat === threat.id ? (
                                    <ChevronUp className="w-4 h-4 text-zinc-500" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 text-zinc-500" />
                                )}
                            </div>
                            <div className="col-span-2">
                                <span className={`badge ${threat.category === 'Agentic' ? 'badge-info' : 'bg-purple/15 text-purple'}`}>
                                    {getCategoryLabel(threat.category)}
                                </span>
                            </div>
                            <div className="col-span-3 text-zinc-400">
                                {getComponentName(threat.affectedComponent)}
                            </div>
                            <div className="col-span-2 text-zinc-500 text-sm">
                                {threat.source}
                            </div>
                        </div>

                        {/* Expanded Details */}
                        <AnimatePresence>
                            {expandedThreat === threat.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-6 py-6 bg-midnight border-b border-zinc-800">
                                        <div className="grid grid-cols-2 gap-8">
                                            {/* Description & Mitigation */}
                                            <div>
                                                <h4 className="text-white font-medium mb-2">Description</h4>
                                                <p className="text-zinc-400 text-sm mb-4 leading-relaxed">
                                                    {threat.description}
                                                </p>

                                                <h4 className="text-white font-medium mb-2">Recommended Mitigation</h4>
                                                <p className="text-zinc-400 text-sm leading-relaxed">
                                                    {threat.mitigation}
                                                </p>
                                            </div>

                                            {/* DREAD Score */}
                                            <div>
                                                <h4 className="text-white font-medium mb-4">DREAD Score</h4>
                                                <div className="space-y-3">
                                                    {Object.entries(threat.dread).filter(([key]) => key !== 'total').map(([key, value]) => (
                                                        <div key={key} className="flex items-center gap-4">
                                                            <span className="text-zinc-500 text-sm capitalize w-32">
                                                                {key === 'affectedUsers' ? 'Affected Users' : key}
                                                            </span>
                                                            <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-gradient-to-r from-cyan to-purple"
                                                                    style={{ width: `${(value as number) * 10}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-white text-sm w-8">{value}/10</span>
                                                        </div>
                                                    ))}
                                                    <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
                                                        <span className="text-white font-medium">Total Score</span>
                                                        <span className="text-cyan text-xl font-semibold">{threat.dread.total}/50</span>
                                                    </div>
                                                </div>

                                                {/* Action Button */}
                                                <div className="mt-6">
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        icon={<ExternalLink className="w-4 h-4" />}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onCreateTicket(threat as Threat);
                                                        }}
                                                    >
                                                        Create Jira Ticket
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </motion.div>

            {/* Recommendations */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8"
            >
                <Card>
                    <h3 className="text-lg font-semibold text-white mb-4">Key Recommendations</h3>
                    <ul className="space-y-2">
                        {summary.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start gap-3 text-zinc-400">
                                <span className="text-cyan mt-1">•</span>
                                <span>{rec}</span>
                            </li>
                        ))}
                    </ul>
                </Card>
            </motion.div>
        </div>
    );
}
