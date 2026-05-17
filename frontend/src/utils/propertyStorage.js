import { addAdminNotification } from "./adminNotificationStorage";
import http from "./http";

const PROPERTY_STORAGE_KEY = "ownerProperties";

const API_BASE_URL =
  import.meta.env.VITE_REACT_APP_BACKEND_URL?.replace(/\/$/, "") || "";
const PROPERTY_API_URL = API_BASE_URL ? `/api/v1/properties` : "";
const OWNER_API_URL = API_BASE_URL ? `/api/v1/owner` : "";

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

const requestJson = async (url, options = {}) => {
  if (!PROPERTY_API_URL) {
    throw new Error("Property API URL is not configured.");
  }

  const method = (options.method || "get").toLowerCase();
  if (method === "get") {
    const res = await http.get(url, { params: options.params });
    return res?.data;
  }

  if (method === "delete") {
    const res = await http.delete(url);
    return res?.data;
  }

  // post/put
  const body = options.body ? JSON.parse(options.body) : options.data || {};
  if (method === "post") {
    const res = await http.post(url, body);
    return res?.data;
  }

  if (method === "put") {
    const res = await http.put(url, body);
    return res?.data;
  }

  // fallback
  const res = await http.request({ url, method, data: body });
  return res?.data;
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
  const rawStatus = String(property.status || "").toLowerCase();
  const normalizedStatus =
    rawStatus === "currently_occupied" || rawStatus === "occupied"
      ? "rented"
      : rawStatus || "active";

  return {
    id: property.id ? String(property.id) : makePropertyId(),
    owner_id: toNumberOrNull(property.owner_id),
    user_id: toNumberOrNull(property.user_id),
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
    status: normalizedStatus,
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
    throw new Error(
      "Backend not configured. Cannot save property to database.",
    );
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

    if (!response || !response.data) {
      throw new Error(
        "Invalid response from backend: missing data in response.",
      );
    }

    const savedProperty = normalizePropertyRecord(response.data);
    if (!savedProperty.id) {
      throw new Error(
        "Backend did not return a property ID. Property may not have been created.",
      );
    }

    return savedProperty;
  } catch (err) {
    const message = err?.response?.data?.message || err?.message || String(err);
    throw new Error(`Failed to save property to database: ${message}`);
  }
};

const fetchOwnerProperties = async () => {
  if (!OWNER_API_URL) {
    return getStoredProperties();
  }

  try {
    const response = await requestJson(`${OWNER_API_URL}/properties`, {
      method: "GET",
    });
    const payload = response?.data || response || [];
    const ownerProperties = Array.isArray(payload)
      ? payload.map((property) => normalizePropertyRecord(property))
      : [];

    writeStoredProperties(ownerProperties, { notify: false });
    return ownerProperties;
  } catch {
    return getStoredProperties();
  }
};

const fetchOwnerDashboardStats = async () => {
  if (!OWNER_API_URL) {
    const local = getStoredProperties();
    return {
      total_properties: local.length,
      available_properties: local.filter((p) => p.status === "active").length,
      occupied_properties: local.filter((p) => p.status === "rented").length,
      pending_booking_requests: 0,
    };
  }

  try {
    const response = await requestJson(`${OWNER_API_URL}/dashboard-stats`, {
      method: "GET",
    });
    return response?.data || response || {};
  } catch {
    const local = getStoredProperties();
    return {
      total_properties: local.length,
      available_properties: local.filter((p) => p.status === "active").length,
      occupied_properties: local.filter((p) => p.status === "rented").length,
      pending_booking_requests: 0,
    };
  }
};

const saveProperty = async (property) => {
  const currentProperties = getStoredProperties();
  const nextProperty = normalizePropertyRecord(property);
  const method = property.id ? "PUT" : "POST";
  const isUpdate = currentProperties.some(
    (storedProperty) => storedProperty.id === nextProperty.id,
  );

  let savedProperty;

  // Require actual backend database save before confirming success
  try {
    savedProperty = await persistPropertyToBackend(nextProperty, method);
  } catch (error) {
    // If update failed, try as new property (POST)
    if (method === "PUT") {
      try {
        savedProperty = await persistPropertyToBackend(nextProperty, "POST");
      } catch (fallbackError) {
        throw fallbackError;
      }
    } else {
      throw error;
    }
  }

  // Property was successfully saved to database - now update local cache
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

  // Refresh properties from backend to ensure UI shows database version
  try {
    await fetchAllProperties();
  } catch {
    // Refresh failed but property was created - continue
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
      const properties = Array.isArray(response?.data || response)
        ? (response.data || response).map((property) =>
            normalizePropertyRecord(property),
          )
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
    { method: "GET" },
  );

  return normalizePropertyRecord(response?.data || response || null);
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
    const response = await requestJson(`${PROPERTY_API_URL}/search`, {
      method: "GET",
      params: { location: normalizedLocation },
    });

    const payload = response?.data || response || [];
    return Array.isArray(payload)
      ? payload.map((property) => normalizePropertyRecord(property))
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
  fetchOwnerDashboardStats,
  fetchOwnerProperties,
  fetchPropertiesByLocation,
  fetchPropertyById,
  findPropertyById,
  getStoredProperties,
  normalizePropertyRecord,
  saveProperty,
};
