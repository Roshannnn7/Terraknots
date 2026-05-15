'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn } from 'lucide-react';

export default function ProductGallery({ images = [] }) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [isZoomMousedInfo, setIsZoomMousedInfo] = useState(false);

    // Fallback if no images
    const displayImages = images.length > 0 ? images : ['https://picsum.photos/seed/placeholder/800/1000'];

    return (
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 sticky top-32">
            {/* Desktop Thumbnails (Left side) */}
            <div className="hidden md:flex flex-col gap-4 w-20 shrink-0">
                {displayImages.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`relative w-full aspect-[4/5] rounded-xl overflow-hidden transition-all duration-300 ${
                            selectedImage === idx
                                ? 'ring-2 ring-primary ring-offset-2 scale-95 shadow-sm'
                                : 'opacity-50 hover:opacity-100 hover:scale-95'
                        }`}
                        aria-label={`View image ${idx + 1}`}
                    >
                        <Image
                            src={img}
                            alt={`Thumbnail ${idx + 1}`}
                            fill
                            className="object-cover"
                            sizes="80px"
                        />
                    </button>
                ))}
            </div>

            {/* Main Image */}
            <motion.div
                className="flex-1 relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-white group"
                style={{ boxShadow: '0 4px 40px rgba(139,115,85,0.08)' }}
                onMouseEnter={() => setIsZoomMousedInfo(true)}
                onMouseLeave={() => setIsZoomMousedInfo(false)}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedImage}
                        initial={{ opacity: 0, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="absolute inset-0"
                    >
                        <Image
                            src={displayImages[selectedImage]}
                            alt="Product Image"
                            fill
                            className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                            priority
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Decorative blob */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/20 blur-[50px] rounded-full pointer-events-none mix-blend-multiply" />

                {/* Zoom hint */}
                <AnimatePresence>
                    {isZoomMousedInfo && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="absolute top-6 right-6 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-dark shadow-sm pointer-events-none"
                        >
                            <ZoomIn size={18} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Mobile Thumbnails (Bottom) */}
            <div className="flex md:hidden gap-3 overflow-x-auto pb-2 scrollbar-none px-1">
                {displayImages.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`relative w-16 shrink-0 aspect-[4/5] rounded-xl overflow-hidden transition-all duration-300 ${
                            selectedImage === idx
                                ? 'ring-2 ring-primary ring-offset-2 scale-95'
                                : 'opacity-50'
                        }`}
                    >
                        <Image
                            src={img}
                            alt={`Thumbnail ${idx + 1}`}
                            fill
                            className="object-cover"
                            sizes="64px"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
