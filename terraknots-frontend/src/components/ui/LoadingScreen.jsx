'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Only show on first visit per session
        const hasVisited = sessionStorage.getItem('terraknots_loaded');
        if (!hasVisited) {
            setVisible(true);
            sessionStorage.setItem('terraknots_loaded', 'true');
            const timer = setTimeout(() => setVisible(false), 2800);
            return () => clearTimeout(timer);
        }
    }, []);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                    className="fixed inset-0 z-[999] flex flex-col items-center justify-center"
                    style={{ backgroundColor: '#F5F0EB' }}
                >
                    {/* Background blobs */}
                    <motion.div
                        className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full pointer-events-none"
                        style={{ background: 'radial-gradient(circle, rgba(196,168,130,0.2) 0%, transparent 70%)' }}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    />
                    <motion.div
                        className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full pointer-events-none"
                        style={{ background: 'radial-gradient(circle, rgba(168,181,162,0.15) 0%, transparent 70%)' }}
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                    />

                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
                        className="relative mb-6"
                    >
                        <motion.div
                            animate={{ scale: [1, 1.06, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            className="relative w-24 h-24"
                        >
                            <Image
                                src="/images/logo.png"
                                alt="TerraKnots"
                                fill
                                className="object-contain"
                                priority
                            />
                        </motion.div>
                    </motion.div>

                    {/* Brand name */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="text-center mb-8"
                    >
                        <h1 className="font-heading text-3xl font-bold text-dark">
                            Terra<span className="text-primary">Knots</span>
                        </h1>
                        <p className="font-accent italic text-base text-light mt-1">
                            Handmade with heart, knot by knot.
                        </p>
                    </motion.div>

                    {/* Yarn unwind animation */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="flex items-center gap-2 mb-8"
                    >
                        {[0, 1, 2, 3, 4].map((i) => (
                            <motion.div
                                key={i}
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: '#C4A882' }}
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.4, 1, 0.4],
                                }}
                                transition={{
                                    duration: 1.2,
                                    repeat: Infinity,
                                    delay: i * 0.15,
                                    ease: 'easeInOut',
                                }}
                            />
                        ))}
                    </motion.div>

                    {/* Progress bar */}
                    <div className="w-48 h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(196,168,130,0.2)' }}>
                        <motion.div
                            className="h-full rounded-full"
                            style={{ background: 'linear-gradient(to right, #C4A882, #D4A574, #A8B5A2)' }}
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 2.4, ease: 'easeOut' }}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
