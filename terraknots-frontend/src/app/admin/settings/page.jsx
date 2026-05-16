'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

const TABS = [
  { id: 'general', label: 'General', icon: '🏪' },
  { id: 'appearance', label: 'Appearance', icon: '🎨' },
  { id: 'homepage', label: 'Homepage', icon: '🏠' },
  { id: 'payments', label: 'Payments', icon: '💰' },
  { id: 'shipping', label: 'Shipping', icon: '🚚' },
  { id: 'notifications', label: 'Notifications', icon: '🔔' },
  { id: 'social', label: 'Social & SEO', icon: '🔗' },
  { id: 'policies', label: 'Policies & FAQ', icon: '📄' }
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/settings/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSettings(res?.data?.data || {});
    } catch (err) {
      console.error('Settings load error:', err);
      setSettings(getDefaultSettings());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultSettings = () => ({
    storeName: 'TerraKnots',
    contactEmail: 'hello@terraknots.com',
    whatsappNumber: '919876543210',
    instagramUrl: 'https://instagram.com/terra_knots',
    announcementActive: true,
    announcementText: '✨ Free shipping on orders above ₹499',
    primaryColor: '#C4A882',
    secondaryColor: '#8B7355',
    accentColor: '#A8B5A2',
    backgroundColor: '#F5F0EB',
    productsPerPage: 12,
    showAnimations: true,
    showDarkMode: false,
    heroHeading: 'Handmade with heart, knot by knot',
    heroSubtext: 'Discover unique creations',
    heroImage: '',
    upiId: 'yourname@upi',
    upiEnabled: true,
    codEnabled: true,
    codCharge: 30,
    shippingCharge: 49,
    freeShippingThreshold: 499,
    emailOnNewOrder: true,
    emailOnLowStock: true,
    lowStockThreshold: 5
  });

  const updateField = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      await axios.put(`${API_URL}/settings`, settings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Settings saved! ✨');
      setHasChanges(false);
    } catch (err) {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Reset all settings to defaults?')) return;
    setSettings(getDefaultSettings());
    setHasChanges(true);
    toast.success('Settings reset to defaults');
  };

  if (loading) {
    return <div className="p-8 text-center">Loading settings...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-4xl font-serif text-[#2C2C2C]">Loom Configuration</h1>
          <p className="text-gray-500 italic">Fine-tune the soul of TerraKnots</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleReset}
            className="px-4 py-2 border border-red-300 text-red-600 rounded-xl hover:bg-red-50"
          >
            Reset Defaults
          </button>
          <button 
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="px-6 py-3 bg-[#C4A882] text-white rounded-xl disabled:opacity-50 font-semibold transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            {saving ? 'Saving...' : 'Commit Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Tab Navigation */}
        <div className="space-y-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${
                activeTab === tab.id 
                  ? 'bg-[#C4A882] text-white shadow-md' 
                  : 'bg-white hover:bg-[#F5F0EB] text-[#2C2C2C]'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="md:col-span-3 bg-white p-8 rounded-2xl shadow-sm min-h-[500px]">
          {activeTab === 'general' && <GeneralTab settings={settings} updateField={updateField} />}
          {activeTab === 'appearance' && <AppearanceTab settings={settings} updateField={updateField} />}
          {activeTab === 'homepage' && <HomepageTab settings={settings} updateField={updateField} />}
          {activeTab === 'payments' && <PaymentsTab settings={settings} updateField={updateField} />}
          {activeTab === 'shipping' && <ShippingTab settings={settings} updateField={updateField} />}
          {activeTab === 'notifications' && <NotificationsTab settings={settings} updateField={updateField} />}
          {activeTab === 'social' && <SocialTab settings={settings} updateField={updateField} />}
          {activeTab === 'policies' && <PoliciesTab settings={settings} updateField={updateField} />}
        </div>
      </div>
    </div>
  );
}

