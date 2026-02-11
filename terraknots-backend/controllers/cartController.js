const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res, next) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }

        // Filter out any items where product no longer exists
        cart.items = cart.items.filter(item => item.product !== null);
        await cart.save();

        res.status(200).json({
            success: true,
            cart,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
exports.addToCart = async (req, res, next) => {
    try {
        const { productId, quantity = 1 } = req.body;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient stock',
            });
        }

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
        }

        // Check if product already in cart
        const existingItem = cart.items.find(
            item => item.product.toString() === productId
        );

        if (existingItem) {
            if (existingItem.quantity + quantity > product.stock) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot add more than available stock',
                });
            }
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        await cart.save();
        await cart.populate('items.product');

        res.status(200).json({
            success: true,
            message: 'Item added to cart',
            cart,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
exports.updateCartItem = async (req, res, next) => {
    try {
        const { quantity } = req.body;

        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found',
            });
        }

        const item = cart.items.id(req.params.itemId);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found in cart',
            });
        }

        if (quantity <= 0) {
            cart.items.pull(req.params.itemId);
        } else {
            if (quantity > item.product.stock) {
                return res.status(400).json({
                    success: false,
                    message: 'Insufficient stock',
                });
            }
            item.quantity = quantity;
        }

        await cart.save();

        res.status(200).json({
            success: true,
            message: 'Cart updated successfully',
            cart,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
exports.removeFromCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found',
            });
        }

        cart.items.pull(req.params.itemId);
        await cart.save();
        await cart.populate('items.product');

        res.status(200).json({
            success: true,
            message: 'Item removed from cart',
            cart,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found',
            });
        }

        cart.items = [];
        await cart.save();

        res.status(200).json({
            success: true,
            message: 'Cart cleared successfully',
            cart,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Sync cart from local storage
// @route   POST /api/cart/sync
// @access  Private
exports.syncCart = async (req, res, next) => {
    try {
        const { items } = req.body;

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
        }

        // Merge local cart with server cart
        for (const localItem of items) {
            const product = await Product.findById(localItem.productId);

            if (product && product.stock > 0) {
                const existingItem = cart.items.find(
                    item => item.product.toString() === localItem.productId
                );

                if (existingItem) {
                    existingItem.quantity = Math.min(
                        existingItem.quantity + localItem.quantity,
                        product.stock
                    );
                } else {
                    cart.items.push({
                        product: localItem.productId,
                        quantity: Math.min(localItem.quantity, product.stock),
                    });
                }
            }
        }

        await cart.save();
        await cart.populate('items.product');

        res.status(200).json({
            success: true,
            message: 'Cart synced successfully',
            cart,
        });
    } catch (error) {
        next(error);
    }
};
