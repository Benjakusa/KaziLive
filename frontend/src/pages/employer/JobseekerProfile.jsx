import axios from "axios";

// 🌐 BASE URL
export const BASE_URL = "https://kazilive-backend.onrender.com";

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
    throw error.response?.data || { message: "Registration failed" };
  }
};

export const login = async (credentials) => {
  try {
    const res = await API.post("/api/auth/login", credentials);
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};

// ===============================
// 👤 PROFILE
// ===============================

export const getProfile = async () => {
  const token = localStorage.getItem("token");

  const res = await API.get("/api/users/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const fetchProfile = getProfile;

// ===============================
// ✏️ UPDATE PROFILE
// ===============================

export const updateProfile = async (data) => {
  const token = localStorage.getItem("token");

  const res = await API.put("/api/users/profile", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// ===============================
// 📤 GENERIC FILE UPLOAD (FIXED)
// ===============================

export const uploadFile = async (file, fileType = "general") => {
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
};

// ===============================
// 🏢 COMPANY LOGO (alias for backward compatibility)
// ===============================

export const uploadCompanyLogo = (file) => {
  return uploadFile(file, "company_logo");
};

// ===============================
// EXPORT AXIOS INSTANCE
// ===============================

export default API;