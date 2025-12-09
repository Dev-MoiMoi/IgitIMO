import React, { useState } from 'react';
import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import API_BASE from '../config/api';

const AddProductModal = ({ show, onHide, onProductAdded }) => {
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

    const handleChange = (e) => {
        if (e.target.name === 'imageFile') {
            setFormData({ ...formData, imageFile: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!formData.name || !formData.price || !formData.quantity) {
                throw new Error("Please fill in all required fields.");
            }

            const payload = new FormData();
            payload.append('name', formData.name);
            payload.append('description', formData.description);
            payload.append('price', parseFloat(formData.price));
            payload.append('quantity', parseInt(formData.quantity));
            if (formData.imageFile) {
                payload.append('image', formData.imageFile);
            }

            await axios.post(`${API_BASE}/products`, payload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            onProductAdded();
            onHide();
            setFormData({ name: '', description: '', price: '', quantity: '', image: '', imageFile: null });
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || err.message || 'Failed to add product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            dialogClassName="custom-login-modal"
        >
            <Modal.Body className="custom-modal-body p-4">
                {/* Close button top-right */}
                <Button
                    variant="link"
                    className="modal-close-btn"
                    onClick={onHide}
                >
                    ×
                </Button>

                <h4 className="modal-title mb-4 text-center">Add New Product</h4>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
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
                        <Form.Text className="text-muted">
                            Leave empty for default placeholder.
                        </Form.Text>
                    </Form.Group>

                    <div className="d-flex justify-content-end gap-2">
                        <Button variant="secondary" onClick={onHide}>Cancel</Button>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? 'Adding...' : 'Add Product'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddProductModal;
