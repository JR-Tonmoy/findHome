/**
 * User Profile Service
 * Handles all user profile API requests with proper authentication
 */

const API_BASE_URL =
  import.meta.env.VITE_REACT_APP_BACKEND_URL?.replace(/\/$/, "") || "";
const USER_API_URL = API_BASE_URL ? `${API_BASE_URL}/api/v1/user` : "";
const ADMIN_API_URL = API_BASE_URL ? `${API_BASE_URL}/api/v1/admin` : "";

const normalizeProfilePayload = (profile) => {
  if (!profile) return null;

  const avatar = profile.avatar || profile.profile_image || "";

  return {
    ...profile,
    avatar,
    profile_image: avatar,
    fullName: profile.fullName || profile.name || "",
  };
};

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
 * Get authenticated user's profile
 */
export const fetchUserProfile = async () => {
  if (!USER_API_URL) {
    throw new Error("User API URL not configured");
  }

  try {
    const response = await requestJson(`${USER_API_URL}/profile`, {
      method: "GET",
    });
    return normalizeProfilePayload(response?.data || null);
  } catch (err) {
    console.error("Failed to fetch user profile:", err);
    throw err;
  }
};

/**
 * Get authenticated admin profile
 * (Admin can get their own profile via /admin/profile or /user/profile)
 */
export const fetchAdminProfile = async () => {
  if (!ADMIN_API_URL) {
    throw new Error("Admin API URL not configured");
  }

  try {
    const response = await requestJson(`${ADMIN_API_URL}/profile`, {
      method: "GET",
    });
    return normalizeProfilePayload(response?.data || null);
  } catch (err) {
    console.error("Failed to fetch admin profile:", err);
    // Fallback to user profile endpoint
    try {
      return await fetchUserProfile();
    } catch {
      throw err;
    }
  }
};

/**
 * Update authenticated user's profile
 */
export const updateUserProfile = async (profileData) => {
  if (!USER_API_URL) {
    throw new Error("User API URL not configured");
  }

  try {
    const response = await requestJson(`${USER_API_URL}/profile`, {
      method: "PUT",
      body: JSON.stringify({
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        avatar: profileData.avatar || profileData.profile_image,
        profile_image: profileData.profile_image || profileData.avatar,
      }),
    });
    return normalizeProfilePayload(response?.data || null);
  } catch (err) {
    console.error("Failed to update user profile:", err);
    throw err;
  }
};

/**
 * Update authenticated admin's profile
 */
export const updateAdminProfile = async (profileData) => {
  if (!ADMIN_API_URL) {
    throw new Error("Admin API URL not configured");
  }

  try {
    const response = await requestJson(`${ADMIN_API_URL}/profile`, {
      method: "PUT",
      body: JSON.stringify({
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        avatar: profileData.avatar || profileData.profile_image,
        profile_image: profileData.profile_image || profileData.avatar,
      }),
    });
    return normalizeProfilePayload(response?.data || null);
  } catch (err) {
    console.error("Failed to update admin profile:", err);
    // Fallback to user profile endpoint
    try {
      return await updateUserProfile(profileData);
    } catch {
      throw err;
    }
  }
};

/**
 * Update user password
 */
export const updateUserPassword = async (currentPassword, newPassword) => {
  if (!USER_API_URL) {
    throw new Error("User API URL not configured");
  }

  try {
    const response = await requestJson(`${USER_API_URL}/password`, {
      method: "PUT",
      body: JSON.stringify({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: newPassword,
      }),
    });
    return response?.data || null;
  } catch (err) {
    console.error("Failed to update password:", err);
    throw err;
  }
};

/**
 * Upload profile image for authenticated user/admin
 */
export const uploadProfileImage = async (file, isAdmin = false) => {
  if (!file) {
    throw new Error("Profile image file is required");
  }

  const endpointBase = isAdmin ? ADMIN_API_URL : USER_API_URL;
  if (!endpointBase) {
    throw new Error("Profile API URL not configured");
  }

  const formData = new FormData();
  formData.append("profile_image", file);

  const response = await fetch(`${endpointBase}/profile/image`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      ...(getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {}),
    },
    body: formData,
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

  return normalizeProfilePayload(payload?.data || null);
};

/**
 * Get all users (admin only)
 */
export const fetchAllUsers = async () => {
  if (!ADMIN_API_URL) {
    throw new Error("Admin API URL not configured");
  }

  try {
    const response = await requestJson(`${ADMIN_API_URL}/users`, {
      method: "GET",
    });
    return response?.data || [];
  } catch (err) {
    console.error("Failed to fetch users:", err);
    throw err;
  }
};

/**
 * Get specific user by ID (admin only)
 */
export const fetchUserById = async (userId) => {
  if (!ADMIN_API_URL) {
    throw new Error("Admin API URL not configured");
  }

  try {
    const response = await requestJson(`${ADMIN_API_URL}/users/${userId}`, {
      method: "GET",
    });
    return response?.data || null;
  } catch (err) {
    console.error(`Failed to fetch user ${userId}:`, err);
    throw err;
  }
};

export default {
  fetchUserProfile,
  fetchAdminProfile,
  updateUserProfile,
  updateAdminProfile,
  uploadProfileImage,
  updateUserPassword,
  fetchAllUsers,
  fetchUserById,
};