// GENERAL TAB
function GeneralTab({ settings, updateField }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <h2 className="text-2xl font-serif mb-6 text-[#2C2C2C]">🏪 General Settings</h2>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Store Name" value={settings?.storeName} onChange={v => updateField('storeName', v)} />
        <Field label="Contact Email" type="email" value={settings?.contactEmail} onChange={v => updateField('contactEmail', v)} />
        <Field label="WhatsApp Number" value={settings?.whatsappNumber} onChange={v => updateField('whatsappNumber', v)} />
        <Field label="Instagram URL" value={settings?.instagramUrl} onChange={v => updateField('instagramUrl', v)} />
        <div className="col-span-2">
          <Toggle 
            label="Announcement Bar" 
            description="Show announcement bar at top of every page"
            checked={settings?.announcementActive} 
            onChange={v => updateField('announcementActive', v)} 
          />
          {settings?.announcementActive && (
            <div className="mt-3">
              <Field 
                value={settings?.announcementText} 
                onChange={v => updateField('announcementText', v)} 
                placeholder="Announcement message..."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// APPEARANCE TAB
function AppearanceTab({ settings, updateField }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <h2 className="text-2xl font-serif mb-6 text-[#2C2C2C]">🎨 Appearance</h2>
      
      <h3 className="text-lg font-semibold mb-3 text-[#8B7355]">Brand Colors</h3>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <ColorField label="Primary Color" value={settings?.primaryColor || '#C4A882'} onChange={v => updateField('primaryColor', v)} />
        <ColorField label="Secondary Color" value={settings?.secondaryColor || '#8B7355'} onChange={v => updateField('secondaryColor', v)} />
        <ColorField label="Accent Color" value={settings?.accentColor || '#A8B5A2'} onChange={v => updateField('accentColor', v)} />
        <ColorField label="Background" value={settings?.backgroundColor || '#F5F0EB'} onChange={v => updateField('backgroundColor', v)} />
      </div>

      <h3 className="text-lg font-semibold mb-3 text-[#8B7355]">Display Options</h3>
      <div className="space-y-3">
        <Field type="number" label="Products Per Page" value={settings?.productsPerPage || 12} onChange={v => updateField('productsPerPage', Number(v))} />
        <Toggle label="Show Animations" checked={settings?.showAnimations} onChange={v => updateField('showAnimations', v)} />
        <Toggle label="Enable Dark Mode" checked={settings?.showDarkMode} onChange={v => updateField('showDarkMode', v)} />
      </div>
    </div>
  );
}

// HOMEPAGE TAB
function HomepageTab({ settings, updateField }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const toastId = toast.loading('Uploading hero banner...');

    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      const fd = new FormData();
      fd.append('image', file);
      fd.append('folder', 'terraknots/homepage');

      const res = await axios.post(`${API_URL}/upload/image`, fd, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      const url = res.data.url || res.data.data?.url;
      if (url) {
        updateField('heroImage', url);
        toast.success('Hero banner uploaded! ✨', { id: toastId });
      } else {
        toast.error('Upload failed', { id: toastId });
      }
    } catch (err) {
      toast.error('Upload failed', { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <h2 className="text-2xl font-serif mb-6 text-[#2C2C2C]">🏠 Homepage</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-[#8B7355] uppercase tracking-widest mb-2">Hero Banner Image</label>
          {settings?.heroImage ? (
            <div className="relative group rounded-2xl overflow-hidden aspect-[21/9] border border-gray-100 shadow-sm mb-3">
              <img src={settings.heroImage} alt="Hero Banner" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3">
                <label className="p-3 bg-white text-dark rounded-full cursor-pointer hover:scale-110 transition-transform">
                  <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
                  ✏️
                </label>
                <button 
                  onClick={() => updateField('heroImage', '')}
                  className="p-3 bg-red-500 text-white rounded-full hover:scale-110 transition-transform"
                >
                  🗑️
                </button>
              </div>
            </div>
          ) : (
            <label className="block border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center cursor-pointer hover:border-[#C4A882] hover:bg-[#F5F0EB]/30 transition-all mb-3">
              <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
              <div className="text-3xl mb-2">🖼️</div>
              <p className="text-sm font-bold text-dark">{uploading ? 'Uploading...' : 'Click to upload hero banner'}</p>
              <p className="text-[10px] text-light mt-1">Recommended: 1920x800px</p>
            </label>
          )}
          <Field 
            value={settings?.heroImage} 
            onChange={v => updateField('heroImage', v)} 
            placeholder="Or paste image URL here..." 
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Field label="Hero Heading" value={settings?.heroHeading} onChange={v => updateField('heroHeading', v)} />
          <Field label="Hero Subtext" value={settings?.heroSubtext} onChange={v => updateField('heroSubtext', v)} type="textarea" />
        </div>
      </div>
    </div>
  );
}

// PAYMENTS TAB
function PaymentsTab({ settings, updateField }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <h2 className="text-2xl font-serif mb-6 text-[#2C2C2C]">💰 Payments</h2>
      <div className="space-y-4">
        <Toggle label="UPI Payment Enabled" checked={settings?.upiEnabled} onChange={v => updateField('upiEnabled', v)} />
        <Field label="UPI ID" value={settings?.upiId} onChange={v => updateField('upiId', v)} placeholder="yourname@upi" />
        <Toggle label="Cash on Delivery Enabled" checked={settings?.codEnabled} onChange={v => updateField('codEnabled', v)} />
        <Field type="number" label="COD Charge (₹)" value={settings?.codCharge || 30} onChange={v => updateField('codCharge', Number(v))} />
      </div>
    </div>
  );
}

// SHIPPING TAB
function ShippingTab({ settings, updateField }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <h2 className="text-2xl font-serif mb-6 text-[#2C2C2C]">🚚 Shipping</h2>
      <div className="space-y-4">
        <Field type="number" label="Shipping Charge (₹)" value={settings?.shippingCharge || 49} onChange={v => updateField('shippingCharge', Number(v))} />
        <Field type="number" label="Free Shipping Above (₹)" value={settings?.freeShippingThreshold || 499} onChange={v => updateField('freeShippingThreshold', Number(v))} />
        <Field label="Processing Time" value={settings?.processingTime} placeholder="1-2 business days" onChange={v => updateField('processingTime', v)} />
        <Field label="Delivery Time" value={settings?.deliveryTime} placeholder="5-7 business days" onChange={v => updateField('deliveryTime', v)} />
      </div>
    </div>
  );
}

// NOTIFICATIONS TAB
function NotificationsTab({ settings, updateField }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <h2 className="text-2xl font-serif mb-6 text-[#2C2C2C]">🔔 Notifications</h2>
      <div className="space-y-3">
        <Toggle label="Email on New Order" checked={settings?.emailOnNewOrder} onChange={v => updateField('emailOnNewOrder', v)} />
        <Toggle label="Email on Low Stock" checked={settings?.emailOnLowStock} onChange={v => updateField('emailOnLowStock', v)} />
        <Field type="number" label="Low Stock Threshold" value={settings?.lowStockThreshold || 5} onChange={v => updateField('lowStockThreshold', Number(v))} />
        <Toggle label="Email on New Customer" checked={settings?.emailOnNewCustomer} onChange={v => updateField('emailOnNewCustomer', v)} />
      </div>
    </div>
  );
}

// SOCIAL TAB
function SocialTab({ settings, updateField }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <h2 className="text-2xl font-serif mb-6 text-[#2C2C2C]">🔗 Social & SEO</h2>
      <div className="space-y-4">
        <h3 className="font-semibold text-[#8B7355]">Social Links</h3>
        <Field label="Instagram URL" value={settings?.instagramUrl} onChange={v => updateField('instagramUrl', v)} />
        <Field label="Facebook URL" value={settings?.facebookUrl} onChange={v => updateField('facebookUrl', v)} />
        <Field label="Pinterest URL" value={settings?.pinterestUrl} onChange={v => updateField('pinterestUrl', v)} />
        <Field label="YouTube URL" value={settings?.youtubeUrl} onChange={v => updateField('youtubeUrl', v)} />
        
        <h3 className="font-semibold mt-6 text-[#8B7355]">SEO</h3>
        <Field label="Meta Title" value={settings?.metaTitle} onChange={v => updateField('metaTitle', v)} />
        <Field type="textarea" label="Meta Description" value={settings?.metaDescription} onChange={v => updateField('metaDescription', v)} />
        <Field label="Google Analytics ID" value={settings?.googleAnalyticsId} onChange={v => updateField('googleAnalyticsId', v)} placeholder="G-XXXXXXXXXX" />
      </div>
    </div>
  );
}

// POLICIES TAB
function PoliciesTab({ settings, updateField }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <h2 className="text-2xl font-serif mb-6 text-[#2C2C2C]">📄 Policies & Content</h2>
      <div className="space-y-4">
        <Field type="textarea" label="About Page Content" value={settings?.aboutPageContent} onChange={v => updateField('aboutPageContent', v)} rows={6} />
        <Field type="textarea" label="Shipping Policy" value={settings?.shippingPolicy} onChange={v => updateField('shippingPolicy', v)} rows={6} />
        <Field type="textarea" label="Return Policy" value={settings?.returnPolicy} onChange={v => updateField('returnPolicy', v)} rows={6} />
        <Field type="textarea" label="Privacy Policy" value={settings?.privacyPolicy} onChange={v => updateField('privacyPolicy', v)} rows={6} />
        <Field type="textarea" label="Terms & Conditions" value={settings?.termsConditions} onChange={v => updateField('termsConditions', v)} rows={6} />
      </div>
    </div>
  );
}

