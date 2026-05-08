import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getCurrentMemberProfile } from "../../utils/memberStorage";
import { getPublicProperties } from "../../utils/publicPropertyFeed";
import {
  isPropertySaved,
  toggleSavedProperty,
} from "../../utils/savedPropertyStorage";

const ITEMS_PER_PAGE = 8;

const Product = ({ selectedCategory = "All" }) => {
  const navigate = useNavigate();
  const currentMember = getCurrentMemberProfile();
  const savedStorageKey = currentMember.email;
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
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
    window.addEventListener("public-properties-updated", loadProperties);
    window.addEventListener("saved-properties-updated", refreshSavedState);

    return () => {
      isActive = false;
      window.removeEventListener("storage", loadProperties);
      window.removeEventListener("owner-properties-updated", loadProperties);
      window.removeEventListener("public-properties-updated", loadProperties);
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

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProperties.length / ITEMS_PER_PAGE),
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, divisionFilter, searchQuery]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedProperties = filteredProperties.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const handleToggleSaved = (propertyId) => {
    const property = properties.find(
      (currentProperty) => currentProperty.id === propertyId,
    );

    toggleSavedProperty(property || propertyId, savedStorageKey);
  };

  return (
    <div
      id="featured-properties"
      className="container mx-auto px-4 md:px-10 mt-5 bg-white py-4 md:py-6"
    >
      <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-black text-center md:text-left">
            Featured Properties
          </h2>
          <p className="mt-1 text-sm text-gray-500 text-center md:text-left">
            Browse verified listings with quick filters and pagination.
          </p>
        </div>
        <p className="text-center md:text-right text-sm text-gray-500">
          Showing {filteredProperties.length === 0 ? 0 : startIndex + 1}-
          {Math.min(startIndex + ITEMS_PER_PAGE, filteredProperties.length)} of{" "}
          {filteredProperties.length}
        </p>
      </div>

      {/* Card Grid Container for Featured Properties*/}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
        {loading ? (
          <p className="text-center col-span-full">Loading properties...</p>
        ) : displayedProperties.length > 0 ? (
          displayedProperties.map((property) => (
            <div
              key={property.id}
              className="flex flex-col bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-transform duration-300 hover:-translate-y-1 h-full cursor-pointer"
            >
              {/* <Featured Properties image edit/> */}
              <div className="w-full aspect-4/3 bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/400x300?text=No+Image";
                  }}
                />
              </div>
              <div className="p-4 md:p-5 flex grow flex-col">
                <h3 className="font-bold text-base md:text-lg text-black line-clamp-1">
                  {property.title}
                </h3>
                <p className="text-gray-600 text-xs md:text-sm mt-1 flex items-center gap-1 line-clamp-1 min-h-5">
                  📍 {property.location}
                </p>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-black font-bold text-lg md:text-xl">
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
                <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-4 mb-4 pt-4 border-t border-gray-200 text-xs text-gray-700">
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
                  className="mt-auto block w-full text-center bg-black text-white font-semibold py-2 rounded-lg hover:bg-gray-800 transition cursor-pointer text-sm"
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

      {!loading && filteredProperties.length > ITEMS_PER_PAGE && (
        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-black px-4 py-2 text-sm font-medium text-black transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-black hover:text-white"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1)
              .slice(
                Math.max(0, currentPage - 3),
                Math.min(totalPages, currentPage + 2),
              )
              .map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`min-w-10 rounded-lg px-4 py-2 text-sm font-medium transition ${
                    currentPage === pageNumber
                      ? "bg-black text-white"
                      : "border border-gray-300 text-black hover:border-black hover:bg-gray-50"
                  }`}
                >
                  {pageNumber}
                </button>
              ))}

            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              disabled={currentPage === totalPages}
              className="rounded-lg border border-black px-4 py-2 text-sm font-medium text-black transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-black hover:text-white"
            >
              Next
            </button>
          </div>

          <p className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </p>
        </div>
      )}

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
