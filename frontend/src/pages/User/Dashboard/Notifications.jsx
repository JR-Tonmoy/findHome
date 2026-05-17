import { Bell, CheckCircle, CreditCard, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  deleteNotification,
  fetchNotifications,
  markNotificationAsRead,
} from "../../../utils/notificationService";

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, unread, read

  // Load notifications
  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await fetchNotifications();
      setNotifications(response?.data || []);
      setUnreadCount(response?.unread_count || 0);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();

    // Poll for new notifications every 10 seconds
    const interval = setInterval(() => {
      loadNotifications();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      loadNotifications();
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
      loadNotifications();
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  // Filter notifications
  let filteredNotifications = notifications;
  if (filter === "unread") {
    filteredNotifications = notifications.filter((n) => !n.is_read);
  } else if (filter === "read") {
    filteredNotifications = notifications.filter((n) => n.is_read);
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case "booking_request":
        return "📋";
      case "booking_approved":
        return "✅";
      case "booking_rejected":
        return "❌";
      case "payment_completed":
        return "💳";
      default:
        return "🔔";
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "booking_request":
        return "bg-blue-50 border-blue-200";
      case "booking_approved":
        return "bg-green-50 border-green-200";
      case "booking_rejected":
        return "bg-red-50 border-red-200";
      case "payment_completed":
        return "bg-emerald-50 border-emerald-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const canPayNow = (notification) =>
    notification.type === "booking_approved" && notification.booking?.id;

  const handlePayNow = (notification) => {
    const bookingId = notification.booking?.id;

    if (!bookingId) {
      return;
    }

    navigate(`/dashboard/payments/${bookingId}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:px-0 md:py-8 min-h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Bell size={32} />
          Notifications
        </h1>
        <p className="text-gray-600 mt-2">
          You have {unreadCount} unread notification
          {unreadCount !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {["all", "unread", "read"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === f
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {f === "all" ? "All" : f === "unread" ? "Unread" : "Read"}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12 text-gray-500">
            <Bell size={48} className="mx-auto mb-4 opacity-50" />
            <p>Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Bell size={48} className="mx-auto mb-4 opacity-50" />
            <p>
              {filter === "all"
                ? "No notifications yet"
                : filter === "unread"
                  ? "No unread notifications"
                  : "No read notifications"}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-6 rounded-lg border-2 transition ${getNotificationColor(
                notification.type,
              )} ${!notification.is_read ? "shadow-md" : ""}`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <span className="text-4xl flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">
                        {notification.title}
                        {!notification.is_read && (
                          <span className="ml-2 inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                      </h3>
                      <p className="text-gray-700 mt-2 leading-relaxed">
                        {notification.message}
                      </p>
                      <p className="text-sm text-gray-500 mt-3">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>

                      {/* Booking Details */}
                      {notification.booking && (
                        <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                          <p className="text-sm font-semibold text-gray-900">
                            Property: {notification.booking.property?.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Tenant: {notification.booking.tenant?.name}
                          </p>
                          {notification.booking.move_in_date && (
                            <p className="text-sm text-gray-600">
                              Move-in:{" "}
                              {new Date(
                                notification.booking.move_in_date,
                              ).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {canPayNow(notification) ? (
                        <button
                          onClick={() => handlePayNow(notification)}
                          className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition"
                          title="Pay now"
                        >
                          <CreditCard size={20} />
                        </button>
                      ) : null}
                      {!notification.is_read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                          title="Mark as read"
                        >
                          <CheckCircle size={20} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                        title="Delete"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Back Link */}
      <div className="mt-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotificationsPage;
