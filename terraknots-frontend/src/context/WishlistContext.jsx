'use client';

import { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import api from '@/lib/api';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const loadWishlist = async () => {
            if (isAuthenticated) {
                try {
                    const { data } = await api.get('/wishlist');
                    setWishlist(data.wishlist.products);
                } catch (error) {
                    console.error('Error loading wishlist:', error);
                }
            } else {
                const localWishlist = localStorage.getItem('terra_wishlist');
                if (localWishlist) {
                    setWishlist(JSON.parse(localWishlist));
                }
            }
            setLoading(false);
        };
        loadWishlist();
    }, [isAuthenticated]);

    useEffect(() => {
        if (!isAuthenticated) {
            localStorage.setItem('terra_wishlist', JSON.stringify(wishlist));
        }
    }, [wishlist, isAuthenticated]);

    const addToWishlist = async (product) => {
        if (isAuthenticated) {
            try {
                const { data } = await api.post(`/wishlist/${product._id}`);
                setWishlist(data.wishlist.products);
            } catch (error) {
                throw error;
            }
        } else {
            if (!wishlist.find(p => p._id === product._id)) {
                setWishlist([...wishlist, product]);
            }
        }
    };

    const removeFromWishlist = async (productId) => {
        if (isAuthenticated) {
            try {
                const { data } = await api.delete(`/wishlist/${productId}`);
                setWishlist(data.wishlist.products);
            } catch (error) {
                throw error;
            }
        } else {
            setWishlist(wishlist.filter(p => p._id !== productId));
        }
    };

    const isInWishlist = (productId) => {
        return !!wishlist.find(p => p._id === productId);
    };

    const toggleWishlist = async (product) => {
        if (isInWishlist(product._id)) {
            await removeFromWishlist(product._id);
        } else {
            await addToWishlist(product);
        }
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlist,
                loading,
                addToWishlist,
                removeFromWishlist,
                isInWishlist,
                isWishlisted: isInWishlist,
                toggleWishlist,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);
