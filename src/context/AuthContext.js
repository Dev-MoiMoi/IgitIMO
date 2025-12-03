import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(() => {
    const role = localStorage.getItem('userRole');
    return role && role !== 'undefined' ? role : null;
  });

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    if (stored && stored !== 'undefined' && stored !== 'null') {
      try {
        return JSON.parse(stored);
      } catch {
        console.warn("Invalid user JSON in localStorage");
        return null;
      }
    }
    return null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('isAuthenticated') === 'true');

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const login = (role, userData) => {
    setUserRole(role);
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('userRole', role);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isAuthenticated', 'true');
    setShowLoginModal(false);
    setShowRoleModal(false);
    setShowRegisterModal(false);
  };

  const logout = () => {
    setUserRole(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    setShowRoleModal(true);
    navigate('/'); // Redirect to home
  };

  return (
    <AuthContext.Provider
      value={{
        userRole,
        user,
        isAuthenticated,
        login,
        logout,
        showRoleModal,
        setShowRoleModal,
        showLoginModal,
        setShowLoginModal,
        showRegisterModal,
        setShowRegisterModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
