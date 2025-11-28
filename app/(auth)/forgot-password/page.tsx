'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { KeyRound, Mail, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const { resetPassword } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await resetPassword(email);
            setSuccess(true);
        } catch (error: any) {
            setError(error.message || 'Failed to send reset email');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent/10 via-background to-primary/10 px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <div className="bg-card rounded-2xl shadow-2xl border border-border p-8 text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring' }}
                            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-success rounded-full mb-4"
                        >
                            <CheckCircle className="w-8 h-8 text-white" />
                        </motion.div>
                        <h1 className="text-2xl font-bold text-foreground mb-2">Check Your Email</h1>
                        <p className="text-muted-foreground mb-6">
                            We've sent a password reset link to <strong>{email}</strong>
                        </p>
                        <Link href="/login">
                            <Button className="w-full">Back to Login</Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent/10 via-background to-primary/10 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="bg-card rounded-2xl shadow-2xl border border-border p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring' }}
                            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4"
                        >
                            <KeyRound className="w-8 h-8 text-white" />
                        </motion.div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">Forgot Password?</h1>
                        <p className="text-muted-foreground">
                            Enter your email and we'll send you a reset link
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg text-error text-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="pl-11"
                            />
                        </div>

                        <Button type="submit" loading={loading} className="w-full" size="lg">
                            Send Reset Link
                        </Button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <Link href="/login" className="text-sm text-primary hover:underline">
                            Back to Login
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
