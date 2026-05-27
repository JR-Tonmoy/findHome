import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  DollarSign,
  Download,
  Eye,
  Filter,
  Loader2,
  Package,
  Search,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import adminService from "../../../utils/adminService";

const DEFAULT_SUMMARY = {
  totalRevenue: 0,
  totalAdminCommission: 0,
  totalOwnerPayments: 0,
  totalRefundAmount: 0,
  monthlyRevenue: 0,
  totalPayments: 0,
  totalSuccessfulPayments: 0,
  totalPendingPayments: 0,
  totalFailedPayments: 0,
  totalRefundedPayments: 0,
  totalCancelledBookings: 0,
  adminCommissionRate: 5,
  ownerEarningRate: 95,
};

const cardToneClasses = {
  blue: "bg-blue-100 text-blue-600",
  orange: "bg-orange-100 text-orange-600",
  green: "bg-green-100 text-green-600",
  sky: "bg-sky-100 text-sky-600",
  purple: "bg-purple-100 text-purple-600",
  emerald: "bg-emerald-100 text-emerald-600",
  rose: "bg-rose-100 text-rose-600",
  slate: "bg-slate-100 text-slate-600",
  amber: "bg-amber-100 text-amber-600",
};

const PaymentReports = () => {
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState(DEFAULT_SUMMARY);
  const [pagination, setPagination] = useState({
    total: 0,
    per_page: 10,
    current_page: 1,
    last_page: 1,
  });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [refundStatus, setRefundStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [downloadingInvoiceId, setDownloadingInvoiceId] = useState(null);

  useEffect(() => {
    let active = true;
    const timeoutId = setTimeout(async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const payload = await adminService.fetchAdminPayments({
          search: searchTerm,
          payment_status: paymentStatus,
          refund_status: refundStatus,
          from: fromDate,
          to: toDate,
          page: currentPage,
          per_page: 10,
        });

        if (!active) return;

        const nextSummary = payload?.summary || payload?.stats || payload || {};
        const nextPayments = Array.isArray(payload?.payments)
          ? payload.payments
          : Array.isArray(payload?.data)
            ? payload.data
            : [];
        const nextPagination = payload?.pagination || {
          total: nextPayments.length,
          per_page: 10,
          current_page: 1,
          last_page: 1,
        };

        setSummary({
          ...DEFAULT_SUMMARY,
          ...nextSummary,
        });
        setPayments(nextPayments);
        setPagination(nextPagination);

        if (selectedPayment) {
          const refreshedSelection = nextPayments.find(
            (payment) =>
              String(payment.payment_id ?? payment.id) ===
              String(selectedPayment.payment_id ?? selectedPayment.id),
          );

          if (refreshedSelection) {
            setSelectedPayment(refreshedSelection);
          }
        }
      } catch (err) {
        if (!active) return;
        console.error("Failed to load payment data:", err);
        setErrorMessage(
          err?.response?.data?.message || "Failed to load payment records.",
        );
        setPayments([]);
        setPagination({
          total: 0,
          per_page: 10,
          current_page: 1,
          last_page: 1,
        });
      } finally {
        if (active) setLoading(false);
      }
    }, 250);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [searchTerm, paymentStatus, refundStatus, fromDate, toDate, currentPage]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(Number(amount || 0));

  const formatDate = (value) => {
    if (!value) return "-";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDisplayStatus = (payment) => {
    const bookingStatus = String(payment?.booking_status || "").toLowerCase();
    if (bookingStatus === "cancelled") return "cancelled";
    return String(payment?.payment_status || "pending").toLowerCase();
  };

  const getStatusBadge = (status) => {
    switch (String(status || "").toLowerCase()) {
      case "completed":
        return "bg-emerald-100 text-emerald-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "failed":
        return "bg-red-100 text-red-700";
      case "refunded":
        return "bg-blue-100 text-blue-700";
      case "cancelled":
        return "bg-gray-100 text-gray-700";
      case "processed":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const summaryCards = [
    {
      title: "Total Payments",
      value: String(summary.totalPayments || payments.length || 0),
      helper: "All payment records",
      icon: <CreditCard size={24} />,
      tone: "amber",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(summary.totalRevenue),
      helper: "Completed payments + refund commission",
      icon: <DollarSign size={24} />,
      tone: "blue",
    },
    {
      title: "Admin Earnings",
      value: formatCurrency(summary.totalAdminCommission),
      helper: `${summary.adminCommissionRate || 5}% commission + refunds`,
      icon: <TrendingUp size={24} />,
      tone: "orange",
    },
    {
      title: "Owner Payout",
      value: formatCurrency(summary.totalOwnerPayments),
      helper: `${summary.ownerEarningRate || 95}% owner share`,
      icon: <Package size={24} />,
      tone: "green",
    },
    {
      title: "Refund Amount",
      value: formatCurrency(summary.totalRefundAmount),
      helper: "Cancelled booking refunds",
      icon: <XCircle size={24} />,
      tone: "sky",
    },
    {
      title: "Monthly Revenue",
      value: formatCurrency(summary.monthlyRevenue),
      helper: "Current month earnings",
      icon: <CalendarDays size={24} />,
      tone: "purple",
    },
    {
      title: "Successful Payments",
      value: String(summary.totalSuccessfulPayments || 0),
      helper: "Completed transactions",
      icon: <CreditCard size={24} />,
      tone: "emerald",
    },
    {
      title: "Failed Payments",
      value: String(summary.totalFailedPayments || 0),
      helper: "Payment failures",
      icon: <XCircle size={24} />,
      tone: "rose",
    },
    {
      title: "Cancelled Bookings",
      value: String(summary.totalCancelledBookings || 0),
      helper: "Refunded cancellations",
      icon: <Filter size={24} />,
      tone: "slate",
    },
  ];

  const visiblePages = () => {
    const totalPages = Math.max(1, Number(pagination.last_page || 1));

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pages = [1];
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    if (startPage > 2) pages.push("start-ellipsis");

    for (let page = startPage; page <= endPage; page += 1) {
      pages.push(page);
    }

    if (endPage < totalPages - 1) pages.push("end-ellipsis");

    pages.push(totalPages);
    return pages;
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setPaymentStatus("");
    setRefundStatus("");
    setFromDate("");
    setToDate("");
    setCurrentPage(1);
  };

  const handleDownloadInvoice = async (payment) => {
    const paymentId = payment?.payment_id ?? payment?.id;
    if (!paymentId) return;

    setDownloadingInvoiceId(paymentId);

    try {
      const response =
        await adminService.downloadAdminPaymentInvoice(paymentId);
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${paymentId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download invoice:", err);
      alert(err?.response?.data?.message || "Failed to download invoice.");
    } finally {
      setDownloadingInvoiceId(null);
    }
  };

  const totalPages = Math.max(1, Number(pagination.last_page || 1));

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-col gap-3 border-b border-gray-200 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Payment Reports
          </h1>
          <p className="text-gray-600">
            Live payment history, refunds, owner payouts, and invoice tracking
            from the database.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 shadow-sm">
          Total payments:{" "}
          <span className="font-semibold text-gray-900">
            {summary.totalPayments || payments.length || 0}
          </span>
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {summaryCards.map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <div className="mb-4 flex items-center justify-between">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${cardToneClasses[card.tone]}`}
              >
                {card.icon}
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {card.value}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-gray-700">
              {card.title}
            </h3>
            <p className="mt-1 text-xs text-gray-400">{card.helper}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-100 p-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
            <div className="relative xl:col-span-2">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setCurrentPage(1);
                  setSearchTerm(e.target.value);
                }}
                placeholder="Search by tenant, owner, property, or transaction..."
                className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <select
              value={paymentStatus}
              onChange={(e) => {
                setCurrentPage(1);
                setPaymentStatus(e.target.value);
              }}
              className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Payment Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={refundStatus}
              onChange={(e) => {
                setCurrentPage(1);
                setRefundStatus(e.target.value);
              }}
              className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Refunds</option>
              <option value="refunded">Refunded</option>
              <option value="not_refunded">Not Refunded</option>
            </select>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setCurrentPage(1);
                  setFromDate(e.target.value);
                }}
                className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <input
                type="date"
                value={toDate}
                onChange={(e) => {
                  setCurrentPage(1);
                  setToDate(e.target.value);
                }}
                className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <Filter size={16} />
            Clear Filters
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 p-12 text-gray-500">
            <Loader2 size={28} className="animate-spin text-blue-600" />
            Loading payment records...
          </div>
        ) : payments.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No payment records found.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-6 py-4">SL</th>
                    <th className="px-6 py-4">Tenant</th>
                    <th className="px-6 py-4">Owner</th>
                    <th className="px-6 py-4">Property</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Admin Earnings</th>
                    <th className="px-6 py-4">Payment Status</th>
                    <th className="px-6 py-4">Refund Status</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {payments.map((payment, index) => {
                    const displayStatus = getDisplayStatus(payment);
                    const paymentId = payment.payment_id ?? payment.id;

                    return (
                      <tr key={paymentId} className="hover:bg-gray-50/70">
                        <td className="px-6 py-4 text-sm font-semibold text-gray-500">
                          {(pagination.current_page - 1) * pagination.per_page +
                            index +
                            1}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          <div className="font-medium text-gray-900">
                            {payment.tenant_name || "N/A"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {payment.tenant_email || "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          <div className="font-medium text-gray-900">
                            {payment.owner_name || "N/A"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {payment.owner_email || "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100 ring-1 ring-gray-100">
                              {payment.property_image ? (
                                <img
                                  src={payment.property_image}
                                  alt={payment.property_title || "Property"}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <Package size={18} className="text-gray-400" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="truncate font-medium text-gray-900">
                                {payment.property_title || "N/A"}
                              </div>
                              <div className="truncate text-xs text-gray-500">
                                {payment.booking?.property?.location || "-"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                          {formatCurrency(payment.payment_amount)}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-orange-600">
                          {formatCurrency(payment.admin_commission)}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadge(displayStatus)}`}
                          >
                            {displayStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadge(payment.refund_status)}`}
                          >
                            {payment.refund_status || "none"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDate(payment.payment_date)}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            type="button"
                            onClick={() => setSelectedPayment(payment)}
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                          >
                            <Eye size={16} />
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 border-t border-gray-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-600">
                Showing {payments.length} of{" "}
                {pagination.total || payments.length} records
              </p>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((page) => Math.max(1, page - 1))
                  }
                  className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-300"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {visiblePages().map((page, index) =>
                    typeof page === "number" ? (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold transition ${currentPage === page ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}
                      >
                        {page}
                      </button>
                    ) : (
                      <span
                        key={`${page}-${index}`}
                        className="px-2 text-gray-400"
                      >
                        ...
                      </span>
                    ),
                  )}
                </div>

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((page) => Math.min(totalPages, page + 1))
                  }
                  className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-300"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Payment Details
                </h3>
                <p className="text-sm text-gray-500">
                  Transaction{" "}
                  {selectedPayment.transaction_id || selectedPayment.payment_id}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPayment(null)}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Close
              </button>
            </div>

            <div className="grid gap-6 p-6 lg:grid-cols-2">
              <div className="space-y-6">
                <div className="rounded-2xl border border-gray-100 p-5">
                  <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
                    Payment Info
                  </h4>
                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500">Transaction ID</span>
                      <span className="font-medium text-gray-900">
                        {selectedPayment.transaction_id ||
                          selectedPayment.payment_id}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500">Payment Amount</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(selectedPayment.payment_amount)}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500">Admin Earnings</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(selectedPayment.admin_commission)}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500">Payment Method</span>
                      <span className="font-medium text-gray-900">
                        {selectedPayment.payment_method || "-"}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500">Payment Status</span>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadge(getDisplayStatus(selectedPayment))}`}
                      >
                        {getDisplayStatus(selectedPayment)}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500">Payment Date</span>
                      <span className="font-medium text-gray-900">
                        {formatDate(selectedPayment.payment_date)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-100 p-5">
                  <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
                    Tenant & Owner
                  </h4>
                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500">Tenant</span>
                      <span className="font-medium text-gray-900">
                        {selectedPayment.tenant_name || "-"}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500">Tenant Email</span>
                      <span className="font-medium text-gray-900">
                        {selectedPayment.tenant_email || "-"}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500">Owner</span>
                      <span className="font-medium text-gray-900">
                        {selectedPayment.owner_name || "-"}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500">Owner Email</span>
                      <span className="font-medium text-gray-900">
                        {selectedPayment.owner_email || "-"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl border border-gray-100 p-5">
                  <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
                    Booking & Property
                  </h4>
                  <div className="mb-4 flex items-start gap-4 rounded-xl bg-gray-50 p-4">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-gray-100">
                      {selectedPayment.property_image ? (
                        <img
                          src={selectedPayment.property_image}
                          alt={selectedPayment.property_title || "Property"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Package size={24} className="text-gray-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h5 className="truncate font-semibold text-gray-900">
                        {selectedPayment.property_title || "Property"}
                      </h5>
                      <p className="text-sm text-gray-600">
                        {selectedPayment.booking?.property?.location || "-"}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Booking status: {selectedPayment.booking_status || "-"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500">Booking ID</span>
                      <span className="font-medium text-gray-900">
                        {selectedPayment.booking_id || "-"}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500">Move-in Date</span>
                      <span className="font-medium text-gray-900">
                        {formatDate(selectedPayment.booking?.move_in_date)}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500">Duration</span>
                      <span className="font-medium text-gray-900">
                        {selectedPayment.booking?.duration || "-"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-100 p-5">
                  <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
                    Refund Info
                  </h4>
                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500">Refund Status</span>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadge(selectedPayment.refund_status)}`}
                      >
                        {selectedPayment.refund_status || "none"}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500">Refund Amount</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(selectedPayment.refund_amount)}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500">Owner Share</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(
                          selectedPayment.owner_share_refund ||
                            selectedPayment.owner_share,
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500">Admin Share</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(selectedPayment.admin_share)}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500">Cancelled At</span>
                      <span className="font-medium text-gray-900">
                        {formatDate(selectedPayment.booking?.cancelled_at)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDownloadInvoice(selectedPayment)}
                  disabled={
                    downloadingInvoiceId ===
                    (selectedPayment.payment_id ?? selectedPayment.id)
                  }
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {downloadingInvoiceId ===
                  (selectedPayment.payment_id ?? selectedPayment.id) ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Download size={18} />
                  )}
                  Download Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 border-t border-gray-100 pt-2 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
        <p>
          Page {pagination.current_page || 1} of {pagination.last_page || 1}
        </p>
        <p>
          Showing {payments.length} records from{" "}
          {pagination.total || payments.length} total payments
        </p>
      </div>
    </div>
  );
};

export default PaymentReports;
