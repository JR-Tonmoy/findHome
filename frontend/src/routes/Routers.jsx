import { Navigate, Route, Routes } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import AdminLayout from "../layouts/AdminLayout"; // Admin Layout Custom
import DashboardLayout from "../layouts/DashboardLayout";
import MainLayout from "../layouts/MainLayout";
import AdminDashboard from "../pages/Admin/Dashboard/Dashboard"; // Admin ড্যাশবোর্ড ইমপোর্ট করলাম
import AdminOwner from "../pages/Admin/Dashboard/Owner";
import AdminProfile from "../pages/Admin/Dashboard/Profile";
import AdminUsers from "../pages/Admin/Dashboard/Users"; // Admin Users ইমপোর্ট করলাম
import EarnMoney from "../pages/EarnMoney/EarnMoney";
import ForgotPassword from "../pages/Forgot-Password/Forgot-Password";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import NotFound from "../pages/NotFound";
import OwnerProfile from "../pages/Owner/Dashboard/OwnerProfile"; // ইমপোর্ট করলাম OwnerProfile
import Register from "../pages/Registration/Registration";
import Unauthorized from "../pages/Unauthorized";
import Browse from "../pages/User/Dashboard/Browseahome/Browse";
import OrderNow from "../pages/User/Dashboard/Browseahome/OrderNow";
import ViewDetails from "../pages/User/Dashboard/Browseahome/ViewDetails";
import Dashboard from "../pages/User/Dashboard/Dashboard";
import MyRequests from "../pages/User/Dashboard/MyRequests";
import Orders from "../pages/User/Dashboard/Orders";
import Profile from "../pages/User/Dashboard/Profile";
import PropertyOwnerDashboard from "../pages/User/Dashboard/PropertyOwnerDashboard"; // ১। এখানে প্রোপ্রার্টি ওনার এর ড্যাশবোর্ড ইমপোর্ট করলাম
import SavedHouses from "../pages/User/Dashboard/SavedHouses";
import RoleProtected from "./RoleProtected";
// import Sidebar from "../pages/User/Sidebar/Sidebar";

const Routers = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Route - Login */}
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        }
      />
      <Route path="/home" element={<Home />} />
      <Route path="/earn" element={<EarnMoney />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* 
        অ্যাডমিন ড্যাশবোর্ড এর রাউট
      */}
      <Route path="/admin" element={<AdminLayout />}>
        {/* /admin/dashboard */}
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="profile" element={<AdminProfile />} />
        {/* /admin/users */}
        <Route path="users" element={<AdminUsers />} />
        {/* /admin/owners */}
        <Route path="owners" element={<AdminOwner />} />
      </Route>

      {/* 
        ড্যাশবোর্ড এর ভেতর অন্য পেজ দেখানোর জন্য Nested Route ব্যবহার করা হচ্ছে। 
        DashboardLayout এর ভেতরে <Outlet /> আছে, যেখানে নিচের পেজগুলো লোড হবে।
      */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} /> {/* এটি টেনান্ট ড্যাশবোর্ড */}
        <Route path="browse" element={<Browse />} />
        <Route path="orders" element={<Orders />} />
        <Route path="requests" element={<MyRequests />} />
        <Route path="saved" element={<SavedHouses />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* ২। প্রোপার্টি ওনার এর জন্য আলাদা একটি রাউট তৈরি করলাম। যাতে আলাদা ড্যাশবোর্ড দেখতে পাওয়া যায়। */}
      <Route path="/owner-dashboard" element={<DashboardLayout />}>
        <Route index element={<PropertyOwnerDashboard />} />
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
          <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
        }
      />

      {/* Catch all route - show 404 page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Routers;
