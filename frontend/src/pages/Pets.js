import React, { useState } from "react";
import { Link } from "react-router-dom";
import { usePets } from "../contexts/PetContext";
import "./Pets.css";

const Pets = () => {
  const { pets, loading, error, addPet } = usePets();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    dateOfBirth: "",
    weight: "",
    gender: "",
    microchipNumber: "",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");

    const result = await addPet(formData);

    if (result.success) {
      setFormData({
        name: "",
        species: "",
        breed: "",
        dateOfBirth: "",
        weight: "",
        gender: "",
        microchipNumber: "",
      });
      setShowAddForm(false);
    } else {
      setFormError(result.error);
    }

    setFormLoading(false);
  };

  if (loading) {
    return <div className="loading">Loading pets...</div>;
  }

  return (
    <div className="pets-page">
      <div className="page-header">
        <h1>My Pets</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-primary"
        >
          {showAddForm ? "Cancel" : "Add New Pet"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showAddForm && (
        <div className="add-pet-form">
          <h2>Add New Pet</h2>
          <form onSubmit={handleSubmit}>
            {formError && <div className="error-message">{formError}</div>}

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Pet Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter pet name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="species">Species *</label>
                <select
                  id="species"
                  name="species"
                  value={formData.species}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select species</option>
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Bird">Bird</option>
                  <option value="Rabbit">Rabbit</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="breed">Breed</label>
                <input
                  type="text"
                  id="breed"
                  name="breed"
                  value={formData.breed}
                  onChange={handleInputChange}
                  placeholder="Enter breed"
                />
              </div>

              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="dateOfBirth">Date of Birth</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="weight">Weight (kg)</label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  step="0.1"
                  placeholder="Enter weight"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="microchipNumber">Microchip Number</label>
              <input
                type="text"
                id="microchipNumber"
                name="microchipNumber"
                value={formData.microchipNumber}
                onChange={handleInputChange}
                placeholder="Enter microchip number (if applicable)"
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={formLoading}
              >
                {formLoading ? "Adding Pet..." : "Add Pet"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="pets-grid">
        {pets.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🐾</div>
            <h3>No pets yet</h3>
            <p>Start by adding your first pet to the system.</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn btn-primary"
            >
              Add Your First Pet
            </button>
          </div>
        ) : (
          pets.map((pet) => (
            <div key={pet.id} className="pet-card">
              <div className="pet-header">
                <div className="pet-avatar">
                  {pet.species === "Dog"
                    ? "🐕"
                    : pet.species === "Cat"
                      ? "🐱"
                      : pet.species === "Bird"
                        ? "🐦"
                        : pet.species === "Rabbit"
                          ? "🐰"
                          : "🐾"}
                </div>
                <div className="pet-basic-info">
                  <h3>{pet.name}</h3>
                  <p className="pet-species">{pet.species}</p>
                </div>
              </div>

              <div className="pet-details">
                {pet.breed && (
                  <p>
                    <strong>Breed:</strong> {pet.breed}
                  </p>
                )}
                {pet.dateOfBirth && (
                  <p>
                    <strong>Age:</strong>{" "}
                    {new Date().getFullYear() -
                      new Date(pet.dateOfBirth).getFullYear()}{" "}
                    years old
                  </p>
                )}
                {pet.weight && (
                  <p>
                    <strong>Weight:</strong> {pet.weight} kg
                  </p>
                )}
                {pet.gender && (
                  <p>
                    <strong>Gender:</strong> {pet.gender}
                  </p>
                )}
                {pet.microchipNumber && (
                  <p>
                    <strong>Microchip:</strong> {pet.microchipNumber}
                  </p>
                )}
              </div>

              <div className="pet-actions">
                <Link to={`/pets/${pet.id}`} className="btn btn-secondary">
                  View Details
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Pets;
