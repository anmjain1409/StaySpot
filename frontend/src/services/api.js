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
      // Store JWT token and user info in localStorage
      if (data.token) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify({
          username: data.username,
          email: data.email,
          fullName: data.fullName,
          role: data.role || "USER",
        }));
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
      // Store JWT token and user info in localStorage
      if (data.token) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify({
          username: data.username,
          email: data.email,
          fullName: data.fullName,
          role: data.role || "USER",
        }));
      }
      return data;
    } catch (error) {
      throw new Error(error.message || "Login failed");
    }
  },

  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
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

export const landlordService = {
  submitRequest: async (data) => {
    const token = localStorage.getItem("authToken");
    const res = await fetch(`${API_BASE_URL}/landlord/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || "Landlord request failed");
    }
    return res.json();
  },

  getByUsername: async (username) => {
    const token = localStorage.getItem("authToken");
    const res = await fetch(`${API_BASE_URL}/landlord/user/${encodeURIComponent(username)}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!res.ok) throw new Error("Failed to fetch landlord request");
    return res.json();
  },

  getPending: async () => {
    const token = localStorage.getItem("authToken");
    console.log("Calling getPending, token:", !!token);
    const res = await fetch(`${API_BASE_URL}/landlord/pending`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    console.log("getPending response status:", res.status);
    if (!res.ok) throw new Error("Failed to fetch pending requests");
    const data = await res.json();
    console.log("getPending data:", data);
    return data;
  },

  approve: async (id) => {
    const token = localStorage.getItem("authToken");
    console.log("Approving landlord id:", id, "token:", !!token);
    const res = await fetch(`${API_BASE_URL}/landlord/${id}/approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    console.log("Approve response status:", res.status);
    if (!res.ok) {
      const err = await res.text();
      console.log("Approve error:", err);
      throw new Error(err || "Approve failed");
    }
    return res.json();
  },

  reject: async (id, remark) => {
    const token = localStorage.getItem("authToken");
    const res = await fetch(`${API_BASE_URL}/landlord/${id}/reject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ remark }),
    });
    if (!res.ok) throw new Error("Reject failed");
    return res.json();
  },
};

export const propertyService = {
  create: async (data) => {
    const token = localStorage.getItem("authToken");
    const res = await fetch(`${API_BASE_URL}/property`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || "Create property failed");
    }
    return res.json();
  },

  getByOwner: async (username) => {
    const token = localStorage.getItem("authToken");
    const res = await fetch(`${API_BASE_URL}/property/owner/${encodeURIComponent(username)}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!res.ok) throw new Error("Failed to fetch properties");
    return res.json();
  },

  getApproved: async () => {
    const token = localStorage.getItem("authToken");
    const res = await fetch(`${API_BASE_URL}/property/approved`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!res.ok) throw new Error("Failed to fetch approved properties");
    return res.json();
  },

  getPending: async () => {
    const token = localStorage.getItem("authToken");
    const res = await fetch(`${API_BASE_URL}/property/pending`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!res.ok) throw new Error("Failed to fetch pending properties");
    return res.json();
  },

  approve: async (id) => {
    const token = localStorage.getItem("authToken");
    const res = await fetch(`${API_BASE_URL}/property/${id}/approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!res.ok) throw new Error("Approve property failed");
    return res.json();
  },

  reject: async (id) => {
    const token = localStorage.getItem("authToken");
    const res = await fetch(`${API_BASE_URL}/property/${id}/reject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!res.ok) throw new Error("Reject property failed");
    return res.json();
  },
};

export const adminService = {
  // Admin creation functionality removed
};
