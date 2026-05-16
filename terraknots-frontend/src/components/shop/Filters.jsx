'use client';

import { useState, useEffect } from 'react';
import { PRICE_RANGES, MATERIALS } from '@/lib/constants';
import api from '@/lib/api';

const Filters = ({ filters, setFilters }) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/categories');
                setCategories(res.data.data || []);
            } catch (error) {
                console.error('Failed to fetch categories');
            }
        };
        fetchCategories();
    }, []);

    const handleCategoryChange = (catName) => {
        setFilters({ ...filters, category: catName, page: 1 });
    };

    const handlePriceChange = (range) => {
        const [min, max] = range.split('-');
        setFilters({ ...filters, minPrice: min, maxPrice: max, page: 1 });
    };

    const handleMaterialChange = (material) => {
        const newMaterials = filters.materials.includes(material)
            ? filters.materials.filter(m => m !== material)
            : [...filters.materials, material];
        setFilters({ ...filters, materials: newMaterials, page: 1 });
    };

    return (
        <div className="space-y-10">
            {/* Categories */}
            <div className="space-y-4">
                <h4 className="text-lg font-heading font-bold text-dark border-b border-gray-100 pb-2 uppercase tracking-widest text-[10px]">Collections</h4>
                <div className="flex flex-col space-y-2">
                    <button
                        onClick={() => handleCategoryChange('All')}
                        className={`text-left text-sm py-1 transition-colors ${filters.category === 'All' ? 'text-primary font-bold' : 'text-light hover:text-primary'}`}
                    >
                        All Collections
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.name}
                            onClick={() => handleCategoryChange(cat.name)}
                            className={`text-left text-sm py-1 transition-colors flex items-center justify-between group ${filters.category === cat.name ? 'text-primary font-bold' : 'text-light hover:text-primary'}`}
                        >
                            <span>{cat.name}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${filters.category === cat.name ? 'bg-primary text-white' : 'bg-gray-100 text-light group-hover:bg-primary/10 group-hover:text-primary'}`}>
                                {cat.productCount || 0}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Price Ranges */}
            <div className="space-y-4">
                <h4 className="text-lg font-heading font-bold text-dark border-b border-gray-100 pb-2 uppercase tracking-widest text-[10px]">Price Range</h4>
                <div className="flex flex-col space-y-2">
                    {PRICE_RANGES.map(range => (
                        <label key={range.value} className="flex items-center space-x-3 cursor-pointer group">
                            <input
                                type="radio"
                                name="price"
                                className="w-4 h-4 border-gray-300 text-primary focus:ring-primary"
                                checked={`${filters.minPrice}-${filters.maxPrice}` === range.value}
                                onChange={() => handlePriceChange(range.value)}
                            />
                            <span className="text-sm text-light group-hover:text-primary transition-colors">{range.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Materials */}
            <div className="space-y-4">
                <h4 className="text-lg font-heading font-bold text-dark border-b border-gray-100 pb-2 uppercase tracking-widest text-[10px]">Materials</h4>
                <div className="flex flex-wrap gap-2">
                    {MATERIALS.map(material => (
                        <button
                            key={material}
                            onClick={() => handleMaterialChange(material)}
                            className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-tighter transition-all ${filters.materials.includes(material)
                                    ? 'bg-primary text-white shadow-sm'
                                    : 'bg-white text-light border border-gray-200 hover:border-primary'
                                }`}
                        >
                            {material}
                        </button>
                    ))}
                </div>
            </div>

            {/* Active Stock */}
            <div className="space-y-4">
                <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={filters.inStock}
                        onChange={(e) => setFilters({ ...filters, inStock: e.target.checked, page: 1 })}
                    />
                    <span className="text-sm font-bold text-dark italic group-hover:text-primary transition-colors">Only In Stock Items</span>
                </label>
            </div>

            {/* Reset Button */}
            <button
                onClick={() => setFilters({
                    category: 'All',
                    minPrice: '',
                    maxPrice: '',
                    materials: [],
                    inStock: false,
                    search: '',
                    sortBy: 'newest',
                    page: 1
                })}
                className="w-full py-4 text-[10px] font-bold uppercase tracking-widest text-light border border-dashed border-gray-300 rounded-2xl hover:bg-gray-50 transition-colors"
            >
                Clear All Filters
            </button>
        </div>
    );
};

export default Filters;
