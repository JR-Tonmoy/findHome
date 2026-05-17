import http from "./http";

const API_BASE_URL =
  import.meta.env.VITE_REACT_APP_BACKEND_URL?.replace(/\/$/, "") || "";
const ADMIN_API_URL = API_BASE_URL ? `/api/v1/admin` : "";
const PUBLIC_API_URL = API_BASE_URL ? `/api/v1` : "";

export const fetchAdminUsers = async () => {
  if (!API_BASE_URL) {
    try {
      return JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    } catch {
      return [];
    }
  }

  try {
    const res = await http.get(`${ADMIN_API_URL}/users`);
    return res?.data?.data || res?.data || [];
  } catch (err) {
    console.warn("fetchAdminUsers failed, falling back to localStorage", err);
    try {
      return JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    } catch {
      return [];
    }
  }
};

export const fetchAdminOwners = async () => {
  if (!API_BASE_URL) {
    try {
      return JSON.parse(localStorage.getItem("registeredOwners") || "[]");
    } catch {
      return [];
    }
  }

  try {
    const res = await http.get(`${ADMIN_API_URL}/owners`);
    return res?.data?.data || res?.data || [];
  } catch (err) {
    console.warn("fetchAdminOwners failed, falling back to localStorage", err);
    try {
      return JSON.parse(localStorage.getItem("registeredOwners") || "[]");
    } catch {
      return [];
    }
  }
};

export const deleteAdminUser = async (id) => {
  if (!API_BASE_URL) return null;

  try {
    await http.delete(`${ADMIN_API_URL}/users/${encodeURIComponent(id)}`);
    return true;
  } catch (err) {
    console.warn("deleteAdminUser failed", err);
    return null;
  }
};

export const deleteAdminOwner = async (id) => {
  if (!API_BASE_URL) return null;

  try {
    await http.delete(`${ADMIN_API_URL}/owners/${encodeURIComponent(id)}`);
    return true;
  } catch (err) {
    console.warn("deleteAdminOwner failed", err);
    return null;
  }
};

export const fetchAdminBookings = async () => {
  if (!API_BASE_URL) {
    try {
      return JSON.parse(localStorage.getItem("tenantBookingRequests") || "[]");
    } catch {
      return [];
    }
  }

  try {
    const res = await http.get(`${ADMIN_API_URL}/bookings`);
    return res?.data?.data || res?.data || [];
  } catch (err) {
    console.warn(
      "fetchAdminBookings failed, trying public bookings endpoint",
      err,
    );
    try {
      const res2 = await http.get(`${PUBLIC_API_URL}/bookings`);
      return res2?.data?.data || res2?.data || [];
    } catch (err2) {
      console.warn(
        "public bookings fetch failed, falling back to localStorage",
        err2,
      );
      try {
        return JSON.parse(
          localStorage.getItem("tenantBookingRequests") || "[]",
        );
      } catch {
        return [];
      }
    }
  }
};

export const fetchDashboardStats = async () => {
  // Prefer admin stats endpoint, otherwise compute from local cache
  if (!API_BASE_URL) {
    const registeredUsers = JSON.parse(
      localStorage.getItem("registeredUsers") || "[]",
    );
    const registeredOwners = JSON.parse(
      localStorage.getItem("registeredOwners") || "[]",
    );
    const ownerProperties = JSON.parse(
      localStorage.getItem("ownerProperties") || "[]",
    );

    return {
      tenants: registeredUsers.length,
      owners: registeredOwners.length,
      properties: ownerProperties.length,
    };
  }

  try {
    const res = await http.get(`${ADMIN_API_URL}/stats`);
    return res?.data?.data || res?.data || {};
  } catch (err) {
    console.warn(
      "fetchDashboardStats failed, falling back to local counts",
      err,
    );
    const registeredUsers = JSON.parse(
      localStorage.getItem("registeredUsers") || "[]",
    );
    const registeredOwners = JSON.parse(
      localStorage.getItem("registeredOwners") || "[]",
    );
    const ownerProperties = JSON.parse(
      localStorage.getItem("ownerProperties") || "[]",
    );

    return {
      tenants: registeredUsers.length,
      owners: registeredOwners.length,
      properties: ownerProperties.length,
    };
  }
};

export const fetchPaymentsAdmin = async (params = "?per_page=100") => {
  if (!API_BASE_URL) {
    try {
      return JSON.parse(localStorage.getItem("payments") || "[]");
    } catch {
      return [];
    }
  }

  try {
    const res = await http.get(`${PUBLIC_API_URL}/payments${params}`);
    return res?.data?.data || res?.data || [];
  } catch (err) {
    console.warn(
      "fetchPaymentsAdmin failed, falling back to localStorage",
      err,
    );
    try {
      return JSON.parse(localStorage.getItem("payments") || "[]");
    } catch {
      return [];
    }
  }
};

