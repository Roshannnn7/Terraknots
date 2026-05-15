'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { toast } from 'react-toastify';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';

const AdminLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/auth/login', { email, password });
            if (data.user.role !== 'admin') {
                toast.error('Access Denied: Admin Privileges Required');
                return;
            }
            // Store token in BOTH cookie (for api.js interceptor) and localStorage (for admin layout check)
            Cookies.set('token', data.token, { expires: 30 });
            localStorage.setItem('token', data.token);
            toast.success('Welcome back, Artisan Admin!');
            router.push('/admin/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-accent/10 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg bg-white rounded-[3rem] shadow-2xl shadow-primary/5 p-10 md:p-14 border border-primary/10 relative z-10"
            >
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-6 animate-pulse">
                        <ShieldCheck size={40} />
                    </div>
                    <h1 className="text-3xl font-heading font-bold text-dark mb-2">Artisan Control</h1>
                    <p className="text-light italic font-accent text-lg">Secure access for TerraKnots administrators</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-light pl-4">Administrative Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-light group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field pl-12 h-14"
                                placeholder="admin@terraknots.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-light pl-4">Security Key</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-light group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field pl-12 h-14"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary h-14 flex items-center justify-center space-x-3 text-lg group overflow-hidden"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>Unseal Access</span>
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-12 text-center text-xs text-light font-medium uppercase tracking-widest pt-8 border-t border-gray-50">
                    Handcrafted in India • IP Protected
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLoginPage;
