import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/style.css";

const Footer = () => {
  return (
    <footer>
      <div className="footer-brand">IGIT IN MY OVEN</div>
      <div className="footer-tagline">Home Baked Happiness</div>

      <div className="footer-nav">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/products">Shop</NavLink>
        <NavLink to="/cart">Cart</NavLink>
        <NavLink to="/about">About Us</NavLink>
      </div>

      <div className="footer-info">
        Cabuyao, Philippines <span>|</span> igitinmyoven@gmail.com
      </div>

      <div className="footer-copy">
        © 2025 iGit in My Oven. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
