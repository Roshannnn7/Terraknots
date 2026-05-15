'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Package, Star, MessageCircle } from 'lucide-react';
import api from '@/lib/api';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4"
  >
    <div className={`p-4 rounded-2xl ${color}`}>
      <Icon className="text-white" size={24} />
    </div>
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-dark">{value}</h3>
    </div>
  </motion.div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchStats = async () => {
          try {
              const { data } = await api.get('/admin/dashboard/stats');
              setStats(data.stats);
          } catch (error) {
              console.error('Error fetching stats', error);
          } finally {
              setLoading(false);
          }
      };
      fetchStats();
  }, []);

  if (loading) return <div className="animate-pulse p-8 space-y-8 min-h-screen bg-[#FBF9F7]"><div className="h-40 bg-gray-100 rounded-[2.5rem]" /><div className="grid grid-cols-4 gap-6">{[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-100 rounded-3xl" />)}</div></div>;

  if (!stats) return <div className="p-8">Failed to load dashboard data.</div>;

  return (
    <div className="p-8 bg-[#FBF9F7] min-h-screen font-body">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-heading text-dark">Welcome back, Artisan.</h1>
          <p className="text-secondary">Your TerraKnots empire at a glance.</p>
        </div>
        <button className="bg-dark text-white px-6 py-3 rounded-full hover:bg-black transition-all">
          Export Report
        </button>
      </header>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} icon={DollarSign} color="bg-terracotta" />
        <StatCard title="Total Orders" value={stats.totalOrders} icon={Package} color="bg-accent" />
        <StatCard title="Avg. Rating" value="4.9" icon={Star} color="bg-yellow-500" />
        <StatCard title="Customers" value={stats.totalCustomers} icon={MessageCircle} color="bg-secondary" />
      </div>

      {/* Revenue Graph & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <h3 className="font-heading text-xl mb-6 text-dark font-bold">Revenue Growth</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.monthlyRevenue && stats.monthlyRevenue.length > 0 ? stats.monthlyRevenue : stats.dailyRevenue}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C4A882" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#C4A882" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey={stats.monthlyRevenue && stats.monthlyRevenue.length > 0 ? "month" : "date"} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B6B6B' }} />
                <YAxis hide />
                <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="revenue" stroke="#C4A882" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Custom Order Tracker repurposed for Top Products & Low Stock */}
        <div className="bg-dark text-white p-8 rounded-[2rem] shadow-xl overflow-hidden relative flex flex-col justify-between">
          <div className="relative z-10">
            <h3 className="font-heading text-xl mb-6 font-bold">Top Treasures</h3>
            <div className="space-y-6">
              {stats.topSellingProducts.slice(0, 3).map((p, i) => (
                <div key={i} className="flex justify-between items-center border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                     <img src={p._id?.images[0]} alt="" className="w-10 h-10 rounded-xl object-cover" />
                     <div>
                       <p className="font-medium text-sm line-clamp-1 truncate max-w-[120px]">{p._id?.name}</p>
                       <p className="text-xs text-white/50">{p.totalSold} sold • ₹{p.revenue.toLocaleString()}</p>
                     </div>
                  </div>
                </div>
              ))}
            </div>
            
            <h3 className="font-heading text-lg mt-8 mb-4 text-red-300 font-bold">Low Stock</h3>
            <div className="flex flex-wrap gap-2">
               {stats.lowStockProducts.slice(0, 4).map(p => (
                 <span key={p._id} className="text-xs px-3 py-1 bg-white/10 rounded-full">{p.name} ({p.stock})</span>
               ))}
               {stats.lowStockProducts.length === 0 && <span className="text-xs text-white/50">Stock level looking good!</span>}
            </div>
          </div>
          {/* Decorative Background Element */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
        </div>
      </div>
      
      {/* Recent Orders Section */}
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
         <div className="flex justify-between items-center mb-6">
           <h3 className="font-heading text-xl text-dark font-bold">Recent Orders</h3>
           <a href="/admin/orders" className="text-sm text-primary hover:underline font-bold">View All</a>
         </div>
         <div className="overflow-x-auto">
             <table className="w-full text-left">
                 <thead>
                     <tr className="border-b border-gray-50 text-light text-xs uppercase tracking-widest">
                         <th className="pb-4 font-bold">Order ID</th>
                         <th className="pb-4 font-bold">Customer</th>
                         <th className="pb-4 font-bold">Amount</th>
                         <th className="pb-4 font-bold text-right">Status</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                     {stats.recentOrders.slice(0, 5).map(order => (
                         <tr key={order._id} className="hover:bg-background/30 transition-colors">
                             <td className="py-4 text-sm font-bold text-primary">#{order.orderId}</td>
                             <td className="py-4 text-sm font-medium text-dark">{order.user?.name || order.guestInfo?.name}</td>
                             <td className="py-4 text-sm font-bold text-dark">₹{order.totalAmount}</td>
                             <td className="py-4 text-right">
                                 <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.orderStatus === 'delivered' ? 'bg-green-100 text-green-600' :
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
    </div>
  );
}
