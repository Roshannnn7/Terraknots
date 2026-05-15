// ============================================
// TerraKnots — Utility Functions
// ============================================

/**
 * Format number as Indian currency (₹)
 */
export const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(price);
};

/**
 * Format date in Indian locale
 */
export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};

/**
 * Format date with time
 */
export const formatDateTime = (date) => {
    return new Date(date).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

/**
 * Format relative time (3 days ago)
 */
export const formatRelativeTime = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor(diff / 60000);
    if (days > 30) return formatDate(date);
    if (days >= 1) return `${days}d ago`;
    if (hours >= 1) return `${hours}h ago`;
    if (minutes >= 1) return `${minutes}m ago`;
    return 'Just now';
};

/**
 * Calculate discount percentage
 */
export const calculateDiscount = (price, salePrice) => {
    if (!salePrice || salePrice >= price) return 0;
    return Math.round(((price - salePrice) / price) * 100);
};

/**
 * Truncate long text with ellipsis
 */
export const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
};

/**
 * Get tailwind classes for order status
 */
export const getStatusInfo = (status) => {
    const statuses = {
        placed: { label: 'Order Placed', color: 'bg-blue-100 text-blue-700', icon: '📦' },
        confirmed: { label: 'Confirmed', color: 'bg-amber-100 text-amber-700', icon: '✅' },
        processing: { label: 'Processing', color: 'bg-orange-100 text-orange-700', icon: '🔄' },
        packed: { label: 'Packed', color: 'bg-purple-100 text-purple-700', icon: '📦' },
        shipped: { label: 'Shipped', color: 'bg-indigo-100 text-indigo-700', icon: '🚚' },
        delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700', icon: '🎉' },
        cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: '❌' },
        paid: { label: 'Paid', color: 'bg-green-100 text-green-700', icon: '💳' },
        pending: { label: 'Pending', color: 'bg-gray-100 text-gray-700', icon: '⏳' },
        failed: { label: 'Failed', color: 'bg-red-100 text-red-700', icon: '❌' },
        refunded: { label: 'Refunded', color: 'bg-purple-100 text-purple-700', icon: '↩️' },
    };
    return statuses[status?.toLowerCase()] || { label: status, color: 'bg-gray-100 text-gray-700', icon: '❓' };
};

/**
 * Generate WhatsApp link for a product
 */
export const getWhatsAppProductLink = (product, phone = '919999999999') => {
    const message = `Hi! I'm interested in *${product.name}* (₹${product.salePrice || product.price}) from TerraKnots.`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};

/**
 * Copy text to clipboard with feedback
 */
export const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        // Fallback
        const el = document.createElement('textarea');
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        return true;
    }
};

/**
 * Get a unique placeholder image URL by seed
 */
export const getPlaceholderImage = (seed, width = 400, height = 500) => {
    return `https://picsum.photos/seed/${seed}/${width}/${height}`;
};

/**
 * Slugify a string for URLs
 */
export const slugify = (text) => {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim();
};

/**
 * Debounce function
 */
export const debounce = (fn, delay) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
};

/**
 * Get initials from name
 */
export const getInitials = (name = '') => {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
};

/**
 * Check if image URL is valid
 */
export const isValidImageUrl = (url) => {
    if (!url) return false;
    return url.startsWith('http') || url.startsWith('/');
};

/**
 * Get cart items count (total quantity)
 */
export const getCartQuantity = (cart) => {
    return cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
};

/**
 * Build rating breakdown (5 stars → 2 stars usage)
 */
export const getRatingBreakdown = (reviews = []) => {
    const total = reviews.length;
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => { if (breakdown[r.rating] !== undefined) breakdown[r.rating]++; });
    Object.keys(breakdown).forEach((k) => {
        breakdown[k] = total ? Math.round((breakdown[k] / total) * 100) : 0;
    });
    return breakdown;
};

/**
 * Get the effective display price
 */
export const getEffectivePrice = (product) => {
    return product.salePrice && product.salePrice < product.price
        ? product.salePrice
        : product.price;
};

/**
 * Check if item is in stock
 */
export const isInStock = (product) => product.stock > 0;

/**
 * Smooth scroll to element
 */
export const smoothScrollTo = (elementId) => {
    const el = document.getElementById(elementId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};
