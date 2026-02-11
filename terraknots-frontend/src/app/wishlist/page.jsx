'use client';

import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/common/ProductCard';
import { useWishlist } from '@/context/WishlistContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Search } from 'lucide-react';
import Link from 'next/link';

const WishlistPage = () => {
    const { wishlist, loading } = useWishlist();

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <>
            <AnnouncementBar />
            <Navbar />

            <main className="pt-32 pb-24 bg-background min-h-screen">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-2xl mx-auto text-center mb-16 space-y-4">
                        <h1 className="text-4xl md:text-5xl font-heading font-bold text-dark">Your Wishlist</h1>
                        <p className="text-light italic font-accent text-xl">All the handmade pieces you've fallen in love with</p>
                    </div>

                    {wishlist.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            <AnimatePresence>
                                {wishlist.map((product, idx) => (
                                    <motion.div
                                        key={product._id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: idx * 0.05 }}
                                    >
                                        <ProductCard product={product} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="text-center py-24 bg-white rounded-[4rem] space-y-8 max-w-4xl mx-auto shadow-sm">
                            <div className="w-32 h-32 bg-background rounded-full flex items-center justify-center mx-auto text-primary/30">
                                <Heart size={56} />
                            </div>
                            <div className="space-y-3">
                                <h2 className="text-3xl font-heading font-bold text-dark">Your wishlist is empty</h2>
                                <p className="text-light max-w-xs mx-auto text-lg leading-relaxed">You haven't saved any treasures yet. Explore our shop to find something you love!</p>
                            </div>
                            <Link href="/shop" className="btn-primary inline-flex items-center px-10 group">
                                <Search size={18} className="mr-2 group-hover:scale-110 transition-transform" />
                                Explore Our Collection
                            </Link>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </>
    );
};

export default WishlistPage;
