import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePets } from "../contexts/PetContext";
import { useAppointments } from "../contexts/AppointmentContext";
import { clinicAPI } from "../services/api";
import "./BookAppointment.css";

const BookAppointment = () => {
  const { pets } = usePets();
  const { bookAppointment } = useAppointments();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    petId: "",
    clinicId: "",
    doctorId: "",
    appointmentDate: "",
    durationMinutes: 30,
    reason: "",
    notes: "",
  });

  const [clinics, setClinics] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // 1: Select Pet, 2: Select Clinic, 3: Select Doctor, 4: Confirm

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const response = await clinicAPI.getClinics();
        setClinics(response.data.data);
      } catch (error) {
        console.error("Failed to fetch clinics:", error);
      }
    };

    fetchClinics();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Reset dependent fields when parent changes
    if (name === "clinicId") {
      setFormData((prev) => ({
        ...prev,
        doctorId: "",
      }));
      fetchDoctorsForClinic(value);
    }
  };

  const fetchDoctorsForClinic = async (clinicId) => {
    try {
      const response = await clinicAPI.getDoctors(clinicId);
      setDoctors(response.data.data);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    }
  };

  const handleNext = () => {
    if (step === 1 && !formData.petId) {
      setError("Please select a pet");
      return;
    }
    if (step === 2 && !formData.clinicId) {
      setError("Please select a clinic");
      return;
    }
    if (step === 3 && !formData.doctorId) {
      setError("Please select a doctor");
      return;
    }
    if (step === 4) {
      handleSubmit();
      return;
    }

    setError("");
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
    setError("");
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    const result = await bookAppointment(formData);

    if (result.success) {
      navigate("/appointments");
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const selectedPet = pets.find((pet) => pet.id === formData.petId);
  const selectedClinic = clinics.find(
    (clinic) => clinic.id === formData.clinicId,
  );
  const selectedDoctor = doctors.find(
    (doctor) => doctor.id === formData.doctorId,
  );

  return (
    <div className="book-appointment">
      <div className="booking-container">
        <div className="booking-header">
          <h1>Book an Appointment</h1>
          <div className="progress-indicator">
            <div className={`step ${step >= 1 ? "active" : ""}`}>
              <span className="step-number">1</span>
              <span className="step-label">Pet</span>
            </div>
            <div className={`step ${step >= 2 ? "active" : ""}`}>
              <span className="step-number">2</span>
              <span className="step-label">Clinic</span>
            </div>
            <div className={`step ${step >= 3 ? "active" : ""}`}>
              <span className="step-number">3</span>
              <span className="step-label">Doctor</span>
            </div>
            <div className={`step ${step >= 4 ? "active" : ""}`}>
              <span className="step-number">4</span>
              <span className="step-label">Confirm</span>
            </div>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="booking-content">
          {step === 1 && (
            <div className="step-content">
              <h2>Select Your Pet</h2>
              <div className="pet-selection">
                {pets.map((pet) => (
                  <div
                    key={pet.id}
                    className={`pet-option ${formData.petId === pet.id ? "selected" : ""}`}
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, petId: pet.id }))
                    }
                  >
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
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="step-content">
              <h2>Select a Clinic</h2>
              <div className="clinic-selection">
                {clinics.map((clinic) => (
                  <div
                    key={clinic.id}
                    className={`clinic-option ${formData.clinicId === clinic.id ? "selected" : ""}`}
                    onClick={() =>
                      handleInputChange({
                        target: { name: "clinicId", value: clinic.id },
                      })
                    }
                  >
                    <div className="clinic-info">
                      <h3>{clinic.name}</h3>
                      <p>
                        {clinic.address}, {clinic.city}, {clinic.state}
                      </p>
                      <p>📞 {clinic.phone}</p>
                      <p>👨‍⚕️ {clinic.doctorCount} doctors available</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="step-content">
              <h2>Select a Doctor</h2>
              <div className="doctor-selection">
                {doctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className={`doctor-option ${formData.doctorId === doctor.id ? "selected" : ""}`}
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, doctorId: doctor.id }))
                    }
                  >
                    <div className="doctor-info">
                      <h3>
                        Dr. {doctor.firstName} {doctor.lastName}
                      </h3>
                      {doctor.specialization && (
                        <p>Specialty: {doctor.specialization}</p>
                      )}
                      {doctor.yearsOfExperience && (
                        <p>Experience: {doctor.yearsOfExperience} years</p>
                      )}
                      {doctor.bio && <p>{doctor.bio}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="step-content">
              <h2>Confirm Appointment Details</h2>
              <div className="confirmation-details">
                <div className="detail-section">
                  <h3>Pet Information</h3>
                  <p>
                    <strong>Name:</strong> {selectedPet?.name}
                  </p>
                  <p>
                    <strong>Species:</strong> {selectedPet?.species}
                  </p>
                  <p>
                    <strong>Breed:</strong> {selectedPet?.breed}
                  </p>
                </div>

                <div className="detail-section">
                  <h3>Clinic Information</h3>
                  <p>
                    <strong>Clinic:</strong> {selectedClinic?.name}
                  </p>
                  <p>
                    <strong>Address:</strong> {selectedClinic?.address},{" "}
                    {selectedClinic?.city}, {selectedClinic?.state}
                  </p>
                  <p>
                    <strong>Phone:</strong> {selectedClinic?.phone}
                  </p>
                </div>

                <div className="detail-section">
                  <h3>Doctor Information</h3>
                  <p>
                    <strong>Doctor:</strong> Dr. {selectedDoctor?.firstName}{" "}
                    {selectedDoctor?.lastName}
                  </p>
                  {selectedDoctor?.specialization && (
                    <p>
                      <strong>Specialty:</strong>{" "}
                      {selectedDoctor?.specialization}
                    </p>
                  )}
                </div>

                <div className="appointment-form">
                  <div className="form-group">
                    <label htmlFor="appointmentDate">
                      Appointment Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      id="appointmentDate"
                      name="appointmentDate"
                      value={formData.appointmentDate}
                      onChange={handleInputChange}
                      required
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="reason">Reason for Visit</label>
                    <select
                      id="reason"
                      name="reason"
                      value={formData.reason}
                      onChange={handleInputChange}
                    >
                      <option value="">Select reason</option>
                      <option value="Annual Checkup">Annual Checkup</option>
                      <option value="Vaccination">Vaccination</option>
                      <option value="Illness">Illness</option>
                      <option value="Injury">Injury</option>
                      <option value="Dental Care">Dental Care</option>
                      <option value="Surgery">Surgery</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="notes">Additional Notes</label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Any additional information..."
                      rows="3"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="booking-actions">
          {step > 1 && (
            <button onClick={handleBack} className="btn btn-secondary">
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            className="btn btn-primary"
            disabled={loading}
          >
            {step === 4 ? (loading ? "Booking..." : "Confirm Booking") : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
