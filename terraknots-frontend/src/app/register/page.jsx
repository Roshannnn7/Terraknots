'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Mail, Lock, User, UserPlus, ArrowRight } from 'lucide-react';

const RegisterPage = () => {
    const router = useRouter();
    const { register, isAuthenticated } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return toast.error('Passwords do not match');
        }

        setLoading(true);
        try {
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            toast.success('Welcome to the TerraKnots family! 💛');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
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
                                <h1 className="text-3xl font-heading font-bold text-dark">Join Us</h1>
                                <p className="text-light italic font-accent text-lg">Start your handmade journey आज</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-light pl-4">Full Name</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="input-field pl-12"
                                            placeholder="Artisan Name"
                                        />
                                        <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-light" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-light pl-4">Email Address</label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="input-field pl-12"
                                            placeholder="your@email.com"
                                        />
                                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-light" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-light pl-4">Password</label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            required
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="input-field pl-12"
                                            placeholder="••••••••"
                                        />
                                        <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-light" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-light pl-4">Confirm Password</label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            required
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            className="input-field pl-12"
                                            placeholder="••••••••"
                                        />
                                        <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-light" />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full btn-primary h-14 flex items-center justify-center space-x-3 text-lg mt-4"
                                >
                                    {loading ? (
                                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <UserPlus size={20} />
                                            <span>Create Account</span>
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="text-center pt-4 border-t border-gray-50 flex flex-col space-y-4">
                                <p className="text-sm text-light">
                                    Already have an account? {' '}
                                    <Link href="/login" className="font-bold text-primary hover:underline">Sign in instead</Link>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </>
    );
};

export default RegisterPage;
