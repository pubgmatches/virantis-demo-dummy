'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield,
    Bell,
    ChevronRight,
    LogOut,
    User,
    AlertTriangle,
    Info,
    AlertCircle,
    X
} from 'lucide-react';
import mockData from '@/data/mock_dashboard.json';

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    appId: string;
}

export function DashboardNav() {
    const pathname = usePathname();
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>(mockData.notifications);
    const [user, setUser] = useState({ name: 'Alex Chen', email: 'alex.chen@virantis.io' });

    useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const unreadCount = notifications.filter((n) => !n.read).length;

    const getBreadcrumbs = () => {
        const parts = pathname.split('/').filter(Boolean);
        const crumbs = [{ label: 'Dashboard', href: '/dashboard' }];

        if (parts.length > 1) {
            const appId = parts[1];
            const app = mockData.applications.find((a) => a.id === appId);
            if (app) {
                crumbs.push({ label: app.name, href: `/dashboard/${appId}` });
            }

            if (parts.length > 2) {
                const assessmentId = parts[2];
                if (assessmentId === 'compare') {
                    crumbs.push({ label: 'Compare', href: pathname });
                } else {
                    crumbs.push({ label: 'Assessment Details', href: pathname });
                }
            }
        }

        return crumbs;
    };

    const breadcrumbs = getBreadcrumbs();

    const markAsRead = (id: string) => {
        setNotifications(notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map((n) => ({ ...n, read: true })));
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'critical':
                return <AlertTriangle className="w-4 h-4 text-red-500" />;
            case 'warning':
                return <AlertCircle className="w-4 h-4 text-yellow-500" />;
            default:
                return <Info className="w-4 h-4 text-cyan" />;
        }
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        return date.toLocaleDateString();
    };

    const handleLogout = () => {
        sessionStorage.removeItem('isAuthenticated');
        sessionStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <nav className="sticky top-0 z-50 bg-deep-navy/80 backdrop-blur-xl border-b border-zinc-800">
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Left: Logo + Breadcrumbs */}
                    <div className="flex items-center gap-6">
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <Shield className="w-7 h-7 text-cyan" />
                            <span className="text-lg font-semibold">Virantis</span>
                        </Link>

                        {/* Breadcrumbs */}
                        <div className="hidden md:flex items-center gap-2 text-sm">
                            {breadcrumbs.map((crumb, index) => (
                                <div key={crumb.href} className="flex items-center gap-2">
                                    {index > 0 && <ChevronRight className="w-4 h-4 text-zinc-600" />}
                                    {index === breadcrumbs.length - 1 ? (
                                        <span className="text-white">{crumb.label}</span>
                                    ) : (
                                        <Link href={crumb.href} className="text-zinc-400 hover:text-white transition-colors">
                                            {crumb.label}
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Notifications + User */}
                    <div className="flex items-center gap-4">
                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="relative p-2 rounded-lg hover:bg-white/5 transition-colors"
                            >
                                <Bell className="w-5 h-5 text-zinc-400" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                                )}
                            </button>

                            {/* Notifications Dropdown */}
                            <AnimatePresence>
                                {showNotifications && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 top-12 w-80 bg-dark-blue-gray border border-zinc-800 rounded-xl shadow-2xl overflow-hidden"
                                    >
                                        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                                            <h3 className="font-medium text-white">Notifications</h3>
                                            {unreadCount > 0 && (
                                                <button
                                                    onClick={markAllAsRead}
                                                    className="text-xs text-cyan hover:underline"
                                                >
                                                    Mark all read
                                                </button>
                                            )}
                                        </div>
                                        <div className="max-h-80 overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <p className="p-4 text-zinc-500 text-sm text-center">No notifications</p>
                                            ) : (
                                                notifications.map((notif) => (
                                                    <div
                                                        key={notif.id}
                                                        onClick={() => markAsRead(notif.id)}
                                                        className={`p-4 border-b border-zinc-800/50 hover:bg-white/5 cursor-pointer transition-colors ${!notif.read ? 'bg-purple/5' : ''
                                                            }`}
                                                    >
                                                        <div className="flex gap-3">
                                                            {getNotificationIcon(notif.type)}
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm text-white font-medium truncate">{notif.title}</p>
                                                                <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{notif.message}</p>
                                                                <p className="text-xs text-zinc-600 mt-2">{formatTime(notif.timestamp)}</p>
                                                            </div>
                                                            {!notif.read && (
                                                                <div className="w-2 h-2 bg-cyan rounded-full mt-1.5" />
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* User Menu */}
                        <div className="flex items-center gap-3 pl-4 border-l border-zinc-800">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan to-purple flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                            </div>
                            <div className="hidden md:block">
                                <p className="text-sm text-white">{user.name}</p>
                                <p className="text-xs text-zinc-500">{user.email}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                                title="Logout"
                            >
                                <LogOut className="w-4 h-4 text-zinc-500" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Click outside to close notifications */}
            {showNotifications && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowNotifications(false)}
                />
            )}
        </nav>
    );
}
