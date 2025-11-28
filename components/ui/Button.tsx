'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    children: React.ReactNode;
}

export function Button({
    variant = 'primary',
    size = 'md',
    loading = false,
    className,
    children,
    disabled,
    ...props
}: ButtonProps) {
    const sizeStyles = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-2.5 text-base',
        lg: 'px-8 py-3 text-lg',
    };

    // Glassmorphism variant styles with different glow colors
    const glowColors = {
        primary: {
            glow: 'from-blue-400 via-blue-500 to-cyan-500',
            hoverShadow: 'hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]',
        },
        secondary: {
            glow: 'from-purple-400 via-purple-500 to-pink-500',
            hoverShadow: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]',
        },
        danger: {
            glow: 'from-red-400 via-red-500 to-orange-500',
            hoverShadow: 'hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]',
        },
        ghost: {
            glow: 'from-gray-400 via-gray-500 to-gray-600',
            hoverShadow: 'hover:shadow-[0_0_20px_rgba(156,163,175,0.3)]',
        },
        outline: {
            glow: 'from-slate-400 via-slate-500 to-slate-600',
            hoverShadow: 'hover:shadow-[0_0_20px_rgba(148,163,184,0.3)]',
        },
    };

    const currentGlow = glowColors[variant];

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                'relative group overflow-hidden rounded-[24px] font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed',
                'bg-gradient-to-r from-slate-800/90 to-slate-700/90 backdrop-blur-xl border border-white/20',
                currentGlow.hoverShadow,
                sizeStyles[size],
                className
            )}
            disabled={disabled || loading}
            {...props}
        >
            {/* Glow effect on the left edge */}
            <div className={cn(
                'absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b blur-sm',
                currentGlow.glow
            )}></div>
            <div className={cn(
                'absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b',
                currentGlow.glow
            )}></div>

            {/* Glass reflection effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>

            {/* Content */}
            <div className="relative flex items-center justify-center gap-2 text-white">
                {loading ? (
                    <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Loading...</span>
                    </>
                ) : (
                    children
                )}
            </div>
        </motion.button>
    );
}
