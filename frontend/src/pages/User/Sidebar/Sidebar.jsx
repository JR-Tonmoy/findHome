import {
  ClipboardList,
  FileText,
  Heart,
  Home,
  LogOut,
  Search,
  User,
  X,
} from "lucide-react"; // Import icons
import { Link, NavLink } from "react-router-dom";

const Sidebar = ({ isOpen, setIsSidebarOpen }) => {
  // Store navigation items in an array for clean and simple code
  const sideMenus = [
    { label: "Dashboard", path: "/dashboard", icon: <Home size={20} /> },
    {
      label: "Browse Houses",
      path: "/dashboard/browse",
      icon: <Search size={20} />,
    },
    {
      label: "Orders",
      path: "/dashboard/orders",
      icon: <ClipboardList size={20} />,
    },
    {
      label: "My Requests",
      path: "/dashboard/requests",
      icon: <FileText size={20} />,
    },
    {
      label: "Saved Houses",
      path: "/dashboard/saved",
      icon: <Heart size={20} />,
    },
    { label: "Profile", path: "/dashboard/profile", icon: <User size={20} /> },
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
            <Link
              to="/home"
              className="text-blue-600 text-xl font-bold flex items-center gap-2 hover:opacity-90"
            >
              <Home size={24} className="bg-blue-600 text-white rounded p-1" />
              BashaLagbe
            </Link>

            {/* Close (X) button for mobile screen */}
            <button
              className="md:hidden p-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={20} />
            </button>
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
                        ? "bg-blue-50 text-blue-600" // Light blue background and blue text for active active link
                        : "text-gray-500 hover:bg-gray-50 hover:text-blue-600" // Normal state colors
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
          <button className="flex w-full items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-500 hover:bg-red-50 transition-colors">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
