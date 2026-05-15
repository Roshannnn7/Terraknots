'use client';

import { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import api from '@/lib/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, isAuthenticated } = useAuth();

    // Load cart on mount
    useEffect(() => {
        const loadCart = async () => {
            if (isAuthenticated) {
                try {
                    const { data } = await api.get('/cart');
                    setCart(data.cart.items);
                } catch (error) {
                    console.error('Error loading cart:', error);
                }
            } else {
                const localCart = localStorage.getItem('terra_cart');
                if (localCart) {
                    setCart(JSON.parse(localCart));
                }
            }
            setLoading(false);
        };
        loadCart();
    }, [isAuthenticated]);

    // Sync cart with local storage for guests
    useEffect(() => {
        if (!isAuthenticated) {
            localStorage.setItem('terra_cart', JSON.stringify(cart));
        }
    }, [cart, isAuthenticated]);

    const addToCart = async (product, quantity = 1) => {
        if (isAuthenticated) {
            try {
                const { data } = await api.post('/cart', { productId: product._id, quantity });
                setCart(data.cart.items);
            } catch (error) {
                throw error;
            }
        } else {
            const existingItem = cart.find(item => item.product._id === product._id);
            if (existingItem) {
                setCart(cart.map(item =>
                    item.product._id === product._id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                ));
            } else {
                setCart([...cart, { product, quantity }]);
            }
        }
    };

    const updateQuantity = async (itemId, quantity) => {
        if (isAuthenticated) {
            try {
                const { data } = await api.put(`/cart/${itemId}`, { quantity });
                setCart(data.cart.items);
            } catch (error) {
                throw error;
            }
        } else {
            if (quantity <= 0) {
                removeFromCart(itemId);
            } else {
                setCart(cart.map(item =>
                    item.product._id === itemId
                        ? { ...item, quantity }
                        : item
                ));
            }
        }
    };

    const removeFromCart = async (itemId) => {
        if (isAuthenticated) {
            try {
                const { data } = await api.delete(`/cart/${itemId}`);
                setCart(data.cart.items);
            } catch (error) {
                throw error;
            }
        } else {
            setCart(cart.filter(item => item.product._id !== itemId));
        }
    };

    const clearCart = async () => {
        if (isAuthenticated) {
            try {
                await api.delete('/cart');
                setCart([]);
            } catch (error) {
                console.error('Error clearing cart:', error);
            }
        } else {
            setCart([]);
            localStorage.removeItem('terra_cart');
        }
    };

    const cartTotal = cart.reduce((total, item) => {
        const price = item.product.salePrice || item.product.price;
        return total + price * item.quantity;
    }, 0);

    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

    // Helper function to retrieve the total price (used by components like CartDrawer)
    const getCartTotal = () => cartTotal;

    return (
        <CartContext.Provider
            value={{
                cart,
                loading,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
                cartTotal,
                cartCount,
                getCartTotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
