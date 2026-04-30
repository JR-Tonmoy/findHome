import {
  ChevronDown,
  ChevronUp,
  CircleUserRound,
  Home,
  LayoutDashboard,
  LogOut,
  Receipt,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutSuccess } from "../../../features/auth/authSlice";
import { getAdminProfile } from "../../../utils/memberStorage";

const Sidebar = ({ isOpen, setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeMenu, setActiveMenu] = useState("");
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const adminProfile = getAdminProfile();

  const handleLogout = () => {
    dispatch(logoutSuccess());
    toast.success("Thank you!");
    navigate("/login");
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Light theme Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 w-67.5 z-50 transform transition-transform duration-300 md:translate-x-0 
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        flex flex-col pb-4 shadow-sm`}
      >
        {/* Brand Logo */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
          <Link to="/" className="flex flex-col hover:opacity-90">
            <div className="flex items-center gap-2 text-black text-lg font-extrabold tracking-tight">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shadow-sm shrink-0">
                <Home size={20} className="text-orange-400" />
              </div>
              <span>BashaLagbe</span>
            </div>
            <span className="text-gray-500 text-[10px] font-medium mt-1">
              Find your perfect flat easily
            </span>
          </Link>
          <button
            className="md:hidden p-1 rounded-md hover:bg-gray-100 text-gray-500"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* User Profile */}
        <div className="flex flex-col items-center justify-center pt-4 pb-4 border-b border-gray-100 px-4 text-center">
          <div className="p-0.5 rounded-full border-2 border-[#007BFF] shadow-sm">
            <div className="w-14 h-14 rounded-full bg-[#eef2ff] overflow-hidden flex items-center justify-center border-2 border-white">
              {adminProfile.avatar ? (
                <img
                  src={adminProfile.avatar}
                  alt={adminProfile.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserRound size={24} className="text-[#4f46e5]" />
              )}
            </div>
          </div>
          <h3 className="mt-2 text-[15px] font-bold text-gray-900 tracking-tight">
            {adminProfile.fullName}
          </h3>
          <p className="mt-1 text-[10px] text-gray-500 truncate max-w-55">
            {adminProfile.email}
          </p>
          <div className="mt-2 bg-[#007BFF] text-white text-[11px] font-semibold px-3 py-0.5 rounded-full shadow-sm shadow-blue-500/20">
            Admin
          </div>
          <Link
            to="/admin/profile"
            className="mt-2 inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            <CircleUserRound size={14} />
            Profile
          </Link>
        </div>

        {/* Menus */}
        <div className="flex-1 overflow-y-auto w-full px-4 py-5 flex flex-col gap-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <Link
            to="/admin/dashboard"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-900 hover:bg-gray-900 hover:text-white group transition-all duration-200"
          >
            <LayoutDashboard size={20} className="group-hover:text-white" />
            <span className="text-[15px] font-medium">Dashboard</span>
          </Link>

          {/* Members Dropdown */}
          <div className="w-full mt-1">
            <button
              onClick={() => setIsMembersOpen(!isMembersOpen)}
              className="group w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 text-gray-900 hover:bg-gray-900 hover:text-white"
            >
              <div className="flex items-center gap-3">
                <Users size={20} className="group-hover:text-white" />
                <span className="text-[15px] font-semibold">Members</span>
              </div>
              {isMembersOpen ? (
                <ChevronUp size={16} className="group-hover:text-white" />
              ) : (
                <ChevronDown size={16} className="group-hover:text-white" />
              )}
            </button>

            {isMembersOpen && (
              <div className="mt-2 ml-4 flex flex-col gap-2 border-l-2 border-gray-200 pl-4">
                <Link
                  to="/admin/users"
                  onClick={() => setActiveMenu("Users")}
                  className={`block text-left text-[14px] py-2.5 px-4 rounded-xl transition-all duration-200 ${
                    activeMenu === "Users"
                      ? "bg-gray-900 text-white font-medium"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  Users
                </Link>
                <Link
                  to="/admin/owners"
                  onClick={() => setActiveMenu("Owners")}
                  className={`block text-left text-[14px] py-2.5 px-4 rounded-xl transition-all duration-200 ${
                    activeMenu === "Owners"
                      ? "bg-gray-900 text-white font-medium"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  Owners
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/admin/payment-reports"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-900 hover:bg-gray-900 hover:text-white group transition-all duration-200"
          >
            <Receipt size={20} className="group-hover:text-white" />
            <span className="text-[15px] font-medium">Payment Reports</span>
          </Link>
        </div>

        {/* Logout Section */}
        <div className="px-4 mt-auto pt-2 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-4 rounded-xl font-medium text-red-600 hover:bg-red-50 group transition-all duration-200 cursor-pointer"
          >
            <LogOut size={20} className="text-red-600" />
            <span className="text-[15px] font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
