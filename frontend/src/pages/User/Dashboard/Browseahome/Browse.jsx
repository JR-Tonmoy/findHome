import { BedDouble, Filter, Heart, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCurrentMemberProfile } from "../../../../utils/memberStorage";
import { HOME_FEATURED_PROPERTIES } from "../../../../utils/propertyCatalog";
import {
  isPropertySaved,
  toggleSavedProperty,
} from "../../../../utils/savedPropertyStorage";

const properties = HOME_FEATURED_PROPERTIES;

const Browse = () => {
  const currentMember = getCurrentMemberProfile();
  const savedStorageKey = currentMember.email;
  const [showAllProperties, setShowAllProperties] = useState(false);
  const [, setSavedVersion] = useState(0);
  useEffect(() => {
    const refreshSavedState = () => {
      setSavedVersion((currentValue) => currentValue + 1);
    };

    window.addEventListener("saved-properties-updated", refreshSavedState);
    window.addEventListener("storage", refreshSavedState);

    return () => {
      window.removeEventListener("saved-properties-updated", refreshSavedState);
      window.removeEventListener("storage", refreshSavedState);
    };
  }, []);

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

  return (
    <div className="p-6">
      {/* Header section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Browse Properties</h1>
        <p className="text-gray-500 mt-1">Find your perfect rental home</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center">
        <input
          type="text"
          placeholder="Search location..."
          className="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        />
        <input
          type="text"
          placeholder="Property Type"
          className="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        />
        <input
          type="number"
          placeholder="Max Price (BDT)"
          className="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="w-full md:w-auto px-6 py-2 bg-black text-white font-semibold rounded-lg hover:bg-black flex items-center justify-center gap-2">
          <Filter size={18} /> Apply Filters
        </button>
      </div>

      {/* Grid of properties */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedProperties.map((property) => (
          <div
            key={property.id}
            className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Image Box */}
            <div className="h-48 overflow-hidden relative">
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-full object-cover"
              />
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
                  className="text-black text-sm font-semibold hover:underline"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-10">
        <button
          type="button"
          onClick={() => setShowAllProperties(true)}
          className="bg-black text-white px-8 py-3 rounded-lg text-md font-medium hover:bg-white hover:text-black border border-black transition mt-10"
        >
          Browse All Properties
        </button>
      </div>
    </div>
  );
};

export default Browse;
