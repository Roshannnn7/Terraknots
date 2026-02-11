'use client';

import { useState, useRef } from 'react';
import {
    Upload,
    X,
    Plus,
    Trash2,
    Save,
    ArrowLeft,
    Sparkles,
    Info,
    Layers,
    Tag
} from 'lucide-react';
import { toast } from 'react-toastify';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const ProductForm = ({ initialData = null, isEdit = false }) => {
    const router = useRouter();
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState(initialData?.images || []);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        category: initialData?.category || 'Crochet',
        price: initialData?.price || '',
        salePrice: initialData?.salePrice || '',
        stock: initialData?.stock || '',
        shortDescription: initialData?.shortDescription || '',
        fullDescription: initialData?.fullDescription || '',
        materials: initialData?.materials || [],
        careInstructions: initialData?.careInstructions || '',
        dimensions: initialData?.dimensions || '',
        tags: initialData?.tags || [],
        isFeatured: initialData?.isFeatured || false,
        isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
    });

    const [newMaterial, setNewMaterial] = useState('');
    const [newTag, setNewTag] = useState('');

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploading(true);
        const uploadedUrls = [...images];

        try {
            for (const file of files) {
                const formData = new FormData();
                formData.append('image', file);
                const { data } = await api.post('/upload/image', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                uploadedUrls.push(data.url);
            }
            setImages(uploadedUrls);
            toast.success('Images uploaded to workshop');
        } catch (error) {
            toast.error('Failed to upload some images');
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleAddItem = (type) => {
        if (type === 'material' && newMaterial.trim()) {
            setFormData({ ...formData, materials: [...formData.materials, newMaterial.trim()] });
            setNewMaterial('');
        }
        if (type === 'tag' && newTag.trim()) {
            setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] });
            setNewTag('');
        }
    };

    const removeItem = (type, value) => {
        if (type === 'material') {
            setFormData({ ...formData, materials: formData.materials.filter(m => m !== value) });
        }
        if (type === 'tag') {
            setFormData({ ...formData, tags: formData.tags.filter(t => t !== value) });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (images.length === 0) return toast.error('Add at least one product photo');

        setLoading(true);
        const finalData = { ...formData, images };

        try {
            if (isEdit) {
                await api.put(`/products/${initialData._id}`, finalData);
                toast.success('Treasure updated!');
            } else {
                await api.post('/products', finalData);
                toast.success('New treasure added to the collection!');
            }
            router.push('/admin/products');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Left Column: Essential Details */}
            <div className="lg:col-span-2 space-y-8">

                {/* Basic Info */}
                <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 space-y-6">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                            <Info size={18} />
                        </div>
                        <h3 className="text-xl font-heading font-bold text-dark">Basics</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-light pl-4">Treasure Name</label>
                            <input
                                type="text" required
                                className="input-field h-14"
                                placeholder="e.g. Dreamy Lavender Crochet Bow"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-light pl-4">Category</label>
                                <select
                                    className="input-field h-14 appearance-none"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option>Crochet</option>
                                    <option>Resin</option>
                                    <option>Clay</option>
                                    <option>Decor</option>
                                    <option>Accessories</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-light pl-4">Availability (Stock)</label>
                                <input
                                    type="number" required
                                    className="input-field h-14"
                                    placeholder="0"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-light pl-4">Brief Scent/Story</label>
                            <input
                                type="text"
                                className="input-field h-14"
                                placeholder="Hook people in with one sentence..."
                                value={formData.shortDescription}
                                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Pricing & Visibility */}
                <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <h3 className="text-lg font-heading font-bold text-dark">Pricing</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-light pl-4">Main Price</label>
                                <input
                                    type="number" required
                                    className="input-field h-14"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-light pl-4">Sale Price</label>
                                <input
                                    type="number"
                                    className="input-field h-14"
                                    placeholder="Optional"
                                    value={formData.salePrice}
                                    onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-lg font-heading font-bold text-dark">Visibility</h3>
                        <div className="flex flex-col space-y-4">
                            <label className="flex items-center space-x-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 rounded-lg border-gray-200 text-primary focus:ring-primary/20"
                                    checked={formData.isFeatured}
                                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                />
                                <span className="text-sm font-bold text-dark group-hover:text-primary transition-colors">Show in Bestsellers</span>
                            </label>
                            <label className="flex items-center space-x-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 rounded-lg border-gray-200 text-primary focus:ring-primary/20"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                />
                                <span className="text-sm font-bold text-dark group-hover:text-primary transition-colors">Active in Shop</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Full Story */}
                <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 space-y-6">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2.5 bg-accent/20 text-accent rounded-xl">
                            <Sparkles size={18} />
                        </div>
                        <h3 className="text-xl font-heading font-bold text-dark">The Full Story</h3>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-light pl-4">Full Description</label>
                        <textarea
                            rows={8}
                            className="input-field p-6 resize-none"
                            placeholder="Describe the craftsmanship, the inspiration, and why this piece is special..."
                            value={formData.fullDescription}
                            onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                        />
                    </div>
                </div>

                {/* Materials & Tags */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 space-y-6">
                        <div className="flex items-center space-x-2">
                            <Layers size={16} className="text-primary" />
                            <h4 className="text-sm font-bold text-dark uppercase tracking-widest">Materials</h4>
                        </div>
                        <div className="flex flex-wrap gap-2 min-h-[40px]">
                            {formData.materials.map(m => (
                                <span key={m} className="px-3 py-1 bg-background rounded-full text-[10px] font-bold text-dark flex items-center">
                                    {m}
                                    <button type="button" onClick={() => removeItem('material', m)} className="ml-2 hover:text-red-500"><X size={12} /></button>
                                </span>
                            ))}
                        </div>
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                className="input-field h-10 px-4 text-xs"
                                placeholder="Add material..."
                                value={newMaterial}
                                onChange={(e) => setNewMaterial(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItem('material'))}
                            />
                            <button type="button" onClick={() => handleAddItem('material')} className="p-2 bg-primary text-white rounded-xl"><Plus size={18} /></button>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 space-y-6">
                        <div className="flex items-center space-x-2">
                            <Tag size={16} className="text-primary" />
                            <h4 className="text-sm font-bold text-dark uppercase tracking-widest">Tags</h4>
                        </div>
                        <div className="flex flex-wrap gap-2 min-h-[40px]">
                            {formData.tags.map(t => (
                                <span key={t} className="px-3 py-1 bg-primary/10 rounded-full text-[10px] font-bold text-primary flex items-center">
                                    #{t}
                                    <button type="button" onClick={() => removeItem('tag', t)} className="ml-2 hover:text-red-500"><X size={12} /></button>
                                </span>
                            ))}
                        </div>
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                className="input-field h-10 px-4 text-xs"
                                placeholder="Add keyword..."
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItem('tag'))}
                            />
                            <button type="button" onClick={() => handleAddItem('tag')} className="p-2 bg-primary text-white rounded-xl"><Plus size={18} /></button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Visuals & Meta */}
            <div className="space-y-8">

                {/* Gallery */}
                <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 space-y-6">
                    <h3 className="text-lg font-heading font-bold text-dark">Visual Backdrop</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <AnimatePresence>
                            {images.map((img, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    className="aspect-square rounded-2xl overflow-hidden relative group border border-gray-50 bg-background"
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(idx)}
                                        className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-md rounded-lg text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    {idx === 0 && (
                                        <div className="absolute bottom-0 inset-x-0 bg-primary/80 backdrop-blur-sm text-white text-[8px] font-bold uppercase tracking-widest text-center py-1">
                                            Cover
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        <button
                            type="button"
                            disabled={uploading}
                            onClick={() => fileInputRef.current.click()}
                            className="aspect-square rounded-2xl border-2 border-dashed border-primary/20 bg-primary/5 flex flex-col items-center justify-center text-primary hover:bg-primary/10 transition-colors"
                        >
                            {uploading ? (
                                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Upload size={24} />
                                    <span className="text-[10px] font-bold uppercase tracking-wider mt-2">Upload</span>
                                </>
                            )}
                        </button>
                    </div>
                    <input
                        type="file"
                        multiple
                        hidden
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                    />
                    <p className="text-[10px] text-light italic text-center">First image will be the primary shop photo.</p>
                </div>

                {/* Tech Specs */}
                <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 space-y-6">
                    <h3 className="text-lg font-heading font-bold text-dark">Technicalities</h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-light pl-4">Dimensions</label>
                            <input
                                type="text"
                                className="input-field h-12 text-sm"
                                placeholder="e.g. 5x5x2 inches"
                                value={formData.dimensions}
                                onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-light pl-4">Care Instructions</label>
                            <textarea
                                rows={4}
                                className="input-field p-4 text-sm resize-none"
                                placeholder="How to keep this piece beautiful..."
                                value={formData.careInstructions}
                                onChange={(e) => setFormData({ ...formData, careInstructions: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-4 sticky top-24">
                    <button
                        type="submit"
                        disabled={loading || uploading}
                        className="w-full btn-primary h-16 flex items-center justify-center space-x-3 text-lg shadow-xl shadow-primary/20"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <Save size={20} />
                                <span>{isEdit ? 'Update Treasure' : 'List Treasure'}</span>
                            </>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="w-full flex items-center justify-center space-x-2 py-4 text-light font-bold text-sm hover:text-dark transition-colors"
                    >
                        <ArrowLeft size={16} />
                        <span>Go Back</span>
                    </button>
                </div>
            </div>
        </form>
    );
};

export default ProductForm;
