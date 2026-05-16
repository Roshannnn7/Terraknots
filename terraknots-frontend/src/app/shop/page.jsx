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

    useEffect(() => {
        const fetchCats = async () => {
            try {
                const res = await api.get('/categories');
                setCategories(res.data.data || []);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCats();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let queryString = `?page=${filters.page}&limit=${filters.limit}&category=${filters.category}&search=${filters.search}&sortBy=${filters.sortBy}`;

                if (filters.minPrice) queryString += `&minPrice=${filters.minPrice}`;
                if (filters.maxPrice) queryString += `&maxPrice=${filters.maxPrice}`;
                if (filters.materials.length > 0) queryString += `&materials=${filters.materials.join(',')}`;
                if (filters.inStock) queryString += `&inStock=true`;

                const { data } = await api.get(`/products${queryString}`);
                setProducts(data.products || []);
                setTotal(data.total || 0);
            } catch (error) {
                console.error('Error fetching products:', error);
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
                {/* Shop Header Area */}
                <div className="relative py-20 overflow-hidden" style={{ background: 'linear-gradient(180deg, #F5F0EB 0%, #FAF8F5 100%)' }}>
                    {/* Decorative Blobs */}
                    <motion.div className="absolute top-0 right-10 w-64 h-64 rounded-full pointer-events-none opacity-40 mix-blend-multiply"
                        style={{ background: 'radial-gradient(circle, rgba(196,168,130,0.5) 0%, transparent 70%)' }}
                        animate={{ scale: [1, 1.2, 1], x: [0, 20, 0] }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.div className="absolute bottom-0 left-10 w-80 h-80 rounded-full pointer-events-none opacity-40 mix-blend-multiply"
                        style={{ background: 'radial-gradient(circle, rgba(168,181,162,0.5) 0%, transparent 70%)' }}
                        animate={{ scale: [1, 1.1, 1], x: [0, -15, 0] }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    />

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

                        {/* Desktop Sidebar Filters */}
                        <aside className="hidden lg:block w-72 flex-shrink-0">
                            <div className="sticky top-32 p-6 rounded-3xl bg-white/50 backdrop-blur-sm border border-gray-100"
                                style={{ boxShadow: '0 4px 40px rgba(139,115,85,0.05)' }}
                            >
                                <Filters filters={filters} setFilters={setFilters} />
                            </div>
                        </aside>

                        {/* Main Shop Content */}
                        <div className="flex-1">
                            {/* Toolbar */}
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
                                    {/* Search input */}
                                    <div className="relative group flex-1 sm:w-64">
                                        <input
                                            type="text"
                                            placeholder="Search treasures..."
                                            value={filters.search}
                                            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                                            className="w-full bg-background border-0 rounded-full py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-400 font-medium"
                                        />
                                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                                        {filters.search && (
                                            <button 
                                                onClick={() => setFilters({ ...filters, search: '', page: 1 })}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-dark"
                                            >
                                                <X size={14} />
                                            </button>
                                        )}
                                    </div>
                                    {/* Sort Dropdown */}
                                    <div className="hidden sm:block shrink-0">
                                        <Sort value={filters.sortBy} onChange={(val) => setFilters({ ...filters, sortBy: val, page: 1 })} />
                                    </div>
                                </div>
                            </div>

                            {/* Mobile sort row */}
                            <div className="sm:hidden flex justify-end mb-6">
                                <Sort value={filters.sortBy} onChange={(val) => setFilters({ ...filters, sortBy: val, page: 1 })} />
                            </div>

                            {/* Applied Filters Tags */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {filters.category !== 'All' && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                                        Category: {categories.find(c => c.name === filters.category || c._id === filters.category)?.name || filters.category}
                                        <button onClick={() => setFilters({ ...filters, category: 'All', page: 1 })}><X size={12} /></button>
                                    </span>
                                )}
                                {filters.inStock && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                        In Stock Only
                                        <button onClick={() => setFilters({ ...filters, inStock: false, page: 1 })}><X size={12} /></button>
                                    </span>
                                )}
                                {filters.materials.map(mat => (
                                    <span key={mat} className="inline-flex items-center gap-1.5 px-3 py-1 bg-background text-dark text-xs font-bold rounded-full border border-gray-200">
                                        {mat}
                                        <button onClick={() => setFilters({ ...filters, materials: filters.materials.filter(m => m !== mat), page: 1 })}><X size={12} /></button>
                                    </span>
                                ))}
                            </div>

                            {/* Grid / Skeletons */}
                            <AnimatePresence mode="wait">
                                {loading ? (
                                    <motion.div
                                        key="skeletons"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8"
                                    >
                                        {[...Array(9)].map((_, i) => (
                                            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm" style={{ boxShadow: '0 4px 20px rgba(139,115,85,0.06)' }}>
                                                <div className="w-full aspect-[4/5] bg-gray-100 animate-pulse" />
                                                <div className="p-4 space-y-3">
                                                    <div className="h-3 w-1/4 bg-gray-100 animate-pulse rounded-lg" />
                                                    <div className="h-4 w-3/4 bg-gray-100 animate-pulse rounded-lg" />
                                                    <div className="h-5 w-1/3 bg-gray-100 animate-pulse rounded-lg mt-2" />
                                                </div>
                                            </div>
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
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white py-20 px-6 rounded-3xl text-center border border-gray-100 shadow-sm"
                                    >
                                        <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Box size={32} className="text-light" />
                                        </div>
                                        <h3 className="text-2xl font-heading font-bold text-dark mb-2">No items found</h3>
                                        <p className="text-light max-w-sm mx-auto mb-8">
                                            We couldn't find any products matching your current filters. Try adjusting them or clear all filters to see our full collection.
                                        </p>
                                        <button
                                            onClick={() => setFilters({
                                                category: 'All', minPrice: '', maxPrice: '', materials: [], inStock: false, search: '', sortBy: 'newest', page: 1, limit: 12
                                            })}
                                            className="btn-primary"
                                        >
                                            Clear All Filters
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Pagination Logic */}
                            {!loading && total > filters.limit && (
                                <div className="mt-16 flex justify-center items-center gap-2">
                                    <button
                                        disabled={filters.page === 1}
                                        onClick={() => {
                                            setFilters({ ...filters, page: filters.page - 1 });
                                            window.scrollTo({ top: 300, behavior: 'smooth' });
                                        }}
                                        className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-200 text-dark hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                    >
                                        ←
                                    </button>

                                    <div className="flex gap-1">
                                        {[...Array(Math.ceil(total / filters.limit))].map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    setFilters({ ...filters, page: i + 1 });
                                                    window.scrollTo({ top: 300, behavior: 'smooth' });
                                                }}
                                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                                                    filters.page === i + 1
                                                        ? 'bg-primary text-white shadow-lg scale-110'
                                                        : 'bg-white text-dark border border-transparent hover:border-gray-200'
                                                }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        disabled={filters.page === Math.ceil(total / filters.limit)}
                                        onClick={() => {
                                            setFilters({ ...filters, page: filters.page + 1 });
                                            window.scrollTo({ top: 300, behavior: 'smooth' });
                                        }}
                                        className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-200 text-dark hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                    >
                                        →
                                    </button>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </main>

            {/* Mobile Filters Drawer */}
            <AnimatePresence>
                {isMobileFilterOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileFilterOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="fixed right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white z-[70] shadow-2xl flex flex-col"
                            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0)' }}
                        >
                            <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                <h3 className="text-xl font-heading font-bold text-dark">Filters</h3>
                                <button
                                    onClick={() => setIsMobileFilterOpen(false)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-6">
                                <Filters filters={filters} setFilters={setFilters} />
                            </div>

                            <div className="p-6 border-t border-gray-100">
                                <button
                                    onClick={() => setIsMobileFilterOpen(false)}
                                    className="w-full btn-primary"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <Footer />
        </>
    );
}
