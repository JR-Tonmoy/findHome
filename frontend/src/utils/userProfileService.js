/**
 * User Profile Service
 * Handles all user profile API requests with proper authentication
 */

import axios from "axios";
import { resolveAvatarUrl } from "./avatarHelper";

const API_BASE_URL =
  import.meta.env.VITE_REACT_APP_BACKEND_URL?.replace(/\/$/, "") || "";

const profileApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

const normalizeProfilePayload = (profile) => {
  if (!profile) return null;

  const avatar = resolveAvatarUrl(
    profile.avatar || profile.profile_image || "",
  );

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

const getStoredRole = () => {
  try {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    return (
      storedUser?.role ||
      localStorage.getItem("userRole") ||
      "tenant"
    ).toLowerCase();
  } catch {
    return (localStorage.getItem("userRole") || "tenant").toLowerCase();
  }
};

const getProfilePath = (role) =>
  role === "admin" ? "/api/v1/admin/profile" : "/api/v1/user/profile";

const getPasswordPath = () => "/api/v1/user/password";

const getUsersPath = () => "/api/v1/admin/users";

const getUserByIdPath = (userId) => `/api/v1/admin/users/${userId}`;

const request = async (config) => {
  if (!API_BASE_URL) {
    throw new Error("API Base URL is not configured.");
  }

  const response = await profileApiClient.request({
    ...config,
    headers: {
      ...(config.headers || {}),
      ...(getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {}),
    },
  });

  return response.data;
};

const handleError = (error) => {
  const message =
    error?.response?.data?.message ||
    error?.message ||
    "Request failed unexpectedly.";

  throw new Error(message);
};

export const fetchProfileByRole = async (role = getStoredRole()) => {
  try {
    const response = await request({
      url: getProfilePath(role),
      method: "GET",
    });

    return normalizeProfilePayload(response?.data || null);
  } catch (error) {
    console.error(`Failed to fetch ${role} profile:`, error);
    handleError(error);
  }
};

export const updateProfileByRole = async (
  profileData,
  role = getStoredRole(),
) => {
  try {
    const response = await request({
      url: getProfilePath(role),
      method: "PUT",
      data: {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
      },
    });

    return normalizeProfilePayload(response?.data || null);
  } catch (error) {
    console.error(`Failed to update ${role} profile:`, error);
    handleError(error);
  }
};

export const uploadProfileImageByRole = async (
  file,
  role = getStoredRole(),
) => {
  if (!file) {
    throw new Error("Profile image file is required");
  }

  try {
    const formData = new FormData();
    formData.append("profile_image", file);

    const response = await request({
      url: `${getProfilePath(role)}/image`,
      method: "POST",
      data: formData,
    });

    return normalizeProfilePayload(response?.data || null);
  } catch (error) {
    console.error(`Failed to upload ${role} profile image:`, error);
    handleError(error);
  }
};

export const updateUserPassword = async (currentPassword, newPassword) => {
  try {
    const response = await request({
      url: getPasswordPath(),
      method: "PUT",
      data: {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: newPassword,
      },
    });

    return response?.data || null;
  } catch (error) {
    console.error("Failed to update password:", error);
    handleError(error);
  }
};

export const fetchUserProfile = async () => fetchProfileByRole("tenant");

export const fetchAdminProfile = async () => fetchProfileByRole("admin");

export const updateUserProfile = async (profileData) =>
  updateProfileByRole(profileData, "tenant");

export const updateAdminProfile = async (profileData) =>
  updateProfileByRole(profileData, "admin");

export const uploadProfileImage = async (file, isAdmin = false) =>
  uploadProfileImageByRole(file, isAdmin ? "admin" : "tenant");

export const fetchAllUsers = async () => {
  try {
    const response = await request({
      url: getUsersPath(),
      method: "GET",
    });

    return response?.data || [];
  } catch (error) {
    console.error("Failed to fetch users:", error);
    handleError(error);
  }
};

export const fetchUserById = async (userId) => {
  try {
    const response = await request({
      url: getUserByIdPath(userId),
      method: "GET",
    });

    return response?.data || null;
  } catch (error) {
    console.error(`Failed to fetch user ${userId}:`, error);
    handleError(error);
  }
};

export default {
  fetchProfileByRole,
  updateProfileByRole,
  uploadProfileImageByRole,
  fetchUserProfile,
  fetchAdminProfile,
  updateUserProfile,
  updateAdminProfile,
  uploadProfileImage,
  updateUserPassword,
  fetchAllUsers,
  fetchUserById,
};
