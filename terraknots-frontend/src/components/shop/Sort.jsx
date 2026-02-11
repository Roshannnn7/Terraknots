'use client';

import { SORT_OPTIONS } from '@/lib/constants';

const Sort = ({ value, onChange }) => {
    return (
        <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-light uppercase tracking-wider hidden sm:block">Sort By:</span>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="bg-white border-0 text-sm font-medium text-dark focus:ring-0 cursor-pointer outline-none"
            >
                {SORT_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Sort;
