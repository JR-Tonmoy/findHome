import { Heart, Loader2, Bell, CalendarCheck2, CalendarX2, Home } from "lucide-react"; // Import icons for stats
import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link
import useAuth from "../../../hooks/useAuth";
import { getPublicProperties } from "../../../utils/publicPropertyFeed";
import { getSavedPropertyCount } from "../../../utils/savedPropertyStorage";
import {
  fetchTenantBookings,
  fetchTenantNotifications,
} from "../../../utils/notificationService";

const Dashboard = () => {
  const { user } = useAuth();
  const currentEmail = user?.email || "";
  const displayName = user?.fullName || user?.name || "Tenant";
  const [savedCount, setSavedCount] = useState(() =>
    getSavedPropertyCount(currentEmail),
  );
  const [recommendedHouses, setRecommendedHouses] = useState([]);
  const [tenantCounts, setTenantCounts] = useState({
    totalBookings: 0,
    activeBookings: 0,
    cancelledBookings: 0,
    unreadNotifications: 0,
  });
  const [countsLoading, setCountsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const loadRecommendedHouses = async () => {
      const allProperties = await getPublicProperties();

      if (isActive) {
        setRecommendedHouses(allProperties.slice(0, 4));
      }
    };

    const loadTenantCounts = async () => {
      setCountsLoading(true);

      try {
        const [bookingsResponse, notificationsResponse] = await Promise.all([
          fetchTenantBookings(),
          fetchTenantNotifications(),
        ]);

        if (!isActive) return;

        const bookings = Array.isArray(bookingsResponse?.data)
          ? bookingsResponse.data
          : [];
        const activeBookings = bookings.filter(
          (booking) => booking?.cancellation_status !== "cancelled",
        );
        const cancelledBookings = bookings.filter(
          (booking) => booking?.cancellation_status === "cancelled",
        );

        setTenantCounts({
          totalBookings: bookings.length,
          activeBookings: activeBookings.length,
          cancelledBookings: cancelledBookings.length,
          unreadNotifications: notificationsResponse?.unread_count || 0,
        });
      } catch {
        if (!isActive) return;
        setTenantCounts({
          totalBookings: 0,
          activeBookings: 0,
          cancelledBookings: 0,
          unreadNotifications: 0,
        });
      } finally {
        if (isActive) setCountsLoading(false);
      }
    };

    const refreshSavedCount = () => {
      setSavedCount(getSavedPropertyCount(currentEmail));
    };

    loadRecommendedHouses();
    loadTenantCounts();
    refreshSavedCount();
    window.addEventListener("saved-properties-updated", refreshSavedCount);
    window.addEventListener("storage", refreshSavedCount);
    window.addEventListener("owner-properties-updated", loadRecommendedHouses);

    const interval = setInterval(loadTenantCounts, 15000);

    return () => {
      isActive = false;
      window.removeEventListener("saved-properties-updated", refreshSavedCount);
      window.removeEventListener("storage", refreshSavedCount);
      window.removeEventListener(
        "owner-properties-updated",
        loadRecommendedHouses,
      );
      clearInterval(interval);
    };
  }, [currentEmail]);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-black">
          Welcome back, {displayName}!
        </h1>
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
          <div className="bg-blue-50 p-3 rounded-xl text-black">
            <Heart size={24} />
          </div>
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Bookings</p>
          <div className="mt-2 flex items-end justify-between gap-3">
            <h2 className="text-3xl font-bold text-gray-900">
              {countsLoading ? <Loader2 className="h-6 w-6 animate-spin text-gray-400" /> : tenantCounts.totalBookings}
            </h2>
            <Home className="h-6 w-6 text-gray-400" />
          </div>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Active Bookings</p>
          <div className="mt-2 flex items-end justify-between gap-3">
            <h2 className="text-3xl font-bold text-gray-900">
              {countsLoading ? <Loader2 className="h-6 w-6 animate-spin text-gray-400" /> : tenantCounts.activeBookings}
            </h2>
            <CalendarCheck2 className="h-6 w-6 text-emerald-500" />
          </div>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Cancelled Bookings</p>
          <div className="mt-2 flex items-end justify-between gap-3">
            <h2 className="text-3xl font-bold text-gray-900">
              {countsLoading ? <Loader2 className="h-6 w-6 animate-spin text-gray-400" /> : tenantCounts.cancelledBookings}
            </h2>
            <CalendarX2 className="h-6 w-6 text-rose-500" />
          </div>
        </div>
        <Link
          to="/dashboard/notifications"
          className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md"
        >
          <p className="text-sm text-gray-500">Unread Notifications</p>
          <div className="mt-2 flex items-end justify-between gap-3">
            <h2 className="text-3xl font-bold text-gray-900">
              {countsLoading ? <Loader2 className="h-6 w-6 animate-spin text-gray-400" /> : tenantCounts.unreadNotifications}
            </h2>
            <Bell className="h-6 w-6 text-blue-500" />
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
                <div className="text-black font-bold flex items-center gap-2">
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
            <div className="w-2 h-2 mt-2 rounded-full bg-black shrink-0"></div>
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
            <div className="w-2 h-2 mt-2 rounded-full bg-black shrink-0"></div>
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
            <div className="w-2 h-2 mt-2 rounded-full bg-black shrink-0"></div>
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
            <div className="w-2 h-2 mt-2 rounded-full bg-black shrink-0"></div>
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
