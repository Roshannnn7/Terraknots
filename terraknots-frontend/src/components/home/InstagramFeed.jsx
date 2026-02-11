'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Instagram } from 'lucide-react';

// Replace these file paths with crops from your real Instagram posts
const igImages = [
    '/instagram/terra-coasters-1.jpg',
    '/instagram/terra-earrings-1.jpg',
    '/instagram/terra-keychains-1.jpg',
    '/instagram/terra-bag-charms-1.jpg',
    '/instagram/terra-hair-accessory-1.jpg',
    '/instagram/terra-wallet-1.jpg',
];

const InstagramFeed = () => {
    return (
        <section className="py-24 bg-background overflow-hidden">
            <div className="container mx-auto px-4 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-dark">From the TerraKnots grid</h2>
                    <p className="text-light mt-2 italic font-accent text-lg">
                        A peek at loops, lumps & works-in-progress
                    </p>
                </div>
                <a
                    href="https://instagram.com/terra_knots"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary flex items-center space-x-2 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] border-0"
                >
                    <Instagram size={20} />
                    <span>@terra_knots</span>
                </a>
            </div>

            <div className="flex space-x-4 animate-scroll-left">
                {[...igImages, ...igImages].map((img, idx) => (
                    <motion.div
                        key={idx}
                        whileHover={{ scale: 0.96, rotate: -1 }}
                        className="flex-shrink-0 relative w-64 h-64 rounded-3xl overflow-hidden group shadow-xl"
                    >
                        <Image
                            src={img}
                            alt={`TerraKnots Instagram post ${idx + 1}`}
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between px-4 pb-3">
                            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">
                                TerraKnots
                            </div>
                            <Instagram size={24} className="text-white" />
                        </div>
                    </motion.div>
                ))}
            </div>

            <style jsx>{`
                @keyframes scroll-left {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-50%); }
                }
                .animate-scroll-left {
                  display: flex;
                  width: fit-content;
                  animation: scroll-left 40s linear infinite;
                }
                .animate-scroll-left:hover {
                  animation-play-state: paused;
                }
            `}</style>
        </section>
    );
};

export default InstagramFeed;
