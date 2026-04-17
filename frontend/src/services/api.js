export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://kazilive-backend.onrender.com';
export const API_BASE_URL = `${BACKEND_URL}/api/auth`;
export const BASE_URL = `${BACKEND_URL}/api`;

export async function register(userData) {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  let data;
  try {
    const text = await response.text();
    data = text ? JSON.parse(text) : {};
  } catch (err) {
    data = { error: 'Invalid server response' };
  }

  if (!response.ok) {
    throw new Error(data.error || `Registration failed (${response.status})`);
  }
  return data;
}

export async function login(credentials) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  let data;
  try {
    const text = await response.text();
    data = text ? JSON.parse(text) : {};
  } catch (err) {
    data = { error: 'Invalid server response' };
  }

  if (!response.ok) {
    throw new Error(data.error || `Login failed (${response.status})`);
  }
  return data;
}

export const updateProfile = async (userType, data, token) => {
  const response = await fetch(`${BASE_URL}/${userType}/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  let result;
  try {
    const text = await response.text();
    result = text ? JSON.parse(text) : {};
  } catch (err) {
    result = { error: 'Invalid server response' };
  }

  if (!response.ok) {
    throw new Error(result.error || `Profile update failed (${response.status})`);
  }
  return result;
};

export const getJobseekers = async () => {
  const response = await fetch(`${BASE_URL}/employer/jobseekers`);
  const data = await response.json();
  return data;
};

export const fetchProfile = async (role, token) => {
  if (!token || token === "undefined" || token === "null") {
    throw new Error('Authentication token is missing or invalid');
  }

  const endpoint = role === 'employer' ? `${BASE_URL}/employer/profile`
    : role === 'jobseeker' ? `${BASE_URL}/jobseeker/profile`
      : `${BASE_URL}/auth/me`;

  const response = await fetch(endpoint, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch profile');
  return data;
};

export const uploadFile = async (file, fileType = 'cv') => {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('file', file);
  formData.append('file_type', fileType);

  const response = await fetch(`${BASE_URL}/jobseeker/upload`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || 'Upload failed');
  }
  return result;
};
