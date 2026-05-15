'use client';

export default function Loader({ size = 'md' }) {
    const sizeMap = {
        sm: 'w-6 h-6 border-2',
        md: 'w-10 h-10 border-4',
        lg: 'w-16 h-16 border-4',
    };
    return (
        <div className={`${sizeMap[size] || sizeMap.md} border-primary border-t-transparent rounded-full animate-spin`} />
    );
}
