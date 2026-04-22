import API from "./api";

// ==========================
// JOB OFFERS
// ==========================
export const acceptOffer = async (id) => {
  const res = await API.post(`/api/offers/${id}/accept`);
  return res.data;
};

export const declineOffer = async (id) => {
  const res = await API.post(`/api/offers/${id}/decline`);
  return res.data;
};

// ==========================
// PROFILE ACTIONS
// ==========================
export const updateUserProfile = async (data) => {
  const res = await API.put("/api/users/profile", data);
  return res.data;
};

// ==========================
// NOTIFICATIONS
// ==========================
export const markNotificationRead = async (id) => {
  const res = await API.put(`/api/notifications/${id}/read`);
  return res.data;
};

// ==========================
// AVAILABILITY (JOBSEEKER)
// ==========================
export const toggleAvailability = async (status) => {
  const res = await API.put("/api/users/availability", {
    available: status,
  });
  return res.data;
}; 