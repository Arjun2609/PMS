const MedicalRecordModel = require("../models/medicalRecordModel");
const PetModel = require("../models/petModel");
const AppointmentModel = require("../models/appointmentModel");

class MedicalRecordService {
  static async createMedicalRecord(doctorId, recordData) {
    const {
      petId,
      appointmentId,
      clinicId,
      diagnosis,
      symptoms,
      clinicalNotes,
      treatmentPlan,
      followUpDate,
    } = recordData;

    // Validate required fields
    if (!petId || !clinicId || !clinicalNotes) {
      const error = new Error(
        "Pet ID, clinic ID, and clinical notes are required",
      );
      error.statusCode = 400;
      throw error;
    }

    // Verify pet exists
    const pet = await PetModel.findById(petId);
    if (!pet) {
      const error = new Error("Pet not found");
      error.statusCode = 404;
      throw error;
    }

    // Verify appointment exists (if provided)
    if (appointmentId) {
      const appointment = await AppointmentModel.findById(appointmentId);
      if (!appointment) {
        const error = new Error("Appointment not found");
        error.statusCode = 404;
        throw error;
      }
    }

    const record = await MedicalRecordModel.create({
      petId,
      doctorId,
      appointmentId,
      clinicId,
      diagnosis,
      symptoms,
      clinicalNotes,
      treatmentPlan,
      followUpDate,
    });

    return await this.getMedicalRecordById(record.id);
  }

  static async getMedicalRecordById(recordId, userId = null, userRole = null) {
    const record = await MedicalRecordModel.findById(recordId);

    if (!record) {
      const error = new Error("Medical record not found");
      error.statusCode = 404;
      throw error;
    }

    // Check access permissions
    if (userId && userRole !== "admin") {
      const pet = await PetModel.findById(record.pet_id);
      const hasAccess =
        pet.owner_id === userId || // Pet owner
        record.doctor_id === userId || // Doctor who created record
        userRole === "staff"; // Clinic staff

      if (!hasAccess) {
        const error = new Error("Access denied");
        error.statusCode = 403;
        throw error;
      }
    }

    return {
      id: record.id,
      recordDate: record.record_date,
      diagnosis: record.diagnosis,
      symptoms: record.symptoms,
      clinicalNotes: record.clinical_notes,
      treatmentPlan: record.treatment_plan,
      followUpDate: record.follow_up_date,
      isArchived: record.is_archived,
      pet: {
        id: record.pet_id,
        name: record.pet_name,
        species: record.pet_species,
        breed: record.pet_breed,
      },
      owner: {
        name: `${record.owner_first_name} ${record.owner_last_name}`,
      },
      doctor: {
        name: `${record.doctor_first_name} ${record.doctor_last_name}`,
      },
      clinic: {
        id: record.clinic_id,
        name: record.clinic_name,
      },
      createdAt: record.created_at,
      updatedAt: record.updated_at,
    };
  }

  static async getMedicalRecordsByPet(petId, ownerId) {
    // Verify pet ownership
    const pet = await PetModel.findById(petId);
    if (!pet || pet.owner_id !== ownerId) {
      const error = new Error("Pet not found or access denied");
      error.statusCode = 404;
      throw error;
    }

    const records = await MedicalRecordModel.findByPetId(petId);

    return records.map((record) => ({
      id: record.id,
      recordDate: record.record_date,
      diagnosis: record.diagnosis,
      symptoms: record.symptoms,
      clinicalNotes: record.clinical_notes,
      treatmentPlan: record.treatment_plan,
      followUpDate: record.follow_up_date,
      doctor: {
        name: `${record.doctor_first_name} ${record.doctor_last_name}`,
      },
      clinic: {
        name: record.clinic_name,
      },
      createdAt: record.created_at,
    }));
  }

  static async getMedicalRecordsByDoctor(doctorId, limit = 50) {
    const records = await MedicalRecordModel.findByDoctorId(doctorId, limit);

    return records.map((record) => ({
      id: record.id,
      recordDate: record.record_date,
      diagnosis: record.diagnosis,
      clinicalNotes: record.clinical_notes,
      pet: {
        id: record.pet_id,
        name: record.pet_name,
        species: record.pet_species,
        breed: record.pet_breed,
      },
      owner: {
        name: `${record.owner_first_name} ${record.owner_last_name}`,
      },
      createdAt: record.created_at,
    }));
  }

  static async updateMedicalRecord(recordId, doctorId, updateData) {
    const record = await MedicalRecordModel.findById(recordId);

    if (!record) {
      const error = new Error("Medical record not found");
      error.statusCode = 404;
      throw error;
    }

    // Only the doctor who created the record can update it
    if (record.doctor_id !== doctorId) {
      const error = new Error("Access denied");
      error.statusCode = 403;
      throw error;
    }

    const updatedRecord = await MedicalRecordModel.update(recordId, updateData);

    if (!updatedRecord) {
      const error = new Error("No changes made");
      error.statusCode = 400;
      throw error;
    }

    return await this.getMedicalRecordById(recordId, doctorId, "veterinarian");
  }

  static async archiveMedicalRecord(recordId, doctorId) {
    const record = await MedicalRecordModel.findById(recordId);

    if (!record) {
      const error = new Error("Medical record not found");
      error.statusCode = 404;
      throw error;
    }

    if (record.doctor_id !== doctorId) {
      const error = new Error("Access denied");
      error.statusCode = 403;
      throw error;
    }

    await MedicalRecordModel.archive(recordId);
    return { message: "Medical record archived successfully" };
  }

  static async getRecentRecords(limit = 20) {
    const records = await MedicalRecordModel.getRecentRecords(limit);

    return records.map((record) => ({
      id: record.id,
      recordDate: record.record_date,
      diagnosis: record.diagnosis,
      pet: {
        name: record.pet_name,
        species: record.pet_species,
      },
      owner: {
        name: `${record.owner_first_name} ${record.owner_last_name}`,
      },
      doctor: {
        name: `${record.doctor_first_name} ${record.doctor_last_name}`,
      },
      createdAt: record.created_at,
    }));
  }
}

module.exports = MedicalRecordService;
