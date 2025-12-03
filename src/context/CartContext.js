import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext'; // your auth context
import axios from 'axios';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth(); // check if user is logged in
  const [items, setItems] = useState([]);

  // Load cart on mount
  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        // Fetch cart from backend for logged-in users
        try {
          const response = await axios.get(`/api/cart/${user.id}`);
          setItems(response.data || []);
        } catch (err) {
          console.error('Failed to fetch cart from backend:', err);
          // fallback to localStorage
          const raw = localStorage.getItem('cart');
          setItems(raw ? JSON.parse(raw) : []);
        }
      } else {
        // Guest: use localStorage
        const raw = localStorage.getItem('cart');
        try {
          setItems(raw ? JSON.parse(raw) : []);
        } catch {
          console.error("Failed to parse cart from localStorage");
          setItems([]);
        }
      }
    };
    loadCart();
  }, [user]);

  // Persist cart in localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product, qty = 1) => {
    setItems(prev => {
      const idx = prev.findIndex(p => p.id === product.id);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: (next[idx].quantity || 1) + qty };
        return next;
      }
      return [...prev, { ...product, quantity: qty }];
    });
  };

  const removeItem = id => setItems(prev => prev.filter(p => p.id !== id));
  const clearCart = () => setItems([]);

  const totalItems = items.reduce((s, it) => s + (it.quantity || 1), 0);
  const getTotal = () => items.reduce((s, it) => s + (Number(it.price) || 0) * (it.quantity || 1), 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, totalItems, getTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
};

export default CartProvider;
