'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ThreatDashboard } from '@/components/ThreatDashboard';
import { AttackGraphViz } from '@/components/AttackGraphViz';
import { JiraExportModal } from '@/components/JiraExportModal';
import { Toast } from '@/components/ui/Toast';
import { generateReport } from '@/lib/generateReport';
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

export default function ResultsPage() {
    const [view, setView] = useState<'dashboard' | 'graph'>('dashboard');
    const [selectedThreat, setSelectedThreat] = useState<Threat | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const { components } = threatModelData;

    const getComponentName = useCallback((componentId: string) => {
        const component = components.find((c) => c.id === componentId);
        return component?.name || componentId;
    }, [components]);

    const handleViewGraph = () => {
        setView('graph');
    };

    const handleBackToDashboard = () => {
        setView('dashboard');
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

    const handleCloseModal = () => {
        setSelectedThreat(null);
    };

    const handleCloseToast = () => {
        setToast(null);
    };

    return (
        <main className="min-h-screen bg-deep-navy relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-gradient-radial from-purple/10 via-transparent to-transparent blur-3xl" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-radial from-cyan/10 via-transparent to-transparent blur-3xl" />
            </div>

            {/* Navigation */}
            <nav className="relative z-10 container mx-auto px-4 sm:px-6 py-4 sm:py-6">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-cyan" />
                        <span className="text-lg sm:text-xl font-semibold">Virantis</span>
                    </Link>
                    <Link
                        href="/analyze"
                        className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        New Analysis
                    </Link>
                </div>
            </nav>

            {/* Content */}
            <section className="relative z-10 container mx-auto px-4 sm:px-6 py-4 sm:py-8">
                <motion.div
                    key={view}
                    initial={{ opacity: 0, x: view === 'graph' ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: view === 'graph' ? -20 : 20 }}
                    transition={{ duration: 0.3 }}
                    className={view === 'graph' ? 'h-[calc(100vh-180px)]' : ''}
                >
                    {view === 'dashboard' ? (
                        <ThreatDashboard
                            onViewGraph={handleViewGraph}
                            onExportPdf={handleExportPdf}
                            onCreateTicket={handleCreateTicket}
                        />
                    ) : (
                        <AttackGraphViz onBack={handleBackToDashboard} />
                    )}
                </motion.div>
            </section>

            {/* Jira Export Modal */}
            {selectedThreat && (
                <JiraExportModal
                    threat={selectedThreat}
                    componentName={getComponentName(selectedThreat.affectedComponent)}
                    onClose={handleCloseModal}
                    onSuccess={handleTicketSuccess}
                />
            )}

            {/* Toast Notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={handleCloseToast}
                />
            )}
        </main>
    );
}
