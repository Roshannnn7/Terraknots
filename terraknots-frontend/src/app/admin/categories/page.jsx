'use client';

import { useState, useEffect } from 'react';
import { 
    Tag, 
    Plus, 
    Search, 
    Edit2, 
    Trash2, 
    GripVertical, 
    Eye, 
    EyeOff,
    CheckCircle,
    XCircle,
    Image as ImageIcon,
    ChevronUp,
    ChevronDown,
    Save,
    X
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const AdminCategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        icon: '🧶',
        color: '#C4A882',
        displayOrder: 0,
        isActive: true,
        metaTitle: '',
        metaDescription: '',
        image: ''
    });

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/categories/all');
            setCategories(data.categories);
        } catch (error) {
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleOpenModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                slug: category.slug,
                description: category.description || '',
                icon: category.icon || '🧶',
                color: category.color || '#C4A882',
                displayOrder: category.displayOrder || 0,
                isActive: category.isActive !== undefined ? category.isActive : true,
                metaTitle: category.metaTitle || '',
                metaDescription: category.metaDescription || '',
                image: category.image || ''
            });
        } else {
            setEditingCategory(null);
            setFormData({
                name: '',
                slug: '',
                description: '',
                icon: '🧶',
                color: '#C4A882',
                displayOrder: categories.length,
                isActive: true,
                metaTitle: '',
                metaDescription: '',
                image: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;
        
        setFormData(prev => {
            const newData = { ...prev, [name]: val };
            if (name === 'name' && !editingCategory) {
                newData.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            }
            return newData;
        });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('image', file);

        try {
            toast.info('Uploading image...');
            const { data } = await api.post('/upload/image', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFormData(prev => ({ ...prev, image: data.url }));
            toast.success('Image uploaded!');
        } catch (error) {
            toast.error('Upload failed');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingCategory) {
                await api.put(`/categories/${editingCategory._id}`, formData);
                toast.success('Category updated successfully');
            } else {
                await api.post('/categories', formData);
                toast.success('Category created successfully');
            }
            fetchCategories();
            handleCloseModal();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save category');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this category?')) return;
        try {
            await api.delete(`/categories/${id}`);
            toast.success('Category deleted');
            fetchCategories();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete');
        }
    };

    const toggleStatus = async (category) => {
        try {
            await api.put(`/categories/${category._id}`, { isActive: !category.isActive });
            toast.success('Status updated');
            fetchCategories();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const moveOrder = async (index, direction) => {
        const newCategories = [...categories];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        
        if (targetIndex < 0 || targetIndex >= newCategories.length) return;

        const temp = newCategories[index];
        newCategories[index] = newCategories[targetIndex];
        newCategories[targetIndex] = temp;

        // Update displayOrder for all
        const updatedOrders = newCategories.map((cat, idx) => ({
            _id: cat._id,
            displayOrder: idx
        }));

        setCategories(newCategories);

        try {
            await api.put('/categories/reorder', { categories: updatedOrders });
        } catch (error) {
            toast.error('Failed to save order');
            fetchCategories();
        }
    };

    const filteredCategories = categories.filter(cat => 
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-dark">Category Management</h1>
                    <p className="text-light italic font-accent text-lg">Organize your handmade collections.</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="btn-primary h-14 px-8 flex items-center space-x-3 shadow-xl shadow-primary/20"
                >
                    <Plus size={20} />
                    <span>Add New Category</span>
                </button>
            </div>

            {/* Search & Stats */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-50">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-light" size={18} />
                    <input 
                        type="text"
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-field pl-12 h-12"
                    />
                </div>
                <div className="flex space-x-6">
                    <div className="text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-light">Total</p>
                        <p className="text-xl font-bold text-dark">{categories.length}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-light">Active</p>
                        <p className="text-xl font-bold text-success">{categories.filter(c => c.isActive).length}</p>
                    </div>
                </div>
            </div>

            {/* Category List */}
            <div className="bg-white rounded-[3rem] shadow-sm border border-gray-50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-background/50 border-b border-gray-50">
                            <tr>
                                <th className="px-8 py-6 text-left text-[10px] font-bold uppercase tracking-widest text-light">Order</th>
                                <th className="px-8 py-6 text-left text-[10px] font-bold uppercase tracking-widest text-light">Category</th>
                                <th className="px-8 py-6 text-left text-[10px] font-bold uppercase tracking-widest text-light">Slug</th>
                                <th className="px-8 py-6 text-left text-[10px] font-bold uppercase tracking-widest text-light">Products</th>
                                <th className="px-8 py-6 text-left text-[10px] font-bold uppercase tracking-widest text-light">Status</th>
                                <th className="px-8 py-6 text-right text-[10px] font-bold uppercase tracking-widest text-light">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="6" className="px-8 py-6"><div className="h-12 bg-gray-50 rounded-2xl w-full" /></td>
                                    </tr>
                                ))
                            ) : filteredCategories.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-8 py-20 text-center text-light italic">No categories found</td>
                                </tr>
                            ) : (
                                filteredCategories.map((category, index) => (
                                    <motion.tr 
                                        layout
                                        key={category._id}
                                        className="hover:bg-background/30 transition-colors group"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col space-y-1">
                                                <button 
                                                    onClick={() => moveOrder(index, 'up')}
                                                    disabled={index === 0}
                                                    className="text-light hover:text-primary disabled:opacity-0"
                                                >
                                                    <ChevronUp size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => moveOrder(index, 'down')}
                                                    disabled={index === categories.length - 1}
                                                    className="text-light hover:text-primary disabled:opacity-0"
                                                >
                                                    <ChevronDown size={16} />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center space-x-4">
                                                <div 
                                                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-gray-50"
                                                    style={{ backgroundColor: category.color + '20' }}
                                                >
                                                    {category.icon || '🧶'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-dark">{category.name}</p>
                                                    <p className="text-[10px] text-light truncate max-w-[150px]">{category.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-xs font-mono text-light bg-background px-2 py-1 rounded-md">{category.slug}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="font-bold text-dark">{category.productCount || 0}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <button 
                                                onClick={() => toggleStatus(category)}
                                                className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                                                    category.isActive 
                                                        ? 'bg-success/10 text-success' 
                                                        : 'bg-gray-100 text-light'
                                                }`}
                                            >
                                                {category.isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                                                <span>{category.isActive ? 'Active' : 'Inactive'}</span>
                                            </button>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => handleOpenModal(category)}
                                                    className="p-2 text-primary hover:bg-primary/10 rounded-xl transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(category._id)}
                                                    className="p-2 text-error hover:bg-error/10 rounded-xl transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleCloseModal}
                            className="absolute inset-0 bg-dark/60 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-4xl bg-white rounded-[3.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            {/* Modal Header */}
                            <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-heading font-bold text-dark">
                                        {editingCategory ? 'Edit Category' : 'Create New Collection'}
                                    </h2>
                                    <p className="text-sm text-light italic">Every thread matters.</p>
                                </div>
                                <button onClick={handleCloseModal} className="p-3 hover:bg-background rounded-full transition-colors text-light">
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="flex-1 overflow-y-auto p-10">
                                <form id="categoryForm" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">Category Name</label>
                                            <input 
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="e.g. Dreamy Crochet"
                                                className="input-field h-14"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">Slug (Auto-generated)</label>
                                            <input 
                                                name="slug"
                                                required
                                                value={formData.slug}
                                                onChange={handleInputChange}
                                                className="input-field h-14 font-mono text-xs"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">Description</label>
                                            <textarea 
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                rows={3}
                                                placeholder="Describe this collection..."
                                                className="input-field p-5 text-sm resize-none"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">Icon (Emoji)</label>
                                                <input 
                                                    name="icon"
                                                    value={formData.icon}
                                                    onChange={handleInputChange}
                                                    className="input-field h-14 text-center text-2xl"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">Theme Color</label>
                                                <div className="flex space-x-2">
                                                    <input 
                                                        type="color"
                                                        name="color"
                                                        value={formData.color}
                                                        onChange={handleInputChange}
                                                        className="h-14 w-14 rounded-2xl border-none p-1 cursor-pointer bg-background"
                                                    />
                                                    <input 
                                                        name="color"
                                                        value={formData.color}
                                                        onChange={handleInputChange}
                                                        className="input-field h-14 flex-1 text-center font-mono uppercase text-xs"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">Category Image</label>
                                            <div className="relative aspect-video rounded-3xl bg-background border-2 border-dashed border-gray-100 flex flex-col items-center justify-center overflow-hidden group cursor-pointer">
                                                {formData.image ? (
                                                    <>
                                                        <img src={formData.image} alt="" className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-dark/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Upload size={24} className="text-white" />
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <ImageIcon size={40} className="text-light opacity-30" />
                                                        <span className="text-[10px] font-bold text-light uppercase mt-2">Upload Image</span>
                                                    </>
                                                )}
                                                <input 
                                                    type="file" 
                                                    onChange={handleImageUpload}
                                                    className="absolute inset-0 opacity-0 cursor-pointer" 
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2 pt-4">
                                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">Search Optimization</h4>
                                            <input 
                                                name="metaTitle"
                                                value={formData.metaTitle}
                                                onChange={handleInputChange}
                                                placeholder="Meta Title"
                                                className="input-field h-12 text-xs"
                                            />
                                            <textarea 
                                                name="metaDescription"
                                                value={formData.metaDescription}
                                                onChange={handleInputChange}
                                                placeholder="Meta Description"
                                                rows={2}
                                                className="input-field p-4 text-xs resize-none"
                                            />
                                        </div>

                                        <div className="flex items-center justify-between p-6 bg-background rounded-3xl">
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-dark">Active Status</p>
                                                <p className="text-[10px] text-light">Visibility on storefront.</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    name="isActive"
                                                    className="sr-only peer"
                                                    checked={formData.isActive}
                                                    onChange={handleInputChange}
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                            </label>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            {/* Modal Footer */}
                            <div className="px-10 py-8 border-t border-gray-50 flex items-center justify-end space-x-4">
                                <button 
                                    onClick={handleCloseModal}
                                    className="px-8 py-4 font-bold text-light hover:text-dark transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    form="categoryForm"
                                    type="submit"
                                    disabled={saving}
                                    className="btn-primary px-10 h-14 flex items-center space-x-3 shadow-xl shadow-primary/20"
                                >
                                    {saving ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Save size={20} />
                                            <span>{editingCategory ? 'Update Category' : 'Create Category'}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminCategoriesPage;
