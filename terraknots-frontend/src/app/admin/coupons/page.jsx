'use client';

import { useState, useEffect } from 'react';
import {
    Ticket,
    Plus,
    Trash2,
    Calendar,
    Percent,
    CheckCircle,
    XCircle,
    Clock,
    CircleDollarSign,
    TrendingUp,
    X
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const CouponManagementPage = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        minOrderAmount: '',
        maxUses: '',
        expiryDate: '',
    });

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/coupons');
            setCoupons(data.coupons);
        } catch (error) {
            console.error('Error fetching coupons');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/coupons', formData);
            toast.success('New magic code created!');
            setShowAddModal(false);
            fetchCoupons();
            setFormData({ code: '', discountType: 'percentage', discountValue: '', minOrderAmount: '', maxUses: '', expiryDate: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create coupon');
        }
    };

    const deleteCoupon = async (id) => {
        if (!window.confirm('Revoke this magic code?')) return;
        try {
            await api.delete(`/coupons/${id}`);
            toast.success('Coupon revoked');
            fetchCoupons();
        } catch (error) {
            toast.error('Deletion failed');
        }
    };

    const toggleCoupon = async (id, current) => {
        try {
            await api.put(`/coupons/${id}`, { isActive: !current });
            fetchCoupons();
        } catch (error) {
            toast.error('Status update failed');
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-dark">Magic Codes</h1>
                    <p className="text-light italic font-accent text-lg">Manage discounts and seasonal offers.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="btn-primary h-14 px-8 flex items-center space-x-2"
                >
                    <Plus size={20} />
                    <span>Craft New Code</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {coupons.map((coupon, idx) => (
                        <motion.div
                            key={coupon._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`bg-white p-8 rounded-[2.5rem] border shadow-sm relative group overflow-hidden ${!coupon.isActive ? 'opacity-60 bg-gray-50' : 'border-gray-100 hover:border-primary/30'
                                }`}
                        >
                            {/* Decorative side cut */}
                            <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-8 h-8 rounded-full bg-background" />
                            <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-8 rounded-full bg-background" />

                            <div className="flex items-start justify-between mb-8">
                                <div className={`p-3 rounded-2xl ${coupon.isActive ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-light'}`}>
                                    <Ticket size={24} />
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => toggleCoupon(coupon._id, coupon.isActive)}
                                        className={`p-2 rounded-lg transition-all ${coupon.isActive ? 'text-green-500 hover:bg-green-50' : 'text-red-400 hover:bg-red-50'}`}
                                    >
                                        {coupon.isActive ? <CheckCircle size={18} /> : <XCircle size={18} />}
                                    </button>
                                    <button
                                        onClick={() => deleteCoupon(coupon._id)}
                                        className="p-2 text-light hover:text-red-500 transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="text-center py-4 bg-background/50 rounded-2xl border-2 border-dashed border-gray-100 mb-6">
                                    <span className="text-2xl font-heading font-bold tracking-[0.2em] text-dark">{coupon.code}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-bold uppercase tracking-widest text-light">Benefit</p>
                                        <p className="text-sm font-bold text-dark">
                                            {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                                        </p>
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <p className="text-[8px] font-bold uppercase tracking-widest text-light">Min Order</p>
                                        <p className="text-sm font-bold text-dark">₹{coupon.minOrderAmount}</p>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                                    <div className="flex items-center space-x-2 text-[10px] font-bold text-light">
                                        <Clock size={12} />
                                        <span>Exp: {format(new Date(coupon.expiryDate), 'dd MMM yy')}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-[10px] font-bold text-primary">
                                        <TrendingUp size={12} />
                                        <span>{coupon.usedCount} Uses</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {loading && (
                <div className="py-20 flex justify-center">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-dark/20 backdrop-blur-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-10 relative"
                    >
                        <button onClick={() => setShowAddModal(false)} className="absolute top-8 right-8 text-light hover:text-dark">
                            <X size={24} />
                        </button>

                        <div className="flex items-center space-x-3 mb-8">
                            <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                                <Ticket size={24} />
                            </div>
                            <h2 className="text-2xl font-heading font-bold text-dark">New Magic Code</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">Coupon Code</label>
                                <input
                                    type="text" required uppercase
                                    className="input-field h-14 uppercase tracking-widest font-bold"
                                    placeholder="e.g. FESTIVE20"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">Benefit Type</label>
                                    <select
                                        className="input-field h-14"
                                        value={formData.discountType}
                                        onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="flat">Flat Amount (₹)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">Value</label>
                                    <input
                                        type="number" required
                                        className="input-field h-14"
                                        placeholder="Value"
                                        value={formData.discountValue}
                                        onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">Min Spend</label>
                                    <input
                                        type="number" required
                                        className="input-field h-14"
                                        placeholder="Min Order ₹"
                                        value={formData.minOrderAmount}
                                        onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">Max Uses</label>
                                    <input
                                        type="number"
                                        className="input-field h-14"
                                        placeholder="Total Limit"
                                        value={formData.maxUses}
                                        onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">Expiry Date</label>
                                <input
                                    type="date" required
                                    className="input-field h-14"
                                    value={formData.expiryDate}
                                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                />
                            </div>

                            <button type="submit" className="w-full btn-primary h-14 text-lg">
                                Create Coupon
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default CouponManagementPage;
