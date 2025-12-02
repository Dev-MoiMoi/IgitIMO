import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';
import AppNavbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import BackButton from '../components/BackButton';
import '../styles/style.css';

export default function ProductList() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setList(data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="text-center py-5">Loading...</div>;
  }

  return (
    <div className="page">
      <AppNavbar />

      <main className="container main">
        <div className="main-header d-flex align-items-center mb-4">
          <BackButton to="/" label="Home" />
        </div>

        <div className="product-grid">
          {list.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
