'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Upload,
    Github,
    Zap,
    FileImage,
    X,
    Check,
    FileText,
    Code2,
    Ticket,
    ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui';

interface IntakeSource {
    id: string;
    label: string;
    icon: React.ElementType;
    description: string;
    available: boolean;
}

const intakeSources: IntakeSource[] = [
    { id: 'diagram', label: 'Architecture Diagram', icon: FileImage, description: 'PNG, JPG, SVG files', available: true },
    { id: 'jira', label: 'Jira Ticket', icon: Ticket, description: 'Import from ticket', available: true },
    { id: 'text', label: 'Text Description', icon: FileText, description: 'Describe your app', available: true },
    { id: 'iac', label: 'Infrastructure as Code', icon: Code2, description: 'Terraform, YAML', available: true },
    { id: 'github', label: 'GitHub Repository', icon: Github, description: 'Analyze codebase', available: true },
];

interface EnhancedIngestionPanelProps {
    onContinue: (data: {
        sources: string[];
        file?: File;
        jiraTicket?: string;
        description?: string;
        iacFile?: File;
        githubUrl?: string;
    }) => void;
    isLoading?: boolean;
}

export function EnhancedIngestionPanel({ onContinue, isLoading = false }: EnhancedIngestionPanelProps) {
    const [selectedSources, setSelectedSources] = useState<string[]>(['diagram']);
    const [file, setFile] = useState<File | null>(null);
    const [jiraTicket, setJiraTicket] = useState('');
    const [description, setDescription] = useState('');
    const [iacFile, setIacFile] = useState<File | null>(null);
    const [githubUrl, setGithubUrl] = useState('');
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const iacInputRef = useRef<HTMLInputElement>(null);

    const toggleSource = (sourceId: string) => {
        setSelectedSources((prev) => {
            if (prev.includes(sourceId)) {
                return prev.filter((s) => s !== sourceId);
            }
            return [...prev, sourceId];
        });
    };

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            setFile(droppedFile);
        }
    }, []);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    }, []);

    const handleIacSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setIacFile(selectedFile);
        }
    }, []);

    const clearFile = () => {
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const clearIacFile = () => {
        setIacFile(null);
        if (iacInputRef.current) iacInputRef.current.value = '';
    };

    const canContinue = () => {
        if (selectedSources.length === 0) return false;
        if (selectedSources.includes('diagram') && !file) return false;
        if (selectedSources.includes('jira') && !jiraTicket.trim()) return false;
        if (selectedSources.includes('text') && !description.trim()) return false;
        if (selectedSources.includes('iac') && !iacFile) return false;
        if (selectedSources.includes('github') && !githubUrl.trim()) return false;
        return true;
    };

    const handleContinue = () => {
        onContinue({
            sources: selectedSources,
            file: file || undefined,
            jiraTicket: jiraTicket || undefined,
            description: description || undefined,
            iacFile: iacFile || undefined,
            githubUrl: githubUrl || undefined,
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="card max-w-3xl mx-auto"
        >
            <h2 className="text-2xl font-semibold text-white mb-2">Start New Assessment</h2>
            <p className="text-zinc-400 mb-6">
                Select one or more intake sources for your threat analysis
            </p>

            {/* Source Selection */}
            <div className="grid grid-cols-5 gap-3 mb-8">
                {intakeSources.map((source) => (
                    <motion.button
                        key={source.id}
                        onClick={() => toggleSource(source.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`relative p-4 rounded-xl border-2 transition-all text-center ${selectedSources.includes(source.id)
                                ? 'border-cyan bg-cyan/10'
                                : 'border-zinc-800 bg-midnight hover:border-zinc-700'
                            } ${!source.available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        disabled={!source.available}
                    >
                        {selectedSources.includes(source.id) && (
                            <div className="absolute top-2 right-2 w-4 h-4 bg-cyan rounded-full flex items-center justify-center">
                                <Check className="w-2.5 h-2.5 text-white" />
                            </div>
                        )}
                        <source.icon className={`w-6 h-6 mx-auto mb-2 ${selectedSources.includes(source.id) ? 'text-cyan' : 'text-zinc-500'
                            }`} />
                        <p className={`text-xs font-medium ${selectedSources.includes(source.id) ? 'text-white' : 'text-zinc-400'
                            }`}>
                            {source.label}
                        </p>
                    </motion.button>
                ))}
            </div>

            {/* Dynamic Input Areas */}
            <div className="space-y-6">
                {/* Diagram Upload */}
                <AnimatePresence>
                    {selectedSources.includes('diagram') && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <label className="block text-sm text-zinc-400 mb-2 flex items-center gap-2">
                                <FileImage className="w-4 h-4" />
                                Architecture Diagram
                            </label>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={`upload-zone p-6 ${isDragOver ? 'border-cyan bg-cyan/5' : ''} ${file ? 'border-emerald bg-emerald/5' : ''}`}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                                {file ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <Check className="w-5 h-5 text-emerald" />
                                        <span className="text-white">{file.name}</span>
                                        <button onClick={(e) => { e.stopPropagation(); clearFile(); }} className="p-1 hover:bg-white/10 rounded">
                                            <X className="w-4 h-4 text-zinc-400" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <Upload className="w-8 h-8 text-zinc-500 mb-2" />
                                        <p className="text-zinc-400">Drop diagram or <span className="text-cyan">browse</span></p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Jira Ticket */}
                <AnimatePresence>
                    {selectedSources.includes('jira') && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <label className="block text-sm text-zinc-400 mb-2 flex items-center gap-2">
                                <Ticket className="w-4 h-4" />
                                Jira Ticket ID
                            </label>
                            <input
                                type="text"
                                value={jiraTicket}
                                onChange={(e) => setJiraTicket(e.target.value)}
                                placeholder="SEC-1234 or full URL"
                                className="w-full px-4 py-3 bg-midnight border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:border-cyan focus:outline-none transition-colors"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Text Description */}
                <AnimatePresence>
                    {selectedSources.includes('text') && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <label className="block text-sm text-zinc-400 mb-2 flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Application Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe your application, its components, data flows, and security concerns..."
                                rows={4}
                                className="w-full px-4 py-3 bg-midnight border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:border-cyan focus:outline-none transition-colors resize-none"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* IaC Upload */}
                <AnimatePresence>
                    {selectedSources.includes('iac') && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <label className="block text-sm text-zinc-400 mb-2 flex items-center gap-2">
                                <Code2 className="w-4 h-4" />
                                Infrastructure as Code
                            </label>
                            <div
                                onClick={() => iacInputRef.current?.click()}
                                className={`upload-zone p-6 ${iacFile ? 'border-emerald bg-emerald/5' : ''}`}
                            >
                                <input
                                    ref={iacInputRef}
                                    type="file"
                                    accept=".tf,.yaml,.yml,.json"
                                    onChange={handleIacSelect}
                                    className="hidden"
                                />
                                {iacFile ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <Check className="w-5 h-5 text-emerald" />
                                        <span className="text-white">{iacFile.name}</span>
                                        <button onClick={(e) => { e.stopPropagation(); clearIacFile(); }} className="p-1 hover:bg-white/10 rounded">
                                            <X className="w-4 h-4 text-zinc-400" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <Code2 className="w-8 h-8 text-zinc-500 mb-2" />
                                        <p className="text-zinc-400">Upload Terraform, YAML, or JSON</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* GitHub URL */}
                <AnimatePresence>
                    {selectedSources.includes('github') && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <label className="block text-sm text-zinc-400 mb-2 flex items-center gap-2">
                                <Github className="w-4 h-4" />
                                GitHub Repository URL
                            </label>
                            <input
                                type="text"
                                value={githubUrl}
                                onChange={(e) => setGithubUrl(e.target.value)}
                                placeholder="https://github.com/your-org/your-repo"
                                className="w-full px-4 py-3 bg-midnight border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:border-cyan focus:outline-none transition-colors"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Continue Button */}
            <div className="mt-8">
                <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    disabled={!canContinue() || isLoading}
                    loading={isLoading}
                    icon={!isLoading ? <ChevronRight className="w-5 h-5" /> : undefined}
                    onClick={handleContinue}
                >
                    Continue to Clarification
                </Button>
                <p className="text-center text-zinc-600 text-sm mt-3">
                    Our AI may ask follow-up questions to improve the analysis
                </p>
            </div>
        </motion.div>
    );
}
