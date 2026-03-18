const PetModel = require("../models/petModel");
const UserModel = require("../models/userModel");

class PetService {
  static async createPet(ownerId, petData) {
    const {
      name,
      species,
      breed,
      dateOfBirth,
      weight,
      gender,
      microchipNumber,
    } = petData;

    // Validate required fields
    if (!name || !species) {
      const error = new Error("Pet name and species are required");
      error.statusCode = 400;
      throw error;
    }

    // Verify owner exists
    const owner = await UserModel.findById(ownerId);
    if (!owner) {
      const error = new Error("Owner not found");
      error.statusCode = 404;
      throw error;
    }

    // Check if microchip number is unique (if provided)
    if (microchipNumber) {
      // This would need a query to check uniqueness
    }

    const pet = await PetModel.create({
      ownerId,
      name,
      species,
      breed,
      dateOfBirth,
      weight,
      gender,
      microchipNumber,
    });

    return {
      id: pet.id,
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      dateOfBirth: pet.date_of_birth,
      weight: pet.weight,
      gender: pet.gender,
      microchipNumber: pet.microchip_number,
      ownerName: `${pet.owner_first_name} ${pet.owner_last_name}`,
      createdAt: pet.created_at,
    };
  }

  static async getPetById(petId, ownerId = null) {
    const pet = await PetModel.findById(petId);

    if (!pet) {
      const error = new Error("Pet not found");
      error.statusCode = 404;
      throw error;
    }

    // If ownerId is provided, check ownership
    if (ownerId && pet.owner_id !== ownerId) {
      const error = new Error("Access denied");
      error.statusCode = 403;
      throw error;
    }

    return {
      id: pet.id,
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      color: pet.color,
      dateOfBirth: pet.date_of_birth,
      weight: pet.weight,
      gender: pet.gender,
      microchipNumber: pet.microchip_number,
      isActive: pet.is_active,
      owner: {
        id: pet.owner_id,
        name: `${pet.owner_first_name} ${pet.owner_last_name}`,
        email: pet.owner_email,
      },
      createdAt: pet.created_at,
      updatedAt: pet.updated_at,
    };
  }

  static async getPetsByOwner(ownerId) {
    const pets = await PetModel.findByOwnerId(ownerId);

    return pets.map((pet) => ({
      id: pet.id,
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      dateOfBirth: pet.date_of_birth,
      weight: pet.weight,
      gender: pet.gender,
      ownerName: `${pet.owner_first_name} ${pet.owner_last_name}`,
      createdAt: pet.created_at,
    }));
  }

  static async updatePet(petId, ownerId, updateData) {
    const pet = await PetModel.findById(petId);

    if (!pet) {
      const error = new Error("Pet not found");
      error.statusCode = 404;
      throw error;
    }

    if (pet.owner_id !== ownerId) {
      const error = new Error("Access denied");
      error.statusCode = 403;
      throw error;
    }

    const updatedPet = await PetModel.update(petId, updateData);

    if (!updatedPet) {
      const error = new Error("No changes made");
      error.statusCode = 400;
      throw error;
    }

    return await this.getPetById(petId, ownerId);
  }

  static async deletePet(petId, ownerId) {
    const pet = await PetModel.findById(petId);

    if (!pet) {
      const error = new Error("Pet not found");
      error.statusCode = 404;
      throw error;
    }

    if (pet.owner_id !== ownerId) {
      const error = new Error("Access denied");
      error.statusCode = 403;
      throw error;
    }

    await PetModel.delete(petId);
    return { message: "Pet deleted successfully" };
  }

  static async searchPets(searchTerm, species = null, limit = 20) {
    const pets = await PetModel.search(searchTerm, species, limit);

    return pets.map((pet) => ({
      id: pet.id,
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      ownerName: `${pet.owner_first_name} ${pet.owner_last_name}`,
      createdAt: pet.created_at,
    }));
  }
}

module.exports = PetService;
