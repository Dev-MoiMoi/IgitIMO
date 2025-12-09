import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Image } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const CheckoutModal = ({ show, onClose, items, onCheckoutComplete }) => {
  const { isAuthenticated, setShowLoginModal, user } = useAuth();
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

  useEffect(() => {
    if (user) {
      // The backend returns addresses as a nested array (user.addresses)
      // We try to find the default one, or fall back to the first one
      const userAddress = (user.addresses && user.addresses.length > 0)
        ? (user.addresses.find(a => a.is_default) || user.addresses[0])
        : {};

      setFormData({
        fullName: user.full_name || '',
        phoneNumber: user.phone_number || '',
        region: userAddress.region || '',
        province: userAddress.province || '',
        city: userAddress.city || '',
        barangay: userAddress.barangay || '',
        postalCode: userAddress.postal_code || '',
        street: userAddress.street_building_house || '',
        isDefault: userAddress.is_default || false,
        label: userAddress.label || 'Home'
      });
    }
  }, [user]);

  const total = items.reduce((acc, item) => acc + (Number(item.product?.price) || 0) * item.quantity, 0).toFixed(2);

  const handleLoginClick = () => {
    onClose();
    setShowLoginModal(true);
  };

  const handlePlaceOrder = () => {
    if (!isAuthenticated) {
      // If not authenticated, maybe show an alert or open login
      // Requirement: "if I try to check out the app should ask me to log in and the modal will popup"
      handleLoginClick();
      return;
    }
    onCheckoutComplete({
      shippingAddress: {
        ...formData,
        full_name: formData.fullName,
        phone_number: formData.phoneNumber,
        street_building_house: formData.street,
        postal_code: formData.postalCode,
        // Ensure backend receives snake_case if needed, though formData already has the split fields
      }
    });
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

        {/* Product List - Only show if authenticated or if we want to show it always? 
            User image shows products in "logged out" view too. */}
        <div className="mb-4">
          {items.map(item => (
            <div key={item.id} className="d-flex align-items-center mb-3 p-2 border rounded bg-light">
              <Image src={item.product?.image} alt={item.product?.name} className="rounded me-3 checkout-product-img" />
              {/* Sets fixed dimensions and cover fit for the product thumbnail. */}
              <div>
                <div className="fw-bold">{item.product?.name}</div>
                <div className="text-muted small">₱{Number(item.product?.price || 0).toFixed(2)}</div>
                <div className="text-muted small">Quantity: {item.quantity}</div>
              </div>
            </div>
          ))}
        </div>

        <h5 className="fw-bold mb-3">Shipping Address</h5>
        <Form>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Full Name"
              className="bg-light border-light py-2"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Phone Number"
              className="bg-light border-light py-2"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Region"
              className="bg-light border-light py-2"
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Province"
              className="bg-light border-light py-2"
              value={formData.province}
              onChange={(e) => setFormData({ ...formData, province: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="City"
              className="bg-light border-light py-2"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Barangay"
              className="bg-light border-light py-2"
              value={formData.barangay}
              onChange={(e) => setFormData({ ...formData, barangay: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Postal Code"
              className="bg-light border-light py-2"
              value={formData.postalCode}
              onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Street Name, Building, House No."
              className="bg-light border-light py-2"
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
            />
          </Form.Group>

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


          <div className="d-flex justify-content-between align-items-center mt-5">
            <div className="fs-5 fw-bold">Total <span className="ms-2">{total}</span></div>
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
