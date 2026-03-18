const { ClinicModel, DoctorModel } = require("../models/clinicModel");

class ClinicService {
  static async getAllClinics() {
    const clinics = await ClinicModel.findAll();

    return clinics.map((clinic) => ({
      id: clinic.id,
      name: clinic.name,
      address: clinic.address,
      city: clinic.city,
      state: clinic.state,
      postalCode: clinic.postal_code,
      phone: clinic.phone,
      email: clinic.email,
      openingTime: clinic.opening_time,
      closingTime: clinic.closing_time,
      doctorCount: parseInt(clinic.doctor_count) || 0,
      isActive: clinic.is_active,
    }));
  }

  static async getClinicById(clinicId) {
    const clinic = await ClinicModel.findById(clinicId);

    if (!clinic) {
      const error = new Error("Clinic not found");
      error.statusCode = 404;
      throw error;
    }

    return {
      id: clinic.id,
      name: clinic.name,
      address: clinic.address,
      city: clinic.city,
      state: clinic.state,
      postalCode: clinic.postal_code,
      phone: clinic.phone,
      email: clinic.email,
      latitude: clinic.latitude,
      longitude: clinic.longitude,
      openingTime: clinic.opening_time,
      closingTime: clinic.closing_time,
      doctorCount: parseInt(clinic.doctor_count) || 0,
      isActive: clinic.is_active,
      createdAt: clinic.created_at,
      updatedAt: clinic.updated_at,
    };
  }

  static async searchClinics(searchTerm) {
    const clinics = await ClinicModel.search(searchTerm);

    return clinics.map((clinic) => ({
      id: clinic.id,
      name: clinic.name,
      address: clinic.address,
      city: clinic.city,
      state: clinic.state,
      phone: clinic.phone,
      doctorCount: parseInt(clinic.doctor_count) || 0,
    }));
  }

  static async getDoctorsByClinic(clinicId) {
    const clinic = await ClinicModel.findById(clinicId);

    if (!clinic) {
      const error = new Error("Clinic not found");
      error.statusCode = 404;
      throw error;
    }

    const doctors = await DoctorModel.findByClinicId(clinicId);

    return doctors.map((doctor) => ({
      id: doctor.id,
      firstName: doctor.first_name,
      lastName: doctor.last_name,
      email: doctor.email,
      phone: doctor.phone,
      licenseNumber: doctor.license_number,
      specialization: doctor.specialization,
      yearsOfExperience: doctor.years_of_experience,
      bio: doctor.bio,
      isAvailable: doctor.is_available,
    }));
  }

  static async getAvailableDoctors(date = null, time = null) {
    const doctors = await DoctorModel.findAvailableDoctors(date, time);

    return doctors.map((doctor) => ({
      id: doctor.id,
      firstName: doctor.first_name,
      lastName: doctor.last_name,
      specialization: doctor.specialization,
      clinic: {
        name: doctor.clinic_name,
        address: doctor.clinic_address,
      },
    }));
  }
}

module.exports = ClinicService;
