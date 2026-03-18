import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { clinicAPI } from "../services/api";
import "./Clinics.css";

const Clinics = () => {
  const [clinics, setClinics] = useState([]);
  const [filteredClinics, setFilteredClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("");

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const response = await clinicAPI.getClinics();
        setClinics(response.data.data);
        setFilteredClinics(response.data.data);
      } catch (error) {
        setError("Failed to load clinics");
        console.error("Failed to fetch clinics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClinics();
  }, []);

  useEffect(() => {
    let filtered = clinics;

    if (searchTerm) {
      filtered = filtered.filter(
        (clinic) =>
          clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          clinic.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          clinic.state.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (selectedState) {
      filtered = filtered.filter((clinic) => clinic.state === selectedState);
    }

    setFilteredClinics(filtered);
  }, [searchTerm, selectedState, clinics]);

  const states = [...new Set(clinics.map((clinic) => clinic.state))].sort();

  if (loading) {
    return <div className="loading">Loading clinics...</div>;
  }

  return (
    <div className="clinics-page">
      <div className="page-header">
        <h1>Veterinary Clinics</h1>
        <p>Find trusted veterinary care near you</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="filters-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search clinics by name, city, or state..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="state-filter">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="state-select"
          >
            <option value="">All States</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="clinics-results">
        <div className="results-header">
          <p>
            {filteredClinics.length} clinic
            {filteredClinics.length !== 1 ? "s" : ""} found
          </p>
        </div>

        <div className="clinics-grid">
          {filteredClinics.map((clinic) => (
            <div key={clinic.id} className="clinic-card">
              <div className="clinic-header">
                <h3>{clinic.name}</h3>
                <div className="clinic-rating">
                  <span className="rating-stars">⭐⭐⭐⭐⭐</span>
                  <span className="rating-text">4.8 (120 reviews)</span>
                </div>
              </div>

              <div className="clinic-address">
                <p>{clinic.address}</p>
                <p>
                  {clinic.city}, {clinic.state} {clinic.postalCode}
                </p>
              </div>

              <div className="clinic-contact">
                <p>📞 {clinic.phone}</p>
                {clinic.email && <p>✉️ {clinic.email}</p>}
              </div>

              <div className="clinic-details">
                <div className="detail-item">
                  <span className="detail-icon">👨‍⚕️</span>
                  <span>
                    {clinic.doctorCount} veterinarian
                    {clinic.doctorCount !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="detail-item">
                  <span className="detail-icon">🕒</span>
                  <span>
                    {clinic.openingTime} - {clinic.closingTime}
                  </span>
                </div>
              </div>

              <div className="clinic-services">
                <div className="services-list">
                  <span className="service-tag">Emergency Care</span>
                  <span className="service-tag">Surgery</span>
                  <span className="service-tag">Dental</span>
                  <span className="service-tag">Vaccinations</span>
                </div>
              </div>

              <div className="clinic-actions">
                <Link
                  to={`/clinics/${clinic.id}`}
                  className="btn btn-secondary"
                >
                  View Details
                </Link>
                <button className="btn btn-primary">Book Appointment</button>
              </div>
            </div>
          ))}
        </div>

        {filteredClinics.length === 0 && (
          <div className="no-results">
            <div className="no-results-icon">🏥</div>
            <h3>No clinics found</h3>
            <p>Try adjusting your search criteria or browse all clinics.</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedState("");
              }}
              className="btn btn-primary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Clinics;
