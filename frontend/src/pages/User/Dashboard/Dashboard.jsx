import { Heart } from "lucide-react"; // Import icons for stats
import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link
import { getCurrentMemberProfile } from "../../../utils/memberStorage";
import { HOME_FEATURED_PROPERTIES } from "../../../utils/propertyCatalog";
import { getSavedPropertyCount } from "../../../utils/savedPropertyStorage";

const Dashboard = () => {
  const currentMember = getCurrentMemberProfile();
  const [savedCount, setSavedCount] = useState(() =>
    getSavedPropertyCount(currentMember.email),
  );

  useEffect(() => {
    const refreshSavedCount = () => {
      setSavedCount(getSavedPropertyCount(currentMember.email));
    };

    refreshSavedCount();
    window.addEventListener("saved-properties-updated", refreshSavedCount);
    window.addEventListener("storage", refreshSavedCount);

    return () => {
      window.removeEventListener("saved-properties-updated", refreshSavedCount);
      window.removeEventListener("storage", refreshSavedCount);
    };
  }, [currentMember.email]);

  const recommendedHouses = HOME_FEATURED_PROPERTIES.slice(0, 4);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-black">Welcome back, Tenant!</h1>
        <p className="text-black mt-2 text-sm sm:text-base">
          Here's what's happening with your property search
        </p>
      </div>

      {/* Cards - Responsive grid: 1 col on mobile, 3 cols on tablet and desktop */}
      <div className="grid grid-cols-1 gap-4 md:gap-6 mt-6">
        {/* Saved Houses Card */}
        <Link
          to="/dashboard/saved"
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center md:max-w-md hover:shadow-md transition"
        >
          <div>
            <p className="text-black text-sm mb-1">Saved Houses</p>
            <h2 className="text-3xl font-bold text-black">{savedCount}</h2>
          </div>
          <div className="bg-blue-50 p-3 rounded-xl text-blue-500">
            <Heart size={24} />
          </div>
        </Link>
      </div>

      {/* Recommended Section */}
      <div className="mt-10 mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-black">
            Recommended Properties
          </h2>
          <p className="text-sm text-black mt-1 max-w-2xl">
            These stay visible even if you have not rented anything yet, so you
            always have something useful to explore.
          </p>
        </div>
        <Link
          to="/home#featured-properties"
          className="inline-flex w-fit items-center rounded-lg border border-black px-4 py-2 text-sm font-medium text-black transition hover:bg-black hover:text-white"
        >
          Browse more
        </Link>
      </div>

      {/* Grid: 1 col mobile, 2 col tablet/desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendedHouses.map((house) => (
          <div
            key={house.id}
            className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            {/* House Image */}
            <div className="relative h-56 overflow-hidden bg-gray-100">
              <img
                src={house.image}
                alt={house.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm backdrop-blur">
                {house.category}
              </span>
            </div>

            {/* House Info Details */}
            <div className="p-5">
              <h3 className="font-bold text-lg text-black line-clamp-1">
                {house.title}
              </h3>

              <p className="mt-2 text-sm text-black flex items-center gap-2">
                <span>📍</span> {house.location}
              </p>

              <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
                <div className="text-blue-600 font-bold flex items-center gap-2">
                  ৳{house.price}{" "}
                  <span className="text-sm text-gray-500 font-normal">
                    /month
                  </span>
                </div>
                <Link
                  to={`/property/${house.id}`}
                  className="rounded-lg bg-black px-4 py-1.5 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 mt-10 mb-10">
        <h2 className="text-xl font-bold text-black mb-6">Recent Activity</h2>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-2 h-2 mt-2 rounded-full bg-blue-600 shrink-0"></div>
            <div>
              <p className="text-gray-600 text-sm">
                <span className="font-semibold text-gray-800">
                  Saved property:
                </span>{" "}
                2 Bedroom Flat in Gulshan
              </p>
              <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
            </div>
          </div>

          <div className="w-full h-px bg-gray-100 ml-6"></div>

          <div className="flex items-start gap-4">
            <div className="w-2 h-2 mt-2 rounded-full bg-blue-600 shrink-0"></div>
            <div>
              <p className="text-gray-600 text-sm">
                <span className="font-semibold text-gray-800">
                  Viewed property:
                </span>{" "}
                Bachelor Room in Mirpur
              </p>
              <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
            </div>
          </div>

          <div className="w-full h-px bg-gray-100 ml-6"></div>

          <div className="flex items-start gap-4">
            <div className="w-2 h-2 mt-2 rounded-full bg-blue-600 shrink-0"></div>
            <div>
              <p className="text-gray-600 text-sm">
                <span className="font-semibold text-gray-800">
                  Sent request:
                </span>{" "}
                3 Bedroom House in Uttara
              </p>
              <p className="text-xs text-gray-400 mt-1">1 day ago</p>
            </div>
          </div>

          <div className="w-full h-px bg-gray-100 ml-6"></div>

          <div className="flex items-start gap-4">
            <div className="w-2 h-2 mt-2 rounded-full bg-blue-600 shrink-0"></div>
            <div>
              <p className="text-gray-600 text-sm">
                <span className="font-semibold text-gray-800">
                  Viewed property:
                </span>{" "}
                Studio in Banani
              </p>
              <p className="text-xs text-gray-400 mt-1">2 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
