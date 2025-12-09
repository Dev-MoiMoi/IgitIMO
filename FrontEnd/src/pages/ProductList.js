import React, { useState, useEffect } from 'react';

import AppNavbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import BackButton from '../components/BackButton';
import '../styles/style.css';

export default function ProductList() {

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default'); // default, price-asc, price-desc

  useEffect(() => {
    fetch('http://localhost:8082/api/products')
      .then((res) => res.json())
      .then((data) => {
        setList(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, []);

  // Filter Logic
  const filteredList = list
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'price-asc') return parseFloat(a.price) - parseFloat(b.price);
      if (sortBy === 'price-desc') return parseFloat(b.price) - parseFloat(a.price);
      return 0;
    });

  return (
    <div className="page">
      <AppNavbar />

      <main className="container main">
        <div className="main-header d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
          <BackButton to="/" label="" />

          <div className="d-flex gap-3 w-100 w-md-auto">
            <select
              className="form-select sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            // Limits the width of the sort dropdown.
            >
              <option value="default">Sort by</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>

            <input
              type="text"
              className="form-control search-input"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            // Limits the width of the search input.
            />
          </div>
        </div>

        {/* LOADING INDICATOR */}
        {loading ? (
          // Centers the loading text and adds vertical padding.
          <div className="loading-container">
            <p>Gathering the goods...</p>
          </div>
        ) : (
          <>
            {filteredList.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted">Wait where did they go?</p>
              </div>
            ) : (
              <div className="product-grid">
                {filteredList.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
