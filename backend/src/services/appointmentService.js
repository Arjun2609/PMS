const AppointmentModel = require("../models/appointmentModel");
const PetModel = require("../models/petModel");
const { ClinicModel, DoctorModel } = require("../models/clinicModel");
const UserModel = require("../models/userModel");

class AppointmentService {
  static async createAppointment(ownerId, appointmentData) {
    const {
      petId,
      doctorId,
      clinicId,
      appointmentDate,
      durationMinutes = 30,
      reason,
      notes,
    } = appointmentData;

    // Validate required fields
    if (!petId || !doctorId || !clinicId || !appointmentDate) {
      const error = new Error(
        "Pet ID, doctor ID, clinic ID, and appointment date are required",
      );
      error.statusCode = 400;
      throw error;
    }

    // Verify pet ownership
    const pet = await PetModel.findById(petId);
    if (!pet || pet.owner_id !== ownerId) {
      const error = new Error("Pet not found or access denied");
      error.statusCode = 404;
      throw error;
    }

    // Verify doctor exists and is available
    const doctor = await DoctorModel.findByUserId(doctorId);
    if (!doctor || !doctor.is_available) {
      const error = new Error("Doctor not found or not available");
      error.statusCode = 404;
      throw error;
    }

    // Verify clinic exists
    const clinic = await ClinicModel.findById(clinicId);
    if (!clinic) {
      const error = new Error("Clinic not found");
      error.statusCode = 404;
      throw error;
    }

    // Check if appointment date is in the future
    const appointmentDateTime = new Date(appointmentDate);
    if (appointmentDateTime <= new Date()) {
      const error = new Error("Appointment date must be in the future");
      error.statusCode = 400;
      throw error;
    }

    const appointment = await AppointmentModel.create({
      petId,
      doctorId,
      clinicId,
      appointmentDate,
      durationMinutes,
      reason,
      notes,
    });

    return await this.getAppointmentById(appointment.id);
  }

  static async getAppointmentById(
    appointmentId,
    userId = null,
    userRole = null,
  ) {
    const appointment = await AppointmentModel.findById(appointmentId);

    if (!appointment) {
      const error = new Error("Appointment not found");
      error.statusCode = 404;
      throw error;
    }

    // Check access permissions
    if (userId && userRole !== "admin") {
      const hasAccess =
        appointment.owner_id === userId || // Pet owner
        appointment.doctor_id === userId || // Doctor
        (userRole === "staff" &&
          appointment.clinic_id === appointment.clinic_id); // Clinic staff

      if (!hasAccess) {
        const error = new Error("Access denied");
        error.statusCode = 403;
        throw error;
      }
    }

    return {
      id: appointment.id,
      appointmentDate: appointment.appointment_date,
      durationMinutes: appointment.duration_minutes,
      status: appointment.status,
      reason: appointment.reason,
      notes: appointment.notes,
      pet: {
        id: appointment.pet_id,
        name: appointment.pet_name,
        species: appointment.pet_species,
        breed: appointment.pet_breed,
      },
      owner: {
        name: `${appointment.owner_first_name} ${appointment.owner_last_name}`,
        email: appointment.owner_email,
      },
      doctor: {
        name: `${appointment.doctor_first_name} ${appointment.doctor_last_name}`,
      },
      clinic: {
        id: appointment.clinic_id,
        name: appointment.clinic_name,
        address: appointment.clinic_address,
        phone: appointment.clinic_phone,
      },
      createdAt: appointment.created_at,
      updatedAt: appointment.updated_at,
    };
  }

  static async getAppointmentsByPet(petId, ownerId) {
    // Verify pet ownership
    const pet = await PetModel.findById(petId);
    if (!pet || pet.owner_id !== ownerId) {
      const error = new Error("Pet not found or access denied");
      error.statusCode = 404;
      throw error;
    }

    const appointments = await AppointmentModel.findByPetId(petId);

    return appointments.map((apt) => ({
      id: apt.id,
      appointmentDate: apt.appointment_date,
      durationMinutes: apt.duration_minutes,
      status: apt.status,
      reason: apt.reason,
      doctor: {
        name: `${apt.doctor_first_name} ${apt.doctor_last_name}`,
      },
      clinic: {
        name: apt.clinic_name,
        address: apt.clinic_address,
      },
      createdAt: apt.created_at,
    }));
  }

  static async getAppointmentsByDoctor(doctorId, date = null) {
    const appointments = await AppointmentModel.findByDoctorId(doctorId, date);

    return appointments.map((apt) => ({
      id: apt.id,
      appointmentDate: apt.appointment_date,
      durationMinutes: apt.duration_minutes,
      status: apt.status,
      reason: apt.reason,
      pet: {
        id: apt.pet_id,
        name: apt.pet_name,
        species: apt.pet_species,
        breed: apt.pet_breed,
      },
      owner: {
        name: `${apt.owner_first_name} ${apt.owner_last_name}`,
        phone: apt.owner_phone,
      },
      clinic: {
        name: apt.clinic_name,
      },
      createdAt: apt.created_at,
    }));
  }

  static async updateAppointmentStatus(
    appointmentId,
    status,
    userId,
    userRole,
    notes = null,
  ) {
    const appointment = await AppointmentModel.findById(appointmentId);

    if (!appointment) {
      const error = new Error("Appointment not found");
      error.statusCode = 404;
      throw error;
    }

    // Check permissions
    if (userRole !== "admin") {
      const hasPermission =
        appointment.doctor_id === userId || // Doctor
        (userRole === "staff" &&
          appointment.clinic_id === appointment.clinic_id); // Clinic staff

      if (!hasPermission) {
        const error = new Error("Access denied");
        error.statusCode = 403;
        throw error;
      }
    }

    const updatedAppointment = await AppointmentModel.updateStatus(
      appointmentId,
      status,
      notes,
    );
    return await this.getAppointmentById(appointmentId, userId, userRole);
  }

  static async getUpcomingAppointments(limit = 10) {
    const appointments = await AppointmentModel.getUpcoming(limit);

    return appointments.map((apt) => ({
      id: apt.id,
      appointmentDate: apt.appointment_date,
      status: apt.status,
      pet: {
        name: apt.pet_name,
        species: apt.pet_species,
      },
      owner: {
        name: `${apt.owner_first_name} ${apt.owner_last_name}`,
      },
      doctor: {
        name: `${apt.doctor_first_name} ${apt.doctor_last_name}`,
      },
      clinic: {
        name: apt.clinic_name,
      },
    }));
  }
}

module.exports = AppointmentService;
