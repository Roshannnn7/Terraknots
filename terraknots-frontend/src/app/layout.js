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
import CustomCursor from '@/components/ui/CustomCursor';
import ScrollProgressBar from '@/components/ui/ScrollProgressBar';
import SocialProofPopup from '@/components/ui/SocialProofPopup';

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

export const metadata = {
    title: {
        default: 'TerraKnots | Handmade with Heart, Knot by Knot',
        template: '%s | TerraKnots',
    },
    description: 'Discover unique handmade crochet, resin, and clay accessories. Each piece is crafted with love and patience for those who appreciate artisan quality.',
    keywords: ['handmade', 'crochet', 'resin', 'clay jewelry', 'artisan crafts', 'knitting', 'unique gifts', 'India', 'handcrafted'],
    authors: [{ name: 'TerraKnots' }],
    creator: 'TerraKnots',
    manifest: '/manifest.json',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'TerraKnots',
    },
    formatDetection: { telephone: false },
    openGraph: {
        type: 'website',
        locale: 'en_IN',
        url: 'https://terraknots.com',
        siteName: 'TerraKnots',
        title: 'TerraKnots — Handmade with Heart, Knot by Knot',
        description: 'Discover unique handmade crochet, resin, clay and macrame creations. Each piece is crafted by hand with love.',
        images: [{ url: '/images/logo.png', width: 800, height: 600, alt: 'TerraKnots' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'TerraKnots — Handmade with Heart',
        description: 'Not mass-produced. Mass-loved. Discover artisan handmade gifts.',
        images: ['/images/logo.png'],
    },
};

export const viewport = {
    themeColor: '#C4A882',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${playfair.variable} ${poppins.variable} ${dancing.variable} font-body bg-background text-dark antialiased`}>
                <AuthProvider>
                    <CartProvider>
                        <WishlistProvider>
                            <CustomCursor />
                            <ScrollProgressBar />
                            <LoadingScreen />
                            <main className="min-h-screen flex flex-col pb-16 md:pb-0">
                                {children}
                            </main>
                            <MobileBottomNav />
                            <ScrollToTop />
                            <WhatsAppButton />
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
