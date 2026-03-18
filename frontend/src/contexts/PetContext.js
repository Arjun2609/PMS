import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { api } from "../services/api";

const PetContext = createContext();

export const usePets = () => {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error("usePets must be used within a PetProvider");
  }
  return context;
};

export const PetProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch pets when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user?.role === "customer") {
      fetchPets();
    }
  }, [isAuthenticated, user]);

  const fetchPets = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/pets");
      setPets(response.data.data);
    } catch (error) {
      setError(error.response?.data?.error || "Failed to fetch pets");
    } finally {
      setLoading(false);
    }
  };

  const addPet = async (petData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/pets", petData);
      const newPet = response.data.data;
      setPets((prevPets) => [...prevPets, newPet]);
      return { success: true, pet: newPet };
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Failed to add pet";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updatePet = async (petId, updateData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.put(`/pets/${petId}`, updateData);
      const updatedPet = response.data.data;

      setPets((prevPets) =>
        prevPets.map((pet) => (pet.id === petId ? updatedPet : pet)),
      );

      return { success: true, pet: updatedPet };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to update pet";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const deletePet = async (petId) => {
    setLoading(true);
    setError(null);

    try {
      await api.delete(`/pets/${petId}`);
      setPets((prevPets) => prevPets.filter((pet) => pet.id !== petId));
      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to delete pet";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const getPetById = (petId) => {
    return pets.find((pet) => pet.id === petId);
  };

  const value = {
    pets,
    loading,
    error,
    fetchPets,
    addPet,
    updatePet,
    deletePet,
    getPetById,
    clearError: () => setError(null),
  };

  return <PetContext.Provider value={value}>{children}</PetContext.Provider>;
};
