import { Menu } from "lucide-react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import OwnerSidebar from "../pages/Owner/Sidebar/Sidebar";
import TenantSidebar from "../pages/User/Sidebar/Sidebar";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

  // Determine user role
  const userRole = (
    user?.role ||
    localStorage.getItem("userRole") ||
    ""
  ).toLowerCase();
  const isOwner =
    userRole === "owner" || userRole === "property owner";

  // Select appropriate sidebar based on role
  const SidebarComponent = isOwner ? OwnerSidebar : TenantSidebar;

  return (
    <div className="relative flex h-screen min-h-screen overflow-hidden bg-gray-50">
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow text-gray-700 hover:bg-gray-100"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar - Dynamic based on role */}
      <SidebarComponent isOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      {/* Main Content Area */}
      <div className="h-full w-full flex-1 overflow-y-auto p-4 pt-16 md:ml-64 md:p-6 md:pt-6 lg:w-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
