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
    <div className="flex bg-gray-50 min-h-screen relative">
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
      <div className="flex-1 md:ml-64 p-4 md:p-6 pt-16 md:pt-6 w-full lg:w-auto h-screen overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
