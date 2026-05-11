import { Bell, CheckCircle, Mail, MapPin, Phone, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  approveBooking,
  fetchNotifications,
  fetchOwnerBookings,
  markNotificationAsRead,
  rejectBooking,
} from "../../../utils/notificationService";

const OwnerNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending"); // pending, approved, rejected
  const [approving, setApproving] = useState(null);
  const [rejecting, setRejecting] = useState(null);

  // Load data
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [notifResponse, bookingResponse] = await Promise.all([
        fetchNotifications(),
        fetchOwnerBookings(),
      ]);
      setNotifications(notifResponse?.data || []);
      setUnreadCount(notifResponse?.unread_count || 0);
      setBookings(bookingResponse?.data || []);
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Poll every 10 seconds
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleApprove = async (bookingId, notificationId) => {
    setApproving(bookingId);
    try {
      await approveBooking(bookingId);
      if (notificationId) {
        await markNotificationAsRead(notificationId);
      }
      await loadData();
    } catch (err) {
      console.error("Failed to approve booking:", err);
      alert("Failed to approve booking. Please try again.");
    } finally {
      setApproving(null);
    }
  };

  const handleReject = async (bookingId, notificationId) => {
    if (
      !window.confirm("Are you sure you want to reject this booking request?")
    ) {
      return;
    }

    setRejecting(bookingId);
    try {
      await rejectBooking(bookingId);
      if (notificationId) {
        await markNotificationAsRead(notificationId);
      }
      await loadData();
    } catch (err) {
      console.error("Failed to reject booking:", err);
      alert("Failed to reject booking. Please try again.");
    } finally {
      setRejecting(null);
    }
  };

  // Filter bookings by status
  const filteredBookings = bookings.filter(
    (booking) =>
      (activeTab === "pending" && booking.status === "pending") ||
      (activeTab === "approved" && booking.status === "approved") ||
      (activeTab === "rejected" && booking.status === "rejected"),
  );

  const getStatusBadge = (status) => {
    const badges = {
      pending:
        "bg-yellow-50 text-yellow-700 border-yellow-200 px-3 py-1 rounded-full text-sm font-semibold",
      approved:
        "bg-green-50 text-green-700 border-green-200 px-3 py-1 rounded-full text-sm font-semibold",
      rejected:
        "bg-red-50 text-red-700 border-red-200 px-3 py-1 rounded-full text-sm font-semibold",
    };
    return badges[status] || badges.pending;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:px-0 md:py-8 min-h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Bell size={32} />
          Booking Requests & Notifications
        </h1>
        <p className="text-gray-600 mt-2">
          Manage booking requests and notifications from tenants
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-white rounded-lg border border-gray-100 shadow-sm">
          <div className="text-gray-500 text-sm font-semibold mb-1">
            Total Bookings
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {bookings.length}
          </div>
        </div>
        <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-200 shadow-sm">
          <div className="text-yellow-700 text-sm font-semibold mb-1">
            Pending Requests
          </div>
          <div className="text-3xl font-bold text-yellow-700">
            {bookings.filter((b) => b.status === "pending").length}
          </div>
        </div>
        <div className="p-6 bg-blue-50 rounded-lg border border-blue-200 shadow-sm">
          <div className="text-blue-700 text-sm font-semibold mb-1">
            Unread Notifications
          </div>
          <div className="text-3xl font-bold text-blue-700">{unreadCount}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b border-gray-200">
        {["pending", "approved", "rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 font-medium transition border-b-2 ${
              activeTab === tab
                ? "border-black text-black"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab === "pending"
              ? "⏳ Pending"
              : tab === "approved"
                ? "✅ Approved"
                : "❌ Rejected"}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-12 text-gray-500">
            <Bell size={48} className="mx-auto mb-4 opacity-50" />
            <p>Loading booking requests...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
            <Bell size={48} className="mx-auto mb-4 opacity-50" />
            <p>No {activeTab} booking requests</p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start justify-between gap-6 mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      {booking.property?.title}
                    </h3>
                    <span
                      className={`border ${getStatusBadge(booking.status)}`}
                    >
                      {booking.status.charAt(0).toUpperCase() +
                        booking.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-600 flex items-center gap-2">
                    <MapPin size={16} />
                    {booking.property?.location}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    ৳{parseInt(booking.property?.price || 0).toLocaleString()}
                  </div>
                  <p className="text-gray-500 text-sm">/month</p>
                </div>
              </div>

              {/* Tenant Info */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Tenant Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium text-gray-900">
                      {booking.tenant?.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Phone size={14} /> Phone
                    </p>
                    <p className="font-medium text-gray-900">
                      {booking.tenant?.phone || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Mail size={14} /> Email
                    </p>
                    <p className="font-medium text-gray-900">
                      {booking.tenant?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {booking.move_in_date && (
                    <div>
                      <p className="text-sm text-blue-700">Move-in Date</p>
                      <p className="font-medium text-gray-900">
                        {new Date(booking.move_in_date).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-blue-700">Duration</p>
                    <p className="font-medium text-gray-900">
                      {booking.duration} months
                    </p>
                  </div>
                </div>
                {booking.message && (
                  <div className="mt-4 pt-4 border-t border-blue-200">
                    <p className="text-sm text-blue-700 font-medium">
                      Message from Tenant
                    </p>
                    <p className="text-gray-700 mt-2">{booking.message}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              {booking.status === "pending" && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(booking.id)}
                    disabled={approving === booking.id}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition"
                  >
                    <CheckCircle size={18} />
                    {approving === booking.id ? "Approving..." : "Approve"}
                  </button>
                  <button
                    onClick={() => handleReject(booking.id)}
                    disabled={rejecting === booking.id}
                    className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 transition"
                  >
                    <XCircle size={18} />
                    {rejecting === booking.id ? "Rejecting..." : "Reject"}
                  </button>
                </div>
              )}

              {/* Metadata */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Request date: {new Date(booking.created_at).toLocaleString()}
                </p>
                {booking.approved_at && (
                  <p className="text-xs text-green-600">
                    Approved: {new Date(booking.approved_at).toLocaleString()}
                  </p>
                )}
                {booking.rejected_at && (
                  <p className="text-xs text-red-600">
                    Rejected: {new Date(booking.rejected_at).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Back Link */}
      <div className="mt-8">
        <Link
          to="/owner-dashboard"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default OwnerNotifications;
