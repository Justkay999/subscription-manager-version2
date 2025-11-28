'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Users,
    Package,
    LogOut,
    Menu,
    X,
    User
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function Navbar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        {
            href: '/dashboard',
            label: 'Dashboard',
            icon: LayoutDashboard,
            activeClass: 'bg-blue-500',
            shadowClass: 'shadow-[0_0_20px_rgba(59,130,246,0.5)]'
        },
        {
            href: '/customers',
            label: 'Customers',
            icon: Users,
            activeClass: 'bg-purple-500',
            shadowClass: 'shadow-[0_0_20px_rgba(168,85,247,0.5)]'
        },
        {
            href: '/packages',
            label: 'Packages',
            icon: Package,
            activeClass: 'bg-pink-500',
            shadowClass: 'shadow-[0_0_20px_rgba(236,72,153,0.5)]'
        },
    ];

    const isActive = (path: string) => pathname === path;

    return (
        <nav className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/dashboard" className="flex-shrink-0 flex items-center gap-3 group">
                        <div className="relative w-10 h-10 flex items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-600 rounded-xl rotate-6 opacity-50 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 blur-sm"></div>
                            <div className="relative w-full h-full bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:-translate-y-1 transition-transform duration-300">
                                <span className="text-white font-black text-xl">S</span>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                                Subscription
                            </span>
                            <span className="text-xs font-medium text-muted-foreground tracking-wider uppercase -mt-1">
                                Manager
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        {navItems.map((item, index) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);

                            const gradients = [
                                'linear-gradient(-45deg, #e81cff 0%, #40c9ff 100%)',
                                'linear-gradient(-45deg, #fc00ff 0%, #00dbde 100%)',
                                'linear-gradient(-45deg, #ff0080 0%, #ff8c00 100%)',
                            ];
                            const gradient = gradients[index % gradients.length];

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="relative group"
                                >
                                    <div className={`relative z-10 flex items-center gap-2.5 px-6 py-2.5 rounded-full text-base font-medium transition-colors duration-200 border-2 ${active
                                        ? `text-white border-transparent ${item.activeClass} ${item.shadowClass}`
                                        : 'text-muted-foreground border-border bg-background/80 backdrop-blur-sm hover:text-foreground hover:bg-muted/50'
                                        }`}>
                                        <Icon className="w-5 h-5" />
                                        {item.label}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Side Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <ThemeToggle />

                        <div className="flex items-center gap-3 pl-4 border-l border-border">
                            <div className="flex flex-col items-end">
                                <span className="text-sm font-medium text-foreground">
                                    {user?.email?.split('@')[0]}
                                </span>
                                <span className="text-xs text-muted-foreground">Admin</span>
                            </div>
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                <User className="w-4 h-4" />
                            </div>
                            <button
                                onClick={logout}
                                className="p-2 text-muted-foreground hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-2">
                        <ThemeToggle />
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-muted-foreground hover:bg-muted rounded-lg"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-border bg-card"
                    >
                        <div className="px-4 pt-2 pb-4 space-y-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium ${isActive(item.href)
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {item.label}
                                    </Link>
                                );
                            })}
                            <div className="pt-4 mt-4 border-t border-border">
                                <div className="flex items-center gap-3 px-3 mb-3">
                                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">
                                            {user?.email}
                                        </p>
                                        <p className="text-xs text-muted-foreground">Admin</p>
                                    </div>
                                </div>
                                <button
                                    onClick={logout}
                                    className="w-full flex items-center gap-3 px-3 py-3 text-error hover:bg-error/10 rounded-lg transition-colors"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
