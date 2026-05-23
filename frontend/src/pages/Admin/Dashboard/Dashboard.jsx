import {
  Award,
  Bell,
  Building,
  ChevronDown,
  CreditCard,
  DollarSign,
  Package,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../../components/Logo/Logo";
import { seedAdminNotifications } from "../../../utils/adminNotificationStorage";
import adminService from "../../../utils/adminService";

const Dashboard = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOwners: 0,
    totalProperties: 0,
    totalBookings: 0,
    totalPayments: 0,
    totalRevenue: 0,
    adminCommission: 0,
    completedPayments: 0,
  });
  const [commissionRates, setCommissionRates] = useState({
    admin: 5,
    owner: 95,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [revenueData, setRevenueData] = useState({
    totalAdminEarnings: 0,
    totalOwnerEarnings: 0,
    completedPayments: 0,
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      let active = true;
      setLoading(true);

      try {
        const [dashboard, revenue] = await Promise.all([
          adminService.fetchAdminDashboard(),
          adminService.fetchRevenueStats(),
        ]);

        if (!active) return;

        const statsData = dashboard?.stats || {};
        const notificationsArray = Array.isArray(dashboard?.notifications)
          ? dashboard.notifications
          : [];

        const adminRate = Number(revenue?.admin_commission_rate ?? 5);
        const ownerRate = Number(
          revenue?.owner_earning_rate ?? 100 - adminRate,
        );
        const totalRevenue = Number(revenue?.total_revenue ?? 0);
        const adminCommission = Number(
          revenue?.admin_commission ?? statsData.admin_earnings ?? 0,
        );
        const completedPayments = Number(
          revenue?.total_completed_payments ?? statsData.total_payments ?? 0,
        );

        setCommissionRates({ admin: adminRate, owner: ownerRate });
        setStats({
          totalUsers: Number(statsData.total_users ?? 0),
          totalOwners: Number(statsData.total_owners ?? 0),
          totalProperties: Number(statsData.total_properties ?? 0),
          totalBookings: Number(statsData.total_bookings ?? 0),
          totalPayments: Number(statsData.total_payments ?? 0),
          totalRevenue: Math.round(totalRevenue),
          adminCommission: Math.round(adminCommission),
          completedPayments,
        });

        setRevenueData({
          totalAdminEarnings: Math.round(adminCommission),
          totalOwnerEarnings: Math.round(totalRevenue - adminCommission),
          completedPayments,
        });

        const recentActivity = notificationsArray
          .slice(0, 6)
          .map((notification) => ({
            id: notification.id,
            type: notification.type || "system",
            title: notification.title,
            message: notification.message,
            timestamp: notification.created_at || notification.createdAt,
          }));

        setRecentActivity(recentActivity);
        setNotifications(notificationsArray);
        seedAdminNotifications(notificationsArray);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        if (active) {
          setStats({
            totalUsers: 0,
            totalOwners: 0,
            totalProperties: 0,
            totalBookings: 0,
            totalPayments: 0,
            totalRevenue: 0,
            adminCommission: 0,
            completedPayments: 0,
          });
          setRecentActivity([]);
          setNotifications([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadDashboardData();

    return () => {
      // Cleanup
    };
  }, []);

  return (
    <>
      {/* Header with Logo */}
      <div className="mb-8 pb-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Logo
              variant="default"
              size="md"
              showSubtitle={true}
              linkTo="/home"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
        </div>
        <p className="text-gray-600 text-sm">
          Monitor and manage your platform
        </p>
      </div>

      {/* Statistics Cards - Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Users Card */}
        <div
          onClick={() => navigate("/admin-dashboard/users")}
          className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-blue-200"
        >
          <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
            <Users size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">
              Total Users
            </p>
            <h3 className="text-3xl font-black text-gray-900">
              {loading ? "-" : stats.totalUsers}
            </h3>
          </div>
        </div>

        {/* Total Owners Card */}
        <div
          onClick={() => navigate("/admin-dashboard/owners")}
          className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-green-200"
        >
          <div className="bg-green-100 text-green-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
            <UserCheck size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">
              Total Owners
            </p>
            <h3 className="text-3xl font-black text-gray-900">
              {loading ? "-" : stats.totalOwners}
            </h3>
          </div>
        </div>

        {/* Total Properties Card */}
        <div
          onClick={() => navigate("/admin-dashboard/properties")}
          className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-purple-200"
        >
          <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
            <Building size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">
              Total Properties
            </p>
            <h3 className="text-3xl font-black text-gray-900">
              {loading ? "-" : stats.totalProperties}
            </h3>
          </div>
        </div>

        {/* Total Bookings Card */}
        <div
          onClick={() => navigate("/admin-dashboard/bookings")}
          className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-yellow-200"
        >
          <div className="bg-yellow-100 text-yellow-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
            <Package size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">
              Total Bookings
            </p>
            <h3 className="text-3xl font-black text-gray-900">
              {loading ? "-" : stats.totalBookings}
            </h3>
          </div>
        </div>
      </div>

      {/* Statistics Cards - Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Payments Card */}
        <div
          onClick={() => navigate("/admin-dashboard/payments")}
          className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-indigo-200"
        >
          <div className="bg-indigo-100 text-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
            <CreditCard size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">
              Total Payments
            </p>
            <h3 className="text-3xl font-black text-gray-900">
              {loading ? "-" : stats.totalPayments}
            </h3>
          </div>
        </div>

        {/* Total Revenue Card */}
        <div
          onClick={() => navigate("/admin-dashboard/subscription")}
          className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-emerald-200"
        >
          <div className="bg-emerald-100 text-emerald-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">
              Total Revenue
            </p>
            <h3 className="text-3xl font-black text-gray-900">
              {loading ? "-" : `$${stats.totalRevenue.toLocaleString()}`}
            </h3>
          </div>
        </div>

        {/* Admin Commission Card */}
        <div
          onClick={() => navigate("/admin/subscription")}
          className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-orange-200"
        >
          <div className="bg-orange-100 text-orange-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
            <Award size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">
              Admin Earnings ({commissionRates.admin}%)
            </p>
            <h3 className="text-3xl font-black text-gray-900">
              {loading ? "-" : `$${stats.adminCommission.toLocaleString()}`}
            </h3>
          </div>
        </div>

        {/* Notification Bell Card */}
        <button
          type="button"
          onClick={() => setShowNotifications((current) => !current)}
          className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-red-200 text-left"
        >
          <div className="bg-red-100 text-red-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4 relative">
            <Bell size={24} />
            {notifications.length > 0 ? (
              <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {notifications.length}
              </span>
            ) : null}
          </div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">
                Notifications
              </p>
              <h3 className="text-2xl font-black text-gray-900">View Alerts</h3>
            </div>
            <ChevronDown
              size={18}
              className={`text-gray-400 transition-transform ${
                showNotifications ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {/* Notifications Panel */}
      {showNotifications ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 lg:p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Notifications</h3>
            <span className="text-sm text-gray-500">
              {notifications.length} total
            </span>
          </div>

          {notifications.length > 0 ? (
            <div className="space-y-4 max-h-112 overflow-y-auto pr-1">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="rounded-xl border border-gray-100 bg-gray-50 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-gray-900">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-500 border border-gray-200 uppercase">
                      {notification.type}
                    </span>
                  </div>
                  <p className="mt-3 text-xs text-gray-400">
                    {new Date(
                      notification.createdAt ||
                        notification.timestamp ||
                        Date.now(),
                    ).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-gray-500">
              No notifications yet.
            </div>
          )}
        </div>
      ) : null}

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6 lg:p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Recent Activity
          </h3>

          {recentActivity.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-gray-500">
              No recent activity.
            </div>
          ) : (
            <div className="space-y-6">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex gap-4 items-start relative before:absolute before:left-1.75 before:top-8 before:w-0.5 before:h-full before:bg-gray-100 pb-2"
                >
                  <div
                    className={`w-4 h-4 rounded-full mt-1.5 shrink-0 z-10 border-2 border-white ${
                      activity.type === "property"
                        ? "bg-green-500"
                        : activity.type === "booking"
                          ? "bg-yellow-500"
                          : activity.type === "payment"
                            ? "bg-emerald-500"
                            : "bg-blue-500"
                    }`}
                  ></div>
                  <div>
                    <h4 className="font-bold text-gray-900">
                      {activity.title}
                    </h4>
                    <p className="text-gray-600 text-sm mt-0.5">
                      {activity.message}
                    </p>
                    <span className="text-gray-400 text-sm mt-1 block">
                      {new Date(
                        activity.timestamp || Date.now(),
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Revenue Analytics */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 lg:p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-emerald-600" />
            Revenue Analytics
          </h3>

          <div className="space-y-6">
            {/* Admin Earnings */}
            <div className="border-l-4 border-orange-500 pl-4">
              <p className="text-gray-600 text-sm font-medium mb-1">
                Admin Earnings
              </p>
              <h4 className="text-2xl font-bold text-gray-900">
                $
                {loading
                  ? "-"
                  : revenueData.totalAdminEarnings.toLocaleString()}
              </h4>
              <p className="text-xs text-gray-400 mt-2">20% commission</p>
            </div>

            {/* Owner Earnings */}
            <div className="border-l-4 border-emerald-500 pl-4">
              <p className="text-gray-600 text-sm font-medium mb-1">
                Owner Earnings
              </p>
              <h4 className="text-2xl font-bold text-gray-900">
                $
                {loading
                  ? "-"
                  : revenueData.totalOwnerEarnings.toLocaleString()}
              </h4>
              <p className="text-xs text-gray-400 mt-2">80% to owners</p>
            </div>

            {/* Completed Payments */}
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="text-gray-600 text-sm font-medium mb-1">
                Completed Payments
              </p>
              <h4 className="text-2xl font-bold text-gray-900">
                {loading ? "-" : revenueData.completedPayments}
              </h4>
              <p className="text-xs text-gray-400 mt-2">
                {stats.totalPayments > 0
                  ? Math.round(
                      (revenueData.completedPayments / stats.totalPayments) *
                        100,
                    )
                  : 0}
                % completion rate
              </p>
            </div>

            {/* Action Button */}
            <button
              onClick={() => navigate("/admin/subscription")}
              className="w-full mt-6 bg-linear-to-r from-emerald-500 to-emerald-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
            >
              View Full Analytics
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
