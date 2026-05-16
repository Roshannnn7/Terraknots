'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Home, Search } from 'lucide-react';
import api from '@/lib/api';

const floatVariants = {
    animate: (i) => ({
        y: [0, -20, 0],
        rotate: [0, i % 2 === 0 ? 10 : -10, 0],
        transition: {
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.4,
        },
    }),
};

const CRAFT_ITEMS = ['🧶', '🧵', '🪡', '🌸', '🎀', '✨'];
const NUMBERS = ['4', '0', '4'];

export default function NotFound() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/categories');
                setCategories(res.data.data || []);
            } catch (error) {
                console.error('Failed to fetch 404 categories');
            }
        };
        fetchCategories();
    }, []);

    const displayCats = categories.length > 0 
        ? categories.slice(0, 5).map(c => c.name)
        : ['Crochet', 'Resin', 'Clay', 'Keychains', 'Decor'];
    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #F5F0EB 0%, #F2D7C9 50%, #EDE5D8 100%)' }}
        >
            {/* Ambient blobs */}
            <motion.div
                className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-30"
                style={{ background: 'radial-gradient(circle, #C4A882 0%, transparent 70%)' }}
                animate={{ scale: [1, 1.1, 1], rotate: [0, 15, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full opacity-25"
                style={{ background: 'radial-gradient(circle, #A8B5A2 0%, transparent 70%)' }}
                animate={{ scale: [1, 1.15, 1], rotate: [0, -10, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            />

            {/* Floating craft items */}
            {CRAFT_ITEMS.map((item, i) => (
                <motion.div
                    key={i}
                    className="absolute text-3xl md:text-4xl pointer-events-none"
                    custom={i}
                    variants={floatVariants}
                    animate="animate"
                    style={{
                        left: `${10 + (i * 15) % 80}%`,
                        top: `${15 + (i * 17) % 65}%`,
                        opacity: 0.5,
                    }}
                >
                    {item}
                </motion.div>
            ))}

            {/* Main content */}
            <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">

                {/* 404 numbers with character */}
                <div className="flex items-center justify-center gap-2 md:gap-6 mb-8">
                    {NUMBERS.map((num, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 60, rotateX: 30 }}
                            animate={{ opacity: 1, y: 0, rotateX: 0 }}
                            transition={{ delay: i * 0.15, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                        >
                            {i === 1 ? (
                                // Middle "0" replaced with yarn ball
                                <motion.div
                                    className="w-24 h-24 md:w-36 md:h-36 rounded-full flex items-center justify-center"
                                    style={{
                                        background: 'linear-gradient(135deg, #C4A882, #D4A574)',
                                        boxShadow: '0 20px 50px rgba(196,168,130,0.4)',
                                    }}
                                    animate={{ rotate: [0, 360] }}
                                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                >
                                    <span className="text-5xl md:text-7xl">🧶</span>
                                </motion.div>
                            ) : (
                                <span
                                    className="text-7xl md:text-[120px] font-heading font-black leading-none select-none"
                                    style={{
                                        WebkitTextStroke: '3px #8B7355',
                                        color: 'transparent',
                                    }}
                                >
                                    {num}
                                </span>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Text */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="space-y-4 mb-10"
                >
                    <h1 className="text-3xl md:text-4xl font-heading font-bold text-dark">
                        Oops! This page got{' '}
                        <span className="font-accent italic text-primary">tangled up.</span>
                    </h1>
                    <p className="text-light text-base md:text-lg max-w-md mx-auto leading-relaxed">
                        We couldn't find what you're looking for. It might have been moved, deleted, or never existed — kind of like a lost yarn.
                    </p>
                </motion.div>

                {/* SVG yarn tangled path */}
                <motion.svg
                    className="w-full max-w-xs mx-auto mb-10 opacity-30"
                    viewBox="0 0 300 60"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.3 }}
                    transition={{ delay: 0.8, duration: 2, ease: 'easeInOut' }}
                >
                    <motion.path
                        d="M10 30 Q50 10 90 30 Q130 50 170 30 Q210 10 250 30 Q275 42 290 30"
                        stroke="#C4A882"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.8, duration: 2, ease: 'easeInOut' }}
                    />
                </motion.svg>

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <Link href="/">
                        <motion.button
                            whileHover={{ scale: 1.04, y: -2 }}
                            whileTap={{ scale: 0.96 }}
                            className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white text-base"
                            style={{
                                background: 'linear-gradient(135deg, #C4A882, #D4A574)',
                                boxShadow: '0 8px 25px rgba(196,168,130,0.4)',
                            }}
                        >
                            <Home size={18} />
                            Go Home
                        </motion.button>
                    </Link>
                    <Link href="/shop">
                        <motion.button
                            whileHover={{ scale: 1.04, y: -2 }}
                            whileTap={{ scale: 0.96 }}
                            className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-secondary text-base bg-white border-2 border-primary"
                        >
                            <Search size={18} />
                            Browse Shop
                            <ArrowRight size={16} />
                        </motion.button>
                    </Link>
                </motion.div>

                {/* Quick links */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1, duration: 0.6 }}
                    className="mt-12 flex flex-wrap gap-3 justify-center"
                >
                    {displayCats.map((cat) => (
                        <Link
                            key={cat}
                            href={`/shop?category=${cat.toLowerCase()}`}
                            className="text-sm font-semibold text-secondary hover:text-primary px-4 py-2 bg-white/60 rounded-full border border-primary/20 hover:border-primary/50 transition-all hover:-translate-y-0.5"
                        >
                            {cat}
                        </Link>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
