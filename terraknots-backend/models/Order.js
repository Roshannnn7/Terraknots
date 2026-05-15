const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1'],
    },
});

const shippingAddressSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    addressLine1: {
        type: String,
        required: true,
    },
    addressLine2: String,
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    pincode: {
        type: String,
        required: true,
    },
    landmark: String,
});

const guestInfoSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
});

const statusHistorySchema = new mongoose.Schema({
    status: String,
    date: {
        type: Date,
        default: Date.now,
    },
    note: String,
});

const orderSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            unique: true,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        guestInfo: guestInfoSchema,
        items: {
            type: [orderItemSchema],
            required: true,
            validate: {
                validator: function (v) {
                    return v && v.length > 0;
                },
                message: 'Order must have at least one item',
            },
        },
        shippingAddress: {
            type: shippingAddressSchema,
            required: true,
        },
        paymentMethod: {
            type: String,
            required: true,
            enum: ['razorpay', 'upi_manual', 'cod'],
        },
        paymentStatus: {
            type: String,
            required: true,
            enum: ['pending', 'paid', 'failed'],
            default: 'pending',
        },
        razorpayOrderId: String,
        razorpayPaymentId: String,
        manualPaymentTransactionId: String,
        orderStatus: {
            type: String,
            required: true,
            enum: ['placed', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'],
            default: 'placed',
        },
        trackingId: String,
        courierName: String,
        subtotal: {
            type: Number,
            required: true,
            min: [0, 'Subtotal cannot be negative'],
        },
        shippingCharge: {
            type: Number,
            required: true,
            default: 0,
            min: [0, 'Shipping charge cannot be negative'],
        },
        discount: {
            type: Number,
            default: 0,
            min: [0, 'Discount cannot be negative'],
        },
        couponCode: String,
        codCharge: {
            type: Number,
            default: 0,
            min: [0, 'COD charge cannot be negative'],
        },
        totalAmount: {
            type: Number,
            required: true,
            min: [0, 'Total amount cannot be negative'],
        },
        orderNotes: String,
        cancelReason: String,
        statusHistory: [statusHistorySchema],
    },
    {
        timestamps: true,
    }
);

// Generate unique order ID before validation
orderSchema.pre('validate', async function (next) {
    if (!this.orderId) {
        const count = await mongoose.model('Order').countDocuments();
        this.orderId = `TK-${String(count + 10001).padStart(5, '0')}`;
    }
    next();
});

// Add status to history when order status changes
orderSchema.pre('save', function (next) {
    if (this.isModified('orderStatus')) {
        this.statusHistory.push({
            status: this.orderStatus,
            date: new Date(),
        });
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);
