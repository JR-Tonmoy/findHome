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

  return mergePropertiesById(uploadedProperties, HOME_FEATURED_PROPERTIES);
};

export { getPublicProperties };
