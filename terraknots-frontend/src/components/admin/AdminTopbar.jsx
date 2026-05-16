'use client';

import { Bell, Search, Globe, User, Settings as SettingsIcon, Package, AlertCircle, MessageCircle, Clock, X, Check } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

const AdminTopbar = () => {
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        try {
            const { data } = await api.get('/notifications');
            setNotifications(data.notifications || []);
            setUnreadCount(data.notifications?.filter(n => !n.isRead).length || 0);
        } catch (error) {
            console.error('Failed to fetch notifications');
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll for new notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            fetchNotifications();
        } catch (error) {
            console.error('Failed to mark as read');
        }
    };

    const markAllRead = async () => {
        try {
            await api.put('/notifications/read-all');
            fetchNotifications();
        } catch (error) {
            console.error('Failed to mark all as read');
        }
    };

    // Static demo notifications if none in DB
    const displayNotifications = notifications.length > 0 ? notifications : [
        { _id: '1', title: 'New Order TK-342', message: '₹649 | 2m ago', type: 'order', isRead: false },
        { _id: '2', title: 'Low Stock Alert', message: 'Crochet Bow (2 left)', type: 'stock', isRead: false },
        { _id: '3', title: 'New Message', message: 'from Priya Sharma', type: 'message', isRead: true },
    ];

    const getIcon = (type) => {
        switch (type) {
            case 'order': return <Package className="text-primary" size={16} />;
            case 'stock': return <AlertCircle className="text-red-500" size={16} />;
            case 'message': return <MessageCircle className="text-secondary" size={16} />;
            default: return <Bell className="text-light" size={16} />;
        }
    };

    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-50">
            {/* SearchBar */}
            <div className="flex-1 max-w-md relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-light group-focus-within:text-primary transition-colors">
                    <Search size={18} />
                </div>
                <input
                    type="text"
                    placeholder="Quick search commands..."
                    className="w-full bg-background border-none rounded-2xl pl-12 pr-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 placeholder:text-light/50 outline-none"
                />
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-6">
                {/* Visit Site */}
                <Link
                    href="/"
                    target="_blank"
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-gray-100 text-sm font-bold text-light hover:bg-primary/5 hover:text-primary transition-all"
                >
                    <Globe size={16} />
                    <span className="hidden md:inline">View Site</span>
                </Link>

                {/* Notifications Bell */}
                <div className="relative">
                    <button 
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all ${showNotifications ? 'bg-primary text-white' : 'bg-background text-light hover:text-primary'}`}
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-terracotta text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    <AnimatePresence>
                        {showNotifications && (
                            <>
                                <motion.div 
                                    initial={{ opacity: 0 }} 
                                    animate={{ opacity: 1 }} 
                                    exit={{ opacity: 0 }}
                                    onClick={() => setShowNotifications(false)}
                                    className="fixed inset-0 z-[-1]"
                                />
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 mt-4 w-80 bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden"
                                >
                                    <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-background/50">
                                        <h4 className="font-bold text-dark text-sm uppercase tracking-widest">Notifications</h4>
                                        <button onClick={markAllRead} className="text-[10px] font-bold text-primary hover:underline">Mark all read</button>
                                    </div>
                                    <div className="max-h-[350px] overflow-y-auto no-scrollbar">
                                        {displayNotifications.map((n) => (
                                            <div 
                                                key={n._id}
                                                onClick={() => !n.isRead && markAsRead(n._id)}
                                                className={`p-5 flex items-start space-x-4 border-b border-gray-50 hover:bg-background/50 transition-colors cursor-pointer relative group ${!n.isRead ? 'bg-primary/5' : ''}`}
                                            >
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${!n.isRead ? 'bg-white shadow-sm' : 'bg-gray-50'}`}>
                                                    {getIcon(n.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm ${!n.isRead ? 'font-bold text-dark' : 'text-light'}`}>{n.title}</p>
                                                    <p className="text-[10px] text-light mt-0.5 line-clamp-1">{n.message}</p>
                                                </div>
                                                {!n.isRead && <div className="w-2 h-2 rounded-full bg-primary mt-2" />}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-4 text-center bg-background/30">
                                        <Link href="/admin/notifications" onClick={() => setShowNotifications(false)} className="text-[10px] font-bold text-light hover:text-dark uppercase tracking-widest">
                                            View All Notifications
                                        </Link>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>

                {/* User Card */}
                <div className="flex items-center space-x-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-dark">Admin Control</p>
                        <p className="text-[10px] text-primary uppercase font-bold tracking-widest">Active</p>
                    </div>
                    <button className="w-10 h-10 rounded-xl bg-primary shadow-lg shadow-primary/20 flex items-center justify-center text-white hover:rotate-6 transition-transform">
                        <User size={20} />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default AdminTopbar;
