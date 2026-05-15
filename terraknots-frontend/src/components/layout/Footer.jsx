'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Instagram, Mail, Phone, Heart } from 'lucide-react';

const footerLinks = {
    shop: [
        { label: 'All Products', href: '/shop' },
        { label: 'Crochet', href: '/shop?category=crochet' },
        { label: 'Resin Art', href: '/shop?category=resin' },
        { label: 'Clay', href: '/shop?category=clay' },
        { label: 'Decor', href: '/shop?category=decor' },
        { label: 'New Arrivals', href: '/shop?sort=newest' },
        { label: 'Bestsellers', href: '/shop?featured=true' },
    ],
    help: [
        { label: 'Contact Us', href: '/contact' },
        { label: 'FAQ', href: '/faq' },
        { label: 'Track Order', href: '/track-order' },
        { label: 'Shipping Policy', href: '/shipping-policy' },
        { label: 'Return Policy', href: '/return-policy' },
        { label: 'Custom Orders', href: '/custom-orders' },
    ],
    connect: [
        { label: 'About Us', href: '/about' },
        { label: 'Privacy Policy', href: '/privacy-policy' },
        { label: 'Terms & Conditions', href: '/terms' },
    ],
};

const containerVariants = {
    initial: {},
    animate: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const colVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Footer() {
    return (
        <footer className="relative overflow-hidden" style={{ backgroundColor: '#2C1A10' }}>
            {/* Workspace texture overlay — using CSS noise instead of workspace image */}
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Ccircle cx='1' cy='1' r='1' fill='%23C4A882'/%3E%3C/svg%3E")`,
                    backgroundSize: '20px 20px',
                }}
            />

            {/* Warm gradient blobs */}
            <div className="absolute top-0 left-0 w-80 h-80 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(196,168,130,0.08) 0%, transparent 70%)' }}
            />
            <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(212,165,116,0.06) 0%, transparent 70%)' }}
            />

            {/* Handmade Promise Banner */}
            <div className="border-b border-white/5 py-8">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="text-center space-y-2"
                    >
                        <p className="font-accent italic text-3xl md:text-4xl text-primary">
                            "Handmade with heart, knot by knot."
                        </p>
                        <p className="text-white/40 text-sm tracking-[0.2em] uppercase font-semibold">
                            Our Promise to You
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Main footer content */}
            <motion.div
                variants={containerVariants}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, margin: '-100px' }}
                className="container py-16"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                    {/* Column 1 — Brand */}
                    <motion.div variants={colVariants} className="lg:col-span-1 space-y-6">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-xl overflow-hidden"
                                style={{ filter: 'brightness(1.2) sepia(0.2)' }}
                            >
                                <Image src="/images/logo.png" alt="TerraKnots" fill className="object-contain" />
                            </div>
                            <span className="font-heading font-bold text-xl text-white">
                                Terra<span style={{ color: '#C4A882' }}>Knots</span>
                            </span>
                        </Link>

                        {/* Tagline */}
                        <p className="font-accent italic text-xl" style={{ color: '#C4A882' }}>
                            Crafted slow, loved forever.
                        </p>

                        <p className="text-white/50 text-sm leading-relaxed">
                            A small Indian handmade brand. Every piece is unique, created with patience, love, and dedication.
                        </p>

                        {/* Social Icons */}
                        <div className="flex items-center gap-3">
                            {[
                                {
                                    href: 'https://instagram.com/terra_knots',
                                    icon: <Instagram size={16} />,
                                    label: 'Instagram',
                                },
                                {
                                    href: 'https://wa.me/919035999354',
                                    icon: (
                                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                        </svg>
                                    ),
                                    label: 'WhatsApp',
                                },
                                { href: 'mailto:hello@terraknots.com', icon: <Mail size={16} />, label: 'Email' },
                            ].map((social) => (
                                <motion.a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.15, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-white/60 transition-all duration-300"
                                    style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
                                    aria-label={social.label}
                                >
                                    {social.icon}
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Column 2 — Shop */}
                    <motion.div variants={colVariants} className="space-y-5">
                        <h4 className="text-xs font-bold uppercase tracking-[0.2em] pb-3 border-b border-white/10"
                            style={{ color: '#C4A882' }}>
                            Shop
                        </h4>
                        <ul className="space-y-3">
                            {footerLinks.shop.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-white/50 hover:text-white transition-colors duration-200 flex items-center gap-1 group"
                                    >
                                        <span className="group-hover:translate-x-1 transition-transform duration-200">
                                            {link.label}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Column 3 — Help */}
                    <motion.div variants={colVariants} className="space-y-5">
                        <h4 className="text-xs font-bold uppercase tracking-[0.2em] pb-3 border-b border-white/10"
                            style={{ color: '#C4A882' }}>
                            Help
                        </h4>
                        <ul className="space-y-3">
                            {footerLinks.help.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-white/50 hover:text-white transition-colors duration-200 group flex items-center"
                                    >
                                        <span className="group-hover:translate-x-1 transition-transform duration-200">
                                            {link.label}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Column 4 — Connect */}
                    <motion.div variants={colVariants} className="space-y-5">
                        <h4 className="text-xs font-bold uppercase tracking-[0.2em] pb-3 border-b border-white/10"
                            style={{ color: '#C4A882' }}>
                            Connect
                        </h4>
                        <ul className="space-y-3 mb-6">
                            {footerLinks.connect.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-sm text-white/50 hover:text-white transition-colors group flex items-center">
                                        <span className="group-hover:translate-x-1 transition-transform duration-200">{link.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Made in India */}
                        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
                            style={{ backgroundColor: 'rgba(196,168,130,0.1)', color: 'rgba(255,255,255,0.7)' }}
                        >
                            🇮🇳 Made in India
                        </div>

                        {/* Mini newsletter */}
                        <div className="pt-2">
                            <p className="text-white/40 text-xs mb-2 uppercase tracking-wider font-semibold">Quick Subscribe</p>
                            <Link href="#newsletter"
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-dark transition-all hover:opacity-90"
                                style={{ backgroundColor: '#C4A882' }}
                            >
                                <Mail size={14} />
                                Get early access 💌
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Bottom bar */}
            <div className="border-t py-6" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-white/35 text-xs">
                        © {new Date().getFullYear()} TerraKnots. All rights reserved.
                    </p>
                    <p className="text-white/35 text-xs flex items-center gap-1">
                        Made with <Heart size={11} className="fill-primary text-primary mx-0.5" /> and lots of yarn
                    </p>
                    {/* Payment icons */}
                    <div className="flex items-center gap-2 opacity-30">
                        {['Visa', 'UPI', 'RuPay', 'GPay'].map((p) => (
                            <span key={p} className="text-white text-[10px] font-bold px-2 py-0.5 border border-white/20 rounded">
                                {p}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
