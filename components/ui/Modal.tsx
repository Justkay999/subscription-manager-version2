'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    const sizeStyles = {
        sm: 'max-w-lg',
        md: 'max-w-3xl',
        lg: 'max-w-5xl',
        xl: 'max-w-7xl',
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{
                                opacity: 0,
                                scale: 0.5,
                                y: -100,
                                rotateX: -15,
                                filter: 'blur(10px)'
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                y: 0,
                                rotateX: 0,
                                filter: 'blur(0px)'
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.8,
                                y: 50,
                                filter: 'blur(5px)'
                            }}
                            transition={{
                                type: 'spring',
                                damping: 25,
                                stiffness: 300,
                                duration: 0.5
                            }}
                            className={cn(
                                'relative bg-card rounded-2xl shadow-2xl w-full pointer-events-auto',
                                'border-2 border-border/50',
                                'backdrop-blur-xl',
                                sizeStyles[size]
                            )}
                            style={{
                                transformStyle: 'preserve-3d',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                            }}
                        >
                            {/* Header */}
                            {title && (
                                <motion.div
                                    className="flex items-center justify-between p-6 border-b border-border"
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1, duration: 0.3 }}
                                >
                                    <h2 className="text-2xl font-bold text-foreground">{title}</h2>
                                    <motion.button
                                        onClick={onClose}
                                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <X className="w-5 h-5" />
                                    </motion.button>
                                </motion.div>
                            )}

                            {/* Content */}
                            <motion.div
                                className="p-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.3 }}
                            >
                                {children}
                            </motion.div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
