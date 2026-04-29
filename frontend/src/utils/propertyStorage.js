const PROPERTY_STORAGE_KEY = "ownerProperties";

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
    bedrooms: toNumberOrNull(property.bedrooms ?? property.beds),
    bathrooms: toNumberOrNull(property.bathrooms ?? property.baths),
    beds: toNumberOrNull(property.beds ?? property.bedrooms),
    baths: toNumberOrNull(property.baths ?? property.bathrooms),
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

const saveProperty = (property) => {
  const currentProperties = getStoredProperties();
  const nextProperty = normalizePropertyRecord(property);
  const existingIndex = currentProperties.findIndex(
    (storedProperty) => storedProperty.id === nextProperty.id,
  );

  const updatedProperties =
    existingIndex >= 0
      ? currentProperties.map((storedProperty, index) =>
          index === existingIndex
            ? normalizePropertyRecord({
                ...storedProperty,
                ...property,
                id: storedProperty.id,
                createdAt: storedProperty.createdAt,
                owner: property.owner || storedProperty.owner,
              })
            : storedProperty,
        )
      : [nextProperty, ...currentProperties];

  writeJSON(PROPERTY_STORAGE_KEY, updatedProperties);

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("owner-properties-updated"));
  }

  return nextProperty;
};

const findPropertyById = (id) => {
  const normalizedId = String(id);

  return getStoredProperties().find((property) => property.id === normalizedId);
};

const deleteProperty = (id) => {
  const normalizedId = String(id);
  const currentProperties = getStoredProperties();
  const updatedProperties = currentProperties.filter(
    (property) => property.id !== normalizedId,
  );

  writeJSON(PROPERTY_STORAGE_KEY, updatedProperties);

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("owner-properties-updated"));
  }
};

export {
  deleteProperty,
  findPropertyById,
  getStoredProperties,
  normalizePropertyRecord,
  saveProperty,
};
