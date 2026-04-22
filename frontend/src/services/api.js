import axios from "axios";

// ===============================
// 🌐 BASE URL
// ===============================
export const BASE_URL = "http://localhost:5000";

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

    const res = await API.get("/api/user/profile", {
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

    const res = await API.put("/api/user/profile", data, {
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

    const res = await API.post("/api/jobseeker/upload", formData, {
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

export const uploadPublicFile = async (file, fileType = "profile_picture") => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("file_type", fileType);

    const res = await API.post("/api/jobseeker/upload-public", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error) {
    console.error("PUBLIC UPLOAD ERROR:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Public upload failed" };
  }
};

export const getJobseekerContacts = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.get("/api/jobseeker/contacts", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("GET JOBSEEKER CONTACTS ERROR:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Failed to fetch contacts" };
  }
};

export const getEmployerContacts = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.get("/api/employer/contacts", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("GET EMPLOYER CONTACTS ERROR:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Failed to fetch contacts history" };
  }
};

export const getEmployerPayments = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.get("/api/employer/payments", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("GET EMPLOYER PAYMENTS ERROR:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Failed to fetch payment history" };
  }
};

export const employerStkPush = async (phoneNumber, amount) => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.post("/api/employer/stk-push", { phone_number: phoneNumber, amount }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("EMPLOYER STK PUSH ERROR:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Failed to initiate payment" };
  }
};

export const searchJobseekers = async (params = {}) => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.get("/api/employer/jobseekers", {
      params,
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("SEARCH JOBSEEKERS ERROR:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Failed to search jobseekers" };
  }
};

export const getJobseekerDetails = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.get(`/api/employer/jobseekers/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("GET JOBSEEKER DETAILS ERROR:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Failed to fetch candidate details" };
  }
};

// ===============================
// 📄 DOCUMENTS
// ===============================

export const getDocuments = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.get("/api/jobseeker/documents", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("GET DOCUMENTS ERROR:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Failed to fetch documents" };
  }
};

export const deleteDocument = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.delete(`/api/jobseeker/documents/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("DELETE DOCUMENT ERROR:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Failed to delete document" };
  }
};

export const requestVerification = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.post("/api/jobseeker/request-verification", {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("VERIFICATION REQ ERROR:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Verification request failed" };
  }
};

// ===============================
// 🏢 EMPLOYER LOGO UPLOAD (FIXED EXPORT)
// ===============================

export const uploadCompanyLogo = (file) => {
  return uploadFile(file, "company_logo");
};

// ===============================
// 🛡️ ADMIN
// ===============================

export const adminListDocuments = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.get("/api/admin/documents", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("ADMIN LIST DOCS ERROR:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Failed to list documents" };
  }
};

export const adminApproveDocument = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.put(`/api/admin/documents/${id}/approve`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("ADMIN APPROVE ERROR:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Approval failed" };
  }
};

export const adminRejectDocument = async (id, reason) => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.put(`/api/admin/documents/${id}/reject`, { reason }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("ADMIN REJECT ERROR:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Rejection failed" };
  }
};

export const adminDeleteDocument = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.delete(`/api/admin/documents/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("ADMIN DELETE DOC ERROR:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Delete failed" };
  }
};

export const adminGetStats = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.get("/api/admin/stats", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("ADMIN GET STATS ERROR:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Failed to fetch stats" };
  }
};

export const changePassword = async (oldPassword, newPassword) => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.put("/api/user/change-password", { oldPassword, newPassword }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("CHANGE PASSWORD ERROR:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Failed to change password" };
  }
};

export const adminListUsers = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.get("/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("ADMIN LIST USERS ERROR:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Failed to list users" };
  }
};

export const adminDeactivateUser = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.put(`/api/admin/users/${userId}/deactivate`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("ADMIN DEACTIVATE ERROR:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Deactivation failed" };
  }
};

export const adminActivateUser = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.put(`/api/admin/users/${userId}/activate`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("ADMIN ACTIVATE ERROR:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Activation failed" };
  }
};

export const adminDeleteUser = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.delete(`/api/admin/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("ADMIN DELETE USER ERROR:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Delete failed" };
  }
};

export const adminListEmployers = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.get("/api/admin/employers", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("ADMIN LIST EMPLOYERS ERROR:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Failed to list employers" };
  }
};

export const adminListPayments = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.get("/api/admin/payments", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("ADMIN LIST PAYMENTS ERROR:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Failed to list payments" };
  }
};

// ===============================
// 📣 NOTIFICATIONS
// ===============================

export const getNotifications = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.get("/api/notifications", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("GET NOTIFICATIONS ERROR:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Failed to fetch notifications" };
  }
};

export const markNotificationRead = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.put(`/api/notifications/${id}/read`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("MARK READ ERROR:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Failed to mark as read" };
  }
};

export const markAllNotificationsRead = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.put("/api/notifications/read-all", {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("MARK ALL READ ERROR:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Failed to mark all as read" };
  }
};

// ===============================
// 💼 JOB OFFERS
// ===============================

export const getOffers = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.get("/api/offers", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("GET OFFERS ERROR:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Failed to fetch offers" };
  }
};

export const acceptOffer = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.post(`/api/offers/${id}/accept`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("ACCEPT OFFER ERROR:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Failed to accept offer" };
  }
};

export const declineOffer = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.post(`/api/offers/${id}/decline`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("DECLINE OFFER ERROR:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Failed to decline offer" };
  }
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