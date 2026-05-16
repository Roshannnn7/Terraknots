'use client';

import { useState, useEffect } from 'react';
import {
    Star,
    CheckCircle,
    Trash2,
    Package,
    User,
    Clock,
    MessageCircle
} from 'lucide-react';
import { safeGet, safePut, safeDelete } from '@/lib/apiClient';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const ReviewManagementPage = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const data = await safeGet('/reviews', []);
            setReviews(Array.isArray(data) ? data : (data?.reviews || data?.data || []));
        } catch (error) {
            console.error('Error fetching reviews:', error);
            setReviews([]);
            toast.error('Error fetching reviews');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const approveReview = async (id) => {
        const result = await safePut(`/reviews/${id}/approve`, {});
        if (result.success) {
            toast.success('Review approved for shop');
            fetchReviews();
        } else {
            toast.error(result.error || 'Approval failed');
        }
    };

    const deleteReview = async (id) => {
        if (!window.confirm('Delete this feedback forever?')) return;
        const result = await safeDelete(`/reviews/${id}`);
        if (result.success) {
            toast.success('Review removed');
            fetchReviews();
        } else {
            toast.error(result.error || 'Deletion failed');
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-heading font-bold text-dark">Customer Feedback</h1>
                <p className="text-light italic font-accent text-lg">Curate the voices of your community.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <AnimatePresence mode="popLayout">
                    {reviews.length > 0 ? (reviews || []).map((review, idx) => (
                        <motion.div
                            key={review?._id || idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`bg-white p-8 rounded-[3rem] border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-8 transition-all ${review?.isApproved ? 'border-gray-100' : 'border-[#C4A882]/20 bg-[#C4A882]/[0.02]'
                                }`}
                        >
                            <div className="flex-1 flex gap-6">
                                <div className="hidden sm:block">
                                    <div className="w-14 h-14 rounded-2xl bg-background flex items-center justify-center text-primary group overflow-hidden border border-gray-100">
                                        <img src={review?.product?.images?.[0] || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" alt="" />
                                    </div>
                                </div>
                                <div className="space-y-3 min-w-0">
                                    <div className="flex items-center space-x-2">
                                        <div className="flex text-[#C4A882]">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} fill={i < (review?.rating || 0) ? 'currentColor' : 'none'} className={i < (review?.rating || 0) ? '' : 'text-gray-200'} />
                                            ))}
                                        </div>
                                        {!review?.isApproved && (
                                            <span className="px-3 py-0.5 bg-[#C4A882]/10 text-[#C4A882] text-[8px] font-bold uppercase tracking-widest rounded-full">Pending Approval</span>
                                        )}
                                    </div>
                                    <h4 className="text-dark font-bold text-sm line-clamp-1 italic">"{review?.comment || 'No comment provided'}"</h4>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                        <div className="flex items-center space-x-1.5 text-[10px] font-bold text-light uppercase tracking-wider">
                                            <User size={12} className="text-[#C4A882]" />
                                            <span>{review?.user?.name || review?.userName || 'Anonymous'}</span>
                                        </div>
                                        <div className="flex items-center space-x-1.5 text-[10px] font-bold text-light uppercase tracking-wider">
                                            <Package size={12} className="text-[#C4A882]" />
                                            <span>{review?.product?.name || 'Unknown Product'}</span>
                                        </div>
                                        <div className="flex items-center space-x-1.5 text-[10px] font-bold text-light uppercase tracking-wider">
                                            <Clock size={12} className="text-[#C4A882]" />
                                            <span>{review?.createdAt ? format(new Date(review.createdAt), 'dd MMM yyyy') : 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 self-end md:self-center">
                                {!review?.isApproved && (
                                    <button
                                        onClick={() => approveReview(review._id)}
                                        className="h-12 px-6 flex items-center space-x-2 bg-green-500 text-white rounded-2xl font-bold text-xs hover:bg-green-600 transition-all shadow-lg shadow-green-500/20"
                                    >
                                        <CheckCircle size={16} />
                                        <span>Approve</span>
                                    </button>
                                )}
                                <button
                                    onClick={() => deleteReview(review._id)}
                                    className="w-12 h-12 flex items-center justify-center bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all border border-red-100"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </motion.div>
                    )) : !loading && (
                        <div className="bg-white rounded-[3rem] border border-dashed border-gray-200 py-32 flex flex-col items-center justify-center space-y-4">
                            <Star size={48} className="text-gray-300" />
                            <p className="text-lg font-bold text-dark text-center font-heading">No feedback found to curate.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {loading && (
                <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="w-10 h-10 border-4 border-[#C4A882] border-t-transparent rounded-full animate-spin" />
                </div>
            )}
        </div>
    );
};

export default ReviewManagementPage;
