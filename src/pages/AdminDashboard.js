import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const { logout } = useAuth();

    return (
        <Container className="py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Admin Dashboard</h1>
                <Button variant="outline-danger" onClick={logout}>Logout</Button>
            </div>

            <Row className="g-4">
                <Col md={4}>
                    <Card className="h-100 shadow-sm">
                        <Card.Body>
                            <Card.Title>Total Orders</Card.Title>
                            <Card.Text className="display-4">124</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="h-100 shadow-sm">
                        <Card.Body>
                            <Card.Title>Total Products</Card.Title>
                            <Card.Text className="display-4">45</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="h-100 shadow-sm">
                        <Card.Body>
                            <Card.Title>Total Customers</Card.Title>
                            <Card.Text className="display-4">89</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mt-5">
                <Col>
                    <h3>Recent Activity</h3>
                    <p className="text-muted">No recent activity to show.</p>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminDashboard;
