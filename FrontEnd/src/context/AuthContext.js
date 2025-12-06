import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(() => localStorage.getItem('userRole'));
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('isAuthenticated') === 'true');
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Global Modal State
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const login = (role, userData) => {
    setUserRole(role);
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('userRole', role);
    localStorage.setItem('isAuthenticated', 'true');
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
    }
    setShowLoginModal(false);
    setShowRoleModal(false);
    setShowRegisterModal(false);
  };

  const navigate = useNavigate();

  // ... existing login ...

  const logout = () => {
    setUserRole(null);
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('userRole');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    setShowRoleModal(true);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{
      user,
      userRole,
      isAuthenticated,
      login,
      logout,
      showRoleModal, setShowRoleModal,
      showLoginModal, setShowLoginModal,
      showRegisterModal, setShowRegisterModal
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
