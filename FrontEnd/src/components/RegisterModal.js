import React, { useState } from 'react';
import { Modal, Button, Form, Container } from 'react-bootstrap';

const RegisterModal = ({ show, onRegister, onBack }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
    phone_number: '',
    region: '',
    province: '',
    city: '',
    barangay: '',
    postal_code: '',
    street_building_house: '',
    label: 'Home',
    is_default: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLabelChange = (label) => {
    setFormData(prev => ({ ...prev, label }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(formData);
  };

  return (
    <Modal
      show={show}
      centered
      backdrop="static"
      keyboard={false}
      dialogClassName="custom-login-modal"
    >
      <Modal.Body className="custom-modal-body p-5">
        {/* Close button top-right */}
        <Button
          variant="link"
          className="modal-close-btn"
          onClick={onBack}
        >
          ×
        </Button>

        <Container className="py-2">
          <h2 className="modal-title text-center mb-5 fw-bold">Register</h2>

          <Form onSubmit={handleSubmit} className="mx-auto modal-form-register">
            <div className="mb-4 p-3 border custom-form-section">
              <Form.Group className="mb-3">
                <Form.Control 
                  type="text" 
                  placeholder="Username" 
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control 
                  type="email" 
                  placeholder="Email Address" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control 
                  type="password" 
                  placeholder="Password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </div>

            <div className="mb-4 p-3 border custom-form-section">
              <Form.Group className="mb-3">
                <Form.Control 
                  type="text" 
                  placeholder="Full Name" 
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control 
                  type="text" 
                  placeholder="Phone Number" 
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control 
                  type="text" 
                  placeholder="Region" 
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control 
                  type="text" 
                  placeholder="Province" 
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control 
                  type="text" 
                  placeholder="City" 
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control 
                  type="text" 
                  placeholder="Barangay" 
                  name="barangay"
                  value={formData.barangay}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control 
                  type="text" 
                  placeholder="Postal Code" 
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control 
                  type="text" 
                  placeholder="Street Name, Building, House No." 
                  name="street_building_house"
                  value={formData.street_building_house}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3 d-flex align-items-center">
                <Form.Label className="mb-0 me-3">Set as default address</Form.Label>
                <Form.Check 
                  type="switch" 
                  id="custom-switch" 
                  name="is_default"
                  checked={formData.is_default}
                  onChange={handleChange}
                />
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
