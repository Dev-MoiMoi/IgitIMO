import React from 'react';
import { Modal, Button, Form, Container, Row, Col } from 'react-bootstrap';
import { ArrowLeft } from 'lucide-react';

const RegisterModal = ({ show, onRegister, onBack }) => {
    const [labelType, setLabelType] = React.useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onRegister();
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

                    <Form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: '600px' }}>
                        <div className="mb-4 p-3 border rounded-3">
                            <Form.Group className="mb-3">
                                <Form.Control type="text" placeholder="Username" className="bg-light border-light" />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Control type="password" placeholder="Password" className="bg-light border-light" />
                            </Form.Group>
                        </div>

                        <div className="mb-4 p-3 border rounded-3">
                            <Form.Group className="mb-3">
                                <Form.Control type="text" placeholder="Full Name" className="bg-light border-light" />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Control type="text" placeholder="Phone Number" className="bg-light border-light" />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Control type="text" placeholder="Region, Province, City, Barangay" className="bg-light border-light" />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Control type="text" placeholder="Postal Code" className="bg-light border-light" />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Control type="text" placeholder="Street Name, Building, House No." className="bg-light border-light" />
                            </Form.Group>

                            <Form.Group className="mb-3 d-flex align-items-center">
                                <Form.Label className="mb-0 me-3">Set as default address</Form.Label>
                                <Form.Check type="switch" id="custom-switch" />
                            </Form.Group>

                            <Form.Group className="mb-3 d-flex align-items-center">
                                <Form.Label className="mb-0 me-3">Label as:</Form.Label>
                                <Button 
                                    variant={labelType === 'Work' ? 'dark' : 'outline-secondary'} 
                                    size="sm" 
                                    className="me-2 rounded-pill px-3"
                                    onClick={() => setLabelType('Work')}
                                >
                                    Work
                                </Button>
                                <Button 
                                    variant={labelType === 'Home' ? 'dark' : 'outline-secondary'} 
                                    size="sm" 
                                    className="rounded-pill px-3"
                                    onClick={() => setLabelType('Home')}
                                >
                                    Home
                                </Button>
                            </Form.Group>
                        </div>

                        <div className="text-center mt-4">
                            <Button variant="dark" type="submit" size="lg" className="px-5 rounded-3">
                                Register
                            </Button>
                        </div>
                    </Form>
                </Container>
            </Modal.Body>
        </Modal>
    );
};

export default RegisterModal;
