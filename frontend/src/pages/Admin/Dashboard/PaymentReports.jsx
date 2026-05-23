import axios from "axios";
import {
  BarChart3,
  Check,
  DollarSign,
  Download,
  Loader2,
  RotateCcw,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import adminService from "../../../utils/adminService";

const PaymentReports = () => {
  const [paymentData, setPaymentData] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    thisMonthRevenue: 0,
    pendingAmount: 0,
    totalTransactions: 0,
  });
  const [cancelledBookings, setCancelledBookings] = useState([]);
  const [cancelStats, setCancelStats] = useState({
    cancelledBookings: 0,
    processedRefunds: 0,
    refundTotal: 0,
    adminShareTotal: 0,
  });
  const [loading, setLoading] = useState(true);
  const [downloadingReport, setDownloadingReport] = useState(false);
  const [downloadingRefundId, setDownloadingRefundId] = useState(null);

  useEffect(() => {
    let active = true;

    const loadPaymentData = async () => {
      setLoading(true);
      try {
        const [payments, refunds] = await Promise.all([
          adminService.fetchPaymentsAdmin(),
          adminService.fetchAdminCancelledBookings(),
        ]);
        if (!active) return;

        // payments may be an array of objects coming from backend
        const normalized = (Array.isArray(payments) ? payments : []).map(
          (p) => ({
            id: p.id,
            property:
              p.property?.title ||
              p.property_name ||
              p.property ||
              p.propertyTitle ||
              "-",
            owner: p.owner?.name || p.owner_name || p.owner || "-",
            amount: Number(p.total_payment || p.amount || p.price || 0),
            method: p.payment_method || p.method || p.gateway || "-",
            date: p.booking_date
              ? new Date(p.booking_date)
              : p.date
                ? new Date(p.date)
                : new Date(),
            status:
              p.payment_status || p.status || (p.paid ? "paid" : "pending"),
          }),
        );

        setPaymentData(normalized);

        const total = normalized.reduce(
          (sum, p) => sum + (Number(p.amount) || 0),
          0,
        );
        const thisMonth = normalized
          .filter(
            (p) =>
              p.date.getMonth() === new Date().getMonth() &&
              p.date.getFullYear() === new Date().getFullYear() &&
              p.status === "paid",
          )
          .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
        const pending = normalized
          .filter((p) => p.status === "pending")
          .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

        setStats({
          totalRevenue: total,
          thisMonthRevenue: thisMonth || 0,
          pendingAmount: pending,
          totalTransactions: normalized.length,
        });

        const refundRows = Array.isArray(refunds) ? refunds : [];
        const processedRefundRows = refundRows.filter(
          (refund) => refund.refund_status === "processed",
        );
        setCancelledBookings(refundRows);
        setCancelStats({
          cancelledBookings: refundRows.length,
          processedRefunds: processedRefundRows.length,
          refundTotal: refundRows.reduce(
            (sum, refund) => sum + Number(refund.refund_amount || 0),
            0,
          ),
          adminShareTotal: refundRows.reduce(
            (sum, refund) => sum + Number(refund.admin_share || 0),
            0,
          ),
        });
      } catch (err) {
        console.error("Failed to load payment data:", err);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadPaymentData();

    return () => {
      active = false;
    };
  }, []);

  const getMethodColor = (method) => {
    switch (method) {
      case "Bank Transfer":
        return "text-blue-600 bg-blue-100";
      case "Bkash":
        return "text-pink-600 bg-pink-100";
      case "Nagad":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

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

  const handleDownloadRefundPdf = async (bookingId) => {
    if (!bookingId) return;

    setDownloadingRefundId(bookingId);

    try {
      const token =
        localStorage.getItem("access_token") || localStorage.getItem("token");
      const response = await axios.get(
        `http://127.0.0.1:8000/api/bookings/${bookingId}/refund-pdf`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        },
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `refund-booking-${bookingId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download refund PDF:", err);
    } finally {
      setDownloadingRefundId(null);
    }
  };

  const downloadPDFReport = async () => {
    setDownloadingReport(true);

    try {
      const response = await adminService.downloadAdminReportPdf();
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      const now = new Date();
      const fileDate = now.toISOString().slice(0, 10);
      link.href = url;
      link.setAttribute("download", `bashaLagbe-admin-report-${fileDate}.pdf`);

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      const backendMessage = err?.response?.data?.message;
      alert(backendMessage || "Failed to download PDF report.");
    } finally {
      setDownloadingReport(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Payment Reports
        </h1>
        <p className="text-gray-600">
          System-wide payment analytics and revenue tracking
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-700 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                ৳{stats.totalRevenue.toLocaleString()}
              </p>
              <p className="text-blue-600 text-xs mt-2">All-time</p>
            </div>
            <DollarSign size={32} className="text-blue-300" />
          </div>
        </div>

        <div className="bg-linear-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-700 text-sm font-medium">This Month</p>
              <p className="text-3xl font-bold text-green-900 mt-2">
                ৳{stats.thisMonthRevenue.toLocaleString()}
              </p>
              <p className="text-green-600 text-xs mt-2">Current month</p>
            </div>
            <TrendingUp size={32} className="text-green-300" />
          </div>
        </div>

        <div className="bg-linear-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-700 text-sm font-medium">
                Pending Amount
              </p>
              <p className="text-3xl font-bold text-yellow-900 mt-2">
                ৳{stats.pendingAmount.toLocaleString()}
              </p>
              <p className="text-yellow-600 text-xs mt-2">Awaiting payment</p>
            </div>
            <BarChart3 size={32} className="text-yellow-300" />
          </div>
        </div>

        <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-700 text-sm font-medium">
                Transactions
              </p>
              <p className="text-3xl font-bold text-purple-900 mt-2">
                {stats.totalTransactions}
              </p>
              <p className="text-purple-600 text-xs mt-2">Total count</p>
            </div>
            <DollarSign size={32} className="text-purple-300" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-linear-to-br from-rose-50 to-rose-100 rounded-lg border border-rose-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-rose-700 text-sm font-medium">
                Cancelled Bookings
              </p>
              <p className="text-3xl font-bold text-rose-900 mt-2">
                {cancelStats.cancelledBookings}
              </p>
            </div>
            <XCircle size={32} className="text-rose-300" />
          </div>
        </div>

        <div className="bg-linear-to-br from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-700 text-sm font-medium">
                Refund Window Processed
              </p>
              <p className="text-3xl font-bold text-emerald-900 mt-2">
                {cancelStats.processedRefunds}
              </p>
            </div>
            <Check size={32} className="text-emerald-300" />
          </div>
        </div>

        <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-700 text-sm font-medium">Refund Total</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                {formatCurrency(cancelStats.refundTotal)}
              </p>
            </div>
            <RotateCcw size={32} className="text-blue-300" />
          </div>
        </div>

        <div className="bg-linear-to-br from-amber-50 to-amber-100 rounded-lg border border-amber-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-700 text-sm font-medium">Admin Share</p>
              <p className="text-3xl font-bold text-amber-900 mt-2">
                {formatCurrency(cancelStats.adminShareTotal)}
              </p>
            </div>
            <TrendingUp size={32} className="text-amber-300" />
          </div>
        </div>
      </div>

      {/* Export Button */}
      <div className="mb-6">
        <button
          onClick={downloadPDFReport}
          disabled={downloadingReport}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Download size={18} />
          {downloadingReport ? "Downloading..." : "Download Report (PDF)"}
        </button>
      </div>

      {/* Payment Method Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Payment Method Distribution
          </h3>
          <div className="space-y-3">
            {[
              { method: "Bank Transfer", percentage: 45, amount: 90000 },
              { method: "Bkash", percentage: 35, amount: 70000 },
              { method: "Nagad", percentage: 20, amount: 40000 },
            ].map((item) => (
              <div key={item.method}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {item.method}
                  </span>
                  <span className="text-sm text-gray-600">
                    ৳{item.amount.toLocaleString()} ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Monthly Revenue Trend
          </h3>
          <div className="space-y-2">
            {[
              { month: "January", revenue: 45000 },
              { month: "February", revenue: 52000 },
              { month: "March", revenue: 48000 },
              { month: "April", revenue: 60000 },
              { month: "May", revenue: 50000 },
            ].map((item) => (
              <div
                key={item.month}
                className="flex items-center justify-between"
              >
                <span className="text-sm font-medium text-gray-700">
                  {item.month}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-green-500 h-1.5 rounded-full"
                      style={{ width: `${(item.revenue / 60000) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-20 text-right">
                    ৳{item.revenue.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Payments Table */}
      {loading ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-600">Loading payment data...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Recent Payments</h3>
          </div>
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
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paymentData.map((payment) => (
                  <tr
                    key={payment.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {payment.property}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {payment.owner}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      ৳{payment.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getMethodColor(
                          payment.method,
                        )}`}
                      >
                        {payment.method}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {payment.date.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          payment.status === "paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-8 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">
            Cancelled Bookings & Refunds
          </h3>
        </div>

        {cancelledBookings.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No cancelled bookings found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Tenant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Cancelled
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Refund Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Admin Share
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    PDF
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cancelledBookings.map((refund) => (
                  <tr
                    key={refund.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="font-medium">
                        {refund.tenant_name || "Tenant"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {refund.tenant_email || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="font-medium">
                        {refund.owner_name || "Owner"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {refund.owner_email || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="font-medium">
                        {refund.property_title || "Property"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {refund.property_location || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {formatDate(refund.cancelled_at)}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-emerald-700">
                      {formatCurrency(refund.refund_amount)}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-amber-700">
                      {formatCurrency(refund.admin_share)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        type="button"
                        onClick={() =>
                          handleDownloadRefundPdf(refund.booking_id)
                        }
                        disabled={downloadingRefundId === refund.booking_id}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {downloadingRefundId === refund.booking_id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Download size={16} />
                        )}
                        {downloadingRefundId === refund.booking_id
                          ? "Downloading"
                          : "PDF"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentReports;
