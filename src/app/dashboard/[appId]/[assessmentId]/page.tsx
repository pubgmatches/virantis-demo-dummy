'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    ArrowLeft,
    RefreshCw,
    FileText,
    Network,
    Clock,
    Calendar,
    Image as ImageIcon,
    Shield,
    AlertTriangle,
    AlertCircle,
    Info
} from 'lucide-react';
import { DashboardNav } from '@/components/DashboardNav';
import { ThreatDashboard } from '@/components/ThreatDashboard';
import { AttackGraphViz } from '@/components/AttackGraphViz';
import { JiraExportModal } from '@/components/JiraExportModal';
import { Toast } from '@/components/ui/Toast';
import { generateReport } from '@/lib/generateReport';
import { Button, Card, StatCard } from '@/components/ui';
import mockData from '@/data/mock_dashboard.json';
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

export default function AssessmentDetailPage() {
    const router = useRouter();
    const params = useParams();
    const appId = params.appId as string;
    const assessmentId = params.assessmentId as string;

    const [isLoading, setIsLoading] = useState(true);
    const [view, setView] = useState<'dashboard' | 'graph'>('dashboard');
    const [selectedThreat, setSelectedThreat] = useState<Threat | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const app = mockData.applications.find((a) => a.id === appId);
    const assessment = app?.assessments.find((a) => a.id === assessmentId);

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

    if (!app || !assessment) {
        return (
            <div className="min-h-screen bg-deep-navy">
                <DashboardNav />
                <div className="container mx-auto px-6 py-16 text-center">
                    <h1 className="text-2xl text-white mb-4">Assessment not found</h1>
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
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getComponentName = (componentId: string) => {
        const component = threatModelData.components.find((c) => c.id === componentId);
        return component?.name || componentId;
    };

    const handleExportPdf = () => {
        generateReport();
    };

    const handleCreateTicket = (threat: Threat) => {
        setSelectedThreat(threat);
    };

    const handleTicketSuccess = (ticketId: string) => {
        setSelectedThreat(null);
        setToast({
            message: `Ticket ${ticketId} created successfully`,
            type: 'success',
        });
    };

    return (
        <div className="min-h-screen bg-deep-navy">
            <DashboardNav />

            <main className="container mx-auto px-6 py-8">
                {/* Back Link */}
                <Link href={`/dashboard/${appId}`} className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6">
                    <ArrowLeft className="w-4 h-4" />
                    Back to {app.name}
                </Link>

                {/* Assessment Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-white mb-2">
                                Assessment Details
                            </h1>
                            <div className="flex items-center gap-4 text-sm text-zinc-400">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {formatDate(assessment.date)}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    Duration: {assessment.duration}
                                </span>
                                <span className={`badge ${getRiskBadge(assessment.riskLevel)}`}>
                                    {assessment.riskLevel.charAt(0).toUpperCase() + assessment.riskLevel.slice(1)} Risk
                                </span>
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
                        </div>
                    </div>
                </motion.div>

                {/* Intake Preview Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Intake Source</h2>
                        <div className="grid grid-cols-2 gap-6">
                            {/* Diagram Preview */}
                            <div className="bg-midnight rounded-lg border border-zinc-800 p-4">
                                <div className="aspect-video bg-zinc-900 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                                    {/* Mock diagram preview */}
                                    <div className="relative w-full h-full bg-gradient-to-br from-zinc-900 to-zinc-800 flex items-center justify-center">
                                        <div className="absolute inset-0 opacity-50">
                                            {/* Fake diagram elements */}
                                            <div className="absolute top-1/4 left-1/4 w-20 h-12 bg-cyan/20 rounded border border-cyan/30" />
                                            <div className="absolute top-1/4 right-1/4 w-20 h-12 bg-purple/20 rounded border border-purple/30" />
                                            <div className="absolute bottom-1/4 left-1/3 w-24 h-12 bg-emerald/20 rounded border border-emerald/30" />
                                            <div className="absolute top-1/3 left-1/2 w-0.5 h-16 bg-zinc-600" />
                                        </div>
                                        <div className="z-10 flex flex-col items-center gap-2">
                                            <ImageIcon className="w-12 h-12 text-zinc-600" />
                                            <span className="text-zinc-500 text-sm">Architecture Diagram</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm text-zinc-400 flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4 text-cyan" />
                                    {assessment.intakeFile}
                                </p>
                            </div>

                            {/* Metadata */}
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-zinc-500 mb-1">Application</p>
                                    <p className="text-white font-medium">{app.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-500 mb-1">Methodology</p>
                                    <p className="text-white">{assessment.methodology}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-500 mb-1">Status</p>
                                    <span className="badge bg-emerald/15 text-emerald">
                                        {assessment.status.charAt(0).toUpperCase() + assessment.status.slice(1)}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-500 mb-1">Change Summary</p>
                                    <p className="text-zinc-400 text-sm">{assessment.changes}</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Threat Summary Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-4 gap-4 mb-8"
                >
                    <StatCard
                        title="Total Threats"
                        value={assessment.threats.total}
                        icon={<Shield className="w-5 h-5" />}
                    />
                    <StatCard
                        title="Critical"
                        value={assessment.threats.critical}
                        variant="critical"
                        icon={<AlertTriangle className="w-5 h-5" />}
                    />
                    <StatCard
                        title="High"
                        value={assessment.threats.high}
                        variant="high"
                        icon={<AlertCircle className="w-5 h-5" />}
                    />
                    <StatCard
                        title="Medium"
                        value={assessment.threats.medium}
                        variant="medium"
                        icon={<Info className="w-5 h-5" />}
                    />
                </motion.div>

                {/* Threat Results */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={view === 'graph' ? 'h-[calc(100vh-400px)]' : ''}
                >
                    {view === 'dashboard' ? (
                        <ThreatDashboard
                            onViewGraph={() => setView('graph')}
                            onExportPdf={handleExportPdf}
                            onCreateTicket={handleCreateTicket}
                        />
                    ) : (
                        <AttackGraphViz onBack={() => setView('dashboard')} />
                    )}
                </motion.div>
            </main>

            {/* Jira Export Modal */}
            {selectedThreat && (
                <JiraExportModal
                    threat={selectedThreat}
                    componentName={getComponentName(selectedThreat.affectedComponent)}
                    onClose={() => setSelectedThreat(null)}
                    onSuccess={handleTicketSuccess}
                />
            )}

            {/* Toast */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}
