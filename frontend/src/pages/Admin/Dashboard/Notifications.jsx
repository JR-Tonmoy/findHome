import { AlertCircle, Bell, Calendar, CreditCard, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import adminService from "../../../utils/adminService";

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadNotifications = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await adminService.fetchAdminNotifications();
        setNotifications(Array.isArray(response) ? response : []);
      } catch (err) {
        console.error("Failed to load notifications:", err);
        setError("Failed to load admin notifications.");
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const filteredNotifications = notifications.filter((notification) => {
    if (filterType === "all") return true;
    return notification.type === filterType;
  });

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read,
  ).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case "booking_request":
        return <Mail className="text-blue-600" size={20} />;
      case "booking_approved":
        return <Calendar className="text-green-600" size={20} />;
      case "booking_rejected":
        return <AlertCircle className="text-red-600" size={20} />;
      case "booking_cancelled":
        return <AlertCircle className="text-orange-600" size={20} />;
      case "payment_completed":
        return <CreditCard className="text-emerald-600" size={20} />;
      case "refund_processed":
        return <CreditCard className="text-violet-600" size={20} />;
      case "owner_request":
        return <Mail className="text-amber-600" size={20} />;
      case "tenant_report":
        return <Mail className="text-cyan-600" size={20} />;
      case "system_alert":
        return <AlertCircle className="text-amber-600" size={20} />;
      default:
        return <Bell className="text-gray-600" size={20} />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "booking_request":
        return "bg-blue-100 text-blue-800";
      case "booking_approved":
        return "bg-green-100 text-green-800";
      case "booking_rejected":
        return "bg-red-100 text-red-800";
      case "booking_cancelled":
        return "bg-orange-100 text-orange-800";
      case "payment_completed":
        return "bg-emerald-100 text-emerald-800";
      case "refund_processed":
        return "bg-violet-100 text-violet-800";
      case "owner_request":
        return "bg-amber-100 text-amber-800";
      case "tenant_report":
        return "bg-cyan-100 text-cyan-800";
      case "system_alert":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Bell size={32} className="text-blue-600" />
            Notifications
          </h1>
          {unreadCount > 0 && (
            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
              {unreadCount} Unread
            </span>
          )}
        </div>
        <p className="text-gray-600">
          Monitor platform activities and important events
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-sm">
        <div className="flex gap-2 flex-wrap">
          {[
            "all",
            "booking_request",
            "booking_approved",
            "booking_rejected",
            "payment_completed",
          ].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                filterType === type
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {type === "all"
                ? "All Notifications"
                : type === "payment_completed"
                  ? "Payments"
                  : type.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-600">Loading notifications...</p>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Bell size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No notifications yet
          </h3>
          <p className="text-gray-600">
            {filterType === "all"
              ? "You're all caught up!"
              : `No ${filterType.replace(/_/g, " ")} notifications found.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-lg border transition-all ${
                notification.is_read
                  ? "border-gray-200 opacity-75"
                  : "border-blue-200 bg-blue-50 shadow-sm"
              } p-4 hover:shadow-md`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-lg shrink-0 ${getTypeColor(notification.type)}`}
                >
                  {getNotificationIcon(notification.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {notification.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatTime(new Date(notification.created_at))}
                      </p>
                    </div>
                    {!notification.is_read && (
                      <span className="w-3 h-3 bg-blue-500 rounded-full shrink-0"></span>
                    )}
                  </div>

                  <p className="text-gray-700 mt-2 leading-relaxed">
                    {notification.message}
                  </p>

                  {notification.meta && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {notification.meta.propertyTitle && (
                          <p>
                            <span className="font-semibold">Property:</span>{" "}
                            {notification.meta.propertyTitle}
                          </p>
                        )}
                        {notification.meta.tenantName && (
                          <p>
                            <span className="font-semibold">Tenant:</span>{" "}
                            {notification.meta.tenantName}
                          </p>
                        )}
                        {notification.meta.ownerName && (
                          <p>
                            <span className="font-semibold">Owner:</span>{" "}
                            {notification.meta.ownerName}
                          </p>
                        )}
                        {notification.meta.transaction_id && (
                          <p>
                            <span className="font-semibold">Transaction:</span>{" "}
                            {notification.meta.transaction_id}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;
