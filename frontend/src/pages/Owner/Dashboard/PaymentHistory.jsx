import {
  Calendar,
  CreditCard,
  Download,
  DollarSign,
  Filter,
  TrendingUp,
  Check,
  Clock,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import {
  fetchOwnerProperties,
  fetchPayments,
} from "../../../utils/notificationService";

const OwnerPaymentHistory = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [downloadingId, setDownloadingId] = useState(null);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    adminCommission: 0,
    completedPayments: 0,
  });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

  // Load owner payments
  useEffect(() => {
    const loadOwnerPayments = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        
        // Fetch all payments for admin view, then filter for owner
        const response = await fetch(`${API_URL}/v1/payments?per_page=100`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            // Filter payments where user is the property owner
            const ownerPayments = (result.data || []).filter(
              (payment) => payment.property?.user_id === user?.id
            );

            setPayments(ownerPayments);

            // Calculate stats
            const completed = ownerPayments.filter(
              (p) => p.payment_status === "completed"
            );
            const totalEarnings = completed.reduce(
              (sum, p) => sum + (Number(p.owner_earning) || 0),
              0
            );
            const adminCommission = completed.reduce(
              (sum, p) => sum + (Number(p.admin_commission) || 0),
              0
            );

            setStats({
              totalEarnings,
              adminCommission,
              completedPayments: completed.length,
            });
          }
        }
      } catch (err) {
        console.error("Error loading payments:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      loadOwnerPayments();
    }
  }, [user?.id, API_URL]);

  // Filter payments by status
  const filteredPayments = useMemo(() => {
    if (filterStatus === "all") {
      return payments;
    }
    return payments.filter((p) => p.payment_status === filterStatus);
  }, [payments, filterStatus]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Pending";
    return new Date(dateString).toLocaleDateString("en-BD", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      completed:
        "bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-2",
      pending:
        "bg-yellow-50 text-yellow-700 border border-yellow-200 flex items-center gap-2",
      failed:
        "bg-red-50 text-red-700 border border-red-200 flex items-center gap-2",
      cancelled:
        "bg-gray-50 text-gray-700 border border-gray-200 flex items-center gap-2",
    };
    return styles[status] || styles.pending;
  };

  const handleDownloadInvoice = async (paymentId) => {
    setDownloadingId(paymentId);
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `${API_URL}/v1/invoices/${paymentId}/download`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `invoice_${paymentId}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else if (response.status === 401) {
        alert("Your session has expired. Please login again.");
      } else if (response.status === 403) {
        alert("You don't have permission to download this invoice.");
      } else {
        const errorText = await response.text();
        alert("Failed to download invoice: " + errorText);
      }
    } catch (err) {
      console.error("Error downloading invoice:", err);
      alert("Error downloading invoice. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-gray-200">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Payment History
        </h1>
        <p className="text-gray-600">
          Track all payments received from tenants and your earnings
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Earnings */}
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-600 text-sm font-medium mb-1">
                Total Earnings (80%)
              </p>
              <p className="text-3xl font-bold text-emerald-700">
                {formatCurrency(stats.totalEarnings)}
              </p>
              <p className="text-xs text-emerald-600 mt-2">
                From {stats.completedPayments} completed payments
              </p>
            </div>
            <TrendingUp className="w-12 h-12 text-emerald-300" />
          </div>
        </div>

        {/* Admin Commission Info */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium mb-1">
                Admin Commission (20%)
              </p>
              <p className="text-3xl font-bold text-blue-700">
                {formatCurrency(stats.adminCommission)}
              </p>
              <p className="text-xs text-blue-600 mt-2">Platform charges</p>
            </div>
            <DollarSign className="w-12 h-12 text-blue-300" />
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium mb-1">
                Total Platform Revenue
              </p>
              <p className="text-3xl font-bold text-purple-700">
                {formatCurrency(stats.totalEarnings + stats.adminCommission)}
              </p>
              <p className="text-xs text-purple-600 mt-2">
                All completed payments
              </p>
            </div>
            <CreditCard className="w-12 h-12 text-purple-300" />
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={() => setFilterStatus("all")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filterStatus === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All Payments
        </button>
        <button
          onClick={() => setFilterStatus("completed")}
          className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
            filterStatus === "completed"
              ? "bg-emerald-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <Check size={16} /> Completed
        </button>
        <button
          onClick={() => setFilterStatus("pending")}
          className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
            filterStatus === "pending"
              ? "bg-yellow-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <Clock size={16} /> Pending
        </button>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : filteredPayments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No payments found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Property
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Tenant
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                    Total Amount
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                    Your Earnings (80%)
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Transaction ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Payment Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Invoice
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment, idx) => (
                  <tr
                    key={payment.id}
                    className={`${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } border-b border-gray-200 hover:bg-gray-100 transition`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {payment.property_name || "Property"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {payment.tenant_name || "Tenant"}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">
                      {formatCurrency(payment.total_amount)}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-emerald-600 text-right">
                      {formatCurrency(payment.owner_earning)}
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">
                      {payment.transaction_id || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(payment.payment_date)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                          payment.payment_status
                        )}`}
                      >
                        {payment.payment_status === "completed" && (
                          <span className="w-2 h-2 bg-current rounded-full mr-2"></span>
                        )}
                        {payment.payment_status === "pending" && (
                          <span className="w-2 h-2 bg-current rounded-full mr-2"></span>
                        )}
                        {payment.payment_status === "completed"
                          ? "Completed"
                          : payment.payment_status === "pending"
                            ? "Pending"
                            : payment.payment_status === "failed"
                              ? "Failed"
                              : "Cancelled"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {payment.payment_status === "completed" ? (
                        <button
                          onClick={() => handleDownloadInvoice(payment.id)}
                          disabled={downloadingId === payment.id}
                          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                            downloadingId === payment.id
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                          }`}
                          title="Download Invoice"
                        >
                          <Download size={16} />
                          {downloadingId === payment.id ? "Downloading..." : "Invoice"}
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">N/A</span>
                      )}
                    </td>
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">N/A</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
};

export default OwnerPaymentHistory;
