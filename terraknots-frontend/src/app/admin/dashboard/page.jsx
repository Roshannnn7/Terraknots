'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    Tooltip, 
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar
} from 'recharts';
import { 
    DollarSign, 
    Package, 
    Star, 
    MessageCircle, 
    TrendingUp, 
    TrendingDown, 
    AlertCircle, 
    Clock, 
    CheckCircle,
    ArrowRight,
    Plus,
    Bell
} from 'lucide-react';
import api from '@/lib/api';
import Link from 'next/link';

const StatCard = ({ title, value, icon: Icon, color, trend, trendValue }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center justify-between group"
  >
    <div className="flex items-center gap-4">
        <div className={`p-4 rounded-2xl ${color} shadow-lg shadow-current/10 group-hover:scale-110 transition-transform`}>
          <Icon className="text-white" size={24} />
        </div>
        <div>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{title}</p>
          <h3 className="text-2xl font-bold text-dark">{value}</h3>
        </div>
    </div>
    {trend && (
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-[10px] font-bold ${trend === 'up' ? 'text-green-500 bg-green-50' : 'text-red-500 bg-red-50'}`}>
            {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            <span>{trendValue}%</span>
        </div>
    )}
  </motion.div>
);

const ActivityItem = ({ title, time, icon: Icon, color }) => (
    <div className="flex items-center space-x-4 group">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
            <Icon size={18} />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-dark truncate group-hover:text-primary transition-colors">{title}</p>
            <p className="text-[10px] text-light uppercase font-bold tracking-tighter flex items-center">
                <Clock size={10} className="mr-1" />
                {time}
            </p>
        </div>
    </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visitors, setVisitors] = useState(Math.floor(Math.random() * 15) + 1);

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

      const interval = setInterval(() => {
        setVisitors(prev => Math.max(1, Math.min(25, prev + (Math.random() > 0.5 ? 1 : -1))));
      }, 5000);
      return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div className="p-8 space-y-8 min-h-screen bg-[#FBF9F7]">
        <div className="h-20 w-1/3 bg-gray-200 rounded-full animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white rounded-[2.5rem] animate-pulse border border-gray-100" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-[400px] bg-white rounded-[3rem] animate-pulse border border-gray-100" />
            <div className="h-[400px] bg-white rounded-[3rem] animate-pulse border border-gray-100" />
        </div>
    </div>
  );

  if (!stats) return (
    <div className="p-8 text-center py-40">
        <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
        <h2 className="text-2xl font-bold text-dark">Data loom disconnected</h2>
        <p className="text-light italic">Failed to fetch dashboard intelligence.</p>
    </div>
  );

  const COLORS = ['#C4A882', '#8B7355', '#A8B5A2', '#D4A574', '#C9B09B'];

  return (
    <div className="p-8 bg-[#FBF9F7] min-h-screen font-body space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-heading text-dark font-bold">Loom Intelligence.</h1>
          <p className="text-light italic font-accent text-lg">Your TerraKnots empire at a glance.</p>
        </div>
        <div className="flex items-center space-x-4">
            <div className="px-4 py-2 bg-green-50 text-green-600 rounded-full text-xs font-bold flex items-center space-x-2 border border-green-100">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                <span>{visitors} Active Visitors</span>
            </div>
            <button className="bg-dark text-white px-8 h-14 rounded-2xl hover:bg-black transition-all font-bold shadow-lg shadow-dark/10 flex items-center space-x-2">
                <span>Export Analytics</span>
            </button>
        </div>
      </header>

      {/* ROW 1: Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Today's Revenue" value={`₹${stats.todayRevenue?.toLocaleString() || 0}`} icon={DollarSign} color="bg-terracotta" trend="up" trendValue="12" />
        <StatCard title="Total Orders" value={stats.totalOrders} icon={Package} color="bg-accent" trend="up" trendValue="5" />
        <StatCard title="Pending Actions" value={stats.lowStockProducts.length + (stats.pendingOrders || 3)} icon={AlertCircle} color="bg-yellow-500" />
        <StatCard title="Customers" value={stats.totalCustomers} icon={Star} color="bg-secondary" />
      </div>

      {/* ROW 2: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center justify-between">
              <h3 className="font-heading text-xl text-dark font-bold">Revenue Pulse</h3>
              <select className="bg-background border-none rounded-xl text-xs font-bold px-4 py-2 focus:ring-2 focus:ring-primary/20">
                  <option>Last 30 Days</option>
                  <option>Last 12 Months</option>
              </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.dailyRevenue || []}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C4A882" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#C4A882" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#A8A8A8', fontWeight: 'bold' }} />
                <YAxis hide />
                <Tooltip 
                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }} 
                    itemStyle={{ fontWeight: 'bold', color: '#C4A882' }}
                    labelStyle={{ fontSize: '10px', textTransform: 'uppercase', color: '#A8A8A8', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#C4A882" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 space-y-6">
          <h3 className="font-heading text-xl text-dark font-bold">Treasures by Category</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.ordersByCategory || [
                      { name: 'Crochet', value: 40 },
                      { name: 'Resin', value: 30 },
                      { name: 'Clay', value: 20 },
                      { name: 'Others', value: 10 },
                  ]}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(stats.ordersByCategory || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-4">
              {(stats.ordersByCategory || []).slice(0, 4).map((entry, index) => (
                  <div key={entry.name} className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="text-[10px] font-bold text-light uppercase truncate">{entry.name}</span>
                  </div>
              ))}
          </div>
        </div>
      </div>

      {/* ROW 3: Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Action Required */}
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 space-y-8">
            <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-red-50 text-red-500 rounded-xl">
                    <AlertCircle size={20} />
                </div>
                <h3 className="font-heading text-xl text-dark font-bold">Action Required</h3>
            </div>
            <div className="space-y-4">
                <div className="p-5 bg-orange-50 border border-orange-100 rounded-3xl flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-orange-500 text-white rounded-xl flex items-center justify-center">
                            <Clock size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-dark">5 Orders Pending</p>
                            <p className="text-[10px] text-orange-600 font-bold uppercase">Ready to ship</p>
                        </div>
                    </div>
                    <Link href="/admin/orders" className="p-2 hover:bg-white rounded-xl transition-all">
                        <ArrowRight size={18} className="text-orange-500" />
                    </Link>
                </div>
                <div className="p-5 bg-red-50 border border-red-100 rounded-3xl flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-red-500 text-white rounded-xl flex items-center justify-center">
                            <Package size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-dark">{stats.lowStockProducts.length} Items Low Stock</p>
                            <p className="text-[10px] text-red-600 font-bold uppercase">Replenish looms</p>
                        </div>
                    </div>
                    <Link href="/admin/products" className="p-2 hover:bg-white rounded-xl transition-all">
                        <ArrowRight size={18} className="text-red-500" />
                    </Link>
                </div>
                <div className="p-5 bg-blue-50 border border-blue-100 rounded-3xl flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-500 text-white rounded-xl flex items-center justify-center">
                            <MessageCircle size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-dark">3 Unread Messages</p>
                            <p className="text-[10px] text-blue-600 font-bold uppercase">Response needed</p>
                        </div>
                    </div>
                    <Link href="/admin/messages" className="p-2 hover:bg-white rounded-xl transition-all">
                        <ArrowRight size={18} className="text-blue-500" />
                    </Link>
                </div>
            </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-accent/10 text-accent rounded-xl">
                        <TrendingUp size={20} />
                    </div>
                    <h3 className="font-heading text-xl text-dark font-bold">Loom Activity</h3>
                </div>
                <span className="text-[10px] font-bold text-light uppercase tracking-widest">Real-time</span>
            </div>
            <div className="space-y-8 overflow-y-auto max-h-[400px] no-scrollbar">
                <ActivityItem title="New order TK-342 placed" time="2 min ago" icon={Package} color="bg-terracotta/10 text-terracotta" />
                <ActivityItem title="Product 'Crochet Bow' updated" time="15 min ago" icon={Star} color="bg-accent/10 text-accent" />
                <ActivityItem title="New customer registered" time="1 hour ago" icon={MessageCircle} color="bg-secondary/10 text-secondary" />
                <ActivityItem title="UPI Payment TK-340 verified" time="3 hours ago" icon={CheckCircle} color="bg-green-50 text-green-500" />
                <ActivityItem title="Order TK-338 marked as shipped" time="5 hours ago" icon={Truck} color="bg-blue-50 text-blue-500" />
            </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-dark text-white p-10 rounded-[3rem] shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="relative z-10 space-y-8">
                <h3 className="font-heading text-xl font-bold">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-4">
                    <Link href="/admin/products/add" className="p-6 bg-white/10 hover:bg-white/20 rounded-3xl border border-white/10 transition-all flex flex-col items-center justify-center space-y-2 group">
                        <div className="w-10 h-10 rounded-full bg-white text-dark flex items-center justify-center group-hover:rotate-90 transition-transform">
                            <Plus size={20} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest">Add Product</span>
                    </Link>
                    <Link href="/admin/categories" className="p-6 bg-white/10 hover:bg-white/20 rounded-3xl border border-white/10 transition-all flex flex-col items-center justify-center space-y-2 group">
                        <div className="w-10 h-10 rounded-full bg-white text-dark flex items-center justify-center">
                            <Package size={20} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest">Collections</span>
                    </Link>
                    <Link href="/admin/orders" className="p-6 bg-white/10 hover:bg-white/20 rounded-3xl border border-white/10 transition-all flex flex-col items-center justify-center space-y-2 group">
                        <div className="w-10 h-10 rounded-full bg-white text-dark flex items-center justify-center">
                            <ShoppingCart size={20} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest">Orders</span>
                    </Link>
                    <Link href="/admin/settings" className="p-6 bg-white/10 hover:bg-white/20 rounded-3xl border border-white/10 transition-all flex flex-col items-center justify-center space-y-2 group">
                        <div className="w-10 h-10 rounded-full bg-white text-dark flex items-center justify-center">
                            <Bell size={20} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest">Settings</span>
                    </Link>
                </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
