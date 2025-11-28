'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface StatsCardProps {
    title: string;
    value: number;
    icon: LucideIcon;
    gradient: string;
    delay?: number;
}

export function StatsCard({ title, value, icon: Icon, gradient, delay = 0 }: StatsCardProps) {
    const count = useMotionValue(0);
    const rounded = useSpring(count, { damping: 50, stiffness: 100 });
    const hasCounted = useRef(false);

    useEffect(() => {
        if (!hasCounted.current && value > 0) {
            hasCounted.current = true;
            const timeout = setTimeout(() => {
                count.set(value);
            }, delay);
            return () => clearTimeout(timeout);
        }
    }, [value, count, delay]);

    useEffect(() => {
        const unsubscribe = rounded.on('change', (latest) => {
            const element = document.getElementById(`stat-${title}`);
            if (element) {
                element.textContent = Math.round(latest).toString();
            }
        });
        return () => unsubscribe();
    }, [rounded, title]);

    // Gradient styles for each card
    const gradients = [
        'linear-gradient(-45deg, #e81cff 0%, #40c9ff 100%)', // Pink-Blue
        'linear-gradient(-45deg, #fc00ff 0%, #00dbde 100%)', // Purple-Cyan
        'linear-gradient(-45deg, #ff0080 0%, #ff8c00 100%)', // Pink-Orange
        'linear-gradient(-45deg, #00ff87 0%, #60efff 100%)', // Green-Cyan
    ];

    // Map title to gradient index
    const gradientMap: { [key: string]: number } = {
        'Total Customers': 0,
        'Active': 1,
        'Expired': 2,
        'Expiring Soon': 3,
    };

    const gradientIndex = gradientMap[title] ?? 0;
    const neonGradient = gradients[gradientIndex];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            className="relative group cursor-pointer"
            style={{ perspective: '1000px' }}
        >
            {/* Neon gradient border - before */}
            <motion.div
                className="absolute inset-0 -left-[5px] m-auto rounded-2xl -z-10 pointer-events-none"
                style={{
                    width: 'calc(100% + 10px)',
                    height: 'calc(100% + 10px)',
                    background: neonGradient,
                }}
                whileHover={{
                    rotate: -90,
                    scaleX: 1.34,
                    scaleY: 0.77,
                }}
                transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 20,
                }}
            />

            {/* Blur glow - after */}
            <motion.div
                className="absolute inset-0 -z-20"
                style={{
                    background: neonGradient,
                    transform: 'translate3d(0, 0, 0) scale(0.95)',
                    filter: 'blur(20px)',
                }}
                whileHover={{
                    filter: 'blur(30px)',
                }}
                transition={{ duration: 0.6 }}
            />

            {/* Main card content */}
            <motion.div
                className="relative bg-background border-2 border-border rounded-2xl p-8 overflow-hidden"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
            >
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <p className="text-base font-medium text-muted-foreground mb-3">{title}</p>
                        <h3 className="text-5xl font-bold text-foreground" id={`stat-${title}`}>
                            {value}
                        </h3>
                    </div>
                    <div className={cn('p-4 rounded-xl', gradient)} style={{ background: neonGradient }}>
                        <Icon className="w-8 h-8 text-white" />
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
