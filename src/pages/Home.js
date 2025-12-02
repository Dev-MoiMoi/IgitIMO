import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import AppNavbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/style.css';
import { getProducts } from '../services/api';

const ProductCard = ({ product }) => (
  <Card className="product-card border-0 rounded-0 h-100">
    <div className="product-img-wrapper">
      <img
        src={product.image}
        alt={product.name}
        className="img-fluid product-img"
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
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
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

  // Ensure we have enough products before rendering specific indices
  const flavor1 = products[19] || {};
  const flavor2 = products[11] || {};
  const bestSeller = products[11] || {};
  const featured = [products[2], products[6], products[7]].filter(Boolean);

  return (
    <div className="homePage">
      <AppNavbar />

      {/* HERO SECTION */}
      <header
        className="heroSection"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL + '/cover-img.png'})`,
        }}
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
            Shop Cake
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

            {/* First flavor image */}
            <Col lg={6} className="text-center">
              <div className="flavor-img-wrapper mb-4">
                {flavor1.image && (
                  <img
                    src={flavor1.image}
                    alt={flavor1.name}
                    className="img-fluid flavor-image"
                  />
                )}
              </div>
            </Col>

            {/* Second flavor image */}
            <Col lg={6} className="text-center">
              <div className="flavor-img-wrapper">
                {flavor2.image && (
                  <img
                    src={flavor2.image}
                    alt={flavor2.name}
                    className="img-fluid flavor-image"
                  />
                )}
              </div>
            </Col>

            <Col lg={6}>
              <h3 className="best-title mb-2">Our Best Seller!</h3>
              <p className="best-desc">{bestSeller.description}</p>
              <Button
                href="/products"
                variant="dark"
                className="rounded-0 px-3 py-2 w-auto"
              >
                Shop Cake
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* PRODUCTS GRID */}
      <section className="py-5">
        <Container fluid className="px-5">
          <h2 className="display-6 fw-bold mb-4">Cakes Cakes Cakes</h2>
          <Row className="g-4">
            {featured.map((product) => (
              <Col lg={product.id === 2 ? 6 : 3} key={product.id}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* FOOTER COMPONENT */}
      <Footer />
    </div>
  );
};

export default Home;
