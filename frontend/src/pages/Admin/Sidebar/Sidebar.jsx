import {
  Bell,
  Book,
  CircleUserRound,
  DollarSign,
  Home,
  LayoutDashboard,
  LogOut,
  TrendingUp,
  UserRound,
  Users,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Logo from "../../../components/Logo/Logo";
import { logoutSuccess } from "../../../features/auth/authSlice";
import useAuth from "../../../hooks/useAuth";
import { getAvatarUrl } from "../../../utils/avatarHelper";

const Sidebar = ({ isOpen, setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const syncedProfile = {
    ...user,
    avatar: getAvatarUrl(user),
  };
  const adminName =
    syncedProfile.fullName ||
    syncedProfile.name ||
    syncedProfile.email ||
    "Admin User";
  const adminEmail = syncedProfile.email || "admin@bashalagbe.com";

  const handleLogout = () => {
    dispatch(logoutSuccess());
    toast.success("Thank you!");
    navigate("/login");
  };

  const adminMenus = [
    {
      label: "Dashboard",
      path: "/admin-dashboard/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      label: "Notifications",
      path: "/admin-dashboard/notifications",
      icon: <Bell size={20} />,
    },
    {
      label: "Users",
      path: "/admin-dashboard/users",
      icon: <Users size={20} />,
    },
    {
      label: "Owners",
      path: "/admin-dashboard/owners",
      icon: <UserRound size={20} />,
    },
    {
      label: "Properties",
      path: "/admin-dashboard/properties",
      icon: <Home size={20} />,
    },
    {
      label: "Bookings",
      path: "/admin-dashboard/bookings",
      icon: <Book size={20} />,
    },
    {
      label: "Revenue Analytics",
      path: "/admin-dashboard/revenue",
      icon: <TrendingUp size={20} />,
    },
    {
      label: "Payments",
      path: "/admin-dashboard/payments",
      icon: <DollarSign size={20} />,
    },
  ];

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
        className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 w-64 z-50 transform transition-transform duration-300 md:translate-x-0 
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        flex flex-col shadow-lg overflow-hidden`}
      >
        <div className="flex h-full flex-col justify-between overflow-y-auto">
          <div className="flex-1 overflow-y-auto">
            {/* Brand Logo */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200">
              <div className="flex-1">
                <Logo
                  variant="default"
                  size="sm"
                  showSubtitle={true}
                  linkTo="/home"
                />
              </div>
              <button
                className="md:hidden p-1 rounded-md hover:bg-gray-100 text-gray-500 ml-2 shrink-0"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            {/* User Profile */}
            <div className="px-4 py-5 border-b border-gray-100">
              <div className="rounded-2xl bg-linear-to-b from-blue-50 to-white border border-blue-100 shadow-sm px-4 py-4 text-center">
                <div className="mx-auto p-0.5 w-fit rounded-full border-2 border-[#007BFF] shadow-sm">
                  <div className="w-16 h-16 rounded-full bg-[#eef2ff] overflow-hidden flex items-center justify-center border-2 border-white">
                    <img
                      src={syncedProfile.avatar}
                      alt={adminName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <h3 className="mt-3 text-[16px] font-bold text-gray-900 tracking-tight">
                  {adminName}
                </h3>
                <p className="mt-1 text-[11px] text-gray-500 truncate">
                  {adminEmail}
                </p>
                <div className="mt-2 inline-flex bg-[#007BFF] text-white text-[11px] font-semibold px-3 py-0.5 rounded-full shadow-sm shadow-blue-500/20">
                  Admin
                </div>
                <Link
                  to="/admin-dashboard/profile"
                  className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
                >
                  <CircleUserRound size={14} />
                  Profile
                </Link>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="px-4 py-4 space-y-2">
              {adminMenus.map((menu, index) => (
                <NavLink
                  key={index}
                  to={menu.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`
                  }
                  onClick={() => setIsSidebarOpen(false)}
                >
                  {menu.icon}
                  {menu.label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Logout Button */}
          <div className="px-4 pb-6 pt-3 border-t border-gray-200 bg-white">
            <button
              onClick={handleLogout}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
