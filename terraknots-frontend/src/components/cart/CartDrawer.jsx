'use client';

import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, X, Minus, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

const AnimatedNumber = ({ value }) => {
    const spring = useSpring(value, { mass: 0.8, stiffness: 75, damping: 15 });
    const display = useTransform(spring, (current) => Math.round(current).toLocaleString());

    useEffect(() => {
        spring.set(value);
    }, [spring, value]);

    return <motion.span>{display}</motion.span>;
};

export default function CartDrawer({ isOpen, toggleCart }) {
  const { cart, getCartTotal, updateQuantity, removeFromCart } = useCart();
  const totalPrice = getCartTotal();
  const FREE_SHIPPING_THRESHOLD = 499;
  const progress = Math.min((totalPrice / FREE_SHIPPING_THRESHOLD) * 100, 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={toggleCart} 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" 
          />
          <motion.div 
            initial={{ x: '100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '100%' }} 
            transition={{ type: 'spring', damping: 25 }} 
            className="fixed right-0 top-0 h-full w-full max-w-md bg-cream z-[60] p-8 shadow-2xl flex flex-col"
          >
            <div className="flex justify-between items-center mb-6">
               <h2 className="font-heading text-3xl text-dark">Your Treasure Bag</h2>
               <button onClick={toggleCart} className="p-2 hover:bg-white rounded-full transition-colors">
                  <X size={24} className="text-dark" />
               </button>
            </div>
            
            {/* Free Shipping Progress */}
            <div className="mb-8">
              <p className="text-sm text-secondary mb-2 font-bold">
                {totalPrice >= FREE_SHIPPING_THRESHOLD 
                  ? "✨ You've unlocked FREE Shipping!" 
                  : `Spend ₹${FREE_SHIPPING_THRESHOLD - totalPrice} more for FREE shipping`}
              </p>
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <motion.div 
                   initial={{ width: 0 }} 
                   animate={{ width: `${progress}%` }} 
                   transition={{ duration: 0.5 }}
                   className="h-full bg-accent" 
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar">
              <AnimatePresence>
                {cart.length > 0 ? cart.map((item) => (
                  <motion.div 
                    key={item.product?._id || item._id} 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ duration: 0.3 }}
                    className="flex gap-4 bg-white p-4 rounded-2xl shadow-sm relative group"
                  >
                     <img src={item.product?.images?.[0] || '/images/logo.png'} alt={item.product?.name} className="w-20 h-20 rounded-xl object-cover" />
                     <div className="flex-1">
                        <h4 className="font-heading text-lg text-dark line-clamp-1 pr-6">{item.product?.name}</h4>
                        <div className="flex items-center gap-3 mt-2 bg-background w-fit rounded-lg border border-gray-200 px-2 py-1">
                            <button onClick={() => updateQuantity(item.product?._id || item._id, Math.max(1, item.quantity - 1))} className="p-1 hover:text-primary transition-colors">
                                <Minus size={14} />
                            </button>
                            <span className="text-sm font-bold w-4 text-center">
                                <AnimatePresence mode="popLayout">
                                    <motion.span
                                        key={item.quantity}
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 20 }}
                                        className="inline-block"
                                    >
                                        {item.quantity}
                                    </motion.span>
                                </AnimatePresence>
                            </span>
                            <button onClick={() => updateQuantity(item.product?._id || item._id, item.quantity + 1)} className="p-1 hover:text-primary transition-colors">
                                <Plus size={14} />
                            </button>
                        </div>
                        <p className="font-bold text-terracotta mt-2">₹{item.product?.salePrice || item.product?.price}</p>
                     </div>
                     <button 
                        onClick={() => removeFromCart(item.product?._id || item._id)} 
                        className="absolute right-4 top-4 text-gray-400 hover:text-red-500 transition-colors"
                     >
                        <Trash2 size={18} />
                     </button>
                  </motion.div>
                )) : (
                   <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="h-full flex flex-col items-center justify-center opacity-70 space-y-4"
                   >
                      <div className="text-6xl mb-4">🛒</div>
                      <p className="font-bold text-lg">Your cart is feeling lonely.</p>
                      <p className="text-sm">Let's add some handmade goodness!</p>
                      <button onClick={toggleCart} className="mt-4 btn border border-gray-300 bg-white">Browse Products</button>
                   </motion.div>
                )}
              </AnimatePresence>
            </div>

            {cart.length > 0 && (
              <div className="mt-auto pt-8 border-t border-gray-200">
                <div className="flex justify-between text-xl font-heading mb-4 text-dark font-bold">
                  <span>Total:</span>
                  <span>₹<AnimatedNumber value={totalPrice} /></span>
                </div>
                <Link href="/checkout" onClick={toggleCart} className="block w-full text-center py-4 bg-terracotta text-white rounded-full font-bold hover:shadow-lg transition-all hover:scale-[1.02] active:scale-95">
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
