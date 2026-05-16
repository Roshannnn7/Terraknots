'use client';

import { useState, useEffect } from 'react';
import { 
    Plus, 
    Search, 
    Filter, 
    MoreVertical, 
    Edit, 
    Trash2, 
    GripVertical, 
    Tag, 
    Eye, 
    EyeOff,
    Check,
    X,
    ImageIcon,
    Upload
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const AdminCategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
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

    const handleOpenModal = (cat = null) => {
        if (cat) {
            setEditingCategory(cat);
            setFormData({
                name: cat.name,
                slug: cat.slug || '',
                description: cat.description || '',
                icon: cat.icon || '📦',
                color: cat.color || '#C4A882',
                image: cat.image || '',
                displayOrder: cat.displayOrder || 0,
                isActive: cat.isActive !== undefined ? cat.isActive : true
            });
        } else {
            setEditingCategory(null);
            setFormData({
                name: '',
                slug: '',
                description: '',
                icon: '📦',
                color: '#C4A882',
                image: '',
                displayOrder: categories.length + 1,
                isActive: true
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingCategory(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await api.put(`/categories/${editingCategory._id}`, formData);
                toast.success('Category updated!');
            } else {
                await api.post('/categories', formData);
                toast.success('Category created!');
            }
            fetchCategories();
            handleCloseModal();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Action failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;
        try {
            await api.delete(`/categories/${id}`);
            toast.success('Category deleted');
            fetchCategories();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Delete failed');
        }
    };

    const toggleStatus = async (cat) => {
        try {
            await api.put(`/categories/${cat._id}`, { isActive: !cat.isActive });
            toast.success(`Category ${!cat.isActive ? 'activated' : 'deactivated'}`);
            fetchCategories();
        } catch (error) {
            toast.error('Status update failed');
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formDataImg = new FormData();
        formDataImg.append('image', file);

        try {
            toast.info('Uploading image...');
            const { data } = await api.post('/upload/image', formDataImg, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFormData({ ...formData, image: data.url });
            toast.success('Image uploaded!');
        } catch (error) {
            toast.error('Upload failed');
        }
    };

    const filteredCategories = categories.filter(cat => {
        const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' || (filter === 'active' ? cat.isActive : !cat.isActive);
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-dark">Category Management</h1>
                    <p className="text-light italic font-accent text-lg">Organize your treasures into beautiful collections.</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="btn-primary h-14 px-8 flex items-center space-x-3 shadow-xl shadow-primary/20"
                >
                    <Plus size={20} />
                    <span>Add New Category</span>
                </button>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-light" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search categories..." 
                        className="input-field h-12 pl-14"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center space-x-2 w-full md:w-auto">
                    <Filter className="text-light" size={18} />
                    <select 
                        className="input-field h-12 w-full md:w-48"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">All Categories</option>
                        <option value="active">Active Only</option>
                        <option value="inactive">Inactive Only</option>
                    </select>
                </div>
            </div>

            {/* Categories List */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <div key={i} className="h-48 bg-white rounded-[2.5rem] animate-pulse border border-gray-100" />)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredCategories.map((cat, idx) => (
                            <motion.div
                                key={cat._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all p-6 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="flex space-x-2">
                                        <button onClick={() => handleOpenModal(cat)} className="p-2 bg-white shadow-md rounded-xl text-primary hover:bg-primary hover:text-white transition-all">
                                            <Edit size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(cat._id)} className="p-2 bg-white shadow-md rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-6">
                                    <div 
                                        className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-inner shrink-0"
                                        style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                                    >
                                        {cat.icon || '📦'}
                                    </div>
                                    <div className="space-y-2 flex-1 min-w-0">
                                        <div className="flex items-center space-x-2">
                                            <h3 className="text-xl font-bold text-dark truncate">{cat.name}</h3>
                                            <div 
                                                onClick={() => toggleStatus(cat)}
                                                className={`w-3 h-3 rounded-full cursor-pointer shadow-sm ${cat.isActive ? 'bg-green-500 ring-4 ring-green-50' : 'bg-gray-300 ring-4 ring-gray-50'}`}
                                                title={cat.isActive ? 'Active' : 'Inactive'}
                                            />
                                        </div>
                                        <p className="text-xs text-light line-clamp-2 italic">"{cat.description || 'No description provided.'}"</p>
                                        <div className="flex items-center space-x-4 pt-2">
                                            <div className="flex items-center space-x-1 text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-full">
                                                <Tag size={12} />
                                                <span>{cat.productCount || 0} Products</span>
                                            </div>
                                            <div className="text-[10px] font-bold text-light uppercase tracking-widest">
                                                Order: {cat.displayOrder}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {cat.image && (
                                    <div className="mt-6 aspect-[21/9] rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                                        <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Empty State */}
            {!loading && filteredCategories.length === 0 && (
                <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-gray-200">
                    <Tag className="mx-auto text-light opacity-30 mb-4" size={64} />
                    <h3 className="text-xl font-bold text-dark">No categories found</h3>
                    <p className="text-light">Start by creating a new collection for your treasures.</p>
                    <button onClick={() => handleOpenModal()} className="mt-6 btn-primary px-8 py-3 rounded-xl">Add First Category</button>
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            onClick={handleCloseModal}
                            className="absolute inset-0 bg-dark/20 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-primary text-white">
                                <div>
                                    <h2 className="text-2xl font-heading font-bold">{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
                                    <p className="text-xs opacity-80 uppercase tracking-widest font-bold">Category Details</p>
                                </div>
                                <button onClick={handleCloseModal} className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-10 max-h-[70vh] overflow-y-auto no-scrollbar space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">Category Name *</label>
                                        <input 
                                            required
                                            className="input-field h-14"
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            placeholder="e.g. Crochet Bows"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">Slug (Auto-generated)</label>
                                        <input 
                                            className="input-field h-14 bg-gray-50 italic text-light"
                                            value={formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                                            readOnly
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">Description</label>
                                    <textarea 
                                        className="input-field p-6 min-h-[100px] resize-none"
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        placeholder="Describe this collection..."
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">Icon (Emoji)</label>
                                        <input 
                                            className="input-field h-14 text-center text-2xl"
                                            value={formData.icon}
                                            onChange={(e) => setFormData({...formData, icon: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">Theme Color</label>
                                        <div className="flex items-center space-x-3 h-14 bg-background rounded-2xl px-4 border border-gray-100">
                                            <input 
                                                type="color"
                                                className="w-8 h-8 rounded-lg border-none cursor-pointer"
                                                value={formData.color}
                                                onChange={(e) => setFormData({...formData, color: e.target.value})}
                                            />
                                            <span className="text-xs font-bold font-mono">{formData.color}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">Display Order</label>
                                        <input 
                                            type="number"
                                            className="input-field h-14"
                                            value={formData.displayOrder}
                                            onChange={(e) => setFormData({...formData, displayOrder: Number(e.target.value)})}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-light pl-4">Category Visual</label>
                                    <div className="aspect-[21/9] rounded-3xl border-2 border-dashed border-gray-100 bg-background flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-all relative overflow-hidden group">
                                        {formData.image ? (
                                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-center">
                                                <Upload size={32} className="text-light mx-auto mb-2" />
                                                <p className="text-[10px] font-bold text-light uppercase">Upload Collection Banner</p>
                                            </div>
                                        )}
                                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />
                                    </div>
                                </div>

                                <div className="p-6 bg-background rounded-[2rem] flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <Eye className="text-primary" size={20} />
                                        <span className="text-sm font-bold text-dark">Active Status</span>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox" className="sr-only peer"
                                            checked={formData.isActive}
                                            onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>

                                <div className="flex space-x-4 pt-4 pb-4">
                                    <button 
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="flex-1 h-14 rounded-2xl bg-gray-50 text-light font-bold hover:bg-gray-100 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        className="flex-[2] h-14 rounded-2xl bg-primary text-white font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
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
};

export default AdminCategoriesPage;
