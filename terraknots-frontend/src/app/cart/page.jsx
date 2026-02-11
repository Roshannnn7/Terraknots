'use client';

import Link from 'next/link';
import Image from 'next/image';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';

const CartPage = () => {
    const { cart, updateQuantity, removeFromCart, cartTotal, loading } = useCart();

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <>
            <AnnouncementBar />
            <Navbar />

            <main className="pt-32 pb-24 bg-background">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-xl mx-auto text-center mb-16 space-y-4">
                        <h1 className="text-4xl md:text-5xl font-heading font-bold text-dark">Your Shopping Bag</h1>
                        <p className="text-light italic font-accent text-xl">Almost ready to bring these beauties home</p>
                    </div>

                    {cart.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {/* Cart Items List */}
                            <div className="lg:col-span-2 space-y-6">
                                <AnimatePresence>
                                    {cart.map((item) => (
                                        <motion.div
                                            key={item.product._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -100 }}
                                            className="bg-white p-6 rounded-[2rem] shadow-sm flex flex-col md:flex-row items-center gap-6"
                                        >
                                            {/* Product Image */}
                                            <div className="relative w-32 h-40 flex-shrink-0 rounded-2xl overflow-hidden bg-background">
                                                <Image
                                                    src={item.product.images[0]}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>

                                            {/* Product Details */}
                                            <div className="flex-1 space-y-2 text-center md:text-left">
                                                <span className="text-[10px] uppercase font-bold text-primary tracking-widest">{item.product.category}</span>
                                                <h3 className="text-xl font-heading font-bold text-dark">{item.product.name}</h3>
                                                <p className="text-sm text-light font-medium italic">Handmade with love</p>
                                            </div>

                                            {/* Quantity Control */}
                                            <div className="flex items-center space-x-4 bg-background px-4 py-2 rounded-full">
                                                <button
                                                    onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                                                    className="p-1 hover:text-primary transition-colors"
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span className="font-bold w-6 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                                    className="p-1 hover:text-primary transition-colors"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>

                                            {/* Price & Remove */}
                                            <div className="w-full md:w-32 text-center md:text-right space-y-2">
                                                <p className="text-lg font-bold text-dark">
                                                    {formatPrice((item.product.salePrice || item.product.price) * item.quantity)}
                                                </p>
                                                <button
                                                    onClick={() => removeFromCart(item.product._id)}
                                                    className="text-red-400 hover:text-red-600 transition-colors inline-flex items-center space-x-1 text-xs font-bold uppercase"
                                                >
                                                    <Trash2 size={14} />
                                                    <span>Remove</span>
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                <Link href="/shop" className="inline-flex items-center text-primary font-bold hover:underline">
                                    <span className="mr-2">←</span> Continue Shopping
                                </Link>
                            </div>

                            {/* Order Summary */}
                            <aside className="lg:col-span-1">
                                <div className="bg-white p-8 rounded-[2.5rem] shadow-lg sticky top-32 space-y-8">
                                    <h3 className="text-2xl font-heading font-bold text-dark">Order Summary</h3>

                                    <div className="space-y-4 pb-6 border-b border-gray-100">
                                        <div className="flex justify-between text-light">
                                            <span>Subtotal</span>
                                            <span className="text-dark font-medium">{formatPrice(cartTotal)}</span>
                                        </div>
                                        <div className="flex justify-between text-light italic">
                                            <span>Shipping</span>
                                            <span className="text-accent font-bold">Calculated at checkout</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-lg font-bold">Estimated Total</span>
                                        <span className="text-2xl font-bold text-primary">{formatPrice(cartTotal)}</span>
                                    </div>

                                    <Link href="/checkout" className="btn-primary w-full h-14 flex items-center justify-center space-x-3 group">
                                        <span>Proceed to Checkout</span>
                                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </Link>

                                    <div className="pt-4 flex flex-col items-center space-y-3 opacity-60">
                                        <div className="flex -space-x-2">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center border-2 border-white"><span className="text-[10px] font-bold">UPI</span></div>
                                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center border-2 border-white"><span className="text-[10px] font-bold">COD</span></div>
                                            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center border-2 border-white"><span className="text-[10px] font-bold">Card</span></div>
                                        </div>
                                        <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-center">Secure Payment Guaranteed</p>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    ) : (
                        <div className="text-center py-24 bg-white rounded-[3rem] space-y-8 max-w-4xl mx-auto shadow-sm">
                            <div className="w-32 h-32 bg-background rounded-full flex items-center justify-center mx-auto text-light">
                                <ShoppingBag size={56} />
                            </div>
                            <div className="space-y-3">
                                <h2 className="text-3xl font-heading font-bold text-dark">Your bag is empty</h2>
                                <p className="text-light max-w-xs mx-auto text-lg leading-relaxed">It looks like you haven't added any handmade treasures to your bag yet.</p>
                            </div>
                            <Link href="/shop" className="btn-primary inline-flex items-center px-10">
                                Discover Our Collection
                            </Link>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </>
    );
};

export default CartPage;
