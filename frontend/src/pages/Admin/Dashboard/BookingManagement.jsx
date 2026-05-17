import {
  AlertCircle,
  CheckCircle,
  Clock,
  Home,
  MapPin,
  Phone,
  User,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import adminService from "../../../utils/adminService";

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [stats, setStats] = useState({
    totalBookings: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [approving, setApproving] = useState(null);
  const [rejecting, setRejecting] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);

  useEffect(() => {
    let active = true;

    const loadBookings = async () => {
      setLoading(true);
      try {
        const data = await adminService.fetchAdminBookings();
        if (!active) return;

        // Normalize minimal fields expected by the UI
        const normalized = (Array.isArray(data) ? data : []).map((b) => ({
          id: b.id,
          propertyTitle:
            b.property?.title ||
            b.property_title ||
            b.propertyName ||
            b.propertyTitle ||
            "-",
          propertyLocation:
            b.property?.location ||
            b.property_location ||
            b.propertyLocation ||
            "-",
          tenantName:
            b.tenant?.name || b.tenant_name || b.tenantName || b.tenant || "-",
          tenantEmail:
            b.tenant?.email || b.tenant_email || b.tenantEmail || "-",
          tenantPhone:
            b.tenant?.phone || b.tenant_phone || b.tenantPhone || "-",
          moveInDate:
            b.move_in_date || b.moveInDate || b.moveIn || b.start_date || "-",
          duration: b.duration || b.months || b.period || "-",
          status: b.status || b.booking_status || "pending",
          requestedDate:
            b.requested_at || b.created_at || b.requestedDate || null,
          approvalDate: b.approved_at || b.approvalDate || null,
        }));

        setBookings(normalized);

        const total = normalized.length;
        const pend = normalized.filter((b) => b.status === "pending").length;
        const appr = normalized.filter((b) => b.status === "approved").length;
        const rej = normalized.filter((b) => b.status === "rejected").length;

        setStats({
          totalBookings: total,
          pending: pend,
          approved: appr,
          rejected: rej,
        });
      } catch (err) {
        console.error("Failed to load bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
    return () => {
      active = false;
    };
  }, []);

  const handleApprove = async (booking) => {
    setApproving(booking.id);
    setMessage(null);

    try {
      await adminService.approveBookingAdmin(booking.id);

      // Update local state
      setBookings((prev) =>
        prev.map((b) =>
          b.id === booking.id ? { ...b, status: "approved" } : b,
        ),
      );

      // Update stats
      setStats((prev) => ({
        totalBookings: prev.totalBookings,
        pending: prev.pending - 1,
        approved: prev.approved + 1,
        rejected: prev.rejected,
      }));

      setMessage(
        `✓ Booking approved! Tenant notification sent: "Congratulations! Your booking request has been approved successfully. Please complete your payment."`,
      );
      setMessageType("success");

      setTimeout(() => setMessage(null), 5000);
    } catch (err) {
      console.error("Failed to approve booking:", err);
      setMessage(
        `✗ Failed to approve booking: ${err?.message || "Unknown error"}`,
      );
      setMessageType("error");

      setTimeout(() => setMessage(null), 5000);
    } finally {
      setApproving(null);
    }
  };

  const handleReject = async (booking) => {
    if (
      !window.confirm(
        `Are you sure you want to reject the booking from ${booking.tenantName}?`,
      )
    ) {
      return;
    }

    setRejecting(booking.id);
    setMessage(null);

    try {
      await adminService.rejectBookingAdmin(booking.id);

      // Update local state
      setBookings((prev) =>
        prev.map((b) =>
          b.id === booking.id ? { ...b, status: "rejected" } : b,
        ),
      );

      // Update stats
      setStats((prev) => ({
        totalBookings: prev.totalBookings,
        pending: prev.pending - 1,
        approved: prev.approved,
        rejected: prev.rejected + 1,
      }));

      setMessage(
        `✓ Booking rejected! Tenant notification sent: "Your booking request was rejected. Please review your information and try again."`,
      );
      setMessageType("success");

      setTimeout(() => setMessage(null), 5000);
    } catch (err) {
      console.error("Failed to reject booking:", err);
      setMessage(
        `✗ Failed to reject booking: ${err?.message || "Unknown error"}`,
      );
      setMessageType("error");

      setTimeout(() => setMessage(null), 5000);
    } finally {
      setRejecting(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filterStatus === "all") return true;
    return b.status === filterStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle size={16} />;
      case "pending":
        return <Clock size={16} />;
      case "rejected":
        return <XCircle size={16} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Booking Management
        </h1>
        <p className="text-gray-600">
          Monitor and manage all property booking requests
        </p>
      </div>

      {/* Message Alert */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg border flex items-start gap-3 ${
            messageType === "success"
              ? "bg-green-50 border-green-200"
              : "bg-red-50 border-red-200"
          }`}
        >
          <AlertCircle
            size={20}
            className={
              messageType === "success" ? "text-green-600" : "text-red-600"
            }
          />
          <p
            className={
              messageType === "success"
                ? "text-green-800 text-sm"
                : "text-red-800 text-sm"
            }
          >
            {message}
          </p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-700 text-sm font-medium">
                Total Bookings
              </p>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                {stats.totalBookings}
              </p>
            </div>
            <Home size={32} className="text-blue-300" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-700 text-sm font-medium">Pending</p>
              <p className="text-3xl font-bold text-yellow-900 mt-2">
                {stats.pending}
              </p>
            </div>
            <Clock size={32} className="text-yellow-300" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-700 text-sm font-medium">Approved</p>
              <p className="text-3xl font-bold text-green-900 mt-2">
                {stats.approved}
              </p>
            </div>
            <CheckCircle size={32} className="text-green-300" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-700 text-sm font-medium">Rejected</p>
              <p className="text-3xl font-bold text-red-900 mt-2">
                {stats.rejected}
              </p>
            </div>
            <XCircle size={32} className="text-red-300" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-sm">
        <div className="flex gap-2 flex-wrap">
          {["all", "pending", "approved", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                filterStatus === status
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {status === "all" ? "All Bookings" : status}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      {loading ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Home size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No bookings found
          </h3>
          <p className="text-gray-600">
            {filterStatus === "all"
              ? "No booking requests yet."
              : `No ${filterStatus} bookings found.`}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Tenant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Move-in Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {booking.propertyTitle}
                        </p>
                        <div className="flex items-center text-gray-500 text-xs mt-1">
                          <MapPin size={12} className="mr-1" />
                          {booking.propertyLocation}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {booking.tenantName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {booking.tenantEmail}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Phone size={14} className="text-gray-400" />
                        {booking.tenantPhone}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {booking.moveInDate}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {booking.duration} months
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${getStatusColor(
                          booking.status,
                        )}`}
                      >
                        {getStatusIcon(booking.status)}
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {booking.status === "pending" ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(booking)}
                            disabled={approving === booking.id}
                            className={`px-3 py-1 rounded text-white font-medium transition-all ${
                              approving === booking.id
                                ? "bg-green-400 cursor-wait"
                                : "bg-green-600 hover:bg-green-700"
                            }`}
                          >
                            {approving === booking.id ? "..." : "Approve"}
                          </button>
                          <button
                            onClick={() => handleReject(booking)}
                            disabled={rejecting === booking.id}
                            className={`px-3 py-1 rounded text-white font-medium transition-all ${
                              rejecting === booking.id
                                ? "bg-red-400 cursor-wait"
                                : "bg-red-600 hover:bg-red-700"
                            }`}
                          >
                            {rejecting === booking.id ? "..." : "Reject"}
                          </button>
                        </div>
                      ) : (
                        <button className="text-gray-600 hover:text-gray-800 font-medium">
                          View
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
