import React, { useState } from 'react';
import { Modal, Button, Form, Container, Spinner, Alert } from 'react-bootstrap';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';
import API_BASE from '../config/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginModal = ({ show, role, onBack }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset form function
  const resetForm = () => {
    setUsername('');
    setPassword('');
    setError('');
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = role === 'admin'
        ? `${API_BASE}/login/admin`
        : `${API_BASE}/login/customer`;

      const response = await axios.post(endpoint, { username, password }, {
        headers: { 'Content-Type': 'application/json' }
      });

      const userData = role === 'admin' ? response.data.admin : response.data.user;

      if (userData) {
        login(role, userData); 
        resetForm(); // Clear form after successful login

        setTimeout(() => {
          if (role === 'admin') navigate('/admin');
          else navigate('/');
        }, 100);

      } else {
        setError(response.data.error || 'Login failed. Check your credentials.');
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Login failed. Check your credentials.');
      setLoading(false);
    }
  };

  const handleBack = () => {
    resetForm(); // Clear form when Back is pressed
    onBack();
  };

  const title = role === 'admin' ? 'Admin Log In' : 'User Log In';

  return (
    <Modal show={show} centered backdrop="static" keyboard={false} size="lg">
      <Modal.Body className="p-5">
        <div className="mb-4">
          <Button
            variant="link"
            className="text-dark p-0 text-decoration-none fw-bold fs-5"
            onClick={handleBack} // Use handleBack instead of directly onBack
          >
            <ArrowLeft size={24} className="me-2" /> Back
          </Button>
        </div>

        <Container className="py-4">
          <h2 className="text-center mb-5 fw-bold">{title}</h2>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: '500px' }}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </Form.Group>

            {loading && (
              <div className="text-center mb-3">
                <Spinner animation="border" role="status" />
                <span className="ms-2">Logging in...</span>
              </div>
            )}

            <div className="text-center mt-4">
              <Button variant="dark" type="submit" size="lg" className="px-5 rounded-3" disabled={loading}>
                {loading ? 'Please wait...' : 'Log in'}
              </Button>
            </div>
          </Form>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;
