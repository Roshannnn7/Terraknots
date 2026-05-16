'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, Box, ChevronLeft, ChevronRight } from 'lucide-react';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/common/ProductCard';
import Filters from '@/components/shop/Filters';
import Sort from '@/components/shop/Sort';
import WaveDivider from '@/components/ui/WaveDivider';
import api from '@/lib/api';

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.05 } }
};
const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
};

export default function ShopPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'All',
    minPrice: '',
    maxPrice: '',
    materials: [],
    inStock: false,
    search: searchParams.get('search') || '',
    sortBy: searchParams.get('sort') || 'newest',
    page: parseInt(searchParams.get('page')) || 1,
    limit: 24
  });

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
        
        // Scroll to top when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
    if (filters.page > 1) params.set('page', filters.page);
    
    const currentParams = searchParams.toString();
    const newParams = params.toString();
    
    if (currentParams !== newParams) {
      const newUrl = newParams ? `/shop?${newParams}` : '/shop';
      router.replace(newUrl, { scroll: false });
    }
  }, [filters, router, searchParams]);

  const totalPages = Math.ceil(total / filters.limit);

  return (
    <>
      <AnnouncementBar />
      <Navbar />

      <main className="min-h-screen bg-background pt-[108px] overflow-hidden">
        {/* Header Section */}
        <div className="relative py-16 overflow-hidden" style={{ background: 'linear-gradient(180deg, #F5F0EB 0%, #FAF8F5 100%)' }}>
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
              className="text-5xl md:text-6xl font-heading font-bold text-dark mb-4"
            >
              The <span className="font-accent italic text-primary">Artisan</span> Shop
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-light text-lg max-w-2xl mx-auto font-medium"
            >
              Every piece is hand-crafted with patience, love, and attention to detail.
            </motion.p>
          </div>
        </div>

        <WaveDivider color="#FAF8F5" flip variant={2} />

        <div className="container py-8 md:py-12">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 sticky top-28 z-30">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-2 text-dark font-bold text-sm bg-background px-5 py-2.5 rounded-xl transition-all hover:bg-primary hover:text-white group shadow-sm"
              >
                <SlidersHorizontal size={18} className="group-hover:scale-110 transition-transform" />
                <span>Filters</span>
                { (filters.category !== 'All' || filters.materials.length > 0 || filters.minPrice || filters.inStock) && (
                  <span className="w-2 h-2 bg-primary group-hover:bg-white rounded-full ml-1" />
                )}
              </button>
              <p className="text-sm font-medium text-light hidden md:block">
                Showing <span className="text-primary font-bold">{Math.min((filters.page - 1) * filters.limit + 1, total)}</span>–<span className="text-primary font-bold">{Math.min(filters.page * filters.limit, total)}</span> of <span className="text-dark font-bold">{total}</span> items
              </p>
            </div>

            <div className="flex items-center gap-4 flex-1 sm:flex-initial">
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

          {/* Product Grid */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="skeletons"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6"
              >
                {[...Array(filters.limit)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl h-80 animate-pulse shadow-sm" />
                ))}
              </motion.div>
            ) : products.length > 0 ? (
              <div className="space-y-12">
                <motion.div
                  key="grid"
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6"
                >
                  {products.map((product) => (
                    <motion.div key={product._id} variants={staggerItem}>
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 py-8 border-t border-gray-100">
                    <button
                      onClick={() => setFilters(f => ({ ...f, page: Math.max(1, f.page - 1) }))}
                      disabled={filters.page === 1}
                      className="p-2 rounded-xl border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    
                    {[...Array(totalPages)].map((_, i) => {
                      const p = i + 1;
                      // Logic to show only some pages if many exist
                      if (totalPages > 7) {
                        if (p !== 1 && p !== totalPages && Math.abs(p - filters.page) > 1) {
                          if (p === 2 || p === totalPages - 1) return <span key={p} className="px-2 text-gray-400">...</span>;
                          return null;
                        }
                      }
                      
                      return (
                        <button
                          key={p}
                          onClick={() => setFilters(f => ({ ...f, page: p }))}
                          className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                            filters.page === p 
                              ? 'bg-primary text-white shadow-md shadow-primary/20 scale-110' 
                              : 'bg-white border border-gray-100 text-light hover:border-primary hover:text-primary'
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => setFilters(f => ({ ...f, page: Math.min(totalPages, f.page + 1) }))}
                      disabled={filters.page === totalPages}
                      className="p-2 rounded-xl border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <motion.div
                key="empty"
                className="bg-white py-20 px-6 rounded-3xl text-center shadow-sm"
              >
                <Box size={48} className="mx-auto mb-4 text-gray-300" />
                <h3 className="text-2xl font-bold mb-2">No items found</h3>
                <p className="text-light mb-6">Try adjusting your filters or search term</p>
                <button
                  onClick={() => setFilters({ ...filters, category: 'All', search: '', materials: [], minPrice: '', maxPrice: '', page: 1 })}
                  className="px-6 py-2 bg-primary text-white rounded-full font-bold hover:shadow-lg transition-all"
                >
                  Clear all filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Filter Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-dark/40 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-full max-w-[320px] bg-white z-[101] shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-background/50">
                <h2 className="text-xl font-heading font-bold text-dark">Refine Selection</h2>
                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <Filters 
                  filters={filters} 
                  setFilters={(newFilters) => {
                    setFilters(newFilters);
                    // Optionally close on small screens after category selection, 
                    // but for general filters it's better to keep open.
                  }} 
                />
              </div>
              <div className="p-6 border-t border-gray-100 bg-gray-50">
                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E5E7EB;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #D1D5DB;
        }
      `}</style>
    </>
  );
}
