'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '../common/ProductCard';
import api from '@/lib/api';
import { motion } from 'framer-motion';

const FeaturedProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const { data } = await api.get('/products?featured=true&limit=4');
                setProducts(data.products);
            } catch (error) {
                console.error('Error fetching featured products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchFeatured();
    }, []);

    if (loading) return null; // Or skeleton

    return (
        <section className="py-24 bg-background overflow-hidden relative">
            {/* Decorative text background */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[15rem] font-heading font-black text-dark/5 select-none pointer-events-none whitespace-nowrap -rotate-6">
                Artisan Crafts • Unique Designs • Handmade
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-primary font-bold text-sm uppercase tracking-[0.3em]"
                    >
                        Handpicked for you
                    </motion.span>
                    <h2 className="text-4xl md:text-5xl font-heading font-bold text-dark">Our Best Sellers</h2>
                    <p className="text-light">
                        Each piece in our bestseller collection has been crafted hundreds of times, refined to perfection just for you.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product, index) => (
                        <motion.div
                            key={product._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <ProductCard product={product} />
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Link href="/shop" className="btn-secondary px-8">
                        Explore All Products
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;
