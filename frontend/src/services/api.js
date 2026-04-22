import axios from "axios";

// 🌐 BASE URL
export const BASE_URL = "https://kazilive-backend.onrender.com";

// ===============================
// ⚙️ AXIOS INSTANCE
// ===============================
const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// ===============================
// 🔐 REQUEST INTERCEPTOR (AUTO TOKEN ATTACH)
// ===============================
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ===============================
// 🔄 RESPONSE INTERCEPTOR (CLEAN ERRORS)
// ===============================
API.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(
      error?.response?.data || {
        message: "Network error. Please try again.",
      }
    );
  }
);

// ===============================
// 🔐 AUTH
// ===============================

export const register = async (data) => {
  const res = await API.post("/api/auth/register", data);
  return res.data;
};

export const login = async (credentials) => {
  const res = await API.post("/api/auth/login", credentials);
  return res.data;
};

// ===============================
// 👤 PROFILE
// ===============================

export const getProfile = async () => {
  const res = await API.get("/api/users/profile");
  return res.data;
};

export const fetchProfile = getProfile;

export const updateProfile = async (data) => {
  const res = await API.put("/api/users/profile", data);
  return res.data;
};

// ===============================
// 📤 FILE UPLOAD (CV / AVATAR)
// ===============================

export const uploadFile = async (file, type = "general") => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("file_type", type);

  const res = await API.post("/jobseeker/upload-public", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const uploadCompanyLogo = (file) => {
  return uploadFile(file, "company_logo");
};

// ===============================
// 💼 JOB OFFERS (NEW - READY FOR YOUR UI)
// ===============================

// Accept offer
export const acceptOffer = async (offerId) => {
  const res = await API.post(`/api/offers/${offerId}/accept`);
  return res.data;
};

// Decline offer
export const declineOffer = async (offerId) => {
  const res = await API.post(`/api/offers/${offerId}/decline`);
  return res.data;
};

// ===============================
// 🔑 PASSWORD CHANGE (NEW)
// ===============================

export const changePassword = async (data) => {
  const res = await API.put("/api/users/change-password", data);
  return res.data;
};

// ===============================
// EXPORT INSTANCE
// ===============================
export default API; 