import React from 'react';
import { Modal, Button, Container } from 'react-bootstrap';

const RoleSelectionModal = ({ show, onSelectRole, onRegister, onClose }) => (
  <Modal
    show={show}
    centered
    onHide={onClose}
    dialogClassName="custom-login-modal"
  >
    <Modal.Body className="custom-modal-body p-5">
      {/* Close button top-right */}
      <Button
        variant="link"
        className="modal-close-btn"
        onClick={onClose}
      >
        ×
      </Button>

      <Container className="text-center py-5">
        <h4 className="modal-title mb-5">Log in with your account</h4>

        <div className="d-grid gap-3 col-6 mx-auto mb-5">
          <Button
            variant="dark"
            size="lg"
            className="role-btn"
            onClick={() => onSelectRole('admin')}
          >
            Admin
          </Button>
          <Button
            variant="dark"
            size="lg"
            className="role-btn"
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
            className="register-btn"
            onClick={onRegister}
          >
            Register
          </Button>
        </div>
      </Container>
    </Modal.Body>
  </Modal>
);

export default RoleSelectionModal;
