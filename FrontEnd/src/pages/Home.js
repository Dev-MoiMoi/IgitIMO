import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import AppNavbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';
import '../styles/style.css';

const ProductCard = ({ product }) => (
  <Card className="product-card border-0 rounded-0 h-100">
    <div className="product-img-wrapper">
      <img
        src={product.image}
        alt={product.name}
        className="img-fluid product-img"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://placehold.co/300x300/f8f8f8/ccc?text=Image+Not+Found';
        }}
      />
    </div>
    <Card.Body className="px-0 pt-3">
      <h5 className="fw-semibold mb-1">{product.name}</h5>
      <p className="text-muted small mb-1">{product.description}</p>
      <p className="fw-bold fs-6">₱{product.price}</p>
    </Card.Body>
  </Card>
);

const Home = () => {
  const { theme } = useTheme();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8082/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.data || []))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);



  return (
    <div className="homePage">
      <AppNavbar />

      {/* LOADING STATE */}
      {products.length === 0 ? (
        // Centers the loading text and adds vertical padding.
        <div className="loading-container">
          <p>Preparing yummy cakes for you...</p>
        </div>
      ) : (
        <>
          {/* HERO SECTION */}
          <header
            className={`heroSection ${theme === 'dark' ? 'hero-bg-dark' : 'hero-bg-light'}`}
          >
            <div className="hero-overlay"></div>
            <div className="hero-content">
              <h1>
                <span>iGit</span>
                <span>In</span>
                <span>My</span>
                <span>Oven</span>
              </h1>
              <p>"home baked happiness"</p>
              <a href="/products" className="hero-btn">
                Start Shopping
              </a>
            </div>
          </header>

          {/* FLAVORS SECTION */}
          <section className="flavor-section py-5">
            <Container fluid className="px-5">
              <Row className="g-4 align-items-center">
                <Col lg={6}>
                  <h2 className="section-title mb-2">Check our new flavors!</h2>
                  <p className="section-desc">
                    November is here! We're gladly to present you our{' '}
                    <span className="highlight">Halloween Themed</span> flavors!
                  </p>
                  <Button
                    href="/products"
                    variant="dark"
                    className="rounded-0 px-3 py-2 w-auto"
                  >
                    New Flavors
                  </Button>
                </Col>

                <Col lg={6} className="text-center">
                  <div className="flavor-img-wrapper mb-4">
                    <img
                      src={products[19]?.image}
                      alt={products[19]?.name}
                      className="img-fluid flavor-image"
                    />
                  </div>
                </Col>

                <Col lg={6} className="text-center">
                  <div className="flavor-img-wrapper">
                    <img
                      src={products[11]?.image}
                      alt={products[11]?.name}
                      className="img-fluid flavor-image"
                    />
                  </div>
                </Col>

                <Col lg={6}>
                  <h3 className="best-title mb-2">Our Best Seller!</h3>
                  <p className="best-desc">{products[11]?.description}</p>
                  <Button
                    href="/products"
                    variant="dark"
                    className="rounded-0 px-3 py-2 w-auto"
                  >
                    Start Shopping
                  </Button>
                </Col>
              </Row>
            </Container>
          </section>

          {/* PRODUCTS GRID */}
          <section className="py-5">
            <Container fluid className="px-5">
              <h2 className="display-6 fw-bold mb-4">Check these out!</h2>
              <Row className="g-4">
                <Col lg={6}>
                  {products[2] && <ProductCard product={products[2]} />}
                </Col>
                <Col lg={3}>
                  {products[6] && <ProductCard product={products[6]} />}
                </Col>
                <Col lg={3}>
                  {products[7] && <ProductCard product={products[7]} />}
                </Col>
              </Row>
            </Container>
          </section>
        </>
      )}

      <Footer />
    </div>
  );
};

export default Home;
