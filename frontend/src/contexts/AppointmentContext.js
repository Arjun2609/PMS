import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { api } from "../services/api";

const AppointmentContext = createContext();

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error(
      "useAppointments must be used within an AppointmentProvider",
    );
  }
  return context;
};

export const AppointmentProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch appointments when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user?.role === "customer") {
      fetchAppointments();
    }
  }, [isAuthenticated, user]);

  const fetchAppointments = async (petId = null) => {
    setLoading(true);
    setError(null);

    try {
      const url = petId ? `/appointments?petId=${petId}` : "/appointments";
      const response = await api.get(url);
      setAppointments(response.data.data);
    } catch (error) {
      setError(error.response?.data?.error || "Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  const bookAppointment = async (appointmentData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/appointments", appointmentData);
      const newAppointment = response.data.data;

      setAppointments((prevAppointments) => [
        ...prevAppointments,
        newAppointment,
      ]);
      return { success: true, appointment: newAppointment };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to book appointment";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const getAppointmentById = async (appointmentId) => {
    try {
      const response = await api.get(`/appointments/${appointmentId}`);
      return response.data.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch appointment",
      );
    }
  };

  const getUpcomingAppointments = () => {
    const now = new Date();
    return appointments
      .filter((apt) => new Date(apt.appointmentDate) > now)
      .sort(
        (a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate),
      );
  };

  const getPastAppointments = () => {
    const now = new Date();
    return appointments
      .filter((apt) => new Date(apt.appointmentDate) <= now)
      .sort(
        (a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate),
      );
  };

  const value = {
    appointments,
    loading,
    error,
    fetchAppointments,
    bookAppointment,
    getAppointmentById,
    getUpcomingAppointments,
    getPastAppointments,
    clearError: () => setError(null),
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
};
