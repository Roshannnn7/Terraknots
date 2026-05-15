'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import api from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { CheckCircle2, Package, MapPin, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import * as confettiModule from 'canvas-confetti';
const confetti = confettiModule.default || confettiModule;

const OrderSuccessPage = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await api.get(`/orders/${id}`);
                setOrder(data.order);
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#C4A882', '#8B7355', '#A8B5A2'],
                });
            } catch (error) {
                console.error('Error fetching order:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    if (loading) return null;
    if (!order) return <p>Order not found</p>;

    return (
        <>
            <AnnouncementBar />
            <Navbar />

            <main className="pt-32 pb-24 bg-background min-h-screen">
                <div className="container mx-auto px-4 max-w-4xl text-center space-y-12">

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-4"
                    >
                        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 size={56} />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-heading font-bold text-dark">Thank You For Your Order!</h1>
                        <p className="text-light italic font-accent text-xl">Your handmade treasures are being prepared with love.</p>
                        <div className="inline-block px-6 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm tracking-widest border border-primary/20">
                            ORDER ID: #{order.orderId}
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                        {/* Status & Shipping */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white p-8 rounded-[2.5rem] shadow-sm space-y-6"
                        >
                            <div className="flex items-center space-x-3 text-primary">
                                <Package size={22} />
                                <h3 className="text-xl font-heading font-bold text-dark">Delivery Status</h3>
                            </div>
                            <p className="text-sm text-light leading-relaxed">
                                We've sent a confirmation email to{' '}
                                <span className="text-dark font-bold font-body">
                                    {order.user?.email || order.guestInfo?.email || 'your inbox'}
                                </span>
                                . You will receive another update when your package is on its way.
                            </p>

                            <div className="space-y-4 pt-4 border-t border-gray-50">
                                <div className="flex items-start space-x-3">
                                    <MapPin size={18} className="text-gray-400 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-dark">Shipping To</h4>
                                        <p className="text-sm text-light mt-1">
                                            {order.shippingAddress.fullName}
                                            <br />
                                            {order.shippingAddress.addressLine1}
                                            {order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}
                                            ,<br />
                                            {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Order Summary */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white p-8 rounded-[2.5rem] shadow-sm space-y-6"
                        >
                            <h3 className="text-xl font-heading font-bold text-dark">Order Summary</h3>
                            <div className="space-y-3">
                                {order.items.map((item) => (
                                    <div key={item._id} className="flex justify-between text-sm">
                                        <span className="text-light">
                                            {item.name}{' '}
                                            <span className="text-primary font-bold">x{item.quantity}</span>
                                        </span>
                                        <span className="font-medium text-dark">
                                            {formatPrice(item.price * item.quantity)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-6 border-t border-gray-50 space-y-2">
                                <div className="flex justify-between text-sm text-light">
                                    <span>Shipping</span>
                                    <span className="text-dark">
                                        {order.shippingCharge === 0 ? 'FREE' : formatPrice(order.shippingCharge)}
                                    </span>
                                </div>
                                {order.codCharge > 0 && (
                                    <div className="flex justify-between text-sm text-light">
                                        <span>COD Charge</span>
                                        <span className="text-dark">{formatPrice(order.codCharge)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-lg font-bold pt-2">
                                    <span>Total Amount</span>
                                    <span className="text-primary">{formatPrice(order.totalAmount)}</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-8">
                        <Link href="/account/orders" className="btn-primary flex items-center space-x-2">
                            <Package size={20} />
                            <span>View My Orders</span>
                        </Link>
                        <Link href="/shop" className="btn-secondary flex items-center space-x-2">
                            <ExternalLink size={20} />
                            <span>Continue Shopping</span>
                        </Link>
                    </div>

                </div>
            </main>

            <Footer />
        </>
    );
};

export default OrderSuccessPage;
