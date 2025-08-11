import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SignIn.css';

const SignIn = () => {
  const navigate = useNavigate();

  return (
    <div className="vrumies-signin-screen">
      {/* Top-left logo */}
      <img
        src="https://res.cloudinary.com/dmjvngk3o/image/upload/v1754732908/VrumiesLogo_jxdvsw.png"
        alt="Vrumies Logo"
        className="vrumies-signin-logo"
      />

      {/* Centered stacked images */}
      <div className="vrumies-signin-center">
        <img
          src="https://res.cloudinary.com/dmjvngk3o/image/upload/v1754732913/Welcome_jngzua.png"
          alt="Welcome"
          className="vrumies-signin-welcome-image"
        />

        {/* Make this a clickable button */}
        <button
          className="vrumies-signin-google-button"
          onClick={() => navigate('/')}
          aria-label="Sign in with Google"
          type="button"
        >
          <img
            src="https://res.cloudinary.com/dmjvngk3o/image/upload/v1754732908/GoogleSignIn_gk6tbs.png"
            alt="Google Sign-In"
            className="vrumies-signin-google-image"
          />
        </button>
      </div>
    </div>
  );
};

export default SignIn;
