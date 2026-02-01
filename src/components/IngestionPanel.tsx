'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Github, Zap, FileImage, X, Check } from 'lucide-react';
import { Button } from '@/components/ui';

interface IngestionPanelProps {
    onAnalyze: (file: File) => void;
    isLoading?: boolean;
}

export function IngestionPanel({ onAnalyze, isLoading = false }: IngestionPanelProps) {
    const [file, setFile] = useState<File | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
        if (droppedFile && isValidFile(droppedFile)) {
            setFile(droppedFile);
        }
    }, []);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && isValidFile(selectedFile)) {
            setFile(selectedFile);
        }
    }, []);

    const isValidFile = (file: File) => {
        const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        return validTypes.includes(file.type);
    };

    const handleAnalyze = () => {
        if (file) {
            onAnalyze(file);
        }
    };

    const clearFile = () => {
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="card max-w-2xl mx-auto"
        >
            <h2 className="text-2xl font-semibold text-white mb-2">Upload Architecture Diagram</h2>
            <p className="text-zinc-400 mb-6">
                Upload your system architecture diagram and let our AI analyze it for security threats
            </p>

            {/* Upload Zone */}
            <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
          upload-zone relative
          ${isDragOver ? 'border-cyan bg-cyan/5' : ''}
          ${file ? 'border-emerald bg-emerald/5' : ''}
        `}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleFileSelect}
                    className="hidden"
                />

                <AnimatePresence mode="wait">
                    {file ? (
                        <motion.div
                            key="file-selected"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex flex-col items-center"
                        >
                            <div className="w-16 h-16 rounded-full bg-emerald/20 flex items-center justify-center mb-4">
                                <Check className="w-8 h-8 text-emerald" />
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                                <FileImage className="w-5 h-5 text-emerald" />
                                <span className="text-white font-medium">{file.name}</span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        clearFile();
                                    }}
                                    className="p-1 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X className="w-4 h-4 text-zinc-400" />
                                </button>
                            </div>
                            <p className="text-zinc-500 text-sm">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="upload-prompt"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex flex-col items-center"
                        >
                            <div className={`w-16 h-16 rounded-full ${isDragOver ? 'bg-cyan/20' : 'bg-dark-blue-gray'} flex items-center justify-center mb-4 transition-colors`}>
                                <Upload className={`w-8 h-8 ${isDragOver ? 'text-cyan' : 'text-zinc-500'} transition-colors`} />
                            </div>
                            <p className="text-white font-medium mb-1">
                                Drag and drop architecture diagram
                            </p>
                            <p className="text-zinc-500 text-sm">
                                or <span className="text-cyan">click to browse</span>
                            </p>
                            <p className="text-zinc-600 text-xs mt-2">
                                Supports PNG, JPG files
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-zinc-800" />
                <span className="text-zinc-500 text-sm">OR</span>
                <div className="flex-1 h-px bg-zinc-800" />
            </div>

            {/* GitHub URL Input */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <label className="text-sm text-zinc-400 flex items-center gap-2">
                        <Github className="w-4 h-4" />
                        GitHub Repository URL
                    </label>
                    <span className="badge badge-info">Coming Soon</span>
                </div>
                <input
                    type="text"
                    placeholder="https://github.com/your-org/your-repo"
                    disabled
                    className="w-full px-4 py-3 bg-dark-blue-gray border border-zinc-800 rounded-lg text-zinc-500 placeholder-zinc-600 cursor-not-allowed"
                />
            </div>

            {/* Analyze Button */}
            <Button
                variant="primary"
                size="lg"
                className="w-full"
                disabled={!file || isLoading}
                loading={isLoading}
                icon={!isLoading ? <Zap className="w-5 h-5" /> : undefined}
                onClick={handleAnalyze}
            >
                {isLoading ? 'Analyzing...' : 'Analyze'}
            </Button>

            {/* Help Text */}
            <p className="text-center text-zinc-600 text-sm mt-4">
                Your diagram will be analyzed using our multi-agent AI system
            </p>
        </motion.div>
    );
}
