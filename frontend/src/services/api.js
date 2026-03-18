import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// API service functions
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (data) => api.put("/auth/profile", data),
};

export const petAPI = {
  getPets: () => api.get("/pets"),
  getPet: (id) => api.get(`/pets/${id}`),
  createPet: (data) => api.post("/pets", data),
  updatePet: (id, data) => api.put(`/pets/${id}`, data),
  deletePet: (id) => api.delete(`/pets/${id}`),
};

export const appointmentAPI = {
  getAppointments: (petId) => {
    const url = petId ? `/appointments?petId=${petId}` : "/appointments";
    return api.get(url);
  },
  getAppointment: (id) => api.get(`/appointments/${id}`),
  createAppointment: (data) => api.post("/appointments", data),
  updateStatus: (id, status, notes) =>
    api.put(`/appointments/${id}/status`, { status, notes }),
};

export const medicalRecordAPI = {
  getRecords: (petId) => {
    const url = petId ? `/medical-records?petId=${petId}` : "/medical-records";
    return api.get(url);
  },
  getRecord: (id) => api.get(`/medical-records/${id}`),
  createRecord: (data) => api.post("/medical-records", data),
  updateRecord: (id, data) => api.put(`/medical-records/${id}`, data),
};

export const prescriptionAPI = {
  getPrescriptions: (petId, active) => {
    const params = new URLSearchParams();
    if (petId) params.append("petId", petId);
    if (active !== undefined) params.append("active", active);
    return api.get(`/prescriptions?${params.toString()}`);
  },
  getPrescription: (id) => api.get(`/prescriptions/${id}`),
  createPrescription: (data) => api.post("/prescriptions", data),
  updateRefills: (id, refills) =>
    api.put(`/prescriptions/${id}/refills`, { refillsRemaining: refills }),
};

export const clinicAPI = {
  getClinics: () => api.get("/clinics"),
  getClinic: (id) => api.get(`/clinics/${id}`),
  searchClinics: (term) => api.get(`/clinics/search/${term}`),
  getDoctors: (clinicId) => api.get(`/clinics/${clinicId}/doctors`),
  getAvailableDoctors: (date, time) => {
    const params = new URLSearchParams();
    if (date) params.append("date", date);
    if (time) params.append("time", time);
    return api.get(`/doctors/available?${params.toString()}`);
  },
};

export const dashboardAPI = {
  getDashboard: () => api.get("/dashboard"),
};

export { api };
