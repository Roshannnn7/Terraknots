'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, CheckCircle, Loader, ArrowLeft } from 'lucide-react';
import api from '@/lib/api';

export default function ResetPasswordPage() {
    const { token } = useParams();
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [showCpw, setShowCpw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
        if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
        setLoading(true);
        try {
            await api.post(`/auth/reset-password/${token}`, { password });
            setSuccess(true);
            setTimeout(() => router.push('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired reset link.');
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrength = (pw) => {
        if (!pw) return null;
        if (pw.length < 6) return { label: 'Weak', color: '#C75C5C', width: '30%' };
        if (pw.length < 10 && !/[A-Z]/.test(pw)) return { label: 'Fair', color: '#D4A574', width: '55%' };
        return { label: 'Strong', color: '#6B9B7D', width: '100%' };
    };
    const strength = getPasswordStrength(password);

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4"
            style={{ background: 'linear-gradient(135deg, #F5F0EB 0%, #F2D7C9 50%, #EDE5D8 100%)' }}
        >
            <motion.div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-30 pointer-events-none"
                style={{ background: 'radial-gradient(circle, #C4A882 0%, transparent 70%)' }}
                animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="relative z-10 w-full max-w-md"
            >
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl border border-white/50">
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-block mb-6">
                            <Image src="/images/logo.png" alt="TerraKnots" width={80} height={80} className="mx-auto object-contain" />
                        </Link>
                        {!success ? (
                            <>
                                <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                                    style={{ background: 'linear-gradient(135deg, #F2D7C9, #C4A882)' }}>
                                    <Lock size={28} className="text-white" />
                                </div>
                                <h1 className="text-2xl font-heading font-bold text-dark mb-2">Reset your password</h1>
                                <p className="text-light text-sm">Create a new, strong password for your TerraKnots account.</p>
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
                                <h1 className="text-2xl font-heading font-bold text-dark mb-2">Password Reset!</h1>
                                <p className="text-light text-sm">Your password has been updated. Redirecting to login...</p>
                            </>
                        )}
                    </div>

                    {!success && (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* New Password */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-dark block">New Password</label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-light" />
                                    <input
                                        type={showPw ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Min. 8 characters"
                                        className="input-field pl-11 pr-12"
                                        required
                                    />
                                    <button type="button" onClick={() => setShowPw(!showPw)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-light hover:text-dark">
                                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {/* Strength indicator */}
                                {password && (
                                    <div className="space-y-1">
                                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full rounded-full"
                                                style={{ backgroundColor: strength?.color }}
                                                initial={{ width: 0 }}
                                                animate={{ width: strength?.width }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        </div>
                                        <p className="text-xs font-semibold" style={{ color: strength?.color }}>
                                            {strength?.label}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-dark block">Confirm Password</label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-light" />
                                    <input
                                        type={showCpw ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Repeat your password"
                                        className="input-field pl-11 pr-12"
                                        required
                                    />
                                    <button type="button" onClick={() => setShowCpw(!showCpw)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-light hover:text-dark">
                                        {showCpw ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {confirmPassword && confirmPassword !== password && (
                                    <p className="text-xs text-error">Passwords don't match</p>
                                )}
                                {confirmPassword && confirmPassword === password && password.length >= 8 && (
                                    <p className="text-xs text-success flex items-center gap-1">
                                        <CheckCircle size={12} /> Passwords match
                                    </p>
                                )}
                            </div>

                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-sm text-error bg-error/5 border border-error/20 rounded-xl px-4 py-3"
                                >{error}</motion.p>
                            )}

                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={{ scale: loading ? 1 : 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-4 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2 disabled:opacity-60"
                                style={{ background: 'linear-gradient(135deg, #C4A882, #D4A574)', boxShadow: '0 8px 25px rgba(196,168,130,0.4)' }}
                            >
                                {loading ? (
                                    <><Loader size={18} className="animate-spin" /> Resetting...</>
                                ) : (
                                    <><Lock size={18} /> Reset Password</>
                                )}
                            </motion.button>
                        </form>
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
