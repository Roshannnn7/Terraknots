'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Instagram,
    Send,
    MapPin,
    Phone,
    Mail,
    Heart
} from 'lucide-react';
import { toast } from 'react-toastify';
import api from '@/lib/api';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        try {
            const { data } = await api.post('/newsletter/subscribe', { email });
            toast.success(data.message);
            setEmail('');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error subscribing to newsletter');
        } finally {
            setLoading(false);
        }
    };

    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-dark text-white pt-16 pb-8 relative overflow-hidden">
            {/* Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Info */}
                    <div className="space-y-6">
                        <Link href="/" className="inline-block">
                            <span className="text-3xl font-heading font-bold tracking-tighter">
                                Terra<span className="text-primary">Knots</span>
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                            Handmade with heart, knot by knot. We bring you unique, artisan creations that add warmth and beauty to your everyday life.
                        </p>
                        <div className="flex items-center space-x-4">
                            <a
                                href="https://instagram.com/terra_knots"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-all duration-300 group"
                            >
                                <Instagram size={18} className="group-hover:scale-110 transition-transform" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-all duration-300 group"
                            >
                                <Send size={18} className="group-hover:scale-110 transition-transform" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-heading font-semibold mb-6 text-primary">Explore</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link href="/shop" className="hover:text-white transition-colors">Shop All</Link></li>
                            <li><Link href="/shop?category=Crochet" className="hover:text-white transition-colors">Crochet Collection</Link></li>
                            <li><Link href="/shop?category=Resin" className="hover:text-white transition-colors">Resin Accessories</Link></li>
                            <li><Link href="/shop?category=Clay" className="hover:text-white transition-colors">Clay Jewelry</Link></li>
                            <li><Link href="/custom-orders" className="hover:text-white transition-colors">Custom Requests</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-lg font-heading font-semibold mb-6 text-primary">Support</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link href="/about" className="hover:text-white transition-colors">Our Story</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                            <li><Link href="/shipping-policy" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
                            <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-lg font-heading font-semibold mb-6 text-primary">Stay Connected</h4>
                        <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                            Subscribe to our newsletter and get updates on new arrivals and special offers!
                        </p>
                        <form onSubmit={handleSubscribe} className="space-y-3">
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-full py-3 px-6 text-sm outline-none focus:border-primary transition-colors pr-12"
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="absolute right-1 top-1 bottom-1 bg-primary text-white rounded-full px-4 flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-50"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Contact Strip */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 border-t border-white/5 text-gray-400 text-sm">
                    <div className="flex items-center justify-center md:justify-start space-x-3">
                        <Mail size={16} className="text-primary" />
                        <span>hello@terraknots.com</span>
                    </div>
                    <div className="flex items-center justify-center space-x-3">
                        <Phone size={16} className="text-primary" />
                        <span>+91 XXXXXXXXXX</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-end space-x-3">
                        <MapPin size={16} className="text-primary" />
                        <span>Crafted in India 🇮🇳</span>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 mt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 space-y-4 md:space-y-0">
                    <p>© {currentYear} TerraKnots. All rights reserved.</p>
                    <p className="flex items-center">
                        Handmade with <Heart size={12} className="mx-1 text-red-500 fill-current" /> by TerraKnots Team
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
