'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const ProductGallery = ({ images }) => {
    const [selectedImage, setSelectedImage] = useState(0);

    return (
        <div className="space-y-6">
            {/* Main Image */}
            <div className="aspect-[4/5] relative rounded-[2rem] overflow-hidden bg-white shadow-sm">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedImage}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full h-full"
                    >
                        <Image
                            src={images[selectedImage]}
                            alt="Product Image"
                            fill
                            className="object-cover"
                            priority
                        />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedImage(idx)}
                            className={`relative w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden transition-all duration-300 ${selectedImage === idx ? 'ring-2 ring-primary ring-offset-2 scale-95 shadow-lg' : 'opacity-60 hover:opacity-100'
                                }`}
                        >
                            <Image
                                src={img}
                                alt={`Thumbnail ${idx}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductGallery;
