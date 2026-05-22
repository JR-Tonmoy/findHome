import axios from "axios";
import { Download, Loader2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

const Orders = () => {
  const { token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);
  const [downloadingRefundId, setDownloadingRefundId] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    let active = true;

    const loadBookings = async () => {
      setLoading(true);
      setError("");

      try {
        const authToken =
          token ||
          localStorage.getItem("token") ||
          localStorage.getItem("access_token");

        if (!authToken) {
          if (active) setBookings([]);
          return;
        }

        const response = await axios.get(
          "http://127.0.0.1:8000/api/tenant/my-bookings",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        );

        if (!active) return;

        setBookings(
          Array.isArray(response?.data?.bookings) ? response.data.bookings : [],
        );
      } catch {
        if (!active) return;
        setError("Failed to load bookings. Please try again.");
        setBookings([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadBookings();

    return () => {
      active = false;
    };
  }, [token]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount || 0);

  const formatDate = (dateValue) => {
    if (!dateValue) return "-";
    return new Date(dateValue).toLocaleDateString("en-BD", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusLabel = (booking) => {
    if (booking?.status === "cancelled" || booking?.is_cancelled)
      return "Cancelled";
    if (booking?.status === "paid") return "Paid";
    if (booking?.payment_status === "completed") return "Paid";
    return booking?.payment_status || booking?.status || "Paid";
  };

  const getStatusClasses = (booking) => {
    if (booking?.status === "cancelled" || booking?.is_cancelled) {
      return "bg-rose-100 text-rose-700";
    }

    if (booking?.status === "paid" || booking?.payment_status === "completed") {
      return "bg-emerald-100 text-emerald-700";
    }

    return "bg-amber-100 text-amber-700";
  };

  const calculateRefundBreakdown = (amount) => {
    const total = Number(amount || 0);
    return {
      tenantRefund: total * 0.9,
      ownerShare: total * 0.07,
      adminShare: total * 0.03,
    };
  };

  const refreshBookings = async () => {
    const authToken =
      token ||
      localStorage.getItem("token") ||
      localStorage.getItem("access_token");

    if (!authToken) {
      setBookings([]);
      return;
    }

    const response = await axios.get(
      "http://127.0.0.1:8000/api/tenant/my-bookings",
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );

    setBookings(
      Array.isArray(response?.data?.bookings) ? response.data.bookings : [],
    );
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;

    setCancellingId(selectedBooking.id);
    setError("");

    try {
      const authToken =
        token ||
        localStorage.getItem("token") ||
        localStorage.getItem("access_token");

      await axios.post(
        `http://127.0.0.1:8000/api/bookings/${selectedBooking.id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      await refreshBookings();
      setSelectedBooking(null);
    } catch (requestError) {
      const message =
        requestError?.response?.data?.message ||
        "Failed to cancel booking. Please try again.";
      setError(message);
    } finally {
      setCancellingId(null);
    }
  };

  const downloadRefundDocument = async (booking) => {
    if (!booking?.id) return;

    setDownloadingRefundId(booking.id);

    try {
      const authToken =
        token ||
        localStorage.getItem("token") ||
        localStorage.getItem("access_token");

      const response = await axios.get(
        `http://127.0.0.1:8000/api/refund/${booking.id}/document`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          responseType: "blob",
        },
      );

      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `refund-booking-${booking.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      setError("Failed to download refund document. Please try again.");
    } finally {
      setDownloadingRefundId(null);
    }
  };

  return (
    <div className="p-6">
      {/* Header section with Breadcrumb and Action Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <p className="text-gray-500 text-sm mb-1">
            Orders <span className="mx-1">&gt;</span> List
          </p>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        </div>
        <div className="mt-4 md:mt-0">
          <Link to="/dashboard/browse">
            <button className="bg-black text-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition">
              Create Order
            </button>
          </Link>
        </div>
      </div>

      {error ? (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="bg-white border border-gray-100 shadow-sm rounded-xl py-16 px-4 md:px-10 flex items-center justify-center text-gray-500">
          Loading bookings...
        </div>
      ) : bookings.length === 0 ? (
        /* Main Content Card (White Theme) */
        <div className="bg-white border border-gray-100 shadow-sm rounded-xl py-16 px-4 md:px-10 flex flex-col items-center justify-center text-center">
          {/* Icon */}
          <div className="bg-gray-100 p-4 rounded-full mb-6">
            <XCircle size={40} className="text-gray-400" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            You Don't Place Any Order Yet
          </h2>

          {/* Description Text */}
          <p className="text-gray-500 max-w-2xl leading-relaxed text-sm md:text-base">
            Your order history will appear here. Place a new order by clicking
            "Create Order" and our team will start searching for a house based
            on your requirements. Refunds are guaranteed if we can't meet your
            request within the specified time.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white border border-gray-100 shadow-sm rounded-xl p-6 md:p-8"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-64 h-48 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  {booking?.property?.image_url ? (
                    <img
                      src={booking.property.image_url}
                      alt={booking?.property?.title || "Booked property"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder-property.jpg";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-gray-100 to-gray-200" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {booking?.property?.title || "Property"}
                      </h2>
                      <p className="mt-2 text-gray-600 text-sm md:text-base">
                        {booking?.property?.location || "Address not available"}
                      </p>
                      <p className="mt-1 text-gray-500 text-sm">
                        Owner: {booking?.owner?.name || "Owner"}
                      </p>
                    </div>

                    <span
                      className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(booking)}`}
                    >
                      {getStatusLabel(booking)}
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="rounded-lg bg-gray-50 p-4">
                      <div className="text-gray-500">Amount Paid</div>
                      <div className="mt-1 font-semibold text-gray-900">
                        {formatCurrency(booking?.amount)}
                      </div>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-4">
                      <div className="text-gray-500">Duration</div>
                      <div className="mt-1 font-semibold text-gray-900">
                        {booking?.duration || "-"}
                      </div>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-4">
                      <div className="text-gray-500">Payment Method</div>
                      <div className="mt-1 font-semibold text-gray-900">
                        {booking?.payment_method || "-"}
                      </div>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-4">
                      <div className="text-gray-500">Booking Date</div>
                      <div className="mt-1 font-semibold text-gray-900">
                        {formatDate(
                          booking?.booking_date || booking?.payment_date,
                        )}
                      </div>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-4 md:col-span-2">
                      <div className="text-gray-500">Owner Contact</div>
                      <div className="mt-1 font-semibold text-gray-900">
                        {booking?.owner?.phone || booking?.owner?.email || "-"}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
                    {booking?.can_cancel && !booking?.is_cancelled ? (
                      <button
                        type="button"
                        onClick={() => setSelectedBooking(booking)}
                        className="inline-flex items-center justify-center rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
                      >
                        Cancel Booking
                      </button>
                    ) : null}

                    {(booking?.is_cancelled ||
                      booking?.refund_status === "processed") &&
                    booking?.refund_document_url ? (
                      <button
                        type="button"
                        onClick={() => downloadRefundDocument(booking)}
                        disabled={downloadingRefundId === booking.id}
                        className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {downloadingRefundId === booking.id ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="mr-2 h-4 w-4" />
                        )}
                        Download Refund PDF
                      </button>
                    ) : null}

                    {booking?.is_cancelled ||
                    booking?.refund_status === "processed" ? (
                      <div className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-600">
                        Refund split:{" "}
                        {formatCurrency(
                          booking?.refund_amount ||
                            calculateRefundBreakdown(booking?.amount)
                              .tenantRefund,
                        )}{" "}
                        to tenant,{" "}
                        {formatCurrency(
                          booking?.owner_share ||
                            calculateRefundBreakdown(booking?.amount)
                              .ownerShare,
                        )}{" "}
                        to owner,{" "}
                        {formatCurrency(
                          booking?.admin_share ||
                            calculateRefundBreakdown(booking?.amount)
                              .adminShare,
                        )}{" "}
                        to admin.
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedBooking ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900">
              Cancel booking?
            </h3>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              This will cancel your booking within the 20-day refund window and
              generate the refund document automatically.
            </p>

            <div className="mt-5 rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
              {(() => {
                const breakdown = calculateRefundBreakdown(
                  selectedBooking?.amount,
                );
                return (
                  <div className="space-y-2">
                    <div>
                      Tenant refund: {formatCurrency(breakdown.tenantRefund)}
                    </div>
                    <div>
                      Owner share: {formatCurrency(breakdown.ownerShare)}
                    </div>
                    <div>
                      Admin share: {formatCurrency(breakdown.adminShare)}
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                disabled={cancellingId === selectedBooking.id}
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleCancelBooking}
                disabled={cancellingId === selectedBooking.id}
                className="inline-flex items-center justify-center rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {cancellingId === selectedBooking.id ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Orders;
