export const loginUser = async (credentials) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        user: {
          name: "Lenny",
          role: "jobseeker",
        },
        token: "fake-token-123",
      });
    }, 1000);
  });
}; 
export const updateProfile = async (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Saved:", data);
      resolve({ message: "Profile updated" });
    }, 1000);
  });
}; 
// MOCK JOBSEEKERS
export const getJobseekers = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: "John Doe",
          jobCategory: "Frontend Developer",
          salary: "500 USD",
        },
        {
          id: 2,
          name: "Jane Smith",
          jobCategory: "Backend Developer",
          salary: "700 USD",
        },
        {
          id: 3,
          name: "Mike Johnson",
          jobCategory: "UI/UX Designer",
          salary: "600 USD",
        },
      ]);
    }, 1000);
  });
}; 
