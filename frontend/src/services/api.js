export async function login(userType, credentials) {
  const response = await fetch(`/api/${userType}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return response.json();
}

/**
 * MOCK FUNCTIONS
 * These should be replaced by real API endpoints in production.
 */

export const updateProfile = async (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Saved:", data);
      resolve({ message: "Profile updated" });
    }, 1000);
  });
};

export const getJobseekers = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: "John Doe", jobCategory: "Frontend Developer", salary: "500 USD" },
        { id: 2, name: "Jane Smith", jobCategory: "Backend Developer", salary: "700 USD" },
        { id: 3, name: "Mike Johnson", jobCategory: "UI/UX Designer", salary: "600 USD" },
      ]);
    }, 1000);
  });
};