const API_BASE_URL =
  import.meta.env.VITE_REACT_APP_BACKEND_URL?.replace(/\/$/, "") || "";
const NOTIFICATION_API_URL = API_BASE_URL
  ? `${API_BASE_URL}/api/v1/notifications`
  : "";
const BOOKING_API_URL = API_BASE_URL ? `${API_BASE_URL}/api/v1/bookings` : "";

const getAuthToken = () => {
  try {
    return localStorage.getItem("token") || "";
  } catch {
    return "";
  }
};

const requestJson = async (url, options = {}) => {
  if (!API_BASE_URL) {
    throw new Error("API Base URL is not configured.");
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {}),
      ...(options.headers || {}),
    },
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    throw new Error(
      payload?.message || `Request failed with status ${response.status}`,
    );
  }

  return payload;
};

/**
 * Fetch all notifications for the authenticated user
 */
export const fetchNotifications = async () => {
  if (!NOTIFICATION_API_URL) return { data: [], unread_count: 0 };

  try {
    const response = await requestJson(NOTIFICATION_API_URL, { method: "GET" });
    return response || { data: [], unread_count: 0 };
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
    const response = await requestJson(`${NOTIFICATION_API_URL}/unread/count`, {
      method: "GET",
    });
    return response?.unread_count || 0;
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
    const response = await requestJson(
      `${NOTIFICATION_API_URL}/${notificationId}/read`,
      { method: "PUT" },
    );
    return response?.data || null;
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
    const response = await requestJson(`${NOTIFICATION_API_URL}/read-all`, {
      method: "PUT",
    });
    return response || null;
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
    const response = await requestJson(
      `${NOTIFICATION_API_URL}/${notificationId}`,
      { method: "DELETE" },
    );
    return response || null;
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
    const response = await requestJson(BOOKING_API_URL, {
      method: "POST",
      body: JSON.stringify(bookingData),
    });
    return response?.data || null;
  } catch (err) {
    console.error("Failed to create booking:", err);
    throw err;
  }
};

/**
 * Fetch owner's bookings (for property owner)
 */
export const fetchOwnerBookings = async () => {
  if (!BOOKING_API_URL) return { data: [] };

  try {
    const response = await requestJson(`${BOOKING_API_URL}/owner`, {
      method: "GET",
    });
    return response || { data: [] };
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
    const response = await requestJson(`${BOOKING_API_URL}/tenant`, {
      method: "GET",
    });
    return response || { data: [] };
  } catch (err) {
    console.warn("Failed to fetch tenant bookings:", err);
    return { data: [] };
  }
};

/**
 * Approve a booking (owner only)
 */
export const approveBooking = async (bookingId) => {
  if (!BOOKING_API_URL) return null;

  try {
    const response = await requestJson(
      `${BOOKING_API_URL}/${bookingId}/approve`,
      {
        method: "PUT",
      },
    );
    return response?.data || null;
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
    const response = await requestJson(
      `${BOOKING_API_URL}/${bookingId}/reject`,
      {
        method: "PUT",
      },
    );
    return response?.data || null;
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
    const response = await requestJson(`${BOOKING_API_URL}/${bookingId}`, {
      method: "GET",
    });
    return response?.data || null;
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
