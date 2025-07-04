import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import axios from '../utils/axiosWithRefresh';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to get cart key for current user
  const getCartKey = () => (user ? `cart_${user._id || user.email}` : 'cart_guest');

  // Load cart from localStorage for current user on mount or when user changes
  useEffect(() => {
    const cartKey = getCartKey();
    const storedCart = localStorage.getItem(cartKey);
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    } else {
      setCart([]);
    }
    setLoading(false);
    // eslint-disable-next-line
  }, [user && (user._id || user.email)]);

  // Save cart to localStorage for current user whenever it changes
  useEffect(() => {
    if (!loading) {
      const cartKey = getCartKey();
      localStorage.setItem(cartKey, JSON.stringify(cart));
    }
    // eslint-disable-next-line
  }, [cart, loading, user && (user._id || user.email)]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) {
        return prev.map(item =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item._id !== productId));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartCount, loading }}>
      {children}
    </CartContext.Provider>
  );
}; 