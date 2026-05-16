'use client';

import { useState, useEffect } from 'react';
import { 
    Clock, 
    User, 
    Activity, 
    Search, 
    Filter,
    ArrowUpRight,
    Smartphone,
    Globe,
    CheckCircle,
    Info,
    AlertCircle,
    Package,
    Tag,
    Settings as SettingsIcon,
    ShoppingCart
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const ActivityLogPage = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/activity-logs');
            setLogs(data.logs || []);
        } catch (error) {
            toast.error('Failed to load activity logs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const getIcon = (action) => {
        const a = action.toLowerCase();
        if (a.includes('create') || a.includes('add')) return <div className="p-2 bg-green-50 text-green-600 rounded-xl"><CheckCircle size={18} /></div>;
        if (a.includes('update') || a.includes('edit')) return <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Activity size={18} /></div>;
        if (a.includes('delete') || a.includes('remove')) return <div className="p-2 bg-red-50 text-red-600 rounded-xl"><AlertCircle size={18} /></div>;
        if (a.includes('login')) return <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><User size={18} /></div>;
        return <div className="p-2 bg-gray-50 text-gray-600 rounded-xl"><Info size={18} /></div>;
    };

    const getModuleIcon = (module) => {
        const m = module.toLowerCase();
        if (m.includes('product')) return <Package size={14} />;
        if (m.includes('category')) return <Tag size={14} />;
        if (m.includes('order')) return <ShoppingCart size={14} />;
        if (m.includes('settings')) return <SettingsIcon size={14} />;
        return <Activity size={14} />;
    };

    const filteredLogs = logs.filter(log => {
        const matchesSearch = 
            log.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
            log.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.admin?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' || log.module.toLowerCase() === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-dark">Audit Trail</h1>
                    <p className="text-light italic font-accent text-lg">Every knot, every stitch, every change recorded.</p>
                </div>
                <button 
                    onClick={fetchLogs}
                    className="px-6 py-3 rounded-2xl bg-white border border-gray-100 text-dark font-bold text-sm hover:shadow-md transition-all flex items-center space-x-2"
                >
                    <Activity size={16} />
                    <span>Refresh Logs</span>
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-light" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by action, admin, or details..." 
                        className="input-field h-12 pl-14"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center space-x-2 w-full md:w-auto">
                    <Filter className="text-light" size={18} />
                    <select 
                        className="input-field h-12 w-full md:w-48"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">All Modules</option>
                        <option value="product">Products</option>
                        <option value="category">Categories</option>
                        <option value="order">Orders</option>
                        <option value="settings">Settings</option>
                        <option value="auth">Security</option>
                    </select>
                </div>
            </div>

            {/* Log Table */}
            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-background/50 border-b border-gray-50">
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-light">Timestamp</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-light">Action</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-light">Admin</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-light">Origin</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-light text-right">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-8 py-6 h-20 bg-gray-50/30" />
                                    </tr>
                                ))
                            ) : (
                                filteredLogs.map((log) => (
                                    <tr key={log._id} className="hover:bg-background/30 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-dark">{new Date(log.createdAt).toLocaleDateString()}</span>
                                                <span className="text-[10px] text-light flex items-center">
                                                    <Clock size={10} className="mr-1" />
                                                    {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center space-x-3">
                                                {getIcon(log.action)}
                                                <div>
                                                    <p className="text-sm font-bold text-dark">{log.action}</p>
                                                    <div className="flex items-center space-x-1 text-[9px] font-bold text-primary uppercase tracking-tighter">
                                                        {getModuleIcon(log.module)}
                                                        <span>{log.module}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                                                    {log.admin?.name?.charAt(0) || 'A'}
                                                </div>
                                                <span className="text-sm font-medium text-dark">{log.admin?.name || 'System'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center space-x-4 opacity-60">
                                                <div className="flex items-center space-x-1 text-[10px] font-medium text-light">
                                                    <Globe size={12} />
                                                    <span>{log.ipAddress || 'Internal'}</span>
                                                </div>
                                                <div className="flex items-center space-x-1 text-[10px] font-medium text-light">
                                                    <Smartphone size={12} />
                                                    <span className="truncate max-w-[80px]">{log.userAgent?.split(' ')[0] || 'Browser'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="text-primary opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-primary/10 rounded-lg">
                                                <ArrowUpRight size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {!loading && filteredLogs.length === 0 && (
                    <div className="p-20 text-center">
                        <Activity className="mx-auto text-light opacity-20 mb-4" size={64} />
                        <h3 className="text-xl font-bold text-dark">No records found</h3>
                        <p className="text-light">Adjust your search or filter to find specific events.</p>
                    </div>
                )}
                
                <div className="p-6 bg-background/50 border-t border-gray-50 flex items-center justify-between">
                    <p className="text-[10px] font-bold text-light uppercase tracking-widest">Showing {filteredLogs.length} activity records</p>
                    <div className="flex space-x-2">
                        <button className="px-4 py-2 bg-white rounded-xl text-xs font-bold text-light border border-gray-100 disabled:opacity-50" disabled>Previous</button>
                        <button className="px-4 py-2 bg-white rounded-xl text-xs font-bold text-light border border-gray-100 disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivityLogPage;
