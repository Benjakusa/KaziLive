// Centralized API calls
export async function login(userType, credentials) {
  const response = await fetch(`/api/${userType}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return response.json();
}