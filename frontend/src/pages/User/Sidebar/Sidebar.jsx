import {
  Bell,
  Heart,
  Home,
  LogOut,
  Search,
  User,
  Wallet,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../../../components/Logo/Logo";
import { logoutSuccess } from "../../../features/auth/authSlice";
import useAuth from "../../../hooks/useAuth";
import { getCurrentMemberProfile } from "../../../utils/memberStorage";

const TenantSidebar = ({ isOpen, setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const memberProfile = getCurrentMemberProfile();
  const syncedProfile = {
    ...memberProfile,
    ...user,
    avatar: user?.avatar || user?.profile_image || memberProfile.avatar || "",
  };

  const profileInitial =
    (syncedProfile.fullName || syncedProfile.name || "T")
      .trim()
      .charAt(0)
      .toUpperCase() || "T";

  const handleLogout = () => {
    dispatch(logoutSuccess());
    toast.success("Thank you!");
    navigate("/login");
  };

  const sideMenus = [
    { label: "Dashboard", path: "/dashboard", icon: <Home size={20} /> },
    {
      label: "Browse Houses",
      path: "/dashboard/browse",
      icon: <Search size={20} />,
    },
    {
      label: "My Bookings",
      path: "/dashboard/orders",
      icon: <Bell size={20} />,
    },
    {
      label: "Saved Houses",
      path: "/dashboard/saved",
      icon: <Heart size={20} />,
    },
    {
      label: "Notifications",
      path: "/dashboard/notifications",
      icon: <Bell size={20} />,
    },
    {
      label: "Payment History",
      path: "/dashboard/payments",
      icon: <Wallet size={20} />,
    },
    {
      label: "Profile",
      path: "/dashboard/profile",
      icon: <User size={20} />,
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 w-64 z-50 transform transition-transform duration-300 md:translate-x-0 
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        flex flex-col justify-between pb-10 shadow-lg`}
      >
        <div>
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div className="flex-1">
              <Logo
                variant="default"
                size="sm"
                showSubtitle={true}
                linkTo="/home"
              />
            </div>

            {/* Close button for mobile */}
            <button
              className="md:hidden p-1 rounded-md bg-gray-100 hover:bg-gray-200 ml-2 shrink-0"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* User Profile Card */}
          <div className="mx-4 mt-4 rounded-lg border border-indigo-200 bg-indigo-50 p-3">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm overflow-hidden">
                {syncedProfile.avatar ? (
                  <img
                    src={syncedProfile.avatar}
                    alt={syncedProfile.fullName || syncedProfile.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  profileInitial
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {syncedProfile.name || syncedProfile.fullName || "Tenant"}
                </p>
                <p className="text-[11px] text-gray-600 truncate">
                  {syncedProfile.email || "tenant@example.com"}
                </p>
              </div>
            </div>
            <div className="mt-3 inline-flex rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-indigo-700 border border-indigo-300">
              👤 Tenant
            </div>
          </div>

          {/* Navigation Menu */}
          <ul className="p-4 space-y-2 mt-6">
            {sideMenus.map((menu, index) => (
              <li key={index}>
                <NavLink
                  to={menu.path}
                  end={menu.path === "/dashboard"}
                  onClick={() =>
                    window.innerWidth < 768 && setIsSidebarOpen(false)
                  }
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                      isActive
                        ? "bg-indigo-100 text-indigo-700 border-l-4 border-indigo-600"
                        : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
                    }`
                  }
                >
                  {menu.icon}
                  <span>{menu.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Logout Button */}
        <div className="px-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer border border-red-200"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default TenantSidebar;
