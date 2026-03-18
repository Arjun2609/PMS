import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>🐾 PetCare</h3>
            <p>Your trusted partner in pet healthcare management.</p>
          </div>

          <div className="footer-section">
            <h4>Services</h4>
            <ul>
              <li>Pet Health Records</li>
              <li>Appointment Scheduling</li>
              <li>Prescription Management</li>
              <li>Clinic Directory</li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li>Help Center</li>
              <li>Contact Us</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Connect</h4>
            <div className="social-links">
              <a href="#" className="social-link">
                📧
              </a>
              <a href="#" className="social-link">
                📱
              </a>
              <a href="#" className="social-link">
                🐦
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 PetCare Management System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
