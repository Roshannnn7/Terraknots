'use client';

import { useState, useEffect } from 'react';
import {
    Mail,
    Download,
    Trash2,
    Users,
    Calendar,
    Send,
    Search,
    ExternalLink
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const NewsletterManagementPage = () => {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchSubscribers = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/newsletter');
            setSubscribers(data.subscribers);
        } catch (error) {
            console.error('Error fetching subscribers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const deleteSubscriber = async (id) => {
        if (!window.confirm('Remove this email from the family?')) return;
        try {
            await api.delete(`/newsletter/${id}`);
            toast.success('Subscriber removed');
            fetchSubscribers();
        } catch (error) {
            toast.error('Deletion failed');
        }
    };

    const exportCSV = () => {
        const headers = ['Email', 'Subscribed At'];
        const rows = subscribers.map(s => [s.email, format(new Date(s.subscribedAt), 'yyyy-MM-dd HH:mm:ss')]);

        let csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(r => r.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "terraknots_subscribers.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-dark">The Loom family</h1>
                    <p className="text-light italic font-accent text-lg">Direct connection to your {subscribers.length} subscribers.</p>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={exportCSV}
                        className="btn-secondary h-14 px-8 flex items-center space-x-2"
                    >
                        <Download size={20} />
                        <span>Export CSV</span>
                    </button>
                    <button className="btn-primary h-14 px-8 flex items-center space-x-2">
                        <Send size={20} />
                        <span>Compose Blast</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Stats */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm space-y-4">
                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                            <Users size={24} />
                        </div>
                        <div>
                            <h3 className="text-3xl font-heading font-bold text-dark">{subscribers.length}</h3>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-light">Total Subscribers</p>
                        </div>
                    </div>

                    <div className="bg-dark p-8 rounded-[3rem] text-white space-y-4 shadow-xl shadow-dark/10">
                        <div className="w-12 h-12 bg-white/10 text-white rounded-2xl flex items-center justify-center">
                            <Mail size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white/70 italic font-accent text-lg">"Handmade with heart, knot by knot."</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest mt-2">Tagline in Every Mail</p>
                        </div>
                    </div>
                </div>

                {/* List */}
                <div className="lg:col-span-2 bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden min-h-[500px] relative">
                    <div className="p-6 border-b border-gray-50 bg-background/30 flex items-center gap-4">
                        <div className="flex-1 relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-light group-focus-within:text-primary transition-colors" size={16} />
                            <input
                                type="text"
                                placeholder="Find a specific email..."
                                className="w-full bg-white border-none rounded-xl pl-10 pr-4 py-2 text-xs font-medium focus:ring-2 focus:ring-primary/20 outline-none"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-50">
                                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-light">Subscriber Email</th>
                                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-light">Date Joined</th>
                                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-light text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            <AnimatePresence mode="popLayout">
                                {subscribers.filter(s => s.email.toLowerCase().includes(search.toLowerCase())).map((sub, idx) => (
                                    <motion.tr
                                        key={sub._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.02 }}
                                        className="group hover:bg-background/30 transition-colors"
                                    >
                                        <td className="px-8 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary text-[10px] font-bold">
                                                    {sub.email[0].toUpperCase()}
                                                </div>
                                                <span className="text-sm font-bold text-dark">{sub.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 text-[10px] font-bold text-light">
                                            {format(new Date(sub.subscribedAt), 'dd MMM yyyy')}
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <button
                                                onClick={() => deleteSubscriber(sub._id)}
                                                className="p-2 text-light hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>

                    {loading && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-10">
                            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default NewsletterManagementPage;
