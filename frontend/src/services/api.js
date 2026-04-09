export async function login(userType, credentials) {
  const res = await fetch(`/api/${userType}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

export async function updateProfile(profile) {
  const res = await fetch('/api/jobseeker/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  });
  if (!res.ok) throw new Error("Profile update failed");
  return res.json();
}

export async function searchJobseekers(filters) {
  const query = new URLSearchParams(filters).toString();
  const res = await fetch(`/api/employer/search?${query}`);
  if (!res.ok) throw new Error("Search failed");
  return res.json();
}

export async function getJobseekerProfile(id) {
  const res = await fetch(`/api/jobseeker/${id}`);
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
}