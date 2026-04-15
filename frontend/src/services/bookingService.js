import { API_BASE_URL } from "./api";

export const bookingService = {

  createBooking: async (data) => {
    const token = localStorage.getItem("authToken"); // ✅ FIXED

    const response = await fetch(`${API_BASE_URL}/bookings/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Server Error (${response.status}): ${errorText || "No details provided"}`
      );
    }

    return response.json();
  },

  getUserBookings: async (userId) => {
    const token = localStorage.getItem("authToken"); // ✅ FIXED

    const response = await fetch(`${API_BASE_URL}/bookings/user/${userId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user bookings");
    }

    return response.json();
  },

  getLandlordBookings: async (landlordId) => {
    const token = localStorage.getItem("authToken"); // ✅ FIXED

    const response = await fetch(`${API_BASE_URL}/bookings/landlord/${landlordId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch landlord bookings");
    }

    return response.json();
  },

  approveBooking: async (id) => {
    const token = localStorage.getItem("authToken"); // ✅ FIXED

    const response = await fetch(`${API_BASE_URL}/bookings/${id}/approve`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("Failed to approve booking");
    }

    return response.json();
  },

  rejectBooking: async (id, remarks) => {
    const token = localStorage.getItem("authToken"); // ✅ FIXED

    const response = await fetch(`${API_BASE_URL}/bookings/${id}/reject`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ remarks }) // ✅ FIXED
    });

    if (!response.ok) {
      throw new Error("Failed to reject booking");
    }

    return response.json();
  },

  checkUserBooking: async (userId, propertyId) => {
    const token = localStorage.getItem("authToken");

    const response = await fetch(`${API_BASE_URL}/bookings/check/${userId}/${propertyId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("Failed to check booking status");
    }

    return response.json();
  }
};
