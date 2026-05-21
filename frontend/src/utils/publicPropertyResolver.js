import { fetchPropertyById, findPropertyById } from "./propertyStorage";
import { getPublicProperties } from "./publicPropertyFeed";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200";

const toNumberOrNull = (value) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsedValue = Number(value);
  return Number.isNaN(parsedValue) ? null : parsedValue;
};

const ensureImageSet = (property = {}) => {
  const images = Array.isArray(property.images)
    ? property.images.filter(Boolean)
    : property.image
      ? [property.image]
      : [];

  if (images.length === 0) {
    images.push(DEFAULT_IMAGE);
  }

  while (images.length < 3) {
    images.push(images[0]);
  }

  return images;
};

const normalizePublicProperty = (property = {}) => {
  const images = ensureImageSet(property);
  const bedrooms = toNumberOrNull(property.bedrooms ?? property.beds) ?? 0;
  const bathrooms = toNumberOrNull(property.bathrooms ?? property.baths) ?? 0;

  // Extract owner info from nested owner object or flat fields
  const ownerData = property.owner || {};
  const ownerName = ownerData.name || property.owner_name || "Property Owner";
  const ownerPhone = ownerData.phone || property.owner_phone || "N/A";
  const ownerEmail = ownerData.email || property.owner_email || "N/A";
  const ownerAvatar = ownerData.avatar || property.owner_avatar || null;
  const ownerProfileImage =
    ownerData.profile_image || property.owner_profile_image || null;

  return {
    id: String(property.id),
    title: property.title || "Untitled Property",
    location: property.location || "Location not set",
    price: property.price || "Negotiable",
    type: property.type || property.category || "Property",
    category: property.category || property.type || "Property",
    bedrooms,
    bathrooms,
    sqft: toNumberOrNull(property.sqft) ?? 0,
    floor: property.floor || "N/A",
    description:
      property.description ||
      `This ${property.type || property.category || "property"} listing is available in ${property.location || "your selected area"}.`,
    features:
      Array.isArray(property.features) && property.features.length > 0
        ? property.features
        : ["24/7 Security", "Reliable Utilities", "Good Neighborhood"],
    images,
    owner: {
      id: ownerData.id || null,
      name: ownerName,
      phone: ownerPhone,
      email: ownerEmail,
      avatar: ownerAvatar,
      profile_image: ownerProfileImage,
    },
    available_from_month:
      property.available_from_month || property.raw?.available_from_month || "",
    month: property.month || "",
  };
};

const resolvePublicPropertyById = async (propertyId) => {
  const normalizedId = String(propertyId);

  // Try backend-specific fetch first for most up-to-date owner/contact info
  try {
    const backendProp = await fetchPropertyById(normalizedId);
    if (backendProp) return normalizePublicProperty(backendProp);
  } catch (err) {
    // ignore and fall back to local/public feed
  }

  const storedProperty = findPropertyById(normalizedId);
  if (storedProperty) {
    return normalizePublicProperty(storedProperty);
  }

  const publicProperties = await getPublicProperties();
  const matchedProperty = publicProperties.find(
    (property) => String(property.id) === normalizedId,
  );

  return matchedProperty ? normalizePublicProperty(matchedProperty) : null;
};

export { normalizePublicProperty, resolvePublicPropertyById };
