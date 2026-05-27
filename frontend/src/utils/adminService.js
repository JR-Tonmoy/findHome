import http from "./http";

const API_BASE_URL =
  import.meta.env.VITE_REACT_APP_BACKEND_URL?.replace(/\/$/, "") || "";
const ADMIN_API_URL = API_BASE_URL ? `/api/admin` : "";
const PUBLIC_API_URL = API_BASE_URL ? `/api/v1` : "";

const getApiErrorMessage = (err, fallbackMessage) =>
  err?.response?.data?.message ||
  err?.response?.data?.error ||
  err?.message ||
  fallbackMessage;

const updateLocalBlockedState = (collectionName, userId, blocked) => {
  try {
    const records = JSON.parse(localStorage.getItem(collectionName) || "[]");
    const updatedRecords = records.map((record) =>
      String(record.id) === String(userId)
        ? {
            ...record,
            is_blocked: blocked,
            account_status: blocked ? "blocked" : "active",
          }
        : record,
    );

    localStorage.setItem(collectionName, JSON.stringify(updatedRecords));
    return (
      updatedRecords.find((record) => String(record.id) === String(userId)) ||
      null
    );
  } catch (err) {
    console.warn(`Failed to update ${collectionName}`, err);
    return null;
  }
};

const toggleLocalBlockedState = (userId) => {
  const collections = ["registeredUsers", "registeredOwners"];
  let updatedRecord = null;

  collections.forEach((collectionName) => {
    try {
      const records = JSON.parse(localStorage.getItem(collectionName) || "[]");
      const target = records.find(
        (record) => String(record.id) === String(userId),
      );

      if (!target) {
        return;
      }

      const nextBlocked = !(
        target.is_blocked ||
        String(target.account_status || "active").toLowerCase() === "blocked"
      );

      const updatedRecords = records.map((record) =>
        String(record.id) === String(userId)
          ? {
              ...record,
              is_blocked: nextBlocked,
              account_status: nextBlocked ? "blocked" : "active",
            }
          : record,
      );

      localStorage.setItem(collectionName, JSON.stringify(updatedRecords));
      updatedRecord =
        updatedRecords.find((record) => String(record.id) === String(userId)) ||
        updatedRecord;
    } catch (err) {
      console.warn(`Failed to toggle ${collectionName}`, err);
    }
  });

  return updatedRecord;
};

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
    const res = await http.get(`${ADMIN_API_URL}/users`);
    const payload = res?.data?.data || res?.data || [];
    return Array.isArray(payload)
      ? payload.filter((user) => String(user.role).toLowerCase() === "owner")
      : [];
  } catch (err) {
    console.warn("fetchAdminOwners failed, falling back to localStorage", err);
    try {
      return JSON.parse(localStorage.getItem("registeredOwners") || "[]");
    } catch {
      return [];
    }
  }
};

export const toggleAdminUserBlock = async (userId) => {
  if (!API_BASE_URL) {
    return toggleLocalBlockedState(userId);
  }

  try {
    const res = await http.patch(
      `${ADMIN_API_URL}/users/${userId}/toggle-block`,
    );
    return res?.data?.data || res?.data || null;
  } catch (err) {
    console.warn("toggleAdminUserBlock failed", err);
    throw err;
  }
};

export const blockAdminUser = toggleAdminUserBlock;
export const unblockAdminUser = toggleAdminUserBlock;
export const activateAdminUser = toggleAdminUserBlock;

export const toggleAdminOwnerBlock = async (ownerId) => {
  if (!API_BASE_URL) {
    return toggleLocalBlockedState(ownerId);
  }

  try {
    const res = await http.patch(
      `${ADMIN_API_URL}/owners/${ownerId}/toggle-block`,
    );
    return res?.data?.data || res?.data || null;
  } catch (err) {
    console.warn("toggleAdminOwnerBlock failed", err);
    throw err;
  }
};

export const blockAdminOwner = toggleAdminOwnerBlock;
export const unblockAdminOwner = toggleAdminOwnerBlock;

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
    await http.delete(`${ADMIN_API_URL}/users/${encodeURIComponent(id)}`);
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

export const fetchAdminBookingDetails = async (bookingId) => {
  if (!API_BASE_URL || !bookingId) {
    return null;
  }

  try {
    const res = await http.get(
      `${PUBLIC_API_URL}/bookings/${encodeURIComponent(bookingId)}`,
    );
    return res?.data?.data || res?.data || null;
  } catch (err) {
    console.warn("fetchAdminBookingDetails failed", err);
    throw err;
  }
};

export const fetchOwnerCancelledBookings = async () => {
  if (!API_BASE_URL) return [];

  try {
    const res = await http.get(`${PUBLIC_API_URL}/owner/cancelled-bookings`);
    return res?.data?.data || res?.data || [];
  } catch (err) {
    console.warn("fetchOwnerCancelledBookings failed", err);
    return [];
  }
};

export const fetchAdminCancelledBookings = async () => {
  if (!API_BASE_URL) return [];

  try {
    const res = await http.get(`${PUBLIC_API_URL}/admin/cancelled-bookings`);
    return res?.data?.data || res?.data || [];
  } catch (err) {
    console.warn("fetchAdminCancelledBookings failed", err);
    return [];
  }
};

export const fetchDashboardStats = async () => {
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
    const res = await http.get(`${ADMIN_API_URL}/dashboard`);
    return res?.data?.data?.stats || res?.data?.data || {};
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

const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      searchParams.set(key, value);
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
};

