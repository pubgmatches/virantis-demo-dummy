'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    ArrowLeft,
    Bot,
    User,
    Send,
    ChevronRight,
    SkipForward,
    HelpCircle,
    CheckCircle
} from 'lucide-react';
import { Button, Card } from '@/components/ui';

interface Message {
    id: string;
    role: 'assistant' | 'user';
    content: string;
    isQuestion?: boolean;
}

interface ClarificationQuestion {
    id: string;
    question: string;
    options?: string[];
    answered: boolean;
    answer?: string;
}

const mockQuestions: ClarificationQuestion[] = [
    {
        id: 'q1',
        question: 'I see a connection to an external "Payment API". Does this handle PCI-DSS regulated card data directly, or is it tokenized?',
        options: ['PCI-DSS regulated (direct card data)', 'Tokenized only', 'Not sure'],
        answered: false,
    },
    {
        id: 'q2',
        question: 'The "Memory Store" component appears to persist conversation context. What is the retention period for this data?',
        options: ['24 hours', '7 days', '30 days', 'Indefinite'],
        answered: false,
    },
    {
        id: 'q3',
        question: 'Is the Email Fetcher component reading from user mailboxes directly, or only from a shared inbox?',
        options: ['User mailboxes (OAuth)', 'Shared inbox only', 'Both'],
        answered: false,
    },
];

