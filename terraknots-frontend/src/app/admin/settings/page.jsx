'use client';

import { useState, useEffect, useRef } from 'react';
import {
    Settings as SettingsIcon,
    Store,
    CreditCard,
    Truck,
    Bell,
    Save,
    Instagram,
    Mail,
    MessageCircle,
    Upload,
    Image as ImageIcon,
    Layout
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const AdminSettingsPage = () => {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('store');
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await api.get('/settings/all');
                setSettings(data.settings);
            } catch (error) {
                console.error('Error fetching settings');
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleUpdate = (field, value) => {
        setSettings({ ...settings, [field]: value });
    };

    const handleNestedUpdate = (parent, field, value) => {
        setSettings({
            ...settings,
            [parent]: { ...settings[parent], [field]: value }
        });
    };

    const handleImageUpload = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            toast.info('Uploading image...');
            const { data } = await api.post('/upload/image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            handleUpdate(type, data.url);
            toast.success('Visual updated!');
        } catch (error) {
            toast.error('Upload failed');
        }
    };

    const saveSettings = async () => {
        setSaving(true);
        try {
            await api.put('/settings', settings);
            toast.success('TerraKnots configuration updated!');
        } catch (error) {
            toast.error('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="animate-pulse py-20 bg-white rounded-[3rem]" />;
    if (!settings) return <div>Failed to load settings.</div>;

    const tabs = [
        { id: 'store', label: 'Identity', icon: Store },
        { id: 'payment', label: 'Checkout', icon: CreditCard },
        { id: 'shipping', label: 'Logistics', icon: Truck },
        { id: 'homepage', label: 'Front Desk', icon: Layout },
    ];

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-dark">Loom Configuration</h1>
                    <p className="text-light italic font-accent text-lg">Fine-tune the soul of TerraKnots.</p>
                </div>
                <button
                    onClick={saveSettings}
                    disabled={saving}
                    className="btn-primary h-14 px-10 flex items-center space-x-3 shadow-xl shadow-primary/20"
                >
                    {saving ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <>
                            <Save size={20} />
                            <span>Commit Changes</span>
                        </>
                    )}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

                {/* Sidebar Nav */}
                <div className="lg:col-span-1 space-y-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all font-bold text-sm ${activeTab === tab.id
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.05]'
                                    : 'text-light hover:bg-white hover:text-primary'
                                }`}
                        >
                            <tab.icon size={20} />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Form Area */}
                <div className="lg:col-span-3 bg-white rounded-[4rem] border border-gray-100 shadow-sm p-12">

                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-10"
                    >
                        {activeTab === 'store' && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">Store Name</label>
                                        <input
                                            className="input-field h-14"
                                            value={settings.storeName}
                                            onChange={(e) => handleUpdate('storeName', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">Contact Email</label>
                                        <input
                                            className="input-field h-14"
                                            value={settings.contactEmail}
                                            onChange={(e) => handleUpdate('contactEmail', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">WhatsApp (with 91 prefix)</label>
                                        <div className="relative group">
                                            <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                                            <input
                                                className="input-field h-14 pl-12"
                                                value={settings.whatsappNumber}
                                                onChange={(e) => handleUpdate('whatsappNumber', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">Instagram URL</label>
                                        <div className="relative group">
                                            <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                                            <input
                                                className="input-field h-14 pl-12"
                                                value={settings.instagramUrl}
                                                onChange={(e) => handleUpdate('instagramUrl', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-6 border-t border-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="text-sm font-bold text-dark uppercase tracking-widest">Announcement Bar</h4>
                                            <p className="text-[10px] text-light">Shown at the very top of every page.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox" className="sr-only peer"
                                                checked={settings.announcementActive}
                                                onChange={(e) => handleUpdate('announcementActive', e.target.checked)}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>
                                    <input
                                        className="input-field h-14"
                                        placeholder="e.g. Free shipping on orders above ₹499"
                                        value={settings.announcementText}
                                        onChange={(e) => handleUpdate('announcementText', e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === 'payment' && (
                            <div className="space-y-8">
                                <div className="p-8 bg-background rounded-[2.5rem] space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3 text-primary">
                                            <CreditCard size={20} />
                                            <h4 className="text-sm font-bold uppercase tracking-widest">Razorpay Gateway</h4>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox" className="sr-only peer"
                                                checked={settings.razorpayEnabled}
                                                onChange={(e) => handleUpdate('razorpayEnabled', e.target.checked)}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>
                                    <p className="text-xs text-light italic">Configure keys in backend .env for security.</p>
                                </div>

                                <div className="p-8 bg-white border border-gray-100 rounded-[2.5rem] space-y-6 shadow-inner">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3 text-accent">
                                            <Layout size={20} />
                                            <h4 className="text-sm font-bold uppercase tracking-widest">Manual UPI Flow</h4>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox" className="sr-only peer"
                                                checked={settings.upiEnabled}
                                                onChange={(e) => handleUpdate('upiEnabled', e.target.checked)}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">VPA / UPI ID</label>
                                            <input
                                                className="input-field h-14"
                                                placeholder="yourname@upi"
                                                value={settings.upiId}
                                                onChange={(e) => handleUpdate('upiId', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between px-4">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-light">QR Code Image</label>
                                            </div>
                                            <div
                                                onClick={() => fileInputRef.current.click()}
                                                className="h-32 rounded-3xl border-2 border-dashed border-gray-100 bg-background flex flex-col items-center justify-center cursor-pointer hover:border-primary/30 transition-all overflow-hidden relative"
                                            >
                                                {settings.qrCodeImage ? (
                                                    <img src={settings.qrCodeImage} alt="" className="w-full h-full object-contain" />
                                                ) : (
                                                    <>
                                                        <Upload size={20} className="text-light" />
                                                        <span className="text-[10px] font-bold text-light mt-1 uppercase">Upload QR</span>
                                                    </>
                                                )}
                                                <input type="file" ref={fileInputRef} hidden onChange={(e) => handleImageUpload(e, 'qrCodeImage')} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 bg-background rounded-[2.5rem] flex items-center justify-between">
                                    <div className="flex items-center space-x-3 text-terracotta">
                                        <Truck size={20} />
                                        <h4 className="text-sm font-bold uppercase tracking-widest">Cash on Delivery</h4>
                                    </div>
                                    <div className="flex items-center space-x-6">
                                        <div className="flex flex-col items-end">
                                            <label className="text-[8px] font-bold uppercase tracking-widest text-light mr-4">Extra Charge</label>
                                            <input
                                                type="number"
                                                className="w-20 bg-white border-none rounded-xl text-center py-1 text-xs font-bold focus:ring-2 focus:ring-primary/20"
                                                value={settings.codCharge}
                                                onChange={(e) => handleUpdate('codCharge', e.target.value)}
                                            />
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox" className="sr-only peer"
                                                checked={settings.codEnabled}
                                                onChange={(e) => handleUpdate('codEnabled', e.target.checked)}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'shipping' && (
                            <div className="space-y-10">
                                <div className="grid grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                                            <Truck size={24} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">Standard Shipping Charge</label>
                                            <div className="relative">
                                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-sm font-bold text-dark">₹</span>
                                                <input
                                                    type="number"
                                                    className="input-field h-14 pl-12"
                                                    value={settings.shippingCharge}
                                                    onChange={(e) => handleUpdate('shippingCharge', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="w-12 h-12 bg-accent/10 text-accent rounded-2xl flex items-center justify-center">
                                            <Sparkles size={24} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">Free Shipping Benefit (Threshold)</label>
                                            <div className="relative">
                                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-sm font-bold text-dark">₹</span>
                                                <input
                                                    type="number"
                                                    className="input-field h-14 pl-12"
                                                    value={settings.freeShippingThreshold}
                                                    onChange={(e) => handleUpdate('freeShippingThreshold', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 bg-background/50 rounded-[3rem] border-2 border-dashed border-gray-100 italic text-center text-sm font-medium text-light">
                                    "Logistics is the knot that holds the business together."
                                </div>
                            </div>
                        )}

                        {activeTab === 'homepage' && (
                            <div className="space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">Hero Heading</label>
                                            <input
                                                className="input-field h-14 font-heading font-bold"
                                                value={settings.heroHeading}
                                                onChange={(e) => handleUpdate('heroHeading', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">Hero Subtext</label>
                                            <textarea
                                                rows={4}
                                                className="input-field p-6 text-sm resize-none"
                                                value={settings.heroSubtext}
                                                onChange={(e) => handleUpdate('heroSubtext', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">Hero Visual (Banner)</label>
                                        <div
                                            onClick={() => fileInputRef.current.click()}
                                            className="aspect-video rounded-[2.5rem] bg-background border-2 border-dashed border-gray-100 flex flex-col items-center justify-center cursor-pointer group relative overflow-hidden"
                                        >
                                            {settings.heroBannerImage ? (
                                                <img src={settings.heroBannerImage} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            ) : (
                                                <>
                                                    <ImageIcon size={40} className="text-light opacity-30" />
                                                    <p className="text-[10px] font-bold text-light uppercase mt-2">Upload Banner</p>
                                                </>
                                            )}
                                            <div className="absolute inset-x-0 bottom-0 bg-dark/60 backdrop-blur-md py-3 text-center text-white text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                                Click to Change Visual
                                            </div>
                                            <input type="file" ref={fileInputRef} hidden onChange={(e) => handleImageUpload(e, 'heroBannerImage')} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>

                </div>
            </div>
        </div>
    );
};

export default AdminSettingsPage;
