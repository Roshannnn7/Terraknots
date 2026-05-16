'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play, Sparkles, Leaf, Heart, Package } from 'lucide-react';

const trustBadges = [
    { icon: '🧶', label: '100% Handmade' },
    { icon: '🌿', label: 'Eco-Friendly' },
    { icon: '💛', label: 'Made with Love' },
    { icon: '📦', label: 'Free Shipping ₹499+' },
];

// Floating decorative element
const FloatingElement = ({ children, delay = 0, duration = 4, className = '' }) => (
    <motion.div
        className={className}
        animate={{ y: [0, -14, 0] }}
        transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
    >
        {children}
    </motion.div>
);

// Yarn ball SVG illustration
const YarnBall = ({ size = 48, color = '#C4A882' }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="20" fill={color} opacity="0.2" />
        <circle cx="24" cy="24" r="20" stroke={color} strokeWidth="1.5" fill="none" />
        <path d="M8 24 Q24 10 40 24" stroke={color} strokeWidth="1.5" fill="none" opacity="0.7" />
        <path d="M10 32 Q24 18 38 32" stroke={color} strokeWidth="1.5" fill="none" opacity="0.6" />
        <path d="M12 16 Q24 28 36 16" stroke={color} strokeWidth="1.5" fill="none" opacity="0.5" />
        <circle cx="38" cy="14" r="3" fill={color} opacity="0.8" />
        <path d="M38 14 L44 24" stroke={color} strokeWidth="1" opacity="0.6" />
    </svg>
);

// Flower SVG
const FlowerSVG = ({ size = 36, color = '#D4A574' }) => (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
        {[0, 60, 120, 180, 240, 300].map((deg, i) => (
            <ellipse
                key={i}
                cx="18" cy="18" rx="5" ry="9"
                fill={color}
                opacity="0.35"
                transform={`rotate(${deg} 18 18)`}
            />
        ))}
        <circle cx="18" cy="18" r="5" fill={color} opacity="0.7" />
    </svg>
);

// Hero heading words animated reveal
const headingWords = ["Handmade", "with", "heart,"];
const headingWords2 = ["knot", "by", "knot."];

