import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Badge, Button } from 'react-bootstrap';
import axios from 'axios';
import API_BASE from '../config/api';
import AppNavbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackButton from '../components/BackButton';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // We need the user ID. Let's assume it's stored in localStorage or we fetch it.
    // For now, let's try to get it from localStorage if AuthContext doesn't provide it directly.
    const user = JSON.parse(localStorage.getItem('user'));

    const fetchOrders = async () => {
        if (!user || !user.id) return;
        try {
            const res = await axios.get(`${API_BASE}/orders/${user.id}`);
            setOrders(res.data.data || res.data || []);
        } catch (err) {
            console.error("Error fetching orders:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.id) {
            fetchOrders();
        } else {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleOrderReceived = async (orderId) => {
        if (!window.confirm("Are you sure you have received this order?")) return;

        try {
            await axios.patch(`${API_BASE}/orders/${orderId}/status`, { status: 'completed' });
            // Update local state
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'completed' } : o));
            alert("Order marked as completed!");
        } catch (err) {
            console.error("Failed to update order status:", err);
            alert("Failed to update order status. Please try again.");
        }
    };

    return (
        <div className="page">
            <AppNavbar />
            {/* Ensures the container has a minimum height to push the footer down. */}
            <Container className="py-5 min-vh-60">
                <div className="mb-4">
                    <BackButton to="/" label="" />
                    <h2 className="fw-bold mt-3">My Order History</h2>
                </div>

                {loading ? (
                    <p className="text-center">Loading orders...</p>
                ) : orders.length === 0 ? (
                    <div className="text-center py-5">
                        <p className="text-muted mb-3">You haven't placed any orders yet.</p>
                        <Button href="/products" variant="primary">Start Shopping</Button>
                    </div>
                ) : (
                    <div className="d-flex flex-column gap-4">
                        {orders.map(order => (
                            <Card key={order.id} className="border-0 shadow-sm">
                                <Card.Header className="bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                                    <div>
                                        <span className="fw-bold me-2">Order #{order.id}</span>
                                        <span className="text-muted small">{new Date(order.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-3">
                                        <Badge bg={order.status === 'completed' ? 'success' : 'warning'}>
                                            {order.status || 'Pending'}
                                        </Badge>
                                        {order.status !== 'completed' && (
                                            <Button
                                                variant="outline-success"
                                                size="sm"
                                                onClick={() => handleOrderReceived(order.id)}
                                            >
                                                Order Received
                                            </Button>
                                        )}
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <Table responsive borderless className="mb-0">
                                        <thead>
                                            <tr className="text-muted small">
                                                <th>Product</th>
                                                <th className="text-center">Qty</th>
                                                <th className="text-end">Price</th>
                                                <th className="text-end">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.items && order.items.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td>{item.product?.name || 'Unknown Product'}</td>
                                                    <td className="text-center">{item.quantity}</td>
                                                    <td className="text-end">₱{parseFloat(item.price_each).toFixed(2)}</td>
                                                    <td className="text-end fw-bold">₱{(item.quantity * item.price_each).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="border-top">
                                            <tr>
                                                <td colSpan="3" className="text-end fw-bold">Grand Total:</td>
                                                <td className="text-end fw-bold fs-5 text-primary">₱{parseFloat(order.total).toFixed(2)}</td>
                                            </tr>
                                        </tfoot>
                                    </Table>
                                </Card.Body>
                            </Card>
                        ))}
                    </div>
                )}
            </Container>
        </div>
    );
};

export default OrderHistory;
