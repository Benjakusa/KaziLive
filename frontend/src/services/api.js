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
// 🧠 TOKEN HELPER
// ===============================
const getToken = () => localStorage.getItem("token");

// Attach token automatically
API.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===============================
// 🧯 SAFE ERROR HANDLER
// ===============================
const handleError = (error, defaultMessage) => {
  // Network / CORS error
  if (!error.response) {
    return { message: "Network error or CORS issue. Check backend." };
  }

  return error.response?.data || { message: defaultMessage };
};

// ===============================
// 🔐 AUTH
// ===============================
export const register = async (userData) => {
  try {
    const res = await API.post("/api/auth/register", userData);
    return res.data;
  } catch (error) {
    throw handleError(error, "Registration failed");
  }
};

export const login = async (credentials) => {
  try {
    const res = await API.post("/api/auth/login", credentials);

    // ⚠️ ensure token is stored properly
    if (res.data?.token) {
      localStorage.setItem("token", res.data.token);
    }

    return res.data;
  } catch (error) {
    throw handleError(error, "Login failed");
  }
};

// ===============================
// 👤 PROFILE (GET)
// ===============================
export const getProfile = async () => {
  try {
    const res = await API.get("/api/users/profile");

    // Normalize structure (VERY IMPORTANT for your bug)
    return res.data?.data || res.data || {};
  } catch (error) {
    throw handleError(error, "Failed to fetch profile");
  }
};

// backward compatibility (fixes your import issues)
export const fetchProfile = getProfile;

// ===============================
// ✏️ UPDATE PROFILE
// ===============================
export const updateProfile = async (data) => {
  try {
    const res = await API.put("/api/users/profile", data);

    // return updated profile safely
    return res.data?.data || res.data || {};
  } catch (error) {
    throw handleError(error, "Profile update failed");
  }
};

// ===============================
// 📤 GENERIC FILE UPLOAD
// ===============================
export const uploadFile = async (file, fileType = "general") => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("file_type", fileType);

    const res = await API.post("/jobseeker/upload-public", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error) {
    throw handleError(error, "File upload failed");
  }
};

// ===============================
// 🏢 ALIAS (BACKWARD COMPATIBILITY)
// ===============================
export const uploadCompanyLogo = (file) => uploadFile(file, "company_logo");

// ===============================
// 🚀 EXPORT INSTANCE
// ===============================
export default API; 