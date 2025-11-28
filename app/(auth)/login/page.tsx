'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (email !== 'darkside404404@gmail.com') {
            return setError('Access restricted to authorized administrators only.');
        }

        setLoading(true);

        try {
            await login(email, password);
            router.push('/');
        } catch (error: any) {
            setError(error.message || 'Failed to log in');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-8 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="relative w-full max-w-md"
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
            >
                {/* Main Card Container with Brutalist Style */}
                <motion.div
                    animate={{
                        height: isHovered ? 'auto' : '120px',
                        rotateX: isHovered ? 5 : 0,
                        rotateY: isHovered ? -5 : 0,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 20
                    }}
                    className="relative bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 border-[6px] border-black overflow-hidden"
                    style={{
                        boxShadow: isHovered
                            ? '16px 16px 0 #000, 32px 32px 0 rgba(147, 51, 234, 0.4), 0 0 80px rgba(147, 51, 234, 0.6)'
                            : '12px 12px 0 #000, 24px 24px 0 rgba(147, 51, 234, 0.3)',
                        transformStyle: 'preserve-3d',
                        perspective: '1000px',
                    }}
                >
                    {/* Shine effect */}
                    <motion.div
                        className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{
                            x: isHovered ? '100%' : '-100%'
                        }}
                        transition={{ duration: 0.7, ease: "easeInOut" }}
                    />

                    {/* Geometric accent */}
                    <motion.div
                        className="absolute top-0 right-0 w-12 h-12 bg-black"
                        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }}
                        animate={{
                            backgroundColor: isHovered ? '#f6a874' : '#000',
                            scale: isHovered ? 1.2 : 1
                        }}
                        transition={{ duration: 0.3 }}
                    />

                    {/* Title (visible when not hovered) */}
                    <motion.div
                        className="absolute top-0 left-0 w-full h-[120px] flex items-center justify-center"
                        animate={{
                            opacity: isHovered ? 0 : 1,
                            y: isHovered ? -30 : 0,
                            scale: isHovered ? 0.8 : 1
                        }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className="text-center">
                            <h1 className="text-black font-black text-3xl uppercase tracking-wider drop-shadow-[3px_3px_0_rgba(255,255,255,0.3)]">
                                Login
                            </h1>
                            <p className="text-black/70 font-bold text-sm mt-1 uppercase tracking-wide">
                                Enter The Zone
                            </p>
                        </div>
                    </motion.div>

                    {/* Form (visible when hovered) */}
                    <motion.form
                        onSubmit={handleSubmit}
                        className="relative w-full p-8 space-y-5"
                        animate={{
                            opacity: isHovered ? 1 : 0,
                            y: isHovered ? 0 : 30,
                            scale: isHovered ? 1 : 0.8
                        }}
                        transition={{
                            duration: 0.5,
                            type: "spring",
                            stiffness: 200
                        }}
                    >
                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 bg-red-500/90 border-4 border-black text-white font-bold text-sm"
                                style={{ boxShadow: '4px 4px 0 #000' }}
                            >
                                {error}
                            </motion.div>
                        )}

                        {/* Email Input */}
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                                <Mail className="w-5 h-5 text-black" />
                            </div>
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full pl-11 pr-4 py-3 bg-white/90 border-4 border-black font-bold text-black placeholder-black/60 transition-all duration-300 focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px]"
                                style={{
                                    boxShadow: '6px 6px 0 #000',
                                }}
                                onFocus={(e) => {
                                    e.target.style.boxShadow = '3px 3px 0 #000';
                                }}
                                onBlur={(e) => {
                                    e.target.style.boxShadow = '6px 6px 0 #000';
                                }}
                            />
                        </div>

                        {/* Password Input */}
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                                <Lock className="w-5 h-5 text-black" />
                            </div>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full pl-11 pr-4 py-3 bg-white/90 border-4 border-black font-bold text-black placeholder-black/60 transition-all duration-300 focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px]"
                                style={{
                                    boxShadow: '6px 6px 0 #000',
                                }}
                                onFocus={(e) => {
                                    e.target.style.boxShadow = '3px 3px 0 #000';
                                }}
                                onBlur={(e) => {
                                    e.target.style.boxShadow = '6px 6px 0 #000';
                                }}
                            />
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-black text-white font-black text-base uppercase tracking-wider border-none cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{
                                boxShadow: '6px 6px 0 rgba(255, 255, 255, 0.3)',
                            }}
                            whileHover={{
                                x: 2,
                                y: 2,
                                backgroundColor: '#333',
                                boxShadow: '3px 3px 0 rgba(255, 255, 255, 0.3)',
                            }}
                            whileTap={{
                                scale: 0.98
                            }}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    Enter Zone
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </motion.button>

                        {/* Footer Links */}
                        <div className="flex items-center justify-center text-sm pt-2">
                            <Link
                                href="/forgot-password"
                                className="text-black font-bold hover:text-white transition-colors underline"
                            >
                                Forgot?
                            </Link>
                        </div>
                    </motion.form>
                </motion.div>

                {/* Pulsating background effect */}
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-purple-500/10 rounded-full -z-10 blur-2xl"
                    animate={{
                        width: isHovered ? '600px' : '0px',
                        height: isHovered ? '600px' : '0px',
                    }}
                    transition={{ duration: 0.6 }}
                />
            </motion.div>
        </div>
    );
}
