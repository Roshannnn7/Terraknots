'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { toast } from 'react-toastify';
import {
    ArrowLeft,
    Package,
    Truck,
    User,
    MapPin,
    CreditCard,
    Clock,
    ExternalLink,
    ChevronDown,
    Printer
} from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const AdminOrderDetail = () => {
    const { id } = useParams();
    const router = useRouter();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [trackingId, setTrackingId] = useState('');
    const [courierName, setCourierName] = useState('Delhivery');

    const fetchOrder = async () => {
        try {
            const { data } = await api.get(`/orders/${id}`);
            setOrder(data.order);
            setTrackingId(data.order.trackingId || '');
            setCourierName(data.order.courierName || 'Delhivery');
        } catch (error) {
            toast.error('Error fetching order details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const updateStatus = async (status) => {
        setUpdating(true);
        try {
            await api.put(`/orders/${id}/status`, { orderStatus: status });
            toast.success(`Order marked as ${status}`);
            fetchOrder();
        } catch (error) {
            toast.error('Failed to update status');
        } finally {
            setUpdating(false);
        }
    };

    const updatePaymentStatus = async (status) => {
        try {
            await api.put(`/orders/${id}/payment-status`, { paymentStatus: status });
            toast.success(`Payment marked as ${status}`);
            fetchOrder();
        } catch (error) {
            toast.error('Failed to update payment status');
        }
    };

    const saveTracking = async () => {
        try {
            await api.put(`/orders/${id}/tracking`, { trackingId, courierName });
            toast.success('Tracking info saved!');
            fetchOrder();
        } catch (error) {
            toast.error('Failed to save tracking');
        }
    };

    if (loading) return <div className="animate-pulse h-screen bg-gray-50 rounded-[3rem]" />;
    if (!order) return <div className="text-center py-20 font-heading">Order not found</div>;

    const orderStatuses = ['placed', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'];
    const paymentStatuses = ['pending', 'paid', 'failed'];

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center space-x-4">
                    <button onClick={() => router.back()} className="p-3 bg-white rounded-2xl border border-gray-100 text-light hover:text-primary transition-all">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-dark">Order #{order.orderId}</h1>
                        <p className="text-light italic font-accent text-lg">Placed on {format(new Date(order.createdAt), 'PPPP p')}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="btn-secondary h-12 px-6 flex items-center space-x-2">
                        <Printer size={18} />
                        <span>Print Invoice</span>
                    </button>
                    <div className="relative group">
                        <button className={`h-12 px-6 rounded-2xl font-bold text-sm flex items-center space-x-2 text-white bg-dark`}>
                            <span>Status: {order.orderStatus.toUpperCase()}</span>
                            <ChevronDown size={16} />
                        </button>
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                            {orderStatuses.map(s => (
                                <button
                                    key={s}
                                    disabled={updating}
                                    onClick={() => updateStatus(s)}
                                    className="w-full px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-dark hover:bg-primary/5 hover:text-primary transition-colors disabled:opacity-50"
                                >
                                    Mark as {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left: Items & Pricing */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Items List */}
                    <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
                        <div className="flex items-center space-x-3 mb-8">
                            <Package size={20} className="text-primary" />
                            <h3 className="text-xl font-heading font-bold text-dark">Treasures Ordered</h3>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="py-6 flex items-center justify-between group">
                                    <div className="flex items-center space-x-4">
                                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform" />
                                        <div>
                                            <h4 className="font-bold text-dark text-sm">{item.name}</h4>
                                            <p className="text-[10px] text-light font-bold">₹{item.price} × {item.quantity}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-dark">₹{item.price * item.quantity}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pricing Summary */}
                        <div className="mt-8 pt-8 border-t-2 border-dashed border-gray-100 space-y-3">
                            <div className="flex justify-between text-sm text-light font-medium">
                                <span>Subtotal</span>
                                <span>₹{order.subtotal}</span>
                            </div>
                            <div className="flex justify-between text-sm text-light font-medium">
                                <span>Shipping Fee</span>
                                <span>₹{order.shippingCharge}</span>
                            </div>
                            {order.discount > 0 && (
                                <div className="flex justify-between text-sm text-green-600 font-bold">
                                    <span>Discount ({order.couponCode})</span>
                                    <span>-₹{order.discount}</span>
                                </div>
                            )}
                            {order.codCharge > 0 && (
                                <div className="flex justify-between text-sm text-light font-medium">
                                    <span>COD Collection Fee</span>
                                    <span>₹{order.codCharge}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-xl font-heading font-bold text-dark pt-3">
                                <span>Total Amount</span>
                                <span className="text-primary">₹{order.totalAmount}</span>
                            </div>
                        </div>
                    </div>

                    {/* Logistics Tracking */}
                    <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
                        <div className="flex items-center space-x-3">
                            <Truck size={20} className="text-primary" />
                            <h3 className="text-xl font-heading font-bold text-dark">Shipping & Logistics</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">Courier Partner</label>
                                    <select
                                        className="input-field h-14"
                                        value={courierName}
                                        onChange={(e) => setCourierName(e.target.value)}
                                    >
                                        <option>Delhivery</option>
                                        <option>BlueDart</option>
                                        <option>DTDC</option>
                                        <option>India Post</option>
                                        <option>Shiprocket</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-4 text-right">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-light pr-4">Tracking Number (AWB)</label>
                                    <input
                                        type="text"
                                        className="input-field h-14"
                                        placeholder="Enter AWB here..."
                                        value={trackingId}
                                        onChange={(e) => setTrackingId(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={saveTracking}
                            className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.01] transition-all"
                        >
                            Update Tracking Information
                        </button>
                    </div>
                </div>

                {/* Right: Customer & Payment */}
                <div className="space-y-8">

                    {/* Customer Info */}
                    <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm space-y-6">
                        <div className="flex items-center space-x-3">
                            <User size={18} className="text-primary" />
                            <h4 className="text-sm font-bold text-dark uppercase tracking-widest">Customer Details</h4>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3 p-3 bg-background rounded-2xl">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                    {(order.user?.name || order.guestInfo?.name || 'G')[0]}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-dark">{order.user?.name || order.guestInfo?.name}</p>
                                    <p className="text-[10px] text-light uppercase font-bold tracking-wider">{order.user ? 'Registered User' : 'Guest Checkout'}</p>
                                </div>
                            </div>
                            <div className="px-4 space-y-2">
                                <p className="text-[10px] font-bold text-light uppercase tracking-widest">Contact Information</p>
                                <p className="text-sm text-dark font-medium">{order.user?.email || order.guestInfo?.email}</p>
                                <p className="text-sm text-dark font-medium">{order.user?.phone || order.guestInfo?.phone}</p>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm space-y-6">
                        <div className="flex items-center space-x-3">
                            <MapPin size={18} className="text-primary" />
                            <h4 className="text-sm font-bold text-dark uppercase tracking-widest">Delivery Destination</h4>
                        </div>
                        <div className="px-4 space-y-2">
                            <p className="text-[10px] font-bold text-light uppercase tracking-widest">{order.shippingAddress.fullName}</p>
                            <p className="text-sm text-dark font-medium leading-relaxed">
                                {order.shippingAddress.addressLine1},<br />
                                {order.shippingAddress.addressLine2 && <>{order.shippingAddress.addressLine2},<br /></>}
                                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                            </p>
                            {order.shippingAddress.landmark && (
                                <p className="text-[10px] italic text-light">Landmark: {order.shippingAddress.landmark}</p>
                            )}
                        </div>
                    </div>

                    {/* Payment Detail */}
                    <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm space-y-6">
                        <div className="flex items-center space-x-3">
                            <CreditCard size={18} className="text-primary" />
                            <h4 className="text-sm font-bold text-dark uppercase tracking-widest">Payment Flow</h4>
                        </div>
                        <div className="px-4 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-light uppercase">Method</span>
                                <span className="text-xs font-bold text-dark uppercase tracking-widest">{order.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-light uppercase">Status</span>
                                <div className="relative group">
                                    <button className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center space-x-1 ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600 hover:bg-red-200'
                                        }`}>
                                        <span>{order.paymentStatus}</span>
                                        <ChevronDown size={12} />
                                    </button>
                                    <div className="absolute right-0 top-full mt-2 w-32 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                                        {paymentStatuses.map(ps => (
                                            <button
                                                key={ps}
                                                onClick={() => updatePaymentStatus(ps)}
                                                className="w-full px-4 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-dark hover:bg-background transition-colors"
                                            >
                                                {ps}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {order.manualPaymentTransactionId && (
                                <div className="p-3 bg-background rounded-xl border border-primary/10">
                                    <p className="text-[10px] font-bold uppercase text-light mb-1">Transaction ID</p>
                                    <p className="text-xs font-bold text-primary break-all">{order.manualPaymentTransactionId}</p>
                                </div>
                            )}
                            {order.razorpayPaymentId && (
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-light uppercase">RP ID</span>
                                    <span className="text-[10px] font-bold text-dark">{order.razorpayPaymentId}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Notes */}
                    {order.orderNotes && (
                        <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm space-y-3">
                            <div className="flex items-center space-x-2 text-light uppercase tracking-[0.2em] text-[10px] font-bold">
                                <Clock size={14} />
                                <span>Note from Customer</span>
                            </div>
                            <p className="text-sm text-dark italic leading-relaxed">"{order.orderNotes}"</p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default AdminOrderDetail;