export const fetchRevenueStats = async () => {
  if (!API_BASE_URL) return {};

  try {
    const res = await http.get(`${PUBLIC_API_URL}/payments/stats`);
    return res?.data?.data || res?.data || {};
  } catch (err) {
    console.warn("fetchRevenueStats failed", err);
    return {};
  }
};

export const fetchAdminProperties = async () => {
  if (!API_BASE_URL) {
    try {
      return JSON.parse(localStorage.getItem("ownerProperties") || "[]");
    } catch {
      return [];
    }
  }

  try {
    const res = await http.get(`${PUBLIC_API_URL}/properties`);
    return res?.data?.data || res?.data || [];
  } catch (err) {
    console.warn("fetchAdminProperties failed", err);
    try {
      return JSON.parse(localStorage.getItem("ownerProperties") || "[]");
    } catch {
      return [];
    }
  }
};

export const approveBookingAdmin = async (bookingId) => {
  if (!API_BASE_URL) {
    // Fallback: update localStorage
    try {
      const bookings = JSON.parse(
        localStorage.getItem("tenantBookingRequests") || "[]",
      );
      const booking = bookings.find((b) => b.id === bookingId);
      if (booking) {
        booking.status = "approved";
        booking.approved_at = new Date().toISOString();
        localStorage.setItem("tenantBookingRequests", JSON.stringify(bookings));
      }
      return booking;
    } catch (err) {
      console.warn("Failed to approve booking in localStorage", err);
      return null;
    }
  }

  try {
    const res = await http.put(
      `${ADMIN_API_URL}/bookings/${bookingId}/approve`,
    );
    return res?.data?.data || res?.data;
  } catch (err) {
    console.warn("Backend approve failed, trying localStorage fallback:", err);
    // Fallback to localStorage
    try {
      const bookings = JSON.parse(
        localStorage.getItem("tenantBookingRequests") || "[]",
      );
      const booking = bookings.find((b) => b.id === bookingId);
      if (booking) {
        booking.status = "approved";
        booking.approved_at = new Date().toISOString();
        localStorage.setItem("tenantBookingRequests", JSON.stringify(bookings));
      }
      return booking;
    } catch (err2) {
      console.error(
        "Failed to approve booking in both backend and localStorage",
        err2,
      );
      throw err;
    }
  }
};

export const rejectBookingAdmin = async (bookingId) => {
  if (!API_BASE_URL) {
    // Fallback: update localStorage
    try {
      const bookings = JSON.parse(
        localStorage.getItem("tenantBookingRequests") || "[]",
      );
      const booking = bookings.find((b) => b.id === bookingId);
      if (booking) {
        booking.status = "rejected";
        booking.rejected_at = new Date().toISOString();
        localStorage.setItem("tenantBookingRequests", JSON.stringify(bookings));
      }
      return booking;
    } catch (err) {
      console.warn("Failed to reject booking in localStorage", err);
      return null;
    }
  }

  try {
    const res = await http.put(`${ADMIN_API_URL}/bookings/${bookingId}/reject`);
    return res?.data?.data || res?.data;
  } catch (err) {
    console.warn("Backend reject failed, trying localStorage fallback:", err);
    // Fallback to localStorage
    try {
      const bookings = JSON.parse(
        localStorage.getItem("tenantBookingRequests") || "[]",
      );
      const booking = bookings.find((b) => b.id === bookingId);
      if (booking) {
        booking.status = "rejected";
        booking.rejected_at = new Date().toISOString();
        localStorage.setItem("tenantBookingRequests", JSON.stringify(bookings));
      }
      return booking;
    } catch (err2) {
      console.error(
        "Failed to reject booking in both backend and localStorage",
        err2,
      );
      throw err;
    }
  }
};

export const downloadAdminReportPdf = async () => {
  if (!API_BASE_URL) {
    throw new Error("Backend URL is not configured for PDF report download.");
  }

  try {
    const res = await http.get(`${ADMIN_API_URL}/reports/download`, {
      responseType: "blob",
    });

    return res;
  } catch (err) {
    console.error("Failed to download admin PDF report:", err);
    throw err;
  }
};

export default {
  fetchAdminUsers,
  fetchAdminOwners,
  deleteAdminUser,
  deleteAdminOwner,
  fetchAdminBookings,
  fetchDashboardStats,
  fetchPaymentsAdmin,
  fetchRevenueStats,
  fetchAdminProperties,
  approveBookingAdmin,
  rejectBookingAdmin,
  downloadAdminReportPdf,
};
