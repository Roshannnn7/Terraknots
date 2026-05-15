'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Box } from 'lucide-react';
import Link from 'next/link';

import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductGallery from '@/components/product/ProductGallery';
import ProductInfo from '@/components/product/ProductInfo';
import Reviews from '@/components/product/Reviews';
import ProductCard from '@/components/common/ProductCard';
import WaveDivider from '@/components/ui/WaveDivider';
import api from '@/lib/api';

export default function ProductDetailPage() {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProductData = async () => {
            setLoading(true);
            try {
                const { data } = await api.get(`/products/${slug}`);
                setProduct(data.product);

                // Fetch related products
                const { data: relatedData } = await api.get(`/products/${data.product._id}/related`);
                setRelatedProducts(relatedData.products || []);
            } catch (error) {
                console.error('Error fetching product details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProductData();
        // Scroll to top on load
        window.scrollTo(0, 0);
    }, [slug]);

    if (loading) return (
        <div className="min-h-screen bg-background flex flex-col pt-[108px]">
            <AnnouncementBar />
            <Navbar />
            <div className="container mx-auto px-4 py-8 md:py-16 flex-1 flex flex-col">
                <div className="w-24 h-6 bg-gray-200 rounded animate-pulse mb-8" />
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 lg:gap-20">
                    <div className="aspect-[4/5] bg-gray-200 rounded-[2rem] animate-pulse" />
                    <div className="space-y-6">
                        <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
                        <div className="h-10 bg-gray-200 rounded w-3/4 animate-pulse" />
                        <div className="h-10 bg-gray-200 rounded w-1/3 animate-pulse" />
                        <div className="h-32 bg-gray-200 rounded animate-pulse" />
                        <div className="h-14 bg-gray-200 rounded animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );

    if (!product) return (
        <div className="min-h-screen bg-background flex flex-col pt-[108px]">
            <AnnouncementBar />
            <Navbar />
            <div className="flex-1 flex flex-col items-center justify-center space-y-6 text-center px-4">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-300">
                    <Box size={40} />
                </div>
                <h1 className="text-4xl font-heading font-bold text-dark">Oops! Product Not Found</h1>
                <p className="text-light">It seems this item has been moved or doesn't exist.</p>
                <Link href="/shop" className="btn-primary mt-4">
                    Explore Our Shop
                </Link>
            </div>
            <Footer />
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <AnnouncementBar />
            <Navbar />

            <main className="flex-1 pt-[108px]">
                {/* Breadcrumb */}
                <div className="container py-6">
                    <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-light hover:text-primary transition-colors">
                        <ArrowLeft size={16} />
                        Back to Shop
                    </Link>
                </div>

                <div className="container pb-20">
                    {/* Top Row: Gallery & Info */}
                    <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 lg:gap-16 xl:gap-24 mb-24">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="w-full relative"
                        >
                            <ProductGallery images={product.images || []} />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="w-full relative"
                        >
                            <ProductInfo product={product} />
                        </motion.div>
                    </div>

                    {/* Middle Row: The Story */}
                    <div className="mb-24 relative">
                        {/* Decorative background blob */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[80px] pointer-events-none -z-10" />

                        <div className="max-w-4xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-100px' }}
                                className="text-center mb-12"
                            >
                                <h2 className="text-3xl md:text-5xl font-heading font-bold text-dark mb-4 drop-shadow-sm">
                                    The <span className="font-accent italic text-primary">Story</span> Behind It
                                </h2>
                                <p className="text-light text-lg">Every knot, every detail, thoughtfully crafted.</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-100px' }}
                                className="prose prose-stone max-w-none text-light/90 leading-loose md:text-lg font-medium text-center md:text-left bg-white/60 backdrop-blur-md p-8 md:p-12 rounded-[2rem] shadow-sm border border-gray-100/50"
                            >
                                <p>{product.fullDescription || product.description}</p>
                            </motion.div>

                            {/* Info Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group"
                                >
                                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
                                    <h4 className="text-xl font-heading font-bold text-dark mb-4 flex items-center gap-2">
                                        ✨ Key Features
                                    </h4>
                                    <ul className="text-sm space-y-3 font-medium text-light relative z-10">
                                        <li className="flex items-center gap-2 before:content-[''] before:block before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary">100% Handmade</li>
                                        <li className="flex items-center gap-2 before:content-[''] before:block before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary">Unique artisan design</li>
                                        {product.tags?.map(tag => (
                                            <li key={tag} className="flex items-center gap-2 before:content-[''] before:block before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary capitalize">{tag}</li>
                                        ))}
                                    </ul>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group"
                                >
                                    <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-[#A8B5A2]/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
                                    <h4 className="text-xl font-heading font-bold text-dark mb-4 flex items-center gap-2">
                                        💖 Care Instructions
                                    </h4>
                                    <p className="text-sm leading-relaxed font-medium text-light relative z-10">
                                        {product.careInstructions || 'Handle with gentle care to preserve the handmade details. Keep away from direct moisture when possible.'}
                                    </p>
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row: Reviews */}
                    <div className="mb-24 pt-16 border-t border-gray-100">
                        <Reviews productId={product._id} />
                    </div>

                </div>

                {/* Related Products Section */}
                <AnimatePresence>
                    {relatedProducts.length > 0 && (
                        <motion.section
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="bg-white py-24 relative overflow-hidden"
                            style={{ borderTop: '1px solid rgba(139,115,85,0.1)' }}
                        >
                            <WaveDivider variant={1} color="#FAF8F5" flip className="absolute top-0 w-full" />
                            
                            <div className="container relative z-10">
                                <div className="text-center mb-16">
                                    <span className="section-label">You Might Also Like</span>
                                    <h2 className="section-title">
                                        More Handcrafted <span className="text-primary font-accent italic">Treasures</span>
                                    </h2>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                                    {relatedProducts.map((prod, idx) => (
                                        <motion.div
                                            key={prod._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: idx * 0.1 }}
                                        >
                                            <ProductCard product={prod} />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.section>
                    )}
                </AnimatePresence>
            </main>

            <Footer />
        </div>
    );
}
