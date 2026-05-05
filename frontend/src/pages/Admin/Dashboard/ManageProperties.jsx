import { BedDouble, Filter, MapPin, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  deleteProperty,
  fetchAllProperties,
} from "../../../utils/propertyStorage";

const ManageProperties = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");

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

  // Apply filters
  useEffect(() => {
    let filtered = properties;

    if (locationFilter) {
      filtered = filtered.filter((prop) =>
        prop.location.toLowerCase().includes(locationFilter.toLowerCase()),
      );
    }

    if (typeFilter) {
      filtered = filtered.filter((prop) =>
        prop.type.toLowerCase().includes(typeFilter.toLowerCase()),
      );
    }

    if (priceFilter) {
      const maxPrice = parseInt(priceFilter);
      filtered = filtered.filter((prop) => parseInt(prop.price) <= maxPrice);
    }

    setFilteredProperties(filtered);
  }, [properties, locationFilter, typeFilter, priceFilter]);

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
        <p className="text-gray-500 mt-1">
          Total Properties: {filteredProperties.length}
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center">
        <input
          type="text"
          placeholder="Search location..."
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        />
        <input
          type="text"
          placeholder="Property Type"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        />
        <input
          type="number"
          placeholder="Max Price (BDT)"
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => {
            setLocationFilter("");
            setTypeFilter("");
            setPriceFilter("");
          }}
          className="w-full md:w-auto px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 flex items-center justify-center gap-2"
        >
          <Filter size={18} /> Clear Filters
        </button>
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
                className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
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
                      className="text-black text-sm font-semibold hover:underline"
                    >
                      Details
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
