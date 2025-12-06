import React from "react";
import { useNavigate } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";
import "../styles/style.css";

const BackButton = ({ label = "Back" }) => {
  const navigate = useNavigate();

  return (
    <div
      className="back-button d-flex align-items-center gap-2"
      onClick={() => navigate(-1)}
      style={{ cursor: 'pointer' }}
    >
      <BsArrowLeft size={20} />
      <span className="fw-semibold">{label}</span>
    </div>
  );
};

export default BackButton;
