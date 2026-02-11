'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    ShoppingBag,
    Heart,
    Truck,
    ShieldCheck,
    RotateCcw,
    Minus,
    Plus
} from 'lucide-react';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { toast } from 'react-toastify';

const ProductInfo = ({ product }) => {
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    const discount = calculateDiscount(product.price, product.salePrice);
    const isFavorite = isInWishlist(product._id);

    const handleAddToCart = () => {
        addToCart(product, quantity);
        toast.success(`${product.name} added to cart!`);
    };

    const handleToggleWishlist = () => {
        if (isFavorite) {
            removeFromWishlist(product._id);
            toast.info(`Removed from wishlist`);
        } else {
            addToWishlist(product);
            toast.success(`Added to wishlist!`);
        }
    };

    return (
        <div className="space-y-8">
            {/* Title & Category */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-primary uppercase tracking-[0.2em]">
                        {product.category}
                    </span>
                    <div className="flex items-center text-yellow-500 text-sm">
                        <span className="mr-1">★</span>
                        <span className="text-dark font-bold">{product.averageRating || '5.0'}</span>
                        <span className="text-light ml-1 font-normal">({product.reviewCount || 0} Reviews)</span>
                    </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-dark">{product.name}</h1>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-dark">
                    {formatPrice(product.salePrice || product.price)}
                </span>
                {product.salePrice && product.salePrice < product.price && (
                    <>
                        <span className="text-xl text-light line-through decoration-primary">
                            {formatPrice(product.price)}
                        </span>
                        <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            {calculateDiscount(product.price, product.salePrice)}% OFF
                        </span>
                    </>
                )}
            </div>

            {/* Short Description */}
            <p className="text-light leading-relaxed">
                {product.shortDescription}
            </p>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                </span>
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-6">
                    <div className="flex items-center border border-gray-200 rounded-full px-4 py-2 space-x-6">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="p-1 hover:text-primary transition-colors"
                        >
                            <Minus size={18} />
                        </button>
                        <span className="font-bold text-lg min-w-[20px] text-center">{quantity}</span>
                        <button
                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                            className="p-1 hover:text-primary transition-colors"
                        >
                            <Plus size={18} />
                        </button>
                    </div>

                    <button
                        onClick={handleToggleWishlist}
                        className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border transition-all ${isFavorite ? 'bg-red-50 text-red-500 border-red-200' : 'border-gray-200 hover:border-primary hover:text-primary'
                            }`}
                    >
                        <Heart size={24} fill={isFavorite ? "currentColor" : "none"} />
                    </button>
                </div>

                <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className="w-full btn-primary bg-primary h-14 text-white text-lg flex items-center justify-center space-x-3 shadow-xl shadow-primary/20 hover:shadow-primary/40 disabled:opacity-50"
                >
                    <ShoppingBag size={22} />
                    <span>Add to Shopping Bag</span>
                </button>
            </div>

            {/* Materials & Meta */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-light block mb-1">Materials</span>
                        <span className="font-medium text-dark">{product.materials.join(', ')}</span>
                    </div>
                    <div>
                        <span className="text-light block mb-1">Dimensions</span>
                        <span className="font-medium text-dark">{product.dimensions || 'N/A'}</span>
                    </div>
                </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center p-4 rounded-2xl bg-background/50 space-y-2 text-center">
                    <Truck size={20} className="text-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Fast Delivery</span>
                </div>
                <div className="flex flex-col items-center p-4 rounded-2xl bg-background/50 space-y-2 text-center">
                    <ShieldCheck size={20} className="text-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Secure Payment</span>
                </div>
                <div className="flex flex-col items-center p-4 rounded-2xl bg-background/50 space-y-2 text-center">
                    <RotateCcw size={20} className="text-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Easy Returns</span>
                </div>
            </div>
        </div>
    );
};

export default ProductInfo;
