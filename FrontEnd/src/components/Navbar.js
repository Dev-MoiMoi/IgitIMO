  import React, { useEffect, useState } from 'react';
  import { NavLink, useNavigate } from 'react-router-dom';
  import { Navbar, Nav, Container } from 'react-bootstrap';
  import '../styles/style.css';

  import { useAuth } from '../context/AuthContext';

  const AppNavbar = () => {
    const { isAuthenticated, logout, setShowRoleModal, userRole } = useAuth();
    const navigate = useNavigate();

    const isAdmin = userRole === 'admin';

    const [showNavbar, setShowNavbar] = useState(true);

    // ===== Scroll Hide Logic =====
    useEffect(() => {
      let lastScroll = window.scrollY;

      const handleScroll = () => {
        const currentScroll = window.scrollY;

        if (currentScroll > lastScroll && currentScroll > 50) {
          // scrolling down
          setShowNavbar(false);
        } else {
          // scrolling up
          setShowNavbar(true);
        }

        lastScroll = currentScroll;
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // ===== Logout =====
    const handleLogout = () => {
      logout();
      navigate('/');
    };

    return (
      <Navbar
        expand="lg"
        className={`customNavbar custom-nav fixed-top ${showNavbar ? 'navbar-show' : 'navbar-hide'}`}
        variant="dark"
      >
        <Container fluid className="px-5">
          <Navbar.Brand as={NavLink} to="/" className="navbar-logo">
            <img src="/logo.png" alt="IGIT Logo" />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav as="ul" className="navbar-links align-items-center">

              {/* USER ROUTES */}
              {userRole !== 'admin' && (
                <>
                  <Nav.Item as="li">
                    <NavLink to="/" className="nav-link">Home</NavLink>
                  </Nav.Item>
                  <Nav.Item as="li">
                    <NavLink to="/products" className="nav-link">Shop</NavLink>
                  </Nav.Item>
                  <Nav.Item as="li">
                    <NavLink to="/cart" className="nav-link">Cart</NavLink>
                  </Nav.Item>

                  {isAuthenticated && (
                    <Nav.Item as="li">
                      <NavLink to="/orders" className="nav-link">Orders</NavLink>
                    </Nav.Item>
                  )}
                </>
              )}

              {/* ADMIN ROUTES */}
              {userRole === 'admin' && (
                <Nav.Item as="li">
                  <NavLink to="/admin" className="nav-link">Dashboard</NavLink>
                </Nav.Item>
              )}

              {/* ACCOUNT BUTTON */}
              {!isAuthenticated && (
                <Nav.Item as="li">
                  <Nav.Link
                    as="button"
                    onClick={() => setShowRoleModal(true)}
                    className="nav-link bg-transparent border-0"
                  >
                    Account
                  </Nav.Link>
                </Nav.Item>
              )}

              {/* LOGOUT */}
              {isAuthenticated && (
                <Nav.Item as="li" className="ms-3">
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline-light btn-sm rounded-0"
                  >
                    Log Out
                  </button>
                </Nav.Item>
              )}

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  };

  export default AppNavbar;
