const express = require("express");
const { authenticate, authorize, optionalAuth } = require("../middleware/auth");
const AuthService = require("../services/authService");
const PetService = require("../services/petService");
const AppointmentService = require("../services/appointmentService");
const MedicalRecordService = require("../services/medicalRecordService");
const PrescriptionService = require("../services/prescriptionService");
const ClinicService = require("../services/clinicService");

const router = express.Router();

// ============================================================================
// AUTHENTICATION ROUTES
// ============================================================================

// Register new user
router.post("/auth/register", async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone, role } = req.body;

    const result = await AuthService.register({
      email,
      password,
      firstName,
      lastName,
      phone,
      role,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// Login user
router.post("/auth/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await AuthService.login(email, password);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// Get user profile
router.get("/auth/profile", authenticate, async (req, res, next) => {
  try {
    const profile = await AuthService.getProfile(req.user.userId);

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// PET ROUTES
// ============================================================================

// Get all pets for authenticated user
router.get("/pets", authenticate, async (req, res, next) => {
  try {
    const pets = await PetService.getPetsByOwner(req.user.userId);

    res.status(200).json({
      success: true,
      data: pets,
    });
  } catch (error) {
    next(error);
  }
});

// Create new pet
router.post("/pets", authenticate, async (req, res, next) => {
  try {
    const pet = await PetService.createPet(req.user.userId, req.body);

    res.status(201).json({
      success: true,
      message: "Pet created successfully",
      data: pet,
    });
  } catch (error) {
    next(error);
  }
});

// Get pet by ID
router.get("/pets/:id", authenticate, async (req, res, next) => {
  try {
    const pet = await PetService.getPetById(req.params.id, req.user.userId);

    res.status(200).json({
      success: true,
      data: pet,
    });
  } catch (error) {
    next(error);
  }
});

// Update pet
router.put("/pets/:id", authenticate, async (req, res, next) => {
  try {
    const pet = await PetService.updatePet(
      req.params.id,
      req.user.userId,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Pet updated successfully",
      data: pet,
    });
  } catch (error) {
    next(error);
  }
});

// Delete pet
router.delete("/pets/:id", authenticate, async (req, res, next) => {
  try {
    const result = await PetService.deletePet(req.params.id, req.user.userId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// APPOINTMENT ROUTES
// ============================================================================

// Get appointments for user's pets
router.get("/appointments", authenticate, async (req, res, next) => {
  try {
    const { petId } = req.query;

    if (petId) {
      const appointments = await AppointmentService.getAppointmentsByPet(
        petId,
        req.user.userId,
      );
      res.status(200).json({
        success: true,
        data: appointments,
      });
    } else {
      // Get all appointments for user's pets
      const pets = await PetService.getPetsByOwner(req.user.userId);
      const allAppointments = [];

      for (const pet of pets) {
        const appointments = await AppointmentService.getAppointmentsByPet(
          pet.id,
          req.user.userId,
        );
        allAppointments.push(...appointments);
      }

      // Sort by appointment date
      allAppointments.sort(
        (a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate),
      );

      res.status(200).json({
        success: true,
        data: allAppointments,
      });
    }
  } catch (error) {
    next(error);
  }
});

// Create appointment
router.post("/appointments", authenticate, async (req, res, next) => {
  try {
    const appointment = await AppointmentService.createAppointment(
      req.user.userId,
      req.body,
    );

    res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
});

// Get appointment by ID
router.get("/appointments/:id", authenticate, async (req, res, next) => {
  try {
    const appointment = await AppointmentService.getAppointmentById(
      req.params.id,
      req.user.userId,
      req.user.role,
    );

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
});

// Update appointment status (doctors and staff only)
router.put(
  "/appointments/:id/status",
  authenticate,
  authorize("veterinarian", "staff", "admin"),
  async (req, res, next) => {
    try {
      const { status, notes } = req.body;
      const appointment = await AppointmentService.updateAppointmentStatus(
        req.params.id,
        status,
        req.user.userId,
        req.user.role,
        notes,
      );

      res.status(200).json({
        success: true,
        message: "Appointment status updated successfully",
        data: appointment,
      });
    } catch (error) {
      next(error);
    }
  },
);

// ============================================================================
// MEDICAL RECORD ROUTES
// ============================================================================

// Get medical records for user's pets
router.get("/medical-records", authenticate, async (req, res, next) => {
  try {
    const { petId } = req.query;

    if (petId) {
      const records = await MedicalRecordService.getMedicalRecordsByPet(
        petId,
        req.user.userId,
      );
      res.status(200).json({
        success: true,
        data: records,
      });
    } else {
      // Get all medical records for user's pets
      const pets = await PetService.getPetsByOwner(req.user.userId);
      const allRecords = [];

      for (const pet of pets) {
        const records = await MedicalRecordService.getMedicalRecordsByPet(
          pet.id,
          req.user.userId,
        );
        allRecords.push(...records);
      }

      // Sort by record date
      allRecords.sort(
        (a, b) => new Date(b.recordDate) - new Date(a.recordDate),
      );

      res.status(200).json({
        success: true,
        data: allRecords,
      });
    }
  } catch (error) {
    next(error);
  }
});

// Create medical record (doctors only)
router.post(
  "/medical-records",
  authenticate,
  authorize("veterinarian", "admin"),
  async (req, res, next) => {
    try {
      const record = await MedicalRecordService.createMedicalRecord(
        req.user.userId,
        req.body,
      );

      res.status(201).json({
        success: true,
        message: "Medical record created successfully",
        data: record,
      });
    } catch (error) {
      next(error);
    }
  },
);

// Get medical record by ID
router.get("/medical-records/:id", authenticate, async (req, res, next) => {
  try {
    const record = await MedicalRecordService.getMedicalRecordById(
      req.params.id,
      req.user.userId,
      req.user.role,
    );

    res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    next(error);
  }
});

// Update medical record (doctors only)
router.put(
  "/medical-records/:id",
  authenticate,
  authorize("veterinarian", "admin"),
  async (req, res, next) => {
    try {
      const record = await MedicalRecordService.updateMedicalRecord(
        req.params.id,
        req.user.userId,
        req.body,
      );

      res.status(200).json({
        success: true,
        message: "Medical record updated successfully",
        data: record,
      });
    } catch (error) {
      next(error);
    }
  },
);

// ============================================================================
// PRESCRIPTION ROUTES
// ============================================================================

// Get prescriptions for user's pets
router.get("/prescriptions", authenticate, async (req, res, next) => {
  try {
    const { petId, active } = req.query;

    if (petId) {
      const prescriptions =
        active === "true"
          ? await PrescriptionService.getActivePrescriptionsByPet(
              petId,
              req.user.userId,
            )
          : await PrescriptionService.getPrescriptionsByPet(
              petId,
              req.user.userId,
            );

      res.status(200).json({
        success: true,
        data: prescriptions,
      });
    } else {
      // Get all prescriptions for user's pets
      const pets = await PetService.getPetsByOwner(req.user.userId);
      const allPrescriptions = [];

      for (const pet of pets) {
        const prescriptions = await PrescriptionService.getPrescriptionsByPet(
          pet.id,
          req.user.userId,
        );
        allPrescriptions.push(...prescriptions);
      }

      // Sort by prescribed date
      allPrescriptions.sort(
        (a, b) => new Date(b.prescribedDate) - new Date(a.prescribedDate),
      );

      res.status(200).json({
        success: true,
        data: allPrescriptions,
      });
    }
  } catch (error) {
    next(error);
  }
});

// Create prescription (doctors only)
router.post(
  "/prescriptions",
  authenticate,
  authorize("veterinarian", "admin"),
  async (req, res, next) => {
    try {
      const prescription = await PrescriptionService.createPrescription(
        req.user.userId,
        req.body,
      );

      res.status(201).json({
        success: true,
        message: "Prescription created successfully",
        data: prescription,
      });
    } catch (error) {
      next(error);
    }
  },
);

// Get prescription by ID
router.get("/prescriptions/:id", authenticate, async (req, res, next) => {
  try {
    const prescription = await PrescriptionService.getPrescriptionById(
      req.params.id,
      req.user.userId,
      req.user.role,
    );

    res.status(200).json({
      success: true,
      data: prescription,
    });
  } catch (error) {
    next(error);
  }
});

// Update prescription refills (doctors only)
router.put(
  "/prescriptions/:id/refills",
  authenticate,
  authorize("veterinarian", "admin"),
  async (req, res, next) => {
    try {
      const { refillsRemaining } = req.body;
      const prescription = await PrescriptionService.updateRefills(
        req.params.id,
        req.user.userId,
        refillsRemaining,
      );

      res.status(200).json({
        success: true,
        message: "Prescription refills updated successfully",
        data: prescription,
      });
    } catch (error) {
      next(error);
    }
  },
);

// ============================================================================
// CLINIC ROUTES
// ============================================================================

// Get all clinics
router.get("/clinics", optionalAuth, async (req, res, next) => {
  try {
    const clinics = await ClinicService.getAllClinics();

    res.status(200).json({
      success: true,
      data: clinics,
    });
  } catch (error) {
    next(error);
  }
});

// Get clinic by ID
router.get("/clinics/:id", optionalAuth, async (req, res, next) => {
  try {
    const clinic = await ClinicService.getClinicById(req.params.id);

    res.status(200).json({
      success: true,
      data: clinic,
    });
  } catch (error) {
    next(error);
  }
});

// Search clinics
router.get("/clinics/search/:term", optionalAuth, async (req, res, next) => {
  try {
    const clinics = await ClinicService.searchClinics(req.params.term);

    res.status(200).json({
      success: true,
      data: clinics,
    });
  } catch (error) {
    next(error);
  }
});

// Get doctors by clinic
router.get("/clinics/:id/doctors", optionalAuth, async (req, res, next) => {
  try {
    const doctors = await ClinicService.getDoctorsByClinic(req.params.id);

    res.status(200).json({
      success: true,
      data: doctors,
    });
  } catch (error) {
    next(error);
  }
});

// Get available doctors
router.get("/doctors/available", optionalAuth, async (req, res, next) => {
  try {
    const { date, time } = req.query;
    const doctors = await ClinicService.getAvailableDoctors(date, time);

    res.status(200).json({
      success: true,
      data: doctors,
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// DASHBOARD ROUTES
// ============================================================================

// Get dashboard data for authenticated user
router.get("/dashboard", authenticate, async (req, res, next) => {
  try {
    const dashboardData = {};

    if (req.user.role === "customer") {
      // Pet owner dashboard
      const pets = await PetService.getPetsByOwner(req.user.userId);
      const upcomingAppointments = [];

      for (const pet of pets.slice(0, 5)) {
        // Limit to avoid too many queries
        const appointments = await AppointmentModel.findByPetId(pet.id);
        const upcoming = appointments.filter(
          (apt) =>
            new Date(apt.appointment_date) > new Date() &&
            ["scheduled", "confirmed"].includes(apt.status),
        );
        upcomingAppointments.push(...upcoming);
      }

      upcomingAppointments.sort(
        (a, b) => new Date(a.appointment_date) - new Date(b.appointment_date),
      );

      dashboardData.pets = pets;
      dashboardData.upcomingAppointments = upcomingAppointments.slice(0, 5);
      dashboardData.totalPets = pets.length;
    } else if (req.user.role === "veterinarian") {
      // Doctor dashboard
      const today = new Date().toISOString().split("T")[0];
      const appointments = await AppointmentService.getAppointmentsByDoctor(
        req.user.userId,
        today,
      );
      const recentRecords =
        await MedicalRecordService.getMedicalRecordsByDoctor(
          req.user.userId,
          5,
        );

      dashboardData.todayAppointments = appointments;
      dashboardData.recentRecords = recentRecords;
      dashboardData.totalAppointments = appointments.length;
    } else if (req.user.role === "admin" || req.user.role === "staff") {
      // Admin/Staff dashboard
      const upcomingAppointments =
        await AppointmentService.getUpcomingAppointments(10);
      const clinics = await ClinicService.getAllClinics();

      dashboardData.upcomingAppointments = upcomingAppointments;
      dashboardData.clinics = clinics;
      dashboardData.totalClinics = clinics.length;
    }

    res.status(200).json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
