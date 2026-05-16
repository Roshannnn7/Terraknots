'use client';

import { useState, useEffect } from 'react';
import { 
    Image as ImageIcon, 
    Search, 
    Trash2, 
    Copy, 
    ExternalLink, 
    Grid, 
    List as ListIcon,
    Upload,
    Clock
} from 'lucide-react';
import { safeGet, safeDelete } from '@/lib/apiClient';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const MediaLibraryPage = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [selectedImage, setSelectedImage] = useState(null);

    const fetchImages = async () => {
        setLoading(true);
        try {
            const data = await safeGet('/upload/all', { images: [] });
            setImages(data?.images || data?.data || data || []);
        } catch (error) {
            console.error('Failed to load media library', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const deleteImage = async (public_id) => {
        if (!window.confirm('Are you sure? This will permanently delete the image from Cloudinary.')) return;
        const result = await safeDelete('/upload/image', { data: { public_id } });
        if (result.success) {
            toast.success('Image deleted');
            setImages(prev => prev.filter(img => img.public_id !== public_id));
            if (selectedImage?.public_id === public_id) setSelectedImage(null);
        } else {
            toast.error(result.error || 'Failed to delete image');
        }
    };

    const copyToClipboard = (text) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        toast.success('Link copied to clipboard! 📋');
    };

    const filteredImages = (images || []).filter(img => 
        (img?.public_id || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatSize = (bytes) => {
        if (!bytes || bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-dark">Media Library</h1>
                    <p className="text-light italic font-accent text-lg">Your visual treasure chest.</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex bg-white rounded-2xl p-1 border border-gray-100 shadow-sm">
                        <button 
                            onClick={() => setViewMode('grid')}
                            className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-[#C4A882] text-white shadow-md' : 'text-light hover:text-[#C4A882]'}`}
                        >
                            <Grid size={18} />
                        </button>
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-[#C4A882] text-white shadow-md' : 'text-light hover:text-[#C4A882]'}`}
                        >
                            <ListIcon size={18} />
                        </button>
                    </div>
                    <button 
                        onClick={fetchImages}
                        className="h-14 px-8 bg-[#C4A882] text-white rounded-2xl font-bold flex items-center space-x-3 shadow-xl shadow-[#C4A882]/20 hover:scale-[1.02] transition-all"
                    >
                        <Upload size={20} />
                        <span>Refresh Assets</span>
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-light" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search media by name..." 
                        className="w-full bg-background border-none rounded-2xl pl-14 pr-6 h-12 font-medium text-dark focus:ring-2 focus:ring-[#C4A882]/20 transition-all outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center space-x-4">
                    <p className="text-xs font-bold text-light uppercase tracking-widest">{filteredImages.length} Assets</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Media Grid/List */}
                <div className={`lg:col-span-3 ${viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}`}>
                    {loading ? (
                        [...Array(8)].map((_, i) => (
                            <div key={i} className={`bg-white rounded-3xl border border-gray-100 animate-pulse ${viewMode === 'grid' ? 'aspect-square' : 'h-20'}`} />
                        ))
                    ) : (
                        <AnimatePresence>
                            {filteredImages.map((img, idx) => (
                                <motion.div
                                    key={img?.public_id || idx}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    onClick={() => setSelectedImage(img)}
                                    className={`group relative bg-white rounded-[2rem] border-2 cursor-pointer transition-all overflow-hidden ${selectedImage?.public_id === img?.public_id ? 'border-[#C4A882] shadow-xl ring-4 ring-[#C4A882]/5' : 'border-transparent hover:border-[#C4A882]/20 shadow-sm'}`}
                                >
                                    {viewMode === 'grid' ? (
                                        <>
                                            <div className="aspect-square relative overflow-hidden bg-background">
                                                <img src={img?.url || 'https://via.placeholder.com/300'} alt={img?.public_id} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                                                    <button onClick={(e) => { e.stopPropagation(); copyToClipboard(img?.url); }} className="p-2 bg-white rounded-xl text-dark hover:bg-[#C4A882] hover:text-white transition-all"><Copy size={16} /></button>
                                                    <a href={img?.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="p-2 bg-white rounded-xl text-dark hover:bg-[#C4A882] hover:text-white transition-all"><ExternalLink size={16} /></a>
                                                </div>
                                            </div>
                                            <div className="p-3">
                                                <p className="text-[10px] font-bold text-dark truncate">{img?.public_id?.split('/').pop() || 'Untitled'}</p>
                                                <p className="text-[9px] text-light uppercase tracking-tighter">{formatSize(img?.size)} • {img?.format || 'IMG'}</p>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex items-center p-4 space-x-4">
                                            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-background">
                                                <img src={img?.url || 'https://via.placeholder.com/150'} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-dark truncate">{img?.public_id || 'Untitled'}</p>
                                                <p className="text-[10px] text-light uppercase font-bold tracking-widest">{formatSize(img?.size)}</p>
                                            </div>
                                            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={(e) => { e.stopPropagation(); copyToClipboard(img?.url); }} className="p-2 bg-background rounded-xl text-light hover:text-[#C4A882] transition-all"><Copy size={16} /></button>
                                                <button onClick={(e) => { e.stopPropagation(); deleteImage(img?.public_id); }} className="p-2 bg-background rounded-xl text-light hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>

                {/* Info Sidebar */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 bg-white rounded-[3rem] border border-gray-100 shadow-sm p-8 space-y-8">
                        {selectedImage ? (
                            <div className="space-y-6">
                                <div className="aspect-square rounded-[2rem] overflow-hidden bg-background border border-gray-50">
                                    <img src={selectedImage.url} alt="" className="w-full h-full object-contain" />
                                </div>
                                
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-[10px] font-bold text-light uppercase tracking-widest mb-1">Public ID</h4>
                                        <p className="text-sm font-bold text-dark break-all">{selectedImage?.public_id || 'N/A'}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="text-[10px] font-bold text-light uppercase tracking-widest mb-1">Format</h4>
                                            <p className="text-sm font-bold text-dark uppercase">{selectedImage?.format || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] font-bold text-light uppercase tracking-widest mb-1">Size</h4>
                                            <p className="text-sm font-bold text-dark">{formatSize(selectedImage?.size)}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-bold text-light uppercase tracking-widest mb-1">Created At</h4>
                                        <p className="text-xs font-bold text-dark">
                                          {selectedImage?.created_at ? new Date(selectedImage.created_at).toLocaleString() : 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-6 space-y-3">
                                    <button 
                                        onClick={() => copyToClipboard(selectedImage.url)}
                                        className="w-full h-12 rounded-2xl bg-[#C4A882]/10 text-[#C4A882] font-bold text-sm hover:bg-[#C4A882] hover:text-white transition-all flex items-center justify-center space-x-2"
                                    >
                                        <Copy size={16} />
                                        <span>Copy Link</span>
                                    </button>
                                    <button 
                                        onClick={() => deleteImage(selectedImage.public_id)}
                                        className="w-full h-12 rounded-2xl bg-red-50 text-red-500 font-bold text-sm hover:bg-red-500 hover:text-white transition-all flex items-center justify-center space-x-2"
                                    >
                                        <Trash2 size={16} />
                                        <span>Delete Asset</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <ImageIcon className="mx-auto text-light opacity-10 mb-4" size={64} />
                                <p className="text-xs font-bold text-light uppercase tracking-widest">Select an asset to view details</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MediaLibraryPage;
