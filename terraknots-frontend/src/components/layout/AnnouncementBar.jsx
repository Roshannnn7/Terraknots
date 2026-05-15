'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import api from '@/lib/api';

const defaultItems = [
    '✨ Free shipping on orders above ₹499',
    '🧶 100% Handmade with love',
    '💛 New arrivals dropping every week',
    '🎁 Custom orders welcome — just ask!',
    '🌿 Eco-friendly materials, always',
    '📦 Dispatch within 3-5 business days',
];

export default function AnnouncementBar() {
    const [visible, setVisible] = useState(true);
    const [items, setItems] = useState(defaultItems);

    useEffect(() => {
        const dismissed = sessionStorage.getItem('announcementDismissed');
        if (dismissed) setVisible(false);

        const fetchSettings = async () => {
            try {
                const { data } = await api.get('/settings');
                if (data.settings?.announcementText) {
                    setItems([data.settings.announcementText, ...defaultItems]);
                }
            } catch {}
        };
        fetchSettings();
    }, []);

    const dismiss = () => {
        setVisible(false);
        sessionStorage.setItem('announcementDismissed', 'true');
    };

    const allItems = [...items, ...items];

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ height: 36, opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative overflow-hidden z-50"
                    style={{ backgroundColor: '#2C2C2C', height: '36px' }}
                >
                    {/* Dismiss button */}
                    <button
                        onClick={dismiss}
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-white/50 hover:text-white transition-colors"
                    >
                        <X size={14} />
                    </button>

                    {/* Marquee */}
                    <div className="h-full flex items-center overflow-hidden">
                        <div
                            className="flex items-center whitespace-nowrap"
                            style={{ animation: 'marquee 40s linear infinite' }}
                            onMouseEnter={(e) => e.currentTarget.style.animationPlayState = 'paused'}
                            onMouseLeave={(e) => e.currentTarget.style.animationPlayState = 'running'}
                        >
                            {allItems.map((item, i) => (
                                <span key={i} className="inline-flex items-center shrink-0 text-white text-xs font-medium px-8">
                                    {item}
                                    <span className="mx-6 opacity-30">•</span>
                                </span>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
