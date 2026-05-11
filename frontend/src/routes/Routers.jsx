import { Navigate, Route, Routes } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import AdminLayout from "../layouts/AdminLayout"; // Admin Layout Custom
import DashboardLayout from "../layouts/DashboardLayout";
import MainLayout from "../layouts/MainLayout";
import BookingManagement from "../pages/Admin/Dashboard/BookingManagement";
import AdminDashboard from "../pages/Admin/Dashboard/Dashboard";
import ManageProperties from "../pages/Admin/Dashboard/ManageProperties";
import AdminNotifications from "../pages/Admin/Dashboard/Notifications";
import AdminOwner from "../pages/Admin/Dashboard/Owner";
import PaymentReports from "../pages/Admin/Dashboard/PaymentReports";
import AdminProfile from "../pages/Admin/Dashboard/Profile";
import AdminUsers from "../pages/Admin/Dashboard/Users";
import EarnMoney from "../pages/EarnMoney/EarnMoney";
import ForgotPassword from "../pages/Forgot-Password/Forgot-Password";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import NotFound from "../pages/NotFound";
import AddProperty from "../pages/Owner/Dashboard/AddProperty";
import MyProperties from "../pages/Owner/Dashboard/MyProperties";
import OwnerNotifications from "../pages/Owner/Dashboard/Notifications"; // Owner Notifications
import OwnerProfile from "../pages/Owner/Dashboard/OwnerProfile"; // ইমপোর্ট করলাম OwnerProfile
import OwnerPayments from "../pages/Owner/Dashboard/Payments";
import Register from "../pages/Registration/Registration";
import Unauthorized from "../pages/Unauthorized";
import Browse from "../pages/User/Dashboard/Browseahome/Browse";
import OrderNow from "../pages/User/Dashboard/Browseahome/OrderNow";
import ViewDetails from "../pages/User/Dashboard/Browseahome/ViewDetails";
import Dashboard from "../pages/User/Dashboard/Dashboard";
import MyRequests from "../pages/User/Dashboard/MyRequests";
import Notifications from "../pages/User/Dashboard/Notifications"; // Tenant Notifications
import Orders from "../pages/User/Dashboard/Orders";
import PaymentHistory from "../pages/User/Dashboard/PaymentHistory";
import Profile from "../pages/User/Dashboard/Profile";
import PropertyOwnerDashboard from "../pages/User/Dashboard/PropertyOwnerDashboard"; // ১। এখানে প্রোপ্রার্টি ওনার এর ড্যাশবোর্ড ইমপোর্ট করলাম
import SavedHouses from "../pages/User/Dashboard/SavedHouses";
import Protected from "./Protected";
import RoleProtected from "./RoleProtected";
// import Sidebar from "../pages/User/Sidebar/Sidebar";

const Routers = () => {
  const { isAuthenticated } = useAuth();

  // After login, send authenticated users to the public home page
  const defaultAuthenticatedRoute = "/home";

  return (
    <Routes>
      {/* Public Route - Login */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to={defaultAuthenticatedRoute} replace />
          ) : (
            <Login />
          )
        }
      />
      <Route path="/home" element={<Home />} />
      <Route path="/earn" element={<EarnMoney />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* 
        অ্যাডমিন ড্যাশবোর্ড এর রাউট
      */}
      <Route
        path="/admin"
        element={
          <RoleProtected requiredRoles={["admin"]}>
            <AdminLayout />
          </RoleProtected>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        {/* /admin/dashboard */}
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="profile" element={<AdminProfile />} />
        {/* /admin/notifications */}
        <Route path="notifications" element={<AdminNotifications />} />
        {/* /admin/users */}
        <Route path="users" element={<AdminUsers />} />
        {/* /admin/owners */}
        <Route path="owners" element={<AdminOwner />} />
        {/* /admin/properties */}
        <Route path="properties" element={<ManageProperties />} />
        {/* /admin/bookings */}
        <Route path="bookings" element={<BookingManagement />} />
        {/* /admin/payments */}
        <Route path="payments" element={<PaymentReports />} />
      </Route>

      {/* 
        ড্যাশবোর্ড এর ভেতর অন্য পেজ দেখানোর জন্য Nested Route ব্যবহার করা হচ্ছে। 
        DashboardLayout এর ভেতরে <Outlet /> আছে, যেখানে নিচের পেজগুলো লোড হবে।
      */}
      <Route
        path="/dashboard"
        element={
          <Protected>
            <DashboardLayout />
          </Protected>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="browse" element={<Browse />} />
        <Route path="orders" element={<Orders />} />
        <Route path="requests" element={<MyRequests />} />
        <Route path="saved" element={<SavedHouses />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="payments" element={<PaymentHistory />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* ২। প্রোপার্টি ওনার এর জন্য আলাদা একটি রাউট তৈরি করলাম। যাতে আলাদা ড্যাশবোর্ড দেখতে পাওয়া যায়। */}
      <Route
        path="/owner-dashboard"
        element={
          <Protected>
            <DashboardLayout />
          </Protected>
        }
      >
        <Route index element={<PropertyOwnerDashboard />} />
        <Route path="add-property" element={<AddProperty />} />
        <Route path="my-properties" element={<MyProperties />} />
        <Route path="notifications" element={<OwnerNotifications />} />
        <Route path="payments" element={<OwnerPayments />} />
        <Route path="profile" element={<OwnerProfile />} />
      </Route>

      <Route path="/property/:id" element={<ViewDetails />} />
      <Route path="/order/:id" element={<OrderNow />} />

      {/* <Route path="/sidebar" element={<Sidebar/>} /> */}

      {/* Protected Routes with Layout */}
      <Route
        element={
          <RoleProtected requiredRoles={["admin", "user"]}>
            <MainLayout />
          </RoleProtected>
        }
      >
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route
          path="/settings"
          element={
            <RoleProtected requiredRoles={["admin"]}>
              <div>Settings Page Coming Soon</div>
            </RoleProtected>
          }
        />
        {/* <Route
          path="/profile"
          element={
            <RoleProtected requiredRoles={["admin", "user"]}>
              <div>Profile Page Coming Soon</div>
            </RoleProtected>
          }
        /> */}
      </Route>

      {/* Error Pages */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/404" element={<NotFound />} />

      {/* Default redirect */}
      <Route
        path="/"
        element={
          <Navigate
            to={isAuthenticated ? defaultAuthenticatedRoute : "/login"}
            replace
          />
        }
      />

      {/* Catch all route - show 404 page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Routers;
