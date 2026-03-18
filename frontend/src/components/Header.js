import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Header.css";

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/" className="logo-link">
            <span className="logo-icon">🐾</span>
            <span className="logo-text">PetCare</span>
          </Link>
        </div>

        <nav className="nav">
          <ul className="nav-list">
            <li>
              <Link to="/clinics" className="nav-link">
                Clinics
              </Link>
            </li>

            {isAuthenticated && user?.role === "customer" && (
              <>
                <li>
                  <Link to="/dashboard" className="nav-link">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/pets" className="nav-link">
                    My Pets
                  </Link>
                </li>
                <li>
                  <Link to="/appointments" className="nav-link">
                    Appointments
                  </Link>
                </li>
                <li>
                  <Link to="/book-appointment" className="nav-link">
                    Book Appointment
                  </Link>
                </li>
              </>
            )}

            {isAuthenticated && user?.role === "veterinarian" && (
              <>
                <li>
                  <Link to="/doctor/dashboard" className="nav-link">
                    Doctor Dashboard
                  </Link>
                </li>
              </>
            )}

            {isAuthenticated &&
              (user?.role === "admin" || user?.role === "staff") && (
                <>
                  <li>
                    <Link to="/admin/dashboard" className="nav-link">
                      Admin Dashboard
                    </Link>
                  </li>
                </>
              )}
          </ul>
        </nav>

        <div className="auth-section">
          {isAuthenticated ? (
            <div className="user-menu">
              <span className="user-greeting">Hello, {user.firstName}!</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="auth-link">
                Login
              </Link>
              <Link to="/register" className="auth-link register-link">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
