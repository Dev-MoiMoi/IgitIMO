import React, { useState } from 'react';
import { Modal, Button, Form, Container, Alert, Spinner } from 'react-bootstrap';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';
import API_BASE from '../config/api';

const RegisterModal = ({ show, onRegister, onBack }) => {
    const initialForm = {
        username: '',
        password: '',
        full_name: '',
        phone_number: '',
        region: '',
        province: '',
        city: '',
        barangay: '',
        postal_code: '',
        street_building_house: '',
        is_default: false,
        label: 'Home',
    };

    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    };

    const handleLabel = (label) => setForm({ ...form, label });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await axios.post(`${API_BASE}/register`, form, {
                headers: { 'Content-Type': 'application/json' },
            });

            setSuccess('Registration successful!');
            setLoading(false);
            onRegister?.(); // callback to parent
            setForm(initialForm); // reset form
        } catch (err) {
            console.error(err.response?.data || err.message);
            setError(err.response?.data?.error || 'Registration failed');
            setLoading(false);
        }
    };

    return (
        <Modal show={show} centered backdrop="static" keyboard={false} size="lg">
            <Modal.Body className="p-5">
                <div className="mb-4">
                    <Button
                        variant="link"
                        className="text-dark p-0 text-decoration-none fw-bold fs-5"
                        onClick={onBack}
                    >
                        <ArrowLeft size={24} className="me-2" /> Back
                    </Button>
                </div>

                <Container className="py-2">
                    <h2 className="text-center mb-5 fw-bold">Register</h2>

                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}

                    <Form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: '600px' }}>
                        <div className="mb-4 p-3 border rounded-3">
                            <Form.Group className="mb-3">
                                <Form.Control
                                    type="text"
                                    name="username"
                                    placeholder="Username"
                                    value={form.username}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Control
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </div>

                        <div className="mb-4 p-3 border rounded-3">
                            {['full_name','phone_number','region','province','city','barangay','postal_code','street_building_house'].map(field => (
                                <Form.Group className="mb-3" key={field}>
                                    <Form.Control
                                        type="text"
                                        name={field}
                                        placeholder={field.replace('_',' ')}
                                        value={form[field]}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            ))}

                            <Form.Group className="mb-3 d-flex align-items-center">
                                <Form.Label className="mb-0 me-3">Set as default address</Form.Label>
                                <Form.Check
                                    type="switch"
                                    name="is_default"
                                    checked={form.is_default}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3 d-flex align-items-center">
                                <Form.Label className="mb-0 me-3">Label as:</Form.Label>
                                <Button
                                    type="button"
                                    variant={form.label === 'Work' ? 'dark' : 'outline-secondary'}
                                    size="sm"
                                    className="me-2 rounded-pill px-3"
                                    onClick={() => handleLabel('Work')}
                                >
                                    Work
                                </Button>
                                <Button
                                    type="button"
                                    variant={form.label === 'Home' ? 'dark' : 'outline-secondary'}
                                    size="sm"
                                    className="rounded-pill px-3"
                                    onClick={() => handleLabel('Home')}
                                >
                                    Home
                                </Button>
                            </Form.Group>
                        </div>

                        <div className="text-center mt-4">
                            <Button variant="dark" type="submit" size="lg" disabled={loading}>
                                {loading ? <Spinner animation="border" size="sm" className="me-2" /> : null}
                                {loading ? 'Registering...' : 'Register'}
                            </Button>
                        </div>
                    </Form>
                </Container>
            </Modal.Body>
        </Modal>
    );
};

export default RegisterModal;
