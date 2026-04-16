import { XCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Orders = () => {
  return (
    <div className="p-6">
      {/* Header section with Breadcrumb and Action Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <p className="text-gray-500 text-sm mb-1">
            Orders <span className="mx-1">&gt;</span> List
          </p>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        </div>
        <div className="mt-4 md:mt-0">
          <Link to="/dashboard/browse">
            <button className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition">
              Create Order
            </button>
          </Link>
        </div>
      </div>

      {/* Main Content Card (White Theme) */}
      <div className="bg-white border border-gray-100 shadow-sm rounded-xl py-16 px-4 md:px-10 flex flex-col items-center justify-center text-center">
        {/* Icon */}
        <div className="bg-gray-100 p-4 rounded-full mb-6">
          <XCircle size={40} className="text-gray-400" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          You Don't Place Any Order Yet
        </h2>

        {/* Description Text */}
        <p className="text-gray-500 max-w-2xl leading-relaxed text-sm md:text-base">
          Your order history will appear here. Place a new order by clicking
          "Create Order" and our team will start searching for a house based on
          your requirements. Refunds are guaranteed if we can't meet your
          request within the specified time.
        </p>
      </div>
    </div>
  );
};

export default Orders;
