'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Playfair_Display, Poppins, Dancing_Script } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingScreen from '@/components/ui/LoadingScreen';
import ScrollToTop from '@/components/ui/ScrollToTop';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import ScrollProgressBar from '@/components/ui/ScrollProgressBar';
import SocialProofPopup from '@/components/ui/SocialProofPopup';
import BackendWarmer from '@/components/BackendWarmer';

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair',
});

const poppins = Poppins({
    weight: ['300', '400', '500', '600', '700'],
    subsets: ['latin'],
    variable: '--font-poppins',
});

const dancing = Dancing_Script({
    subsets: ['latin'],
    variable: '--font-dancing',
});

export default function RootLayout({ children }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');

    useEffect(() => {
        // Detect low-end device or user preference
        const isLowEnd =
            (typeof navigator !== 'undefined' && (
                (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) ||
                (navigator.deviceMemory && navigator.deviceMemory < 4)
            )) ||
            (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

        if (isLowEnd) {
            document.documentElement.classList.add('reduce-motion');
        }
    }, []);

    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/images/logo.png" />
            </head>
            <body className={`${playfair.variable} ${poppins.variable} ${dancing.variable} font-body bg-background text-dark antialiased`}>
                <BackendWarmer />
                <AuthProvider>
                    <CartProvider>
                        <WishlistProvider>
                            <ScrollProgressBar />
                            <LoadingScreen />
                            <main className="min-h-screen flex flex-col pb-16 md:pb-0">
                                {children}
                            </main>
                            <MobileBottomNav />
                            <ScrollToTop />
                            {!isAdmin && <WhatsAppButton />}
                            <SocialProofPopup />
                            <ToastContainer
                                position="bottom-right"
                                autoClose={3000}
                                hideProgressBar={false}
                                newestOnTop
                                closeOnClick
                                rtl={false}
                                pauseOnFocusLoss
                                draggable
                                pauseOnHover
                                theme="light"
                            />
                        </WishlistProvider>
                    </CartProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
