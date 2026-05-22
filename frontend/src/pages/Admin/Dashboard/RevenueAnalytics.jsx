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
  const [stats, setStats] = useState({
    total_booked_houses: 0,
    total_completed_payments: 0,
    total_revenue: 0,
    admin_commission: 0,
    owner_earnings: 0,
    total_cancelled_bookings: 0,
    cancellation_admin_share: 0,
    cancellation_owner_share: 0,
    cancellation_refund_amount: 0,
  });
  const [commissionRates, setCommissionRates] = useState({
    admin: 5,
    owner: 95,
  });
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Load data on component mount
  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      try {
        const revStats = await adminService.fetchRevenueStats();
        const paymentsRes = await adminService.fetchPaymentsAdmin();

        if (!active) return;

        setStats({
          total_booked_houses:
            revStats.total_booked_houses || revStats.total_bookings || 0,
          total_completed_payments:
            revStats.total_completed_payments || revStats.total_payments || 0,
          total_revenue: revStats.total_revenue || revStats.total_revenue || 0,
          admin_commission:
            revStats.admin_commission || revStats.admin_commission || 0,
          owner_earnings:
            revStats.owner_earnings || revStats.owner_earnings || 0,
          total_cancelled_bookings: revStats.total_cancelled_bookings || 0,
          cancellation_admin_share: revStats.cancellation_admin_share || 0,
          cancellation_owner_share: revStats.cancellation_owner_share || 0,
          cancellation_refund_amount: revStats.cancellation_refund_amount || 0,
        });

        const adminRate = Number(revStats.admin_commission_rate ?? 5);
        const ownerRate = Number(
          revStats.owner_earning_rate ?? 100 - adminRate,
        );
        setCommissionRates({
          admin: adminRate,
          owner: ownerRate,
        });

        const normalized = (Array.isArray(paymentsRes) ? paymentsRes : []).map(
          (p) => ({
            id: p.id,
            property_name:
              p.property?.title || p.property_name || p.property || "-",
            tenant_name: p.tenant?.name || p.tenant_name || p.tenant || "-",
            owner_name: p.owner?.name || p.owner_name || p.owner || "-",
            total_payment: Number(p.total_payment || p.amount || p.price || 0),
            admin_commission: Number(p.admin_commission || p.commission || 0),
            owner_earning: Number(p.owner_earning || p.owner_share || 0),
            payment_status: p.payment_status || p.status || "pending",
            booking_date:
              p.booking_date ||
              p.created_at ||
              p.date ||
              new Date().toISOString(),
          }),
        );

        setPayments(normalized);
        setFilteredPayments(normalized);
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

  // Filter payments by status
  useEffect(() => {
    if (filterStatus === "") {
      setFilteredPayments(payments);
    } else {
      setFilteredPayments(
        payments.filter((payment) => payment.payment_status === filterStatus),
      );
    }
  }, [filterStatus, payments]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
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

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="mb-8 pb-6 border-b border-gray-200">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Revenue Analytics
        </h1>
        <p className="text-gray-600">
          Track platform revenue, payments, and commission distribution
        </p>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
          {errorMessage}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        {/* Total Booked Houses */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-lg flex items-center justify-center">
              <Package size={24} />
            </div>
            <span className="text-2xl font-bold text-blue-600">
              {stats.total_booked_houses}
            </span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium">
            Total Booked Houses
          </h3>
          <p className="text-xs text-gray-400 mt-1">Active bookings</p>
        </div>

        {/* Total Completed Payments */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-emerald-100 text-emerald-600 w-12 h-12 rounded-lg flex items-center justify-center">
              <CreditCard size={24} />
            </div>
            <span className="text-2xl font-bold text-emerald-600">
              {stats.total_completed_payments}
            </span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium">
            Completed Payments
          </h3>
          <p className="text-xs text-gray-400 mt-1">Successful transactions</p>
        </div>

        {/* Total Platform Revenue */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-lg flex items-center justify-center">
              <DollarSign size={24} />
            </div>
            <span className="text-xl font-bold text-purple-600">
              {formatCurrency(stats.total_revenue)}
            </span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium">
            Total Platform Revenue
          </h3>
          <p className="text-xs text-gray-400 mt-1">All transactions</p>
        </div>

        {/* Total Admin Commission */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-100 text-orange-600 w-12 h-12 rounded-lg flex items-center justify-center">
              <TrendingUp size={24} />
            </div>
            <span className="text-xl font-bold text-orange-600">
              {formatCurrency(stats.admin_commission)}
            </span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium">
            Admin Commission
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            {commissionRates.admin}% of revenue
          </p>
        </div>

        {/* Total Owner Earnings */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 text-green-600 w-12 h-12 rounded-lg flex items-center justify-center">
              <TrendingUp size={24} />
            </div>
            <span className="text-xl font-bold text-green-600">
              {formatCurrency(stats.owner_earnings)}
            </span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium">Owner Earnings</h3>
          <p className="text-xs text-gray-400 mt-1">
            {commissionRates.owner}% distributed
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-rose-100 text-rose-600 w-12 h-12 rounded-lg flex items-center justify-center">
              <XCircle size={24} />
            </div>
            <span className="text-2xl font-bold text-rose-600">
              {stats.total_cancelled_bookings}
            </span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium">
            Cancelled Bookings
          </h3>
          <p className="text-xs text-gray-400 mt-1">Refund window processed</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-sky-100 text-sky-600 w-12 h-12 rounded-lg flex items-center justify-center">
              <DollarSign size={24} />
            </div>
            <span className="text-xl font-bold text-sky-600">
              {formatCurrency(stats.cancellation_refund_amount)}
            </span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium">Tenant Refunds</h3>
          <p className="text-xs text-gray-400 mt-1">90% refund total</p>
        </div>
      </div>

      {/* Revenue Table Section */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        {/* Table Header with Filter */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-xl font-bold text-gray-900">Payment History</h3>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-600">
                Filter:
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Content */}
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            Loading payment records...
          </div>
        ) : filteredPayments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">
                    Property Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">
                    Tenant Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">
                    Owner Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">
                    Total Rent Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">
                    Admin Commission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">
                    Owner Earnings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">
                    Payment Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">
                    Booking Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {payment.property_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {payment.tenant_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {payment.owner_name}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {formatCurrency(payment.total_payment)}
                    </td>
                    <td className="px-6 py-4 text-sm text-orange-600 font-medium">
                      {formatCurrency(payment.admin_commission)} (
                      {commissionRates.admin}%)
                    </td>
                    <td className="px-6 py-4 text-sm text-green-600 font-medium">
                      {formatCurrency(payment.owner_earning)} (
                      {commissionRates.owner}%)
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                          payment.payment_status,
                        )}`}
                      >
                        {payment.payment_status.charAt(0).toUpperCase() +
                          payment.payment_status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(payment.booking_date).toLocaleDateString(
                        "en-BD",
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            No payment records found.
          </div>
        )}
      </div>

      {/* Revenue Summary Footer */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            Commission Structure
          </h3>
          <p className="text-xs text-blue-700 mb-3">
            Platform revenue is split between admin and property owners
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-blue-700">Admin Commission:</span>
              <span className="font-bold text-blue-900">
                {commissionRates.admin}%
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-blue-700">Owner Share:</span>
              <span className="font-bold text-blue-900">
                {commissionRates.owner}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-xl p-6 border border-green-100">
          <h3 className="text-sm font-semibold text-green-900 mb-2">
            Total Distributed to Owners
          </h3>
          <p className="text-2xl font-bold text-green-600 mt-4">
            {formatCurrency(stats.owner_earnings)}
          </p>
          <p className="text-xs text-green-700 mt-2">
            Across {stats.total_completed_payments} completed payments
          </p>
        </div>

        <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
          <h3 className="text-sm font-semibold text-orange-900 mb-2">
            Platform Commission Earned
          </h3>
          <p className="text-2xl font-bold text-orange-600 mt-4">
            {formatCurrency(stats.admin_commission)}
          </p>
          <p className="text-xs text-orange-700 mt-2">
            From {stats.total_completed_payments} successful transactions
          </p>
        </div>
      </div>
    </div>
  );
};

export default RevenueAnalytics;
