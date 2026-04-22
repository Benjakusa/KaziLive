import { createSlice } from "@reduxjs/toolkit";

const sanitize = (val) => {
  if (val === "undefined" || val === "null" || val === "" || val === undefined) return null;
  return val;
};

const storedUser = JSON.parse(localStorage.getItem("user")) || null;
if (storedUser && storedUser.user_type && !storedUser.role) {
  storedUser.role = storedUser.user_type;
}

const initialState = {
  user: sanitize(storedUser),
  token: sanitize(localStorage.getItem("token")),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      // Normalise: backend sends user_type, ProtectedRoute expects role
      const user = action.payload.user;
      if (user && user.user_type && !user.role) {
        user.role = user.user_type;
      }
      state.user = user;
      state.token = action.payload.token;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(user));
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.clear();
    },
  },
});


export const { loginStart, loginSuccess, loginFailure, logout } =
  authSlice.actions;

export default authSlice.reducer; 