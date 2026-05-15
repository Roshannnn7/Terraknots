'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
    const [isVisible, setIsVisible] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    const [cursorText, setCursorText] = useState('');

    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 700, mass: 0.5 };
    const ringConfig = { damping: 20, stiffness: 200, mass: 0.8 };

    const dotX = useSpring(cursorX, springConfig);
    const dotY = useSpring(cursorY, springConfig);
    const ringX = useSpring(cursorX, ringConfig);
    const ringY = useSpring(cursorY, ringConfig);

    useEffect(() => {
        // Only show on desktop
        if (window.matchMedia('(pointer: coarse)').matches) return;

        const moveCursor = (e) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
            setIsVisible(true);
        };

        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);
        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = () => setIsVisible(true);

        const addHoverListeners = () => {
            const interactiveElements = document.querySelectorAll(
                'a, button, [role="button"], input, textarea, select, label[for], .product-card, [data-cursor]'
            );

            interactiveElements.forEach((el) => {
                el.addEventListener('mouseenter', () => {
                    setIsHovering(true);
                    const text = el.getAttribute('data-cursor-text');
                    if (text) setCursorText(text);
                });
                el.addEventListener('mouseleave', () => {
                    setIsHovering(false);
                    setCursorText('');
                });
            });
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        document.documentElement.addEventListener('mouseleave', handleMouseLeave);
        document.documentElement.addEventListener('mouseenter', handleMouseEnter);

        // Add hover listeners and re-add when DOM changes
        addHoverListeners();
        const observer = new MutationObserver(addHoverListeners);
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
            document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
            observer.disconnect();
        };
    }, [cursorX, cursorY]);

    // Don't render on touch devices
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
        return null;
    }

    return (
        <>
            {/* Inner dot */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
                style={{
                    x: dotX,
                    y: dotY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                animate={{
                    opacity: isVisible ? 1 : 0,
                    scale: isClicking ? 0.6 : 1,
                }}
                transition={{ duration: 0.15 }}
            >
                <div
                    className="rounded-full"
                    style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: '#C4A882',
                    }}
                />
            </motion.div>

            {/* Outer ring */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9998]"
                style={{
                    x: ringX,
                    y: ringY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                animate={{
                    opacity: isVisible ? 1 : 0,
                    scale: isHovering ? 2.2 : isClicking ? 0.8 : 1,
                    width: cursorText ? 80 : 36,
                    height: cursorText ? 80 : 36,
                }}
                transition={{ type: 'spring', damping: 20, stiffness: 250 }}
            >
                <div
                    className="w-full h-full rounded-full flex items-center justify-center"
                    style={{
                        border: `1.5px solid rgba(196,168,130,${isHovering ? 0.7 : 0.5})`,
                        backgroundColor: isHovering ? 'rgba(196,168,130,0.08)' : 'transparent',
                    }}
                >
                    {cursorText && (
                        <span className="text-[9px] font-bold text-primary uppercase tracking-wider text-center leading-tight">
                            {cursorText}
                        </span>
                    )}
                </div>
            </motion.div>

            {/* Global cursor: none style */}
            <style jsx global>{`
                @media (pointer: fine) {
                    *, *::before, *::after {
                        cursor: none !important;
                    }
                }
            `}</style>
        </>
    );
}
