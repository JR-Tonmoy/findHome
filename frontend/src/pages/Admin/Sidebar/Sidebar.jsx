import {
  Building,
  CalendarCheck,
  ChevronDown,
  ChevronUp,
  CircleUserRound,
  LayoutDashboard,
  LogOut,
  Receipt,
  Settings,
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
  const [activeMenu, setActiveMenu] = useState("Users");
  const [isMembersOpen, setIsMembersOpen] = useState(true);
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
          <Link to="/" className="flex items-center gap-3 hover:opacity-90">
            <div className="w-8 h-8 rounded-lg bg-[#007BFF] flex items-center justify-center text-white text-sm shadow-sm">
              🏠
            </div>
            <div className="flex flex-col">
              <h1 className="text-gray-900 text-lg font-extrabold leading-tight tracking-tight">
                BashaLagbe
              </h1>
              <span className="text-gray-500 text-[10px] font-medium">
                Find your perfect flat easily
              </span>
            </div>
          </Link>
          <button
            className="md:hidden p-1 rounded-md hover:bg-gray-100 text-gray-500"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* User Profile */}
        <div className="flex flex-col items-center justify-center pt-8 pb-6 border-b border-gray-100">
          <div className="p-0.5 rounded-full border-[3px] border-[#007BFF]">
            <div className="w-20 h-20 rounded-full bg-[#eef2ff] overflow-hidden flex items-center justify-center border-2 border-white">
              {adminProfile.avatar ? (
                <img
                  src={adminProfile.avatar}
                  alt={adminProfile.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserRound size={34} className="text-[#4f46e5]" />
              )}
            </div>
          </div>
          <h3 className="mt-4 text-[18px] font-bold text-gray-900 tracking-wide">
            {adminProfile.fullName}
          </h3>
          <p className="mt-1 text-xs text-gray-500">{adminProfile.email}</p>
          <div className="mt-3 bg-[#007BFF] text-white text-[13px] font-semibold px-4 py-1.5 rounded-md shadow-lg shadow-blue-500/20">
            Admin
          </div>
          <Link
            to="/admin/profile"
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            <CircleUserRound size={16} />
            Profile
          </Link>
        </div>

        {/* Menus */}
        <div className="flex-1 overflow-y-auto w-full px-4 py-6 flex flex-col gap-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <Link
            to="/admin/dashboard"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-black hover:bg-black hover:text-white group hover:scale-105 transition-all duration-200"
          >
            <LayoutDashboard
              size={20}
              className="text-black group-hover:text-white"
            />
            <span className="text-[15px] font-medium">Dashboard</span>
          </Link>

          {/* Members Dropdown */}
          <div className="w-full mt-1">
            <button
              onClick={() => setIsMembersOpen(!isMembersOpen)}
              className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 text-black hover:bg-black hover:text-white hover:scale-105`}
            >
              <div className="flex items-center gap-3">
                <Users
                  size={20}
                  className={
                    isMembersOpen
                      ? "text-black group-hover:text-white"
                      : "text-black group-hover:text-white"
                  }
                />
                <span className="text-[15px] font-bold">Members</span>
              </div>
              {isMembersOpen ? (
                <ChevronUp
                  size={16}
                  className="text-black group-hover:text-white"
                />
              ) : (
                <ChevronDown
                  size={16}
                  className="text-black group-hover:text-white"
                />
              )}
            </button>

            {isMembersOpen && (
              <div className="mt-1 flex flex-col relative before:absolute before:left-5.25 before:top-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-black before:to-transparent pl-8 overflow-hidden rounded-xl py-1 gap-1">
                <Link
                  to="/admin/users"
                  onClick={() => setActiveMenu("Users")}
                  className={`block text-left text-[14.5px] py-2.5 px-4 rounded-xl transition-all duration-200 shadow-sm ${
                    activeMenu === "Users"
                      ? "bg-black text-white font-medium scale-105"
                      : "text-black hover:bg-black hover:text-white hover:scale-105"
                  }`}
                >
                  Users
                </Link>
                <Link
                  to="/admin/owners"
                  onClick={() => setActiveMenu("Owners")}
                  className={`block text-left text-[14.5px] py-2.5 px-4 rounded-xl transition-all duration-200 shadow-sm ${
                    activeMenu === "Owners"
                      ? "bg-black text-white font-medium scale-105"
                      : "text-black hover:bg-black hover:text-white hover:scale-105"
                  }`}
                >
                  Owners
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/admin/booking-status"
            className="w-full flex items-center gap-3 px-3 py-3 mt-2 rounded-xl text-black hover:bg-black hover:text-white group hover:scale-105 transition-all duration-200"
          >
            <CalendarCheck
              size={20}
              className="text-black group-hover:text-white"
            />
            <span className="text-[15px] font-medium">Booking Status</span>
          </Link>

          <Link
            to="/admin/manage-properties"
            className="w-full flex items-center gap-3 px-3 py-3 mt-1 rounded-xl text-black hover:bg-black hover:text-white group hover:scale-105 transition-all duration-200"
          >
            <Building size={20} className="text-black group-hover:text-white" />
            <span className="text-[15px] font-medium">Manage Properties</span>
          </Link>

          <Link
            to="/admin/payment-reports"
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-black hover:bg-black hover:text-white group hover:scale-105 transition-all duration-200"
          >
            <Receipt size={20} className="text-black group-hover:text-white" />
            <span className="text-[15px] font-medium">Payment Reports</span>
          </Link>

          <Link
            to="/admin/settings"
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-black hover:bg-black hover:text-white group hover:scale-105 transition-all duration-200"
          >
            <Settings size={20} className="text-black group-hover:text-white" />
            <span className="text-[15px] font-medium">Setting</span>
          </Link>
        </div>

        {/* Logout Section */}
        <div className="px-4 mt-auto pt-2 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-4 rounded-xl font-medium text-black hover:bg-black hover:text-white group hover:scale-105 transition-all duration-200 cursor-pointer"
          >
            <LogOut size={20} className="text-black group-hover:text-white" />
            <span className="text-[15px] font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
