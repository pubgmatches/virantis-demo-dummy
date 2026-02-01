'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';

interface PipelineStage {
    id: number;
    name: string;
    description: string;
    statusText: string;
}

const stages: PipelineStage[] = [
    {
        id: 1,
        name: 'Intake & Detection',
        description: 'Processing uploaded diagram',
        statusText: 'Vision-Language Model Scanning...',
    },
    {
        id: 2,
        name: 'AI Decision Engine',
        description: 'Analyzing architecture patterns',
        statusText: 'Constructing Logic Attack Graph...',
    },
    {
        id: 3,
        name: 'STRIDE/PASTA Execution',
        description: 'Executing threat methodologies',
        statusText: 'Mapping OWASP Agentic Risks...',
    },
    {
        id: 4,
        name: 'Interactive Clarification',
        description: 'Identifying components',
        statusText: 'Identifying Trust Boundaries...',
    },
    {
        id: 5,
        name: 'Actionable Threat Report',
        description: 'Generating report',
        statusText: 'Generating Threat Report...',
    },
];

interface ProgressPipelineProps {
    onComplete: () => void;
}

export function ProgressPipeline({ onComplete }: ProgressPipelineProps) {
    const [currentStage, setCurrentStage] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (currentStage < stages.length) {
            const timer = setTimeout(() => {
                setCurrentStage((prev) => prev + 1);
            }, 600); // ~600ms per stage

            return () => clearTimeout(timer);
        } else if (!isComplete) {
            // All stages complete
            setIsComplete(true);
            const completeTimer = setTimeout(() => {
                onComplete();
            }, 500); // Short delay before navigation

            return () => clearTimeout(completeTimer);
        }
    }, [currentStage, isComplete, onComplete]);

    const getStageStatus = (stageIndex: number) => {
        if (stageIndex < currentStage) return 'complete';
        if (stageIndex === currentStage) return 'active';
        return 'pending';
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Pipeline Visualization */}
            <div className="flex items-start justify-between mb-16">
                {stages.map((stage, index) => {
                    const status = getStageStatus(index);
                    return (
                        <div key={stage.id} className="flex items-center flex-1">
                            {/* Stage Circle and Label */}
                            <div className="flex flex-col items-center">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{
                                        scale: 1,
                                        opacity: 1,
                                    }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`
                    w-14 h-14 rounded-full flex items-center justify-center text-lg font-semibold
                    transition-all duration-300
                    ${status === 'pending' ? 'bg-midnight border-2 border-zinc-700 text-zinc-500' : ''}
                    ${status === 'active' ? 'bg-gradient-to-br from-electric-blue to-purple text-white animate-pulse-glow' : ''}
                    ${status === 'complete' ? 'bg-gradient-to-br from-electric-blue to-purple text-white' : ''}
                  `}
                                >
                                    {status === 'complete' ? (
                                        <Check className="w-6 h-6" />
                                    ) : status === 'active' ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        stage.id
                                    )}
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 + 0.2 }}
                                    className="text-center mt-3"
                                >
                                    <p className={`
                    text-sm font-medium transition-colors duration-300
                    ${status === 'active' ? 'text-cyan' : ''}
                    ${status === 'complete' ? 'text-white' : ''}
                    ${status === 'pending' ? 'text-zinc-500' : ''}
                  `}>
                                        {stage.name}
                                    </p>
                                </motion.div>
                            </div>

                            {/* Connector */}
                            {index < stages.length - 1 && (
                                <div className="flex-1 h-0.5 mx-3 mt-7">
                                    <motion.div
                                        initial={{ scaleX: 0 }}
                                        animate={{
                                            scaleX: status === 'complete' || (status === 'active' && index < currentStage) ? 1 : 0
                                        }}
                                        style={{ transformOrigin: 'left' }}
                                        transition={{ duration: 0.3 }}
                                        className={`
                      h-full origin-left
                      ${index < currentStage ? 'bg-gradient-to-r from-electric-blue to-purple' : 'bg-zinc-700'}
                    `}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Current Status Text */}
            <motion.div
                key={currentStage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center"
            >
                <AnimatePresence mode="wait">
                    {currentStage < stages.length && (
                        <motion.div
                            key={stages[currentStage]?.statusText}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-purple/10 border border-purple/20"
                        >
                            <Loader2 className="w-5 h-5 text-purple animate-spin" />
                            <span className="text-purple font-medium">
                                {stages[currentStage]?.statusText}
                            </span>
                        </motion.div>
                    )}
                    {isComplete && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-emerald/10 border border-emerald/20"
                        >
                            <Check className="w-5 h-5 text-emerald" />
                            <span className="text-emerald font-medium">
                                Analysis Complete!
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Progress Bar */}
            <div className="mt-8 h-1 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentStage / stages.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                    className="h-full bg-gradient-to-r from-electric-blue via-purple to-pink"
                />
            </div>

            {/* Stage Details */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 grid grid-cols-5 gap-2 text-center text-xs text-zinc-600"
            >
                {stages.map((stage, index) => {
                    const status = getStageStatus(index);
                    return (
                        <div
                            key={stage.id}
                            className={`transition-colors duration-300 ${status !== 'pending' ? 'text-zinc-400' : ''}`}
                        >
                            {stage.description}
                        </div>
                    );
                })}
            </motion.div>
        </div>
    );
}
