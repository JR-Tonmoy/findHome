import { Bell, Building, ChevronDown, UserCheck, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../../components/Logo/Logo";
import {
  getAdminNotifications,
  seedAdminNotifications,
} from "../../../utils/adminNotificationStorage";

const Dashboard = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({
    tenants: 0,
    owners: 0,
    properties: 0,
  });

  useEffect(() => {
    const syncDashboardFromStorage = () => {
      const registeredUsers = JSON.parse(
        localStorage.getItem("registeredUsers") || "[]",
      );
      const registeredOwners = JSON.parse(
        localStorage.getItem("registeredOwners") || "[]",
      );
      const ownerProperties = JSON.parse(
        localStorage.getItem("ownerProperties") || "[]",
      );
      const bookingRequests = JSON.parse(
        localStorage.getItem("tenantBookingRequests") || "[]",
      );

      const seededNotifications = [
        ...ownerProperties.map((property) => ({
          id: `property-${property.id}`,
          type: "property",
          title: "New property uploaded",
          message: `${property.owner?.name || "An owner"} uploaded ${property.title}.`,
          meta: {
            propertyId: property.id,
            propertyTitle: property.title,
            ownerName: property.owner?.name || "Property Owner",
          },
          createdAt: property.createdAt || new Date().toISOString(),
        })),
        ...bookingRequests.map((booking) => ({
          id:
            booking.id || `booking-${booking.propertyId}-${booking.createdAt}`,
          type: "booking",
          title: "New tenant booking request",
          message: `${booking.tenantName || "A tenant"} requested ${booking.propertyTitle || "a property"}.`,
          meta: {
            propertyId: booking.propertyId,
            propertyTitle: booking.propertyTitle,
            tenantName: booking.tenantName,
            tenantEmail: booking.tenantEmail,
          },
          createdAt: booking.createdAt || new Date().toISOString(),
        })),
      ];

      seedAdminNotifications(seededNotifications);

      setStats({
        tenants: registeredUsers.length,
        owners: registeredOwners.length,
        properties: ownerProperties.length,
      });
      setNotifications(getAdminNotifications());
    };

    const syncNotificationsOnly = () => {
      setNotifications(getAdminNotifications());
    };

    syncDashboardFromStorage();

    window.addEventListener("storage", syncDashboardFromStorage);
    window.addEventListener(
      "owner-properties-updated",
      syncDashboardFromStorage,
    );
    window.addEventListener(
      "admin-notifications-updated",
      syncNotificationsOnly,
    );

    return () => {
      window.removeEventListener("storage", syncDashboardFromStorage);
      window.removeEventListener(
        "owner-properties-updated",
        syncDashboardFromStorage,
      );
      window.removeEventListener(
        "admin-notifications-updated",
        syncNotificationsOnly,
      );
    };
  }, []);

  return (
    <>
      {/* Header with Logo */}
      <div className="mb-8 pb-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Logo
              variant="default"
              size="md"
              showSubtitle={true}
              linkTo="/home"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
        </div>
        <p className="text-gray-600 text-sm">
          Monitor and manage your platform
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Tenants Card */}
        <div
          onClick={() => navigate("/admin/users")}
          className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-blue-200"
        >
          <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
            <Users size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">
              Total Tenants
            </p>
            <h3 className="text-3xl font-black text-gray-900">
              {stats.tenants}
            </h3>
          </div>
        </div>

        {/* Total Owners Card */}
        <div
          onClick={() => navigate("/admin/owners")}
          className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-green-200"
        >
          <div className="bg-green-100 text-green-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
            <UserCheck size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">
              Total Owners
            </p>
            <h3 className="text-3xl font-black text-gray-900">
              {stats.owners}
            </h3>
          </div>
        </div>

        {/* Total Properties Card */}
        <div
          onClick={() => navigate("/admin/properties")}
          className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-purple-200"
        >
          <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
            <Building size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">
              Total Properties
            </p>
            <h3 className="text-3xl font-black text-gray-900">
              {stats.properties}
            </h3>
          </div>
        </div>

        {/* Notification Card */}
        <button
          type="button"
          onClick={() => setShowNotifications((current) => !current)}
          className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-orange-200 text-left"
        >
          <div className="bg-orange-100 text-orange-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4 relative">
            <Bell size={24} />
            {notifications.length > 0 ? (
              <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {notifications.length}
              </span>
            ) : null}
          </div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">
                Notification
              </p>
              <h3 className="text-2xl font-black text-gray-900">View Alerts</h3>
            </div>
            <ChevronDown
              size={18}
              className={`text-gray-400 transition-transform ${
                showNotifications ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {showNotifications ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 lg:p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Notifications</h3>
            <span className="text-sm text-gray-500">
              {notifications.length} total
            </span>
          </div>

          {notifications.length > 0 ? (
            <div className="space-y-4 max-h-112 overflow-y-auto pr-1">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="rounded-xl border border-gray-100 bg-gray-50 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-gray-900">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-500 border border-gray-200 uppercase">
                      {notification.type}
                    </span>
                  </div>
                  <p className="mt-3 text-xs text-gray-400">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-gray-500">
              No notifications yet.
            </div>
          )}
        </div>
      ) : null}

      {/* Recent Activity Section */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 lg:p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          Recent Activity
        </h3>

        <div className="space-y-6">
          {/* Activity Item 1 */}
          <div className="flex gap-4 items-start relative before:absolute before:left-1.75 before:top-8 before:w-0.5 before:h-full before:bg-gray-100 pb-2">
            <div className="w-4 h-4 rounded-full bg-green-500 mt-1.5 shrink-0 z-10 border-2 border-white"></div>
            <div>
              <h4 className="font-bold text-gray-900">New property listed</h4>
              <p className="text-gray-600 text-sm mt-0.5">
                Fatima Khan listed a 3 BHK apartment in Dhanmondi
              </p>
              <span className="text-gray-400 text-sm mt-1 block">
                2 hours ago
              </span>
            </div>
          </div>

          {/* Activity Item 2 */}
          <div className="flex gap-4 items-start relative before:absolute before:left-1.75 before:top-8 before:w-0.5 before:h-full before:bg-gray-100 pb-2">
            <div className="w-4 h-4 rounded-full bg-blue-500 mt-1.5 shrink-0 z-10 border-2 border-white"></div>
            <div>
              <h4 className="font-bold text-gray-900">New tenant registered</h4>
              <p className="text-gray-600 text-sm mt-0.5">
                Ahmed Hassan joined the platform
              </p>
              <span className="text-gray-400 text-sm mt-1 block">
                5 hours ago
              </span>
            </div>
          </div>

          {/* Activity Item 3 */}
          <div className="flex gap-4 items-start">
            <div className="w-4 h-4 rounded-full bg-yellow-500 mt-1.5 shrink-0 z-10 border-2 border-white"></div>
            <div>
              <h4 className="font-bold text-gray-900">Payment received</h4>
              <p className="text-gray-600 text-sm mt-0.5">
                Rahim Ahmed paid ৳30,000 for monthly rent
              </p>
              <span className="text-gray-400 text-sm mt-1 block">
                1 day ago
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
