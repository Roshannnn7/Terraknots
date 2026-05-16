'use client';

import { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Filter,
    Edit2,
    Trash2,
    Eye,
    ChevronLeft,
    ChevronRight,
    Package,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { safeGet, safeDelete } from '@/lib/apiClient';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const ProductListPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [category, setCategory] = useState('All');
    const [categoriesList, setCategoriesList] = useState([]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await safeGet(`/products?page=${page}&limit=10&search=${search}&category=${category === 'All' ? '' : category}`, {
                products: [],
                pages: 1
            });
            setProducts(data?.products || []);
            setTotalPages(data?.pages || 1);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Error fetching products');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await safeGet('/categories', { data: [] });
                setCategoriesList(data?.data || []);
            } catch (err) {
                console.error('Error fetching categories:', err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchProducts();
        }, 500);
        return () => clearTimeout(timer);
    }, [page, category, search]);

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            setPage(1);
            fetchProducts();
        }
    };

    const deleteProduct = async (id) => {
        if (!window.confirm('Are you sure you want to delete this treasure?')) return;
        const result = await safeDelete(`/products/${id}`);
        if (result.success) {
            toast.success('Product deleted successfully');
            fetchProducts();
        } else {
            toast.error(result.error || 'Error deleting product');
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-dark">Treasure Catalog</h1>
                    <p className="text-light italic font-accent text-lg">Manage all your handmade creations here.</p>
                </div>
                <Link href="/admin/products/new" className="btn-primary h-14 px-8 flex items-center space-x-2">
                    <Plus size={20} />
                    <span>Add New Piece</span>
                </Link>
            </div>

            {/* Toolbar */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[300px] relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-light group-focus-within:text-primary transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search products by name or tag..."
                        className="w-full bg-background border-none rounded-2xl pl-12 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={handleSearch}
                    />
                </div>

                <select
                    className="bg-background border-none rounded-2xl px-6 py-3 text-sm font-bold text-dark outline-none cursor-pointer hover:bg-primary/5 transition-colors"
                    value={category}
                    onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                >
                    <option value="All">All Categories</option>
                    {categoriesList.map(cat => (
                        <option key={cat._id} value={cat.name}>{cat.name}</option>
                    ))}
                </select>

                <button className="p-3 bg-background text-light rounded-2xl hover:text-primary transition-colors">
                    <Filter size={20} />
                </button>
            </div>

            {/* Product Table */}
            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden min-h-[500px] relative">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-background/50">
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-light">Product</th>
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-light">Category</th>
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-light">Price</th>
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-light">Stock</th>
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-light">Status</th>
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-light text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            <AnimatePresence mode="popLayout">
                                {(products || []).map((product, idx) => (
                                    <motion.tr
                                        key={product._id || idx}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: idx * 0.03 }}
                                        className="group hover:bg-background/30 transition-colors"
                                    >
                                        <td className="px-8 py-4">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm border border-gray-50 flex-shrink-0">
                                                    <img src={product?.images?.[0] || 'https://via.placeholder.com/150'} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="text-sm font-bold text-dark truncate max-w-[200px]">{product?.name || 'Untitled'}</h4>
                                                    <p className="text-[10px] text-light font-medium truncate">SKU: TK-{product?._id?.slice(-6).toUpperCase() || 'XXXXXX'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-bold uppercase tracking-wider">
                                                {product?.category || 'Uncategorized'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4">
                                             <div className="text-sm font-bold text-dark">₹{product?.salePrice || product?.price || 0}</div>
                                             {product?.salePrice && product?.price && Number(product.salePrice) < Number(product.price) && (
                                                 <div className="text-[10px] text-light line-through">₹{product?.price}</div>
                                             )}
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className={`text-xs font-bold ${product?.stock < 5 ? 'text-red-500' : 'text-dark'}`}>
                                                {product?.stock || 0} Units
                                            </div>
                                            <div className="w-20 h-1 bg-gray-100 rounded-full mt-2 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${product?.stock < 5 ? 'bg-red-500' : 'bg-green-500'}`}
                                                    style={{ width: `${Math.min(((product?.stock || 0) / 20) * 100, 100)}%` }}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex items-center space-x-2">
                                                {product?.isActive ? (
                                                    <CheckCircle size={14} className="text-green-500" />
                                                ) : (
                                                    <XCircle size={14} className="text-red-400" />
                                                )}
                                                <span className={`text-[10px] font-bold uppercase tracking-wider ${product?.isActive ? 'text-green-600' : 'text-red-400'}`}>
                                                    {product?.isActive ? 'Active' : 'Hidden'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Link href={`/product/${product?.slug}`} target="_blank" className="p-2 text-light hover:text-primary transition-colors">
                                                    <Eye size={18} />
                                                </Link>
                                                <Link href={`/admin/products/${product?._id}/edit`} className="p-2 text-light hover:text-accent transition-colors">
                                                    <Edit2 size={18} />
                                                </Link>
                                                <button onClick={() => deleteProduct(product?._id)} className="p-2 text-light hover:text-red-500 transition-colors">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {loading && (
                    <div className="absolute inset-x-0 bottom-0 top-20 bg-white/60 backdrop-blur-sm flex items-center justify-center z-20">
                        <div className="w-10 h-10 border-4 border-[#C4A882] border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                {/* Empty State */}
                {!loading && (products || []).length === 0 && (
                    <div className="py-32 flex flex-col items-center justify-center space-y-4">
                        <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center text-primary/30">
                            <Package size={40} />
                        </div>
                        <p className="text-lg font-bold text-dark">No pieces found.</p>
                        <button onClick={() => { setSearch(''); setCategory('All'); fetchProducts(); }} className="text-sm font-bold text-[#C4A882] underline">Clear all filters</button>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-8 py-8 border-t border-gray-50 flex items-center justify-between">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-light">Page {page} of {totalPages}</p>
                        <div className="flex items-center space-x-2">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(p => p - 1)}
                                className="p-3 bg-background rounded-xl disabled:opacity-30 hover:bg-primary/5 text-primary transition-colors"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage(p => p + 1)}
                                className="p-3 bg-background rounded-xl disabled:opacity-30 hover:bg-primary/5 text-primary transition-colors"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductListPage;
