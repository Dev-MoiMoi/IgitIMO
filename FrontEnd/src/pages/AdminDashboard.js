import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import AddProductModal from '../components/AddProductModal';
import EditProductModal from '../components/EditProductModal';
import AppNavbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { Plus, Package, ShoppingCart, Users } from 'lucide-react';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0 });
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Base URL for images reachable from browser
  const BASE_IMAGE_URL = 'http://localhost:8082';

  const fetchData = () => {
    // Fetch products
    fetch(`${BASE_IMAGE_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        const products = data.data || data || [];

        setProducts(products);
      })
      .catch(err => console.error('Error fetching products:', err));

    // Fetch dashboard stats
    fetch(`${BASE_IMAGE_URL}/api/dashboard/stats`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Error fetching stats:', err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleProductClick = (product) => {
    setSelectedProduct(product); // Open edit modal
  };

  const handleCloseEditModal = () => {
    setSelectedProduct(null); // Close edit modal
  };

  return (
    <div className="page">
      <AppNavbar />
      <Container className="py-5">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <h1 className="fw-bold">Dashboard</h1>
          <Button
            variant="primary"
            className="d-flex align-items-center gap-2"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={20} /> Add Product
          </Button>
        </div>

        {/* Stats Cards */}
        <Row className="mb-5 g-4">
          <Col md={4}>
            <div className="card border-0 shadow-sm text-center py-4">
              <div className="card-body">
                <Package size={40} className="text-primary mb-3" />
                <h3 className="fw-bold">{stats.products}</h3>
                <p className="text-muted mb-0">Total Products</p>
              </div>
            </div>
          </Col>
          <Col md={4}>
            <div className="card border-0 shadow-sm text-center py-4">
              <div className="card-body">
                <ShoppingCart size={40} className="text-success mb-3" />
                <h3 className="fw-bold">{stats.orders}</h3>
                <p className="text-muted mb-0">Total Orders</p>
              </div>
            </div>
          </Col>
          <Col md={4}>
            <div className="card border-0 shadow-sm text-center py-4">
              <div className="card-body">
                <Users size={40} className="text-info mb-3" />
                <h3 className="fw-bold">{stats.users}</h3>
                <p className="text-muted mb-0">Total Users</p>
              </div>
            </div>
          </Col>
        </Row>

        {/* Products Grid */}
        <h2 className="fw-bold mb-4">Product Management</h2>
        <Row className="g-4">
          {products.map(product => (
            <Col key={product.id} lg={3} md={4} sm={6}>
              <ProductCard
                product={product}
                showQuantity={true}       // show quantity badge for admin
                onClick={() => handleProductClick(product)} // open edit modal
                className="h-100"
              />
            </Col>
          ))}
        </Row>

        {/* Add Product Modal */}
        <AddProductModal
          show={showAddModal}
          onHide={() => setShowAddModal(false)}
          onProductAdded={fetchData}
        />

        {/* Edit Product Modal */}
        {selectedProduct && (
          <EditProductModal
            show={true}
            onHide={handleCloseEditModal}
            product={selectedProduct}
            onProductUpdated={fetchData}
          />
        )}
      </Container>
      
    </div>
  );
};

export default AdminDashboard;
