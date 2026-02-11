'use client';

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
    {
        name: 'Anjali Sharma',
        role: 'Crochet bow collector',
        text: 'The crochet bows are even more beautiful in person! The stitches are so neat and they arrived in the sweetest little box.',
        rating: 5,
    },
    {
        name: 'Rohan Gupta',
        role: 'Gifter of tiny things',
        text: 'The dot coasters and resin keychain were a birthday hit. They feel sturdy but still very handmade, not factory-perfect.',
        rating: 5,
    },
    {
        name: 'Priya Patel',
        role: 'Earring enthusiast',
        text: 'Incredibly lightweight clay earrings. I forget I am wearing them and always get asked where they are from.',
        rating: 5,
    },
];

const Testimonials = () => {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 p-24 text-primary/5">
                <Quote size={300} strokeWidth={1} />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-primary font-bold text-sm uppercase tracking-[0.3em]">Customer love notes</span>
                    <h2 className="text-4xl md:text-5xl font-heading font-bold text-dark mt-2">
                        Knots that found
                        <br />
                        their forever homes
                    </h2>
                </div>

                {/* Stacked cards layout for more drama on desktop */}
                <div className="relative hidden md:block h-[320px]">
                    {testimonials.map((t, idx) => (
                        <motion.div
                            key={t.name}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.2 }}
                            className={`absolute inset-y-0 w-full md:w-2/3 lg:w-1/2 mx-auto bg-background rounded-[2.8rem] shadow-xl p-10 flex flex-col justify-between ${
                                idx === 0 ? '-translate-x-16' : idx === 2 ? 'translate-x-16' : ''
                            }`}
                        >
                            <div className="flex text-yellow-500 mb-6">
                                {[...Array(t.rating)].map((_, i) => (
                                    <span key={i}>★</span>
                                ))}
                            </div>
                            <p className="text-dark/80 italic mb-6 leading-relaxed text-lg">
                                "{t.text}"
                            </p>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-heading font-bold text-dark">{t.name}</h4>
                                    <p className="text-xs text-primary uppercase tracking-widest font-bold">{t.role}</p>
                                </div>
                                <div className="text-primary/20">
                                    <Quote size={40} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Simple grid for mobile */}
                <div className="grid grid-cols-1 gap-8 md:hidden">
                    {testimonials.map((t, idx) => (
                        <motion.div
                            key={t.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.2 }}
                            className="bg-background p-8 rounded-[2.2rem] relative"
                        >
                            <div className="flex text-yellow-500 mb-4">
                                {[...Array(t.rating)].map((_, i) => (
                                    <span key={i}>★</span>
                                ))}
                            </div>
                            <p className="text-dark/80 italic mb-6 leading-relaxed">
                                "{t.text}"
                            </p>
                            <div>
                                <h4 className="font-heading font-bold text-dark">{t.name}</h4>
                                <p className="text-xs text-primary uppercase tracking-widest font-bold">{t.role}</p>
                            </div>
                            <div className="absolute top-8 right-8 text-primary/10">
                                <Quote size={32} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
