'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { formatPrice, calculateDiscount } from '@/lib/utils';

function HandmadeBadge() {
    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold italic"
            style={{
                color: '#8B7355',
                border: '1.5px dashed rgba(139,115,85,0.4)',
                borderRadius: '4px',
                fontFamily: 'var(--font-dancing)',
            }}
        >
            ✂️ Handmade
        </span>
    );
}

export default function ProductCard({ product, onQuickView }) {
    const { addToCart } = useCart();
    const { toggleWishlist, isWishlisted } = useWishlist();
    const [addedToCart, setAddedToCart] = useState(false);
    const [imageIdx, setImageIdx] = useState(0);
    const wishlisted = isWishlisted(product._id);

    const images = product.images || [];
    const effectivePrice = product.salePrice || product.price;
    const discount = calculateDiscount(product.price, product.salePrice);
    const displayRating = product.averageRating || product.rating || 0;
    const reviewCount = product.reviewCount || product.numReviews || 0;
    const isLowStock = product.stock > 0 && product.stock <= 5;
    const isOutOfStock = product.stock === 0;

    const handleAddToCart = (e) => {
        e.preventDefault();
        if (isOutOfStock) return;
        addToCart(product);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const handleWishlist = (e) => {
        e.preventDefault();
        toggleWishlist(product);
    };

    return (
        <div className="product-card group">
            {/* Image Section */}
            <div className="card-image relative overflow-hidden"
                style={{ aspectRatio: '4/5' }}
                onMouseEnter={() => images.length > 1 && setImageIdx(1)}
                onMouseLeave={() => setImageIdx(0)}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={imageIdx}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35 }}
                        className="absolute inset-0"
                    >
                        <Image
                            src={images[imageIdx] || `https://picsum.photos/seed/${product._id || 'default'}/400/500`}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Out of stock overlay */}
                {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10">
                        <span className="bg-white text-dark text-xs font-bold px-4 py-2 rounded-full">
                            Out of Stock
                        </span>
                    </div>
                )}

                {/* Top badges */}
                <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
                    {product.isBestseller && (
                        <span className="badge-bestseller text-[10px] px-2 py-0.5">Bestseller</span>
                    )}
                    {product.isNewArrival && (
                        <span className="badge-new text-[10px] px-2 py-0.5">New ✨</span>
                    )}
                    {discount > 0 && (
                        <span className="badge-sale text-[10px] px-2 py-0.5">-{discount}%</span>
                    )}
                </div>

                {/* Wishlist button */}
                <button
                    onClick={handleWishlist}
                    className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm transition-all duration-200 hover:scale-110"
                >
                    <motion.div
                        animate={wishlisted ? { scale: [1, 1.3, 1] } : {}}
                        transition={{ duration: 0.3 }}
                    >
                        <Heart
                            size={15}
                            className={wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                        />
                    </motion.div>
                </button>

                {/* Low stock badge */}
                {isLowStock && !isOutOfStock && (
                    <motion.div
                        className="absolute bottom-12 left-3 z-10"
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                            style={{ backgroundColor: '#D4A574' }}
                        >
                            🔥 Only {product.stock} left
                        </span>
                    </motion.div>
                )}

                {/* Quick actions — slide up on hover */}
                <div className="quick-actions absolute bottom-0 left-0 right-0 z-20 p-3 flex gap-2"
                    style={{ background: 'linear-gradient(to top, rgba(44,44,44,0.7), transparent)' }}
                >
                    <button
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                        className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white transition-all disabled:opacity-50"
                        style={{
                            backgroundColor: addedToCart ? '#6B9B7D' : '#C4A882',
                            boxShadow: '0 4px 12px rgba(196,168,130,0.4)',
                        }}
                    >
                        {addedToCart ? '✓ Added!' : (
                            <span className="flex items-center justify-center gap-1.5">
                                <ShoppingBag size={13} />
                                Add to Cart
                            </span>
                        )}
                    </button>
                    {onQuickView && (
                        <button
                            onClick={(e) => { e.preventDefault(); onQuickView(product); }}
                            className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                        >
                            <Eye size={14} />
                        </button>
                    )}
                </div>
            </div>

            {/* Info Section */}
            <Link href={`/product/${product.slug || product._id}`}>
                <div className="p-4">
                    {/* Category */}
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] mb-1.5"
                        style={{ color: '#A8B5A2' }}>
                        {product.category}
                    </p>

                    {/* Name */}
                    <h3 className="font-body text-sm font-semibold text-dark leading-snug line-clamp-2 mb-2">
                        {product.name}
                    </h3>

                    {/* Rating */}
                    {displayRating > 0 && (
                        <div className="flex items-center gap-1 mb-2">
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star
                                        key={s}
                                        size={11}
                                        className={s <= Math.round(displayRating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200'}
                                    />
                                ))}
                            </div>
                            {reviewCount > 0 && (
                                <span className="text-[10px] text-light">({reviewCount})</span>
                            )}
                        </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-base text-dark">
                            {formatPrice(effectivePrice)}
                        </span>
                        {product.salePrice && product.salePrice < product.price && (
                            <span className="text-light line-through text-xs">
                                {formatPrice(product.price)}
                            </span>
                        )}
                    </div>

                    {/* Handmade badge */}
                    <div className="mt-2">
                        <HandmadeBadge />
                    </div>
                </div>
            </Link>
        </div>
    );
}
