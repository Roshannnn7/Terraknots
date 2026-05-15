'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuickViewModal({ product, onClose }) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const overlayRef = useRef(null);
    const { addToCart } = require('@/context/CartContext').useCart ? require('@/context/CartContext').useCart() : { addToCart: () => {} };

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        const handleKey = (e) => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', handleKey);
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKey);
        };
    }, [onClose]);

    if (!product) return null;

    const images = product.images?.length
        ? product.images
        : [`https://picsum.photos/seed/${product._id || 'default'}/600/700`];

    const effectivePrice = product.salePrice || product.price;
    const discount = product.price && product.salePrice
        ? Math.round(((product.price - product.salePrice) / product.price) * 100)
        : 0;

    const handleAddToCart = () => {
        if (typeof addToCart === 'function') {
            addToCart(product, quantity);
        }
        setAdded(true);
        setTimeout(() => { setAdded(false); onClose(); }, 1500);
    };

    return (
        <AnimatePresence>
            <motion.div
                ref={overlayRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => e.target === overlayRef.current && onClose()}
                className="fixed inset-0 z-[500] flex items-center justify-center p-4"
                style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 30 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="relative bg-white rounded-3xl overflow-hidden max-w-3xl w-full max-h-[90vh] flex flex-col md:flex-row shadow-2xl"
                >
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center text-dark hover:bg-gray-100 transition-colors"
                    >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>

                    {/* Image section */}
                    <div className="w-full md:w-1/2 flex-shrink-0">
                        <div className="relative aspect-square bg-gray-50">
                            <img
                                src={images[selectedImage]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                            {discount > 0 && (
                                <span className="absolute top-3 left-3 badge-sale text-xs px-2 py-1">
                                    -{discount}% OFF
                                </span>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="flex gap-2 p-3 overflow-x-auto">
                                {images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedImage(i)}
                                        className={`w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                                            i === selectedImage ? 'border-primary' : 'border-transparent'
                                        }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info section */}
                    <div className="flex-1 p-6 md:p-8 overflow-y-auto flex flex-col">
                        <div className="flex-1">
                            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
                                {product.category}
                            </p>
                            <h2 className="text-2xl font-heading font-bold text-dark mb-3">
                                {product.name}
                            </h2>

                            {/* Rating */}
                            {product.averageRating > 0 && (
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="flex">
                                        {[1,2,3,4,5].map(s => (
                                            <svg key={s} width="14" height="14" viewBox="0 0 14 14" className={s <= Math.round(product.averageRating) ? 'text-amber-400' : 'text-gray-200'}>
                                                <path d="M7 1l1.5 4.5H14l-4 2.5 1.5 4.5L7 10l-4.5 2.5 1.5-4.5L0 5.5h5.5z" fill="currentColor" />
                                            </svg>
                                        ))}
                                    </div>
                                    <span className="text-xs text-light">({product.reviewCount || 0} reviews)</span>
                                </div>
                            )}

                            <p className="text-light text-sm leading-relaxed mb-6">
                                {product.shortDescription || product.fullDescription?.substring(0, 150) + '...'}
                            </p>

                            {/* Price */}
                            <div className="flex items-baseline gap-3 mb-6">
                                <span className="text-3xl font-bold text-dark">
                                    ₹{effectivePrice}
                                </span>
                                {product.salePrice && product.price > product.salePrice && (
                                    <span className="text-light line-through text-lg">₹{product.price}</span>
                                )}
                                {discount > 0 && (
                                    <span className="text-sm font-bold text-terracotta">Save ₹{product.price - product.salePrice}</span>
                                )}
                            </div>

                            {/* Stock info */}
                            {product.stock <= 5 && product.stock > 0 && (
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                                    <span className="text-xs font-semibold text-orange-600">
                                        Only {product.stock} left in stock!
                                    </span>
                                </div>
                            )}

                            {/* Quantity */}
                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-sm font-semibold text-dark">Qty:</span>
                                <div className="flex items-center gap-2 bg-gray-50 rounded-full p-1">
                                    <button
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-dark font-bold hover:bg-gray-100 transition-colors"
                                    >-</button>
                                    <span className="w-8 text-center font-bold text-dark">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(q => Math.min(product.stock || 10, q + 1))}
                                        className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-dark font-bold hover:bg-gray-100 transition-colors"
                                    >+</button>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-3">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className="w-full py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                                style={{
                                    background: added
                                        ? '#6B9B7D'
                                        : 'linear-gradient(135deg, #C4A882, #D4A574)',
                                    boxShadow: '0 8px 25px rgba(196,168,130,0.4)',
                                }}
                            >
                                {added ? '✓ Added to Cart!' : '🛍 Add to Cart'}
                            </motion.button>
                            <a
                                href={`/product/${product.slug || product._id}`}
                                className="block text-center text-sm font-semibold text-secondary hover:text-primary transition-colors py-2"
                            >
                                View Full Details →
                            </a>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
