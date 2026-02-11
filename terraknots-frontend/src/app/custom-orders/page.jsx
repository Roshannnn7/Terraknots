'use client';

import { useState } from 'react';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CUSTOM_ORDER_BUDGETS } from '@/lib/constants';
import { toast } from 'react-toastify';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { PenTool, Upload, Send, Sparkles, MessageCircle } from 'lucide-react';

const CustomOrderPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        productType: 'Crochet',
        description: '',
        budgetRange: CUSTOM_ORDER_BUDGETS[0],
        deadline: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/custom-orders', formData);
            toast.success(data.message);
            setFormData({
                name: '',
                email: '',
                phone: '',
                productType: 'Crochet',
                description: '',
                budgetRange: CUSTOM_ORDER_BUDGETS[0],
                deadline: ''
            });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error submitting request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <AnnouncementBar />
            <Navbar />

            <main className="pt-32 pb-24 bg-background">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-16">

                        {/* Left Content */}
                        <div className="lg:col-span-2 space-y-8">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20">
                                    Custom Creations
                                </div>
                                <h1 className="text-4xl md:text-5xl font-heading font-bold text-dark leading-tight">
                                    Have something <br />
                                    <span className="text-primary italic font-accent">special</span> in mind?
                                </h1>
                                <p className="text-light leading-relaxed">
                                    We love bringing your unique visions to life. Whether it's a specific amigurumi character, a personalised resin preservation, or a unique pair of earrings, our artisans are ready to collaborate with you.
                                </p>

                                <div className="space-y-6 pt-6">
                                    {[
                                        { title: 'Personalized Design', desc: 'Collaborate with us on colors, materials, and sizing.', icon: PenTool },
                                        { title: 'Regular Updates', desc: 'Receive photos of the process as we craft your piece.', icon: Sparkles },
                                        { title: 'Direct Chat', desc: 'Connect with the artisan via WhatsApp for quick adjustments.', icon: MessageCircle },
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-start space-x-4">
                                            <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary flex-shrink-0">
                                                <item.icon size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-heading font-bold text-dark">{item.title}</h4>
                                                <p className="text-sm text-light">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Form */}
                        <div className="lg:col-span-3">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white p-10 md:p-12 rounded-[3.5rem] shadow-xl shadow-primary/5 border border-primary/10 relative overflow-hidden"
                            >
                                {/* Decorative dots */}
                                <div className="absolute top-8 right-8 flex space-x-2">
                                    <div className="w-2 h-2 rounded-full bg-primary/20" />
                                    <div className="w-2 h-2 rounded-full bg-accent/20" />
                                    <div className="w-2 h-2 rounded-full bg-terracotta/20" />
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-light pl-4">Full Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="input-field"
                                                placeholder="Your Name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-light pl-4">Email Address</label>
                                            <input
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="input-field"
                                                placeholder="your@email.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-light pl-4">Product Type</label>
                                            <select
                                                value={formData.productType}
                                                onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                                                className="input-field appearance-none"
                                            >
                                                <option>Crochet</option>
                                                <option>Resin</option>
                                                <option>Clay</option>
                                                <option>Other</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-light pl-4">Expected Deadline</label>
                                            <input
                                                type="date"
                                                value={formData.deadline}
                                                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                                className="input-field"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-light pl-4">Budget Range</label>
                                        <div className="flex flex-wrap gap-2">
                                            {CUSTOM_ORDER_BUDGETS.map(budget => (
                                                <button
                                                    key={budget}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, budgetRange: budget })}
                                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${formData.budgetRange === budget
                                                            ? 'bg-primary text-white shadow-md'
                                                            : 'bg-background text-light hover:bg-primary/10'
                                                        }`}
                                                >
                                                    {budget}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-light pl-4">Describe Your Vision</label>
                                        <textarea
                                            rows={5}
                                            required
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="input-field resize-none"
                                            placeholder="Color preferences, themes, sizes, or specific references..."
                                        />
                                    </div>

                                    <div className="p-4 bg-background rounded-2xl flex items-center space-x-3 text-xs text-light italic">
                                        <Upload size={16} className="text-primary" />
                                        <span>Want to share reference images? Reach out to us on WhatsApp after submitting!</span>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full btn-primary h-14 flex items-center justify-center space-x-3 text-lg"
                                    >
                                        {loading ? (
                                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Send size={20} />
                                                <span>Submit Custom Request</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
};

export default CustomOrderPage;
