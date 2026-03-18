import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { user: userData, token } = response.data.data;

      // Store in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      // Set user state
      setUser(userData);

      // Set authorization header for future requests
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Login failed",
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      const { user: newUser, token } = response.data.data;

      // Store in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(newUser));

      // Set user state
      setUser(newUser);

      // Set authorization header for future requests
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Registration failed",
      };
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Clear user state
    setUser(null);

    // Remove authorization header
    delete api.defaults.headers.common["Authorization"];
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put("/auth/profile", profileData);
      const updatedUser = response.data.data;

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Update user state
      setUser(updatedUser);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Profile update failed",
      };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isCustomer: user?.role === "customer",
    isVeterinarian: user?.role === "veterinarian",
    isAdmin: user?.role === "admin",
    isStaff: user?.role === "staff",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
