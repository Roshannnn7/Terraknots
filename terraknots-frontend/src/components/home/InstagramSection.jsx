'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// Unique seeds for each Instagram post placeholder
const posts = [
    { seed: 'insta-post-01', span: 'col-span-2 row-span-2' },
    { seed: 'insta-post-02', span: '' },
    { seed: 'insta-post-03', span: '' },
    { seed: 'insta-post-04', span: '' },
    { seed: 'insta-post-05', span: '' },
    { seed: 'insta-post-06', span: '' },
];

function InstagramPost({ post, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, duration: 0.5 }}
            className={`relative overflow-hidden rounded-2xl group cursor-pointer ${post.span}`}
            style={{ aspectRatio: post.span ? '1' : '1' }}
        >
            <Image
                src={`https://picsum.photos/seed/${post.seed}/400/400`}
                alt={`TerraKnots Instagram post ${index + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* Hover overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center"
                style={{ background: 'rgba(196,168,130,0.85)' }}
            >
                {/* Instagram icon */}
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    whileHover={{ scale: 1 }}
                    className="text-white text-center"
                >
                    <svg viewBox="0 0 24 24" className="w-10 h-10 mx-auto mb-2 fill-white">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                    <p className="text-sm font-bold">View Post</p>
                </motion.div>
            </div>
        </motion.div>
    );
}

export default function InstagramSection() {
    return (
        <section className="section bg-background">
            <div className="container">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-12"
                >
                    <span className="section-label">Community</span>
                    <h2 className="font-accent italic text-4xl md:text-5xl text-dark">
                        Join Our Community
                        <span className="text-primary block mt-1">@terra_knots</span>
                    </h2>
                    <p className="text-light mt-3 text-base">
                        Follow along for behind-the-scenes crafting, new drops, and handmade love.
                    </p>
                </motion.div>

                {/* Asymmetric grid */}
                <div className="grid grid-cols-3 gap-3 md:gap-4 max-w-4xl mx-auto"
                    style={{ gridTemplateRows: 'auto auto' }}
                >
                    {posts.map((post, i) => (
                        <InstagramPost key={post.seed} post={post} index={i} />
                    ))}
                </div>

                {/* Follow link */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center mt-10"
                >
                    <a
                        href="https://instagram.com/terra_knots"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 btn-primary px-8 py-3.5 text-sm"
                    >
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                        </svg>
                        Follow us on Instagram
                        <ArrowRight size={16} />
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
