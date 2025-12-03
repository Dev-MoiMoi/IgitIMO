import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Image } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import API_BASE from '../config/api';

const CheckoutModal = ({ show, onClose, items, onCheckoutComplete }) => {
  const { isAuthenticated, user, setShowLoginModal } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    region: '',
    province: '',
    city: '',
    barangay: '',
    postalCode: '',
    street: '',
    isDefault: false,
    label: 'Home'
  });

  // Autofill address when modal opens
  useEffect(() => {
    if (!show || !user) return;

    axios.get(`${API_BASE}/user/address/default/${user.id}`)
      .then(res => {
        const data = res.data.address || res.data; // support both structures
        if (data) {
          setFormData({
            fullName: data.full_name || '',
            phoneNumber: data.phone_number || '',
            region: data.region || '',
            province: data.province || '',
            city: data.city || '',
            barangay: data.barangay || '',
            postalCode: data.postal_code || '',
            street: data.street_building_house || '',
            isDefault: data.is_default || false,
            label: data.label || 'Home'
          });
        }
      })
      .catch(err => console.error("Failed to load default address:", err));
  }, [show, user]);

  // Reset form when modal closes
  useEffect(() => {
    if (!show) {
      setFormData({
        fullName: '',
        phoneNumber: '',
        region: '',
        province: '',
        city: '',
        barangay: '',
        postalCode: '',
        street: '',
        isDefault: false,
        label: 'Home'
      });
    }
  }, [show]);

  const total = items
    .reduce((acc, item) => acc + (Number(item.product?.price) || 0) * item.quantity, 0)
    .toFixed(2);

  const handleLoginClick = () => {
    onClose();
    setShowLoginModal(true);
  };

  const handlePlaceOrder = () => {
    if (!isAuthenticated) return handleLoginClick();
    onCheckoutComplete({ shippingAddress: formData });
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg" backdrop="static">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">Checkout</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-5 pb-5">
        {!isAuthenticated && (
          <div className="d-flex justify-content-end align-items-center mb-4">
            <span className="me-2">Already have an account?</span>
            <Button variant="dark" size="sm" onClick={handleLoginClick}>Log in</Button>
          </div>
        )}

        <div className="mb-4">
          {items.map(item => {
            const price = Number(item.product?.price) || 0;
            return (
              <div key={item.id} className="d-flex align-items-center mb-3 p-2 border rounded bg-light">
                <Image 
                  src={item.product?.image || "https://placehold.co/60x60?text=No+Image"} 
                  alt={item.product?.name || "Product"} 
                  style={{ width: '60px', height: '60px', objectFit: 'cover' }} 
                  className="rounded me-3" 
                />
                <div>
                  <div className="fw-bold">{item.product?.name}</div>
                  <div className="text-muted small">₱{price.toFixed(2)}</div>
                  <div className="text-muted small">Quantity: {item.quantity}</div>
                </div>
              </div>
            );
          })}
        </div>

        <h5 className="fw-bold mb-3">Shipping Address</h5>
        <Form>
          {['fullName','phoneNumber','region','province','city','barangay','postalCode','street'].map(field => (
            <Form.Group className="mb-3" key={field}>
              <Form.Control
                type="text"
                placeholder={field.replace(/([A-Z])/g, ' $1').trim()}
                className="bg-light border-light py-2"
                value={formData[field]}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
              />
            </Form.Group>
          ))}

          <div className="d-flex align-items-center mb-3">
            <Form.Check
              type="switch"
              id="default-address"
              label="Set as default address"
              className="me-4"
              checked={formData.isDefault}
              onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
            />
          </div>

          <div className="d-flex align-items-center mb-4">
            <span className="me-3 text-muted">Label as:</span>
            <Button
              variant={formData.label === 'Work' ? 'dark' : 'outline-secondary'}
              size="sm"
              className="me-2 rounded-pill px-3"
              onClick={() => setFormData({ ...formData, label: 'Work' })}
            >
              Work
            </Button>
            <Button
              variant={formData.label === 'Home' ? 'dark' : 'outline-secondary'}
              size="sm"
              className="rounded-pill px-3"
              onClick={() => setFormData({ ...formData, label: 'Home' })}
            >
              Home
            </Button>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-5">
            <div className="fs-5 fw-bold">Total <span className="ms-2">₱{total}</span></div>
            <Button variant="dark" size="lg" className="px-4" onClick={handlePlaceOrder}>
              Place Order
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CheckoutModal;



