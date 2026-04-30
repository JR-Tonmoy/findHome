import { Heart, Home, LogOut, PlusCircle, Search, User, X } from "lucide-react"; // Import icons
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { logoutSuccess } from "../../../features/auth/authSlice";
import useAuth from "../../../hooks/useAuth";
import { getCurrentMemberProfile } from "../../../utils/memberStorage";

const Sidebar = ({ isOpen, setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();

  const userRole = (
    user?.role ||
    localStorage.getItem("userRole") ||
    ""
  ).toLowerCase();
  const isOwner = userRole === "owner" || userRole === "property owner";
  const memberProfile = getCurrentMemberProfile();
  const roleLabel = isOwner ? "Owner" : "Tenant";
  const profileInitial =
    (memberProfile.fullName || user?.fullName || user?.name || "U")
      .trim()
      .charAt(0)
      .toUpperCase() || "U";

  const handleLogout = () => {
    dispatch(logoutSuccess());
    toast.success("Thank you!");
    navigate("/login");
  };

  // Store navigation items in an array for clean and simple code
  const sideMenus = isOwner
    ? [
        {
          label: "Dashboard",
          path: "/owner-dashboard",
          icon: <Home size={20} />,
        },
        {
          label: "Add Property",
          path: "/owner-dashboard/add-property",
          icon: <PlusCircle size={20} />,
        },
        {
          label: "Profile",
          path: "/owner-dashboard/profile",
          icon: <User size={20} />,
        },
      ]
    : [
        { label: "Dashboard", path: "/dashboard", icon: <Home size={20} /> },
        {
          label: "Browse Houses",
          path: "/dashboard/browse",
          icon: <Search size={20} />,
        },
        {
          label: "Saved Houses",
          path: "/dashboard/saved",
          icon: <Heart size={20} />,
        },
        {
          label: "Profile",
          path: "/dashboard/profile",
          icon: <User size={20} />,
        },
      ];

  return (
    <>
      {/* 
        Dark overlay background for mobile screen when sidebar is open.
        Clicking on it will close the sidebar.
      */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)} // Close menu on click
        ></div>
      )}

      {/* 
        Sidebar Container
        - fixed left-0 top-0: positioned to the left of the screen.
        - transition-transform duration-300: smooth slide in/out animation.
        - isOpen true/false handles translating the sidebar in and out.
      */}
      <div
        className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-100 w-64 z-50 transform transition-transform duration-300 md:translate-x-0 
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        flex flex-col justify-between pb-10`} // pb-10 adds bottom padding, flex-col pushes logout to the bottom
      >
        <div>
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
            {/* Make BashaLagbe click-able to navigate to Home Page */}
            <Link to="/home" className="flex flex-col">
              <div className="flex items-center gap-2 text-black text-xl font-bold hover:opacity-90">
                <div className="bg-black p-1 rounded-lg flex items-center justify-center w-8 h-8">
                  <Home size={20} className="text-orange-400" />
                </div>
                BashaLagbe
              </div>
              <span className="text-gray-600 text-[10px] font-medium mt-0.5">
                Find your perfect flat easily
              </span>
            </Link>

            {/* Close (X) button for mobile screen */}
            <button
              className="md:hidden p-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          <div className="mx-4 mt-4 rounded-xl border border-gray-100 bg-gray-50 p-3">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm overflow-hidden">
                {memberProfile.avatar ? (
                  <img
                    src={memberProfile.avatar}
                    alt={memberProfile.fullName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  profileInitial
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-black truncate">
                  {memberProfile.fullName}
                </p>
                <p className="text-[11px] text-gray-500 truncate">
                  {memberProfile.email}
                </p>
              </div>
            </div>
            <div className="mt-3 inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-black">
              {roleLabel}
            </div>
          </div>

          <ul className="p-4 space-y-2 mt-4">
            {/* 
              Mapping through sideMenus array to render links
            */}
            {sideMenus.map((menu, index) => (
              <li key={index}>
                <NavLink
                  to={menu.path}
                  end={menu.path === "/dashboard"} // Match exact path for dashboard root route
                  onClick={() =>
                    window.innerWidth < 768 && setIsSidebarOpen(false)
                  } // Ensure sidebar closes only on mobile click
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                      isActive
                        ? "bg-blue-50 text-black" // Light blue background and black text for active link
                        : "text-black hover:bg-gray-50 hover:text-black" // Normal state colors
                    }`
                  }
                >
                  {menu.icon}
                  {menu.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Logout Button Section (Always stays at the bottom) */}
        <div className="px-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
