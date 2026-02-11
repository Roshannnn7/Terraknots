'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductGallery from '@/components/product/ProductGallery';
import ProductInfo from '@/components/product/ProductInfo';
import Reviews from '@/components/product/Reviews';
import ProductCard from '@/components/common/ProductCard';
import api from '@/lib/api';
import { motion } from 'framer-motion';

const ProductDetailPage = () => {
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
                setRelatedProducts(relatedData.products);
            } catch (error) {
                console.error('Error fetching product details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProductData();
    }, [slug]);

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!product) return (
        <div className="min-h-screen bg-background flex items-center justify-center flex-col space-y-4">
            <h1 className="text-4xl font-heading font-bold text-dark">Product Not Found</h1>
            <a href="/shop" className="btn-primary">Back to Shop</a>
        </div>
    );

    return (
        <>
            <AnnouncementBar />
            <Navbar />

            <main className="pt-32 pb-24 bg-background">
                <div className="container mx-auto px-4 md:px-6">
                    {/* Main Product Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-24 mb-24">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <ProductGallery images={product.images} />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <ProductInfo product={product} />
                        </motion.div>
                    </div>

                    {/* Product Tabs/Description */}
                    <div className="mb-24">
                        <div className="border-b border-gray-200 mb-8">
                            <h2 className="text-2xl font-heading font-bold pb-4 border-b-2 border-primary inline-block">Product Story</h2>
                        </div>
                        <div className="prose prose-stone max-w-none text-light leading-loose text-lg font-light">
                            <p>{product.fullDescription}</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
                                <div className="bg-white p-8 rounded-[2rem] shadow-sm">
                                    <h4 className="text-xl font-heading font-bold text-dark mb-4">Care Instructions</h4>
                                    <p className="text-sm leading-relaxed">{product.careInstructions || 'No specific care instructions provided.'}</p>
                                </div>
                                <div className="bg-white p-8 rounded-[2rem] shadow-sm">
                                    <h4 className="text-xl font-heading font-bold text-dark mb-4">Key Features</h4>
                                    <ul className="text-sm space-y-2 list-disc pl-4">
                                        {product.tags.map(tag => (
                                            <li key={tag} className="capitalize">{tag}</li>
                                        ))}
                                        <li>100% Handmade with love</li>
                                        <li>Unique artisan patterns</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="mb-24 pt-16 border-t border-gray-100">
                        <Reviews productId={product._id} />
                    </div>

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <div className="pt-16 border-t border-gray-100">
                            <div className="text-center mb-12">
                                <span className="text-primary font-bold text-sm uppercase tracking-widest block mb-2">More like this</span>
                                <h2 className="text-4xl font-heading font-bold text-dark">Related Products</h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                {relatedProducts.map(prod => (
                                    <ProductCard key={prod._id} product={prod} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </>
    );
};

export default ProductDetailPage;
