import { BedDouble, CheckCircle2, MapPin, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import adminService from "../../../utils/adminService";

const ManageProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationFilter, setLocationFilter] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const loadProperties = async () => {
      setLoading(true);
      setError(null);

      try {
        const allProperties = await adminService.fetchAdminProperties();
        if (active) {
          setProperties(Array.isArray(allProperties) ? allProperties : []);
        }
      } catch (err) {
        console.error("Failed to load properties:", err);
        if (active) {
          setError("Failed to load properties from the backend.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadProperties();

    return () => {
      active = false;
    };
  }, []);

  const filteredProperties = useMemo(() => {
    const query = locationFilter.trim().toLowerCase();
    if (!query) return properties;

    return properties.filter((property) =>
      String(property.location || "")
        .toLowerCase()
        .includes(query),
    );
  }, [locationFilter, properties]);

  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm("Are you sure you want to delete this property?")) {
      return;
    }

    try {
      await adminService.deleteAdminProperty(propertyId);
      setProperties((current) =>
        current.filter((property) => property.id !== propertyId),
      );
    } catch (err) {
      alert("Failed to delete property: " + (err?.message || "Unknown error"));
    }
  };

  const handleApproveProperty = async (propertyId) => {
    try {
      const updatedProperty =
        await adminService.approveAdminProperty(propertyId);
      setProperties((current) =>
        current.map((property) =>
          property.id === propertyId
            ? { ...property, ...updatedProperty }
            : property,
        ),
      );
    } catch (err) {
      alert("Failed to approve property: " + (err?.message || "Unknown error"));
    }
  };

  const getPropertyStatus = (status) => {
    const normalized = String(status || "available").toLowerCase();
    return normalized === "available" || normalized === "active"
      ? "Available"
      : normalized;
  };

  return (
    <div className="p-6">
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

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={property.image || "/placeholder-property.jpg"}
                    alt={property.title}
                    className="w-full h-full object-cover"
                    onError={(event) => {
                      event.currentTarget.src = "/placeholder-property.jpg";
                    }}
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
                      property.status || property.raw?.status || "available",
                    )
                      .toLowerCase()
                      .includes("available")
                      ? "Available"
                      : "Currently Occupied"}
                  </span>
                </div>

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

                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <MapPin size={16} className="mr-1" />
                    {property.location}
                  </div>

                  <div className="mb-3 text-sm text-gray-600 space-y-1">
                    <p>
                      <span className="font-semibold text-gray-800">
                        Owner:
                      </span>{" "}
                      {property.owner?.name || property.owner_name || "Unknown"}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-800">Type:</span>{" "}
                      {property.type || "Property"}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-800">
                        Availability:
                      </span>{" "}
                      {getPropertyStatus(
                        property.status || property.raw?.status,
                      )}
                    </p>
                  </div>

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

                  <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-2">
                    <div className="text-black font-bold text-lg">
                      ৳ {Number.parseInt(property.price, 10).toLocaleString()}
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

                  {String(
                    property.status || property.raw?.status || "",
                  ).toLowerCase() !== "available" && (
                    <div className="mt-3">
                      <button
                        onClick={() => handleApproveProperty(property.id)}
                        className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 transition"
                      >
                        <CheckCircle2 size={14} />
                        Approve
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

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
