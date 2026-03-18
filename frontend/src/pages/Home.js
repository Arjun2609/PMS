import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Home.css";

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const [stats, setStats] = useState({ pets: 0, appointments: 0, clinics: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Simulate loading stats with animation
    const timer = setTimeout(() => {
      setStats({ pets: 1250, appointments: 3400, clinics: 85 });
    }, 1000);

    // Trigger animations on mount
    setIsVisible(true);

    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: "📅",
      title: "Easy Scheduling",
      description:
        "Book appointments with trusted veterinarians in just a few clicks.",
      delay: 0,
    },
    {
      icon: "📋",
      title: "Health Records",
      description:
        "Keep all your pet's medical records organized and accessible.",
      delay: 1,
    },
    {
      icon: "💊",
      title: "Prescription Management",
      description: "Track medications and refills with automated reminders.",
      delay: 2,
    },
    {
      icon: "🏥",
      title: "Clinic Directory",
      description: "Find and connect with veterinary clinics in your area.",
      delay: 3,
    },
    {
      icon: "👨‍⚕️",
      title: "Expert Care",
      description: "Access certified veterinarians and specialists.",
      delay: 4,
    },
    {
      icon: "📱",
      title: "Mobile Friendly",
      description: "Manage your pet's health on the go with our mobile app.",
      delay: 5,
    },
  ];

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to PetCare</h1>
          <p>Your comprehensive pet healthcare management platform</p>

          {!isAuthenticated ? (
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary">
                Get Started
              </Link>
              <Link to="/login" className="btn btn-secondary">
                Sign In
              </Link>
            </div>
          ) : (
            <div className="hero-actions">
              <Link to="/dashboard" className="btn btn-primary">
                Go to Dashboard
              </Link>
              {user?.role === "customer" && (
                <Link to="/book-appointment" className="btn btn-secondary">
                  Book Appointment
                </Link>
              )}
            </div>
          )}

          <div className="interactive-demo">
            <div className="demo-stats">
              <div className="stat-item">
                <span className="stat-number">
                  {stats.pets.toLocaleString()}+
                </span>
                <span className="stat-label">Happy Pets</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">
                  {stats.appointments.toLocaleString()}+
                </span>
                <span className="stat-label">Appointments</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{stats.clinics}+</span>
                <span className="stat-label">Clinics</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Why Choose PetCare?</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card"
                style={{ "--i": feature.delay }}
                onClick={() => {
                  // Add click animation
                  const card = event.currentTarget;
                  card.style.transform = "scale(0.95)";
                  setTimeout(() => {
                    card.style.transform = "";
                  }, 150);
                }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Ready to Get Started?</h2>
          <p>
            Join thousands of pet owners who trust PetCare for their pet's
            healthcare needs.
          </p>
          {!isAuthenticated && (
            <Link to="/register" className="btn btn-primary btn-large">
              Create Your Account Today
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
