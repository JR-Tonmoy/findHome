import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentMemberProfile } from "../../utils/memberStorage";
import { HOME_FEATURED_PROPERTIES } from "../../utils/propertyCatalog";
import { getStoredProperties } from "../../utils/propertyStorage";
import {
  isPropertySaved,
  toggleSavedProperty,
} from "../../utils/savedPropertyStorage";

const Product = ({ selectedCategory = "All" }) => {
  const navigate = useNavigate();
  const currentMember = getCurrentMemberProfile();
  const savedStorageKey = currentMember.email;
  const [savedProperties, setSavedProperties] = useState(() =>
    getStoredProperties(),
  );
  const [, setSavedRefreshTick] = useState(0);

  useEffect(() => {
    const refreshSavedProperties = () => {
      setSavedProperties(getStoredProperties());
    };

    const refreshSavedState = () => {
      setSavedRefreshTick((currentValue) => currentValue + 1);
    };

    refreshSavedProperties();
    window.addEventListener("storage", refreshSavedProperties);
    window.addEventListener("owner-properties-updated", refreshSavedProperties);
    window.addEventListener("saved-properties-updated", refreshSavedState);

    return () => {
      window.removeEventListener("storage", refreshSavedProperties);
      window.removeEventListener(
        "owner-properties-updated",
        refreshSavedProperties,
      );
      window.removeEventListener("saved-properties-updated", refreshSavedState);
    };
  }, []);

  const handleViewDetails = (e, propertyId) => {
    e.preventDefault();
    navigate(`/property/${propertyId}`);
  };

  const featuredProperties = HOME_FEATURED_PROPERTIES;

  const savedPropertyCards = savedProperties.map((property) => ({
    id: property.id,
    category: property.category,
    title: property.title,
    location:
      property.location ||
      [property.area, property.district, property.division]
        .filter(Boolean)
        .join(", "),
    price: property.price,
    beds: property.beds,
    baths: property.baths,
    sqft: property.sqft,
    image:
      property.image ||
      property.images?.[0] ||
      "https://placehold.co/400x300?text=No+Image",
  }));

  const allProperties = [
    ...savedPropertyCards,
    ...featuredProperties.filter(
      (featuredProperty) =>
        !savedPropertyCards.some(
          (savedProperty) => savedProperty.id === featuredProperty.id,
        ),
    ),
  ];

  // Filter properties based on selected category, then slice to show max 10
  const filteredProperties =
    selectedCategory === "All"
      ? allProperties
      : allProperties.filter(
          (property) => property.category === selectedCategory,
        );

  const displayedProperties = filteredProperties.slice(0, 10);

  const handleToggleSaved = (propertyId) => {
    const property = featuredProperties.find(
      (featuredProperty) => featuredProperty.id === propertyId,
    );

    toggleSavedProperty(property || propertyId, savedStorageKey);
  };

  return (
    <div
      id="featured-properties"
      className="container mx-auto px-4 md:px-10 mt-5 bg-white py-5"
    >
      {/* Title */}
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-black text-center md:text-left">
        Featured Properties
      </h2>

      {/* Card Grid Container for Featured Properties*/}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-5">
        {displayedProperties.length > 0 ? (
          displayedProperties.map((property) => (
            <div
              key={property.id}
              className="flex flex-col bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-transform duration-300 hover:scale-105 h-full cursor-pointer"
            >
              {/* <Featured Properties image edit/> */}
              <div className="w-full h-48 bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/400x300?text=No+Image";
                  }}
                />
              </div>
              <div className="p-5 flex grow flex-col">
                <h3 className="font-bold text-lg text-black line-clamp-1">
                  {property.title}
                </h3>
                <p className="text-gray-600 text-sm mt-1 flex items-center gap-1 line-clamp-1">
                  📍 {property.location}
                </p>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-black font-bold text-xl">
                      ৳{property.price}
                    </span>
                    <span className="text-gray-500 text-sm"> / month</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleSaved(property.id)}
                    className={`rounded-full p-2 transition-colors ${
                      isPropertySaved(property.id, savedStorageKey)
                        ? "text-red-500"
                        : "text-gray-400 hover:text-red-500"
                    }`}
                    aria-pressed={isPropertySaved(property.id, savedStorageKey)}
                    aria-label={
                      isPropertySaved(property.id, savedStorageKey)
                        ? "Remove from saved houses"
                        : "Save house"
                    }
                  >
                    <Heart
                      size={20}
                      fill={
                        isPropertySaved(property.id, savedStorageKey)
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>
                </div>

                {/* Property Details (Beds, Baths, Sqft) */}
                <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-4 mb-4 pt-4 border-t border-gray-200 text-xs md:text-sm text-gray-700">
                  {property.beds && (
                    <span className="flex items-center gap-1">
                      🛏️ {property.beds} Bed
                    </span>
                  )}
                  {property.baths && (
                    <span className="flex items-center gap-1">
                      🛁 {property.baths} Bath
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    📐 {property.sqft} sqft
                  </span>
                </div>

                <button
                  onClick={(e) => handleViewDetails(e, property.id)}
                  className="mt-auto block w-full text-center bg-black text-white! font-semibold py-2 rounded-lg hover:bg-gray-800 transition cursor-pointer"
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full">No properties found.</p>
        )}
      </div>

      {/* Browse Button */}
      <div className="flex justify-center mt-10">
        <Link to="/dashboard/browse">
          <button className="bg-black text-white px-8 py-3 rounded-lg text-md font-medium hover:bg-white hover:text-black border border-black transition mt-10">
            Browse All Properties
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Product;
