'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingBag,
    Heart,
    User,
    Menu,
    X,
    Search,
    LogOut,
    ChevronDown
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const pathname = usePathname();
    const { user, logout, isAuthenticated } = useAuth();
    const { cartCount } = useCart();
    const { wishlist } = useWishlist();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Shop', href: '/shop' },
        { name: 'Custom Orders', href: '/custom-orders' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ];

    return (
        <motion.nav
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-3' : 'bg-white/60 backdrop-blur-sm py-5'
                }`}
        >
            <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
                {/* Mobile Menu Button */}
                <button
                    className="lg:hidden text-dark"
                    onClick={() => setIsMobileMenuOpen(true)}
                >
                    <Menu size={24} />
                </button>

                {/* Logo */}
                <Link href="/" className="flex items-center space-x-3">
                    <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border border-primary/30 bg-background shadow-sm">
                        {/* Place your logo image at /public/brand/terraknots-logo.png */}
                        <Image
                            src="/brand/terraknots-logo.png"
                            alt="TerraKnots logo"
                            fill
                            sizes="48px"
                            className="object-cover"
                        />
                    </div>
                    <div className="flex flex-col leading-tight">
                        <span className="text-2xl md:text-3xl font-heading font-bold text-dark tracking-tighter">
                            Terra<span className="text-primary">Knots</span>
                        </span>
                        <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-light -mt-0.5 hidden md:block font-body">
                            Loops, lumps & lots of love
                        </span>
                    </div>
                </Link>

                {/* Desktop Nav Links */}
                <div className="hidden lg:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`text-sm font-medium tracking-wide transition-colors hover:text-primary ${pathname === link.href ? 'text-primary' : 'text-dark'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Action Icons */}
                <div className="flex items-center space-x-4 md:space-x-6">
                    <button className="text-dark hover:text-primary transition-colors hidden md:block">
                        <Search size={20} />
                    </button>

                    <Link href="/wishlist" className="text-dark hover:text-primary transition-colors relative">
                        <Heart size={20} />
                        {wishlist.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                                {wishlist.length}
                            </span>
                        )}
                    </Link>

                    <Link href="/cart" className="text-dark hover:text-primary transition-colors relative">
                        <ShoppingBag size={20} />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {isAuthenticated ? (
                        <div className="relative">
                            <button
                                className="flex items-center space-x-1 text-dark hover:text-primary transition-colors"
                                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                            >
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <ChevronDown size={14} className={`transition-transform duration-300 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isUserDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl py-2 border border-gray-50 flex flex-col overflow-hidden"
                                    >
                                        <Link href="/account" className="px-4 py-2 text-sm text-dark hover:bg-background transition-colors flex items-center">
                                            <User size={16} className="mr-2" /> My Profile
                                        </Link>
                                        <Link href="/account/orders" className="px-4 py-2 text-sm text-dark hover:bg-background transition-colors flex items-center">
                                            <ShoppingBag size={16} className="mr-2" /> My Orders
                                        </Link>
                                        {user.role === 'admin' && (
                                            <Link href="/admin" className="px-4 py-2 text-sm text-primary font-medium hover:bg-background transition-colors flex items-center border-t border-gray-50">
                                                Admin Dashboard
                                            </Link>
                                        )}
                                        <button
                                            onClick={logout}
                                            className="px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors flex items-center border-t border-gray-50 w-full text-left"
                                        >
                                            <LogOut size={16} className="mr-2" /> Logout
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <Link href="/login" className="text-dark hover:text-primary transition-colors">
                            <User size={20} />
                        </Link>
                    )}
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-[60] bg-white w-[80%] max-w-sm shadow-2xl lg:hidden flex flex-col"
                    >
                        <div className="p-6 flex items-center justify-between border-b">
                            <Link href="/" className="text-xl font-heading font-bold text-dark">
                                Terra<span className="text-primary">Knots</span>
                            </Link>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-1 rounded-full hover:bg-background transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto py-8 px-6 space-y-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`block text-lg font-medium tracking-wide ${pathname === link.href ? 'text-primary' : 'text-dark'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        <div className="p-6 border-t bg-background/50">
                            {isAuthenticated ? (
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-medium text-dark">{user.name}</p>
                                        <button onClick={logout} className="text-sm text-red-500 font-medium">Logout</button>
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    className="w-full btn-primary flex justify-center items-center"
                                >
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Blur background for mobile menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[55] lg:hidden"
                    />
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
