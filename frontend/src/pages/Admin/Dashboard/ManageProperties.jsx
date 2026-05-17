import { BedDouble, MapPin, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  deleteProperty,
  fetchAllProperties,
  fetchPropertiesByLocation,
} from "../../../utils/propertyStorage";

const ManageProperties = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationFilter, setLocationFilter] = useState("");

  useEffect(() => {
    const loadProperties = async () => {
      setLoading(true);
      const allProperties = await fetchAllProperties();
      setProperties(allProperties);
      setFilteredProperties(allProperties);
      setLoading(false);
    };

    loadProperties();

    // Listen for property updates
    const handlePropertyUpdate = () => {
      loadProperties();
    };

    window.addEventListener("owner-properties-updated", handlePropertyUpdate);
    return () => {
      window.removeEventListener(
        "owner-properties-updated",
        handlePropertyUpdate,
      );
    };
  }, []);

  // Apply simplified location search
  useEffect(() => {
    let isActive = true;

    const applyLocationSearch = async () => {
      const query = locationFilter.trim();

      setLoading(true);

      try {
        if (!query) {
          if (isActive) {
            setFilteredProperties(properties);
          }
          return;
        }

        const searchedProperties = await fetchPropertiesByLocation(query);

        if (isActive) {
          setFilteredProperties(searchedProperties);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    const timeoutId = setTimeout(applyLocationSearch, 250);

    return () => {
      isActive = false;
      clearTimeout(timeoutId);
    };
  }, [properties, locationFilter]);

  const handleDeleteProperty = async (propertyId) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await deleteProperty(propertyId);
        setProperties(properties.filter((p) => p.id !== propertyId));
      } catch (error) {
        alert("Failed to delete property: " + error.message);
      }
    }
  };

  return (
    <div className="p-6">
      {/* Header section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">All Properties</h1>
        <p className="text-gray-500 mt-1 mb-4">
          Total Properties: {filteredProperties.length}
        </p>
        <input
          type="text"
          placeholder="Search by location"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="w-full sm:w-96 h-11 px-4 rounded-lg border border-gray-300 text-gray-800 placeholder:text-gray-400 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all"
        />
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Loading properties...</p>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No properties found</p>
        </div>
      ) : (
        <>
          {/* Grid of properties */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Image Box */}
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={
                      property.image || "https://via.placeholder.com/400x300"
                    }
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
                    <h3 className="text-lg font-bold text-gray-800 flex-1">
                      {property.title}
                    </h3>
                    <button
                      onClick={() => handleDeleteProperty(property.id)}
                      className="text-red-500 hover:text-red-700 transition-colors ml-2"
                      title="Delete property"
                    >
                      <Trash2 size={20} />
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
                    <div className="text-black font-bold text-lg">
                      ৳ {parseInt(property.price).toLocaleString()}
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
            ))}
          </div>

          {/* Results Summary */}
          <div className="flex justify-center mt-10 text-gray-600">
            <p>
              Showing {filteredProperties.length} of {properties.length}{" "}
              properties
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageProperties;
