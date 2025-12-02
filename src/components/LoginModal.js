import React, { useState } from 'react';
import { Modal, Button, Form, Container } from 'react-bootstrap';
import { ArrowLeft } from 'lucide-react';

const LoginModal = ({ show, role, onLogin, onBack }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(role);
    };

    const title = role === 'admin' ? 'Admin Log In' : 'User Log In';

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

                <Container className="py-4">
                    <h2 className="text-center mb-5 fw-bold">{title}</h2>

                    <Form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: '500px' }}>
                        <Form.Group className="mb-3" controlId="formBasicUsername">
                            <Form.Control
                                type="text"
                                placeholder="Username"
                                className="py-2 bg-light border-light"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-5" controlId="formBasicPassword">
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                className="py-2 bg-light border-light"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>

                        <div className="text-center">
                            <Button variant="dark" type="submit" size="lg" className="px-5 rounded-3">
                                Log in
                            </Button>
                        </div>
                    </Form>
                </Container>
            </Modal.Body>
        </Modal>
    );
};

export default LoginModal;
