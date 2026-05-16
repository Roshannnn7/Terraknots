'use client';

import { useState, useEffect } from 'react';
import { PRICE_RANGES, MATERIALS } from '@/lib/constants';
import api from '@/lib/api';

const Filters = ({ filters, setFilters }) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await api.get('/categories');
                setCategories(['All', ...data.categories.map(c => c.name)]);
            } catch (error) {
                console.error('Failed to fetch categories');
            }
        };
        fetchCategories();
    }, []);

    const handleCategoryChange = (cat) => {
        setFilters({ ...filters, category: cat });
    };

    const handlePriceChange = (range) => {
        const [min, max] = range.split('-');
        setFilters({ ...filters, minPrice: min, maxPrice: max });
    };

    const handleMaterialChange = (material) => {
        const newMaterials = filters.materials.includes(material)
            ? filters.materials.filter(m => m !== material)
            : [...filters.materials, material];
        setFilters({ ...filters, materials: newMaterials });
    };

    return (
        <div className="space-y-10">
            {/* Categories */}
            <div className="space-y-4">
                <h4 className="text-lg font-heading font-bold text-dark border-b border-gray-100 pb-2">Categories</h4>
                <div className="flex flex-col space-y-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => handleCategoryChange(cat)}
                            className={`text-left text-sm py-1 transition-colors ${filters.category === cat ? 'text-primary font-bold' : 'text-light hover:text-primary'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Price Ranges */}
            <div className="space-y-4">
                <h4 className="text-lg font-heading font-bold text-dark border-b border-gray-100 pb-2">Price Range</h4>
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
                <h4 className="text-lg font-heading font-bold text-dark border-b border-gray-100 pb-2">Materials</h4>
                <div className="flex flex-wrap gap-2">
                    {MATERIALS.map(material => (
                        <button
                            key={material}
                            onClick={() => handleMaterialChange(material)}
                            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${filters.materials.includes(material)
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
                <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={filters.inStock}
                        onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
                    />
                    <span className="text-sm font-bold text-dark italic">Only In Stock Items</span>
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
                    sortBy: 'newest'
                })}
                className="w-full py-3 text-xs font-bold uppercase tracking-widest text-light border border-dashed border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
                Clear All Filters
            </button>
        </div>
    );
};

export default Filters;
