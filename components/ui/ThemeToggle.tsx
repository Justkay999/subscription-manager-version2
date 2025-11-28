'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="relative w-14 h-7 bg-muted rounded-full p-1 transition-colors duration-300"
            aria-label="Toggle theme"
        >
            <motion.div
                className="absolute w-5 h-5 bg-card rounded-full flex items-center justify-center shadow-md"
                animate={{
                    x: theme === 'dark' ? 24 : 0,
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
                {theme === 'dark' ? (
                    <Moon className="w-3 h-3 text-primary" />
                ) : (
                    <Sun className="w-3 h-3 text-warning" />
                )}
            </motion.div>
        </motion.button>
    );
}
