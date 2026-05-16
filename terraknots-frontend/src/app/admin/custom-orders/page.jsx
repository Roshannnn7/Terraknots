'use client';

import { useState, useEffect } from 'react';
import {
    Sparkles,
    Clock,
    CheckCircle2,
    XCircle,
    ExternalLink,
    MessageCircle,
    Smartphone,
    Calendar,
    DollarSign,
    Image as ImageIcon,
    Trash2,
    ChevronRight
} from 'lucide-react';
import api from '@/lib/api';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const CustomOrderManagement = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/custom-orders');
            setRequests(data?.customOrders || data?.data || []);
        } catch (error) {
            console.error('Error fetching custom orders:', error);
            setRequests([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/custom-orders/${id}/status`, { status });
            toast.success(`Moved to ${status}`);
            fetchRequests();
            if (selected?._id === id) setSelected({ ...selected, status });
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const getStatusColor = (s) => {
        switch (s) {
            case 'accepted': return 'text-green-600 bg-green-100';
            case 'completed': return 'text-blue-600 bg-blue-100';
            case 'rejected': return 'text-red-600 bg-red-100';
            case 'in_discussion': return 'text-orange-600 bg-orange-100';
            default: return 'text-primary bg-primary/10';
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-heading font-bold text-dark">Bespoke Creations</h1>
                <p className="text-light italic font-accent text-lg">Managing special dreams and custom commissions.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 min-h-[700px]">

                {/* Requests List */}
                <div className="lg:col-span-2 space-y-4">
                    {(requests || []).map((req) => (
                        <div
                            key={req._id}
                            onClick={() => setSelected(req)}
                            className={`p-6 rounded-[2.5rem] border cursor-pointer transition-all relative overflow-hidden group ${selected?._id === req._id
                                    ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-[1.02]'
                                    : 'bg-white border-gray-100 hover:border-primary/30 text-dark'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <span className={`text-[8px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${selected?._id === req._id ? 'bg-white text-primary' : getStatusColor(req.status)
                                    }`}>
                                    {req?.status?.replace('_', ' ') || 'NEW'}
                                </span>
                                <span className={`text-[8px] font-bold uppercase tracking-widest opacity-60`}>
                                    {format(new Date(req.createdAt), 'dd MMM')}
                                </span>
                            </div>
                            <h4 className="text-sm font-bold pr-10">{req.productType}</h4>
                            <p className={`text-xs mt-1 ${selected?._id === req._id ? 'text-white/70' : 'text-light'}`}>{req.name}</p>

                            <div className={`absolute right-6 top-1/2 -translate-y-1/2 transition-all ${selected?._id === req._id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                                }`}>
                                <ChevronRight size={20} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Request Detail */}
                <div className="lg:col-span-4 h-full">
                    <AnimatePresence mode="wait">
                        {selected ? (
                            <motion.div
                                key={selected._id}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="bg-white rounded-[4rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full"
                            >
                                {/* Visual Header */}
                                <div className="p-10 border-b border-gray-50 flex items-start justify-between">
                                    <div className="flex items-center space-x-6">
                                        <div className="w-16 h-16 rounded-3xl bg-background flex items-center justify-center text-primary shadow-inner">
                                            <Sparkles size={30} className="animate-pulse" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-heading font-bold text-dark">{selected.productType}</h2>
                                            <p className="text-sm text-light font-bold">Requested by {selected.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-3">
                                        <a href={`mailto:${selected.email}`} className="p-3 bg-background text-primary rounded-2xl hover:bg-primary hover:text-white transition-all">
                                            <MessageCircle size={20} />
                                        </a>
                                        <a href={`tel:${selected.phone}`} className="p-3 bg-background text-accent rounded-2xl hover:bg-accent hover:text-white transition-all">
                                            <Smartphone size={20} />
                                        </a>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 p-10 grid grid-cols-1 md:grid-cols-2 gap-10 overflow-y-auto no-scrollbar">

                                    {/* Left: Info */}
                                    <div className="space-y-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-light border-b border-gray-100 block pb-2">The Dream/Description</label>
                                            <p className="text-dark font-medium leading-relaxed italic whitespace-pre-wrap font-body">
                                                "{selected.description}"
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="p-4 bg-background rounded-3xl">
                                                <label className="text-[8px] font-bold uppercase tracking-widest text-light block mb-2">Budget Range</label>
                                                <div className="flex items-center space-x-2 text-primary">
                                                    <DollarSign size={16} />
                                                    <span className="text-xs font-bold">{selected.budgetRange}</span>
                                                </div>
                                            </div>
                                            <div className="p-4 bg-background rounded-3xl">
                                                <label className="text-[8px] font-bold uppercase tracking-widest text-light block mb-2">Target Date</label>
                                                <div className="flex items-center space-x-2 text-primary">
                                                    <Calendar size={16} />
                                                    <span className="text-xs font-bold">{format(new Date(selected.preferredDate), 'dd MMM yyyy')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Visual Reference */}
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-light border-b border-gray-100 block pb-2">Reference Image</label>
                                        {selected.referenceImage ? (
                                            <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden group relative bg-background border border-gray-100">
                                                <img src={selected.referenceImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                                <a
                                                    href={selected.referenceImage}
                                                    target="_blank"
                                                    className="absolute bottom-6 right-6 p-4 bg-white/80 backdrop-blur-md rounded-2xl text-primary opacity-0 group-hover:opacity-100 transition-all shadow-xl"
                                                >
                                                    <ExternalLink size={24} />
                                                </a>
                                            </div>
                                        ) : (
                                            <div className="aspect-[4/5] rounded-[2.5rem] bg-background border-2 border-dashed border-gray-100 flex flex-col items-center justify-center opacity-40">
                                                <ImageIcon size={48} />
                                                <p className="text-xs font-bold mt-2">No reference provided</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Footer Actions */}
                                <div className="p-10 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
                                    <div className="flex bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                                        {['new', 'in_discussion', 'accepted', 'completed', 'rejected'].map(s => (
                                            <button
                                                key={s}
                                                onClick={() => updateStatus(selected._id, s)}
                                                className={`px-4 py-2 rounded-xl text-[8px] font-bold uppercase tracking-widest transition-all ${selected.status === s
                                                        ? 'bg-dark text-white shadow-md'
                                                        : 'text-light hover:text-dark'
                                                    }`}
                                            >
                                                {s.replace('_', ' ')}
                                            </button>
                                        ))}
                                    </div>
                                    <button className="btn-secondary h-12 px-6 flex items-center space-x-2">
                                        <Trash2 size={18} />
                                        <span>Archive Plan</span>
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full bg-white rounded-[4rem] border border-dashed border-gray-100 flex flex-col items-center justify-center space-y-6 opacity-30 text-center p-20">
                                <div className="w-24 h-24 bg-background rounded-full flex items-center justify-center">
                                    <Sparkles size={48} className="text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-heading font-bold text-dark">Dream Canvas Empty</h3>
                                    <p className="text-sm font-medium">Pick a custom request to start crafting.</p>
                                </div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>

            </div>

            {loading && (
                <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            )}
        </div>
    );
};

export default CustomOrderManagement;
