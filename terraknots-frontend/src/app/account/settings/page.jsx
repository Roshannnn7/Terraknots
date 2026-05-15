'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, Save, Loader, Bell, Shield, Trash2 } from 'lucide-react';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { toast } from 'react-toastify';

export default function AccountSettingsPage() {
    const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('profile');

    const [profileForm, setProfileForm] = useState({ name: '', email: '', phone: '' });
    const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
    const [savingProfile, setSavingProfile] = useState(false);
    const [savingPw, setSavingPw] = useState(false);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) router.push('/login');
        if (user) setProfileForm({ name: user.name || '', email: user.email || '', phone: user.phone || '' });
    }, [user, authLoading, isAuthenticated, router]);

    const handleProfileSave = async (e) => {
        e.preventDefault();
        setSavingProfile(true);
        try {
            await api.put('/auth/profile', profileForm);
            toast.success('Profile updated successfully!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed');
        } finally {
            setSavingProfile(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (pwForm.newPassword !== pwForm.confirmPassword) { toast.error("Passwords don't match"); return; }
        if (pwForm.newPassword.length < 8) { toast.error("Password must be at least 8 characters"); return; }
        setSavingPw(true);
        try {
            await api.put('/auth/change-password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
            toast.success('Password changed successfully!');
            setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to change password');
        } finally {
            setSavingPw(false);
        }
    };

    if (authLoading) return null;

    const tabs = [
        { id: 'profile', label: 'Profile', icon: <User size={16} /> },
        { id: 'security', label: 'Password', icon: <Shield size={16} /> },
        { id: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
    ];

    return (
        <>
            <AnnouncementBar />
            <Navbar />
            <main className="min-h-screen bg-background pt-[108px] pb-24">
                <div className="relative py-16 overflow-hidden" style={{ background: 'linear-gradient(135deg, #F5F0EB, #F2D7C9)' }}>
                    <div className="container text-center">
                        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-heading font-bold text-dark">
                            Account <span className="font-accent italic text-primary">Settings</span>
                        </motion.h1>
                    </div>
                </div>

                <div className="container py-12 max-w-2xl">
                    {/* Tabs */}
                    <div className="flex gap-2 mb-8 bg-white rounded-2xl p-2" style={{ boxShadow: '0 2px 12px rgba(139,115,85,0.06)' }}>
                        {tabs.map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-primary text-white shadow-sm' : 'text-light hover:text-dark'}`}>
                                {tab.icon} {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <motion.form initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleProfileSave}
                            className="bg-white rounded-2xl p-6 md:p-8 space-y-6" style={{ boxShadow: '0 4px 20px rgba(139,115,85,0.08)' }}>
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-light mb-1 block">Full Name</label>
                                <div className="relative">
                                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-light" />
                                    <input value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                                        className="input-field pl-11" placeholder="Your full name" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-light mb-1 block">Email</label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-light" />
                                    <input value={profileForm.email} disabled
                                        className="input-field pl-11 bg-gray-50 cursor-not-allowed opacity-70" />
                                </div>
                                <p className="text-xs text-light mt-1">Email cannot be changed</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-light mb-1 block">Phone Number</label>
                                <input value={profileForm.phone} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                                    className="input-field" placeholder="+91 XXXXX XXXXX" />
                            </div>
                            <motion.button type="submit" disabled={savingProfile}
                                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white disabled:opacity-60"
                                style={{ background: 'linear-gradient(135deg, #C4A882, #D4A574)' }}>
                                {savingProfile ? <><Loader size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Changes</>}
                            </motion.button>
                        </motion.form>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <motion.form initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} onSubmit={handlePasswordChange}
                            className="bg-white rounded-2xl p-6 md:p-8 space-y-6" style={{ boxShadow: '0 4px 20px rgba(139,115,85,0.08)' }}>
                            {[
                                { label: 'Current Password', field: 'currentPassword', key: 'current' },
                                { label: 'New Password', field: 'newPassword', key: 'new' },
                                { label: 'Confirm New Password', field: 'confirmPassword', key: 'confirm' },
                            ].map(({ label, field, key }) => (
                                <div key={field}>
                                    <label className="text-xs font-bold uppercase tracking-widest text-light mb-1 block">{label}</label>
                                    <div className="relative">
                                        <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-light" />
                                        <input type={showPw[key] ? 'text' : 'password'}
                                            value={pwForm[field]} onChange={e => setPwForm({ ...pwForm, [field]: e.target.value })}
                                            className="input-field pl-11 pr-12" placeholder="••••••••" />
                                        <button type="button" onClick={() => setShowPw({ ...showPw, [key]: !showPw[key] })}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-light hover:text-dark">
                                            {showPw[key] ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <motion.button type="submit" disabled={savingPw}
                                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white disabled:opacity-60"
                                style={{ background: 'linear-gradient(135deg, #C4A882, #D4A574)' }}>
                                {savingPw ? <><Loader size={16} className="animate-spin" /> Updating...</> : <><Shield size={16} /> Update Password</>}
                            </motion.button>
                        </motion.form>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl p-6 md:p-8 space-y-4" style={{ boxShadow: '0 4px 20px rgba(139,115,85,0.08)' }}>
                            {[
                                { label: 'Order updates via email', desc: 'Get notified when your order ships or is delivered', defaultOn: true },
                                { label: 'New arrivals & collections', desc: 'Be the first to know about new handmade items', defaultOn: false },
                                { label: 'Sale & offers', desc: 'Exclusive discounts for subscribed members', defaultOn: true },
                                { label: 'Newsletter', desc: 'Monthly craft stories and behind-the-scenes content', defaultOn: false },
                            ].map((notif, i) => (
                                <div key={i} className="flex items-start justify-between gap-4 py-4 border-b border-gray-50 last:border-0">
                                    <div>
                                        <p className="text-sm font-bold text-dark">{notif.label}</p>
                                        <p className="text-xs text-light">{notif.desc}</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                                        <input type="checkbox" defaultChecked={notif.defaultOn} className="sr-only peer" />
                                        <div className="w-10 h-6 rounded-full peer bg-gray-200 peer-checked:bg-primary transition-colors" />
                                        <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
                                    </label>
                                </div>
                            ))}
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                onClick={() => toast.success('Preferences saved!')}
                                className="mt-2 flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white"
                                style={{ background: 'linear-gradient(135deg, #C4A882, #D4A574)' }}>
                                <Save size={16} /> Save Preferences
                            </motion.button>
                        </motion.div>
                    )}

                    {/* Danger Zone */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="mt-8 bg-white rounded-2xl p-6 border-l-4 border-error" style={{ boxShadow: '0 4px 20px rgba(199,92,92,0.06)' }}>
                        <h3 className="font-bold text-dark text-sm mb-2 flex items-center gap-2"><Trash2 size={15} className="text-error" /> Danger Zone</h3>
                        <p className="text-xs text-light mb-4">Permanently delete your TerraKnots account and all associated data.</p>
                        <button className="text-xs font-bold text-error border border-error/30 px-4 py-2 rounded-lg hover:bg-error/5 transition-colors">
                            Delete My Account
                        </button>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </>
    );
}
