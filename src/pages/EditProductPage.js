import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Alert, Card } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE from '../config/api';
import AppNavbar from '../components/Navbar';

const EditProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        quantity: '',
        image: '', // URL for preview
        imageFile: null // File for upload
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`${API_BASE}/products/${id}`);
                const product = res.data.data || res.data;
                setFormData({
                    name: product.name || '',
                    description: product.description || '',
                    price: product.price || '',
                    quantity: product.quantity || '',
                    image: product.image || '',
                    imageFile: null
                });
            } catch (err) {
                console.error("Error fetching product:", err);
                setError("Failed to load product details.");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleChange = (e) => {
        if (e.target.name === 'imageFile') {
            const file = e.target.files[0];
            setFormData({
                ...formData,
                imageFile: file,
                // Optional: update image preview immediately
                // image: URL.createObjectURL(file) 
            });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const payload = new FormData();
            payload.append('name', formData.name);
            payload.append('description', formData.description);
            payload.append('price', parseFloat(formData.price));
            payload.append('quantity', parseInt(formData.quantity));
            payload.append('_method', 'PUT'); // Required for Laravel to handle PUT with files

            if (formData.imageFile) {
                payload.append('image', formData.imageFile);
            }

            // Use POST with _method=PUT for file uploads
            await axios.post(`${API_BASE}/products/${id}`, payload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate('/admin'); // Redirect back to dashboard
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || err.message || 'Failed to update product');
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;

        setSaving(true);
        setError('');

        try {
            await axios.delete(`${API_BASE}/products/${id}`);
            navigate('/admin');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || err.message || 'Failed to delete product');
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Container className="py-5 text-center">
                <p>Loading product details...</p>
            </Container>
        );
    }

    return (
        <>
            <AppNavbar />
            <Container className="py-5">
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        <Card className="shadow-sm border-0">
                            <Card.Body className="p-4">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h2 className="fw-bold mb-0">Edit Product</h2>
                                    <Button variant="outline-secondary" size="sm" onClick={() => navigate('/admin')}>
                                        Back to Dashboard
                                    </Button>
                                </div>

                                {error && <Alert variant="danger">{error}</Alert>}

                                <Form onSubmit={handleUpdate}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Product Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Description</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={4}
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>

                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Price</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    step="0.01"
                                                    name="price"
                                                    value={formData.price}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Quantity</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    name="quantity"
                                                    value={formData.quantity}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Form.Group className="mb-4">
                                        <Form.Label>Product Image</Form.Label>
                                        <Form.Control
                                            type="file"
                                            name="imageFile"
                                            onChange={handleChange}
                                            accept="image/*"
                                        />
                                        <Form.Text className="text-muted">
                                            Leave empty to keep current image.
                                        </Form.Text>
                                        {formData.image && !formData.imageFile && (
                                            <div className="mt-2 text-center">
                                                <p className="small text-muted mb-1">Current Image:</p>
                                                <img
                                                    src={formData.image}
                                                    alt="Current"
                                                    style={{ maxHeight: '150px', objectFit: 'contain' }}
                                                    onError={(e) => e.target.style.display = 'none'}
                                                />
                                            </div>
                                        )}
                                    </Form.Group>

                                    <div className="d-grid gap-2">
                                        <Button variant="primary" size="lg" type="submit" disabled={saving}>
                                            {saving ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                        <Button variant="outline-danger" onClick={handleDelete} disabled={saving}>
                                            Delete Product
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default EditProductPage;
