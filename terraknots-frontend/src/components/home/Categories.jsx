'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

// Swap these for local crops from your own photos
const categories = [
    {
        name: 'Crochet',
        description: 'Bows, roses & soft accessories',
        image: '/categories/terra-crochet.jpg',
        color: 'from-[#F6E6D6] to-[#F3D9C0]',
        count: 24,
        tag: 'Loops & knots'
    },
    {
        name: 'Resin',
        description: 'Glossy coasters & dreamy keychains',
        image: '/categories/terra-resin.jpg',
        color: 'from-[#E1EFE3] to-[#CFE0D2]',
        count: 18,
        tag: 'Shiny things'
    },
    {
        name: 'Clay',
        description: 'Everyday-light statement earrings',
        image: '/categories/terra-clay.jpg',
        color: 'from-[#F8D7C4] to-[#F4C0A0]',
        count: 12,
        tag: 'Wearable art'
    }
];

const Categories = () => {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Yarn loops in the background */}
            <div className="pointer-events-none absolute -left-32 top-16 w-72 h-72 rounded-full border-[22px] border-primary/10" />
            <div className="pointer-events-none absolute -right-40 bottom-0 w-80 h-80 rounded-full border-[18px] border-accent/12" />

            <div className="container mx-auto px-4 relative">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-4 md:space-y-0">
                    <div className="space-y-2">
                        <span className="text-primary font-bold text-sm uppercase tracking-widest">Our little families</span>
                        <h2 className="text-4xl md:text-5xl font-heading font-bold text-dark">
                            Shop by knot, pour or sculpt
                        </h2>
                    </div>
                    <Link
                        href="/shop"
                        className="text-sm font-bold text-primary hover:text-secondary flex items-center group transition-colors"
                    >
                        Browse all pieces
                        <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.name}
                            initial={{ opacity: 0, y: 30, rotate: -2 }}
                            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15, type: 'spring', stiffness: 220, damping: 18 }}
                            className="group cursor-pointer"
                        >
                            <Link href={`/shop?category=${category.name}`}>
                                <div
                                    className={`relative aspect-[4/5] rounded-[2.3rem] overflow-hidden bg-gradient-to-br ${category.color} p-4 transition-transform duration-500 group-hover:-translate-y-3 group-hover:shadow-2xl`}
                                >
                                    <div className="relative w-full h-full rounded-[1.7rem] overflow-hidden">
                                        <Image
                                            src={category.image}
                                            alt={category.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                                        <div className="absolute top-5 left-5">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/80 text-[10px] font-bold uppercase tracking-[0.2em] text-dark">
                                                {category.tag}
                                            </span>
                                        </div>

                                        <div className="absolute bottom-6 left-6 right-6 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100">
                                            <span className="text-xs font-medium uppercase tracking-[0.2em] mb-1 block">
                                                {category.count}+ pieces
                                            </span>
                                            <p className="text-sm italic font-accent">{category.description}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 text-center">
                                    <h3 className="text-2xl font-heading font-bold text-dark group-hover:text-primary transition-colors">
                                        {category.name}
                                    </h3>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Categories;
