'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/animations';
import api from '@/lib/api';
import ProductCard from '@/components/common/ProductCard';

// Shimmer skeleton
function ProductSkeleton() {
    return (
        <div className="rounded-2xl overflow-hidden bg-white" style={{ boxShadow: '0 4px 20px rgba(139,115,85,0.06)' }}>
            <div className="skeleton aspect-[4/5]" />
            <div className="p-4 space-y-3">
                <div className="skeleton h-4 w-3/4 rounded-lg" />
                <div className="skeleton h-3 w-1/3 rounded-lg" />
                <div className="skeleton h-5 w-1/2 rounded-lg" />
            </div>
        </div>
    );
}

export default function FeaturedProducts() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/categories');
                setCategories(res.data.data || []);
            } catch (error) {
                console.error('Failed to fetch categories');
            }
        };
        fetchCategories();
    }, []);

    const dynamicTabs = [
        { label: 'All', value: '' },
        ...categories.slice(0, 6).map(cat => ({
            label: `${cat.icon || '📦'} ${cat.name}`,
            value: cat.name.toLowerCase()
        }))
    ];

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                setLoading(true);
                const params = { featured: true, limit: 8 };
                if (activeTab) params.category = activeTab;
                const { data } = await api.get('/products', { params });
                setProducts(data.products || []);
            } catch (err) {
                console.error('Failed to fetch featured products');
            } finally {
                setLoading(false);
            }
        };
        fetchFeatured();
    }, [activeTab]);

    return (
        <section className="section relative overflow-hidden" style={{ backgroundColor: '#FAF8F5' }}>
            {/* Texture overlay */}
            <div className="absolute inset-0 bg-texture pointer-events-none" />

            <div className="container relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="section-header"
                >
                    <span className="section-label">Bestsellers</span>
                    <h2 className="section-title">
                        Our Most <span className="font-accent italic text-primary">Loved</span> Pieces ✨
                    </h2>
                    <p className="section-subtitle mt-4 max-w-xl mx-auto">
                        Hand-picked favorites loved by our community — each one a tiny work of art.
                    </p>
                </motion.div>

                {/* Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex flex-wrap justify-center gap-2 mb-12"
                >
                    {dynamicTabs.map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => setActiveTab(tab.value)}
                            className={`relative px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                                activeTab === tab.value
                                    ? 'text-white'
                                    : 'text-light hover:text-dark bg-white'
                            }`}
                            style={activeTab === tab.value ? { backgroundColor: '#C4A882', boxShadow: '0 4px 15px rgba(196,168,130,0.3)' } : {}}
                        >
                            {activeTab === tab.value && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 rounded-full"
                                    style={{ backgroundColor: '#C4A882' }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10">{tab.label}</span>
                        </button>
                    ))}
                </motion.div>

                {/* Products Grid */}
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="skeleton"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6"
                        >
                            {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
                        </motion.div>
                    ) : products.length > 0 ? (
                        <motion.div
                            key={activeTab}
                            variants={staggerContainer}
                            initial="initial"
                            animate="animate"
                            className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6"
                        >
                            {products.map((product, index) => (
                                <motion.div key={product._id} variants={staggerItem}>
                                    <ProductCard product={product} priority={index < 4} />
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-20"
                        >
                            <div className="text-6xl mb-4">🧶</div>
                            <p className="text-light text-lg">No products in this category yet.</p>
                            <p className="text-sm text-light mt-2">Check back soon — we're crafting something special!</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* View All CTA */}
                {!loading && products.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-center mt-14"
                    >
                        <a href="/shop" className="btn-primary px-10 py-4 text-base">
                            View All Products →
                        </a>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
