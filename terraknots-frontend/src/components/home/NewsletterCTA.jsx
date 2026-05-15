'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';

export default function NewsletterCTA() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle | loading | success | error
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !email.includes('@')) {
            setMessage('Please enter a valid email address.');
            setStatus('error');
            return;
        }
        setStatus('loading');
        try {
            await api.post('/newsletter/subscribe', { email });
            setStatus('success');
            setEmail('');
        } catch (err) {
            setStatus('error');
            setMessage(err.response?.data?.message || 'Something went wrong. Please try again.');
        }
    };

    return (
        <section className="section relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0"
                style={{ background: 'linear-gradient(135deg, #A8B5A2 0%, #8A9A7B 50%, #6B7A60 100%)' }}
            />
            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />

            {/* Floating decoratives */}
            <motion.div
                className="absolute top-10 left-20 text-4xl opacity-20"
                animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
                ✉️
            </motion.div>
            <motion.div
                className="absolute bottom-10 right-20 text-3xl opacity-20"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            >
                ✨
            </motion.div>

            <div className="container-narrow relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="space-y-6"
                >
                    <div>
                        <span className="text-white/70 text-xs font-bold uppercase tracking-widest">Newsletter</span>
                        <h2 className="font-heading text-3xl md:text-5xl font-bold text-white mt-3 leading-tight">
                            Stay in the Loop 💌
                        </h2>
                        <p className="text-white/80 text-base md:text-lg mt-4 leading-relaxed max-w-xl mx-auto">
                            Be the first to know about new drops, exclusive offers & behind-the-scenes peeks.
                            Join <strong>500+</strong> TerraKnots family members.
                        </p>
                    </div>

                    {status === 'success' ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                            className="bg-white/20 backdrop-blur-sm rounded-2xl px-8 py-6 inline-block"
                        >
                            <p className="text-2xl mb-2">🎉</p>
                            <p className="text-white font-bold text-lg">You're in! Welcome to the family.</p>
                            <p className="text-white/70 text-sm mt-1">Check your inbox for a warm welcome from us.</p>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                className="flex-1 px-6 py-4 rounded-full text-dark bg-white outline-none text-sm font-medium"
                                style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                            />
                            <motion.button
                                type="submit"
                                disabled={status === 'loading'}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="px-8 py-4 rounded-full text-sm font-bold text-white whitespace-nowrap disabled:opacity-70"
                                style={{ backgroundColor: '#C4A882', boxShadow: '0 4px 15px rgba(196,168,130,0.4)' }}
                            >
                                {status === 'loading' ? (
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                                ) : (
                                    'Subscribe 💌'
                                )}
                            </motion.button>
                        </form>
                    )}

                    {status === 'error' && (
                        <p className="text-red-200 text-sm">{message}</p>
                    )}

                    <p className="text-white/50 text-xs">
                        No spam, ever. Unsubscribe anytime. We pinky promise. 🤙
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
