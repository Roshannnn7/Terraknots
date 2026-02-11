import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import Categories from '@/components/home/Categories';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import Craftsmanship from '@/components/home/Craftsmanship';
import Testimonials from '@/components/home/Testimonials';
import InstagramFeed from '@/components/home/InstagramFeed';

export default function Home() {
    return (
        <>
            <AnnouncementBar />
            <Navbar />
            <main>
                <Hero />
                <Categories />
                <FeaturedProducts />
                <Craftsmanship />
                <Testimonials />
                <InstagramFeed />
            </main>
            <Footer />
        </>
    );
}
