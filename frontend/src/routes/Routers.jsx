import { Navigate, Route, Routes } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import MainLayout from "../layouts/MainLayout";
// import Dashboard from "../pages/Dashboard";
import DashboardLayout from "../layouts/DashboardLayout";
import ForgotPassword from "../pages/Forgot-Password/Forgot-Password";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import NotFound from "../pages/NotFound";
import Register from "../pages/Registration/Registration";
import Unauthorized from "../pages/Unauthorized";
import Dashboard from "../pages/User/Dashboard/Dashboard";
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
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard" element={<DashboardLayout />} />
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
