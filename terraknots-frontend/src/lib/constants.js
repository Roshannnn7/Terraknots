export const CATEGORIES = ['All', 'Crochet', 'Resin', 'Clay', 'Decor', 'Accessories'];

export const SORT_OPTIONS = [
    { label: 'Newest', value: 'newest' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Popular', value: 'popular' },
];

export const PRICE_RANGES = [
    { label: 'Under ₹199', value: '0-199' },
    { label: '₹199 - ₹499', value: '199-499' },
    { label: '₹499 - ₹999', value: '499-999' },
    { label: 'Above ₹999', value: '999-100000' },
];

export const MATERIALS = ['Yarn', 'Resin', 'Clay', 'Metal', 'Wood', 'Mixed'];

export const ORDER_STATUSES = [
    'placed', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'
];

export const CONTACT_SUBJECTS = [
    'General', 'Order Issue', 'Custom Order', 'Feedback', 'Other'
];

export const CUSTOM_ORDER_BUDGETS = [
    'Under ₹299', '₹299-₹599', '₹599-₹999', 'Above ₹999'
];
