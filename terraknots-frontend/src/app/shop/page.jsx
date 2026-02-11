'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/common/ProductCard';
import Filters from '@/components/shop/Filters';
import Sort from '@/components/shop/Sort';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const ShopPage = () => {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    const [filters, setFilters] = useState({
        category: searchParams.get('category') || 'All',
        search: searchParams.get('search') || '',
        minPrice: '',
        maxPrice: '',
        materials: [],
        inStock: false,
        sortBy: 'newest',
        page: 1,
        limit: 12
    });

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
                setProducts(data.products);
                setTotal(data.total);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [filters]);

    return (
        <>
            <AnnouncementBar />
            <Navbar />

            <main className="pt-28 pb-24 bg-background overflow-hidden">
                {/* Page Header */}
                <div className="bg-white py-12 mb-12">
                    <div className="container mx-auto px-4 text-center space-y-4">
                        <h1 className="text-4xl md:text-6xl font-heading font-bold text-dark">Our Shop</h1>
                        <p className="text-light italic font-accent text-xl">Discover items made with patience and heart</p>
                    </div>
                </div>

                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Desktop Filters Sidebar */}
                        <aside className="hidden lg:block w-72 flex-shrink-0">
                            <div className="sticky top-32">
                                <Filters filters={filters} setFilters={setFilters} />
                            </div>
                        </aside>

                        {/* Main Content Area */}
                        <div className="flex-1">
                            {/* Toolbar */}
                            <div className="flex flex-wrap items-center justify-between mb-10 gap-4 bg-white p-6 rounded-2xl shadow-sm">
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => setIsMobileFilterOpen(true)}
                                        className="lg:hidden flex items-center space-x-2 text-dark font-bold text-sm bg-background px-4 py-2 rounded-xl"
                                    >
                                        <SlidersHorizontal size={18} />
                                        <span>Filters</span>
                                    </button>
                                    <p className="text-sm text-light hidden sm:block">
                                        Showing <span className="font-bold text-dark">{products.length}</span> of <span className="font-bold text-dark">{total}</span> products
                                    </p>
                                </div>

                                <div className="flex items-center space-x-6">
                                    {/* Search Bar */}
                                    <div className="relative group hidden md:block">
                                        <input
                                            type="text"
                                            placeholder="Search unique pieces..."
                                            value={filters.search}
                                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                            className="bg-background border-0 rounded-full py-2 pl-10 pr-4 text-sm w-64 focus:ring-1 focus:ring-primary outline-none transition-all"
                                        />
                                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-light group-focus-within:text-primary" />
                                    </div>
                                    <Sort value={filters.sortBy} onChange={(val) => setFilters({ ...filters, sortBy: val })} />
                                </div>
                            </div>

                            {/* Product Grid */}
                            {loading ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className="aspect-[4/5] bg-gray-100 animate-pulse rounded-2xl" />
                                    ))}
                                </div>
                            ) : products.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                                    <AnimatePresence>
                                        {products.map((product, idx) => (
                                            <motion.div
                                                key={product._id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                            >
                                                <ProductCard product={product} />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <div className="text-center py-24 bg-white rounded-3xl space-y-6">
                                    <div className="w-24 h-24 bg-background rounded-full flex items-center justify-center mx-auto">
                                        <Search size={40} className="text-light" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-heading font-bold">No results found</h3>
                                        <p className="text-light max-w-xs mx-auto">Try adjusting your filters or search keywords to find what you are looking for.</p>
                                    </div>
                                    <button
                                        onClick={() => setFilters({ ...filters, category: 'All', search: '', materials: [], inStock: false })}
                                        className="btn-primary"
                                    >
                                        Clear All Filters
                                    </button>
                                </div>
                            )}

                            {/* Pagination */}
                            {total > filters.limit && (
                                <div className="mt-16 flex justify-center space-x-2">
                                    <button
                                        disabled={filters.page === 1}
                                        onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                                        className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    >
                                        ←
                                    </button>
                                    {[...Array(Math.ceil(total / filters.limit))].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setFilters({ ...filters, page: i + 1 })}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${filters.page === i + 1
                                                    ? 'bg-primary text-white shadow-lg scale-110'
                                                    : 'bg-white text-dark hover:bg-gray-50'
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                    <button
                                        disabled={filters.page === Math.ceil(total / filters.limit)}
                                        onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                                        className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    >
                                        →
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Mobile Filters Modal */}
            <AnimatePresence>
                {isMobileFilterOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileFilterOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            className="fixed right-0 top-0 bottom-0 w-[80%] max-w-sm bg-white z-[65] p-8 overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-heading font-bold">Filters</h3>
                                <button onClick={() => setIsMobileFilterOpen(false)}><X size={24} /></button>
                            </div>
                            <Filters filters={filters} setFilters={setFilters} />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <Footer />
        </>
    );
};

export default ShopPage;
