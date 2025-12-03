import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppNavbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import BackButton from '../components/BackButton';
import '../styles/style.css';

export default function ProductList() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true); // ← NEW

  useEffect(() => {
    fetch('http://localhost:8082/api/products')
      .then((res) => res.json())
      .then((data) => {
        setList(data.data || []);
        setLoading(false); // ← FINISHED LOADING
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="page">
      <AppNavbar />

      <main className="container main">
        <div className="main-header d-flex align-items-center mb-4">
          <BackButton to="/" label="Home" />
        </div>

        {/* LOADING INDICATOR */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p>Loading products...</p>
          </div>
        ) : (
          <div className="product-grid">
            {list.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
