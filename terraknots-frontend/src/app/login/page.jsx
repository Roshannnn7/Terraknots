'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';

const LoginPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login, isAuthenticated } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const redirect = searchParams.get('redirect') || '/';

    useEffect(() => {
        if (isAuthenticated) {
            router.push(redirect);
        }
    }, [isAuthenticated, router, redirect]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            toast.success('Welcome back to TerraKnots! 💛');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <AnnouncementBar />
            <Navbar />

            <main className="min-h-screen pt-32 pb-24 bg-background flex items-center justify-center">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-md mx-auto bg-white rounded-[3rem] shadow-xl overflow-hidden"
                    >
                        <div className="p-10 md:p-12 space-y-8">
                            <div className="text-center space-y-2">
                                <h1 className="text-3xl font-heading font-bold text-dark">Welcome Back</h1>
                                <p className="text-light italic font-accent text-lg">Log in to your artisan world</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-light pl-4">Email Address</label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="input-field pl-12"
                                            placeholder="your@email.com"
                                        />
                                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-light" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center pl-4">
                                        <label className="text-xs font-bold uppercase tracking-widest text-light">Password</label>
                                        <Link href="/forgot-password" size={18} className="text-[10px] uppercase font-bold text-primary hover:underline">Forgot?</Link>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="input-field pl-12"
                                            placeholder="••••••••"
                                        />
                                        <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-light" />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full btn-primary h-14 flex items-center justify-center space-x-3 text-lg"
                                >
                                    {loading ? (
                                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <LogIn size={20} />
                                            <span>Sign In</span>
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="text-center pt-4 border-t border-gray-50 flex flex-col space-y-4">
                                <p className="text-sm text-light">
                                    New to TerraKnots? {' '}
                                    <Link href="/register" className="font-bold text-primary hover:underline">Create an account</Link>
                                </p>
                            </div>
                        </div>

                        <div className="bg-background/50 p-6 text-center border-t border-gray-50">
                            <Link href="/shop" className="text-xs font-bold uppercase tracking-[0.2em] text-light hover:text-primary flex items-center justify-center group transition-colors">
                                Browse as Guest <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </>
    );
};

export default LoginPage;
