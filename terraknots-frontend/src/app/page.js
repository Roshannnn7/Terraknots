import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import MarqueeTrustStrip from '@/components/home/MarqueeTrustStrip';
import Categories from '@/components/home/Categories';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import TerraKnotsDifference from '@/components/home/TerraKnotsDifference';
import StatsSection from '@/components/home/StatsSection';
import Craftsmanship from '@/components/home/Craftsmanship';
import Testimonials from '@/components/home/Testimonials';
import InstagramSection from '@/components/home/InstagramSection';
import NewsletterCTA from '@/components/home/NewsletterCTA';
import WaveDivider from '@/components/ui/WaveDivider';

export const metadata = {
    title: 'TerraKnots | Handmade with Heart, Knot by Knot',
    description: 'Discover unique handmade crochet, resin, clay and macrame creations. Each piece is crafted by hand with love and patience. Free shipping above ₹499.',
    openGraph: {
        title: 'TerraKnots — Handmade with Heart',
        description: 'Not mass-produced. Mass-loved. Discover artisan handmade gifts from TerraKnots.',
        images: [{ url: '/images/logo.png' }],
    },
};

export default function Home() {
    return (
        <>
            <AnnouncementBar />
            <Navbar />
            <main>
                {/* 1. Hero — uses workspace-paint.jpg */}
                <Hero />

                {/* 2. Trust Marquee Strip */}
                <MarqueeTrustStrip />

                <WaveDivider color="#FAF8F5" variant={1} />

                {/* 3. Categories */}
                <Categories />

                <WaveDivider color="#F5F0EB" flip variant={2} />

                {/* 4. Featured Products */}
                <FeaturedProducts />

                <WaveDivider color="#F5F0EB" variant={3} />

                {/* 5. The TerraKnots Difference */}
                <TerraKnotsDifference />

                {/* 6. Stats Section */}
                <StatsSection />

                <WaveDivider color="#FAF8F5" flip variant={1} />

                {/* 7. How It's Made — Process Timeline */}
                <Craftsmanship />

                <WaveDivider color="#EDE5D8" variant={2} />

                {/* 7. Testimonials */}
                <Testimonials />

                <WaveDivider color="#F5F0EB" flip variant={3} />

                {/* 8. Instagram Grid */}
                <InstagramSection />

                {/* 9. Newsletter */}
                <NewsletterCTA />
            </main>
            <Footer />
        </>
    );
}
