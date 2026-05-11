import {
  CheckCircle,
  Clock,
  Home,
  MapPin,
  Phone,
  User,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [stats, setStats] = useState({
    totalBookings: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  useEffect(() => {
    const loadBookings = async () => {
      setLoading(true);
      try {
        // Mock data - replace with actual backend API call
        const mockBookings = [
          {
            id: 1,
            propertyTitle: "Luxury Apartment in Mirpur",
            propertyLocation: "Mirpur, Dhaka",
            tenantName: "John Doe",
            tenantEmail: "john@example.com",
            tenantPhone: "+8801700000000",
            moveInDate: "2026-06-01",
            duration: "12",
            status: "approved",
            requestedDate: new Date(2026, 4, 1),
            approvalDate: new Date(2026, 4, 2),
          },
          {
            id: 2,
            propertyTitle: "Studio Flat in Dhanmondi",
            propertyLocation: "Dhanmondi, Dhaka",
            tenantName: "Jane Smith",
            tenantEmail: "jane@example.com",
            tenantPhone: "+8801800000000",
            moveInDate: "2026-05-20",
            duration: "6",
            status: "pending",
            requestedDate: new Date(2026, 4, 10),
            approvalDate: null,
          },
          {
            id: 3,
            propertyTitle: "2BHK House in Gulshan",
            propertyLocation: "Gulshan, Dhaka",
            tenantName: "Mike Johnson",
            tenantEmail: "mike@example.com",
            tenantPhone: "+8801900000000",
            moveInDate: "2026-07-01",
            duration: "24",
            status: "rejected",
            requestedDate: new Date(2026, 3, 25),
            approvalDate: new Date(2026, 3, 28),
          },
          {
            id: 4,
            propertyTitle: "Luxury Apartment in Mirpur",
            propertyLocation: "Mirpur, Dhaka",
            tenantName: "Sarah Connor",
            tenantEmail: "sarah@example.com",
            tenantPhone: "+8801600000000",
            moveInDate: "2026-06-15",
            duration: "12",
            status: "pending",
            requestedDate: new Date(2026, 4, 8),
            approvalDate: null,
          },
        ];

        setBookings(mockBookings);

        // Calculate stats
        const total = mockBookings.length;
        const pend = mockBookings.filter((b) => b.status === "pending").length;
        const appr = mockBookings.filter((b) => b.status === "approved").length;
        const rej = mockBookings.filter((b) => b.status === "rejected").length;

        setStats({
          totalBookings: total,
          pending: pend,
          approved: appr,
          rejected: rej,
        });
      } catch (err) {
        console.error("Failed to load bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  const filteredBookings = bookings.filter((b) => {
    if (filterStatus === "all") return true;
    return b.status === filterStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle size={16} />;
      case "pending":
        return <Clock size={16} />;
      case "rejected":
        return <XCircle size={16} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Booking Management
        </h1>
        <p className="text-gray-600">
          Monitor and manage all property booking requests
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6 shadow-sm">
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

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200 p-6 shadow-sm">
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

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-6 shadow-sm">
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

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200 p-6 shadow-sm">
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

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-sm">
        <div className="flex gap-2 flex-wrap">
          {["all", "pending", "approved", "rejected"].map((status) => (
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
          ))}
        </div>
      </div>

      {/* Bookings Table */}
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
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Move-in Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Duration
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
                {filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {booking.propertyTitle}
                        </p>
                        <div className="flex items-center text-gray-500 text-xs mt-1">
                          <MapPin size={12} className="mr-1" />
                          {booking.propertyLocation}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {booking.tenantName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {booking.tenantEmail}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Phone size={14} className="text-gray-400" />
                        {booking.tenantPhone}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {booking.moveInDate}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {booking.duration} months
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${getStatusColor(
                          booking.status,
                        )}`}
                      >
                        {getStatusIcon(booking.status)}
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {booking.status === "pending" ? (
                        <div className="flex gap-2">
                          <button className="text-green-600 hover:text-green-800 font-medium">
                            Approve
                          </button>
                          <button className="text-red-600 hover:text-red-800 font-medium">
                            Reject
                          </button>
                        </div>
                      ) : (
                        <button className="text-gray-600 hover:text-gray-800 font-medium">
                          View
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
    </div>
  );
};

export default BookingManagement;