export default function ClarifyPage() {
    const router = useRouter();
    const [questions, setQuestions] = useState(mockQuestions);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [customAnswer, setCustomAnswer] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'intro',
            role: 'assistant',
            content: "I've analyzed your intake sources and have a few clarifying questions before running the full threat model. This helps me provide more accurate and relevant security recommendations.",
        },
        {
            id: 'q1-msg',
            role: 'assistant',
            content: mockQuestions[0].question,
            isQuestion: true,
        },
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const currentQuestion = questions[currentQuestionIndex];
    const answeredCount = questions.filter((q) => q.answered).length;
    const allAnswered = answeredCount === questions.length;

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleAnswer = async (answer: string) => {
        // Add user message
        setMessages((prev) => [...prev, {
            id: `user-${currentQuestionIndex}`,
            role: 'user',
            content: answer,
        }]);

        // Mark question as answered
        setQuestions((prev) => prev.map((q, i) =>
            i === currentQuestionIndex ? { ...q, answered: true, answer } : q
        ));

        // Show typing indicator
        setIsTyping(true);
        await new Promise((resolve) => setTimeout(resolve, 800));
        setIsTyping(false);

        // Move to next question or show completion
        if (currentQuestionIndex < questions.length - 1) {
            const nextIndex = currentQuestionIndex + 1;
            setCurrentQuestionIndex(nextIndex);
            setMessages((prev) => [
                ...prev,
                {
                    id: `ack-${currentQuestionIndex}`,
                    role: 'assistant',
                    content: "Got it, thank you. Here's my next question:",
                },
                {
                    id: `q${nextIndex + 1}-msg`,
                    role: 'assistant',
                    content: questions[nextIndex].question,
                    isQuestion: true,
                },
            ]);
        } else {
            setMessages((prev) => [
                ...prev,
                {
                    id: 'complete',
                    role: 'assistant',
                    content: "Perfect! I have all the information I need. I'll now run a comprehensive threat analysis using STRIDE, PASTA, and OWASP Agentic frameworks. This will take about 45 seconds.",
                },
            ]);
        }

        setCustomAnswer('');
    };

    const handleSkipAll = () => {
        router.push('/progress');
    };

    const handleStartAnalysis = () => {
        router.push('/progress');
    };

    const handleCustomSubmit = () => {
        if (customAnswer.trim()) {
            handleAnswer(customAnswer.trim());
        }
    };

    return (
        <main className="min-h-screen bg-deep-navy py-12 px-6">
            <div className="container mx-auto max-w-4xl">
                {/* Back Link */}
                <Link href="/analyze" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Intake
                </Link>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple/10 border border-purple/20 rounded-full mb-4">
                        <Bot className="w-4 h-4 text-purple" />
                        <span className="text-sm text-purple">Clarification Agent</span>
                    </div>
                    <h1 className="text-3xl font-semibold text-white mb-2">
                        Let&apos;s Clarify a Few Things
                    </h1>
                    <p className="text-zinc-400">
                        Help me understand your application better for a more accurate threat model
                    </p>
                </motion.div>

                {/* Progress */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-zinc-400">
                            Question {Math.min(currentQuestionIndex + 1, questions.length)} of {questions.length}
                        </span>
                        <button
                            onClick={handleSkipAll}
                            className="text-sm text-zinc-500 hover:text-cyan transition-colors flex items-center gap-1"
                        >
                            <SkipForward className="w-3 h-3" />
                            Skip all & proceed
                        </button>
                    </div>
                    <div className="h-2 bg-midnight rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-cyan to-purple"
                            initial={{ width: '0%' }}
                            animate={{ width: `${((answeredCount) / questions.length) * 100}%` }}
                        />
                    </div>
                </motion.div>

                {/* Chat Area */}
                <Card className="p-0 overflow-hidden mb-6">
                    <div className="h-[400px] overflow-y-auto p-6 space-y-4">
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user'
                                        ? 'bg-purple/20'
                                        : 'bg-gradient-to-br from-cyan/20 to-purple/20'
                                    }`}>
                                    {msg.role === 'user' ? (
                                        <User className="w-4 h-4 text-purple" />
                                    ) : (
                                        <Bot className="w-4 h-4 text-cyan" />
                                    )}
                                </div>
                                <div className={`max-w-[70%] px-4 py-3 rounded-2xl ${msg.role === 'user'
                                        ? 'bg-purple/20 text-white rounded-br-sm'
                                        : msg.isQuestion
                                            ? 'bg-cyan/10 border border-cyan/20 text-white rounded-bl-sm'
                                            : 'bg-zinc-800/50 text-zinc-200 rounded-bl-sm'
                                    }`}>
                                    {msg.isQuestion && (
                                        <div className="flex items-center gap-1 text-cyan text-xs mb-2">
                                            <HelpCircle className="w-3 h-3" />
                                            Question
                                        </div>
                                    )}
                                    <p className="text-sm leading-relaxed">{msg.content}</p>
                                </div>
                            </motion.div>
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex gap-3"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan/20 to-purple/20 flex items-center justify-center">
                                    <Bot className="w-4 h-4 text-cyan" />
                                </div>
                                <div className="bg-zinc-800/50 px-4 py-3 rounded-2xl rounded-bl-sm">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Answer Options */}
                    {!allAnswered && currentQuestion && (
                        <div className="border-t border-zinc-800 p-6 bg-midnight">
                            <div className="flex flex-wrap gap-2 mb-4">
                                {currentQuestion.options?.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => handleAnswer(option)}
                                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-sm text-white transition-colors"
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={customAnswer}
                                    onChange={(e) => setCustomAnswer(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleCustomSubmit()}
                                    placeholder="Or type a custom answer..."
                                    className="flex-1 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-cyan"
                                />
                                <button
                                    onClick={handleCustomSubmit}
                                    disabled={!customAnswer.trim()}
                                    className="p-2 bg-cyan rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan/80 transition-colors"
                                >
                                    <Send className="w-5 h-5 text-white" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Completion State */}
                    {allAnswered && (
                        <div className="border-t border-zinc-800 p-6 bg-midnight text-center">
                            <div className="inline-flex items-center gap-2 text-emerald mb-4">
                                <CheckCircle className="w-5 h-5" />
                                <span>All questions answered!</span>
                            </div>
                            <Button
                                variant="primary"
                                size="lg"
                                icon={<ChevronRight className="w-5 h-5" />}
                                onClick={handleStartAnalysis}
                            >
                                Start Threat Analysis
                            </Button>
                        </div>
                    )}
                </Card>

                {/* Info Text */}
                <p className="text-center text-zinc-600 text-sm">
                    Your answers help our AI provide more accurate threat modeling tailored to your specific architecture
                </p>
            </div>
        </main>
    );
}
