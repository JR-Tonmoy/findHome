import { Building, LayoutDashboard, LogOut, Users, X } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

const Sidebar = ({ isOpen, setIsSidebarOpen }) => {
  // Store navigation items in an array for clean and simple code
  const sideMenus = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      label: "Manage Tenants",
      path: "/admin/tenants",
      icon: <Users size={20} />,
    },
    {
      label: "Manage Owners",
      path: "/admin/owners",
      icon: <Building size={20} />,
    },
  ];

  return (
    <>
      {/* 
        Dark overlay background for mobile screen
      */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar Container */}
      <div
        className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-100 w-64 z-50 transform transition-transform duration-300 md:translate-x-0 
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        flex flex-col justify-between pb-10`}
      >
        <div>
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
            <Link to="/" className="flex items-center gap-2 hover:opacity-90">
              <div className="bg-blue-600 text-white rounded p-1">
                <LayoutDashboard size={24} />
              </div>
              <div>
                <h1 className="text-blue-600 text-xl font-bold leading-none">
                  BashaLagbe
                </h1>
                <span className="text-gray-400 text-xs">Admin Panel</span>
              </div>
            </Link>

            {/* Close button for mobile screen */}
            <button
              className="md:hidden p-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          <ul className="p-4 space-y-2 mt-4">
            {sideMenus.map((menu, index) => (
              <li key={index}>
                <NavLink
                  to={menu.path}
                  end={menu.path === "/admin/dashboard"}
                  onClick={() =>
                    window.innerWidth < 768 && setIsSidebarOpen(false)
                  }
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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

        {/* Logout Button Section */}
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
