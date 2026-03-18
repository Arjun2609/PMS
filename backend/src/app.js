const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const errorHandler = require("./middleware/errorHandler");
const apiRoutes = require("./routes/apiRoutes");

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Pet Management System API is running",
    timestamp: new Date().toISOString(),
  });
});

// Welcome endpoint
app.get("/api", (req, res) => {
  res.status(200).json({
    name: "Pet Management System API",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      auth: {
        register: "POST /api/auth/register",
        login: "POST /api/auth/login",
        profile: "GET /api/auth/profile",
      },
      pets: "GET/POST /api/pets",
      appointments: "GET/POST /api/appointments",
      medicalRecords: "GET/POST /api/medical-records",
      prescriptions: "GET/POST /api/prescriptions",
      clinics: "GET /api/clinics",
      dashboard: "GET /api/dashboard",
    },
  });
});

// API Routes
app.use("/api", apiRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.path,
    method: req.method,
  });
});

// Error handler middleware
app.use(errorHandler);

module.exports = app;
