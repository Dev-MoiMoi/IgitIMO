import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import AboutUs from './pages/AboutUs';
import AdminDashboard from './pages/AdminDashboard';
import RoleSelectionModal from './components/RoleSelectionModal';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';

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
  }, [isAuthenticated]);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setShowRoleModal(false);
    setShowLoginModal(true);
  };

  const handleRegisterOpen = () => {
    setShowRoleModal(false);
    setShowRegisterModal(true);
  };

  const handleRegisterSubmit = (userData) => {
    login('customer', userData); // store registered user
    navigate('/');
  };

  const handleBackToRole = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
    setShowRoleModal(true);
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/admin" element={userRole === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
      </Routes>

      <RoleSelectionModal
        show={showRoleModal}
        onSelectRole={handleRoleSelect}
        onRegister={handleRegisterOpen}
        onClose={() => setShowRoleModal(false)}
      />

      <LoginModal
        show={showLoginModal}
        role={selectedRole}
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
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
