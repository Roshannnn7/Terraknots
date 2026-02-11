import { Playfair_Display, Poppins, Dancing_Script } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    keywords: ['handmade', 'crochet', 'resin', 'clay jewelry', 'artisan crafts', 'knitting', 'unique gifts'],
    openGraph: {
        type: 'website',
        locale: 'en_IN',
        url: 'https://terraknots.com',
        siteName: 'TerraKnots',
        images: [{ url: '/og-image.jpg' }],
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${playfair.variable} ${poppins.variable} ${dancing.variable} font-body bg-background text-dark antialiased`}>
                <AuthProvider>
                    <CartProvider>
                        <WishlistProvider>
                            <main className="min-h-screen flex flex-col">
                                {children}
                            </main>
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
