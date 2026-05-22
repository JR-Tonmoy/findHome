import axios from "axios";
import {
  Calendar,
  CreditCard,
  DollarSign,
  Download,
  Filter,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import {
  fetchTenantBookings,
  fetchTenantPayments,
} from "../../../utils/notificationService";

const calculateBookingTotal = (booking) => {
  const monthlyRent = Number.parseFloat(
    String(booking?.property?.price || booking?.property_price || 0).replace(
      /[^0-9.]/g,
      "",
    ),
  );

  return monthlyRent || 0;
};

const mapBookingsToPendingPayments = (bookingRows, paidBookingIds) =>
  bookingRows
    .filter((booking) =>
      ["approved", "confirmed"].includes(String(booking.status)),
    )
    .filter((booking) => !paidBookingIds.has(Number(booking.id)))
    .map((booking) => ({
      id: `booking-${booking.id}`,
      bookingId: booking.id,
      propertyTitle: booking.property?.title || "Property Booking",
      ownerName:
        booking.property?.owner_name || booking.property?.user?.name || "Owner",
      amount: calculateBookingTotal(booking),
      dueDate: booking.approved_at
        ? new Date(booking.approved_at)
        : new Date(booking.created_at),
      paidDate: null,
      status: "pending",
      method: null,
      transactionId: null,
      isPendingPayment: true,
    }));

const mapPaymentsToRows = (paymentRows) =>
  paymentRows.map((payment) => ({
    id: `payment-${payment.id}`,
    bookingId: payment.booking_id,
    propertyTitle:
      payment.property_name || payment.property?.title || "Property",
    ownerName: payment.owner_name || payment.owner?.name || "Owner",
    amount: Number(payment.total_amount || payment.total_payment || 0),
    dueDate: payment.booking_date
      ? new Date(payment.booking_date)
      : new Date(payment.payment_date || Date.now()),
    paidDate: payment.payment_date ? new Date(payment.payment_date) : null,
    status:
      payment.payment_status === "completed" ? "paid" : payment.payment_status,
    method: payment.payment_method || "sslcommerz",
    transactionId: payment.transaction_id,
    isPendingPayment: payment.payment_status !== "completed",
  }));

const PaymentHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [invoiceError, setInvoiceError] = useState("");
  const [stats, setStats] = useState({
    totalPaid: 0,
    pendingPayments: 0,
    nextPaymentDue: 0,
  });

  const paymentBanner = searchParams.get("payment");
  const paymentTransactionId = searchParams.get("transaction_id");

  useEffect(() => {
    const loadPayments = async () => {
      setLoading(true);
      try {
        const tenantId = user?.id;
        if (!tenantId) {
          setPayments([]);
          setStats({ totalPaid: 0, pendingPayments: 0, nextPaymentDue: 0 });
          return;
        }

        const [bookingsResponse, paymentsResponse] = await Promise.all([
          fetchTenantBookings(),
          fetchTenantPayments(tenantId),
        ]);

        const bookingRows = bookingsResponse?.data || [];
        const paymentRows = paymentsResponse?.data || [];
        const paidBookingIds = new Set(
          paymentRows.map((payment) => Number(payment.booking_id)),
        );

        const pendingPaymentRows = mapBookingsToPendingPayments(
          bookingRows,
          paidBookingIds,
        );
        const completedPaymentRows = mapPaymentsToRows(paymentRows);
        const mergedPayments = [
          ...completedPaymentRows,
          ...pendingPaymentRows,
        ].sort(
          (left, right) => new Date(right.dueDate) - new Date(left.dueDate),
        );

        setPayments(mergedPayments);

        const totalPaid = completedPaymentRows
          .filter((payment) => payment.status === "paid")
          .reduce((sum, payment) => sum + payment.amount, 0);

        const pending = pendingPaymentRows.reduce(
          (sum, payment) => sum + payment.amount,
          0,
        );

        const nearestDueDate = pendingPaymentRows
          .map((payment) => payment.dueDate)
          .sort((left, right) => left - right)[0];
        const daysUntilDue = nearestDueDate
          ? Math.max(
              0,
              Math.ceil((nearestDueDate - new Date()) / (1000 * 60 * 60 * 24)),
            )
          : 0;

        setStats({
          totalPaid: totalPaid,
          pendingPayments: pending,
          nextPaymentDue: daysUntilDue,
        });
      } catch (err) {
        console.error("Failed to load payment history:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, [user?.id]);

  const bannerMessage = useMemo(() => {
    if (paymentBanner === "success") {
      return paymentTransactionId
        ? `Payment completed successfully. Transaction ID: ${paymentTransactionId}`
        : "Payment completed successfully.";
    }

    if (paymentBanner === "failed") {
      return "The payment attempt failed. Please try again.";
    }

    if (paymentBanner === "cancelled") {
      return "The payment was cancelled before completion.";
    }

    return "";
  }, [paymentBanner, paymentTransactionId]);

  const filteredPayments = payments.filter((p) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "pending") return p.status === "pending";
    if (filterStatus === "paid") return p.status === "paid";
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getMethodLabel = (method) => {
    const methods = {
      bkash: "bKash",
      nagad: "Nagad",
      visa: "Visa Card",
      mastercard: "MasterCard",
      rocket: "Rocket",
      mobile_banking: "Mobile Banking",
      sslcommerz: "SSLCommerz",
    };
    return methods[method] || "Not specified";
  };

  const handleMakePayment = (bookingId) => {
    navigate(`/dashboard/payments/${bookingId}`);
  };

  const downloadInvoice = async (paymentId) => {
    const normalizedPaymentId = String(paymentId).replace(/^payment-/, "");

    setDownloadingId(paymentId);
    setInvoiceError("");
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://127.0.0.1:8000/api/payments/${normalizedPaymentId}/invoice`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${normalizedPaymentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading invoice:", err);
      const status = err?.response?.status;
      const rawData = err?.response?.data;

      if (status === 401) {
        setInvoiceError("Your session has expired. Please login again.");
      } else if (status === 403) {
        setInvoiceError("You don't have permission to download this invoice.");
      } else if (rawData instanceof Blob) {
        try {
          const errorText = await rawData.text();
          setInvoiceError(errorText || "Invoice download failed.");
        } catch {
          setInvoiceError("Invoice download failed.");
        }
      } else {
        setInvoiceError("Invoice download failed.");
      }
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {bannerMessage ? (
        <div
          className={`mb-6 rounded-xl border px-4 py-3 text-sm font-medium ${
            paymentBanner === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-amber-200 bg-amber-50 text-amber-700"
          }`}
        >
          {bannerMessage}
        </div>
      ) : null}

      {invoiceError ? (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {invoiceError}
        </div>
      ) : null}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Payment History
        </h1>
        <p className="text-gray-600">
          View and manage all your rental payments
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-linear-to-br from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-700 text-sm font-medium">Total Paid</p>
              <p className="text-3xl font-bold text-emerald-900 mt-2">
                ৳{stats.totalPaid.toLocaleString()}
              </p>
              <p className="text-emerald-700 text-xs mt-1">All time</p>
            </div>
            <div className="bg-white rounded-full p-3">
              <DollarSign size={32} className="text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-linear-to-br from-amber-50 to-amber-100 rounded-lg border border-amber-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-700 text-sm font-medium">
                Pending Payments
              </p>
              <p className="text-3xl font-bold text-amber-900 mt-2">
                ৳{stats.pendingPayments.toLocaleString()}
              </p>
              <p className="text-amber-700 text-xs mt-1">Due soon</p>
            </div>
            <div className="bg-white rounded-full p-3">
              <Calendar size={32} className="text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-700 text-sm font-medium">
                Next Payment Due
              </p>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                {stats.nextPaymentDue} days
              </p>
              <p className="text-blue-700 text-xs mt-1">Make payment on time</p>
            </div>
            <div className="bg-white rounded-full p-3">
              <CreditCard size={32} className="text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex gap-2 flex-wrap">
            {["all", "paid", "pending"].map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterStatus(filter)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize flex items-center gap-2 ${
                  filterStatus === filter
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Filter size={16} />
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Payment History Table */}
      {loading ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-600">Loading payment history...</p>
        </div>
      ) : filteredPayments.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <CreditCard size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No payments yet
          </h3>
          <p className="text-gray-600">
            Your payment history will appear here once you make bookings and
            complete payments.
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
                    Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Payment Method
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
                {filteredPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {payment.propertyTitle}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {payment.ownerName}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-emerald-600">
                      ৳{payment.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {payment.dueDate.toLocaleDateString("en-US")}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {getMethodLabel(payment.method)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          payment.status,
                        )}`}
                      >
                        {payment.status === "paid" ? "✓ Paid" : "⏳ Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {payment.status === "pending" ? (
                        <button
                          onClick={() => handleMakePayment(payment.bookingId)}
                          className="text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          Pay Now
                        </button>
                      ) : (
                        <button
                          onClick={() => downloadInvoice(payment.id)}
                          disabled={downloadingId === payment.id}
                          className={`text-sm font-medium flex items-center gap-1 transition ${
                            downloadingId === payment.id
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-blue-600 hover:text-blue-800"
                          }`}
                        >
                          <Download size={14} />
                          {downloadingId === payment.id
                            ? "Downloading..."
                            : "Invoice"}
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

      {/* Payment Methods Info */}
      <div className="mt-8 bg-indigo-50 border border-indigo-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-indigo-900 mb-3">
          💳 Secure Payment Methods
        </h3>
        <p className="text-indigo-800 text-sm mb-4">
          We accept multiple payment methods for your convenience. All payments
          are secure and encrypted.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            "bKash",
            "Nagad",
            "Rocket",
            "Visa Card",
            "MasterCard",
            "Mobile Banking",
          ].map((method) => (
            <div
              key={method}
              className="bg-white rounded-lg p-3 border border-indigo-100 text-center"
            >
              <p className="text-sm font-medium text-gray-900">{method}</p>
              <p className="text-xs text-gray-600 mt-1">Instant</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