// REUSABLE COMPONENTS
function Field({ label, value, onChange, type = 'text', placeholder = '', rows = 3 }) {
  return (
    <div>
      {label && <label className="block text-xs font-bold text-[#8B7355] uppercase tracking-widest mb-2">{label}</label>}
      {type === 'textarea' ? (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#C4A882] transition-colors resize-none"
        />
      ) : (
        <input
          type={type}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#C4A882] transition-colors"
        />
      )}
    </div>
  );
}

function ColorField({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-bold text-[#8B7355] uppercase tracking-widest mb-2">{label}</label>
      <div className="flex gap-2 items-center">
        <div className="relative w-12 h-12">
          <input
            type="color"
            value={value || '#000000'}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div 
            className="w-12 h-12 rounded-xl border-2 border-gray-200"
            style={{ backgroundColor: value || '#000000' }}
          />
        </div>
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-mono text-sm focus:outline-none focus:border-[#C4A882]"
        />
      </div>
    </div>
  );
}

function Toggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between p-4 bg-[#F5F0EB]/30 rounded-xl border border-[#F5F0EB]">
      <div>
        <div className="font-semibold text-[#2C2C2C]">{label}</div>
        {description && <div className="text-xs text-gray-500">{description}</div>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 rounded-full transition-colors ${checked ? 'bg-[#C4A882]' : 'bg-gray-300'}`}
      >
        <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${checked ? 'translate-x-6' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );
}