export const fetchAdminPayments = async (params = {}) => {
  if (!API_BASE_URL) {
    try {
      const payments = JSON.parse(localStorage.getItem("payments") || "[]");
      return {
        summary: {
          totalRevenue: payments.reduce(
            (sum, payment) =>
              sum + Number(payment.amount || payment.total_payment || 0),
            0,
          ),
          totalAdminCommission: payments.reduce(
            (sum, payment) => sum + Number(payment.admin_commission || 0),
            0,
          ),
          totalOwnerPayments: payments.reduce(
            (sum, payment) =>
              sum + Number(payment.owner_earning || payment.owner_share || 0),
            0,
          ),
          totalRefundAmount: 0,
          monthlyRevenue: 0,
          totalPayments: payments.length,
          totalSuccessfulPayments: payments.filter(
            (payment) =>
              String(payment.payment_status).toLowerCase() === "completed",
          ).length,
          totalPendingPayments: payments.filter(
            (payment) =>
              String(payment.payment_status).toLowerCase() === "pending",
          ).length,
          totalFailedPayments: payments.filter(
            (payment) =>
              String(payment.payment_status).toLowerCase() === "failed",
          ).length,
          totalRefundedPayments: payments.filter(
            (payment) =>
              String(payment.payment_status).toLowerCase() === "refunded",
          ).length,
          totalCancelledBookings: 0,
          adminCommissionRate: 5,
          ownerEarningRate: 95,
        },
        payments,
        pagination: {
          total: payments.length,
          per_page: payments.length,
          current_page: 1,
          last_page: 1,
        },
      };
    } catch {
      return {
        summary: {},
        payments: [],
        pagination: { total: 0, per_page: 0, current_page: 1, last_page: 1 },
      };
    }
  }

  try {
    const res = await http.get(
      `${ADMIN_API_URL}/payments${buildQueryString(params)}`,
    );
    return (
      res?.data?.data ||
      res?.data || { summary: {}, payments: [], pagination: {} }
    );
  } catch (err) {
    console.warn("fetchAdminPayments failed", err);
    throw err;
  }
};

export const downloadAdminPaymentInvoice = async (paymentId) => {
  if (!API_BASE_URL) {
    throw new Error("Backend URL is not configured for invoice download.");
  }

  try {
    return await http.get(`${ADMIN_API_URL}/payments/${paymentId}/invoice`, {
      responseType: "blob",
    });
  } catch (err) {
    console.error("Failed to download admin payment invoice:", err);
    throw err;
  }
};

export const fetchRevenueStats = async () => {
  if (!API_BASE_URL) return {};

  try {
    const res = await http.get(`${ADMIN_API_URL}/revenue`);
    return res?.data?.data || res?.data || {};
  } catch (err) {
    console.warn("fetchRevenueStats failed, trying legacy stats endpoint", err);

    try {
      const res = await http.get(`${PUBLIC_API_URL}/payments/stats`);
      return res?.data?.data || res?.data || {};
    } catch (legacyErr) {
      console.warn("legacy revenue stats endpoint failed", legacyErr);
      return {};
    }
  }
};

export const fetchAdminRevenue = fetchRevenueStats;

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

export const fetchAdminDashboard = async () => {
  if (!API_BASE_URL) {
    const stats = await fetchDashboardStats();
    return { stats, notifications: [] };
  }

  try {
    const res = await http.get(`${ADMIN_API_URL}/dashboard`);
    return res?.data?.data || { stats: {}, notifications: [] };
  } catch (err) {
    console.warn("fetchAdminDashboard failed", err);
    return { stats: {}, notifications: [] };
  }
};

export const fetchAdminNotifications = async () => {
  if (!API_BASE_URL) return [];

  try {
    const res = await http.get(`${ADMIN_API_URL}/notifications`);
    return res?.data?.data || [];
  } catch (err) {
    console.warn("fetchAdminNotifications failed", err);
    return [];
  }
};

export const approveAdminProperty = async (propertyId) => {
  if (!API_BASE_URL) return null;

  try {
    const res = await http.put(
      `${ADMIN_API_URL}/properties/${propertyId}/approve`,
    );
    return res?.data?.data || res?.data || null;
  } catch (err) {
    console.warn("approveAdminProperty failed", err);
    throw err;
  }
};

export const deleteAdminProperty = async (propertyId) => {
  if (!API_BASE_URL) return null;

  try {
    const res = await http.delete(`${ADMIN_API_URL}/properties/${propertyId}`);
    return res?.data || null;
  } catch (err) {
    console.warn("deleteAdminProperty failed", err);
    throw err;
  }
};

export const getAdminErrorMessage = getApiErrorMessage;

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
  fetchAdminCancelledBookings,
  fetchAdminBookings,
  fetchAdminBookingDetails,
  fetchDashboardStats,
  fetchPaymentsAdmin,
  fetchAdminPayments,
  fetchOwnerCancelledBookings,
  fetchRevenueStats,
  fetchAdminProperties,
  fetchAdminDashboard,
  fetchAdminNotifications,
  approveBookingAdmin,
  rejectBookingAdmin,
  approveAdminProperty,
  deleteAdminProperty,
  toggleAdminUserBlock,
  blockAdminUser,
  unblockAdminUser,
  activateAdminUser,
  toggleAdminOwnerBlock,
  blockAdminOwner,
  unblockAdminOwner,
  downloadAdminPaymentInvoice,
  downloadAdminReportPdf,
};
