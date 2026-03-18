const PrescriptionModel = require("../models/prescriptionModel");
const MedicalRecordModel = require("../models/medicalRecordModel");
const PetModel = require("../models/petModel");

class PrescriptionService {
  static async createPrescription(doctorId, prescriptionData) {
    const {
      medicalRecordId,
      petId,
      medicationName,
      dosage,
      frequency,
      durationDays,
      quantity,
      unit,
      instructions,
    } = prescriptionData;

    // Validate required fields
    if (
      !medicalRecordId ||
      !petId ||
      !medicationName ||
      !dosage ||
      !frequency ||
      !quantity ||
      !unit
    ) {
      const error = new Error(
        "Medical record ID, pet ID, medication name, dosage, frequency, quantity, and unit are required",
      );
      error.statusCode = 400;
      throw error;
    }

    // Verify medical record exists and doctor has access
    const medicalRecord = await MedicalRecordModel.findById(medicalRecordId);
    if (!medicalRecord) {
      const error = new Error("Medical record not found");
      error.statusCode = 404;
      throw error;
    }

    if (medicalRecord.doctor_id !== doctorId) {
      const error = new Error("Access denied");
      error.statusCode = 403;
      throw error;
    }

    // Verify pet matches medical record
    if (medicalRecord.pet_id !== petId) {
      const error = new Error("Pet ID does not match medical record");
      error.statusCode = 400;
      throw error;
    }

    const prescription = await PrescriptionModel.create({
      medicalRecordId,
      petId,
      doctorId,
      medicationName,
      dosage,
      frequency,
      durationDays,
      quantity,
      unit,
      instructions,
    });

    return await this.getPrescriptionById(prescription.id);
  }

  static async getPrescriptionById(
    prescriptionId,
    userId = null,
    userRole = null,
  ) {
    const prescription = await PrescriptionModel.findById(prescriptionId);

    if (!prescription) {
      const error = new Error("Prescription not found");
      error.statusCode = 404;
      throw error;
    }

    // Check access permissions
    if (userId && userRole !== "admin") {
      const pet = await PetModel.findById(prescription.pet_id);
      const hasAccess =
        pet.owner_id === userId || // Pet owner
        prescription.doctor_id === userId || // Prescribing doctor
        userRole === "staff"; // Clinic staff

      if (!hasAccess) {
        const error = new Error("Access denied");
        error.statusCode = 403;
        throw error;
      }
    }

    return {
      id: prescription.id,
      medicationName: prescription.medication_name,
      dosage: prescription.dosage,
      frequency: prescription.frequency,
      durationDays: prescription.duration_days,
      quantity: prescription.quantity,
      unit: prescription.unit,
      instructions: prescription.instructions,
      refillsRemaining: prescription.refills_remaining,
      isActive: prescription.is_active,
      prescribedDate: prescription.prescribed_date,
      expiryDate: prescription.expiry_date,
      pet: {
        id: prescription.pet_id,
        name: prescription.pet_name,
        species: prescription.pet_species,
      },
      owner: {
        name: `${prescription.owner_first_name} ${prescription.owner_last_name}`,
      },
      doctor: {
        name: `${prescription.doctor_first_name} ${prescription.doctor_last_name}`,
      },
      medicalRecord: {
        id: prescription.medical_record_id,
        diagnosis: prescription.diagnosis,
        recordDate: prescription.record_date,
      },
      createdAt: prescription.created_at,
      updatedAt: prescription.updated_at,
    };
  }

  static async getPrescriptionsByPet(petId, ownerId) {
    // Verify pet ownership
    const pet = await PetModel.findById(petId);
    if (!pet || pet.owner_id !== ownerId) {
      const error = new Error("Pet not found or access denied");
      error.statusCode = 404;
      throw error;
    }

    const prescriptions = await PrescriptionModel.findByPetId(petId);

    return prescriptions.map((prescription) => ({
      id: prescription.id,
      medicationName: prescription.medication_name,
      dosage: prescription.dosage,
      frequency: prescription.frequency,
      durationDays: prescription.duration_days,
      quantity: prescription.quantity,
      unit: prescription.unit,
      instructions: prescription.instructions,
      refillsRemaining: prescription.refills_remaining,
      isActive: prescription.is_active,
      prescribedDate: prescription.prescribed_date,
      doctor: {
        name: `${prescription.doctor_first_name} ${prescription.doctor_last_name}`,
      },
      medicalRecord: {
        diagnosis: prescription.diagnosis,
        recordDate: prescription.record_date,
      },
      createdAt: prescription.created_at,
    }));
  }

