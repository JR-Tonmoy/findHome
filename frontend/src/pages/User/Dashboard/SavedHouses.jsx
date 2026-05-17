import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { getSavedProperties } from "../../../utils/savedPropertyStorage";

const SavedHouses = () => {
  const { user } = useAuth();
  const currentEmail = user?.email || "";
  const [savedProperties, setSavedProperties] = useState(() =>
    getSavedProperties(currentEmail),
  );

  useEffect(() => {
    const refreshSavedProperties = () => {
      setSavedProperties(getSavedProperties(currentEmail));
    };

    refreshSavedProperties();
    window.addEventListener("saved-properties-updated", refreshSavedProperties);
    window.addEventListener("storage", refreshSavedProperties);

    return () => {
      window.removeEventListener(
        "saved-properties-updated",
        refreshSavedProperties,
      );
      window.removeEventListener("storage", refreshSavedProperties);
    };
  }, [currentEmail]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-black">Saved Houses</h1>
      <p className="text-black mt-2">
        Properties you have bookmarked will appear here.
      </p>
      {savedProperties.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedProperties.map((property) => (
            <div
              key={property.id}
              className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
            >
              <div className="h-44 bg-gray-100 overflow-hidden">
                <img
                  src={
                    property.image ||
                    property.images?.[0] ||
                    "https://placehold.co/800x500?text=No+Image"
                  }
                  alt={property.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-4">
                <p className="text-sm text-black">{property.location}</p>
                <h2 className="mt-1 text-lg font-semibold text-black">
                  {property.title}
                </h2>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-blue-600">
                    ৳{property.price}
                  </p>
                  <Link
                    to={`/property/${property.id}`}
                    className="text-sm font-semibold text-black hover:underline"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-dashed border-gray-200 bg-white p-6 text-black">
          No saved houses yet. Click the heart icon on any property to add it
          here.
        </div>
      )}
    </div>
  );
};
export default SavedHouses;
