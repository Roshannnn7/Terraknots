'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring, animate } from 'framer-motion';

const stats = [
    { value: 2000, suffix: '+', label: 'Happy Customers', icon: '💛', description: 'People who love our creations' },
    { value: 500, suffix: '+', label: 'Unique Products', icon: '🧶', description: 'Each one handcrafted with care' },
    { value: 4.9, suffix: '/5', label: 'Average Rating', icon: '⭐', description: 'Consistently loved reviews', decimals: 1 },
    { value: 100, suffix: '%', label: 'Handmade', icon: '🤍', description: 'Every single piece by hand' },
];

function CountUp({ value, suffix, decimals = 0 }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });
    const [displayed, setDisplayed] = useState(0);

    useEffect(() => {
        if (!inView) return;
        const duration = 1800;
        const start = performance.now();

        const update = (time) => {
            const elapsed = time - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplayed(parseFloat((eased * value).toFixed(decimals)));
            if (progress < 1) requestAnimationFrame(update);
        };

        requestAnimationFrame(update);
    }, [inView, value, decimals]);

    return (
        <span ref={ref}>
            {decimals > 0 ? displayed.toFixed(decimals) : Math.floor(displayed)}{suffix}
        </span>
    );
}

export default function StatsSection() {
    return (
        <section className="relative overflow-hidden py-20 md:py-28">
            {/* Background */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #3D2E22 0%, #5C4033 50%, #3D2E22 100%)' }} />

            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Ccircle cx='20' cy='20' r='1.5' fill='%23C4A882'/%3E%3C/svg%3E")`,
                    backgroundSize: '40px 40px',
                }}
            />

            {/* Ambient blobs */}
            <motion.div
                className="absolute -top-32 -left-32 w-96 h-96 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(196,168,130,0.15) 0%, transparent 70%)' }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(168,181,162,0.15) 0%, transparent 70%)' }}
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            />

            <div className="container relative z-10">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <span className="block text-sm font-bold uppercase tracking-[0.25em] mb-3"
                        style={{ color: '#C4A882' }}>
                        Our Journey
                    </span>
                    <h2 className="text-3xl md:text-5xl font-heading font-bold leading-tight"
                        style={{ color: '#F5F0EB' }}>
                        Built on Love &{' '}
                        <span style={{ color: '#C4A882' }} className="font-accent italic">Craft</span>
                    </h2>
                </motion.div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 40, scale: 0.9 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, margin: '-60px' }}
                            transition={{ delay: i * 0.12, duration: 0.7, ease: 'easeOut' }}
                            whileHover={{ y: -6, transition: { duration: 0.2 } }}
                            className="relative group text-center"
                        >
                            <div
                                className="relative p-6 md:p-8 rounded-3xl h-full flex flex-col items-center gap-4"
                                style={{
                                    background: 'rgba(255,255,255,0.06)',
                                    border: '1px solid rgba(196,168,130,0.2)',
                                    backdropFilter: 'blur(10px)',
                                }}
                            >
                                {/* Glow on hover */}
                                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                    style={{ background: 'radial-gradient(circle at center, rgba(196,168,130,0.08) 0%, transparent 70%)' }} />

                                {/* Icon */}
                                <motion.div
                                    className="text-4xl md:text-5xl"
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
                                >
                                    {stat.icon}
                                </motion.div>

                                {/* Number */}
                                <div className="text-4xl md:text-5xl font-heading font-black leading-none"
                                    style={{ color: '#C4A882' }}>
                                    <CountUp value={stat.value} suffix={stat.suffix} decimals={stat.decimals || 0} />
                                </div>

                                {/* Label */}
                                <div>
                                    <p className="font-bold text-base mb-1" style={{ color: '#F5F0EB' }}>
                                        {stat.label}
                                    </p>
                                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(245,240,235,0.5)' }}>
                                        {stat.description}
                                    </p>
                                </div>

                                {/* Bottom accent line */}
                                <div className="w-10 h-0.5 rounded-full transition-all duration-300 group-hover:w-16"
                                    style={{ background: 'linear-gradient(90deg, #C4A882, #D4A574)' }} />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom quote */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 0.7 }}
                    className="text-center mt-16"
                >
                    <p className="font-accent text-xl md:text-2xl italic" style={{ color: 'rgba(196,168,130,0.8)' }}>
                        "Every knot tells a story. Every piece carries a piece of us."
                    </p>
                    <p className="text-sm mt-2" style={{ color: 'rgba(245,240,235,0.4)' }}>
                        — The TerraKnots Makers
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
