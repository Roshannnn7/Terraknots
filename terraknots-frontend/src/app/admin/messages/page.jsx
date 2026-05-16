'use client';

import { useState, useEffect } from 'react';
import {
    Mail,
    MessageSquare,
    User,
    Clock,
    CheckCircle2,
    Circle,
    Eye,
    Trash2,
    Reply,
    Edit2
} from 'lucide-react';
import api from '@/lib/api';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const MessageManagementPage = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/contact');
            setMessages(data?.messages || data?.data || []);
        } catch (error) {
            console.error('Error fetching messages:', error);
            setMessages([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/contact/${id}/status`, { status });
            fetchMessages();
            if (selectedMessage?._id === id) {
                setSelectedMessage({ ...selectedMessage, status });
            }
        } catch (error) {
            toast.error('Failed to update message status');
        }
    };

    const deleteMessage = async (id) => {
        if (!window.confirm('Archive this message permanently?')) return;
        try {
            await api.delete(`/contact/${id}`);
            toast.success('Message archived');
            fetchMessages();
            setSelectedMessage(null);
        } catch (error) {
            toast.error('Deletion failed');
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-heading font-bold text-dark">Letters & Inquiries</h1>
                <p className="text-light italic font-accent text-lg">Direct notes from the TerraKnots family.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

                {/* Messages List */}
                <div className="lg:col-span-2 space-y-4">
                    {(messages?.length || 0) > 0 ? (messages || []).map((msg) => (
                        <div
                            key={msg._id}
                            onClick={() => {
                                setSelectedMessage(msg);
                                if (msg.status === 'new') updateStatus(msg._id, 'read');
                            }}
                            className={`p-6 rounded-[2rem] border cursor-pointer transition-all ${selectedMessage?._id === msg._id
                                    ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-[1.02]'
                                    : 'bg-white border-gray-100 hover:border-primary/30 text-dark'
                                }`}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedMessage?._id === msg._id ? 'bg-white/20' : 'bg-background'
                                    }`}>
                                    <Mail size={18} className={selectedMessage?._id === msg._id ? 'text-white' : 'text-primary'} />
                                </div>
                                <div className="text-right">
                                    <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${msg.status === 'new'
                                            ? (selectedMessage?._id === msg._id ? 'bg-white text-primary' : 'bg-primary text-white')
                                            : (selectedMessage?._id === msg._id ? 'bg-white/10 text-white border border-white/20' : 'bg-gray-100 text-light')
                                        }`}>
                                        {msg.status}
                                    </span>
                                    <p className={`text-[8px] font-bold uppercase tracking-widest mt-1 opacity-60`}>
                                        {format(new Date(msg.createdAt), 'dd MMM')}
                                    </p>
                                </div>
                            </div>
                            <h4 className="text-sm font-bold truncate pr-6">{msg.subject}</h4>
                            <p className={`text-xs truncate ${selectedMessage?._id === msg._id ? 'text-white/70' : 'text-light'}`}>{msg.name}</p>
                        </div>
                    )) : (
                        <div className="py-20 text-center opacity-30 italic text-sm">No incoming letters yet.</div>
                    )}
                </div>

                {/* Message View/Detail */}
                <div className="lg:col-span-3 min-h-[600px]">
                    <AnimatePresence mode="wait">
                        {selectedMessage ? (
                            <motion.div
                                key={selectedMessage._id}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full"
                            >
                                {/* View Header */}
                                <div className="p-10 border-b border-gray-50 flex items-start justify-between">
                                    <div className="flex items-center space-x-6">
                                        <div className="w-16 h-16 rounded-3xl bg-background flex items-center justify-center text-primary text-xl font-heading font-bold shadow-inner">
                                            {selectedMessage?.name?.[0] || '?'}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-heading font-bold text-dark">{selectedMessage.name}</h2>
                                            <p className="text-sm text-primary font-bold">{selectedMessage.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => deleteMessage(selectedMessage._id)}
                                            className="p-3 text-light hover:text-red-500 bg-background rounded-xl transition-all"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>

                                {/* View Body */}
                                <div className="flex-1 p-10 space-y-8 overflow-y-auto no-scrollbar">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-light">Subject</label>
                                        <h3 className="text-xl font-bold text-dark italic font-accent underline decoration-primary/20 underline-offset-8">
                                            {selectedMessage.subject}
                                        </h3>
                                    </div>

                                    <div className="p-8 bg-background/50 rounded-[2.5rem] relative">
                                        <MessageSquare size={40} className="absolute -top-4 -left-4 text-primary/5 -rotate-12" />
                                        <p className="text-dark font-medium leading-relaxed font-body whitespace-pre-wrap">
                                            {selectedMessage.message}
                                        </p>
                                    </div>

                                    {/* Admin Notes Section */}
                                    <div className="space-y-4 pt-4">
                                        <div className="flex items-center space-x-2 text-light">
                                            <Edit2 size={14} />
                                            <label className="text-[10px] font-bold uppercase tracking-[0.2em]">Internal Artisan Notes</label>
                                        </div>
                                        <textarea
                                            className="w-full bg-background border-none rounded-[2rem] p-6 text-sm focus:ring-2 focus:ring-primary/20 transition-all resize-none min-h-[120px]"
                                            placeholder="Add notes about this inquiry (e.g. 'Processing refund', 'Special custom order request')..."
                                            value={selectedMessage.adminNotes || ''}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setSelectedMessage(prev => ({ ...prev, adminNotes: val }));
                                                // Debounced or direct save
                                            }}
                                            onBlur={async () => {
                                                try {
                                                    await api.put(`/contact/${selectedMessage._id}/status`, { adminNotes: selectedMessage.adminNotes });
                                                    toast.success('Notes saved');
                                                } catch (error) {
                                                    toast.error('Failed to save notes');
                                                }
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* View Footer/Actions */}
                                <div className="p-10 bg-gray-50/50 flex items-center justify-between border-t border-gray-50">
                                    <div className="flex items-center space-x-4">
                                        <span className="text-[10px] font-bold text-light uppercase tracking-widest">Mark as:</span>
                                        <div className="flex bg-white p-1.5 rounded-2xl border border-gray-100">
                                            {['new', 'read', 'responded'].map(s => (
                                                <button
                                                    key={s}
                                                    onClick={() => updateStatus(selectedMessage._id, s)}
                                                    className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${selectedMessage.status === s
                                                            ? 'bg-primary text-white shadow-sm'
                                                            : 'text-light hover:text-primary'
                                                        }`}
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <a
                                        href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                                        className="btn-primary h-12 px-8 flex items-center space-x-2 shadow-lg shadow-primary/20"
                                    >
                                        <Reply size={18} />
                                        <span>Send Response</span>
                                    </a>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full bg-white rounded-[3rem] border border-dashed border-gray-100 flex flex-col items-center justify-center space-y-6 opacity-30 p-20 text-center">
                                <div className="w-24 h-24 bg-background rounded-full flex items-center justify-center">
                                    <Mail size={48} className="text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-heading font-bold text-dark">Workbench is Clear</h3>
                                    <p className="text-sm font-medium">Select a letter from the left to read and respond.</p>
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

export default MessageManagementPage;
