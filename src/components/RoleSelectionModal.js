import React from 'react';
import { Modal, Button, Container, Row, Col } from 'react-bootstrap';
import { ArrowLeft } from 'lucide-react';

const RoleSelectionModal = ({ show, onSelectRole, onRegister, onClose }) => {
    return (
        <Modal show={show} centered onHide={onClose} size="lg">
            <Modal.Body className="p-5">
                <div className="mb-4">
                    <Button
                        variant="link"
                        className="text-dark p-0 text-decoration-none fw-bold fs-5"
                        onClick={onClose}
                    >
                        <ArrowLeft size={24} className="me-2" /> Back
                    </Button>
                </div>

                <Container className="text-center py-5">
                    <h4 className="mb-5">Log in with your account</h4>

                    <div className="d-grid gap-3 col-6 mx-auto mb-5">
                        <Button
                            variant="dark"
                            size="lg"
                            className="py-2 rounded-3"
                            onClick={() => onSelectRole('admin')}
                        >
                            Admin
                        </Button>
                        <Button
                            variant="dark"
                            size="lg"
                            className="py-2 rounded-3"
                            onClick={() => onSelectRole('customer')}
                        >
                            Customer
                        </Button>
                    </div>

                    <div className="mt-5">
                        <span className="me-2">Don't have an account?</span>
                        <Button
                            variant="dark"
                            size="sm"
                            className="px-4 rounded-3"
                            onClick={onRegister}
                        >
                            Register
                        </Button>
                    </div>
                </Container>
            </Modal.Body>
        </Modal>
    );
};

export default RoleSelectionModal;
