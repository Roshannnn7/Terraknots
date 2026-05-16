'use client';

import { useState, useEffect } from 'react';
import {
    Users,
    Search,
    ChevronLeft,
    ChevronRight,
    ShoppingBag,
    ExternalLink,
    Mail,
    Smartphone
} from 'lucide-react';
import api from '@/lib/api';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const CustomerListPage = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/admin/customers?page=${page}&limit=10&search=${search}`);
            setCustomers(data?.customers || data?.data || []);
            setTotalPages(data?.pages || 1);
        } catch (error) {
            console.error('Error fetching customers:', error);
            setCustomers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, [page]);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-heading font-bold text-dark">Customer Base</h1>
                <p className="text-light italic font-accent text-lg">Your community of handmade lovers.</p>
            </div>

            {/* Toolbar */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-light group-focus-within:text-primary transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full bg-background border-none rounded-2xl pl-12 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && fetchCustomers()}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden min-h-[500px] relative">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-background/50">
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-light">User Profile</th>
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-light">Joined On</th>
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-light">Orders</th>
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-light">Total LTV</th>
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-light text-right">Quick Contact</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            <AnimatePresence mode="popLayout">
                                {(customers || []).map((customer, idx) => (
                                    <motion.tr
                                        key={customer._id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.03 }}
                                        className="group hover:bg-background/30 transition-colors"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shadow-sm">
                                                    {customer?.name?.[0] || '?'}
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-dark">{customer.name}</h4>
                                                    <span className="text-[10px] text-light uppercase tracking-wider font-bold">UID: {customer._id.slice(-6).toUpperCase()}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-xs text-light font-medium">
                                            {format(new Date(customer.createdAt), 'dd MMM yyyy')}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center space-x-2">
                                                <ShoppingBag size={14} className="text-primary" />
                                                <span className="text-sm font-bold text-dark">{customer.orderCount} Orders</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-sm font-bold text-primary">₹{(customer?.totalSpent || 0).toLocaleString()}</div>
                                            <p className="text-[10px] text-light uppercase tracking-widest font-bold">Customer Value</p>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <a href={`mailto:${customer.email}`} className="p-3 bg-background text-light hover:text-primary rounded-xl transition-all">
                                                    <Mail size={18} />
                                                </a>
                                                {customer.phone && (
                                                    <a href={`tel:${customer.phone}`} className="p-3 bg-background text-light hover:text-accent rounded-xl transition-all">
                                                        <Smartphone size={18} />
                                                    </a>
                                                )}
                                                <button className="p-3 bg-background text-light hover:text-dark rounded-xl transition-all">
                                                    <ExternalLink size={18} />
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
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-10">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-8 py-8 border-t border-gray-50 flex items-center justify-between">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-light">Page {page} of {totalPages}</p>
                        <div className="flex items-center space-x-2">
                            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-3 bg-background rounded-xl disabled:opacity-30 hover:bg-primary/5 text-primary">
                                <ChevronLeft size={18} />
                            </button>
                            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="p-3 bg-background rounded-xl disabled:opacity-30 hover:bg-primary/5 text-primary">
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerListPage;
