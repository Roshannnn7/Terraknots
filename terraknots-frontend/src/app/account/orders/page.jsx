'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import api from '@/lib/api';
import { formatPrice, formatDate, getStatusInfo } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Package, ChevronRight, ShoppingBag, MapPin, Calendar } from 'lucide-react';
import Image from 'next/image';

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/orders/my-orders');
                setOrders(data.orders);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    return (
        <>
            <AnnouncementBar />
            <Navbar />

            <main className="pt-32 pb-24 bg-background min-h-screen">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

                        {/* Sidebar Navigation */}
                        <aside className="lg:col-span-1 space-y-4">
                            <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden p-2 sticky top-32">
                                <Link href="/account" className="flex items-center space-x-3 px-6 py-4 rounded-2xl text-light hover:bg-background transition-all">
                                    <Package size={20} />
                                    <span>My Profile</span>
                                </Link>
                                <Link href="/account/orders" className="flex items-center space-x-3 px-6 py-4 rounded-2xl bg-primary/10 text-primary font-bold transition-all">
                                    <ShoppingBag size={20} />
                                    <span>Order History</span>
                                </Link>
                            </div>
                        </aside>

                        {/* Main Content */}
                        <div className="lg:col-span-3 space-y-8">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-heading font-bold text-dark">Your Orders</h2>
                                <p className="text-light italic">History of all your treasures from TerraKnots.</p>
                            </div>

                            {loading ? (
                                <div className="space-y-4">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="h-48 bg-white animate-pulse rounded-[2.5rem]" />
                                    ))}
                                </div>
                            ) : orders.length > 0 ? (
                                <div className="space-y-6">
                                    {orders.map((order, idx) => (
                                        <motion.div
                                            key={order._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="bg-white rounded-[2.5rem] shadow-sm overflow-hidden border border-gray-50 hover:shadow-md transition-shadow"
                                        >
                                            {/* Order Header */}
                                            <div className="bg-background/50 px-8 py-6 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100">
                                                <div className="flex flex-wrap gap-x-8 gap-y-2">
                                                    <div>
                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-light block mb-1">Order Placed</span>
                                                        <div className="flex items-center text-sm font-bold text-dark">
                                                            <Calendar size={14} className="mr-2 text-primary" /> {formatDate(order.createdAt)}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-light block mb-1">Total Amount</span>
                                                        <div className="text-sm font-bold text-dark">{formatPrice(order.totalAmount)}</div>
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-light block mb-1">Ship To</span>
                                                        <div className="flex items-center text-sm font-bold text-dark">
                                                            <MapPin size={14} className="mr-1 text-primary" /> {order.shippingAddress.city}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-light block mb-1 text-right">Order ID</span>
                                                    <div className="text-sm font-bold text-primary italic">#{order.orderId}</div>
                                                </div>
                                            </div>

                                            {/* Order Body */}
                                            <div className="p-8">
                                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                                                    <div className="flex-1 space-y-4">
                                                        <div className="flex items-center space-x-2">
                                                            <span className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${getStatusInfo(order.orderStatus).color}`}>
                                                                {order.orderStatus}
                                                            </span>
                                                            {order.paymentStatus === 'paid' && order.paymentMethod !== 'cod' ? (
                                                                <span className="px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-green-100 text-green-700">
                                                                    Paid Online
                                                                </span>
                                                            ) : (
                                                                <span className="px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-yellow-100 text-yellow-700 italic">
                                                                    {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Payment Pending'}
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="flex -space-x-3 mt-4">
                                                            {order.items.map((item, i) => (
                                                                <div key={i} className="relative w-16 h-20 rounded-xl overflow-hidden border-4 border-white shadow-sm bg-background">
                                                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                                                </div>
                                                            ))}
                                                            {order.items.length > 3 && (
                                                                <div className="w-16 h-20 rounded-xl bg-gray-100 border-4 border-white flex items-center justify-center text-xs font-bold text-light">
                                                                    +{order.items.length - 3}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col gap-3 w-full md:w-auto">
                                                        <Link
                                                            href={`/order/success/${order._id}`}
                                                            className="btn-secondary text-sm py-2 flex items-center justify-center space-x-2 px-6"
                                                        >
                                                            <span>View Order Details</span>
                                                            <ChevronRight size={16} />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-24 bg-white rounded-[3rem] space-y-6">
                                    <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mx-auto text-light">
                                        <ShoppingBag size={32} />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-heading font-bold">No orders found</h3>
                                        <p className="text-light">You haven't made any purchases yet.</p>
                                    </div>
                                    <Link href="/shop" className="btn-primary inline-block">Start Shopping</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
};

export default OrderHistoryPage;
