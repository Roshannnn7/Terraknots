'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

const steps = [
    {
        title: "Raw Materials",
        desc: "Selecting the finest yarn, resin, and clay.",
        image: "/images/workspace-paint.jpg",
        align: "left"
    },
    {
        title: "Crafting in Progress",
        desc: "Every piece is carefully made by hand.",
        image: "/images/workspace-crochet.jpg",
        align: "right"
    },
    {
        title: "Finished With Love",
        desc: "Beautifully finalized and thoroughly checked for quality.",
        image: "/images/workspace-paint.jpg",
        align: "left"
    },
    {
        title: "Carefully Packed",
        desc: "Wrapped in eco-friendly packaging with a personal note, ready for you.",
        image: "/images/workspace-crochet.jpg",
        align: "right"
    }
];

export default function WorkshopJourney() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.1 });

    return (
        <section className="py-24 bg-white relative overflow-hidden" ref={ref}>
            <div className="container mx-auto px-6 max-w-5xl">
                <div className="text-center mb-20 text-dark">
                    <motion.h2 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-5xl font-heading mb-4"
                    >
                        From Our Workshop <br /> To Your Doorstep
                    </motion.h2>
                    <p className="font-body text-secondary max-w-2xl mx-auto">
                        Follow the journey of a TerraKnots creation.
                    </p>
                </div>

                <div className="relative">
                    {/* Wavy line down the middle */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/10 via-terracotta/40 to-primary/10 -translate-x-1/2 rounded-full border-dashed" style={{ borderLeft: '2px dashed var(--terracotta)'}} />
                    
                    <div className="space-y-16 md:space-y-32">
                        {steps.map((step, index) => (
                            <motion.div 
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.8, delay: index * 0.2 }}
                                className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 ${step.align === 'right' ? 'md:flex-row-reverse' : ''}`}
                            >
                                <div className={`flex-1 w-full relative ${step.align === 'right' ? 'text-left md:text-right' : 'text-left'}`}>
                                    <h3 className="font-heading text-3xl mb-4 text-dark">{step.title}</h3>
                                    <p className="font-body text-secondary text-lg">{step.desc}</p>
                                </div>
                                
                                {/* Center Node */}
                                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white border-4 border-terracotta items-center justify-center font-bold text-terracotta z-10 shadow-md">
                                    {index + 1}
                                </div>

                                <div className="flex-1 w-full relative h-[300px] md:h-[400px] rounded-[2rem] overflow-hidden shadow-xl group">
                                    <Image 
                                        src={step.image} 
                                        alt={step.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/0 transition-colors duration-500" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
