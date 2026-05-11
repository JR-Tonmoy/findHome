import { AlertCircle, Bell, Calendar, Home, Mail, X } from "lucide-react";
import { useEffect, useState } from "react";

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filterType, setFilterType] = useState("all"); // all, property, booking, report
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      setIsLoading(true);
      try {
        // Mock data - replace with actual backend API call
        const mockNotifications = [
          {
            id: 1,
            type: "booking",
            title: "New Booking Request",
            message:
              "John Doe has submitted a new booking request for Luxury Apartment in Mirpur",
            timestamp: new Date(Date.now() - 2 * 60 * 60000),
            read: false,
            meta: {
              propertyTitle: "Luxury Apartment in Mirpur",
              tenantName: "John Doe",
            },
          },
          {
            id: 2,
            type: "property",
            title: "New Property Listed",
            message:
              "Ahmed Hassan has uploaded a new property: 2BHK House in Gulshan",
            timestamp: new Date(Date.now() - 5 * 60 * 60000),
            read: false,
            meta: {
              propertyTitle: "2BHK House in Gulshan",
              ownerName: "Ahmed Hassan",
            },
          },
          {
            id: 3,
            type: "booking",
            title: "Booking Approved",
            message: "Sarah Connor's booking for Studio Flat has been approved",
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60000),
            read: true,
            meta: {
              propertyTitle: "Studio Flat in Dhanmondi",
              tenantName: "Sarah Connor",
            },
          },
          {
            id: 4,
            type: "report",
            title: "Compliance Report",
            message: "Monthly compliance report is ready for review",
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60000),
            read: true,
            meta: {
              reportType: "Compliance",
            },
          },
          {
            id: 5,
            type: "property",
            title: "Property Verification Needed",
            message:
              "Penthouse in Banani requires document verification from owner",
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60000),
            read: true,
            meta: {
              propertyTitle: "Penthouse in Banani",
              status: "Pending Verification",
            },
          },
        ];

        setNotifications(mockNotifications);
      } catch (err) {
        console.error("Failed to load notifications:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const filteredNotifications = notifications.filter((notif) => {
    if (filterType === "all") return true;
    return notif.type === filterType;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case "booking":
        return <Mail className="text-blue-600" size={20} />;
      case "property":
        return <Home className="text-green-600" size={20} />;
      case "report":
        return <AlertCircle className="text-orange-600" size={20} />;
      default:
        return <Bell className="text-gray-600" size={20} />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "booking":
        return "bg-blue-100 text-blue-800";
      case "property":
        return "bg-green-100 text-green-800";
      case "report":
        return "bg-orange-100 text-orange-800";
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
      {/* Header */}
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

      {/* Filter Buttons */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-sm">
        <div className="flex gap-2 flex-wrap">
          {["all", "booking", "property", "report"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                filterType === type
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {type === "all" ? "All Notifications" : type}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
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
              : `No ${filterType} notifications found.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-lg border transition-all ${
                notification.read
                  ? "border-gray-200 opacity-75"
                  : "border-blue-200 bg-blue-50 shadow-sm"
              } p-4 hover:shadow-md`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`p-3 rounded-lg shrink-0 ${getTypeColor(notification.type)}`}
                >
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {notification.title}
                      </h3>
                      <p className="text-gray-700 text-sm mt-1">
                        {notification.message}
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          {formatTime(notification.timestamp)}
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(
                            notification.type,
                          )}`}
                        >
                          {notification.type}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-1 shrink-0"></div>
                    )}
                  </div>
                </div>

                {/* Close Button */}
                <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors shrink-0">
                  <X size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;
