import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { PetProvider } from "./contexts/PetContext";
import { AppointmentProvider } from "./contexts/AppointmentContext";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Pets from "./pages/Pets";
import PetDetails from "./pages/PetDetails";
import Appointments from "./pages/Appointments";
import AppointmentDetails from "./pages/AppointmentDetails";
import MedicalRecords from "./pages/MedicalRecords";
import MedicalRecordDetails from "./pages/MedicalRecordDetails";
import Prescriptions from "./pages/Prescriptions";
import PrescriptionDetails from "./pages/PrescriptionDetails";
import Clinics from "./pages/Clinics";
import ClinicDetails from "./pages/ClinicDetails";
import BookAppointment from "./pages/BookAppointment";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDashboard from "./pages/AdminDashboard";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// App Router Component
const AppRouter = () => {
  const { user } = useAuth();

  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/clinics" element={<Clinics />} />
            <Route path="/clinics/:id" element={<ClinicDetails />} />

            {/* Protected Routes - All authenticated users */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Pet Owner Routes */}
            <Route
              path="/pets"
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <Pets />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pets/:id"
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <PetDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointments"
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <Appointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointments/:id"
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <AppointmentDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/book-appointment"
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <BookAppointment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medical-records"
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <MedicalRecords />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medical-records/:id"
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <MedicalRecordDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/prescriptions"
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <Prescriptions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/prescriptions/:id"
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <PrescriptionDetails />
                </ProtectedRoute>
              }
            />

            {/* Doctor Routes */}
            <Route
              path="/doctor/dashboard"
              element={
                <ProtectedRoute allowedRoles={["veterinarian"]}>
                  <DoctorDashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin", "staff"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

// Main App Component
function App() {
  return (
    <AuthProvider>
      <PetProvider>
        <AppointmentProvider>
          <AppRouter />
        </AppointmentProvider>
      </PetProvider>
    </AuthProvider>
  );
}

export default App;
