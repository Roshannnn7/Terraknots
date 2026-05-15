'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Heart, ShoppingBag, Truck, ShieldCheck, RotateCcw, Share2, Star } from 'lucide-react';
import { toast } from 'react-toastify';
import { formatPrice, calculateDiscount, getEffectivePrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export default function ProductInfo({ product }) {
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const { toggleWishlist, isWishlisted } = useWishlist();

    const isFavorite = isWishlisted(product._id);
    const effectivePrice = getEffectivePrice(product);
    const discount = calculateDiscount(product.price, product.salePrice);
    const isOutOfStock = product.stock <= 0;
    const isLowStock = product.stock > 0 && product.stock <= 5;

    const handleAddToCart = () => {
        if (isOutOfStock) return;
        addToCart(product, quantity);
        toast.success(
            <div className="flex flex-col gap-1">
                <span className="font-bold text-sm">Added to your bag! 🧶</span>
                <span className="text-xs">{product.name} (x{quantity})</span>
            </div>,
            { icon: false }
        );
    };

    const handleShare = async () => {
        try {
            await navigator.share({
                title: `${product.name} | TerraKnots`,
                text: 'Check out this handmade piece from TerraKnots!',
                url: window.location.href,
            });
        } catch {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied to clipboard!');
        }
    };

    return (
        <div className="space-y-8 flex flex-col h-full justify-center">
            {/* Header / Badges */}
            <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">
                        {product.category}
                    </span>
                    {product.isBestseller && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-amber-100 text-amber-700 border border-amber-200">
                            Bestseller 🔥
                        </span>
                    )}
                    {discount > 0 && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-red-100 text-red-700 border border-red-200">
                            Save {discount}%
                        </span>
                    )}
                </div>

                <h1 className="text-4xl md:text-5xl font-heading font-bold text-dark leading-[1.1] tracking-tight">
                    {product.name}
                </h1>

                {/* Reviews Summary */}
                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5">
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                    key={s}
                                    size={16}
                                    className={s <= Math.round(product.averageRating || 5) ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200'}
                                />
                            ))}
                        </div>
                        <span className="font-bold text-dark">{product.averageRating || '5.0'}</span>
                        <span className="text-light underline decoration-gray-300 underline-offset-4 cursor-pointer hover:text-dark">
                            ({product.reviewCount || 0} reviews)
                        </span>
                    </div>

                    <div className="w-1 h-1 rounded-full bg-gray-300" />

                    <button onClick={handleShare} className="flex items-center gap-1.5 text-light hover:text-dark transition-colors">
                        <Share2 size={14} />
                        Share
                    </button>
                </div>
            </div>

            {/* Price section */}
            <div className="pt-4 border-t border-gray-100">
                <div className="flex items-end gap-3">
                    <span className="text-4xl font-bold text-dark">
                        {formatPrice(effectivePrice)}
                    </span>
                    {product.salePrice && product.salePrice < product.price && (
                        <span className="text-xl text-light/70 line-through mb-1">
                            {formatPrice(product.price)}
                        </span>
                    )}
                </div>
                <p className="text-xs text-light mt-2 uppercase tracking-wide">
                    Inclusive of all taxes
                </p>
            </div>

            {/* Short Description */}
            <p className="text-light leading-relaxed text-lg">
                {product.shortDescription || product.description}
            </p>

            {/* Stock status */}
            <div>
                {!isOutOfStock ? (
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isLowStock ? 'bg-orange-400' : 'bg-green-400'}`}></span>
                            <span className={`relative inline-flex rounded-full h-3 w-3 ${isLowStock ? 'bg-orange-500' : 'bg-green-500'}`}></span>
                        </span>
                        <span className={`text-sm font-semibold ${isLowStock ? 'text-orange-600' : 'text-green-600'}`}>
                            {isLowStock ? `Only ${product.stock} pieces left! Hurry!` : 'In Stock & Ready to ship'}
                        </span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                        <span className="text-sm font-semibold text-red-600">
                            Out of Stock
                        </span>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-4">
                <div className="flex items-stretch gap-4 h-14">
                    {/* Quantity Selector */}
                    <div className="flex items-center bg-background rounded-2xl border border-gray-100 px-2 h-full">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            disabled={isOutOfStock}
                            className="w-10 h-10 flex items-center justify-center text-dark hover:text-primary transition-colors disabled:opacity-30 rounded-xl"
                        >
                            <Minus size={18} />
                        </button>
                        <span className="font-bold text-lg w-8 text-center">{quantity}</span>
                        <button
                            onClick={() => setQuantity(Math.min(product.stock || 1, quantity + 1))}
                            disabled={isOutOfStock || quantity >= product.stock}
                            className="w-10 h-10 flex items-center justify-center text-dark hover:text-primary transition-colors disabled:opacity-30 rounded-xl"
                        >
                            <Plus size={18} />
                        </button>
                    </div>

                    {/* Add to Cart */}
                    <button
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                        className="flex-1 btn-primary text-lg h-full flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                    >
                        <ShoppingBag size={20} className="group-hover:-translate-y-1 transition-transform" />
                        <span className="group-hover:-translate-y-1 transition-transform">{isOutOfStock ? 'Sold Out' : 'Add to Bag'}</span>
                        
                        {/* Shimmer effect */}
                        <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shimmer" />
                    </button>

                    {/* Wishlist */}
                    <button
                        onClick={() => toggleWishlist(product)}
                        className={`w-14 h-full rounded-2xl flex items-center justify-center border-2 transition-all ${
                            isFavorite 
                                ? 'bg-red-50 border-red-200 text-red-500 shadow-inner' 
                                : 'bg-white border-gray-100 text-gray-400 hover:border-primary hover:text-primary shadow-sm'
                        }`}
                        aria-label="Toggle wishlist"
                    >
                        <motion.div animate={isFavorite ? { scale: [1, 1.2, 1] } : {}}>
                            <Heart size={24} fill={isFavorite ? "currentColor" : "none"} />
                        </motion.div>
                    </button>
                </div>
                
                {/* Handmade explicitly declared */}
                <div className="flex items-center justify-center gap-2 py-3 bg-primary/5 rounded-2xl border border-primary/10">
                    <span className="font-accent italic text-primary text-xl">✂️</span>
                    <p className="text-sm font-semibold text-primary/80">Every piece is 100% handmade and unique.</p>
                </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-xs text-light uppercase tracking-widest font-bold mb-1">Material</p>
                    <p className="text-sm font-medium text-dark">{product.materials?.join(', ') || 'Premium Artisan Materials'}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-xs text-light uppercase tracking-widest font-bold mb-1">Dimensions</p>
                    <p className="text-sm font-medium text-dark">{product.dimensions || 'Standard Size'}</p>
                </div>
            </div>

            {/* Promises */}
            <div className="grid grid-cols-3 gap-3 border-t border-gray-100 pt-8">
                {[
                    { icon: Truck, title: 'Free Shipping', sub: 'Orders ₹499+' },
                    { icon: ShieldCheck, title: 'Secure Pay', sub: '100% Safe' },
                    { icon: RotateCcw, title: 'Easy Returns', sub: '7 Days Policy' }
                ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center text-center gap-2 group">
                        <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                            <item.icon size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-dark">{item.title}</p>
                            <p className="text-[10px] text-light uppercase">{item.sub}</p>
                        </div>
                    </div>
                ))}
            </div>
            
        </div>
    );
}
