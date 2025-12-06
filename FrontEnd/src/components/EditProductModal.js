import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import API_BASE from '../config/api';

const EditProductModal = ({ show, onHide, product, onProductUpdated }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        quantity: '',
        image: '',
        imageFile: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                description: product.description || '',
                price: product.price || '',
                quantity: product.quantity || '',
                image: product.image || '',
                imageFile: null
            });
        }
    }, [product]);

    const handleChange = (e) => {
        if (e.target.name === 'imageFile') {
            setFormData({ ...formData, imageFile: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = new FormData();
            payload.append('name', formData.name);
            payload.append('description', formData.description);
            payload.append('price', parseFloat(formData.price));
            payload.append('quantity', parseInt(formData.quantity));
            if (formData.imageFile) {
                payload.append('image', formData.imageFile);
            }
            // Note: For PUT requests with FormData, Laravel/PHP sometimes struggles.
            // A common workaround is to use POST with _method: PUT.
            payload.append('_method', 'PUT');

            await axios.post(`${API_BASE}/products/${product.id}`, payload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            onProductUpdated();
            onHide();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || err.message || 'Failed to update product');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        setLoading(true);
        setError('');

        try {
            await axios.delete(`${API_BASE}/products/${product.id}`);
            onProductUpdated();
            onHide();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || err.message || 'Failed to delete product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Edit Product</Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
                            rows={3}
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

                    <Form.Group className="mb-3">
                        <Form.Label>Product Image</Form.Label>
                        <Form.Control
                            type="file"
                            name="imageFile"
                            onChange={handleChange}
                            accept="image/*"
                        />
                        {formData.image && !formData.imageFile && (
                            <div className="mt-2">
                                <small>Current Image: {formData.image}</small>
                            </div>
                        )}
                    </Form.Group>

                    <div className="d-flex justify-content-between">
                        <Button variant="danger" onClick={handleDelete} disabled={loading}>
                            Delete Product
                        </Button>
                        <div className="d-flex gap-2">
                            <Button variant="secondary" onClick={onHide}>Cancel</Button>
                            <Button variant="primary" type="submit" disabled={loading}>
                                {loading ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EditProductModal;
