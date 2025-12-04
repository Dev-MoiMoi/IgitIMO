import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(() => localStorage.getItem('userRole'));
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('isAuthenticated') === 'true');

  // Global Modal State
  const [showRoleModal, setShowRoleModal] = useState(!localStorage.getItem('isAuthenticated'));
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const login = (role) => {
    setUserRole(role);
    setIsAuthenticated(true);
    localStorage.setItem('userRole', role);
    localStorage.setItem('isAuthenticated', 'true');
    setShowLoginModal(false);
    setShowRoleModal(false);
    setShowRegisterModal(false);
  };

  const logout = () => {
    setUserRole(null);
    setIsAuthenticated(false);
    localStorage.removeItem('userRole');
    localStorage.removeItem('isAuthenticated');
    setShowRoleModal(true);
  };

  return (
    <AuthContext.Provider value={{
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
