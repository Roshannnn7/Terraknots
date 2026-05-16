'use client';

import { useState, useRef, useEffect } from 'react';
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
import ImageUploader from './ImageUploader';

const ProductForm = ({ initialData = null, isEdit = false }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState(initialData?.images || []);
    const [categories, setCategories] = useState([]);
    const [fetchingCats, setFetchingCats] = useState(false);

    useEffect(() => {
        const fetchCats = async () => {
            setFetchingCats(true);
            try {
                const { data } = await api.get('/categories');
                setCategories(data.categories);
            } catch (error) {
                console.error('Failed to load categories');
            } finally {
                setFetchingCats(false);
            }
        };
        fetchCats();
    }, []);

    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        category: initialData?.category?._id || initialData?.category || '',
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
        isNewArrival: initialData?.isNewArrival || false,
        isBestseller: initialData?.isBestseller || false,
        metaTitle: initialData?.metaTitle || '',
        metaDescription: initialData?.metaDescription || '',
    });

    const [newMaterial, setNewMaterial] = useState('');
    const [newTag, setNewTag] = useState('');

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
                                    required
                                    className="input-field h-14 appearance-none"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
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
                                <span className="text-sm font-bold text-dark group-hover:text-primary transition-colors">Show in Featured</span>
                            </label>
                            <label className="flex items-center space-x-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 rounded-lg border-gray-200 text-primary focus:ring-primary/20"
                                    checked={formData.isBestseller}
                                    onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                                />
                                <span className="text-sm font-bold text-dark group-hover:text-primary transition-colors">Bestseller Badge</span>
                            </label>
                            <label className="flex items-center space-x-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 rounded-lg border-gray-200 text-primary focus:ring-primary/20"
                                    checked={formData.isNewArrival}
                                    onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                                />
                                <span className="text-sm font-bold text-dark group-hover:text-primary transition-colors">New Arrival Badge</span>
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
                <ImageUploader images={images} setImages={setImages} />

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

                {/* SEO Meta */}
                <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 space-y-6">
                    <h3 className="text-lg font-heading font-bold text-dark">SEO & Search</h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-light pl-4">Meta Title</label>
                            <input
                                type="text"
                                className="input-field h-12 text-sm"
                                placeholder="Leave blank to use product name"
                                value={formData.metaTitle}
                                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-light pl-4">Meta Description</label>
                            <textarea
                                rows={3}
                                className="input-field p-4 text-sm resize-none"
                                placeholder="Short description for Google search results..."
                                value={formData.metaDescription}
                                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-4 sticky top-24">
                    <button
                        type="submit"
                        disabled={loading}
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
