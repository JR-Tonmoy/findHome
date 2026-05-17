import { BedDouble, Heart, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCurrentMemberProfile } from "../../../../utils/memberStorage";
import {
  fetchAllProperties,
  fetchPropertiesByLocation,
} from "../../../../utils/propertyStorage";
import {
  isPropertySaved,
  toggleSavedProperty,
} from "../../../../utils/savedPropertyStorage";

const Browse = () => {
  const currentMember = getCurrentMemberProfile();
  const savedStorageKey = currentMember.email;
  const [showAllProperties, setShowAllProperties] = useState(false);
  const [properties, setProperties] = useState([]);
  const [locationQuery, setLocationQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [, setSavedVersion] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isActive = true;

    const loadProperties = async () => {
      setLoading(true);

      try {
        const searchText = locationQuery.trim();
        const allProperties = searchText
          ? await fetchPropertiesByLocation(searchText)
          : await fetchAllProperties();

        if (isActive) {
          setProperties(allProperties);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    const timeoutId = setTimeout(loadProperties, 250);

    const refreshSavedState = () => {
      setSavedVersion((currentValue) => currentValue + 1);
    };

    const refreshProperties = () => {
      setReloadKey((currentValue) => currentValue + 1);
    };

    window.addEventListener("storage", refreshProperties);
    window.addEventListener("saved-properties-updated", refreshSavedState);
    window.addEventListener("owner-properties-updated", refreshProperties);
    window.addEventListener("public-properties-updated", refreshProperties);

    return () => {
      isActive = false;
      clearTimeout(timeoutId);
      window.removeEventListener("storage", refreshProperties);
      window.removeEventListener("saved-properties-updated", refreshSavedState);
      window.removeEventListener("owner-properties-updated", refreshProperties);
      window.removeEventListener(
        "public-properties-updated",
        refreshProperties,
      );
    };
  }, [locationQuery, reloadKey]);

  const savedPropertyMap = properties.reduce((accumulator, property) => {
    accumulator[property.id] = isPropertySaved(property.id, savedStorageKey);
    return accumulator;
  }, {});

  const handleToggleSaved = (propertyId) => {
    const property = properties.find((item) => item.id === propertyId);

    toggleSavedProperty(property || propertyId, savedStorageKey);
  };

  const displayedProperties = showAllProperties
    ? properties
    : properties.slice(0, 3);

  const shouldShowAllResults = locationQuery.trim().length > 0;
  const visibleProperties = shouldShowAllResults
    ? properties
    : displayedProperties;

  return (
    <div className="p-6">
      {/* Header section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Browse Properties</h1>
        <p className="text-gray-500 mt-1 mb-4">Find your perfect rental home</p>
        <input
          type="text"
          value={locationQuery}
          onChange={(event) => setLocationQuery(event.target.value)}
          placeholder="Search by location"
          className="w-full sm:w-96 h-11 px-4 rounded-lg border border-gray-300 text-gray-800 placeholder:text-gray-400 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all"
        />
      </div>

      {/* Grid of properties */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-gray-500">Loading properties...</p>
        ) : visibleProperties.length === 0 ? (
          <p className="text-gray-500">
            No properties found for this location.
          </p>
        ) : (
          visibleProperties.map((property) => (
            <div
              key={property.id}
              className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Image Box */}
              <div className="h-48 overflow-hidden relative">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <span
                  className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold ${
                    String(
                      property.status || property.raw?.status || "available",
                    )
                      .toLowerCase()
                      .includes("available")
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {String(
                    property.status || property.raw?.status || "Available",
                  )
                    .toLowerCase()
                    .includes("available")
                    ? "Available"
                    : "Currently Occupied"}
                </span>
              </div>

              {/* Content Box */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-800">
                    {property.title}
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleToggleSaved(property.id)}
                    className={`transition-colors ${
                      savedPropertyMap[property.id]
                        ? "text-red-500"
                        : "text-gray-400 hover:text-red-500"
                    }`}
                    aria-pressed={savedPropertyMap[property.id]}
                    aria-label={
                      savedPropertyMap[property.id]
                        ? "Remove from saved houses"
                        : "Save house"
                    }
                  >
                    <Heart
                      size={20}
                      fill={
                        savedPropertyMap[property.id] ? "currentColor" : "none"
                      }
                    />
                  </button>
                </div>

                {/* Location */}
                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <MapPin size={16} className="mr-1" />
                  {property.location}
                </div>

                {/* Badges */}
                <div className="flex items-center gap-3 mb-4">
                  {property.beds > 0 && (
                    <div className="flex items-center text-sm text-gray-600">
                      <BedDouble size={16} className="mr-1 text-black" />
                      {property.beds} Bed
                    </div>
                  )}
                  <span className="px-2 py-1 bg-gray-100 text-black text-xs font-semibold rounded">
                    {property.type}
                  </span>
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-2">
                  <div className="text-black font-bold text-lg flex items-center">
                    ৳ {property.price}
                    <span className="text-gray-400 text-sm font-normal ml-1">
                      /month
                    </span>
                  </div>
                  <Link
                    to={`/property/${property.id}`}
                    className="inline-flex items-center rounded-lg border border-black px-3 py-1.5 text-sm font-semibold text-black hover:bg-black hover:text-white transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {!shouldShowAllResults && !showAllProperties && properties.length > 3 ? (
        <div className="flex justify-center mt-10">
          <button
            type="button"
            onClick={() => setShowAllProperties(true)}
            className="bg-black text-white px-8 py-3 rounded-lg text-md font-medium hover:bg-white hover:text-black border border-black transition mt-10"
          >
            Browse All Properties
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default Browse;
