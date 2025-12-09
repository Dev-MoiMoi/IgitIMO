import React, { useState, useEffect, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
  useParams
} from 'react-router-dom';

import axios from "axios";
import API_BASE from "./config/api";

import RoleSelectionModal from './components/RoleSelectionModal';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';

import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';

import EditProductModal from './components/EditProductModal';

const Home = React.lazy(() => import('./pages/Home'));
const ProductList = React.lazy(() => import('./pages/ProductList'));
const ProductDetail = React.lazy(() => import('./pages/ProductDetail'));
const Cart = React.lazy(() => import('./pages/Cart'));
const AboutUs = React.lazy(() => import('./pages/AboutUs'));
const OrderHistory = React.lazy(() => import('./pages/OrderHistory'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));

// ⭐ Modal wrapper for editing product
const EditProductModalWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await axios.get(`${API_BASE}/products/${id}`);
        setProduct(res.data.data || res.data);
      } catch (err) {
        console.error(err);
        navigate("/admin"); // fallback if product not found
      }
    };
    loadProduct();
  }, [id, navigate]);

  const handleClose = () => navigate(-1);
  const handleUpdated = () => navigate(-1);

  if (!product) return null;

  return (
    <EditProductModal
      show={true}
      onHide={handleClose}
      product={product}
      onProductUpdated={handleUpdated}
    />
  );
};

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
  const location = useLocation();

  useEffect(() => {
  // Hide all modals whenever auth state changes
  setShowRoleModal(false);
  setShowLoginModal(false);
  setShowRegisterModal(false);
}, [isAuthenticated, setShowRoleModal, setShowLoginModal, setShowRegisterModal]);


  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setShowRoleModal(false);
    setShowLoginModal(true);
  };

  const handleRegisterOpen = () => {
    setShowRoleModal(false);
    setShowRegisterModal(true);
  };

  const handleRegisterSubmit = async (userData) => {
    try {
      const response = await axios.post(`${API_BASE}/register`, userData);
      const newUser = response.data.user;
      login("customer", newUser);
      navigate("/");
      alert("Registration successful!");
    } catch (error) {
      console.error("Registration failed:", error);
      alert(error.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  const handleBackToRole = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
    setShowRoleModal(true);
  };

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/orders" element={isAuthenticated ? <OrderHistory /> : <Navigate to="/" />} />
          <Route path="/admin" element={userRole === "admin" ? <AdminDashboard /> : <Navigate to="/" />} />

          {/* Single clean route for edit modal */}
          <Route
            path="/admin/product/edit/:id"
            element={
              userRole === "admin" ? (
                <Suspense fallback={<div>Loading...</div>}>
                  <EditProductModalWrapper />
                </Suspense>
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </Suspense>

      {/* Regular modals */}
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
