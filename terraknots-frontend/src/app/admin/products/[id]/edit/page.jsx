'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
  Package,
  AlertCircle
} from 'lucide-react';
import { safeGet, safePut } from '@/lib/apiClient';
import apiClient from '@/lib/apiClient';

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
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
    const fetchData = async () => {
      setLoading(true);
      try {
        const [categoriesData, productData] = await Promise.all([
          safeGet('/categories', []),
          safeGet(`/products/id/${id}`, null)
        ]);
        
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        
        if (productData) {
          setFormData({
            name: productData.name || '',
            slug: productData.slug || '',
            shortDescription: productData.shortDescription || '',
            fullDescription: productData.fullDescription || '',
            category: productData.category?.name || productData.category || '',
            price: productData.price || '',
            salePrice: productData.salePrice || '',
            stock: productData.stock || 0,
            images: productData.images || [],
            materials: productData.materials || [],
            careInstructions: productData.careInstructions || '',
            dimensions: productData.dimensions || '',
            tags: productData.tags || [],
            isFeatured: productData.isFeatured || false,
            isActive: productData.isActive !== false,
            isBestseller: productData.isBestseller || false,
            isNewArrival: productData.isNewArrival || false,
            metaTitle: productData.metaTitle || '',
            metaDescription: productData.metaDescription || ''
          });
        } else {
          toast.error('Product not found');
        }
      } catch (err) {
        console.error('Failed to load data:', err);
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
    const result = await safePut(`/products/${id}`, {
      ...formData,
      price: Number(formData.price),
      salePrice: formData.salePrice ? Number(formData.salePrice) : undefined,
      stock: Number(formData.stock) || 0
    });

    if (result.success) {
      toast.success('Treasure updated successfully! 🧶');
      router.push('/admin/products');
    } else {
      toast.error(result.error || 'Failed to update product');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-20 text-center">
        <div className="w-10 h-10 border-4 border-[#C4A882] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 italic">Unraveling details...</p>
      </div>
    );
  }

  if (!formData.name && !loading) {
    return (
      <div className="p-20 text-center">
        <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
        <h2 className="text-2xl font-serif text-[#2C2C2C]">Treasure not found</h2>
        <button onClick={() => router.back()} className="mt-4 text-[#8B7355] underline">Go back</button>
      </div>
    );
  }

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
          <h1 className="text-4xl font-serif text-[#2C2C2C]">Refine Treasure</h1>
          <p className="text-gray-500 italic">Updating "{formData.name}"</p>
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
                    <option value="">Select Category</option>
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#C4A882]"
                />
              </div>
            </div>
          </motion.div>

          {/* Pricing & Visibility */}
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
                  Sale Price (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData?.salePrice || ''}
                  onChange={(e) => handleChange('salePrice', e.target.value)}
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

          {/* Technicalities */}
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
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#C4A882]"
                  />
                  <button type="button" onClick={addMaterial} className="px-4 py-2 bg-[#C4A882] text-white rounded-xl">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(formData.materials || []).map(m => (
                    <span key={m} className="px-3 py-1 bg-[#F2D7C9] text-[#8B7355] rounded-full text-sm flex items-center gap-1">
                      {m}
                      <button type="button" onClick={() => removeMaterial(m)}><X size={12} /></button>
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
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#C4A882]"
                  />
                  <button type="button" onClick={addTag} className="px-4 py-2 bg-[#C4A882] text-white rounded-xl">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(formData.tags || []).map(t => (
                    <span key={t} className="px-3 py-1 bg-[#A8B5A2]/30 text-[#5C4033] rounded-full text-sm flex items-center gap-1">
                      #{t}
                      <button type="button" onClick={() => removeTag(t)}><X size={12} /></button>
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
            </label>

            <div className="grid grid-cols-2 gap-2">
              {(formData.images || []).map((img, idx) => (
                <div key={idx} className="relative group">
                  <img src={img} alt="" className="w-full h-24 object-cover rounded-xl" />
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
                </div>
              ))}
            </div>
          </motion.div>

          <motion.button
            type="submit"
            disabled={submitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-gradient-to-r from-[#C4A882] to-[#D4A574] text-white rounded-2xl shadow-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save size={20} />
            {submitting ? 'Updating...' : 'Update Treasure'}
          </motion.button>
        </div>
      </form>
    </div>
  );
}
