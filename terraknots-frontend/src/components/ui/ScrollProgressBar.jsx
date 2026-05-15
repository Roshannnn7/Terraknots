'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgressBar() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 z-[10000] h-[3px] origin-left"
            style={{
                scaleX,
                background: 'linear-gradient(90deg, #C4A882 0%, #D4A574 40%, #A8B5A2 100%)',
            }}
        />
    );
}
