'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, CheckCircle2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';

const Reviews = ({ productId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [submitting, setSubmitting] = useState(false);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const { data } = await api.get(`/reviews/product/${productId}`);
                setReviews(data.reviews);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, [productId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newReview.comment) return;

        setSubmitting(true);
        try {
            const { data } = await api.post('/reviews', {
                product: productId,
                ...newReview
            });
            toast.success(data.message);
            setNewReview({ rating: 5, comment: '' });
            setShowForm(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error submitting review');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-gray-100 pb-8">
                <div>
                    <h2 className="text-3xl font-heading font-bold text-dark">Customer Reviews</h2>
                    <p className="text-light mt-1">Shared by our lovely community</p>
                </div>

                {isAuthenticated ? (
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="btn-secondary"
                    >
                        {showForm ? 'Cancel Review' : 'Write a Review'}
                    </button>
                ) : (
                    <p className="text-sm italic text-primary">Login to share your feedback 💛</p>
                )}
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-primary/20 space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-dark">Your Rating</label>
                                <div className="flex space-x-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setNewReview({ ...newReview, rating: star })}
                                        >
                                            <Star
                                                size={28}
                                                fill={newReview.rating >= star ? "#C4A882" : "none"}
                                                className={newReview.rating >= star ? "text-primary" : "text-gray-300"}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-dark">Your Thoughts</label>
                                <textarea
                                    placeholder="Tell us what you loved about this piece..."
                                    rows={4}
                                    value={newReview.comment}
                                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                    className="w-full bg-background rounded-2xl p-4 outline-none focus:ring-1 focus:ring-primary text-sm"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="btn-primary w-full md:w-auto"
                            >
                                {submitting ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {loading ? (
                    <p>Loading reviews...</p>
                ) : reviews.length > 0 ? (
                    reviews.map((review, idx) => (
                        <motion.div
                            key={review._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white p-8 rounded-3xl shadow-sm border border-gray-50 flex flex-col"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        {review.userName.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-dark flex items-center">
                                            {review.userName}
                                            <CheckCircle2 size={14} className="text-green-500 ml-1.5" />
                                        </h4>
                                        <span className="text-[10px] text-light uppercase tracking-widest">{formatDate(review.createdAt)}</span>
                                    </div>
                                </div>
                                <div className="flex text-primary">
                                    {[...Array(review.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                </div>
                            </div>
                            <p className="text-sm text-dark/80 leading-relaxed italic flex-1">
                                "{review.comment}"
                            </p>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-2 text-center py-16 space-y-4 bg-background/50 rounded-[3rem]">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto text-primary">
                            <MessageSquare size={32} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-heading font-bold">No reviews yet</h3>
                            <p className="text-sm text-light">Be the first to share your experience!</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reviews;
