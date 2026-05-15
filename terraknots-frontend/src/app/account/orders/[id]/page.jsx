'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Package, ArrowLeft, Copy, CheckCircle, Truck, MapPin, CreditCard, Clock, Download, RefreshCw } from 'lucide-react';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const STATUS_STEPS = ['placed', 'processing', 'shipped', 'delivered'];

const STATUS_COLORS = {
    placed: { bg: '#EBF4FF', text: '#3B82F6', label: 'Order Placed' },
    processing: { bg: '#FEF3C7', text: '#D97706', label: 'Processing' },
    shipped: { bg: '#E0E7FF', text: '#6366F1', label: 'Shipped' },
    delivered: { bg: '#D1FAE5', text: '#059669', label: 'Delivered' },
    cancelled: { bg: '#FEE2E2', text: '#DC2626', label: 'Cancelled' },
};

export default function OrderDetailPage() {
    const { id } = useParams();
    const { isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) router.push('/login');
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        if (!isAuthenticated || !id) return;
        const fetchOrder = async () => {
            try {
                const { data } = await api.get(`/orders/${id}`);
                setOrder(data.order);
            } catch {
                router.push('/account/orders');
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id, isAuthenticated, router]);

    const copyOrderId = () => {
        navigator.clipboard.writeText(id);
        setCopied(true);
        toast.success('Order ID copied!');
        setTimeout(() => setCopied(false), 2000);
    };

    if (authLoading || loading) {
        return (
            <>
                <AnnouncementBar />
                <Navbar />
                <main className="min-h-screen pt-[108px] pb-24 bg-background">
                    <div className="container max-w-3xl py-12">
                        <div className="skeleton h-96 rounded-3xl" />
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    if (!order) return null;

    const statusInfo = STATUS_COLORS[order.orderStatus] || STATUS_COLORS.placed;
    const currentStepIndex = STATUS_STEPS.indexOf(order.orderStatus);
    const isCancelled = order.orderStatus === 'cancelled';

    return (
        <>
            <AnnouncementBar />
            <Navbar />
            <main className="min-h-screen pt-[108px] pb-24 bg-background">
                <div className="container max-w-3xl py-10">
                    {/* Back */}
                    <Link href="/account/orders" className="inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:text-primary mb-6 transition-colors">
                        <ArrowLeft size={16} /> Back to Orders
                    </Link>

                    {/* Header Card */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl p-6 md:p-8 mb-4" style={{ boxShadow: '0 4px 20px rgba(139,115,85,0.08)' }}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="font-heading font-bold text-dark text-xl">Order Details</h1>
                                    <span className="text-xs font-bold px-3 py-1 rounded-full"
                                        style={{ backgroundColor: statusInfo.bg, color: statusInfo.text }}>
                                        {statusInfo.label}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm text-light font-mono">#{id.slice(-10).toUpperCase()}</p>
                                    <button onClick={copyOrderId} className="text-light hover:text-primary transition-colors">
                                        {copied ? <CheckCircle size={14} className="text-success" /> : <Copy size={14} />}
                                    </button>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-light mb-1">Order placed</p>
                                <p className="text-sm font-bold text-dark">
                                    {order.createdAt ? format(new Date(order.createdAt), 'dd MMM yyyy, hh:mm a') : 'N/A'}
                                </p>
                            </div>
                        </div>

                        {/* Progress tracker */}
                        {!isCancelled && (
                            <div className="py-6 border-t border-b border-gray-50 mb-6">
                                <div className="flex items-center justify-between relative">
                                    {STATUS_STEPS.map((step, i) => {
                                        const done = i <= currentStepIndex;
                                        return (
                                            <div key={step} className="flex flex-col items-center z-10 flex-1">
                                                <motion.div
                                                    initial={{ scale: 0.5 }}
                                                    animate={{ scale: 1 }}
                                                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${done ? 'border-primary bg-primary text-white' : 'border-gray-200 bg-white text-light'}`}
                                                >
                                                    {done ? <CheckCircle size={16} /> : i + 1}
                                                </motion.div>
                                                <p className={`text-[10px] font-bold mt-2 capitalize ${done ? 'text-primary' : 'text-light'}`}>
                                                    {step}
                                                </p>
                                                {i < STATUS_STEPS.length - 1 && (
                                                    <div className="absolute top-4.5 h-0.5 transition-all duration-500"
                                                        style={{
                                                            left: `${(100 / STATUS_STEPS.length) * (i + 0.5)}%`,
                                                            width: `${100 / STATUS_STEPS.length}%`,
                                                            backgroundColor: i < currentStepIndex ? '#C4A882' : '#E5E7EB',
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Order Items */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-dark text-sm uppercase tracking-widest">Items Ordered</h3>
                            {(order.orderItems || order.items || []).map((item, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                                        <img
                                            src={item.image || `https://picsum.photos/seed/${item.product || i}/100/100`}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-dark text-sm line-clamp-1">{item.name}</p>
                                        <p className="text-xs text-light">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-bold text-dark text-sm flex-shrink-0">
                                        {formatPrice(item.price * item.quantity)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Info Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        {/* Shipping */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl p-6" style={{ boxShadow: '0 4px 20px rgba(139,115,85,0.06)' }}>
                            <div className="flex items-center gap-2 mb-4">
                                <MapPin size={16} className="text-primary" />
                                <h3 className="font-bold text-dark text-sm uppercase tracking-widest">Shipping To</h3>
                            </div>
                            <div className="text-sm text-light space-y-1">
                                <p className="font-bold text-dark">{order.shippingAddress?.name || order.shippingAddress?.fullName}</p>
                                <p>{order.shippingAddress?.street}</p>
                                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                                <p>{order.shippingAddress?.pincode}</p>
                                <p>{order.shippingAddress?.phone}</p>
                            </div>
                        </motion.div>

                        {/* Payment */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl p-6" style={{ boxShadow: '0 4px 20px rgba(139,115,85,0.06)' }}>
                            <div className="flex items-center gap-2 mb-4">
                                <CreditCard size={16} className="text-primary" />
                                <h3 className="font-bold text-dark text-sm uppercase tracking-widest">Payment</h3>
                            </div>
                            <div className="text-sm space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-light">Method</span>
                                    <span className="font-bold text-dark capitalize">{order.paymentMethod || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-light">Status</span>
                                    <span className={`font-bold ${order.paymentStatus === 'paid' ? 'text-success' : 'text-warning'}`}>
                                        {order.paymentStatus === 'paid' ? '✓ Paid' : 'Pending'}
                                    </span>
                                </div>
                                <div className="border-t border-gray-100 pt-2 mt-2">
                                    <div className="flex justify-between text-xs text-light mb-1">
                                        <span>Subtotal</span><span>{formatPrice(order.itemsPrice || 0)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-light mb-1">
                                        <span>Shipping</span><span>{formatPrice(order.shippingPrice || 0)}</span>
                                    </div>
                                    {order.couponDiscount > 0 && (
                                        <div className="flex justify-between text-xs text-success mb-1">
                                            <span>Discount</span><span>-{formatPrice(order.couponDiscount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between font-bold text-dark text-sm pt-2 border-t border-gray-100 mt-2">
                                        <span>Total</span><span>{formatPrice(order.totalPrice || order.totalAmount)}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Actions */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="flex flex-wrap gap-3">
                        <Link href="/track-order">
                            <button className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-dark bg-white border border-gray-100 hover:border-primary/30 transition-all"
                                style={{ boxShadow: '0 2px 8px rgba(139,115,85,0.06)' }}>
                                <Truck size={15} /> Track Order
                            </button>
                        </Link>
                        <Link href="/contact">
                            <button className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-dark bg-white border border-gray-100 hover:border-primary/30 transition-all"
                                style={{ boxShadow: '0 2px 8px rgba(139,115,85,0.06)' }}>
                                <RefreshCw size={15} /> Need Help?
                            </button>
                        </Link>
                        <button
                            onClick={() => window.print()}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-dark bg-white border border-gray-100 hover:border-primary/30 transition-all no-print"
                            style={{ boxShadow: '0 2px 8px rgba(139,115,85,0.06)' }}>
                            <Download size={15} /> Download Invoice
                        </button>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </>
    );
}
