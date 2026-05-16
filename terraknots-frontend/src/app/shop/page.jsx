'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, Box } from 'lucide-react';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/common/ProductCard';
import Filters from '@/components/shop/Filters';
import Sort from '@/components/shop/Sort';
import WaveDivider from '@/components/ui/WaveDivider';
import api from '@/lib/api';

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};
const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
};

export default function ShopPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'All',
    minPrice: '',
    maxPrice: '',
    materials: [],
    inStock: false,
    search: searchParams.get('search') || '',
    sortBy: searchParams.get('sort') || 'newest',
    page: 1,
    limit: 12
  });

  // Load Categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data?.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCats();
  }, []);

  // Load Products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let queryString = `?page=${filters.page}&limit=${filters.limit}&category=${filters.category}&search=${filters.search}&sortBy=${filters.sortBy}`;

        if (filters.minPrice) queryString += `&minPrice=${filters.minPrice}`;
        if (filters.maxPrice) queryString += `&maxPrice=${filters.maxPrice}`;
        if (filters.materials?.length > 0) queryString += `&materials=${filters.materials.join(',')}`;
        if (filters.inStock) queryString += `&inStock=true`;

        const res = await api.get(`/products${queryString}`);
        setProducts(res.data?.products || res.data?.data || []);
        setTotal(res.data?.total || res.data?.data?.length || 0);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.category && filters.category !== 'All') params.set('category', filters.category);
    if (filters.sortBy !== 'newest') params.set('sort', filters.sortBy);
    if (filters.search) params.set('search', filters.search);
    
    const currentParams = searchParams.toString();
    const newParams = params.toString();
    
    if (currentParams !== newParams) {
      const newUrl = newParams ? `/shop?${newParams}` : '/shop';
      router.replace(newUrl, { scroll: false });
    }
  }, [filters.category, filters.sortBy, filters.search, router, searchParams]);

  return (
    <>
      <AnnouncementBar />
      <Navbar />

      <main className="min-h-screen bg-background pt-[108px] overflow-hidden">
        <div className="relative py-20 overflow-hidden" style={{ background: 'linear-gradient(180deg, #F5F0EB 0%, #FAF8F5 100%)' }}>
          <div className="container relative z-10 text-center">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-primary mb-4"
              style={{ backgroundColor: 'rgba(196,168,130,0.1)' }}
            >
              Explore Collection
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-heading font-bold text-dark mb-4"
            >
              The <span className="font-accent italic text-primary">Artisan</span> Shop
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-light text-lg md:text-xl max-w-2xl mx-auto font-medium"
            >
              Every piece is hand-crafted with patience, love, and attention to detail. Find your unique treasure.
            </motion.p>
          </div>
        </div>

        <WaveDivider color="#FAF8F5" flip variant={2} />

        <div className="container py-12 md:py-16">
          <div className="flex flex-col lg:flex-row gap-10">
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-32 p-6 rounded-3xl bg-white/50 backdrop-blur-sm border border-gray-100 shadow-sm">
                <Filters filters={filters} setFilters={setFilters} />
              </div>
            </aside>

            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="lg:hidden flex items-center gap-2 text-dark font-bold text-sm bg-background px-4 py-2.5 rounded-xl transition-colors hover:bg-gray-100"
                  >
                    <SlidersHorizontal size={16} />
                    <span>Filters</span>
                  </button>
                  <p className="text-sm font-medium text-light hidden sm:block">
                    Showing <span className="text-primary font-bold">{products.length}</span> of <span className="text-dark font-bold">{total}</span> items
                  </p>
                </div>

                <div className="flex items-center gap-4 md:gap-6 w-full sm:w-auto">
                  <div className="relative group flex-1 sm:w-64">
                    <input
                      type="text"
                      placeholder="Search treasures..."
                      value={filters.search}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                      className="w-full bg-background border-0 rounded-full py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                    />
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                  <div className="hidden sm:block">
                    <Sort value={filters.sortBy} onChange={(val) => setFilters({ ...filters, sortBy: val, page: 1 })} />
                  </div>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="skeletons"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8"
                  >
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="bg-white rounded-2xl h-80 animate-pulse shadow-sm" />
                    ))}
                  </motion.div>
                ) : products.length > 0 ? (
                  <motion.div
                    key="grid"
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8"
                  >
                    {products.map((product) => (
                      <motion.div key={product._id} variants={staggerItem}>
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    className="bg-white py-20 px-6 rounded-3xl text-center shadow-sm"
                  >
                    <Box size={48} className="mx-auto mb-4 text-gray-300" />
                    <h3 className="text-2xl font-bold mb-2">No items found</h3>
                    <button
                      onClick={() => setFilters({ ...filters, category: 'All', search: '', page: 1 })}
                      className="text-primary font-bold hover:underline"
                    >
                      Clear all filters
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
