export const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(price);
};

export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};

export const calculateDiscount = (price, salePrice) => {
    if (!salePrice || salePrice >= price) return 0;
    return Math.round(((price - salePrice) / price) * 100);
};

export const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
};

export const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
        case 'placed': return 'bg-blue-100 text-blue-700';
        case 'confirmed': return 'bg-yellow-100 text-yellow-700';
        case 'packed': return 'bg-orange-100 text-orange-700';
        case 'shipped': return 'bg-indigo-100 text-indigo-700';
        case 'delivered': return 'bg-green-100 text-green-700';
        case 'cancelled': return 'bg-red-100 text-red-700';
        case 'paid': return 'bg-green-100 text-green-700';
        case 'pending': return 'bg-yellow-100 text-yellow-700';
        case 'failed': return 'bg-red-100 text-red-700';
        default: return 'bg-gray-100 text-gray-700';
    }
};
