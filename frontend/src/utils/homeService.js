import http from "./http";
import { normalizePropertyRecord } from "./propertyStorage";

const API_BASE_URL =
  import.meta.env.VITE_REACT_APP_BACKEND_URL?.replace(/\/$/, "") || "";
const HOME_API_URL = API_BASE_URL ? `/api/home` : "";

const unwrapData = (response, fallback = []) =>
  response?.data?.data ?? response?.data ?? fallback;

export const fetchHomeProperties = async () => {
  if (!HOME_API_URL) return [];

  try {
    const response = await http.get(`${HOME_API_URL}/properties`);
    return Array.isArray(unwrapData(response))
      ? unwrapData(response).map((property) =>
          normalizePropertyRecord(property),
        )
      : [];
  } catch (error) {
    console.warn("Failed to fetch home properties:", error);
    return [];
  }
};

export const fetchHomePropertiesByCategory = async (category = "All") => {
  if (!HOME_API_URL) return [];

  try {
    const query =
      category && category !== "All"
        ? `?category=${encodeURIComponent(category)}`
        : "";
    const response = await http.get(`${HOME_API_URL}/properties${query}`);
    return Array.isArray(unwrapData(response))
      ? unwrapData(response).map((property) =>
          normalizePropertyRecord(property),
        )
      : [];
  } catch (error) {
    console.warn("Failed to fetch home properties by category:", error);
    return [];
  }
};

export const fetchFeaturedProperties = async () => {
  if (!HOME_API_URL) return [];

  try {
    const response = await http.get(`${HOME_API_URL}/featured-properties`);
    return Array.isArray(unwrapData(response))
      ? unwrapData(response).map((property) =>
          normalizePropertyRecord(property),
        )
      : [];
  } catch (error) {
    console.warn("Failed to fetch featured properties:", error);
    return [];
  }
};

export const fetchHomeStatistics = async () => {
  if (!HOME_API_URL) return {};

  try {
    const response = await http.get(`${HOME_API_URL}/statistics`);
    return unwrapData(response, {});
  } catch (error) {
    console.warn("Failed to fetch home statistics:", error);
    return {};
  }
};

export const fetchHomeCategories = async () => {
  if (!HOME_API_URL) return [];

  try {
    const response = await http.get(`${HOME_API_URL}/categories`);
    return Array.isArray(unwrapData(response)) ? unwrapData(response) : [];
  } catch (error) {
    console.warn("Failed to fetch home categories:", error);
    return [];
  }
};

export const fetchHomeData = async () => {
  const [latestProperties, featuredProperties, statistics, categories] =
    await Promise.all([
      fetchHomeProperties(),
      fetchFeaturedProperties(),
      fetchHomeStatistics(),
      fetchHomeCategories(),
    ]);

  return {
    latestProperties,
    featuredProperties,
    statistics,
    categories,
    latestLocations: statistics?.latest_locations || [],
    testimonials: statistics?.testimonials || [],
  };
};
