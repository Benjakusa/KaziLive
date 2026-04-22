import axios from "axios";

// 🌐 BASE URL
<<<<<<< HEAD
// ===============================
export const BASE_URL = "http://localhost:5001";
=======
export const BASE_URL = "https://kazilive-backend.onrender.com";
>>>>>>> 8dc70652 (Fix API exports, profile update, and dashboard functionality)

// ⚙️ Axios instance
const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ===============================
// 🔐 AUTH
// ===============================

export const register = async (userData) => {
  try {
    const res = await API.post("/api/auth/register", userData);
    return res.data;
  } catch (error) {
    console.error("REGISTER ERROR:", error.response?.data || error.message);
    throw error.response?.data || { message: "Registration failed" };
  }
};

export const login = async (credentials) => {
  try {
    const res = await API.post("/api/auth/login", credentials);
    return res.data;
  } catch (error) {
    console.error("LOGIN ERROR:", error.response?.data || error.message);
    throw error.response?.data || { message: "Login failed" };
  }
};

// ===============================
// 👤 PROFILE
// ===============================

export const getProfile = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await API.get("/api/users/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("GET PROFILE ERROR:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to fetch profile" };
  }
};

export const updateProfile = async (data) => {
  try {
    const token = localStorage.getItem("token");

    const res = await API.put("/api/users/profile", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to update profile" };
  }
};

// ===============================
// 📤 FILE UPLOAD
// ===============================

export const uploadFile = async (file, fileType = "general") => {
  try {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("file_type", fileType);

    const res = await API.post("/jobseeker/upload-public", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error) {
    console.error("UPLOAD ERROR:", error.response?.data || error.message);
    throw error.response?.data || { message: "Upload failed" };
  }
};

// ===============================
// 🏢 COMPANY LOGO UPLOAD (FIXED MISSING EXPORT)
// ===============================

export const uploadCompanyLogo = async (file) => {
  return uploadFile(file, "company_logo");
};

// ===============================
// EXPORT AXIOS INSTANCE
// ===============================

export default API; 