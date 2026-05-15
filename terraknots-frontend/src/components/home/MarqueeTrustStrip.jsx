'use client';

import { motion } from 'framer-motion';

const trustItems = [
    '⭐ Handmade with Love',
    '🌿 Free Shipping ₹499+',
    '💛 Each Piece Unique',
    '✨ Eco-Friendly Materials',
    '🧶 500+ Happy Customers',
    '🎁 Custom Orders Welcome',
    '🖐️ No Machines — Only Hands',
    '📦 Dispatch in 3-5 Days',
];

// Duplicate for seamless loop
const allItems = [...trustItems, ...trustItems];

export default function MarqueeTrustStrip() {
    return (
        <div
            className="relative overflow-hidden border-y"
            style={{
                backgroundColor: '#C4A882',
                borderColor: 'rgba(139, 115, 85, 0.25)',
                height: '48px',
            }}
        >
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
                style={{ background: 'linear-gradient(to right, #C4A882, transparent)' }}
            />
            <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
                style={{ background: 'linear-gradient(to left, #C4A882, transparent)' }}
            />

            <div
                className="flex items-center h-full marquee-track"
                style={{ animation: 'marquee 35s linear infinite' }}
                onMouseEnter={(e) => e.currentTarget.style.animationPlayState = 'paused'}
                onMouseLeave={(e) => e.currentTarget.style.animationPlayState = 'running'}
            >
                {allItems.map((item, i) => (
                    <span
                        key={i}
                        className="flex items-center shrink-0 px-8 text-white font-semibold text-xs uppercase tracking-widest whitespace-nowrap"
                        style={{ letterSpacing: '0.15em' }}
                    >
                        {item}
                        <span className="mx-6 text-white/40">•</span>
                    </span>
                ))}
            </div>
        </div>
    );
}
