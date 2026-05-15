'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const steps = [
    {
        number: '01',
        icon: (
            <svg viewBox="0 0 64 64" className="w-14 h-14">
                <rect x="8" y="8" width="48" height="36" rx="4" fill="none" stroke="#C4A882" strokeWidth="2" />
                <line x1="16" y1="20" x2="40" y2="20" stroke="#C4A882" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="16" y1="26" x2="36" y2="26" stroke="#C4A882" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="16" y1="32" x2="32" y2="32" stroke="#C4A882" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="48" cy="48" r="8" fill="#D4A574" opacity="0.3" />
                <path d="M44 48 L47 51 L52 45" stroke="#D4A574" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        title: 'Imagined',
        text: 'Every creation begins as an idea — sketched and dreamed up with you in mind. We let creativity guide the way.',
        color: '#C4A882',
    },
    {
        number: '02',
        icon: (
            <svg viewBox="0 0 64 64" className="w-14 h-14">
                <path d="M12 50 C12 50 20 20 32 18 C44 16 52 50 52 50" fill="none" stroke="#A8B5A2" strokeWidth="2" />
                <circle cx="20" cy="38" r="5" fill="#A8B5A2" opacity="0.4" />
                <circle cx="32" cy="30" r="7" fill="#A8B5A2" opacity="0.5" />
                <circle cx="44" cy="38" r="5" fill="#A8B5A2" opacity="0.4" />
                <path d="M28 44 L32 48 L36 44" fill="#A8B5A2" opacity="0.7" />
            </svg>
        ),
        title: 'Sourced',
        text: 'We carefully choose quality materials — premium yarn, resin, clay — for every project. Quality in, quality out.',
        color: '#A8B5A2',
    },
    {
        number: '03',
        icon: (
            <svg viewBox="0 0 64 64" className="w-14 h-14">
                <path d="M20 44 C20 44 28 20 32 20 C36 20 44 44 44 44" fill="none" stroke="#D4A574" strokeWidth="2" />
                <path d="M16 36 C18 33 22 33 24 36" fill="none" stroke="#D4A574" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M40 36 C42 33 46 33 48 36" fill="none" stroke="#D4A574" strokeWidth="1.5" strokeLinecap="round" />
                <ellipse cx="32" cy="48" rx="14" ry="5" fill="#D4A574" opacity="0.2" />
                <circle cx="32" cy="44" r="4" fill="#D4A574" opacity="0.6" />
            </svg>
        ),
        title: 'Crafted',
        text: 'Hours of careful work — stitch by stitch, pour by pour, shaping with steady hands and a full heart.',
        color: '#D4A574',
    },
    {
        number: '04',
        icon: (
            <svg viewBox="0 0 64 64" className="w-14 h-14">
                <rect x="14" y="28" width="36" height="26" rx="4" fill="none" stroke="#C9B09B" strokeWidth="2" />
                <path d="M14 36 L32 44 L50 36" fill="none" stroke="#C9B09B" strokeWidth="1.5" />
                <path d="M26 22 L32 10 L38 22" fill="none" stroke="#C9B09B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="32" cy="9" r="3" fill="#C9B09B" opacity="0.7" />
                <path d="M28 28 C28 24 36 24 36 28" fill="#C9B09B" opacity="0.3" />
            </svg>
        ),
        title: 'Delivered',
        text: 'Thoughtfully packed in eco-friendly wrapping and sent on its way — bringing a little joy to your doorstep.',
        color: '#C9B09B',
    },
];

export default function Craftsmanship() {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    });

    const lineScaleX = useTransform(scrollYProgress, [0.1, 0.8], [0, 1]);

    return (
        <section
            ref={sectionRef}
            className="section relative overflow-hidden"
            style={{ background: 'linear-gradient(180deg, #FAF8F5 0%, #F5F0EB 100%)' }}
        >
            {/* Texture */}
            <div className="absolute inset-0 bg-texture pointer-events-none" />

            <div className="container relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="section-header"
                >
                    <span className="section-label">Our Process</span>
                    <h2 className="section-title">
                        From <span className="text-primary">Heart</span> to <span className="font-accent italic">Hand</span> to Home
                    </h2>
                    <p className="section-subtitle mt-4 max-w-lg mx-auto">
                        Every TerraKnots piece starts as an idea and ends as something truly special — here's how.
                    </p>
                </motion.div>

                {/* Desktop timeline */}
                <div className="hidden md:block relative mt-20">
                    {/* Animated line */}
                    <div className="absolute top-14 left-0 right-0 h-0.5 bg-gray-200 mx-8">
                        <motion.div
                            className="h-full origin-left rounded-full"
                            style={{
                                scaleX: lineScaleX,
                                background: 'linear-gradient(to right, #C4A882, #D4A574, #A8B5A2, #C9B09B)',
                            }}
                        />
                    </div>

                    <div className="grid grid-cols-4 gap-8 relative">
                        {steps.map((step, i) => (
                            <motion.div
                                key={step.title}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-60px' }}
                                transition={{ delay: i * 0.2, duration: 0.6 }}
                                className="flex flex-col items-center text-center"
                            >
                                {/* Icon circle — on the line */}
                                <motion.div
                                    className="w-28 h-28 rounded-full bg-white flex items-center justify-center mb-8 relative z-10"
                                    style={{ boxShadow: `0 4px 20px ${step.color}30, 0 0 0 4px ${step.color}20` }}
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {step.icon}
                                </motion.div>

                                {/* Number */}
                                <span className="font-accent italic text-4xl mb-2" style={{ color: step.color, opacity: 0.4 }}>
                                    {step.number}
                                </span>

                                <h3 className="font-heading text-xl font-bold text-dark mb-3">{step.title}</h3>
                                <p className="text-light text-sm leading-relaxed">{step.text}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Mobile timeline — vertical */}
                <div className="md:hidden relative mt-10">
                    <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-gray-200">
                        <motion.div
                            className="w-full origin-top rounded-full"
                            style={{
                                scaleY: lineScaleX,
                                background: 'linear-gradient(to bottom, #C4A882, #D4A574, #A8B5A2, #C9B09B)',
                                height: '100%',
                            }}
                        />
                    </div>

                    <div className="space-y-12">
                        {steps.map((step, i) => (
                            <motion.div
                                key={step.title}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15, duration: 0.6 }}
                                className="flex items-start gap-6 pl-2"
                            >
                                {/* Icon */}
                                <div
                                    className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 relative z-10"
                                    style={{ boxShadow: `0 4px 15px ${step.color}30` }}
                                >
                                    <span className="text-xl">{['✏️', '🌿', '🤲', '🎁'][i]}</span>
                                </div>

                                {/* Content */}
                                <div className="pt-1">
                                    <span className="font-accent italic text-2xl block" style={{ color: step.color, opacity: 0.5 }}>
                                        {step.number}
                                    </span>
                                    <h3 className="font-heading text-lg font-bold text-dark mb-2">{step.title}</h3>
                                    <p className="text-light text-sm leading-relaxed">{step.text}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
