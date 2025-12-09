// API Service for StaySpot Backend
const API_BASE_URL = "http://localhost:8080/api";

export const authService = {
  register: async (username, email, password, fullName) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          fullName,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Registration failed");
      }

      const data = await response.json();
      // Store JWT token in localStorage
      if (data.token) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("username", data.username);
      }
      return data;
    } catch (error) {
      throw new Error(error.message || "Registration failed");
    }
  },

  login: async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Login failed");
      }

      const data = await response.json();
      // Store JWT token in localStorage
      if (data.token) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("username", data.username);
      }
      return data;
    } catch (error) {
      throw new Error(error.message || "Login failed");
    }
  },

  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
  },

  getAuthToken: () => {
    return localStorage.getItem("authToken");
  },

  getUsername: () => {
    return localStorage.getItem("username");
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("authToken");
  },
};
