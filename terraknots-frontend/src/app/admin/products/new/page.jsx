'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function NewProductPage() {
  const router = useRouter();
  
  // ALL STATES INITIALIZED WITH SAFE DEFAULTS
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
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

  // SAFE CATEGORY FETCH
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_URL}/categories`, { timeout: 30000 });
        const data = res?.data?.data;
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Categories fetch failed:', err.message);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const getToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('adminToken') || localStorage.getItem('token');
  };

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
            ...(token && { Authorization: `Bearer ${token}` })
          },
          timeout: 60000
        });
        const url = res?.data?.url || res?.data?.data?.url || res?.data?.secure_url;
        if (url) uploaded.push(url);
      } catch (err) {
        console.error('Upload failed:', err.message);
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

    setLoading(true);
    try {
      const token = getToken();
      const payload = {
        ...formData,
        price: Number(formData.price),
        salePrice: formData.salePrice ? Number(formData.salePrice) : undefined,
        stock: Number(formData.stock) || 0
      };
      
      await axios.post(`${API_URL}/products`, payload, {
        headers: { ...(token && { Authorization: `Bearer ${token}` }) },
        timeout: 30000
      });
      
      toast.success('Product created! 🎉');
      router.push('/admin/products');
    } catch (err) {
      console.error('Submit error:', err);
      toast.error(err?.response?.data?.message || 'Failed to create product');
      setLoading(false);
    }
  };

  const safeImages = formData?.images || [];
  const safeMaterials = formData?.materials || [];
  const safeTags = formData?.tags || [];
  const safeCategories = categories || [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <button onClick={() => router.back()} className="text-sm text-[#8B7355] mb-2">
          ← Back
        </button>
        <h1 className="text-3xl font-serif text-[#2C2C2C]">Add New Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basics */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Basics</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#8B7355] uppercase mb-1">Name *</label>
                <input
                  type="text"
                  value={formData?.name || ''}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border rounded-xl"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#8B7355] uppercase mb-1">Category *</label>
                  <select
                    value={formData?.category || ''}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-2 border rounded-xl"
                    required
                  >
                    <option value="">Select Category</option>
                    {safeCategories.length === 0 && (
                      <option disabled>No categories yet</option>
                    )}
                    {safeCategories.map((cat) => (
                      <option key={cat?._id || cat?.name} value={cat?.name || ''}>
                        {cat?.icon || '📦'} {cat?.name || 'Unknown'}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-[#8B7355] uppercase mb-1">Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={formData?.stock ?? 0}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    className="w-full px-4 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8B7355] uppercase mb-1">Short Description</label>
                <textarea
                  value={formData?.shortDescription || ''}
                  onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
                  rows="2"
                  className="w-full px-4 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8B7355] uppercase mb-1">Full Description</label>
                <textarea
                  value={formData?.fullDescription || ''}
                  onChange={(e) => setFormData({...formData, fullDescription: e.target.value})}
                  rows="5"
                  className="w-full px-4 py-2 border rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Pricing & Visibility</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-[#8B7355] uppercase mb-1">Price (₹) *</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData?.price || ''}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full px-4 py-2 border rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#8B7355] uppercase mb-1">Sale Price (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData?.salePrice || ''}
                  onChange={(e) => setFormData({...formData, salePrice: e.target.value})}
                  className="w-full px-4 py-2 border rounded-xl"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!formData?.isFeatured}
                  onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                />
                <span className="text-sm">Show in Featured</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!formData?.isBestseller}
                  onChange={(e) => setFormData({...formData, isBestseller: e.target.checked})}
                />
                <span className="text-sm">Bestseller Badge</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!formData?.isNewArrival}
                  onChange={(e) => setFormData({...formData, isNewArrival: e.target.checked})}
                />
                <span className="text-sm">New Arrival Badge</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData?.isActive !== false}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                />
                <span className="text-sm">Active (visible)</span>
              </label>
            </div>
          </div>

          {/* Technicalities */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#8B7355] uppercase mb-1">Dimensions</label>
                <input
                  type="text"
                  value={formData?.dimensions || ''}
                  onChange={(e) => setFormData({...formData, dimensions: e.target.value})}
                  placeholder="e.g. 5x5x2 inches"
                  className="w-full px-4 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8B7355] uppercase mb-1">Care Instructions</label>
                <textarea
                  value={formData?.careInstructions || ''}
                  onChange={(e) => setFormData({...formData, careInstructions: e.target.value})}
                  rows="3"
                  className="w-full px-4 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8B7355] uppercase mb-1">Materials</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={materialInput}
                    onChange={(e) => setMaterialInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addMaterial(); } }}
                    placeholder="e.g. Yarn"
                    className="flex-1 px-4 py-2 border rounded-xl"
                  />
                  <button type="button" onClick={addMaterial} className="px-4 py-2 bg-[#C4A882] text-white rounded-xl">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {safeMaterials.map((m, i) => (
                    <span key={`${m}-${i}`} className="px-3 py-1 bg-[#F2D7C9] text-[#8B7355] rounded-full text-sm">
                      {m} <button type="button" onClick={() => removeMaterial(m)}>×</button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8B7355] uppercase mb-1">Tags</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                    placeholder="e.g. cute"
                    className="flex-1 px-4 py-2 border rounded-xl"
                  />
                  <button type="button" onClick={addTag} className="px-4 py-2 bg-[#C4A882] text-white rounded-xl">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {safeTags.map((t, i) => (
                    <span key={`${t}-${i}`} className="px-3 py-1 bg-[#A8B5A2]/30 rounded-full text-sm">
                      #{t} <button type="button" onClick={() => removeTag(t)}>×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Images ({safeImages.length}/15)</h2>
            
            <label className="block border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center cursor-pointer hover:border-[#C4A882]">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading || safeImages.length >= 15}
              />
              <p className="font-semibold">{uploading ? 'Uploading...' : 'Click to upload'}</p>
              <p className="text-xs text-gray-500 mt-1">JPG, PNG, WEBP, GIF (max 10MB)</p>
            </label>

            <div className="grid grid-cols-2 gap-2 mt-4">
              {safeImages.map((img, i) => (
                <div key={`img-${i}`} className="relative group">
                  <img src={img} alt={`${i}`} className="w-full h-24 object-cover rounded-xl" />
                  {i === 0 && (
                    <div className="absolute top-1 left-1 bg-[#C4A882] text-white text-[10px] px-2 py-0.5 rounded-full">
                      ⭐ Main
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 opacity-0 group-hover:opacity-100"
                  >
                    ×
                  </button>
                  {i > 0 && (
                    <button
                      type="button"
                      onClick={() => setMainImage(i)}
                      className="absolute bottom-1 left-1 bg-white text-[10px] px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100"
                    >
                      Set Main
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#C4A882] text-white rounded-2xl font-semibold disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
