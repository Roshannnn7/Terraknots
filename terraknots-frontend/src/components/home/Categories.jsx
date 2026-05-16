'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import api from '@/lib/api';

const categories = [
    {
        name: 'Crochet',
        slug: 'crochet',
        count: 14,
        image: '/images/workspace-crochet.jpg',
        accent: '#C4A882',
        emoji: '🧶',
        desc: 'Handknitted with love',
    },
    {
        name: 'Resin Art',
        slug: 'resin',
        count: 11,
        image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=600&h=750&fit=crop',
        accent: '#D4A574',
        emoji: '✨',
        desc: 'Sparkling creations',
    },
    {
        name: 'Clay',
        slug: 'clay',
        count: 9,
        image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&h=750&fit=crop',
        accent: '#A8B5A2',
        emoji: '🏺',
        desc: 'Earthy elegance',
    },
    {
        name: 'Decor',
        slug: 'decor',
        count: 8,
        image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&h=750&fit=crop',
        accent: '#C9B09B',
        emoji: '🪴',
        desc: 'Home with soul',
    },
    {
        name: 'Keychains',
        slug: 'keychains',
        count: 12,
        image: 'https://images.unsplash.com/photo-1596489370642-e160e1d51a66?w=600&h=750&fit=crop',
        accent: '#D1A3B0',
        emoji: '🔑',
        desc: 'Tiny companions',
    },
    {
        name: 'Anime Collections',
        slug: 'anime-collections',
        count: 5,
        image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&h=750&fit=crop',
        accent: '#968FA0',
        emoji: '🎌',
        desc: 'Otaku treasures',
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
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await api.get('/categories');
                setCategories(data.categories.slice(0, 6)); // Only show top 6 on home
            } catch (error) {
                console.error('Failed to fetch categories');
                // Use some static ones as fallback if needed or just show nothing
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    if (loading) return (
        <section className="section bg-background">
            <div className="container grid grid-cols-2 md:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="aspect-[3/4] bg-white rounded-3xl animate-pulse shadow-sm border border-gray-100" />
                ))}
            </div>
        </section>
    );

    if (categories.length === 0) return null;

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
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                    {categories.map((cat, i) => (
                        <CategoryCard key={cat.slug} cat={{
                            name: cat.name,
                            slug: cat.slug,
                            count: cat.productCount || 0,
                            image: cat.image || 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=600&h=750&fit=crop',
                            accent: cat.color || '#C4A882',
                            emoji: cat.icon || '🧶',
                            desc: cat.description || 'Handcrafted with love'
                        }} index={i} />
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
