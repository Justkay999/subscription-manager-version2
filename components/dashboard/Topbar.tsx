'use client';

import React, { useState } from 'react';
import { Menu, Bell, User } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

interface TopbarProps {
    onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
    const { user } = useAuth();

    return (
        <header className="h-16 bg-card border-b border-border px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30">
            {/* Left Section */}
            <div className="flex items-center gap-4">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onMenuClick}
                    className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </motion.button>

                <div>
                    <h2 className="text-lg font-semibold text-foreground">Dashboard</h2>
                    <p className="text-sm text-muted-foreground hidden sm:block">
                        Manage your subscriptions
                    </p>
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
                {/* Theme Toggle */}
                <ThemeToggle />

                {/* Notifications */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="relative p-2 rounded-lg hover:bg-muted transition-colors"
                >
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" />
                </motion.button>

                {/* User Profile */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted">
                    <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-sm font-medium text-foreground">
                            {user?.email?.split('@')[0] || 'User'}
                        </p>
                        <p className="text-xs text-muted-foreground">Admin</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
