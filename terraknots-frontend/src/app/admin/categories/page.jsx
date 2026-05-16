'use client';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

const DEFAULT_ICONS = ['🧶', '✨', '🏺', '🌿', '💫', '🔑', '🌸', '💎', '📿', '💍', '🌺', '🎀', '🧸', '☕', '📱', '🎁', '🦋', '🌟'];

const DEFAULT_COLORS = [
  '#C4A882', '#8B7355', '#A8B5A2', '#D4A574', 
  '#F2D7C9', '#D4A5A5', '#C9B09B', '#8A9A7B'
];

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    icon: '🧶',
    color: '#C4A882',
    displayOrder: 0,
    isActive: true
  });

  const getToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('adminToken') || localStorage.getItem('token');
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const token = getToken();
      const res = await axios.get(`${API_URL}/categories/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(res?.data?.data || []);
    } catch (err) {
      console.error('Failed to load categories:', err);
      try {
        const res = await axios.get(`${API_URL}/categories`);
        setCategories(res?.data?.data || []);
      } catch (e) {
        setCategories([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const openAddForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      image: '',
      icon: '🧶',
      color: '#C4A882',
      displayOrder: categories.length + 1,
      isActive: true
    });
    setShowForm(true);
  };

  const openEditForm = (cat) => {
    setEditingId(cat._id);
    setFormData({
      name: cat.name || '',
      description: cat.description || '',
      image: cat.image || '',
      icon: cat.icon || '🧶',
      color: cat.color || '#C4A882',
      displayOrder: cat.displayOrder || 0,
      isActive: cat.isActive !== false
    });
    setShowForm(true);
  };

  const handleImageUpload = async (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;

    // Validate
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be less than 10MB');
      return;
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error('Only JPG, PNG, WEBP, GIF allowed');
      return;
    }

    setUploading(true);
    const loadingToast = toast.loading('Uploading banner image...');

    try {
      const token = getToken();
      const fd = new FormData();
      fd.append('image', file);
      fd.append('folder', 'terraknots/categories');

      const res = await axios.post(`${API_URL}/upload/category-banner`, fd, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
        timeout: 60000
      });

      const url = res?.data?.url || res?.data?.data?.url || res?.data?.secure_url;
      
      if (url) {
        setFormData(prev => ({ ...prev, image: url }));
        toast.success('Banner uploaded! ✨', { id: loadingToast });
      } else {
        toast.error('Upload failed — no URL returned', { id: loadingToast });
      }
    } catch (err) {
      console.error('Upload error:', err);
      // Fallback try regular endpoint
      try {
        const token = getToken();
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
        if (url) {
          setFormData(prev => ({ ...prev, image: url }));
          toast.success('Banner uploaded! ✨', { id: loadingToast });
        } else {
          toast.error('Upload failed', { id: loadingToast });
        }
      } catch (e) {
        toast.error(err?.response?.data?.message || 'Upload failed', { id: loadingToast });
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData?.name?.trim()) {
      toast.error('Category name is required');
      return;
    }

    setSubmitting(true);
    try {
      const token = getToken();
      const payload = {
        name: formData.name.trim(),
        description: formData.description?.trim() || '',
        image: formData.image || '',
        icon: formData.icon || '🧶',
        color: formData.color || '#C4A882',
        displayOrder: Number(formData.displayOrder) || 0,
        isActive: formData.isActive !== false
      };

      if (editingId) {
        await axios.put(`${API_URL}/categories/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Category updated! ✨');
      } else {
        await axios.post(`${API_URL}/categories`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Category created! 🎉');
      }

      setShowForm(false);
      loadCategories();
    } catch (err) {
      console.error('Save error:', err);
      toast.error(err?.response?.data?.message || 'Failed to save');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (cat) => {
    if (!confirm(`Delete category "${cat.name}"? This cannot be undone.`)) return;

    try {
      const token = getToken();
      await axios.delete(`${API_URL}/categories/${cat._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Category deleted');
      loadCategories();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete');
    }
  };

  const toggleActive = async (cat) => {
    try {
      const token = getToken();
      await axios.put(`${API_URL}/categories/${cat._id}`, 
        { ...cat, isActive: !cat.isActive },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Category ${!cat.isActive ? 'activated' : 'deactivated'}`);
      loadCategories();
    } catch (err) {
      toast.error('Failed to toggle');
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="text-6xl mb-4">🧶</div>
        <p className="text-gray-500">Loading categories...</p>
      </div>
    );
  }

  const safeCategories = categories || [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-4xl font-serif text-[#2C2C2C]">Categories</h1>
          <p className="text-gray-500 italic">Organize your handmade treasures</p>
        </div>
        <button
          onClick={openAddForm}
          className="px-6 py-3 bg-[#C4A882] text-white rounded-xl font-semibold hover:bg-[#8B7355] transition-colors shadow-md"
        >
          + Add Category
        </button>
      </div>

      {/* Categories Grid */}
      {safeCategories.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl text-center">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold mb-2">No categories yet</h3>
          <p className="text-gray-500 mb-6">Create your first category to get started</p>
          <button
            onClick={openAddForm}
            className="px-6 py-3 bg-[#C4A882] text-white rounded-xl font-semibold"
          >
            + Add First Category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {safeCategories.map((cat) => (
            <div 
              key={cat._id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Banner Image */}
              {cat.image ? (
                <div className="relative h-40 overflow-hidden" style={{ backgroundColor: cat.color }}>
                  <img 
                    src={cat.image} 
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 text-3xl bg-white/90 rounded-full w-12 h-12 flex items-center justify-center">
                    {cat.icon || '📦'}
                  </div>
                  {!cat.isActive && (
                    <div className="absolute top-2 right-2 bg-gray-800/80 text-white text-xs px-2 py-1 rounded-full">
                      Inactive
                    </div>
                  )}
                </div>
              ) : (
                <div 
                  className="h-40 flex items-center justify-center text-6xl"
                  style={{ backgroundColor: cat.color || '#C4A882' }}
                >
                  {cat.icon || '📦'}
                  {!cat.isActive && (
                    <div className="absolute top-2 right-2 bg-gray-800/80 text-white text-xs px-2 py-1 rounded-full">
                      Inactive
                    </div>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-serif text-xl">{cat.name}</h3>
                  <span className="text-xs text-gray-400">
                    {cat.productCount || 0} products
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {cat.description || 'No description'}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEditForm(cat)}
                    className="flex-1 py-2 bg-[#F5F0EB] text-[#8B7355] rounded-lg text-sm font-semibold hover:bg-[#F2D7C9] transition-colors"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => toggleActive(cat)}
                    className="px-3 py-2 bg-[#F5F0EB] text-[#8B7355] rounded-lg text-sm hover:bg-[#F2D7C9] transition-colors"
                    title={cat.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {cat.isActive ? '👁️' : '🙈'}
                  </button>
                  <button
                    onClick={() => handleDelete(cat)}
                    className="px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100 transition-colors"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL FORM */}
      {showForm && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowForm(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-serif">
                {editingId ? '✏️ Edit Category' : '+ Add New Category'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Banner Image Upload */}
              <div>
                <label className="block text-xs font-semibold text-[#8B7355] uppercase tracking-widest mb-2">
                  Banner Image
                </label>
                
                {formData.image ? (
                  <div className="relative">
                    <img 
                      src={formData.image} 
                      alt="Banner"
                      className="w-full h-48 object-cover rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
                    >
                      ×
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-2 right-2 bg-white text-[#8B7355] px-3 py-1 rounded-full text-sm font-semibold hover:bg-[#F5F0EB]"
                    >
                      🔄 Change
                    </button>
                  </div>
                ) : (
                  <label className="block border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:border-[#C4A882] hover:bg-[#F5F0EB]/50 transition-all">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                    <div className="text-4xl mb-2">🖼️</div>
                    <p className="font-semibold text-[#2C2C2C]">
                      {uploading ? 'Uploading...' : 'Click to upload banner'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      or drag & drop • JPG, PNG, WEBP, GIF (max 10MB)
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Recommended: 1200×600px
                    </p>
                  </label>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-[#8B7355] uppercase tracking-widest mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={formData?.name || ''}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Keychains"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#C4A882]"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-[#8B7355] uppercase tracking-widest mb-2">
                  Description
                </label>
                <textarea
                  value={formData?.description || ''}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                  placeholder="A short description of this category..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#C4A882]"
                />
              </div>

              {/* Icon */}
              <div>
                <label className="block text-xs font-semibold text-[#8B7355] uppercase tracking-widest mb-2">
                  Icon
                </label>
                <div className="flex items-center gap-3 mb-2">
                  <input
                    type="text"
                    value={formData?.icon || ''}
                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                    placeholder="🧶"
                    maxLength="2"
                    className="w-20 px-4 py-3 text-3xl text-center border border-gray-200 rounded-xl focus:outline-none focus:border-[#C4A882]"
                  />
                  <div className="flex-1 grid grid-cols-9 gap-1">
                    {DEFAULT_ICONS.map(icon => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setFormData({...formData, icon})}
                        className={`text-xl p-2 rounded-lg hover:bg-[#F5F0EB] transition-colors ${formData.icon === icon ? 'bg-[#F2D7C9]' : ''}`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="block text-xs font-semibold text-[#8B7355] uppercase tracking-widest mb-2">
                  Theme Color
                </label>
                <div className="flex items-center gap-3 mb-2">
                  <input
                    type="color"
                    value={formData?.color || '#C4A882'}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                    className="w-16 h-12 rounded-xl cursor-pointer border-2 border-gray-200"
                  />
                  <input
                    type="text"
                    value={formData?.color || ''}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-mono text-sm focus:outline-none focus:border-[#C4A882]"
                  />
                </div>
                <div className="flex gap-2">
                  {DEFAULT_COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({...formData, color})}
                      className={`w-10 h-10 rounded-full border-2 ${formData.color === color ? 'border-gray-800 scale-110' : 'border-gray-200'} transition-all`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Display Order & Active */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#8B7355] uppercase tracking-widest mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData?.displayOrder ?? 0}
                    onChange={(e) => setFormData({...formData, displayOrder: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#C4A882]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#8B7355] uppercase mb-2">
                    Status
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                    className={`w-full px-4 py-3 rounded-xl font-semibold transition-colors ${
                      formData.isActive 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-gray-50 text-gray-500 border border-gray-200'
                    }`}
                  >
                    {formData.isActive ? '✅ Active' : '🙈 Inactive'}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploading}
                  className="flex-1 py-3 bg-[#C4A882] text-white rounded-xl font-semibold hover:bg-[#8B7355] disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : (editingId ? '💾 Update Category' : '+ Create Category')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
