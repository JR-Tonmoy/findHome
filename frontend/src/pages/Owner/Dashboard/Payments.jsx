import {
  Calendar,
  DollarSign,
  Download,
  Filter,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";

const OwnerPayments = () => {
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMonth, setFilterMonth] = useState("all");
  const [stats, setStats] = useState({
    totalEarnings: 0,
    thisMonth: 0,
    pendingAmount: 0,
  });

  useEffect(() => {
    // Simulate fetching earnings data from backend
    const loadEarnings = async () => {
      setLoading(true);
      try {
        // Mock data - replace with actual backend API call
        const mockEarnings = [
          {
            id: 1,
            propertyTitle: "Luxury Apartment in Mirpur",
            tenantName: "John Doe",
            amount: 25000,
            date: new Date(2026, 4, 5),
            status: "paid",
            method: "bkash",
          },
          {
            id: 2,
            propertyTitle: "Studio Flat in Dhanmondi",
            tenantName: "Jane Smith",
            amount: 15000,
            date: new Date(2026, 4, 10),
            status: "paid",
            method: "nagad",
          },
          {
            id: 3,
            propertyTitle: "Luxury Apartment in Mirpur",
            tenantName: "Mike Johnson",
            amount: 25000,
            date: new Date(2026, 4, 15),
            status: "pending",
            method: "bank_transfer",
          },
          {
            id: 4,
            propertyTitle: "2BHK House in Gulshan",
            tenantName: "Sarah Connor",
            amount: 35000,
            date: new Date(2026, 3, 20),
            status: "paid",
            method: "bkash",
          },
        ];

        setEarnings(mockEarnings);

        // Calculate stats
        const total = mockEarnings.reduce((sum, e) => sum + e.amount, 0);
        const thisMonth = mockEarnings
          .filter((e) => e.date.getMonth() === new Date().getMonth())
          .reduce((sum, e) => sum + e.amount, 0);
        const pending = mockEarnings
          .filter((e) => e.status === "pending")
          .reduce((sum, e) => sum + e.amount, 0);

        setStats({
          totalEarnings: total,
          thisMonth: thisMonth,
          pendingAmount: pending,
        });
      } catch (err) {
        console.error("Failed to load earnings:", err);
      } finally {
        setLoading(false);
      }
    };

    loadEarnings();
  }, []);

  const filteredEarnings = earnings.filter((e) => {
    if (filterMonth === "all") return true;
    if (filterMonth === "pending") return e.status === "pending";
    if (filterMonth === "paid") return e.status === "paid";
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getMethodLabel = (method) => {
    const methods = {
      bkash: "bKash",
      nagad: "Nagad",
      bank_transfer: "Bank Transfer",
      rocket: "Rocket",
    };
    return methods[method] || method;
  };

  const handleDownloadReport = () => {
    // Generate CSV or PDF report
    alert("Report download feature coming soon!");
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Payments & Earnings
        </h1>
        <p className="text-gray-600">
          Track all your rental income and payment history
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-700 text-sm font-medium">
                Total Earnings
              </p>
              <p className="text-3xl font-bold text-emerald-900 mt-2">
                ৳{stats.totalEarnings.toLocaleString()}
              </p>
              <p className="text-emerald-700 text-xs mt-1">All time</p>
            </div>
            <div className="bg-white rounded-full p-3">
              <DollarSign size={32} className="text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-700 text-sm font-medium">This Month</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                ৳{stats.thisMonth.toLocaleString()}
              </p>
              <p className="text-blue-700 text-xs mt-1">
                {new Date().toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="bg-white rounded-full p-3">
              <Calendar size={32} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border border-amber-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-700 text-sm font-medium">Pending</p>
              <p className="text-3xl font-bold text-amber-900 mt-2">
                ৳{stats.pendingAmount.toLocaleString()}
              </p>
              <p className="text-amber-700 text-xs mt-1">
                Awaiting confirmation
              </p>
            </div>
            <div className="bg-white rounded-full p-3">
              <TrendingUp size={32} className="text-amber-600" />
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
                onClick={() => setFilterMonth(filter)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize flex items-center gap-2 ${
                  filterMonth === filter
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Filter size={16} />
                {filter}
              </button>
            ))}
          </div>
          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Download size={16} />
            Download Report
          </button>
        </div>
      </div>

      {/* Earnings Table */}
      {loading ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-600">Loading payment history...</p>
        </div>
      ) : filteredEarnings.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <DollarSign size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No payments yet
          </h3>
          <p className="text-gray-600">
            Your payment history will appear here once you receive bookings.
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
                {filteredEarnings.map((earning) => (
                  <tr
                    key={earning.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {earning.propertyTitle}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {earning.tenantName}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-emerald-600">
                      ৳{earning.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {getMethodLabel(earning.method)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {earning.date.toLocaleDateString("en-US")}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          earning.status,
                        )}`}
                      >
                        {earning.status === "paid" ? "✓ Paid" : "⏳ Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payment Methods Info */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          Available Payment Methods
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {["bKash", "Nagad", "Rocket", "Bank Transfer"].map((method) => (
            <div
              key={method}
              className="bg-white rounded-lg p-3 border border-blue-100 text-center"
            >
              <p className="text-sm font-medium text-gray-900">{method}</p>
              <p className="text-xs text-gray-600 mt-1">Fast & Secure</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OwnerPayments;