  static async getActivePrescriptionsByPet(petId, ownerId) {
    // Verify pet ownership
    const pet = await PetModel.findById(petId);
    if (!pet || pet.owner_id !== ownerId) {
      const error = new Error("Pet not found or access denied");
      error.statusCode = 404;
      throw error;
    }

    const prescriptions = await PrescriptionModel.findActiveByPetId(petId);

    return prescriptions.map((prescription) => ({
      id: prescription.id,
      medicationName: prescription.medication_name,
      dosage: prescription.dosage,
      frequency: prescription.frequency,
      durationDays: prescription.duration_days,
      quantity: prescription.quantity,
      unit: prescription.unit,
      instructions: prescription.instructions,
      refillsRemaining: prescription.refills_remaining,
      prescribedDate: prescription.prescribed_date,
      expiryDate: prescription.expiry_date,
      doctor: {
        name: `${prescription.doctor_first_name} ${prescription.doctor_last_name}`,
      },
    }));
  }

  static async getPrescriptionsByDoctor(doctorId, limit = 50) {
    const prescriptions = await PrescriptionModel.findByDoctorId(
      doctorId,
      limit,
    );

    return prescriptions.map((prescription) => ({
      id: prescription.id,
      medicationName: prescription.medication_name,
      dosage: prescription.dosage,
      frequency: prescription.frequency,
      quantity: prescription.quantity,
      unit: prescription.unit,
      prescribedDate: prescription.prescribed_date,
      pet: {
        id: prescription.pet_id,
        name: prescription.pet_name,
        species: prescription.pet_species,
      },
      owner: {
        name: `${prescription.owner_first_name} ${prescription.owner_last_name}`,
      },
      createdAt: prescription.created_at,
    }));
  }

  static async updateRefills(prescriptionId, doctorId, refillsRemaining) {
    const prescription = await PrescriptionModel.findById(prescriptionId);

    if (!prescription) {
      const error = new Error("Prescription not found");
      error.statusCode = 404;
      throw error;
    }

    if (prescription.doctor_id !== doctorId) {
      const error = new Error("Access denied");
      error.statusCode = 403;
      throw error;
    }

    const updatedPrescription = await PrescriptionModel.updateRefills(
      prescriptionId,
      refillsRemaining,
    );
    return await this.getPrescriptionById(
      prescriptionId,
      doctorId,
      "veterinarian",
    );
  }

  static async deactivatePrescription(prescriptionId, doctorId) {
    const prescription = await PrescriptionModel.findById(prescriptionId);

    if (!prescription) {
      const error = new Error("Prescription not found");
      error.statusCode = 404;
      throw error;
    }

    if (prescription.doctor_id !== doctorId) {
      const error = new Error("Access denied");
      error.statusCode = 403;
      throw error;
    }

    await PrescriptionModel.deactivate(prescriptionId);
    return { message: "Prescription deactivated successfully" };
  }

  static async getExpiringPrescriptions(days = 30) {
    const prescriptions = await PrescriptionModel.getExpiringSoon(days);

    return prescriptions.map((prescription) => ({
      id: prescription.id,
      medicationName: prescription.medication_name,
      expiryDate: prescription.expiry_date,
      pet: {
        name: prescription.pet_name,
        species: prescription.pet_species,
      },
      owner: {
        name: `${prescription.owner_first_name} ${prescription.owner_last_name}`,
        phone: prescription.owner_phone,
      },
    }));
  }

  static async searchMedications(searchTerm, limit = 20) {
    const medications = await PrescriptionModel.searchMedications(
      searchTerm,
      limit,
    );
    return medications.map((med) => med.medication_name);
  }
}

module.exports = PrescriptionService;
