'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  Save, 
  ArrowLeft, 
  Upload, 
  X, 
  Image as ImageIcon,
  Star,
  Tag,
  DollarSign,
  Package
} from 'lucide-react';
import { safeGet, safePost } from '@/lib/apiClient';
import apiClient from '@/lib/apiClient';

export default function AddProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
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
    isNewArrival: false,
    metaTitle: '',
    metaDescription: ''
  });

  const [materialInput, setMaterialInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    const loadCategories = async () => {
      setLoadingCategories(true);
      const data = await safeGet('/categories', []);
      setCategories(Array.isArray(data) ? data : []);
      setLoadingCategories(false);
    };
    loadCategories();
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'name' && value) {
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      setFormData(prev => ({ ...prev, name: value, slug }));
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if ((formData.images?.length || 0) + files.length > 15) {
      toast.error('Maximum 15 images allowed');
      return;
    }

    setUploadingImage(true);
    const uploadedUrls = [];

    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 10MB)`);
        continue;
      }

      try {
        const formDataUpload = new FormData();
        formDataUpload.append('image', file);

        const res = await apiClient.post('/upload/image', formDataUpload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        const url = res.data?.url || res.data?.data?.url;
        if (url) uploadedUrls.push(url);
      } catch (err) {
        console.error('Upload failed:', err);
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), ...uploadedUrls]
    }));
    
    if (uploadedUrls.length > 0) {
      toast.success(`${uploadedUrls.length} image(s) uploaded`);
    }
    setUploadingImage(false);
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index)
    }));
  };

  const moveImage = (fromIndex, toIndex) => {
    const newImages = [...(formData.images || [])];
    const [moved] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, moved);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const addMaterial = () => {
    if (materialInput.trim() && !(formData.materials || []).includes(materialInput.trim())) {
      setFormData(prev => ({
        ...prev,
        materials: [...(prev.materials || []), materialInput.trim()]
      }));
      setMaterialInput('');
    }
  };

  const removeMaterial = (material) => {
    setFormData(prev => ({
      ...prev,
      materials: (prev.materials || []).filter(m => m !== material)
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !(formData.tags || []).includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(t => t !== tag)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name?.trim()) {
      toast.error('Product name is required');
      return;
    }
    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }
    if (!formData.price || formData.price <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    setSubmitting(true);
    const result = await safePost('/products', {
      ...formData,
      price: Number(formData.price),
      salePrice: formData.salePrice ? Number(formData.salePrice) : undefined,
      stock: Number(formData.stock) || 0
    });

    if (result.success) {
      toast.success('Product added successfully! 🎉');
      router.push('/admin/products');
    } else {
      toast.error(result.error || 'Failed to add product');
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#8B7355] hover:text-[#5C4033] mb-2"
          >
            <ArrowLeft size={16} /> Back to Products
          </button>
          <h1 className="text-4xl font-serif text-[#2C2C2C]">Add New Treasure</h1>
          <p className="text-gray-500 italic">Bring a new handmade creation to life</p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl shadow-sm"
          >
            <h2 className="text-xl font-serif mb-4 flex items-center gap-2">
              <Package size={20} /> Basics
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#8B7355] uppercase tracking-widest mb-2">
                  Treasure Name *
                </label>
                <input
                  type="text"
                  value={formData?.name || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="e.g. Dreamy Lavender Crochet Bow"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#C4A882] transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#8B7355] uppercase tracking-widest mb-2">
                    Category *
                  </label>
                  <select
                    value={formData?.category || ''}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#C4A882]"
                    required
                  >
                    <option value="">
                      {loadingCategories ? 'Loading...' : 'Select Category'}
                    </option>
                    {(categories || []).length === 0 && !loadingCategories && (
                      <option disabled>No categories. Add one first!</option>
                    )}
                    {(categories || []).map(cat => (
                      <option key={cat._id || cat.name} value={cat.name}>
                        {cat.icon || '📦'} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#8B7355] uppercase tracking-widest mb-2">
                    Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData?.stock || 0}
                    onChange={(e) => handleChange('stock', e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#C4A882]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8B7355] uppercase tracking-widest mb-2">
                  Short Description
                </label>
                <textarea
                  value={formData?.shortDescription || ''}
                  onChange={(e) => handleChange('shortDescription', e.target.value)}
                  rows="2"
                  placeholder="A brief enchanting description..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#C4A882]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8B7355] uppercase tracking-widest mb-2">
                  Full Description
                </label>
                <textarea
                  value={formData?.fullDescription || ''}
                  onChange={(e) => handleChange('fullDescription', e.target.value)}
                  rows="5"
                  placeholder="Tell the story of this piece..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#C4A882]"
                />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm"
          >
            <h2 className="text-xl font-serif mb-4 flex items-center gap-2">
              <DollarSign size={20} /> Pricing & Visibility
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-[#8B7355] uppercase tracking-widest mb-2">
                  Main Price (₹) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData?.price || ''}
                  onChange={(e) => handleChange('price', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#C4A882]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#8B7355] uppercase tracking-widest mb-2">
                  Sale Price (₹) <span className="text-gray-400">optional</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData?.salePrice || ''}
                  onChange={(e) => handleChange('salePrice', e.target.value)}
                  placeholder="Optional"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#C4A882]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData?.isFeatured || false}
                  onChange={(e) => handleChange('isFeatured', e.target.checked)}
                  className="w-4 h-4 accent-[#C4A882]"
                />
                <span className="text-sm font-medium">⭐ Show in Featured</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData?.isBestseller || false}
                  onChange={(e) => handleChange('isBestseller', e.target.checked)}
                  className="w-4 h-4 accent-[#C4A882]"
                />
                <span className="text-sm font-medium">🏆 Bestseller Badge</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData?.isNewArrival || false}
                  onChange={(e) => handleChange('isNewArrival', e.target.checked)}
                  className="w-4 h-4 accent-[#C4A882]"
                />
                <span className="text-sm font-medium">✨ New Arrival Badge</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData?.isActive !== false}
                  onChange={(e) => handleChange('isActive', e.target.checked)}
                  className="w-4 h-4 accent-[#C4A882]"
                />
                <span className="text-sm font-medium">👁️ Active (visible on shop)</span>
              </label>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-2xl shadow-sm"
          >
            <h2 className="text-xl font-serif mb-4 flex items-center gap-2">
              <Tag size={20} /> Technicalities
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#8B7355] uppercase tracking-widest mb-2">
                  Dimensions
                </label>
                <input
                  type="text"
                  value={formData?.dimensions || ''}
                  onChange={(e) => handleChange('dimensions', e.target.value)}
                  placeholder="e.g. 5x5x2 inches"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#C4A882]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8B7355] uppercase tracking-widest mb-2">
                  Care Instructions
                </label>
                <textarea
                  value={formData?.careInstructions || ''}
                  onChange={(e) => handleChange('careInstructions', e.target.value)}
                  rows="3"
                  placeholder="How to keep this piece beautiful..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#C4A882]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8B7355] uppercase tracking-widest mb-2">
                  Materials
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={materialInput}
                    onChange={(e) => setMaterialInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addMaterial())}
                    placeholder="e.g. Yarn"
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#C4A882]"
                  />
                  <button
                    type="button"
                    onClick={addMaterial}
                    className="px-4 py-2 bg-[#C4A882] text-white rounded-xl hover:bg-[#8B7355]"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(formData.materials || []).map(m => (
                    <span 
                      key={m}
                      className="px-3 py-1 bg-[#F2D7C9] text-[#8B7355] rounded-full text-sm flex items-center gap-1"
                    >
                      {m}
                      <button 
                        type="button"
                        onClick={() => removeMaterial(m)}
                        className="hover:text-red-600"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8B7355] uppercase tracking-widest mb-2">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="e.g. cute, gift, handmade"
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#C4A882]"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-[#C4A882] text-white rounded-xl hover:bg-[#8B7355]"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(formData.tags || []).map(t => (
                    <span 
                      key={t}
                      className="px-3 py-1 bg-[#A8B5A2]/30 text-[#5C4033] rounded-full text-sm flex items-center gap-1"
                    >
                      #{t}
                      <button 
                        type="button"
                        onClick={() => removeTag(t)}
                        className="hover:text-red-600"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-2xl shadow-sm sticky top-24"
          >
            <h2 className="text-xl font-serif mb-4 flex items-center gap-2">
              <ImageIcon size={20} /> Backdrop
            </h2>

            <div className="text-xs text-gray-500 mb-3">
              {(formData.images || []).length} of 15 images
            </div>

            <label className="block border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:border-[#C4A882] hover:bg-[#F5F0EB]/50 transition-all mb-4">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploadingImage || (formData.images || []).length >= 15}
              />
              <Upload className="mx-auto mb-3 text-[#C4A882]" size={32} />
              <p className="font-semibold text-[#2C2C2C]">
                {uploadingImage ? 'Uploading...' : 'Drag & Drop images here'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                or click to browse • JPG, PNG, WEBP, GIF (MAX 10MB)
              </p>
            </label>

            <div className="grid grid-cols-2 gap-2">
              {(formData.images || []).map((img, idx) => (
                <div key={idx} className="relative group">
                  <img 
                    src={img} 
                    alt={`Product ${idx + 1}`}
                    className="w-full h-24 object-cover rounded-xl"
                  />
                  {idx === 0 && (
                    <div className="absolute top-1 left-1 bg-[#C4A882] text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Star size={10} fill="white" /> Main
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={() => moveImage(idx, 0)}
                      className="absolute bottom-1 left-1 bg-white text-[#8B7355] text-[10px] px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100"
                    >
                      Set Main
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.button
            type="submit"
            disabled={submitting}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-gradient-to-r from-[#C4A882] to-[#D4A574] text-white rounded-2xl shadow-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save size={20} />
            {submitting ? 'Creating Treasure...' : 'Create Treasure'}
          </motion.button>
        </div>
      </form>
    </div>
  );
}
