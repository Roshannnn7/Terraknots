'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Save, Package } from 'lucide-react';
import Link from 'next/link';

const AccountPage = () => {
    const { user, updateProfile, loading: authLoading, isAuthenticated } = useAuth();
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: {
            street: '',
            city: '',
            state: '',
            pincode: ''
        }
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }

        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: {
                    street: user.address?.street || '',
                    city: user.address?.city || '',
                    state: user.address?.state || '',
                    pincode: user.address?.pincode || ''
                }
            });
        }
    }, [user, authLoading, isAuthenticated, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.phone) {
            const phoneRegex = /^[6-9]\d{9}$/;
            if (!phoneRegex.test(formData.phone)) {
                return toast.error('Please enter a valid 10-digit phone number');
            }
        }

        if (formData.address && formData.address.pincode) {
            const pincodeRegex = /^[1-9][0-9]{5}$/;
            if (!pincodeRegex.test(formData.address.pincode)) {
                return toast.error('Please enter a valid 6-digit pincode');
            }
        }

        setLoading(true);
        try {
            await updateProfile(formData);
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) return null;

    return (
        <>
            <AnnouncementBar />
            <Navbar />

            <main className="pt-32 pb-24 bg-background">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

                        {/* Sidebar Navigation */}
                        <aside className="lg:col-span-1 space-y-4">
                            <div className="bg-white p-8 rounded-[2rem] shadow-sm text-center">
                                <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold font-heading">
                                    {user?.name.charAt(0).toUpperCase()}
                                </div>
                                <h3 className="text-xl font-heading font-bold text-dark">{user?.name}</h3>
                                <p className="text-xs text-light font-bold uppercase tracking-widest mt-1">Artisan Member</p>
                            </div>

                            <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden p-2">
                                <Link href="/account" className="flex items-center space-x-3 px-6 py-4 rounded-2xl bg-primary/10 text-primary font-bold transition-all">
                                    <User size={20} />
                                    <span>My Profile</span>
                                </Link>
                                <Link href="/account/orders" className="flex items-center space-x-3 px-6 py-4 rounded-2xl text-light hover:bg-background transition-all">
                                    <Package size={20} />
                                    <span>Order History</span>
                                </Link>
                            </div>
                        </aside>

                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white p-10 md:p-12 rounded-[3rem] shadow-sm space-y-10"
                            >
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-heading font-bold text-dark">Profile Details</h2>
                                    <p className="text-light italic">Manage your account and shipping preferences.</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {/* Basic Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-light pl-4 flex items-center">
                                                <User size={12} className="mr-1 text-primary" /> Full Name
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="input-field"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-light pl-4 flex items-center">
                                                <Mail size={12} className="mr-1 text-primary" /> Email
                                            </label>
                                            <input
                                                type="email"
                                                disabled
                                                value={formData.email}
                                                className="input-field bg-gray-50 cursor-not-allowed"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-light pl-4 flex items-center">
                                                <Phone size={12} className="mr-1 text-primary" /> Phone Number
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                                                className="input-field"
                                                placeholder="10 digit mobile number"
                                            />
                                        </div>
                                    </div>

                                    {/* Address Info */}
                                    <div className="space-y-6 pt-6 border-t border-gray-100">
                                        <div className="flex items-center space-x-2 text-primary">
                                            <MapPin size={20} />
                                            <h4 className="font-heading font-bold text-dark text-xl">Default Shipping Address</h4>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="md:col-span-2 space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-light">Street Address</label>
                                                <input
                                                    type="text"
                                                    value={formData.address.street}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        address: { ...formData.address, street: e.target.value }
                                                    })}
                                                    className="input-field"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-light">City</label>
                                                <input
                                                    type="text"
                                                    value={formData.address.city}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        address: { ...formData.address, city: e.target.value }
                                                    })}
                                                    className="input-field"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-light">State</label>
                                                <input
                                                    type="text"
                                                    value={formData.address.state}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        address: { ...formData.address, state: e.target.value }
                                                    })}
                                                    className="input-field"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-light">Pincode</label>
                                                <input
                                                    type="text"
                                                    value={formData.address.pincode}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        address: { ...formData.address, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) }
                                                    })}
                                                    className="input-field"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn-primary flex items-center space-x-3 px-10"
                                    >
                                        {loading ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Save size={20} />
                                                <span>Save Profile Changes</span>
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

export default AccountPage;
