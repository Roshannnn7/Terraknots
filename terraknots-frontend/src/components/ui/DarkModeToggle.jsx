'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DarkModeToggle() {
    const [isDark, setIsDark] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Check system preference and localStorage
        const stored = localStorage.getItem('terraknots-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const dark = stored === 'dark' || (!stored && prefersDark);
        setIsDark(dark);
        document.documentElement.classList.toggle('dark', dark);
    }, []);

    const toggle = () => {
        const newDark = !isDark;
        setIsDark(newDark);
        document.documentElement.classList.toggle('dark', newDark);
        localStorage.setItem('terraknots-theme', newDark ? 'dark' : 'light');
    };

    if (!mounted) return null;

    return (
        <button
            onClick={toggle}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
            style={{
                background: isDark
                    ? 'linear-gradient(135deg, #3D2E22, #5C4033)'
                    : 'linear-gradient(135deg, #F2D7C9, #C4A882)',
            }}
        >
            <motion.div
                className="absolute top-0.5 w-6 h-6 rounded-full flex items-center justify-center shadow-sm"
                animate={{ x: isDark ? 28 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                style={{ backgroundColor: isDark ? '#C4A882' : 'white' }}
            >
                <AnimatePresence mode="wait">
                    {isDark ? (
                        <motion.span
                            key="moon"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Moon size={12} className="text-dark" />
                        </motion.span>
                    ) : (
                        <motion.span
                            key="sun"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Sun size={12} className="text-amber-500" />
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.div>
        </button>
    );
}
