import { addAdminNotification } from "./adminNotificationStorage";

const PROPERTY_STORAGE_KEY = "ownerProperties";

const API_BASE_URL =
  import.meta.env.VITE_REACT_APP_BACKEND_URL?.replace(/\/$/, "") || "";
const PROPERTY_API_URL = API_BASE_URL
  ? `${API_BASE_URL}/api/v1/properties`
  : "";

const readJSON = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

const writeJSON = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

let fetchAllPropertiesInFlight = null;
let lastFetchAllPropertiesAt = 0;
const FETCH_ALL_PROPERTIES_DEBOUNCE_MS = 1500;

const dispatchPropertiesUpdated = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("owner-properties-updated"));
  }
};

const getAuthToken = () => {
  try {
    return localStorage.getItem("token") || "";
  } catch {
    return "";
  }
};

const requestJson = async (url, options = {}) => {
  if (!PROPERTY_API_URL) {
    throw new Error("Property API URL is not configured.");
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

const makePropertyId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `property-${crypto.randomUUID()}`;
  }

  return `property-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

const toNumberOrNull = (value) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsedValue = Number(value);

  return Number.isNaN(parsedValue) ? null : parsedValue;
};

const normalizePropertyRecord = (property = {}) => {
  const images = Array.isArray(property.images)
    ? property.images.filter(Boolean)
    : property.image
      ? [property.image]
      : [];

  // Ensure there are at least 3 images for the gallery view by
  // duplicating the first image as fallback when fewer are provided.
  if (images.length > 0 && images.length < 3) {
    while (images.length < 3) {
      images.push(images[0]);
    }
  }

  const bedsVal = toNumberOrNull(property.beds ?? property.bedrooms);
  const bathsVal = toNumberOrNull(property.baths ?? property.bathrooms);

  return {
    id: property.id ? String(property.id) : makePropertyId(),
    title: property.title || property.shortAddress || "Untitled Property",
    category: property.category || "Family",
    type:
      property.type || property.propertyType || property.category || "Property",
    location:
      property.location ||
      [property.area, property.district, property.division]
        .filter(Boolean)
        .join(", "),
    price: property.price || "0",
    // Keep both `beds`/`baths` and `bedrooms`/`bathrooms` for compatibility
    beds: bedsVal,
    baths: bathsVal,
    bedrooms: bedsVal,
    bathrooms: bathsVal,
    sqft: toNumberOrNull(property.sqft),
    floor: property.floor || "",
    description: property.description || "",
    features: Array.isArray(property.features) ? property.features : [],
    images,
    image: property.image || images[0] || "",
    owner: property.owner || {
      name: "Property Owner",
      phone: "N/A",
      email: "N/A",
    },
    month: property.month || "",
    priceType: property.priceType || "Monthly",
    shortAddress: property.shortAddress || "",
    division: property.division || "",
    district: property.district || "",
    area: property.area || "",
    sectorNo: property.sectorNo || "",
    roadNo: property.roadNo || "",
    houseNo: property.houseNo || "",
    balcony: property.balcony || "",
    gender: property.gender || "",
    raw: property.raw || {},
    createdAt: property.createdAt || new Date().toISOString(),
  };
};

const getStoredProperties = () =>
  readJSON(PROPERTY_STORAGE_KEY, []).map((property) =>
    normalizePropertyRecord(property),
  );

const writeStoredProperties = (properties, options = {}) => {
  const { notify = true } = options;
  writeJSON(PROPERTY_STORAGE_KEY, properties);
  if (notify) {
    dispatchPropertiesUpdated();
  }
};

const persistPropertyToBackend = async (property, method) => {
  if (!PROPERTY_API_URL) {
    return property;
  }

  try {
    const url =
      method === "POST"
        ? PROPERTY_API_URL
        : `${PROPERTY_API_URL}/${encodeURIComponent(property.id)}`;

    const response = await requestJson(url, {
      method,
      body: JSON.stringify(property),
    });

    return normalizePropertyRecord(response?.data || property);
  } catch {
    // Backend API is not available (404, 500, etc.) - silently use local property
    // This is expected and allowed - the app works fine with localStorage
    return property;
  }
};

const saveProperty = async (property) => {
  const currentProperties = getStoredProperties();
  const nextProperty = normalizePropertyRecord(property);
  const method = property.id ? "PUT" : "POST";
  let savedProperty = nextProperty;
  const isUpdate = currentProperties.some(
    (storedProperty) => storedProperty.id === nextProperty.id,
  );

  try {
    savedProperty = await persistPropertyToBackend(nextProperty, method);
  } catch (error) {
    if (method === "PUT") {
      try {
        savedProperty = await persistPropertyToBackend(nextProperty, "POST");
      } catch {
        console.warn(
          "Property API save failed; keeping the local copy.",
          error,
        );
      }
    } else {
      console.warn("Property API save failed; keeping the local copy.", error);
    }
  }

  const existingIndex = currentProperties.findIndex(
    (storedProperty) => storedProperty.id === savedProperty.id,
  );

  const updatedProperties =
    existingIndex >= 0
      ? currentProperties.map((storedProperty, index) =>
          index === existingIndex ? savedProperty : storedProperty,
        )
      : [savedProperty, ...currentProperties];

  writeStoredProperties(updatedProperties);

  addAdminNotification({
    type: "property",
    title: isUpdate ? "Property updated" : "New property uploaded",
    message: `${savedProperty.owner?.name || "An owner"} ${isUpdate ? "updated" : "uploaded"} ${savedProperty.title}.`,
    meta: {
      propertyId: savedProperty.id,
      ownerName: savedProperty.owner?.name || "Property Owner",
      propertyTitle: savedProperty.title,
    },
    createdAt: savedProperty.createdAt || new Date().toISOString(),
  });

  // Refresh properties from backend and dispatch event to update home page
  // This ensures owner/admin-added properties appear immediately on home page
  // for all users (owner, admin, tenant).
  if (PROPERTY_API_URL) {
    try {
      await fetchAllProperties();
    } catch {
      console.warn("Failed to refresh properties from backend after save.");
    }
  }

  // Dispatch both owner-properties-updated and a new event for public properties
  dispatchPropertiesUpdated();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("public-properties-updated"));
  }

  return savedProperty;
};

const findPropertyById = (id) => {
  const normalizedId = String(id);

  return getStoredProperties().find((property) => property.id === normalizedId);
};

const fetchAllProperties = async () => {
  const now = Date.now();

  if (
    fetchAllPropertiesInFlight ||
    now - lastFetchAllPropertiesAt < FETCH_ALL_PROPERTIES_DEBOUNCE_MS
  ) {
    return fetchAllPropertiesInFlight || Promise.resolve(getStoredProperties());
  }

  if (!PROPERTY_API_URL) {
    return getStoredProperties();
  }

  fetchAllPropertiesInFlight = (async () => {
    try {
      const response = await requestJson(PROPERTY_API_URL, { method: "GET" });
      const properties = Array.isArray(response?.data)
        ? response.data.map((property) => normalizePropertyRecord(property))
        : null;

      // Only overwrite local cache when backend returned a non-empty list.
      // Avoid notifying listeners here, otherwise they can recursively retrigger fetches.
      if (Array.isArray(response?.data) && properties.length > 0) {
        writeStoredProperties(properties, { notify: false });
        return properties;
      }

      return getStoredProperties();
    } catch {
      // Backend API not available (404, connection error, etc.) - silently use local cache
      // This is expected behavior when backend is not running
      return getStoredProperties();
    } finally {
      lastFetchAllPropertiesAt = Date.now();
      fetchAllPropertiesInFlight = null;
    }
  })();

  return fetchAllPropertiesInFlight;
};

const fetchPropertyById = async (id) => {
  const existingProperty = findPropertyById(id);

  if (existingProperty) {
    return existingProperty;
  }

  if (!PROPERTY_API_URL) {
    return null;
  }

  const response = await requestJson(
    `${PROPERTY_API_URL}/${encodeURIComponent(id)}`,
    {
      method: "GET",
    },
  );

  return normalizePropertyRecord(response?.data || null);
};

const fetchPropertiesByLocation = async (location = "") => {
  const normalizedLocation = String(location || "").trim();

  if (!normalizedLocation) {
    return fetchAllProperties();
  }

  if (!PROPERTY_API_URL) {
    return getStoredProperties().filter((property) =>
      String(property.location || "")
        .toLowerCase()
        .includes(normalizedLocation.toLowerCase()),
    );
  }

  try {
    const response = await requestJson(
      `${PROPERTY_API_URL}/search?location=${encodeURIComponent(normalizedLocation)}`,
      {
        method: "GET",
      },
    );

    return Array.isArray(response?.data)
      ? response.data.map((property) => normalizePropertyRecord(property))
      : [];
  } catch {
    return getStoredProperties().filter((property) =>
      String(property.location || "")
        .toLowerCase()
        .includes(normalizedLocation.toLowerCase()),
    );
  }
};

const deleteProperty = async (id) => {
  const normalizedId = String(id);

  if (PROPERTY_API_URL) {
    try {
      await requestJson(
        `${PROPERTY_API_URL}/${encodeURIComponent(normalizedId)}`,
        {
          method: "DELETE",
        },
      );
    } catch (error) {
      console.warn(
        "Property API delete failed; removing the local copy only.",
        error,
      );
    }
  }

  const currentProperties = getStoredProperties();
  const updatedProperties = currentProperties.filter(
    (property) => property.id !== normalizedId,
  );

  writeStoredProperties(updatedProperties);
};

export {
  deleteProperty,
  fetchAllProperties,
  fetchPropertiesByLocation,
  fetchPropertyById,
  findPropertyById,
  getStoredProperties,
  normalizePropertyRecord,
  saveProperty,
};
