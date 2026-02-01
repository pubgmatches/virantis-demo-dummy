'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
    onClick?: () => void;
}

export function Card({ children, className = '', hover = true, onClick }: CardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={hover ? { y: -4, boxShadow: '0 0 60px rgba(0, 212, 255, 0.1)' } : undefined}
            onClick={onClick}
            className={`
        bg-dark-blue-gray
        border border-white/8
        rounded-2xl
        p-6
        shadow-[0_0_40px_rgba(0,212,255,0.05)]
        transition-all duration-300
        ${hover ? 'hover:border-cyan/20 cursor-pointer' : ''}
        ${className}
      `}
        >
            {children}
        </motion.div>
    );
}

interface StatCardProps {
    title: string;
    value: string | number;
    icon?: ReactNode;
    variant?: 'default' | 'critical' | 'high' | 'medium' | 'low';
}

export function StatCard({ title, value, icon, variant = 'default' }: StatCardProps) {
    const variantStyles = {
        default: 'text-white',
        critical: 'text-red-500',
        high: 'text-orange-500',
        medium: 'text-yellow-500',
        low: 'text-green-500',
    };

    return (
        <Card className="flex items-center gap-4">
            {icon && (
                <div className={`icon-container ${variant === 'default' ? 'icon-container-cyan' : `icon-container-${variant === 'critical' || variant === 'high' ? 'error' : variant === 'medium' ? 'warning' : 'success'}`}`}>
                    {icon}
                </div>
            )}
            <div>
                <p className="text-zinc-400 text-sm">{title}</p>
                <p className={`text-2xl font-semibold ${variantStyles[variant]}`}>{value}</p>
            </div>
        </Card>
    );
}
