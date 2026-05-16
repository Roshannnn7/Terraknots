'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Tag, Plus, Edit, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { safeGet, safePost, safePut, safeDelete } from '@/lib/apiClient';

export default function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        icon: '📦',
        color: '#C4A882',
        image: '',
        displayOrder: 0,
        isActive: true
    });

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const data = await safeGet('/categories/all', []);
            setCategories(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to load categories:', error);
            setCategories([]);
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleOpenModal = (cat = null) => {
        if (cat) {
            setEditingCategory(cat);
            setFormData({
                name: cat.name || '',
                description: cat.description || '',
                icon: cat.icon || '📦',
                color: cat.color || '#C4A882',
                image: cat.image || '',
                displayOrder: cat.displayOrder || 0,
                isActive: cat.isActive !== false
            });
        } else {
            setEditingCategory(null);
            setFormData({
                name: '',
                description: '',
                icon: '📦',
                color: '#C4A882',
                image: '',
                displayOrder: (categories?.length || 0) + 1,
                isActive: true
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) return toast.error('Name is required');

        let result;
        if (editingCategory) {
            result = await safePut(`/categories/${editingCategory._id}`, formData);
        } else {
            result = await safePost('/categories', formData);
        }

        if (result.success) {
            toast.success(editingCategory ? 'Category updated' : 'Category created');
            setIsModalOpen(false);
            fetchCategories();
        } else {
            toast.error(result.error || 'Something went wrong');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;
        const result = await safeDelete(`/categories/${id}`);
        if (result.success) {
            toast.success('Category deleted');
            fetchCategories();
        } else {
            toast.error(result.error || 'Failed to delete');
        }
    };

    const toggleStatus = async (cat) => {
        const result = await safePut(`/categories/${cat._id}`, { isActive: !cat.isActive });
        if (result.success) {
            toast.success(`Category ${!cat.isActive ? 'activated' : 'deactivated'}`);
            fetchCategories();
        } else {
            toast.error('Failed to update status');
        }
    };

    return (
        <div className="p-8 bg-[#FBF9F7] min-h-screen">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-4xl font-heading font-bold text-dark flex items-center gap-3">
                        <Tag className="text-[#C4A882]" />
                        Category Management
                    </h1>
                    <p className="text-light italic font-accent text-lg mt-2">Organize your handmade collections</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-dark text-white px-8 h-14 rounded-2xl hover:bg-black transition-all font-bold shadow-lg shadow-dark/10 flex items-center gap-2"
                >
                    <Plus size={20} />
                    Add Category
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C4A882]"></div>
                </div>
            ) : (categories || []).length === 0 ? (
                <div className="bg-white rounded-[3rem] p-20 text-center border border-gray-100 shadow-sm">
                    <Tag size={64} className="mx-auto text-light opacity-20 mb-6" />
                    <h3 className="text-2xl font-bold text-dark mb-2">No categories yet</h3>
                    <p className="text-light mb-8">Start by creating your first product collection</p>
                    <button onClick={() => handleOpenModal()} className="px-8 py-4 bg-[#C4A882] text-white rounded-full">Create Category</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(categories || []).map((cat) => (
                        <motion.div
                            key={cat._id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all group"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div 
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner"
                                    style={{ backgroundColor: `${cat.color || '#C4A882'}20` }}
                                >
                                    {cat.icon || '📦'}
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleOpenModal(cat)}
                                        className="p-3 bg-background text-light hover:text-[#C4A882] hover:bg-[#C4A882]/10 rounded-xl transition-all"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(cat._id)}
                                        className="p-3 bg-background text-light hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-dark mb-1">{cat.name || 'Untitled'}</h3>
                                <p className="text-sm text-light line-clamp-2 min-h-[2.5rem]">{cat.description || 'No description'}</p>
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                <div className="flex items-center gap-4">
                                    <div className="text-center">
                                        <p className="text-[10px] text-light font-bold uppercase tracking-widest">Products</p>
                                        <p className="text-sm font-bold text-dark">{cat.productCount || 0}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] text-light font-bold uppercase tracking-widest">Order</p>
                                        <p className="text-sm font-bold text-dark">#{cat.displayOrder || 0}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => toggleStatus(cat)}
                                    className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                                        cat.isActive 
                                        ? 'bg-green-50 text-green-600 hover:bg-green-100' 
                                        : 'bg-red-50 text-red-500 hover:bg-red-100'
                                    }`}
                                >
                                    {cat.isActive ? 'Active' : 'Inactive'}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/20 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-background/50">
                                <div>
                                    <h2 className="text-2xl font-bold text-dark">
                                        {editingCategory ? 'Edit Category' : 'New Category'}
                                    </h2>
                                    <p className="text-xs text-light font-bold uppercase tracking-widest mt-1">Collection Details</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-full transition-all">
                                    <X size={24} className="text-light" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="col-span-2">
                                        <label className="block text-[10px] font-bold text-light uppercase tracking-widest mb-2">Category Name</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full bg-background border-none rounded-2xl px-6 h-14 font-bold text-dark focus:ring-2 focus:ring-[#C4A882]/20 transition-all outline-none"
                                            placeholder="e.g. Crochet Flowers"
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-[10px] font-bold text-light uppercase tracking-widest mb-2">Description</label>
                                        <textarea
                                            rows="3"
                                            className="w-full bg-background border-none rounded-2xl px-6 py-4 font-medium text-dark focus:ring-2 focus:ring-[#C4A882]/20 transition-all resize-none outline-none"
                                            placeholder="What makes this collection special?"
                                            value={formData.description}
                                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        ></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-light uppercase tracking-widest mb-2">Icon (Emoji)</label>
                                        <input
                                            type="text"
                                            className="w-full bg-background border-none rounded-2xl px-6 h-14 text-2xl text-center focus:ring-2 focus:ring-[#C4A882]/20 transition-all outline-none"
                                            value={formData.icon}
                                            onChange={(e) => setFormData({...formData, icon: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-light uppercase tracking-widest mb-2">Theme Color</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="color"
                                                className="w-14 h-14 rounded-2xl border-none p-0 overflow-hidden cursor-pointer bg-background"
                                                value={formData.color}
                                                onChange={(e) => setFormData({...formData, color: e.target.value})}
                                            />
                                            <input
                                                type="text"
                                                className="flex-1 bg-background border-none rounded-2xl px-4 h-14 font-mono text-sm focus:ring-2 focus:ring-[#C4A882]/20 transition-all outline-none"
                                                value={formData.color}
                                                onChange={(e) => setFormData({...formData, color: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-[10px] font-bold text-light uppercase tracking-widest mb-2">Banner Image URL</label>
                                        <input
                                            type="text"
                                            className="w-full bg-background border-none rounded-2xl px-6 h-14 font-medium text-dark focus:ring-2 focus:ring-[#C4A882]/20 transition-all outline-none"
                                            placeholder="https://..."
                                            value={formData.image}
                                            onChange={(e) => setFormData({...formData, image: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-light uppercase tracking-widest mb-2">Display Order</label>
                                        <input
                                            type="number"
                                            className="w-full bg-background border-none rounded-2xl px-6 h-14 font-bold text-dark focus:ring-2 focus:ring-[#C4A882]/20 transition-all outline-none"
                                            value={formData.displayOrder}
                                            onChange={(e) => setFormData({...formData, displayOrder: e.target.value})}
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <label className="flex items-center gap-3 cursor-pointer group mt-6">
                                            <div 
                                                onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                                                className={`w-12 h-6 rounded-full transition-all relative ${formData.isActive ? 'bg-[#C4A882]' : 'bg-gray-200'}`}
                                            >
                                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isActive ? 'left-7' : 'left-1'}`}></div>
                                            </div>
                                            <span className="text-sm font-bold text-dark">Is Active</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="pt-6 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 h-14 rounded-2xl bg-gray-50 text-light font-bold hover:bg-gray-100 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[2] h-14 rounded-2xl bg-[#C4A882] text-white font-bold shadow-lg shadow-[#C4A882]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                    >
                                        {editingCategory ? 'Update Collection' : 'Create Collection'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
