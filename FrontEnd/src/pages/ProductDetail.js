import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import AppNavbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackButton from '../components/BackButton';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import LoginModal from '../components/LoginModal';
import axios from 'axios';
import API_BASE from '../config/api';
import '../styles/style.css';

const ProductDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, userRole } = useAuth();
  const { addItem } = useCart();

  const [product, setProduct] = useState(location.state?.product || null);
  const [allProducts, setAllProducts] = useState([]);
  const [added, setAdded] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  // 🔥 NEW
  const [loadingAdd, setLoadingAdd] = useState(false);

  useEffect(() => {
    if (!product) {
      axios.get(`http://localhost:8082/api/products/${id}`)
        .then(res => {
          const prod = res.data?.data || res.data || null;
          setProduct(prod);
        })
        .catch(err => console.error(err));
    }

    axios.get(`http://localhost:8082/api/products`)
      .then(res => {
        const productsArray = Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];
        setAllProducts(productsArray);
      })
      .catch(err => console.error(err));
  }, [id, product]);

  const allRelated = useMemo(() => {
    if (!Array.isArray(allProducts)) return [];
    return allProducts.filter(p => p.id !== product?.id);
  }, [allProducts, product]);

  const [startIndex, setStartIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (!allRelated.length) return;
    let timeout;
    const interval = setInterval(() => {
      setFade(false);
      timeout = setTimeout(() => {
        setStartIndex(prev => (prev + 1) % allRelated.length);
        setFade(true);
      }, 1000);
    }, 6000);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [allRelated.length]);

  const visibleProducts =
    allRelated.length >= 3
      ? [
        allRelated[startIndex],
        allRelated[(startIndex + 1) % allRelated.length],
        allRelated[(startIndex + 2) % allRelated.length]
      ]
      : allRelated;

  // ✅ UPDATED: Add to cart with loading indicator
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      setShowLogin(true);
      return;
    }

    if (!user || !product) {
      console.error("Cannot add to cart: User or Product is missing");
      return;
    }

    setLoadingAdd(true); // 🔥 Show loading spinner

    try {
      console.log("ProductDetail: Calling addItem...");
      const success = await addItem(product); // Use context to add item (handles API call)
      console.log("ProductDetail: addItem returned:", success);
      if (success) {
        console.log("ProductDetail: Setting added to true");
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
      } else {
        console.log("ProductDetail: addItem failed (returned false)");
      }
    } catch (err) {
      console.error("ProductDetail: Add to cart failed with error:", err);
    } finally {
      setLoadingAdd(false); // 🔥 Hide loading spinner
    }
  };

  return (
    <div className="product-detail-page">
      <AppNavbar />
      <Container fluid className="px-5 mt-4">
        <div className="cart-header"><BackButton label="Back" /></div>
      </Container>

      <Container fluid className="px-5 mt-4">
        <Row className="g-5 align-items-start">
          <Col lg={5}>
            <div className="product-detail-img-wrapper">
              <img
                src={product?.image}
                alt={product?.name}
                className="img-fluid product-detail-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/600x400/f8f8f8/ccc?text=Image+Not+Found';
                }}
              />
            </div>
          </Col>

          <Col lg={7}>
            <h2 className="product-name">{product?.name}</h2>
            <p className="stock-text">Stocks: {product?.quantity ?? 'N/A'}</p>
            <p className="product-price">
              {typeof product?.price === 'number'
                ? product.price.toFixed(2)
                : Number(product?.price || 0).toFixed(2)}
            </p>
            <p className="product-desc">{product?.description}</p>

            <div className="d-flex gap-2 mt-3">

              {/* ✅ UPDATED BUTTON WITH SPINNER */}
              {userRole === 'admin' ? (
                <Button
                  className="rounded-0 px-4 py-2 btn-dark"
                  onClick={() => navigate(`/admin/product/edit/${product.id}`)}
                >
                  Edit Product
                </Button>
              ) : (
                <>
                  <Button
                    className="rounded-0 px-4 py-2 custom-cart-btn"
                    onClick={handleAddToCart}
                    disabled={loadingAdd || !product || product?.quantity <= 0}
                  >
                    {loadingAdd ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Adding...
                      </>
                    ) : added ? (
                      "Added!"
                    ) : product?.quantity <= 0 ? (
                      "Out of Stock"
                    ) : (
                      "Add to cart"
                    )}
                  </Button>
                </>
              )}
            </div>

            {added && <div className="mt-3 text-success">Added to cart</div>}
          </Col>
        </Row>
      </Container>

      <Container fluid className="px-5 mt-5 mb-5">
        <h4 className="fw-semibold mb-4">You Might Like</h4>
        <Row className={`g-4 fade-related ${fade ? 'fade-in' : 'fade-out'}`}>
          {visibleProducts.map(prod => (
            <Col lg={4} md={6} key={prod.id}>
              <Card
                className="border-0 rounded-0 related-card cursor-pointer"
                onClick={() => {
                  navigate(`/product/${prod.id}`, { state: { product: prod } });
                  window.scrollTo(0, 0);
                }}
              >
                <div className="related-img-wrapper">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="img-fluid related-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/600x400/f8f8f8/ccc?text=Image+Not+Found';
                    }}
                  />
                </div>
                <Card.Body className="px-0 pt-3">
                  <h6 className="fw-semibold mb-1">{prod.name}</h6>
                  <p className="text-muted small mb-1">{prod.description}</p>
                  <p className="fw-bold fs-6">
                    {typeof prod.price === 'number'
                      ? prod.price.toFixed(2)
                      : Number(prod.price || 0).toFixed(2)}
                  </p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <Footer />

      <LoginModal
        show={showLogin}
        role="user"
        onBack={() => setShowLogin(false)}
      />
    </div>
  );
};

export default ProductDetail;
