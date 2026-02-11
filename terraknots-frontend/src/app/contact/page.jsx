'use client';

import { useState } from 'react';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CONTACT_SUBJECTS } from '@/lib/constants';
import { toast } from 'react-toastify';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: CONTACT_SUBJECTS[0],
        message: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/contact', formData);
            toast.success(data.message);
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: CONTACT_SUBJECTS[0],
                message: ''
            });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error sending message');
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
                    <div className="max-w-6xl mx-auto">

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">

                            {/* Contact Info */}
                            <div className="space-y-12">
                                <motion.div
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-6"
                                >
                                    <h1 className="text-4xl md:text-6xl font-heading font-bold text-dark">Get in Touch</h1>
                                    <p className="text-lg text-light leading-relaxed">
                                        Have a question about an order? Want to share some feedback? Or just want to say hello? We are all ears!
                                    </p>
                                </motion.div>

                                <div className="space-y-8">
                                    <div className="flex items-start space-x-6">
                                        <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary flex-shrink-0">
                                            <Mail size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-heading font-bold text-dark text-xl">Email Us</h4>
                                            <p className="text-light">hello@terraknots.com</p>
                                            <p className="text-xs text-primary font-bold uppercase tracking-widest mt-1">Response within 24 hours</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-6">
                                        <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary flex-shrink-0">
                                            <Phone size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-heading font-bold text-dark text-xl">Call / WhatsApp</h4>
                                            <p className="text-light">+91 XXXXXXXXXX</p>
                                            <p className="text-xs text-primary font-bold uppercase tracking-widest mt-1">Mon - Sat | 10am - 7pm</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-6">
                                        <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary flex-shrink-0">
                                            <MapPin size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-heading font-bold text-dark text-xl">Our Studio</h4>
                                            <p className="text-light">Handcrafted with love in <br /> Mumbai, Maharashtra, India 🇮🇳</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 bg-primary/5 rounded-[3rem] border border-primary/10 space-y-4">
                                    <h4 className="font-heading font-bold text-dark flex items-center">
                                        <MessageCircle size={20} className="mr-2 text-primary" />
                                        Quick WhatsApp Chat
                                    </h4>
                                    <p className="text-sm text-light">Need a faster response? Text us directly on WhatsApp for quick inquiries about product availability or custom orders.</p>
                                    <a href="#" className="inline-block px-8 py-3 bg-[#25D366] text-white rounded-full font-bold text-sm shadow-lg shadow-[#25D366]/20 transform transition hover:scale-105 active:scale-95">
                                        Chat on WhatsApp
                                    </a>
                                </div>
                            </div>

                            {/* Contact Form */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white p-10 md:p-14 rounded-[3.5rem] shadow-xl shadow-primary/5 border border-primary/5"
                            >
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-light pl-4">Your Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="input-field"
                                            placeholder="Jane Doe"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-light pl-4">Phone Number</label>
                                            <input
                                                type="text"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="input-field"
                                                placeholder="Optional"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-light pl-4">Subject</label>
                                        <select
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            className="input-field appearance-none"
                                        >
                                            {CONTACT_SUBJECTS.map(sub => (
                                                <option key={sub}>{sub}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-light pl-4">Your Message</label>
                                        <textarea
                                            rows={5}
                                            required
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            className="input-field resize-none"
                                            placeholder="How can we help you today?"
                                        />
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
                                                <span>Send Message</span>
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

export default ContactPage;
