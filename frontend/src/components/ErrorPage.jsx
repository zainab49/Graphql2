import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ErrorPage.css';

function ErrorPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const errorMessage = location.state?.message;

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="error-page">
      <div className="error-container">
        <div className="error-title">Oops!</div>
        <div className="error-subtitle">
          {errorMessage === 'unauthorized' ? 'Unauthorized Access' : 'Page Not Found'}
        </div>
        <div className="error-message">
          {errorMessage === 'unauthorized'
            ? 'You must be logged in to access this page.'
            : 'The page you’re looking for doesn’t exist.'}
        </div>
        <button className="back-button" onClick={goToLogin}>
          Go to Login
        </button>
      </div>
    </div>
  );
}

export default ErrorPage;
