import { Outlet } from "react-router-dom";
// import Sidebar from "../components/sidebar/Sidebar";
import Sidebar from "../pages/User/Sidebar/Sidebar";
const DashboardLayout = () => {
  return (
    <div className="flex bg-gray-100 min-h-screen">

      <Sidebar />

      {/* Right Content */}
      <div className="flex-1 ml-64 p-6">
        <Outlet />
      </div>

    </div>
  );
};

export default DashboardLayout;