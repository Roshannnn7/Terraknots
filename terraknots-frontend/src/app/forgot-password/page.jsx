'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle, Loader } from 'lucide-react';
import api from '@/lib/api';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!email) { setError('Please enter your email address.'); return; }
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            setSent(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4"
            style={{ background: 'linear-gradient(135deg, #F5F0EB 0%, #F2D7C9 50%, #EDE5D8 100%)' }}
        >
            {/* Ambient blobs */}
            <motion.div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-30 pointer-events-none"
                style={{ background: 'radial-gradient(circle, #C4A882 0%, transparent 70%)' }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-25 pointer-events-none"
                style={{ background: 'radial-gradient(circle, #A8B5A2 0%, transparent 70%)' }}
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative z-10 w-full max-w-md"
            >
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl border border-white/50">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-block mb-6">
                            <Image src="/images/logo.png" alt="TerraKnots" width={80} height={80} className="mx-auto object-contain" />
                        </Link>
                        {!sent ? (
                            <>
                                <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                                    style={{ background: 'linear-gradient(135deg, #F2D7C9, #C4A882)' }}>
                                    <Mail size={28} className="text-white" />
                                </div>
                                <h1 className="text-2xl font-heading font-bold text-dark mb-2">Forgot your password?</h1>
                                <p className="text-light text-sm">No worries! Enter your email and we'll send you a reset link.</p>
                            </>
                        ) : (
                            <>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                                    style={{ background: 'linear-gradient(135deg, #6B9B7D, #A8B5A2)' }}
                                >
                                    <CheckCircle size={32} className="text-white" />
                                </motion.div>
                                <h1 className="text-2xl font-heading font-bold text-dark mb-2">Check your inbox!</h1>
                                <p className="text-light text-sm">
                                    We've sent a password reset link to <strong className="text-secondary">{email}</strong>.
                                </p>
                            </>
                        )}
                    </div>

                    {!sent ? (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-dark block">Email Address</label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-light" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="input-field pl-11"
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-sm text-error bg-error/5 border border-error/20 rounded-xl px-4 py-3"
                                >
                                    {error}
                                </motion.p>
                            )}

                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={{ scale: loading ? 1 : 1.02 }}
                                whileTap={{ scale: loading ? 1 : 0.98 }}
                                className="w-full py-4 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2 disabled:opacity-60"
                                style={{
                                    background: 'linear-gradient(135deg, #C4A882, #D4A574)',
                                    boxShadow: '0 8px 25px rgba(196,168,130,0.4)',
                                }}
                            >
                                {loading ? (
                                    <>
                                        <Loader size={18} className="animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Mail size={18} />
                                        Send Reset Link
                                    </>
                                )}
                            </motion.button>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-xs text-light text-center">
                                Didn't receive the email? Check your spam folder, or{' '}
                                <button onClick={() => setSent(false)} className="text-primary font-semibold hover:underline">
                                    try again
                                </button>
                            </p>
                        </div>
                    )}

                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <Link href="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:text-primary transition-colors">
                            <ArrowLeft size={16} />
                            Back to Login
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
