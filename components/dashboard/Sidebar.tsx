'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Users,
    Package,
    Menu,
    X,
    LogOut,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils/cn';

interface SidebarProps {
    isMobileOpen: boolean;
    setIsMobileOpen: (open: boolean) => void;
}

const menuItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Customers', href: '/customers', icon: Users },
    { name: 'Packages', href: '/packages', icon: Package },
];

export function Sidebar({ isMobileOpen, setIsMobileOpen }: SidebarProps) {
    const pathname = usePathname();
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Failed to log out:', error);
        }
    };

    const SidebarContent = () => (
        <div className="h-full flex flex-col bg-card border-r border-border">
            {/* Logo */}
            <div className="p-6 border-b border-border">
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    SubManager
                </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link key={item.name} href={item.href}>
                            <motion.div
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setIsMobileOpen(false)}
                                className={cn(
                                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer',
                                    isActive
                                        ? 'bg-primary text-primary-foreground shadow-md'
                                        : 'text-foreground hover:bg-muted'
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{item.name}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeIndicator"
                                        className="ml-auto w-2 h-2 rounded-full bg-primary-foreground"
                                    />
                                )}
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-border">
                <motion.button
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-error hover:bg-error/10 transition-all duration-200 w-full"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </motion.button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                className="hidden lg:block w-70 h-screen fixed left-0 top-0 z-40"
            >
                <SidebarContent />
            </motion.aside>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                        />

                        {/* Sidebar */}
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: 'spring', damping: 30 }}
                            className="fixed left-0 top-0 w-70 h-screen z-50 lg:hidden"
                        >
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
