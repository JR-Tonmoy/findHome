import {
  AlertCircle,
  CheckCircle,
  Clock,
  Home,
  MapPin,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import adminService from "../../../utils/adminService";

const resolveBookingLocation = (booking) => {
  const property = booking?.property || {};

  return (
    booking?.property_location ||
    booking?.propertyLocation ||
    property?.formatted_location ||
    property?.location ||
    [property?.area, property?.district].filter(Boolean).join(", ") ||
    "-"
  );
};

const normalizeBookingRecord = (booking) => {
  const property = booking?.property || {};
  const tenant = booking?.tenant || {};
  const owner = booking?.owner || property?.owner || {};
  const payment = booking?.payment || {};
  const durationValue = Number(booking?.duration || 1);
  const propertyPrice = Number(property?.price || 0);
  const paymentAmount = Number(payment?.total_amount || 0);

  return {
    id: booking?.id,
    bookingCode:
      booking?.booking_code ||
      `BK-${String(booking?.id || 0).padStart(6, "0")}`,
    propertyName:
      booking?.property_name ||
      booking?.propertyTitle ||
      property?.title ||
      "-",
    propertyLocation: resolveBookingLocation(booking),
    tenantName:
      booking?.tenant_name || booking?.tenantName || tenant?.name || "-",
    tenantEmail:
      booking?.tenant_email || booking?.tenantEmail || tenant?.email || "-",
    tenantPhone:
      booking?.tenant_phone || booking?.tenantPhone || tenant?.phone || "-",
    moveInDate: booking?.move_in_date || booking?.moveInDate || null,
    duration: booking?.duration || "-",
    status: booking?.status || booking?.booking_status || "pending",
    paymentStatus:
      booking?.payment_status || payment?.payment_status || "pending",
    bookingAmount:
      booking?.booking_amount ??
      booking?.amount ??
      paymentAmount ??
      (propertyPrice > 0 ? propertyPrice * durationValue : 0),
    createdAt: booking?.created_at || null,
    ownerName: owner?.name || booking?.owner_name || booking?.ownerName || "-",
    approvedAt: booking?.approved_at || null,
    rejectedAt: booking?.rejected_at || null,
    paidAt: booking?.paid_at || payment?.payment_date || null,
    property,
    tenant,
    owner,
    payment,
    refund: booking?.refund || null,
    invoiceUrl:
      booking?.invoice_url ||
      (payment?.id ? `/api/payments/${payment.id}/invoice` : null),
    raw: booking,
  };
};

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [stats, setStats] = useState({
    totalBookings: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [approving, setApproving] = useState(null);
  const [rejecting, setRejecting] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);

  const formatDate = (value) => {
    if (!value) return "-";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);

    return date.toLocaleDateString("en-BD", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (value) => {
    if (!value) return "-";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);

    return date.toLocaleString("en-BD", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(Number(value || 0));

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "completed":
      case "paid":
        return "bg-emerald-100 text-emerald-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "failed":
      case "cancelled":
      case "refunded":
        return "bg-rose-100 text-rose-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
      case "paid":
        return <CheckCircle size={16} />;
      case "pending":
        return <Clock size={16} />;
      case "rejected":
      case "cancelled":
        return <XCircle size={16} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    let active = true;

    const loadBookings = async () => {
      setLoading(true);

      try {
        const data = await adminService.fetchAdminBookings();
        if (!active) return;

        const normalized = (Array.isArray(data) ? data : []).map((booking) =>
          normalizeBookingRecord(booking),
        );

        setBookings(normalized);

        const total = normalized.length;
        const pending = normalized.filter(
          (item) => item.status === "pending",
        ).length;
        const approved = normalized.filter(
          (item) => item.status === "approved",
        ).length;
        const rejected = normalized.filter(
          (item) => item.status === "rejected",
        ).length;

        setStats({ totalBookings: total, pending, approved, rejected });
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
      const updatedBooking = await adminService.approveBookingAdmin(booking.id);
      const nextBooking = updatedBooking
        ? normalizeBookingRecord(updatedBooking)
        : {
            ...booking,
            status: "approved",
            paymentStatus: booking.paymentStatus || "pending",
          };

      setBookings((prev) =>
        prev.map((item) =>
          item.id === booking.id ? { ...item, ...nextBooking } : item,
        ),
      );
      setSelectedBooking((current) =>
        current?.id === booking.id ? { ...current, ...nextBooking } : current,
      );
      setStats((prev) => ({
        totalBookings: prev.totalBookings,
        pending: Math.max(0, prev.pending - 1),
        approved: prev.approved + 1,
        rejected: prev.rejected,
      }));

      setMessage(
        "Booking approved. Notifications were sent to the tenant and owner.",
      );
      setMessageType("success");
      setTimeout(() => setMessage(null), 5000);
    } catch (err) {
      console.error("Failed to approve booking:", err);
      setMessage(
        `Failed to approve booking: ${err?.message || "Unknown error"}`,
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
      const updatedBooking = await adminService.rejectBookingAdmin(booking.id);
      const nextBooking = updatedBooking
        ? normalizeBookingRecord(updatedBooking)
        : { ...booking, status: "rejected", paymentStatus: "rejected" };

      setBookings((prev) =>
        prev.map((item) =>
          item.id === booking.id ? { ...item, ...nextBooking } : item,
        ),
      );
      setSelectedBooking((current) =>
        current?.id === booking.id ? { ...current, ...nextBooking } : current,
      );
      setStats((prev) => ({
        totalBookings: prev.totalBookings,
        pending: Math.max(0, prev.pending - 1),
        approved: prev.approved,
        rejected: prev.rejected + 1,
      }));

      setMessage("Booking rejected. A notification was sent to the tenant.");
      setMessageType("success");
      setTimeout(() => setMessage(null), 5000);
    } catch (err) {
      console.error("Failed to reject booking:", err);
      setMessage(
        `Failed to reject booking: ${err?.message || "Unknown error"}`,
      );
      setMessageType("error");
      setTimeout(() => setMessage(null), 5000);
    } finally {
      setRejecting(null);
    }
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((item) => {
      if (filterStatus === "all") return true;
      return item.status === filterStatus;
    });
  }, [bookings, filterStatus]);

  const detailsBooking = selectedBooking
    ? normalizeBookingRecord(selectedBooking)
    : null;

  const openDetails = async (booking) => {
    setDetailLoading(true);
    setSelectedBooking(booking);

    try {
      const details = await adminService.fetchAdminBookingDetails(booking.id);
      if (details) {
        setSelectedBooking(normalizeBookingRecord(details));
      }
    } catch (err) {
      console.warn("Falling back to list booking details", err);
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetails = () => setSelectedBooking(null);

  const downloadInvoice = async (booking) => {
    if (!booking?.payment?.id) return;

    try {
      const response = await adminService.downloadAdminPaymentInvoice(
        booking.payment.id,
      );
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");

      anchor.href = url;
      anchor.download = `invoice-${booking.payment.id}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download booking invoice:", err);
      setMessage(err?.message || "Failed to download invoice.");
      setMessageType("error");
      setTimeout(() => setMessage(null), 5000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Booking Management
        </h1>
        <p className="text-gray-600">
          Monitor and manage all property booking requests
        </p>
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6 shadow-sm">
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

        <div className="bg-linear-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200 p-6 shadow-sm">
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

        <div className="bg-linear-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-6 shadow-sm">
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

        <div className="bg-linear-to-br from-red-50 to-red-100 rounded-lg border border-red-200 p-6 shadow-sm">
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

      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-sm">
        <div className="flex gap-2 flex-wrap">
          {["all", "pending", "approved", "rejected", "paid", "cancelled"].map(
            (status) => (
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
            ),
          )}
        </div>
      </div>

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
                    Move-in Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Booking Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Payment Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Created / Owner
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
                        <p className="text-sm font-semibold text-gray-900">
                          {booking.propertyName}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <MapPin size={12} />
                          {booking.propertyLocation}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {booking.tenantName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {booking.tenantEmail}
                        </p>
                        <p className="text-xs text-gray-500">
                          {booking.tenantPhone}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatDate(booking.moveInDate)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {booking.duration} month
                      {String(booking.duration) === "1" ? "" : "s"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${getStatusColor(booking.status)}`}
                      >
                        {getStatusIcon(booking.status)}
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(booking.paymentStatus)}`}
                      >
                        {booking.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {formatCurrency(booking.bookingAmount)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="space-y-1">
                        <p className="font-medium text-gray-900">
                          {booking.ownerName || booking.owner?.name || "-"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDateTime(booking.createdAt)}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex flex-wrap gap-2">
                        {booking.status === "pending" && (
                          <>
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
                          </>
                        )}
                        <button
                          onClick={() => openDetails(booking)}
                          className="px-3 py-1 rounded bg-gray-100 text-gray-700 font-medium hover:bg-gray-200"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {detailsBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 py-8 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                  Booking Details
                </p>
                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                  {detailsBooking.bookingCode}
                </h2>
              </div>
              <button
                onClick={closeDetails}
                className="rounded-full bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Close
              </button>
            </div>

            <div className="grid gap-6 px-6 py-6 md:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Property Information
                </h3>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-gray-500">Property Name</dt>
                    <dd className="font-medium text-gray-900">
                      {detailsBooking.propertyName}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Property Category</dt>
                    <dd className="font-medium text-gray-900">
                      {detailsBooking.property?.category || "-"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Property Location</dt>
                    <dd className="font-medium text-gray-900">
                      {detailsBooking.propertyLocation}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Monthly Rent</dt>
                    <dd className="font-medium text-gray-900">
                      {formatCurrency(detailsBooking.property?.price || 0)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Owner Name</dt>
                    <dd className="font-medium text-gray-900">
                      {detailsBooking.owner?.name ||
                        detailsBooking.ownerName ||
                        "-"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Property Status</dt>
                    <dd className="font-medium text-gray-900">
                      {detailsBooking.property?.status || "-"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Property Image</dt>
                    <dd className="mt-2">
                      <img
                        src={
                          detailsBooking.property?.image ||
                          detailsBooking.property?.image_url ||
                          "/images/property-placeholder.png"
                        }
                        alt={detailsBooking.propertyName}
                        className="h-32 w-full rounded-xl object-cover border border-gray-200"
                        onError={(event) => {
                          event.currentTarget.src =
                            "/images/property-placeholder.png";
                        }}
                      />
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Tenant Information
                </h3>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-gray-500">Name</dt>
                    <dd className="font-medium text-gray-900">
                      {detailsBooking.tenantName}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Email</dt>
                    <dd className="font-medium text-gray-900">
                      {detailsBooking.tenantEmail}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Phone</dt>
                    <dd className="font-medium text-gray-900">
                      {detailsBooking.tenantPhone}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5 md:col-span-2">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Booking & Payment
                </h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm text-gray-500">Booking Status</p>
                    <span
                      className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(detailsBooking.status)}`}
                    >
                      {detailsBooking.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Status</p>
                    <span
                      className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getPaymentStatusColor(detailsBooking.paymentStatus)}`}
                    >
                      {detailsBooking.paymentStatus}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="mt-2 font-medium text-gray-900">
                      {detailsBooking.duration} month
                      {String(detailsBooking.duration) === "1" ? "" : "s"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Move-in Date</p>
                    <p className="mt-2 font-medium text-gray-900">
                      {formatDate(detailsBooking.moveInDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Created Date</p>
                    <p className="mt-2 font-medium text-gray-900">
                      {formatDateTime(detailsBooking.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="mt-2 font-medium text-gray-900">
                      {detailsBooking.payment?.payment_method || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Transaction ID</p>
                    <p className="mt-2 font-medium text-gray-900 break-all">
                      {detailsBooking.payment?.transaction_id || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Refund Status</p>
                    <p className="mt-2 font-medium text-gray-900">
                      {detailsBooking.refund?.refund_status ||
                        detailsBooking.raw?.refund_status ||
                        "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Booking Amount</p>
                    <p className="mt-2 font-medium text-gray-900">
                      {formatCurrency(detailsBooking.bookingAmount)}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={() => downloadInvoice(detailsBooking)}
                    disabled={!detailsBooking.payment?.id}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                  >
                    Download Invoice
                  </button>
                </div>
              </div>
            </div>

            {detailLoading && (
              <div className="absolute right-6 top-20 rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-600 shadow">
                Loading live booking details...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
