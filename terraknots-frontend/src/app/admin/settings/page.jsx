'use client';

import { useState, useEffect, useRef } from 'react';
import {
    Settings as SettingsIcon,
    Store,
    Palette,
    Home,
    CreditCard,
    Truck,
    Bell,
    Share2,
    FileText,
    ShoppingCart,
    Lock,
    Settings2,
    Save,
    Upload,
    Plus,
    Trash2,
    GripVertical,
    AlertTriangle,
    Mail,
    Instagram,
    MessageCircle,
    Image as ImageIcon,
    Check,
    X,
    Eye,
    Globe,
    ExternalLink
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const AdminSettingsPage = () => {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('general');
    const [testEmailLoading, setTestEmailLoading] = useState(false);
    const fileInputRef = useRef(null);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/settings/all');
            setSettings(data?.settings || data?.data || null);
        } catch (error) {
            console.error('Error fetching settings:', error);
            setSettings(null);
            toast.error('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleUpdate = (path, value) => {
        const newSettings = { ...settings };
        const keys = path.split('.');
        let current = newSettings;
        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        setSettings(newSettings);
    };

    const handleImageUpload = async (e, path) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            toast.info('Uploading image...');
            const { data } = await api.post('/upload/image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            handleUpdate(path, data.url);
            toast.success('Visual updated!');
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Upload failed');
        }
    };

    const saveSettings = async () => {
        setSaving(true);
        try {
            await api.put('/settings', settings);
            toast.success('Settings saved successfully!');
        } catch (error) {
            console.error('Save error:', error);
            toast.error('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const resetToDefaults = async () => {
        if (!window.confirm('Are you sure you want to reset ALL settings to defaults? This cannot be undone.')) return;
        setSaving(true);
        try {
            const { data } = await api.post('/settings/reset');
            setSettings(data?.settings || data?.data || null);
            toast.success('Settings reset to defaults');
        } catch (error) {
            toast.error('Failed to reset settings');
        } finally {
            setSaving(false);
        }
    };

    const handleSendTestEmail = async () => {
        setTestEmailLoading(true);
        try {
            await api.get('/admin/test-email');
            toast.success('Test email sent!');
        } catch (error) {
            toast.error('Failed to send test email');
        } finally {
            setTestEmailLoading(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-light italic font-accent text-lg">Waking up the looms...</p>
        </div>
    );

    if (!settings) return (
        <div className="bg-white rounded-[3rem] p-12 text-center space-y-6 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-dark">Loom disconnected</h2>
            <p className="text-light">We couldn't load your settings. Let's try reconnecting.</p>
            <button onClick={fetchSettings} className="btn-primary px-8 py-3 rounded-xl">Retry Connection</button>
        </div>
    );

    const tabs = [
        { id: 'general', label: 'General', icon: Store },
        { id: 'appearance', label: 'Appearance', icon: Palette },
        { id: 'homepage', label: 'Homepage', icon: Home },
        { id: 'payments', label: 'Payments', icon: CreditCard },
        { id: 'shipping', label: 'Shipping', icon: Truck },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'social', label: 'Social & SEO', icon: Share2 },
        { id: 'policies', label: 'Policies & FAQ', icon: FileText },
        { id: 'product_cart', label: 'Product & Cart', icon: ShoppingCart },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'tools', label: 'Tools', icon: Settings2 },
    ];

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-dark">Loom Configuration</h1>
                    <p className="text-light italic font-accent text-lg">Fine-tune the soul of TerraKnots.</p>
                </div>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={resetToDefaults}
                        className="px-6 py-3 rounded-2xl bg-red-50 text-red-500 font-bold text-sm hover:bg-red-500 hover:text-white transition-all"
                    >
                        Reset Defaults
                    </button>
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
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Nav */}
                <div className="lg:col-span-1 space-y-2 sticky top-24 h-fit overflow-y-auto no-scrollbar max-h-[80vh]">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all font-bold text-sm ${activeTab === tab.id
                                ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]'
                                : 'text-light hover:bg-white hover:text-primary border border-transparent hover:border-gray-100'
                                }`}
                        >
                            <tab.icon size={20} />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Form Area */}
                <div className="lg:col-span-3 bg-white rounded-[3rem] border border-gray-100 shadow-sm p-8 md:p-12 min-h-[600px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-10"
                        >
                            {/* TAB 1: General */}
                            {activeTab === 'general' && (
                                <div className="space-y-8">
                                    <h3 className="text-xl font-bold text-dark border-b pb-4">🏪 Store Identity</h3>
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
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">Store Tagline</label>
                                            <input
                                                className="input-field h-14"
                                                value={settings.storeTagline}
                                                onChange={(e) => handleUpdate('storeTagline', e.target.value)}
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
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">Contact Phone</label>
                                            <input
                                                className="input-field h-14"
                                                value={settings.contactPhone}
                                                onChange={(e) => handleUpdate('contactPhone', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">WhatsApp Number (91...)</label>
                                            <input
                                                className="input-field h-14"
                                                value={settings.whatsappNumber}
                                                onChange={(e) => handleUpdate('whatsappNumber', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">Store Address</label>
                                            <textarea
                                                className="input-field p-4 h-14"
                                                value={settings.storeAddress}
                                                onChange={(e) => handleUpdate('storeAddress', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">Store Logo</label>
                                            <div className="h-32 rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-all relative overflow-hidden bg-background">
                                                {settings.storeLogo ? (
                                                    <img src={settings.storeLogo} alt="Logo" className="h-full object-contain" />
                                                ) : (
                                                    <ImageIcon size={24} className="text-light" />
                                                )}
                                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageUpload(e, 'storeLogo')} />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">Favicon</label>
                                            <div className="h-32 rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-all relative overflow-hidden bg-background">
                                                {settings.storeFavicon ? (
                                                    <img src={settings.storeFavicon} alt="Favicon" className="h-10 w-10 object-contain" />
                                                ) : (
                                                    <ImageIcon size={24} className="text-light" />
                                                )}
                                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageUpload(e, 'storeFavicon')} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-red-50 rounded-3xl flex items-center justify-between border border-red-100">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center text-white">
                                                <AlertTriangle size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-dark">Maintenance Mode</h4>
                                                <p className="text-xs text-light">Take the site offline for all visitors except admins.</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox" className="sr-only peer"
                                                checked={settings.maintenanceMode}
                                                onChange={(e) => handleUpdate('maintenanceMode', e.target.checked)}
                                            />
                                            <div className="w-14 h-7 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-red-500"></div>
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: Appearance */}
                            {activeTab === 'appearance' && (
                                <div className="space-y-8">
                                    <h3 className="text-xl font-bold text-dark border-b pb-4">🎨 Visual Theme</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {[
                                            { label: 'Primary Color', path: 'primaryColor' },
                                            { label: 'Secondary Color', path: 'secondaryColor' },
                                            { label: 'Accent Color', path: 'accentColor' },
                                            { label: 'Background', path: 'backgroundColor' },
                                        ].map(color => (
                                            <div key={color.path} className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-2">{color.label}</label>
                                                <div className="flex items-center space-x-2 bg-background p-2 rounded-xl border border-gray-100">
                                                    <input
                                                        type="color"
                                                        className="w-10 h-10 rounded-lg border-none cursor-pointer p-0 overflow-hidden"
                                                        value={settings[color.path]}
                                                        onChange={(e) => handleUpdate(color.path, e.target.value)}
                                                    />
                                                    <input
                                                        className="bg-transparent border-none text-xs font-bold text-dark w-full focus:ring-0"
                                                        value={settings[color.path]}
                                                        onChange={(e) => handleUpdate(color.path, e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <h4 className="text-sm font-bold uppercase tracking-widest text-dark">User Interface</h4>
                                            <div className="space-y-4">
                                                {[
                                                    { label: 'Show Animations', path: 'showAnimations' },
                                                    { label: 'WhatsApp Button', path: 'showWhatsAppButton' },
                                                    { label: 'Back to Top', path: 'showBackToTop' },
                                                    { label: 'Scroll Progress', path: 'showScrollProgress' },
                                                ].map(item => (
                                                    <div key={item.path} className="flex items-center justify-between p-4 bg-background rounded-2xl">
                                                        <span className="text-sm font-bold text-light">{item.label}</span>
                                                        <label className="relative inline-flex items-center cursor-pointer">
                                                            <input
                                                                type="checkbox" className="sr-only peer"
                                                                checked={settings[item.path]}
                                                                onChange={(e) => handleUpdate(item.path, e.target.checked)}
                                                            />
                                                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">Products Per Page</label>
                                                <select
                                                    className="input-field h-14"
                                                    value={settings.productsPerPage}
                                                    onChange={(e) => handleUpdate('productsPerPage', Number(e.target.value))}
                                                >
                                                    {[4, 8, 12, 16, 20, 24].map(num => (
                                                        <option key={num} value={num}>{num} Products</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">Dark Mode Policy</label>
                                                <div className="flex bg-background p-1 rounded-2xl border border-gray-100">
                                                    {['toggle', 'light', 'dark'].map(mode => (
                                                        <button
                                                            key={mode}
                                                            onClick={() => handleUpdate('darkMode', mode)}
                                                            className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all capitalize ${settings.darkMode === mode ? 'bg-primary text-white shadow-sm' : 'text-light hover:text-dark'}`}
                                                        >
                                                            {mode}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 3: Homepage */}
                            {activeTab === 'homepage' && (
                                <div className="space-y-8">
                                    <h3 className="text-xl font-bold text-dark border-b pb-4">🏠 Home Page Settings</h3>
                                    
                                    <div className="space-y-6 p-8 bg-background rounded-[2.5rem] border border-gray-100">
                                        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                                            <h4 className="font-bold text-dark uppercase tracking-widest text-sm">Announcement Bar</h4>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox" className="sr-only peer"
                                                    checked={settings.announcementBar.active}
                                                    onChange={(e) => handleUpdate('announcementBar.active', e.target.checked)}
                                                />
                                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                            </label>
                                        </div>
                                        <div className="space-y-4">
                                            <input
                                                className="input-field h-14"
                                                placeholder="Announcement Text"
                                                value={settings.announcementBar.text}
                                                onChange={(e) => handleUpdate('announcementBar.text', e.target.value)}
                                            />
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-light">Background Color</label>
                                                    <input type="color" className="w-full h-10 rounded-xl" value={settings.announcementBar.backgroundColor} onChange={(e) => handleUpdate('announcementBar.backgroundColor', e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-light">Text Color</label>
                                                    <input type="color" className="w-full h-10 rounded-xl" value={settings.announcementBar.textColor} onChange={(e) => handleUpdate('announcementBar.textColor', e.target.value)} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6 pt-6">
                                        <h4 className="font-bold text-dark uppercase tracking-widest text-sm">Hero Section</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-light">Heading</label>
                                                    <input className="input-field h-14" value={settings.heroSection.heading} onChange={(e) => handleUpdate('heroSection.heading', e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-light">Subtext</label>
                                                    <textarea className="input-field p-4 h-24" value={settings.heroSection.subtext} onChange={(e) => handleUpdate('heroSection.subtext', e.target.value)} />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-light">Hero Visual</label>
                                                <div className="aspect-video rounded-3xl border-2 border-dashed border-gray-100 bg-background flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-all relative overflow-hidden group">
                                                    {settings.heroSection.image ? (
                                                        <img src={settings.heroSection.image} alt="Hero" className="h-full w-full object-cover" />
                                                    ) : (
                                                        <ImageIcon size={32} className="text-light" />
                                                    )}
                                                    <div className="absolute inset-0 bg-dark/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Upload className="text-white" size={32} />
                                                    </div>
                                                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageUpload(e, 'heroSection.image')} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 4: Payments */}
                            {activeTab === 'payments' && (
                                <div className="space-y-10">
                                    <h3 className="text-xl font-bold text-dark border-b pb-4">💰 Payment Configuration</h3>
                                    
                                    <div className="p-8 bg-white border border-gray-100 rounded-[3rem] space-y-8 shadow-inner">
                                        <div className="flex items-center justify-between border-b border-gray-50 pb-6">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                                                    <CreditCard size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-dark uppercase tracking-widest">UPI Payment</h4>
                                                    <p className="text-xs text-light">Allow customers to pay via Scan & Pay or VPA.</p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox" className="sr-only peer"
                                                    checked={settings.upiPayment.enabled}
                                                    onChange={(e) => handleUpdate('upiPayment.enabled', e.target.checked)}
                                                />
                                                <div className="w-14 h-7 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
                                            </label>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">VPA / UPI ID</label>
                                                    <input className="input-field h-14" value={settings.upiPayment.upiId} onChange={(e) => handleUpdate('upiPayment.upiId', e.target.value)} placeholder="name@upi" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">Instructions</label>
                                                    <textarea className="input-field p-4 h-32 text-sm" value={settings.upiPayment.instructions} onChange={(e) => handleUpdate('upiPayment.instructions', e.target.value)} />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">QR Code Visual</label>
                                                <div className="h-64 rounded-[2rem] border-2 border-dashed border-gray-100 bg-background flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-all relative overflow-hidden group">
                                                    {settings.upiPayment.qrCode ? (
                                                        <img src={settings.upiPayment.qrCode} alt="QR Code" className="h-full object-contain" />
                                                    ) : (
                                                        <div className="text-center">
                                                            <Upload size={32} className="text-light mx-auto mb-2" />
                                                            <p className="text-[10px] font-bold text-light uppercase">Upload QR Code</p>
                                                        </div>
                                                    )}
                                                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageUpload(e, 'upiPayment.qrCode')} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-8 bg-background rounded-[3rem] space-y-8">
                                        <div className="flex items-center justify-between border-b border-gray-200 pb-6">
                                            <div className="flex items-center space-x-4 text-terracotta">
                                                <Truck size={24} />
                                                <div>
                                                    <h4 className="font-bold uppercase tracking-widest">Cash on Delivery</h4>
                                                    <p className="text-xs opacity-60">Payment collected by delivery partner.</p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox" className="sr-only peer"
                                                    checked={settings.codPayment.enabled}
                                                    onChange={(e) => handleUpdate('codPayment.enabled', e.target.checked)}
                                                />
                                                <div className="w-14 h-7 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-terracotta"></div>
                                            </label>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">COD Surcharge</label>
                                                <div className="relative">
                                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-dark">₹</span>
                                                    <input type="number" className="input-field h-14 pl-12" value={settings.codPayment.charge} onChange={(e) => handleUpdate('codPayment.charge', Number(e.target.value))} />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">Min Order</label>
                                                <div className="relative">
                                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-dark">₹</span>
                                                    <input type="number" className="input-field h-14 pl-12" value={settings.codPayment.minOrder} onChange={(e) => handleUpdate('codPayment.minOrder', Number(e.target.value))} />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">Max Order</label>
                                                <div className="relative">
                                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-dark">₹</span>
                                                    <input type="number" className="input-field h-14 pl-12" value={settings.codPayment.maxOrder} onChange={(e) => handleUpdate('codPayment.maxOrder', Number(e.target.value))} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 5: Shipping */}
                            {activeTab === 'shipping' && (
                                <div className="space-y-10">
                                    <h3 className="text-xl font-bold text-dark border-b pb-4">🚚 Logistics & Shipping</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">Standard Shipping Charge</label>
                                            <div className="relative">
                                                <span className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-dark">₹</span>
                                                <input type="number" className="input-field h-14 pl-12" value={settings.shippingCharge} onChange={(e) => handleUpdate('shippingCharge', Number(e.target.value))} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">Free Shipping Above</label>
                                            <div className="relative">
                                                <span className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-dark">₹</span>
                                                <input type="number" className="input-field h-14 pl-12" value={settings.freeShippingThreshold} onChange={(e) => handleUpdate('freeShippingThreshold', Number(e.target.value))} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">Processing Time</label>
                                            <input className="input-field h-14" value={settings.processingTime} onChange={(e) => handleUpdate('processingTime', e.target.value)} placeholder="e.g. 1-2 business days" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">Standard Delivery</label>
                                            <input className="input-field h-14" value={settings.standardDelivery} onChange={(e) => handleUpdate('standardDelivery', e.target.value)} placeholder="e.g. 5-7 business days" />
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-bold text-dark uppercase tracking-widest text-sm">Shipping Partners</h4>
                                            <button 
                                                onClick={() => {
                                                    const partners = [...settings.shippingPartners, { name: '', trackingUrl: '', isActive: true }];
                                                    handleUpdate('shippingPartners', partners);
                                                }}
                                                className="text-xs font-bold text-primary flex items-center space-x-1 hover:underline"
                                            >
                                                <Plus size={14} />
                                                <span>Add Partner</span>
                                            </button>
                                        </div>
                                        <div className="space-y-4">
                                            {settings.shippingPartners.map((partner, idx) => (
                                                <div key={idx} className="p-4 bg-background rounded-2xl flex items-center space-x-4 border border-gray-100">
                                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <input className="input-field h-10 px-4 text-xs" value={partner.name} onChange={(e) => {
                                                            const partners = [...settings.shippingPartners];
                                                            partners[idx].name = e.target.value;
                                                            handleUpdate('shippingPartners', partners);
                                                        }} placeholder="Partner Name" />
                                                        <input className="input-field h-10 px-4 text-xs" value={partner.trackingUrl} onChange={(e) => {
                                                            const partners = [...settings.shippingPartners];
                                                            partners[idx].trackingUrl = e.target.value;
                                                            handleUpdate('shippingPartners', partners);
                                                        }} placeholder="Tracking URL Template" />
                                                    </div>
                                                    <button 
                                                        onClick={() => {
                                                            const partners = settings.shippingPartners.filter((_, i) => i !== idx);
                                                            handleUpdate('shippingPartners', partners);
                                                        }}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            ))}
                                            {settings.shippingPartners.length === 0 && (
                                                <div className="text-center py-10 bg-background rounded-3xl border border-dashed border-gray-200">
                                                    <p className="text-xs text-light italic">No shipping partners added.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 6: Notifications */}
                            {activeTab === 'notifications' && (
                                <div className="space-y-10">
                                    <h3 className="text-xl font-bold text-dark border-b pb-4">📧 Notification Hub</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {[
                                            { label: 'Email on New Order', path: 'notifications.emailOnNewOrder' },
                                            { label: 'Email on New Message', path: 'notifications.emailOnNewMessage' },
                                            { label: 'Email on Low Stock', path: 'notifications.emailOnLowStock' },
                                            { label: 'Email on New Signup', path: 'notifications.emailOnNewSignup' },
                                            { label: 'WhatsApp Alert (Admin)', path: 'notifications.whatsappOnNewOrder' },
                                        ].map(item => (
                                            <div key={item.path} className="flex items-center justify-between p-6 bg-background rounded-3xl border border-gray-100 shadow-sm">
                                                <span className="font-bold text-dark text-sm">{item.label}</span>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox" className="sr-only peer"
                                                        checked={item.path.split('.').reduce((obj, key) => obj[key], settings)}
                                                        onChange={(e) => handleUpdate(item.path, e.target.checked)}
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                                </label>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">Low Stock Threshold</label>
                                            <input type="number" className="input-field h-14" value={settings.notifications.lowStockThreshold} onChange={(e) => handleUpdate('notifications.lowStockThreshold', Number(e.target.value))} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">Admin Alert Number (WhatsApp)</label>
                                            <input className="input-field h-14" value={settings.notifications.whatsappAlertNumber} onChange={(e) => handleUpdate('notifications.whatsappAlertNumber', e.target.value)} placeholder="91XXXXXXXXXX" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 7: Social & SEO */}
                            {activeTab === 'social' && (
                                <div className="space-y-10">
                                    <h3 className="text-xl font-bold text-dark border-b pb-4">🔗 Social & Discoverability</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <h4 className="font-bold text-dark uppercase tracking-widest text-xs">Social Presence</h4>
                                            <div className="space-y-4">
                                                {[
                                                    { icon: Instagram, label: 'Instagram', path: 'socialLinks.instagram' },
                                                    { icon: MessageCircle, label: 'Facebook', path: 'socialLinks.facebook' },
                                                    { icon: ExternalLink, label: 'Pinterest', path: 'socialLinks.pinterest' },
                                                    { icon: Globe, label: 'Twitter / X', path: 'socialLinks.twitter' },
                                                ].map(item => (
                                                    <div key={item.path} className="relative">
                                                        <item.icon className="absolute left-5 top-1/2 -translate-y-1/2 text-primary" size={18} />
                                                        <input className="input-field h-14 pl-14 text-sm" placeholder={`${item.label} URL`} value={item.path.split('.').reduce((obj, key) => obj[key], settings)} onChange={(e) => handleUpdate(item.path, e.target.value)} />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            <h4 className="font-bold text-dark uppercase tracking-widest text-xs">Search Engine Optimization</h4>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">Default Meta Title</label>
                                                    <input className="input-field h-14" value={settings.seo.defaultMetaTitle} onChange={(e) => handleUpdate('seo.defaultMetaTitle', e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">Default Description</label>
                                                    <textarea className="input-field p-4 h-24 text-sm" value={settings.seo.defaultMetaDescription} onChange={(e) => handleUpdate('seo.defaultMetaDescription', e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">Google Analytics ID</label>
                                                    <input className="input-field h-14" value={settings.seo.googleAnalyticsId} onChange={(e) => handleUpdate('seo.googleAnalyticsId', e.target.value)} placeholder="G-XXXXXXXXXX" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 8: Policies & FAQ */}
                            {activeTab === 'policies' && (
                                <div className="space-y-10">
                                    <h3 className="text-xl font-bold text-dark border-b pb-4">📄 Pages & Policies</h3>
                                    <div className="space-y-8">
                                        {[
                                            { label: 'About Page Content', path: 'policies.aboutPage' },
                                            { label: 'Shipping Policy', path: 'policies.shippingPolicy' },
                                            { label: 'Return Policy', path: 'policies.returnPolicy' },
                                            { label: 'Privacy Policy', path: 'policies.privacyPolicy' },
                                            { label: 'Terms & Conditions', path: 'policies.termsAndConditions' },
                                        ].map(item => (
                                            <div key={item.path} className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">{item.label}</label>
                                                <textarea className="input-field p-6 min-h-[150px] text-sm" value={item.path.split('.').reduce((obj, key) => obj[key], settings)} onChange={(e) => handleUpdate(item.path, e.target.value)} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* TAB 9: Product & Cart */}
                            {activeTab === 'product_cart' && (
                                <div className="space-y-10">
                                    <h3 className="text-xl font-bold text-dark border-b pb-4">🛒 Shopping Experience</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-6">
                                            <h4 className="font-bold text-dark uppercase tracking-widest text-xs">Product Display</h4>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">Out of Stock Policy</label>
                                                    <select className="input-field h-14" value={settings.productDisplay.showOutOfStock} onChange={(e) => handleUpdate('productDisplay.showOutOfStock', e.target.value)}>
                                                        <option value="grayed">Show grayed out</option>
                                                        <option value="hide">Hide completely</option>
                                                    </select>
                                                </div>
                                                {[
                                                    { label: 'Show Stock Count', path: 'productDisplay.showStockCount' },
                                                    { label: 'Show Handmade Badge', path: 'productDisplay.showHandmadeBadge' },
                                                    { label: 'Show Ratings', path: 'productDisplay.showRatings' },
                                                    { label: 'Image Zoom', path: 'productDisplay.showImageZoom' },
                                                ].map(item => (
                                                    <div key={item.path} className="flex items-center justify-between p-4 bg-background rounded-2xl">
                                                        <span className="text-sm font-bold text-light">{item.label}</span>
                                                        <label className="relative inline-flex items-center cursor-pointer">
                                                            <input
                                                                type="checkbox" className="sr-only peer"
                                                                checked={item.path.split('.').reduce((obj, key) => obj[key], settings)}
                                                                onChange={(e) => handleUpdate(item.path, e.target.checked)}
                                                            />
                                                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            <h4 className="font-bold text-dark uppercase tracking-widest text-xs">Cart & Checkout</h4>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">Min Order Amount (₹)</label>
                                                    <input type="number" className="input-field h-14" value={settings.cart.minOrderAmount} onChange={(e) => handleUpdate('cart.minOrderAmount', Number(e.target.value))} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">Max Qty Per Product</label>
                                                    <input type="number" className="input-field h-14" value={settings.cart.maxQuantityPerProduct} onChange={(e) => handleUpdate('cart.maxQuantityPerProduct', Number(e.target.value))} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">Checkout Policy</label>
                                                    <select className="input-field h-14" value={settings.cart.guestCheckout} onChange={(e) => handleUpdate('cart.guestCheckout', e.target.value)}>
                                                        <option value="allow">Allow Guest Checkout</option>
                                                        <option value="require_login">Require Login</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 10: Security */}
                            {activeTab === 'security' && (
                                <div className="space-y-10">
                                    <h3 className="text-xl font-bold text-dark border-b pb-4">🔒 Site Security</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <h4 className="font-bold text-dark uppercase tracking-widest text-xs">Login & Sessions</h4>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">Customer Session (Days)</label>
                                                    <input type="number" className="input-field h-14" value={settings.session.customerLoginDuration} onChange={(e) => handleUpdate('session.customerLoginDuration', Number(e.target.value))} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">Admin Session (Days)</label>
                                                    <input type="number" className="input-field h-14" value={settings.session.adminLoginDuration} onChange={(e) => handleUpdate('session.adminLoginDuration', Number(e.target.value))} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            <h4 className="font-bold text-dark uppercase tracking-widest text-xs">Password Protection</h4>
                                            <div className="p-6 bg-red-50 rounded-3xl border border-red-100 space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-bold text-dark text-sm">Protect Storefront</span>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox" className="sr-only peer"
                                                            checked={settings.passwordProtectSite.active}
                                                            onChange={(e) => handleUpdate('passwordProtectSite.active', e.target.checked)}
                                                        />
                                                        <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                                                    </label>
                                                </div>
                                                <input className="input-field h-10 px-4 text-xs" type="password" placeholder="Site Password" value={settings.passwordProtectSite.password} onChange={(e) => handleUpdate('passwordProtectSite.password', e.target.value)} disabled={!settings.passwordProtectSite.active} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 11: Tools */}
                            {activeTab === 'tools' && (
                                <div className="space-y-10">
                                    <h3 className="text-xl font-bold text-dark border-b pb-4">🔧 Maintenance & Data</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <div className="p-6 bg-background rounded-[2rem] border border-gray-100 space-y-4">
                                            <h4 className="font-bold text-dark uppercase tracking-widest text-[10px]">Data Export</h4>
                                            <button className="w-full h-12 rounded-xl bg-white text-dark font-bold text-xs shadow-sm hover:shadow-md transition-all border border-gray-100 flex items-center justify-center space-x-2">
                                                <Upload className="rotate-180" size={16} />
                                                <span>Export Products CSV</span>
                                            </button>
                                            <button className="w-full h-12 rounded-xl bg-white text-dark font-bold text-xs shadow-sm hover:shadow-md transition-all border border-gray-100 flex items-center justify-center space-x-2">
                                                <Upload className="rotate-180" size={16} />
                                                <span>Export Orders CSV</span>
                                            </button>
                                        </div>
                                        <div className="p-6 bg-background rounded-[2rem] border border-gray-100 space-y-4">
                                            <h4 className="font-bold text-dark uppercase tracking-widest text-[10px]">System Health</h4>
                                            <button 
                                                onClick={handleSendTestEmail}
                                                disabled={testEmailLoading}
                                                className="w-full h-12 rounded-xl bg-white text-dark font-bold text-xs shadow-sm hover:shadow-md transition-all border border-gray-100 flex items-center justify-center space-x-2"
                                            >
                                                {testEmailLoading ? <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" /> : <Mail size={16} />}
                                                <span>Send Test Email</span>
                                            </button>
                                            <button className="w-full h-12 rounded-xl bg-white text-dark font-bold text-xs shadow-sm hover:shadow-md transition-all border border-gray-100 flex items-center justify-center space-x-2">
                                                <Globe size={16} />
                                                <span>Rebuild Sitemap</span>
                                            </button>
                                        </div>
                                        <div className="p-6 bg-red-50 rounded-[2rem] border border-red-100 space-y-4">
                                            <h4 className="font-bold text-red-500 uppercase tracking-widest text-[10px]">Danger Zone</h4>
                                            <button className="w-full h-12 rounded-xl bg-red-500 text-white font-bold text-xs shadow-md hover:bg-red-600 transition-all flex items-center justify-center space-x-2">
                                                <Trash2 size={16} />
                                                <span>Clear All Sessions</span>
                                            </button>
                                            <button 
                                                onClick={resetToDefaults}
                                                className="w-full h-12 rounded-xl bg-white text-red-500 font-bold text-xs border border-red-200 hover:bg-red-50 transition-all"
                                            >
                                                Factory Reset Settings
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default AdminSettingsPage;
