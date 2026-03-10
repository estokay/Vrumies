import React from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";
import "./SignInOverlay.css";

const SignInOverlay = ({ isOpen }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="signin-overlay-container">

      <div className="signin-overlay-card">

        <img
          src="https://res.cloudinary.com/dmjvngk3o/image/upload/v1754732908/VrumiesLogo_jxdvsw.png"
          className="signin-overlay-logo"
          alt="Vrumies Logo"
        />

        <h2>Please Sign In</h2>

        <p>
          You need to be signed in to access this content.
        </p>

        <button
          className="signin-overlay-button"
          onClick={() => navigate("/signin")}
        >
          Sign In
        </button>

      </div>

    </div>,
    document.body
  );
};

export default SignInOverlay;