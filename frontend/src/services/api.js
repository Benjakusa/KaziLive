import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

export const loginUser = async (credentials) => {
  const response = await API.post("/login", credentials);
  return response.data;
};

export default API; 