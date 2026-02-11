'use client';

import { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    Eye,
    Truck,
    CheckCircle,
    Clock,
    XCircle,
    Search as SearchIcon
} from 'lucide-react';
import api from '@/lib/api';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const OrderListPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [status, setStatus] = useState('All');
    const [search, setSearch] = useState('');

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/orders?page=${page}&limit=10&status=${status === 'All' ? '' : status.toLowerCase()}&search=${search}`);
            setOrders(data.orders);
            setTotalPages(data.pages);
        } catch (error) {
            toast.error('Error fetching orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [page, status]);

    const getStatusStyle = (s) => {
        switch (s) {
            case 'delivered': return 'bg-green-100 text-green-600';
            case 'shipped': return 'bg-blue-100 text-blue-600';
            case 'packed': return 'bg-purple-100 text-purple-600';
            case 'confirmed': return 'bg-cyan-100 text-cyan-600';
            case 'cancelled': return 'bg-red-100 text-red-600';
            default: return 'bg-orange-100 text-orange-600';
        }
    };

    const getStatusIcon = (s) => {
        switch (s) {
            case 'delivered': return <CheckCircle size={14} />;
            case 'shipped': return <Truck size={14} />;
            case 'packed': return <Clock size={14} />;
            case 'cancelled': return <XCircle size={14} />;
            default: return <Clock size={14} />;
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-heading font-bold text-dark">Order Registry</h1>
                <p className="text-light italic font-accent text-lg">Tracks every knot that leaves the workshop.</p>
            </div>

            {/* Toolbar */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[300px] relative group">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-light group-focus-within:text-primary transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search by Order ID or email..."
                        className="w-full bg-background border-none rounded-2xl pl-12 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && fetchOrders()}
                    />
                </div>

                <div className="flex bg-background p-1.5 rounded-2xl">
                    {['All', 'Placed', 'Confirmed', 'Shipped', 'Delivered'].map(s => (
                        <button
                            key={s}
                            onClick={() => { setStatus(s); setPage(1); }}
                            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${status === s ? 'bg-primary text-white shadow-md' : 'text-light hover:text-dark'
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden min-h-[500px] relative">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-background/50">
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-light">Order ID</th>
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-light">Customer</th>
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-light">Placed On</th>
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-light">Total</th>
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-light">Method</th>
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-light">Status</th>
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-light text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            <AnimatePresence mode="popLayout">
                                {orders.map((order, idx) => (
                                    <motion.tr
                                        key={order._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.03 }}
                                        className="group hover:bg-background/30 transition-colors"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="text-sm font-bold text-primary">#{order.orderId}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-sm font-bold text-dark">{order.user?.name || order.guestInfo?.name}</div>
                                            <div className="text-[10px] text-light">{order.user?.email || order.guestInfo?.email}</div>
                                        </td>
                                        <td className="px-8 py-6 text-xs text-light font-medium">
                                            {format(new Date(order.createdAt), 'dd MMM yyyy')}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-sm font-bold text-dark">₹{order.totalAmount}</div>
                                            <div className="text-[10px] text-light">{order.items.length} Items</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-light border border-gray-100 px-2 py-1 rounded-lg bg-white">
                                                {order.paymentMethod}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(order.orderStatus)}`}>
                                                {getStatusIcon(order.orderStatus)}
                                                <span>{order.orderStatus}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <Link
                                                href={`/admin/orders/${order._id}`}
                                                className="p-3 bg-background text-primary rounded-xl hover:bg-primary hover:text-white transition-all inline-block"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {loading && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
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

export default OrderListPage;
