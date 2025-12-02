import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import AppNavbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackButton from '../components/BackButton';
import { getProductById, getProducts } from '../services/api';
import { useCart } from '../context/CartContext';
import '../styles/style.css';

const ProductDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [product, setProduct] = useState(location.state?.product || null);
  const [allRelated, setAllRelated] = useState([]);
  const [loading, setLoading] = useState(!product);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!product) {
          const fetchedProduct = await getProductById(id);
          setProduct(fetchedProduct);
        }

        // Fetch related products (all products for now, filtered later)
        const allProducts = await getProducts();
        if (allProducts) {
          setAllRelated(allProducts.filter(p => String(p.id) !== String(id)));
        }

      } catch (error) {
        console.error("Failed to fetch product data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, product]);

  const [startIndex, setStartIndex] = useState(0);
  const [fade, setFade] = useState(true);

  // Fade + auto-rotate related items
  useEffect(() => {
    if (allRelated.length === 0) return;

    let timeout;
    const interval = setInterval(() => {
      setFade(false);
      timeout = setTimeout(() => {
        setStartIndex((prev) => (prev + 1) % allRelated.length);
        setFade(true);
      }, 1000);
    }, 6000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [allRelated.length]);

  const visibleProducts = allRelated.length > 0 ? [
    allRelated[startIndex],
    allRelated[(startIndex + 1) % allRelated.length],
    allRelated[(startIndex + 2) % allRelated.length],
  ] : [];

  if (loading) {
    return <div className="text-center py-5">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <AppNavbar />
        <Container fluid className="px-5 mt-4">
          <p>Product not found.</p>
          <Button onClick={() => navigate(-1)} variant="link">
            Go back
          </Button>
        </Container>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="product-detail-page">
      <AppNavbar />

      <Container fluid className="px-5 mt-4">
        <div className="cart-header">
          <BackButton label="Back" />
        </div>
      </Container>

      {/* Product Info */}
      <Container fluid className="px-5 mt-4">
        <Row className="g-5 align-items-start">
          <Col lg={5}>
            <div className="product-detail-img-wrapper">
              <img
                src={product.image}
                alt={product.name}
                className="img-fluid product-detail-img"
              />
            </div>
          </Col>

          <Col lg={7}>
            <h2 className="product-name">{product.name}</h2>
            <p className="stock-text">Stocks: {product.stock ?? 'N/A'}</p>
            <p className="product-price">{product.price.toFixed(2)}</p>
            <p className="product-desc">{product.description}</p>

            <div className="d-flex gap-2 mt-3">
              <Button
                className="rounded-0 px-4 py-2 custom-cart-btn"
                onClick={handleAddToCart}
              >
                Add to cart
              </Button>

              <Button className="rounded-0 px-4 py-2 custom-wishlist-btn">
                Add to wishlist
              </Button>
            </div>

            {added && <div className="mt-3 text-success">Added to cart</div>}
          </Col>
        </Row>
      </Container>

      {/* Related Products */}
      <Container fluid className="px-5 mt-5 mb-5">
        <h4 className="fw-semibold mb-4">You Might Like</h4>
        <Row className={`g-4 fade-related ${fade ? 'fade-in' : 'fade-out'}`}>
          {visibleProducts.map((prod) => (
            <Col lg={4} md={6} key={prod.id}>
              <Card className="border-0 rounded-0 related-card">
                <div className="related-img-wrapper">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="img-fluid related-img"
                  />
                </div>
                <Card.Body className="px-0 pt-3">
                  <h6 className="fw-semibold mb-1">{prod.name}</h6>
                  <p className="text-muted small mb-1">{prod.description}</p>
                  <p className="fw-bold fs-6">{prod.price.toFixed(2)}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <Footer />
    </div>
  );
};

export default ProductDetail;
