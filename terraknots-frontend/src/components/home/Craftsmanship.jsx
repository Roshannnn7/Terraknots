'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const steps = [
    {
        label: 'Sketch & colour play',
        desc: 'Ideas start with messy doodles, colour swatches and a lot of “what if we…” moments.',
    },
    {
        label: 'Loop, pour or sculpt',
        desc: 'Yarn, resin or clay is shaped slowly by hand — no moulds, no shortcuts.',
    },
    {
        label: 'Bake, cure, finish',
        desc: 'Pieces are sanded, sealed and checked so edges are smooth and comfortable on skin.',
    },
    {
        label: 'Wrap & send love',
        desc: 'Every order is packed like a tiny gift, with handwritten notes whenever we can.',
    },
];

const Craftsmanship = () => {
    return (
        <section className="py-24 bg-dark text-white relative overflow-hidden">
            {/* Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, ease: 'easeOut' }}
                        className="relative"
                    >
                        <div className="aspect-square relative rounded-[3rem] overflow-hidden border-8 border-white/5">
                            {/* Swap this for a process collage from your workspace */}
                            <Image
                                src="/craft/terra-worktable.jpg"
                                alt="TerraKnots crafting table"
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Floating numbers */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4, type: 'spring', stiffness: 220, damping: 16 }}
                            className="absolute -bottom-10 -right-10 bg-primary text-dark p-8 rounded-3xl shadow-2xl hidden md:block"
                        >
                            <span className="text-5xl font-heading font-bold block">1-of-1</span>
                            <span className="text-xs uppercase tracking-widest font-bold">
                                Every batch is slightly different
                            </span>
                        </motion.div>
                    </motion.div>

                    <div className="space-y-10">
                        <div className="space-y-4">
                            <span className="text-primary font-bold text-sm uppercase tracking-[0.3em]">
                                Behind every knot
                            </span>
                            <h2 className="text-4xl md:text-5xl font-heading font-bold leading-tight">
                                Tiny studio. Big amount
                                <br />
                                of handwork.
                            </h2>
                            <p className="text-gray-400 text-lg leading-relaxed">
                                TerraKnots is a one-person (and sometimes cat-assisted) studio. That means your pieces
                                may take a little longer, but they carry the kind of detail factories cannot copy.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {steps.map((step, idx) => (
                                <motion.div
                                    key={step.label}
                                    initial={{ opacity: 0, x: 40 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.12 }}
                                    className="flex gap-4 items-start"
                                >
                                    <div className="relative">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/40 flex items-center justify-center">
                                            <span className="text-xs font-bold text-primary">{idx + 1}</span>
                                        </div>
                                        {idx < steps.length - 1 && (
                                            <div className="absolute left-1/2 top-8 -translate-x-1/2 w-px h-10 bg-primary/20" />
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="text-sm md:text-base font-heading font-bold mb-1">
                                            {step.label}
                                        </h4>
                                        <p className="text-xs md:text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Craftsmanship;
