'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, MapPin, CheckCircle, Home, Building } from 'lucide-react';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { toast } from 'react-toastify';

const defaultForm = { label: 'Home', name: '', phone: '', street: '', city: '', state: '', pincode: '', isDefault: false };

export default function AddressesPage() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState(defaultForm);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) router.push('/login');
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        if (!isAuthenticated) return;
        fetchAddresses();
    }, [isAuthenticated]);

    const fetchAddresses = async () => {
        try {
            const { data } = await api.get('/auth/addresses');
            setAddresses(data.addresses || []);
        } catch {
            // Silently fail - user might not have addresses yet
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editId) {
                await api.put(`/auth/addresses/${editId}`, formData);
                toast.success('Address updated!');
            } else {
                await api.post('/auth/addresses', formData);
                toast.success('Address added!');
            }
            setShowForm(false);
            setEditId(null);
            setFormData(defaultForm);
            fetchAddresses();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save address');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this address?')) return;
        try {
            await api.delete(`/auth/addresses/${id}`);
            toast.success('Address removed');
            fetchAddresses();
        } catch {
            toast.error('Failed to delete');
        }
    };

    const handleEdit = (addr) => {
        setFormData({ ...addr });
        setEditId(addr._id);
        setShowForm(true);
    };

    if (authLoading) return null;

    const LABELS = [
        { value: 'Home', icon: <Home size={14} /> },
        { value: 'Work', icon: <Building size={14} /> },
        { value: 'Other', icon: <MapPin size={14} /> },
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
                            My <span className="font-accent italic text-primary">Addresses</span>
                        </motion.h1>
                    </div>
                </div>

                <div className="container py-12 max-w-3xl">
                    {/* Add new address button */}
                    <motion.button
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => { setShowForm(!showForm); setEditId(null); setFormData(defaultForm); }}
                        className="w-full mb-6 py-4 rounded-2xl border-2 border-dashed border-primary/30 text-primary font-semibold flex items-center justify-center gap-2 hover:bg-primary/5 transition-all"
                    >
                        <Plus size={18} />
                        {showForm && !editId ? 'Cancel' : 'Add New Address'}
                    </motion.button>

                    {/* Form */}
                    <AnimatePresence>
                        {showForm && (
                            <motion.form
                                initial={{ opacity: 0, height: 0, y: -10 }}
                                animate={{ opacity: 1, height: 'auto', y: 0 }}
                                exit={{ opacity: 0, height: 0, y: -10 }}
                                transition={{ duration: 0.35 }}
                                onSubmit={handleSave}
                                className="bg-white rounded-2xl p-6 mb-6 overflow-hidden"
                                style={{ boxShadow: '0 4px 20px rgba(139,115,85,0.08)' }}
                            >
                                <h3 className="font-heading font-bold text-dark text-xl mb-6">
                                    {editId ? 'Edit Address' : 'New Address'}
                                </h3>

                                {/* Label selector */}
                                <div className="flex gap-3 mb-6">
                                    {LABELS.map(({ value, icon }) => (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, label: value })}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${formData.label === value ? 'bg-primary text-white' : 'bg-gray-100 text-dark hover:bg-gray-200'}`}
                                        >
                                            {icon} {value}
                                        </button>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest text-light mb-1 block">Full Name</label>
                                        <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="John Doe" className="input-field" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest text-light mb-1 block">Phone</label>
                                        <input required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="+91 XXXXX XXXXX" className="input-field" />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-light mb-1 block">Street Address</label>
                                        <input required value={formData.street} onChange={e => setFormData({ ...formData, street: e.target.value })}
                                            placeholder="House No, Street Name, Landmark" className="input-field" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest text-light mb-1 block">City</label>
                                        <input required value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })}
                                            placeholder="Mumbai" className="input-field" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest text-light mb-1 block">State</label>
                                        <input required value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })}
                                            placeholder="Maharashtra" className="input-field" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest text-light mb-1 block">Pincode</label>
                                        <input required value={formData.pincode} onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                                            placeholder="400001" className="input-field" maxLength={6} />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input type="checkbox" id="isDefault" checked={formData.isDefault}
                                            onChange={e => setFormData({ ...formData, isDefault: e.target.checked })}
                                            className="w-4 h-4 accent-primary" />
                                        <label htmlFor="isDefault" className="text-sm font-semibold text-dark cursor-pointer">Set as default</label>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <motion.button type="submit" disabled={saving}
                                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                        className="flex-1 py-3 rounded-xl font-bold text-white disabled:opacity-60"
                                        style={{ background: 'linear-gradient(135deg, #C4A882, #D4A574)' }}>
                                        {saving ? 'Saving...' : editId ? 'Update Address' : 'Save Address'}
                                    </motion.button>
                                    <button type="button" onClick={() => { setShowForm(false); setEditId(null); }}
                                        className="px-6 py-3 rounded-xl font-bold text-dark bg-gray-100 hover:bg-gray-200 transition-colors">
                                        Cancel
                                    </button>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    {/* Address cards */}
                    {loading ? (
                        <div className="space-y-4">
                            {[...Array(2)].map((_, i) => <div key={i} className="skeleton h-36 rounded-2xl" />)}
                        </div>
                    ) : addresses.length === 0 && !showForm ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="text-center py-16 bg-white rounded-2xl">
                            <div className="text-5xl mb-4">📍</div>
                            <h3 className="text-xl font-heading font-bold text-dark mb-2">No addresses saved</h3>
                            <p className="text-light text-sm">Add your delivery addresses for faster checkout.</p>
                        </motion.div>
                    ) : (
                        <div className="space-y-4">
                            {addresses.map((addr, i) => (
                                <motion.div key={addr._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                                    className={`bg-white rounded-2xl p-6 border-2 transition-all ${addr.isDefault ? 'border-primary' : 'border-transparent'}`}
                                    style={{ boxShadow: '0 2px 12px rgba(139,115,85,0.06)' }}>
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                                style={{ background: 'linear-gradient(135deg, #F2D7C9, #C4A882)' }}>
                                                <MapPin size={18} className="text-white" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm font-bold text-dark">{addr.label || 'Home'}</span>
                                                    {addr.isDefault && (
                                                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold text-primary" style={{ backgroundColor: 'rgba(196,168,130,0.15)' }}>
                                                            Default
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm font-semibold text-dark">{addr.name}</p>
                                                <p className="text-xs text-light mt-0.5">{addr.street}</p>
                                                <p className="text-xs text-light">{addr.city}, {addr.state} — {addr.pincode}</p>
                                                <p className="text-xs text-light">{addr.phone}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2 flex-shrink-0">
                                            <button onClick={() => handleEdit(addr)}
                                                className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all">
                                                <Edit size={13} />
                                            </button>
                                            <button onClick={() => handleDelete(addr._id)}
                                                className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-red-100 hover:text-red-500 transition-all">
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
