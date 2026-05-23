import {
  Bell,
  CheckCircle2,
  CreditCard,
  Loader2,
  MessageSquare,
  RotateCcw,
  Shield,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  deleteNotification,
  fetchTenantNotifications,
  markNotificationAsRead,
} from "../../../utils/notificationService";

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const loadNotifications = async () => {
    setError("");
    setIsLoading(true);

    try {
      const response = await fetchTenantNotifications();
      setNotifications(Array.isArray(response?.data) ? response.data : []);
      setUnreadCount(response?.unread_count || 0);
    } catch (err) {
      console.error("Failed to load notifications:", err);
      setError("Failed to load notifications. Please try again.");
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();

    const interval = setInterval(async () => {
      setIsRefreshing(true);
      await loadNotifications();
      setIsRefreshing(false);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      await loadNotifications();
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
      await loadNotifications();
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread") return !notification.is_read;
    if (filter === "read") return notification.is_read;
    return true;
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case "booking_approved":
      case "booking_confirmed":
        return <CheckCircle2 className="h-5 w-5" />;
      case "payment_completed":
      case "payment_successful":
        return <CreditCard className="h-5 w-5" />;
      case "refund_processed":
        return <RotateCcw className="h-5 w-5" />;
      case "booking_cancelled":
        return <Shield className="h-5 w-5" />;
      case "owner_message":
        return <MessageSquare className="h-5 w-5" />;
      case "admin_notification":
        return <Bell className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getNotificationStyles = (type, isRead) => {
    const tone = {
      booking_approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
      booking_confirmed: "border-emerald-200 bg-emerald-50 text-emerald-700",
      payment_completed: "border-blue-200 bg-blue-50 text-blue-700",
      payment_successful: "border-blue-200 bg-blue-50 text-blue-700",
      refund_processed: "border-amber-200 bg-amber-50 text-amber-700",
      booking_cancelled: "border-rose-200 bg-rose-50 text-rose-700",
      owner_message: "border-indigo-200 bg-indigo-50 text-indigo-700",
      admin_notification: "border-slate-200 bg-slate-50 text-slate-700",
    };

    return `${tone[type] || "border-gray-200 bg-gray-50 text-gray-700"} ${isRead ? "opacity-90" : "shadow-sm"}`;
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
    <div className="mx-auto min-h-[calc(100vh-80px)] max-w-5xl px-4 py-6 md:px-0 md:py-8">
      <div className="mb-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-900">
              <Bell size={32} />
              Notifications
            </h1>
            <p className="mt-2 text-gray-600">
              {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            <span>Refreshing every 15 seconds</span>
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {["all", "unread", "read"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-4 py-2 font-medium transition ${
              filter === f
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {f === "all" ? "All" : f === "unread" ? "Unread" : "Read"}
          </button>
        ))}
      </div>

      {error ? (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      ) : null}

      <div className="space-y-4">
        {isLoading ? (
          <div className="rounded-2xl border border-gray-100 bg-white py-16 text-center text-gray-500 shadow-sm">
            <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-gray-400" />
            Loading notifications...
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white py-16 text-center text-gray-500 shadow-sm">
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
              className={`rounded-2xl border p-5 transition ${getNotificationStyles(
                notification.type,
                notification.is_read,
              )}`}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/90 shadow-sm ring-1 ring-black/5">
                  {getNotificationIcon(notification.type)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          {notification.title}
                        </h3>
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            notification.is_read
                              ? "bg-gray-100 text-gray-600"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {notification.is_read ? "Read" : "Unread"}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-gray-700">
                        {notification.message}
                      </p>
                      <p className="mt-3 text-xs text-gray-500">
                        {notification.created_at
                          ? new Date(notification.created_at).toLocaleString()
                          : "-"}
                      </p>

                      {notification.booking ? (
                        <div className="mt-4 rounded-xl border border-white/60 bg-white/90 p-4 text-sm text-gray-700 shadow-sm">
                          <p className="font-semibold text-gray-900">
                            {notification.booking.property?.title || "Booking"}
                          </p>
                          <p className="mt-1 text-gray-600">
                            {notification.booking.property?.location || "Address not available"}
                          </p>
                        </div>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-2 self-start">
                      {canPayNow(notification) ? (
                        <button
                          onClick={() => handlePayNow(notification)}
                          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                        >
                          <CreditCard size={16} />
                          Pay now
                        </button>
                      ) : null}
                      {!notification.is_read ? (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="rounded-lg bg-white/90 p-2 text-blue-600 transition hover:bg-blue-50"
                          title="Mark as read"
                        >
                          <CheckCircle2 size={18} />
                        </button>
                      ) : null}
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="rounded-lg bg-white/90 p-2 text-red-600 transition hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotificationsPage;
