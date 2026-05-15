'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Trash2, Eye } from 'lucide-react';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

export default function WishlistPage() {
    const { wishlist, toggleWishlist } = useWishlist();
    const { addToCart } = useCart();
    const [addedIds, setAddedIds] = useState([]);

    const handleAddToCart = (product) => {
        addToCart(product);
        setAddedIds((prev) => [...prev, product._id]);
        setTimeout(() => setAddedIds((prev) => prev.filter((id) => id !== product._id)), 2000);
    };

    return (
        <>
            <AnnouncementBar />
            <Navbar />

            <main className="min-h-screen bg-background pt-[108px] pb-24">
                {/* Page Header */}
                <div className="relative py-16 md:py-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, #F5F0EB 0%, #F2D7C9 100%)' }}>
                    <motion.div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-30 pointer-events-none"
                        style={{ background: 'radial-gradient(circle, #C4A882 0%, transparent 70%)' }}
                        animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />

                    <div className="container relative z-10 text-center">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-primary mb-4"
                                style={{ backgroundColor: 'rgba(196,168,130,0.1)' }}>
                                <Heart size={12} className="fill-primary text-primary" />
                                Your Wishlist
                            </div>
                        </motion.div>
                        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl font-heading font-bold text-dark">
                            Saved with <span className="font-accent italic text-primary">Love</span>
                        </motion.h1>
                        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                            className="text-light text-lg mt-3">
                            {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} waiting for you
                        </motion.p>
                    </div>
                </div>

                <div className="container py-12">
                    <AnimatePresence mode="popLayout">
                        {wishlist.length === 0 ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="text-center py-20 max-w-md mx-auto"
                            >
                                <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl"
                                    style={{ background: 'linear-gradient(135deg, #F2D7C9, #C4A882)' }}>
                                    🤍
                                </div>
                                <h2 className="text-2xl font-heading font-bold text-dark mb-3">Your wishlist is empty</h2>
                                <p className="text-light mb-8">Start exploring our handmade collection and save your favorites!</p>
                                <Link href="/shop">
                                    <motion.button
                                        whileHover={{ scale: 1.04, y: -2 }}
                                        whileTap={{ scale: 0.96 }}
                                        className="btn-primary px-8 py-4"
                                    >
                                        Explore Collection
                                    </motion.button>
                                </Link>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="grid"
                                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
                            >
                                {wishlist.map((product, i) => {
                                    const effectivePrice = product.salePrice || product.price;
                                    const discount = product.price && product.salePrice
                                        ? Math.round(((product.price - product.salePrice) / product.price) * 100)
                                        : 0;
                                    const isAdded = addedIds.includes(product._id);

                                    return (
                                        <motion.div
                                            key={product._id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
                                            transition={{ delay: i * 0.05 }}
                                            className="group bg-white rounded-2xl overflow-hidden"
                                            style={{ boxShadow: '0 4px 20px rgba(139,115,85,0.08)' }}
                                        >
                                            {/* Image */}
                                            <div className="relative aspect-square overflow-hidden">
                                                <img
                                                    src={product.images?.[0] || `https://picsum.photos/seed/${product._id}/400/400`}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                                {discount > 0 && (
                                                    <span className="absolute top-2 left-2 badge-sale text-[10px] px-2 py-0.5">-{discount}%</span>
                                                )}
                                                {/* Remove from wishlist */}
                                                <button
                                                    onClick={() => toggleWishlist(product)}
                                                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow hover:bg-red-50 transition-colors group/btn"
                                                >
                                                    <Heart size={14} className="fill-red-400 text-red-400 group-hover/btn:scale-110 transition-transform" />
                                                </button>
                                            </div>

                                            {/* Info */}
                                            <div className="p-4">
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">{product.category}</p>
                                                <h3 className="font-semibold text-dark text-sm leading-snug line-clamp-2 mb-3">{product.name}</h3>

                                                <div className="flex items-baseline gap-2 mb-4">
                                                    <span className="font-bold text-dark">{formatPrice(effectivePrice)}</span>
                                                    {product.salePrice && (
                                                        <span className="text-light line-through text-xs">{formatPrice(product.price)}</span>
                                                    )}
                                                </div>

                                                <div className="flex gap-2">
                                                    <motion.button
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleAddToCart(product)}
                                                        className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all"
                                                        style={{
                                                            background: isAdded
                                                                ? '#6B9B7D'
                                                                : 'linear-gradient(135deg, #C4A882, #D4A574)',
                                                        }}
                                                    >
                                                        <ShoppingBag size={12} />
                                                        {isAdded ? 'Added!' : 'Add to Cart'}
                                                    </motion.button>
                                                    <Link href={`/product/${product.slug || product._id}`}>
                                                        <button className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-light hover:bg-gray-100 hover:text-dark transition-all">
                                                            <Eye size={14} />
                                                        </button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {wishlist.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="text-center mt-12"
                        >
                            <Link href="/shop">
                                <button className="btn-secondary px-8 py-3">Continue Shopping</button>
                            </Link>
                        </motion.div>
                    )}
                </div>
            </main>

            <Footer />
        </>
    );
}
