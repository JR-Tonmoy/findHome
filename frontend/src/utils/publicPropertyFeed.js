import { HOME_FEATURED_PROPERTIES } from "./propertyCatalog";
import { fetchAllProperties } from "./propertyStorage";

const mergePropertiesById = (primaryProperties, secondaryProperties) => {
  const mergedProperties = new Map();

  [...primaryProperties, ...secondaryProperties].forEach((property) => {
    mergedProperties.set(String(property.id), property);
  });

  return Array.from(mergedProperties.values());
};

const getPublicProperties = async () => {
  const uploadedProperties = await fetchAllProperties();

  // Ensure uploaded (owner/admin) properties take precedence over the
  // bundled HOME_FEATURED_PROPERTIES. We merge featured first and then
  // uploaded so uploaded records overwrite any featured entries with
  // the same id. This makes all owner/admin-added properties visible to
  // owner, admin, and tenant users on the home page.
  return mergePropertiesById(HOME_FEATURED_PROPERTIES, uploadedProperties);
};

export { getPublicProperties };
