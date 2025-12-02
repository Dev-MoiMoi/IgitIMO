import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import { CartProvider } from './context/CartContext';
import Cart from './pages/Cart';
import AboutUs from './pages/AboutUs';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import RoleSelectionModal from './components/RoleSelectionModal';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';

const AppContent = () => {
  const {
    isAuthenticated,
    userRole,
    login,
    showRoleModal, setShowRoleModal,
    showLoginModal, setShowLoginModal,
    showRegisterModal, setShowRegisterModal
  } = useAuth();

  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      setShowRoleModal(false);
      setShowLoginModal(false);
      setShowRegisterModal(false);
    }
  }, [isAuthenticated, setShowRoleModal, setShowLoginModal, setShowRegisterModal]);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setShowRoleModal(false);
    setShowLoginModal(true);
  };

  const handleLogin = (role) => {
    login(role);
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  const handleRegisterOpen = () => {
    setShowRoleModal(false);
    setShowRegisterModal(true);
  };

  const handleRegisterSubmit = () => {
    // Mock registration - auto login as customer
    login('customer');
    navigate('/');
  };

  const handleBackToRole = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
    setShowRoleModal(true);
  };

  const handleCloseRoleModal = () => {
    setShowRoleModal(false);
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/about" element={<AboutUs />} />
        <Route
          path="/admin"
          element={
            userRole === 'admin' ? <AdminDashboard /> : <Navigate to="/" />
          }
        />
      </Routes>

      <RoleSelectionModal
        show={showRoleModal}
        onSelectRole={handleRoleSelect}
        onRegister={handleRegisterOpen}
        onClose={handleCloseRoleModal}
      />
      <LoginModal
        show={showLoginModal}
        role={selectedRole}
        onLogin={handleLogin}
        onBack={handleBackToRole}
      />
      <RegisterModal
        show={showRegisterModal}
        onRegister={handleRegisterSubmit}
        onBack={handleBackToRole}
      />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppContent />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
