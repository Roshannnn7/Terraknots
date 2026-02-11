'use client';

import { useState, useEffect } from 'react';
import {
    DollarSign,
    ShoppingBag,
    Package,
    Users,
    TrendingUp,
    AlertTriangle,
    ShoppingBasket
} from 'lucide-react';
import StatsCard from '@/components/admin/StatsCard';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import api from '@/lib/api';
import Link from 'next/link';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/admin/dashboard-stats');
                setStats(data.stats);
            } catch (error) {
                console.error('Error fetching stats', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="animate-pulse space-y-8">
        <div className="h-40 bg-gray-100 rounded-[2.5rem]" />
        <div className="grid grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-100 rounded-3xl" />)}
        </div>
    </div>;

    if (!stats) return <div>Failed to load dashboard data.</div>;

    return (
        <div className="space-y-10">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-heading font-bold text-dark">Workbench Overview</h1>
                <p className="text-light italic font-accent text-lg">Here's how TerraKnots is doing today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Revenue"
                    value={`₹${stats.totalRevenue.toLocaleString()}`}
                    icon={DollarSign}
                    trend="+12%"
                    color="bg-primary"
                />
                <StatsCard
                    title="Total Orders"
                    value={stats.totalOrders}
                    icon={ShoppingBag}
                    trend="+5%"
                    color="bg-accent"
                />
                <StatsCard
                    title="Total Products"
                    value={stats.totalProducts}
                    icon={Package}
                    color="bg-terracotta"
                />
                <StatsCard
                    title="Customers"
                    value={stats.totalCustomers}
                    icon={Users}
                    color="bg-dark"
                />
            </div>

            {/* Main Analysis Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-heading font-bold text-dark">Revenue Trends</h3>
                            <p className="text-[10px] text-light font-bold uppercase tracking-widest">Last 7 Days Performance</p>
                        </div>
                        <div className="p-3 bg-background rounded-2xl text-primary">
                            <TrendingUp size={20} />
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.dailyRevenue}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#C4A882" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#C4A882" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#6B6B6B', fontWeight: 600 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#6B6B6B', fontWeight: 600 }}
                                    dx={-10}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#C4A882"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Low Stock Alerts */}
                <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col">
                    <div className="flex items-center space-x-3 mb-8">
                        <div className="p-3 bg-red-50 text-red-500 rounded-2xl">
                            <AlertTriangle size={20} />
                        </div>
                        <div>
                            <h3 className="text-xl font-heading font-bold text-dark">Restock Alerts</h3>
                            <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">Immediate action required</p>
                        </div>
                    </div>

                    <div className="space-y-4 flex-1 overflow-y-auto no-scrollbar">
                        {stats.lowStockProducts.length > 0 ? stats.lowStockProducts.map(product => (
                            <div key={product._id} className="flex items-center justify-between p-4 bg-background rounded-2xl hover:scale-[1.02] transition-transform cursor-pointer">
                                <div className="flex items-center space-x-3">
                                    <img src={product.images[0]} alt={product.name} className="w-10 h-10 rounded-xl object-cover" />
                                    <div>
                                        <h5 className="text-xs font-bold text-dark line-clamp-1">{product.name}</h5>
                                        <p className="text-[10px] text-light uppercase tracking-wider">{product.category}</p>
                                    </div>
                                </div>
                                <div className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-[10px] font-bold">
                                    {product.stock} Left
                                </div>
                            </div>
                        )) : (
                            <div className="flex flex-col items-center justify-center space-y-3 py-10 opacity-30">
                                <Package size={40} />
                                <p className="text-sm font-bold">Inventory looks good!</p>
                            </div>
                        )}
                    </div>

                    <Link href="/admin/products" className="mt-6 w-full py-3 bg-dark text-white rounded-2xl text-center text-xs font-bold hover:bg-black transition-colors">
                        Manage Inventory
                    </Link>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Recent Orders */}
                <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-heading font-bold text-dark">Recent Activity</h3>
                        <Link href="/admin/orders" className="text-xs font-bold text-primary hover:underline">View All Orders</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-50">
                                    <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-light">Order ID</th>
                                    <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-light">Customer</th>
                                    <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-light">Amount</th>
                                    <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-light text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {stats.recentOrders.map(order => (
                                    <tr key={order._id} className="group hover:bg-background/50 transition-colors">
                                        <td className="py-4 text-xs font-bold text-primary">#{order.orderId}</td>
                                        <td className="py-4 text-xs font-medium text-dark">{order.user?.name || order.guestInfo?.name}</td>
                                        <td className="py-4 text-xs font-bold text-dark">₹{order.totalAmount}</td>
                                        <td className="py-4 text-right">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${order.orderStatus === 'delivered' ? 'bg-green-100 text-green-600' :
                                                    order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-600' :
                                                        'bg-orange-100 text-orange-600'
                                                }`}>
                                                {order.orderStatus}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
                    <div className="flex items-center space-x-3 mb-8">
                        <div className="p-3 bg-accent/10 text-accent rounded-2xl">
                            <ShoppingBasket size={20} />
                        </div>
                        <h3 className="text-xl font-heading font-bold text-dark">Top Treasures</h3>
                    </div>
                    <div className="space-y-6">
                        {stats.topSellingProducts.map((p, idx) => (
                            <div key={idx} className="flex items-center justify-between group">
                                <div className="flex items-center space-x-4">
                                    <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-[10px] font-bold text-light group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                        {idx + 1}
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <img src={p._id?.images[0]} alt="" className="w-12 h-12 rounded-2xl object-cover shadow-sm" />
                                        <div>
                                            <h4 className="text-sm font-bold text-dark line-clamp-1">{p._id?.name}</h4>
                                            <p className="text-[10px] text-light font-bold">₹{p._id?.price}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-dark">{p.totalSold} Sold</div>
                                    <div className="text-[10px] text-light uppercase tracking-wider">₹{p.revenue.toLocaleString()} Rev</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;
