'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare,
    X,
    Send,
    Sparkles,
    Bot,
    User,
    Zap,
    HelpCircle,
    TrendingUp,
    Shield
} from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface AIChatWidgetProps {
    context?: {
        type: 'dashboard' | 'app' | 'assessment';
        appName?: string;
        assessmentId?: string;
    };
}

const quickActions = [
    { label: 'Top risks', icon: TrendingUp, query: 'What are the top risks?' },
    { label: 'Explain DREAD', icon: HelpCircle, query: 'Explain the DREAD scoring system' },
    { label: 'Fix suggestions', icon: Shield, query: 'How can I fix the critical threats?' },
];

// Mock AI responses based on keywords
const getMockResponse = (query: string, context?: AIChatWidgetProps['context']): string => {
    const q = query.toLowerCase();

    if (q.includes('top risk') || q.includes('biggest risk') || q.includes('highest risk')) {
        return `Based on the latest assessment${context?.appName ? ` for **${context.appName}**` : ''}, the highest priority risks are:

1. **Memory Poisoning** (Critical) - Attackers could inject malicious data into the agent's memory store
2. **Indirect Prompt Injection** (Critical) - Malicious instructions embedded in fetched emails

I recommend prioritizing remediations for these two threats immediately, as they could lead to complete system compromise.`;
    }

    if (q.includes('dread') || q.includes('scoring')) {
        return `**DREAD** is a risk assessment model used to prioritize threats:

- **D**amage: How severe is the impact? (1-10)
- **R**eproducibility: How easy to reproduce? (1-10)  
- **E**xploitability: How easy to exploit? (1-10)
- **A**ffected Users: How many users impacted? (1-10)
- **D**iscoverability: How easy to discover? (1-10)

**Total Score** = Sum of all factors (max 50)

A score above 35 typically indicates a Critical severity threat that needs immediate attention.`;
    }

    if (q.includes('fix') || q.includes('remediat') || q.includes('mitigat')) {
        return `Here are my top remediation suggestions:

1. **Memory Poisoning**: Implement memory validation and sanitization. Use cryptographic signatures for stored context.

2. **SQL Injection**: Use parameterized queries and prepared statements. Never concatenate user input into SQL.

3. **Session Hijacking**: Implement secure session tokens with short expiry. Use HttpOnly cookies.

Would you like me to create Jira tickets for any of these?`;
    }

    if (q.includes('compare') || q.includes('change') || q.includes('diff')) {
        return `Comparing the latest two assessments:

📈 **Changes Detected:**
- +2 new critical threats (Memory Poisoning, Prompt Injection)
- -1 threat resolved (Weak Session Token)
- Overall risk increased from High → Critical

The new Agentic AI threats were introduced when you added the Email Fetcher component.`;
    }

    if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
        return `Hello! 👋 I'm your Virantis AI assistant. I can help you with:

- Understanding threat analysis results
- Explaining risk scores and methodologies
- Suggesting remediation strategies
- Comparing assessments over time

What would you like to know?`;
    }

    // Default response
    return `I understand you're asking about "${query}". 

${context?.appName ? `For **${context.appName}**, ` : ''}I can help you analyze threats, understand risk scores, and suggest mitigations. 

Try asking about:
- Top risks in your application
- How to fix specific threats
- DREAD scoring explanation
- Changes between assessments`;
};

export function AIChatWidget({ context }: AIChatWidgetProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: `Hi! I'm your Virantis AI assistant. ${context?.appName ? `I see you're viewing **${context.appName}**. ` : ''}How can I help with your threat analysis?`,
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (query?: string) => {
        const messageText = query || input.trim();
        if (!messageText) return;

        // Add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: messageText,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        // Simulate AI thinking
        await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

        // Add AI response
        const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: getMockResponse(messageText, context),
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
        setIsTyping(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Floating Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all ${isOpen
                    ? 'bg-zinc-800 hover:bg-zinc-700'
                    : 'bg-gradient-to-br from-cyan via-purple to-pink hover:scale-110'
                    }`}
                whileHover={{ scale: isOpen ? 1 : 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                {isOpen ? (
                    <X className="w-6 h-6 text-white" />
                ) : (
                    <>
                        <Sparkles className="w-6 h-6 text-white" />
                        {/* Pulse ring */}
                        <span className="absolute inset-0 rounded-full bg-cyan/30 animate-ping" />
                    </>
                )}
            </motion.button>

            {/* Chat Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-24 right-6 z-50 w-[400px] h-[550px] bg-dark-blue-gray border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 bg-midnight border-b border-zinc-800">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan to-purple flex items-center justify-center">
                                    <Bot className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-white text-sm">Virantis AI</h3>
                                    <p className="text-xs text-zinc-500">
                                        {context?.appName || 'Security Assistant'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="w-2 h-2 bg-emerald rounded-full animate-pulse" />
                                <span className="text-xs text-zinc-500">Online</span>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                                >
                                    <div
                                        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${message.role === 'user'
                                            ? 'bg-purple/20'
                                            : 'bg-gradient-to-br from-cyan/20 to-purple/20'
                                            }`}
                                    >
                                        {message.role === 'user' ? (
                                            <User className="w-3.5 h-3.5 text-purple" />
                                        ) : (
                                            <Bot className="w-3.5 h-3.5 text-cyan" />
                                        )}
                                    </div>
                                    <div
                                        className={`max-w-[280px] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${message.role === 'user'
                                            ? 'bg-purple/20 text-white rounded-br-md'
                                            : 'bg-zinc-800/50 text-zinc-200 rounded-bl-md'
                                            }`}
                                    >
                                        <div
                                            className="prose prose-sm prose-invert max-w-none"
                                            dangerouslySetInnerHTML={{
                                                __html: message.content
                                                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                                    .replace(/\n/g, '<br />')
                                            }}
                                        />
                                    </div>
                                </motion.div>
                            ))}

                            {/* Typing indicator */}
                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex gap-3"
                                >
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan/20 to-purple/20 flex items-center justify-center">
                                        <Bot className="w-3.5 h-3.5 text-cyan" />
                                    </div>
                                    <div className="bg-zinc-800/50 px-4 py-3 rounded-2xl rounded-bl-md">
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

                        {/* Quick Actions */}
                        <div className="px-4 py-2 border-t border-zinc-800/50">
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {quickActions.map((action) => (
                                    <button
                                        key={action.label}
                                        onClick={() => handleSend(action.query)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700 rounded-full text-xs text-zinc-300 whitespace-nowrap transition-colors"
                                    >
                                        <action.icon className="w-3 h-3" />
                                        {action.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Input */}
                        <div className="p-4 pt-0">
                            <div className="flex items-center gap-2 bg-midnight border border-zinc-800 rounded-xl px-4 py-2 focus-within:border-cyan transition-colors">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask about threats, risks..."
                                    className="flex-1 bg-transparent text-white text-sm placeholder:text-zinc-600 focus:outline-none"
                                />
                                <button
                                    onClick={() => handleSend()}
                                    disabled={!input.trim() || isTyping}
                                    className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan to-purple flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
                                >
                                    <Send className="w-4 h-4 text-white" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
