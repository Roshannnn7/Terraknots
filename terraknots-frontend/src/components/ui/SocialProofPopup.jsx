'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X } from 'lucide-react';

const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Chennai', 'Hyderabad', 'Kolkata', 'Jaipur', 'Ahmedabad', 'Surat'];
const products = [
    'Crochet Flower Bouquet', 'Butterfly Resin Keychain', 'Mini Crochet Pouch',
    'Boho Clay Hoop Earrings', 'Ocean Wave Resin Keychain', 'Macrame Coaster Set',
    'Clay Stud Earrings', 'Rose Crochet Keychain', 'Polka Dot Coaster Set', 'Crochet Bow Keychain'
];

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getTimeAgo() {
    const mins = Math.floor(Math.random() * 10) + 1;
    return `${mins} min${mins > 1 ? 's' : ''} ago`;
}

export default function SocialProofPopup() {
    const [notification, setNotification] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        let showTimer;
        let hideTimer;

        const show = () => {
            setNotification({
                city: getRandomItem(cities),
                product: getRandomItem(products),
                time: getTimeAgo(),
            });
            setIsVisible(true);

            hideTimer = setTimeout(() => {
                setIsVisible(false);
                // Schedule next popup
                showTimer = setTimeout(show, 30000); // every 30s
            }, 5000); // show for 5s
        };

        // First show after 8s
        showTimer = setTimeout(show, 8000);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
        };
    }, []);

    return (
        <AnimatePresence>
            {isVisible && notification && (
                <motion.div
                    initial={{ opacity: 0, x: -80, y: 20 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, x: -80, y: 20 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    className="fixed bottom-24 md:bottom-6 left-4 z-[200] max-w-[280px]"
                >
                    <div
                        className="relative flex items-start gap-3 p-4 rounded-2xl shadow-lg border"
                        style={{
                            background: 'rgba(255,255,255,0.95)',
                            backdropFilter: 'blur(12px)',
                            borderColor: 'rgba(196,168,130,0.2)',
                            boxShadow: '0 8px 32px rgba(139,115,85,0.15)',
                        }}
                    >
                        {/* Avatar */}
                        <div
                            className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-lg"
                            style={{ background: 'linear-gradient(135deg, #F2D7C9, #C4A882)' }}
                        >
                            🧶
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1 mb-0.5">
                                <MapPin size={10} className="text-primary flex-shrink-0" />
                                <span className="text-[11px] font-bold text-primary">
                                    Someone from {notification.city}
                                </span>
                            </div>
                            <p className="text-xs text-dark font-semibold leading-snug line-clamp-1">
                                just ordered{' '}
                                <span className="text-secondary">{notification.product}</span>
                            </p>
                            <p className="text-[10px] text-light mt-0.5">{notification.time}</p>
                        </div>

                        <button
                            onClick={() => setIsVisible(false)}
                            className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                        >
                            <X size={10} className="text-gray-500" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
