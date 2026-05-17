import { Home, PlusCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { getStoredProperties } from "../../../utils/propertyStorage";

const OwnerDashboard = () => {
  const { user } = useAuth();
  const currentOwnerEmail = user?.email || "";
  const displayName = user?.fullName || user?.name || "Property Owner";
  const [storedProperties, setStoredProperties] = useState(() =>
    getStoredProperties(),
  );

  useEffect(() => {
    const refreshStoredProperties = () => {
      setStoredProperties(getStoredProperties());
    };

    refreshStoredProperties();
    window.addEventListener("storage", refreshStoredProperties);
    window.addEventListener(
      "owner-properties-updated",
      refreshStoredProperties,
    );

    return () => {
      window.removeEventListener("storage", refreshStoredProperties);
      window.removeEventListener(
        "owner-properties-updated",
        refreshStoredProperties,
      );
    };
  }, []);

  const myProperties = useMemo(() => {
    if (!currentOwnerEmail || currentOwnerEmail === "N/A") {
      return storedProperties;
    }

    return storedProperties.filter(
      (property) =>
        property.owner?.email === currentOwnerEmail ||
        property.owner?.email === "N/A",
    );
  }, [currentOwnerEmail, storedProperties]);

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome back, {displayName}!
        </h1>
        <p className="text-gray-500 mt-2 text-sm sm:text-base">
          Manage your properties and tenants right from here.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-4 md:gap-6 mt-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-sm mb-1">Total Properties</p>
            <h2 className="text-3xl font-bold text-gray-800">
              {myProperties.length}
            </h2>
          </div>
          <div className="bg-gray-50 p-3 rounded-xl text-black">
            <Home size={24} />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-10 mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
          My Properties (আমার প্রোপার্টিসমূহ)
        </h2>
        <Link
          to="/owner-dashboard/add-property"
          className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white! px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          <PlusCircle size={18} />
          Add Property
        </Link>
      </div>

      {myProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myProperties.map((house) => (
            <div
              key={house.id}
              className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <div className="h-56 overflow-hidden bg-gray-50">
                <img
                  src={
                    house.image ||
                    house.images?.[0] ||
                    "https://placehold.co/800x500?text=No+Image"
                  }
                  alt={house.title}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                />
              </div>

              <div className="p-5">
                <div className="flex justify-between items-start mb-2 gap-3">
                  <h3 className="font-bold text-lg text-gray-800 line-clamp-1">
                    {house.title}
                  </h3>
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-black text-white">
                    {house.category || "Property"}
                  </span>
                </div>

                <p className="text-gray-500 text-sm flex items-center gap-2 mb-4 line-clamp-1">
                  <span>📍</span> {house.location || "Location not set"}
                </p>

                <div className="flex items-center justify-between mt-4 border-t border-gray-100 pt-4 gap-3">
                  <div className="text-black font-bold flex items-center gap-2">
                    ৳{house.price}
                    <span className="text-sm text-gray-500 font-normal">
                      /month
                    </span>
                  </div>
                  <Link
                    to={`/owner-dashboard/add-property?propertyId=${encodeURIComponent(house.id)}`}
                    className="text-white! bg-black px-4 py-1.5 rounded hover:bg-gray-800 transition font-medium text-sm"
                  >
                    Edit Property
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
          No properties added yet. Use Add Property to publish your first one.
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
