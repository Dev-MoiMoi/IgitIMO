import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext'; // your auth context
import axios from 'axios';
import API_BASE from '../config/api';

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
          const response = await axios.get(`${API_BASE}/cart/${user.id}`);
          setItems(response.data.cart || []);
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

  const addItem = async (product, qty = 1) => {
    if (user) {
      try {
        console.log("CartContext: Current User:", user);
        const payload = {
          user_id: user.id,
          product_id: product.id,
          quantity: qty
        };
        console.log("CartContext: Sending payload:", payload);

        const res = await axios.post(`${API_BASE}/cart/add`, payload);

        const newItem = res.data;

        setItems(prev => {
          // Check if we need to replace an existing item or add new
          const idx = prev.findIndex(p => p.id === newItem.id);
          if (idx > -1) {
            const next = [...prev];
            next[idx] = newItem;
            return next;
          }
          return [...prev, newItem];
        });
        // alert("Item added to cart!"); // Optional feedback
        console.log("CartContext: Item added successfully");
        return true;
      } catch (err) {
        console.error("CartContext: Failed to add item to cart:", err);
        const msg = err.response?.data?.message || err.message || "Failed to add item to cart. Please try again.";
        const detail = err.response?.data?.error ? `\nDetails: ${err.response.data.error}` : "";
        alert(`Error: ${msg}${detail}`);
        return false;
      }
    } else {
      setItems(prev => {
        // Check if item already exists (by product.id)
        const idx = prev.findIndex(p => p.product?.id === product.id || p.id === product.id);

        if (idx > -1) {
          const next = [...prev];
          next[idx] = { ...next[idx], quantity: (next[idx].quantity || 1) + qty };
          return next;
        }

        // New item: mimic backend structure
        return [...prev, {
          id: Date.now(), // Temporary ID for guest
          product_id: product.id,
          quantity: qty,
          product: product
        }];
      });
    }
  };

  const removeItem = id => setItems(prev => prev.filter(p => p.id !== id));
  const clearCart = () => setItems([]);

  const totalItems = items.reduce((s, it) => s + (it.quantity || 1), 0);
  const getTotal = () => items.reduce((s, it) => s + (Number(it.price) || 0) * (it.quantity || 1), 0);

  const updateItem = (id, quantity) => {
    setItems(prev => prev.map(item => (item.id === id ? { ...item, quantity } : item)));
  };

  const fetchCart = async () => {
    if (user) {
      try {
        const response = await axios.get(`${API_BASE}/cart/${user.id}`);
        setItems(response.data.cart || []);
      } catch (err) {
        console.error('Failed to fetch cart from backend:', err);
      }
    }
  };

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateItem, clearCart, totalItems, getTotal, fetchCart }}>
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
