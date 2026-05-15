'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { ShoppingBag, Heart, User, Search, Menu, X, LogOut, Package, Settings } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import CartDrawer from '@/components/cart/CartDrawer';

const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'About', href: '/about' },
    { label: 'Custom Orders', href: '/custom-orders' },
    { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
    const pathname = usePathname();
    const { cartCount } = useCart();
    const { wishlistCount } = useWishlist();
    const { user, isAuthenticated, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [prevCartCount, setPrevCartCount] = useState(cartCount);
    const [cartBounce, setCartBounce] = useState(false);

    const { scrollY } = useScroll();
    useMotionValueEvent(scrollY, 'change', (latest) => {
        setScrolled(latest > 20);
    });

    // Cart bounce on item add
    useEffect(() => {
        if (cartCount > prevCartCount) {
            setCartBounce(true);
            setTimeout(() => setCartBounce(false), 600);
        }
        setPrevCartCount(cartCount);
    }, [cartCount]);

    const isActive = (href) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    return (
        <>
            <motion.header
                className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
                style={{
                    top: '36px', // Adjusted for announcement bar — but it might be dismissed
                    backgroundColor: scrolled ? 'rgba(251,249,247,0.95)' : 'transparent',
                    backdropFilter: scrolled ? 'blur(10px)' : 'none',
                    boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.06)' : 'none',
                }}
                animate={{ top: 0 }}
            >
                <div className="container">
                    <div className="flex items-center justify-between h-[72px]">

                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 shrink-0">
                            <motion.div
                                whileHover={{ scale: 1.05, rotate: 3 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                                className="relative w-10 h-10 rounded-xl overflow-hidden"
                            >
                                <Image
                                    src="/images/logo.png"
                                    alt="TerraKnots"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </motion.div>
                            <span className="font-heading font-bold text-xl text-dark hidden sm:block">
                                Terra<span className="text-primary">Knots</span>
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden lg:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`nav-link text-sm font-medium transition-colors ${
                                        isActive(link.href) ? 'text-primary' : 'text-dark hover:text-primary'
                                    }`}
                                >
                                    {link.label}
                                    {isActive(link.href) && (
                                        <motion.div
                                            layoutId="navUnderline"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                                        />
                                    )}
                                </Link>
                            ))}
                        </nav>

                        {/* Right Icons */}
                        <div className="flex items-center gap-1.5">
                            {/* Search */}
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="hidden md:flex w-9 h-9 rounded-full items-center justify-center text-dark hover:bg-primary/10 transition-colors"
                                title="Search"
                            >
                                <Link href="/shop">
                                    <Search size={19} />
                                </Link>
                            </motion.button>

                            {/* Wishlist */}
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Link
                                    href="/wishlist"
                                    className="hidden md:flex relative w-9 h-9 rounded-full items-center justify-center text-dark hover:bg-primary/10 transition-colors"
                                    title="Wishlist"
                                >
                                    <Heart size={19} />
                                    {wishlistCount > 0 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                                        >
                                            {wishlistCount}
                                        </motion.span>
                                    )}
                                </Link>
                            </motion.div>

                            {/* Cart */}
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                animate={cartBounce ? { y: [0, -6, 0], scale: [1, 1.15, 1] } : {}}
                                transition={{ duration: 0.4, type: 'spring' }}
                                onClick={() => setCartOpen(true)}
                                className="relative w-9 h-9 rounded-full flex items-center justify-center text-dark hover:bg-primary/10 transition-colors"
                                title="Cart"
                            >
                                <ShoppingBag size={19} />
                                {cartCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-terracotta text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                                    >
                                        {cartCount}
                                    </motion.span>
                                )}
                            </motion.button>

                            {/* User */}
                            <div className="hidden md:block relative">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex w-9 h-9 rounded-full items-center justify-center text-dark hover:bg-primary/10 transition-colors"
                                >
                                    <User size={19} />
                                </motion.button>

                                <AnimatePresence>
                                    {userMenuOpen && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                                            <motion.div
                                                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-card-hover z-20 overflow-hidden border border-gray-100"
                                            >
                                                {isAuthenticated ? (
                                                    <>
                                                        <div className="px-4 py-3 border-b border-gray-100">
                                                            <p className="text-xs font-bold text-dark">{user?.name}</p>
                                                            <p className="text-xs text-light truncate">{user?.email}</p>
                                                        </div>
                                                        <div className="py-1">
                                                            <Link href="/account" className="flex items-center gap-2 px-4 py-2.5 text-sm text-dark hover:bg-background transition-colors" onClick={() => setUserMenuOpen(false)}>
                                                                <User size={14} />
                                                                My Account
                                                            </Link>
                                                            <Link href="/account/orders" className="flex items-center gap-2 px-4 py-2.5 text-sm text-dark hover:bg-background transition-colors" onClick={() => setUserMenuOpen(false)}>
                                                                <Package size={14} />
                                                                My Orders
                                                            </Link>
                                                            {user?.role === 'admin' && (
                                                                <Link href="/admin" className="flex items-center gap-2 px-4 py-2.5 text-sm text-primary font-semibold hover:bg-background transition-colors" onClick={() => setUserMenuOpen(false)}>
                                                                    <Settings size={14} />
                                                                    Admin Panel
                                                                </Link>
                                                            )}
                                                            <button onClick={() => { logout(); setUserMenuOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-error hover:bg-error/5 transition-colors">
                                                                <LogOut size={14} />
                                                                Sign Out
                                                            </button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="p-3 space-y-2">
                                                        <Link href="/login" className="block btn-primary text-center text-sm py-2.5" onClick={() => setUserMenuOpen(false)}>
                                                            Log In
                                                        </Link>
                                                        <Link href="/register" className="block btn-secondary text-center text-sm py-2.5" onClick={() => setUserMenuOpen(false)}>
                                                            Create Account
                                                        </Link>
                                                    </div>
                                                )}
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Mobile hamburger */}
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setMobileOpen(true)}
                                className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center text-dark hover:bg-primary/10 transition-colors ml-1"
                            >
                                <Menu size={20} />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileOpen(false)}
                            className="fixed inset-0 z-50"
                            style={{ backgroundColor: 'rgba(44,44,44,0.5)', backdropFilter: 'blur(4px)' }}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                            className="fixed right-0 top-0 bottom-0 w-80 bg-white z-50 flex flex-col"
                            style={{ boxShadow: '-4px 0 30px rgba(0,0,0,0.1)' }}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="relative w-9 h-9">
                                        <Image src="/images/logo.png" alt="TerraKnots" fill className="object-contain" />
                                    </div>
                                    <span className="font-heading font-bold text-lg text-dark">TerraKnots</span>
                                </div>
                                <button onClick={() => setMobileOpen(false)} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Nav Links */}
                            <nav className="flex-1 p-6 space-y-1">
                                {navLinks.map((link, i) => (
                                    <motion.div
                                        key={link.href}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.07 }}
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={() => setMobileOpen(false)}
                                            className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                                                isActive(link.href)
                                                    ? 'bg-primary/10 text-primary'
                                                    : 'text-dark hover:bg-gray-50'
                                            }`}
                                        >
                                            {link.label}
                                            <span className="text-light text-xs">→</span>
                                        </Link>
                                    </motion.div>
                                ))}
                            </nav>

                            {/* Bottom actions */}
                            <div className="p-6 border-t border-gray-100 space-y-3">
                                {isAuthenticated ? (
                                    <>
                                        <Link href="/account" onClick={() => setMobileOpen(false)} className="btn-primary w-full text-center text-sm">
                                            My Account
                                        </Link>
                                        <button onClick={() => { logout(); setMobileOpen(false); }} className="btn-secondary w-full text-sm text-error border-error/30">
                                            Sign Out
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/login" onClick={() => setMobileOpen(false)} className="btn-primary block text-center text-sm">
                                            Log In
                                        </Link>
                                        <Link href="/register" onClick={() => setMobileOpen(false)} className="btn-secondary block text-center text-sm">
                                            Create Account
                                        </Link>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Cart Drawer */}
            <CartDrawer isOpen={cartOpen} toggleCart={() => setCartOpen(false)} />

            {/* Navbar spacer */}
            <div className="h-[72px]" />
        </>
    );
}
