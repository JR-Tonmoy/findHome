import http from "./http";
const API_BASE_URL =
  import.meta.env.VITE_REACT_APP_BACKEND_URL?.replace(/\/$/, "") || "";
const NOTIFICATION_API_URL = API_BASE_URL ? `/api/v1/notifications` : "";
const BOOKING_API_URL = API_BASE_URL ? `/api/v1/bookings` : "";
const PAYMENT_API_URL = API_BASE_URL ? `/api/v1/payments` : "";

/**
 * Fetch all notifications for the authenticated user
 */
export const fetchNotifications = async () => {
  if (!NOTIFICATION_API_URL) return { data: [], unread_count: 0 };

  try {
    const res = await http.get(NOTIFICATION_API_URL);
    return res?.data || { data: [], unread_count: 0 };
  } catch (err) {
    console.warn("Failed to fetch notifications:", err);
    return { data: [], unread_count: 0 };
  }
};

/**
 * Get unread notification count
 */
export const fetchUnreadNotificationCount = async () => {
  if (!NOTIFICATION_API_URL) return 0;

  try {
    const res = await http.get(`${NOTIFICATION_API_URL}/unread/count`);
    return res?.data?.unread_count || res?.data || 0;
  } catch (err) {
    console.warn("Failed to fetch unread count:", err);
    return 0;
  }
};

/**
 * Mark a notification as read
 */
export const markNotificationAsRead = async (notificationId) => {
  if (!NOTIFICATION_API_URL) return null;

  try {
    const res = await http.put(
      `${NOTIFICATION_API_URL}/${notificationId}/read`,
    );
    return res?.data || null;
  } catch (err) {
    console.warn("Failed to mark notification as read:", err);
    return null;
  }
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsAsRead = async () => {
  if (!NOTIFICATION_API_URL) return null;

  try {
    const res = await http.put(`${NOTIFICATION_API_URL}/read-all`);
    return res?.data || null;
  } catch (err) {
    console.warn("Failed to mark all notifications as read:", err);
    return null;
  }
};

/**
 * Delete a notification
 */
export const deleteNotification = async (notificationId) => {
  if (!NOTIFICATION_API_URL) return null;

  try {
    const res = await http.delete(`${NOTIFICATION_API_URL}/${notificationId}`);
    return res?.data || null;
  } catch (err) {
    console.warn("Failed to delete notification:", err);
    return null;
  }
};

/**
 * Create a booking request
 */
export const createBooking = async (bookingData) => {
  if (!BOOKING_API_URL) {
    throw new Error("Booking API URL is not configured.");
  }

  try {
    const res = await http.post(BOOKING_API_URL, bookingData);
    return res?.data || null;
  } catch (err) {
    console.error("Failed to create booking:", err);
    const apiMessage = err?.response?.data?.message;
    const validationErrors = err?.response?.data?.errors;

    if (apiMessage) {
      throw new Error(apiMessage);
    }

    if (validationErrors && typeof validationErrors === "object") {
      const firstFieldErrors = Object.values(validationErrors)?.[0];
      const firstMessage = Array.isArray(firstFieldErrors)
        ? firstFieldErrors[0]
        : null;

      if (firstMessage) {
        throw new Error(firstMessage);
      }
    }

    throw new Error("Failed to create booking request. Please try again.");
  }
};

/**
 * Fetch owner's bookings (for property owner)
 */
export const fetchOwnerBookings = async () => {
  if (!BOOKING_API_URL) return { data: [] };

  try {
    const res = await http.get(`${BOOKING_API_URL}/owner`);
    return res?.data || { data: [] };
  } catch (err) {
    console.warn("Failed to fetch owner bookings:", err);
    return { data: [] };
  }
};

/**
 * Fetch tenant's bookings (for tenant)
 */
export const fetchTenantBookings = async () => {
  if (!BOOKING_API_URL) return { data: [] };

  try {
    const res = await http.get(`${BOOKING_API_URL}/tenant`);
    return res?.data || { data: [] };
  } catch (err) {
    console.warn("Failed to fetch tenant bookings:", err);
    return { data: [] };
  }
};

/**
 * Fetch tenant payment history.
 */
export const fetchTenantPayments = async (tenantId) => {
  if (!PAYMENT_API_URL || !tenantId) return { data: [] };

  try {
    const res = await http.get(`${PAYMENT_API_URL}/tenant/${tenantId}`);
    return res?.data || { data: [] };
  } catch (err) {
    console.warn("Failed to fetch tenant payments:", err);
    return { data: [] };
  }
};

/**
 * Initiate a booking payment and receive the SSLCommerz gateway URL.
 */
export const initiateBookingPayment = async ({ bookingId, paymentMethod }) => {
  if (!PAYMENT_API_URL) {
    throw new Error("Payment API URL is not configured.");
  }

  try {
    const res = await http.post(`${PAYMENT_API_URL}/initiate`, {
      booking_id: bookingId,
      payment_method: paymentMethod,
    });
    return res?.data || null;
  } catch (err) {
    console.error("Failed to initiate booking payment:", err);
    throw err;
  }
};

/**
 * Approve a booking (owner only)
 */
export const approveBooking = async (bookingId) => {
  if (!BOOKING_API_URL) return null;

  try {
    const res = await http.put(`${BOOKING_API_URL}/${bookingId}/approve`);
    return res?.data || null;
  } catch (err) {
    console.error("Failed to approve booking:", err);
    throw err;
  }
};

/**
 * Reject a booking (owner only)
 */
export const rejectBooking = async (bookingId) => {
  if (!BOOKING_API_URL) return null;

  try {
    const res = await http.put(`${BOOKING_API_URL}/${bookingId}/reject`);
    return res?.data || null;
  } catch (err) {
    console.error("Failed to reject booking:", err);
    throw err;
  }
};

/**
 * Get a single booking
 */
export const fetchBooking = async (bookingId) => {
  if (!BOOKING_API_URL) return null;

  try {
    const res = await http.get(`${BOOKING_API_URL}/${bookingId}`);
    return res?.data || null;
  } catch (err) {
    console.warn("Failed to fetch booking:", err);
    return null;
  }
};

/**
 * Subscribe to notification updates (polling)
 */
export const subscribeToNotifications = (callback, intervalMs = 5000) => {
  const poll = async () => {
    try {
      const response = await fetchNotifications();
      callback(response);
    } catch (err) {
      console.warn("Notification polling error:", err);
    }
  };

  poll(); // Initial fetch
  const intervalId = setInterval(poll, intervalMs);

  return () => clearInterval(intervalId); // Return cleanup function
};
