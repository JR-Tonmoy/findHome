import {
  Calendar,
  CreditCard,
  DollarSign,
  Download,
  Filter,
} from "lucide-react";
import { useEffect, useState } from "react";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [stats, setStats] = useState({
    totalPaid: 0,
    pendingPayments: 0,
    nextPaymentDue: 0,
  });

  useEffect(() => {
    const loadPayments = async () => {
      setLoading(true);
      try {
        // Mock data - replace with actual backend API call
        const mockPayments = [
          {
            id: 1,
            propertyTitle: "Luxury Apartment in Mirpur",
            ownerName: "Ahmed Hassan",
            amount: 25000,
            dueDate: new Date(2026, 4, 15),
            paidDate: new Date(2026, 4, 14),
            status: "paid",
            method: "bkash",
          },
          {
            id: 2,
            propertyTitle: "Studio Flat in Dhanmondi",
            ownerName: "Fatima Khan",
            amount: 15000,
            dueDate: new Date(2026, 5, 10),
            paidDate: null,
            status: "pending",
            method: null,
          },
          {
            id: 3,
            propertyTitle: "2BHK House in Gulshan",
            ownerName: "Rahman Ahmed",
            amount: 35000,
            dueDate: new Date(2026, 4, 20),
            paidDate: new Date(2026, 4, 19),
            status: "paid",
            method: "nagad",
          },
          {
            id: 4,
            propertyTitle: "Luxury Apartment in Mirpur",
            ownerName: "Ahmed Hassan",
            amount: 25000,
            dueDate: new Date(2026, 3, 15),
            paidDate: new Date(2026, 3, 16),
            status: "paid",
            method: "bank_transfer",
          },
        ];

        setPayments(mockPayments);

        // Calculate stats
        const totalPaid = mockPayments
          .filter((p) => p.status === "paid")
          .reduce((sum, p) => sum + p.amount, 0);
        const pending = mockPayments
          .filter((p) => p.status === "pending")
          .reduce((sum, p) => sum + p.amount, 0);

        setStats({
          totalPaid: totalPaid,
          pendingPayments: pending,
          nextPaymentDue: pending > 0 ? 5 : 0,
        });
      } catch (err) {
        console.error("Failed to load payment history:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, []);

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
      bank_transfer: "Bank Transfer",
      rocket: "Rocket",
    };
    return methods[method] || "Not specified";
  };

  const handleMakePayment = (paymentId) => {
    alert("Payment gateway integration coming soon!");
  };

  const handleDownloadReceipt = () => {
    alert("Receipt download feature coming soon!");
  };

  return (
    <div className="max-w-7xl mx-auto">
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
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200 p-6 shadow-sm">
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

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border border-amber-200 p-6 shadow-sm">
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

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6 shadow-sm">
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
          <button
            onClick={handleDownloadReceipt}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Download size={16} />
            Download Invoice
          </button>
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
                          onClick={() => handleMakePayment(payment.id)}
                          className="text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          Pay Now
                        </button>
                      ) : (
                        <button
                          onClick={() => handleDownloadReceipt()}
                          className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                        >
                          <Download size={14} />
                          Receipt
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
          {["bKash", "Nagad", "Rocket", "Bank Transfer"].map((method) => (
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
