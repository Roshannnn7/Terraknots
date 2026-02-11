const validator = require('validator');

// Validate email
exports.validateEmail = (email) => {
    return validator.isEmail(email);
};

// Validate phone number (Indian format)
exports.validatePhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/[^\d]/g, ''));
};

// Validate pincode (Indian format)
exports.validatePincode = (pincode) => {
    const pincodeRegex = /^[1-9][0-9]{5}$/;
    return pincodeRegex.test(pincode);
};

// Sanitize input to prevent XSS
exports.sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return input.trim().replace(/[<>]/g, '');
};

// Validate password strength
exports.validatePassword = (password) => {
    if (password.length < 6) {
        return { valid: false, message: 'Password must be at least 6 characters long' };
    }
    return { valid: true };
};

// Validate product data
exports.validateProduct = (data) => {
    const errors = [];

    if (!data.name || data.name.trim().length === 0) {
        errors.push('Product name is required');
    }

    if (!data.shortDescription || data.shortDescription.trim().length === 0) {
        errors.push('Short description is required');
    }

    if (!data.fullDescription || data.fullDescription.trim().length === 0) {
        errors.push('Full description is required');
    }

    if (!data.category) {
        errors.push('Category is required');
    }

    if (!data.price || data.price <= 0) {
        errors.push('Valid price is required');
    }

    if (!data.images || !Array.isArray(data.images) || data.images.length === 0) {
        errors.push('At least one image is required');
    }

    return {
        valid: errors.length === 0,
        errors,
    };
};

// Validate order data
exports.validateOrder = (data) => {
    const errors = [];

    if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
        errors.push('Order must have at least one item');
    }

    if (!data.shippingAddress) {
        errors.push('Shipping address is required');
    } else {
        if (!data.shippingAddress.fullName) errors.push('Full name is required');
        if (!data.shippingAddress.phone) errors.push('Phone number is required');
        if (!data.shippingAddress.addressLine1) errors.push('Address is required');
        if (!data.shippingAddress.city) errors.push('City is required');
        if (!data.shippingAddress.state) errors.push('State is required');
        if (!data.shippingAddress.pincode) errors.push('Pincode is required');

        if (data.shippingAddress.pincode && !exports.validatePincode(data.shippingAddress.pincode)) {
            errors.push('Invalid pincode format');
        }
    }

    if (!data.paymentMethod) {
        errors.push('Payment method is required');
    }

    return {
        valid: errors.length === 0,
        errors,
    };
};

module.exports = exports;
