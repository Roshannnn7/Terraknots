'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id;
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    fullDescription: '',
    category: '',
    price: '',
    salePrice: '',
    stock: 0,
    images: [],
    materials: [],
    careInstructions: '',
    dimensions: '',
    tags: [],
    isFeatured: false,
    isActive: true,
    isBestseller: false,
    isNewArrival: false
  });
  
  const [materialInput, setMaterialInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  const getToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('adminToken') || localStorage.getItem('token');
  };

  // Fetch product and categories
  useEffect(() => {
    const fetchData = async () => {
      if (!productId) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const token = getToken();
      
      try {
        // Fetch product via new admin ID endpoint
        const productRes = await axios.get(
          `${API_URL}/products/admin/${productId}`,
          { 
            headers: { Authorization: `Bearer ${token}` },
            timeout: 30000
          }
        );
        
        const product = productRes?.data?.data;
        
        if (!product) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        setFormData({
          name: product.name || '',
          shortDescription: product.shortDescription || '',
          fullDescription: product.fullDescription || '',
          category: product.category || '',
          price: product.price || '',
          salePrice: product.salePrice || '',
          stock: product.stock || 0,
          images: product.images || [],
          materials: product.materials || [],
          careInstructions: product.careInstructions || '',
          dimensions: product.dimensions || '',
          tags: product.tags || [],
          isFeatured: !!product.isFeatured,
          isActive: product.isActive !== false,
          isBestseller: !!product.isBestseller,
          isNewArrival: !!product.isNewArrival
        });
      } catch (err) {
        console.error('Product fetch error:', err);
        if (err?.response?.status === 404) {
          setNotFound(true);
        } else {
          toast.error('Failed to load product');
        }
      }

      // Fetch categories
      try {
        const catRes = await axios.get(`${API_URL}/categories`, { timeout: 30000 });
        setCategories(catRes?.data?.data || []);
      } catch (err) {
        console.error('Categories fetch error:', err);
        setCategories([]);
      }

      setLoading(false);
    };

    fetchData();
  }, [productId]);

  const handleImageUpload = async (e) => {
    const files = Array.from(e?.target?.files || []);
    if (files.length === 0) return;
    
    const currentCount = (formData?.images || []).length;
    if (currentCount + files.length > 15) {
      toast.error('Maximum 15 images allowed');
      return;
    }

    setUploading(true);
    const uploaded = [];
    const token = getToken();

    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} too large (max 10MB)`);
        continue;
      }
      try {
        const fd = new FormData();
        fd.append('image', file);
        const res = await axios.post(`${API_URL}/upload/image`, fd, {
          headers: { 
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          },
          timeout: 60000
        });
        const url = res?.data?.url || res?.data?.data?.url || res?.data?.secure_url;
        if (url) uploaded.push(url);
      } catch (err) {
        toast.error(`Failed: ${file.name}`);
      }
    }

    setFormData(prev => ({
      ...prev,
      images: [...(prev?.images || []), ...uploaded]
    }));
    
    if (uploaded.length > 0) toast.success(`${uploaded.length} image(s) uploaded`);
    setUploading(false);
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: (prev?.images || []).filter((_, i) => i !== index)
    }));
  };

  const setMainImage = (index) => {
    if (index === 0) return;
    setFormData(prev => {
      const imgs = [...(prev?.images || [])];
      const [moved] = imgs.splice(index, 1);
      imgs.unshift(moved);
      return { ...prev, images: imgs };
    });
  };

  const addMaterial = () => {
    const val = materialInput.trim();
    if (val && !(formData?.materials || []).includes(val)) {
      setFormData(prev => ({
        ...prev,
        materials: [...(prev?.materials || []), val]
      }));
      setMaterialInput('');
    }
  };

  const removeMaterial = (m) => {
    setFormData(prev => ({
      ...prev,
      materials: (prev?.materials || []).filter(x => x !== m)
    }));
  };

  const addTag = () => {
    const val = tagInput.trim();
    if (val && !(formData?.tags || []).includes(val)) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev?.tags || []), val]
      }));
      setTagInput('');
    }
  };

  const removeTag = (t) => {
    setFormData(prev => ({
      ...prev,
      tags: (prev?.tags || []).filter(x => x !== t)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData?.name?.trim()) return toast.error('Name required');
    if (!formData?.category) return toast.error('Category required');
    if (!formData?.price || Number(formData.price) <= 0) return toast.error('Valid price required');

    setSaving(true);
    try {
      const token = getToken();
      const payload = {
        ...formData,
        price: Number(formData.price),
        salePrice: formData.salePrice ? Number(formData.salePrice) : undefined,
        stock: Number(formData.stock) || 0
      };
      
      await axios.put(`${API_URL}/products/${productId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 30000
      });
      
      toast.success('Product updated! ✨');
      router.push('/admin/products');
    } catch (err) {
      console.error('Update error:', err);
      toast.error(err?.response?.data?.message || 'Failed to update product');
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    
    try {
      const token = getToken();
      await axios.delete(`${API_URL}/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Product deleted');
      router.push('/admin/products');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center">
        <div className="text-6xl mb-4 animate-bounce">🧶</div>
        <p className="text-gray-500 font-medium">Unraveling product details...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="p-8 text-center min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-3xl font-serif mb-3 text-dark">Treasure not found</h2>
        <p className="text-gray-500 mb-6">This product doesn't exist or has been removed from the loom.</p>
        <button 
          onClick={() => router.push('/admin/products')}
          className="px-8 py-3 bg-[#C4A882] text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all"
        >
          Back to Inventory
        </button>
      </div>
    );
  }

  const safeImages = formData?.images || [];
  const safeMaterials = formData?.materials || [];
  const safeTags = formData?.tags || [];
  const safeCategories = categories || [];

  return (
    <div className="p-6 max-w-7xl mx-auto pb-20">
      <div className="flex justify-between items-start mb-8">
        <div>
          <button onClick={() => router.back()} className="text-sm font-bold text-[#8B7355] mb-2 hover:underline flex items-center gap-1">
            ← Back to Products
          </button>
          <h1 className="text-4xl font-serif text-[#2C2C2C] font-bold">Edit Product</h1>
          <p className="text-light italic text-sm mt-1">ID: {productId}</p>
        </div>
        <button
          type="button"
          onClick={handleDelete}
          className="px-5 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-500 hover:text-white transition-all font-bold border border-red-100 flex items-center gap-2"
        >
          <span>🗑️</span> Delete Product
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-8">
          {/* Basics */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-[#C4A882]/10 text-[#C4A882] rounded-lg flex items-center justify-center">📝</span>
              Product Basics
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-[#8B7355] uppercase tracking-widest mb-2">Product Name *</label>
                <input
                  type="text"
                  value={formData?.name || ''}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-6 py-4 bg-background border-none rounded-2xl focus:ring-2 focus:ring-[#C4A882]/20 font-medium text-dark"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-[#8B7355] uppercase tracking-widest mb-2">Category *</label>
                  <select
                    value={formData?.category || ''}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-6 py-4 bg-background border-none rounded-2xl focus:ring-2 focus:ring-[#C4A882]/20 font-bold text-dark appearance-none"
                    required
                  >
                    <option value="">Select Category</option>
                    {safeCategories.map((cat) => (
                      <option key={cat?._id || cat?.name} value={cat?.name || ''}>
                        {cat?.icon || '📦'} {cat?.name || 'Unknown'}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold text-[#8B7355] uppercase tracking-widest mb-2">Available Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={formData?.stock ?? 0}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    className="w-full px-6 py-4 bg-background border-none rounded-2xl focus:ring-2 focus:ring-[#C4A882]/20 font-medium text-dark"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#8B7355] uppercase tracking-widest mb-2">Short Hook (Snippet)</label>
                <textarea
                  value={formData?.shortDescription || ''}
                  onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
                  rows="2"
                  className="w-full px-6 py-4 bg-background border-none rounded-2xl focus:ring-2 focus:ring-[#C4A882]/20 font-medium text-dark resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#8B7355] uppercase tracking-widest mb-2">Full Story (Description)</label>
                <textarea
                  value={formData?.fullDescription || ''}
                  onChange={(e) => setFormData({...formData, fullDescription: e.target.value})}
                  rows="6"
                  className="w-full px-6 py-4 bg-background border-none rounded-2xl focus:ring-2 focus:ring-[#C4A882]/20 font-medium text-dark resize-none"
                />
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-accent/10 text-accent rounded-lg flex items-center justify-center">✨</span>
              Craft Details
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-[#8B7355] uppercase tracking-widest mb-2">Physical Dimensions</label>
                <input
                  type="text"
                  value={formData?.dimensions || ''}
                  onChange={(e) => setFormData({...formData, dimensions: e.target.value})}
                  placeholder="e.g. 5x5x2 inches"
                  className="w-full px-6 py-4 bg-background border-none rounded-2xl focus:ring-2 focus:ring-[#C4A882]/20 font-medium text-dark"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#8B7355] uppercase tracking-widest mb-2">Materials Used</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={materialInput}
                    onChange={(e) => setMaterialInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addMaterial(); } }}
                    placeholder="e.g. Organic Cotton"
                    className="flex-1 px-6 py-4 bg-background border-none rounded-2xl focus:ring-2 focus:ring-[#C4A882]/20 font-medium text-dark"
                  />
                  <button type="button" onClick={addMaterial} className="px-6 py-4 bg-[#C4A882] text-white rounded-2xl font-bold">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {safeMaterials.map((m, i) => (
                    <span key={`${m}-${i}`} className="px-4 py-2 bg-[#F2D7C9]/40 text-[#8B7355] rounded-xl text-xs font-bold flex items-center gap-2 border border-[#F2D7C9]">
                      {m} <button type="button" onClick={() => removeMaterial(m)} className="hover:text-red-500">×</button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#8B7355] uppercase tracking-widest mb-2">Search Tags</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                    placeholder="e.g. gift-idea"
                    className="flex-1 px-6 py-4 bg-background border-none rounded-2xl focus:ring-2 focus:ring-[#C4A882]/20 font-medium text-dark"
                  />
                  <button type="button" onClick={addTag} className="px-6 py-4 bg-[#C4A882] text-white rounded-2xl font-bold">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {safeTags.map((t, i) => (
                    <span key={`${t}-${i}`} className="px-4 py-2 bg-accent/10 text-accent rounded-xl text-xs font-bold flex items-center gap-2 border border-accent/20">
                      #{t} <button type="button" onClick={() => removeTag(t)} className="hover:text-red-500">×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-8">
          {/* Images */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-secondary/10 text-secondary rounded-lg flex items-center justify-center">🖼️</span>
              Gallery ({safeImages.length}/15)
            </h2>
            
            <label className="block border-2 border-dashed border-gray-100 rounded-2xl p-8 text-center cursor-pointer hover:border-[#C4A882] hover:bg-[#FBF9F7] transition-all group">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading || safeImages.length >= 15}
              />
              <div className="w-12 h-12 bg-[#FBF9F7] text-[#C4A882] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl">{uploading ? '⌛' : '➕'}</span>
              </div>
              <p className="font-bold text-dark">{uploading ? 'Processing...' : 'Add Visuals'}</p>
              <p className="text-[10px] text-light uppercase tracking-widest mt-1">Square images work best</p>
            </label>

            <div className="grid grid-cols-2 gap-3 mt-6">
              {safeImages.map((img, idx) => (
                <div key={`img-${idx}`} className="relative group aspect-square rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                  <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  {idx === 0 && (
                    <div className="absolute top-2 left-2 bg-[#C4A882] text-white text-[9px] font-bold px-2 py-1 rounded-lg uppercase tracking-widest shadow-lg">
                      Main Focus
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="p-2 bg-white text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-lg"
                    >
                      🗑️
                    </button>
                    {idx > 0 && (
                      <button
                        type="button"
                        onClick={() => setMainImage(idx)}
                        className="px-3 py-2 bg-white text-dark rounded-xl hover:bg-[#C4A882] hover:text-white transition-all font-bold text-[10px] shadow-lg"
                      >
                        Set Main
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing & Badges */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-terracotta/10 text-terracotta rounded-lg flex items-center justify-center">💰</span>
              Economics
            </h2>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#8B7355] uppercase tracking-widest mb-2">Base Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData?.price || ''}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-6 py-4 bg-background border-none rounded-2xl focus:ring-2 focus:ring-[#C4A882]/20 font-bold text-dark"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#8B7355] uppercase tracking-widest mb-2">Sale Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData?.salePrice || ''}
                    onChange={(e) => setFormData({...formData, salePrice: e.target.value})}
                    className="w-full px-6 py-4 bg-background border-none rounded-2xl focus:ring-2 focus:ring-[#C4A882]/20 font-bold text-dark"
                  />
                </div>
              </div>
              
              <div className="space-y-3 pt-4 border-t border-gray-50">
                <BadgeToggle label="⭐ Feature on Homepage" checked={!!formData?.isFeatured} onChange={(v) => setFormData({...formData, isFeatured: v})} />
                <BadgeToggle label="🏆 Bestseller Highlight" checked={!!formData?.isBestseller} onChange={(v) => setFormData({...formData, isBestseller: v})} />
                <BadgeToggle label="✨ New Arrival Spark" checked={!!formData?.isNewArrival} onChange={(v) => setFormData({...formData, isNewArrival: v})} />
                <BadgeToggle label="👁️ Visible in Shop" checked={formData?.isActive !== false} onChange={(v) => setFormData({...formData, isActive: v})} />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-6 bg-dark text-white rounded-[2rem] font-bold text-lg shadow-xl shadow-dark/10 hover:shadow-2xl hover:-translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {saving ? '⌛ Weaving Changes...' : '💾 Save Product Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

function BadgeToggle({ label, checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border-2 ${checked ? 'bg-[#C4A882]/5 border-[#C4A882]/20 text-dark' : 'bg-background border-transparent text-light opacity-60'}`}
    >
      <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
      <div className={`w-10 h-6 rounded-full relative transition-colors ${checked ? 'bg-[#C4A882]' : 'bg-gray-300'}`}>
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${checked ? 'left-5' : 'left-1'}`} />
      </div>
    </button>
  );
}
