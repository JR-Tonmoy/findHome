import { getCatalogPropertyById } from "./propertyCatalog";

const getSavedPropertiesKey = (email) =>
  `savedProperties:${String(email || "guest").toLowerCase()}`;

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

const getSavedPropertyEntries = (email) =>
  readJSON(getSavedPropertiesKey(email), []);

const normalizeSavedPropertyEntry = (entry) => {
  if (!entry) {
    return null;
  }

  if (typeof entry === "object") {
    return entry.id ? entry : null;
  }

  return getCatalogPropertyById(entry) || null;
};

const getSavedPropertyIds = (email) =>
  getSavedPropertyEntries(email)
    .map((entry) =>
      typeof entry === "object" ? String(entry.id) : String(entry),
    )
    .filter(Boolean);

const isPropertySaved = (propertyId, email) =>
  getSavedPropertyIds(email).includes(String(propertyId));

const toggleSavedProperty = (propertyOrId, email) => {
  const storageKey = getSavedPropertiesKey(email);
  const nextProperty =
    typeof propertyOrId === "object"
      ? propertyOrId
      : getCatalogPropertyById(propertyOrId) || {
          id: String(propertyOrId),
        };
  const currentEntries = getSavedPropertyEntries(email);
  const nextId = String(nextProperty.id);
  const nextEntries = currentEntries.some((entry) => {
    const entryId =
      typeof entry === "object" ? String(entry.id) : String(entry);

    return entryId === nextId;
  })
    ? currentEntries.filter((entry) => {
        const entryId =
          typeof entry === "object" ? String(entry.id) : String(entry);

        return entryId !== nextId;
      })
    : [nextProperty, ...currentEntries];

  writeJSON(storageKey, nextEntries);

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("saved-properties-updated"));
  }

  return nextEntries;
};

const getSavedProperties = (email) => {
  return getSavedPropertyEntries(email)
    .map(normalizeSavedPropertyEntry)
    .filter(Boolean);
};

const getSavedPropertyCount = (email) => getSavedPropertyEntries(email).length;

export {
  getSavedProperties,
  getSavedPropertyCount,
  getSavedPropertyIds,
  isPropertySaved,
  toggleSavedProperty,
};
