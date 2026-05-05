import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getCurrentMemberProfile } from "../../utils/memberStorage";
import { getPublicProperties } from "../../utils/publicPropertyFeed";
import {
  isPropertySaved,
  toggleSavedProperty,
} from "../../utils/savedPropertyStorage";

const Product = ({ selectedCategory = "All" }) => {
  const navigate = useNavigate();
  const currentMember = getCurrentMemberProfile();
  const savedStorageKey = currentMember.email;
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [, setSavedRefreshTick] = useState(0);

  useEffect(() => {
    let isActive = true;

    const loadProperties = async () => {
      setLoading(true);

      try {
        const allProperties = await getPublicProperties();

        if (isActive) {
          setProperties(allProperties);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    const refreshSavedState = () => {
      setSavedRefreshTick((currentValue) => currentValue + 1);
    };

    loadProperties();
    window.addEventListener("storage", loadProperties);
    window.addEventListener("owner-properties-updated", loadProperties);
    window.addEventListener("saved-properties-updated", refreshSavedState);

    return () => {
      isActive = false;
      window.removeEventListener("storage", loadProperties);
      window.removeEventListener("owner-properties-updated", loadProperties);
      window.removeEventListener("saved-properties-updated", refreshSavedState);
    };
  }, []);

  const handleViewDetails = (e, propertyId) => {
    e.preventDefault();
    navigate(`/property/${propertyId}`);
  };

  const location = useLocation();

  // Read optional division query param from URL
  const params = new URLSearchParams(location.search);
  const divisionFilter = params.get("division") || null;

  // Filter properties based on selected category, then slice to show max 10
  let filteredProperties =
    selectedCategory === "All"
      ? properties
      : properties.filter((property) => property.category === selectedCategory);

  // If division filter is present, include properties matching by `division`,
  // or where the `location`/area/district contains the division string.
  if (divisionFilter) {
    const d = String(divisionFilter).toLowerCase().trim();
    filteredProperties = filteredProperties.filter((property) => {
      // direct division field
      if (property.division && String(property.division).toLowerCase() === d)
        return true;
      // some featured properties may not have division but location may include it
      if (
        property.location &&
        String(property.location).toLowerCase().includes(d)
      )
        return true;
      // check area/district/division concatenation
      const composed = [property.area, property.district, property.division]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (composed.includes(d)) return true;
      return false;
    });
  }

  // If search query is present, filter by location (case-insensitive substring match)
  const searchQuery = params.get("search") || null;
  if (searchQuery) {
    const q = String(searchQuery).toLowerCase().trim();
    filteredProperties = filteredProperties.filter((property) =>
      String(property.location || "")
        .toLowerCase()
        .includes(q),
    );
  }

  const displayedProperties = filteredProperties.slice(0, 10);

  const handleToggleSaved = (propertyId) => {
    const property = properties.find(
      (currentProperty) => currentProperty.id === propertyId,
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
        {loading ? (
          <p className="text-center col-span-full">Loading properties...</p>
        ) : displayedProperties.length > 0 ? (
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
          <p className="text-center col-span-full">
            {divisionFilter
              ? "No houses or tenants found in this division."
              : "No properties found."}
          </p>
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
