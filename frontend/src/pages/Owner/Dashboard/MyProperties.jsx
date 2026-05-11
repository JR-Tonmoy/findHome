import { Edit, Eye, EyeOff, MapPin, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentMemberProfile } from "../../../utils/memberStorage";
import {
  deleteProperty,
  getStoredProperties,
} from "../../../utils/propertyStorage";

const MyProperties = () => {
  const navigate = useNavigate();
  const currentOwner = getCurrentMemberProfile();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    const loadProperties = async () => {
      setLoading(true);
      try {
        // Get properties from storage (backend integration ready)
        const allProperties = getStoredProperties();

        // Filter properties owned by current user
        const ownerProperties = allProperties.filter(
          (property) =>
            property.owner?.email === currentOwner.email ||
            property.owner?.email === "N/A" ||
            property.user_id === currentOwner.id,
        );

        setProperties(ownerProperties);
        setFilteredProperties(ownerProperties);
      } catch (err) {
        console.error("Failed to load properties:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();

    // Listen for property updates
    const handleUpdate = () => loadProperties();
    window.addEventListener("owner-properties-updated", handleUpdate);
    return () => {
      window.removeEventListener("owner-properties-updated", handleUpdate);
    };
  }, [currentOwner.email]);

  // Filter by status
  useEffect(() => {
    let filtered = properties;
    if (selectedStatus !== "all") {
      filtered = filtered.filter((p) => p.status === selectedStatus);
    }
    setFilteredProperties(filtered);
  }, [selectedStatus, properties]);

  const handleEdit = (propertyId) => {
    navigate(`/owner-dashboard/add-property?propertyId=${propertyId}`);
  };

  const handleDelete = async (propertyId) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await deleteProperty(propertyId);
        setProperties(properties.filter((p) => p.id !== propertyId));
      } catch (err) {
        alert("Failed to delete property");
      }
    }
  };

  const statusBadgeClass = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "rented":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Properties</h1>
        <p className="text-gray-600">
          Manage all your property listings in one place
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Properties</p>
              <p className="text-2xl font-bold text-gray-900">
                {properties.length}
              </p>
            </div>
            <Building size={32} className="text-emerald-600 opacity-20" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Listings</p>
              <p className="text-2xl font-bold text-gray-900">
                {properties.filter((p) => p.status === "active").length}
              </p>
            </div>
            <Eye size={32} className="text-blue-600 opacity-20" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Rented Out</p>
              <p className="text-2xl font-bold text-gray-900">
                {properties.filter((p) => p.status === "rented").length}
              </p>
            </div>
            <EyeOff size={32} className="text-gray-600 opacity-20" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-sm">
        <div className="flex gap-2 flex-wrap">
          {["all", "active", "inactive", "rented"].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                selectedStatus === status
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {status === "all" ? "All Properties" : status}
            </button>
          ))}
        </div>
      </div>

      {/* Properties List */}
      {loading ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-600">Loading properties...</p>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Building size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No properties found
          </h3>
          <p className="text-gray-600 mb-4">
            {selectedStatus === "all"
              ? "You haven't added any properties yet."
              : `No ${selectedStatus} properties found.`}
          </p>
          <Link
            to="/owner-dashboard/add-property"
            className="inline-block bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            Add Your First Property
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredProperties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row gap-4 p-4">
                {/* Image */}
                <div className="w-full md:w-48 h-40 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={
                      property.image ||
                      property.images?.[0] ||
                      "https://placehold.co/300x200?text=No+Image"
                    }
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {property.title}
                      </h3>
                      <div className="flex items-center text-gray-600 text-sm mt-1">
                        <MapPin size={16} className="mr-1" />
                        {property.location}
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadgeClass(
                        property.status,
                      )}`}
                    >
                      {property.status || "active"}
                    </span>
                  </div>

                  {/* Property Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-sm">
                    <div>
                      <p className="text-gray-600">Price</p>
                      <p className="font-semibold text-gray-900">
                        ৳{property.price}/month
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Bedrooms</p>
                      <p className="font-semibold text-gray-900">
                        {property.bedrooms || property.beds || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Bathrooms</p>
                      <p className="font-semibold text-gray-900">
                        {property.bathrooms || property.baths || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Area</p>
                      <p className="font-semibold text-gray-900">
                        {property.sqft || "N/A"} sqft
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {property.description || "No description provided"}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex md:flex-col gap-2 w-full md:w-auto">
                  <button
                    onClick={() => handleEdit(property.id)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <Edit size={16} />
                    <span className="hidden md:inline">Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(property.id)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <Trash2 size={16} />
                    <span className="hidden md:inline">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Icon component (add this if not already imported)
const Building = ({ size, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M6 9h12M6 9v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9m-9-3h6V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v2z" />
    <rect x="8" y="11" width="2" height="2" />
    <rect x="14" y="11" width="2" height="2" />
    <rect x="8" y="15" width="2" height="2" />
    <rect x="14" y="15" width="2" height="2" />
  </svg>
);

export default MyProperties;
