import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE from '../config/api';
import AddProductModal from '../components/AddProductModal';
import AppNavbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Plus, Package, ShoppingCart, Users } from 'lucide-react';

const AdminDashboard = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [stats, setStats] = useState({ products: 0, orders: 0, users: 0 });
    const [showAddModal, setShowAddModal] = useState(false);

    const fetchData = () => {
        // Fetch Products
        axios.get(`${API_BASE}/products`)
            .then(res => {
                const data = res.data.data || res.data || [];
                setProducts(data);
            })
            .catch(err => console.error("Error fetching products:", err));

        // Fetch Stats
        axios.get(`${API_BASE}/dashboard/stats`)
            .then(res => {
                setStats(res.data);
            })
            .catch(err => console.error("Error fetching stats:", err));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleProductClick = (product) => {
        navigate(`/admin/product/edit/${product.id}`);
    };

    return (
        <div className="page">
            <AppNavbar />
            <Container className="py-5">
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <h1 className="fw-bold">Admin Dashboard</h1>
                    <div className="d-flex gap-2">
                        <Button
                            variant="primary"
                            className="d-flex align-items-center gap-2"
                            onClick={() => setShowAddModal(true)}
                        >
                            <Plus size={20} /> Add Product
                        </Button>
                        <Button variant="outline-danger" onClick={logout}>Logout</Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <Row className="mb-5 g-4">
                    <Col md={4}>
                        <Card className="border-0 shadow-sm text-center py-4">
                            <Card.Body>
                                <Package size={40} className="text-primary mb-3" />
                                <h3 className="fw-bold">{stats.products}</h3>
                                <p className="text-muted mb-0">Total Products</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="border-0 shadow-sm text-center py-4">
                            <Card.Body>
                                <ShoppingCart size={40} className="text-success mb-3" />
                                <h3 className="fw-bold">{stats.orders}</h3>
                                <p className="text-muted mb-0">Total Orders</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="border-0 shadow-sm text-center py-4">
                            <Card.Body>
                                <Users size={40} className="text-info mb-3" />
                                <h3 className="fw-bold">{stats.users}</h3>
                                <p className="text-muted mb-0">Total Users</p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <h2 className="fw-bold mb-4">Product Management</h2>
                <Row className="g-4">
                    {products.map(product => (
                        <Col key={product.id} lg={3} md={4} sm={6}>
                            <Card
                                className="product-card border-0 rounded-0 h-100 shadow-sm"
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleProductClick(product)}
                            >
                                <div className="product-img-wrapper" style={{ height: '250px', overflow: 'hidden' }}>
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="img-fluid product-img w-100 h-100"
                                        style={{ objectFit: 'cover' }}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://placehold.co/300x300/f8f8f8/ccc?text=Image+Not+Found';
                                        }}
                                    />
                                </div>
                                <Card.Body className="px-3 pt-3">
                                    <h5 className="fw-semibold mb-1 text-truncate">{product.name}</h5>
                                    <p className="text-muted small mb-2 text-truncate">{product.description}</p>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <p className="fw-bold fs-6 mb-0">₱{product.price}</p>
                                        <span className="badge bg-secondary">Qty: {product.quantity}</span>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <AddProductModal
                    show={showAddModal}
                    onHide={() => setShowAddModal(false)}
                    onProductAdded={fetchData}
                />
            </Container>
            <Footer />
        </div>
    );
};

export default AdminDashboard;
