'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'active' | 'expired' | 'expiring-soon' | 'default';
    className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
    const variantStyles = {
        active: 'bg-success/10 text-success border-success/20',
        expired: 'bg-error/10 text-error border-error/20',
        'expiring-soon': 'bg-warning/10 text-warning border-warning/20',
        default: 'bg-muted text-muted-foreground border-border',
    };

    const shouldPulse = variant === 'active';

    return (
        <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn(
                'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border',
                variantStyles[variant],
                shouldPulse && 'animate-pulse',
                className
            )}
        >
            {shouldPulse && (
                <span className="w-2 h-2 rounded-full bg-success mr-1.5 animate-pulse" />
            )}
            {children}
        </motion.span>
    );
}