export default function Hero() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });
    const imageY = useTransform(scrollYProgress, [0, 1], [0, 80]);
    const textY = useTransform(scrollYProgress, [0, 1], [0, -40]);
    const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

    return (
        <section
            ref={containerRef}
            className="relative min-h-screen flex items-center overflow-hidden bg-background"
            style={{ paddingTop: '80px' }}
        >
            {/* Animated gradient mesh background */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    className="absolute top-20 left-10 w-80 h-80 rounded-full opacity-30"
                    style={{ background: 'radial-gradient(circle, #F2D7C9 0%, transparent 70%)' }}
                    animate={{ scale: [1, 1.15, 1], x: [0, 20, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    className="absolute bottom-20 right-20 w-96 h-96 rounded-full opacity-25"
                    style={{ background: 'radial-gradient(circle, #A8B5A2 0%, transparent 70%)' }}
                    animate={{ scale: [1, 1.1, 1], x: [0, -15, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                />
                <motion.div
                    className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full opacity-20"
                    style={{ background: 'radial-gradient(circle, #C4A882 0%, transparent 70%)' }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                />
                {/* Grain texture overlay */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`
                    }}
                />
            </div>

            <div className="container relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 xl:gap-20 items-center min-h-[calc(100vh-80px)] py-16">

                    {/* LEFT — Text Content */}
                    <motion.div style={{ y: textY, opacity }} className="space-y-8 text-center lg:text-left">

                        {/* Label */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.6 }}
                        >
                            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-accent px-4 py-2 rounded-full"
                                style={{ background: 'rgba(168,181,162,0.12)', border: '1px solid rgba(168,181,162,0.3)' }}
                            >
                                <Sparkles size={12} />
                                Handcrafted in India
                            </span>
                        </motion.div>

                        {/* Main Heading */}
                        <div className="space-y-2">
                            {/* Line 1 */}
                            <div className="flex flex-wrap gap-x-4 justify-center lg:justify-start" style={{ perspective: '800px' }}>
                                {headingWords.map((word, i) => (
                                    <motion.span
                                        key={word}
                                        initial={{ opacity: 0, y: 50, rotateX: 40 }}
                                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                                        transition={{ delay: 0.3 + i * 0.12, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                                        className="block text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-heading font-bold leading-[1.05]"
                                        style={{ color: word === 'heart,' ? '#D4A574' : '#2C2C2C' }}
                                    >
                                        {word}
                                    </motion.span>
                                ))}
                            </div>
                            {/* Line 2 */}
                            <div className="flex flex-wrap gap-x-3 justify-center lg:justify-start" style={{ perspective: '800px' }}>
                                {headingWords2.map((word, i) => (
                                    <motion.span
                                        key={word}
                                        initial={{ opacity: 0, y: 50, rotateX: 40 }}
                                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                                        transition={{ delay: 0.65 + i * 0.12, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                                        className="block font-accent italic text-3xl sm:text-4xl md:text-5xl xl:text-6xl leading-tight"
                                        style={{ color: '#C4A882' }}
                                    >
                                        {word}
                                    </motion.span>
                                ))}
                            </div>
                        </div>

                        {/* Subtext */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.1, duration: 0.6 }}
                            className="text-base md:text-lg text-light leading-relaxed max-w-lg mx-auto lg:mx-0"
                        >
                            Discover unique crochet, resin & clay creations — each piece crafted by hand with love and patience.
                            <span className="font-semibold text-secondary"> No two pieces alike.</span>
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.3, duration: 0.6 }}
                            className="flex flex-wrap gap-4 justify-center lg:justify-start"
                        >
                            <Link href="/shop">
                                <motion.button
                                    whileHover={{ scale: 1.04, y: -2 }}
                                    whileTap={{ scale: 0.96 }}
                                    className="btn-primary px-8 py-4 text-base group"
                                >
                                    Shop Collection
                                    <motion.span
                                        className="inline-block ml-1"
                                        animate={{ x: [0, 4, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                                    >
                                        <ArrowRight size={18} />
                                    </motion.span>
                                </motion.button>
                            </Link>
                            <Link href="/about">
                                <motion.button
                                    whileHover={{ scale: 1.04, y: -2 }}
                                    whileTap={{ scale: 0.96 }}
                                    className="btn-secondary px-8 py-4 text-base flex items-center gap-2"
                                >
                                    <Play size={16} className="fill-primary" />
                                    Our Story
                                </motion.button>
                            </Link>
                        </motion.div>

                        {/* Trust badges */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.5, duration: 0.6 }}
                            className="flex flex-wrap gap-3 justify-center lg:justify-start"
                        >
                            {trustBadges.map((badge, i) => (
                                <motion.div
                                    key={badge.label}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 1.6 + i * 0.08 }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full text-xs font-semibold text-dark shadow-sm border border-gray-100"
                                >
                                    <span>{badge.icon}</span>
                                    <span>{badge.label}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* RIGHT — Image */}
                    <div className="relative flex items-center justify-center order-first lg:order-last">

                        {/* Decorative blob behind image */}
                        <motion.div
                            className="absolute inset-[-10%] blob-2 opacity-40"
                            style={{ background: 'linear-gradient(135deg, rgba(168,181,162,0.3) 0%, rgba(196,168,130,0.2) 100%)' }}
                            animate={{ rotate: [0, 5, 0, -5, 0] }}
                            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                        />

                        {/* Main image — organic masked */}
                        <motion.div
                            style={{ y: imageY }}
                            className="relative z-10 w-full max-w-md mx-auto"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
                                className="relative aspect-[4/5] organic-mask overflow-hidden shadow-warm"
                            >
                                <Image
                                    src="https://images.unsplash.com/photo-1517210122415-b0c70b2a09bf?w=800&h=1000&fit=crop"
                                    alt="TerraKnots handmade workspace"
                                    fill
                                    priority
                                    className="object-cover"
                                />
                                {/* Warm overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-deep-brown/20 via-transparent to-transparent" />
                            </motion.div>

                            {/* Floating: Yarn ball top-right */}
                            <FloatingElement delay={0} duration={4} className="absolute -top-6 -right-6 z-20">
                                <YarnBall size={52} color="#C4A882" />
                            </FloatingElement>

                            {/* Floating: Flower bottom-left */}
                            <FloatingElement delay={1.5} duration={5} className="absolute -bottom-4 -left-6 z-20">
                                <FlowerSVG size={44} color="#D4A574" />
                            </FloatingElement>

                            {/* Floating: dots cluster top-left */}
                            <FloatingElement delay={0.8} duration={6} className="absolute top-10 -left-8 z-20">
                                <svg width="40" height="40" viewBox="0 0 40 40">
                                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                        <circle
                                            key={i}
                                            cx={(i % 3) * 14 + 7}
                                            cy={Math.floor(i / 3) * 14 + 7}
                                            r="3"
                                            fill="#A8B5A2"
                                            opacity={0.4 + (i % 3) * 0.2}
                                        />
                                    ))}
                                </svg>
                            </FloatingElement>

                            {/* Badge: "Made with love" */}
                            <motion.div
                                initial={{ opacity: 0, rotate: -10, scale: 0.8 }}
                                animate={{ opacity: 1, rotate: -5, scale: 1 }}
                                transition={{ delay: 1.2, duration: 0.5 }}
                                className="absolute bottom-10 right-[-16px] z-20 bg-white px-4 py-2.5 rounded-2xl shadow-card"
                            >
                                <p className="text-xs font-bold text-dark whitespace-nowrap">✨ 100% Handmade</p>
                                <p className="font-accent text-primary text-sm italic">with love</p>
                            </motion.div>
                        </motion.div>
                    </div>

                </div>
            </div>

            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
                style={{ background: 'linear-gradient(to top, #F5F0EB, transparent)' }}
            />
        </section>
    );
}
