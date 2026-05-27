import {
  CreditCard,
  DollarSign,
  Package,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import adminService from "../../../utils/adminService";

const RevenueAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [revenue, setRevenue] = useState({
    totalRevenue: 0,
    totalAdminCommission: 0,
    totalOwnerPayments: 0,
    totalRefundAmount: 0,
    monthlyRevenue: 0,
    totalSuccessfulPayments: 0,
    totalFailedPayments: 0,
    totalCancelledBookings: 0,
    admin_commission_rate: 5,
    owner_earning_rate: 95,
    recentTransactions: [],
  });
  const [filterStatus, setFilterStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      try {
        const revStats = await adminService.fetchRevenueStats();

        if (!active) return;

        setRevenue({
          totalRevenue: Number(
            revStats.totalRevenue ?? revStats.total_revenue ?? 0,
          ),
          totalAdminCommission: Number(
            revStats.totalAdminCommission ?? revStats.admin_commission ?? 0,
          ),
          totalOwnerPayments: Number(
            revStats.totalOwnerPayments ?? revStats.owner_earnings ?? 0,
          ),
          totalRefundAmount: Number(
            revStats.totalRefundAmount ??
              revStats.cancellation_refund_amount ??
              0,
          ),
          monthlyRevenue: Number(revStats.monthlyRevenue ?? 0),
          totalSuccessfulPayments: Number(
            revStats.totalSuccessfulPayments ??
              revStats.total_completed_payments ??
              0,
          ),
          totalFailedPayments: Number(revStats.totalFailedPayments ?? 0),
          totalCancelledBookings: Number(
            revStats.totalCancelledBookings ??
              revStats.total_cancelled_bookings ??
              0,
          ),
          admin_commission_rate: Number(revStats.admin_commission_rate ?? 5),
          owner_earning_rate: Number(revStats.owner_earning_rate ?? 95),
          recentTransactions: Array.isArray(revStats.recentTransactions)
            ? revStats.recentTransactions
            : [],
        });
      } catch (err) {
        console.error("Error fetching revenue data:", err);
        setErrorMessage("Failed to load revenue statistics");
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

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

  const getStatusBadge = (status) => {
    const statusStyles = {
      completed: "bg-emerald-100 text-emerald-700",
      pending: "bg-yellow-100 text-yellow-700",
      failed: "bg-red-100 text-red-700",
      refunded: "bg-gray-100 text-gray-700",
    };

    return statusStyles[status] || "bg-gray-100 text-gray-700";
  };

  const cards = [
    {
      title: "Total Revenue",
      value: formatCurrency(revenue.totalRevenue),
      helper: "Completed payments + refund commission",
      icon: <DollarSign size={24} />,
      tone: "blue",
    },
    {
      title: "Total Admin Earnings",
      value: formatCurrency(revenue.totalAdminCommission),
      helper: `${revenue.admin_commission_rate}% commission + refund share`,
      icon: <TrendingUp size={24} />,
      tone: "orange",
    },
    {
      title: "Total Owner Payout",
      value: formatCurrency(revenue.totalOwnerPayments),
      helper: `${revenue.owner_earning_rate}% owner share`,
      icon: <Package size={24} />,
      tone: "green",
    },
    {
      title: "Total Refund Amount",
      value: formatCurrency(revenue.totalRefundAmount),
      helper: "90% tenant refund total",
      icon: <XCircle size={24} />,
      tone: "sky",
    },
    {
      title: "Monthly Revenue",
      value: formatCurrency(revenue.monthlyRevenue),
      helper: "Current month revenue",
      icon: <DollarSign size={24} />,
      tone: "purple",
    },
    {
      title: "Successful Payments",
      value: String(revenue.totalSuccessfulPayments),
      helper: "Completed transactions",
      icon: <CreditCard size={24} />,
      tone: "emerald",
    },
    {
      title: "Failed Payments",
      value: String(revenue.totalFailedPayments),
      helper: "Gateway or validation failures",
      icon: <XCircle size={24} />,
      tone: "rose",
    },
    {
      title: "Cancelled Bookings",
      value: String(revenue.totalCancelledBookings),
      helper: "Processed cancellations",
      icon: <Package size={24} />,
      tone: "slate",
    },
  ];

  const cardToneClasses = {
    blue: "bg-blue-100 text-blue-600",
    orange: "bg-orange-100 text-orange-600",
    green: "bg-green-100 text-green-600",
    sky: "bg-sky-100 text-sky-600",
    purple: "bg-purple-100 text-purple-600",
    emerald: "bg-emerald-100 text-emerald-600",
    rose: "bg-rose-100 text-rose-600",
    slate: "bg-slate-100 text-slate-600",
  };

  const recentTransactions = revenue.recentTransactions.filter(
    (transaction) => {
      if (!filterStatus) return true;
      return transaction.payment_status === filterStatus;
    },
  );

  return (
    <div className="w-full space-y-8">
      <div className="mb-2 pb-6 border-b border-gray-200">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Revenue Analytics
        </h1>
        <p className="text-gray-600">
          Live revenue, payment, booking, and refund data from the backend
        </p>
      </div>

      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {errorMessage}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-gray-600 shadow-sm">
          Loading revenue data...
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
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
      )}

      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-100 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Recent Transactions
            </h3>
            <p className="text-sm text-gray-500">
              Latest payment and refund activity from the database
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-600">Filter:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>

        {recentTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Tenant Name</th>
                  <th className="px-6 py-4">Property</th>
                  <th className="px-6 py-4">Payment Amount</th>
                  <th className="px-6 py-4">Admin Commission</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50/60">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {transaction.transaction_id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {transaction.tenant_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {transaction.property_name}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {formatCurrency(transaction.payment_amount)}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-orange-600">
                      {formatCurrency(transaction.admin_commission)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadge(
                          transaction.payment_status,
                        )}`}
                      >
                        {transaction.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(transaction.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12 text-center text-gray-500">
            No transaction data found.
          </div>
        )}
      </div>
    </div>
  );
};

export default RevenueAnalytics;
