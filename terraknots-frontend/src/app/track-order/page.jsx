'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import { Search, Package, Truck, CheckCircle, Clock, MapPin, Inbox, XCircle } from 'lucide-react';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function TrackOrderPage() {
    const [orderId, setOrderId] = useState('');
    const [email, setEmail] = useState('');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleTrack = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSearched(true);
        try {
            const { data } = await api.post('/orders/track', { orderId, email });
            setOrder(data.order);
        } catch (error) {
            setOrder(null);
        } finally {
            setLoading(false);
        }
    };

    const statusSteps = ['placed', 'confirmed', 'packed', 'shipped', 'delivered'];
    const currentStep = order ? statusSteps.indexOf(order.orderStatus) : -1;

    return (
        <>
            <AnnouncementBar />
            <Navbar />
            <main className="min-h-screen bg-background py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <h1 className="text-5xl font-heading font-bold text-dark">Where's my knot?</h1>
                        <p className="text-light italic font-accent text-2xl">Track your handmade treasure as it travels to you.</p>
                    </div>

                    <div className="bg-white rounded-[3rem] shadow-xl shadow-primary/5 p-10 md:p-14 border border-primary/10">
                        <form onSubmit={handleTrack} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-light pl-4">Order Identity (TK-XXXXX)</label>
                                <input
                                    type="text" required
                                    className="input-field h-14"
                                    placeholder="TK-12345"
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-light pl-4">Email Address</label>
                                <input
                                    type="email" required
                                    className="input-field h-14"
                                    placeholder="hello@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <button type="submit" disabled={loading} className="w-full btn-primary h-14 text-lg">
                                    {loading ? 'Consulting the Loom...' : 'Track My Order'}
                                </button>
                            </div>
                        </form>

                        <AnimatePresence mode="wait">
                            {searched && !loading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-16 pt-16 border-t border-gray-50"
                                >
                                    {order ? (
                                        <div className="space-y-12">
                                            {/* Status Visual */}
                                            <div className="relative">
                                                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2" />
                                                <div
                                                    className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 transition-all duration-1000"
                                                    style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
                                                />
                                                <div className="relative flex justify-between">
                                                    {statusSteps.map((s, idx) => (
                                                        <div key={s} className="flex flex-col items-center space-y-4">
                                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center relative z-10 border-4 border-white transition-all ${idx <= currentStep ? 'bg-primary text-white scale-110 shadow-lg' : 'bg-gray-100 text-light'
                                                                }`}>
                                                                {idx === 0 && <Inbox size={16} />}
                                                                {idx === 1 && <CheckCircle size={16} />}
                                                                {idx === 2 && <Package size={16} />}
                                                                {idx === 3 && <Truck size={16} />}
                                                                {idx === 4 && <MapPin size={16} />}
                                                            </div>
                                                            <span className={`text-[10px] font-bold uppercase tracking-widest ${idx <= currentStep ? 'text-dark' : 'text-light'}`}>
                                                                {s}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Info Cards */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                                                <div className="p-8 bg-background rounded-3xl space-y-4">
                                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-light">Shipment Details</h4>
                                                    {order.trackingId ? (
                                                        <div className="space-y-3">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-xs font-bold text-dark">Courier</span>
                                                                <span className="text-xs text-primary font-bold">{order.courierName}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-xs font-bold text-dark">AWB / Tracking</span>
                                                                <span className="text-xs text-dark font-bold">{order.trackingId}</span>
                                                            </div>
                                                            <button className="w-full mt-4 py-3 bg-white border border-gray-100 rounded-xl text-xs font-bold text-dark hover:bg-primary/5 hover:text-primary transition-all flex items-center justify-center space-x-2">
                                                                <Search size={14} />
                                                                <span>Track on Courier Site</span>
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <p className="text-xs italic text-light">Tracking info will be available once the order is shipped.</p>
                                                    )}
                                                </div>

                                                <div className="p-8 bg-background rounded-3xl space-y-4">
                                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-light">Destination</h4>
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-bold text-dark">{order.shippingAddress.fullName}</p>
                                                        <p className="text-xs text-light leading-relaxed">
                                                            {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-20 space-y-4">
                                            <div className="w-20 h-20 bg-red-50 text-red-400 rounded-full flex items-center justify-center mx-auto">
                                                <XCircle size={40} />
                                            </div>
                                            <h3 className="text-2xl font-heading font-bold text-dark">Treasure not found</h3>
                                            <p className="text-light italic">We couldn't find an order with these details. Please double-confirm your ID and email.</p>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
