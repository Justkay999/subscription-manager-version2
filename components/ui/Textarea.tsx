'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export function Textarea({ label, error, className, ...props }: TextareaProps) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-foreground mb-1.5">
                    {label}
                </label>
            )}
            <textarea
                className={cn(
                    'w-full px-4 py-2.5 bg-card border-2 border-input rounded-lg',
                    'text-foreground placeholder:text-muted-foreground',
                    'focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none',
                    'transition-all duration-200',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'resize-vertical min-h-[100px]',
                    error && 'border-error focus:border-error focus:ring-error/20',
                    className
                )}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-error animate-slide-in-down">{error}</p>
            )}
        </div>
    );
}
