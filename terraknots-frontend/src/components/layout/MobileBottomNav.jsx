'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ShoppingBag, Heart, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Shop', href: '/shop', icon: ShoppingBag },
    { name: 'Wishlist', href: '/wishlist', icon: Heart },
    { name: 'Account', href: '/account', icon: User },
];

export default function MobileBottomNav() {
    const pathname = usePathname();
    const { cartCount } = useCart();
    const { isAuthenticated } = useAuth();

    // Hide on admin pages
    if (pathname.startsWith('/admin')) return null;

    const getHref = (item) => {
        if (item.name === 'Account') return isAuthenticated ? '/account' : '/login';
        return item.href;
    };

    const isActive = (href) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100"
            style={{ boxShadow: '0 -2px 20px rgba(0,0,0,0.06)', paddingBottom: 'env(safe-area-inset-bottom, 0)' }}
        >
            <div className="flex justify-around items-center px-2 py-2">
                {navItems.map((item) => {
                    const href = getHref(item);
                    const active = isActive(item.href);
                    const showBadge = item.name === 'Shop' && cartCount > 0;

                    return (
                        <Link key={item.name} href={href}>
                            <motion.div
                                whileTap={{ scale: 0.85 }}
                                className="flex flex-col items-center gap-1 min-w-[56px] py-1 relative"
                            >
                                <div className={`relative p-2 rounded-2xl transition-all duration-300 ${
                                    active ? 'bg-primary/15' : 'hover:bg-gray-50'
                                }`}>
                                    <item.icon
                                        size={22}
                                        className={`transition-colors ${active ? 'text-primary' : 'text-gray-400'}`}
                                        strokeWidth={active ? 2.5 : 2}
                                    />
                                    {showBadge && (
                                        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-terracotta text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                                            {cartCount > 9 ? '9+' : cartCount}
                                        </span>
                                    )}
                                </div>
                                <span className={`text-[10px] font-semibold ${active ? 'text-primary' : 'text-gray-400'}`}>
                                    {item.name}
                                </span>
                                {active && (
                                    <motion.div
                                        layoutId="mobileNavIndicator"
                                        className="absolute -bottom-1 w-8 h-0.5 bg-primary rounded-full"
                                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                    />
                                )}
                            </motion.div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
