'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const floatingItemVariants = {
    float: (delay = 0) => ({
        y: [0, -10, 0],
        rotate: [-2, 2, -2],
        transition: {
            repeat: Infinity,
            duration: 6,
            ease: 'easeInOut',
            delay,
        },
    }),
};

const Hero = () => {
    return (
        <section className="relative min-h-[90vh] flex items-center pt-24 overflow-hidden bg-gradient-to-b from-background via-background to-white">
            {/* Abstract Background Shapes */}
            <div className="pointer-events-none absolute top-[-6rem] -left-24 w-[26rem] h-[26rem] bg-primary/12 rounded-[999px] blur-[110px]" />
            <div className="pointer-events-none absolute bottom-[-10rem] -right-20 w-[32rem] h-[32rem] bg-accent/10 rounded-[999px] blur-[120px]" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="space-y-8"
                    >
                        <div className="space-y-4">
                            <motion.span
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-[0.25em]"
                            >
                                <span className="inline-block h-2 w-2 rounded-full bg-primary animate-pulse" />
                                Made with patience, wrapped with love
                            </motion.span>
                            <h1 className="text-5xl md:text-7xl font-heading font-bold leading-[1.1] text-dark">
                                Handmade <span className="text-primary italic font-accent">loops & lumps</span>
                                <br />
                                for your everyday magic.
                            </h1>
                            <p className="text-lg text-light max-w-xl leading-relaxed">
                                From crochet charms to clay earrings and dot-painted coasters — every TerraKnots piece
                                is crafted slowly, thoughtfully, and completely by hand.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <Link href="/shop" className="btn-primary flex items-center group">
                                Shop collection
                                <motion.span
                                    className="ml-2 inline-block"
                                    animate={{ x: [0, 6, 0] }}
                                    transition={{ repeat: Infinity, duration: 1.6 }}
                                >
                                    →
                                </motion.span>
                            </Link>
                            <Link href="/custom-orders" className="btn-secondary">
                                Request a custom piece
                            </Link>
                        </div>

                        <div className="flex items-center space-x-8 pt-4">
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold text-dark">500+</span>
                                <span className="text-xs text-light uppercase tracking-wider">
                                    Tiny treasures knotted so far
                                </span>
                            </div>
                            <div className="w-px h-10 bg-gray-200" />
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold text-dark">Since 2022</span>
                                <span className="text-xs text-light uppercase tracking-wider">
                                    Small-batch, always handmade
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Visual Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.9, ease: 'easeOut' }}
                        className="relative"
                    >
                        {/* Main collage card */}
                        <div className="relative z-10 rounded-[2.2rem] overflow-hidden shadow-2xl bg-white p-4 rotate-2 md:rotate-3 hover:rotate-0 transition-transform duration-700">
                            <div className="aspect-[4/5] relative rounded-[1.8rem] overflow-hidden">
                                {/* Place a collage of your products at /public/hero/terra-hero-main.jpg */}
                                <Image
                                    src="/hero/terra-hero-main.jpg"
                                    alt="TerraKnots handmade accessories collage"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Floating product chips based on your Instagram posts */}
                        <motion.div
                            custom={0.2}
                            variants={floatingItemVariants}
                            animate="float"
                            className="hidden sm:flex items-center gap-3 absolute -top-6 -left-4 bg-white/90 backdrop-blur shadow-lg rounded-2xl px-4 py-3"
                        >
                            <div className="relative w-10 h-10 rounded-xl overflow-hidden">
                                {/* e.g. /public/hero/terra-coaster.jpg */}
                                <Image
                                    src="/hero/terra-coaster.jpg"
                                    alt="Hand-painted coaster"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="text-xs">
                                <p className="font-bold text-dark">Dot art coasters</p>
                                <p className="text-[10px] text-light uppercase tracking-wider">Best seller</p>
                            </div>
                        </motion.div>

                        <motion.div
                            custom={0.8}
                            variants={floatingItemVariants}
                            animate="float"
                            className="hidden sm:flex items-center gap-3 absolute bottom-4 -right-10 bg-white/90 backdrop-blur shadow-lg rounded-2xl px-4 py-3"
                        >
                            <div className="relative w-10 h-10 rounded-full overflow-hidden">
                                {/* e.g. /public/hero/terra-earrings.jpg */}
                                <Image
                                    src="/hero/terra-earrings.jpg"
                                    alt="Clay earrings"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="text-xs text-right">
                                <p className="font-bold text-dark">Clay earrings</p>
                                <p className="text-[10px] text-light uppercase tracking-wider">Light as a knot</p>
                            </div>
                        </motion.div>

                        {/* Glow blobs */}
                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
                            className="pointer-events-none absolute -top-12 -right-10 w-32 h-32 bg-terracotta/16 rounded-full blur-3xl z-0"
                        />
                        <motion.div
                            animate={{ y: [0, 18, 0] }}
                            transition={{ repeat: Infinity, duration: 5.5, ease: 'easeInOut' }}
                            className="pointer-events-none absolute -bottom-10 -left-10 w-40 h-40 bg-accent/16 rounded-full blur-3xl z-0"
                        />

                        {/* Badge overlay */}
                        <motion.div
                            initial={{ scale: 0, rotate: -15 }}
                            animate={{ scale: 1, rotate: 10 }}
                            transition={{ delay: 0.9, type: 'spring', stiffness: 260, damping: 18 }}
                            className="absolute -bottom-6 -right-6 bg-white p-4 rounded-full shadow-lg z-20 hidden md:block"
                        >
                            <div className="w-20 h-20 rounded-full bg-primary flex flex-col items-center justify-center text-white p-2">
                                <span className="text-[9px] uppercase font-bold tracking-tighter leading-none text-center">
                                    Tiny batch
                                </span>
                                <div className="w-6 h-px bg-white/30 my-1" />
                                <span className="text-xs font-accent">Handmade</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
