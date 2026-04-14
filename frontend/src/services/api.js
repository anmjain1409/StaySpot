export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

/* ================= AUTH SERVICE ================= */

export const authService = {
  register: async (username, email, password, fullName) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, fullName }),
    });

    if (!response.ok) throw new Error(await response.text());

    const data = await response.json();
    if (data.token) {
      localStorage.setItem("authToken", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.id,
          username: data.username,
          email: data.email,
          fullName: data.fullName,
          role: data.role || "USER",
        })
      );
    }
    return data;
  },

  login: async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) throw new Error(await response.text());

    const data = await response.json();
    if (data.token) {
      localStorage.setItem("authToken", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.id,
          username: data.username,
          email: data.email,
          fullName: data.fullName,
          role: data.role || "USER",
        })
      );
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  },

  isAuthenticated: () => !!localStorage.getItem("authToken"),
};

/* ================= LANDLORD SERVICE ================= */

export const landlordService = {
  submitRequest: async (data) => {
    const token = localStorage.getItem("authToken");
    const res = await fetch(`${API_BASE_URL}/landlord/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  getByUsername: async (username) => {
    const token = localStorage.getItem("authToken");
    const res = await fetch(
      `${API_BASE_URL}/landlord/user/${encodeURIComponent(username)}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!res.ok) throw new Error("Failed to fetch landlord");
    return res.json();
  },

  getPending: async () => {
    const token = localStorage.getItem("authToken");
    const res = await fetch(`${API_BASE_URL}/landlord/pending`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch pending landlords");
    return res.json();
  },

  approve: async (id) => {
    const token = localStorage.getItem("authToken");
    const res = await fetch(`${API_BASE_URL}/landlord/${id}/approve`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Approve landlord failed");
    return res.json();
  },

  reject: async (id, remark) => {
    const token = localStorage.getItem("authToken");
    const res = await fetch(`${API_BASE_URL}/landlord/${id}/reject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ remark }),
    });
    if (!res.ok) throw new Error("Reject landlord failed");
    return res.json();
  },
};

/* ================= PROPERTY SERVICE ================= */

export const propertyService = {
  create: async (data) => {
    const token = localStorage.getItem("authToken");
    const res = await fetch(`${API_BASE_URL}/property`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  getByOwner: async (username) => {
    const token = localStorage.getItem("authToken");
    const res = await fetch(
      `${API_BASE_URL}/property/owner/${encodeURIComponent(username)}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!res.ok) throw new Error("Failed to fetch owner properties");
    return res.json();
  },

  getApproved: async () => {
    const token = localStorage.getItem("authToken");
    const res = await fetch(`${API_BASE_URL}/property/approved`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch approved properties");
    return res.json();
  },

  getPending: async () => {
    const token = localStorage.getItem("authToken");
    const res = await fetch(`${API_BASE_URL}/property/pending`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch pending properties");
    return res.json();
  },

  approve: async (id) => {
    const token = localStorage.getItem("authToken");
    const res = await fetch(`${API_BASE_URL}/property/${id}/approve`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Approve property failed");
    return res.json();
  },

  // ✅ SAME FUNCTION, REMARK CONFIRMED
  reject: async (id, remark) => {
    const token = localStorage.getItem("authToken");
    const res = await fetch(`${API_BASE_URL}/property/${id}/reject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ remark }),
    });
    if (!res.ok) throw new Error("Reject property failed");
    return res.json();
  },

  delete: async (id) => {
    const token = localStorage.getItem("authToken");
    const res = await fetch(`${API_BASE_URL}/property/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to delete property");
    return true;
  },
};

/* ================= ADMIN SERVICE ================= */

export const adminService = {
  getPendingProperties: () => propertyService.getPending(),
  approveProperty: (id) => propertyService.approve(id),
  rejectProperty: (id, remark) => propertyService.reject(id, remark),
};
