'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    const discount = calculateDiscount(product.price, product.salePrice);
    const isFavorite = isInWishlist(product._id);

    const handleAddToCart = (e) => {
        e.preventDefault();
        addToCart(product);
        toast.success(`${product.name} added to cart!`);
    };

    const handleToggleWishlist = (e) => {
        e.preventDefault();
        if (isFavorite) {
            removeFromWishlist(product._id);
            toast.info(`Removed ${product.name} from wishlist`);
        } else {
            addToWishlist(product);
            toast.success(`Added ${product.name} to wishlist!`);
        }
    };

    return (
        <motion.div
            whileHover={{ y: -10, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className="card group overflow-hidden relative"
        >
            <Link href={`/product/${product.slug}`}>
                <div className="relative aspect-[4/5] bg-background">
                    <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {discount > 0 && (
                            <span className="bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                {discount}% OFF
                            </span>
                        )}
                        {product.stock <= 0 && (
                            <span className="bg-dark text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                Out of Stock
                            </span>
                        )}
                    </div>

                    {/* Quick Actions Overlay */}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[1px]">
                        <button
                            onClick={handleToggleWishlist}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 transform translate-y-8 group-hover:translate-y-0 ${isFavorite ? 'bg-red-500 text-white' : 'bg-white text-dark hover:bg-primary hover:text-white'
                                }`}
                        >
                            <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
                        </button>
                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock <= 0}
                            className="w-10 h-10 bg-white text-dark rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 transform translate-y-8 group-hover:translate-y-0 delay-75 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ShoppingCart size={18} />
                        </button>
                        <div className="w-10 h-10 bg-white text-dark rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 transform translate-y-8 group-hover:translate-y-0 delay-150">
                            <Eye size={18} />
                        </div>
                    </div>
                </div>

                <div className="p-5 space-y-2">
                    <div className="flex justify-between items-start">
                        <span className="text-[10px] uppercase font-bold text-light tracking-widest">{product.category}</span>
                        <div className="flex items-center text-yellow-500 text-xs">
                            <span className="mr-1">★</span>
                            <span className="text-dark font-medium">{product.averageRating || '5.0'}</span>
                        </div>
                    </div>

                    <h3 className="text-lg font-heading font-bold text-dark group-hover:text-primary transition-colors truncate">
                        {product.name}
                    </h3>

                    <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-dark">
                            {formatPrice(product.salePrice || product.price)}
                        </span>
                        {product.salePrice && product.salePrice < product.price && (
                            <span className="text-sm text-light line-through decoration-primary decoration-1">
                                {formatPrice(product.price)}
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default ProductCard;
