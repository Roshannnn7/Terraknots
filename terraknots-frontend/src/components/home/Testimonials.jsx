'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
    {
        id: 1,
        name: 'Priya Sharma',
        location: 'Mumbai',
        rating: 5,
        product: 'Crochet Bow Keychain',
        text: "I absolutely adore my crochet bow keychain! It's so beautifully made — the attention to detail is incredible. You can truly feel the love that went into making it. Will definitely order again!",
        avatar: 'P',
        avatarColor: '#C4A882',
    },
    {
        id: 2,
        name: 'Arjun Mehta',
        location: 'Bangalore',
        rating: 5,
        product: 'Resin Butterfly Keychain',
        text: "Gifted this to my sister and she was completely blown away. The resin butterfly is so vivid and unique — nothing like you'll find in any store. TerraKnots makes magic.",
        avatar: 'A',
        avatarColor: '#A8B5A2',
    },
    {
        id: 3,
        name: 'Sneha Kapoor',
        location: 'Delhi',
        rating: 5,
        product: 'Ocean Wave Resin Keychain',
        text: "The packaging itself felt like receiving a gift! And the keychain is even more beautiful in person. The craftsmanship is stunning. Worth every rupee and then some.",
        avatar: 'S',
        avatarColor: '#D4A574',
    },
    {
        id: 4,
        name: 'Riya Choudhary',
        location: 'Pune',
        rating: 5,
        product: 'Clay Stud Earrings',
        text: "These earrings are so light and the design is just gorgeous. I've gotten so many compliments! Love that each piece is handmade — it makes them feel so personal and special.",
        avatar: 'R',
        avatarColor: '#C9B09B',
    },
    {
        id: 5,
        name: 'Anjali Patel',
        location: 'Ahmedabad',
        rating: 5,
        product: 'Crochet Flower Bouquet',
        text: "Ordered this for my best friend's birthday and she was in tears of joy! The flowers look SO real and lifelike. Best handmade gift I have ever given. Thank you TerraKnots!",
        avatar: 'A',
        avatarColor: '#8A9A7B',
    },
];

function StarRating({ rating }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <motion.svg
                    key={star}
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: star * 0.05, type: 'spring', stiffness: 300 }}
                    className="w-4 h-4"
                    viewBox="0 0 20 20"
                    fill={star <= rating ? '#D4A574' : '#E5E5E5'}
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </motion.svg>
            ))}
        </div>
    );
}

function TestimonialCard({ testimonial, isCenter }) {
    return (
        <motion.div
            layout
            className={`relative rounded-3xl p-8 transition-all duration-500 ${
                isCenter
                    ? 'bg-white scale-100'
                    : 'bg-white/60 scale-95 opacity-70'
            }`}
            style={{
                boxShadow: isCenter
                    ? '0 12px 40px rgba(139,115,85,0.15), 0 0 0 1px rgba(196,168,130,0.1)'
                    : '0 4px 15px rgba(139,115,85,0.06)',
                transform: `rotate(${isCenter ? 0 : (Math.random() > 0.5 ? 1 : -1)}deg)`,
            }}
        >
            {/* Quote icon */}
            <div className="absolute top-6 right-6 opacity-10">
                <Quote size={48} fill="#C4A882" className="text-primary" />
            </div>

            {/* Stars */}
            <StarRating rating={testimonial.rating} />

            {/* Text */}
            <p className="mt-5 text-dark text-sm md:text-base leading-relaxed italic font-light">
                "{testimonial.text}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-100">
                <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ backgroundColor: testimonial.avatarColor }}
                >
                    {testimonial.avatar}
                </div>
                <div>
                    <p className="font-semibold text-dark text-sm">{testimonial.name}</p>
                    <p className="text-xs text-light">{testimonial.location}</p>
                </div>
                <div className="ml-auto">
                    <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: 'rgba(168,181,162,0.15)', color: '#6B7355' }}>
                        {testimonial.product}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}

export default function Testimonials() {
    const [current, setCurrent] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const next = useCallback(() => {
        setCurrent((c) => (c + 1) % testimonials.length);
    }, []);

    const prev = () => {
        setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
    };

    useEffect(() => {
        if (isPaused) return;
        const timer = setInterval(next, 5000);
        return () => clearInterval(timer);
    }, [next, isPaused]);

    // Get 3 items for desktop view
    const getVisible = () => {
        const prev = (current - 1 + testimonials.length) % testimonials.length;
        const next = (current + 1) % testimonials.length;
        return [prev, current, next];
    };

    const [prevIdx, centerIdx, nextIdx] = getVisible();

    return (
        <section className="section relative overflow-hidden"
            style={{ background: 'linear-gradient(180deg, #F5F0EB 0%, #EDE5D8 100%)' }}
        >
            {/* Decorative */}
            <div className="absolute top-10 left-10 text-6xl opacity-5 font-accent italic text-primary select-none">❝</div>
            <div className="absolute bottom-10 right-10 text-6xl opacity-5 font-accent italic text-primary select-none rotate-180">❝</div>

            <div className="container" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="section-header"
                >
                    <span className="section-label">Testimonials</span>
                    <h2 className="section-title">
                        Love Letters from Our <span className="font-accent italic text-primary">Customers</span> 💌
                    </h2>
                </motion.div>

                {/* Desktop: 3-column */}
                <div className="hidden md:grid grid-cols-3 gap-5 relative mb-10">
                    <AnimatePresence mode="popLayout">
                        {[prevIdx, centerIdx, nextIdx].map((idx, pos) => (
                            <motion.div
                                key={`${idx}-${pos}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4 }}
                            >
                                <TestimonialCard
                                    testimonial={testimonials[idx]}
                                    isCenter={pos === 1}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Mobile: Single card */}
                <div className="md:hidden mb-10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current}
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -40 }}
                            transition={{ duration: 0.35 }}
                        >
                            <TestimonialCard testimonial={testimonials[current]} isCenter={true} />
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                    <button
                        onClick={prev}
                        className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all border border-gray-100"
                    >
                        <ChevronLeft size={18} className="text-secondary" />
                    </button>

                    {/* Dots */}
                    <div className="flex gap-2">
                        {testimonials.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                className="transition-all duration-300 rounded-full"
                                style={{
                                    width: i === current ? '24px' : '8px',
                                    height: '8px',
                                    backgroundColor: i === current ? '#C4A882' : '#D4C8B8',
                                }}
                            />
                        ))}
                    </div>

                    <button
                        onClick={next}
                        className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all border border-gray-100"
                    >
                        <ChevronRight size={18} className="text-secondary" />
                    </button>
                </div>
            </div>
        </section>
    );
}
