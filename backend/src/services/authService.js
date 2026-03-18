const UserModel = require("../models/userModel");
const {
  hashPassword,
  comparePassword,
  generateToken,
} = require("../utils/auth");

class AuthService {
  static async register(userData) {
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      role = "customer",
    } = userData;

    // Check if user already exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      const error = new Error("User already exists with this email");
      error.statusCode = 409;
      throw error;
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const newUser = await UserModel.create({
      email,
      passwordHash,
      firstName,
      lastName,
      phone,
      role,
    });

    // Generate token
    const token = generateToken(newUser.id, newUser.role);

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        phone: newUser.phone,
        role: newUser.role,
      },
      token,
    };
  }

  static async login(email, password) {
    // Find user
    const user = await UserModel.findByEmail(email);
    if (!user) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    // Check password
    const isValidPassword = await comparePassword(password, user.password_hash);
    if (!isValidPassword) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    // Check if user is active
    if (!user.is_active) {
      const error = new Error("Account is deactivated");
      error.statusCode = 403;
      throw error;
    }

    // Update last login
    await UserModel.updateLastLogin(user.id);

    // Generate token
    const token = generateToken(user.id, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        role: user.role,
        lastLogin: user.last_login,
      },
      token,
    };
  }

  static async getProfile(userId) {
    const user = await UserModel.findById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      role: user.role,
      isActive: user.is_active,
      createdAt: user.created_at,
      lastLogin: user.last_login,
    };
  }

  static async updateProfile(userId, updateData) {
    const user = await UserModel.findById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    // If email is being updated, check if it's already taken
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await UserModel.findByEmail(updateData.email);
      if (existingUser) {
        const error = new Error("Email already in use");
        error.statusCode = 409;
        throw error;
      }
    }

    // Hash password if provided
    if (updateData.password) {
      updateData.passwordHash = await hashPassword(updateData.password);
      delete updateData.password;
    }

    // Update user (this would need to be implemented in UserModel)
    // For now, return current user
    return await this.getProfile(userId);
  }
}

module.exports = AuthService;
