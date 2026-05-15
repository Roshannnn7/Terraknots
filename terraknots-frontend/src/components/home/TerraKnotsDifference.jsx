'use client';

import { motion } from 'framer-motion';

const differences = [
    {
        icon: '🧶',
        gradient: 'linear-gradient(135deg, #C4A882, #D4A574)',
        title: 'Crafted by Hand',
        text: 'No machines. Every stitch, pour, and mold is done with our own hands — slowly, carefully, with full attention.',
    },
    {
        icon: '🌿',
        gradient: 'linear-gradient(135deg, #A8B5A2, #8A9A7B)',
        title: 'Eco-Conscious',
        text: 'We choose sustainable, thoughtfully sourced materials and minimize waste in every creation.',
    },
    {
        icon: '💛',
        gradient: 'linear-gradient(135deg, #D4A574, #C9B09B)',
        title: 'Made with Love',
        text: 'Each piece carries hours of patience, creativity, and genuine care. You can feel the difference.',
    },
    {
        icon: '✨',
        gradient: 'linear-gradient(135deg, #C4A882, #A8B5A2)',
        title: 'One of a Kind',
        text: 'Minor variations aren\'t flaws — they\'re proof it was made just for you. Imperfectly perfect.',
    },
];

export default function TerraKnotsDifference() {
    return (
        <section className="section relative overflow-hidden bg-background">
            {/* Decorative blobs */}
            <div className="absolute -left-24 top-1/2 -translate-y-1/2 w-80 h-80 blob-1 pointer-events-none opacity-30"
                style={{ background: 'rgba(168,181,162,0.2)' }}
            />
            <div className="absolute -right-20 bottom-0 w-72 h-72 blob-3 pointer-events-none opacity-25"
                style={{ background: 'rgba(212,165,116,0.2)' }}
            />

            <div className="container relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="section-header"
                >
                    <span className="section-label">Why Handmade</span>
                    <h2 className="section-title">
                        The TerraKnots <span className="font-accent italic text-primary">Difference</span>
                    </h2>
                    <p className="section-subtitle mt-4 max-w-lg mx-auto">
                        "Not mass-produced. Mass-loved." — Here's why choosing handmade matters.
                    </p>
                </motion.div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                    {differences.map((item, i) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 40, scale: 0.95 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, margin: '-60px' }}
                            transition={{ delay: i * 0.1, duration: 0.6, ease: 'easeOut' }}
                            whileHover={{ y: -8 }}
                        >
                            <div className="glass-card p-8 h-full flex flex-col gap-5 group">
                                {/* Icon circle */}
                                <motion.div
                                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                                    style={{ background: item.gradient }}
                                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    {item.icon}
                                </motion.div>

                                {/* Content */}
                                <div className="flex-1">
                                    <h3 className="font-heading text-xl font-bold text-dark mb-3">{item.title}</h3>
                                    <p className="text-light text-sm leading-relaxed">{item.text}</p>
                                </div>

                                {/* Stitch border bottom decoration */}
                                <div className="w-12 h-0.5 rounded-full transition-all duration-300 group-hover:w-16"
                                    style={{ background: item.gradient }}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
