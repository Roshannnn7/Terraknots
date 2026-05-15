'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const categories = [
    {
        name: 'Crochet',
        slug: 'crochet',
        count: 14,
        image: 'https://picsum.photos/seed/crochet-cat-hero/600/750',
        accent: '#C4A882',
        emoji: '🧶',
        desc: 'Handknitted with love',
    },
    {
        name: 'Resin Art',
        slug: 'resin',
        count: 11,
        image: 'https://picsum.photos/seed/resin-cat-hero/600/750',
        accent: '#D4A574',
        emoji: '✨',
        desc: 'Sparkling creations',
    },
    {
        name: 'Clay',
        slug: 'clay',
        count: 9,
        image: 'https://picsum.photos/seed/clay-cat-hero/600/750',
        accent: '#A8B5A2',
        emoji: '🏺',
        desc: 'Earthy elegance',
    },
    {
        name: 'Decor',
        slug: 'decor',
        count: 8,
        image: 'https://picsum.photos/seed/decor-cat-hero/600/750',
        accent: '#C9B09B',
        emoji: '🪴',
        desc: 'Home with soul',
    },
];

function CategoryCard({ cat, index }) {
    const cardRef = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [5, -5]), { stiffness: 300, damping: 30 });
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-5, 5]), { stiffness: 300, damping: 30 });

    const handleMouseMove = (e) => {
        const rect = cardRef.current?.getBoundingClientRect();
        if (!rect) return;
        const relX = (e.clientX - rect.left) / rect.width - 0.5;
        const relY = (e.clientY - rect.top) / rect.height - 0.5;
        x.set(relX);
        y.set(relY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: index * 0.1, duration: 0.6, ease: 'easeOut' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: '800px' }}
        >
            <Link href={`/shop?category=${cat.slug}`}>
                <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.3 }}
                    className="relative rounded-3xl overflow-hidden cursor-pointer group"
                    style={{ aspectRatio: '3/4', boxShadow: '0 4px 20px rgba(139,115,85,0.12)' }}
                >
                    {/* Image */}
                    <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Gradient overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <motion.div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ background: `linear-gradient(to top, ${cat.accent}80, transparent)` }}
                    />

                    {/* Emoji top-left */}
                    <motion.div
                        className="absolute top-4 left-4 text-2xl"
                        animate={{ rotate: [0, 10, 0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: index * 0.5 }}
                    >
                        {cat.emoji}
                    </motion.div>

                    {/* Count badge top-right */}
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full border border-white/30">
                        {cat.count} items
                    </div>

                    {/* Bottom content */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                        <p className="text-xs font-semibold uppercase tracking-widest opacity-80 mb-1">
                            {cat.desc}
                        </p>
                        <h3 className="font-heading text-2xl font-bold mb-2">{cat.name}</h3>
                        <motion.div
                            className="flex items-center gap-1 text-sm font-semibold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                        >
                            View Collection →
                        </motion.div>
                    </div>
                </motion.div>
            </Link>
        </motion.div>
    );
}

export default function Categories() {
    return (
        <section className="section bg-background relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(168,181,162,0.15) 0%, transparent 70%)' }}
            />

            <div className="container">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="section-header"
                >
                    <span className="section-label">Explore</span>
                    <h2 className="section-title handdrawn-underline inline-block">
                        Our Collections
                    </h2>
                    <p className="section-subtitle mt-6 max-w-lg mx-auto">
                        Each collection is a world of handmade wonders — crafted slow, loved forever.
                    </p>
                </motion.div>

                {/* Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {categories.map((cat, i) => (
                        <CategoryCard key={cat.slug} cat={cat} index={i} />
                    ))}
                </div>

                {/* Link */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center mt-12"
                >
                    <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 text-secondary font-semibold text-sm hover:text-primary transition-colors group"
                    >
                        View All Products
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
