import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { usePets } from "../contexts/PetContext";
import { useAppointments } from "../contexts/AppointmentContext";
import { dashboardAPI } from "../services/api";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();
  const { pets } = usePets();
  const { appointments, getUpcomingAppointments } = useAppointments();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await dashboardAPI.getDashboard();
        setDashboardData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const upcomingAppointments = getUpcomingAppointments().slice(0, 3);

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user.firstName}!</h1>
        <p>Here's an overview of your pet care activities</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">🐾</div>
          <div className="stat-info">
            <h3>{pets.length}</h3>
            <p>Total Pets</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <h3>{upcomingAppointments.length}</h3>
            <p>Upcoming Appointments</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <h3>{dashboardData?.recentRecords?.length || 0}</h3>
            <p>Recent Records</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💊</div>
          <div className="stat-info">
            <h3>{dashboardData?.activePrescriptions?.length || 0}</h3>
            <p>Active Prescriptions</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <div className="section-header">
            <h2>My Pets</h2>
            <Link to="/pets" className="view-all-link">
              View All Pets
            </Link>
          </div>

          {pets.length === 0 ? (
            <div className="empty-state">
              <p>You haven't added any pets yet.</p>
              <Link to="/pets" className="btn btn-primary">
                Add Your First Pet
              </Link>
            </div>
          ) : (
            <div className="pets-grid">
              {pets.slice(0, 3).map((pet) => (
                <div key={pet.id} className="pet-card">
                  <div className="pet-avatar">
                    {pet.species === "Dog"
                      ? "🐕"
                      : pet.species === "Cat"
                        ? "🐱"
                        : "🐾"}
                  </div>
                  <div className="pet-info">
                    <h3>{pet.name}</h3>
                    <p>
                      {pet.species} • {pet.breed}
                    </p>
                    <Link to={`/pets/${pet.id}`} className="pet-link">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2>Upcoming Appointments</h2>
            <Link to="/appointments" className="view-all-link">
              View All Appointments
            </Link>
          </div>

          {upcomingAppointments.length === 0 ? (
            <div className="empty-state">
              <p>No upcoming appointments.</p>
              <Link to="/book-appointment" className="btn btn-primary">
                Book an Appointment
              </Link>
            </div>
          ) : (
            <div className="appointments-list">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="appointment-card">
                  <div className="appointment-info">
                    <h3>{appointment.pet?.name}</h3>
                    <p>
                      {new Date(
                        appointment.appointmentDate,
                      ).toLocaleDateString()}{" "}
                      at{" "}
                      {new Date(
                        appointment.appointmentDate,
                      ).toLocaleTimeString()}
                    </p>
                    <p>
                      {appointment.doctor?.name} • {appointment.clinic?.name}
                    </p>
                  </div>
                  <div className="appointment-status">
                    <span
                      className={`status-badge status-${appointment.status}`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dashboard-actions">
          <Link to="/book-appointment" className="action-card">
            <div className="action-icon">📅</div>
            <h3>Book Appointment</h3>
            <p>Schedule a visit with a veterinarian</p>
          </Link>

          <Link to="/pets" className="action-card">
            <div className="action-icon">🐾</div>
            <h3>Manage Pets</h3>
            <p>Add or update your pet's information</p>
          </Link>

          <Link to="/medical-records" className="action-card">
            <div className="action-icon">📋</div>
            <h3>Medical Records</h3>
            <p>View your pet's health history</p>
          </Link>

          <Link to="/prescriptions" className="action-card">
            <div className="action-icon">💊</div>
            <h3>Prescriptions</h3>
            <p>Track medications and refills</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
