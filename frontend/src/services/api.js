import axios from "axios";

// ===============================
// 🌐 BASE URL
// ===============================
export const BASE_URL = "http://localhost:5001";

// ===============================
// ⚙️ AXIOS INSTANCE
// ===============================
const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ===============================
// 🔐 AUTH
// ===============================

// REGISTER (FIXED + SAFE)
export const register = async (userData) => {
  try {
    const res = await API.post("/api/auth/register", userData);
    return res.data;
  } catch (error) {
    console.error("REGISTER ERROR:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Registration failed" };
  }
};

// LOGIN (FIXED NORMALIZED PAYLOAD)
export const login = async (credentials) => {
  try {
    const payload = {
      identifier:
        credentials.identifier ||
        credentials.email ||
        credentials.username ||
        credentials.phone,
      password: credentials.password,
    };

    const res = await API.post("/api/auth/login", payload);
    return res.data;
  } catch (error) {
    console.error("LOGIN ERROR:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Login failed" };
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
    console.error("GET PROFILE ERROR:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Failed to fetch profile" };
  }
};

export const fetchProfile = getProfile;

// ===============================
// ✏️ UPDATE PROFILE
// ===============================

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
    console.error("UPDATE PROFILE ERROR:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Profile update failed" };
  }
};

// ===============================
// 📤 FILE UPLOAD (GENERIC FIXED)
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
    console.error("UPLOAD ERROR:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Upload failed" };
  }
};

// ===============================
// 🏢 EMPLOYER LOGO UPLOAD (FIXED EXPORT)
// ===============================

export const uploadCompanyLogo = (file) => {
  return uploadFile(file, "company_logo");
};

// ===============================
// 🔁 BACKWARD COMPATIBILITY HELPERS
// ===============================

// some components still use this name
export const loginUser = login;

// ===============================
// DEFAULT EXPORT
// ===============================
export default API; 