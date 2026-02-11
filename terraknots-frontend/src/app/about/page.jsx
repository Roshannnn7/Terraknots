'use client';

import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Heart, Sparkles, Smile, Coffee } from 'lucide-react';

const AboutPage = () => {
    return (
        <>
            <AnnouncementBar />
            <Navbar />

            <main className="pt-32 pb-24 bg-background overflow-hidden">
                <div className="container mx-auto px-4 md:px-6">

                    {/* Hero Section */}
                    <div className="max-w-4xl mx-auto text-center space-y-8 mb-24">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            <span className="text-primary font-bold text-sm uppercase tracking-[0.3em]">Our Story</span>
                            <h1 className="text-5xl md:text-7xl font-heading font-bold text-dark leading-tight">
                                Crafted with <span className="text-primary italic font-accent">Patience</span>, <br />
                                Shared with <span className="text-primary italic font-accent">Love</span>.
                            </h1>
                        </motion.div>
                    </div>

                    {/* Visual Story */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-32">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="aspect-[3/4] relative rounded-[3rem] overflow-hidden shadow-2xl z-10 rotate-2 hover:rotate-0 transition-transform duration-700">
                                <Image
                                    src="https://images.unsplash.com/photo-1590595603721-a3791be67614?q=80&w=1000&auto=format&fit=crop"
                                    alt="Artisan at work"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl z-0" />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <div className="space-y-4">
                                <h2 className="text-3xl md:text-4xl font-heading font-bold text-dark">How TerraKnots Began</h2>
                                <p className="text-lg text-light leading-relaxed">
                                    TerraKnots started as a small passion project in a sunlit corner of a home studio. What began with a single ball of yarn and a crochet hook soon evolved into a celebration of all things handmade.
                                </p>
                                <p className="text-lg text-light leading-relaxed">
                                    The name "TerraKnots" represents our connection to the earth (Terra) and the intricate hand-knotted techniques (Knots) that define our artisanal process. We believe that every object should tell a story—of the hands that made it and the time it took to create.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-8 pt-6">
                                <div className="space-y-2">
                                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary">
                                        <Heart size={24} />
                                    </div>
                                    <h4 className="font-heading font-bold text-dark">100% Manual</h4>
                                    <p className="text-xs text-light font-bold uppercase tracking-widest">No Mass Production</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary">
                                        <Sparkles size={24} />
                                    </div>
                                    <h4 className="font-heading font-bold text-dark">Eco Conscious</h4>
                                    <p className="text-xs text-light font-bold uppercase tracking-widest">Thoughtful Sourcing</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Philosophy Section */}
                    <div className="bg-dark text-white rounded-[4rem] p-12 md:p-24 relative overflow-hidden mb-32">
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />

                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-16">
                            <div className="space-y-4">
                                <div className="text-primary italic font-accent text-5xl mb-6">01</div>
                                <h3 className="text-2xl font-heading font-bold">The Slow Path</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    We don't race against the clock. Each piece is allowed the time it needs to be perfect, even if that means spending days on a single rose or hours on a resin gradient.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <div className="text-primary italic font-accent text-5xl mb-6">02</div>
                                <h3 className="text-2xl font-heading font-bold">Small Batch</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    By producing in small batches, we eliminate waste and ensure that every item leaving our studio has been personally inspected for highest quality.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <div className="text-primary italic font-accent text-5xl mb-6">03</div>
                                <h3 className="text-2xl font-heading font-bold">Human Touch</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    We embrace the tiny imperfections that make handmade goods beautiful. These are the marks of a real person crafting something real for you.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Values / Stats */}
                    <div className="flex flex-wrap justify-between gap-12 text-center border-b border-gray-100 pb-24">
                        {[
                            { label: 'Happy Customers', value: '500+', icon: Smile },
                            { label: 'Unique Products', value: '150+', icon: Sparkles },
                            { label: 'Coffee Consumed', value: 'Infinite', icon: Coffee },
                            { label: 'Active Artisans', value: '05+', icon: User }
                        ].map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex flex-col items-center space-y-4 flex-1 min-w-[150px]"
                            >
                                <div className="w-16 h-16 rounded-3xl bg-white shadow-md flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    <stat.icon size={28} />
                                </div>
                                <div>
                                    <div className="text-3xl font-heading font-bold text-dark">{stat.value}</div>
                                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-light mt-1">{stat.label}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Call to action */}
                    <div className="pt-24 text-center space-y-8">
                        <h2 className="text-4xl md:text-5xl font-heading font-bold text-dark">Be Part of Our Journey</h2>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/shop" className="btn-primary px-10">Visit Our Shop</Link>
                            <Link href="/contact" className="btn-secondary px-10">Get In Touch</Link>
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </>
    );
};

const User = ({ size, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
);

export default AboutPage;
